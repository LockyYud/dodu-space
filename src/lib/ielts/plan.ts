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
  | "grammar"
  // Ba bổ sung từ METHOD-REVIEW §4–6, và cũng chính là phần giờ tăng thêm mà
  // quyết định quỹ giờ ở §3.3b cam kết.
  | "vocab"
  | "speak-drill"
  | "dictation";

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

/**
 * Phút "ngồi xuống" tối đa cho một buổi tối ngày thường.
 *
 * Lộ trình v3 xếp lịch theo "mỗi kỹ năng cần bao nhiêu" mà chưa bao giờ nhân
 * với "người học có bao nhiêu", nên giai đoạn 2 có bốn trong năm ngày vượt 60
 * phút, ngày nặng nhất 100. Ngày thường là buổi tối sau khi đi làm; việc dài
 * phải nằm ở cuối tuần. Có test khẳng định không ngày thường nào vượt mức này.
 */
export const WEEKDAY_DESK_CAP = 60;

/** Ngày thường theo ISO: thứ Hai đến thứ Sáu. Cuối tuần rộng hơn. */
export const WEEKDAY_MAX = 5;

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
  slot: Extract<SlotId, "input" | "srs" | "vocab" | "speak-drill">;
  /** Distinguishes the two input targets, which share one slot tag. */
  key: "input-listen" | "input-read" | "srs" | "vocab" | "speak-drill";
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
  /**
   * Suất chiếm trọn ngày của nó: những suất khác xếp cùng ngày bị bỏ trong tuần
   * mà suất này xuất hiện. Mock là khối ba giờ, không thể cộng thêm gì lên nữa.
   */
  exclusive?: boolean;
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

/* ─────────────────────── ngân sách giờ (METHOD-REVIEW §3) ─────────────────────── */

/**
 * Giờ học **tập trung** thường được dẫn cho mỗi band IELTS.
 *
 * Khoảng rộng là có ý: các nguồn đưa từ 120 đến 200 giờ, và con số đó là quy tắc
 * ngón tay cái chứ không phải phép đo trên một người học cụ thể. Dùng để phát
 * hiện chênh lệch cỡ lớn, đừng dùng để tính ngày thi tới từng tuần.
 */
export const HOURS_PER_BAND_LOW = 120;
export const HOURS_PER_BAND_HIGH = 200;

/**
 * Overall ước tính lúc bắt đầu lại (TOEIC LR 700 / SW 220 → L5.5 R5.5 W5.0 S5.0,
 * trung bình 5.25 → overall 5.5). Chỉ dùng khi `band_history` chưa có baseline
 * thật; có baseline rồi thì lấy số thật.
 */
export const START_OVERALL_ESTIMATE = 5.5;

/* ─────────────────── từ vựng (METHOD-REVIEW §4) ─────────────────── */

/** Mục từ vựng nhắm bắt mỗi ngày học. Qua 26 tuần ≈ 400–500 mục. */
export const VOCAB_DAILY_TARGET = 4;

/**
 * Trần **thẻ từ vựng mới** mỗi ngày.
 *
 * Bắt buộc phải có: thẻ từ vựng và thẻ lỗi dùng chung một hàng đợi SM-2, nên
 * không chặn thì từ vựng sẽ nhấn chìm thẻ lỗi — mà thẻ lỗi mới là thứ đang gỡ
 * trần band Writing.
 */
export const VOCAB_DAILY_CAP = 5;

/* ─────────────────────────── daily targets ─────────────────────────── */

/**
 * Phần hằng ngày của một giai đoạn.
 *
 * `speak` là ô 4/3/2 (METHOD-REVIEW §5) và chỉ mở từ giai đoạn 1 — giai đoạn 0
 * ưu tiên giữ được nhịp trước đã. Ô từ vựng có ở mọi giai đoạn vì nó gắn liền
 * với ô Đọc và gần như không tốn thêm thời gian.
 */
function daily(opts: {
  listen: number;
  read: number;
  srs?: number;
  /** Phút cho ô 4/3/2; bỏ trống là chưa mở ô này. */
  speak?: number;
  /** Giai đoạn trước thi tắt ô này: "không nạp bài mới" là nghĩa đúng của nó. */
  vocab?: false;
}): DailyTarget[] {
  const targets: DailyTarget[] = [
    {
      slot: "input",
      key: "input-listen",
      label: "Nghe",
      minutes: opts.listen,
      hint: "Podcast hoặc video khi di chuyển. Không cần bấm giờ, không cần chấm.",
    },
    {
      slot: "input",
      key: "input-read",
      label: "Đọc",
      minutes: opts.read,
      hint: "Một bài báo ngắn.",
    },
    ...(opts.vocab === false
      ? []
      : [
          {
            slot: "vocab" as const,
            key: "vocab" as const,
            label: "Bắt từ mới",
            minutes: 5,
            hint: `${VOCAB_DAILY_TARGET} cụm từ từ bài vừa đọc, kèm câu chứa nó. Cách dùng mới là thứ cần nhớ, không phải nghĩa rời.`,
          },
        ]),
    {
      slot: "srs",
      key: "srs",
      label: "Ôn lỗi",
      minutes: opts.srs ?? 10,
      hint: "Làm đầu buổi, trước mọi việc khác.",
    },
  ];

  if (opts.speak) {
    targets.push({
      slot: "speak-drill",
      key: "speak-drill",
      label: "Nói 4/3/2",
      minutes: opts.speak,
      hint: "Cùng một nội dung: nói 4 phút, rồi 3, rồi 2. Tự ghi âm, nghe lại lượt cuối.",
    });
  }
  return targets;
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

/**
 * Chép chính tả — luyện giải mã âm (METHOD-REVIEW §6).
 *
 * Nghiên cứu về L2 listening tách top-down (đoán ý từ ngữ cảnh) khỏi bottom-up
 * (giải mã âm, tách từ trong dòng nói liền), và phần bottom-up có tác dụng
 * riêng, không thay thế được bằng cách nghe nhiều hơn. Thước đo dùng lại đúng
 * `errorDensity()` của Writing: lỗi trên 100 từ.
 */
const DICTATION: WeeklySlot = {
  slot: "dictation",
  key: "dictation",
  label: "Chép chính tả",
  minutes: 10,
  hint: "Nghe 60–90 giây, chép nguyên văn, rồi đối chiếu transcript. Nhập số từ và số chỗ sai.",
};

const MOCK: WeeklySlot = {
  slot: "mock",
  key: "mock",
  label: "Mock Listening + Reading",
  minutes: 180,
  hint: "Khung 3 giờ cuối tuần, ngoài quỹ ngày. Nhập cả band Listening và Reading.",
  tool: "track",
  everyNWeeks: MOCK_EVERY_N_WEEKS,
  exclusive: true,
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
    daily: daily({ listen: 20, read: 10 }),
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
    // Ngày thường (T2–T6) là buổi tối sau khi đi làm: chỉ phần hằng ngày cộng
    // một việc ngắn, tối đa WEEKDAY_DESK_CAP phút. Thứ Sáu nghỉ hẳn. Việc dài
    // — viết cả bài, bấm giờ, mock — dồn vào T7 và CN, nơi thời gian có thật.
    schedule: [
      { day: 1, keys: ["rewrite"], minLoad: "light" },
      { day: 2, keys: ["grammar"], minLoad: "normal" },
      { day: 3, keys: ["rewrite"], minLoad: "light" },
      { day: 4, keys: ["grammar"], minLoad: "full" },
      { day: 6, keys: ["writing-free", "tutor"], minLoad: "light" },
      { day: 7, keys: ["writing-free", "grammar", "tutor"], minLoad: "light" },
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
    daily: daily({ listen: 20, read: 10, speak: 10 }),
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
    // Ngày thường (T2–T6) là buổi tối sau khi đi làm: chỉ phần hằng ngày cộng
    // một việc ngắn, tối đa WEEKDAY_DESK_CAP phút. Thứ Sáu nghỉ hẳn. Việc dài
    // — viết cả bài, bấm giờ, mock — dồn vào T7 và CN, nơi thời gian có thật.
    schedule: [
      { day: 1, keys: ["rewrite"], minLoad: "light" },
      { day: 2, keys: ["grammar"], minLoad: "normal" },
      { day: 3, keys: ["rewrite"], minLoad: "light" },
      { day: 4, keys: ["grammar"], minLoad: "full" },
      {
        day: 6,
        keys: ["writing-structured", "timed-listening", "tutor"],
        minLoad: "light",
      },
      {
        day: 7,
        keys: ["writing-structured", "timed-reading", "grammar", "tutor"],
        minLoad: "light",
      },
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
    // 12 → 16 tuần (2026-09-08): quỹ giờ của bản 22 tuần không đủ cho mục tiêu,
    // xem METHOD-REVIEW §3. Bốn tuần thêm vào đúng giai đoạn đắt nhất — L/R phải
    // lên +2.0 band — chứ không rải đều.
    plannedWeeks: 16,
    daily: daily({ listen: 25, read: 15, speak: 10 }),
    weekly: [
      writingSlot(
        "writing-task2",
        "Task 2 đúng 40 phút",
        60,
        "Chuẩn phòng thi: 40 phút viết, 20 phút đọc feedback và chọn lỗi.",
      ),
      // 20 phút, không phải 30: bản viết lại chỉ nhắm tối đa năm nhóm lỗi đã
      // chọn, và ngày thường chỉ còn 20 phút sau phần hằng ngày.
      rewriteSlot(20),
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
      DICTATION,
      MOCK,
      TUTOR,
    ],
    // Ngày thường (T2–T6) là buổi tối sau khi đi làm: chỉ phần hằng ngày cộng
    // một việc ngắn, tối đa WEEKDAY_DESK_CAP phút. Thứ Sáu nghỉ hẳn. Việc dài
    // — viết cả bài, bấm giờ, mock — dồn vào T7 và CN, nơi thời gian có thật.
    schedule: [
      { day: 1, keys: ["rewrite"], minLoad: "light" },
      { day: 2, keys: ["dictation"], minLoad: "light" },
      { day: 3, keys: ["dictation"], minLoad: "normal" },
      { day: 4, keys: ["dictation"], minLoad: "full" },
      // Mock là `exclusive`: tuần nào có mock thì thứ Bảy chỉ có mock, và hai
      // bài bấm giờ nhường chỗ — chính mock đã đo cả Listening và Reading.
      {
        day: 6,
        keys: ["timed-listening", "timed-reading", "mock", "tutor"],
        minLoad: "light",
      },
      {
        day: 7,
        keys: ["writing-task2", "writing-task1", "tutor"],
        minLoad: "light",
      },
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
    daily: daily({ listen: 15, read: 10, speak: 10, vocab: false }),
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
    // Ngày thường (T2–T6) là buổi tối sau khi đi làm: chỉ phần hằng ngày cộng
    // một việc ngắn, tối đa WEEKDAY_DESK_CAP phút. Thứ Sáu nghỉ hẳn. Việc dài
    // — viết cả bài, bấm giờ, mock — dồn vào T7 và CN, nơi thời gian có thật.
    schedule: [
      { day: 1, keys: ["timed-listening"], minLoad: "light" },
      { day: 2, keys: ["tutor"], minLoad: "light" },
      { day: 3, keys: ["timed-reading"], minLoad: "light" },
      { day: 4, keys: ["timed-listening"], minLoad: "normal" },
      { day: 6, keys: ["writing-taper", "tutor"], minLoad: "light" },
      { day: 7, keys: ["timed-reading"], minLoad: "full" },
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
    .map((day) => {
      const keys = day.keys.filter((k) => active.has(k));
      // Một suất `exclusive` chiếm trọn ngày của nó: mock ba giờ không thể cộng
      // thêm hai bài bấm giờ lên trên, và chính nó đã đo cả L lẫn R.
      const owner = keys.find((k) => slotByKey(phase, k)?.exclusive);
      return { ...day, keys: owner ? [owner] : keys };
    })
    .filter((day) => day.keys.length > 0);
}

/**
 * Suất diễn ra **ngoài** quỹ "ngồi xuống": buổi gia sư là hẹn với người thật,
 * mock là khối ba giờ cuối tuần. Cả hai không cạnh tranh với buổi tối ngày
 * thường, nên không tính vào `WEEKDAY_DESK_CAP`.
 */
const OUTSIDE_DESK = new Set<SlotId>(["tutor", "mock"]);

export function isOutsideDesk(slot: SlotId): boolean {
  return OUTSIDE_DESK.has(slot);
}

/** Phần hằng ngày phải ngồi xuống làm — nghe khi di chuyển không tính. */
export function dailyDeskMinutes(phase: Phase): number {
  const passive =
    phase.daily.find((d) => d.key === "input-listen")?.minutes ?? 0;
  return phase.daily.reduce((sum, d) => sum + d.minutes, 0) - passive;
}

/**
 * Phút phải ngồi xuống trong một ngày cụ thể: phần hằng ngày cộng việc của thứ
 * đó, trừ gia sư và mock. Đây là con số phải nằm trong quỹ buổi tối.
 */
export function deskMinutesForDay(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
  weekday: Weekday,
): number {
  const day = dayForWeekday(phase, load, weekInPhase, weekday);
  const work = (day?.keys ?? []).reduce((sum, key) => {
    const slot = slotByKey(phase, key);
    if (!slot || isOutsideDesk(slot.slot)) return sum;
    return sum + slot.minutes;
  }, 0);
  return dailyDeskMinutes(phase) + work;
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

/**
 * Phút học **tập trung** trong một tuần: việc theo lịch tuần, cộng phần hằng
 * ngày trừ đi nghe thụ động.
 *
 * Nghe podcast khi di chuyển là thật và đáng giữ, nhưng nó không phải "giờ học
 * có hướng dẫn" theo nghĩa mà mốc 120–200 giờ mỗi band đang dùng. Gộp nó vào
 * làm quỹ giờ trông đủ trong khi thực tế thiếu.
 */
export function guidedMinutesForWeek(
  phase: Phase,
  load: WeekLoad,
  weekInPhase: number,
): number {
  const days = studyDaysForWeek(phase, load, weekInPhase);
  return (
    weeklyMinutes(phase, load, weekInPhase) + dailyDeskMinutes(phase) * days
  );
}

/**
 * Giờ tập trung kế hoạch còn lại: phần còn lại của giai đoạn hiện tại cộng mọi
 * giai đoạn sau, tính ở mức tải `load`.
 */
export function plannedGuidedHours(
  id: PhaseId,
  weekInPhase: number,
  load: WeekLoad,
): number {
  const index = PHASES.findIndex((p) => p.id === id);
  if (index < 0) return 0;
  let minutes = 0;
  const current = PHASES[index];
  for (let w = weekInPhase; w <= current.plannedWeeks; w++) {
    minutes += guidedMinutesForWeek(current, load, w);
  }
  for (const later of PHASES.slice(index + 1)) {
    for (let w = 1; w <= later.plannedWeeks; w++) {
      minutes += guidedMinutesForWeek(later, load, w);
    }
  }
  return minutes / 60;
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
