"use server";

import {
  countRecentSessions,
  daysSince,
  earliestDate,
  type PaceReport,
  paceStatus,
  suggestedExamDate,
} from "@/lib/ielts/pace";
import { plannedWeeksRemaining } from "@/lib/ielts/plan";
import { learnerProfile } from "@/lib/ielts/profile";
import { planAnchorDate } from "./plan-state";
import { loadProgress } from "./progress";
import { listStudyDates } from "./sessions";

export interface PaceOverview {
  report: PaceReport;
  suggestedExam: string;
}

/**
 * Pace for the phase the learner is actually in. Kept separate from the pure
 * helpers in src/lib/ielts/pace.ts so those stay testable without a database.
 */
export async function getPaceOverview(): Promise<PaceOverview> {
  const [profile, progress, studyDates] = await Promise.all([
    learnerProfile(),
    loadProgress(),
    listStudyDates(),
  ]);

  // Read after loadProgress(): that call is what opens the first phase row.
  const anchor = await planAnchorDate();

  const planned = plannedWeeksRemaining(
    progress.phase.id,
    progress.weekInPhase,
  );
  const report = paceStatus({
    plannedWeeksRemaining: planned,
    studyDaysLast14: countRecentSessions(studyDates),
    daysSincePlanStart: daysSince(
      earliestDate(profile.planStart, anchor) ?? profile.planStart,
    ),
    examDate: profile.examDate,
  });

  return { report, suggestedExam: suggestedExamDate(planned) };
}
