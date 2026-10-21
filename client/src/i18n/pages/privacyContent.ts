import type { Locale } from "../types";

type PrivacyContent = {
  title: string;
  updated: string;
  sections: Array<{ title: string; paragraphs?: string[]; listItems?: string[] }>;
};

const CONTENT: Record<Locale, PrivacyContent> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: 21 October 2026",
    sections: [
      {
        title: "1. Who is responsible (legal entity to be confirmed)",
        paragraphs: [
          "This website is operated under the BizHKEx brand. The registered company name and Hong Kong Business Registration number are not published on this page yet.",
          "[Chris: insert the registered legal entity name, Business Registration (BR) number and registered office address. No BR number is invented here. Until that is filled in, personal-data requests go to info@bizhkex.com or +852 3565 3138.]",
          "This policy is written with the Hong Kong Personal Data (Privacy) Ordinance (Cap. 486, PDPO) in mind. It explains why we collect personal data, how we use it, how long we keep it, and how you can request access or correction. It is not formal legal advice.",
        ],
      },
      {
        title: "2. Information we collect",
        paragraphs: ["We collect information to provide and improve the service. This may include:"],
        listItems: [
          "Personal data you give us: email, name, phone number, and the content of an office or business-transfer inquiry",
          "Listing details a centre operator or seller submits for review",
          "Usage data: IP address, browser type, pages visited, visit times and diagnostic data",
        ],
      },
      {
        title: "3. Purpose of use (PDPO)",
        paragraphs: ["We use personal data only for purposes that are lawful and connected to what you asked us to do:"],
        listItems: [
          "Matching a serviced-office or business-transfer inquiry",
          "Reviewing a centre or business before anything is published",
          "Replying to you by email or WhatsApp, and sending a confirmation of your inquiry",
          "Keeping the website secure and understanding which pages are used",
          "Meeting a legal or regulatory duty if one applies",
        ],
      },
      {
        title: "4. Who we share data with",
        paragraphs: [
          "To handle an office inquiry we may pass your contact details to the relevant centre operator, landlord or provider. To handle a business-transfer inquiry we may pass them to the seller or the seller's representative. We do not sell personal data.",
          "Service providers who host email, the website or analytics may process data on our instructions. They may only use it to provide that service.",
        ],
      },
      {
        title: "5. Direct marketing",
        paragraphs: [
          "We do not use your personal data for direct marketing unless we have asked for your consent first. You can opt out at any time by emailing info@bizhkex.com. Opting out does not affect a reply to an inquiry you already sent.",
        ],
      },
      {
        title: "6. Retention",
        paragraphs: [
          "We keep personal data only for as long as we need it for the purpose you contacted us, or for as long as Hong Kong law requires. Inquiry records are kept so we can follow up and keep a record of what was agreed. When the data is no longer needed, we delete or anonymise it.",
        ],
      },
      {
        title: "7. Security",
        paragraphs: [
          "We take reasonable steps to protect personal data against unauthorised access, loss or misuse. No internet transmission or electronic storage is completely secure.",
        ],
      },
      {
        title: "8. Access and correction",
        paragraphs: [
          "Under the PDPO you may ask to access personal data we hold about you and to correct it if it is inaccurate. Email info@bizhkex.com with enough detail for us to find the record. We may need to confirm your identity before we release data. We aim to answer within 40 days, which is the period the PDPO generally expects.",
        ],
      },
      {
        title: "9. Complaints",
        paragraphs: [
          "If you are not satisfied with how we handle personal data, contact info@bizhkex.com first. You may also contact the Office of the Privacy Commissioner for Personal Data, Hong Kong (PCPD).",
        ],
      },
      {
        title: "10. Changes",
        paragraphs: [
          "We may update this policy by posting a new version on this page and changing the date above. The legal-entity placeholder stays until Chris inserts the registered name and BR number.",
        ],
      },
      {
        title: "11. Contact",
        paragraphs: ["Questions about this policy: info@bizhkex.com or +852 3565 3138."],
      },
    ],
  },
  zh: {
    title: "私隱政策",
    updated: "最後更新：2026年10月21日",
    sections: [
      {
        title: "1. 資料使用者（法律實體待營運方填入）",
        paragraphs: [
          "本網站以 BizHKEx 品牌營運。登記公司名稱及香港商業登記號碼尚未在本頁公開。",
          "[Chris：請填入註冊法律實體全名、商業登記號碼（BR）及註冊地址。本頁沒有編造 BR 號碼。填入之前，個人資料查詢請聯絡 info@bizhkex.com 或 +852 3565 3138。]",
          "本政策按香港《個人資料（私隱）條例》（第486章，PDPO）的保障資料原則草擬，說明收集目的、使用、保存、查閱及改正。本頁並非正式法律意見。",
        ],
      },
      {
        title: "2. 我們收集的資料",
        paragraphs: ["我們收集資料以提供及改善服務，可能包括："],
        listItems: [
          "你提供的個人資料：電郵、姓名、電話，以及寫字樓或生意頂讓查詢內容",
          "中心營運商或賣家為審核而上傳的盤源資料",
          "使用資料：IP 地址、瀏覽器類型、瀏覽頁面、到訪時間及診斷數據",
        ],
      },
      {
        title: "3. 使用目的（PDPO）",
        paragraphs: ["我們只會把個人資料用於與你所委託事項相關、並且合法的目的："],
        listItems: [
          "配對服務式辦公室或生意頂讓查詢",
          "在公開上架前覆核中心或業務資料",
          "以電郵或 WhatsApp 回覆你，並發送查詢確認",
          "維持網站保安，以及了解頁面使用情況",
          "履行適用的法律或監管責任",
        ],
      },
      {
        title: "4. 資料會交俾邊個",
        paragraphs: [
          "為處理寫字樓查詢，我們可能把你的聯絡資料交給相關中心營運商、業主或提供者。為處理生意頂讓查詢，我們可能交給賣家或其代表。我們不會出售個人資料。",
          "代為提供電郵、網站託管或分析的服務商，只可按我們的指示處理資料，並只限於提供該項服務。",
        ],
      },
      {
        title: "5. 直接促銷",
        paragraphs: [
          "除非事先取得你的同意，我們不會把你的個人資料用於直接促銷。你可以隨時電郵 info@bizhkex.com 拒絕。拒絕促銷不會影響我們回覆你已經提交的查詢。",
        ],
      },
      {
        title: "6. 保存期限",
        paragraphs: [
          "個人資料只會保存至完成你聯絡我們的目的所需期間，或香港法律要求的期間。查詢紀錄會保留，以便跟進及記錄已溝通的內容。不再需要時，我們會刪除或匿名化。",
        ],
      },
      {
        title: "7. 保安",
        paragraphs: [
          "我們採取合理措施，防止個人資料被未獲授權查閱、遺失或誤用。互聯網傳輸及電子儲存無法保證絕對安全。",
        ],
      },
      {
        title: "8. 查閱及改正",
        paragraphs: [
          "按《個人資料（私隱）條例》，你可以要求查閱我們持有關於你的個人資料，並要求改正不準確的資料。請電郵 info@bizhkex.com，並提供足夠資料讓我們找到相關紀錄。發放資料前我們可能需要核實身份。我們會盡量在 40 日內回覆，此為條例一般預期的處理時間。",
        ],
      },
      {
        title: "9. 投訴",
        paragraphs: [
          "如你不滿意我們處理個人資料的方式，請先聯絡 info@bizhkex.com。你亦可向香港個人資料私隱專員公署（PCPD）提出。",
        ],
      },
      {
        title: "10. 政策修訂",
        paragraphs: [
          "我們可能更新本政策，並於本頁刊登新版本及更改上方日期。法律實體一欄會維持待填，直至 Chris 填入註冊名稱及商業登記號碼。",
        ],
      },
      {
        title: "11. 聯絡",
        paragraphs: ["如對本政策有疑問：info@bizhkex.com 或 +852 3565 3138。"],
      },
    ],
  },
};

export function getPrivacyContent(locale: Locale) {
  return CONTENT[locale];
}
