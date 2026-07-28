"use server";

import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/ielts/db";
import { planStatus } from "@/lib/ielts/plan";
import type { ErrorType, Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";
import { parseScreenshot, type ScreenshotResult } from "@/lib/ielts/vision";

/** Parse a Reading/Listening result screenshot (data URL) via the vision model. */
export async function parseScreenshotAction(
  dataUrl: string,
): Promise<ScreenshotResult> {
  return parseScreenshot(dataUrl);
}

export interface SaveTrackInput {
  skill: Skill; // reading | listening | vocab
  sourceUrl?: string;
  rawScore?: string;
  bandEstimate?: number;
  durationMin?: number;
  notes?: string;
  cards: {
    error_type: ErrorType;
    front: string;
    back: string;
    explanation: string;
  }[];
}

/** Persist a Reading/Listening study session + any error cards kept. */
export async function saveTrackSession(
  input: SaveTrackInput,
): Promise<{ sessionId: number; cardsAdded: number }> {
  const today = toISODate();
  const p = planStatus();
  const [session] = await db
    .insert(schema.studySession)
    .values({
      date: today,
      skill: input.skill,
      phase: p.phase,
      week: p.week,
      sourceUrl: input.sourceUrl ?? null,
      rawScore: input.rawScore ?? null,
      bandEstimate: input.bandEstimate ?? null,
      durationMin: input.durationMin ?? null,
      notes: input.notes ?? null,
      status: "done",
    })
    .returning({ id: schema.studySession.id });

  const cards = input.cards.filter((c) => c.front && c.back);
  if (cards.length > 0) {
    await db.insert(schema.errorCard).values(
      cards.map((c) => ({
        sourceType: input.skill,
        sourceRef: `study_session:${session.id}`,
        errorType: c.error_type,
        front: c.front,
        back: c.back,
        explanation: c.explanation,
        context: input.skill,
        dueDate: today,
      })),
    );
  }

  revalidatePath("/ielts");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts/errors");
  return { sessionId: session.id, cardsAdded: cards.length };
}
