import type { DemoOffice } from "./demoOffices";

type Locale = "en" | "zh";

const DISTRICT_EN: Record<number, string> = {
  1: "Central",
  2: "Admiralty",
  3: "Wan Chai",
  4: "Causeway Bay",
  5: "Quarry Bay",
  6: "Quarry Bay",
  7: "Mong Kok",
  8: "Tsim Sha Tsui",
  9: "Jordan",
  10: "Kowloon Bay",
  11: "Kwun Tong",
  12: "Sha Tin",
  13: "Tsuen Wan",
  14: "North Point",
};

const OFFICE_EN: Record<
  number,
  { name: string; description: string; amenities?: string[]; occupancyNote?: string }
> = {
  1: {
    name: "IFC Harbour View Business Centre, Central",
    description:
      "Premium workspace in International Finance Centre with harbour views. Private offices, coworking and meeting rooms for finance and professional services.",
  },
  2: {
    name: "Admiralty Lippo Centre Workspace",
    description:
      "Core Admiralty location near government and banking hubs. Flexible terms with utilities, cleaning and reception included.",
  },
  3: {
    name: "Wan Chai Gloucester Road Business Centre",
    description:
      "Prime Wan Chai address with excellent transport links. Offices for 1–20 people, ideal for consultancies and SMEs.",
  },
  4: {
    name: "Causeway Bay Times Square Hub",
    description:
      "Golden Causeway Bay location with retail and dining at your doorstep. Open coworking with private meeting rooms.",
  },
  5: {
    name: "Quarry Bay Waterfront Offices",
    description:
      "Bright waterfront setting at Taikoo Place. Popular with tech and new-economy firms. 24/7 access and enterprise network.",
  },
  6: {
    name: "Quarry Bay Creative Studio",
    description:
      "Industrial-chic layout for design, media and startup teams. Flexible monthly terms without long lock-ins.",
  },
  7: {
    name: "Mong Kok Langham Place Centre",
    description:
      "MTR-connected Mong Kok hub with strong value. Ideal for startups, e-commerce and growing SMEs.",
  },
  8: {
    name: "Tsim Sha Tsui Harbour City Suites",
    description:
      "Ultra-premium TST address with harbour views. Executive service, concierge and high-end finishes.",
  },
  9: {
    name: "Jordan Nathan Road Coworking",
    description:
      "Well-connected Jordan location. Hot desks and dedicated desks for freelancers and small teams.",
  },
  10: {
    name: "Kowloon Bay Tech Centre",
    description:
      "Kowloon East hub near Kai Tak. Modern tech workspace with IT support and collaboration zones.",
  },
  11: {
    name: "Kwun Tong Millennium City Sample Desks",
    description:
      "Sample listing that shows how a Kwun Tong coworking card looks. This is not the BizHKEx-operated APM centre. Rent, photos and ratings are placeholders.",
  },
  12: {
    name: "Sha Tin New Town Plaza Hub",
    description:
      "Direct Sha Tin MTR access. Enterprise-grade facilities for New Territories regional headquarters.",
  },
  13: {
    name: "Tsuen Wan Nan Fung Centre",
    description:
      "Affordable Tsuen Wan workspace with private offices and virtual office packages.",
  },
  14: {
    name: "Central Landmark Executive Suite",
    description:
      "Prestigious Central address with panoramic harbour views. Executive suites and private boardrooms.",
  },
  15: {
    name: "North Point City Centre",
    description:
      "Island East transport hub at competitive rates. Modern offices for trading and professional services.",
  },
  101: {
    name: "AIA Tower Serviced Centre, North Point",
    description:
      "A real centre operated by BizHKEx at AIA Tower, 183 Electric Road, North Point. The rooms are fully let — join the waitlist. Photos on this page are from the centre. Confirmed prices are not published yet — WhatsApp the team for the waitlist and a quote.",
    occupancyNote: "Fully let — waitlist open",
  },
  102: {
    name: "APM Serviced Centre, Kwun Tong",
    description:
      "A real centre operated by BizHKEx at APM, Millennium City 5, 418 Kwun Tong Road. About 35–40% occupied, with rooms still available to enquire. Photos on this page are from the centre. Confirmed prices are not published yet — WhatsApp the team for availability and a quote.",
    occupancyNote: "About 35–40% occupied — rooms available to enquire",
  },
};

const AMENITY_EN: Record<string, string> = {
  "高速 WiFi": "High-speed WiFi",
  "會議室": "Meeting rooms",
  "接待服務": "Reception service",
  "24小時門禁": "24/7 access",
  "打印服務": "Printing",
  "茶水間": "Pantry",
  "行政休息室": "Executive lounge",
  "郵件代收": "Mail handling",
  "咖啡吧": "Coffee bar",
  "活動空間": "Event space",
  "廚房": "Kitchen",
  "單車停泊": "Bike storage",
  "社群活動": "Community events",
  "健身室": "Gym",
  "停車場": "Parking",
  "錄影室": "Studio",
  "熱工位": "Hot desk",
  "虛擬辦公室": "Virtual office",
  "IT 支援": "IT support",
  "休息區": "Lounge",
  "禮賓服務": "Concierge",
  "餐飲配套": "F&B amenities",
  "行政會議室": "Boardroom",
  "視像設備": "AV equipment",
  "餐飲服務": "Catering",
  "專屬停車": "Dedicated parking",
  "接待處": "Reception desk",
  "多間會議室": "Multiple meeting rooms",
  "食堂": "Canteen",
};

export function getDistrictName(districtId: number, locale: Locale, fallback: string): string {
  if (locale === "zh") return fallback;
  return DISTRICT_EN[districtId] ?? fallback;
}

export function localizeOffice<
  T extends {
    id: number;
    name: string;
    description?: string | null;
    amenitiesJson?: string[];
    occupancyNote?: string | null;
  },
>(office: T, locale: Locale): T {
  if (locale === "zh") return office;
  const en = OFFICE_EN[office.id];
  if (!en) return office;
  const amenities = office.amenitiesJson ?? [];
  return {
    ...office,
    name: en.name,
    description: en.description,
    occupancyNote: en.occupancyNote ?? office.occupancyNote,
    amenitiesJson: en.amenities ?? amenities.map((a) => AMENITY_EN[a] ?? a),
  };
}
