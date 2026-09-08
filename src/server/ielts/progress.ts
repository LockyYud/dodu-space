"use server";

import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/ielts/db";
import { learnerProfile } from "@/lib/ielts/profile";
import { type ProgressReport, progressReport } from "@/lib/ielts/progress";
import { currentPhase } from "./plan-state";

/**
 * Loads everything `progressReport()` needs in one round-trip and evaluates
 * the current phase against it.
 */
export async function loadProgress(): Promise<ProgressReport> {
  const [state, profile, sessions, submissions, bands] = await Promise.all([
    currentPhase(),
    learnerProfile(),
    db
      .select({
        date: schema.studySession.date,
        skill: schema.studySession.skill,
        slot: schema.studySession.slot,
        durationMin: schema.studySession.durationMin,
      })
      .from(schema.studySession),
    db
      .select({
        createdAt: schema.writingSubmission.createdAt,
        wordCount: schema.writingSubmission.wordCount,
        errorDensity: schema.writingSubmission.errorDensity,
        isRewrite: schema.writingSubmission.isRewrite,
      })
      .from(schema.writingSubmission),
    db
      .select({
        date: schema.bandHistory.date,
        listening: schema.bandHistory.listening,
        reading: schema.bandHistory.reading,
        isMock: schema.bandHistory.isMock,
      })
      .from(schema.bandHistory)
      .orderBy(desc(schema.bandHistory.date)),
  ]);

  return progressReport({
    state,
    sessions,
    submissions,
    bands,
    examDate: profile.examDate,
  });
}
