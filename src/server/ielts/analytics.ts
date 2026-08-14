"use server";

import { db, schema } from "@/lib/ielts/db";

const WRITING_CRITERIA = [
  ["Task response", "bandTa"],
  ["Coherence", "bandCc"],
  ["Lexical", "bandLr"],
  ["Grammar", "bandGra"],
] as const;

export async function getLearningAnalytics() {
  const [sessions, submissions, cards, reviews] = await Promise.all([
    db.select().from(schema.studySession),
    db.select().from(schema.writingSubmission),
    db.select().from(schema.errorCard),
    db.select().from(schema.reviewLog),
  ]);
  const cutoff = daysAgo(27);
  const recentSessions = sessions.filter((session) => session.date >= cutoff);
  const sessionById = new Map(sessions.map((session) => [session.id, session]));
  const writingAttempts = submissions
    .map((submission) => ({
      submission,
      session:
        submission.sessionId == null
          ? undefined
          : sessionById.get(submission.sessionId),
    }))
    .filter((item) => item.session)
    .sort((a, b) =>
      (a.session?.date ?? "").localeCompare(b.session?.date ?? ""),
    );
  const recentWriting = writingAttempts.filter(
    (item) => (item.session?.date ?? "") >= cutoff,
  );

  const errorThemes = [...cards]
    .reduce((themes, card) => {
      const key = `${card.sourceType}:${card.errorType}`;
      const current = themes.get(key) ?? { label: key, count: 0, lapses: 0 };
      current.count += 1;
      current.lapses += card.lapses;
      themes.set(key, current);
      return themes;
    }, new Map<string, { label: string; count: number; lapses: number }>())
    .values();

  const criteria = WRITING_CRITERIA.map(([label, key]) => ({
    label,
    value: average(
      recentWriting
        .map((item) => item.submission[key])
        .filter((value): value is number => typeof value === "number"),
    ),
  }));

  return {
    periodDays: 28,
    activeDays: new Set(recentSessions.map((session) => session.date)).size,
    sessions: recentSessions.length,
    minutes: recentSessions.reduce(
      (total, session) => total + (session.durationMin ?? 0),
      0,
    ),
    writingAttempts: recentWriting.length,
    writingOverall: average(
      recentWriting
        .map((item) => item.submission.bandOverall)
        .filter((value): value is number => typeof value === "number"),
    ),
    writingTrend: writingAttempts.slice(-8).map((item) => ({
      date: item.session?.date ?? "",
      value: item.submission.bandOverall,
    })),
    criteria,
    errorThemes: [...errorThemes]
      .sort((a, b) => b.count + b.lapses - (a.count + a.lapses))
      .slice(0, 5),
    dueCards: cards.filter((card) => card.dueDate <= today()).length,
    stubbornCards: cards.filter((card) => card.lapses >= 3).length,
    reviewsLast28: reviews.filter(
      (review) => review.reviewedAt.slice(0, 10) >= cutoff,
    ).length,
  };
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}
