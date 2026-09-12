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

check("weeks run Monday to Sunday, starting the week the phase opened", () => {
  // The phase opens Tuesday 2026-09-08, so week 1 is the week of Monday the
  // 7th and ends that Sunday. Weekday-based schedules need weeks to line up
  // with the calendar, otherwise "Thứ Ba" drifts across the week.
  assert.equal(weekInPhaseOf(START, START), 1);
  assert.equal(weekInPhaseOf(START, day(5)), 1); // Sunday 09-13
  assert.equal(weekInPhaseOf(START, day(6)), 2); // Monday 09-14
  assert.equal(weekInPhaseOf(START, day(20)), 4); // Monday 09-28
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

check("today's work is the day the schedule names, not a bag of counts", () => {
  // 2026-09-08 là thứ Ba: tối ngày thường chỉ có một việc ngắn.
  const report = progressReport(input({}));
  assert.equal(report.weekday, 2);
  assert.deepEqual(
    report.todayWork.map((i) => i.key),
    ["grammar"],
  );
  assert.equal(report.restDay, false);
  assert.equal(report.studyDaysThisWeek, 5); // tuần thường
});

check("thứ Sáu luôn nghỉ, ở mọi mức tải", () => {
  const friday = new Date(2026, 8, 11);
  for (const load of ["light", "normal", "full"] as const) {
    const report = progressReport(input({ today: friday, load }));
    assert.equal(report.restDay, true, load);
    assert.deepEqual(report.todayWork, []);
  }
});

check("a busy week drops the optional days entirely", () => {
  const thursday = new Date(2026, 8, 10); // weekday 4, chỉ có khi tuần rảnh
  const light = progressReport(input({ today: thursday, load: "light" }));
  assert.equal(light.restDay, true);
  assert.deepEqual(light.todayWork, []);
  assert.equal(light.studyDaysThisWeek, 4);

  const full = progressReport(input({ today: thursday, load: "full" }));
  assert.equal(full.restDay, false);
  assert.deepEqual(
    full.todayWork.map((i) => i.key),
    ["grammar"],
  );
  assert.equal(full.studyDaysThisWeek, 6);
});

check("doing an assigned day late still clears it", () => {
  // Chủ nhật mang bài viết thứ hai của tuần, nên nó chỉ bị đòi khi đã có hai
  // buổi viết — bất kể chúng rơi vào thứ nào.
  const thursday = new Date(2026, 8, 13); // Chủ nhật 13/09
  const writing = (date: string) => ({
    date,
    skill: "writing",
    slot: "writing",
    durationMin: 25,
  });

  const one = progressReport(
    input({ today: thursday, sessions: [writing("2026-09-08")] }),
  );
  assert.equal(one.todayWork.find((i) => i.slot === "writing")?.done, false);

  const two = progressReport(
    input({
      today: thursday,
      sessions: [writing("2026-09-08"), writing("2026-09-09")],
    }),
  );
  assert.equal(two.todayWork.find((i) => i.slot === "writing")?.done, true);
});

check("weekly targets follow the load", () => {
  const light = progressReport(input({ load: "light" }));
  const full = progressReport(input({ load: "full" }));
  const target = (r: typeof light, slot: string) =>
    r.weekly.find((i) => i.slot === slot)?.target;
  assert.equal(target(light, "grammar"), 1);
  assert.equal(target(full, "grammar"), 3);
});

check("a rewrite with nothing to rewrite is blocked, not offered", () => {
  // Thứ Hai đòi bản viết lại của bài viết cuối tuần trước.
  const monday = new Date(2026, 8, 14);
  const empty = progressReport(input({ today: monday }));
  const rewrite = empty.todayWork.find((i) => i.slot === "rewrite");
  assert.ok(rewrite?.blocked, "rewrite should be blocked with no essay");

  const written = progressReport(
    input({
      today: monday,
      submissions: [
        {
          createdAt: "2026-09-13",
          wordCount: 140,
          errorDensity: 6,
          isRewrite: false,
        },
      ],
    }),
  );
  assert.equal(
    written.todayWork.find((i) => i.slot === "rewrite")?.blocked,
    undefined,
  );
});

check("ô từ vựng là một mục hằng ngày, tính theo slot của nó", () => {
  const empty = progressReport(input({}));
  const vocab = empty.daily.find((d) => d.key === "vocab");
  assert.ok(vocab, "giai đoạn 0 phải có ô từ vựng");
  assert.equal(vocab?.done, false);

  const logged = progressReport(
    input({
      sessions: [
        { date: START, skill: "vocab", slot: "vocab", durationMin: 4 },
      ],
    }),
  );
  assert.equal(logged.daily.find((d) => d.key === "vocab")?.done, true);
});

check("chép chính tả là chỉ tiêu tuần của giai đoạn nâng band", () => {
  const build = progressReport(
    input({ state: { phase: "build", startedOn: START } }),
  );
  assert.equal(build.weekly.find((i) => i.slot === "dictation")?.target, 2);
  // Giai đoạn 0 không có ô này, và cũng không có ô 4/3/2.
  const start = progressReport(input({}));
  assert.equal(
    start.weekly.find((i) => i.slot === "dictation"),
    undefined,
  );
  assert.equal(
    start.daily.find((d) => d.key === "speak-drill"),
    undefined,
  );
});

check("một buổi bấm giờ tính luôn là phần tiếp nhận của ngày đó", () => {
  // 50 phút Reading bấm giờ **là** đọc. Đòi thêm một bài báo 15 phút trong cùng
  // ngày là bắt làm hai lần một việc, và đó là cách quỹ 60 phút bị vỡ.
  const report = progressReport(
    input({
      sessions: [
        {
          date: START,
          skill: "reading",
          slot: "timed-reading",
          durationMin: 50,
        },
      ],
    }),
  );
  assert.equal(report.daily.find((d) => d.key === "input-read")?.done, true);
  assert.equal(report.daily.find((d) => d.key === "input-listen")?.done, false);
});

console.log(`\n✓ Progress: ${passed}/${passed} checks passed`);
