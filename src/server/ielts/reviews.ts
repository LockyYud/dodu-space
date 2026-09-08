"use server";

import { and, asc, desc, eq, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  type ErrorCard,
  REVIEW_SESSION_MARKER,
  REVIEW_SESSION_STATUS,
  type ReviewGrade,
} from "@/lib/ielts/schema";
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
  await requireIeltsUser();

  const { newInterval, dueDate } = await db.transaction(async (tx) => {
    const [card] = await tx
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

    await tx
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

    await tx.insert(schema.reviewLog).values({
      cardId,
      grade,
      prevInterval: card.intervalDays,
      newInterval: next.intervalDays,
    });

    // One row per day, so a review-only day still counts as a study day for
    // the streak and for reduced-load mode. Written in the same transaction
    // as the card update so the two can never disagree.
    const [existing] = await tx
      .select({ id: schema.studySession.id })
      .from(schema.studySession)
      .where(
        and(
          eq(schema.studySession.date, today),
          eq(schema.studySession.sourceUrl, REVIEW_SESSION_MARKER),
        ),
      )
      .limit(1);
    if (!existing) {
      await tx.insert(schema.studySession).values({
        date: today,
        skill: "vocab",
        slot: "srs",
        sourceUrl: REVIEW_SESSION_MARKER,
        status: REVIEW_SESSION_STATUS,
        notes: "Phiên ôn lỗi (SRS).",
      });
    }

    return { newInterval: next.intervalDays, dueDate };
  });

  revalidatePath("/ielts/review");
  revalidatePath("/ielts");
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");

  return { cardId, newInterval, dueDate };
}

/** Count of cards due today (for badges / dashboard). */
export async function countDue(): Promise<number> {
  const rows = await getDueCards();
  return rows.length;
}
