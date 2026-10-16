CREATE TABLE `articleCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articleCategories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `articleTagRelations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`tagId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `articleTags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articleTags_name_unique` UNIQUE(`name`),
	CONSTRAINT `articleTags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`categoryId` int NOT NULL,
	`content` text NOT NULL,
	`excerpt` text NOT NULL,
	`author` varchar(100) DEFAULT 'BizHKEx Team',
	`featured` tinyint DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `locationComparisons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`officeId1` int NOT NULL,
	`officeId2` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `articleCategories_slug_unique` ON `articleCategories` (`slug`);--> statement-breakpoint
CREATE INDEX `articleTagRelations_articleId_index` ON `articleTagRelations` (`articleId`);--> statement-breakpoint
CREATE INDEX `articleTagRelations_tagId_index` ON `articleTagRelations` (`tagId`);--> statement-breakpoint
CREATE INDEX `articleTags_slug_unique` ON `articleTags` (`slug`);--> statement-breakpoint
CREATE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE INDEX `articles_categoryId_index` ON `articles` (`categoryId`);--> statement-breakpoint
CREATE INDEX `articles_featured_index` ON `articles` (`featured`);--> statement-breakpoint
CREATE INDEX `articles_publishedAt_index` ON `articles` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `locationComparisons_officeId1_index` ON `locationComparisons` (`officeId1`);--> statement-breakpoint
CREATE INDEX `locationComparisons_officeId2_index` ON `locationComparisons` (`officeId2`);