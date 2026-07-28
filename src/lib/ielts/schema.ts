import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

/** One completed study activity of any skill. */
export const studySession = sqliteTable("study_session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  skill: text("skill").$type<Skill>().notNull(),
  phase: integer("phase"), // 0 = warm-up, 1, 2
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
  taskType: text("task_type").$type<"task1" | "task2">().notNull(),
  topic: text("topic"),
  prompt: text("prompt"),
  essayText: text("essay_text").notNull(),
  wordCount: integer("word_count"),
  bandTa: real("band_ta"), // task response / task achievement
  bandCc: real("band_cc"), // coherence & cohesion
  bandLr: real("band_lr"), // lexical resource
  bandGra: real("band_gra"), // grammatical range & accuracy
  bandOverall: real("band_overall"),
  feedbackJson: text("feedback_json"), // JSON: per-criterion notes + to_reach_7
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

/** Speaking sessions with the tutor (tracked, not graded by app). */
export const speakingSession = sqliteTable("speaking_session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  durationMin: integer("duration_min"),
  tutorNotes: text("tutor_notes"),
  bandEstimate: real("band_estimate"),
});

export type StudySession = typeof studySession.$inferSelect;
export type WritingSubmission = typeof writingSubmission.$inferSelect;
export type ErrorCard = typeof errorCard.$inferSelect;
export type ReviewLog = typeof reviewLog.$inferSelect;
export type BandHistory = typeof bandHistory.$inferSelect;
export type SpeakingSession = typeof speakingSession.$inferSelect;
