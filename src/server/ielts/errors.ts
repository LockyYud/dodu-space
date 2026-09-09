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

/**
 * Nhóm lỗi người học lặp nhiều nhất, kèm số thẻ.
 *
 * Ô "Drill ngữ pháp" trước đây bảo "đánh vào nhóm lỗi lặp nhiều nhất" mà không
 * nói nhóm nào — dữ liệu để trả lời nằm ngay trong bảng thẻ. Trả về `null` khi
 * kho lỗi chưa đủ để nói được gì.
 */
export async function topErrorRule(): Promise<{
  rule: string;
  count: number;
} | null> {
  const rows = await db
    .select({ rule: schema.errorCard.rule })
    .from(schema.errorCard);

  const counts = new Map<string, number>();
  for (const row of rows) {
    // "other" là thùng chứa phần không phân loại được, không phải một nhóm để
    // luyện; trỏ người học vào đó thì không có unit ngữ pháp nào để mở.
    if (!row.rule || row.rule === "other") continue;
    counts.set(row.rule, (counts.get(row.rule) ?? 0) + 1);
  }

  let best: { rule: string; count: number } | null = null;
  for (const [rule, count] of counts) {
    if (!best || count > best.count) best = { rule, count };
  }
  return best;
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
