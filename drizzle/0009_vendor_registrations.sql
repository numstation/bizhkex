CREATE TABLE `vendorRegistrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceId` varchar(32) NOT NULL,
	`type` enum('office','business') NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`contactName` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`district` varchar(100) NOT NULL,
	`industry` varchar(100),
	`summary` text NOT NULL,
	`listingJson` json,
	`photoUrls` json,
	`locale` varchar(5) DEFAULT 'zh',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendorRegistrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendorRegistrations_referenceId_unique` UNIQUE(`referenceId`)
);
CREATE INDEX `vendorRegistrations_email_index` ON `vendorRegistrations` (`email`);
