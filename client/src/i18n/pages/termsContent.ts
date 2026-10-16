import type { Locale } from "../types";

type TermsContent = {
  title: string;
  updated: string;
  sections: Array<{ title: string; paragraphs?: string[]; listItems?: string[] }>;
};

const CONTENT: Record<Locale, TermsContent> = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: June 2026",
    sections: [
      {
        title: "1. Agreement to Terms",
        paragraphs: [
          "By accessing and using the BizHKEx website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        ],
      },
      {
        title: "2. Use License",
        paragraphs: [
          "Permission is granted to temporarily download one copy of the materials (information or software) on BizHKEx's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
        ],
        listItems: [
          "Modify or copy the materials",
          "Use the materials for any commercial purpose or for any public display",
          "Attempt to decompile or reverse engineer any software contained on the website",
          "Remove any copyright or other proprietary notations from the materials",
          'Transfer the materials to another person or "mirror" the materials on any other server',
          "Violate any applicable laws or regulations",
        ],
      },
      {
        title: "3. Disclaimer",
        paragraphs: [
          "The materials on BizHKEx's website are provided on an 'as is' basis. BizHKEx makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        ],
      },
      {
        title: "4. Limitations",
        paragraphs: [
          "In no event shall BizHKEx or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BizHKEx's website, even if BizHKEx or an authorized representative has been notified orally or in writing of the possibility of such damage.",
        ],
      },
      {
        title: "5. Accuracy of Materials",
        paragraphs: [
          "The materials appearing on BizHKEx's website could include technical, typographical, or photographic errors. BizHKEx does not warrant that any of the materials on its website are accurate, complete, or current. BizHKEx may make changes to the materials contained on its website at any time without notice.",
        ],
      },
      {
        title: "6. Links",
        paragraphs: [
          "BizHKEx has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by BizHKEx of the site. Use of any such linked website is at the user's own risk.",
        ],
      },
      {
        title: "7. Modifications",
        paragraphs: [
          "BizHKEx may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
        ],
      },
      {
        title: "8. Governing Law",
        paragraphs: [
          "These terms and conditions are governed by and construed in accordance with the laws of Hong Kong, and you irrevocably submit to the exclusive jurisdiction of the courts located in Hong Kong.",
        ],
      },
      {
        title: "9. Contact Information",
        paragraphs: ["If you have any questions about these Terms of Service, please contact us at info@bizhkex.com or +852 3565 3138."],
      },
    ],
  },
  zh: {
    title: "服務條款",
    updated: "最後更新：2026年6月",
    sections: [
      {
        title: "1. 條款同意",
        paragraphs: [
          "當你使用 BizHKEx 網站及相關服務，即表示你同意受本條款約束。如不同意，請停止使用本服務。",
        ],
      },
      {
        title: "2. 使用授權",
        paragraphs: [
          "本網站內容僅供個人、非商業用途之暫時瀏覽。此為使用授權而非產權轉讓，你不得：",
        ],
        listItems: [
          "修改或複製網站內容",
          "將內容用於商業用途或公開展示",
          "嘗試反編譯或逆向工程網站軟件",
          "移除版權或其他專有標示",
          "將內容轉移予他人或在其他伺服器鏡像",
          "違反任何適用法律或法規",
        ],
      },
      {
        title: "3. 免責聲明",
        paragraphs: [
          "BizHKEx 網站內容按「現況」提供，不作任何明示或暗示保證，包括但不限於適銷性、特定用途適用性或知識產權不侵權等保證。",
        ],
      },
      {
        title: "4. 責任限制",
        paragraphs: [
          "在任何情況下，BizHKEx 或其供應商均不對因使用或無法使用網站內容而引致之損失（包括數據或利潤損失、業務中斷等）承擔責任。",
        ],
      },
      {
        title: "5. 內容準確性",
        paragraphs: [
          "網站內容可能包含技術、排版或攝影錯誤。BizHKEx 不保證內容準確、完整或最新，並可隨時修改內容而不另行通知。",
        ],
      },
      {
        title: "6. 外部連結",
        paragraphs: [
          "BizHKEx 未審查所有連結網站，對其內容不承擔責任。連結並不代表 BizHKEx 認可該網站，使用風險由用戶自行承擔。",
        ],
      },
      {
        title: "7. 條款修訂",
        paragraphs: [
          "BizHKEx 可隨時修訂本服務條款。繼續使用網站即表示你同意當時有效之條款版本。",
        ],
      },
      {
        title: "8. 適用法律",
        paragraphs: [
          "本條款受香港法律管轄，你同意接受香港法院之專屬司法管轄。",
        ],
      },
      {
        title: "9. 聯絡方式",
        paragraphs: ["如對本服務條款有任何疑問，請電郵至 info@bizhkex.com 或致電 +852 3565 3138。"],
      },
    ],
  },
};

export function getTermsContent(locale: Locale) {
  return CONTENT[locale];
}
