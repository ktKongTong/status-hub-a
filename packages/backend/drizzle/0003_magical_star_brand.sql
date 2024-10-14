ALTER TABLE `platform_credentials` ADD `expect_expires` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `platform_credentials` ADD `status` text DEFAULT 'ok' NOT NULL;