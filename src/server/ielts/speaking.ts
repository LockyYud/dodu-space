"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import type { SpeakingSession } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";
import { completeLesson, currentLessonMeta } from "./lessons";

export interface AddSpeakingInput {
  lessonId?: string;
  date?: string;
  durationMin?: number;
  tutorNotes?: string;
  bandEstimate?: number;
  /** Mistakes the tutor pointed out, to add to the SRS. */
  cards?: { front: string; back: string; explanation?: string }[];
}

export async function addSpeaking(
  input: AddSpeakingInput,
): Promise<{ sessionId: number; lessonCompleted: boolean }> {
  await requireIeltsUser();
  const tutorNotes = input.tutorNotes?.trim();
  if (
    input.durationMin == null ||
    !Number.isFinite(input.durationMin) ||
    input.durationMin <= 0
  ) {
    throw new Error("Hãy nhập thời lượng buổi Speaking lớn hơn 0 phút.");
  }
  if (!tutorNotes || tutorNotes.length < 20) {
    throw new Error(
      "Hãy ghi ít nhất một nhận xét cụ thể của buổi Speaking (20 ký tự).",
    );
  }
  if (
    input.bandEstimate != null &&
    (!Number.isFinite(input.bandEstimate) ||
      input.bandEstimate < 0 ||
      input.bandEstimate > 9)
  ) {
    throw new Error("Band phải nằm trong khoảng 0–9.");
  }
  const today = input.date ?? toISODate();
  const lesson = await currentLessonMeta();
  const shouldCompleteLesson = input.lessonId === lesson.lessonId;
  const cards = (input.cards ?? []).filter((c) => c.front && c.back);

  const speakingSessionId = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(schema.speakingSession)
      .values({
        date: today,
        durationMin: input.durationMin ?? null,
        tutorNotes,
        bandEstimate: input.bandEstimate ?? null,
      })
      .returning({ id: schema.speakingSession.id });

    // Log a study_session so speaking counts toward the streak.
    await tx.insert(schema.studySession).values({
      date: today,
      skill: "speaking",
      lessonId: lesson.lessonId,
      phase: lesson.phase,
      week: lesson.week,
      durationMin: input.durationMin,
      bandEstimate: input.bandEstimate ?? null,
      notes: tutorNotes,
      status: "done",
    });

    if (cards.length > 0) {
      await tx.insert(schema.errorCard).values(
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

    return row.id;
  });

  if (shouldCompleteLesson && input.lessonId) {
    await completeLesson(input.lessonId);
  }

  revalidatePath("/ielts");
  revalidatePath("/ielts/speaking");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  return {
    sessionId: speakingSessionId,
    lessonCompleted: shouldCompleteLesson,
  };
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
