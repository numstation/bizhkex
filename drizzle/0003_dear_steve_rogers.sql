CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailNotifications` tinyint DEFAULT 1,
	`pushNotifications` tinyint DEFAULT 1,
	`notifyOnNewInquiry` tinyint DEFAULT 1,
	`notifyOnInquiryUpdate` tinyint DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`inquiryId` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`type` enum('inquiry','system','update') DEFAULT 'system',
	`isRead` tinyint DEFAULT 0,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE INDEX `notificationPreferences_userId_unique` ON `notificationPreferences` (`userId`);--> statement-breakpoint
CREATE INDEX `notifications_userId_index` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notifications_inquiryId_index` ON `notifications` (`inquiryId`);