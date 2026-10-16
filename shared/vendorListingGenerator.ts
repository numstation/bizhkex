export type VendorListingType = "office" | "business";

export type VendorIntake = {
  type: VendorListingType;
  name: string;
  district: string;
  industry?: string;
  summary: string;
  referenceUrl?: string;
  locale: "en" | "zh";
};

export type GeneratedOfficeListing = {
  type: "office";
  title: string;
  description: string;
  address: string;
  basePrice: number;
  amenities: string[];
  rating: number;
  highlights: string[];
};

export type GeneratedBusinessListing = {
  type: "business";
  title: string;
  description: string;
  transferReason: string;
  askingPrice: number;
  turnover: number;
  netProfit: number;
  monthlyRent: number;
  paybackPeriod: number;
  areaSqft: number;
  badges: string[];
};

export type GeneratedListing = GeneratedOfficeListing | GeneratedBusinessListing;

const DISTRICT_PRICE: Record<string, number> = {
  central: 4500,
  admiralty: 4200,
  wanchai: 3800,
  causeway: 4000,
  tst: 3600,
  mongkok: 3200,
  kwuntong: 2800,
  shaatin: 2400,
  tsuenwan: 2600,
  中環: 4500,
  金鐘: 4200,
  灣仔: 3800,
  銅鑼灣: 4000,
  尖沙咀: 3600,
  旺角: 3200,
  觀塘: 2800,
  九龍灣: 2800,
  沙田: 2400,
  荃灣: 2600,
};

const AMENITY_POOL_ZH = [
  "高速 WiFi",
  "會議室",
  "接待服務",
  "24小時門禁",
  "打印服務",
  "茶水間",
];
const AMENITY_POOL_EN = [
  "High-speed WiFi",
  "Meeting rooms",
  "Reception",
  "24/7 access",
  "Printing",
  "Pantry",
];

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function pickPrice(district: string, seed: number): number {
  const key = Object.keys(DISTRICT_PRICE).find(
    (k) => district.toLowerCase().includes(k.toLowerCase()) || k.includes(district)
  );
  const base = key ? DISTRICT_PRICE[key] : 3200;
  return base + (seed % 8) * 150;
}

export function generateVendorListing(intake: VendorIntake): GeneratedListing {
  const seed = hashSeed(`${intake.name}-${intake.district}-${intake.summary}`);
  const isEn = intake.locale === "en";

  if (intake.type === "office") {
    const price = pickPrice(intake.district, seed);
    const amenities = (isEn ? AMENITY_POOL_EN : AMENITY_POOL_ZH).slice(0, 4 + (seed % 3));
    return {
      type: "office",
      title: isEn
        ? `${intake.name} — Flexible Workspace, ${intake.district}`
        : `${intake.name} — ${intake.district}靈活商務空間`,
      description: isEn
        ? `AI-enriched profile: ${intake.summary.trim()} Premium serviced workspace in ${intake.district} with flexible terms, utilities included and move-in ready setup.`
        : `AI 智能整理：${intake.summary.trim()} 位於${intake.district}的優質商務空間，彈性租約、包水電及即租即用配套。`,
      address: isEn ? `${intake.district}, Hong Kong` : `香港${intake.district}`,
      basePrice: price,
      amenities,
      rating: 4.2 + (seed % 8) / 10,
      highlights: isEn
        ? ["Zero commission listing", "AI-optimised pricing band", "Inquiry routing enabled"]
        : ["0% 佣金刊登", "AI 定價區間建議", "詢盤自動分流"],
    };
  }

  const industry = intake.industry ?? "Services";
  const askingBase = 200000 + (seed % 60) * 10000;
  const turnover = askingBase * (2.2 + (seed % 5) / 10);
  const netProfit = Math.round(turnover * (0.22 + (seed % 8) / 100));
  const monthlyRent = Math.round(askingBase * 0.045);
  const payback = Math.max(8, Math.round(askingBase / (netProfit / 12)));

  return {
    type: "business",
    title: isEn
      ? `${intake.name} — ${industry} Transfer, ${intake.district}`
      : `${intake.name} — ${intake.district}${industry}頂讓`,
    description: isEn
      ? `AI-enriched transfer brief: ${intake.summary.trim()} Curated ${industry.toLowerCase()} opportunity in ${intake.district} with pre-verified financial snapshot.`
      : `AI 智能整理：${intake.summary.trim()} ${intake.district}${industry}頂讓項目，附財務摘要及回本期估算。`,
    transferReason: isEn
      ? "Owner restructuring — seeking qualified buyer for smooth handover."
      : "東主業務重組，希望交接予合適買家。",
    askingPrice: askingBase,
    turnover: Math.round(turnover),
    netProfit,
    monthlyRent,
    paybackPeriod: payback,
    areaSqft: 200 + (seed % 12) * 50,
    badges: isEn
      ? ["AI-verified snapshot", "Ready for inquiry", industry]
      : ["AI 財務快照", "可即查詢", industry],
  };
}
