"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { overallOf } from "@/lib/ielts/bands";
import { db, schema } from "@/lib/ielts/db";
import { findLesson } from "@/lib/ielts/plan";
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
  /** Mock lessons record both skills at once; baselines use `bandEstimate`. */
  bandListening?: number;
  bandReading?: number;
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

  // Baseline and mock lessons exist to produce numbers. Without them the band
  // chart and every band-gap recommendation stay blind, so they are required
  // rather than optional here.
  const plannedLesson = input.lessonId ? findLesson(input.lessonId) : undefined;
  const kind = plannedLesson?.activity.kind;
  for (const band of [input.bandListening, input.bandReading]) {
    if (band != null && (!Number.isFinite(band) || band < 0 || band > 9)) {
      throw new Error("Band phải nằm trong khoảng 0–9.");
    }
  }
  if (kind === "baseline" && input.bandEstimate == null) {
    throw new Error(
      "Bài baseline cần band ước tính — đây là mốc so sánh của cả lộ trình.",
    );
  }
  if (
    kind === "mock" &&
    (input.bandListening == null || input.bandReading == null)
  ) {
    throw new Error("Mock cần cả band Listening và band Reading.");
  }

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

    if (kind === "baseline" || kind === "mock") {
      const listening =
        input.bandListening ??
        (input.skill === "listening" ? input.bandEstimate : undefined) ??
        null;
      const reading =
        input.bandReading ??
        (input.skill === "reading" ? input.bandEstimate : undefined) ??
        null;
      await tx.insert(schema.bandHistory).values({
        date: today,
        listening,
        reading,
        // A single-skill baseline leaves `overall` null on purpose so it does
        // not draw a fake overall point on the progress chart.
        overall: kind === "mock" ? overallOf({ listening, reading }) : null,
        isMock: kind === "mock",
        note:
          kind === "mock"
            ? `Mock L+R tuần ${plannedLesson?.week ?? ""}`.trim()
            : `Baseline ${input.skill}`,
      });
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
