import assert from "node:assert/strict";
import {
  countRecentSessions,
  DEGRADED_SESSION_THRESHOLD,
  daysUntil,
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

const TODAY = new Date(2026, 8, 7); // 2026-09-07 local

const base = {
  completedRequired: 0,
  totalRequired: 105,
  weeklyTarget: 5,
  sessionsLast14d: 10,
  today: TODAY,
};

check("no exam date yields the no-exam status, not a failure", () => {
  const report = paceStatus(base);
  assert.equal(report.status, "no-exam");
  assert.equal(report.weeksLeft, null);
  assert.equal(report.requiredPerWeek, null);
  assert.equal(report.remaining, 105);
});

check("comfortable schedule reads on-track", () => {
  const report = paceStatus({
    ...base,
    completedRequired: 5,
    examDate: "2027-09-07", // ~52 weeks for 100 lessons
  });
  assert.equal(report.status, "on-track");
  assert.ok((report.requiredPerWeek ?? 0) <= 5);
});

check("slightly tight schedule reads behind", () => {
  // 100 lessons left over 18 weeks ⇒ 5.6/week against a target of 5.
  const report = paceStatus({
    ...base,
    completedRequired: 5,
    examDate: "2027-01-11",
  });
  assert.equal(report.status, "behind");
  assert.equal(report.requiredPerWeek, 5.6);
});

check("impossible schedule reads at-risk", () => {
  const report = paceStatus({ ...base, examDate: "2026-12-07" }); // ~13 weeks
  assert.equal(report.status, "at-risk");
  assert.ok((report.requiredPerWeek ?? 0) > 5 * 1.3);
});

check("an exam date already reached is at-risk while work remains", () => {
  const report = paceStatus({
    ...base,
    completedRequired: 100,
    examDate: "2026-09-07",
  });
  assert.equal(report.status, "at-risk");
  assert.equal(report.remaining, 5);
});

check("finishing everything is on-track regardless of the date", () => {
  const report = paceStatus({
    ...base,
    completedRequired: 105,
    examDate: "2026-09-08",
  });
  assert.equal(report.status, "on-track");
  assert.equal(report.remaining, 0);
});

check("degraded flips below the 14-day session threshold", () => {
  assert.equal(
    paceStatus({ ...base, sessionsLast14d: DEGRADED_SESSION_THRESHOLD })
      .degraded,
    false,
  );
  assert.equal(
    paceStatus({ ...base, sessionsLast14d: DEGRADED_SESSION_THRESHOLD - 1 })
      .degraded,
    true,
  );
});

check("degraded is independent of pace status", () => {
  const report = paceStatus({
    ...base,
    completedRequired: 5,
    examDate: "2027-09-07",
    sessionsLast14d: 1,
  });
  assert.equal(report.status, "on-track");
  assert.equal(report.degraded, true);
});

check("date helpers count whole days and weeks", () => {
  assert.equal(daysUntil(TODAY, "2026-09-08"), 1);
  assert.equal(daysUntil(TODAY, "2026-09-06"), -1);
  assert.equal(weeksBetween(TODAY, "2026-09-21"), 2);
  assert.equal(weeksBetween(TODAY, "2026-09-20"), 1); // 13 days ⇒ 1 whole week
});

check("recent sessions are counted per distinct day in the window", () => {
  const dates = [
    "2026-09-07",
    "2026-09-07", // same day twice ⇒ one study day
    "2026-09-01",
    "2026-08-25", // 13 days back ⇒ inside the 14-day window
    "2026-08-24", // 14 days back ⇒ outside
  ];
  assert.equal(countRecentSessions(dates, 14, TODAY), 3);
});

check("suggested exam date leaves two weeks of buffer", () => {
  // 100 lessons at 5/week ⇒ 20 weeks + 2 buffer = 22 weeks out.
  assert.equal(suggestedExamDate(100, 5, TODAY), "2027-02-08");
});

console.log(`\n✓ Pace: ${passed}/${passed} checks passed`);
