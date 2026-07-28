import OpenAI from "openai";

/**
 * OpenAI-compatible client for the IELTS tracker.
 * Fully env-driven — works with any OpenAI-compatible endpoint.
 * See docs/ielts/TECH-DESIGN.md §6.
 *
 *   LLM_BASE_URL   e.g. https://api.openai.com/v1  (or an internal gateway)
 *   LLM_API_KEY
 *   LLM_MODEL      e.g. gpt-4o  (name depends on the endpoint)
 *   LLM_VISION_MODEL  optional; defaults to LLM_MODEL (for v3 screenshot OCR)
 */
export function getLLM() {
  const apiKey = process.env.LLM_API_KEY;
  const baseURL = process.env.LLM_BASE_URL;
  if (!apiKey) {
    throw new Error(
      "LLM_API_KEY is not set. Configure LLM_BASE_URL / LLM_API_KEY / LLM_MODEL in .env",
    );
  }
  return new OpenAI({ apiKey, baseURL });
}

export const LLM_MODEL = () => process.env.LLM_MODEL ?? "gpt-4o";
export const LLM_VISION_MODEL = () =>
  process.env.LLM_VISION_MODEL ?? LLM_MODEL();

/** True when the grading endpoint is configured — lets the UI degrade gracefully. */
export const isLLMConfigured = () => Boolean(process.env.LLM_API_KEY);
