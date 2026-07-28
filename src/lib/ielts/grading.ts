import { getLLM, LLM_MODEL } from "./llm";
import type { ErrorType } from "./schema";

/**
 * IELTS Writing grading via an OpenAI-compatible chat endpoint.
 * One call returns bands + per-criterion feedback + auto-extracted error cards.
 * See docs/ielts/TECH-DESIGN.md §6a.
 */

export type TaskType = "task1" | "task2";

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
  to_reach_7: string[];
}

export interface SuggestedCard {
  error_type: ErrorType;
  front: string;
  back: string;
  explanation: string;
}

export interface GradingResult {
  bands: GradedBands;
  feedback: GradedFeedback;
  error_cards: SuggestedCard[];
}

const VALID_ERROR_TYPES: ErrorType[] = [
  "grammar",
  "vocab",
  "collocation",
  "coherence",
  "spelling",
  "listening-catch",
  "reading-trap",
];

const SYSTEM_PROMPT = `You are a strict but fair IELTS Writing examiner. Grade against the official IELTS band descriptors on the four criteria: Task Response (TR), Coherence & Cohesion (CC), Lexical Resource (LR), Grammatical Range & Accuracy (GRA).

Calibrate honestly to real IELTS standards — do not inflate. Band 6 = competent but with noticeable errors and generic development; band 7 = ideas developed with specific examples, natural cohesion, some less-common vocabulary used accurately, and mostly error-free varied sentences. The learner is targeting band 7.

Overall = average of the four criteria rounded to the nearest 0.5.

Extract the learner's most instructive mistakes as flashcards (front = the wrong text as written, back = the corrected version, explanation = the rule/why in Vietnamese is fine). Prioritise grammar, collocation, and coherence errors that recur or that block band 7. Aim for 3-8 cards; skip trivial typos unless meaningful. Use only these error_type values: grammar, vocab, collocation, coherence, spelling.

Reply with ONLY a JSON object, no markdown fences, in exactly this shape:
{
  "bands": { "task_response": number, "coherence": number, "lexical": number, "grammar": number, "overall": number },
  "feedback": { "task_response": string, "coherence": string, "lexical": string, "grammar": string, "to_reach_7": string[] },
  "error_cards": [ { "error_type": string, "front": string, "back": string, "explanation": string } ]
}
Feedback strings may be in Vietnamese. All band numbers must be multiples of 0.5 between 0 and 9.`;

export interface GradeInput {
  taskType: TaskType;
  prompt?: string;
  essay: string;
  learnerContext?: string;
}

export async function gradeWriting(input: GradeInput): Promise<GradingResult> {
  const client = getLLM();
  const taskLabel = input.taskType === "task1" ? "Task 1" : "Task 2";
  const userContent = [
    `This is an IELTS Writing ${taskLabel} response.`,
    input.learnerContext ? `\nLearner context:\n${input.learnerContext}` : "",
    input.prompt ? `\nQuestion / prompt:\n${input.prompt}` : "",
    `\nCandidate's essay:\n${input.essay}`,
  ].join("");

  const completion = await client.chat.completions.create({
    model: LLM_MODEL(),
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return parseGrading(raw);
}

/** Defensive parse — tolerate stray markdown fences and validate shape. */
export function parseGrading(raw: string): GradingResult {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  let obj: unknown;
  try {
    obj = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Grading endpoint returned non-JSON output: ${raw.slice(0, 200)}`,
    );
  }
  const o = obj as Record<string, unknown>;
  const b = (o.bands ?? {}) as Record<string, unknown>;
  const f = (o.feedback ?? {}) as Record<string, unknown>;

  const num = (v: unknown) => (typeof v === "number" ? clampBand(v) : 0);
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  const bands: GradedBands = {
    task_response: num(b.task_response),
    coherence: num(b.coherence),
    lexical: num(b.lexical),
    grammar: num(b.grammar),
    overall: num(b.overall),
  };
  // Recompute overall if the model's is off (defensive).
  const computed = clampBand(
    (bands.task_response + bands.coherence + bands.lexical + bands.grammar) / 4,
  );
  if (!bands.overall) bands.overall = computed;

  const feedback: GradedFeedback = {
    task_response: str(f.task_response),
    coherence: str(f.coherence),
    lexical: str(f.lexical),
    grammar: str(f.grammar),
    to_reach_7: Array.isArray(f.to_reach_7)
      ? f.to_reach_7.filter((x): x is string => typeof x === "string")
      : [],
  };

  const rawCards = Array.isArray(o.error_cards) ? o.error_cards : [];
  const error_cards: SuggestedCard[] = rawCards
    .map((c) => c as Record<string, unknown>)
    .filter((c) => typeof c.front === "string" && typeof c.back === "string")
    .map((c) => ({
      error_type: normalizeErrorType(c.error_type),
      front: String(c.front),
      back: String(c.back),
      explanation: typeof c.explanation === "string" ? c.explanation : "",
    }));

  return { bands, feedback, error_cards };
}

function clampBand(v: number): number {
  const rounded = Math.round(v * 2) / 2; // nearest 0.5
  return Math.min(9, Math.max(0, rounded));
}

function normalizeErrorType(v: unknown): ErrorType {
  return typeof v === "string" && VALID_ERROR_TYPES.includes(v as ErrorType)
    ? (v as ErrorType)
    : "grammar";
}
