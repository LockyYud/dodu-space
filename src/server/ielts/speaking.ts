"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/ielts/db";
import { planStatus } from "@/lib/ielts/plan";
import type { SpeakingSession } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

export interface AddSpeakingInput {
  date?: string;
  durationMin?: number;
  tutorNotes?: string;
  bandEstimate?: number;
  /** Mistakes the tutor pointed out, to add to the SRS. */
  cards?: { front: string; back: string; explanation?: string }[];
}

export async function addSpeaking(input: AddSpeakingInput): Promise<number> {
  const today = input.date ?? toISODate();
  const p = planStatus(new Date(`${today}T00:00:00`));

  const [row] = await db
    .insert(schema.speakingSession)
    .values({
      date: today,
      durationMin: input.durationMin ?? null,
      tutorNotes: input.tutorNotes ?? null,
      bandEstimate: input.bandEstimate ?? null,
    })
    .returning({ id: schema.speakingSession.id });

  // Log a study_session so speaking counts toward the streak.
  await db.insert(schema.studySession).values({
    date: today,
    skill: "speaking",
    phase: p.phase,
    week: p.week,
    durationMin: input.durationMin ?? null,
    bandEstimate: input.bandEstimate ?? null,
    notes: input.tutorNotes ?? null,
    status: "done",
  });

  const cards = (input.cards ?? []).filter((c) => c.front && c.back);
  if (cards.length > 0) {
    await db.insert(schema.errorCard).values(
      cards.map((c) => ({
        sourceType: "speaking" as const,
        sourceRef: `speaking_session:${row.id}`,
        errorType: "grammar" as const,
        front: c.front,
        back: c.back,
        explanation: c.explanation ?? "",
        context: "Speaking (gia sư)",
        dueDate: today,
      })),
    );
  }

  revalidatePath("/ielts");
  revalidatePath("/ielts/speaking");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  return row.id;
}

export async function listSpeaking(): Promise<SpeakingSession[]> {
  return db
    .select()
    .from(schema.speakingSession)
    .orderBy(
      desc(schema.speakingSession.date),
      desc(schema.speakingSession.id),
    );
}
