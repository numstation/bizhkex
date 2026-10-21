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
  highlights: string[];
  /** Draft only. Never treated as a live public listing. */
  publishStatus: "draft";
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
  /** Draft only. Never treated as a live public listing. */
  publishStatus: "draft";
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
        ? `Draft for review only — not published. ${intake.summary.trim()} Suggested copy for a workspace in ${intake.district}. Prices below are estimates until BizHKEx confirms them.`
        : `僅供審核的草稿，尚未上架。${intake.summary.trim()} 以下為${intake.district}空間的建議文案，租金為估算，須經 BizHKEx 確認後先會公開。`,
      address: isEn ? `${intake.district}, Hong Kong` : `香港${intake.district}`,
      basePrice: price,
      amenities,
      highlights: isEn
        ? ["Draft — not live", "Tenants pay 0%. Centre pays about 5–10% only after a completed deal", "Team review required"]
        : ["草稿，未上架", "租客 0%；成功後只向中心收取約 5–10%", "須經團隊覆核"],
      publishStatus: "draft",
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
      ? `Draft for review only — not published. ${intake.summary.trim()} Figures below are estimates, not verified financials. If a transfer completes, both buyer and seller pay a success commission of about 5–10%.`
      : `僅供審核的草稿，尚未上架。${intake.summary.trim()} 以下數字為估算，並非已核實財報。若頂讓成交，買家同賣家雙方都要付約 5–10% 成功佣金。`,
    transferReason: isEn
      ? "Owner restructuring — seeking qualified buyer for smooth handover."
      : "東主業務重組，希望交接予合適買家。",
    askingPrice: askingBase,
    turnover: Math.round(turnover),
    netProfit,
    monthlyRent,
    paybackPeriod: payback,
    areaSqft: 200 + (seed % 12) * 50,
    badges: [industry],
    publishStatus: "draft",
  };
}
