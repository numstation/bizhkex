CREATE TABLE `inquiryResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiryId` int NOT NULL,
	`providerId` int NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `inquiryResponses_inquiryId_index` ON `inquiryResponses` (`inquiryId`);--> statement-breakpoint
CREATE INDEX `inquiryResponses_providerId_index` ON `inquiryResponses` (`providerId`);