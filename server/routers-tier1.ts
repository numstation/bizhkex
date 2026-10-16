// Tier 1 Features: Pricing, Photos, and Promotions
// This file contains the new tRPC procedures to add to appRouter

export const tier1Procedures = {
  pricing: {
    getByOffice: `publicProcedure
      .input(z.object({ officeId: z.number() }))
      .query(async ({ input }) => {
        return db.getOfficePricingPackages(input.officeId);
      })`,

    create: `protectedProcedure
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
      })`,

    delete: `protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can delete pricing' });
        }

        return db.deletePricingPackage(input.id);
      })`,
  },

  photos: {
    getByOffice: `publicProcedure
      .input(z.object({ officeId: z.number() }))
      .query(async ({ input }) => {
        return db.getOfficePhotos(input.officeId);
      })`,

    add: `protectedProcedure
      .input(z.object({
        officeId: z.number(),
        photoUrl: z.string().min(1),
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
      })`,

    delete: `protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'provider') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only providers can delete photos' });
        }

        return db.deleteOfficePhoto(input.id);
      })`,
  },

  promotions: {
    update: `protectedProcedure
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
      })`,
  },
};
