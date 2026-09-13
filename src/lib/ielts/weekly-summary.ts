/**
 * Pure aggregation for the Weekly English Summary.
 *
 * This module deliberately knows nothing about Drizzle, Next, authentication,
 * Notion, or an evaluator.  The server loader adapts database rows to the
 * small row shape below and calls `aggregateWeeklyEnglishSummary`.
 */

export const WEEKLY_SUMMARY_SCHEMA_VERSION =
  "weekly-english-summary.v2" as const;

export type WeeklySummarySkill =
  | "reading"
  | "listening"
  | "writing"
  | "speaking"
  | "vocab";
export type EvidenceSkill = Exclude<WeeklySummarySkill, "vocab">;

export interface IsoWeekPeriod {
  week: string;
  start_date: string;
  end_date: string;
}

export interface WeeklyCriteriaAverages {
  fluency_coherence: number | null;
  lexical_resource: number | null;
  grammatical_range_accuracy: number | null;
  pronunciation: number | null;
}

export interface WeeklyCriteriaSampleCounts {
  fluency_coherence: number;
  lexical_resource: number;
  grammatical_range_accuracy: number;
  pronunciation: number;
}

export interface WritingBandTrend {
  scored_sessions: number;
  avg_score: number | null;
  previous_week: number | null;
}

export interface ReceptiveWeeklyStats {
  sessions: number;
  total_correct: number;
  total_questions: number;
  accuracy: number | null;
  previous_week: number | null;
  difficulties: string[];
  sources: string[];
}

export interface WeeklyError {
  /** Normalized rule, or the normalized error type when no rule exists. */
  key: string;
  skill: WeeklySummarySkill;
  count: number;
  /** Number of distinct originating study sessions. */
  session_count: number;
}

export interface WritingSampleBands {
  task_response: number | null;
  coherence: number | null;
  lexical: number | null;
  grammar: number | null;
  overall: number | null;
}

export interface SpeakingSampleCriteria {
  fluency_coherence: number | null;
  lexical_resource: number | null;
  grammatical_range_accuracy: number | null;
  pronunciation: number | null;
}

export interface WeeklyReceptiveResult {
  raw_score: string | null;
  correct_answers: number | null;
  total_questions: number | null;
  accuracy: number | null;
  difficulty: string | null;
  source_title: string | null;
  source_url: string | null;
  feedback: unknown;
  evaluation_metadata: unknown;
}

/**
 * A deliberately selected, untruncated Writing/Speaking evidence row.
 */
export interface WeeklyEvidenceSample {
  skill: EvidenceSkill;
  /** Database id for writing/speaking; `session_id:skill` for receptive rows. */
  id: number | string;
  date: string;
  session_id: number | null;
  duration_min: number | null;
  score: number | null;
  essay_text: string | null;
  transcript: string | null;
  bands: WritingSampleBands | null;
  criteria: SpeakingSampleCriteria | null;
  feedback: unknown;
  result: WeeklyReceptiveResult | null;
  raw_score: string | null;
  correct_answers: number | null;
  total_questions: number | null;
  accuracy: number | null;
  difficulty: string | null;
  source_title: string | null;
  source_url: string | null;
  evaluation_metadata: unknown;
  task_type: string | null;
  topic: string | null;
  prompt_id: string | null;
  prompt: string | null;
  word_count: number | null;
  /** Stored in the existing per-100-words unit. */
  error_density: number | null;
  grading_mode: string | null;
  grader_spread: number | null;
  is_rewrite: boolean | null;
  parent_submission_id: number | null;
}

export interface WeeklyEnglishSummary {
  schema_version: typeof WEEKLY_SUMMARY_SCHEMA_VERSION;
  week: string;
  period: {
    start_date: string;
    end_date: string;
  };
  study: {
    total_sessions: number;
    total_minutes: number;
    active_days: number;
  };
  speaking: {
    sessions: number;
    scored_sessions: number;
    avg_score: number | null;
    previous_week: number | null;
    criteria_averages: WeeklyCriteriaAverages;
    criteria_scored_sessions: WeeklyCriteriaSampleCounts;
    common_errors: string[];
  };
  writing: {
    sessions: number;
    scored_sessions: number;
    avg_score: number | null;
    previous_week: number | null;
    avg_errors_per_100_words: number | null;
    by_task: {
      task1: WritingBandTrend;
      task2: WritingBandTrend;
    };
  };
  reading: ReceptiveWeeklyStats;
  listening: ReceptiveWeeklyStats;
  /** Latest external assessments retained in their native provider scale. */
  external_benchmarks: WeeklyExternalBenchmark[];
  recurring_errors: WeeklyError[];
  representative_samples: WeeklyEvidenceSample[];
}

export interface WeeklyExternalBenchmark {
  provider: string;
  date: string;
  reading_raw: number | null;
  listening_raw: number | null;
  writing_raw: number | null;
  speaking_raw: number | null;
  overall_raw: number | null;
  section_scores: Record<string, number> | null;
  cefr: string | null;
  source_url: string | null;
  notes: string | null;
}

/** Rows accepted by the pure aggregator.  Snake-case aliases are accepted at
 * runtime as well, which keeps fixtures and imported legacy exports useful. */
export interface StudySessionSummaryRow {
  id?: number | null;
  date?: string | null;
  skill?: string | null;
  durationMin?: number | null;
  duration_min?: number | null;
  rawScore?: string | null;
  raw_score?: string | null;
  sourceUrl?: string | null;
  source_url?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface WritingSubmissionSummaryRow {
  id?: number | null;
  sessionId?: number | null;
  session_id?: number | null;
  date?: string | null;
  taskType?: string | null;
  task_type?: string | null;
  topic?: string | null;
  promptId?: string | null;
  prompt_id?: string | null;
  prompt?: string | null;
  essayText?: string | null;
  essay_text?: string | null;
  wordCount?: number | null;
  word_count?: number | null;
  bandTa?: number | null;
  band_ta?: number | null;
  bandCc?: number | null;
  band_cc?: number | null;
  bandLr?: number | null;
  band_lr?: number | null;
  bandGra?: number | null;
  band_gra?: number | null;
  bandOverall?: number | null;
  band_overall?: number | null;
  feedbackJson?: unknown;
  feedback_json?: unknown;
  errorDensity?: number | null;
  error_density?: number | null;
  gradingMode?: string | null;
  grading_mode?: string | null;
  graderSpread?: number | null;
  grader_spread?: number | null;
  isRewrite?: boolean | number | null;
  is_rewrite?: boolean | number | null;
  parentSubmissionId?: number | null;
  parent_submission_id?: number | null;
  evaluationMetaJson?: unknown;
  evaluation_meta_json?: unknown;
  createdAt?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface SpeakingSessionSummaryRow {
  id?: number | null;
  date?: string | null;
  durationMin?: number | null;
  duration_min?: number | null;
  sessionId?: number | null;
  session_id?: number | null;
  transcript?: string | null;
  fitInTwoMinutes?: boolean | number | null;
  fit_in_two_minutes?: boolean | number | null;
  bandFluencyCoherence?: number | null;
  band_fluency_coherence?: number | null;
  bandLexicalResource?: number | null;
  band_lexical_resource?: number | null;
  bandGrammaticalAccuracy?: number | null;
  band_grammatical_accuracy?: number | null;
  bandPronunciation?: number | null;
  band_pronunciation?: number | null;
  bandOverall?: number | null;
  band_overall?: number | null;
  feedbackJson?: unknown;
  feedback_json?: unknown;
  tutorNotes?: string | null;
  tutor_notes?: string | null;
  evaluationMetaJson?: unknown;
  evaluation_meta_json?: unknown;
  createdAt?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface ReceptiveResultSummaryRow {
  sessionId?: number | null;
  session_id?: number | null;
  skill?: string | null;
  rawScore?: string | null;
  raw_score?: string | null;
  correctAnswers?: number | null;
  correct_answers?: number | null;
  totalQuestions?: number | null;
  total_questions?: number | null;
  accuracy?: number | null;
  difficulty?: string | null;
  sourceTitle?: string | null;
  source_title?: string | null;
  sourceUrl?: string | null;
  source_url?: string | null;
  feedbackJson?: unknown;
  feedback_json?: unknown;
  evaluationMetaJson?: unknown;
  evaluation_meta_json?: unknown;
  createdAt?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface ErrorCardSummaryRow {
  id?: number | null;
  sourceType?: string | null;
  source_type?: string | null;
  sourceRef?: string | null;
  source_ref?: string | null;
  errorType?: string | null;
  error_type?: string | null;
  rule?: string | null;
  observedOn?: string | null;
  observed_on?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface ExternalBenchmarkSummaryRow {
  provider?: string | null;
  date?: string | null;
  readingRaw?: number | null;
  reading_raw?: number | null;
  listeningRaw?: number | null;
  listening_raw?: number | null;
  writingRaw?: number | null;
  writing_raw?: number | null;
  speakingRaw?: number | null;
  speaking_raw?: number | null;
  overallRaw?: number | null;
  overall_raw?: number | null;
  sectionScoresJson?: unknown;
  section_scores_json?: unknown;
  cefr?: string | null;
  sourceUrl?: string | null;
  source_url?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface WeeklySummaryInput {
  studySessions?: readonly StudySessionSummaryRow[];
  /** Alias useful for small unit-test fixtures. */
  sessions?: readonly StudySessionSummaryRow[];
  writingSubmissions?: readonly WritingSubmissionSummaryRow[];
  writings?: readonly WritingSubmissionSummaryRow[];
  speakingSessions?: readonly SpeakingSessionSummaryRow[];
  speakings?: readonly SpeakingSessionSummaryRow[];
  receptiveResults?: readonly ReceptiveResultSummaryRow[];
  receptive?: readonly ReceptiveResultSummaryRow[];
  errorCards?: readonly ErrorCardSummaryRow[];
  errors?: readonly ErrorCardSummaryRow[];
  externalBenchmarks?: readonly ExternalBenchmarkSummaryRow[];
  external_benchmarks?: readonly ExternalBenchmarkSummaryRow[];
}

const ISO_WEEK_RE = /^(\d{4})-W(\d{2})$/;
const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const EVIDENCE_SKILLS = new Set<EvidenceSkill>([
  "reading",
  "listening",
  "writing",
  "speaking",
]);

/** Validate an ISO week and return its exact Monday-Sunday period. */
export function isoWeekPeriod(week: string): IsoWeekPeriod {
  const match = ISO_WEEK_RE.exec(week);
  if (!match) {
    throw new Error(
      `Invalid ISO week "${week}"; expected YYYY-Www (for example 2026-W37).`,
    );
  }

  const year = Number(match[1]);
  const weekNumber = Number(match[2]);
  if (year < 1 || year > 9999 || weekNumber < 1 || weekNumber > 53) {
    throw new Error(`Invalid ISO week "${week}".`);
  }

  const jan4 = utcDate(year, 0, 4);
  const jan4MondayOffset = (jan4.getUTCDay() + 6) % 7;
  const start = addUTC(jan4, -jan4MondayOffset + (weekNumber - 1) * 7);
  const actual = isoWeekParts(start);
  if (actual.year !== year || actual.week !== weekNumber) {
    throw new Error(`Invalid ISO week "${week}"; that year has no such week.`);
  }

  return {
    week,
    start_date: isoDate(start),
    end_date: isoDate(addUTC(start, 6)),
  };
}

export function previousISOWeek(week: string): string {
  const period = isoWeekPeriod(week);
  const previous = isoWeekParts(addUTC(utcDateFromISO(period.start_date), -7));
  return `${String(previous.year).padStart(4, "0")}-W${String(previous.week).padStart(2, "0")}`;
}

/** Aggregate rows for one week. */
export function aggregateWeeklyEnglishSummary(
  input: WeeklySummaryInput,
  week: string,
): WeeklyEnglishSummary {
  const period = isoWeekPeriod(week);
  const previousPeriod = isoWeekPeriod(previousISOWeek(week));

  const sessions = input.studySessions ?? input.sessions ?? [];
  const writings = input.writingSubmissions ?? input.writings ?? [];
  const speakings = input.speakingSessions ?? input.speakings ?? [];
  const receptiveResults = input.receptiveResults ?? input.receptive ?? [];
  const errorCards = input.errorCards ?? input.errors ?? [];
  const externalBenchmarks =
    input.externalBenchmarks ?? input.external_benchmarks ?? [];

  const sessionById = indexById(sessions);
  const writingById = indexById(writings);
  const speakingById = indexById(speakings);
  const writingDates = new Map<number, string | null>();
  for (const row of writings) {
    const id = numericField(row, "id");
    if (id != null) writingDates.set(id, writingDate(row, sessionById));
  }
  const speakingDates = new Map<number, string | null>();
  for (const row of speakings) {
    const id = numericField(row, "id");
    if (id != null) speakingDates.set(id, speakingDate(row, sessionById));
  }

  const studyCurrent = sessions.filter((row) =>
    inPeriod(validDate(field(row, "date")), period),
  );
  const currentSpeakings = speakings.filter((row) =>
    inPeriod(speakingDate(row, sessionById), period),
  );
  const previousSpeakings = speakings.filter((row) =>
    inPeriod(speakingDate(row, sessionById), previousPeriod),
  );
  const currentWritings = writings.filter((row) =>
    inPeriod(writingDate(row, sessionById), period),
  );
  const previousWritings = writings.filter((row) =>
    inPeriod(writingDate(row, sessionById), previousPeriod),
  );

  const currentReading = receptiveEvidence(
    "reading",
    period,
    sessions,
    receptiveResults,
  );
  const previousReading = receptiveEvidence(
    "reading",
    previousPeriod,
    sessions,
    receptiveResults,
  );
  const currentListening = receptiveEvidence(
    "listening",
    period,
    sessions,
    receptiveResults,
  );
  const previousListening = receptiveEvidence(
    "listening",
    previousPeriod,
    sessions,
    receptiveResults,
  );

  const errors = errorGroups(
    errorCards,
    period,
    sessionById,
    writingById,
    speakingById,
    writingDates,
    speakingDates,
  );
  const evidenceCandidates = [
    ...currentWritings.map((row) =>
      writingSample(row, writingDate(row, sessionById), sessionById),
    ),
    ...currentSpeakings.map((row) =>
      speakingSample(row, speakingDate(row, sessionById), sessionById),
    ),
  ];

  const writingScore = (row: WritingSubmissionSummaryRow) =>
    bandValue(row, "bandOverall", "band_overall");
  const speakingScore = (row: SpeakingSessionSummaryRow) =>
    bandValue(row, "bandOverall", "band_overall") ??
    bandValue(row, "bandEstimate", "band_estimate");

  const currentSpeakingScores = currentSpeakings
    .map(speakingScore)
    .filter(isNumber);
  const previousSpeakingScores = previousSpeakings
    .map(speakingScore)
    .filter(isNumber);
  const comparableCurrentWritings = currentWritings.filter(
    isComparableBandWriting,
  );
  const comparablePreviousWritings = previousWritings.filter(
    isComparableBandWriting,
  );
  const currentWritingScores = comparableCurrentWritings
    .map(writingScore)
    .filter(isNumber);
  const previousWritingScores = comparablePreviousWritings
    .map(writingScore)
    .filter(isNumber);

  const currentSpeakingCriteria: WeeklyCriteriaAverages = {
    fluency_coherence: average(
      currentSpeakings
        .map((row) =>
          bandValue(row, "bandFluencyCoherence", "band_fluency_coherence"),
        )
        .filter(isNumber),
    ),
    lexical_resource: average(
      currentSpeakings
        .map((row) =>
          bandValue(row, "bandLexicalResource", "band_lexical_resource"),
        )
        .filter(isNumber),
    ),
    grammatical_range_accuracy: average(
      currentSpeakings
        .map((row) =>
          bandValue(
            row,
            "bandGrammaticalAccuracy",
            "band_grammatical_accuracy",
          ),
        )
        .filter(isNumber),
    ),
    pronunciation: average(
      currentSpeakings
        .map((row) => bandValue(row, "bandPronunciation", "band_pronunciation"))
        .filter(isNumber),
    ),
  };
  const currentSpeakingCriteriaCounts: WeeklyCriteriaSampleCounts = {
    fluency_coherence: criterionCount(
      currentSpeakings,
      "bandFluencyCoherence",
      "band_fluency_coherence",
    ),
    lexical_resource: criterionCount(
      currentSpeakings,
      "bandLexicalResource",
      "band_lexical_resource",
    ),
    grammatical_range_accuracy: criterionCount(
      currentSpeakings,
      "bandGrammaticalAccuracy",
      "band_grammatical_accuracy",
    ),
    pronunciation: criterionCount(
      currentSpeakings,
      "bandPronunciation",
      "band_pronunciation",
    ),
  };

  const densityValues = currentWritings
    .map((row) => densityPer100(row))
    .filter(isNumber);
  const avgErrorsPer100 = average(densityValues);

  return {
    schema_version: WEEKLY_SUMMARY_SCHEMA_VERSION,
    week,
    period: {
      start_date: period.start_date,
      end_date: period.end_date,
    },
    study: {
      total_sessions: studyCurrent.length,
      total_minutes: studyCurrent.reduce(
        (sum, row) =>
          sum + nonNegativeNumber(field(row, "durationMin", "duration_min")),
        0,
      ),
      active_days: new Set(
        studyCurrent
          .map((row) => validDate(field(row, "date")))
          .filter((date): date is string => date != null),
      ).size,
    },
    speaking: {
      sessions: currentSpeakings.length,
      scored_sessions: currentSpeakingScores.length,
      avg_score: average(currentSpeakingScores),
      previous_week: average(previousSpeakingScores),
      criteria_averages: currentSpeakingCriteria,
      criteria_scored_sessions: currentSpeakingCriteriaCounts,
      common_errors: commonErrors(errors, "speaking"),
    },
    writing: {
      sessions: currentWritings.length,
      scored_sessions: currentWritingScores.length,
      avg_score: average(currentWritingScores),
      previous_week: average(previousWritingScores),
      avg_errors_per_100_words: avgErrorsPer100,
      by_task: {
        task1: writingTrend(
          comparableCurrentWritings,
          comparablePreviousWritings,
          "task1",
        ),
        task2: writingTrend(
          comparableCurrentWritings,
          comparablePreviousWritings,
          "task2",
        ),
      },
    },
    reading: receptiveStats(currentReading, previousReading),
    listening: receptiveStats(currentListening, previousListening),
    external_benchmarks: latestExternalBenchmarks(externalBenchmarks),
    recurring_errors: errors.recurring,
    representative_samples: selectRepresentativeSamples(evidenceCandidates),
  };
}

function isComparableBandWriting(row: WritingSubmissionSummaryRow): boolean {
  return (
    stringField(row, "gradingMode", "grading_mode") === "band" &&
    booleanField(row, "isRewrite", "is_rewrite") !== true
  );
}

function writingTrend(
  current: readonly WritingSubmissionSummaryRow[],
  previous: readonly WritingSubmissionSummaryRow[],
  taskType: "task1" | "task2",
): WritingBandTrend {
  const scoresFor = (rows: readonly WritingSubmissionSummaryRow[]) =>
    rows
      .filter((row) => stringField(row, "taskType", "task_type") === taskType)
      .map((row) => bandValue(row, "bandOverall", "band_overall"))
      .filter(isNumber);
  const currentScores = scoresFor(current);
  return {
    scored_sessions: currentScores.length,
    avg_score: average(currentScores),
    previous_week: average(scoresFor(previous)),
  };
}

function criterionCount(
  rows: readonly SpeakingSessionSummaryRow[],
  ...keys: string[]
): number {
  return rows.map((row) => bandValue(row, ...keys)).filter(isNumber).length;
}

/**
 * Keep the payload useful to a weekly reviewer without dumping a whole week
 * of raw essays/transcripts into Notion. All selected text remains complete.
 */
function selectRepresentativeSamples(
  candidates: WeeklyEvidenceSample[],
): WeeklyEvidenceSample[] {
  const selected = new Map<string, WeeklyEvidenceSample>();
  const key = (sample: WeeklyEvidenceSample) => `${sample.skill}:${sample.id}`;
  const scored = candidates.filter((sample) => sample.score != null);
  const byWeakest = [...scored].sort(
    (a, b) =>
      (a.score ?? Number.POSITIVE_INFINITY) -
        (b.score ?? Number.POSITIVE_INFINITY) || compareSamples(a, b),
  );
  const byStrongest = [...scored].sort(
    (a, b) =>
      (b.score ?? Number.NEGATIVE_INFINITY) -
        (a.score ?? Number.NEGATIVE_INFINITY) || compareSamples(a, b),
  );
  const byRecent = [...candidates].sort((a, b) => compareSamples(b, a));
  for (const sample of [
    ...byWeakest.slice(0, 2),
    ...byStrongest.slice(0, 1),
    ...byRecent.slice(0, 2),
  ]) {
    selected.set(key(sample), sample);
  }
  return [...selected.values()].sort(compareSamples);
}

function latestExternalBenchmarks(
  rows: readonly ExternalBenchmarkSummaryRow[],
): WeeklyExternalBenchmark[] {
  return [...rows]
    .filter((row) => validDate(field(row, "date")) != null)
    .sort(
      (a, b) =>
        (validDate(field(b, "date")) ?? "").localeCompare(
          validDate(field(a, "date")) ?? "",
        ) ||
        (stringField(b, "createdAt", "created_at") ?? "").localeCompare(
          stringField(a, "createdAt", "created_at") ?? "",
        ),
    )
    .slice(0, 2)
    .map((row) => ({
      provider: stringField(row, "provider") ?? "other",
      date: validDate(field(row, "date")) ?? "",
      reading_raw: numberField(row, "readingRaw", "reading_raw"),
      listening_raw: numberField(row, "listeningRaw", "listening_raw"),
      writing_raw: numberField(row, "writingRaw", "writing_raw"),
      speaking_raw: numberField(row, "speakingRaw", "speaking_raw"),
      overall_raw: numberField(row, "overallRaw", "overall_raw"),
      section_scores: numericRecord(
        field(row, "sectionScoresJson", "section_scores_json"),
      ),
      cefr: stringField(row, "cefr"),
      source_url: stringField(row, "sourceUrl", "source_url"),
      notes: stringField(row, "notes"),
    }));
}

interface ReceptiveEvidence {
  skill: EvidenceSkill;
  date: string;
  session_id: number;
  sample_id: string;
  session: StudySessionSummaryRow;
  result: ReceptiveResultSummaryRow | null;
  raw_score: string | null;
  correct_answers: number | null;
  total_questions: number | null;
  accuracy: number | null;
  difficulty: string | null;
  source_title: string | null;
  source_url: string | null;
  feedback: unknown;
  evaluation_metadata: unknown;
}

function receptiveEvidence(
  skill: EvidenceSkill,
  period: IsoWeekPeriod,
  sessions: readonly StudySessionSummaryRow[],
  results: readonly ReceptiveResultSummaryRow[],
): ReceptiveEvidence[] {
  const sessionById = indexById(sessions);
  const resultByKey = new Map<string, ReceptiveResultSummaryRow>();

  for (const row of results) {
    const rowSkill = normalizedSkill(field(row, "skill"));
    const sessionId = numericField(row, "sessionId", "session_id");
    const session = sessionId == null ? undefined : sessionById.get(sessionId);
    if (
      rowSkill !== skill ||
      sessionId == null ||
      !session ||
      !inPeriod(validDate(field(session, "date")), period)
    ) {
      continue;
    }
    const key = `${sessionId}:${skill}`;
    // The schema uses (session_id, skill) as a key.  If a fixture contains a
    // duplicate, keep the first deterministic row rather than double count it.
    if (!resultByKey.has(key)) resultByKey.set(key, row);
  }

  const evidence: ReceptiveEvidence[] = [];
  for (const [key, result] of resultByKey) {
    const sessionId = numericField(result, "sessionId", "session_id");
    if (sessionId == null) continue;
    const session = sessionById.get(sessionId);
    if (!session) continue;
    evidence.push(
      makeReceptiveEvidence(skill, session, sessionId, result, key),
    );
  }

  // A legacy study_session has no child result.  Use its own raw score only
  // for the matching receptive skill, and never alongside a child result.
  for (const session of sessions) {
    const sessionId = numericField(session, "id");
    const sessionSkill = normalizedSkill(field(session, "skill"));
    const date = validDate(field(session, "date"));
    if (
      sessionId == null ||
      sessionSkill !== skill ||
      !inPeriod(date, period) ||
      resultByKey.has(`${sessionId}:${skill}`)
    ) {
      continue;
    }
    evidence.push(
      makeReceptiveEvidence(
        skill,
        session,
        sessionId,
        null,
        `${sessionId}:${skill}`,
      ),
    );
  }

  return evidence.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.session_id - b.session_id ||
      a.skill.localeCompare(b.skill),
  );
}

function makeReceptiveEvidence(
  skill: EvidenceSkill,
  session: StudySessionSummaryRow,
  sessionId: number,
  result: ReceptiveResultSummaryRow | null,
  sampleId: string,
): ReceptiveEvidence {
  const rawScore = stringField(result ?? session, "rawScore", "raw_score");
  const explicitCorrect = result
    ? validCount(
        numberField(result, "correctAnswers", "correct_answers"),
        numberField(result, "totalQuestions", "total_questions"),
      )
    : null;
  const parsed = explicitCorrect ?? parseRawScore(rawScore);
  const explicitAccuracy = result
    ? ratio(numberField(result, "accuracy"))
    : null;
  const sourceTitle = result
    ? stringField(result, "sourceTitle", "source_title")
    : null;
  const sourceUrl =
    (result ? stringField(result, "sourceUrl", "source_url") : null) ??
    stringField(session, "sourceUrl", "source_url");
  const feedback = result
    ? jsonValue(field(result, "feedbackJson", "feedback_json"))
    : null;
  const evaluationMetadata = result
    ? jsonValue(field(result, "evaluationMetaJson", "evaluation_meta_json"))
    : null;
  const difficulty = result ? stringField(result, "difficulty") : null;
  const correct = parsed?.correct ?? null;
  const total = parsed?.total ?? null;
  return {
    skill,
    date: validDate(field(session, "date")) ?? "",
    session_id: sessionId,
    sample_id: sampleId,
    session,
    result,
    raw_score: rawScore,
    correct_answers: correct,
    total_questions: total,
    accuracy:
      total != null && total > 0
        ? correct != null
          ? correct / total
          : explicitAccuracy
        : explicitAccuracy,
    difficulty,
    source_title: sourceTitle,
    source_url: sourceUrl,
    feedback,
    evaluation_metadata: evaluationMetadata,
  };
}

function receptiveStats(
  current: ReceptiveEvidence[],
  previous: ReceptiveEvidence[],
): ReceptiveWeeklyStats {
  const totalCorrect = current.reduce(
    (sum, item) => sum + (item.correct_answers ?? 0),
    0,
  );
  const totalQuestions = current.reduce(
    (sum, item) => sum + (item.total_questions ?? 0),
    0,
  );
  return {
    sessions: current.length,
    total_correct: totalCorrect,
    total_questions: totalQuestions,
    accuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : null,
    previous_week: weightedAccuracy(previous),
    difficulties: uniqueStrings(current.map((item) => item.difficulty)),
    sources: uniqueStrings(
      current.flatMap((item) => [item.source_title, item.source_url]),
    ),
  };
}

function weightedAccuracy(rows: ReceptiveEvidence[]): number | null {
  const correct = rows.reduce(
    (sum, item) => sum + (item.correct_answers ?? 0),
    0,
  );
  const total = rows.reduce(
    (sum, item) => sum + (item.total_questions ?? 0),
    0,
  );
  return total > 0 ? correct / total : null;
}

function writingSample(
  row: WritingSubmissionSummaryRow,
  date: string | null,
  sessionById: Map<number, StudySessionSummaryRow>,
): WeeklyEvidenceSample {
  const sessionId = numericField(row, "sessionId", "session_id");
  const session = sessionId == null ? undefined : sessionById.get(sessionId);
  const score = bandValue(row, "bandOverall", "band_overall");
  const rawDensity = numberField(row, "errorDensity", "error_density");
  return {
    skill: "writing",
    id: numericField(row, "id") ?? "writing:unknown",
    date: date ?? "",
    session_id: sessionId,
    duration_min:
      session == null
        ? null
        : nonNegativeNumber(field(session, "durationMin", "duration_min")),
    score,
    essay_text: rawStringField(row, "essayText", "essay_text"),
    transcript: null,
    bands: {
      task_response: bandValue(row, "bandTa", "band_ta"),
      coherence: bandValue(row, "bandCc", "band_cc"),
      lexical: bandValue(row, "bandLr", "band_lr"),
      grammar: bandValue(row, "bandGra", "band_gra"),
      overall: score,
    },
    criteria: null,
    feedback: jsonValue(field(row, "feedbackJson", "feedback_json")),
    result: null,
    raw_score: null,
    correct_answers: null,
    total_questions: null,
    accuracy: null,
    difficulty: null,
    source_title: null,
    source_url: null,
    evaluation_metadata: jsonValue(
      field(row, "evaluationMetaJson", "evaluation_meta_json"),
    ),
    task_type: stringField(row, "taskType", "task_type"),
    topic: stringField(row, "topic"),
    prompt_id: stringField(row, "promptId", "prompt_id"),
    prompt: stringField(row, "prompt"),
    word_count: integerField(row, "wordCount", "word_count"),
    error_density: rawDensity,
    grading_mode: stringField(row, "gradingMode", "grading_mode"),
    grader_spread: numberField(row, "graderSpread", "grader_spread"),
    is_rewrite: booleanField(row, "isRewrite", "is_rewrite"),
    parent_submission_id: integerField(
      row,
      "parentSubmissionId",
      "parent_submission_id",
    ),
  };
}

function speakingSample(
  row: SpeakingSessionSummaryRow,
  date: string | null,
  sessionById: Map<number, StudySessionSummaryRow>,
): WeeklyEvidenceSample {
  const sessionId = numericField(row, "sessionId", "session_id");
  const session = sessionId == null ? undefined : sessionById.get(sessionId);
  const score =
    bandValue(row, "bandOverall", "band_overall") ??
    bandValue(row, "bandEstimate", "band_estimate");
  const feedbackRaw = field(row, "feedbackJson", "feedback_json");
  const feedback =
    nonBlank(feedbackRaw) == null
      ? stringField(row, "tutorNotes", "tutor_notes")
      : jsonValue(feedbackRaw);
  return {
    skill: "speaking",
    id: numericField(row, "id") ?? "speaking:unknown",
    date: date ?? "",
    session_id: sessionId,
    duration_min:
      nonNegativeOrNull(field(row, "durationMin", "duration_min")) ??
      (session == null
        ? null
        : nonNegativeOrNull(field(session, "durationMin", "duration_min"))),
    score,
    essay_text: null,
    transcript: rawStringField(row, "transcript"),
    bands: null,
    criteria: {
      fluency_coherence: bandValue(
        row,
        "bandFluencyCoherence",
        "band_fluency_coherence",
      ),
      lexical_resource: bandValue(
        row,
        "bandLexicalResource",
        "band_lexical_resource",
      ),
      grammatical_range_accuracy: bandValue(
        row,
        "bandGrammaticalAccuracy",
        "band_grammatical_accuracy",
      ),
      pronunciation: bandValue(row, "bandPronunciation", "band_pronunciation"),
    },
    feedback,
    result: null,
    raw_score: null,
    correct_answers: null,
    total_questions: null,
    accuracy: null,
    difficulty: null,
    source_title: null,
    source_url: null,
    evaluation_metadata: jsonValue(
      field(row, "evaluationMetaJson", "evaluation_meta_json"),
    ),
    task_type: null,
    topic: null,
    prompt_id: null,
    prompt: null,
    word_count: null,
    error_density: null,
    grading_mode: null,
    grader_spread: null,
    is_rewrite: null,
    parent_submission_id: null,
  };
}

interface ErrorGroupResult {
  recurring: WeeklyError[];
  all: Map<string, number>;
}

function errorGroups(
  cards: readonly ErrorCardSummaryRow[],
  period: IsoWeekPeriod,
  sessionById: Map<number, StudySessionSummaryRow>,
  writingById: Map<number, WritingSubmissionSummaryRow>,
  speakingById: Map<number, SpeakingSessionSummaryRow>,
  writingDates: Map<number, string | null>,
  speakingDates: Map<number, string | null>,
): ErrorGroupResult {
  const groups = new Map<
    string,
    {
      skill: WeeklySummarySkill;
      key: string;
      count: number;
      sessions: Set<string>;
    }
  >();
  for (const card of cards) {
    const date = errorObservedDate(
      card,
      sessionById,
      writingById,
      speakingById,
      writingDates,
      speakingDates,
    );
    if (!inPeriod(date, period)) continue;
    const skill = normalizedSkill(
      field(card, "sourceType", "source_type"),
    ) as WeeklySummarySkill;
    const sourceType =
      EVIDENCE_SKILLS.has(skill as EvidenceSkill) || skill === "vocab"
        ? skill
        : inferSkillFromRef(stringField(card, "sourceRef", "source_ref"));
    if (!sourceType) continue;
    const key = normalizedErrorKey(
      stringField(card, "rule"),
      stringField(card, "errorType", "error_type"),
    );
    if (!key) continue;
    const groupKey = `${sourceType}:${key}`;
    const current = groups.get(groupKey) ?? {
      skill: sourceType,
      key,
      count: 0,
      sessions: new Set<string>(),
    };
    current.count++;
    current.sessions.add(
      errorSessionKey(card, sourceType, writingById, speakingById),
    );
    groups.set(groupKey, current);
  }

  const rows = [...groups.values()].map((group) => ({
    key: group.key,
    skill: group.skill,
    count: group.count,
    session_count: group.sessions.size,
  }));
  rows.sort(
    (a, b) =>
      b.count - a.count ||
      b.session_count - a.session_count ||
      a.key.localeCompare(b.key) ||
      a.skill.localeCompare(b.skill),
  );
  return {
    recurring: rows.filter((row) => row.count >= 2),
    all: new Map(rows.map((row) => [`${row.skill}:${row.key}`, row.count])),
  };
}

function commonErrors(
  errors: ErrorGroupResult,
  skill: EvidenceSkill,
): string[] {
  return [...errors.all.entries()]
    .filter(([key]) => key.startsWith(`${skill}:`))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([key]) => key.slice(skill.length + 1));
}

function errorObservedDate(
  card: ErrorCardSummaryRow,
  sessionById: Map<number, StudySessionSummaryRow>,
  writingById: Map<number, WritingSubmissionSummaryRow>,
  speakingById: Map<number, SpeakingSessionSummaryRow>,
  writingDates: Map<number, string | null>,
  speakingDates: Map<number, string | null>,
): string | null {
  const observed = validDate(field(card, "observedOn", "observed_on"));
  if (observed) return observed;
  const ref = stringField(card, "sourceRef", "source_ref") ?? "";
  const match =
    /^(writing_submission|speaking_session|study_session|receptive_result):(\d+)/i.exec(
      ref,
    );
  if (match) {
    const id = Number(match[2]);
    if (match[1].toLowerCase() === "writing_submission") {
      return (
        writingDates.get(id) ?? writingDate(writingById.get(id), sessionById)
      );
    }
    if (match[1].toLowerCase() === "speaking_session") {
      return (
        speakingDates.get(id) ?? speakingDate(speakingById.get(id), sessionById)
      );
    }
    if (match[1].toLowerCase() === "study_session") {
      return validDate(field(sessionById.get(id), "date"));
    }
    if (match[1].toLowerCase() === "receptive_result") {
      return validDate(field(sessionById.get(id), "date"));
    }
  }
  return validDate(field(card, "createdAt", "created_at"));
}

function errorSessionKey(
  card: ErrorCardSummaryRow,
  skill: WeeklySummarySkill,
  writingById: Map<number, WritingSubmissionSummaryRow>,
  speakingById: Map<number, SpeakingSessionSummaryRow>,
): string {
  const ref = stringField(card, "sourceRef", "source_ref") ?? "";
  const match =
    /^(writing_submission|speaking_session|study_session|receptive_result):(\d+)/i.exec(
      ref,
    );
  if (match) {
    const id = Number(match[2]);
    const source = match[1].toLowerCase();
    if (source === "writing_submission") {
      const sessionId = numericField(
        writingById.get(id),
        "sessionId",
        "session_id",
      );
      return sessionId == null ? `writing:${id}` : `session:${sessionId}`;
    }
    if (source === "speaking_session") {
      const sessionId = numericField(
        speakingById.get(id),
        "sessionId",
        "session_id",
      );
      return sessionId == null ? `speaking:${id}` : `session:${sessionId}`;
    }
    return `session:${id}`;
  }
  const explicitSession = numericField(card, "sessionId", "session_id");
  if (explicitSession != null) return `session:${explicitSession}`;
  const cardId = numericField(card, "id");
  return cardId == null
    ? `${skill}:${stringField(card, "createdAt", "created_at") ?? "unknown"}`
    : `card:${cardId}`;
}

function inferSkillFromRef(ref: string | null): WeeklySummarySkill | null {
  if (!ref) return null;
  const lower = ref.toLowerCase();
  if (lower.startsWith("writing_submission:")) return "writing";
  if (lower.startsWith("speaking_session:")) return "speaking";
  return null;
}

function writingDate(
  row: WritingSubmissionSummaryRow | undefined,
  sessionById: Map<number, StudySessionSummaryRow>,
): string | null {
  if (!row) return null;
  const sessionId = numericField(row, "sessionId", "session_id");
  return (
    validDate(field(row, "date")) ??
    validDate(
      field(sessionId == null ? undefined : sessionById.get(sessionId), "date"),
    ) ??
    validDate(field(row, "createdAt", "created_at"))
  );
}

function speakingDate(
  row: SpeakingSessionSummaryRow | undefined,
  sessionById: Map<number, StudySessionSummaryRow>,
): string | null {
  if (!row) return null;
  const sessionId = numericField(row, "sessionId", "session_id");
  return (
    validDate(field(row, "date")) ??
    validDate(
      field(sessionId == null ? undefined : sessionById.get(sessionId), "date"),
    ) ??
    validDate(field(row, "createdAt", "created_at"))
  );
}

function indexById<T extends { [key: string]: unknown }>(
  rows: readonly T[],
): Map<number, T> {
  const index = new Map<number, T>();
  for (const row of rows) {
    const id = numericField(row, "id");
    if (id != null && !index.has(id)) index.set(id, row);
  }
  return index;
}

function compareSamples(
  a: WeeklyEvidenceSample,
  b: WeeklyEvidenceSample,
): number {
  return (
    a.date.localeCompare(b.date) ||
    compareIds(a.id, b.id) ||
    a.skill.localeCompare(b.skill)
  );
}

function compareIds(a: number | string, b: number | string): number {
  const an = typeof a === "number" ? a : Number.parseInt(a, 10);
  const bn = typeof b === "number" ? b : Number.parseInt(b, 10);
  if (Number.isFinite(an) && Number.isFinite(bn) && an !== bn) return an - bn;
  return String(a).localeCompare(String(b));
}

function field(row: object | undefined, ...keys: string[]): unknown {
  if (!row) return undefined;
  const record = row as Record<string, unknown>;
  for (const key of keys) {
    if (record[key] !== undefined) return record[key];
  }
  return undefined;
}

function nonBlank(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function stringField(
  row: object | undefined,
  ...keys: string[]
): string | null {
  const value = field(row, ...keys);
  if (typeof value !== "string") return null;
  return value.trim() || null;
}

/** Preserve submitted evidence text without trimming or otherwise rewriting it. */
function rawStringField(
  row: object | undefined,
  ...keys: string[]
): string | null {
  const value = field(row, ...keys);
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numberField(
  row: object | undefined,
  ...keys: string[]
): number | null {
  const value = field(row, ...keys);
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function integerField(
  row: object | undefined,
  ...keys: string[]
): number | null {
  const value = numberField(row, ...keys);
  return value != null && Number.isInteger(value) ? value : null;
}

function numericField(
  row: object | undefined,
  ...keys: string[]
): number | null {
  const value = numberField(row, ...keys);
  return value != null && Number.isInteger(value) ? value : null;
}

function bandValue(row: object | undefined, ...keys: string[]): number | null {
  const value = numberField(row, ...keys);
  return value != null && value >= 0 && value <= 9 ? value : null;
}

function ratio(value: number | null): number | null {
  return value != null && value >= 0 && value <= 1 ? value : null;
}

function nonNegativeNumber(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function nonNegativeOrNull(value: unknown): number | null {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function densityPer100(row: WritingSubmissionSummaryRow): number | null {
  const value = numberField(row, "errorDensity", "error_density");
  if (value == null || value < 0) return null;
  // The canonical column stores errors per 100 words. Values below one are
  // valid (for example 0.5 errors per 100 words), so never reinterpret them.
  return value;
}

function isNumber(value: number | null): value is number {
  return value != null && Number.isFinite(value);
}

function average(values: number[]): number | null {
  return values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizedSkill(value: unknown): string | null {
  const string = typeof value === "string" ? value.trim().toLowerCase() : "";
  return string || null;
}

function normalizedErrorKey(
  rule: string | null,
  errorType: string | null,
): string | null {
  const value = (rule || errorType || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return value || null;
}

function uniqueStrings(values: (string | null)[]): string[] {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ].sort((a, b) => a.localeCompare(b));
}

function booleanField(
  row: object | undefined,
  ...keys: string[]
): boolean | null {
  const value = field(row, ...keys);
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    if (value === "1" || value.toLowerCase() === "true") return true;
    if (value === "0" || value.toLowerCase() === "false") return false;
  }
  return null;
}

function jsonValue(value: unknown): unknown {
  if (value == null) return null;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    // Keeping malformed legacy feedback is more useful than silently dropping
    // evidence; it also guarantees the aggregator never truncates raw data.
    return value;
  }
}

function numericRecord(value: unknown): Record<string, number> | null {
  const parsed = jsonValue(value);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object")
    return null;
  const entries = Object.entries(parsed as Record<string, unknown>).filter(
    ([key, score]) =>
      key.trim() && typeof score === "number" && Number.isFinite(score),
  );
  return entries.length > 0
    ? (Object.fromEntries(entries) as Record<string, number>)
    : null;
}

function parseRawScore(
  raw: string | null,
): { correct: number; total: number } | null {
  if (!raw) return null;
  const match = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(raw);
  if (!match) return null;
  const correct = Number(match[1]);
  const total = Number(match[2]);
  return validCount(correct, total);
}

function validCount(
  correct: number | null,
  total: number | null,
): { correct: number; total: number } | null {
  if (
    correct == null ||
    total == null ||
    !Number.isInteger(correct) ||
    !Number.isInteger(total) ||
    total <= 0 ||
    correct < 0 ||
    correct > total
  ) {
    return null;
  }
  return { correct, total };
}

function validDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const candidate = value.slice(0, 10);
  if (!ISO_DATE_RE.test(candidate)) return null;
  const year = Number(candidate.slice(0, 4));
  const month = Number(candidate.slice(5, 7));
  const day = Number(candidate.slice(8, 10));
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return null;
  }
  return candidate;
}

function inPeriod(date: string | null, period: IsoWeekPeriod): boolean {
  return date != null && date >= period.start_date && date <= period.end_date;
}

function daysInMonth(year: number, month: number): number {
  const date = utcDate(year, month, 0);
  return date.getUTCDate();
}

function utcDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month, day);
  return date;
}

function utcDateFromISO(value: string): Date {
  return utcDate(
    Number(value.slice(0, 4)),
    Number(value.slice(5, 7)) - 1,
    Number(value.slice(8, 10)),
  );
}

function addUTC(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function isoDate(date: Date): string {
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function isoWeekParts(date: Date): { year: number; week: number } {
  const thursday = addUTC(date, 3 - ((date.getUTCDay() + 6) % 7));
  const year = thursday.getUTCFullYear();
  const firstThursday = utcDate(year, 0, 4);
  const firstMonday = addUTC(
    firstThursday,
    -((firstThursday.getUTCDay() + 6) % 7),
  );
  return {
    year,
    week: Math.floor((date.getTime() - firstMonday.getTime()) / 604800000) + 1,
  };
}
