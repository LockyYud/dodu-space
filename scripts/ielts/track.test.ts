import assert from "node:assert/strict";
import { makeAiEvaluationMetadata } from "../../src/lib/ielts/evaluation";
import { parseRawScore } from "../../src/lib/ielts/track";
import {
  parseVision,
  VISION_CAPTURE_PROMPT_VERSION,
} from "../../src/lib/ielts/vision";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

check("parses a plain correct/total score", () => {
  assert.deepEqual(parseRawScore("32/40"), { correct: 32, total: 40 });
});

check("parses a score embedded in a human note", () => {
  assert.deepEqual(parseRawScore("Score: 27 / 40"), {
    correct: 27,
    total: 40,
  });
});

check("does not invent structured counts from malformed input", () => {
  assert.equal(parseRawScore("about thirty out of forty"), null);
  assert.equal(parseRawScore(""), null);
  assert.equal(parseRawScore(undefined), null);
});

check("keeps evaluator metadata versioned by stage", () => {
  const metadata = makeAiEvaluationMetadata([
    {
      purpose: "error_extraction",
      model: "extractor",
      prompt_version: "errors.v1",
      evaluated_at: "2026-09-12T00:00:00.000Z",
    },
    {
      purpose: "feedback",
      model: "grader",
      prompt_version: "feedback.v1",
      rubric_version: "rubric.v1",
      sample_count: 3,
      evaluated_at: "2026-09-12T00:00:01.000Z",
    },
  ]);
  assert.equal(metadata.version, 1);
  assert.equal(metadata.stages[1].sample_count, 3);
  assert.equal(metadata.method, "ai");
});

check("marks screenshot provenance as capture, not evaluator scoring", () => {
  const result = parseVision(
    JSON.stringify({ raw_score: "32/40", suggested_cards: [] }),
    { model: "vision-model", prompt_version: VISION_CAPTURE_PROMPT_VERSION },
  );
  assert.deepEqual(result.capture_meta, {
    model: "vision-model",
    prompt_version: VISION_CAPTURE_PROMPT_VERSION,
  });
});

console.log(`\n✓ Track: ${passed}/5 checks passed`);
