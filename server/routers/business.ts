import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { getTeamInboxEmail } from "@shared/siteContact";
import {
  sendBusinessInquiryConfirmation,
  sendBusinessInquiryToTeam,
} from "../_core/emailService";

export const businessRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          industry: z.string().optional(),
          district: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return db.getBusinessListings(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getBusinessListingById(input.id);
    }),

  submitInquiry: publicProcedure
    .input(
      z.object({
        listingId: z.number(),
        listingTitle: z.string().min(1),
        listingCode: z.string().optional(),
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(6),
        message: z.string().min(5),
        locale: z.enum(["en", "zh"]).default("zh"),
      })
    )
    .mutation(async ({ input }) => {
      const referenceId = `BIZ-INQ-${Date.now().toString(36).toUpperCase()}`;
      console.log("[Business Inquiry]", referenceId, {
        listingId: input.listingId,
        listingTitle: input.listingTitle,
        name: input.name,
        email: input.email,
        phone: input.phone,
      });

      const teamEmail = getTeamInboxEmail();
      void sendBusinessInquiryToTeam({
        referenceId,
        listingId: input.listingId,
        listingTitle: input.listingTitle,
        listingCode: input.listingCode,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        teamEmail,
      }).catch((err) => console.warn("[Business Inquiry] Team email failed:", err));

      void sendBusinessInquiryConfirmation({
        name: input.name,
        email: input.email,
        listingTitle: input.listingTitle,
        referenceId,
      }).catch((err) => console.warn("[Business Inquiry] Buyer email failed:", err));

      return { success: true as const, referenceId };
    }),
});
