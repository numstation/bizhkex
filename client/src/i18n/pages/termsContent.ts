import type { Locale } from "../types";

type TermsContent = {
  title: string;
  updated: string;
  sections: Array<{ title: string; paragraphs?: string[]; listItems?: string[] }>;
};

const CONTENT: Record<Locale, TermsContent> = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: 21 October 2026",
    sections: [
      {
        title: "1. Who you are contracting with",
        paragraphs: [
          "These terms govern use of the BizHKEx website. The registered legal entity is not stated on this page yet.",
          "[Chris: insert the registered legal entity name, Business Registration (BR) number and registered office address. No BR number is invented here. Until then, contact BizHKEx at info@bizhkex.com or +852 3565 3138.]",
          "By using the site you agree to these terms. If you do not agree, please stop using the service.",
        ],
      },
      {
        title: "2. What the platform does",
        paragraphs: [
          "BizHKEx introduces serviced-office enquiries and business-transfer enquiries. We operate some centres ourselves, we may list partner centres after review, and we also show labelled sample listings so the layout can be browsed. A sample is not a live offer. Rents and financial figures on samples are placeholders until confirmed.",
          "A match, a viewing or an introduction is not itself a lease or a sale. The contract is between you and the centre operator, landlord, seller or buyer, as the case may be.",
        ],
      },
      {
        title: "3. Fees",
        paragraphs: [
          "Serviced offices and coworking: a success commission of about 5–10% is charged only to the landlord, operator or centre provider. The tenant or renter pays 0%. The exact percentage is confirmed in writing before a deal completes. Nothing is charged merely for browsing or for submitting an inquiry.",
          "Business transfers (生意頂讓): both the buyer and the seller pay a success commission when a transfer completes. Unless a different figure is agreed in writing, the range is about 5–10%. Submitting an inquiry or asking for a financial pack has no extra fee. Sample figures are not verified accounts.",
          "There is no fee before a deal completes, and an unapproved listing is not published.",
        ],
      },
      {
        title: "4. Listings and accuracy",
        paragraphs: [
          "Operator centres are described as operated by BizHKEx. Partner listings appear only after review. Sample listings are badged and must not be treated as available stock or as audited financials.",
          "The site may contain technical, typographical or photographic errors. We do not warrant that every figure is complete or current. Confirmed office rents are given on request. You should verify licences, leases and accounts before you commit to a transfer.",
        ],
      },
      {
        title: "5. Your use of the site",
        paragraphs: ["You may browse the site for your own genuine enquiry. You may not:"],
        listItems: [
          "Copy the site for a competing service or public display",
          "Attempt to decompile or reverse engineer the software",
          "Remove copyright or proprietary notices",
          "Misrepresent a sample listing as a verified offer",
          "Break applicable Hong Kong law",
        ],
      },
      {
        title: "6. Personal data",
        paragraphs: [
          "Personal data is handled as described in the Privacy Policy, which is written with the Hong Kong Personal Data (Privacy) Ordinance (Cap. 486) in mind. The privacy policy names the same contact points and the same legal-entity placeholder.",
        ],
      },
      {
        title: "7. Disclaimer and liability",
        paragraphs: [
          "Materials are provided as they are. BizHKEx does not guarantee that a centre is available, that a business will perform as a sample figure suggests, or that a saving estimate equals your actual cost.",
          "To the extent Hong Kong law allows, BizHKEx is not liable for loss of profit, data or business arising from use of the site or from a deal you sign with a third party.",
        ],
      },
      {
        title: "8. Links",
        paragraphs: [
          "We have not reviewed every site linked from BizHKEx and we are not responsible for those sites. A link is not an endorsement.",
        ],
      },
      {
        title: "9. Changes",
        paragraphs: [
          "We may revise these terms by posting a new version on this page. Continuing to use the site means you accept the current version.",
        ],
      },
      {
        title: "10. Governing law",
        paragraphs: [
          "These terms are governed by Hong Kong law. You submit to the exclusive jurisdiction of the Hong Kong courts.",
        ],
      },
      {
        title: "11. Contact",
        paragraphs: ["Questions about these terms: info@bizhkex.com or +852 3565 3138. Centre operators may also write to providers@bizhkex.com."],
      },
    ],
  },
  zh: {
    title: "服務條款",
    updated: "最後更新：2026年10月21日",
    sections: [
      {
        title: "1. 合約對方（法律實體待填）",
        paragraphs: [
          "本條款規管 BizHKEx 網站的使用。註冊法律實體尚未在本頁列明。",
          "[Chris：請填入註冊法律實體全名、商業登記號碼（BR）及註冊地址。本頁沒有編造 BR 號碼。填入之前，請以 BizHKEx、info@bizhkex.com 或 +852 3565 3138 聯絡。]",
          "使用本網站即表示你同意本條款。如不同意，請停止使用。",
        ],
      },
      {
        title: "2. 平台做甚麼",
        paragraphs: [
          "BizHKEx 轉介服務式辦公室查詢及生意頂讓查詢。部分中心由我們營運，合作中心經覆核後先上架，同時亦展示已標明的示範盤源，方便瀏覽版面。示範盤源不是在租或在售要約。示範盤上的租金及財務數字在確認前都是樣本。",
          "配對、帶看或介紹本身不是租約或買賣合約。合約由你與中心營運商、業主、賣家或買家（視情況而定）簽訂。",
        ],
      },
      {
        title: "3. 收費",
        paragraphs: [
          "服務式辦公室及共享空間：成功佣金約 5–10%，只向業主、營運商或中心收取。租客或承租人 0%。確實百分比會在成交前以書面確認。瀏覽或提交查詢本身不另收費。",
          "生意頂讓：成交時買家與賣家雙方都要付成功佣金。除非另有書面約定，範圍約 5–10%。提交查詢或索取財務資料不另收費。示範盤上的數字並非已核實帳目。",
          "未成交不收費。未獲審核的資料不會公開上架。",
        ],
      },
      {
        title: "4. 盤源及準確性",
        paragraphs: [
          "由 BizHKEx 營運的中心會如此標示。合作盤源只在覆核後出現。示範盤源有標籤，不應視為可即租貨盤或經審計的財務。",
          "網站可能有技術、排版或相片錯誤。我們不保證每一項數字都完整或最新。寫字樓確認租金會在查詢時提供。決定頂讓前，請自行核實牌照、租約及帳目。",
        ],
      },
      {
        title: "5. 使用規範",
        paragraphs: ["你可為真實查詢而瀏覽本網站。你不得："],
        listItems: [
          "複製網站內容以經營競爭服務或作公開展示",
          "嘗試反編譯或逆向工程網站軟件",
          "移除版權或其他專有標示",
          "把示範盤源說成已核實的要約",
          "違反香港適用法律",
        ],
      },
      {
        title: "6. 個人資料",
        paragraphs: [
          "個人資料按私隱政策處理。該政策以香港《個人資料（私隱）條例》（第486章）為取向，並列明相同聯絡方式及相同的法律實體待填位置。",
        ],
      },
      {
        title: "7. 免責及責任",
        paragraphs: [
          "網站內容按現況提供。BizHKEx 不保證某中心一定有空置、某項生意會達到示範數字，亦不保證慳錢估算等於你的實際成本。",
          "在香港法律允許的範圍內，BizHKEx 無須就使用網站或你與第三方簽訂的交易而引致的利潤、數據或業務損失負責。",
        ],
      },
      {
        title: "8. 外部連結",
        paragraphs: ["我們未審查所有連結網站，對其內容不負責。連結並不代表認可。"],
      },
      {
        title: "9. 條款修訂",
        paragraphs: ["我們可於本頁刊登新版本以修訂條款。繼續使用網站即表示你接受當時有效的版本。"],
      },
      {
        title: "10. 適用法律",
        paragraphs: ["本條款受香港法律管轄。你同意接受香港法院的專屬司法管轄。"],
      },
      {
        title: "11. 聯絡",
        paragraphs: [
          "條款查詢：info@bizhkex.com 或 +852 3565 3138。中心營運商亦可電郵 providers@bizhkex.com。",
        ],
      },
    ],
  },
};

export function getTermsContent(locale: Locale) {
  return CONTENT[locale];
}
