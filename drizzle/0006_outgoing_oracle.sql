CREATE TABLE `officePhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`officeId` int NOT NULL,
	`photoUrl` varchar(500) NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `offices` ADD `isPromoted` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `offices` ADD `discountPercentage` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `pricingPackages` ADD `deskType` enum('private_office','dedicated_desk','hot_desk','virtual_office') NOT NULL;--> statement-breakpoint
CREATE INDEX `officePhotos_officeId_index` ON `officePhotos` (`officeId`);