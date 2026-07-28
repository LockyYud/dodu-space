import { getLLM, LLM_VISION_MODEL } from "./llm";
import type { ErrorType } from "./schema";

/**
 * Parse an IELTS Reading/Listening result screenshot via an OpenAI-compatible
 * vision model. See docs/ielts/TECH-DESIGN.md §6b.
 */

export interface ScreenshotResult {
  raw_score: string; // e.g. "32/40"
  band_estimate: number | null;
  wrong_items: string[];
  suggested_cards: {
    error_type: ErrorType;
    front: string;
    back: string;
    explanation: string;
  }[];
}

const VISION_PROMPT = `You are given a screenshot of an IELTS Reading or Listening practice test result. Extract what you can and reply with ONLY a JSON object (no markdown fences):
{
  "raw_score": "correct/total, e.g. 32/40 (empty string if not visible)",
  "band_estimate": number or null (IELTS band if shown, else null),
  "wrong_items": ["short description of each wrong question you can see"],
  "suggested_cards": [ { "error_type": "reading-trap"|"listening-catch"|"vocab", "front": "the trap/what went wrong", "back": "the correct approach/answer", "explanation": "why (Vietnamese ok)" } ]
}
Only include cards you can justify from the image. If the image is unreadable, return empty arrays and empty raw_score.`;

export async function parseScreenshot(
  dataUrl: string,
): Promise<ScreenshotResult> {
  const client = getLLM();
  const completion = await client.chat.completions.create({
    model: LLM_VISION_MODEL(),
    messages: [
      { role: "system", content: VISION_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Parse this IELTS result screenshot." },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  return parseVision(raw);
}

const VALID: ErrorType[] = [
  "reading-trap",
  "listening-catch",
  "vocab",
  "grammar",
];

export function parseVision(raw: string): ScreenshotResult {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  let o: Record<string, unknown>;
  try {
    o = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    throw new Error(`Vision endpoint returned non-JSON: ${raw.slice(0, 160)}`);
  }
  const cards = Array.isArray(o.suggested_cards) ? o.suggested_cards : [];
  return {
    raw_score: typeof o.raw_score === "string" ? o.raw_score : "",
    band_estimate: typeof o.band_estimate === "number" ? o.band_estimate : null,
    wrong_items: Array.isArray(o.wrong_items)
      ? o.wrong_items.filter((x): x is string => typeof x === "string")
      : [],
    suggested_cards: cards
      .map((c) => c as Record<string, unknown>)
      .filter((c) => typeof c.front === "string" && typeof c.back === "string")
      .map((c) => ({
        error_type: VALID.includes(c.error_type as ErrorType)
          ? (c.error_type as ErrorType)
          : "reading-trap",
        front: String(c.front),
        back: String(c.back),
        explanation: typeof c.explanation === "string" ? c.explanation : "",
      })),
  };
}
