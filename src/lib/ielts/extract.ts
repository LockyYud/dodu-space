import {
  ERROR_RULE_IDS,
  type ErrorRule,
  isErrorRule,
  ruleErrorType,
  ruleLabel,
} from "./error-rules";
import type { EvaluationStage } from "./evaluation";
import { getLLM, LLM_MODEL } from "./llm";
import { errorDensity } from "./progress";
import type { ErrorType } from "./schema";

/**
 * Pass 1 of grading: pull concrete language errors out of a piece of writing.
 *
 * Split from the band pass on purpose. When one call had to produce a band,
 * per-criterion feedback and flashcards at once, the cards lost: four missing
 * plural endings became four near-identical cards while one card bundled four
 * unrelated mistakes. Extracting first also gives an errors-per-100-words
 * figure, which is the progress measure for the phases that have no band.
 */

export interface ExtractedError {
  rule: ErrorRule;
  errorType: ErrorType;
  /** Smallest span of the learner's text containing the mistake. */
  span: string;
  fix: string;
  why: string;
}

export interface MergedError extends ExtractedError {
  /** How many times this rule was broken in the submission. */
  occurrences: number;
  /** The other spans, when the same rule was broken more than once. */
  others: { span: string; fix: string }[];
}

export interface ExtractionResult {
  wordCount: number;
  /** Total mistakes found, before merging by rule. */
  errorCount: number;
  /** Mistakes per 100 words. */
  density: number;
  /** Merged, one entry per rule, most frequent first. */
  errors: MergedError[];
  /** Present for a live extraction; parser-only results omit provenance. */
  evaluationMeta?: EvaluationStage;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const ERROR_EXTRACTION_PROMPT_VERSION = "writing-error-extraction.v1";

const SYSTEM_PROMPT = `You are an English writing corrector. Find concrete language mistakes in the learner's text and return them as structured data. You are NOT grading and must NOT produce a score.

Rules for the output:
- One entry per individual mistake, even when the same rule is broken several times. Do not merge them; the application merges them.
- "span" must be the SMALLEST fragment of the learner's original text that contains the mistake, copied verbatim. Never quote a whole paragraph.
- "fix" is that same fragment, corrected, and nothing else.
- "why" is a one-sentence explanation in Vietnamese, addressed to the learner as "bạn". Say the rule, not just the correction.
- "rule" MUST be one of: ${ERROR_RULE_IDS.join(", ")}. Use "other" only if nothing fits.
- Ignore stylistic preferences that are not mistakes. Ignore correct sentences.
- Report every genuine mistake you find, including repeated ones. Accuracy of the count matters: it is used to measure progress.

Reply with ONLY a JSON object, no markdown fences:
{"errors":[{"rule":string,"span":string,"fix":string,"why":string}]}`;

export interface ExtractInput {
  essay: string;
  /** The question, when there is one — helps judge relevance-driven wording. */
  prompt?: string;
  model?: string;
}

export async function extractErrors(
  input: ExtractInput,
): Promise<ExtractionResult> {
  const client = getLLM();
  const model = input.model ?? LLM_MODEL();
  const userContent = [
    input.prompt ? `The learner was answering:\n${input.prompt}\n` : "",
    `Learner's text:\n${input.essay}`,
  ].join("\n");

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
  });

  return {
    ...parseExtraction(
      completion.choices[0]?.message?.content ?? "",
      input.essay,
    ),
    evaluationMeta: {
      purpose: "error_extraction",
      model,
      prompt_version: ERROR_EXTRACTION_PROMPT_VERSION,
      evaluated_at: new Date().toISOString(),
    },
  };
}

/** Defensive parse plus merge — exported so it can be tested without an LLM. */
export function parseExtraction(raw: string, essay: string): ExtractionResult {
  const wordCount = countWords(essay);
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Bước trích lỗi trả về dữ liệu không phải JSON: ${raw.slice(0, 200)}`,
    );
  }

  const list = Array.isArray((parsed as { errors?: unknown }).errors)
    ? ((parsed as { errors: unknown[] }).errors as unknown[])
    : [];

  const flat: ExtractedError[] = list
    .map((item) => item as Record<string, unknown>)
    .filter(
      (item) =>
        typeof item.span === "string" &&
        item.span.trim().length > 0 &&
        typeof item.fix === "string",
    )
    .map((item) => {
      const rule: ErrorRule = isErrorRule(item.rule) ? item.rule : "other";
      return {
        rule,
        errorType: ruleErrorType(rule),
        span: String(item.span).trim(),
        fix: String(item.fix).trim(),
        why: typeof item.why === "string" ? item.why.trim() : "",
      };
    });

  return {
    wordCount,
    errorCount: flat.length,
    density: errorDensity(flat.length, wordCount),
    errors: mergeByRule(flat),
  };
}

/**
 * One card per rule, not per occurrence. The extra spans ride along as further
 * examples so the learner still sees every place they broke the rule.
 */
export function mergeByRule(errors: ExtractedError[]): MergedError[] {
  const byRule = new Map<ErrorRule, MergedError>();
  for (const error of errors) {
    const existing = byRule.get(error.rule);
    if (!existing) {
      byRule.set(error.rule, { ...error, occurrences: 1, others: [] });
      continue;
    }
    existing.occurrences += 1;
    // Skip a span we have already shown for this rule.
    const seen =
      existing.span === error.span ||
      existing.others.some((o) => o.span === error.span);
    if (!seen) existing.others.push({ span: error.span, fix: error.fix });
    if (!existing.why && error.why) existing.why = error.why;
  }
  return [...byRule.values()].sort((a, b) => b.occurrences - a.occurrences);
}

export interface RankInput {
  errors: MergedError[];
  /** How many times each rule has already been seen in the learner's history. */
  history: Record<string, number>;
  limit: number;
}

/**
 * Rank by "how much is this rule costing you": occurrences in this piece,
 * weighted by how often it has already come back before.
 */
export function rankErrors({
  errors,
  history,
  limit,
}: RankInput): MergedError[] {
  return [...errors]
    .sort((a, b) => score(b, history) - score(a, history))
    .slice(0, limit);
}

function score(error: MergedError, history: Record<string, number>): number {
  return error.occurrences * (1 + (history[error.rule] ?? 0) * 0.5);
}

/** Flashcard text for a merged error, including its repeat count. */
export function cardTextFor(error: MergedError): {
  front: string;
  back: string;
  explanation: string;
} {
  const repeat =
    error.occurrences > 1
      ? `\nLỗi này lặp ${error.occurrences} lần trong bài. Ví dụ khác: ${error.others
          .slice(0, 3)
          .map((o) => `"${o.span}" → "${o.fix}"`)
          .join("; ")}`
      : "";
  return {
    front: error.span,
    back: error.fix,
    explanation: `[${ruleLabel(error.rule)}] ${error.why}${repeat}`.trim(),
  };
}
