import {
  dayForWeekday,
  type ExitCriterion,
  FORMAT_WEEK_COUNT,
  mondayOf,
  nextPhaseId,
  type Phase,
  type PhaseId,
  phaseById,
  type ScheduledDay,
  type SlotId,
  scheduledByWeekday,
  studyDaysForWeek,
  WEEK_LOAD_DEFAULT,
  WEEKDAY_LABEL,
  WEEKDAY_SHORT,
  type Weekday,
  type WeekLoad,
  type WeeklySlot,
  weekdayOf,
  weeklySlotByKey,
  weeklyTargets,
} from "./plan";
import { toISODate } from "./srs";

/**
 * Evaluates roadmap v3 against real data: what today needs, what this week
 * needs, and whether the phase's exit criteria are met.
 *
 * Pure on purpose. v2's progress logic was spread across server actions and
 * page components, so the rules could not be tested and drifted from the doc.
 * Every threshold here comes from ./plan.ts.
 */

/** Minimal row shapes, so tests need no database. */
export interface SessionRow {
  date: string;
  skill: string;
  slot: string | null;
  durationMin: number | null;
}
export interface SubmissionRow {
  createdAt: string; // "YYYY-MM-DD..." or ISO
  wordCount: number | null;
  errorDensity: number | null;
  isRewrite: boolean;
}
export interface BandRow {
  date: string;
  listening: number | null;
  reading: number | null;
  isMock: boolean;
}

export interface PhaseState {
  phase: PhaseId;
  startedOn: string; // YYYY-MM-DD
}

export interface DailyItem {
  key: string;
  label: string;
  targetMinutes: number;
  doneMinutes: number;
  done: boolean;
  hint: string;
}

export interface WeeklyItem {
  slot: SlotId;
  label: string;
  hint: string;
  minutes: number;
  target: number;
  done: number;
  tool?: WeeklySlot["tool"];
}

/** One assigned piece of weekly work, on the day the schedule asks for it. */
export interface TodayItem {
  key: string;
  slot: SlotId;
  label: string;
  hint: string;
  minutes: number;
  done: boolean;
  tool?: WeeklySlot["tool"] /**
   * Why this cannot be done yet, if it cannot. A rewrite needs an essay to
   * rewrite, so on a week where the writing day was skipped the schedule
   * would otherwise send the learner to an empty page.
   */;
  blocked?: string;
}

/** One day of the training week, for the week strip on the Today page. */
export interface WeekDayPlan {
  day: Weekday;
  short: string;
  label: string;
  /** Empty on a rest day, or on a day this week's load does not reach. */
  items: TodayItem[];
  done: boolean;
  isToday: boolean;
  isPast: boolean;
}

export interface ExitStatus {
  id: ExitCriterion["id"];
  label: string;
  target: number;
  current: number;
  met: boolean;
  /** True when a lower number is better (error density). */
  lowerIsBetter: boolean;
}

export interface ProgressReport {
  phase: Phase;
  startedOn: string;
  weekInPhase: number;
  daily: DailyItem[];
  weekly: WeeklyItem[];
  /** The week load in force, which decides how many days are scheduled. */
  load: WeekLoad;
  weekday: Weekday;
  /** Weekly work assigned to today. Empty on a rest day. */
  todayWork: TodayItem[];
  /** True when the schedule asks for nothing today beyond the daily habit. */
  restDay: boolean;
  /** Study days the schedule asks for this week, at the current load. */
  studyDaysThisWeek: number;
  /** All seven days of the current week, in order. */
  week: WeekDayPlan[];
  exit: ExitStatus[];
  canAdvance: boolean;
  nextPhase: PhaseId | null;
  /** Whole days spent in the phase so far, 1-based on the first day. */
  daysInPhase: number;
}

export interface ProgressInput {
  state: PhaseState;
  sessions: SessionRow[];
  submissions: SubmissionRow[];
  bands: BandRow[];
  /** Cards due today. Zero due means the SRS habit has nothing left to do. */
  dueCount?: number;
  /** How heavy the learner said this week is. Defaults to a normal week. */
  load?: WeekLoad;
  examDate?: string | null;
  today?: Date;
}

const DAY_MS = 86_400_000;

function dayDiff(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  if (!fy || !ty) return 0;
  return Math.round(
    (Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / DAY_MS,
  );
}

/**
 * 1-based week of the phase that `date` falls in, counted in Monday-to-Sunday
 * calendar weeks. Week 1 is the week the phase opened in, however far into it
 * the phase started — the schedule is written in weekdays, so a week has to
 * mean the same thing to the plan and to the learner's calendar.
 */
export function weekInPhaseOf(startedOn: string, date: string): number {
  const offset = dayDiff(mondayOf(startedOn), date);
  return offset < 0 ? 0 : Math.floor(offset / 7) + 1;
}

function isoDay(value: string): string {
  return value.slice(0, 10);
}

export function buildProgress(input: ProgressInput): ProgressReport {
  const today = toISODate(input.today ?? new Date());
  const phase = phaseById(input.state.phase);
  const startedOn = input.state.startedOn;
  const daysInPhase = Math.max(1, dayDiff(startedOn, today) + 1);
  const weekInPhase = Math.max(1, weekInPhaseOf(startedOn, today));
  const weekday = weekdayOf(today);
  const load = input.load ?? WEEK_LOAD_DEFAULT;

  const sinceStart = input.sessions.filter(
    (s) => s.date >= startedOn && s.date <= today,
  );
  const submissionsSince = input.submissions.filter(
    (s) => isoDay(s.createdAt) >= startedOn,
  );
  // An essay can only be rewritten once, so the surplus of originals over
  // rewrites is how many rewrites are actually available to do.
  const rewritable = Math.max(
    0,
    submissionsSince.filter((x) => !x.isRewrite).length -
      submissionsSince.filter((x) => x.isRewrite).length,
  );
  const weekThrough = sinceStart.filter(
    (s) => weekInPhaseOf(startedOn, s.date) === weekInPhase && s.date <= today,
  );

  return {
    phase,
    startedOn,
    weekInPhase,
    daysInPhase,
    daily: dailyItems(phase, input.sessions, today, input.dueCount ?? 0),
    weekly: weeklyItems(phase, weekInPhase, sinceStart, startedOn, today, load),
    load,
    weekday,
    todayWork: todayWork(
      phase,
      weekInPhase,
      weekday,
      load,
      weekThrough,
      rewritable,
    ),
    restDay: dayForWeekday(phase, load, weekInPhase, weekday) === null,
    studyDaysThisWeek: studyDaysForWeek(phase, load, weekInPhase),
    week: weekPlan(phase, weekInPhase, weekday, load, weekThrough, rewritable),
    exit: exitStatuses({
      phase,
      startedOn,
      today,
      sessions: sinceStart,
      submissions: submissionsSince,
      allSubmissions: input.submissions,
      bands: input.bands,
      examDate: input.examDate,
    }),
    canAdvance: false, // replaced below
    nextPhase: nextPhaseId(phase.id),
  };
}

/** `buildProgress` plus the derived `canAdvance` flag. */
export function progressReport(input: ProgressInput): ProgressReport {
  const report = buildProgress(input);
  return {
    ...report,
    canAdvance: report.exit.length > 0 && report.exit.every((e) => e.met),
  };
}

function dailyItems(
  phase: Phase,
  sessions: SessionRow[],
  today: string,
  dueCount: number,
): DailyItem[] {
  const todays = sessions.filter((s) => s.date === today);
  return phase.daily.map((target) => {
    const matches = todays.filter((s) => {
      // Only the two input targets share a slot tag, so everything else can
      // match on the tag alone. Adding a daily target must not mean adding a
      // branch here.
      if (target.slot !== "input") return s.slot === target.slot;
      // Bất kỳ buổi nào của cùng kỹ năng cũng tính, không riêng slot "input":
      // 50 phút Reading bấm giờ **là** đọc, nên đòi thêm một bài báo 15 phút
      // trong cùng ngày là bắt làm hai lần một việc.
      return target.key === "input-listen"
        ? s.skill === "listening"
        : s.skill === "reading";
    });
    const doneMinutes = matches.reduce(
      (sum, s) => sum + (s.durationMin ?? 0),
      0,
    );
    // An empty review queue is a finished one: on a day with nothing due there
    // is no way to log a review, so requiring one capped the day at 2 of 3.
    const nothingToReview = target.key === "srs" && dueCount === 0;
    return {
      key: target.key,
      label: target.label,
      targetMinutes: target.minutes,
      doneMinutes,
      // Any logged attempt counts as done; the minutes are for the learner,
      // not a gate. Reduced-load days must still be able to close out.
      done: matches.length > 0 || nothingToReview,
      hint: target.hint,
    };
  });
}

function weeklyItems(
  phase: Phase,
  weekInPhase: number,
  sessions: SessionRow[],
  startedOn: string,
  today: string,
  load: WeekLoad,
): WeeklyItem[] {
  const targets = weeklyTargets(phase, load, weekInPhase);
  const thisWeek = sessions.filter(
    (s) => weekInPhaseOf(startedOn, s.date) === weekInPhase && s.date <= today,
  );

  const grouped = new Map<SlotId, WeeklyItem>();
  for (const slot of phase.weekly) {
    const target = targets.get(slot.slot);
    if (!target) continue; // not scheduled at this load, or off-cadence
    const existing = grouped.get(slot.slot);
    if (existing) {
      existing.label = `${existing.label} · ${slot.label}`;
      existing.hint = `${existing.hint} ${slot.hint}`;
      continue;
    }
    grouped.set(slot.slot, {
      slot: slot.slot,
      label: slot.label,
      hint: slot.hint,
      minutes: slot.minutes,
      target,
      done: 0,
      tool: slot.tool,
    });
  }

  for (const item of grouped.values()) {
    item.done = thisWeek.filter((s) => s.slot === item.slot).length;
  }
  return [...grouped.values()];
}

/**
 * The weekly work assigned to today, with each item's done state.
 *
 * An item is done once the week already holds as many sessions of its slot as
 * the schedule asks for on or before today. That is what keeps a fixed
 * schedule from turning into a debt ledger: doing Tuesday's writing on
 * Wednesday clears Tuesday, and only the week's total ever has to balance.
 */
function todayWork(
  phase: Phase,
  weekInPhase: number,
  weekday: Weekday,
  load: WeekLoad,
  weekThrough: SessionRow[],
  rewritable: number,
): TodayItem[] {
  const day: ScheduledDay | null = dayForWeekday(
    phase,
    load,
    weekInPhase,
    weekday,
  );
  if (!day) return [];

  const items: TodayItem[] = [];
  for (const key of day.keys) {
    const slot = weeklySlotByKey(phase, key);
    if (!slot) continue;
    const needed = scheduledByWeekday(
      phase,
      load,
      weekInPhase,
      weekday,
      slot.slot,
    );
    const doneSoFar = weekThrough.filter((s) => s.slot === slot.slot).length;
    const done = doneSoFar >= needed;
    items.push({
      key,
      slot: slot.slot,
      label: slot.label,
      hint: slot.hint,
      minutes: slot.minutes,
      done,
      tool: slot.tool,
      blocked:
        slot.slot === "rewrite" && !done && rewritable <= 0
          ? "Chưa có bài nào để viết lại — viết một bài mới trước."
          : undefined,
    });
  }
  return items;
}

function weekPlan(
  phase: Phase,
  weekInPhase: number,
  weekday: Weekday,
  load: WeekLoad,
  weekThrough: SessionRow[],
  rewritable: number,
): WeekDayPlan[] {
  const days: WeekDayPlan[] = [];
  for (let d = 1 as Weekday; d <= 7; d = (d + 1) as Weekday) {
    const items = todayWork(
      phase,
      weekInPhase,
      d,
      load,
      weekThrough,
      rewritable,
    );
    days.push({
      day: d,
      short: WEEKDAY_SHORT[d],
      label: WEEKDAY_LABEL[d],
      items,
      done: items.length > 0 && items.every((i) => i.done),
      isToday: d === weekday,
      isPast: d < weekday,
    });
  }
  return days;
}

function exitStatuses(args: {
  phase: Phase;
  startedOn: string;
  today: string;
  sessions: SessionRow[];
  submissions: SubmissionRow[];
  allSubmissions: SubmissionRow[];
  bands: BandRow[];
  examDate?: string | null;
}): ExitStatus[] {
  return args.phase.exit.map((criterion) => {
    const { current, lowerIsBetter } = measure(criterion, args);
    const met = lowerIsBetter
      ? current > 0 && current < criterion.target
      : current >= criterion.target;
    return {
      id: criterion.id,
      label: criterion.label,
      target: criterion.target,
      current,
      met,
      lowerIsBetter,
    };
  });
}

function measure(
  criterion: ExitCriterion,
  args: {
    startedOn: string;
    today: string;
    sessions: SessionRow[];
    submissions: SubmissionRow[];
    allSubmissions: SubmissionRow[];
    bands: BandRow[];
    examDate?: string | null;
  },
): { current: number; lowerIsBetter: boolean } {
  switch (criterion.id) {
    case "input-days": {
      // Distinct days with input inside the phase's first 21 days.
      const days = new Set(
        args.sessions
          .filter(
            (s) =>
              s.slot === "input" &&
              dayDiff(args.startedOn, s.date) >= 0 &&
              dayDiff(args.startedOn, s.date) < 21,
          )
          .map((s) => s.date),
      );
      return { current: days.size, lowerIsBetter: false };
    }
    case "writing-count":
      return {
        current: args.submissions.filter((s) => !s.isRewrite).length,
        lowerIsBetter: false,
      };
    case "error-density": {
      // The two most recent rewrites are the honest measure: they show what
      // the learner can produce after acting on feedback.
      const rewrites = args.allSubmissions
        .filter((s) => s.isRewrite && s.errorDensity != null)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, 2);
      if (rewrites.length < 2) return { current: 0, lowerIsBetter: true };
      const worst = Math.max(...rewrites.map((s) => s.errorDensity ?? 0));
      return { current: worst, lowerIsBetter: true };
    }
    case "essay-length":
      return {
        current: Math.max(0, ...args.submissions.map((s) => s.wordCount ?? 0)),
        lowerIsBetter: false,
      };
    case "format-weeks": {
      // Weeks of the phase in which at least one piece of writing was done.
      const weeks = new Set(
        args.sessions
          .filter((s) => s.slot === "writing")
          .map((s) => weekInPhaseOf(args.startedOn, s.date)),
      );
      return {
        current: Math.min(weeks.size, FORMAT_WEEK_COUNT),
        lowerIsBetter: false,
      };
    }
    case "baseline": {
      const hasBaseline = args.bands.some(
        (b) => b.listening != null && b.reading != null,
      );
      return { current: hasBaseline ? 1 : 0, lowerIsBetter: false };
    }
    case "mock-count":
      return {
        current: args.bands.filter(
          (b) => b.isMock && b.listening != null && b.reading != null,
        ).length,
        lowerIsBetter: false,
      };
    case "exam-date":
      return { current: args.examDate ? 1 : 0, lowerIsBetter: false };
  }
}

/** Errors per 100 words, rounded to one decimal. */
export function errorDensity(errorCount: number, wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.round((errorCount / wordCount) * 1000) / 10;
}
