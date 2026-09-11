CREATE TABLE `daily_spin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`cycle_id` integer NOT NULL,
	`cycle_clusters` text NOT NULL,
	`cycle_index` integer NOT NULL,
	`half` text NOT NULL,
	`cluster_id` text NOT NULL,
	`prompt_id` text NOT NULL,
	`rewrite_of_submission_id` integer,
	`status` text DEFAULT 'spun' NOT NULL,
	`submission_id` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_spin_date_unique` ON `daily_spin` (`date`);