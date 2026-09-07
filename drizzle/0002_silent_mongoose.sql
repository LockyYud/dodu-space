ALTER TABLE `learner_profile` ADD `plan_start` text;--> statement-breakpoint
ALTER TABLE `learner_profile` ADD `exam_date` text;--> statement-breakpoint
ALTER TABLE `learner_profile` ADD `weekly_target` integer DEFAULT 5 NOT NULL;