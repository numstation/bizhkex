import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { PromotionBadge } from "@/components/PromotionBadge";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { getDistrictName, localizeOffice } from "@shared/officeLocalization";

const REGION_KEYS = ["hong_kong_island", "kowloon", "new_territories"] as const;

export default function Offices() {
  const { openWhatsApp } = useWhatsApp();
  const { t, path, locale } = useLocale();
  const theme = usePublicTheme();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>();
  const [selectedRegion, setSelectedRegion] = useState("hong_kong_island");
  const [sortBy, setSortBy] = useState<"price" | "rating" | "reviews" | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: offices = [] } = trpc.offices.list.useQuery({
    limit: 50,
    sortBy,
    sortOrder,
  });
  const { data: districts = [] } = trpc.districts.list.useQuery();

  const filteredDistricts = useMemo(
    () => districts.filter((d: { region: string }) => d.region === selectedRegion),
    [districts, selectedRegion]
  );

  const filteredOffices = useMemo(() => {
    return offices.filter((office: { id: number; name: string; address: string; districtId: number }) => {
      const localized = localizeOffice(office, locale);
      const matchesKeyword =
        !searchKeyword ||
        localized.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        office.address.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesDistrict = !selectedDistrictId || office.districtId === selectedDistrictId;
      return matchesKeyword && matchesDistrict;
    });
  }, [offices, searchKeyword, selectedDistrictId, locale]);

  const sortLabels = {
    price: t.offices.sortPrice,
    rating: t.offices.sortRating,
    reviews: t.offices.sortReviews,
  };

  return (
    <div className={theme.page}>
      <SiteNav />

      <section className="container py-12 md:py-16">
        <p className={`${theme.kicker} text-sm font-semibold tracking-widest uppercase mb-3`}>
          {t.offices.kicker}
        </p>
        <h1 className={`text-4xl md:text-5xl font-black mb-4 ${theme.heading}`}>{t.offices.title}</h1>
        <p className={`${theme.muted} max-w-2xl`}>{t.offices.subtitle}</p>
      </section>

      <section className="container pb-16 md:pb-24">
        <div className={`${theme.glass} p-6 md:p-8 mb-8`}>
          <div className="flex gap-4 mb-6">
            <Input
              type="text"
              placeholder={t.offices.searchPlaceholder}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className={`flex-1 ${theme.input}`}
            />
            <Button className="bg-emerald-600 hover:bg-emerald-500 font-bold px-8">{t.offices.search}</Button>
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            <span className={`text-sm ${theme.subtle} mr-2`}>{t.offices.sort}:</span>
            {(["price", "rating", "reviews"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(sortBy === key ? undefined : key)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  sortBy === key
                    ? "border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : theme.filterInactive
                }`}
              >
                {sortLabels[key]}
              </button>
            ))}
          </div>

          <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
            <TabsList className={`grid w-full grid-cols-3 ${theme.tabsList}`}>
              {REGION_KEYS.map((region) => (
                <TabsTrigger
                  key={region}
                  value={region}
                  className={theme.tabsTrigger}
                >
                  {t.offices.regions[region]}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedRegion} className="mt-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedDistrictId(undefined)}
                  className={`px-4 py-2 text-sm rounded-lg border ${
                    !selectedDistrictId
                      ? theme.filterActive
                      : theme.filterInactive
                  }`}
                >
                  {t.offices.allDistricts}
                </button>
                {filteredDistricts.map((district: { id: number; name: string }) => (
                  <button
                    key={district.id}
                    onClick={() => setSelectedDistrictId(district.id)}
                    className={`px-4 py-2 text-sm rounded-lg border ${
                      selectedDistrictId === district.id
                        ? theme.filterActive
                        : theme.filterInactive
                    }`}
                  >
                    {getDistrictName(district.id, locale, district.name)}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffices.map((office: {
            id: number;
            name: string;
            description: string;
            address: string;
            thumbnailUrl?: string;
            rating: number;
            reviewCount: number;
            basePrice: number;
            isPromoted: number;
            discountPercentage: number;
            amenitiesJson: string[];
          }) => {
            const localized = localizeOffice(office, locale);
            return (
              <Link key={office.id} href={path(`/office/${office.id}`)}>
                <div className={`${theme.glass} overflow-hidden ${theme.cardHover} transition-all h-full flex flex-col`}>
                  <div className={`h-48 ${theme.glassInner} relative overflow-hidden`}>
                    {office.thumbnailUrl ? (
                      <img src={office.thumbnailUrl} alt={localized.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">🏢</div>
                    )}
                    <PromotionBadge
                      isPromoted={office.isPromoted === 1}
                      discountPercentage={Number(office.discountPercentage) || 0}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className={`font-bold text-lg mb-2 ${theme.heading}`}>{localized.name}</h3>
                    <div className={`flex items-center gap-2 mb-3 text-sm ${theme.muted}`}>
                      <MapPin size={16} className="text-emerald-500" />
                      <span className="line-clamp-1">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(office.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${theme.muted}`}>
                        {office.rating} ({office.reviewCount})
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className={`font-bold ${theme.accent}`}>
                        {t.common.hkd}
                        {Number(office.basePrice).toLocaleString()}
                        {t.offices.perMonth}
                      </span>
                      <span className={`${theme.accent} text-sm flex items-center gap-1`}>
                        {t.offices.viewDetails} <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredOffices.length === 0 && (
          <div className={`text-center py-16 ${theme.muted}`}>
            <p className="mb-4">{t.offices.emptyTitle}</p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-500"
              onClick={() => openWhatsApp(t.offices.whatsappQuery)}
            >
              {t.offices.emptyWhatsapp}
            </Button>
          </div>
        )}
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
