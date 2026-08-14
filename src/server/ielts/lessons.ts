"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { lessonQueueStatus, lessonSequence } from "@/lib/ielts/plan";
import type { Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

const LESSON_PREFIX = "ielts:lesson:";

export async function listCompletedLessonIds(): Promise<string[]> {
  const rows = await db
    .select({
      sourceUrl: schema.studySession.sourceUrl,
      lessonId: schema.studySession.lessonId,
      status: schema.studySession.status,
    })
    .from(schema.studySession);

  return rows
    .map((row) =>
      row.sourceUrl?.startsWith(LESSON_PREFIX)
        ? row.sourceUrl.slice(LESSON_PREFIX.length)
        : row.status === "lesson_done"
          ? row.lessonId
          : undefined,
    )
    .filter((id): id is string => Boolean(id));
}

export async function getLessonHistory(lessonId: string) {
  const lesson = lessonSequence().find((item) => item.id === lessonId);
  if (!lesson) return null;

  const sessions = await db
    .select()
    .from(schema.studySession)
    .where(eq(schema.studySession.lessonId, lessonId))
    .orderBy(desc(schema.studySession.date), desc(schema.studySession.id));
  const sessionIds = new Set(sessions.map((session) => session.id));
  const [allSubmissions, allCards] = await Promise.all([
    db.select().from(schema.writingSubmission),
    db.select().from(schema.errorCard),
  ]);
  const submissions = allSubmissions.filter(
    (submission) =>
      submission.sessionId != null && sessionIds.has(submission.sessionId),
  );
  const submissionIds = new Set(submissions.map((submission) => submission.id));
  const cards = allCards.filter(
    (card) =>
      card.sourceRef === `lesson:${lessonId}` ||
      (card.sourceRef?.startsWith("study_session:") &&
        sessionIds.has(
          Number(card.sourceRef.slice("study_session:".length)),
        )) ||
      (card.sourceRef?.startsWith("writing_submission:") &&
        submissionIds.has(
          Number(card.sourceRef.slice("writing_submission:".length)),
        )),
  );

  return { lesson, sessions, submissions, cards };
}

export async function listLessonHistory() {
  const lessons = lessonSequence();
  const records = await Promise.all(
    lessons.map((lesson) => getLessonHistory(lesson.id)),
  );
  return records.filter(
    (record): record is NonNullable<typeof record> =>
      record != null && record.sessions.length > 0,
  );
}

/**
 * The lesson the queue is actually waiting on right now — derived from
 * completed lessons, never from the calendar. This is the source of truth
 * for the `phase`/`week`/`lessonId` metadata stamped on new study_session
 * rows (see docs/ielts/REVIEW-PERSONALIZATION.md §2).
 */
export async function currentLessonMeta(): Promise<{
  lessonId: string;
  phase: number;
  week: number;
}> {
  const completedIds = await listCompletedLessonIds();
  const { current } = lessonQueueStatus(completedIds);
  return { lessonId: current.id, phase: current.phase, week: current.week };
}

export async function completeLesson(lessonId: string): Promise<void> {
  return completeLessonWithNotes(lessonId);
}

export interface CompleteGuidedLessonInput {
  lessonId: string;
  completedSteps: number;
  reflection: string;
  sourceTitle?: string;
}

/**
 * A self-guided lesson needs a small, reviewable learning trace before it can
 * advance the queue. Tool-backed lessons are completed by their saved output.
 */
export async function completeGuidedLesson(
  input: CompleteGuidedLessonInput,
): Promise<void> {
  await requireIeltsUser();
  const lesson = lessonSequence().find((item) => item.id === input.lessonId);
  if (!lesson) throw new Error(`Không tìm thấy bài ${input.lessonId}.`);
  if (lesson.activity.tool) {
    throw new Error("Bài này cần được lưu trong công cụ học tương ứng.");
  }
  if (input.completedSteps !== lesson.activity.steps.length) {
    throw new Error("Hãy hoàn thành và tick đủ các bước của bài trước.");
  }

  const reflection = input.reflection.trim();
  if (reflection.length < 20) {
    throw new Error("Hãy ghi ít nhất một điều cụ thể bạn đã học (20 ký tự).");
  }

  const source = input.sourceTitle?.trim();
  const notes = [
    "Bằng chứng hoàn thành",
    source ? `Nguồn đã dùng: ${source}` : null,
    `Điều đã học: ${reflection}`,
  ]
    .filter(Boolean)
    .join("\n");

  await completeLessonWithNotes(input.lessonId, notes);
}

async function completeLessonWithNotes(
  lessonId: string,
  notes?: string,
): Promise<void> {
  await requireIeltsUser();
  const lesson = lessonSequence().find((item) => item.id === lessonId);
  if (!lesson) throw new Error(`Không tìm thấy bài ${lessonId}.`);

  const marker = markerFor(lessonId);
  const existing = await db
    .select({ id: schema.studySession.id })
    .from(schema.studySession)
    .where(eq(schema.studySession.lessonId, lessonId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.studySession).values({
      date: toISODate(),
      skill: skillForLesson(lesson.activity.skill),
      lessonId: lesson.id,
      phase: lesson.phase,
      week: lesson.week,
      durationMin: lesson.activity.minutes,
      sourceUrl: marker,
      notes:
        notes ?? `Hoàn thành bài ${lesson.index}: ${lesson.activity.label}`,
      status: "done",
    });
  } else {
    await db
      .update(schema.studySession)
      .set({ status: "lesson_done", ...(notes ? { notes } : {}) })
      .where(eq(schema.studySession.id, existing[0].id));
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
