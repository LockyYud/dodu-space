import type { Skill } from "./schema";
import { toISODate } from "./srs";

/**
 * The learner's roadmap v2, encoded as a lesson queue (see docs/ielts/ROADMAP.md).
 *
 * Design constraints that v1 got wrong and this version fixes:
 *  - 5 required lessons per week + a Saturday buffer; Sunday is never scheduled,
 *    so a busy day costs the buffer instead of breaking the plan.
 *  - Stage A is a 25'/day habit stage. Volume only grows after the habit gate
 *    (`habitGatePassed`) is met — 4 consecutive weeks at the weekly target.
 *  - Speaking is a first-class weekly lesson, not something living outside the app.
 *  - Week 1 forces a measured baseline, and every third-ish week forces a mock,
 *    so `band_history` is never empty and pace can be judged against real numbers.
 *
 * Progress is queue-based: a lesson only advances when it is marked done, so
 * pausing never skips or misattributes a lesson.
 */

export type Stage = "A" | "B1" | "B2";
export type LessonKind = "core" | "baseline" | "rewrite" | "mock" | "buffer";

export interface Activity {
  skill: Skill | "rest";
  /** The in-app tool opened by the lesson, when one exists. */
  tool?: "writing" | "track" | "speaking" | "review";
  kind: LessonKind;
  label: string;
  minutes: number;
  focus: string; // one-line goal of the day
  steps: { min: number; text: string }[];
  links?: { label: string; url: string }[];
  /** Writing topic of the week, when the lesson is a writing lesson. */
  topic?: string;
}

export interface Lesson {
  id: string;
  index: number; // 1-based across the whole sequence
  week: number;
  stage: Stage;
  /** Integer form of `stage`, stored in `study_session.phase` (A=0, B1=1, B2=2). */
  phase: 0 | 1 | 2;
  phaseLabel: string;
  dow: number;
  dowLabel: string;
  /** Buffer days are optional; everything else must be done to advance. */
  required: boolean;
  activity: Activity;
}

export const WEEKS_TOTAL = 20;
export const STAGE_A_LAST_WEEK = 4;
export const STAGE_B1_LAST_WEEK = 12;
/** Required lessons per week (Mon–Fri). Saturday is a buffer, Sunday is off. */
export const WEEKLY_TARGET_DEFAULT = 5;
/** Weeks whose Saturday is a timed L+R mock instead of a buffer. */
export const MOCK_WEEKS = [7, 10, 13, 16, 19];
/** Consecutive weeks at target needed before Stage A opens into Stage B1. */
export const HABIT_GATE_WEEKS = 4;

const RL_LINKS = [
  { label: "Mini-IELTS", url: "https://mini-ielts.com" },
  { label: "IELTS Online Tests", url: "https://ieltsonlinetests.com" },
];
const LISTEN_LINKS = [
  { label: "Mini-IELTS Listening", url: "https://mini-ielts.com/listening" },
  {
    label: "BBC 6 Minute English",
    url: "https://www.bbc.co.uk/learningenglish",
  },
];
const WRITING_SAMPLE_LINKS = [
  { label: "IELTS Liz — band 7+ mẫu", url: "https://ieltsliz.com" },
];

/** Task 2 topic rotation, one per week (see ROADMAP.md §2). */
const WRITING_TOPICS = [
  "Education",
  "Environment",
  "Technology",
  "Health",
  "Society & Crime",
  "Work & Career",
  "Culture & Media",
  "Government & Money",
];

export function topicForWeek(week: number): string {
  return WRITING_TOPICS[(week - 1) % WRITING_TOPICS.length];
}

export function stageOf(week: number): Stage {
  if (week <= STAGE_A_LAST_WEEK) return "A";
  return week <= STAGE_B1_LAST_WEEK ? "B1" : "B2";
}

export function phaseIndexOf(stage: Stage): 0 | 1 | 2 {
  return stage === "A" ? 0 : stage === "B1" ? 1 : 2;
}

export function phaseLabelOf(stage: Stage): string {
  return stage === "A"
    ? "Giai đoạn A — Thói quen"
    : stage === "B1"
      ? "Giai đoạn B1 — Xây nền"
      : "Giai đoạn B2 — Luyện đề";
}

export const isMockWeek = (week: number) => MOCK_WEEKS.includes(week);

/* ─────────────────────── Lesson builders per stage ─────────────────────── */

function writingLesson(week: number, stage: Stage): Activity {
  const topic = topicForWeek(week);
  if (stage === "A") {
    return {
      skill: "writing",
      tool: "writing",
      kind: "core",
      topic,
      label: `Writing ngắn — ${topic}`,
      minutes: 25,
      focus: "Một đoạn ngắn nhưng được chấm. Có đầu ra quan trọng hơn dài.",
      steps: [
        {
          min: 15,
          text: `Viết 1 đoạn body Task 2 (~120 từ) cho chủ đề tuần: ${topic}.`,
        },
        { min: 10, text: "Chấm bài → chọn tối đa 3 lỗi để lưu vào SRS." },
      ],
      links: WRITING_SAMPLE_LINKS,
    };
  }
  return {
    skill: "writing",
    tool: "writing",
    kind: "core",
    topic,
    label: `Writing Task 2 — ${topic}`,
    minutes: 60,
    focus: "Viết đúng giờ như phòng thi, rồi nạp lỗi vào SRS.",
    steps: [
      { min: 40, text: `Viết 1 essay Task 2 đúng 40 phút, chủ đề: ${topic}.` },
      { min: 20, text: "Chấm bài → đọc feedback → chọn lỗi lưu vào SRS." },
    ],
    links: WRITING_SAMPLE_LINKS,
  };
}

function rewriteLesson(week: number, stage: Stage): Activity {
  const topic = topicForWeek(week);
  if (stage === "A") {
    return {
      skill: "writing",
      tool: "writing",
      kind: "rewrite",
      topic,
      label: "Viết lại đoạn hôm T2",
      minutes: 25,
      focus: "Vòng lặp vàng: bước viết lại mới là thứ đẩy band.",
      steps: [
        {
          min: 20,
          text: "Mở bài đã chấm, viết lại đoạn yếu nhất theo đúng feedback.",
        },
        { min: 5, text: "So band trước/sau và ghi lại điều bạn đã sửa được." },
      ],
    };
  }
  return {
    skill: "writing",
    tool: "writing",
    kind: "rewrite",
    topic,
    label: "Viết lại Task 2 + Task 1",
    minutes: 50,
    focus: "Sửa bài cũ trước, viết bài mới sau.",
    steps: [
      { min: 30, text: "Viết lại bài Task 2 hôm T2 sau khi đã đọc feedback." },
      { min: 20, text: "Viết 1 bài Task 1, ưu tiên dạng biểu đồ bạn hay sai." },
    ],
  };
}

function listeningLesson(week: number, stage: Stage): Activity {
  if (week === 1) {
    return {
      skill: "listening",
      tool: "track",
      kind: "baseline",
      label: "Baseline Listening",
      minutes: 25,
      focus: "Đo điểm khởi điểm. Chưa có số này thì mọi biểu đồ đều vô nghĩa.",
      steps: [
        { min: 20, text: "Làm 1 Listening section bấm giờ thật, không dừng." },
        {
          min: 5,
          text: "Nhập điểm và band ước tính — đây là mốc so sánh cả lộ trình.",
        },
      ],
      links: LISTEN_LINKS,
    };
  }
  if (stage === "A") {
    return {
      skill: "listening",
      tool: "track",
      kind: "core",
      label: "Listening 1 section",
      minutes: 25,
      focus: "Giữ tai quen nhịp đề thật, mỗi lần một section là đủ.",
      steps: [
        { min: 15, text: "Làm 1 section đề thật → chụp hoặc nhập kết quả." },
        { min: 10, text: "Nghe lại chỗ sai kèm transcript, ghi 'vì sao sai'." },
      ],
      links: LISTEN_LINKS,
    };
  }
  if (stage === "B1") {
    return {
      skill: "listening",
      tool: "track",
      kind: "core",
      label: "Listening 2 sections",
      minutes: 45,
      focus: "Tăng lượng, vẫn soát kỹ từng câu sai.",
      steps: [
        { min: 25, text: "Làm 2 section đúng giờ → chụp kết quả." },
        { min: 10, text: "Nghe lại kèm transcript, khoanh chỗ nghe sót." },
        { min: 10, text: "Dictation: chép đúng 5–10 câu bạn nghe sai." },
      ],
      links: LISTEN_LINKS,
    };
  }
  return {
    skill: "listening",
    tool: "track",
    kind: "core",
    label: "Listening full test",
    minutes: 60,
    focus: "Sức bền 4 section liên tục như thi thật.",
    steps: [
      { min: 40, text: "Full test 4 sections đúng giờ → chụp kết quả." },
      { min: 20, text: "Phân tích lỗi theo nhóm: số, tên riêng, paraphrase." },
    ],
    links: LISTEN_LINKS,
  };
}

function readingLesson(week: number, stage: Stage): Activity {
  if (week === 1) {
    return {
      skill: "reading",
      tool: "track",
      kind: "baseline",
      label: "Baseline Reading",
      minutes: 25,
      focus: "Đo điểm khởi điểm Reading để biết gap thật tới 7.5.",
      steps: [
        { min: 20, text: "Làm 1 Reading passage bấm giờ thật (20 phút)." },
        { min: 5, text: "Nhập điểm và band ước tính vào app." },
      ],
      links: RL_LINKS,
    };
  }
  if (stage === "A") {
    return {
      skill: "reading",
      tool: "track",
      kind: "core",
      label: "Reading 1 passage",
      minutes: 25,
      focus: "Đọc có bấm giờ, rồi truy 'vì sao sai' cho từng câu.",
      steps: [
        { min: 15, text: "1 passage đúng giờ → chụp hoặc nhập kết quả." },
        {
          min: 10,
          text: "Soát câu sai: bẫy paraphrase, thiếu điều kiện hay từ vựng?",
        },
      ],
      links: RL_LINKS,
    };
  }
  if (stage === "B1") {
    return {
      skill: "reading",
      tool: "track",
      kind: "core",
      label: "Reading 2 passages",
      minutes: 50,
      focus: "Luyện tốc độ trước khi ghép full test.",
      steps: [
        { min: 30, text: "2 passage đúng giờ → chụp kết quả." },
        { min: 20, text: "Soát 'vì sao sai' + đưa bẫy hay gặp vào SRS." },
      ],
      links: RL_LINKS,
    };
  }
  return {
    skill: "reading",
    tool: "track",
    kind: "core",
    label: "Reading full test",
    minutes: 60,
    focus: "3 passages trong 60 phút, đúng áp lực phòng thi.",
    steps: [
      { min: 40, text: "Full test 3 passages đúng giờ → chụp kết quả." },
      { min: 20, text: "Soát 'vì sao sai' + đưa bẫy vào SRS." },
    ],
    links: RL_LINKS,
  };
}

function speakingLesson(stage: Stage): Activity {
  return {
    skill: "speaking",
    tool: "speaking",
    kind: "core",
    label: "Buổi gia sư + ghi lỗi",
    minutes: stage === "A" ? 25 : 45,
    focus: "Điểm neo của tuần: có người thật chờ xem bạn có làm bài không.",
    steps: [
      { min: 15, text: "Học với gia sư (buổi diễn ra ngoài app)." },
      {
        min: 10,
        text: "Ghi band ước tính + 1–3 lỗi gia sư sửa → lưu vào SRS.",
      },
      ...(stage === "A"
        ? []
        : [
            {
              min: 20,
              text: "Nhờ gia sư xem bản viết lại hôm T4 và nhận xét nhanh.",
            },
          ]),
    ],
  };
}

function mockLesson(week: number): Activity {
  return {
    skill: "reading",
    tool: "track",
    kind: "mock",
    label: `Mock L+R (tuần ${week})`,
    minutes: 180,
    focus: "Ngày đo. Kết quả mock quyết định giữ hay dời ngày thi.",
    steps: [
      { min: 60, text: "Listening full test 4 sections đúng giờ." },
      { min: 60, text: "Reading full test 3 passages đúng giờ." },
      {
        min: 60,
        text: "Soát lỗi, nhập band Listening và Reading để lưu vào Tiến độ.",
      },
    ],
    links: RL_LINKS,
  };
}

function bufferLesson(stage: Stage): Activity {
  return {
    skill: "rest",
    kind: "buffer",
    label: "Ngày bù",
    minutes: stage === "A" ? 25 : 45,
    focus: "Ngày này tồn tại để tuần bận không làm vỡ lộ trình.",
    steps: [
      {
        min: 15,
        text: "Làm bù bài còn thiếu trong tuần. Không thiếu bài thì bỏ qua.",
      },
      { min: 10, text: "Ôn các lỗi đến hạn, ưu tiên lỗi cứng đầu." },
    ],
  };
}

const DOW_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
/** Mon–Sat. Sunday is deliberately never scheduled. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6];

function activityFor(week: number, dow: number, stage: Stage): Activity {
  switch (dow) {
    case 1:
      return writingLesson(week, stage);
    case 2:
      return listeningLesson(week, stage);
    case 3:
      return rewriteLesson(week, stage);
    case 4:
      return readingLesson(week, stage);
    case 5:
      return speakingLesson(stage);
    default:
      return isMockWeek(week) ? mockLesson(week) : bufferLesson(stage);
  }
}

export function lessonSequence(): Lesson[] {
  const lessons: Lesson[] = [];

  for (let week = 1; week <= WEEKS_TOTAL; week++) {
    const stage = stageOf(week);
    for (const dow of WEEK_ORDER) {
      const activity = activityFor(week, dow, stage);
      lessons.push({
        id: `w${week}-d${dow}`,
        index: lessons.length + 1,
        week,
        stage,
        phase: phaseIndexOf(stage),
        phaseLabel: phaseLabelOf(stage),
        dow,
        dowLabel: DOW_LABELS[dow],
        required: activity.kind !== "buffer",
        activity,
      });
    }
  }

  return lessons;
}

export function findLesson(lessonId: string): Lesson | undefined {
  return lessonSequence().find((lesson) => lesson.id === lessonId);
}

export interface LessonQueueStatus {
  current: Lesson;
  /** The optional catch-up day of the current week, if it isn't done yet. */
  buffer: Lesson | null;
  completedCount: number;
  totalCount: number;
  percent: number;
  previous: Lesson[];
  upcoming: Lesson[];
  completedIds: Set<string>;
}

/**
 * The lesson the queue is waiting on. Buffer days never block the queue —
 * they are offered alongside the current lesson instead.
 */
export function lessonQueueStatus(completedIds: string[]): LessonQueueStatus {
  const completed = new Set(completedIds);
  const lessons = lessonSequence();
  const required = lessons.filter((lesson) => lesson.required);
  const current =
    required.find((lesson) => !completed.has(lesson.id)) ??
    required[required.length - 1];
  const currentIndex = required.findIndex((lesson) => lesson.id === current.id);
  const completedCount = required.filter((lesson) =>
    completed.has(lesson.id),
  ).length;
  const bufferLesson =
    lessons.find(
      (lesson) => lesson.week === current.week && !lesson.required,
    ) ?? null;

  return {
    current,
    buffer:
      bufferLesson && !completed.has(bufferLesson.id) ? bufferLesson : null,
    completedCount,
    totalCount: required.length,
    percent: Math.round((completedCount / required.length) * 100),
    previous: required.slice(Math.max(0, currentIndex - 3), currentIndex),
    upcoming: required.slice(currentIndex + 1, currentIndex + 4),
    completedIds: completed,
  };
}

/**
 * Completed lessons per plan week, oldest first — the input to the habit gate.
 * Buffer days count, because catching up on Saturday is a real week.
 */
export function weeklyCompletionCounts(completedIds: string[]): number[] {
  const counts = new Array<number>(WEEKS_TOTAL).fill(0);
  for (const id of completedIds) {
    const week = Number(id.match(/^w(\d+)-d\d+$/)?.[1]);
    if (Number.isFinite(week) && week >= 1 && week <= WEEKS_TOTAL) {
      counts[week - 1] += 1;
    }
  }
  return counts;
}

/**
 * Stage A opens into Stage B only after `HABIT_GATE_WEEKS` consecutive weeks
 * hit the weekly target. Volume follows the habit, never the calendar.
 */
export function habitGatePassed(
  weeklyCounts: number[],
  weeklyTarget = WEEKLY_TARGET_DEFAULT,
): boolean {
  let streak = 0;
  for (const count of weeklyCounts) {
    streak = count >= weeklyTarget ? streak + 1 : 0;
    if (streak >= HABIT_GATE_WEEKS) return true;
  }
  return false;
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
