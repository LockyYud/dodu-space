import assert from "node:assert/strict";
import {
  countRecentSessions,
  DEGRADED_SESSION_THRESHOLD,
  daysSince,
  daysUntil,
  earliestDate,
  hoursOutlook,
  paceStatus,
  suggestedExamDate,
  weeksBetween,
} from "../../src/lib/ielts/pace";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

const TODAY = new Date(2026, 8, 8); // 2026-09-08 local
const base = {
  plannedWeeksRemaining: 22,
  studyDaysLast14: 10,
  today: TODAY,
};

check("no exam date is a state, not a failure", () => {
  const report = paceStatus(base);
  assert.equal(report.status, "no-exam");
  assert.equal(report.weeksLeft, null);
  assert.equal(report.slack, null);
});

check("a comfortable exam date reads on-track", () => {
  const report = paceStatus({ ...base, examDate: "2027-03-01" }); // ~25 weeks
  assert.equal(report.status, "on-track");
  assert.ok((report.slack ?? 0) >= 1);
});

check("slightly tight reads behind, not at-risk", () => {
  const report = paceStatus({ ...base, examDate: "2027-02-08" }); // ~21 weeks
  assert.equal(report.status, "behind");
});

check("far too tight reads at-risk", () => {
  const report = paceStatus({ ...base, examDate: "2026-12-07" }); // ~12 weeks
  assert.equal(report.status, "at-risk");
});

check("a shorter plan makes the same date comfortable again", () => {
  const late = paceStatus({
    ...base,
    plannedWeeksRemaining: 5,
    examDate: "2026-12-07",
  });
  assert.equal(late.status, "on-track");
});

check("a brand-new plan is never told it has been studying too little", () => {
  // Day one: zero study days in the window, but the window does not exist yet.
  const dayOne = paceStatus({
    ...base,
    studyDaysLast14: 0,
    daysSincePlanStart: 0,
  });
  assert.equal(dayOne.degraded, false);

  const day13 = paceStatus({
    ...base,
    studyDaysLast14: 0,
    daysSincePlanStart: 13,
  });
  assert.equal(day13.degraded, false);

  // Once a full window exists, an empty one really is reduced load.
  const day14 = paceStatus({
    ...base,
    studyDaysLast14: 0,
    daysSincePlanStart: 14,
  });
  assert.equal(day14.degraded, true);
});

check("degraded flips below the 14-day study-day threshold", () => {
  assert.equal(
    paceStatus({ ...base, studyDaysLast14: DEGRADED_SESSION_THRESHOLD })
      .degraded,
    false,
  );
  assert.equal(
    paceStatus({ ...base, studyDaysLast14: DEGRADED_SESSION_THRESHOLD - 1 })
      .degraded,
    true,
  );
});

check("degraded is independent of pace status", () => {
  const report = paceStatus({
    ...base,
    examDate: "2027-03-01",
    studyDaysLast14: 1,
  });
  assert.equal(report.status, "on-track");
  assert.equal(report.degraded, true);
});

check("date helpers count whole days and weeks", () => {
  assert.equal(daysUntil(TODAY, "2026-09-09"), 1);
  assert.equal(daysUntil(TODAY, "2026-09-07"), -1);
  assert.equal(weeksBetween(TODAY, "2026-09-22"), 2);
  assert.equal(weeksBetween(TODAY, "2026-09-21"), 1); // 13 days ⇒ 1 whole week
});

check("recent study days are counted once per day in the window", () => {
  const dates = [
    "2026-09-08",
    "2026-09-08", // same day twice ⇒ one study day
    "2026-09-02",
    "2026-08-26", // 13 days back ⇒ inside the window
    "2026-08-25", // 14 days back ⇒ outside
  ];
  assert.equal(countRecentSessions(dates, 14, TODAY), 3);
});

check("suggested exam date leaves two weeks of buffer", () => {
  assert.equal(suggestedExamDate(22, TODAY), "2027-02-23");
  assert.equal(suggestedExamDate(0, TODAY), "2026-09-22");
});

check("the plan anchor is the earliest date, ignoring blanks", () => {
  // The profile falls back to "today" until it is saved, so the phase row's
  // date must win; otherwise the anchor slides forward every day and
  // reduced-load mode can never come due.
  assert.equal(earliestDate("2026-09-08", "2026-07-19"), "2026-07-19");
  assert.equal(earliestDate("2026-09-08", null), "2026-09-08");
  assert.equal(earliestDate(null, undefined), null);
  assert.equal(
    daysSince(earliestDate("2026-09-08", "2026-08-01") ?? "", TODAY),
    38,
  );
});

check("quỹ giờ: chưa đủ, sát mép, và đủ hẳn", () => {
  const base = {
    startOverall: 5.5,
    targetOverall: 7.0,
    hoursPerBand: [120, 200] as [number, number],
  };
  // 1.5 band ⇒ cần 180–300 giờ.
  const thin = hoursOutlook({ ...base, studied: 10, planned: 120 });
  assert.equal(thin.neededLow, 180);
  assert.equal(thin.neededHigh, 300);
  assert.equal(thin.funded, false);
  assert.match(thin.message, /chưa đủ/);

  const edge = hoursOutlook({ ...base, studied: 10, planned: 185 });
  assert.equal(edge.funded, true);
  assert.equal(edge.fullyFunded, false);

  const full = hoursOutlook({ ...base, studied: 10, planned: 300 });
  assert.equal(full.fullyFunded, true);
});

check("quỹ giờ: đã ở mục tiêu thì không đòi thêm giờ nào", () => {
  const done = hoursOutlook({
    studied: 40,
    planned: 0,
    startOverall: 7.0,
    targetOverall: 7.0,
    hoursPerBand: [120, 200],
  });
  assert.equal(done.bandsNeeded, 0);
  assert.equal(done.neededLow, 0);
  assert.equal(done.fullyFunded, true);
});

check("quỹ giờ: hạ mục tiêu làm chênh lệch nhỏ lại", () => {
  const args = { studied: 10, planned: 150, startOverall: 5.5 } as const;
  const seven = hoursOutlook({
    ...args,
    targetOverall: 7.0,
    hoursPerBand: [120, 200],
  });
  const sixFive = hoursOutlook({
    ...args,
    targetOverall: 6.5,
    hoursPerBand: [120, 200],
  });
  assert.equal(seven.funded, false);
  assert.equal(sixFive.funded, true); // 1.0 band ⇒ 120–200 giờ
});

console.log(`\n✓ Pace: ${passed}/${passed} checks passed`);
