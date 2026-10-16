CREATE TABLE `officeViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`officeId` int NOT NULL,
	`userId` int,
	`sessionId` varchar(100),
	`viewedAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE INDEX `officeViews_officeId_index` ON `officeViews` (`officeId`);--> statement-breakpoint
CREATE INDEX `officeViews_viewedAt_index` ON `officeViews` (`viewedAt`);