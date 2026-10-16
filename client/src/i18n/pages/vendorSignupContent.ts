import type { Locale } from "../types";

type VendorSignupContent = {
  pageTitle: string;
  pageSubtitle: string;
  stepChoose: string;
  stepForm: string;
  stepAi: string;
  stepPreview: string;
  stepDone: string;
  chooseTitle: string;
  chooseSubtitle: string;
  officeType: string;
  officeTypeDesc: string;
  businessType: string;
  businessTypeDesc: string;
  continue: string;
  back: string;
  formTitle: string;
  formSubtitle: string;
  nameLabel: string;
  namePlaceholderOffice: string;
  namePlaceholderBusiness: string;
  contactLabel: string;
  emailLabel: string;
  phoneLabel: string;
  districtLabel: string;
  industryLabel: string;
  summaryLabel: string;
  summaryHint: string;
  summaryPlaceholderOffice: string;
  summaryPlaceholderBusiness: string;
  referenceLabel: string;
  referencePlaceholder: string;
  photosLabel: string;
  photosHint: string;
  photosUploading: string;
  photosMax: string;
  photosInvalidType: string;
  photosTooLarge: string;
  photosUploadError: string;
  generateBtn: string;
  aiTitle: string;
  aiSteps: string[];
  previewTitle: string;
  previewSubtitle: string;
  previewDraftNotice: string;
  previewOfficePrice: string;
  previewAmenities: string;
  previewHighlights: string;
  previewAsking: string;
  previewTurnover: string;
  previewProfit: string;
  previewPayback: string;
  editBtn: string;
  submitBtn: string;
  successTitle: string;
  successSubtitle: string;
  successRef: string;
  backHome: string;
  loginPrompt: string;
  loginLink: string;
  errors: {
    required: string;
    email: string;
  };
  districts: Array<{ value: string; label: string }>;
  industries: Array<{ value: string; label: string }>;
  leftPanelTitle: string;
  leftPanelDesc: string;
  leftBullets: string[];
};

const CONTENT: Record<Locale, VendorSignupContent> = {
  zh: {
    pageTitle: "業主及賣家登記",
    pageSubtitle: "提交中心或生意資料，進入審核隊列。成功佣金 5–10%，通過前不會公開上架。",
    stepChoose: "選擇類型",
    stepForm: "提交資料",
    stepAi: "AI 生成",
    stepPreview: "預覽確認",
    stepDone: "完成",
    chooseTitle: "你想刊登邊類項目？",
    chooseSubtitle: "提交核心資料。草稿只供你同團隊覆核，不會自動變成公開盤源。",
    officeType: "商務中心 / 共享空間",
    officeTypeDesc: "出租辦公室、工位或會議室 — AI 生成設施、租金及描述",
    businessType: "生意頂讓",
    businessTypeDesc: "出售現有業務 — AI 生成財務快照、回本期及項目介紹",
    continue: "繼續",
    back: "返回",
    formTitle: "告訴我們基本資料",
    formSubtitle: "唔使逐項填表 — 幾個欄位就夠，其餘交俾 AI",
    nameLabel: "公司 / 業務名稱",
    namePlaceholderOffice: "例如：中環海港商務中心",
    namePlaceholderBusiness: "例如：旺角精品咖啡店",
    contactLabel: "聯絡人姓名",
    emailLabel: "電郵",
    phoneLabel: "WhatsApp / 電話",
    districtLabel: "地區",
    industryLabel: "行業",
    summaryLabel: "簡短描述",
    summaryHint: "用 1-3 句話描述你的空間或業務，AI 會擴展成專業盤源內容",
    summaryPlaceholderOffice: "例如：中環核心地段，提供 1-20 人私人辦公室，包會議室及接待服務…",
    summaryPlaceholderBusiness: "例如：旺區商場咖啡店，營運 3 年，穩定熟客，裝修新淨…",
    referenceLabel: "參考連結（選填）",
    referencePlaceholder: "網站、Google Maps 或現有盤源連結",
    photosLabel: "店舖 / 空間相片（選填）",
    photosHint: "上傳最多 4 張相片，買家更容易了解你的項目（JPG/PNG，每張 ≤4MB）",
    photosUploading: "上傳中…",
    photosMax: "最多 4 張相片",
    photosInvalidType: "請上傳 JPG、PNG 或 WebP 圖片",
    photosTooLarge: "相片大小不能超過 4MB",
    photosUploadError: "上傳失敗，請稍後再試",
    generateBtn: "交由 AI 生成盤源",
    aiTitle: "BizHKEx AI 正在生成你的盤源…",
    aiSteps: [
      "分析你提交嘅核心資料",
      "匹配地區市場數據",
      "生成財務及設施摘要",
      "優化盤源標題同描述",
      "準備預覽頁面",
    ],
    previewTitle: "草稿預覽（未上架）",
    previewSubtitle: "以下只係草稿，方便你核對。提交後會進入審核隊列，通過前不會出現喺網站。",
    previewDraftNotice: "這不是公開盤源。估算租金同文案都未經確認，亦不會自動發佈。",
    previewOfficePrice: "建議月租",
    previewAmenities: "設施配套",
    previewHighlights: "平台優勢",
    previewAsking: "建議叫價",
    previewTurnover: "估算年營業額",
    previewProfit: "估算年淨利",
    previewPayback: "估算回本期",
    editBtn: "修改資料",
    submitBtn: "確認提交登記",
    successTitle: "登記已收到！",
    successSubtitle: "確認電郵已發送（請查垃圾郵件）。申請在審核隊列，尚未上架。通過前未能登入後台。成功佣金 5–10%。",
    successRef: "參考編號",
    backHome: "返回首頁",
    loginPrompt: "已有帳戶？",
    loginLink: "登入業主後台",
    errors: { required: "請填寫所有必填欄位", email: "請輸入有效電郵" },
    districts: [
      { value: "中環", label: "中環" },
      { value: "灣仔", label: "灣仔" },
      { value: "銅鑼灣", label: "銅鑼灣" },
      { value: "尖沙咀", label: "尖沙咀" },
      { value: "旺角", label: "旺角" },
      { value: "觀塘", label: "觀塘" },
      { value: "九龍灣", label: "九龍灣" },
      { value: "沙田", label: "沙田" },
      { value: "荃灣", label: "荃灣" },
    ],
    industries: [
      { value: "F&B", label: "飲食" },
      { value: "Education", label: "教育" },
      { value: "E-commerce", label: "電商" },
      { value: "Beauty", label: "美容" },
      { value: "Services", label: "服務業" },
      { value: "Retail", label: "零售" },
    ],
    leftPanelTitle: "中心及賣家審核隊列",
    leftPanelDesc: "商務中心同生意轉讓用同一個入口。提交後先覆核，通過先公開。",
    leftBullets: [
      "成功配對佣金 5–10%，未成交不收費",
      "草稿不會自動變成公開盤源",
      "團隊核對中心、相片同租金後先上架",
      "租客查詢在上架之後先轉介",
    ],
  },
  en: {
    pageTitle: "Vendor Registration",
    pageSubtitle: "Submit a centre or business for review. Success commission is 5–10%. Nothing goes live before approval.",
    stepChoose: "Choose type",
    stepForm: "Submit info",
    stepAi: "AI generate",
    stepPreview: "Preview",
    stepDone: "Done",
    chooseTitle: "What would you like to list?",
    chooseSubtitle: "Send the essentials. Any draft is for review only and is not published automatically.",
    officeType: "Serviced Office / Coworking",
    officeTypeDesc: "Lease desks or offices — AI generates amenities, pricing and copy",
    businessType: "Business Transfer",
    businessTypeDesc: "Sell your business — AI generates financial snapshot, payback and overview",
    continue: "Continue",
    back: "Back",
    formTitle: "Tell us the essentials",
    formSubtitle: "No long forms — a few fields is enough, AI handles the rest",
    nameLabel: "Company / business name",
    namePlaceholderOffice: "e.g. Harbour View Business Centre, Central",
    namePlaceholderBusiness: "e.g. Mong Kok Premium Coffee Shop",
    contactLabel: "Contact name",
    emailLabel: "Email",
    phoneLabel: "WhatsApp / Phone",
    districtLabel: "District",
    industryLabel: "Industry",
    summaryLabel: "Brief description",
    summaryHint: "1–3 sentences about your space or business — AI expands into a pro listing",
    summaryPlaceholderOffice: "e.g. Core Central location, private offices for 1–20, meeting rooms included…",
    summaryPlaceholderBusiness: "e.g. Mall coffee shop, 3 years operation, loyal customers, recent fit-out…",
    referenceLabel: "Reference link (optional)",
    referencePlaceholder: "Website, Google Maps or existing listing URL",
    photosLabel: "Shop / space photos (optional)",
    photosHint: "Upload up to 4 photos so buyers can see your listing (JPG/PNG, max 4MB each)",
    photosUploading: "Uploading…",
    photosMax: "Maximum 4 photos",
    photosInvalidType: "Please upload JPG, PNG or WebP images",
    photosTooLarge: "Each photo must be 4MB or smaller",
    photosUploadError: "Upload failed — please try again",
    generateBtn: "Generate listing with AI",
    aiTitle: "BizHKEx AI is building your listing…",
    aiSteps: [
      "Analysing your core submission",
      "Matching district market data",
      "Generating financial & amenity snapshot",
      "Optimising title and description",
      "Preparing preview page",
    ],
    previewTitle: "Draft preview (not live)",
    previewSubtitle: "This draft is for you to check. After you submit it joins the review queue and stays off the public site.",
    previewDraftNotice: "This is not a public listing. Estimated prices and copy are unconfirmed and will not auto-publish.",
    previewOfficePrice: "Suggested monthly rent",
    previewAmenities: "Amenities",
    previewHighlights: "Platform benefits",
    previewAsking: "Suggested asking price",
    previewTurnover: "Est. annual turnover",
    previewProfit: "Est. net profit",
    previewPayback: "Est. payback",
    editBtn: "Edit details",
    submitBtn: "Confirm & submit registration",
    successTitle: "Registration received!",
    successSubtitle: "A confirmation email has been sent (check spam). Your application is queued for review and is not live. Dashboard login opens after approval. Success commission is 5–10%.",
    successRef: "Reference",
    backHome: "Back to home",
    loginPrompt: "Already registered?",
    loginLink: "Sign in to dashboard",
    errors: { required: "Please complete all required fields", email: "Enter a valid email" },
    districts: [
      { value: "Central", label: "Central" },
      { value: "Wan Chai", label: "Wan Chai" },
      { value: "Causeway Bay", label: "Causeway Bay" },
      { value: "Tsim Sha Tsui", label: "Tsim Sha Tsui" },
      { value: "Mong Kok", label: "Mong Kok" },
      { value: "Kwun Tong", label: "Kwun Tong" },
      { value: "Kowloon Bay", label: "Kowloon Bay" },
      { value: "Sha Tin", label: "Sha Tin" },
      { value: "Tsuen Wan", label: "Tsuen Wan" },
    ],
    industries: [
      { value: "F&B", label: "F&B" },
      { value: "Education", label: "Education" },
      { value: "E-commerce", label: "E-commerce" },
      { value: "Beauty", label: "Beauty" },
      { value: "Services", label: "Services" },
      { value: "Retail", label: "Retail" },
    ],
    leftPanelTitle: "Centre and seller review queue",
    leftPanelDesc: "Serviced offices and business transfers share one intake. We review first and publish only after approval.",
    leftBullets: [
      "Success commission 5–10% — no fee before a deal",
      "Drafts are not auto-published as live inventory",
      "We check the centre, photos and prices before going live",
      "Tenant enquiries start only after approval",
    ],
  },
};

export function getVendorSignupContent(locale: Locale): VendorSignupContent {
  return CONTENT[locale];
}
