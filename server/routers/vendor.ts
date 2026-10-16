import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { generateVendorListing } from "@shared/vendorListingGenerator";
import { getTeamInboxEmail } from "@shared/siteContact";
import {
  sendVendorRegistrationConfirmation,
  sendVendorRegistrationToTeam,
} from "../_core/emailService";
import * as db from "../db";
import { storagePut } from "../storage";
import { ENV } from "../_core/env";

/** Fallback when DATABASE_URL is not configured (local dev). */
const devRegisteredEmails = new Set<string>();

export function isDevRegisteredVendorEmail(email: string): boolean {
  return devRegisteredEmails.has(email.trim().toLowerCase());
}

function parseImageBase64(dataBase64: string): { buffer: Buffer; contentType: string } {
  const match = dataBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { contentType: match[1], buffer: Buffer.from(match[2], "base64") };
  }
  return { contentType: "image/jpeg", buffer: Buffer.from(dataBase64, "base64") };
}

async function uploadVendorPhoto(fileName: string, dataBase64: string): Promise<string> {
  const { buffer, contentType } = parseImageBase64(dataBase64);
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const key = `vendor-uploads/${Date.now()}-${safeName}`;

  if (ENV.forgeApiUrl && ENV.forgeApiKey) {
    const { url } = await storagePut(key, buffer, contentType);
    return url;
  }

  // Dev fallback when storage is not configured
  if (dataBase64.startsWith("data:")) return dataBase64;
  return `data:${contentType};base64,${dataBase64}`;
}

export const vendorRouter = router({
  preview: publicProcedure
    .input(
      z.object({
        type: z.enum(["office", "business"]),
        name: z.string().min(2),
        district: z.string().min(1),
        industry: z.string().optional(),
        summary: z.string().min(10),
        referenceUrl: z.string().optional(),
        locale: z.enum(["en", "zh"]).default("zh"),
      })
    )
    .mutation(({ input }) => {
      const listing = generateVendorListing({
        type: input.type,
        name: input.name,
        district: input.district,
        industry: input.industry,
        summary: input.summary,
        referenceUrl: input.referenceUrl,
        locale: input.locale,
      });
      return { listing };
    }),

  uploadPhoto: publicProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(120),
        dataBase64: z.string().min(100),
      })
    )
    .mutation(async ({ input }) => {
      const url = await uploadVendorPhoto(input.fileName, input.dataBase64);
      return { url };
    }),

  submit: publicProcedure
    .input(
      z.object({
        type: z.enum(["office", "business"]),
        contactName: z.string().min(1),
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(6),
        district: z.string().min(1),
        industry: z.string().optional(),
        summary: z.string().min(10),
        referenceUrl: z.string().optional(),
        photoUrls: z.array(z.string().min(1)).max(6).optional(),
        locale: z.enum(["en", "zh"]).default("zh"),
      })
    )
    .mutation(async ({ input }) => {
      const listing = generateVendorListing({
        type: input.type,
        name: input.name,
        district: input.district,
        industry: input.industry,
        summary: input.summary,
        referenceUrl: input.referenceUrl,
        locale: input.locale,
      });
      const referenceId = `VND-${Date.now().toString(36).toUpperCase()}`;
      const photoUrls = input.photoUrls ?? [];

      console.log("[Vendor] New registration:", referenceId, input.type, input.name, input.email);

      const normalizedEmail = input.email.trim().toLowerCase();
      try {
        const saved = await db.createVendorRegistration({
          referenceId,
          type: input.type,
          contactName: input.contactName,
          name: input.name,
          email: normalizedEmail,
          phone: input.phone,
          district: input.district,
          industry: input.industry,
          summary: input.summary,
          listingJson: listing,
          photoUrls,
          locale: input.locale,
        });
        if (!saved) {
          devRegisteredEmails.add(normalizedEmail);
          console.warn("[Vendor] Database unavailable — stored email in dev registry:", normalizedEmail);
        }
      } catch (err) {
        devRegisteredEmails.add(normalizedEmail);
        console.warn("[Vendor] Failed to persist registration:", err);
      }

      void sendVendorRegistrationConfirmation({
        contactName: input.contactName,
        email: input.email,
        name: input.name,
        referenceId,
        locale: input.locale,
      }).catch((err) => console.warn("[Vendor] Confirmation email failed:", err));

      void sendVendorRegistrationToTeam({
        referenceId,
        type: input.type,
        contactName: input.contactName,
        name: input.name,
        email: input.email,
        phone: input.phone,
        district: input.district,
        industry: input.industry,
        summary: input.summary,
        photoUrls,
        teamEmail: getTeamInboxEmail(),
      }).catch((err) => console.warn("[Vendor] Team email failed:", err));

      return { success: true as const, referenceId, listing, photoUrls };
    }),
});
