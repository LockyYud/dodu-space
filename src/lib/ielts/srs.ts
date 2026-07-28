import type { ReviewGrade } from "./schema";

/**
 * SM-2 spaced-repetition scheduler (the algorithm behind Anki).
 * See docs/ielts/TECH-DESIGN.md §5. Pure functions — no DB, no clock —
 * so they are trivially testable and deterministic.
 */

export const EASE_FLOOR = 1.3;
export const STUBBORN_LAPSES = 3; // lapses >= this ⇒ "lỗi cứng đầu"

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
}

/** A freshly created card, due today. */
export function newCardState(): SrsState {
  return { easeFactor: 2.5, intervalDays: 0, repetitions: 0, lapses: 0 };
}

const clampEase = (e: number) => Math.max(EASE_FLOOR, e);

/**
 * Apply a review grade to a card's SM-2 state and return the next state.
 * `intervalDays` in the result is the new interval (0 = review again today).
 */
export function schedule(state: SrsState, grade: ReviewGrade): SrsState {
  const { easeFactor, intervalDays, repetitions, lapses } = state;

  switch (grade) {
    case "again":
      return {
        easeFactor: clampEase(easeFactor - 0.2),
        intervalDays: 0,
        repetitions: 0,
        lapses: lapses + 1,
      };
    case "hard":
      return {
        easeFactor: clampEase(easeFactor - 0.15),
        intervalDays: Math.max(1, Math.round(intervalDays * 1.2)),
        repetitions: repetitions + 1,
        lapses,
      };
    case "good": {
      let next: number;
      if (repetitions === 0) next = 1;
      else if (repetitions === 1) next = 6;
      else next = Math.round(intervalDays * easeFactor);
      return {
        easeFactor,
        intervalDays: Math.max(1, next),
        repetitions: repetitions + 1,
        lapses,
      };
    }
    case "easy": {
      const nextEase = easeFactor + 0.15;
      return {
        easeFactor: nextEase,
        intervalDays: Math.max(1, Math.round(intervalDays * nextEase * 1.3)),
        repetitions: repetitions + 1,
        lapses,
      };
    }
  }
}

/** YYYY-MM-DD `days` from `from` (default today), in local time. */
export function dueDateAfter(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Local-time YYYY-MM-DD (avoids UTC off-by-one from toISOString). */
export function toISODate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const isStubborn = (lapses: number) => lapses >= STUBBORN_LAPSES;
