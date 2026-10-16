import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, tinyint, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm"

export const amenities = mysqlTable("amenities", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	icon: varchar({ length: 50 }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("amenities_name_unique").on(table.name),
]);

export const districts = mysqlTable("districts", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	region: mysqlEnum(['hong_kong_island','kowloon','new_territories']).notNull(),
	displayOrder: int().default(0),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("districts_name_unique").on(table.name),
]);

export const faqs = mysqlTable("faqs", {
	id: int().autoincrement().notNull(),
	question: varchar({ length: 500 }).notNull(),
	answer: text().notNull(),
	displayOrder: int().default(0),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const inquiries = mysqlTable("inquiries", {
	id: int().autoincrement().notNull(),
	officeId: int().notNull(),
	userId: int(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 20 }),
	company: varchar({ length: 255 }),
	message: text().notNull(),
	status: mysqlEnum(['new','contacted','resolved','archived']).default('new'),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const offices = mysqlTable("offices", {
	id: int().autoincrement().notNull(),
	providerId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	districtId: int().notNull(),
	address: varchar({ length: 500 }).notNull(),
	latitude: decimal({ precision: 10, scale: 8 }),
	longitude: decimal({ precision: 11, scale: 8 }),
	thumbnailUrl: varchar({ length: 500 }),
	rating: decimal({ precision: 3, scale: 1 }).default('4.5'),
	reviewCount: int().default(0),
	basePrice: decimal({ precision: 10, scale: 2 }).notNull(),
	amenitiesJson: json(),
	isPromoted: tinyint().default(0),
	discountPercentage: decimal({ precision: 5, scale: 2 }).default('0'),
	/** operator = BizHKEx centre, partner = approved provider, sample = placeholder inventory */
	inventoryKind: mysqlEnum(['operator','partner','sample']).default('sample').notNull(),
	isFeatured: tinyint().default(0).notNull(),
	isVerified: tinyint().default(0).notNull(),
	awaitingPhotos: tinyint().default(0).notNull(),
	priceOnRequest: tinyint().default(0).notNull(),
	featuredOrder: int().default(100).notNull(),
	occupancyNote: varchar({ length: 255 }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const pricingPackages = mysqlTable("pricingPackages", {
	id: int().autoincrement().notNull(),
	officeId: int().notNull(),
	deskType: mysqlEnum(['private_office','dedicated_desk','hot_desk','virtual_office']).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
	currency: varchar({ length: 3 }).default('HKD'),
	billingCycle: mysqlEnum(['monthly','quarterly','annual']).default('monthly'),
	capacity: int(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const providers = mysqlTable("providers", {
	id: int().autoincrement().notNull(),
	userId: int("userId").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 20 }),
	website: varchar({ length: 255 }),
	logoUrl: varchar({ length: 500 }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("providers_userId_index").on(table.userId),
]);

export const providerAnalytics = mysqlTable("providerAnalytics", {
	id: int().autoincrement().notNull(),
	providerId: int().notNull(),
	totalListings: int().default(0),
	totalInquiries: int().default(0),
	contactedInquiries: int().default(0),
	conversionRate: decimal({ precision: 5, scale: 2 }).default('0'),
	monthlyViews: int().default(0),
	monthlyClicks: int().default(0),
	lastUpdated: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("providerAnalytics_providerId_index").on(table.providerId),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin','provider']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);

export const notificationPreferences = mysqlTable("notificationPreferences", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	emailNotifications: tinyint().default(1),
	pushNotifications: tinyint().default(1),
	notifyOnNewInquiry: tinyint().default(1),
	notifyOnInquiryUpdate: tinyint().default(1),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("notificationPreferences_userId_unique").on(table.userId),
]);

export const notifications = mysqlTable("notifications", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	inquiryId: int(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	type: mysqlEnum(['inquiry','system','update']).default('system'),
	isRead: tinyint().default(0),
	sentAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("notifications_userId_index").on(table.userId),
	index("notifications_inquiryId_index").on(table.inquiryId),
]);

export const inquiryResponses = mysqlTable("inquiryResponses", {
	id: int().autoincrement().notNull(),
	inquiryId: int().notNull(),
	providerId: int().notNull(),
	message: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("inquiryResponses_inquiryId_index").on(table.inquiryId),
	index("inquiryResponses_providerId_index").on(table.providerId),
]);

export const officeViews = mysqlTable("officeViews", {
	id: int().autoincrement().notNull(),
	officeId: int().notNull(),
	userId: int(),
	sessionId: varchar({ length: 100 }),
	viewedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("officeViews_officeId_index").on(table.officeId),
	index("officeViews_viewedAt_index").on(table.viewedAt),
]);

export const officePhotos = mysqlTable("officePhotos", {
	id: int().autoincrement().notNull(),
	officeId: int().notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	displayOrder: int().default(0),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("officePhotos_officeId_index").on(table.officeId),
]);


export const articleCategories = mysqlTable("articleCategories", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull().unique(),
	description: text(),
	displayOrder: int().default(0),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("articleCategories_slug_unique").on(table.slug),
]);

export const articles = mysqlTable("articles", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull().unique(),
	categoryId: int().notNull(),
	content: text().notNull(),
	excerpt: text().notNull(),
	author: varchar({ length: 100 }).default('BizHKEx Team'),
	featured: tinyint().default(0),
	publishedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("articles_slug_unique").on(table.slug),
	index("articles_categoryId_index").on(table.categoryId),
	index("articles_featured_index").on(table.featured),
	index("articles_publishedAt_index").on(table.publishedAt),
]);

export const articleTags = mysqlTable("articleTags", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 50 }).notNull().unique(),
	slug: varchar({ length: 50 }).notNull().unique(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("articleTags_slug_unique").on(table.slug),
]);

export const articleTagRelations = mysqlTable("articleTagRelations", {
	id: int().autoincrement().notNull(),
	articleId: int().notNull(),
	tagId: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("articleTagRelations_articleId_index").on(table.articleId),
	index("articleTagRelations_tagId_index").on(table.tagId),
]);

export const businessListings = mysqlTable("businessListings", {
	id: int().autoincrement().notNull(),
	title: text().notNull(),
	industry: varchar({ length: 100 }).notNull(),
	district: varchar({ length: 100 }).notNull(),
	turnover: int().notNull(),
	netProfit: int().notNull(),
	paybackPeriod: int().notNull(),
	askingPrice: int().notNull(),
	badges: json().$type<string[]>(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("businessListings_industry_index").on(table.industry),
	index("businessListings_district_index").on(table.district),
]);

export const vendorRegistrations = mysqlTable("vendorRegistrations", {
	id: int().autoincrement().notNull(),
	referenceId: varchar({ length: 32 }).notNull(),
	type: mysqlEnum(['office','business']).notNull(),
	status: mysqlEnum(['pending','approved','rejected']).default('pending').notNull(),
	contactName: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	district: varchar({ length: 100 }).notNull(),
	industry: varchar({ length: 100 }),
	summary: text().notNull(),
	listingJson: json(),
	photoUrls: json().$type<string[]>(),
	locale: varchar({ length: 5 }).default('zh'),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("vendorRegistrations_referenceId_unique").on(table.referenceId),
	index("vendorRegistrations_email_index").on(table.email),
]);

export const locationComparisons = mysqlTable("locationComparisons", {
	id: int().autoincrement().notNull(),
	officeId1: int().notNull(),
	officeId2: int().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	viewCount: int().default(0),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("locationComparisons_officeId1_index").on(table.officeId1),
	index("locationComparisons_officeId2_index").on(table.officeId2),
]);
