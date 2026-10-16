import { sortPublicOffices } from "./officeInventory";

export type DemoDistrict = {
  id: number;
  name: string;
  region: "hong_kong_island" | "kowloon" | "new_territories";
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type DemoOffice = {
  id: number;
  providerId: number;
  name: string;
  description: string;
  districtId: number;
  address: string;
  latitude: number;
  longitude: number;
  thumbnailUrl: string;
  /** Public gallery paths, manifest order. First item is the card thumbnail when set. */
  photoUrls?: string[];
  rating: number;
  reviewCount: number;
  basePrice: number;
  amenitiesJson: string[];
  isPromoted: number;
  discountPercentage: number;
  /** operator = BizHKEx centre, partner = approved third-party, sample = placeholder inventory */
  inventoryKind?: "operator" | "partner" | "sample";
  isFeatured?: number;
  isVerified?: number;
  awaitingPhotos?: number;
  priceOnRequest?: number;
  featuredOrder?: number;
  occupancyNote?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DemoPricingPackage = {
  id: number;
  officeId: number;
  deskType: "private_office" | "dedicated_desk" | "hot_desk" | "virtual_office";
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billingCycle: "monthly" | "quarterly" | "annual";
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
};

const IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA";

export const DEMO_DISTRICTS: DemoDistrict[] = [
  { id: 1, name: "中環", region: "hong_kong_island", displayOrder: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 2, name: "金鐘", region: "hong_kong_island", displayOrder: 2, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 3, name: "灣仔", region: "hong_kong_island", displayOrder: 3, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 4, name: "銅鑼灣", region: "hong_kong_island", displayOrder: 4, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 5, name: "太古", region: "hong_kong_island", displayOrder: 5, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 6, name: "鰂魚涌", region: "hong_kong_island", displayOrder: 6, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 7, name: "旺角", region: "kowloon", displayOrder: 7, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 8, name: "尖沙咀", region: "kowloon", displayOrder: 8, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 9, name: "佐敦", region: "kowloon", displayOrder: 9, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 10, name: "九龍灣", region: "kowloon", displayOrder: 10, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 11, name: "觀塘", region: "kowloon", displayOrder: 11, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 12, name: "沙田", region: "new_territories", displayOrder: 12, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 13, name: "荃灣", region: "new_territories", displayOrder: 13, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 14, name: "北角", region: "hong_kong_island", displayOrder: 6, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
];

export const DEMO_OFFICES: DemoOffice[] = [
  {
    id: 1,
    providerId: 1,
    name: "中環 IFC 海景商務中心",
    description: "位於國際金融中心核心地段，落地玻璃眺望維港。提供獨立辦公室、共享空間及行政會議室，適合金融、法律及專業服務團隊。",
    districtId: 1,
    address: "8 Finance Street, Central, Hong Kong",
    latitude: 22.285,
    longitude: 114.158,
    thumbnailUrl: `${IMG}/office-1-central-HmbXF8vdwB8t8jtvEngsKf.webp`,
    rating: 4.9,
    reviewCount: 186,
    basePrice: 6800,
    amenitiesJson: ["高速 WiFi", "會議室", "接待服務", "24小時門禁", "打印服務", "茶水間"],
    isPromoted: 1,
    discountPercentage: 10,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: 2,
    providerId: 2,
    name: "金鐘力寶中心共享空間",
    description: "金鐘核心商業區，鄰近政府總部及主要銀行。彈性租約，即租即用，包水電、清潔及前台接待。",
    districtId: 2,
    address: "89 Queensway, Admiralty, Hong Kong",
    latitude: 22.278,
    longitude: 114.165,
    thumbnailUrl: `${IMG}/office-3-admiralty-6H7HipLyZ8CpzUm7fqjgwL.webp`,
    rating: 4.8,
    reviewCount: 142,
    basePrice: 5500,
    amenitiesJson: ["高速 WiFi", "會議室", "行政休息室", "郵件代收", "咖啡吧"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: 3,
    providerId: 2,
    name: "灣仔告士打道商務中心",
    description: "灣仔主幹道優質樓層，交通極之便利。提供 1-20 人獨立辦公室及靈活工位，適合顧問公司及中小企。",
    districtId: 3,
    address: "99 Gloucester Road, Wan Chai, Hong Kong",
    latitude: 22.280,
    longitude: 114.173,
    thumbnailUrl: `${IMG}/office-8-wan-chai-Kt2QH4o5RA2rQcEd9ouvrs.webp`,
    rating: 4.7,
    reviewCount: 118,
    basePrice: 4200,
    amenitiesJson: ["高速 WiFi", "會議室", "接待處", "打印掃描", "休息區"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-14T00:00:00.000Z",
    updatedAt: "2026-01-14T00:00:00.000Z",
  },
  {
    id: 4,
    providerId: 3,
    name: "銅鑼灣時代廣場商務樞紐",
    description: "銅鑼灣黃金地段，購物及餐飲配套齊全。開放式共享空間配獨立會議室，適合創意及零售相關企業。",
    districtId: 4,
    address: "1 Matheson Street, Causeway Bay, Hong Kong",
    latitude: 22.279,
    longitude: 114.183,
    thumbnailUrl: `${IMG}/office-2-causeway-mvx5AtpuVUpFEJRnKTkYqQ.webp`,
    rating: 4.6,
    reviewCount: 97,
    basePrice: 3800,
    amenitiesJson: ["高速 WiFi", "活動空間", "廚房", "單車停泊", "社群活動"],
    isPromoted: 1,
    discountPercentage: 15,
    createdAt: "2026-01-16T00:00:00.000Z",
    updatedAt: "2026-01-16T00:00:00.000Z",
  },
  {
    id: 5,
    providerId: 1,
    name: "太古坊海濱辦公空間",
    description: "太古坊海濱長廊旁，環境開揚舒適。科技企業及新經濟公司首選，提供高速網絡及 24 小時出入。",
    districtId: 5,
    address: "18 Hoi Ting Road, Quarry Bay, Hong Kong",
    latitude: 22.287,
    longitude: 114.212,
    thumbnailUrl: `${IMG}/office-10-tai-koo-A4GDtupe5NXDDUjkyxNoDD.webp`,
    rating: 4.8,
    reviewCount: 134,
    basePrice: 4500,
    amenitiesJson: ["高速 WiFi", "會議室", "健身室", "咖啡吧", "停車場"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-18T00:00:00.000Z",
    updatedAt: "2026-01-18T00:00:00.000Z",
  },
  {
    id: 6,
    providerId: 4,
    name: "鰂魚涌港島東創意工作室",
    description: "工業風設計配開放協作空間，適合設計、媒體及初創團隊。月租彈性，無長期合約束縛。",
    districtId: 6,
    address: "979 King's Road, Quarry Bay, Hong Kong",
    latitude: 22.291,
    longitude: 114.200,
    thumbnailUrl: `${IMG}/office-7-quarry-bay-gi4kdXCxwDUYfJfoebxbEm.webp`,
    rating: 4.5,
    reviewCount: 88,
    basePrice: 3200,
    amenitiesJson: ["高速 WiFi", "錄影室", "會議室", "茶水間", "活動場地"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: 7,
    providerId: 3,
    name: "旺角朗豪坊商務中心",
    description: "旺角黃金地段，地鐵上蓋，性價比極高。適合初創、電商及需要彈性擴張的 SME。",
    districtId: 7,
    address: "8 Argyle Street, Mong Kok, Hong Kong",
    latitude: 22.318,
    longitude: 114.170,
    thumbnailUrl: `${IMG}/office-4-mong-kok-SWKcWRx4jsAtBJztziskk4.webp`,
    rating: 4.5,
    reviewCount: 76,
    basePrice: 2500,
    amenitiesJson: ["高速 WiFi", "會議室", "打印服務", "信箱代收", "茶水間"],
    isPromoted: 1,
    discountPercentage: 20,
    createdAt: "2026-01-22T00:00:00.000Z",
    updatedAt: "2026-01-22T00:00:00.000Z",
  },
  {
    id: 8,
    providerId: 5,
    name: "尖沙咀海港城商務套房",
    description: "尖沙咀海濱核心，維港景觀。高端商務中心配大理石大堂及專屬行政服務，適合國際企業。",
    districtId: 8,
    address: "3 Canton Road, Tsim Sha Tsui, Hong Kong",
    latitude: 22.295,
    longitude: 114.168,
    thumbnailUrl: `${IMG}/office-5-tsim-sha-tsui-VxoweseivMWcKRgop4pQJN.webp`,
    rating: 4.9,
    reviewCount: 165,
    basePrice: 7200,
    amenitiesJson: ["行政休息室", "會議室", "禮賓服務", "停車場", "餐飲配套"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-24T00:00:00.000Z",
    updatedAt: "2026-01-24T00:00:00.000Z",
  },
  {
    id: 9,
    providerId: 3,
    name: "佐敦彌敦道共享工位",
    description: "佐敦彌敦道沿線，交通四通八達。熱工位及固定工位選擇，適合自由工作者及小型團隊。",
    districtId: 9,
    address: "238 Nathan Road, Jordan, Hong Kong",
    latitude: 22.304,
    longitude: 114.172,
    thumbnailUrl: `${IMG}/office-9-jordan-5axZDEEgcHu6gou9a5vXkY.webp`,
    rating: 4.4,
    reviewCount: 62,
    basePrice: 2200,
    amenitiesJson: ["高速 WiFi", "熱工位", "會議室", "廚房", "社群活動"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-26T00:00:00.000Z",
    updatedAt: "2026-01-26T00:00:00.000Z",
  },
  {
    id: 10,
    providerId: 4,
    name: "九龍灣宏天廣場科技中心",
    description: "九龍東核心商業區，鄰近啟德及觀塘。現代化科技辦公空間，配伺服器房及 IT 支援。",
    districtId: 10,
    address: "9 Wang Kwong Road, Kowloon Bay, Hong Kong",
    latitude: 22.323,
    longitude: 114.210,
    thumbnailUrl: `${IMG}/office-13-kowloon-bay-ZSVxXnF3SoGyTPRRzJdhj9.webp`,
    rating: 4.6,
    reviewCount: 91,
    basePrice: 2800,
    amenitiesJson: ["高速 WiFi", "IT 支援", "會議室", "休息區", "活動空間"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-01-28T00:00:00.000Z",
    updatedAt: "2026-01-28T00:00:00.000Z",
  },
  {
    id: 11,
    providerId: 4,
    name: "觀塘創紀之城示範工位",
    description: "示範盤源，用來展示觀塘一帶共享空間版面。並非 BizHKEx 營運的 APM 中心；租金、相片及評分均為樣本，請以上方「由 BizHKEx 營運」的真實中心為準。",
    districtId: 11,
    address: "1 Kwun Tong Road, Kwun Tong, Hong Kong",
    latitude: 22.312,
    longitude: 114.225,
    thumbnailUrl: `${IMG}/office-13-kowloon-bay-ZSVxXnF3SoGyTPRRzJdhj9.webp`,
    rating: 4.5,
    reviewCount: 84,
    basePrice: 2600,
    amenitiesJson: ["高速 WiFi", "會議室", "打印服務", "茶水間", "停車場"],
    isPromoted: 0,
    discountPercentage: 0,
    inventoryKind: "sample",
    createdAt: "2026-01-30T00:00:00.000Z",
    updatedAt: "2026-01-30T00:00:00.000Z",
  },
  {
    id: 12,
    providerId: 6,
    name: "沙田新城市廣場商務樞紐",
    description: "沙田站直達，新界東首選商務中心。大型會議設施及企業級配套，適合區域總部。",
    districtId: 12,
    address: "1 Sha Tin Centre Street, Sha Tin, Hong Kong",
    latitude: 22.382,
    longitude: 114.188,
    thumbnailUrl: `${IMG}/office-6-shatin-JUVWjL5oxfiAuh6gBwZcgz.webp`,
    rating: 4.7,
    reviewCount: 109,
    basePrice: 3000,
    amenitiesJson: ["高速 WiFi", "多間會議室", "食堂", "停車場", "健身室"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: 13,
    providerId: 6,
    name: "荃灣南豐中心辦公空間",
    description: "荃灣核心商業區，租金相宜。提供獨立辦公室及虛擬辦公室方案，適合新界區企業。",
    districtId: 13,
    address: "264-298 Castle Peak Road, Tsuen Wan, Hong Kong",
    latitude: 22.371,
    longitude: 114.118,
    thumbnailUrl: `${IMG}/office-11-new-territories-DbShYD9EAqe7b6NiqLEZ98.webp`,
    rating: 4.4,
    reviewCount: 58,
    basePrice: 2100,
    amenitiesJson: ["高速 WiFi", "會議室", "虛擬辦公室", "郵件代收", "茶水間"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-02-03T00:00:00.000Z",
    updatedAt: "2026-02-03T00:00:00.000Z",
  },
  {
    id: 14,
    providerId: 1,
    name: "中環置地廣場行政套房",
    description: "中環最高端商務地址之一，尊享維港全景。獨立行政套房配專屬會議室及貴賓接待。",
    districtId: 1,
    address: "15 Queen's Road Central, Central, Hong Kong",
    latitude: 22.281,
    longitude: 114.159,
    thumbnailUrl: `${IMG}/office-12-central-meeting-6HU22V6VKeWv38gH7PP7iQ.webp`,
    rating: 4.9,
    reviewCount: 152,
    basePrice: 9500,
    amenitiesJson: ["行政會議室", "視像設備", "餐飲服務", "專屬停車", "禮賓服務"],
    isPromoted: 1,
    discountPercentage: 5,
    createdAt: "2026-02-05T00:00:00.000Z",
    updatedAt: "2026-02-05T00:00:00.000Z",
  },
  {
    id: 15,
    providerId: 2,
    name: "北角城中心商務空間",
    description: "港島東交通樞紐，租金較中環相宜。現代化辦公環境，適合物流、貿易及專業服務。",
    districtId: 6,
    address: "1 Java Road, North Point, Hong Kong",
    latitude: 22.293,
    longitude: 114.198,
    thumbnailUrl: `${IMG}/office-15-fortress-hill-9f5xaKwLgrfX24GvBe8xJK.webp`,
    rating: 4.6,
    reviewCount: 73,
    basePrice: 3400,
    amenitiesJson: ["高速 WiFi", "會議室", "接待處", "打印服務", "休息區"],
    isPromoted: 0,
    discountPercentage: 0,
    createdAt: "2026-02-07T00:00:00.000Z",
    updatedAt: "2026-02-07T00:00:00.000Z",
  },
  {
    id: 101,
    providerId: 1,
    name: "北角 AIA Tower 商務中心",
    description:
      "BizHKEx 自家營運中心，地址為北角電氣道 183 號 AIA Tower。現時房間已全部租出，歡迎登記候補。頁面相片為中心實景；正式租金仍待確認，請用 WhatsApp 向團隊查詢候補及報價。",
    districtId: 14,
    address: "AIA Tower, 183 Electric Road, North Point, Hong Kong",
    latitude: 22.2908,
    longitude: 114.2002,
    thumbnailUrl: "/offices/aia/01-exterior.jpg",
    photoUrls: [
      "/offices/aia/01-exterior.jpg",
      "/offices/aia/02-reception.jpg",
      "/offices/aia/03-lobby.jpg",
      "/offices/aia/04-room-a.jpg",
      "/offices/aia/05-room-b.jpg",
      "/offices/aia/06-room-c.jpg",
      "/offices/aia/07-room-d.jpg",
      "/offices/aia/08-room-f.jpg",
      "/offices/aia/09-hot-desk.jpg",
    ],
    rating: 0,
    reviewCount: 0,
    basePrice: 0,
    amenitiesJson: ["接待服務", "會議室", "高速 WiFi"],
    isPromoted: 0,
    discountPercentage: 0,
    inventoryKind: "operator",
    isFeatured: 1,
    isVerified: 1,
    awaitingPhotos: 0,
    priceOnRequest: 1,
    featuredOrder: 1,
    occupancyNote: "現已全部租出，可登記候補",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: 102,
    providerId: 1,
    name: "觀塘 APM 商務中心",
    description:
      "BizHKEx 自家營運中心，位於觀塘 APM（創紀之城五期，觀塘道 418 號）。現時出租率約 35–40%，仍有房間可查詢。頁面相片為中心實景；正式租金仍待確認，請用 WhatsApp 索取現時空置及報價。",
    districtId: 11,
    address: "APM, Millennium City 5, 418 Kwun Tong Road, Kwun Tong, Hong Kong",
    latitude: 22.3122,
    longitude: 114.2253,
    thumbnailUrl: "/offices/apm/01-reception.jpg",
    photoUrls: [
      "/offices/apm/01-reception.jpg",
      "/offices/apm/02-reception-2.jpg",
      "/offices/apm/03-meeting-1.jpg",
      "/offices/apm/04-meeting-2.jpg",
      "/offices/apm/05-meeting-3.jpg",
      "/offices/apm/06-pantry.jpg",
      "/offices/apm/07-room-6-8.jpg",
      "/offices/apm/08-room-10.jpg",
      "/offices/apm/09-room-1-3.jpg",
      "/offices/apm/10-room-3-6.jpg",
    ],
    rating: 0,
    reviewCount: 0,
    basePrice: 0,
    amenitiesJson: ["接待服務", "會議室", "高速 WiFi"],
    isPromoted: 0,
    discountPercentage: 0,
    inventoryKind: "operator",
    isFeatured: 1,
    isVerified: 1,
    awaitingPhotos: 0,
    priceOnRequest: 1,
    featuredOrder: 2,
    occupancyNote: "現時出租率約 35–40%，仍有房間可查詢",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  },
];

export const DEMO_PRICING_PACKAGES: DemoPricingPackage[] = [
  { id: 1, officeId: 1, deskType: "hot_desk", name: "靈活工位", description: "共享空間固定工位", price: 6800, currency: "HKD", billingCycle: "monthly", capacity: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 2, officeId: 1, deskType: "private_office", name: "獨立辦公室 (4人)", description: "海景獨立辦公室", price: 22000, currency: "HKD", billingCycle: "monthly", capacity: 4, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 3, officeId: 7, deskType: "hot_desk", name: "熱工位", description: "按月靈活使用", price: 2500, currency: "HKD", billingCycle: "monthly", capacity: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 4, officeId: 7, deskType: "dedicated_desk", name: "固定工位", description: "專屬工位連儲物櫃", price: 3800, currency: "HKD", billingCycle: "monthly", capacity: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 5, officeId: 7, deskType: "private_office", name: "獨立辦公室 (6人)", description: "適合小型團隊", price: 12000, currency: "HKD", billingCycle: "monthly", capacity: 6, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 6, officeId: 8, deskType: "private_office", name: "海景獨立辦公室", description: "維港景觀", price: 7200, currency: "HKD", billingCycle: "monthly", capacity: 2, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 7, officeId: 13, deskType: "virtual_office", name: "虛擬辦公室", description: "商業登記地址及郵件代收", price: 800, currency: "HKD", billingCycle: "monthly", capacity: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 8, officeId: 13, deskType: "hot_desk", name: "共享工位", description: "彈性使用", price: 2100, currency: "HKD", billingCycle: "monthly", capacity: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
];

export function sortDemoOffices(
  offices: DemoOffice[],
  sortBy?: string,
  sortOrder?: "asc" | "desc"
): DemoOffice[] {
  return sortPublicOffices(offices, sortBy, sortOrder);
}

export function paginateDemoOffices<T>(items: T[], limit?: number, offset?: number): T[] {
  const start = offset ?? 0;
  const end = limit ? start + limit : undefined;
  return items.slice(start, end);
}

export function getDemoOfficeById(id: number): DemoOffice | undefined {
  return DEMO_OFFICES.find((office) => office.id === id);
}

/** Gallery rows for operator centres when officePhotos has no database rows yet. */
export function getDemoOfficePhotoRecords(officeId: number) {
  const office = getDemoOfficeById(officeId);
  const urls = office?.photoUrls ?? [];
  return urls.map((photoUrl, index) => ({
    id: officeId * 100 + index + 1,
    officeId,
    photoUrl,
    displayOrder: index,
    createdAt: office?.createdAt ?? "2026-03-01T00:00:00.000Z",
  }));
}

export function getDemoPricingByOfficeId(officeId: number): DemoPricingPackage[] {
  const packages = DEMO_PRICING_PACKAGES.filter((pkg) => pkg.officeId === officeId);
  if (packages.length > 0) return packages;

  const office = getDemoOfficeById(officeId);
  if (!office || office.priceOnRequest) return [];

  return [
    {
      id: officeId * 100,
      officeId,
      deskType: "hot_desk",
      name: "靈活工位",
      description: "按月租用，即租即用",
      price: office.basePrice,
      currency: "HKD",
      billingCycle: "monthly",
      capacity: 1,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt,
    },
    {
      id: officeId * 100 + 1,
      officeId,
      deskType: "private_office",
      name: "獨立辦公室",
      description: "適合 2-6 人團隊",
      price: Math.round(office.basePrice * 3.5),
      currency: "HKD",
      billingCycle: "monthly",
      capacity: 4,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt,
    },
  ];
}

export function searchDemoOffices(
  keyword?: string,
  districtId?: number,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
): DemoOffice[] {
  let results = DEMO_OFFICES.filter((office) => {
    const matchesKeyword =
      !keyword ||
      office.name.toLowerCase().includes(keyword.toLowerCase()) ||
      office.address.toLowerCase().includes(keyword.toLowerCase());
    const matchesDistrict = !districtId || office.districtId === districtId;
    return matchesKeyword && matchesDistrict;
  });

  return sortDemoOffices(results, sortBy, sortOrder);
}
