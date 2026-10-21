import type { Locale } from "../types";

export type ProviderPitchContent = {
  kicker: string;
  title: string;
  subtitle: string;
  commission: string;
  primaryCta: string;
  secondaryCta: string;
  stepsTitle: string;
  steps: Array<{ title: string; body: string }>;
  pointsTitle: string;
  points: string[];
  reviewTitle: string;
  reviewBody: string;
  contact: string;
};

const CONTENT: Record<Locale, ProviderPitchContent> = {
  zh: {
    kicker: "中心營運商上架",
    title: "將你的商務中心放到 BizHKEx",
    subtitle:
      "我哋自己營運觀塘友邦九龍大樓（Landmark East，巧明街100號）同觀塘 APM（創紀之城五期，觀塘道418號），同時招募其他中心。你提交資料後進入審核隊列，通過先會公開，租客查詢先會轉介俾你。",
    commission:
      "寫字樓成功配對只向業主、營運商或中心收取約 5–10%，租客 0%。未成交、未獲審核通過，都不收費，亦不會自動上架。生意頂讓則買賣雙方收費。",
    primaryCta: "提交中心資料",
    secondaryCta: "WhatsApp 我哋",
    stepsTitle: "上架點樣運作",
    steps: [
      {
        title: "1. 提交中心資料",
        body: "講你的中心名稱、地區同簡單介紹。可選附相片。系統可以整理一份草稿俾你睇，但草稿唔係公開盤源。",
      },
      {
        title: "2. 進入審核隊列",
        body: "申請狀態為待覆核。團隊會核對中心是否真實、租金同相片是否可以公開。審核期間後台登入未開放。",
      },
      {
        title: "3. 通過後先接收查詢",
        body: "通過之後先會出現喺公開辦公室列表。寫字樓成交先向中心計算約 5–10% 成功佣金，租客 0%。",
      },
    ],
    pointsTitle: "你會得到咩",
    points: [
      "租客配對查詢，而唔使自己逐個打廣告",
      "寫字樓成功先向中心收費，範圍約 5–10%，租客 0%",
      "同 BizHKEx 自家中心一齊出現，但會標明營運方",
      "生意轉讓可以用同一個入口提交，先覆核後上架；成交時買家同賣家雙方都要付約 5–10%",
    ],
    reviewTitle: "點解唔會即時上架？",
    reviewBody:
      "草稿、估算租金同系統整理文案只供內部覆核。未核准的內容不會進入辦公室或生意轉讓的公開列表，以免訪客見到未核實的盤。",
    contact: "想先傾？WhatsApp +852 3565 3138 或電郵 info@bizhkex.com。",
  },
  en: {
    kicker: "List your centre",
    title: "Put your serviced centre on BizHKEx",
    subtitle:
      "We operate AIA Kowloon Tower at Landmark East, 100 How Ming Street, Kwun Tong, and APM at Millennium City 5, 418 Kwun Tong Road. We are also recruiting other operators. Your submission joins a review queue. It goes live, and leads are passed to you, only after we approve it.",
    commission:
      "Serviced-office success fees of about 5–10% are charged to the landlord, operator or centre only. Tenants pay 0%. Nothing is charged before a completed deal, and nothing is auto-published. Business transfers are charged to both buyer and seller.",
    primaryCta: "Submit your centre",
    secondaryCta: "WhatsApp us",
    stepsTitle: "How listing works",
    steps: [
      {
        title: "1. Send your centre details",
        body: "Name, district and a short description. Photos are optional. A draft can be prepared for you to read. That draft is not a public listing.",
      },
      {
        title: "2. Join the review queue",
        body: "Status stays pending while we check that the centre is real and that prices and photos are ready to show. Dashboard login stays closed until approval.",
      },
      {
        title: "3. Go live, then take enquiries",
        body: "After approval the centre can appear on the public office list. The success fee of about 5–10% is charged to the centre only when a deal completes. Tenants pay 0%.",
      },
    ],
    pointsTitle: "What you get",
    points: [
      "Tenant enquiries without buying ads yourself",
      "A success fee of about 5–10%, charged to the centre only — tenants pay 0%",
      "A place beside BizHKEx-operated centres, with the operator labelled",
      "The same intake for business transfers — review first, publish after. Both buyer and seller pay about 5–10% on completion",
    ],
    reviewTitle: "Why it does not go live immediately",
    reviewBody:
      "Draft copy, estimated rents and generated text stay with the review team. Unapproved material is not added to the public office or business-transfer lists.",
    contact: "Prefer to talk first? WhatsApp +852 3565 3138 or email info@bizhkex.com.",
  },
};

export function getProviderPitchContent(locale: Locale): ProviderPitchContent {
  return CONTENT[locale];
}
