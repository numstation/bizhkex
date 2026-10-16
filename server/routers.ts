import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { sendNewInquiryEmail } from "./_core/emailService";
import { createNotification, getNotificationPreferences } from "./_core/notificationService";
import { knowledgeRouter } from "./routers/knowledge";
import { businessRouter } from "./routers/business";
import { vendorRouter } from "./routers/vendor";
import { requestProviderLoginLink } from "./_core/providerAuth";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    requestProviderLogin: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const origin = `${ctx.req.protocol}://${ctx.req.get("host")}`;
        try {
          const result = await requestProviderLoginLink(input.email, origin);
          return {
            success: true as const,
            sent: result.sent,
            devLoginUrl: result.devLoginUrl,
          };
        } catch (error) {
          if (error instanceof Error && error.message === "EMAIL_NOT_REGISTERED") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "This email is not registered yet. Please complete vendor registration first.",
            });
          }
          if (error instanceof Error && error.message === "REGISTRATION_PENDING") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "REGISTRATION_PENDING",
            });
          }
          throw error;
        }
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ OFFICES ============
  offices: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        sortBy: z.enum(['price', 'rating', 'reviews']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
      }))
      .query(async ({ input }) => {
        return db.getOffices(input.limit, input.offset, input.sortBy, input.sortOrder);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const office = await db.getOfficeById(input.id);
        if (!office) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Office not found" });
        }
        const pricing = await db.getPricingByOffice(input.id);
        return { ...office, pricing };
      }),

    search: publicProcedure
      .input(z.object({
        keyword: z.string().optional(),
        districtId: z.number().optional(),
        sortBy: z.enum(['price', 'rating', 'reviews']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
      }))
      .query(async ({ input }) => {
        return db.searchOffices(input.keyword, input.districtId, input.sortBy, input.sortOrder);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        districtId: z.number(),
        basePrice: z.number(),
        rating: z.number().optional(),
        reviewCount: z.number().optional(),
        description: z.string().optional(),
        amenities: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createOffice(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        address: z.string().optional(),
        districtId: z.number().optional(),
        basePrice: z.number().optional(),
        rating: z.number().optional(),
        reviewCount: z.number().optional(),
        description: z.string().optional(),
        amenities: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateOffice(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteOffice(input.id);
      }),

    trackView: publicProcedure
      .input(z.object({ officeId: z.number() }))
      .mutation(async ({ input }) => {
        return db.trackOfficeView(input.officeId);
      }),
  }),

  // ============ DISTRICTS ============
  districts: router({
    list: publicProcedure
      .query(async () => {
        return db.getDistricts();
      }),

    byRegion: publicProcedure
      .input(z.object({ region: z.string() }))
      .query(async ({ input }) => {
        return db.getDistricts().then(dists => dists.filter((d: any) => d.region === input.region));
      }),
  }),

  // ============ INQUIRIES ============
  inquiries: router({
    create: publicProcedure
      .input(z.object({
        officeId: z.number(),
        name: z.string().min(1),
        email: z.string().min(1).email('Invalid email format'),
        phone: z.string().optional(),
        company: z.string().optional(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const inquiry = await db.createInquiry({
          ...input,
          userId: ctx.user?.id,
        });

        // Send notifications to provider
        try {
          const office = await db.getOfficeById(input.officeId);
          if (office) {
            const provider = await db.getProviderById(office.providerId);
            if (provider && provider.userId) {
              const prefs = await getNotificationPreferences(provider.userId);
              const shouldNotify = !prefs || (prefs.notifyOnNewInquiry === 1);

              if (shouldNotify && (!prefs || prefs.emailNotifications === 1)) {
                await sendNewInquiryEmail(
                  provider.email,
                  provider.name,
                  office.name,
                  input.name,
                  input.email,
                  input.message,
                  `/provider-dashboard`
                );
              }

              if (shouldNotify && inquiry && typeof inquiry === 'object' && 'id' in inquiry) {
                await createNotification({
                  userId: provider.userId,
                  inquiryId: (inquiry as any).id,
                  title: `New Inquiry for ${office.name}`,
                  content: `${input.name} is interested in your office space.`,
                  type: "inquiry",
                });
              }
            }
          }
        } catch (error) {
          console.error("Error sending notifications:", error);
        }

        return inquiry;
      }),

    list: adminProcedure
      .input(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.getInquiries(input.limit, input.offset);
      }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const inquiry = await db.getInquiryById(input.id);
        if (!inquiry) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Inquiry not found" });
        }
        return inquiry;
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "resolved", "archived"]),
      }))
      .mutation(async ({ input }) => {
        return db.updateInquiryStatus(input.id, input.status);
      }),
  }),

  // ============ FAQs ============
  faqs: router({
    list: publicProcedure
      .query(async () => {
        return db.getFAQs();
      }),
  }),

  // ============ PROVIDERS ============
  providers: router({
    list: publicProcedure
      .query(async () => {
        return db.getProviders();
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const provider = await db.getProviderById(input.id);
        if (!provider) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Provider not found" });
        }
        return provider;
      }),

    // Provider portal procedures
    myOffices: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.getProviderOffices(ctx.user.id);
      }),

    myInquiries: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.getProviderInquiries(ctx.user.id);
      }),

    updateInquiryStatus: protectedProcedure
      .input(z.object({
        inquiryId: z.number(),
        status: z.enum(["new", "contacted", "resolved", "archived"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.updateInquiryStatus(input.inquiryId, input.status);
      }),
  }),

  // Provider Dashboard Router
  provider: router({
    getProviderInfo: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.getProviderByUserId(ctx.user.id);
      }),

    getListings: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.getProviderOffices(ctx.user.id);
      }),

    getAnalytics: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Provider not found" });
        }
        // Return per-listing analytics for the listings view
        return await db.getProviderAnalytics(provider.id);
      }),

    getAnalyticsSummary: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Provider not found" });
        }
        const analytics = await db.getProviderAnalytics(provider.id);
        
        // Calculate totals for overview
        const totalViews = analytics.reduce((sum, a) => sum + (a.views || 0), 0);
        const totalInquiries = analytics.reduce((sum, a) => sum + (a.inquiries || 0), 0);
        const conversionRate = totalInquiries > 0 ? Math.round((totalInquiries / totalViews) * 100 * 100) / 100 : 0;
        
        return {
          totalListings: analytics.length,
          totalInquiries,
          contactedInquiries: 0,
          conversionRate,
          monthlyViews: totalViews,
          monthlyClicks: 0,
        };
      }),

    getInquiries: protectedProcedure
      .input(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Provider not found" });
        }
        return db.getInquiriesByProvider(provider.id, input.limit, input.offset);
      }),

    getInquiryDetail: protectedProcedure
      .input(z.object({ inquiryId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        const inquiry = await db.getInquiryWithOffice(input.inquiryId);
        if (!inquiry) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Inquiry not found" });
        }
        // Verify provider owns this inquiry's office
        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider || inquiry.office?.providerId !== provider.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have access to this inquiry" });
        }
        return inquiry;
      }),

    deleteListing: protectedProcedure
      .input(z.object({ officeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.deleteOffice(input.officeId);
      }),

    updateInquiryStatus: protectedProcedure
      .input(z.object({
        inquiryId: z.number(),
        status: z.enum(["new", "contacted", "resolved", "archived"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can access this" });
        }
        return db.updateInquiryStatus(input.inquiryId, input.status);
      }),

    createListing: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        districtId: z.number(),
        description: z.string().min(1),
        basePrice: z.number().positive(),
        thumbnailUrl: z.string().optional(),
        amenities: z.array(z.string()),
        pricingPackages: z.array(z.object({
          name: z.string(),
          duration: z.string(),
          price: z.number().positive(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can create listings' });
        }

        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
        }

        if (await db.isVendorPublishBlocked(provider.email)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'REGISTRATION_PENDING',
          });
        }

        try {
          const office = await db.createOffice({
            name: input.name,
            address: input.address,
            districtId: input.districtId,
            description: input.description,
            basePrice: input.basePrice,
            thumbnailUrl: input.thumbnailUrl || '',
            providerId: provider.id,
            rating: 0,
            reviewCount: 0,
            inventoryKind: 'partner',
          });

          return office;
        } catch (error) {
          console.error('Error creating listing:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create listing' });
        }
      }),

    updateListing: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        districtId: z.number().optional(),
        description: z.string().optional(),
        basePrice: z.number().positive().optional(),
        thumbnailUrl: z.string().optional(),
        amenities: z.array(z.string()).optional(),
        rating: z.number().optional(),
        reviewCount: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can update listings' });
        }

        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
        }

        // Verify ownership
        const office = await db.getOfficeById(input.id);
        if (!office || office.providerId !== provider.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own listings' });
        }

        try {
          const updatedOffice = await db.updateOffice(input.id, {
            name: input.name,
            address: input.address,
            districtId: input.districtId,
            description: input.description,
            basePrice: input.basePrice,
            thumbnailUrl: input.thumbnailUrl,
            rating: input.rating,
            reviewCount: input.reviewCount,
          });

          return updatedOffice;
        } catch (error) {
          console.error('Error updating listing:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update listing' });
        }
      }),

    respondToInquiry: protectedProcedure
      .input(z.object({
        inquiryId: z.number(),
        message: z.string().min(1).max(5000),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can respond to inquiries' });
        }

        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
        }

        try {
          // Get inquiry details
          const inquiry = await db.getInquiryById(input.inquiryId);
          if (!inquiry) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Inquiry not found' });
          }

          // Verify provider owns the office
          const office = await db.getOfficeById(inquiry.officeId);
          if (!office || office.providerId !== provider.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only respond to inquiries for your own offices' });
          }

          // Create response
          const response = await db.createInquiryResponse({
            inquiryId: input.inquiryId,
            providerId: provider.id,
            message: input.message,
          });

          // Send email notification to inquirer
          const { sendInquiryStatusUpdateEmail } = await import('./_core/emailService');
          await sendInquiryStatusUpdateEmail(
            inquiry.email,
            inquiry.name,
            office.name,
            'contacted',
            input.message
          );

          // Update inquiry status to contacted
          await db.updateInquiry(input.inquiryId, { status: 'contacted' });

          return response;
        } catch (error) {
          console.error('Error responding to inquiry:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to respond to inquiry' });
        }
      }),
  }),

  // ============ ADMIN PHOTO MANAGEMENT ============
  admin: router({
    updateOfficePhotos: adminProcedure
      .input(z.object({
        updates: z.array(z.object({
          officeId: z.number(),
          photoUrl: z.string(),
        }))
      }))
      .mutation(async ({ input }) => {
        const results = [];
        for (const update of input.updates) {
          const result = await db.updateOffice(update.officeId, {
            thumbnailUrl: update.photoUrl,
          });
          results.push(result);
        }
        return { success: true, updated: results.length };
      }),

    bulkUpdatePhotos: adminProcedure
      .input(z.object({
        photoMappings: z.record(z.string(), z.string())
      }))
      .mutation(async ({ input }) => {
        const results = [];
        for (const [officeName, photoUrl] of Object.entries(input.photoMappings)) {
          try {
            const result = await db.updateOfficeByName(officeName, { thumbnailUrl: photoUrl });
            if (result) results.push({ officeName, success: true });
          } catch (error) {
            results.push({ officeName, success: false, error: String(error) });
          }
        }
        return { success: true, results };
      }),
  }),

  pricing: router({
    getByOffice: publicProcedure
      .input(z.object({ officeId: z.number() }))
      .query(async ({ input }) => {
        return db.getOfficePricingPackages(input.officeId);
      }),

    create: protectedProcedure
      .input(z.object({
        officeId: z.number(),
        deskType: z.enum(['private_office', 'dedicated_desk', 'hot_desk', 'virtual_office']),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        billingCycle: z.enum(['monthly', 'quarterly', 'annual']).optional(),
        capacity: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can create pricing' });
        }

        const office = await db.getOfficeById(input.officeId);
        if (!office) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Office not found' });
        }

        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider || office.providerId !== provider.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only add pricing to your own offices' });
        }

        return db.upsertPricingPackage(input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can delete pricing' });
        }

        return db.deletePricingPackage(input.id);
      }),
  }),

  photos: router({
    getByOffice: publicProcedure
      .input(z.object({ officeId: z.number() }))
      .query(async ({ input }) => {
        return db.getOfficePhotos(input.officeId);
      }),

    add: protectedProcedure
      .input(z.object({
        officeId: z.number(),
        photoUrl: z.string().url(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can add photos' });
        }

        const office = await db.getOfficeById(input.officeId);
        if (!office) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Office not found' });
        }

        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider || office.providerId !== provider.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only add photos to your own offices' });
        }

        return db.addOfficePhoto(input.officeId, input.photoUrl, input.displayOrder || 0);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can delete photos' });
        }

        return db.deleteOfficePhoto(input.id);
      }),
  }),

  promotions: router({
    update: protectedProcedure
      .input(z.object({
        officeId: z.number(),
        isPromoted: z.boolean(),
        discountPercentage: z.number().min(0).max(100).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can update promotions' });
        }

        const office = await db.getOfficeById(input.officeId);
        if (!office) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Office not found' });
        }

        const provider = await db.getProviderByUserId(ctx.user.id);
        if (!provider || office.providerId !== provider.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only update your own offices' });
        }

        return db.updateOfficePromotion(input.officeId, input.isPromoted, input.discountPercentage || 0);
      }),
  }),
  
  // ============ KNOWLEDGE HUB ============
  knowledge: knowledgeRouter,

  // ============ BUSINESS MARKETPLACE ============
  business: businessRouter,
  vendor: vendorRouter,
});

export type AppRouter = typeof appRouter;
