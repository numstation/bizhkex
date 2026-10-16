import type { Locale } from "../types";

type PrivacyContent = {
  title: string;
  updated: string;
  sections: Array<{ title: string; paragraphs?: string[]; listItems?: string[] }>;
};

const CONTENT: Record<Locale, PrivacyContent> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: June 2026",
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          'BizHKEx ("we", "us", "our") operates the BizHKEx website. This policy explains how we collect, use and disclose personal data when you use our services.',
        ],
      },
      {
        title: "2. Information Collection and Use",
        paragraphs: [
          "We collect information to provide and improve our service. This may include:",
        ],
        listItems: [
          "Personal Data: email, name, phone number, address and inquiry details",
          "Usage Data: IP address, browser type, pages visited, visit times and diagnostic data",
        ],
      },
      {
        title: "3. Use of Data",
        paragraphs: ["We use collected data to:"],
        listItems: [
          "Provide and maintain our website",
          "Notify you about changes",
          "Provide customer support",
          "Improve our platform and analyse usage",
          "Detect and prevent technical issues",
        ],
      },
      {
        title: "4. Security of Data",
        paragraphs: [
          "We take reasonable measures to protect your data, but no internet transmission or electronic storage is 100% secure.",
        ],
      },
      {
        title: "5. Changes to This Privacy Policy",
        paragraphs: [
          "We may update this policy from time to time by posting the revised version on this page and updating the effective date.",
        ],
      },
      {
        title: "6. Contact Us",
        paragraphs: ["Questions about this policy? Contact info@bizhkex.hk or +852 3565 3138."],
      },
      {
        title: "7. Your Rights",
        paragraphs: ["You may have the right to:"],
        listItems: [
          "Access personal data we hold about you",
          "Request correction of inaccurate data",
          "Request deletion of your data",
          "Object to or restrict processing",
          "Request data portability where applicable",
        ],
      },
    ],
  },
  zh: {
    title: "私隱政策",
    updated: "最後更新：2026年6月",
    sections: [
      {
        title: "1. 簡介",
        paragraphs: [
          "BizHKEx（「我們」）營運 BizHKEx 網站。本政策說明我們如何在你使用服務時收集、使用及披露個人資料。",
        ],
      },
      {
        title: "2. 資料收集及使用",
        paragraphs: ["我們收集資料以提供及改善服務，可能包括："],
        listItems: [
          "個人資料：電郵、姓名、電話、地址及查詢內容",
          "使用資料：IP 地址、瀏覽器類型、瀏覽頁面、到訪時間及診斷數據",
        ],
      },
      {
        title: "3. 資料用途",
        paragraphs: ["我們使用所收集資料以："],
        listItems: [
          "提供及維護網站",
          "通知你服務變更",
          "提供客戶支援",
          "改善平台及分析使用情況",
          "偵測及防止技術問題",
        ],
      },
      {
        title: "4. 資料安全",
        paragraphs: [
          "我們採取合理措施保護你的資料，但互聯網傳輸及電子儲存無法保證百分百安全。",
        ],
      },
      {
        title: "5. 政策修訂",
        paragraphs: [
          "我們可能不時更新本政策，並於本頁刊登修訂版本及更新生效日期。",
        ],
      },
      {
        title: "6. 聯絡我們",
        paragraphs: ["如對本政策有疑問，請電郵至 info@bizhkex.hk 或致電 +852 3565 3138。"],
      },
      {
        title: "7. 你的權利",
        paragraphs: ["你可能享有以下權利："],
        listItems: [
          "查閱我們持有關於你的個人資料",
          "要求更正不準確資料",
          "要求刪除你的資料",
          "反對或限制資料處理",
          "在適用情況下要求資料可攜性",
        ],
      },
    ],
  },
};

export function getPrivacyContent(locale: Locale) {
  return CONTENT[locale];
}
