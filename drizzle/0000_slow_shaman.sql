CREATE TABLE `band_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`listening` real,
	`reading` real,
	`writing` real,
	`speaking` real,
	`overall` real,
	`is_mock` integer DEFAULT false NOT NULL,
	`note` text
);
--> statement-breakpoint
CREATE TABLE `error_card` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_type` text NOT NULL,
	`source_ref` text,
	`error_type` text NOT NULL,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`explanation` text,
	`context` text,
	`ease_factor` real DEFAULT 2.5 NOT NULL,
	`interval_days` integer DEFAULT 0 NOT NULL,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`due_date` text NOT NULL,
	`last_reviewed` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `review_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_id` integer NOT NULL,
	`reviewed_at` text DEFAULT (datetime('now')) NOT NULL,
	`grade` text NOT NULL,
	`prev_interval` integer,
	`new_interval` integer,
	FOREIGN KEY (`card_id`) REFERENCES `error_card`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `speaking_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`duration_min` integer,
	`tutor_notes` text,
	`band_estimate` real
);
--> statement-breakpoint
CREATE TABLE `study_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`skill` text NOT NULL,
	`phase` integer,
	`week` integer,
	`duration_min` integer,
	`source_url` text,
	`status` text DEFAULT 'done' NOT NULL,
	`raw_score` text,
	`band_estimate` real,
	`screenshot_ref` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `writing_submission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer,
	`task_type` text NOT NULL,
	`topic` text,
	`prompt` text,
	`essay_text` text NOT NULL,
	`word_count` integer,
	`band_ta` real,
	`band_cc` real,
	`band_lr` real,
	`band_gra` real,
	`band_overall` real,
	`feedback_json` text,
	`is_rewrite` integer DEFAULT false NOT NULL,
	`parent_submission_id` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `study_session`(`id`) ON UPDATE no action ON DELETE no action
);
