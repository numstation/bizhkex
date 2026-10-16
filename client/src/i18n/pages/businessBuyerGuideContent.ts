import type { Locale } from "../types";

export type BuyerGuideStep = {
  step: string;
  title: string;
  desc: string;
  bullets: string[];
};

export type BuyerGuideContent = {
  pageTitle: string;
  pageSubtitle: string;
  ctaMarketplace: string;
  ctaRegister: string;
  stepsTitle: string;
  steps: BuyerGuideStep[];
  faqTitle: string;
  faqs: Array<{ q: string; a: string }>;
  protectionTitle: string;
  protectionBullets: string[];
};

const CONTENT: Record<Locale, BuyerGuideContent> = {
  zh: {
    pageTitle: "購入生意程序",
    pageSubtitle:
      "參考香港領先生意買賣平台流程，BizHKEx 為買家提供透明、免佣的頂讓配對及盡職支援。",
    ctaMarketplace: "瀏覽頂讓項目",
    ctaRegister: "我是賣家，我要放盤",
    stepsTitle: "五步完成收購",
    steps: [
      {
        step: "1",
        title: "瀏覽及篩選",
        desc: "按行業、地區、叫價及回本期篩選合適項目。",
        bullets: ["查看項目相片及財務快照", "比較多個頂讓盤", "收藏感興趣項目代號"],
      },
      {
        step: "2",
        title: "提交查詢",
        desc: "在項目頁填寫查詢表格或透過 WhatsApp 索取內部財務報表。",
        bullets: ["免費查詢，0% 買家佣金", "1–2 個工作天內回覆", "收到電郵確認編號"],
      },
      {
        step: "3",
        title: "財務及實地審視",
        desc: "我們協助安排詳細 P&L、租約及牌照資料，並可安排睇舖。",
        bullets: ["核對營業額與租金佔比", "了解東主出讓原因", "評估裝修及設備狀態"],
      },
      {
        step: "4",
        title: "盡職調查與議價",
        desc: "按行業進行盡職清單（牌照、合約、員工、供應商等）。",
        bullets: ["參考市場同類成交", "議價叫價及交接條款", "律師／會計師介入（如需要）"],
      },
      {
        step: "5",
        title: "簽約及交接",
        desc: "確認買賣協議、業主同意書及牌照轉讓後完成交接。",
        bullets: ["支付訂金及尾數", "交接存貨、客戶及系統", "BizHKEx 跟進至完成"],
      },
    ],
    faqTitle: "買家常見問題",
    faqs: [
      {
        q: "買家需要付佣金嗎？",
        a: "不需要。BizHKEx 向買家收取 0% 佣金，查詢及索取財務報表均免費。",
      },
      {
        q: "財務數字可靠嗎？",
        a: "目前市場上的項目多數是示範資料，數字未經核實。正式交易前請索取真實資料並自行盡職審查。",
      },
      {
        q: "可以只買設備或牌照嗎？",
        a: "部分項目為設備轉讓或牌照轉讓，詳情請在查詢時註明需求。",
      },
    ],
    protectionTitle: "買家保障",
    protectionBullets: [
      "查詢資料只用作跟進該項目",
      "可要求簽署保密協議後提供詳細財務",
      "專人配對，避免重複接洽多個中介",
      "支援 WhatsApp 即時溝通",
    ],
  },
  en: {
    pageTitle: "How to Buy a Business",
    pageSubtitle:
      "Inspired by leading HK transfer platforms — BizHKEx offers transparent, zero-buyer-commission matching and due-diligence support.",
    ctaMarketplace: "Browse listings",
    ctaRegister: "I'm a seller — list my business",
    stepsTitle: "Five steps to acquisition",
    steps: [
      {
        step: "1",
        title: "Browse & shortlist",
        desc: "Filter by industry, district, asking price and payback period.",
        bullets: ["Review photos and financial snapshots", "Compare multiple listings", "Note listing codes of interest"],
      },
      {
        step: "2",
        title: "Submit inquiry",
        desc: "Use the listing inquiry form or WhatsApp to request the internal financial pack.",
        bullets: ["Free inquiry — 0% buyer commission", "Reply within 1–2 business days", "Email confirmation with reference ID"],
      },
      {
        step: "3",
        title: "Financial review & site visit",
        desc: "We help arrange detailed P&L, lease and licence documents, plus site visits.",
        bullets: ["Check turnover vs rent ratio", "Understand seller's reason for exit", "Assess fit-out and equipment"],
      },
      {
        step: "4",
        title: "Due diligence & negotiation",
        desc: "Industry-specific checklists — licences, contracts, staff, suppliers.",
        bullets: ["Benchmark against comparable deals", "Negotiate price and handover terms", "Involve lawyer / accountant if needed"],
      },
      {
        step: "5",
        title: "Sign & handover",
        desc: "Complete SPA, landlord consent and licence transfer, then handover.",
        bullets: ["Deposit and balance payment", "Hand over stock, customers and systems", "BizHKEx follows through to completion"],
      },
    ],
    faqTitle: "Buyer FAQ",
    faqs: [
      {
        q: "Do buyers pay commission?",
        a: "No. BizHKEx charges buyers 0% commission. Inquiries and financial packs are free.",
      },
      {
        q: "How reliable are the financial figures?",
        a: "Most listings on the marketplace are samples. Figures are not verified accounts. Request a real pack and do your own due diligence before closing.",
      },
      {
        q: "Can I buy equipment or licence only?",
        a: "Some listings are asset or licence transfers — specify your needs in the inquiry form.",
      },
    ],
    protectionTitle: "Buyer protection",
    protectionBullets: [
      "Your details are used only for the listing you inquire about",
      "NDA available before detailed financials",
      "Single point of contact — no duplicate broker calls",
      "WhatsApp support for quick questions",
    ],
  },
};

export function getBusinessBuyerGuideContent(locale: Locale): BuyerGuideContent {
  return CONTENT[locale];
}
