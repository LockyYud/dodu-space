import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { EvaluationMetadata } from "./evaluation";

/**
 * IELTS tracker — Drizzle schema (SQLite / libSQL).
 * See docs/ielts/TECH-DESIGN.md §4. Dates are stored as ISO strings for
 * human-readability in the SQLite file; timestamps as ISO too.
 */

export const SKILLS = [
  "reading",
  "listening",
  "writing",
  "speaking",
  "vocab",
] as const;
export type Skill = (typeof SKILLS)[number];

export const ERROR_TYPES = [
  "grammar",
  "vocab",
  "collocation",
  "coherence",
  "spelling",
  "listening-catch",
  "reading-trap",
] as const;
export type ErrorType = (typeof ERROR_TYPES)[number];

export const REVIEW_GRADES = ["again", "hard", "good", "easy"] as const;
export type ReviewGrade = (typeof REVIEW_GRADES)[number];

/** Scores imported from an external assessment must retain its native scale. */
export const EXTERNAL_BENCHMARK_PROVIDERS = [
  "ef_set",
  "toeic",
  "ielts",
  "other",
] as const;
export type ExternalBenchmarkProvider =
  (typeof EXTERNAL_BENCHMARK_PROVIDERS)[number];

/** One completed study activity of any skill. */
/**
 * `study_session.source_url` marker for the once-a-day row written when the
 * learner reviews SRS cards. Reviewing is studying: without this row the
 * streak and the 14-day pace window could not see review-only days, so the
 * app's own "just review for 10 minutes today" advice never counted.
 */
export const REVIEW_SESSION_MARKER = "ielts:review";
/**
 * `error_card.source_ref` markers.
 *
 * Cần thiết vì `error_type` không đủ để phân biệt: một thẻ lỗi từ bài viết cũng
 * mang `collocation`. Không có marker thì trần thẻ từ vựng mỗi ngày sẽ đếm nhầm
 * cả thẻ lỗi, và tệ hơn, so trùng có thể sửa nhầm vào thẻ lỗi của bài viết.
 */
export const VOCAB_CARD_MARKER = "ielts:vocab";
export const DAILY_SESSION_MARKER = "ielts:daily";
export const DICTATION_CARD_MARKER = "ielts:dictation";

/** `study_session.status` for that row. */
export const REVIEW_SESSION_STATUS = "review";

export const studySession = sqliteTable("study_session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  skill: text("skill").$type<Skill>().notNull(),
  lessonId: text("lesson_id"), // legacy: id in the v2 lesson queue
  // Roadmap v3 accounting unit: which daily/weekly slot this session filled.
  // See SlotId in ./plan.ts.
  slot: text("slot"),
  phase: integer("phase"), // 0 = warm-up, 1, 2 — derived from the lesson queue, not the calendar
  week: integer("week"),
  durationMin: integer("duration_min"),
  sourceUrl: text("source_url"),
  status: text("status").notNull().default("done"),
  rawScore: text("raw_score"), // e.g. "32/40"
  bandEstimate: real("band_estimate"),
  screenshotRef: text("screenshot_ref"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

/** Writing-specific detail, 1-1 with a study_session of skill=writing. */
export const writingSubmission = sqliteTable("writing_submission", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").references(() => studySession.id),
  // Nullable for legacy rows; new writing flows should always populate it.
  date: text("date"), // YYYY-MM-DD
  // "free" là bài của "Viết mỗi ngày": không phải Task 1 hay Task 2, không bao
  // giờ chấm band. Cột là text không có CHECK nên chỉ nới kiểu TS, không cần
  // đụng tới dữ liệu cũ.
  taskType: text("task_type").$type<"task1" | "task2" | "free">().notNull(),
  topic: text("topic"),
  // Which prompt from the bank this answered, so the app can hand out a fresh
  // one next time instead of repeating.
  promptId: text("prompt_id"),
  prompt: text("prompt"),
  essayText: text("essay_text").notNull(),
  wordCount: integer("word_count"),
  bandTa: real("band_ta"), // task response / task achievement
  bandCc: real("band_cc"), // coherence & cohesion
  bandLr: real("band_lr"), // lexical resource
  bandGra: real("band_gra"), // grammatical range & accuracy
  bandOverall: real("band_overall"),
  feedbackJson: text("feedback_json"), // JSON: per-criterion notes + next steps
  // Errors per 100 words from the extraction pass. The progress measure for
  // the coach phases, where bands are deliberately absent.
  errorDensity: real("error_density"),
  gradingMode: text("grading_mode").$type<"coach" | "band">(),
  // Spread between the highest and lowest sampled overall band; high spread
  // means the grade is not trustworthy and the UI says so.
  graderSpread: real("grader_spread"),
  evaluationMetaJson: text("evaluation_meta_json", {
    mode: "json",
  }).$type<EvaluationMetadata>(),
  isRewrite: integer("is_rewrite", { mode: "boolean" })
    .notNull()
    .default(false),
  parentSubmissionId: integer("parent_submission_id"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

/** The SRS unit — one mistake, with SM-2 state embedded. */
export const errorCard = sqliteTable("error_card", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceType: text("source_type").$type<Skill>().notNull(),
  sourceRef: text("source_ref"), // e.g. "writing_submission:12"
  errorType: text("error_type").$type<ErrorType>().notNull(),
  // Closed rule id from ./error-rules.ts, so repeat offences can be counted
  // across submissions rather than per free-form card text.
  rule: text("rule"),
  front: text("front").notNull(), // the wrong sentence / point
  back: text("back").notNull(), // the corrected version
  explanation: text("explanation"),
  context: text("context"),
  // SM-2 state:
  easeFactor: real("ease_factor").notNull().default(2.5),
  intervalDays: integer("interval_days").notNull().default(0),
  repetitions: integer("repetitions").notNull().default(0),
  lapses: integer("lapses").notNull().default(0),
  dueDate: text("due_date").notNull(), // YYYY-MM-DD
  lastReviewed: text("last_reviewed"),
  observedOn: text("observed_on"), // YYYY-MM-DD; null for legacy cards
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

/** One review event of one card. */
export const reviewLog = sqliteTable("review_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cardId: integer("card_id")
    .notNull()
    .references(() => errorCard.id),
  reviewedAt: text("reviewed_at").notNull().default(sql`(datetime('now'))`),
  grade: text("grade").$type<ReviewGrade>().notNull(),
  prevInterval: integer("prev_interval"),
  newInterval: integer("new_interval"),
});

/** Band snapshots for the progress chart (mainly from mock tests). */
export const bandHistory = sqliteTable("band_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  listening: real("listening"),
  reading: real("reading"),
  writing: real("writing"),
  speaking: real("speaking"),
  overall: real("overall"),
  isMock: integer("is_mock", { mode: "boolean" }).notNull().default(false),
  note: text("note"),
});

/** Self-practice speaking sessions (tracked, not graded by app). */
export const speakingSession = sqliteTable("speaking_session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  durationMin: integer("duration_min"),
  sessionId: integer("session_id").references(() => studySession.id),
  transcript: text("transcript"),
  fitInTwoMinutes: integer("fit_in_two_minutes", { mode: "boolean" }),
  bandFluencyCoherence: real("band_fluency_coherence"),
  bandLexicalResource: real("band_lexical_resource"),
  bandGrammaticalAccuracy: real("band_grammatical_accuracy"),
  bandPronunciation: real("band_pronunciation"),
  bandOverall: real("band_overall"),
  feedbackJson: text("feedback_json"),
  evaluationMetaJson: text("evaluation_meta_json", {
    mode: "json",
  }).$type<EvaluationMetadata>(),
  // Kept for rows written by the original tutor workflow.
  tutorNotes: text("tutor_notes"),
  bandEstimate: real("band_estimate"),
});

export type ReceptiveSkill = Extract<Skill, "reading" | "listening">;

/** Structured result for one Reading or Listening session. */
export const receptiveResult = sqliteTable(
  "receptive_result",
  {
    sessionId: integer("session_id")
      .notNull()
      .references(() => studySession.id),
    skill: text("skill").$type<ReceptiveSkill>().notNull(),
    // Keep the human-readable form used by legacy study_session rows (e.g.
    // "32/40") alongside numeric fields for reporting and validation.
    rawScore: text("raw_score"),
    correctAnswers: integer("correct_answers"),
    totalQuestions: integer("total_questions"),
    accuracy: real("accuracy"),
    difficulty: text("difficulty"),
    sourceTitle: text("source_title"),
    sourceUrl: text("source_url"),
    feedbackJson: text("feedback_json"),
    evaluationMetaJson: text("evaluation_meta_json", {
      mode: "json",
    }).$type<EvaluationMetadata>(),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [primaryKey({ columns: [table.sessionId, table.skill] })],
);

/** An external benchmark (EF SET, TOEIC, IELTS…) in its original scale. */
export const externalBenchmark = sqliteTable("external_benchmark", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  provider: text("provider").$type<ExternalBenchmarkProvider>().notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  readingRaw: real("reading_raw"),
  listeningRaw: real("listening_raw"),
  writingRaw: real("writing_raw"),
  speakingRaw: real("speaking_raw"),
  overallRaw: real("overall_raw"),
  // Native sections which do not map to four skills, e.g. {"LR":720,"SW":280}.
  sectionScoresJson: text("section_scores_json", { mode: "json" }).$type<
    Record<string, number>
  >(),
  cefr: text("cefr"),
  sourceUrl: text("source_url"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

/** Idempotency record for a user-triggered export of one ISO week to Notion. */
export const weeklyNotionSync = sqliteTable("weekly_notion_sync", {
  week: text("week").primaryKey(),
  notionPageId: text("notion_page_id").notNull(),
  syncedAt: text("synced_at").notNull(),
  summaryHash: text("summary_hash").notNull(),
});

/**
 * Single-row runtime-editable learner profile (see /ielts/settings).
 * `.env` values are only the seed/default used while this table is empty.
 */
export const learnerProfile = sqliteTable("learner_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  examGoal: text("exam_goal").notNull(),
  startPoint: text("start_point").notNull(),
  dailyMinutes: integer("daily_minutes").notNull(),
  targetOverall: real("target_overall").notNull(),
  targetListening: real("target_listening").notNull(),
  targetReading: real("target_reading").notNull(),
  targetWriting: real("target_writing").notNull(),
  targetSpeaking: real("target_speaking").notNull(),
  strategy: text("strategy").notNull(),
  constraints: text("constraints").notNull(), // JSON string[]
  priorities: text("priorities").notNull(), // JSON string[]
  // Pace tracking (roadmap v2): when the plan restarted, when the exam is,
  // and how many required lessons a week the learner is committing to.
  planStart: text("plan_start"), // YYYY-MM-DD
  examDate: text("exam_date"), // YYYY-MM-DD, null until the habit gate passes
  weeklyTarget: integer("weekly_target").notNull().default(5),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

/**
 * One row per phase the learner has entered (roadmap v3). Phases advance on
 * explicit confirmation once every exit criterion is met, never on a date, so
 * the app needs to remember when the current phase actually began.
 */
export const phaseState = sqliteTable(
  "phase_state",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    phase: text("phase").notNull(), // PhaseId
    startedOn: text("started_on").notNull(), // YYYY-MM-DD
    completedOn: text("completed_on"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    // At most one phase may be open at a time. Belt and braces alongside the
    // re-check in currentPhase(): two concurrent loaders must not both open one.
    uniqueIndex("phase_state_one_open")
      .on(table.completedOn)
      .where(sql`${table.completedOn} is null`),
  ],
);

/**
 * How heavy the learner declared a given week to be.
 *
 * Keyed by the week's Monday, so a busy week stays busy in hindsight and the
 * weekly counters can be read back honestly later. Absent row = a normal week.
 */
export const weekLoad = sqliteTable("week_load", {
  weekStart: text("week_start").primaryKey(), // YYYY-MM-DD, always a Monday
  load: text("load").notNull(), // WeekLoad
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

/**
 * Một lượt quay của "Viết mỗi ngày". Xem docs/ielts/DAILY-WRITING.md §7.
 *
 * `date` là UNIQUE — đó là chỗ ép "mỗi ngày một lượt", ép ở tầng DB chứ không
 * ở tầng UI. Kết quả quay là ngẫu nhiên thật và được ghi ngay lúc quay, nên tải
 * lại trang không quay lại được: lượt đã tiêu, chứ không phải đề bị định sẵn.
 */
export const dailySpin = sqliteTable("daily_spin", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  cycleId: integer("cycle_id").notNull(),
  // Ba cụm của chu kỳ, ngăn bằng dấu phẩy. Lặp trên mọi hàng của cùng chu kỳ,
  // nhưng chép ra thế này thì lượt quay ĐẦU của chu kỳ cũng đã biết bộ cụm —
  // suy ngược từ các cụm đã xuất hiện thì hàng đầu tiên không suy ra nổi.
  cycleClusters: text("cycle_clusters").notNull(),
  cycleIndex: integer("cycle_index").notNull(), // 0..13, đếm theo bài đã viết
  half: text("half").$type<"fresh" | "rewrite">().notNull(),
  clusterId: text("cluster_id").notNull(),
  promptId: text("prompt_id").notNull(),
  // Chỉ ở half="rewrite": bài lần một, để so hai lần viết sau khi chấm.
  rewriteOfSubmissionId: integer("rewrite_of_submission_id"),
  status: text("status")
    .$type<"spun" | "written" | "skipped">()
    .notNull()
    .default("spun"),
  submissionId: integer("submission_id"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export type StudySession = typeof studySession.$inferSelect;
export type WritingSubmission = typeof writingSubmission.$inferSelect;
export type ErrorCard = typeof errorCard.$inferSelect;
export type ReviewLog = typeof reviewLog.$inferSelect;
export type BandHistory = typeof bandHistory.$inferSelect;
export type SpeakingSession = typeof speakingSession.$inferSelect;
export type ReceptiveResult = typeof receptiveResult.$inferSelect;
export type ExternalBenchmark = typeof externalBenchmark.$inferSelect;
export type PhaseStateRow = typeof phaseState.$inferSelect;
export type LearnerProfileRow = typeof learnerProfile.$inferSelect;
export type WeekLoadRow = typeof weekLoad.$inferSelect;
export type DailySpinRow = typeof dailySpin.$inferSelect;
