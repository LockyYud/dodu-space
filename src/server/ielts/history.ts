"use server";

import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/ielts/db";
import type {
  ErrorCard,
  StudySession,
  WritingSubmission,
} from "@/lib/ielts/schema";

/**
 * History grouped by day.
 *
 * v2 grouped it by lesson, which only worked while the roadmap was a queue of
 * dated lessons. v3 has daily habits and weekly slots, so the day is the unit
 * the learner recognises.
 */
export interface StudyDay {
  date: string;
  sessions: StudySession[];
  submissions: WritingSubmission[];
  cards: ErrorCard[];
}

async function loadAll() {
  const [sessions, submissions, cards] = await Promise.all([
    db
      .select()
      .from(schema.studySession)
      .orderBy(desc(schema.studySession.date), desc(schema.studySession.id)),
    db.select().from(schema.writingSubmission),
    db.select().from(schema.errorCard),
  ]);
  return { sessions, submissions, cards };
}

function group(
  sessions: StudySession[],
  submissions: WritingSubmission[],
  cards: ErrorCard[],
): StudyDay[] {
  const byDate = new Map<string, StudyDay>();
  for (const session of sessions) {
    const day = byDate.get(session.date) ?? {
      date: session.date,
      sessions: [],
      submissions: [],
      cards: [],
    };
    day.sessions.push(session);
    byDate.set(session.date, day);
  }

  for (const day of byDate.values()) {
    const ids = new Set(day.sessions.map((s) => s.id));
    day.submissions = submissions.filter(
      (s) => s.sessionId != null && ids.has(s.sessionId),
    );
    const submissionIds = new Set(day.submissions.map((s) => s.id));
    day.cards = cards.filter((card) => {
      const ref = card.sourceRef ?? "";
      if (ref.startsWith("writing_submission:")) {
        return submissionIds.has(
          Number(ref.slice("writing_submission:".length)),
        );
      }
      if (ref.startsWith("study_session:")) {
        return ids.has(Number(ref.slice("study_session:".length)));
      }
      return card.createdAt.slice(0, 10) === day.date;
    });
  }

  return [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function listStudyDays(limit = 60): Promise<StudyDay[]> {
  const { sessions, submissions, cards } = await loadAll();
  return group(sessions, submissions, cards).slice(0, limit);
}

export async function getStudyDay(date: string): Promise<StudyDay | null> {
  const { sessions, submissions, cards } = await loadAll();
  return (
    group(sessions, submissions, cards).find((d) => d.date === date) ?? null
  );
}
