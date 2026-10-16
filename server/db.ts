import { eq, and, like, desc, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users,
  offices,
  districts,
  providers,
  inquiries,
  faqs,
  pricingPackages,
  amenities,
  businessListings,
  vendorRegistrations,
} from "../drizzle/schema";
import { providerOpenIdForEmail } from "@shared/providerAuth";
import { DEMO_BUSINESS_LISTINGS, type BusinessListing } from "../shared/businessListings";
import {
  DEMO_DISTRICTS,
  DEMO_OFFICES,
  getDemoOfficeById,
  getDemoPricingByOfficeId,
  paginateDemoOffices,
  searchDemoOffices,
  sortDemoOffices,
} from "../shared/demoOffices";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: any): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: any = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const normalized = email.trim().toLowerCase();
  const result = await db
    .select()
    .from(users)
    .where(sql`LOWER(${users.email}) = ${normalized}`)
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Office queries
export async function getOffices(limit?: number, offset?: number, sortBy?: string, sortOrder?: 'asc' | 'desc') {
  const db = await getDb();
  if (!db) {
    return paginateDemoOffices(sortDemoOffices(DEMO_OFFICES, sortBy, sortOrder), limit, offset);
  }

  try {
    let query: any = db.select().from(offices);

    if (sortBy) {
      const isDesc = sortOrder === 'desc';
      switch (sortBy) {
        case 'price':
          query = isDesc ? query.orderBy(desc(offices.basePrice)) : query.orderBy(offices.basePrice);
          break;
        case 'rating':
          query = query.orderBy(desc(offices.rating));
          break;
        case 'reviews':
          query = query.orderBy(desc(offices.reviewCount));
          break;
        default:
          break;
      }
    }

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.offset(offset);
    }

    const rows = await query;
    if (rows.length === 0) {
      return paginateDemoOffices(sortDemoOffices(DEMO_OFFICES, sortBy, sortOrder), limit, offset);
    }

    return rows;
  } catch (error) {
    console.warn("[Database] Failed to fetch offices, using demo data:", error);
    return paginateDemoOffices(sortDemoOffices(DEMO_OFFICES, sortBy, sortOrder), limit, offset);
  }
}

export async function getOfficeById(id: number) {
  const db = await getDb();
  if (!db) return getDemoOfficeById(id);

  try {
    const result = await db.select().from(offices).where(eq(offices.id, id)).limit(1);
    if (result.length > 0) return result[0];
    return getDemoOfficeById(id);
  } catch (error) {
    console.warn("[Database] Failed to fetch office, using demo data:", error);
    return getDemoOfficeById(id);
  }
}

export async function searchOffices(keyword?: string, districtId?: number, sortBy?: string, sortOrder?: 'asc' | 'desc') {
  const db = await getDb();
  if (!db) return searchDemoOffices(keyword, districtId, sortBy, sortOrder);

  const conditions = [];
  
  if (keyword) {
    conditions.push(
      like(offices.name, `%${keyword}%`)
    );
  }
  
  if (districtId) {
    conditions.push(eq(offices.districtId, districtId));
  }

  let query: any;
  if (conditions.length > 0) {
    query = db.select().from(offices).where(and(...conditions));
  } else {
    query = db.select().from(offices);
  }
  
  // Apply sorting
  if (sortBy) {
    const isDesc = sortOrder === 'desc';
    switch (sortBy) {
      case 'price':
        query = isDesc ? query.orderBy(desc(offices.basePrice)) : query.orderBy(offices.basePrice);
        break;
      case 'rating':
        query = query.orderBy(desc(offices.rating));
        break;
      case 'reviews':
        query = query.orderBy(desc(offices.reviewCount));
        break;
      default:
        break;
    }
  }

  try {
    const rows = await query;
    if (rows.length === 0) {
      return searchDemoOffices(keyword, districtId, sortBy, sortOrder);
    }
    return rows;
  } catch (error) {
    console.warn("[Database] Failed to search offices, using demo data:", error);
    return searchDemoOffices(keyword, districtId, sortBy, sortOrder);
  }
}

export async function getOfficesByDistrict(districtId: number, sortBy?: string, sortOrder?: 'asc' | 'desc') {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(offices).where(eq(offices.districtId, districtId));
  
  // Apply sorting
  if (sortBy) {
    const isDesc = sortOrder === 'desc';
    switch (sortBy) {
      case 'price':
        query = isDesc ? query.orderBy(desc(offices.basePrice)) : query.orderBy(offices.basePrice);
        break;
      case 'rating':
        query = query.orderBy(desc(offices.rating));
        break;
      case 'reviews':
        query = query.orderBy(desc(offices.reviewCount));
        break;
      default:
        break;
    }
  }
  
  return query;
}

export async function getOfficesByProvider(providerId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(offices).where(eq(offices.providerId, providerId));
}

// District queries
export async function getDistricts() {
  const db = await getDb();
  if (!db) return DEMO_DISTRICTS;

  try {
    const rows = await db.select().from(districts);
    return rows.length > 0 ? rows : DEMO_DISTRICTS;
  } catch (error) {
    console.warn("[Database] Failed to fetch districts, using demo data:", error);
    return DEMO_DISTRICTS;
  }
}

export async function getDistrictById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(districts).where(eq(districts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Inquiry queries
export async function createInquiry(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(inquiries).values(data);
  return result;
}

export async function getInquiriesByOffice(officeId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(inquiries).where(eq(inquiries.officeId, officeId));
}

// FAQ queries
export async function getFAQs() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(faqs).orderBy(desc(faqs.displayOrder));
}

// Pricing queries
export async function getPricingByOffice(officeId: number) {
  const db = await getDb();
  if (!db) return getDemoPricingByOfficeId(officeId);

  try {
    const rows = await db.select().from(pricingPackages).where(eq(pricingPackages.officeId, officeId));
    return rows.length > 0 ? rows : getDemoPricingByOfficeId(officeId);
  } catch (error) {
    console.warn("[Database] Failed to fetch pricing, using demo data:", error);
    return getDemoPricingByOfficeId(officeId);
  }
}

// Provider queries
export async function getProviders() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(providers);
}

export async function getProviderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(providers).where(eq(providers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProviderByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const normalized = email.trim().toLowerCase();
  const result = await db
    .select()
    .from(providers)
    .where(sql`LOWER(${providers.email}) = ${normalized}`)
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function linkProviderToUser(email: string, userId: number) {
  const db = await getDb();
  if (!db) return;

  const normalized = email.trim().toLowerCase();
  await db
    .update(providers)
    .set({ userId })
    .where(sql`LOWER(${providers.email}) = ${normalized}`);
}

export async function ensureProviderForVendor(input: {
  email: string;
  name: string;
  phone: string;
  contactName: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await getProviderByEmail(normalizedEmail);
  if (existing) {
    await db
      .update(providers)
      .set({
        name: input.name,
        phone: input.phone || existing.phone,
      })
      .where(eq(providers.id, existing.id));
    return existing;
  }

  const openId = providerOpenIdForEmail(normalizedEmail);
  await upsertUser({
    openId,
    email: normalizedEmail,
    name: input.contactName,
    role: "provider",
    lastSignedIn: new Date(),
  });

  const user = await getUserByOpenId(openId);
  if (!user) {
    throw new Error("Failed to create provider user");
  }

  await db.insert(providers).values({
    userId: user.id,
    name: input.name,
    email: normalizedEmail,
    phone: input.phone,
  });

  return getProviderByEmail(normalizedEmail);
}

export async function createVendorRegistration(input: {
  referenceId: string;
  type: "office" | "business";
  contactName: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  industry?: string;
  summary: string;
  listingJson: unknown;
  photoUrls: string[];
  locale: "en" | "zh";
}) {
  const db = await getDb();
  if (!db) return null;

  const normalizedEmail = input.email.trim().toLowerCase();
  await db.insert(vendorRegistrations).values({
    referenceId: input.referenceId,
    type: input.type,
    status: "pending",
    contactName: input.contactName,
    name: input.name,
    email: normalizedEmail,
    phone: input.phone,
    district: input.district,
    industry: input.industry,
    summary: input.summary,
    listingJson: input.listingJson,
    photoUrls: input.photoUrls,
    locale: input.locale,
  });

  await ensureProviderForVendor({
    email: normalizedEmail,
    name: input.name,
    phone: input.phone,
    contactName: input.contactName,
  });

  return normalizedEmail;
}

export async function getVendorRegistrationByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const normalized = email.trim().toLowerCase();
  const result = await db
    .select()
    .from(vendorRegistrations)
    .where(sql`LOWER(${vendorRegistrations.email}) = ${normalized}`)
    .orderBy(desc(vendorRegistrations.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Additional inquiry queries
export async function getInquiries(limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(inquiries);
  
  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.offset(offset);
  }

  return query;
}

export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateInquiryStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(inquiries).set({ status: status as any }).where(eq(inquiries.id, id));
}

export async function updateInquiry(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const updateData: any = {};
  if (data.status !== undefined) updateData.status = data.status;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.company !== undefined) updateData.company = data.company;
  if (data.message !== undefined) updateData.message = data.message;

  return db.update(inquiries).set(updateData).where(eq(inquiries.id, id));
}

export async function createInquiryResponse(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const { inquiryResponses } = await import('../drizzle/schema');
  const result = await db.insert(inquiryResponses).values({
    inquiryId: data.inquiryId,
    providerId: data.providerId,
    message: data.message,
  });
  return result;
}

export async function getInquiryResponses(inquiryId: number) {
  const db = await getDb();
  if (!db) return [];

  const { inquiryResponses } = await import('../drizzle/schema');
  return db.select().from(inquiryResponses).where(eq(inquiryResponses.inquiryId, inquiryId));
}


// Admin office management functions
export async function createOffice(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(offices).values({
    name: data.name,
    address: data.address,
    districtId: data.districtId,
    providerId: 1, // Default provider for now
    basePrice: data.basePrice.toString(),
    rating: data.rating.toString(),
    reviewCount: data.reviewCount,
    description: data.description,
    amenitiesJson: data.amenities ? JSON.parse(`["${data.amenities.split(',').join('","')}"]`) : null,
    thumbnailUrl: data.thumbnailUrl,
  });
  return result;
}

export async function updateOffice(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const updateData: any = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.districtId !== undefined) updateData.districtId = data.districtId;
  if (data.basePrice !== undefined) updateData.basePrice = data.basePrice.toString();
  if (data.rating !== undefined) updateData.rating = data.rating.toString();
  if (data.reviewCount !== undefined) updateData.reviewCount = data.reviewCount;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.amenities !== undefined) updateData.amenitiesJson = data.amenities ? JSON.parse(`["${data.amenities.split(',').join('","')}"]`) : null;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;

  return db.update(offices).set(updateData).where(eq(offices.id, id));
}

export async function updateOfficeByName(name: string, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const updateData: any = {};

  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;

  return db.update(offices).set(updateData).where(eq(offices.name, name));
}

export async function deleteOffice(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.delete(offices).where(eq(offices.id, id));
}


// Provider portal functions
export async function getProviderOffices(providerId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(offices).where(eq(offices.providerId, providerId));
}

export async function getProviderInquiries(providerId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all inquiries for offices owned by this provider
  const providerOffices = await db.select({ id: offices.id }).from(offices).where(eq(offices.providerId, providerId));
  const officeIds = providerOffices.map(o => o.id);
  
  if (officeIds.length === 0) return [];

  return db.select().from(inquiries).where(
    inArray(inquiries.officeId, officeIds)
  ).orderBy(desc(inquiries.createdAt));
}


export async function getProviderByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(providers).where(eq(providers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}




// Inquiry management functions for providers
export async function getInquiriesByProvider(providerId: number, limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all offices for this provider
  const providerOffices = await db.select({ id: offices.id })
    .from(offices)
    .where(eq(offices.providerId, providerId));

  if (providerOffices.length === 0) return [];

  const officeIds = providerOffices.map(o => o.id);

  let query: any = db.select().from(inquiries)
    .where(inArray(inquiries.officeId, officeIds))
    .orderBy(desc(inquiries.createdAt));

  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.offset(offset);
  }

  return query;
}

export async function getInquiryWithOffice(inquiryId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const inquiry = await db.select().from(inquiries)
    .where(eq(inquiries.id, inquiryId))
    .limit(1);

  if (inquiry.length === 0) return undefined;

  const office = await db.select().from(offices)
    .where(eq(offices.id, inquiry[0].officeId))
    .limit(1);

  return {
    ...inquiry[0],
    office: office.length > 0 ? office[0] : null,
  };
}


// ============ ANALYTICS ============

export async function trackOfficeView(officeId: number, userId?: number, sessionId?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const { officeViews } = await import("../drizzle/schema");
    await db.insert(officeViews).values({
      officeId,
      userId: userId || null,
      sessionId: sessionId || null,
      viewedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Analytics] Error tracking office view:", error);
  }
}

export async function getOfficeAnalytics(officeId: number): Promise<{ views: number; inquiries: number }> {
  const db = await getDb();
  if (!db) return { views: 0, inquiries: 0 };

  try {
    const { officeViews } = await import("../drizzle/schema");
    const { count } = await import("drizzle-orm");

    const viewsResult = await db.select({ count: count() })
      .from(officeViews)
      .where(eq(officeViews.officeId, officeId));

    const inquiriesResult = await db.select({ count: count() })
      .from(inquiries)
      .where(eq(inquiries.officeId, officeId));

    return {
      views: viewsResult[0]?.count || 0,
      inquiries: inquiriesResult[0]?.count || 0,
    };
  } catch (error) {
    console.error("[Analytics] Error getting office analytics:", error);
    return { views: 0, inquiries: 0 };
  }
}

export async function getProviderAnalytics(providerId: number): Promise<Array<{
  officeId: number;
  officeName: string;
  views: number;
  inquiries: number;
}>> {
  const db = await getDb();
  if (!db) return [];

  try {
    const { officeViews } = await import("../drizzle/schema");
    const { count, sql } = await import("drizzle-orm");

    const result = await db.select({
      officeId: offices.id,
      officeName: offices.name,
      views: count(officeViews.id).as("views"),
      inquiries: count(inquiries.id).as("inquiries"),
    })
      .from(offices)
      .leftJoin(officeViews, eq(offices.id, officeViews.officeId))
      .leftJoin(inquiries, eq(offices.id, inquiries.officeId))
      .where(eq(offices.providerId, providerId))
      .groupBy(offices.id, offices.name);

    return result as any;
  } catch (error) {
    console.error("[Analytics] Error getting provider analytics:", error);
    return [];
  }
}


// Get pricing packages for an office
export async function getOfficePricingPackages(officeId: number) {
  const db = await getDb();
  if (!db) return getDemoPricingByOfficeId(officeId);

  try {
    const { pricingPackages } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    const result = await db
      .select()
      .from(pricingPackages)
      .where(eq(pricingPackages.officeId, officeId));

    return result.length > 0 ? result : getDemoPricingByOfficeId(officeId);
  } catch (error) {
    console.warn("[Database] Error getting pricing packages, using demo data:", error);
    return getDemoPricingByOfficeId(officeId);
  }
}

// Create or update pricing package
export async function upsertPricingPackage(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const { pricingPackages } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    if (data.id) {
      // Update existing
      await db
        .update(pricingPackages)
        .set({
          deskType: data.deskType,
          name: data.name,
          description: data.description,
          price: data.price,
          billingCycle: data.billingCycle,
          capacity: data.capacity,
        })
        .where(eq(pricingPackages.id, data.id));
    } else {
      // Create new
      await db.insert(pricingPackages).values({
        officeId: data.officeId,
        deskType: data.deskType,
        name: data.name,
        description: data.description,
        price: data.price,
        billingCycle: data.billingCycle || 'monthly',
        capacity: data.capacity,
      });
    }
  } catch (error) {
    console.error("[Database] Error upserting pricing package:", error);
    throw error;
  }
}

// Delete pricing package
export async function deletePricingPackage(packageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const { pricingPackages } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    await db
      .delete(pricingPackages)
      .where(eq(pricingPackages.id, packageId));
  } catch (error) {
    console.error("[Database] Error deleting pricing package:", error);
    throw error;
  }
}

// Get office photos
export async function getOfficePhotos(officeId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { officePhotos } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    const result = await db
      .select()
      .from(officePhotos)
      .where(eq(officePhotos.officeId, officeId))
      .orderBy(officePhotos.displayOrder);

    return result;
  } catch (error) {
    console.error("[Database] Error getting office photos:", error);
    return [];
  }
}

// Add office photo
export async function addOfficePhoto(officeId: number, photoUrl: string, displayOrder: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const { officePhotos } = await import("../drizzle/schema");

    const result = await db.insert(officePhotos).values({
      officeId,
      photoUrl,
      displayOrder,
    });

    return result;
  } catch (error) {
    console.error("[Database] Error adding office photo:", error);
    throw error;
  }
}

// Delete office photo
export async function deleteOfficePhoto(photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const { officePhotos } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    await db
      .delete(officePhotos)
      .where(eq(officePhotos.id, photoId));
  } catch (error) {
    console.error("[Database] Error deleting office photo:", error);
    throw error;
  }
}

// Update office promotion status
export async function updateOfficePromotion(officeId: number, isPromoted: boolean, discountPercentage: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const { eq } = await import("drizzle-orm");

    await db
      .update(offices)
      .set({
        isPromoted: isPromoted ? 1 : 0,
        discountPercentage: discountPercentage.toString(),
      })
      .where(eq(offices.id, officeId));
  } catch (error) {
    console.error("[Database] Error updating office promotion:", error);
    throw error;
  }
}


// ===== KNOWLEDGE HUB HELPERS =====

// Get all article categories
export async function getArticleCategories() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { articleCategories } = await import("../drizzle/schema");
    const { asc } = await import("drizzle-orm");
    return await db
      .select()
      .from(articleCategories)
      .orderBy(asc(articleCategories.displayOrder));
  } catch (error) {
    console.error("[Database] Error fetching article categories:", error);
    throw error;
  }
}

// Get articles with pagination and filtering
export async function getArticles(categoryId?: number, featured?: boolean, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { articles, articleCategories } = await import("../drizzle/schema");
    const { eq, and, isNotNull, desc } = await import("drizzle-orm");
    
    let conditions: any[] = [isNotNull(articles.publishedAt)];
    
    if (categoryId) {
      conditions.push(eq(articles.categoryId, categoryId));
    }
    
    if (featured) {
      conditions.push(eq(articles.featured, 1));
    }
    
    const query = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        author: articles.author,
        featured: articles.featured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        categoryName: articleCategories.name,
      })
      .from(articles)
      .innerJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .where(and(...conditions))
    
    return await query
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Error fetching articles:", error);
    throw error;
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { articles, articleCategories, articleTagRelations, articleTags } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    const article = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        excerpt: articles.excerpt,
        author: articles.author,
        featured: articles.featured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        categoryName: articleCategories.name,
        categorySlug: articleCategories.slug,
      })
      .from(articles)
      .innerJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .where(eq(articles.slug, slug))
      .limit(1);
    
    if (!article.length) return null;
    
    // Get tags
    const tags = await db
      .select({
        id: articleTags.id,
        name: articleTags.name,
        slug: articleTags.slug,
      })
      .from(articleTagRelations)
      .innerJoin(articleTags, eq(articleTagRelations.tagId, articleTags.id))
      .where(eq(articleTagRelations.articleId, article[0].id));
    
    return { ...article[0], tags };
  } catch (error) {
    console.error("[Database] Error fetching article by slug:", error);
    throw error;
  }
}

// Create article
export async function createArticle(data: {
  title: string;
  slug: string;
  categoryId: number;
  content: string;
  excerpt: string;
  author?: string;
  featured?: boolean;
  publishedAt?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { articles } = await import("../drizzle/schema");
    const result = await db.insert(articles).values({
      title: data.title,
      slug: data.slug,
      categoryId: data.categoryId,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author || 'BizHKEx Team',
      featured: data.featured ? 1 : 0,
      publishedAt: data.publishedAt,
    });
    return result;
  } catch (error) {
    console.error("[Database] Error creating article:", error);
    throw error;
  }
}

// Add tag to article
export async function addTagToArticle(articleId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { articleTagRelations } = await import("../drizzle/schema");
    await db.insert(articleTagRelations).values({
      articleId,
      tagId,
    });
  } catch (error) {
    console.error("[Database] Error adding tag to article:", error);
    throw error;
  }
}

// Get location comparison
export async function getLocationComparison(officeId1: number, officeId2: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { locationComparisons } = await import("../drizzle/schema");
    const { eq, or, and } = await import("drizzle-orm");
    
    const comparison = await db
      .select({
        id: locationComparisons.id,
        officeId1: locationComparisons.officeId1,
        officeId2: locationComparisons.officeId2,
        title: locationComparisons.title,
        description: locationComparisons.description,
        viewCount: locationComparisons.viewCount,
      })
      .from(locationComparisons)
      .where(
        or(
          and(eq(locationComparisons.officeId1, officeId1), eq(locationComparisons.officeId2, officeId2)),
          and(eq(locationComparisons.officeId1, officeId2), eq(locationComparisons.officeId2, officeId1))
        )
      )
      .limit(1);
    
    return comparison.length ? comparison[0] : null;
  } catch (error) {
    console.error("[Database] Error fetching location comparison:", error);
    throw error;
  }
}

// Create location comparison
export async function createLocationComparison(officeId1: number, officeId2: number, title: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { locationComparisons } = await import("../drizzle/schema");
    const result = await db.insert(locationComparisons).values({
      officeId1,
      officeId2,
      title,
      description,
    });
    return result;
  } catch (error) {
    console.error("[Database] Error creating location comparison:", error);
    throw error;
  }
}

// Increment location comparison view count
export async function incrementComparisonViewCount(comparisonId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { locationComparisons } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const { sql } = await import("drizzle-orm");
    await db
      .update(locationComparisons)
      .set({
        viewCount: sql`${locationComparisons.viewCount} + 1`,
      })
      .where(eq(locationComparisons.id, comparisonId));
  } catch (error) {
    console.error("[Database] Error incrementing view count:", error);
    throw error;
  }
}

function normalizeBusinessListing(row: typeof businessListings.$inferSelect): BusinessListing {
  const demo = DEMO_BUSINESS_LISTINGS.find((d) => d.id === row.id);
  return {
    id: row.id,
    title: row.title,
    industry: row.industry,
    district: row.district,
    turnover: row.turnover,
    netProfit: row.netProfit,
    paybackPeriod: row.paybackPeriod,
    askingPrice: row.askingPrice,
    badges: Array.isArray(row.badges) ? row.badges : [],
    createdAt: row.createdAt,
    description: demo?.description ?? "詳情請透過 WhatsApp 查詢。",
    transferReason: demo?.transferReason ?? "東主因個人規劃出讓業務。",
    monthlyRent: demo?.monthlyRent ?? Math.round(row.askingPrice * 0.04),
    areaSqft: demo?.areaSqft ?? 400,
    shopType: demo?.shopType ?? "商業大廈",
    operationMode: demo?.operationMode ?? "全職",
    transferType: demo?.transferType ?? "生意轉讓",
    imageUrl: demo?.imageUrl,
  };
}

export async function getBusinessListings(filters?: {
  industry?: string;
  district?: string;
}): Promise<BusinessListing[]> {
  const db = await getDb();
  if (!db) {
    return filterDemoBusinessListings(filters);
  }

  try {
    const conditions = [];
    if (filters?.industry) {
      conditions.push(eq(businessListings.industry, filters.industry));
    }
    if (filters?.district) {
      conditions.push(eq(businessListings.district, filters.district));
    }

    let query = db.select().from(businessListings).orderBy(desc(businessListings.createdAt));
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const rows = await query;
    if (rows.length === 0) {
      return filterDemoBusinessListings(filters);
    }

    return rows.map(normalizeBusinessListing);
  } catch (error) {
    console.warn("[Database] Failed to fetch business listings, using demo data:", error);
    return filterDemoBusinessListings(filters);
  }
}

export async function getBusinessListingById(id: number): Promise<BusinessListing | null> {
  const db = await getDb();
  if (!db) {
    return DEMO_BUSINESS_LISTINGS.find((listing) => listing.id === id) ?? null;
  }

  try {
    const rows = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, id))
      .limit(1);

    if (rows.length === 0) {
      return DEMO_BUSINESS_LISTINGS.find((listing) => listing.id === id) ?? null;
    }

    return normalizeBusinessListing(rows[0]);
  } catch (error) {
    console.warn("[Database] Failed to fetch business listing:", error);
    return DEMO_BUSINESS_LISTINGS.find((listing) => listing.id === id) ?? null;
  }
}

function filterDemoBusinessListings(filters?: {
  industry?: string;
  district?: string;
}): BusinessListing[] {
  return DEMO_BUSINESS_LISTINGS.filter((listing) => {
    const matchesIndustry = !filters?.industry || listing.industry === filters.industry;
    const matchesDistrict = !filters?.district || listing.district === filters.district;
    return matchesIndustry && matchesDistrict;
  });
}
