export type InventoryKind = "operator" | "partner" | "sample";

export type OfficeInventoryFields = {
  id?: number;
  name?: string | null;
  inventoryKind?: InventoryKind | null;
  isFeatured?: number | boolean | null;
  isVerified?: number | boolean | null;
  awaitingPhotos?: number | boolean | null;
  priceOnRequest?: number | boolean | null;
  featuredOrder?: number | null;
  reviewCount?: number | string | null;
  rating?: number | string | null;
  basePrice?: number | string | null;
};

function flag(value: number | boolean | string | null | undefined): boolean {
  return value === true || value === 1 || value === "1";
}

export function getOfficeInventory(office: OfficeInventoryFields) {
  const kind: InventoryKind =
    office.inventoryKind === "operator" || office.inventoryKind === "partner"
      ? office.inventoryKind
      : "sample";
  const isOperatorOwned = kind === "operator";
  const isFeatured = flag(office.isFeatured) || isOperatorOwned;
  const reviewCount = Number(office.reviewCount ?? 0);
  return {
    inventoryKind: kind,
    isOperatorOwned,
    isFeatured,
    isPartner: kind === "partner",
    isSample: kind === "sample",
    isVerified: flag(office.isVerified) || isOperatorOwned,
    awaitingPhotos: flag(office.awaitingPhotos),
    priceOnRequest: flag(office.priceOnRequest),
    showReviews: kind !== "sample" && reviewCount > 0,
    featuredOrder: office.featuredOrder ?? (isFeatured ? 0 : 100),
  };
}

function tier(office: OfficeInventoryFields): number {
  const meta = getOfficeInventory(office);
  if (meta.isFeatured || meta.isOperatorOwned) return 0;
  if (meta.isPartner) return 1;
  return 2;
}

export function comparePublicOffices<T extends OfficeInventoryFields>(
  a: T,
  b: T,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
): number {
  const tierDiff = tier(a) - tier(b);
  if (tierDiff !== 0) return tierDiff;

  if (tier(a) === 0) {
    return getOfficeInventory(a).featuredOrder - getOfficeInventory(b).featuredOrder;
  }

  const desc = sortOrder === "desc";
  if (sortBy === "price") {
    const diff = Number(a.basePrice ?? 0) - Number(b.basePrice ?? 0);
    return desc ? -diff : diff;
  }
  if (sortBy === "rating") {
    const ar = getOfficeInventory(a).showReviews ? Number(a.rating ?? 0) : 0;
    const br = getOfficeInventory(b).showReviews ? Number(b.rating ?? 0) : 0;
    return br - ar;
  }
  if (sortBy === "reviews") {
    const ar = getOfficeInventory(a).showReviews ? Number(a.reviewCount ?? 0) : 0;
    const br = getOfficeInventory(b).showReviews ? Number(b.reviewCount ?? 0) : 0;
    return br - ar;
  }
  return 0;
}

export function sortPublicOffices<T extends OfficeInventoryFields>(
  offices: T[],
  sortBy?: string,
  sortOrder?: "asc" | "desc"
): T[] {
  return [...offices].sort((a, b) => comparePublicOffices(a, b, sortBy, sortOrder));
}

/** Keep operator showcase rows on public lists even when the database only has sample seed rows. */
export function mergeOperatorShowcase(rows: any[], showcase: any[]): any[] {
  const featured = showcase.filter((office) => office.inventoryKind === "operator");
  const ids = new Set(rows.map((row) => row.id));
  const names = new Set(rows.map((row) => row.name));
  const missing = featured.filter((office) => !ids.has(office.id) && !names.has(office.name));
  return [...missing, ...rows];
}
