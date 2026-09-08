"use server";

import {
  countRecentSessions,
  type PaceReport,
  paceStatus,
  suggestedExamDate,
} from "@/lib/ielts/pace";
import { computeStreak, plannedWeeksRemaining } from "@/lib/ielts/plan";
import { type LearnerProfile, learnerProfile } from "@/lib/ielts/profile";
import type { ProgressReport } from "@/lib/ielts/progress";
import { loadProgress } from "./progress";
import { countDue } from "./reviews";
import { listStudyDates } from "./sessions";

export interface TodayData {
  progress: ProgressReport;
  pace: PaceReport;
  suggestedExam: string;
  dueCount: number;
  streak: number;
  profile: LearnerProfile;
}

/**
 * Everything the Today page needs, resolved once. Loading progress and pace
 * separately meant `currentPhase()` ran twice per request, which raced to
 * create two opening phase rows on a fresh database.
 */
export async function loadToday(): Promise<TodayData> {
  const [progress, profile, studyDates, dueCount] = await Promise.all([
    loadProgress(),
    learnerProfile(),
    listStudyDates(),
    countDue(),
  ]);

  const planned = plannedWeeksRemaining(
    progress.phase.id,
    progress.weekInPhase,
  );
  const pace = paceStatus({
    plannedWeeksRemaining: planned,
    studyDaysLast14: countRecentSessions(studyDates),
    examDate: profile.examDate,
  });

  return {
    progress,
    pace,
    suggestedExam: suggestedExamDate(planned),
    dueCount,
    streak: computeStreak(studyDates),
    profile,
  };
}
