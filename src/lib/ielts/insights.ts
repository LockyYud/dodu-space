import { learnerProfile, targetBandFor, targetSummary } from "./profile";
import {
  type BandHistory,
  type ErrorCard,
  REVIEW_SESSION_STATUS,
  type Skill,
  type StudySession,
} from "./schema";
import { isStubborn } from "./srs";

type BandSkill = Extract<
  Skill,
  "listening" | "reading" | "writing" | "speaking"
>;

export interface SkillGap {
  skill: BandSkill;
  latest: number | null;
  target: number;
  gap: number | null;
}

export interface AdaptiveRecommendation {
  title: string;
  reason: string;
  actionLabel: string;
  href: string;
  focusSkill: Skill | "review";
  secondary: string[];
}

const SKILL_LABEL: Record<BandSkill, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

const SKILL_HREF: Record<Skill | "review", string> = {
  listening: "/ielts/track",
  reading: "/ielts/track",
  writing: "/ielts/writing",
  speaking: "/ielts/speaking",
  vocab: "/ielts/track",
  review: "/ielts/review",
};

export async function latestSkillGaps(
  bands: BandHistory[],
): Promise<SkillGap[]> {
  const latestBySkill = latestBandsBySkill(bands);
  return Promise.all(
    (["listening", "reading", "writing", "speaking"] as BandSkill[]).map(
      async (skill) => {
        const latest = latestBySkill[skill] ?? null;
        const target = (await targetBandFor(skill)) ?? 0;
        return {
          skill,
          latest,
          target,
          gap: latest == null ? null : Math.max(0, target - latest),
        };
      },
    ),
  );
}

export function topErrorThemes(cards: ErrorCard[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const c of cards) {
    const key = `${c.sourceType}:${c.errorType}`;
    counts.set(key, (counts.get(key) ?? 0) + 1 + c.lapses);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => `${key.replace(":", " / ")} (${count})`);
}

export async function adaptiveRecommendation(input: {
  bands: BandHistory[];
  cards: ErrorCard[];
  dueCount: number;
  sessions: StudySession[];
  /** True when the last 14 days are too sparse to keep the normal load. */
  degraded?: boolean;
  /**
   * Length of today's lesson. The profile's `dailyMinutes` is how much time the
   * learner has, not how long the session is — Stage A deliberately uses 25 of
   * a 60-minute budget, so quoting the profile number contradicted the plan.
   */
  todayMinutes?: number;
}): Promise<AdaptiveRecommendation> {
  const profile = await learnerProfile();
  const stubborn = input.cards.filter((c) => isStubborn(c.lapses));
  const dueStubborn = stubborn.filter((c) => c.dueDate <= todayISO());
  const gaps = await latestSkillGaps(input.bands);
  const largestGap = gaps
    .filter((g) => g.gap != null)
    .sort((a, b) => (b.gap ?? 0) - (a.gap ?? 0))[0];
  const sessionMinutes = input.todayMinutes ?? profile.dailyMinutes;
  // Review-only days are logged as sessions too; they say nothing about which
  // skills have been practised, so they must not skew the skill mix.
  const recentSkillSet = new Set(
    input.sessions
      .filter((s) => s.status !== REVIEW_SESSION_STATUS)
      .slice(0, 7)
      .map((s) => s.skill),
  );

  // Losing the habit outranks any band gap: a plan nobody runs improves nothing.
  if (input.degraded) {
    return {
      title:
        input.dueCount > 0
          ? `Giữ nhịp: ôn ${Math.min(input.dueCount, 6)} lỗi trong 10 phút`
          : "Giữ nhịp: một buổi ngắn thôi cũng được",
      reason:
        "14 ngày qua học quá thưa. Ưu tiên lúc này là quay lại nhịp, không phải học thêm nội dung mới.",
      actionLabel: input.dueCount > 0 ? "Ôn 10 phút" : "Mở bài hôm nay",
      href: input.dueCount > 0 ? SKILL_HREF.review : "/ielts/today",
      focusSkill: "review",
      secondary: [
        "Làm một buổi ngắn hôm nay quan trọng hơn làm đúng bài của hôm nay.",
        `Khi đã đủ 5 ngày liên tiếp, app sẽ trả lại buổi học đầy đủ ${sessionMinutes} phút.`,
      ],
    };
  }

  // Without a baseline every gap below is computed from nothing.
  if (input.bands.length === 0) {
    return {
      title: "Đo baseline trước đã",
      reason:
        "Chưa có band khởi điểm nào, nên chưa thể biết bạn cách mục tiêu bao xa.",
      actionLabel: "Làm bài baseline",
      href: "/ielts/today",
      focusSkill: "review",
      secondary: [
        "1 Reading passage + 1 Listening section bấm giờ thật là đủ.",
        `Mục tiêu để so sánh: ${await targetSummary(profile)}`,
      ],
    };
  }

  if (dueStubborn.length > 0) {
    return {
      title: `Ưu tiên ôn ${dueStubborn.length} lỗi cứng đầu`,
      reason:
        "Các lỗi lapse >= 3 đang kéo hiệu quả học xuống; xử lý trước khi làm bài mới.",
      actionLabel: "Ôn lỗi cứng đầu",
      href: SKILL_HREF.review,
      focusSkill: "review",
      secondary: [
        `Top lỗi: ${topErrorThemes(dueStubborn, 2).join(", ") || "lỗi đến hạn"}`,
        `Giữ phiên trong khoảng ${sessionMinutes} phút để không vỡ lịch.`,
      ],
    };
  }

  if (largestGap && (largestGap.gap ?? 0) >= 0.5) {
    return {
      title: `Bù gap ${SKILL_LABEL[largestGap.skill]}`,
      reason: `${SKILL_LABEL[largestGap.skill]} hiện khoảng ${largestGap.latest?.toFixed(1)}, mục tiêu ${largestGap.target.toFixed(1)}.`,
      actionLabel:
        largestGap.skill === "writing"
          ? "Viết và chấm bài"
          : largestGap.skill === "speaking"
            ? "Ghi buổi Speaking"
            : `Luyện ${SKILL_LABEL[largestGap.skill]}`,
      href: SKILL_HREF[largestGap.skill],
      focusSkill: largestGap.skill,
      secondary: [
        largestGap.skill === "writing"
          ? "Sau khi chấm, lưu card rồi viết lại phần yếu nhất."
          : "Lưu điểm và lỗi để app có dữ liệu điều chỉnh buổi sau.",
        `Chiến lược: ${profile.strategy}`,
      ],
    };
  }

  if (input.dueCount > 0) {
    return {
      title: `Ôn ${input.dueCount} lỗi đến hạn`,
      reason:
        "Không có gap band rõ ràng hơn hôm nay; SRS là việc có lợi tức chắc nhất.",
      actionLabel: "Vào phiên ôn",
      href: SKILL_HREF.review,
      focusSkill: "review",
      secondary: topErrorThemes(input.cards, 2),
    };
  }

  if (!recentSkillSet.has("writing")) {
    return {
      title: "Thêm một vòng Writing",
      reason:
        "7 buổi gần nhất chưa có Writing; đây vẫn là kỹ năng cần feedback đều để chạm 6.5 chắc.",
      actionLabel: "Chấm Writing",
      href: SKILL_HREF.writing,
      focusSkill: "writing",
      secondary: ["Viết đúng giờ, lưu lỗi, rồi viết lại sau khi đọc feedback."],
    };
  }

  return {
    title: "Theo lịch hôm nay",
    reason: "Chưa có lỗi cứng đầu hoặc gap band đủ rõ để đổi hướng.",
    actionLabel: "Bắt đầu",
    href: "/ielts/today",
    focusSkill: "review",
    secondary: [
      "Sau buổi học, nhớ lưu điểm/lỗi để khuyến nghị lần sau sắc hơn.",
    ],
  };
}

function latestBandsBySkill(
  bands: BandHistory[],
): Partial<Record<BandSkill, number>> {
  const out: Partial<Record<BandSkill, number>> = {};
  for (const row of bands) {
    for (const skill of [
      "listening",
      "reading",
      "writing",
      "speaking",
    ] as BandSkill[]) {
      if (out[skill] == null && typeof row[skill] === "number") {
        out[skill] = row[skill] as number;
      }
    }
  }
  return out;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}
