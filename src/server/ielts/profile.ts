"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { type LearnerProfile, learnerProfile } from "@/lib/ielts/profile";
import { toISODate } from "@/lib/ielts/srs";

export async function getProfile(): Promise<LearnerProfile> {
  return learnerProfile();
}

export interface UpdateProfileInput {
  name: string;
  examGoal: string;
  startPoint: string;
  dailyMinutes: number;
  targetOverall: number;
  targetListening: number;
  targetReading: number;
  targetWriting: number;
  targetSpeaking: number;
  strategy: string;
  constraints: string[];
  priorities: string[];
  planStart: string;
  examDate: string | null;
  weeklyTarget: number;
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  await requireIeltsUser();

  if (!Number.isFinite(input.weeklyTarget) || input.weeklyTarget < 1) {
    throw new Error("Số bài bắt buộc mỗi tuần phải từ 1 trở lên.");
  }
  for (const [label, value] of [
    ["Ngày bắt đầu", input.planStart],
    ["Ngày thi", input.examDate],
  ] as const) {
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
      throw new Error(`${label} phải có dạng YYYY-MM-DD.`);
    }
  }

  const [existing] = await db
    .select({ id: schema.learnerProfile.id })
    .from(schema.learnerProfile)
    .limit(1);

  const values = {
    name: input.name.trim(),
    examGoal: input.examGoal.trim(),
    startPoint: input.startPoint.trim(),
    dailyMinutes: input.dailyMinutes,
    targetOverall: input.targetOverall,
    targetListening: input.targetListening,
    targetReading: input.targetReading,
    targetWriting: input.targetWriting,
    targetSpeaking: input.targetSpeaking,
    strategy: input.strategy.trim(),
    constraints: JSON.stringify(input.constraints.filter(Boolean)),
    priorities: JSON.stringify(input.priorities.filter(Boolean)),
    planStart: input.planStart.trim() || toISODate(),
    examDate: input.examDate?.trim() || null,
    weeklyTarget: input.weeklyTarget,
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    await db
      .update(schema.learnerProfile)
      .set(values)
      .where(eq(schema.learnerProfile.id, existing.id));
  } else {
    await db.insert(schema.learnerProfile).values(values);
  }

  revalidatePath("/ielts/settings");
  revalidatePath("/ielts");
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
}
