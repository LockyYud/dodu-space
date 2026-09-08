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
  /**
   * Days since the roadmap started. Reduced-load mode compares the last 14
   * days, so it is meaningless before 14 days exist: without this a plan that
   * began today reported "the last 14 days are too sparse" on day one.
   */
  daysSincePlanStart?: number;
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
  const windowIsMeaningful =
    (input.daysSincePlanStart ?? DEGRADED_WINDOW_DAYS) >= DEGRADED_WINDOW_DAYS;
  const degraded =
    windowIsMeaningful && input.studyDaysLast14 < DEGRADED_SESSION_THRESHOLD;

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

/**
 * Liệu quỹ giờ có mua nổi mục tiêu band hay không.
 *
 * `paceStatus` chỉ so số tuần với số tuần, nên một chuỗi tuần bận không hề làm
 * mục tiêu lung lay trên màn hình. Chênh lệch giờ là thứ đến sát ngày thi mới
 * lộ ra nếu không ai nói, và lúc đó thì không còn xoay được.
 */
export interface HoursInput {
  /** Giờ tập trung đã học, không tính nghe thụ động. */
  studied: number;
  /** Giờ tập trung kế hoạch còn lại — `plannedGuidedHours()` trong ./plan.ts. */
  planned: number;
  /** Overall hiện tại (baseline thật nếu có, không thì ước tính). */
  startOverall: number;
  targetOverall: number;
  hoursPerBand: [low: number, high: number];
}

export interface HoursOutlook {
  studied: number;
  planned: number;
  /** Tổng giờ sẽ có tới ngày thi nếu giữ đúng nhịp hiện tại. */
  projected: number;
  bandsNeeded: number;
  neededLow: number;
  neededHigh: number;
  /** Đủ cho mép lạc quan của khoảng. */
  funded: boolean;
  /** Đủ cho cả mép bi quan — mục tiêu được cấp vốn chắc chắn. */
  fullyFunded: boolean;
  message: string;
}

export function hoursOutlook(input: HoursInput): HoursOutlook {
  const projected = round1(input.studied + input.planned);
  const bandsNeeded = Math.max(0, input.targetOverall - input.startOverall);
  const [low, high] = input.hoursPerBand;
  const neededLow = Math.round(bandsNeeded * low);
  const neededHigh = Math.round(bandsNeeded * high);

  if (bandsNeeded === 0) {
    return {
      studied: round1(input.studied),
      planned: round1(input.planned),
      projected,
      bandsNeeded,
      neededLow,
      neededHigh,
      funded: true,
      fullyFunded: true,
      message: `Đã ở mục tiêu ${input.targetOverall.toFixed(1)}.`,
    };
  }

  const funded = projected >= neededLow;
  const fullyFunded = projected >= neededHigh;
  const head = `Tới ngày thi bạn sẽ học khoảng ${Math.round(projected)} giờ tập trung (đã học ${Math.round(input.studied)}). Từ ${input.startOverall.toFixed(1)} lên ${input.targetOverall.toFixed(1)} thường cần ${neededLow}–${neededHigh} giờ.`;
  const verdict = fullyFunded
    ? "Quỹ giờ đủ."
    : funded
      ? "Chỉ đủ ở mép lạc quan — cần học đều, không được hụt tuần nào."
      : "Quỹ giờ chưa đủ: nên tăng giờ mỗi tuần, lùi ngày thi, hoặc hạ mục tiêu.";

  return {
    studied: round1(input.studied),
    planned: round1(input.planned),
    projected,
    bandsNeeded,
    neededLow,
    neededHigh,
    funded,
    fullyFunded,
    message: `${head} ${verdict}`,
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
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

/**
 * The earliest of the given ISO dates, ignoring blanks. ISO dates sort
 * lexicographically, so string comparison is the date comparison.
 *
 * The plan anchor comes from two places that can disagree: the learner
 * profile, whose `plan_start` falls back to "today" while no profile row has
 * been saved, and the first phase row, which is written once and never moves.
 * Taking the earlier of the two keeps the anchor from sliding forward a day
 * at a time on a deployment where nobody has opened the profile form yet.
 */
export function earliestDate(
  ...dates: (string | null | undefined)[]
): string | null {
  let earliest: string | null = null;
  for (const date of dates) {
    if (!date) continue;
    if (earliest === null || date < earliest) earliest = date;
  }
  return earliest;
}

/** Whole days from `from` (YYYY-MM-DD) up to and including `today`. */
export function daysSince(from: string, today = new Date()): number {
  return -daysUntil(today, from);
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
