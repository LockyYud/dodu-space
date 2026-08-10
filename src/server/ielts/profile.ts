"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { type LearnerProfile, learnerProfile } from "@/lib/ielts/profile";

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
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  await requireIeltsUser();

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
}
