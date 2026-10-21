export type BusinessListing = {
  id: number;
  title: string;
  industry: string;
  district: string;
  turnover: number;
  netProfit: number;
  paybackPeriod: number;
  askingPrice: number;
  badges: string[];
  createdAt: string;
  imageUrl?: string;
  /** Detail page fields */
  description: string;
  transferReason: string;
  monthlyRent: number;
  areaSqft: number;
  shopType: string;
  operationMode: string;
  transferType: string;
  /** Live rows may show verified-finance badges. Sample rows must not. */
  listingKind?: "sample" | "live";
  financialsVerified?: boolean;
};

/** Listings created within the last N days show a "new" badge (BossIDEA-style). */
export function isNewBusinessListing(createdAt: string, days = 14): boolean {
  const created = new Date(createdAt).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return created >= cutoff;
}

export function formatBusinessCode(id: number): string {
  return `BIZ-${String(id).padStart(3, "0")}`;
}

const VERIFIED_FINANCE_BADGE = /已驗證財報|verified financial|ai-verified|ai 財務|pre-verified/i;

export function isSampleBusinessListing(listing: Pick<BusinessListing, "listingKind" | "financialsVerified">): boolean {
  return listing.listingKind !== "live" && !listing.financialsVerified;
}

/** Trust badges that claim verified financials only render for rows explicitly marked verified. */
export function publicBusinessBadges(listing: Pick<BusinessListing, "badges" | "financialsVerified">): string[] {
  if (listing.financialsVerified) return listing.badges;
  return listing.badges.filter((badge) => !VERIFIED_FINANCE_BADGE.test(badge));
}

export function getMonthlyProfit(listing: BusinessListing): number {
  return Math.round(listing.netProfit / 12);
}

const DEMO_BUSINESS_SEED: BusinessListing[] = [
  {
    id: 1,
    title: "旺角精品咖啡店連品牌",
    industry: "F&B",
    district: "旺角",
    turnover: 1280000,
    netProfit: 320000,
    paybackPeriod: 14,
    askingPrice: 480000,
    badges: ["可即頂讓"],
    listingKind: "sample",
    financialsVerified: false,
    createdAt: "2026-06-01T00:00:00.000Z",
    monthlyRent: 28000,
    areaSqft: 450,
    shopType: "商場舖",
    operationMode: "全職",
    transferType: "生意轉讓",
    description:
      "旺區商場咖啡店，裝修設備保養良好，即頂即做。品牌於區內營運超過3年，熟客穩定，總公司提供食材供應及宣傳支援，持食物製造廠牌照。",
    transferReason: "東主因家庭及工作安排，無暇兼顧日常營運，故出讓業務。",
  },
  {
    id: 2,
    title: "銅鑼灣補習社連學生名單",
    industry: "Education",
    district: "銅鑼灣",
    turnover: 960000,
    netProfit: 410000,
    paybackPeriod: 12,
    askingPrice: 620000,
    badges: ["穩定現金流", "熟客網絡"],
    createdAt: "2026-06-05T00:00:00.000Z",
    monthlyRent: 35000,
    areaSqft: 600,
    shopType: "商業大廈",
    operationMode: "全職",
    transferType: "生意轉讓",
    description:
      "銅鑼灣核心地段補習社，連現有學生名單及導師團隊。課程以 DSE 及英語為主，每月穩定收生，租金佔比合理。",
    transferReason: "創辦人計劃進修及移居，希望交接予有教育經驗的新東主。",
  },
  {
    id: 3,
    title: "觀塘網店倉儲及客服團隊",
    industry: "E-commerce",
    district: "觀塘",
    turnover: 2100000,
    netProfit: 540000,
    paybackPeriod: 18,
    askingPrice: 890000,
    badges: ["高增長", "SOP完整"],
    createdAt: "2026-05-28T00:00:00.000Z",
    monthlyRent: 22000,
    areaSqft: 1200,
    shopType: "工廈",
    operationMode: "全職",
    transferType: "生意轉讓",
    description:
      "觀塘工廈網店營運中心，連倉儲、包裝、客服團隊及完整 SOP。主要銷售美妝及生活百貨，多渠道營運。",
    transferReason: "東主集中資源發展另一品牌，故分拆出售現有業務。",
  },
  {
    id: 4,
    title: "中環美容沙龍連會籍",
    industry: "Beauty",
    district: "中環",
    turnover: 1540000,
    netProfit: 380000,
    paybackPeriod: 16,
    askingPrice: 720000,
    badges: ["高端客群", "租約穩定"],
    createdAt: "2026-03-01T00:00:00.000Z",
    monthlyRent: 42000,
    areaSqft: 520,
    shopType: "商業大廈",
    operationMode: "全職",
    transferType: "生意轉讓",
    description:
      "中環高端美容沙龍，連會籍客戶及專業設備。主力醫美護理及皮膚管理，客單價高，回頭率高。",
    transferReason: "東主退休計劃，希望交接予有美容行業經驗者。",
  },
  {
    id: 5,
    title: "尖沙咀餐廳晚市主力店",
    industry: "F&B",
    district: "尖沙咀",
    turnover: 1850000,
    netProfit: 290000,
    paybackPeriod: 20,
    askingPrice: 550000,
    badges: ["旺區地段", "裝修新淨"],
    createdAt: "2026-03-10T00:00:00.000Z",
    monthlyRent: 48000,
    areaSqft: 750,
    shopType: "地舖",
    operationMode: "全職",
    transferType: "生意轉讓",
    description:
      "尖沙咀旅遊區地舖餐廳，晚市及周末生意強勁。廚房設備齊全，持酒牌，裝修於去年完成。",
    transferReason: "東主另有發展，無法兼顧兩間店舖，故出讓其中一間。",
  },
  {
    id: 6,
    title: "灣仔 IT 支援及維護服務",
    industry: "Services",
    district: "灣仔",
    turnover: 780000,
    netProfit: 260000,
    paybackPeriod: 10,
    askingPrice: 390000,
    badges: ["長約客戶", "低營運成本"],
    createdAt: "2026-03-22T00:00:00.000Z",
    monthlyRent: 12000,
    areaSqft: 280,
    shopType: "商業大廈",
    operationMode: "全職",
    transferType: "生意轉讓",
    description:
      "灣仔商業區 IT 支援公司，主要服務 SME 客戶，以年度維護合約為主。營運成本低，現金流穩定。",
    transferReason: "東主移民，希望將客戶合約及團隊完整交接。",
  },
];

/** Every seeded deal is a layout sample until a row is explicitly marked live and verified. */
export const DEMO_BUSINESS_LISTINGS: BusinessListing[] = DEMO_BUSINESS_SEED.map((listing) => ({
  ...listing,
  listingKind: "sample",
  financialsVerified: false,
}));
