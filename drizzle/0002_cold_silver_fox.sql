CREATE TABLE `providerAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`totalListings` int DEFAULT 0,
	`totalInquiries` int DEFAULT 0,
	`contactedInquiries` int DEFAULT 0,
	`conversionRate` decimal(5,2) DEFAULT '0',
	`monthlyViews` int DEFAULT 0,
	`monthlyClicks` int DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `amenities` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `districts` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `faqs` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `inquiries` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `offices` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `pricingPackages` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `providers` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `providers` ADD `userId` int NOT NULL;--> statement-breakpoint
CREATE INDEX `providerAnalytics_providerId_index` ON `providerAnalytics` (`providerId`);--> statement-breakpoint
CREATE INDEX `providers_userId_index` ON `providers` (`userId`);