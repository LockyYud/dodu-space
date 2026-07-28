"use server";

import { eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/ielts/db";
import { lessonSequence } from "@/lib/ielts/plan";
import type { Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

const LESSON_PREFIX = "ielts:lesson:";

export async function listCompletedLessonIds(): Promise<string[]> {
  const rows = await db
    .select({ sourceUrl: schema.studySession.sourceUrl })
    .from(schema.studySession)
    .where(like(schema.studySession.sourceUrl, `${LESSON_PREFIX}%`));

  return rows
    .map((row) => row.sourceUrl?.slice(LESSON_PREFIX.length))
    .filter((id): id is string => Boolean(id));
}

export async function completeLesson(lessonId: string): Promise<void> {
  const lesson = lessonSequence().find((item) => item.id === lessonId);
  if (!lesson) throw new Error(`Không tìm thấy bài ${lessonId}.`);

  const marker = markerFor(lessonId);
  const existing = await db
    .select({ id: schema.studySession.id })
    .from(schema.studySession)
    .where(eq(schema.studySession.sourceUrl, marker))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.studySession).values({
      date: toISODate(),
      skill: skillForLesson(lesson.activity.skill),
      phase: lesson.phase,
      week: lesson.week,
      durationMin: lesson.activity.minutes,
      sourceUrl: marker,
      notes: `Hoàn thành bài ${lesson.index}: ${lesson.activity.label}`,
      status: "done",
    });
  }

  revalidatePath("/ielts");
  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
}

function markerFor(lessonId: string): string {
  return `${LESSON_PREFIX}${lessonId}`;
}

function skillForLesson(skill: Skill | "rest"): Skill {
  return skill === "rest" ? "vocab" : skill;
}
