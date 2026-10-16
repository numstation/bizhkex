CREATE TABLE `businessListings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`industry` varchar(100) NOT NULL,
	`district` varchar(100) NOT NULL,
	`turnover` int NOT NULL,
	`netProfit` int NOT NULL,
	`paybackPeriod` int NOT NULL,
	`askingPrice` int NOT NULL,
	`badges` json,
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE INDEX `businessListings_industry_index` ON `businessListings` (`industry`);--> statement-breakpoint
CREATE INDEX `businessListings_district_index` ON `businessListings` (`district`);
