import assert from "node:assert/strict";
import {
  dueDateAfter,
  EASE_FLOOR,
  isStubborn,
  newCardState,
  schedule,
  toISODate,
} from "../../src/lib/ielts/srs";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

// New card: due today, ease 2.5.
check("new card defaults", () => {
  const s = newCardState();
  assert.equal(s.easeFactor, 2.5);
  assert.equal(s.intervalDays, 0);
  assert.equal(s.repetitions, 0);
  assert.equal(s.lapses, 0);
});

// Good progression: 0 → 1 → 6 → round(6*2.5)=15.
check("good progression 1 → 6 → 15", () => {
  let s = newCardState();
  s = schedule(s, "good");
  assert.equal(s.intervalDays, 1);
  assert.equal(s.repetitions, 1);
  s = schedule(s, "good");
  assert.equal(s.intervalDays, 6);
  assert.equal(s.repetitions, 2);
  s = schedule(s, "good");
  assert.equal(s.intervalDays, 15); // round(6 * 2.5)
});

// Again: resets interval + repetitions, drops ease, bumps lapses.
check("again resets and lapses", () => {
  let s = { easeFactor: 2.5, intervalDays: 15, repetitions: 3, lapses: 0 };
  s = schedule(s, "again");
  assert.equal(s.intervalDays, 0);
  assert.equal(s.repetitions, 0);
  assert.equal(s.lapses, 1);
  assert.ok(Math.abs(s.easeFactor - 2.3) < 1e-9);
});

// Ease never drops below the floor.
check("ease floor respected", () => {
  let s = { easeFactor: 1.35, intervalDays: 10, repetitions: 5, lapses: 4 };
  s = schedule(s, "again"); // 1.35 - 0.2 would be 1.15 → clamped
  assert.equal(s.easeFactor, EASE_FLOOR);
});

// Hard grows interval slowly and lowers ease.
check("hard grows interval by ~1.2", () => {
  let s = { easeFactor: 2.5, intervalDays: 10, repetitions: 3, lapses: 0 };
  s = schedule(s, "hard");
  assert.equal(s.intervalDays, 12); // round(10 * 1.2)
  assert.ok(Math.abs(s.easeFactor - 2.35) < 1e-9);
});

// Easy jumps interval and raises ease.
check("easy jumps interval and raises ease", () => {
  let s = { easeFactor: 2.5, intervalDays: 10, repetitions: 3, lapses: 0 };
  s = schedule(s, "easy");
  assert.ok(Math.abs(s.easeFactor - 2.65) < 1e-9);
  assert.equal(s.intervalDays, Math.round(10 * 2.65 * 1.3)); // 34 or 35
});

// Stubborn threshold.
check("stubborn = lapses >= 3", () => {
  assert.equal(isStubborn(2), false);
  assert.equal(isStubborn(3), true);
});

// Date helpers are local-time and offset correctly.
check("dueDateAfter offsets by N days", () => {
  const base = new Date(2026, 6, 19); // 2026-07-19 local
  assert.equal(toISODate(base), "2026-07-19");
  assert.equal(dueDateAfter(6, base), "2026-07-25");
  assert.equal(dueDateAfter(0, base), "2026-07-19");
});

console.log(`\n✓ SRS: ${passed}/${passed} checks passed`);
