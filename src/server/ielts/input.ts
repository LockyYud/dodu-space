"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  EVALUATION_METADATA_VERSION,
  type EvaluationMetadata,
} from "@/lib/ielts/evaluation";
import { isSelfLoggable } from "@/lib/ielts/plan";
import { type ActionResult, fail, ok } from "@/lib/ielts/result";
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
): Promise<ActionResult<{ totalMinutes: number }>> {
  await requireIeltsUser();
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 600) {
    return fail("Số phút phải nằm trong khoảng 1 đến 600.");
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
  return ok({ totalMinutes: total });
}

/**
 * Ghi một buổi 4/3/2 — METHOD-REVIEW §5.
 *
 * Kỹ thuật này (nói cùng nội dung trong 4 phút, rồi 3, rồi 2) có bằng chứng về
 * cải thiện độ trôi chảy và **không cần người nghe, không cần AI chấm**.
 *
 * Chỉ ghi đúng một con số: lượt ba có gọn trong 2 phút hay không. Đủ để thấy
 * tiến bộ, nhẹ đủ để không bỏ.
 */
export async function logSpeakDrill(
  fitInTwoMinutes: boolean,
  minutes = 10,
  transcript?: string,
): Promise<{ date: string }> {
  await requireIeltsUser();
  const date = toISODate();
  const transcriptText = transcript?.trim() ?? "";
  if (!transcriptText) {
    throw new Error("Hãy nhập transcript của lượt 4/3/2 trước khi lưu.");
  }
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 600) {
    throw new Error("Số phút phải nằm trong khoảng 1 đến 600.");
  }
  const durationMin = Math.max(1, Math.round(minutes));
  const evaluationMeta: EvaluationMetadata = {
    version: EVALUATION_METADATA_VERSION,
    method: "manual",
    source: "self",
    stages: [
      {
        purpose: "speaking_drill",
        rubric_version: "speaking-432.v1",
        sample_count: 1,
        evaluated_at: new Date().toISOString(),
      },
    ],
  };

  await db.transaction(async (tx) => {
    const notes = fitInTwoMinutes
      ? "4/3/2 — lượt ba gọn trong 2 phút"
      : "4/3/2 — lượt ba chưa kịp 2 phút";
    const [study] = await tx
      .insert(schema.studySession)
      .values({
        date,
        skill: "speaking",
        slot: "speak-drill",
        durationMin,
        status: "done",
        notes,
      })
      .returning({ id: schema.studySession.id });
    await tx.insert(schema.speakingSession).values({
      date,
      durationMin,
      sessionId: study.id,
      transcript: transcriptText,
      fitInTwoMinutes,
      feedbackJson: JSON.stringify({
        summary: notes,
        next_steps: [
          "Lặp lại cùng chủ đề và cố gắng giữ ý chính trong 2 phút.",
        ],
      }),
      evaluationMetaJson: evaluationMeta,
      tutorNotes: notes,
    });
  });
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  return { date };
}

/**
 * Tick off a weekly slot that has no tool behind it, such as the grammar drill.
 * Slots that do have a tool are deliberately refused: they are completed by
 * saving real work, so a mock can never be ticked without its bands.
 */
export async function logSlot(
  slot: string,
  minutes: number,
): Promise<ActionResult<{ date: string }>> {
  await requireIeltsUser();
  if (!isSelfLoggable(slot)) {
    return fail(
      `Suất "${slot}" phải được hoàn thành bằng cách lưu kết quả trong công cụ tương ứng.`,
    );
  }
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 600) {
    return fail("Số phút phải nằm trong khoảng 1 đến 600.");
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
  return ok({ date });
}
