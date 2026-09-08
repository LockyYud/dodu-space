import assert from "node:assert/strict";
import {
  FORMAT_WEEK_COUNT,
  FORMAT_WEEKS,
  formatWeek,
  nextPhaseId,
  PHASES,
  PLANNED_WEEKS_TOTAL,
  phaseById,
  plannedWeeksRemaining,
  slotsForWeek,
} from "../../src/lib/ielts/plan";
import { pickPrompt, promptsFor } from "../../src/lib/ielts/prompts";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

check("four phases, ordered, ending at the taper", () => {
  assert.deepEqual(
    PHASES.map((p) => p.id),
    ["return", "format", "build", "taper"],
  );
  assert.equal(nextPhaseId("return"), "format");
  assert.equal(nextPhaseId("taper"), null);
  assert.equal(PLANNED_WEEKS_TOTAL, 22); // fits an early-Feb exam
});

check("early phases coach, later phases grade", () => {
  assert.equal(phaseById("return").gradingMode, "coach");
  assert.equal(phaseById("format").gradingMode, "coach");
  assert.equal(phaseById("build").gradingMode, "band");
  assert.equal(phaseById("taper").gradingMode, "band");
});

check("every phase has a daily input+SRS habit", () => {
  for (const phase of PHASES) {
    const keys = phase.daily.map((d) => d.key).sort();
    assert.deepEqual(
      keys,
      ["input-listen", "input-read", "srs"],
      `${phase.id} daily targets`,
    );
    const total = phase.daily.reduce((sum, d) => sum + d.minutes, 0);
    assert.ok(total <= 50, `${phase.id}: daily load ${total}' is too heavy`);
  }
});

check("every phase has a weekly tutor slot", () => {
  for (const phase of PHASES) {
    const tutor = phase.weekly.filter((s) => s.slot === "tutor");
    assert.equal(tutor.length, 1, `${phase.id} tutor slot`);
    assert.equal(tutor[0].count, 2);
  }
});

check(
  "writing has a rewrite partner wherever it is graded for progress",
  () => {
    for (const id of ["return", "format", "build"] as const) {
      const phase = phaseById(id);
      assert.ok(
        phase.weekly.some((s) => s.slot === "writing"),
        `${id} writing`,
      );
      assert.ok(
        phase.weekly.some((s) => s.slot === "rewrite"),
        `${id} rewrite`,
      );
    }
  },
);

check("mocks appear every third week of the build phase only", () => {
  const build = phaseById("build");
  const mock = build.weekly.find((s) => s.slot === "mock");
  assert.ok(mock);
  assert.equal(mock.everyNWeeks, 3);
  assert.equal(
    slotsForWeek(build, 1).some((s) => s.slot === "mock"),
    false,
  );
  assert.equal(
    slotsForWeek(build, 3).some((s) => s.slot === "mock"),
    true,
  );
  assert.equal(
    slotsForWeek(build, 6).some((s) => s.slot === "mock"),
    true,
  );
  for (const id of ["return", "format", "taper"] as const) {
    assert.equal(
      phaseById(id).weekly.some((s) => s.slot === "mock"),
      false,
      `${id} must not schedule mocks`,
    );
  }
});

check("Task 1 alternates weeks in the build phase", () => {
  const build = phaseById("build");
  const week1 = slotsForWeek(build, 1).filter((s) => s.slot === "writing");
  const week2 = slotsForWeek(build, 2).filter((s) => s.slot === "writing");
  assert.equal(week1.length, 1); // Task 2 only
  assert.equal(week2.length, 2); // Task 2 + Task 1
});

check("every phase can be exited by a measurable criterion", () => {
  for (const phase of PHASES) {
    assert.ok(phase.exit.length > 0, `${phase.id} needs exit criteria`);
    for (const criterion of phase.exit) {
      assert.ok(criterion.target > 0, `${phase.id}/${criterion.id} target`);
      assert.ok(criterion.label.length > 10, `${phase.id} label`);
    }
  }
});

check("planned weeks remaining shrinks as the plan progresses", () => {
  assert.equal(plannedWeeksRemaining("return", 1), PLANNED_WEEKS_TOTAL);
  assert.ok(
    plannedWeeksRemaining("return", 3) < plannedWeeksRemaining("return", 1),
  );
  assert.equal(plannedWeeksRemaining("taper", 3), 1);
  assert.ok(
    plannedWeeksRemaining("build", 1) > plannedWeeksRemaining("taper", 1),
  );
});

check("the format phase teaches one question type set per week", () => {
  assert.equal(FORMAT_WEEKS.length, FORMAT_WEEK_COUNT);
  assert.equal(formatWeek(1)?.reading, "True / False / Not Given");
  assert.equal(formatWeek(FORMAT_WEEK_COUNT + 1), null);
});

check("prompt bank serves each phase and never repeats until exhausted", () => {
  assert.ok(promptsFor("return").every((p) => p.kind === "free"));
  assert.ok(promptsFor("format").every((p) => p.kind === "task2"));

  const pool = promptsFor("return");
  const used: string[] = [];
  for (let i = 0; i < pool.length; i++) {
    const next = pickPrompt("return", used);
    assert.ok(next, "bank ran dry");
    assert.equal(used.includes(next.id), false, "repeated before exhausting");
    used.push(next.id);
  }
  // Exhausted: falls back to the least recently used rather than returning null.
  const recycled = pickPrompt("return", used);
  assert.equal(recycled?.id, used[0]);
});

check("every prompt carries a word target the grader can use", () => {
  for (const phase of ["return", "format", "build"] as const) {
    for (const prompt of promptsFor(phase)) {
      assert.ok(prompt.words >= 100, `${prompt.id} word target`);
      assert.ok(prompt.text.length > 40, `${prompt.id} text`);
    }
  }
});

console.log(`\n✓ Plan: ${passed}/${passed} checks passed`);
