import { db, schema } from "./db";
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

function parseJsonList(raw: string | null | undefined): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return null;
  }
}

/** `.env`-derived defaults — used only until /ielts/settings has saved a row. */
function envDefaults(): LearnerProfile {
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

/**
 * The single-row, in-app-editable learner profile (see /ielts/settings).
 * Falls back to `.env` defaults when the DB row doesn't exist yet, so
 * changing goals no longer requires editing `.env` and redeploying.
 */
export async function learnerProfile(): Promise<LearnerProfile> {
  const defaults = envDefaults();
  const [row] = await db.select().from(schema.learnerProfile).limit(1);
  if (!row) return defaults;

  return {
    name: row.name,
    examGoal: row.examGoal,
    startPoint: row.startPoint,
    dailyMinutes: row.dailyMinutes,
    targetOverall: row.targetOverall,
    targetBands: {
      listening: row.targetListening,
      reading: row.targetReading,
      writing: row.targetWriting,
      speaking: row.targetSpeaking,
    },
    strategy: row.strategy,
    constraints: parseJsonList(row.constraints) ?? defaults.constraints,
    priorities: parseJsonList(row.priorities) ?? defaults.priorities,
  };
}

export async function targetBandFor(skill: Skill): Promise<number | null> {
  if (skill === "vocab") return null;
  const profile = await learnerProfile();
  return profile.targetBands[skill as TargetSkill];
}

export async function targetSummary(profile?: LearnerProfile): Promise<string> {
  const p = profile ?? (await learnerProfile());
  const t = p.targetBands;
  return `Overall ${p.targetOverall.toFixed(1)} · L/R ${t.listening.toFixed(1)}/${t.reading.toFixed(1)} · W/S ${t.writing.toFixed(1)}/${t.speaking.toFixed(1)}`;
}
