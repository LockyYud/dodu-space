"use server";

import { asc, desc, eq, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/ielts/db";
import type { ErrorCard, ReviewGrade } from "@/lib/ielts/schema";
import { dueDateAfter, schedule, toISODate } from "@/lib/ielts/srs";

/** Cards due today, stubborn (high lapses) first — the review queue order. */
export async function getDueCards(): Promise<ErrorCard[]> {
  const today = toISODate();
  return db
    .select()
    .from(schema.errorCard)
    .where(lte(schema.errorCard.dueDate, today))
    .orderBy(desc(schema.errorCard.lapses), asc(schema.errorCard.dueDate));
}

export interface ReviewResult {
  cardId: number;
  newInterval: number;
  dueDate: string;
}

/** Apply a grade to one card: update SM-2 state + write a review_log row. */
export async function submitReview(
  cardId: number,
  grade: ReviewGrade,
): Promise<ReviewResult> {
  const [card] = await db
    .select()
    .from(schema.errorCard)
    .where(eq(schema.errorCard.id, cardId));
  if (!card) throw new Error(`error_card ${cardId} not found`);

  const next = schedule(
    {
      easeFactor: card.easeFactor,
      intervalDays: card.intervalDays,
      repetitions: card.repetitions,
      lapses: card.lapses,
    },
    grade,
  );
  const dueDate = dueDateAfter(next.intervalDays);
  const today = toISODate();

  await db
    .update(schema.errorCard)
    .set({
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      lapses: next.lapses,
      dueDate,
      lastReviewed: today,
    })
    .where(eq(schema.errorCard.id, cardId));

  await db.insert(schema.reviewLog).values({
    cardId,
    grade,
    prevInterval: card.intervalDays,
    newInterval: next.intervalDays,
  });

  revalidatePath("/ielts/review");
  revalidatePath("/ielts");

  return { cardId, newInterval: next.intervalDays, dueDate };
}

/** Count of cards due today (for badges / dashboard). */
export async function countDue(): Promise<number> {
  const rows = await getDueCards();
  return rows.length;
}
