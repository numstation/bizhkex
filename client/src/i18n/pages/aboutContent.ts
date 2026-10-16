import type { Locale } from "../types";

type AboutContent = {
  title: string;
  intro: string;
  missionTitle: string;
  missionP1: string;
  missionP2: string;
  valuesTitle: string;
  values: Array<{ title: string; description: string }>;
  whyTitle: string;
  whyItems: string[];
  teamTitle: string;
  teamP1: string;
  teamP2: string;
  contactTitle: string;
  contactSubtitle: string;
  ctaTitle: string;
  ctaBrowse: string;
  ctaProvider: string;
};

const CONTENT: Record<Locale, AboutContent> = {
  zh: {
    title: "關於 BizHKEx",
    intro:
      "BizHKEx 配對香港商務中心同生意轉讓。租客 0% 佣金；中心營運商成功配對佣金 5–10%。我哋優先展示自家營運中心，並招募更多合作中心。",
    missionTitle: "我們的使命",
    missionP1: "革新香港商務中心行業，提供透明、高效、用戶友好嘅平台，連結企業同靈活辦公空間。",
    missionP2: "我們賦能商務中心業主展示優質盤源，同時幫助企業以最低成本搵到理想工作環境。",
    valuesTitle: "核心價值",
    values: [
      { title: "以客為本", description: "我們專注連結商務中心業主同尋找辦公空間嘅企業，建立互信共贏嘅生態圈。" },
      { title: "國際標準", description: "以國際級服務質素為標準，確保每一個盤源同每一次配對都透明可靠。" },
      { title: "追求卓越", description: "從搜尋到成交，我們致力提供流暢、專業、零佣金嘅配對體驗。" },
    ],
    whyTitle: "點解揀 BizHKEx？",
    whyItems: [
      "精選全港優質商務中心，覆蓋中環、灣仔、尖沙咀、觀塘等主要商業區",
      "透明定價，完整盤源資訊，無隱藏費用",
      "專人跟進，為租客同業主提供雙向支援",
      "智能搜尋同篩選，快速配對最適合方案",
      "安全可靠嘅詢盤同預約流程",
      "0% 租客佣金，彈性合約條款",
    ],
    teamTitle: "我們的團隊",
    teamP1: "BizHKEx 由具備地產、科技同客戶服務深厚經驗嘅專業團隊打造，致力改變香港企業搵辦公室嘅方式。",
    teamP2: "我們持續優化平台，為用戶提供卓越支援同更優質嘅配對體驗。",
    contactTitle: "聯絡我們",
    contactSubtitle: "有任何問題或建議？歡迎隨時聯絡。",
    ctaTitle: "準備好搵你嘅理想 Office？",
    ctaBrowse: "瀏覽盤源",
    ctaProvider: "業主登記",
  },
  en: {
    title: "About BizHKEx",
    intro:
      "BizHKEx matches Hong Kong serviced offices and business transfers. Tenants pay 0%. Centre operators pay a 5–10% success commission. Operator-run centres are shown first while we recruit partner centres.",
    missionTitle: "Our Mission",
    missionP1:
      "To transform Hong Kong's flexible workspace market with a transparent, efficient platform that connects businesses with the right offices.",
    missionP2:
      "We empower workspace providers to showcase premium listings while helping companies secure ideal environments at the lowest cost.",
    valuesTitle: "Core Values",
    values: [
      { title: "Client-first", description: "We connect workspace providers with businesses seeking offices — building a trusted, win-win ecosystem." },
      { title: "International standards", description: "Every listing and every match is held to transparent, professional service standards." },
      { title: "Excellence", description: "From search to deal completion, we deliver a smooth, professional, zero-commission experience." },
    ],
    whyTitle: "Why BizHKEx?",
    whyItems: [
      "Curated serviced offices across Central, Wan Chai, TST, Kwun Tong and major business districts",
      "Transparent pricing with complete listing details — no hidden fees",
      "Dedicated support for both tenants and providers",
      "Smart search and filters for faster matching",
      "Secure inquiry and viewing workflows",
      "0% tenant commission with flexible contract terms",
    ],
    teamTitle: "Our Team",
    teamP1:
      "Built by professionals with deep experience in property, technology and client service — committed to changing how Hong Kong businesses find workspace.",
    teamP2: "We continuously improve the platform to deliver better support and sharper matches.",
    contactTitle: "Contact Us",
    contactSubtitle: "Questions or feedback? We'd love to hear from you.",
    ctaTitle: "Ready to find your ideal office?",
    ctaBrowse: "Browse listings",
    ctaProvider: "List your space",
  },
};

export function getAboutContent(locale: Locale): AboutContent {
  return CONTENT[locale];
}
