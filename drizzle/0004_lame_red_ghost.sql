CREATE TABLE `week_load` (
	`week_start` text PRIMARY KEY NOT NULL,
	`load` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
