"use server";

import {
  countRecentSessions,
  daysSince,
  earliestDate,
  type HoursOutlook,
  hoursOutlook,
  type PaceReport,
  paceStatus,
  suggestedExamDate,
} from "@/lib/ielts/pace";
import {
  computeStreak,
  HOURS_PER_BAND_HIGH,
  HOURS_PER_BAND_LOW,
  plannedGuidedHours,
  plannedWeeksRemaining,
  START_OVERALL_ESTIMATE,
} from "@/lib/ielts/plan";
import { type LearnerProfile, learnerProfile } from "@/lib/ielts/profile";
import type { ProgressReport } from "@/lib/ielts/progress";
import { planAnchorDate } from "./plan-state";
import { loadProgress } from "./progress";
import { countDueSplit, type DueSplit } from "./reviews";
import { guidedHoursStudied, listStudyDates } from "./sessions";
import { countVocabToday } from "./vocab";

export interface TodayData {
  progress: ProgressReport;
  pace: PaceReport;
  hours: HoursOutlook;
  suggestedExam: string;
  /** Hàng đợi ôn tập hôm nay, tách thẻ lỗi và thẻ từ vựng. */
  due: DueSplit;
  /** Thẻ từ vựng mới đã bắt hôm nay — trần và tiến độ đều đọc từ đây. */
  vocabToday: number;
  streak: number;
  profile: LearnerProfile;
}

/**
 * Everything the Today page needs, resolved once. Loading progress and pace
 * separately meant `currentPhase()` ran twice per request, which raced to
 * create two opening phase rows on a fresh database.
 */
export async function loadToday(): Promise<TodayData> {
  const [progress, profile, studyDates, due, studiedHours, vocabToday] =
    await Promise.all([
      loadProgress(),
      learnerProfile(),
      listStudyDates(),
      countDueSplit(),
      guidedHoursStudied(),
      countVocabToday(),
    ]);

  // Read after loadProgress(): that call is what opens the first phase row.
  const anchor = await planAnchorDate();

  const planned = plannedWeeksRemaining(
    progress.phase.id,
    progress.weekInPhase,
  );
  const pace = paceStatus({
    plannedWeeksRemaining: planned,
    studyDaysLast14: countRecentSessions(studyDates),
    daysSincePlanStart: daysSince(
      earliestDate(profile.planStart, anchor) ?? profile.planStart,
    ),
    examDate: profile.examDate,
  });

  const hours = hoursOutlook({
    studied: studiedHours,
    planned: plannedGuidedHours(
      progress.phase.id,
      progress.weekInPhase,
      progress.load,
    ),
    startOverall: START_OVERALL_ESTIMATE,
    targetOverall: profile.targetOverall,
    hoursPerBand: [HOURS_PER_BAND_LOW, HOURS_PER_BAND_HIGH],
  });

  return {
    progress,
    pace,
    hours,
    suggestedExam: suggestedExamDate(planned),
    due,
    vocabToday,
    streak: computeStreak(studyDates),
    profile,
  };
}
