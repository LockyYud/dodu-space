import { getLLM, isLLMConfigured, LLM_MODEL } from "./llm";
import type { ErrorType } from "./schema";

export interface CapturedCard {
  error_type: ErrorType;
  front: string;
  back: string;
  explanation: string;
}

const ERROR_TYPES: ErrorType[] = [
  "grammar",
  "vocab",
  "collocation",
  "coherence",
  "spelling",
  "listening-catch",
  "reading-trap",
];

const SYSTEM_PROMPT = `You turn a learner's raw IELTS mistakes, unknown words, and collocations into Anki-style SRS cards.

Card design rules:
- Make each card atomic: one word, one collocation, one trap, or one correction.
- Prefer productive recall over passive notes.
- For vocabulary: front asks for meaning/use from context; back gives Vietnamese meaning + a natural English example.
- For grammar/collocation: front is the wrong sentence or prompt; back is the corrected version.
- For reading/listening traps: front describes the trap/question; back gives the correct strategy.
- Explanations should be short Vietnamese.
- Skip generic takeaways that cannot become a flashcard.

Reply with ONLY JSON:
{
  "cards": [
    { "error_type": "grammar|vocab|collocation|coherence|spelling|listening-catch|reading-trap", "front": "...", "back": "...", "explanation": "..." }
  ]
}`;

export async function captureCards(input: {
  skill: string;
  lessonLabel: string;
  sourceTitle?: string;
  raw: string;
}): Promise<CapturedCard[]> {
  const raw = input.raw.trim();
  if (!raw) return [];
  if (!isLLMConfigured()) return fallbackCapture(raw, input.skill);

  const client = getLLM();
  const completion = await client.chat.completions.create({
    model: LLM_MODEL(),
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          `Skill: ${input.skill}`,
          `Lesson: ${input.lessonLabel}`,
          input.sourceTitle ? `Source: ${input.sourceTitle}` : "",
          "",
          "Raw learner capture:",
          raw,
        ].join("\n"),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  return parseCards(completion.choices[0]?.message?.content ?? "");
}

export function parseCards(raw: string): CapturedCard[] {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const parsed = JSON.parse(cleaned) as { cards?: unknown[] };
  return (Array.isArray(parsed.cards) ? parsed.cards : [])
    .map((card) => card as Record<string, unknown>)
    .filter(
      (card) => typeof card.front === "string" && typeof card.back === "string",
    )
    .map((card) => ({
      error_type: normalizeType(card.error_type),
      front: String(card.front).trim(),
      back: String(card.back).trim(),
      explanation:
        typeof card.explanation === "string" ? card.explanation.trim() : "",
    }))
    .filter((card) => card.front && card.back)
    .slice(0, 12);
}

function fallbackCapture(raw: string, skill: string): CapturedCard[] {
  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): CapturedCard => {
      const [front, back] = splitLine(line);
      return {
        error_type:
          skill === "reading"
            ? "reading-trap"
            : skill === "listening"
              ? "listening-catch"
              : inferType(line),
        front,
        back,
        explanation:
          "Fallback chưa dùng AI: card được tạo từ từng dòng bạn capture.",
      };
    })
    .slice(0, 12);
}

function splitLine(line: string): [string, string] {
  const parts = line.split(/\s*(?:->|=>|→|=)\s*/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return [parts[0], parts.slice(1).join(" -> ")];
  }
  return [line, "Tự kiểm tra lại nghĩa/cách dùng trong ngữ cảnh."];
}

function inferType(line: string): ErrorType {
  if (/collocation|phrase|cụm|đi với/i.test(line)) return "collocation";
  if (/spell|spelling|chính tả/i.test(line)) return "spelling";
  if (/linking|coherence|logic|mạch/i.test(line)) return "coherence";
  if (/grammar|tense|plural|số nhiều|ngữ pháp/i.test(line)) return "grammar";
  return "vocab";
}

function normalizeType(value: unknown): ErrorType {
  return typeof value === "string" && ERROR_TYPES.includes(value as ErrorType)
    ? (value as ErrorType)
    : "vocab";
}
