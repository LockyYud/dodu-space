import { ANCHORS, type CriterionKey, renderCriteria } from "./descriptors";
import {
  type EvaluationMetadata,
  type EvaluationStage,
  makeAiEvaluationMetadata,
} from "./evaluation";
import {
  cardTextFor,
  countWords,
  type ExtractionResult,
  extractErrors,
  type MergedError,
  rankErrors,
} from "./extract";
import { getLLM, LLM_GRADER_MODEL, LLM_GRADER_SAMPLES } from "./llm";
import type { ErrorType } from "./schema";

/**
 * IELTS Writing feedback, in two modes and two passes.
 * See docs/ielts/TECH-DESIGN.md §10.
 *
 *   pass 1  extractErrors()  — concrete mistakes, rules, errors/100 words
 *   pass 2  band grading     — only in "band" mode, with real criteria and
 *                              several samples reduced to a median
 *
 * "coach" mode returns no band at all. The early phases of the roadmap are
 * about writing every day and killing repeat grammar mistakes; putting a 4.5
 * on a warm-up paragraph measured the wrong thing and discouraged the habit
 * the phase exists to build.
 */

export type TaskType = "task1" | "task2";
export type GradingMode = "coach" | "band";

export interface GradedBands {
  task_response: number;
  coherence: number;
  lexical: number;
  grammar: number;
  overall: number;
}

export interface GradedFeedback {
  task_response: string;
  coherence: string;
  lexical: string;
  grammar: string;
  /** Concrete actions aimed at the learner's own target band. */
  next_steps: string[];
}

export interface SuggestedCard {
  error_type: ErrorType;
  rule: string;
  front: string;
  back: string;
  explanation: string;
  occurrences: number;
}

interface BaseResult {
  mode: GradingMode;
  word_count: number;
  /** Mistakes per 100 words. */
  density: number;
  error_count: number;
  cards: SuggestedCard[];
  /** Model/prompt/rubric provenance captured when this result was produced. */
  evaluation_meta: EvaluationMetadata;
}

export interface CoachResult extends BaseResult {
  mode: "coach";
  /** One thing that worked, so the feedback is not only corrections. */
  strength: string;
  /** The single most valuable thing to fix next. */
  next_fix: string;
}

export interface BandResult extends BaseResult {
  mode: "band";
  bands: GradedBands;
  feedback: GradedFeedback;
  /** Spread of overall band across samples; > 0.5 means treat it as soft. */
  spread: number;
  samples: number;
}

export type GradingResult = CoachResult | BandResult;

export const isBandResult = (r: GradingResult): r is BandResult =>
  r.mode === "band";

/** How many cards the extraction pass may propose. The UI keeps at most 3. */
export const MAX_SUGGESTED_CARDS = 5;

/** Version the feedback prompt and the rubric independently. */
export const WRITING_FEEDBACK_PROMPT_VERSION = "writing-feedback.v1";
export const WRITING_RUBRIC_VERSION = "ielts-writing-rubric.v1";

export interface GradeRequest {
  mode: GradingMode;
  taskType: TaskType;
  /** Required in band mode: Task Response cannot be judged without a question. */
  prompt?: string;
  essay: string;
  /** The learner's own Writing target, so advice aims at it and not at 9.0. */
  targetBand?: number;
  /** One line about the exercise: a 15-minute paragraph vs a timed essay. */
  taskContext?: string;
  learnerContext?: string;
  /** Times each rule has already appeared in the learner's card history. */
  ruleHistory?: Record<string, number>;
}

export async function gradeWriting(
  request: GradeRequest,
): Promise<GradingResult> {
  if (request.mode === "band" && !request.prompt?.trim()) {
    throw new Error(
      "Chế độ chấm band cần đề bài. Không có đề thì không thể chấm Task Response — hãy dùng chế độ coach.",
    );
  }

  const extraction = await extractErrors({
    essay: request.essay,
    prompt: request.prompt,
  });
  const cards = buildCards(extraction.errors, request.ruleHistory ?? {});

  if (request.mode === "coach") {
    const { notes, meta } = await coachNotes(request, extraction);
    return {
      mode: "coach",
      word_count: extraction.wordCount,
      density: extraction.density,
      error_count: extraction.errorCount,
      cards,
      evaluation_meta: makeAiEvaluationMetadata([
        extraction.evaluationMeta ?? unknownExtractionStage(),
        meta,
      ]),
      strength: notes.strength,
      next_fix: notes.next_fix,
    };
  }

  const { samples, meta } = await bandSamples(request, extraction);
  const bands = medianBands(samples.map((s) => s.bands));
  const overalls = samples.map((s) => s.bands.overall).sort((a, b) => a - b);
  return {
    mode: "band",
    word_count: extraction.wordCount,
    density: extraction.density,
    error_count: extraction.errorCount,
    cards,
    evaluation_meta: makeAiEvaluationMetadata([
      extraction.evaluationMeta ?? unknownExtractionStage(),
      meta,
    ]),
    bands,
    feedback: samples[0].feedback,
    spread:
      overalls.length > 1 ? overalls[overalls.length - 1] - overalls[0] : 0,
    samples: samples.length,
  };
}

function unknownExtractionStage(): EvaluationStage {
  return {
    purpose: "error_extraction",
    model: "unknown",
    prompt_version: "unknown",
    evaluated_at: new Date().toISOString(),
  };
}

function buildCards(
  errors: MergedError[],
  history: Record<string, number>,
): SuggestedCard[] {
  return rankErrors({ errors, history, limit: MAX_SUGGESTED_CARDS }).map(
    (error) => {
      const text = cardTextFor(error);
      return {
        error_type: error.errorType,
        rule: error.rule,
        occurrences: error.occurrences,
        ...text,
      };
    },
  );
}

/* ─────────────────────────────── coach mode ─────────────────────────────── */

const COACH_SYSTEM = `You are a writing coach for a Vietnamese learner rebuilding an English writing habit. You do NOT give scores or IELTS bands — another part of the app does that later, and giving one here would be wrong for this stage.

You are given the learner's text and the list of language mistakes already extracted from it, so do not repeat the corrections.

Return exactly two short things, in Vietnamese, addressing the learner as "bạn" (never "em"):
- "strength": one specific thing this piece does well. Point at the text. No flattery, no generic praise.
- "next_fix": the single most valuable change for the NEXT piece of writing. One concrete instruction, not a list.

Reply with ONLY a JSON object, no markdown fences:
{"strength":string,"next_fix":string}`;

async function coachNotes(
  request: GradeRequest,
  extraction: ExtractionResult,
): Promise<{
  notes: { strength: string; next_fix: string };
  meta: EvaluationStage;
}> {
  const client = getLLM();
  const model = LLM_GRADER_MODEL();
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: COACH_SYSTEM },
      { role: "user", content: coachUser(request, extraction) },
    ],
    response_format: { type: "json_object" },
  });
  const parsed = safeJson(completion.choices[0]?.message?.content ?? "");
  return {
    notes: {
      strength: str(parsed.strength),
      next_fix: str(parsed.next_fix),
    },
    meta: {
      purpose: "feedback",
      model,
      prompt_version: WRITING_FEEDBACK_PROMPT_VERSION,
      rubric_version: WRITING_RUBRIC_VERSION,
      sample_count: 1,
      evaluated_at: new Date().toISOString(),
    },
  };
}

function coachUser(
  request: GradeRequest,
  extraction: ExtractionResult,
): string {
  return [
    request.taskContext ? `Exercise: ${request.taskContext}` : "",
    request.learnerContext ? `Learner: ${request.learnerContext}` : "",
    request.prompt ? `Prompt given:\n${request.prompt}` : "No prompt given.",
    `\nLearner's text (${extraction.wordCount} words):\n${request.essay}`,
    `\nMistakes already extracted (${extraction.errorCount} total, ${extraction.density} per 100 words):`,
    extraction.errors
      .map((e) => `- ${e.rule} ×${e.occurrences}: "${e.span}" → "${e.fix}"`)
      .join("\n") || "- none",
  ]
    .filter(Boolean)
    .join("\n");
}

/* ─────────────────────────────── band mode ─────────────────────────────── */

function bandSystem(request: GradeRequest): string {
  const target = request.targetBand ?? 7;
  return `You are an experienced IELTS Writing examiner marking a ${
    request.taskType === "task1" ? "Task 1" : "Task 2"
  } response.

Mark against the criteria below. Compare the text to the descriptions and pick the band it matches; do not mark on general impression, and do not inflate. Use whole or half bands only.

${renderCriteria(request.taskType)}

${ANCHORS}

Hard rules:
- Under length is penalised on Task Response: below ${
    request.taskType === "task1" ? 150 : 250
  } words cannot reach band 6 for that criterion.
- You are given the exact list of language mistakes found in the text and the mistakes-per-100-words figure. Use them as evidence for Grammatical Range & Accuracy and Lexical Resource rather than counting again yourself.
- The learner's Writing target is band ${target.toFixed(1)}. "next_steps" must be the shortest route to ${target.toFixed(1)}, not to band 9.
- Feedback in Vietnamese, addressing the learner as "bạn". Never "em". Point at specific text; no generic advice.
- "next_steps": at most 3 items, each one concrete action.

Reply with ONLY a JSON object, no markdown fences:
{"bands":{"task_response":number,"coherence":number,"lexical":number,"grammar":number,"overall":number},
 "feedback":{"task_response":string,"coherence":string,"lexical":string,"grammar":string,"next_steps":string[]}}`;
}

interface BandSample {
  bands: GradedBands;
  feedback: GradedFeedback;
}

async function bandSamples(
  request: GradeRequest,
  extraction: ExtractionResult,
): Promise<{ samples: BandSample[]; meta: EvaluationStage }> {
  const client = getLLM();
  const model = LLM_GRADER_MODEL();
  const system = bandSystem(request);
  const user = coachUser(request, extraction);
  const wanted = Math.max(1, LLM_GRADER_SAMPLES());

  const results = await Promise.allSettled(
    Array.from({ length: wanted }, () =>
      client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    ),
  );

  const samples: BandSample[] = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    try {
      samples.push(
        parseBandSample(result.value.choices[0]?.message?.content ?? ""),
      );
    } catch {
      // One malformed sample must not sink the whole grade; the median of the
      // remaining samples is still usable, and zero samples throws below.
    }
  }

  if (samples.length === 0) {
    const reason = results.find((r) => r.status === "rejected");
    throw new Error(
      `Không chấm được bài: ${
        reason && reason.status === "rejected"
          ? String(reason.reason).slice(0, 200)
          : "endpoint không trả kết quả"
      }`,
    );
  }
  return {
    samples,
    meta: {
      purpose: "feedback",
      model,
      prompt_version: WRITING_FEEDBACK_PROMPT_VERSION,
      rubric_version: WRITING_RUBRIC_VERSION,
      sample_count: samples.length,
      evaluated_at: new Date().toISOString(),
    },
  };
}

/**
 * Strict parse. The old version silently substituted 0 for a missing band,
 * which then rendered as a real score; a broken response must fail loudly.
 */
export function parseBandSample(raw: string): BandSample {
  const obj = safeJson(raw);
  const b = (obj.bands ?? {}) as Record<string, unknown>;
  const f = (obj.feedback ?? {}) as Record<string, unknown>;

  const criteria: CriterionKey[] = [
    "task_response",
    "coherence",
    "lexical",
    "grammar",
  ];
  const values = {} as Record<CriterionKey, number>;
  for (const key of criteria) {
    const value = b[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`Kết quả chấm thiếu band cho tiêu chí "${key}".`);
    }
    values[key] = clampBand(value);
  }

  const mean =
    (values.task_response +
      values.coherence +
      values.lexical +
      values.grammar) /
    4;
  const overall =
    typeof b.overall === "number" && Number.isFinite(b.overall)
      ? clampBand(b.overall)
      : clampBand(mean);

  return {
    bands: { ...values, overall },
    feedback: {
      task_response: str(f.task_response),
      coherence: str(f.coherence),
      lexical: str(f.lexical),
      grammar: str(f.grammar),
      next_steps: Array.isArray(f.next_steps)
        ? f.next_steps
            .filter((x): x is string => typeof x === "string")
            .slice(0, 3)
        : [],
    },
  };
}

/** Median per criterion — one odd sample cannot drag the grade any more. */
export function medianBands(samples: GradedBands[]): GradedBands {
  const pick = (key: keyof GradedBands) => median(samples.map((s) => s[key]));
  const bands: GradedBands = {
    task_response: pick("task_response"),
    coherence: pick("coherence"),
    lexical: pick("lexical"),
    grammar: pick("grammar"),
    overall: pick("overall"),
  };
  return bands;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const value =
    sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return clampBand(value);
}

export function clampBand(value: number): number {
  const rounded = Math.round(value * 2) / 2;
  return Math.min(9, Math.max(0, rounded));
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

function safeJson(raw: string): Record<string, unknown> {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fall through
  }
  throw new Error(
    `Endpoint chấm bài trả về dữ liệu không phải JSON: ${raw.slice(0, 200)}`,
  );
}

const str = (value: unknown) => (typeof value === "string" ? value : "");

export { countWords };
