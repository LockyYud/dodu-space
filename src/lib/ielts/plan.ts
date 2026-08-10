import type { Skill } from "./schema";
import { toISODate } from "./srs";

/**
 * The learner's roadmap encoded as a concrete daily schedule (see
 * docs/ielts/ROADMAP.md). Drives /ielts/today and the phase indicator.
 * Progress through it is queue-based (see `lessonQueueStatus`) — a lesson
 * only advances when the learner marks it done, regardless of calendar
 * time, so pausing/resuming never skips or misattributes a lesson.
 * Each day is a focused ~60' plan with explicit steps.
 */

export interface Activity {
  skill: Skill | "rest";
  label: string;
  minutes: number;
  focus: string; // one-line goal of the day
  steps: { min: number; text: string }[];
  links?: { label: string; url: string }[];
}

export interface Lesson {
  id: string;
  index: number; // 1-based
  week: number;
  phase: 0 | 1 | 2;
  phaseLabel: string;
  dow: number;
  dowLabel: string;
  activity: Activity;
}

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

// dayOfWeek: 1=Mon … 6=Sat, 0=Sun
type WeekPlan = Record<number, Activity>;

/* ─────────────── PHASE 0 — Warm-up (tuần 1–2) ─────────────── */
const PHASE0: WeekPlan = {
  1: {
    skill: "writing",
    label: "Warm-up viết tự do",
    minutes: 60,
    focus: "Kích hoạt lại phản xạ viết, không đặt nặng đúng/sai.",
    steps: [
      { min: 15, text: "Đọc 1 bài báo tiếng Anh dễ về chủ đề bạn thích." },
      {
        min: 30,
        text: "Viết tự do ~150 từ kể về một ngày của bạn (không cần chuẩn IELTS).",
      },
      {
        min: 15,
        text: "Đọc lại, gạch 5–10 từ/collocation mới, ghi vào Kho lỗi/Vocab.",
      },
    ],
  },
  2: {
    skill: "listening",
    label: "Nghe làm quen",
    minutes: 60,
    focus: "Làm quen lại nhịp nghe, chưa cần bấm giờ.",
    steps: [
      { min: 30, text: "Nghe 1 video/podcast có phụ đề (tốc độ vừa)." },
      { min: 15, text: "Nghe lại KHÔNG phụ đề, cố nắm ý chính." },
      { min: 15, text: "Chép lại 5–10 câu bạn thấy hay (dictation nhẹ)." },
    ],
    links: LISTEN_LINKS,
  },
  3: {
    skill: "reading",
    label: "Đọc & tóm tắt",
    minutes: 60,
    focus: "Đọc hiểu ý chính, tập paraphrase.",
    steps: [
      { min: 30, text: "Đọc 1 bài báo dễ (chủ đề quen)." },
      { min: 20, text: "Tóm tắt lại bằng 3–4 câu tiếng Anh của bạn." },
      { min: 10, text: "Ghi 8–10 từ mới theo cụm (collocation)." },
    ],
    links: RL_LINKS,
  },
  4: {
    skill: "writing",
    label: "Học cấu trúc Task 2 (lý thuyết)",
    minutes: 60,
    focus: "Nắm khung essay band 7.",
    steps: [
      {
        min: 30,
        text: "Đọc 1 essay Task 2 band 7 mẫu, đánh dấu: intro / 2 body / conclusion.",
      },
      {
        min: 20,
        text: "Viết DÀN Ý cho 1 đề (chưa viết full): mỗi body 1 ý + 1 ví dụ.",
      },
      { min: 10, text: "Liệt kê 5 linking hữu ích + cách dùng đúng ngữ cảnh." },
    ],
    links: WRITING_SAMPLE_LINKS,
  },
  5: {
    skill: "reading",
    label: "Học dạng câu hỏi Reading",
    minutes: 60,
    focus: "Biết mẹo từng dạng trước khi luyện.",
    steps: [
      {
        min: 25,
        text: "Xem cách làm T/F/NG, Matching Headings, MCQ, gap-fill.",
      },
      { min: 25, text: "Làm thử 1 passage (KHÔNG bấm giờ) áp dụng mẹo." },
      { min: 10, text: "Soát: mỗi câu sai ghi 1 dòng 'vì sao sai'." },
    ],
    links: RL_LINKS,
  },
  6: {
    skill: "writing",
    label: "Viết thử essay ngắn",
    minutes: 60,
    focus: "Áp khung đã học vào 1 bài thật (chưa bấm giờ).",
    steps: [
      { min: 45, text: "Viết ~200 từ theo dàn ý đã lập (Task 2)." },
      {
        min: 15,
        text: "Tự soát bằng checklist band 7 (đủ ý? liên kết? câu đa dạng?).",
      },
    ],
  },
  0: {
    skill: "rest",
    label: "Ôn & test nhẹ",
    minutes: 45,
    focus: "Ôn từ vựng tuần + đo band khởi điểm.",
    steps: [
      { min: 20, text: "Ôn toàn bộ error card đến hạn ở mục Ôn tập (SRS)." },
      {
        min: 25,
        text: "Cuối tuần 2: làm 1 mini-test (1 Reading passage + 1 Listening section) → nhập band vào Tiến độ.",
      },
    ],
    links: RL_LINKS,
  },
};

/* ─────────────── PHASE 1 — Xây nền (tuần 3–8) ─────────────── */
const PHASE1: WeekPlan = {
  1: {
    skill: "writing",
    label: "Writing Task 2 (chấm AI)",
    minutes: 60,
    focus: "Viết đúng giờ → AI chấm → nạp lỗi vào SRS.",
    steps: [
      { min: 40, text: "Viết 1 essay Task 2 đúng 40 phút (mục Writing)." },
      {
        min: 20,
        text: "Bấm 'Chấm bài' → đọc nhận xét → chọn lỗi lưu vào SRS.",
      },
    ],
  },
  2: {
    skill: "listening",
    label: "Listening + dictation",
    minutes: 60,
    focus: "Bịt lỗ nghe bằng chép chính tả câu sai.",
    steps: [
      {
        min: 30,
        text: "Làm 1–2 section đề thật (link ngoài) → chụp màn hình kết quả.",
      },
      { min: 15, text: "Nghe lại kèm transcript, khoanh chỗ nghe sót." },
      { min: 15, text: "Dictation: chép lại đúng 5–10 câu nghe sai." },
    ],
    links: LISTEN_LINKS,
  },
  3: {
    skill: "writing",
    label: "Task 1 + viết lại Task 2",
    minutes: 60,
    focus: "Vòng lặp vàng: viết → được chấm → VIẾT LẠI.",
    steps: [
      { min: 20, text: "Viết 1 đoạn mô tả biểu đồ (Task 1)." },
      { min: 15, text: "Học 10 collocation theo chủ đề tuần này." },
      { min: 25, text: "VIẾT LẠI bài Task 2 hôm T2 sau khi đã được chấm." },
    ],
  },
  4: {
    skill: "reading",
    label: "Reading có bấm giờ",
    minutes: 60,
    focus: "Luyện tốc độ + hiểu 'vì sao sai'.",
    steps: [
      { min: 20, text: "1 passage đúng giờ (20') → chụp màn hình kết quả." },
      {
        min: 20,
        text: "Soát từng câu sai: bẫy paraphrase? thiếu điều kiện? từ vựng?",
      },
      { min: 20, text: "Paraphrase 5 câu khó + ghi từ mới vào SRS." },
    ],
    links: RL_LINKS,
  },
  5: {
    skill: "writing",
    label: "Writing Task 2 (chủ đề mới)",
    minutes: 60,
    focus: "Đa dạng chủ đề, nạp thêm lỗi.",
    steps: [
      { min: 40, text: "Viết essay chủ đề mới đúng giờ → AI chấm." },
      { min: 20, text: "Chọn lỗi lưu SRS; so nhận xét với bài T2 đầu tuần." },
    ],
  },
  6: {
    skill: "listening",
    label: "Chuyển kỹ năng L → R",
    minutes: 60,
    focus: "Luyện phản xạ đổi kỹ năng liên tục.",
    steps: [
      { min: 30, text: "1 Listening section đúng giờ → chụp kết quả." },
      {
        min: 30,
        text: "1 Reading passage đúng giờ (luyện tốc độ) → chụp kết quả.",
      },
    ],
    links: RL_LINKS,
  },
  0: {
    skill: "rest",
    label: "Ôn SRS + viết lại",
    minutes: 60,
    focus: "Củng cố: ôn lỗi + viết lại bài cuối tuần.",
    steps: [
      {
        min: 30,
        text: "Ôn TOÀN BỘ error card đến hạn (ưu tiên lỗi cứng đầu).",
      },
      { min: 30, text: "Viết lại bài Writing được chấm gần nhất." },
    ],
  },
};

/* ─────────────── PHASE 2 — Luyện đề & tối ưu (tuần 9–20) ─────────────── */
const PHASE2: WeekPlan = {
  1: {
    skill: "writing",
    label: "Task 2 full đúng giờ",
    minutes: 60,
    focus: "Chuẩn phòng thi.",
    steps: [
      { min: 40, text: "Viết Task 2 đúng 40' → AI chấm → error card." },
      { min: 20, text: "Ghi lại lỗi lặp; xem có phải 'lỗi cứng đầu' không." },
    ],
  },
  2: {
    skill: "listening",
    label: "Listening full test",
    minutes: 60,
    focus: "Sức bền 4 section liên tục.",
    steps: [
      { min: 40, text: "Full test 4 sections đúng giờ → chụp kết quả." },
      { min: 20, text: "Phân tích lỗi theo nhóm (số, tên riêng, paraphrase)." },
    ],
    links: LISTEN_LINKS,
  },
  3: {
    skill: "writing",
    label: "Viết lại + Task 1",
    minutes: 60,
    focus: "Tối ưu bài yếu.",
    steps: [
      { min: 30, text: "Viết lại bài Task 2 hôm T2 (sau khi được chấm)." },
      { min: 30, text: "1 bài Task 1, tập trung dạng biểu đồ bạn hay sai." },
    ],
  },
  4: {
    skill: "reading",
    label: "Reading full test",
    minutes: 60,
    focus: "3 passages / 60' như thi thật.",
    steps: [
      { min: 40, text: "Full test 3 passages đúng giờ → chụp kết quả." },
      { min: 20, text: "Soát 'vì sao sai' + đưa bẫy vào SRS." },
    ],
    links: RL_LINKS,
  },
  5: {
    skill: "writing",
    label: "Writing luân phiên",
    minutes: 60,
    focus: "Đánh vào dạng đề yếu nhất.",
    steps: [
      {
        min: 40,
        text: "Viết 1 bài (Task 1 hoặc 2) — chọn dạng bạn yếu → AI chấm.",
      },
      { min: 20, text: "Chọn lỗi lưu SRS + đối chiếu tiến bộ." },
    ],
  },
  6: {
    skill: "reading",
    label: "Mock ghép L+R",
    minutes: 60,
    focus: "Luyện chuyển kỹ năng dưới áp lực.",
    steps: [
      { min: 30, text: "Nửa Listening (2 section) đúng giờ." },
      { min: 30, text: "Nửa Reading (1–2 passage) đúng giờ." },
    ],
    links: RL_LINKS,
  },
  0: {
    skill: "rest",
    label: "Ôn SRS + rà lỗi cứng đầu",
    minutes: 60,
    focus: "Dồn sức vào lỗi sai đi sai lại.",
    steps: [
      {
        min: 40,
        text: "Ôn toàn bộ card đến hạn; xem tab 'Lỗi cứng đầu' ở Kho lỗi.",
      },
      {
        min: 20,
        text: "2 tuần/lần: làm 1 full mock → nhập band vào Tiến độ, so baseline.",
      },
    ],
  },
};

const DOW_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export interface LessonQueueStatus {
  current: Lesson;
  completedCount: number;
  totalCount: number;
  percent: number;
  previous: Lesson[];
  upcoming: Lesson[];
  completedIds: Set<string>;
}

function phaseOf(week: number): 0 | 1 | 2 {
  return week <= 2 ? 0 : week <= 8 ? 1 : 2;
}
function plansFor(phase: 0 | 1 | 2): WeekPlan {
  return phase === 0 ? PHASE0 : phase === 1 ? PHASE1 : PHASE2;
}

export function phaseLabelOf(phase: 0 | 1 | 2): string {
  return phase === 0
    ? "Phase 0 — Warm-up"
    : phase === 1
      ? "Phase 1 — Xây nền"
      : "Phase 2 — Luyện đề";
}

export function lessonSequence(): Lesson[] {
  const order = [1, 2, 3, 4, 5, 6, 0]; // Mon → Sun
  const lessons: Lesson[] = [];

  for (let week = 1; week <= 20; week++) {
    const phase = phaseOf(week);
    const plan = plansFor(phase);
    for (const dow of order) {
      const index = lessons.length + 1;
      lessons.push({
        id: `w${week}-d${dow}`,
        index,
        week,
        phase,
        phaseLabel: phaseLabelOf(phase),
        dow,
        dowLabel: DOW_LABELS[dow],
        activity: plan[dow],
      });
    }
  }

  return lessons;
}

export function lessonQueueStatus(completedIds: string[]): LessonQueueStatus {
  const completed = new Set(completedIds);
  const lessons = lessonSequence();
  const current =
    lessons.find((lesson) => !completed.has(lesson.id)) ??
    lessons[lessons.length - 1];
  const currentIndex = lessons.findIndex((lesson) => lesson.id === current.id);
  const completedCount = Math.min(completed.size, lessons.length);

  return {
    current,
    completedCount,
    totalCount: lessons.length,
    percent: Math.round((completedCount / lessons.length) * 100),
    previous: lessons.slice(Math.max(0, currentIndex - 3), currentIndex),
    upcoming: lessons.slice(currentIndex + 1, currentIndex + 4),
    completedIds: completed,
  };
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
