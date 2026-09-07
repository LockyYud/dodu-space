import assert from "node:assert/strict";
import {
  HABIT_GATE_WEEKS,
  habitGatePassed,
  lessonQueueStatus,
  lessonSequence,
  MOCK_WEEKS,
  stageOf,
  topicForWeek,
  WEEKLY_TARGET_DEFAULT,
  WEEKS_TOTAL,
  weeklyCompletionCounts,
} from "../../src/lib/ielts/plan";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

const lessons = lessonSequence();
const required = lessons.filter((l) => l.required);

check("6 lessons a week, 5 of them required", () => {
  assert.equal(lessons.length, WEEKS_TOTAL * 6);
  for (let week = 1; week <= WEEKS_TOTAL; week++) {
    const ofWeek = lessons.filter((l) => l.week === week);
    assert.equal(ofWeek.length, 6, `week ${week} lesson count`);
    const requiredOfWeek = ofWeek.filter((l) => l.required).length;
    // Mock weeks turn the Saturday buffer into a required mock.
    assert.equal(
      requiredOfWeek,
      MOCK_WEEKS.includes(week)
        ? WEEKLY_TARGET_DEFAULT + 1
        : WEEKLY_TARGET_DEFAULT,
      `week ${week} required count`,
    );
  }
});

check("Sunday is never scheduled", () => {
  assert.equal(
    lessons.some((l) => l.dow === 0),
    false,
  );
});

check("every week has exactly one speaking lesson", () => {
  for (let week = 1; week <= WEEKS_TOTAL; week++) {
    const speaking = lessons.filter(
      (l) => l.week === week && l.activity.skill === "speaking",
    );
    assert.equal(speaking.length, 1, `week ${week} speaking`);
    assert.equal(speaking[0].required, true);
  }
});

check("week 1 measures a listening and a reading baseline", () => {
  const baselines = lessons.filter((l) => l.activity.kind === "baseline");
  assert.equal(baselines.length, 2);
  assert.deepEqual(baselines.map((l) => l.activity.skill).sort(), [
    "listening",
    "reading",
  ]);
  for (const lesson of baselines) {
    assert.equal(lesson.week, 1);
    assert.equal(lesson.required, true);
    assert.equal(lesson.activity.tool, "track");
  }
});

check("mocks land on the configured weeks and are required", () => {
  const mocks = lessons.filter((l) => l.activity.kind === "mock");
  assert.deepEqual(
    mocks.map((l) => l.week),
    MOCK_WEEKS,
  );
  for (const mock of mocks) {
    assert.equal(mock.required, true);
    assert.equal(mock.activity.tool, "track");
  }
});

check("every week has a rewrite lesson right after a writing lesson", () => {
  for (let week = 1; week <= WEEKS_TOTAL; week++) {
    const ofWeek = lessons.filter((l) => l.week === week);
    const write = ofWeek.find((l) => l.activity.kind === "core" && l.dow === 1);
    const rewrite = ofWeek.find((l) => l.activity.kind === "rewrite");
    assert.ok(write, `week ${week} writing lesson`);
    assert.ok(rewrite, `week ${week} rewrite lesson`);
    assert.ok(rewrite.dow > write.dow, `week ${week} rewrite comes later`);
  }
});

check("stage boundaries and Stage A load", () => {
  assert.equal(stageOf(1), "A");
  assert.equal(stageOf(4), "A");
  assert.equal(stageOf(5), "B1");
  assert.equal(stageOf(12), "B1");
  assert.equal(stageOf(13), "B2");
  const stageA = required.filter((l) => l.stage === "A");
  for (const lesson of stageA) {
    assert.ok(
      lesson.activity.minutes <= 25,
      `${lesson.id} should be a 25' habit lesson`,
    );
  }
});

check("writing topic rotates per week", () => {
  assert.equal(topicForWeek(1), "Education");
  assert.equal(topicForWeek(9), "Education"); // 8-topic cycle
  assert.notEqual(topicForWeek(1), topicForWeek(2));
});

check("queue skips buffers and never blocks on them", () => {
  const fresh = lessonQueueStatus([]);
  assert.equal(fresh.current.id, "w1-d1");
  assert.equal(fresh.current.required, true);
  assert.equal(fresh.totalCount, required.length);
  assert.equal(fresh.completedCount, 0);
  assert.equal(fresh.buffer?.id, "w1-d6");

  // Completing Mon–Fri of week 1 moves on to week 2 even with the buffer left.
  const weekOneDone = ["w1-d1", "w1-d2", "w1-d3", "w1-d4", "w1-d5"];
  const next = lessonQueueStatus(weekOneDone);
  assert.equal(next.current.week, 2);
  assert.equal(next.completedCount, 5);
  assert.equal(next.buffer?.id, "w2-d6");
});

check("buffer completions still count toward the weekly total", () => {
  const counts = weeklyCompletionCounts(["w1-d1", "w1-d6", "w3-d2", "bogus"]);
  assert.equal(counts[0], 2);
  assert.equal(counts[2], 1);
  assert.equal(counts.length, WEEKS_TOTAL);
});

check("habit gate needs 4 consecutive weeks at target", () => {
  assert.equal(habitGatePassed([5, 5, 5]), false);
  assert.equal(habitGatePassed([5, 5, 5, 5]), true);
  assert.equal(habitGatePassed([5, 5, 4, 5, 5, 5]), false);
  assert.equal(habitGatePassed([5, 5, 4, 5, 5, 5, 5]), true);
  assert.equal(habitGatePassed(new Array(HABIT_GATE_WEEKS).fill(3)), false);
  assert.equal(habitGatePassed([3, 3, 3, 3], 3), true);
});

console.log(`\n✓ Plan: ${passed}/${passed} checks passed`);
