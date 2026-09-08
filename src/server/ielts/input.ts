"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { isSelfLoggable } from "@/lib/ielts/plan";
import { toISODate } from "@/lib/ielts/srs";

/**
 * The daily input habit: "I listened" / "I read", with minutes.
 *
 * Roadmap v3 makes Listening and Reading a daily contact habit rather than one
 * timed exercise a week, because that is where +2.0 band has to come from.
 * Logging is deliberately frictionless: no source, no score, no upload.
 */
export type InputKind = "listening" | "reading";

export async function logDailyInput(
  kind: InputKind,
  minutes: number,
): Promise<{ totalMinutes: number }> {
  await requireIeltsUser();
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 600) {
    throw new Error("Số phút phải nằm trong khoảng 1 đến 600.");
  }
  const date = toISODate();

  const total = await db.transaction(async (tx) => {
    // One row per kind per day, topped up rather than duplicated, so the
    // streak and pace windows count study days and not button presses.
    const [existing] = await tx
      .select()
      .from(schema.studySession)
      .where(
        and(
          eq(schema.studySession.date, date),
          eq(schema.studySession.slot, "input"),
          eq(schema.studySession.skill, kind),
        ),
      )
      .limit(1);

    if (existing) {
      const next = (existing.durationMin ?? 0) + Math.round(minutes);
      await tx
        .update(schema.studySession)
        .set({ durationMin: next })
        .where(eq(schema.studySession.id, existing.id));
      return next;
    }

    await tx.insert(schema.studySession).values({
      date,
      skill: kind,
      slot: "input",
      durationMin: Math.round(minutes),
      status: "done",
      notes: kind === "listening" ? "Nghe hằng ngày" : "Đọc hằng ngày",
    });
    return Math.round(minutes);
  });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  return { totalMinutes: total };
}

/**
 * Tick off a weekly slot that has no tool behind it, such as the grammar drill.
 * Slots that do have a tool are deliberately refused: they are completed by
 * saving real work, so a mock can never be ticked without its bands.
 */
export async function logSlot(
  slot: string,
  minutes: number,
): Promise<{ date: string }> {
  await requireIeltsUser();
  if (!isSelfLoggable(slot)) {
    throw new Error(
      `Suất "${slot}" phải được hoàn thành bằng cách lưu kết quả trong công cụ tương ứng.`,
    );
  }
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 600) {
    throw new Error("Số phút phải nằm trong khoảng 1 đến 600.");
  }
  const date = toISODate();

  await db.insert(schema.studySession).values({
    date,
    skill: "vocab",
    slot,
    durationMin: Math.round(minutes),
    status: "done",
    notes: "Drill ngữ pháp",
  });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  return { date };
}
