import assert from "node:assert/strict";
import {
  errorDensity,
  type ProgressInput,
  progressReport,
  weekInPhaseOf,
} from "../../src/lib/ielts/progress";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

const START = "2026-09-08";
const day = (offset: number) => {
  const d = new Date(2026, 8, 8 + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function input(over: Partial<ProgressInput> = {}): ProgressInput {
  return {
    state: { phase: "return", startedOn: START },
    sessions: [],
    submissions: [],
    bands: [],
    dueCount: 3,
    today: new Date(2026, 8, 8),
    ...over,
  };
}

check("week in phase is 1-based from the start date", () => {
  assert.equal(weekInPhaseOf(START, START), 1);
  assert.equal(weekInPhaseOf(START, day(6)), 1);
  assert.equal(weekInPhaseOf(START, day(7)), 2);
  assert.equal(weekInPhaseOf(START, day(20)), 3);
});

check("daily items are done by attempt, not by hitting the minutes", () => {
  const report = progressReport(
    input({
      sessions: [
        { date: START, skill: "listening", slot: "input", durationMin: 5 },
      ],
    }),
  );
  const listen = report.daily.find((d) => d.key === "input-listen");
  const read = report.daily.find((d) => d.key === "input-read");
  // A short day still closes out: reduced-load days must be completable.
  assert.equal(listen?.done, true);
  assert.equal(listen?.doneMinutes, 5);
  assert.equal(read?.done, false);
});

check("reading and listening inputs are counted separately", () => {
  const report = progressReport(
    input({
      sessions: [
        { date: START, skill: "reading", slot: "input", durationMin: 10 },
        { date: START, skill: "reading", slot: "input", durationMin: 5 },
      ],
    }),
  );
  assert.equal(
    report.daily.find((d) => d.key === "input-read")?.doneMinutes,
    15,
  );
  assert.equal(report.daily.find((d) => d.key === "input-listen")?.done, false);
});

check("SRS is done when a review session exists today", () => {
  const report = progressReport(
    input({
      sessions: [
        { date: START, skill: "vocab", slot: "srs", durationMin: null },
      ],
    }),
  );
  assert.equal(report.daily.find((d) => d.key === "srs")?.done, true);
});

check("SRS is satisfied on a day with nothing due", () => {
  const nothingDue = progressReport(input({ dueCount: 0 }));
  const srs = nothingDue.daily.find((d) => d.key === "srs");
  // Nothing to review means nothing can be logged, so requiring a review
  // would cap the day at 2 of 3 no matter what the learner did.
  assert.equal(srs?.done, true);

  const somethingDue = progressReport(input({ dueCount: 3 }));
  assert.equal(somethingDue.daily.find((d) => d.key === "srs")?.done, false);
});

check("weekly slots count only this week's sessions", () => {
  const report = progressReport(
    input({
      today: new Date(2026, 8, 20), // week 2
      sessions: [
        { date: day(1), skill: "writing", slot: "writing", durationMin: null },
        { date: day(9), skill: "writing", slot: "writing", durationMin: null },
      ],
    }),
  );
  assert.equal(report.weekInPhase, 2);
  const writing = report.weekly.find((w) => w.slot === "writing");
  assert.equal(writing?.done, 1, "last week's writing must not count");
  assert.equal(writing?.target, 2);
});

check(
  "return phase exits on input days, writing count and error density",
  () => {
    const sessions = Array.from({ length: 14 }, (_, i) => ({
      date: day(i),
      skill: "listening",
      slot: "input",
      durationMin: 20,
    }));
    const submissions = [
      ...Array.from({ length: 6 }, (_, i) => ({
        createdAt: day(i),
        wordCount: 130,
        errorDensity: 6,
        isRewrite: false,
      })),
      {
        createdAt: day(10),
        wordCount: 130,
        errorDensity: 4.2,
        isRewrite: true,
      },
      {
        createdAt: day(12),
        wordCount: 130,
        errorDensity: 3.1,
        isRewrite: true,
      },
    ];
    const report = progressReport(
      input({ today: new Date(2026, 8, 8 + 20), sessions, submissions }),
    );
    const byId = Object.fromEntries(report.exit.map((e) => [e.id, e]));
    assert.equal(byId["input-days"].met, true);
    assert.equal(byId["writing-count"].met, true);
    assert.equal(byId["error-density"].met, true);
    assert.equal(byId["error-density"].current, 4.2, "worst of the last two");
    assert.equal(report.canAdvance, true);
    assert.equal(report.nextPhase, "format");
  },
);

check("error density needs two rewrites before it can be met", () => {
  const report = progressReport(
    input({
      submissions: [
        { createdAt: day(1), wordCount: 130, errorDensity: 1, isRewrite: true },
      ],
    }),
  );
  const density = report.exit.find((e) => e.id === "error-density");
  assert.equal(density?.current, 0);
  assert.equal(density?.met, false);
  assert.equal(report.canAdvance, false);
});

check("input days outside the first 21 do not count toward the gate", () => {
  const sessions = Array.from({ length: 14 }, (_, i) => ({
    date: day(21 + i),
    skill: "reading",
    slot: "input",
    durationMin: 10,
  }));
  const report = progressReport(
    input({ today: new Date(2026, 9, 20), sessions }),
  );
  assert.equal(report.exit.find((e) => e.id === "input-days")?.current, 0);
});

check("format phase requires a real baseline with both skills", () => {
  const state = { phase: "format" as const, startedOn: START };
  const withOne = progressReport(
    input({
      state,
      bands: [{ date: day(3), listening: 6, reading: null, isMock: false }],
    }),
  );
  assert.equal(withOne.exit.find((e) => e.id === "baseline")?.met, false);

  const withBoth = progressReport(
    input({
      state,
      bands: [{ date: day(3), listening: 6, reading: 6, isMock: false }],
    }),
  );
  assert.equal(withBoth.exit.find((e) => e.id === "baseline")?.met, true);
});

check("build phase counts mocks and needs an exam date", () => {
  const state = { phase: "build" as const, startedOn: START };
  const bands = Array.from({ length: 4 }, (_, i) => ({
    date: day(i * 21),
    listening: 7,
    reading: 7,
    isMock: true,
  }));
  const noDate = progressReport(input({ state, bands }));
  assert.equal(noDate.exit.find((e) => e.id === "mock-count")?.met, true);
  assert.equal(noDate.exit.find((e) => e.id === "exam-date")?.met, false);
  assert.equal(noDate.canAdvance, false);

  const withDate = progressReport(
    input({ state, bands, examDate: "2027-02-08" }),
  );
  assert.equal(withDate.canAdvance, true);
});

check("errors per 100 words rounds to one decimal", () => {
  assert.equal(errorDensity(13, 102), 12.7);
  assert.equal(errorDensity(0, 100), 0);
  assert.equal(errorDensity(5, 0), 0);
});

console.log(`\n✓ Progress: ${passed}/${passed} checks passed`);
