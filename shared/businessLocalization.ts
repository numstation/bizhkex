import type { BusinessListing } from "./businessListings";

type Locale = "en" | "zh";

const LISTING_EN: Record<
  number,
  Partial<Pick<BusinessListing, "title" | "description" | "transferReason" | "shopType" | "badges">>
> = {
  1: {
    title: "Mong Kok Premium Coffee Shop with Brand",
    description:
      "Mall coffee shop in a prime Mong Kok location, well-maintained fit-out, ready to operate. Brand established 3+ years with loyal customers. HQ provides supply chain and marketing support. Food factory licence held.",
    transferReason: "Owner unable to manage daily operations due to family and work commitments.",
    shopType: "Mall shop",
    badges: ["Ready to transfer"],
  },
  2: {
    title: "Causeway Bay Tuition Centre with Student List",
    description:
      "Core Causeway Bay tuition centre including active student roster and tutor team. Focus on DSE and English — stable monthly enrolment with reasonable rent ratio.",
    transferReason: "Founder relocating for further study — seeking experienced education operator.",
    shopType: "Commercial building",
    badges: ["Stable cash flow", "Established network"],
  },
  3: {
    title: "Kwun Tong E-commerce Warehouse & Support Team",
    description:
      "Kwun Tong industrial unit e-commerce hub with warehouse, packing, customer service and full SOPs. Beauty and lifestyle products across multiple channels.",
    transferReason: "Owner focusing resources on another brand — divesting this operation.",
    shopType: "Industrial unit",
    badges: ["High growth", "Full SOP"],
  },
  4: {
    title: "Central Beauty Salon with Membership Base",
    description:
      "Premium Central beauty salon with membership clients and professional equipment. Medical-grade skincare focus — high ticket size and repeat rate.",
    transferReason: "Owner retiring — seeking experienced beauty industry operator.",
    shopType: "Commercial building",
    badges: ["Premium clientele", "Stable lease"],
  },
  5: {
    title: "Tsim Sha Tsui Restaurant — Evening Trade Focus",
    description:
      "Ground-floor TST restaurant with strong evening and weekend trade. Full kitchen, liquor licence, renovation completed last year.",
    transferReason: "Owner developing another venture — divesting one of two outlets.",
    shopType: "Ground floor",
    badges: ["Prime location", "Recent renovation"],
  },
  6: {
    title: "Wan Chai IT Support & Maintenance Services",
    description:
      "Wan Chai IT support firm serving SME clients on annual maintenance contracts. Low overheads, stable recurring cash flow.",
    transferReason: "Owner emigrating — seeking full handover of contracts and team.",
    shopType: "Commercial building",
    badges: ["Long-term contracts", "Low OPEX"],
  },
};

const FIELD_EN: Record<string, string> = {
  全職: "Full-time",
  兼職: "Part-time",
  生意轉讓: "Business transfer",
  商場舖: "Mall shop",
  商業大廈: "Commercial building",
  工廈: "Industrial unit",
  地舖: "Ground floor",
};

export function localizeBusinessListing(listing: BusinessListing, locale: Locale): BusinessListing {
  if (locale === "zh") return listing;
  const en = LISTING_EN[listing.id];
  if (!en) {
    return {
      ...listing,
      operationMode: FIELD_EN[listing.operationMode] ?? listing.operationMode,
      transferType: FIELD_EN[listing.transferType] ?? listing.transferType,
      shopType: FIELD_EN[listing.shopType] ?? listing.shopType,
    };
  }
  return {
    ...listing,
    title: en.title ?? listing.title,
    description: en.description ?? listing.description,
    transferReason: en.transferReason ?? listing.transferReason,
    shopType: en.shopType ?? FIELD_EN[listing.shopType] ?? listing.shopType,
    badges: en.badges ?? listing.badges,
    operationMode: FIELD_EN[listing.operationMode] ?? listing.operationMode,
    transferType: FIELD_EN[listing.transferType] ?? listing.transferType,
  };
}
