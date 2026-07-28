import type { Skill } from "./schema";

type TargetSkill = Extract<
  Skill,
  "listening" | "reading" | "writing" | "speaking"
>;

export interface LearnerProfile {
  name: string;
  examGoal: string;
  startPoint: string;
  dailyMinutes: number;
  targetOverall: number;
  targetBands: Record<TargetSkill, number>;
  strategy: string;
  constraints: string[];
  priorities: string[];
}

function numberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function listEnv(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function learnerProfile(): LearnerProfile {
  return {
    name: process.env.IELTS_LEARNER_NAME ?? "Duy",
    examGoal: process.env.IELTS_EXAM_GOAL ?? "IELTS 7.0 overall",
    startPoint:
      process.env.IELTS_START_POINT ??
      "TOEIC 750 L/R, TOEIC Speaking & Writing 300/400; nghỉ học khoảng 6 tháng.",
    dailyMinutes: numberEnv("IELTS_DAILY_MINUTES", 60),
    targetOverall: numberEnv("IELTS_TARGET_OVERALL", 7.0),
    targetBands: {
      listening: numberEnv("IELTS_TARGET_LISTENING", 7.5),
      reading: numberEnv("IELTS_TARGET_READING", 7.5),
      writing: numberEnv("IELTS_TARGET_WRITING", 6.5),
      speaking: numberEnv("IELTS_TARGET_SPEAKING", 6.5),
    },
    strategy:
      process.env.IELTS_STRATEGY ??
      "Đẩy Listening/Reading lên 7.5 để bù Writing/Speaking 6.5; Writing là điểm yếu trần band nên cần feedback, viết lại, error log và SRS.",
    constraints: listEnv("IELTS_CONSTRAINTS", [
      "Học khoảng 1 giờ mỗi ngày.",
      "Speaking luyện với gia sư ngoài app, app chỉ tracking và lưu lỗi.",
      "Ưu tiên luyện từ lỗi thật thay vì học lý thuyết lan man.",
    ]),
    priorities: listEnv("IELTS_PRIORITIES", [
      "Writing: chạm 6.5 chắc chắn bằng vòng viết -> chấm -> viết lại.",
      "Listening/Reading: tận dụng nền TOEIC để kéo lên 7.5.",
      "SRS: xử lý lỗi lặp và lỗi cứng đầu trước.",
    ]),
  };
}

export function targetBandFor(skill: Skill): number | null {
  if (skill === "vocab") return null;
  return learnerProfile().targetBands[skill];
}

export function targetSummary(profile = learnerProfile()): string {
  const t = profile.targetBands;
  return `Overall ${profile.targetOverall.toFixed(1)} · L/R ${t.listening.toFixed(1)}/${t.reading.toFixed(1)} · W/S ${t.writing.toFixed(1)}/${t.speaking.toFixed(1)}`;
}
