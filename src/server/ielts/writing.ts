"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  type GradeInput,
  type GradingResult,
  gradeWriting,
  type SuggestedCard,
} from "@/lib/ielts/grading";
import { topErrorThemes } from "@/lib/ielts/insights";
import { learnerProfile, targetSummary } from "@/lib/ielts/profile";
import { toISODate } from "@/lib/ielts/srs";
import { currentLessonMeta } from "./lessons";

/** Grade an essay without persisting anything (learner reviews before saving). */
export async function gradeAction(input: GradeInput): Promise<GradingResult> {
  await requireIeltsUser();
  return gradeWriting({
    ...input,
    learnerContext: await buildLearnerContext(),
  });
}

export interface SaveSubmissionInput {
  taskType: "task1" | "task2";
  topic?: string;
  prompt?: string;
  essay: string;
  result: GradingResult;
  selectedCards: SuggestedCard[];
}

/** Persist a graded submission + the error cards the learner chose to keep. */
export async function saveSubmission(
  input: SaveSubmissionInput,
): Promise<{ submissionId: number; cardsAdded: number }> {
  await requireIeltsUser();
  const today = toISODate();
  const lesson = await currentLessonMeta();
  const { bands } = input.result;
  const wordCount = input.essay.trim().split(/\s+/).filter(Boolean).length;

  const { submissionId, cardsAdded } = await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(schema.studySession)
      .values({
        date: today,
        skill: "writing",
        lessonId: lesson.lessonId,
        phase: lesson.phase,
        week: lesson.week,
        bandEstimate: bands.overall,
        notes: input.topic ?? null,
        status: "done",
      })
      .returning({ id: schema.studySession.id });

    const [submission] = await tx
      .insert(schema.writingSubmission)
      .values({
        sessionId: session.id,
        taskType: input.taskType,
        topic: input.topic ?? null,
        prompt: input.prompt ?? null,
        essayText: input.essay,
        wordCount,
        bandTa: bands.task_response,
        bandCc: bands.coherence,
        bandLr: bands.lexical,
        bandGra: bands.grammar,
        bandOverall: bands.overall,
        feedbackJson: JSON.stringify(input.result.feedback),
      })
      .returning({ id: schema.writingSubmission.id });

    if (input.selectedCards.length > 0) {
      await tx.insert(schema.errorCard).values(
        input.selectedCards.map((c) => ({
          sourceType: "writing" as const,
          sourceRef: `writing_submission:${submission.id}`,
          errorType: c.error_type,
          front: c.front,
          back: c.back,
          explanation: c.explanation,
          context: input.topic ?? `${input.taskType}`,
          dueDate: today, // new cards are due immediately
        })),
      );
    }

    return {
      submissionId: submission.id,
      cardsAdded: input.selectedCards.length,
    };
  });

  revalidatePath("/ielts/errors");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts");

  return { submissionId, cardsAdded };
}

async function buildLearnerContext(): Promise<string> {
  const profile = await learnerProfile();
  const cards = await db.select().from(schema.errorCard);
  const themes = topErrorThemes(cards, 5);
  const stubborn = cards
    .filter((c) => c.lapses >= 3)
    .slice(0, 5)
    .map((c) => `${c.errorType}: ${c.front} -> ${c.back}`);

  return [
    `Name: ${profile.name}. Goal: ${profile.examGoal} (${await targetSummary(profile)}).`,
    `Starting point: ${profile.startPoint}`,
    `Strategy: ${profile.strategy}`,
    `Daily constraint: ${profile.dailyMinutes} minutes/day.`,
    `Current recurring error themes: ${themes.length ? themes.join(", ") : "not enough real history yet"}.`,
    stubborn.length
      ? `Stubborn mistakes to watch for: ${stubborn.join(" | ")}.`
      : "No stubborn mistakes yet; extract reusable errors that would block Writing 6.5-7.0.",
    "Give feedback as a coach for this learner: concrete, Vietnamese is preferred, focus on the smallest rewrite that improves band.",
  ].join("\n");
}
