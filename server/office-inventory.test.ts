import { describe, expect, it } from "vitest";
import { DEMO_OFFICES, searchDemoOffices } from "../shared/demoOffices";
import { getOfficeInventory, sortPublicOffices } from "../shared/officeInventory";
import { publicBusinessBadges } from "../shared/businessListings";
import { generateVendorListing } from "../shared/vendorListingGenerator";

describe("operator showcase inventory", () => {
  it("places AIA and APM ahead of sample offices, including price sort", () => {
    const sorted = sortPublicOffices(DEMO_OFFICES, "price", "asc");
    expect(sorted[0]?.id).toBe(101);
    expect(sorted[1]?.id).toBe(102);
    expect(getOfficeInventory(sorted[0]).isOperatorOwned).toBe(true);
    expect(sorted.slice(2).every((office) => getOfficeInventory(office).isSample)).toBe(true);
  });

  it("does not keep a sample listing named as the real Kwun Tong APM centre", () => {
    const samples = DEMO_OFFICES.filter((office) => office.inventoryKind !== "operator");
    expect(samples.some((office) => office.name.includes("APM"))).toBe(false);
    const apm = DEMO_OFFICES.find((office) => office.id === 102);
    expect(apm?.name).toContain("APM");
    expect(apm?.awaitingPhotos).toBe(0);
    expect(apm?.priceOnRequest).toBe(1);
    expect(apm?.thumbnailUrl).toBe("/offices/apm/01-reception.jpg");
    expect(apm?.photoUrls).toHaveLength(10);
    expect(apm?.photoUrls?.[0]).toBe(apm?.thumbnailUrl);
    const aia = DEMO_OFFICES.find((office) => office.id === 101);
    expect(aia?.awaitingPhotos).toBe(0);
    expect(aia?.priceOnRequest).toBe(1);
    expect(aia?.thumbnailUrl).toBe("/offices/aia/01-exterior.jpg");
    expect(aia?.photoUrls).toHaveLength(9);
    expect(getOfficeInventory(apm ?? {}).showReviews).toBe(false);
  });

  it("hides fabricated review counts on sample cards", () => {
    const sample = DEMO_OFFICES.find((office) => office.id === 1);
    expect(sample?.reviewCount).toBeGreaterThan(0);
    expect(getOfficeInventory(sample ?? {}).showReviews).toBe(false);
  });

  it("finds the operator APM centre by search and keeps it first", () => {
    const results = searchDemoOffices("APM");
    expect(results[0]?.id).toBe(102);
    expect(results.some((office) => office.id === 11)).toBe(false);
  });
});

describe("business sample trust", () => {
  it("strips verified-finance badges unless the row is explicitly verified", () => {
    expect(
      publicBusinessBadges({
        badges: ["已驗證財報", "可即頂讓"],
        financialsVerified: false,
      })
    ).toEqual(["可即頂讓"]);
    expect(
      publicBusinessBadges({
        badges: ["Verified financials", "Ready to transfer"],
        financialsVerified: true,
      })
    ).toEqual(["Verified financials", "Ready to transfer"]);
  });
});

describe("vendor draft generator", () => {
  it("marks generated previews as unpublished drafts without a fake rating", () => {
    const listing = generateVendorListing({
      type: "office",
      name: "Harbour Test Centre",
      district: "中環",
      summary: "A flexible floor with meeting rooms for a small team.",
      locale: "en",
    });
    expect(listing.publishStatus).toBe("draft");
    expect(listing).not.toHaveProperty("rating");
    expect(listing.description.toLowerCase()).toContain("not published");
  });
});
