import { toISODate } from "./srs";

/**
 * Roadmap v3 — see docs/ielts/ROADMAP.md.
 *
 * v1 and v2 both modelled the roadmap as one linear queue of dated lessons.
 * That shape was wrong twice over: it forced four skills that improve in
 * different ways into a single lesson-per-day rotation, and it advanced by
 * calendar rather than by what the learner could actually do.
 *
 * v3 models three things instead:
 *  - DAILY targets (input + SRS) — the habit unit, ~25-30 minutes.
 *  - WEEKLY slots (writing, timed practice, tutor, mock) — cadence per skill.
 *  - PHASES with EXIT CRITERIA evaluated against real data, never the date.
 *
 * Everything here is pure. Evaluating progress against it lives in
 * ./progress.ts, and the stored phase lives in the `phase_state` table.
 */

export type PhaseId = "return" | "format" | "build" | "taper";
export type GradingMode = "coach" | "band";

/** Tag written to `study_session.slot`, the unit of daily/weekly accounting. */
export type SlotId =
  | "input"
  | "srs"
  | "writing"
  | "rewrite"
  | "timed-listening"
  | "timed-reading"
  | "mock"
  | "tutor"
  | "grammar";

/**
 * How much of the week's schedule the learner is taking on.
 *
 * Roadmap v3 first modelled the week as a bag of counts with no days attached,
 * which left "what do I do today?" unanswered — the learner had to schedule
 * themselves every morning. The week now has fixed weekdays, and this is the
 * dial that makes a fixed schedule survive a busy week: a light week keeps the
 * core four days, a full week runs all six. Nothing is ever "late" — the
 * counters still close on Sunday, not on the assigned day.
 */
export type WeekLoad = "light" | "normal" | "full";
export const WEEK_LOADS: WeekLoad[] = ["light", "normal", "full"];
export const WEEK_LOAD_DEFAULT: WeekLoad = "normal";
export const WEEK_LOAD_LABEL: Record<WeekLoad, string> = {
  light: "Tuần bận",
  normal: "Tuần thường",
  full: "Tuần rảnh",
};
export const WEEK_LOAD_HINT: Record<WeekLoad, string> = {
  light: "Giữ bốn buổi lõi. Đủ để không mất đà.",
  normal: "Năm buổi. Nhịp mặc định của lộ trình.",
  full: "Sáu buổi, chạy hết lịch tuần.",
};

const LOAD_RANK: Record<WeekLoad, number> = { light: 0, normal: 1, full: 2 };

/** ISO-8601 weekday: 1 = Monday … 7 = Sunday. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
  7: "Chủ nhật",
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
  7: "CN",
};

/** A fixed day of the training week. */
export interface ScheduledDay {
  day: Weekday;
  /** Weekly slot keys done on this day, in the order they should be done. */
  keys: string[];
  /** The lightest week load at which this day still happens. */
  minLoad: WeekLoad;
}

export interface DailyTarget {
  slot: Extract<SlotId, "input" | "srs">;
  /** Distinguishes the two input targets, which share one slot tag. */
  key: "input-listen" | "input-read" | "srs";
  label: string;
  minutes: number;
  hint: string;
}

export interface WeeklySlot {
  slot: SlotId;
  key: string;
  label: string;
  minutes: number;
  hint: string;
  tool?: "writing" | "track" | "speaking";
  /** 1 = every week (default). 2 = alternate weeks, 3 = every third week. */
  everyNWeeks?: number;
}

export interface ExitCriterion {
  id:
    | "input-days"
    | "writing-count"
    | "error-density"
    | "baseline"
    | "essay-length"
    | "format-weeks"
    | "mock-count"
    | "exam-date";
  label: string;
  /** Threshold the criterion is compared against; read by ./progress.ts. */
  target: number;
}

export interface Phase {
  id: PhaseId;
  index: 0 | 1 | 2 | 3;
  label: string;
  goal: string;
  /** Writing feedback style. Coach = no band, language errors only. */
  gradingMode: GradingMode;
  /** Planned length, for calendar display only — never for advancing. */
  plannedWeeks: number;
  daily: DailyTarget[];
  weekly: WeeklySlot[];
  /**
   * The fixed training week. Weekly targets are DERIVED from this (see
   * `weeklyTargets`) rather than authored twice, so the schedule the learner
   * follows and the counters they are judged against can never disagree.
   */
  schedule: ScheduledDay[];
  exit: ExitCriterion[];
}

/* ─────────────────────────── thresholds ─────────────────────────── */

/** Errors per 100 words that ends each of the first two phases. */
export const DENSITY_EXIT_RETURN = 5;
export const DENSITY_EXIT_FORMAT = 4;
/** Days with input needed out of the phase's first 21, to leave "return". */
export const INPUT_DAYS_EXIT_RETURN = 14;
export const WRITING_COUNT_EXIT_RETURN = 6;
/** A Task 2 essay must reach this to count for the "format" exit. */
export const ESSAY_WORDS_EXIT_FORMAT = 250;
/** Timed mocks expected before the taper. */
export const MOCK_COUNT_EXIT_BUILD = 4;
/** Mock cadence inside the build phase. */
export const MOCK_EVERY_N_WEEKS = 3;
/** Weeks of question-type curriculum in the format phase. */
export const FORMAT_WEEK_COUNT = 4;

/* ─────────────────────────── daily targets ─────────────────────────── */

function daily(listen: number, read: number, srs = 10): DailyTarget[] {
  return [
    {
      slot: "input",
      key: "input-listen",
      label: "Nghe",
      minutes: listen,
      hint: "Podcast hoặc video khi di chuyển. Không cần bấm giờ, không cần chấm.",
    },
    {
      slot: "input",
      key: "input-read",
      label: "Đọc",
      minutes: read,
      hint: "Một bài báo ngắn. Gạch 3–5 cụm từ mới nếu thấy hay.",
    },
    {
      slot: "srs",
      key: "srs",
      label: "Ôn lỗi",
      minutes: srs,
      hint: "Làm đầu buổi, trước mọi việc khác.",
    },
  ];
}

/* ─────────────────────────── weekly slots ─────────────────────────── */

const TUTOR: WeeklySlot = {
  slot: "tutor",
  key: "tutor",
  label: "Buổi gia sư",
  minutes: 45,
  hint: "Ghi band ước tính và 1–3 lỗi gia sư sửa. Nhờ gia sư để ý cùng nhóm lỗi bạn hay sai khi viết.",
  tool: "speaking",
};

const GRAMMAR: WeeklySlot = {
  slot: "grammar",
  key: "grammar",
  label: "Drill ngữ pháp",
  minutes: 10,
  hint: "Đánh vào nhóm lỗi lặp nhiều nhất trong kho lỗi của bạn.",
};

function writingSlot(
  key: string,
  label: string,
  minutes: number,
  hint: string,
): WeeklySlot {
  return { slot: "writing", key, label, minutes, hint, tool: "writing" };
}

function rewriteSlot(minutes: number): WeeklySlot {
  return {
    slot: "rewrite",
    key: "rewrite",
    label: "Viết lại bài đã sửa",
    minutes,
    hint: "Làm vào ngày hôm sau, không làm ngay sau khi nhận feedback.",
    tool: "writing",
  };
}

const TIMED_READING: WeeklySlot = {
  slot: "timed-reading",
  key: "timed-reading",
  label: "Reading bấm giờ",
  minutes: 25,
  hint: "Một passage, đúng giờ. Mỗi câu sai ghi một dòng vì sao sai.",
  tool: "track",
};

const TIMED_LISTENING: WeeklySlot = {
  slot: "timed-listening",
  key: "timed-listening",
  label: "Listening bấm giờ",
  minutes: 25,
  hint: "Một section, đúng giờ. Nghe lại phần sai kèm transcript.",
  tool: "track",
};

const MOCK: WeeklySlot = {
  slot: "mock",
  key: "mock",
  label: "Mock Listening + Reading",
  minutes: 180,
  hint: "Khung 3 giờ cuối tuần, ngoài quỹ ngày. Nhập cả band Listening và Reading.",
  tool: "track",
  everyNWeeks: MOCK_EVERY_N_WEEKS,
};

/* ─────────────────────────── the four phases ─────────────────────────── */

export const PHASES: Phase[] = [
  {
    id: "return",
    index: 0,
    label: "Giai đoạn 0 — Quay lại",
    goal: "Ngồi xuống mỗi ngày, và triệt năm nhóm lỗi ngữ pháp cơ bản. Chưa đo band.",
    gradingMode: "coach",
    plannedWeeks: 3,
    daily: daily(20, 10),
    weekly: [
      writingSlot(
        "writing-free",
        "Viết tự do",
        25,
        "120–150 từ theo gợi ý đời thường. Viết cho chạy tay, không cần chuẩn IELTS.",
      ),
      rewriteSlot(20),
      GRAMMAR,
      TUTOR,
    ],
    schedule: [
      { day: 1, keys: ["writing-free"], minLoad: "light" },
      { day: 2, keys: ["rewrite", "grammar"], minLoad: "light" },
      { day: 3, keys: ["tutor"], minLoad: "light" },
      { day: 4, keys: ["writing-free"], minLoad: "light" },
      { day: 5, keys: ["rewrite", "grammar"], minLoad: "normal" },
      { day: 6, keys: ["tutor", "grammar"], minLoad: "full" },
    ],
    exit: [
      {
        id: "input-days",
        label: "Có ít nhất 14 ngày tiếp nhận trong 21 ngày đầu",
        target: INPUT_DAYS_EXIT_RETURN,
      },
      {
        id: "writing-count",
        label: "Đã viết 6 bài và có thẻ lỗi",
        target: WRITING_COUNT_EXIT_RETURN,
      },
      {
        id: "error-density",
        label: "Hai bản viết lại gần nhất dưới 5 lỗi / 100 từ",
        target: DENSITY_EXIT_RETURN,
      },
    ],
  },
  {
    id: "format",
    index: 1,
    label: "Giai đoạn 1 — Học format",
    goal: "Biết từng dạng câu hỏi, viết được essay đủ cấu trúc, rồi đo baseline thật.",
    gradingMode: "coach",
    plannedWeeks: 4,
    daily: daily(20, 10),
    weekly: [
      writingSlot(
        "writing-structured",
        "Viết theo đề Task 2",
        30,
        "Tuần 1–2 viết một đến hai đoạn body. Tuần 3–4 viết essay 4 đoạn, chưa bấm giờ.",
      ),
      rewriteSlot(25),
      TIMED_READING,
      TIMED_LISTENING,
      GRAMMAR,
      TUTOR,
    ],
    schedule: [
      { day: 1, keys: ["writing-structured"], minLoad: "light" },
      { day: 2, keys: ["rewrite", "grammar"], minLoad: "light" },
      { day: 3, keys: ["timed-listening", "tutor"], minLoad: "light" },
      { day: 4, keys: ["writing-structured"], minLoad: "light" },
      { day: 5, keys: ["rewrite", "grammar"], minLoad: "normal" },
      { day: 6, keys: ["timed-reading", "grammar", "tutor"], minLoad: "full" },
    ],
    exit: [
      {
        id: "format-weeks",
        label: "Đã học đủ 4 tuần dạng câu hỏi",
        target: FORMAT_WEEK_COUNT,
      },
      {
        id: "essay-length",
        label: "Viết được essay 4 đoạn từ 250 từ",
        target: ESSAY_WORDS_EXIT_FORMAT,
      },
      {
        id: "error-density",
        label: "Mật độ lỗi dưới 4 / 100 từ",
        target: DENSITY_EXIT_FORMAT,
      },
      {
        id: "baseline",
        label:
          "Đã làm baseline thật (L đủ 4 section, R đủ 3 passage, 1 Task 2)",
        target: 1,
      },
    ],
  },
  {
    id: "build",
    index: 2,
    label: "Giai đoạn 2 — Nâng band",
    goal: "Đẩy Listening/Reading về 7.5, giữ Writing/Speaking ở 6.0, luyện sức bền.",
    gradingMode: "band",
    plannedWeeks: 12,
    daily: daily(25, 15),
    weekly: [
      writingSlot(
        "writing-task2",
        "Task 2 đúng 40 phút",
        60,
        "Chuẩn phòng thi: 40 phút viết, 20 phút đọc feedback và chọn lỗi.",
      ),
      rewriteSlot(30),
      {
        ...writingSlot(
          "writing-task1",
          "Task 1",
          30,
          "Mỗi hai tuần một bài, ưu tiên dạng biểu đồ bạn hay sai.",
        ),
        everyNWeeks: 2,
      },
      { ...TIMED_LISTENING, minutes: 45 },
      { ...TIMED_READING, minutes: 50 },
      MOCK,
      TUTOR,
    ],
    schedule: [
      { day: 1, keys: ["writing-task2"], minLoad: "light" },
      { day: 2, keys: ["timed-listening"], minLoad: "light" },
      { day: 3, keys: ["rewrite", "tutor"], minLoad: "light" },
      { day: 4, keys: ["timed-reading"], minLoad: "light" },
      { day: 5, keys: ["writing-task1", "tutor"], minLoad: "normal" },
      // The mock is a three-hour block, so it only lands on a week the learner
      // has said is free. Missing one costs a phase exit criterion, which is
      // why the Today page nudges a mock week towards "Tuần rảnh".
      { day: 6, keys: ["mock"], minLoad: "full" },
    ],
    exit: [
      {
        id: "mock-count",
        label: "Đã làm 4 mock có band",
        target: MOCK_COUNT_EXIT_BUILD,
      },
      { id: "exam-date", label: "Đã chốt ngày thi", target: 1 },
    ],
  },
  {
    id: "taper",
    index: 3,
    label: "Giai đoạn 3 — Trước thi",
    goal: "Giảm tải, giữ phong độ, chỉ ôn lỗi tồn. Không nạp bài mới.",
    gradingMode: "band",
    plannedWeeks: 3,
    daily: daily(15, 10),
    weekly: [
      writingSlot(
        "writing-taper",
        "Một bài giữ tay",
        40,
        "Không đề mới lạ. Viết lại một đề đã làm để thấy mình chắc hơn.",
      ),
      { ...TIMED_LISTENING, minutes: 30 },
      { ...TIMED_READING, minutes: 30 },
      TUTOR,
    ],
    schedule: [
      { day: 1, keys: ["writing-taper"], minLoad: "light" },
      { day: 2, keys: ["timed-listening"], minLoad: "light" },
      { day: 3, keys: ["tutor"], minLoad: "light" },
      { day: 4, keys: ["timed-reading"], minLoad: "light" },
      { day: 5, keys: ["tutor"], minLoad: "normal" },
    ],
    exit: [{ id: "exam-date", label: "Đến ngày thi", target: 1 }],
  },
];

export const FIRST_PHASE: PhaseId = "return";

/** Study days a week the learner is aiming for. Stored on the profile. */
export const WEEKLY_TARGET_DEFAULT = 5;

export function phaseById(id: PhaseId): Phase {
  const phase = PHASES.find((p) => p.id === id);
  if (!phase) throw new Error(`Không có giai đoạn ${id}.`);
  return phase;
}

export function nextPhaseId(id: PhaseId): PhaseId | null {
  const index = PHASES.findIndex((p) => p.id === id);
  return index >= 0 && index < PHASES.length - 1 ? PHASES[index + 1].id : null;
}

/** Planned week the phase starts on, for calendar display only. */
export function plannedStartWeek(id: PhaseId): number {
  let week = 1;
  for (const phase of PHASES) {
    if (phase.id === id) return week;
    week += phase.plannedWeeks;
  }
  return week;
}

/**
 * Weeks the roadmap still expects, counting the rest of the current phase plus
 * every phase after it. This is what the exam date is measured against in v3:
 * there is no fixed lesson count left to divide by weeks any more.
 */
export function plannedWeeksRemaining(
  id: PhaseId,
  weekInPhase: number,
): number {
  const index = PHASES.findIndex((p) => p.id === id);
  if (index < 0) return 0;
  const current = Math.max(0, PHASES[index].plannedWeeks - weekInPhase + 1);
  const later = PHASES.slice(index + 1).reduce(
    (sum, phase) => sum + phase.plannedWeeks,
    0,
  );
  return current + later;
}

export const PLANNED_WEEKS_TOTAL = PHASES.reduce(
  (sum, phase) => sum + phase.plannedWeeks,
  0,
);

/** Slots active in a given week of the phase (1-based), honouring everyNWeeks. */
export function slotsForWeek(phase: Phase, weekInPhase: number): WeeklySlot[] {
  return phase.weekly.filter((slot) => {
    const every = slot.everyNWeeks ?? 1;
    return every === 1 || weekInPhase % every === 0;
  });
}

/** True when `load` is at least as heavy as `minLoad`. */
function loadIncludes(load: WeekLoad, minLoad: WeekLoad): boolean {
  return LOAD_RANK[load] >= LOAD_RANK[minLoad];
}

function slotByKey(phase: Phase, key: string): WeeklySlot | undefined {
  return phase.weekly.find((slot) => slot.key === key);
}

/**
 * The days actually scheduled for a given week: those the load reaches, with
 * keys whose slot is off-cadence this week (`everyNWeeks`) removed. A day left
 * with no keys is dropped rather than shown empty.
 */
export function daysForWeek(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
): ScheduledDay[] {
  const active = new Set(slotsForWeek(phase, weekInPhase).map((s) => s.key));
  return phase.schedule
    .filter((day) => loadIncludes(load, day.minLoad))
    .map((day) => ({ ...day, keys: day.keys.filter((k) => active.has(k)) }))
    .filter((day) => day.keys.length > 0);
}

/** Study days the schedule asks for in this week — the "4-5 buổi" figure. */
export function studyDaysForWeek(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
): number {
  return daysForWeek(phase, load, weekInPhase).length;
}

/**
 * Weekly target per slot, counted off the schedule.
 *
 * Sessions record a `SlotId`, not a schedule key, and one slot can appear
 * under several keys in a week (Task 2 and Task 1 are both `writing`), so the
 * occurrences of every key collapse onto their slot here.
 */
export function weeklyTargets(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
): Map<SlotId, number> {
  const targets = new Map<SlotId, number>();
  for (const day of daysForWeek(phase, load, weekInPhase)) {
    for (const key of day.keys) {
      const slot = slotByKey(phase, key);
      if (!slot) continue;
      targets.set(slot.slot, (targets.get(slot.slot) ?? 0) + 1);
    }
  }
  return targets;
}

/**
 * How many times `slot` is scheduled on or before `weekday`.
 *
 * This is what makes a fixed schedule forgiving: an item assigned to Tuesday
 * counts as done once the week holds that many sessions of the slot, whoever
 * day they actually happened on. Slipping a day never creates a debt, it just
 * moves the work later in the same week.
 */
export function scheduledByWeekday(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
  weekday: Weekday,
  slot: SlotId,
): number {
  let seen = 0;
  for (const day of daysForWeek(phase, load, weekInPhase)) {
    if (day.day > weekday) continue;
    for (const key of day.keys) {
      if (slotByKey(phase, key)?.slot === slot) seen++;
    }
  }
  return seen;
}

/** Minutes of weekly work the schedule asks for, excluding the daily habit. */
export function weeklyMinutes(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
): number {
  let total = 0;
  for (const day of daysForWeek(phase, load, weekInPhase)) {
    for (const key of day.keys) total += slotByKey(phase, key)?.minutes ?? 0;
  }
  return total;
}

/** The training day for `weekday`, or null when the schedule rests. */
export function dayForWeekday(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
  weekday: Weekday,
): ScheduledDay | null {
  return (
    daysForWeek(phase, load, weekInPhase).find((d) => d.day === weekday) ?? null
  );
}

export function weeklySlotByKey(
  phase: Phase,
  key: string,
): WeeklySlot | undefined {
  return slotByKey(phase, key);
}

/**
 * Slots with no tool behind them, which the learner therefore ticks by hand.
 * Derived rather than listed so it stays correct when slots change: anything
 * that has a tool must be logged by saving real work in that tool, otherwise
 * a mock could be ticked off without ever producing the bands it exists for.
 */
export function selfLoggableSlots(): SlotId[] {
  const withTool = new Set<SlotId>();
  const all = new Set<SlotId>();
  for (const phase of PHASES) {
    for (const slot of phase.weekly) {
      all.add(slot.slot);
      if (slot.tool) withTool.add(slot.slot);
    }
  }
  return [...all].filter((slot) => !withTool.has(slot));
}

export function isSelfLoggable(slot: string): slot is SlotId {
  return (selfLoggableSlots() as string[]).includes(slot);
}

/* ────────────────── question-type curriculum (format phase) ────────────────── */

export interface FormatWeek {
  week: number;
  reading: string;
  listening: string;
  writing: string;
}

export const FORMAT_WEEKS: FormatWeek[] = [
  {
    week: 1,
    reading: "True / False / Not Given",
    listening: "Form và note completion",
    writing: "Một đoạn body cho một đề Task 2",
  },
  {
    week: 2,
    reading: "Matching headings",
    listening: "Map và plan labelling",
    writing: "Hai đoạn body cho cùng một đề",
  },
  {
    week: 3,
    reading: "Matching information và features",
    listening: "Matching",
    writing: "Essay 4 đoạn, không bấm giờ",
  },
  {
    week: 4,
    reading: "Gap fill và MCQ",
    listening: "MCQ",
    writing: "Essay 4 đoạn, không bấm giờ",
  },
];

export function formatWeek(weekInPhase: number): FormatWeek | null {
  return FORMAT_WEEKS.find((w) => w.week === weekInPhase) ?? null;
}

/* ─────────────────────────── misc helpers ─────────────────────────── */

const DAY_MS = 86_400_000;

function utcOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

/** ISO weekday of `date` (YYYY-MM-DD): 1 = Monday … 7 = Sunday. */
export function weekdayOf(date: string): Weekday {
  const dow = new Date(utcOf(date)).getUTCDay();
  return (dow === 0 ? 7 : dow) as Weekday;
}

/**
 * The Monday on or before `date`.
 *
 * Weeks are Monday-to-Sunday because the schedule is written in weekdays. If
 * weeks were counted as 7-day blocks from whenever the phase happened to open,
 * "Thứ Ba" would drift to a different position in the week every phase.
 */
export function mondayOf(date: string): string {
  const shifted = new Date(utcOf(date) - (weekdayOf(date) - 1) * DAY_MS);
  return shifted.toISOString().slice(0, 10);
}

/** Consecutive days (ending today or yesterday) that have >=1 study date. */
export function computeStreak(studyDates: string[], now = new Date()): number {
  const set = new Set(studyDates);
  let streak = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Allow the streak to still count if today isn't logged yet but yesterday is.
  if (!set.has(toISODate(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (set.has(toISODate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
