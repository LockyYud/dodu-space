"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import type { ErrorCard } from "@/lib/ielts/schema";

/** All error cards, newest first. */
export async function listCards(): Promise<ErrorCard[]> {
  return db
    .select()
    .from(schema.errorCard)
    .orderBy(desc(schema.errorCard.lapses), desc(schema.errorCard.createdAt));
}

export async function deleteCard(id: number): Promise<void> {
  await requireIeltsUser();
  await db.transaction(async (tx) => {
    // Remove dependent review logs first (FK), then the card.
    await tx.delete(schema.reviewLog).where(eq(schema.reviewLog.cardId, id));
    await tx.delete(schema.errorCard).where(eq(schema.errorCard.id, id));
  });
  revalidatePath("/ielts/errors");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts");
}
