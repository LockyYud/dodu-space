"use server";

import { db, schema } from "@/lib/ielts/db";
import {
  countRecentSessions,
  type PaceReport,
  paceStatus,
  suggestedExamDate,
} from "@/lib/ielts/pace";
import {
  habitGatePassed,
  lessonQueueStatus,
  weeklyCompletionCounts,
} from "@/lib/ielts/plan";
import { learnerProfile } from "@/lib/ielts/profile";
import { listCompletedLessonIds } from "./lessons";

export interface PaceOverview {
  report: PaceReport;
  /** True once the learner has held the weekly target for 4 straight weeks. */
  habitGate: boolean;
  /** Earliest exam date that fits the remaining lessons at the weekly target. */
  suggestedExam: string;
}

/**
 * Everything the UI needs to say "are you on pace?" in one round-trip.
 * Kept separate from the pure helpers in src/lib/ielts/pace.ts so those stay
 * testable without a database.
 */
export async function getPaceOverview(): Promise<PaceOverview> {
  const [profile, completedIds, sessionDates] = await Promise.all([
    learnerProfile(),
    listCompletedLessonIds(),
    db.select({ date: schema.studySession.date }).from(schema.studySession),
  ]);

  const queue = lessonQueueStatus(completedIds);
  const report = paceStatus({
    completedRequired: queue.completedCount,
    totalRequired: queue.totalCount,
    weeklyTarget: profile.weeklyTarget,
    sessionsLast14d: countRecentSessions(sessionDates.map((row) => row.date)),
    examDate: profile.examDate,
  });

  return {
    report,
    habitGate: habitGatePassed(
      weeklyCompletionCounts(completedIds),
      profile.weeklyTarget,
    ),
    suggestedExam: suggestedExamDate(report.remaining, profile.weeklyTarget),
  };
}
