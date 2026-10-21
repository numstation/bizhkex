import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import OfficeListingCard from "@/components/OfficeListingCard";
import { Button } from "@/components/ui/button";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { getDistrictName, localizeOffice } from "@shared/officeLocalization";
import { getOfficeInventory } from "@shared/officeInventory";

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
    return offices.filter((office) => {
      const localized = localizeOffice(
        {
          ...office,
          amenitiesJson: Array.isArray(office.amenitiesJson) ? office.amenitiesJson : [],
        },
        locale
      );
      const matchesKeyword =
        !searchKeyword ||
        localized.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        office.address.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesDistrict = !selectedDistrictId || office.districtId === selectedDistrictId;
      return matchesKeyword && matchesDistrict;
    });
  }, [offices, searchKeyword, selectedDistrictId, locale]);

  const featuredOffices = filteredOffices.filter((office) => getOfficeInventory(office).isFeatured);
  const partnerOffices = filteredOffices.filter((office) => getOfficeInventory(office).isPartner);
  const sampleOffices = filteredOffices.filter((office) => getOfficeInventory(office).isSample);

  const sortLabels = {
    price: t.offices.sortPrice,
    rating: t.offices.sortRating,
    reviews: t.offices.sortReviews,
  };

  return (
    <div className={theme.page}>
      <SiteNav />

      <section className="container pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="text-primary text-xs font-medium tracking-[0.16em] uppercase mb-4">
          {t.offices.kicker}
        </p>
        <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${theme.heading}`}>{t.offices.title}</h1>
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
            <Button className={`${theme.primaryBtn} px-6`}>{t.offices.search}</Button>
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            <span className={`text-sm ${theme.subtle} mr-2`}>{t.offices.sort}:</span>
            {(["price", "rating", "reviews"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(sortBy === key ? undefined : key)}
                className={`px-3.5 py-1.5 text-sm rounded-lg border transition-colors ${
                  sortBy === key ? theme.filterActive : theme.filterInactive
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

        {featuredOffices.length > 0 && (
          <div className="mb-10">
            <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${theme.heading}`}>{t.offices.featuredTitle}</h2>
            <p className={`${theme.muted} text-sm mb-5 max-w-2xl`}>{t.offices.featuredSubtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOffices.map((office) => (
                <OfficeListingCard key={office.id} office={office} />
              ))}
            </div>
          </div>
        )}

        {partnerOffices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {partnerOffices.map((office) => (
              <OfficeListingCard key={office.id} office={office} />
            ))}
          </div>
        )}

        {sampleOffices.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
              <div>
                <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${theme.heading}`}>{t.offices.sampleTitle}</h2>
                <p className={`${theme.muted} text-sm max-w-2xl`}>{t.offices.sampleSubtitle}</p>
              </div>
              <Link href={path("/providers")}>
                <Button variant="outline" className={theme.outlineBtn}>
                  {t.offices.listCentreCta}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleOffices.map((office) => (
                <OfficeListingCard key={office.id} office={office} />
              ))}
            </div>
          </div>
        )}

        {filteredOffices.length === 0 && (
          <div className={`text-center py-16 ${theme.muted}`}>
            <p className="mb-4">{t.offices.emptyTitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className={theme.primaryBtn}
                onClick={() => openWhatsApp(t.offices.whatsappQuery)}
              >
                {t.offices.emptyWhatsapp}
              </Button>
              <Link href={path("/providers")}>
                <Button variant="outline" className={theme.outlineBtn}>
                  {t.offices.listCentreCta}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
