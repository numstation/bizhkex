export type KnowledgeLocale = "en" | "zh";

export type DemoArticleCategory = {
  id: number;
  slug: string;
  name: Record<KnowledgeLocale, string>;
  displayOrder: number;
};

export type DemoArticle = {
  id: number;
  slug: string;
  categoryId: number;
  featured: boolean;
  author: string;
  publishedAt: string;
  title: Record<KnowledgeLocale, string>;
  excerpt: Record<KnowledgeLocale, string>;
  content: Record<KnowledgeLocale, string>;
};

export const DEMO_ARTICLE_CATEGORIES: DemoArticleCategory[] = [
  {
    id: 1,
    slug: "office-selection",
    name: { en: "Office Selection", zh: "辦公室選址" },
    displayOrder: 1,
  },
  {
    id: 2,
    slug: "lease-negotiation",
    name: { en: "Lease & Contracts", zh: "租約與合約" },
    displayOrder: 2,
  },
  {
    id: 3,
    slug: "business-transfer",
    name: { en: "Business Transfer", zh: "生意頂讓" },
    displayOrder: 3,
  },
  {
    id: 4,
    slug: "market-insights",
    name: { en: "Market Insights", zh: "市場洞察" },
    displayOrder: 4,
  },
];

export const DEMO_KNOWLEDGE_ARTICLES: DemoArticle[] = [
  {
    id: 1,
    slug: "first-serviced-office-hk",
    categoryId: 1,
    featured: true,
    author: "BizHKEx Team",
    publishedAt: "2026-05-12T09:00:00",
    title: {
      en: "First-Time Guide: Choosing a Serviced Office in Hong Kong",
      zh: "新手必讀：香港商務中心點樣揀？",
    },
    excerpt: {
      en: "Location, budget, flexibility and amenities — the four pillars of a smart office decision.",
      zh: "地點、預算、彈性及配套 — 精明揀 Office 四大關鍵。",
    },
    content: {
      en: `# Choosing Your First Serviced Office

Hong Kong's office market moves fast. For startups and SMEs, a **serviced office** often beats a traditional lease on flexibility and upfront cost.

## 1. Define your non-negotiables
- Walking distance to MTR
- Meeting rooms on demand
- Registered business address

## 2. Budget realistically
Factor in deposit, fit-out and agent fees for traditional leases. Serviced offices typically bundle utilities, cleaning and reception.

## 3. Visit at peak hours
Check lift queues, noise levels and internet speed between 9–11am.

## 4. Compare districts
Central commands prestige; Kwun Tong and Kowloon Bay offer value for product and ops teams.

> **BizHKEx tip:** Use the savings estimate to compare monthly OPEX with a conventional lease before you sign. The result is illustrative, not a guaranteed saving.`,
      zh: `# 第一次租商務中心要知咩？

香港辦公室市場節奏快，初創同中小企選 **商務中心** 往往比傳統租約更靈活、前期成本更低。

## 1. 列出不可妥協清單
- 步行到 MTR 距離
- 可按需預約會議室
- 可作公司註冊地址

## 2. 預算要計清
傳統租約要計按金、裝修、代理佣金；商務中心通常包水電、清潔同接待。

## 3. 繁忙時段實地睇
建議早上 9–11 點到場，感受升降機輪候、噪音同網速。

## 4. 比較地區
中環代表品牌形象；觀塘、九龍灣適合產品及營運團隊慳成本。

> **BizHKEx 貼士：** 用平台慳錢估算，對照商務中心同傳統租約每月 OPEX。結果只供參考，並非保證節省。`,
    },
  },
  {
    id: 2,
    slug: "central-vs-kwuntong-cost",
    categoryId: 4,
    featured: true,
    author: "BizHKEx Research",
    publishedAt: "2026-05-08T10:30:00",
    title: {
      en: "Central vs Kwun Tong: A 2026 Cost Comparison",
      zh: "2026 中環 vs 觀塘：辦公成本對照",
    },
    excerpt: {
      en: "How much can a 6-person team save by moving core functions out of Central?",
      zh: "6 人團隊將部分職能搬離中環，每月可以慳幾多？",
    },
    content: {
      en: `# Central vs Kwun Tong

| Item | Central (6 pax) | Kwun Tong (6 pax) |
|------|-----------------|-------------------|
| Serviced desk | ~HK$25,200/mo | ~HK$15,600/mo |
| Meeting room top-up | Higher demand | Lower rates |
| Commute (avg) | Island line | Kwun Tong line |

## When Central still wins
Client-facing roles, investor meetings and brand-sensitive industries often justify the premium.

## Hybrid model
Keep a 2-desk flex pass in Central and house engineering in Kwun Tong — a pattern we see among Series A fintech teams.`,
      zh: `# 中環 vs 觀塘

| 項目 | 中環（6人） | 觀塘（6人） |
|------|------------|------------|
| 商務工位 | 約 HK$25,200/月 | 約 HK$15,600/月 |
| 會議室加購 | 需求高、費用較貴 | 相對便宜 |
| 通勤 | 港島線 | 觀塘線 |

## 幾時仍值得留中環？
面向客戶、見投資者、品牌敏感行業，溢價通常合理。

## 混合模式
中環保留 2 個彈性工位，工程團隊放觀塘 — 我哋見過好多 A 輪金融科技公司咁做。`,
    },
  },
  {
    id: 3,
    slug: "lease-red-flags-hk",
    categoryId: 2,
    featured: true,
    author: "BizHKEx Legal Desk",
    publishedAt: "2026-04-28T14:00:00",
    title: {
      en: "5 Lease Clauses Hong Kong Tenants Should Watch",
      zh: "香港租約 5 個要小心嘅條款",
    },
    excerpt: {
      en: "Reinstatement, rent review, assignment restrictions and more — explained in plain English.",
      zh: "還原工程、租金檢討、轉讓限制等 — 用淺白語言拆解。",
    },
    content: {
      en: `# Five clauses to review carefully

1. **Reinstatement** — Who pays to return the unit to bare shell?
2. **Rent review** — Fixed vs market review every 2–3 years
3. **Assignment & subletting** — Critical if you may merge or exit
4. **Break clause** — Rare in HK; negotiate early termination options
5. **Air-con charges** — Often billed separately after hours

Always obtain a bilingual summary if your team signs in Chinese.`,
      zh: `# 五個要仔細睇嘅條款

1. **還原工程** — 退租時還原費用邊個負責？
2. **租金檢討** — 固定租金定每 2–3 年跟市場調整？
3. **轉讓及分租** — 如有合併或退出計劃尤其重要
4. **中途解約** — 香港較少見，可爭取提前終止條款
5. **冷氣費** — 非辦公時間常另外計

建議團隊簽中文合約時，仍索取雙語重點摘要。`,
    },
  },
  {
    id: 4,
    slug: "fb-transfer-due-diligence",
    categoryId: 3,
    featured: false,
    author: "BizHKEx M&A Desk",
    publishedAt: "2026-04-15T11:00:00",
    title: {
      en: "F&B Business Transfer: A 7-Day Due Diligence Checklist",
      zh: "餐飲頂讓：7 日盡職審查清單",
    },
    excerpt: {
      en: "Licences, landlord consent, staff contracts and POS data — what buyers ask first.",
      zh: "牌照、業主同意、員工合約同 POS 數據 — 買家第一時間會問咩。",
    },
    content: {
      en: `# 7-day F&B transfer checklist

**Day 1–2:** Verify food licence, liquor licence (if any) and fire certificate validity.

**Day 3:** Request 12 months POS turnover and match against bank deposits.

**Day 4:** Review lease remaining term and landlord transfer approval timeline.

**Day 5:** Staff list, MPF records and key supplier contracts.

**Day 6–7:** Site visit at lunch and dinner peak; observe foot traffic independently.

Figures shown on BizHKEx sample listings are illustrative only — request the full report and verify the accounts before you rely on them.`,
      zh: `# 餐飲頂讓 7 日清單

**第 1–2 日：** 核實食物業牌照、酒牌（如有）及消防證明有效期。

**第 3 日：** 索取 12 個月 POS 營業額，並與入帳紀錄對照。

**第 4 日：** 檢視租約剩餘年期及業主批准頂讓所需時間。

**第 5 日：** 員工名單、強積金紀錄及主要供應商合約。

**第 6–7 日：** 午市及晚市高峰實地觀察，獨立評估人流。

BizHKEx 示範盤源上的數字只供版面參考 — 請透過 WhatsApp 索取完整報告，並自行核實帳目。`,
    },
  },
  {
    id: 5,
    slug: "coworking-vs-private-office",
    categoryId: 1,
    featured: false,
    author: "BizHKEx Team",
    publishedAt: "2026-04-02T09:30:00",
    title: {
      en: "Coworking Hot Desk vs Private Office: Which Fits Your Stage?",
      zh: "共享工位 vs 獨立房：邊個適合你而家階段？",
    },
    excerpt: {
      en: "From solo founders to 10-person teams — a practical decision framework.",
      zh: "由一人創業到 10 人團隊 — 實用決策框架。",
    },
    content: {
      en: `# Hot desk vs private office

| Stage | Recommendation |
|-------|----------------|
| Solo / 1–2 pax | Hot desk + meeting credits |
| 3–5 pax | Studio or small private office |
| 6–10 pax | Dedicated suite with own signage |

Hot desks maximise network exposure; private offices protect confidential calls and client meetings.`,
      zh: `# 熱工位 vs 獨立房

| 階段 | 建議 |
|------|------|
| 一人 / 1–2 人 | 熱工位 + 會議室時數 |
| 3–5 人 | Studio 或細獨立房 |
| 6–10 人 | 專屬套房連公司標誌 |

熱工位有利拓展人脈；獨立房就適合保密通話同客戶會面。`,
    },
  },
  {
    id: 6,
    slug: "hk-office-market-q2-2026",
    categoryId: 4,
    featured: false,
    author: "BizHKEx Research",
    publishedAt: "2026-03-20T16:00:00",
    title: {
      en: "Hong Kong Office Market Snapshot — Q2 2026",
      zh: "香港辦公室市場快覽 — 2026 第二季",
    },
    excerpt: {
      en: "Serviced office rates stabilise; business transfers up in F&B and education.",
      zh: "商務中心租金趨穩；餐飲及教育類頂讓盤增加。",
    },
    content: {
      en: `# Q2 2026 market snapshot

- **Serviced offices:** Average desk rates flat QoQ; promotions common for 12-month commits.
- **Traditional Grade A:** Sublease supply still elevated in Central and Quarry Bay.
- **Business transfers:** F&B and tutorial centres lead inquiry volume on BizHKEx.
- **Outlook:** SMEs continue favouring flexible terms over long lock-ins.`,
      zh: `# 2026 第二季市場快覽

- **商務中心：** 平均工位租金按季持平；簽 12 個月常見優惠。
- **傳統甲廈：** 中環、鰂魚涌分租盤仍然偏多。
- **生意頂讓：** 餐飲及補習社為 BizHKEx 查詢量最高類別。
- **展望：** 中小企繼續偏好彈性租期，避免長綁。`,
    },
  },
  {
    id: 7,
    slug: "negotiate-serviced-office-rate",
    categoryId: 2,
    featured: false,
    author: "BizHKEx Team",
    publishedAt: "2026-03-05T10:00:00",
    title: {
      en: "How to Negotiate Serviced Office Rates in Hong Kong",
      zh: "香港商務中心租金點樣議價？",
    },
    excerpt: {
      en: "Length of stay, move-in date and bundled services — levers that actually work.",
      zh: "租期、入住時間同配套組合 — 真正有效嘅議價槓桿。",
    },
    content: {
      en: `# Negotiation levers

1. **Commit longer** — 12 vs 6 months often unlocks 8–15% discount.
2. **Move in off-peak** — Operators prefer filling floors before quarter-end.
3. **Bundle meeting hours** — Trade desk rate for included room credits.
4. **Compare via BizHKEx** — Multiple quotes strengthen your position; our service is free for tenants.`,
      zh: `# 議價四大槓桿

1. **延長租期** — 12 個月比 6 個月常可平 8–15%。
2. **淡季入住** — 季末前填滿樓層，營運方較易讓步。
3. **會議室時數綑綁** — 用會議配套換取工位折扣。
4. **經 BizHKEx 比價** — 多間報價加強議價力；租客完全免費。`,
    },
  },
  {
    id: 8,
    slug: "education-business-transfer-tips",
    categoryId: 3,
    featured: false,
    author: "BizHKEx Team",
    publishedAt: "2026-02-18T13:30:00",
    title: {
      en: "Buying a Tutorial Centre: What Investors Overlook",
      zh: "收購補習社：投資者容易忽略嘅細節",
    },
    excerpt: {
      en: "Student retention, tutor IP and Education Bureau registration — beyond the headline profit.",
      zh: "學生續報率、導師 IP 及教育局註冊 — 不止睇表面利潤。",
    },
    content: {
      en: `# Beyond the P&L

- **Retention rate** matters more than one strong semester.
- Clarify whether star tutors are employees or contractors.
- Check if the premise is approved for the registered school type.
- Seasonal cash flow dips in summer — model 12 months, not 3.

Request the BizHKEx internal financial pack before making an offer.`,
      zh: `# 唔止睇損益表

- **學生續報率** 比單季佳績更重要。
- 弄清楚明星導師係僱員定合作夥伴。
- 核實處所是否符合已註冊學校類別。
- 暑假現金流會回落 — 要用 12 個月建模，唔好淨睇一季。

出價前請索取 BizHKEx 內部財務資料包。`,
    },
  },
];

function categoryName(categoryId: number, locale: KnowledgeLocale): string {
  const cat = DEMO_ARTICLE_CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.name[locale] : locale === "zh" ? "其他" : "Other";
}

export function getDemoCategories(locale: KnowledgeLocale = "zh") {
  return DEMO_ARTICLE_CATEGORIES.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name[locale],
    displayOrder: c.displayOrder,
  }));
}

export function getDemoArticles(
  locale: KnowledgeLocale = "zh",
  categoryId?: number,
  featured?: boolean,
  limit = 20,
  offset = 0
) {
  let list = DEMO_KNOWLEDGE_ARTICLES;
  if (categoryId) list = list.filter((a) => a.categoryId === categoryId);
  if (featured !== undefined) list = list.filter((a) => a.featured === featured);
  return list.slice(offset, offset + limit).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title[locale],
    excerpt: a.excerpt[locale],
    author: a.author,
    featured: a.featured ? 1 : 0,
    publishedAt: a.publishedAt,
    createdAt: a.publishedAt,
    categoryName: categoryName(a.categoryId, locale),
  }));
}

export function getDemoArticleBySlug(slug: string, locale: KnowledgeLocale = "zh") {
  const a = DEMO_KNOWLEDGE_ARTICLES.find((item) => item.slug === slug);
  if (!a) return null;
  const cat = DEMO_ARTICLE_CATEGORIES.find((c) => c.id === a.categoryId);
  return {
    id: a.id,
    slug: a.slug,
    title: a.title[locale],
    content: a.content[locale],
    excerpt: a.excerpt[locale],
    author: a.author,
    featured: a.featured ? 1 : 0,
    publishedAt: a.publishedAt,
    createdAt: a.publishedAt,
    updatedAt: a.publishedAt,
    categoryName: categoryName(a.categoryId, locale),
    categorySlug: cat?.slug ?? "general",
    tags: [] as Array<{ id: number; name: string; slug: string }>,
  };
}
