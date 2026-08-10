"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { captureCards } from "@/lib/ielts/capture";
import { db, schema } from "@/lib/ielts/db";
import { lessonSequence } from "@/lib/ielts/plan";
import type { Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";
import { logSession } from "./sessions";

export interface SaveTodayNoteInput {
  lessonId: string;
  skill: Skill;
  durationMin: number;
  sourceUrl?: string;
  notes: string;
}

export async function saveTodayNote(
  input: SaveTodayNoteInput,
): Promise<number> {
  await requireIeltsUser();
  const notes = input.notes.trim();
  if (!notes) throw new Error("Note đang trống.");
  const lesson = lessonSequence().find((item) => item.id === input.lessonId);

  return logSession({
    skill: input.skill,
    lessonId: lesson?.id,
    phase: lesson?.phase,
    week: lesson?.week,
    durationMin: input.durationMin,
    sourceUrl: input.sourceUrl,
    notes: lesson
      ? [`Bài ${lesson.index}: ${lesson.activity.label}`, "", notes].join("\n")
      : notes,
  });
}

export interface CaptureLessonCardsInput {
  lessonId: string;
  skill: Skill;
  sourceTitle?: string;
  sourceUrl?: string;
  raw: string;
}

export async function captureLessonCards(
  input: CaptureLessonCardsInput,
): Promise<{ cardsAdded: number }> {
  await requireIeltsUser();
  const raw = input.raw.trim();
  if (!raw) throw new Error("Chưa có lỗi/từ mới để capture.");

  const lesson = lessonSequence().find((item) => item.id === input.lessonId);
  const cards = await captureCards({
    skill: input.skill,
    lessonLabel: lesson?.activity.label ?? input.lessonId,
    sourceTitle: input.sourceTitle,
    raw,
  });

  if (cards.length === 0) return { cardsAdded: 0 };

  const context = [
    lesson ? `Bài ${lesson.index}: ${lesson.activity.label}` : input.lessonId,
    input.sourceTitle,
  ]
    .filter(Boolean)
    .join(" · ");

  await db.insert(schema.errorCard).values(
    cards.map((card) => ({
      sourceType: input.skill,
      sourceRef: input.sourceUrl ?? `lesson:${input.lessonId}`,
      errorType: card.error_type,
      front: card.front,
      back: card.back,
      explanation: card.explanation,
      context,
      dueDate: toISODate(),
    })),
  );

  revalidatePath("/ielts");
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/errors");
  revalidatePath("/ielts/review");
  return { cardsAdded: cards.length };
}
