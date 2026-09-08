CREATE TABLE `phase_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phase` text NOT NULL,
	`started_on` text NOT NULL,
	`completed_on` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `phase_state_one_open` ON `phase_state` (`completed_on`) WHERE "phase_state"."completed_on" is null;--> statement-breakpoint
ALTER TABLE `error_card` ADD `rule` text;--> statement-breakpoint
ALTER TABLE `study_session` ADD `slot` text;--> statement-breakpoint
ALTER TABLE `writing_submission` ADD `prompt_id` text;--> statement-breakpoint
ALTER TABLE `writing_submission` ADD `error_density` real;--> statement-breakpoint
ALTER TABLE `writing_submission` ADD `grading_mode` text;--> statement-breakpoint
ALTER TABLE `writing_submission` ADD `grader_spread` real;