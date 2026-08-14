"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import type { ErrorType, Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";
import { parseScreenshot, type ScreenshotResult } from "@/lib/ielts/vision";
import { completeLesson, currentLessonMeta } from "./lessons";

/** Parse a Reading/Listening result screenshot (data URL) via the vision model. */
export async function parseScreenshotAction(
  dataUrl: string,
): Promise<ScreenshotResult> {
  await requireIeltsUser();
  return parseScreenshot(dataUrl);
}

export interface SaveTrackInput {
  lessonId?: string;
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
export async function saveTrackSession(input: SaveTrackInput): Promise<{
  sessionId: number;
  cardsAdded: number;
  lessonCompleted: boolean;
}> {
  await requireIeltsUser();
  const rawScore = input.rawScore?.trim();
  const notes = input.notes?.trim();
  if (!rawScore && (!notes || notes.length < 20)) {
    throw new Error(
      "Hãy nhập điểm/kết quả hoặc ghi ít nhất một lỗi, bẫy bạn đã gặp (20 ký tự).",
    );
  }
  if (
    input.durationMin != null &&
    (!Number.isFinite(input.durationMin) || input.durationMin <= 0)
  ) {
    throw new Error("Thời lượng phải lớn hơn 0 phút.");
  }
  if (
    input.bandEstimate != null &&
    (!Number.isFinite(input.bandEstimate) ||
      input.bandEstimate < 0 ||
      input.bandEstimate > 9)
  ) {
    throw new Error("Band phải nằm trong khoảng 0–9.");
  }
  const today = toISODate();
  const lesson = await currentLessonMeta();
  const shouldCompleteLesson = input.lessonId === lesson.lessonId;
  const cards = input.cards.filter((c) => c.front && c.back);

  const { sessionId } = await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(schema.studySession)
      .values({
        date: today,
        skill: input.skill,
        lessonId: lesson.lessonId,
        phase: lesson.phase,
        week: lesson.week,
        sourceUrl: input.sourceUrl ?? null,
        rawScore: rawScore || null,
        bandEstimate: input.bandEstimate ?? null,
        durationMin: input.durationMin ?? null,
        notes: notes || null,
        status: "done",
      })
      .returning({ id: schema.studySession.id });

    if (cards.length > 0) {
      await tx.insert(schema.errorCard).values(
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

    return { sessionId: session.id };
  });

  if (shouldCompleteLesson && input.lessonId) {
    await completeLesson(input.lessonId);
  }

  revalidatePath("/ielts");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts/errors");
  return {
    sessionId,
    cardsAdded: cards.length,
    lessonCompleted: shouldCompleteLesson,
  };
}
