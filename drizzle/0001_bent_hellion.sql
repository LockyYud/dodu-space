CREATE TABLE `learner_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`exam_goal` text NOT NULL,
	`start_point` text NOT NULL,
	`daily_minutes` integer NOT NULL,
	`target_overall` real NOT NULL,
	`target_listening` real NOT NULL,
	`target_reading` real NOT NULL,
	`target_writing` real NOT NULL,
	`target_speaking` real NOT NULL,
	`strategy` text NOT NULL,
	`constraints` text NOT NULL,
	`priorities` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `study_session` ADD `lesson_id` text;