CREATE TABLE `platform_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`schema_id` text NOT NULL,
	`schema_version` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`credential_values` blob NOT NULL,
	`maximum_refresh_interval_in_sec` integer DEFAULT 0 NOT NULL,
	`last_refreshed_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`schema_id`,`schema_version`) REFERENCES `credential_schema`(`id`,`schema_version`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `authenticator` (
	`credentialID` text NOT NULL,
	`userId` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`credentialDeviceType` text NOT NULL,
	`credentialBackedUp` integer NOT NULL,
	`transports` text,
	PRIMARY KEY(`userId`, `credentialID`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text,
	`userId` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`emailVerified` integer,
	`avatar` text
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`identifier`, `token`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `credential_schema` (
	`id` text NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`platform` text NOT NULL,
	`credential_type` text NOT NULL,
	`available` integer DEFAULT true NOT NULL,
	`auto_refreshable` integer DEFAULT false NOT NULL,
	`refresh_logic_type` text DEFAULT 'script' NOT NULL,
	`refresh_logic` text,
	`maximum_refresh_interval_in_sec` integer DEFAULT 0 NOT NULL,
	`available_permissions` text NOT NULL,
	`permissions` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`status` text DEFAULT 'ok' NOT NULL,
	`created_by` text DEFAULT 'user' NOT NULL,
	PRIMARY KEY(`id`, `schema_version`)
);
--> statement-breakpoint
CREATE TABLE `credential_schema_fields` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`schema_id` text NOT NULL,
	`schema_version` integer NOT NULL,
	`field_name` text NOT NULL,
	`field_type` text NOT NULL,
	`is_required` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`schema_id`,`schema_version`) REFERENCES `credential_schema`(`id`,`schema_version`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_sessionToken_unique` ON `session` (`sessionToken`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);