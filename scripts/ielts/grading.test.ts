import assert from "node:assert/strict";
import {
  cardTextFor,
  countWords,
  mergeByRule,
  parseExtraction,
  rankErrors,
} from "../../src/lib/ielts/extract";
import {
  clampBand,
  median,
  medianBands,
  parseBandSample,
} from "../../src/lib/ielts/grading";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

const ESSAY =
  "My school have 7 specialized class. My class had 35 member with 20 boys and 15 girl. I very love my school.";

check("extraction reports density against the real word count", () => {
  const raw = JSON.stringify({
    errors: [
      { rule: "sva", span: "My school have", fix: "My school has", why: "x" },
      {
        rule: "plural-s",
        span: "7 specialized class",
        fix: "7 specialized classes",
        why: "y",
      },
      { rule: "plural-s", span: "35 member", fix: "35 members", why: "y" },
      { rule: "plural-s", span: "15 girl", fix: "15 girls", why: "y" },
    ],
  });
  const result = parseExtraction(raw, ESSAY);
  assert.equal(result.wordCount, countWords(ESSAY));
  assert.equal(result.errorCount, 4);
  assert.equal(result.density, Math.round((4 / result.wordCount) * 1000) / 10);
});

check("one card per rule, not per occurrence", () => {
  const raw = JSON.stringify({
    errors: [
      {
        rule: "plural-s",
        span: "7 specialized class",
        fix: "7 specialized classes",
        why: "thiếu -s",
      },
      {
        rule: "plural-s",
        span: "35 member",
        fix: "35 members",
        why: "thiếu -s",
      },
      { rule: "plural-s", span: "15 girl", fix: "15 girls", why: "thiếu -s" },
      {
        rule: "sva",
        span: "My school have",
        fix: "My school has",
        why: "hoà hợp",
      },
    ],
  });
  const result = parseExtraction(raw, ESSAY);
  assert.equal(result.errors.length, 2, "three plural errors must merge");
  assert.equal(result.errors[0].rule, "plural-s");
  assert.equal(result.errors[0].occurrences, 3);
  assert.equal(result.errors[0].others.length, 2);
});

check("a merged card shows the repeat count and other examples", () => {
  const [merged] = mergeByRule([
    {
      rule: "plural-s",
      errorType: "grammar",
      span: "35 member",
      fix: "35 members",
      why: "thiếu -s",
    },
    {
      rule: "plural-s",
      errorType: "grammar",
      span: "15 girl",
      fix: "15 girls",
      why: "thiếu -s",
    },
  ]);
  const card = cardTextFor(merged);
  assert.equal(card.front, "35 member");
  assert.equal(card.back, "35 members");
  assert.ok(card.explanation.includes("lặp 2 lần"));
  assert.ok(card.explanation.includes("15 girl"));
});

check("an unknown rule is kept as `other`, never dropped", () => {
  const raw = JSON.stringify({
    errors: [{ rule: "made-up-rule", span: "a b", fix: "a c", why: "z" }],
  });
  const result = parseExtraction(raw, ESSAY);
  assert.equal(result.errorCount, 1);
  assert.equal(result.errors[0].rule, "other");
});

check("entries without a span or fix are discarded", () => {
  const raw = JSON.stringify({
    errors: [
      { rule: "sva", span: "", fix: "x", why: "" },
      { rule: "sva", span: "My school have", why: "no fix" },
      { rule: "sva", span: "My school have", fix: "My school has", why: "ok" },
    ],
  });
  assert.equal(parseExtraction(raw, ESSAY).errorCount, 1);
});

check("non-JSON output fails loudly", () => {
  assert.throws(
    () => parseExtraction("sorry, I cannot", ESSAY),
    /không phải JSON/,
  );
});

check("ranking favours rules the learner keeps repeating", () => {
  const errors = mergeByRule([
    {
      rule: "article",
      errorType: "grammar",
      span: "a apple",
      fix: "an apple",
      why: "",
    },
    {
      rule: "article",
      errorType: "grammar",
      span: "a hour",
      fix: "an hour",
      why: "",
    },
    {
      rule: "plural-s",
      errorType: "grammar",
      span: "35 member",
      fix: "35 members",
      why: "",
    },
  ]);
  // Same occurrence weight, but plural-s has a long history of coming back.
  const ranked = rankErrors({
    errors,
    history: { "plural-s": 12 },
    limit: 2,
  });
  assert.equal(ranked[0].rule, "plural-s");
});

check(
  "a band sample missing a criterion throws instead of scoring zero",
  () => {
    const raw = JSON.stringify({
      bands: { task_response: 6, coherence: 6, lexical: 6 },
      feedback: {},
    });
    assert.throws(() => parseBandSample(raw), /thiếu band/);
  },
);

check("overall is recomputed when the model omits it", () => {
  const raw = JSON.stringify({
    bands: { task_response: 6, coherence: 5, lexical: 6, grammar: 5 },
    feedback: { next_steps: ["a", "b", "c", "d"] },
  });
  const sample = parseBandSample(raw);
  assert.equal(sample.bands.overall, 5.5);
  assert.equal(sample.feedback.next_steps.length, 3, "capped at 3 actions");
});

check("median resists a single outlier sample", () => {
  assert.equal(median([5, 6, 6]), 6);
  assert.equal(median([5, 6, 9]), 6);
  const bands = medianBands([
    { task_response: 5, coherence: 5, lexical: 5, grammar: 5, overall: 5 },
    { task_response: 6, coherence: 6, lexical: 6, grammar: 6, overall: 6 },
    { task_response: 6, coherence: 6, lexical: 6, grammar: 6, overall: 8.5 },
  ]);
  assert.equal(bands.overall, 6, "the 8.5 outlier must not win");
  assert.equal(bands.grammar, 6);
});

check("bands stay on the half-band scale within 0 to 9", () => {
  assert.equal(clampBand(6.26), 6.5);
  assert.equal(clampBand(-2), 0);
  assert.equal(clampBand(12), 9);
});

console.log(`\n✓ Grading: ${passed}/${passed} checks passed`);
