import assert from "node:assert/strict";
import {
  aggregateWeeklyEnglishSummary,
  isoWeekPeriod,
  previousISOWeek,
  type WeeklySummaryInput,
} from "../../src/lib/ielts/weekly-summary";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

const WEEK = "2026-W37";

const longEssay = "A complete essay that must not be shortened. ".repeat(80);
const longTranscript = "A complete speaking transcript. ".repeat(80);

function mixedInput(): WeeklySummaryInput {
  return {
    studySessions: [
      {
        id: 90,
        date: "2026-09-01",
        skill: "reading",
        durationMin: 25,
        rawScore: "4/5",
      },
      {
        id: 91,
        date: "2026-09-06",
        skill: "listening",
        durationMin: 15,
        rawScore: "7/10",
      },
      {
        id: 101,
        date: "2026-09-07",
        skill: "reading",
        durationMin: 30,
        rawScore: "3/5",
        sourceUrl: "https://legacy.example/reading",
      },
      {
        id: 102,
        date: "2026-09-08",
        skill: "listening",
        durationMin: 20,
        rawScore: "8/10",
      },
      // One mock session can own one result per receptive skill.  It must
      // still count only once in study.total_sessions.
      {
        id: 103,
        date: "2026-09-09",
        skill: "reading",
        slot: "mock",
        durationMin: 60,
      },
      { id: 104, date: "2026-09-10", skill: "writing", durationMin: 40 },
      { id: 105, date: "2026-09-11", skill: "writing", durationMin: 15 },
      { id: 106, date: "2026-09-12", skill: "speaking", durationMin: 10 },
    ],
    writingSubmissions: [
      {
        id: 201,
        // Linked-session date is the legacy fallback when `date` is absent.
        sessionId: 104,
        date: null,
        createdAt: "2026-08-01T00:00:00.000Z",
        taskType: "task2",
        topic: "Education",
        essayText: longEssay,
        wordCount: 300,
        bandTa: 6,
        bandCc: 6.5,
        bandLr: 6,
        bandGra: 6,
        bandOverall: 6.5,
        gradingMode: "band",
        feedbackJson: JSON.stringify({ next_steps: ["Use examples"] }),
        evaluationMetaJson: JSON.stringify({
          version: 1,
          method: "ai",
          stages: [{ purpose: "writing_feedback", model: "grader-v1" }],
        }),
        errorDensity: 8,
      },
      {
        id: 202,
        sessionId: 105,
        date: null,
        createdAt: "2026-08-01T00:00:00.000Z",
        taskType: "task1",
        essayText: "A legacy report with no band yet.",
        wordCount: 180,
        bandOverall: null,
        gradingMode: "coach",
        errorDensity: 4,
      },
      {
        id: 203,
        date: "2026-09-07",
        createdAt: "2026-08-01T00:00:00.000Z",
        taskType: "free",
        essayText: "A full free-writing attempt.",
        wordCount: 100,
        bandOverall: 7,
        gradingMode: "coach",
        errorDensity: 2,
      },
      {
        id: 204,
        // A submission's explicit date wins over a misleading createdAt.
        date: "2026-09-13",
        createdAt: "2026-08-01T00:00:00.000Z",
        taskType: "task2",
        essayText: "Sunday essay",
        bandOverall: 6,
        gradingMode: "band",
        errorDensity: 6,
      },
      {
        id: 205,
        date: "2026-09-06",
        taskType: "task2",
        essayText: "Previous week essay",
        bandOverall: 5.8,
        gradingMode: "band",
        errorDensity: 10,
      },
    ],
    speakingSessions: [
      {
        id: 301,
        date: "2026-09-08",
        sessionId: 106,
        transcript: longTranscript,
        bandEstimate: 5.5,
        bandOverall: null,
        bandFluencyCoherence: 5.5,
        bandLexicalResource: 6,
        bandGrammaticalAccuracy: 5.5,
        bandPronunciation: 6,
        feedbackJson: null,
        tutorNotes: "Legacy speaking feedback kept as a fallback.",
      },
      {
        id: 302,
        date: "2026-09-12",
        transcript: "Second speaking transcript",
        bandOverall: 6.5,
        bandFluencyCoherence: 6.5,
        bandLexicalResource: 6,
        bandGrammaticalAccuracy: 6.5,
        bandPronunciation: 6,
        feedbackJson: JSON.stringify({ summary: "Good structure" }),
        tutorNotes: "Should not replace structured feedback.",
      },
      { id: 303, date: "2026-09-06", bandOverall: 5.8, transcript: "Previous" },
    ],
    receptiveResults: [
      {
        sessionId: 103,
        skill: "reading",
        rawScore: "30/40",
        correctAnswers: 30,
        totalQuestions: 40,
        accuracy: 0.75,
        difficulty: "hard",
        sourceTitle: "Cambridge 19",
        sourceUrl: "https://example.test/c19-reading",
        feedbackJson: JSON.stringify({ traps: ["headings"] }),
        evaluationMetaJson: JSON.stringify({
          version: 1,
          method: "source",
          stages: [{ purpose: "result_capture" }],
        }),
      },
      {
        sessionId: 103,
        skill: "listening",
        rawScore: "12/20",
        correctAnswers: 12,
        totalQuestions: 20,
        accuracy: 0.6,
        difficulty: "medium",
        sourceTitle: "Cambridge 19",
        sourceUrl: "https://example.test/c19-listening",
      },
    ],
    externalBenchmarks: [
      {
        provider: "toeic",
        date: "2026-08-01",
        sectionScoresJson: { LR: 720, SW: 280 },
      },
      {
        provider: "ef_set",
        date: "2026-09-03",
        readingRaw: 58,
        listeningRaw: 61,
        overallRaw: 60,
        cefr: "B2",
      },
      {
        provider: "ielts",
        date: "2026-09-10",
        readingRaw: 7,
        listeningRaw: 7.5,
        writingRaw: 6,
        speakingRaw: 6.5,
        overallRaw: 6.5,
      },
    ],
    errorCards: [
      {
        id: 401,
        sourceType: "writing",
        sourceRef: "writing_submission:201",
        errorType: "grammar",
        rule: " Articles ",
        observedOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 402,
        sourceType: "writing",
        sourceRef: "writing_submission:202",
        errorType: "grammar",
        rule: "articles",
        observedOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 403,
        sourceType: "writing",
        sourceRef: "writing_submission:203",
        errorType: "grammar",
        rule: "Tense",
        observedOn: "2026-09-07",
        createdAt: "2026-09-07T00:00:00.000Z",
      },
      {
        id: 404,
        sourceType: "speaking",
        sourceRef: "speaking_session:301",
        errorType: "grammar",
        rule: "fluency",
        observedOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 405,
        sourceType: "speaking",
        sourceRef: "speaking_session:302",
        errorType: "grammar",
        rule: "fluency",
        observedOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 406,
        sourceType: "reading",
        sourceRef: "study_session:101",
        errorType: "reading-trap",
        rule: null,
        observedOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 407,
        sourceType: "listening",
        sourceRef: null,
        errorType: "listening-catch",
        rule: null,
        observedOn: null,
        createdAt: "2026-09-08T00:00:00.000Z",
      },
      {
        // observedOn is authoritative, even though the linked submission is
        // in the current week.
        id: 408,
        sourceType: "writing",
        sourceRef: "writing_submission:201",
        errorType: "grammar",
        rule: "articles",
        observedOn: "2026-09-06",
        createdAt: "2026-09-10T00:00:00.000Z",
      },
    ],
  };
}

check("validates ISO week boundaries and real week 53 values", () => {
  assert.deepEqual(isoWeekPeriod("2020-W53"), {
    week: "2020-W53",
    start_date: "2020-12-28",
    end_date: "2021-01-03",
  });
  assert.deepEqual(isoWeekPeriod("2021-W01"), {
    week: "2021-W01",
    start_date: "2021-01-04",
    end_date: "2021-01-10",
  });
  assert.equal(previousISOWeek("2021-W01"), "2020-W53");
  assert.throws(() => isoWeekPeriod("2021-W53"), /Invalid ISO week/);
  assert.throws(() => isoWeekPeriod("2020-W00"), /Invalid ISO week/);
  assert.throws(() => isoWeekPeriod("2020-W1"), /Invalid ISO week/);
});

check(
  "aggregates mixed data, fallback dates, and weighted receptive accuracy",
  () => {
    const summary = aggregateWeeklyEnglishSummary(mixedInput(), WEEK);

    assert.equal(summary.schema_version, "weekly-english-summary.v2");
    assert.deepEqual(summary.period, {
      start_date: "2026-09-07",
      end_date: "2026-09-13",
    });
    assert.deepEqual(summary.study, {
      total_sessions: 6,
      total_minutes: 175,
      active_days: 6,
    });

    assert.equal(summary.writing.sessions, 4);
    assert.equal(summary.writing.scored_sessions, 2);
    assert.equal(summary.writing.avg_score, (6.5 + 6) / 2);
    assert.equal(summary.writing.previous_week, 5.8);
    assert.equal(summary.writing.avg_errors_per_100_words, 5);
    assert.deepEqual(summary.writing.by_task, {
      task1: { scored_sessions: 0, avg_score: null, previous_week: null },
      task2: { scored_sessions: 2, avg_score: 6.25, previous_week: 5.8 },
    });

    assert.equal(summary.speaking.sessions, 2);
    assert.equal(summary.speaking.scored_sessions, 2);
    assert.equal(summary.speaking.avg_score, 6);
    assert.equal(summary.speaking.previous_week, 5.8);
    assert.deepEqual(summary.speaking.criteria_averages, {
      fluency_coherence: 6,
      lexical_resource: 6,
      grammatical_range_accuracy: 6,
      pronunciation: 6,
    });
    assert.deepEqual(summary.speaking.criteria_scored_sessions, {
      fluency_coherence: 2,
      lexical_resource: 2,
      grammatical_range_accuracy: 2,
      pronunciation: 2,
    });
    assert.deepEqual(summary.speaking.common_errors, ["fluency"]);

    // Reading has a 3/5 legacy fallback and a 30/40 child result.  It must be
    // 33/45, not the arithmetic mean of 0.6 and 0.75.
    assert.equal(summary.reading.sessions, 2);
    assert.equal(summary.reading.total_correct, 33);
    assert.equal(summary.reading.total_questions, 45);
    assert.equal(summary.reading.accuracy, 33 / 45);
    assert.equal(summary.reading.previous_week, 4 / 5);
    assert.deepEqual(summary.reading.difficulties, ["hard"]);
    assert.deepEqual(summary.reading.sources, [
      "Cambridge 19",
      "https://example.test/c19-reading",
      "https://legacy.example/reading",
    ]);

    assert.equal(summary.listening.sessions, 2);
    assert.equal(summary.listening.total_correct, 20);
    assert.equal(summary.listening.total_questions, 30);
    assert.equal(summary.listening.accuracy, 20 / 30);
    assert.equal(summary.listening.previous_week, 7 / 10);
    assert.deepEqual(summary.external_benchmarks, [
      {
        provider: "ielts",
        date: "2026-09-10",
        reading_raw: 7,
        listening_raw: 7.5,
        writing_raw: 6,
        speaking_raw: 6.5,
        overall_raw: 6.5,
        section_scores: null,
        cefr: null,
        source_url: null,
        notes: null,
      },
      {
        provider: "ef_set",
        date: "2026-09-03",
        reading_raw: 58,
        listening_raw: 61,
        writing_raw: null,
        speaking_raw: null,
        overall_raw: 60,
        section_scores: null,
        cefr: "B2",
        source_url: null,
        notes: null,
      },
    ]);
  },
);

check("keeps sub-one Writing density in its canonical per-100 unit", () => {
  const summary = aggregateWeeklyEnglishSummary(
    {
      writingSubmissions: [
        {
          id: 1,
          date: "2026-09-07",
          essayText: "Low-error sample",
          errorDensity: 0.5,
        },
      ],
    },
    WEEK,
  );

  assert.equal(summary.writing.avg_errors_per_100_words, 0.5);
});

check("does not double-count one mock session with two child results", () => {
  const summary = aggregateWeeklyEnglishSummary(mixedInput(), WEEK);
  assert.equal(summary.study.total_sessions, 6);
  assert.equal(summary.reading.sessions, 2);
  assert.equal(summary.listening.sessions, 2);
});

check(
  "groups current-week errors by normalized rule and source-linked date",
  () => {
    const summary = aggregateWeeklyEnglishSummary(mixedInput(), WEEK);
    assert.deepEqual(summary.recurring_errors, [
      {
        key: "articles",
        skill: "writing",
        count: 2,
        session_count: 2,
      },
      {
        key: "fluency",
        skill: "speaking",
        count: 2,
        session_count: 2,
      },
    ]);
  },
);

check(
  "keeps selected Writing/Speaking samples complete and deterministically ordered",
  () => {
    const summary = aggregateWeeklyEnglishSummary(mixedInput(), WEEK);
    assert.equal(summary.representative_samples.length, 4);
    assert.deepEqual(
      summary.representative_samples.map(
        (sample) => `${sample.date}:${sample.id}`,
      ),
      ["2026-09-07:203", "2026-09-08:301", "2026-09-12:302", "2026-09-13:204"],
    );

    const speaking = summary.representative_samples.find(
      (sample) => sample.id === 301,
    );
    assert.ok(speaking);
    assert.equal(speaking.transcript, longTranscript);
    assert.equal(speaking.score, 5.5);
    assert.equal(
      speaking.feedback,
      "Legacy speaking feedback kept as a fallback.",
    );

    assert.ok(
      summary.representative_samples.every(
        (sample) => sample.skill === "writing" || sample.skill === "speaking",
      ),
    );
  },
);

check("returns empty blocks and validates before processing rows", () => {
  const summary = aggregateWeeklyEnglishSummary({}, WEEK);
  assert.deepEqual(summary.speaking, {
    sessions: 0,
    scored_sessions: 0,
    avg_score: null,
    previous_week: null,
    criteria_averages: {
      fluency_coherence: null,
      lexical_resource: null,
      grammatical_range_accuracy: null,
      pronunciation: null,
    },
    criteria_scored_sessions: {
      fluency_coherence: 0,
      lexical_resource: 0,
      grammatical_range_accuracy: 0,
      pronunciation: 0,
    },
    common_errors: [],
  });
  assert.deepEqual(summary.writing, {
    sessions: 0,
    scored_sessions: 0,
    avg_score: null,
    previous_week: null,
    avg_errors_per_100_words: null,
    by_task: {
      task1: { scored_sessions: 0, avg_score: null, previous_week: null },
      task2: { scored_sessions: 0, avg_score: null, previous_week: null },
    },
  });
  for (const skill of ["reading", "listening"] as const) {
    assert.deepEqual(summary[skill], {
      sessions: 0,
      total_correct: 0,
      total_questions: 0,
      accuracy: null,
      previous_week: null,
      difficulties: [],
      sources: [],
    });
  }
  assert.deepEqual(summary.representative_samples, []);
  assert.deepEqual(summary.external_benchmarks, []);
  assert.throws(
    () =>
      aggregateWeeklyEnglishSummary(
        { sessions: [{ date: "not-a-date" }] },
        "2025-W53",
      ),
    /Invalid ISO week/,
  );
});

console.log(`\n✓ Weekly summary: ${passed}/${passed} checks passed`);
