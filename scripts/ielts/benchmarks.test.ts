import assert from "node:assert/strict";
import { benchmarkScoreError } from "../../src/lib/ielts/benchmarks";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

check("accepts a TOEIC benchmark with native LR/SW sections only", () => {
  assert.equal(
    benchmarkScoreError({
      scores: [null, null, null, null, null],
      sectionScores: { LR: 720, SW: 280 },
    }),
    null,
  );
});

check(
  "requires either a skill score or a non-empty native section score",
  () => {
    assert.equal(
      benchmarkScoreError({ scores: [null, null], sectionScores: {} }),
      "Nhập ít nhất một điểm benchmark.",
    );
  },
);

console.log(`\n✓ Benchmarks: ${passed}/${passed} checks passed`);
