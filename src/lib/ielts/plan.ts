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
  /** Occurrences expected in a week where the slot is active. */
  count: number;
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
  count: 2,
  minutes: 45,
  hint: "Ghi band ước tính và 1–3 lỗi gia sư sửa. Nhờ gia sư để ý cùng nhóm lỗi bạn hay sai khi viết.",
  tool: "speaking",
};

const GRAMMAR: WeeklySlot = {
  slot: "grammar",
  key: "grammar",
  label: "Drill ngữ pháp",
  count: 3,
  minutes: 10,
  hint: "Đánh vào nhóm lỗi lặp nhiều nhất trong kho lỗi của bạn.",
};

function writingSlot(
  key: string,
  label: string,
  count: number,
  minutes: number,
  hint: string,
): WeeklySlot {
  return { slot: "writing", key, label, count, minutes, hint, tool: "writing" };
}

function rewriteSlot(count: number, minutes: number): WeeklySlot {
  return {
    slot: "rewrite",
    key: "rewrite",
    label: "Viết lại bài đã sửa",
    count,
    minutes,
    hint: "Làm vào ngày hôm sau, không làm ngay sau khi nhận feedback.",
    tool: "writing",
  };
}

const TIMED_READING: WeeklySlot = {
  slot: "timed-reading",
  key: "timed-reading",
  label: "Reading bấm giờ",
  count: 1,
  minutes: 25,
  hint: "Một passage, đúng giờ. Mỗi câu sai ghi một dòng vì sao sai.",
  tool: "track",
};

const TIMED_LISTENING: WeeklySlot = {
  slot: "timed-listening",
  key: "timed-listening",
  label: "Listening bấm giờ",
  count: 1,
  minutes: 25,
  hint: "Một section, đúng giờ. Nghe lại phần sai kèm transcript.",
  tool: "track",
};

const MOCK: WeeklySlot = {
  slot: "mock",
  key: "mock",
  label: "Mock Listening + Reading",
  count: 1,
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
        2,
        25,
        "120–150 từ theo gợi ý đời thường. Viết cho chạy tay, không cần chuẩn IELTS.",
      ),
      rewriteSlot(2, 20),
      GRAMMAR,
      TUTOR,
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
        2,
        30,
        "Tuần 1–2 viết một đến hai đoạn body. Tuần 3–4 viết essay 4 đoạn, chưa bấm giờ.",
      ),
      rewriteSlot(2, 25),
      TIMED_READING,
      TIMED_LISTENING,
      GRAMMAR,
      TUTOR,
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
        1,
        60,
        "Chuẩn phòng thi: 40 phút viết, 20 phút đọc feedback và chọn lỗi.",
      ),
      rewriteSlot(1, 30),
      {
        ...writingSlot(
          "writing-task1",
          "Task 1",
          1,
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
        1,
        40,
        "Không đề mới lạ. Viết lại một đề đã làm để thấy mình chắc hơn.",
      ),
      { ...TIMED_LISTENING, minutes: 30 },
      { ...TIMED_READING, minutes: 30 },
      TUTOR,
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
