import { toISODate } from "./srs";

/**
 * Pace tracking for roadmap v2 (see docs/ielts/ROADMAP.md §2).
 *
 * v1 had no way to notice it was falling behind: the queue simply stood still
 * while the calendar moved, so the exam date drifted in silence. These pure
 * functions turn "lessons left vs. weeks left" into a status the UI can show,
 * and detect the stall early enough to switch to a reduced-load mode instead
 * of letting the plan break.
 */

export type PaceStatus = "no-exam" | "on-track" | "behind" | "at-risk";

/** Study sessions in the last 14 days below this ⇒ reduced-load mode. */
export const DEGRADED_SESSION_THRESHOLD = 6;
export const DEGRADED_WINDOW_DAYS = 14;
/** How far above the weekly target still counts as merely "behind". */
const AT_RISK_MULTIPLIER = 1.3;

export interface PaceInput {
  completedRequired: number;
  totalRequired: number;
  weeklyTarget: number;
  sessionsLast14d: number;
  examDate?: string | null;
  today?: Date;
}

export interface PaceReport {
  remaining: number;
  /** Whole weeks left until the exam; null when no exam date is set. */
  weeksLeft: number | null;
  /** Required lessons per week to finish in time; null when no exam date. */
  requiredPerWeek: number | null;
  weeklyTarget: number;
  status: PaceStatus;
  /** True when the last 14 days are too sparse to keep the normal load. */
  degraded: boolean;
  message: string;
}

export function paceStatus(input: PaceInput): PaceReport {
  const today = input.today ?? new Date();
  const remaining = Math.max(0, input.totalRequired - input.completedRequired);
  const degraded = input.sessionsLast14d < DEGRADED_SESSION_THRESHOLD;
  const weeklyTarget = Math.max(1, input.weeklyTarget);

  if (!input.examDate) {
    return {
      remaining,
      weeksLeft: null,
      requiredPerWeek: null,
      weeklyTarget,
      status: "no-exam",
      degraded,
      message: degraded
        ? "Chưa đặt ngày thi. Giữ nhịp học đã rồi hãy đặt lịch."
        : `Chưa đặt ngày thi. Còn ${remaining} bài bắt buộc trong lộ trình.`,
    };
  }

  const weeksLeft = weeksBetween(today, input.examDate);

  if (remaining === 0) {
    return {
      remaining,
      weeksLeft,
      requiredPerWeek: 0,
      weeklyTarget,
      status: "on-track",
      degraded,
      message: "Đã hoàn thành toàn bộ bài bắt buộc của lộ trình.",
    };
  }

  if (weeksLeft <= 0) {
    return {
      remaining,
      weeksLeft,
      requiredPerWeek: null,
      weeklyTarget,
      status: "at-risk",
      degraded,
      message: `Ngày thi đã tới nhưng còn ${remaining} bài chưa xong.`,
    };
  }

  const requiredPerWeek = round1(remaining / weeksLeft);
  const status: PaceStatus =
    requiredPerWeek <= weeklyTarget
      ? "on-track"
      : requiredPerWeek <= weeklyTarget * AT_RISK_MULTIPLIER
        ? "behind"
        : "at-risk";

  const message =
    status === "on-track"
      ? `Đúng nhịp: cần ${requiredPerWeek} bài/tuần, mục tiêu ${weeklyTarget}.`
      : status === "behind"
        ? `Hơi chậm: cần ${requiredPerWeek} bài/tuần so với mục tiêu ${weeklyTarget}.`
        : `Không kịp ngày thi: cần ${requiredPerWeek} bài/tuần. Cân nhắc dời thi thay vì nén lộ trình.`;

  return {
    remaining,
    weeksLeft,
    requiredPerWeek,
    weeklyTarget,
    status,
    degraded,
    message,
  };
}

/** Whole weeks from `today` to `target` (YYYY-MM-DD), floored at the day level. */
export function weeksBetween(today: Date, target: string): number {
  const days = daysUntil(today, target);
  return Math.floor(days / 7);
}

/** Calendar days from `today` to `target` (YYYY-MM-DD). Negative if past. */
export function daysUntil(today: Date, target: string): number {
  const [y, m, d] = target.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const end = Date.UTC(y, m - 1, d);
  const start = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return Math.round((end - start) / 86_400_000);
}

/** How many of `dates` (YYYY-MM-DD) fall within the trailing `days` window. */
export function countRecentSessions(
  dates: string[],
  days = DEGRADED_WINDOW_DAYS,
  today = new Date(),
): number {
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const from = toISODate(cutoff);
  const to = toISODate(today);
  return new Set(dates.filter((date) => date >= from && date <= to)).size;
}

/**
 * The earliest sensible exam date: the remaining required lessons at the
 * weekly target, plus two weeks of buffer before the test.
 */
export function suggestedExamDate(
  remaining: number,
  weeklyTarget: number,
  today = new Date(),
): string {
  const weeks = Math.ceil(remaining / Math.max(1, weeklyTarget)) + 2;
  const date = new Date(today);
  date.setDate(date.getDate() + weeks * 7);
  return toISODate(date);
}

const round1 = (n: number) => Math.round(n * 10) / 10;
