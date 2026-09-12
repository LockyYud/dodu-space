import { type EvaluationStage, makeAiEvaluationMetadata } from "./evaluation";
import {
  cardTextFor,
  type ExtractionResult,
  extractErrors,
  rankErrors,
} from "./extract";
import type { SuggestedCard } from "./grading";
import { getLLM, LLM_GRADER_MODEL } from "./llm";

/**
 * Chấm bài "Viết mỗi ngày". Xem docs/ielts/DAILY-WRITING.md §5.
 *
 * Dùng lại đúng pass bắt lỗi của Writing (`extractErrors`) và **không** chạy
 * pass chấm band: bài 80 từ mà gắn 5.5 thì con số vô nghĩa và làm nản. Phần
 * thêm là một lời gọi ngắn trả về bản viết lại tự nhiên — với bài ngắn thì đọc
 * lại chính ý mình bằng câu chữ tốt hơn là thứ dạy được nhiều nhất, và đó là
 * thứ workbench của Writing không có.
 */

const MAX_CARDS = 5;
export const MAX_PHRASES = 3;

export interface DailyPhrase {
  /** Cách người viết đã dùng. */
  instead_of: string;
  /** Cách nói tự nhiên hơn. */
  say: string;
  note: string;
}

export interface DailyCoachResult {
  word_count: number;
  /** Lỗi trên 100 từ — chỉ số duy nhất theo dõi theo thời gian. */
  density: number;
  error_count: number;
  cards: SuggestedCard[];
  /** Các rule đã phạm trong bài, để so hai lần viết cùng một đề. */
  rules: string[];
  strength: string;
  /** Toàn bộ đoạn viết lại, giữ nguyên ý người viết. */
  rewrite: string;
  phrases: DailyPhrase[];
  /** Model/prompt provenance for both live evaluator stages. */
  evaluation_meta: ReturnType<typeof makeAiEvaluationMetadata>;
}

export const DAILY_FEEDBACK_PROMPT_VERSION = "daily-writing-feedback.v1";
export const DAILY_FEEDBACK_RUBRIC_VERSION = "daily-writing-rubric.v1";

const SYSTEM = `You are an English writing coach for a Vietnamese learner writing a short daily journal entry (60-100 words). You do NOT give scores or IELTS bands — this exercise is about the habit, and a band here would measure the wrong thing.

You are given the learner's text and the language mistakes already extracted from it, so do not repeat those corrections.

Return exactly three things:
- "strength": one specific thing this entry does well, in Vietnamese, addressing the learner as "bạn". Point at the text. No flattery, no generic praise.
- "rewrite": the WHOLE entry rewritten in natural English. Keep the learner's own ideas, facts and order — do not add content they did not write, and do not make it longer or more formal than a normal person writing about their day. This is what natural English for their meaning looks like, not a better essay.
- "phrases": at most ${MAX_PHRASES} everyday expressions worth stealing. Each is {"instead_of": what the learner wrote, "say": the natural version, "note": one short sentence in Vietnamese saying when to use it}. Pick collocations and phrasings, not single-word synonyms. Return an empty list rather than padding.

Reply with ONLY a JSON object, no markdown fences:
{"strength":string,"rewrite":string,"phrases":[{"instead_of":string,"say":string,"note":string}]}`;

export interface DailyCoachInput {
  essay: string;
  /** Câu hỏi hôm nay — cần, để bản viết lại không lạc khỏi điều được hỏi. */
  prompt: string;
  /** Số lần mỗi rule đã sinh thẻ, để xếp hạng lỗi đáng lưu. */
  ruleHistory?: Record<string, number>;
}

export async function coachDaily(
  input: DailyCoachInput,
): Promise<DailyCoachResult> {
  const extraction = await extractErrors({
    essay: input.essay,
    prompt: input.prompt,
  });
  const polish = await polishEntry(input, extraction);
  const { meta, ...feedback } = polish;

  return {
    word_count: extraction.wordCount,
    density: extraction.density,
    error_count: extraction.errorCount,
    cards: buildCards(extraction, input.ruleHistory ?? {}),
    rules: [...new Set(extraction.errors.map((e) => e.rule))],
    evaluation_meta: makeAiEvaluationMetadata([
      extraction.evaluationMeta ?? unknownExtractionStage(),
      meta,
    ]),
    ...feedback,
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
  extraction: ExtractionResult,
  history: Record<string, number>,
): SuggestedCard[] {
  return rankErrors({
    errors: extraction.errors,
    history,
    limit: MAX_CARDS,
  }).map((error) => ({
    error_type: error.errorType,
    rule: error.rule,
    occurrences: error.occurrences,
    ...cardTextFor(error),
  }));
}

async function polishEntry(
  input: DailyCoachInput,
  extraction: ExtractionResult,
): Promise<
  Pick<DailyCoachResult, "strength" | "rewrite" | "phrases"> & {
    meta: EvaluationStage;
  }
> {
  const client = getLLM();
  const model = LLM_GRADER_MODEL();
  const mistakes = extraction.errors
    .map((e) => `- [${e.rule}] "${e.span}" → "${e.fix}"`)
    .join("\n");

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: [
          `Question the learner answered:\n${input.prompt}`,
          `Learner's entry (${extraction.wordCount} words):\n${input.essay}`,
          mistakes
            ? `Mistakes already extracted:\n${mistakes}`
            : "No mistakes were extracted.",
        ].join("\n\n"),
      },
    ],
    response_format: { type: "json_object" },
  });

  return {
    ...parsePolish(completion.choices[0]?.message?.content ?? "", input.essay),
    meta: {
      purpose: "feedback",
      model,
      prompt_version: DAILY_FEEDBACK_PROMPT_VERSION,
      rubric_version: DAILY_FEEDBACK_RUBRIC_VERSION,
      sample_count: 1,
      evaluated_at: new Date().toISOString(),
    },
  };
}

/**
 * Đọc phần trả lời của model một cách phòng thủ — tách riêng để kiểm chứng
 * được mà không cần gọi LLM.
 *
 * Bản viết lại rỗng thì rơi về chính bài của người viết: thà hiện lại nguyên
 * văn còn hơn hiện một ô trống ở đúng khối quan trọng nhất màn hình.
 */
export function parsePolish(
  raw: string,
  essay: string,
): Pick<DailyCoachResult, "strength" | "rewrite" | "phrases"> {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  let parsed: Record<string, unknown> = {};
  try {
    const value: unknown = JSON.parse(cleaned);
    if (value && typeof value === "object") {
      parsed = value as Record<string, unknown>;
    }
  } catch {
    parsed = {};
  }

  const rewrite = str(parsed.rewrite);
  const rawPhrases = Array.isArray(parsed.phrases) ? parsed.phrases : [];
  const phrases: DailyPhrase[] = rawPhrases
    .map((entry) => {
      const row = (entry ?? {}) as Record<string, unknown>;
      return {
        instead_of: str(row.instead_of),
        say: str(row.say),
        note: str(row.note),
      };
    })
    .filter((p) => p.say.length > 0)
    .slice(0, MAX_PHRASES);

  return {
    strength: str(parsed.strength),
    rewrite: rewrite || essay.trim(),
    phrases,
  };
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/* ─────────────────────── so hai lần viết cùng một đề ─────────────────────── */

export interface RewriteComparison {
  previousDate: string;
  previousDensity: number | null;
  previousWordCount: number | null;
  previousEssay: string;
  density: number;
  wordCount: number;
  /** Rule có ở lần một, không còn ở lần hai. */
  rulesFixed: string[];
  /** Rule vẫn còn ở lần hai — dòng đáng đọc nhất của cả màn hình. */
  rulesRemaining: string[];
}

export function compareRules(
  previousRules: string[],
  currentRules: string[],
): { rulesFixed: string[]; rulesRemaining: string[] } {
  const now = new Set(currentRules);
  const before = [...new Set(previousRules)];
  return {
    rulesFixed: before.filter((rule) => !now.has(rule)),
    rulesRemaining: before.filter((rule) => now.has(rule)),
  };
}
