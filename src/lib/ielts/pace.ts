import { toISODate } from "./srs";

/**
 * Pace and reduced-load detection for roadmap v3.
 *
 * v2 measured pace as "required lessons left divided by weeks left", which
 * only worked while the plan was a fixed queue. v3 has phases with exit
 * criteria, so the honest question is: does the roadmap still fit before the
 * exam date? That is planned weeks remaining against calendar weeks remaining.
 */

export type PaceStatus = "no-exam" | "on-track" | "behind" | "at-risk";

/** Study days in the last 14 below this ⇒ reduced-load mode. */
export const DEGRADED_SESSION_THRESHOLD = 6;
export const DEGRADED_WINDOW_DAYS = 14;
/** Weeks of slack that still counts as merely "behind" rather than at risk. */
const AT_RISK_SLACK = -3;

export interface PaceInput {
  /** From `plannedWeeksRemaining()` in ./plan.ts. */
  plannedWeeksRemaining: number;
  studyDaysLast14: number;
  examDate?: string | null;
  today?: Date;
}

export interface PaceReport {
  plannedWeeksRemaining: number;
  /** Whole weeks left until the exam; null when no exam date is set. */
  weeksLeft: number | null;
  /** Weeks of slack: calendar weeks minus planned weeks. */
  slack: number | null;
  status: PaceStatus;
  degraded: boolean;
  message: string;
}

export function paceStatus(input: PaceInput): PaceReport {
  const today = input.today ?? new Date();
  const planned = Math.max(0, input.plannedWeeksRemaining);
  const degraded = input.studyDaysLast14 < DEGRADED_SESSION_THRESHOLD;

  if (!input.examDate) {
    return {
      plannedWeeksRemaining: planned,
      weeksLeft: null,
      slack: null,
      status: "no-exam",
      degraded,
      message: `Chưa đặt ngày thi. Lộ trình còn khoảng ${planned} tuần nữa theo kế hoạch.`,
    };
  }

  const weeksLeft = weeksBetween(today, input.examDate);
  const slack = weeksLeft - planned;

  const status: PaceStatus =
    slack >= 1 ? "on-track" : slack >= AT_RISK_SLACK ? "behind" : "at-risk";

  const message =
    status === "on-track"
      ? `Đúng nhịp: còn ${weeksLeft} tuần tới ngày thi, kế hoạch cần ${planned} tuần.`
      : status === "behind"
        ? `Hơi chậm: còn ${weeksLeft} tuần nhưng kế hoạch cần ${planned} tuần. Bù bằng ngày bù, chưa cần dời thi.`
        : `Không kịp: còn ${weeksLeft} tuần cho ${planned} tuần kế hoạch. Nên dời ngày thi thay vì nén giai đoạn.`;

  return {
    plannedWeeksRemaining: planned,
    weeksLeft,
    slack,
    status,
    degraded,
    message,
  };
}

/** Whole weeks from `today` to `target` (YYYY-MM-DD), floored at the day level. */
export function weeksBetween(today: Date, target: string): number {
  return Math.floor(daysUntil(today, target) / 7);
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

/** The earliest sensible exam date: the plan's remaining weeks plus a buffer. */
export function suggestedExamDate(
  plannedWeeksRemaining: number,
  today = new Date(),
): string {
  const date = new Date(today);
  date.setDate(date.getDate() + (Math.max(0, plannedWeeksRemaining) + 2) * 7);
  return toISODate(date);
}

/** Study days inside the current calendar week window of `days` length. */
export function studyDaysThisWeek(
  dates: string[],
  weekStart: string,
  today = new Date(),
): number {
  const to = toISODate(today);
  return new Set(dates.filter((d) => d >= weekStart && d <= to)).size;
}
