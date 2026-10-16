ALTER TABLE `offices` ADD `inventoryKind` enum('operator','partner','sample') NOT NULL DEFAULT 'sample';--> statement-breakpoint
ALTER TABLE `offices` ADD `isFeatured` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `offices` ADD `isVerified` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `offices` ADD `awaitingPhotos` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `offices` ADD `priceOnRequest` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `offices` ADD `featuredOrder` int NOT NULL DEFAULT 100;--> statement-breakpoint
ALTER TABLE `offices` ADD `occupancyNote` varchar(255);