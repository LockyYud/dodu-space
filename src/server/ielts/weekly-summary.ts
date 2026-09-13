import "server-only";

import { and, desc, gte, inArray, lte, or } from "drizzle-orm";
import { db, schema } from "@/lib/ielts/db";
import {
  aggregateWeeklyEnglishSummary,
  isoWeekPeriod,
  previousISOWeek,
  type WeeklyEnglishSummary,
} from "@/lib/ielts/weekly-summary";

/**
 * Internal server-only read model for the weekly workflow.  It deliberately
 * has no route, auth action, Notion call, or evaluator call: callers receive
 * the JSON-ready aggregate and decide where to send it.
 */
export async function getWeeklyEnglishSummary(
  week: string,
): Promise<WeeklyEnglishSummary> {
  // Validate before touching the DB.  This also makes malformed week input
  // deterministic when the database is unavailable.
  const period = isoWeekPeriod(week);
  const previousPeriod = isoWeekPeriod(previousISOWeek(week));
  const rangeStart = previousPeriod.start_date;
  const rangeEnd = period.end_date;

  const sessionRows = await db
    .select()
    .from(schema.studySession)
    .where(dateWindow(schema.studySession.date, rangeStart, rangeEnd));

  const sessionIds = sessionRows
    .map((row) => row.id)
    .filter((id): id is number => Number.isInteger(id));
  const sessionIdRefs = sessionIds.map((id) => String(id));

  const [writingRows, externalBenchmarkRows, speakingRows] = await Promise.all([
    db
      .select()
      .from(schema.writingSubmission)
      .where(
        or(
          dateWindow(schema.writingSubmission.date, rangeStart, rangeEnd),
          timestampWindow(
            schema.writingSubmission.createdAt,
            rangeStart,
            rangeEnd,
          ),
          ...(sessionIds.length > 0
            ? [inArray(schema.writingSubmission.sessionId, sessionIds)]
            : []),
        ),
      ),
    db
      .select()
      .from(schema.externalBenchmark)
      .where(lte(schema.externalBenchmark.date, period.end_date))
      .orderBy(
        desc(schema.externalBenchmark.date),
        desc(schema.externalBenchmark.id),
      )
      .limit(2),
    db
      .select()
      .from(schema.speakingSession)
      .where(
        or(
          dateWindow(schema.speakingSession.date, rangeStart, rangeEnd),
          ...(sessionIds.length > 0
            ? [inArray(schema.speakingSession.sessionId, sessionIds)]
            : []),
        ),
      ),
  ]);

  const receptiveRows =
    sessionIds.length === 0
      ? []
      : await db
          .select()
          .from(schema.receptiveResult)
          .where(inArray(schema.receptiveResult.sessionId, sessionIds));

  const refs = [
    ...sessionIdRefs.map((id) => `study_session:${id}`),
    ...writingRows
      .map((row) => row.id)
      .filter((id): id is number => Number.isInteger(id))
      .map((id) => `writing_submission:${id}`),
    ...speakingRows
      .map((row) => row.id)
      .filter((id): id is number => Number.isInteger(id))
      .map((id) => `speaking_session:${id}`),
  ];

  const errorRows = await db
    .select()
    .from(schema.errorCard)
    .where(
      or(
        dateWindow(schema.errorCard.observedOn, rangeStart, rangeEnd),
        timestampWindow(schema.errorCard.createdAt, rangeStart, rangeEnd),
        ...(refs.length > 0 ? [inArray(schema.errorCard.sourceRef, refs)] : []),
      ),
    );

  return aggregateWeeklyEnglishSummary(
    {
      studySessions: sessionRows,
      writingSubmissions: writingRows,
      speakingSessions: speakingRows,
      receptiveResults: receptiveRows,
      errorCards: errorRows,
      externalBenchmarks: externalBenchmarkRows,
    },
    week,
  );
}

function dateWindow(
  column: Parameters<typeof gte>[0],
  start: string,
  end: string,
) {
  return and(gte(column, start), lte(column, end));
}

/** DB timestamps are either `YYYY-MM-DD HH:mm:ss` or ISO `T` timestamps. */
function timestampWindow(
  column: Parameters<typeof gte>[0],
  start: string,
  end: string,
) {
  return and(gte(column, start), lte(column, `${end}\uffff`));
}
