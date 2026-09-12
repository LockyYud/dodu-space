CREATE TABLE `receptive_result` (
	`session_id` integer NOT NULL,
	`skill` text NOT NULL,
	`raw_score` text,
	`correct_answers` integer,
	`total_questions` integer,
	`accuracy` real,
	`difficulty` text,
	`source_title` text,
	`source_url` text,
	`feedback_json` text,
	`evaluation_meta_json` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`session_id`, `skill`),
	FOREIGN KEY (`session_id`) REFERENCES `study_session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `error_card` ADD `observed_on` text;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `session_id` integer REFERENCES study_session(id);--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `transcript` text;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `fit_in_two_minutes` integer;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `band_fluency_coherence` real;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `band_lexical_resource` real;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `band_grammatical_accuracy` real;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `band_pronunciation` real;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `band_overall` real;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `feedback_json` text;--> statement-breakpoint
ALTER TABLE `speaking_session` ADD `evaluation_meta_json` text;--> statement-breakpoint
ALTER TABLE `writing_submission` ADD `date` text;--> statement-breakpoint
ALTER TABLE `writing_submission` ADD `evaluation_meta_json` text;