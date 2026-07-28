"use server";

import { lessonSequence } from "@/lib/ielts/plan";
import type { Skill } from "@/lib/ielts/schema";
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
  const notes = input.notes.trim();
  if (!notes) throw new Error("Note đang trống.");
  const lesson = lessonSequence().find((item) => item.id === input.lessonId);

  return logSession({
    skill: input.skill,
    phase: lesson?.phase,
    week: lesson?.week,
    durationMin: input.durationMin,
    sourceUrl: input.sourceUrl,
    notes: lesson
      ? [`Bài ${lesson.index}: ${lesson.activity.label}`, "", notes].join("\n")
      : notes,
  });
}
