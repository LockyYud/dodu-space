"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { computeStreak } from "@/lib/ielts/plan";
import type { Skill, StudySession } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

export interface LogSessionInput {
  skill: Skill;
  date?: string;
  /** Roadmap v3 slot tag; see SlotId in src/lib/ielts/plan.ts. */
  slot?: string;
  durationMin?: number;
  sourceUrl?: string;
  rawScore?: string;
  bandEstimate?: number;
  notes?: string;
}

export async function logSession(input: LogSessionInput): Promise<number> {
  await requireIeltsUser();
  const [row] = await db
    .insert(schema.studySession)
    .values({
      date: input.date ?? toISODate(),
      skill: input.skill,
      slot: input.slot ?? null,
      durationMin: input.durationMin ?? null,
      sourceUrl: input.sourceUrl ?? null,
      rawScore: input.rawScore ?? null,
      bandEstimate: input.bandEstimate ?? null,
      notes: input.notes ?? null,
      status: "done",
    })
    .returning({ id: schema.studySession.id });
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  return row.id;
}

/**
 * Every day that has at least one logged session, including review-only days.
 * Feeds both the streak and the 14-day window that drives reduced-load mode.
 */
export async function listStudyDates(): Promise<string[]> {
  const rows = await db
    .select({ date: schema.studySession.date })
    .from(schema.studySession);
  return [...new Set(rows.map((row) => row.date))];
}

/**
 * Giờ học **tập trung** đã tích luỹ, không tính nghe thụ động.
 *
 * Ô "Nghe" hằng ngày là podcast khi di chuyển. Nó đáng giữ, nhưng cộng nó vào
 * quỹ giờ làm con số trông đủ trong khi thực tế thiếu — xem METHOD-REVIEW §3.
 */
export async function guidedHoursStudied(): Promise<number> {
  const rows = await db
    .select({
      skill: schema.studySession.skill,
      slot: schema.studySession.slot,
      durationMin: schema.studySession.durationMin,
    })
    .from(schema.studySession);
  const minutes = rows
    .filter((r) => !(r.slot === "input" && r.skill === "listening"))
    .reduce((sum, r) => sum + (r.durationMin ?? 0), 0);
  return minutes / 60;
}

export async function listSessions(limit = 30): Promise<StudySession[]> {
  return db
    .select()
    .from(schema.studySession)
    .orderBy(desc(schema.studySession.date), desc(schema.studySession.id))
    .limit(limit);
}

export async function getStreak(): Promise<number> {
  return computeStreak(await listStudyDates());
}
