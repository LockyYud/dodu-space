"use server";

import { randomInt } from "node:crypto";
import { and, desc, eq, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import {
  CYCLE_LENGTH,
  FRESH_PER_CYCLE,
  planFreeSpin,
  planSpin,
  type SpinHalf,
  type SpinRow,
} from "@/lib/ielts/daily";
import {
  coachDaily,
  compareRules,
  type DailyCoachResult,
  type RewriteComparison,
} from "@/lib/ielts/daily-coach";
import {
  type Cluster,
  type ClusterId,
  clusterById,
  type DailyPrompt,
  dailyPromptById,
  isClusterId,
} from "@/lib/ielts/daily-prompts";
import { db, schema } from "@/lib/ielts/db";
import type { SuggestedCard } from "@/lib/ielts/grading";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { computeStreak } from "@/lib/ielts/plan";
import { type ActionResult, fail, ok } from "@/lib/ielts/result";
import { toISODate } from "@/lib/ielts/srs";

const HEATMAP_DAYS = 30;

/* ──────────────────────────────── đọc ──────────────────────────────── */

export interface TodaySpin {
  date: string;
  prompt: DailyPrompt;
  cluster: Cluster;
  half: SpinHalf;
  status: "spun" | "written" | "skipped";
  submissionId: number | null;
  /**
   * Nửa viết lại có bài lần một hay không — nhưng **không kèm nội dung**.
   * Xem docs/ielts/DAILY-WRITING.md §4.3: cho xem bản cũ trước khi viết thì
   * thành chép lại và không đo được gì. Nội dung chỉ về sau khi đã lưu.
   */
  hasPrevious: boolean;
}

export interface DailyView {
  today: string;
  configured: boolean;
  streak: number;
  heat: { date: string; done: boolean }[];
  cycle: {
    id: number;
    clusters: Cluster[];
    written: number;
    half: SpinHalf;
    length: number;
    freshPerCycle: number;
  };
  spin: TodaySpin | null;
  /** Đã tiêu lượt hôm nay chưa — quay hay bỏ qua đều là tiêu. */
  spent: boolean;
}

export async function loadDaily(): Promise<DailyView> {
  await requireIeltsUser();
  const today = toISODate();
  const rows = await allSpins();
  const state = cycleView(rows);
  const todayRow = rows.find((r) => r.date === today) ?? null;

  const writtenDates = rows
    .filter((r) => r.status === "written")
    .map((r) => r.date);

  return {
    today,
    configured: isLLMConfigured(),
    streak: computeStreak(writtenDates),
    heat: heatmap(new Set(writtenDates), today),
    cycle: state,
    spin: todayRow ? toTodaySpin(todayRow) : null,
    spent: todayRow != null,
  };
}

async function allSpins(): Promise<SpinRow[]> {
  const rows = await db
    .select()
    .from(schema.dailySpin)
    .orderBy(schema.dailySpin.date);
  return rows.map(toSpinRow);
}

function toSpinRow(row: schema.DailySpinRow): SpinRow {
  return {
    date: row.date,
    cycleId: row.cycleId,
    cycleClusters: row.cycleClusters.split(",").filter(isClusterId),
    cycleIndex: row.cycleIndex,
    half: row.half,
    clusterId: (isClusterId(row.clusterId)
      ? row.clusterId
      : "morning") as ClusterId,
    promptId: row.promptId,
    status: row.status,
    submissionId: row.submissionId,
  };
}

function toTodaySpin(row: SpinRow): TodaySpin | null {
  const prompt = dailyPromptById(row.promptId);
  const cluster = clusterById(row.clusterId);
  if (!prompt || !cluster) return null;
  return {
    date: row.date,
    prompt,
    cluster,
    half: row.half,
    status: row.status,
    submissionId: row.submissionId,
    hasPrevious: row.half === "rewrite",
  };
}

function cycleView(rows: SpinRow[]): DailyView["cycle"] {
  const cycleId =
    rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.cycleId));
  const inCycle = rows.filter((r) => r.cycleId === cycleId);
  const written = inCycle.filter((r) => r.status === "written").length;
  const rolled = written >= CYCLE_LENGTH;

  return {
    id: rolled ? cycleId + 1 : cycleId,
    clusters: rolled
      ? []
      : (inCycle[0]?.cycleClusters ?? [])
          .map(clusterById)
          .filter((c): c is Cluster => Boolean(c)),
    written: rolled ? 0 : written,
    half: !rolled && written >= FRESH_PER_CYCLE ? "rewrite" : "fresh",
    length: CYCLE_LENGTH,
    freshPerCycle: FRESH_PER_CYCLE,
  };
}

function heatmap(done: Set<string>, today: string): DailyView["heat"] {
  const out: DailyView["heat"] = [];
  const cursor = new Date(`${today}T00:00:00`);
  cursor.setDate(cursor.getDate() - (HEATMAP_DAYS - 1));
  for (let i = 0; i < HEATMAP_DAYS; i++) {
    const date = toISODate(cursor);
    out.push({ date, done: done.has(date) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

/* ──────────────────────────────── quay ──────────────────────────────── */

/**
 * Quay lượt của hôm nay. Ngẫu nhiên **thật** — kết quả sinh ra ở đây rồi ghi
 * ngay, chứ không tính sẵn theo ngày. Tải lại trang không quay lại được vì
 * lượt đã tiêu, và `daily_spin.date` là UNIQUE nên hai lời gọi song song cũng
 * chỉ một cái thắng.
 */
export async function spinToday(): Promise<ActionResult<TodaySpin>> {
  await requireIeltsUser();
  const today = toISODate();

  const rows = await allSpins();
  if (rows.some((r) => r.date === today)) {
    return fail("Hôm nay đã quay rồi. Mai quay tiếp.");
  }

  // Lượt của hôm trước mà quay xong không viết thì coi như bỏ qua, và đề đó
  // quay lại pool. Dọn ở đây thay vì bằng cron: chỉ lúc quay mới cần đúng.
  await db
    .update(schema.dailySpin)
    .set({ status: "skipped" })
    .where(
      and(
        eq(schema.dailySpin.status, "spun"),
        lt(schema.dailySpin.date, today),
      ),
    );

  const outcome = planSpin(
    rows.map((r) => (r.status === "spun" ? { ...r, status: "skipped" } : r)),
    randomInt,
  );

  try {
    await db.insert(schema.dailySpin).values({
      date: today,
      cycleId: outcome.cycleId,
      cycleClusters: outcome.cycleClusters.join(","),
      cycleIndex: outcome.cycleIndex,
      half: outcome.half,
      clusterId: outcome.clusterId,
      promptId: outcome.promptId,
      rewriteOfSubmissionId: outcome.rewriteOfSubmissionId,
      status: "spun",
    });
  } catch {
    return fail("Hôm nay đã quay rồi. Mai quay tiếp.");
  }

  revalidatePath("/ielts/daily");
  const spin = toTodaySpin({
    ...outcome,
    date: today,
    clusterId: outcome.clusterId,
    status: "spun",
    submissionId: null,
  });
  return spin ? ok(spin) : fail("Không dựng được đề từ lượt quay vừa rồi.");
}

/**
 * Bỏ qua đề của hôm nay. Mất luôn ngày, **không có đề thay thế** — nếu có thì
 * nó chính là lượt quay thứ hai trá hình. Đề bị bỏ qua quay lại pool.
 */
export async function skipToday(): Promise<ActionResult<null>> {
  await requireIeltsUser();
  const today = toISODate();
  const [row] = await db
    .select()
    .from(schema.dailySpin)
    .where(eq(schema.dailySpin.date, today));

  if (!row) return fail("Hôm nay chưa quay nên chưa có gì để bỏ qua.");
  if (row.status === "written") return fail("Bài hôm nay đã lưu rồi.");

  await db
    .update(schema.dailySpin)
    .set({ status: "skipped" })
    .where(eq(schema.dailySpin.id, row.id));
  revalidatePath("/ielts/daily");
  return ok(null);
}

/** Quay tự do sau khi đã nộp bài chính thức: không giới hạn, không tính chuỗi. */
export async function freeSpin(): Promise<
  ActionResult<{ prompt: DailyPrompt; cluster: Cluster }>
> {
  await requireIeltsUser();
  const today = toISODate();
  const rows = await allSpins();
  const todayRow = rows.find((r) => r.date === today);

  if (!todayRow || todayRow.status !== "written") {
    return fail("Quay tự do mở sau khi đã lưu bài chính thức của hôm nay.");
  }

  const promptId = planFreeSpin([todayRow.promptId], randomInt);
  const prompt = dailyPromptById(promptId);
  const cluster = prompt ? clusterById(prompt.cluster) : undefined;
  return prompt && cluster
    ? ok({ prompt, cluster })
    : fail("Không bốc được câu hỏi nào.");
}

/* ──────────────────────────────── chấm ──────────────────────────────── */

export async function gradeDaily(input: {
  promptId: string;
  essay: string;
}): Promise<ActionResult<DailyCoachResult>> {
  await requireIeltsUser();
  const prompt = dailyPromptById(input.promptId);
  if (!prompt) return fail("Không tìm thấy câu hỏi này trong bank.");

  const words = input.essay.trim().split(/\s+/).filter(Boolean).length;
  const floor = Math.round(prompt.words * 0.5);
  if (words < floor) {
    return fail(`Viết ít nhất ${floor} từ đã; hiện mới ${words} từ.`);
  }

  try {
    return ok(
      await coachDaily({
        essay: input.essay,
        prompt: prompt.text,
        ruleHistory: await ruleCounts(),
      }),
    );
  } catch (e) {
    // Cùng lý do như bên Writing: Next thay thông điệp lỗi bằng một digest ở
    // bản production, nên lý do thật phải được trả về chứ không được ném ra.
    const raw = e instanceof Error ? e.message : String(e);
    return fail(`Chấm bài thất bại: ${raw.slice(0, 300)}`);
  }
}

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

/* ──────────────────────────────── lưu ──────────────────────────────── */

export interface SaveDailyInput {
  promptId: string;
  essay: string;
  result: DailyCoachResult;
  selectedCards: SuggestedCard[];
  /** Bài quay tự do: lưu và chấm như thường, nhưng không đụng chuỗi ngày. */
  free?: boolean;
  /** Elapsed writing timer, in minutes, captured when the learner graded. */
  durationMin?: number;
}

export interface SaveDailyResult {
  submissionId: number;
  cardsAdded: number;
  comparison: RewriteComparison | null;
}

export async function saveDaily(
  input: SaveDailyInput,
): Promise<ActionResult<SaveDailyResult>> {
  await requireIeltsUser();
  const today = toISODate();
  const prompt = dailyPromptById(input.promptId);
  if (!prompt) return fail("Không tìm thấy câu hỏi này trong bank.");

  const [spinRow] = input.free
    ? []
    : await db
        .select()
        .from(schema.dailySpin)
        .where(eq(schema.dailySpin.date, today));

  if (!input.free) {
    if (!spinRow) return fail("Hôm nay chưa quay đề.");
    if (spinRow.status === "written") return fail("Bài hôm nay đã lưu rồi.");
    if (spinRow.status === "skipped") {
      return fail("Đề hôm nay đã bỏ qua. Mai quay đề mới.");
    }
    if (spinRow.promptId !== input.promptId) {
      return fail("Bài này không khớp với đề đã quay hôm nay.");
    }
  }

  const durationMin = normalizeDuration(input.durationMin);

  const previous = spinRow?.rewriteOfSubmissionId
    ? await loadPrevious(spinRow.rewriteOfSubmissionId)
    : null;

  const { submissionId, cardsAdded } = await db.transaction(async (tx) => {
    // Bài quay tự do không ghi study_session: có ghi thì nó vào chuỗi ngày và
    // vào cửa sổ pace, đúng thứ mà "không tính streak" nói là sẽ không xảy ra.
    let sessionId: number | null = null;
    if (!input.free) {
      const [session] = await tx
        .insert(schema.studySession)
        .values({
          date: today,
          skill: "writing",
          slot: "daily",
          sourceUrl: schema.DAILY_SESSION_MARKER,
          durationMin,
          notes: [
            `Viết mỗi ngày · ${prompt.cluster}`,
            `${input.result.error_count} lỗi / ${input.result.word_count} từ (${input.result.density}/100)`,
          ].join("\n"),
          status: "done",
        })
        .returning({ id: schema.studySession.id });
      sessionId = session.id;
    }

    const [submission] = await tx
      .insert(schema.writingSubmission)
      .values({
        sessionId,
        date: today,
        taskType: "free",
        topic: prompt.cluster,
        promptId: prompt.id,
        prompt: prompt.text,
        essayText: input.essay,
        wordCount: input.result.word_count,
        feedbackJson: JSON.stringify({
          strength: input.result.strength,
          rewrite: input.result.rewrite,
          phrases: input.result.phrases,
          rules: input.result.rules,
        }),
        errorDensity: input.result.density,
        gradingMode: "coach",
        evaluationMetaJson: input.result.evaluation_meta,
        isRewrite: previous != null,
        parentSubmissionId: previous?.id ?? null,
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
          context: prompt.cluster,
          dueDate: today,
          observedOn: today,
        })),
      );
    }

    if (spinRow) {
      await tx
        .update(schema.dailySpin)
        .set({ status: "written", submissionId: submission.id })
        .where(eq(schema.dailySpin.id, spinRow.id));
    }

    return {
      submissionId: submission.id,
      cardsAdded: input.selectedCards.length,
    };
  });

  revalidatePath("/ielts/daily");
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/errors");
  revalidatePath("/ielts/analytics");

  return ok({
    submissionId,
    cardsAdded,
    comparison: previous
      ? {
          previousDate: previous.date,
          previousDensity: previous.density,
          previousWordCount: previous.wordCount,
          previousEssay: previous.essay,
          density: input.result.density,
          wordCount: input.result.word_count,
          ...compareRules(previous.rules, input.result.rules),
        }
      : null,
  });
}

function normalizeDuration(value: number | undefined): number | null {
  if (value == null) return null;
  if (!Number.isFinite(value) || value <= 0 || value > 600) {
    throw new Error("Thời lượng phải nằm trong khoảng 1 đến 600 phút.");
  }
  return Math.max(1, Math.round(value));
}

interface PreviousAttempt {
  id: number;
  date: string;
  essay: string;
  density: number | null;
  wordCount: number | null;
  rules: string[];
}

async function loadPrevious(
  submissionId: number,
): Promise<PreviousAttempt | null> {
  const [row] = await db
    .select()
    .from(schema.writingSubmission)
    .where(eq(schema.writingSubmission.id, submissionId));
  if (!row) return null;

  let rules: string[] = [];
  if (row.feedbackJson) {
    try {
      const parsed = JSON.parse(row.feedbackJson) as { rules?: unknown };
      if (Array.isArray(parsed.rules)) {
        rules = parsed.rules.filter((r): r is string => typeof r === "string");
      }
    } catch {
      rules = [];
    }
  }

  return {
    id: row.id,
    date: row.createdAt.slice(0, 10),
    essay: row.essayText,
    density: row.errorDensity,
    wordCount: row.wordCount,
    rules,
  };
}

/* ─────────────────────────────── lịch sử ─────────────────────────────── */

export interface DailyEntry {
  submissionId: number;
  date: string;
  promptText: string;
  cluster: string;
  essay: string;
  density: number | null;
  wordCount: number | null;
  strength: string;
  rewrite: string;
}

/** Bài của một ngày, để bấm vào ô lịch mà đọc lại. */
export async function dailyEntryFor(date: string): Promise<DailyEntry | null> {
  await requireIeltsUser();
  const [spin] = await db
    .select()
    .from(schema.dailySpin)
    .where(eq(schema.dailySpin.date, date));
  if (!spin?.submissionId) return null;

  const [row] = await db
    .select()
    .from(schema.writingSubmission)
    .where(eq(schema.writingSubmission.id, spin.submissionId));
  if (!row) return null;

  let feedback: { strength?: unknown; rewrite?: unknown } = {};
  if (row.feedbackJson) {
    try {
      feedback = JSON.parse(row.feedbackJson) as typeof feedback;
    } catch {
      feedback = {};
    }
  }

  return {
    submissionId: row.id,
    date,
    promptText: row.prompt ?? "",
    cluster: row.topic ?? spin.clusterId,
    essay: row.essayText,
    density: row.errorDensity,
    wordCount: row.wordCount,
    strength: typeof feedback.strength === "string" ? feedback.strength : "",
    rewrite: typeof feedback.rewrite === "string" ? feedback.rewrite : "",
  };
}

/** Lỗi/100 từ của các bài gần đây, cho khối thống kê ở /ielts/analytics. */
export async function dailyDensityTrend(
  limit = 30,
): Promise<{ date: string; density: number }[]> {
  const rows = await db
    .select({
      createdAt: schema.writingSubmission.createdAt,
      density: schema.writingSubmission.errorDensity,
      taskType: schema.writingSubmission.taskType,
    })
    .from(schema.writingSubmission)
    .orderBy(desc(schema.writingSubmission.id))
    .limit(limit * 3);

  return rows
    .filter((r) => r.taskType === "free" && r.density != null)
    .slice(0, limit)
    .map((r) => ({
      date: r.createdAt.slice(0, 10),
      density: r.density as number,
    }))
    .reverse();
}
