import { describe, expect, it } from "vitest";
import { DEMO_OFFICES, getDemoPricingByOfficeId, searchDemoOffices } from "../shared/demoOffices";
import { getOfficeInventory, mergeOperatorShowcase, sortPublicOffices } from "../shared/officeInventory";
import { DEMO_BUSINESS_LISTINGS, publicBusinessBadges } from "../shared/businessListings";
import { localizeOffice } from "../shared/officeLocalization";
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

  it("places AIA Kowloon Tower in Kwun Tong, separate from APM", () => {
    const aia = DEMO_OFFICES.find((office) => office.id === 101);
    const apm = DEMO_OFFICES.find((office) => office.id === 102);
    expect(aia?.name).toContain("友邦九龍大樓");
    expect(aia?.name).not.toContain("北角");
    expect(aia?.districtId).toBe(11);
    expect(aia?.address).toContain("100 How Ming Street");
    expect(aia?.address).toContain("Kwun Tong");
    expect(aia?.address).not.toMatch(/Electric Road|North Point/i);
    expect(aia?.description).toContain("巧明街100號");
    expect(aia?.description).not.toContain("電氣道");
    expect(aia?.latitude).toBeCloseTo(22.31252, 4);
    expect(aia?.longitude).toBeCloseTo(114.22237, 4);
    expect(apm?.address).toContain("418 Kwun Tong Road");
    expect(apm?.longitude).toBeGreaterThan((aia?.longitude ?? 0) + 0.002);
    const en = localizeOffice(aia!, "en");
    expect(en.name).toContain("AIA Kowloon Tower");
    expect(en.name).not.toMatch(/North Point/i);
    expect(en.description).toContain("How Ming Street");
    expect(en.description).not.toMatch(/Electric Road/i);
  });

  it("replaces a stale North Point AIA database row with the Kwun Tong showcase", () => {
    const merged = mergeOperatorShowcase(
      [
        {
          id: 101,
          name: "北角 AIA Tower 商務中心",
          address: "AIA Tower, 183 Electric Road, North Point, Hong Kong",
          districtId: 14,
          latitude: 22.2908,
          longitude: 114.2002,
          inventoryKind: "operator",
        },
      ],
      DEMO_OFFICES
    );
    const aiaRows = merged.filter((office) => office.id === 101);
    expect(aiaRows).toHaveLength(1);
    expect(aiaRows[0]?.address).toContain("How Ming Street");
    expect(aiaRows[0]?.districtId).toBe(11);
    expect(String(aiaRows[0]?.address)).not.toMatch(/Electric Road/i);
    expect(merged.some((office) => office.id === 102)).toBe(true);
  });

  it("hides sample rents and labels every demo office that is not operator-run", () => {
    const samples = DEMO_OFFICES.filter((office) => office.inventoryKind !== "operator");
    expect(samples.length).toBeGreaterThan(10);
    for (const office of samples) {
      expect(getOfficeInventory(office).isSample).toBe(true);
      expect(getOfficeInventory(office).priceOnRequest).toBe(true);
      expect(office.description).toContain("示範盤源");
      expect(getDemoPricingByOfficeId(office.id)).toEqual([]);
      expect(localizeOffice(office, "en").description).toContain("Sample listing");
    }
  });

  it("finds the operator APM centre by search and keeps it first", () => {
    const results = searchDemoOffices("APM");
    expect(results[0]?.id).toBe(102);
    expect(results.some((office) => office.id === 11)).toBe(false);
  });
});

describe("business sample trust", () => {
  it("marks every demo transfer as an unverified sample", () => {
    expect(DEMO_BUSINESS_LISTINGS.length).toBeGreaterThan(0);
    for (const listing of DEMO_BUSINESS_LISTINGS) {
      expect(listing.listingKind).toBe("sample");
      expect(listing.financialsVerified).toBe(false);
    }
  });

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
