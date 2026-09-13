CREATE TABLE `external_benchmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`date` text NOT NULL,
	`reading_raw` real,
	`listening_raw` real,
	`writing_raw` real,
	`speaking_raw` real,
	`overall_raw` real,
	`cefr` text,
	`source_url` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weekly_notion_sync` (
	`week` text PRIMARY KEY NOT NULL,
	`notion_page_id` text NOT NULL,
	`synced_at` text NOT NULL,
	`summary_hash` text NOT NULL
);
