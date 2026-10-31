CREATE TABLE `quote_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`service` text NOT NULL,
	`profile` text NOT NULL,
	`city` text NOT NULL,
	`postcode` text NOT NULL,
	`timing` text NOT NULL,
	`description` text NOT NULL,
	`name` text NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`consent_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`ip_hash` text NOT NULL,
	`notified` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quote_requests_reference_unique` ON `quote_requests` (`reference`);--> statement-breakpoint
CREATE INDEX `quote_requests_created_at` ON `quote_requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `quote_requests_ip_created` ON `quote_requests` (`ip_hash`,`created_at`);