"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { overallOf } from "@/lib/ielts/bands";
import { db, schema } from "@/lib/ielts/db";
import {
  EVALUATION_METADATA_VERSION,
  type EvaluationMetadata,
} from "@/lib/ielts/evaluation";
import type { ErrorType, ReceptiveSkill, Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";
import { type ParsedRawScore, parseRawScore } from "@/lib/ielts/track";
import {
  parseScreenshot,
  type ScreenshotResult,
  type VisionCaptureMeta,
} from "@/lib/ielts/vision";

/** Parse a Reading/Listening result screenshot (data URL) via the vision model. */
export async function parseScreenshotAction(
  dataUrl: string,
): Promise<ScreenshotResult> {
  await requireIeltsUser();
  return parseScreenshot(dataUrl);
}

export type TrackKind = "practice" | "timed" | "mock" | "baseline";

export interface ReceptiveCaptureInput {
  skill: ReceptiveSkill;
  sourceTitle?: string;
  sourceUrl?: string;
  rawScore?: string;
  correctAnswers?: number;
  totalQuestions?: number;
  /** Short aliases make server actions easy to call from imports/API clients. */
  correct?: number;
  total?: number;
  difficulty?: string;
  /** Vision provenance, if this score came from the screenshot helper. */
  captureMeta?: VisionCaptureMeta;
}

export interface SaveTrackInput {
  /** What this session was for; decides the slot and whether bands are required. */
  kind: TrackKind;
  /** Legacy single-skill selector; mock/baseline can now provide both results. */
  skill: Skill;
  sourceTitle?: string;
  sourceUrl?: string;
  rawScore?: string;
  correctAnswers?: number;
  totalQuestions?: number;
  correct?: number;
  total?: number;
  difficulty?: string;
  captureMeta?: VisionCaptureMeta;
  /** Mock and baseline record both skills at once, on one study_session. */
  receptiveResults?: ReceptiveCaptureInput[];
  bandEstimate?: number;
  durationMin?: number;
  notes?: string;
  /** Mock and baseline record both skills at once. */
  bandListening?: number;
  bandReading?: number;
  cards: {
    error_type: ErrorType;
    rule?: string;
    front: string;
    back: string;
    explanation: string;
  }[];
}

const SLOT_FOR: Record<TrackKind, string> = {
  practice: "input",
  timed: "timed",
  mock: "mock",
  baseline: "mock",
};

function validateCount(value: number, label: string): void {
  if (!Number.isInteger(value) || !Number.isFinite(value) || value < 0) {
    throw new Error(`${label} phải là số nguyên không âm.`);
  }
}

function normalizeReceptiveResult(
  input: ReceptiveCaptureInput,
): ReceptiveCaptureInput & ParsedRawScore & { raw: string; accuracy: number } {
  const directCorrect = input.correctAnswers ?? input.correct;
  const directTotal = input.totalQuestions ?? input.total;
  const parsed = parseRawScore(input.rawScore);
  const correct = directCorrect ?? parsed?.correct;
  const total = directTotal ?? parsed?.total;

  if (correct == null && total == null) {
    throw new Error(
      `${input.skill} cần nhập số đúng/tổng số hoặc điểm dạng x/y.`,
    );
  }
  if (correct == null || total == null) {
    throw new Error(`${input.skill} cần đủ cả số đúng và tổng số câu.`);
  }
  validateCount(correct, "Số câu đúng");
  if (!Number.isInteger(total) || !Number.isFinite(total) || total <= 0) {
    throw new Error("Tổng số câu phải là số nguyên lớn hơn 0.");
  }
  if (correct > total) {
    throw new Error("Số câu đúng không thể lớn hơn tổng số câu.");
  }

  const raw = input.rawScore?.trim() || `${correct}/${total}`;
  return {
    ...input,
    correct,
    total,
    correctAnswers: correct,
    totalQuestions: total,
    raw,
    accuracy: correct / total,
  };
}

function sourceEvaluationMeta(
  result: ReceptiveCaptureInput & { raw: string },
): EvaluationMetadata {
  const capture = result.captureMeta;
  return {
    version: EVALUATION_METADATA_VERSION,
    method: "source",
    source: result.sourceUrl?.trim() || result.sourceTitle?.trim() || null,
    stages: [
      capture
        ? {
            purpose: "vision_capture",
            model: capture.model,
            prompt_version: capture.prompt_version,
            evaluated_at: new Date().toISOString(),
          }
        : {
            purpose: "score_capture",
            evaluated_at: new Date().toISOString(),
          },
    ],
  };
}

function legacyReceptiveInput(input: SaveTrackInput): ReceptiveCaptureInput[] {
  if (input.skill !== "reading" && input.skill !== "listening") return [];
  return [
    {
      skill: input.skill,
      sourceTitle: input.sourceTitle,
      sourceUrl: input.sourceUrl,
      rawScore: input.rawScore,
      correctAnswers: input.correctAnswers,
      totalQuestions: input.totalQuestions,
      correct: input.correct,
      total: input.total,
      difficulty: input.difficulty,
      captureMeta: input.captureMeta,
    },
  ];
}

/** Persist one Reading/Listening session plus structured receptive results. */
export async function saveTrackSession(input: SaveTrackInput): Promise<{
  sessionId: number;
  cardsAdded: number;
}> {
  await requireIeltsUser();
  const rawScore = input.rawScore?.trim();
  const notes = input.notes?.trim();
  const hasStructuredScore =
    input.correctAnswers != null ||
    input.totalQuestions != null ||
    input.correct != null ||
    input.total != null;
  if (
    !rawScore &&
    !hasStructuredScore &&
    (!notes || notes.length < 20) &&
    !input.receptiveResults?.length
  ) {
    throw new Error(
      "Hãy nhập điểm/kết quả hoặc ghi ít nhất một lỗi, bẫy bạn đã gặp (20 ký tự).",
    );
  }
  if (
    input.durationMin != null &&
    (!Number.isFinite(input.durationMin) || input.durationMin <= 0)
  ) {
    throw new Error("Thời lượng phải lớn hơn 0 phút.");
  }
  for (const band of [
    input.bandEstimate,
    input.bandListening,
    input.bandReading,
  ]) {
    if (band != null && (!Number.isFinite(band) || band < 0 || band > 9)) {
      throw new Error("Band phải nằm trong khoảng 0–9.");
    }
  }

  const needsBothBands = input.kind === "mock" || input.kind === "baseline";
  if (
    needsBothBands &&
    (input.bandListening == null || input.bandReading == null)
  ) {
    throw new Error(
      input.kind === "mock"
        ? "Mock cần cả band Listening và band Reading."
        : "Baseline cần cả band Listening và band Reading.",
    );
  }

  const rawResults = input.receptiveResults?.length
    ? input.receptiveResults
    : legacyReceptiveInput(input);
  const seenSkills = new Set<ReceptiveSkill>();
  const receptive = rawResults.map((result) => {
    if (seenSkills.has(result.skill)) {
      throw new Error(`Chỉ ghi một kết quả ${result.skill} cho mỗi buổi.`);
    }
    seenSkills.add(result.skill);
    return normalizeReceptiveResult(result);
  });
  if (needsBothBands) {
    if (!seenSkills.has("reading") || !seenSkills.has("listening")) {
      throw new Error("Mock/Baseline cần cả kết quả Reading và Listening.");
    }
  }

  const today = toISODate();
  const durationMin =
    input.durationMin == null
      ? null
      : Math.max(1, Math.round(input.durationMin));
  const cards = input.cards.filter((c) => c.front?.trim() && c.back?.trim());
  const sessionRawScore =
    receptive.length === 1
      ? receptive[0].raw
      : receptive.length > 1
        ? receptive.map((r) => `${r.skill} ${r.raw}`).join("; ")
        : rawScore || null;

  const { sessionId } = await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(schema.studySession)
      .values({
        date: today,
        skill: input.skill,
        slot:
          input.kind === "timed"
            ? input.skill === "listening"
              ? "timed-listening"
              : "timed-reading"
            : SLOT_FOR[input.kind],
        sourceUrl: input.sourceUrl ?? null,
        rawScore: sessionRawScore,
        bandEstimate:
          input.bandEstimate ??
          (needsBothBands
            ? overallOf({
                listening: input.bandListening,
                reading: input.bandReading,
              })
            : null),
        durationMin,
        notes: notes || null,
        status: "done",
      })
      .returning({ id: schema.studySession.id });

    for (const result of receptive) {
      await tx.insert(schema.receptiveResult).values({
        sessionId: session.id,
        skill: result.skill,
        rawScore: result.raw,
        correctAnswers: result.correct,
        totalQuestions: result.total,
        accuracy: result.accuracy,
        difficulty: result.difficulty?.trim() || null,
        sourceTitle: result.sourceTitle?.trim() || null,
        sourceUrl: result.sourceUrl?.trim() || null,
        feedbackJson: notes ? JSON.stringify({ notes }) : null,
        evaluationMetaJson: sourceEvaluationMeta(result),
      });
    }

    if (cards.length > 0) {
      await tx.insert(schema.errorCard).values(
        cards.map((c) => ({
          sourceType: input.skill,
          sourceRef: `study_session:${session.id}`,
          errorType: c.error_type,
          rule: c.rule ?? null,
          front: c.front.trim(),
          back: c.back.trim(),
          explanation: c.explanation,
          context: input.skill,
          dueDate: today,
          observedOn: today,
        })),
      );
    }

    if (needsBothBands) {
      await tx.insert(schema.bandHistory).values({
        date: today,
        listening: input.bandListening ?? null,
        reading: input.bandReading ?? null,
        overall: overallOf({
          listening: input.bandListening,
          reading: input.bandReading,
        }),
        isMock: input.kind === "mock",
        note: input.kind === "mock" ? "Mock Listening + Reading" : "Baseline",
      });
    }

    return { sessionId: session.id };
  });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts/errors");
  return {
    sessionId,
    cardsAdded: cards.length,
  };
}
