"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  type GradedBands,
  type GradedFeedback,
  type GradingMode,
  type GradingResult,
  gradeWriting,
  isBandResult,
  type SuggestedCard,
  type TaskType,
} from "@/lib/ielts/grading";
import { topErrorThemes } from "@/lib/ielts/insights";
import { learnerProfile, targetSummary } from "@/lib/ielts/profile";
import { promptById } from "@/lib/ielts/prompts";
import { toISODate } from "@/lib/ielts/srs";
import { loadProgress } from "./progress";

export interface GradeActionInput {
  taskType: TaskType;
  promptId?: string;
  prompt?: string;
  essay: string;
  /** Minutes the slot budgets for writing, for the grader's context. */
  writeMinutes?: number;
}

/**
 * Grade without persisting. The mode comes from the current phase, not from
 * the caller: the early phases exist to build a habit, and a band on a warm-up
 * paragraph measures the wrong thing.
 */
export async function gradeAction(
  input: GradeActionInput,
): Promise<GradingResult> {
  await requireIeltsUser();
  const [progress, profile, ruleHistory] = await Promise.all([
    loadProgress(),
    learnerProfile(),
    ruleCounts(),
  ]);

  const mode: GradingMode = progress.phase.gradingMode;
  const prompt = input.promptId
    ? (promptById(input.promptId)?.text ?? input.prompt)
    : input.prompt;

  return gradeWriting({
    mode,
    taskType: input.taskType,
    prompt,
    essay: input.essay,
    targetBand: profile.targetBands.writing,
    taskContext: taskContext(input, progress.phase.label),
    learnerContext: await buildLearnerContext(),
    ruleHistory,
  });
}

function taskContext(input: GradeActionInput, phaseLabel: string): string {
  const budget = input.writeMinutes
    ? `${input.writeMinutes} phút viết`
    : "không giới hạn giờ";
  return `${phaseLabel}; ${budget}. Judge it as this exercise, not as a full-length exam answer unless the budget says so.`;
}

/** How often each rule has already produced a card — feeds card ranking. */
async function ruleCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ rule: schema.errorCard.rule })
    .from(schema.errorCard);
  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (row.rule) counts[row.rule] = (counts[row.rule] ?? 0) + 1;
  }
  return counts;
}

/* ────────────────────────────── rewrite source ────────────────────────────── */

export interface RewriteSource {
  id: number;
  taskType: TaskType;
  topic: string | null;
  prompt: string | null;
  essayText: string;
  createdAt: string;
  wordCount: number | null;
  errorDensity: number | null;
  gradingMode: GradingMode | null;
  bands: GradedBands | null;
  feedback: GradedFeedback | null;
  /** Rules broken in the original, so the rewrite can be diffed against them. */
  rules: string[];
}

async function toRewriteSource(
  row: typeof schema.writingSubmission.$inferSelect,
): Promise<RewriteSource> {
  const bands =
    row.bandOverall == null
      ? null
      : {
          task_response: row.bandTa ?? 0,
          coherence: row.bandCc ?? 0,
          lexical: row.bandLr ?? 0,
          grammar: row.bandGra ?? 0,
          overall: row.bandOverall,
        };
  let feedback: GradedFeedback | null = null;
  if (row.feedbackJson) {
    try {
      feedback = JSON.parse(row.feedbackJson) as GradedFeedback;
    } catch {
      feedback = null;
    }
  }
  const cards = await db
    .select({ rule: schema.errorCard.rule })
    .from(schema.errorCard)
    .where(eq(schema.errorCard.sourceRef, `writing_submission:${row.id}`));

  return {
    id: row.id,
    taskType: row.taskType,
    topic: row.topic,
    prompt: row.prompt,
    essayText: row.essayText,
    createdAt: row.createdAt,
    wordCount: row.wordCount,
    errorDensity: row.errorDensity,
    gradingMode: row.gradingMode,
    bands,
    feedback,
    rules: cards.map((c) => c.rule).filter((r): r is string => Boolean(r)),
  };
}

/** The newest graded original that hasn't been rewritten yet. */
export async function latestRewritableSubmission(): Promise<RewriteSource | null> {
  const rows = await db
    .select()
    .from(schema.writingSubmission)
    .orderBy(desc(schema.writingSubmission.id));
  const rewrittenParents = new Set(
    rows
      .map((row) => row.parentSubmissionId)
      .filter((id): id is number => id != null),
  );
  const original = rows.find(
    (row) => !row.isRewrite && !rewrittenParents.has(row.id),
  );
  return original ? toRewriteSource(original) : null;
}

/** Prompt ids already answered, newest last — feeds `pickPrompt`. */
export async function usedPromptIds(): Promise<string[]> {
  const rows = await db
    .select({ promptId: schema.writingSubmission.promptId })
    .from(schema.writingSubmission)
    .orderBy(schema.writingSubmission.id);
  return rows.map((r) => r.promptId).filter((id): id is string => Boolean(id));
}

export async function getRewriteSource(
  submissionId: number,
): Promise<RewriteSource | null> {
  const [row] = await db
    .select()
    .from(schema.writingSubmission)
    .where(eq(schema.writingSubmission.id, submissionId));
  return row ? toRewriteSource(row) : null;
}

/* ──────────────────────────────── saving ──────────────────────────────── */

export interface SaveSubmissionInput {
  parentSubmissionId?: number;
  taskType: TaskType;
  promptId?: string;
  topic?: string;
  prompt?: string;
  essay: string;
  result: GradingResult;
  selectedCards: SuggestedCard[];
  repairNote: string;
}

export interface SaveSubmissionResult {
  submissionId: number;
  cardsAdded: number;
  /** Rules that were in the original and are gone from the rewrite. */
  rulesFixed: string[];
  /** Rules still present in the rewrite. */
  rulesRemaining: string[];
}

export async function saveSubmission(
  input: SaveSubmissionInput,
): Promise<SaveSubmissionResult> {
  await requireIeltsUser();
  const today = toISODate();
  const isRewrite = input.parentSubmissionId != null;

  const repairNote = input.repairNote.trim();
  if (!isRewrite && repairNote.length < 20) {
    throw new Error(
      "Hãy hoàn thành phần sửa ngay: viết lại một câu hoặc nêu điều bạn sẽ sửa (ít nhất 20 ký tự).",
    );
  }

  const wordTarget = input.promptId
    ? (promptById(input.promptId)?.words ?? 0)
    : 0;
  if (
    wordTarget > 0 &&
    input.result.word_count < Math.round(wordTarget * 0.8)
  ) {
    throw new Error(
      `Bài này cần khoảng ${wordTarget} từ; hiện mới ${input.result.word_count} từ.`,
    );
  }

  const bands = isBandResult(input.result) ? input.result.bands : null;
  const parentRules = input.parentSubmissionId
    ? ((await getRewriteSource(input.parentSubmissionId))?.rules ?? [])
    : [];

  const { submissionId, cardsAdded } = await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(schema.studySession)
      .values({
        date: today,
        skill: "writing",
        slot: isRewrite ? "rewrite" : "writing",
        bandEstimate: bands?.overall ?? null,
        durationMin: null,
        notes: [
          input.topic ? `Chủ đề: ${input.topic}` : null,
          `${input.result.error_count} lỗi / ${input.result.word_count} từ (${input.result.density}/100)`,
          repairNote ? `Repair: ${repairNote}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        status: "done",
      })
      .returning({ id: schema.studySession.id });

    const [submission] = await tx
      .insert(schema.writingSubmission)
      .values({
        sessionId: session.id,
        taskType: input.taskType,
        topic: input.topic ?? null,
        promptId: input.promptId ?? null,
        prompt: input.prompt ?? null,
        essayText: input.essay,
        wordCount: input.result.word_count,
        bandTa: bands?.task_response ?? null,
        bandCc: bands?.coherence ?? null,
        bandLr: bands?.lexical ?? null,
        bandGra: bands?.grammar ?? null,
        bandOverall: bands?.overall ?? null,
        feedbackJson: isBandResult(input.result)
          ? JSON.stringify(input.result.feedback)
          : JSON.stringify({
              strength: input.result.strength,
              next_fix: input.result.next_fix,
            }),
        errorDensity: input.result.density,
        gradingMode: input.result.mode,
        graderSpread: isBandResult(input.result) ? input.result.spread : null,
        isRewrite,
        parentSubmissionId: input.parentSubmissionId ?? null,
      })
      .returning({ id: schema.writingSubmission.id });

    if (input.selectedCards.length > 0) {
      await tx.insert(schema.errorCard).values(
        input.selectedCards.map((card) => ({
          sourceType: "writing" as const,
          sourceRef: `writing_submission:${submission.id}`,
          errorType: card.error_type,
          rule: card.rule,
          front: card.front,
          back: card.back,
          explanation: card.explanation,
          context: input.topic ?? input.taskType,
          dueDate: today,
        })),
      );
    }

    return {
      submissionId: submission.id,
      cardsAdded: input.selectedCards.length,
    };
  });

  const nowRules = new Set(input.result.cards.map((c) => c.rule));
  const rulesFixed = parentRules.filter((rule) => !nowRules.has(rule));
  const rulesRemaining = parentRules.filter((rule) => nowRules.has(rule));

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/errors");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts/progress");

  return {
    submissionId,
    cardsAdded,
    rulesFixed: [...new Set(rulesFixed)],
    rulesRemaining: [...new Set(rulesRemaining)],
  };
}

async function buildLearnerContext(): Promise<string> {
  const profile = await learnerProfile();
  const cards = await db.select().from(schema.errorCard);
  const themes = topErrorThemes(cards, 5);

  return [
    `Name: ${profile.name}. Goal: ${profile.examGoal} (${await targetSummary(profile)}).`,
    `Starting point: ${profile.startPoint}`,
    `Writing target band: ${profile.targetBands.writing.toFixed(1)}.`,
    `Recurring error themes: ${themes.length ? themes.join(", ") : "chưa đủ dữ liệu"}.`,
  ].join("\n");
}
