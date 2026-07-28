"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/ielts/db";
import { computeStreak, planStatus } from "@/lib/ielts/plan";
import type { Skill, StudySession } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

export interface LogSessionInput {
  skill: Skill;
  date?: string;
  phase?: number;
  week?: number;
  durationMin?: number;
  sourceUrl?: string;
  rawScore?: string;
  bandEstimate?: number;
  notes?: string;
}

export async function logSession(input: LogSessionInput): Promise<number> {
  const date = input.date ?? toISODate();
  const p = planStatus(new Date(`${date}T00:00:00`));
  const [row] = await db
    .insert(schema.studySession)
    .values({
      date,
      skill: input.skill,
      phase: input.phase ?? p.phase,
      week: input.week ?? p.week,
      durationMin: input.durationMin ?? null,
      sourceUrl: input.sourceUrl ?? null,
      rawScore: input.rawScore ?? null,
      bandEstimate: input.bandEstimate ?? null,
      notes: input.notes ?? null,
      status: "done",
    })
    .returning({ id: schema.studySession.id });
  revalidatePath("/ielts");
  revalidatePath("/ielts/progress");
  return row.id;
}

export async function listSessions(limit = 30): Promise<StudySession[]> {
  return db
    .select()
    .from(schema.studySession)
    .orderBy(desc(schema.studySession.date), desc(schema.studySession.id))
    .limit(limit);
}

export async function getStreak(): Promise<number> {
  const rows = await db
    .select({ date: schema.studySession.date })
    .from(schema.studySession);
  return computeStreak(rows.map((r) => r.date));
}
