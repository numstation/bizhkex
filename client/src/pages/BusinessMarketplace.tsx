import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import BusinessListingCard from "@/components/BusinessListingCard";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { BookOpen, TrendingUp, ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const INDUSTRIES = ["All", "F&B", "Education", "E-commerce", "Beauty", "Services"] as const;

export default function BusinessMarketplace() {
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [districtFilter, setDistrictFilter] = useState<string>("All");
  const { t, path } = useLocale();
  const theme = usePublicTheme();

  const { data: allListings = [] } = trpc.business.list.useQuery({});

  const { data: listings = [], isLoading } = trpc.business.list.useQuery({
    industry: industryFilter === "All" ? undefined : industryFilter,
    district: districtFilter === "All" ? undefined : districtFilter,
  });

  const districts = useMemo(() => {
    const unique = Array.from(new Set(allListings.map((item) => item.district)));
    return ["All", ...unique];
  }, [allListings]);

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of allListings) {
      counts[item.industry] = (counts[item.industry] ?? 0) + 1;
    }
    return counts;
  }, [allListings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const industryMatch = industryFilter === "All" || item.industry === industryFilter;
      const districtMatch = districtFilter === "All" || item.district === districtFilter;
      return industryMatch && districtMatch;
    });
  }, [listings, industryFilter, districtFilter]);

  const stats = [
    { label: t.business.statListings, value: String(allListings.length) },
    { label: t.business.statPayback, value: t.business.statPaybackValue },
    { label: t.business.statFree, value: t.business.statFreeValue },
  ];

  return (
    <div className={theme.page}>
      <SiteNav />

      <section className={`border-b ${theme.divider}`}>
        <div className="container py-12 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-primary text-xs font-medium tracking-[0.16em] uppercase mb-4">
                {t.business.kicker}
              </p>
              <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${theme.heading}`}>
                {t.business.title}
              </h1>
              <p className={`${theme.muted} text-lg leading-relaxed`}>{t.business.subtitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-[280px]">
              {stats.map((stat) => (
                <div key={stat.label} className={`${theme.statCard} p-4 text-center`}>
                  <p className={`text-2xl font-bold ${theme.accent}`}>{stat.value}</p>
                  <p className={`text-xs ${theme.subtle} mt-1`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-6">
        <Link href={path("/business-buyer-guide")}>
          <div
            className={`${theme.savingsHighlight} p-4 md:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer group`}
          >
            <div className="flex items-start gap-3">
              <BookOpen className={`w-6 h-6 ${theme.accent} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`font-semibold ${theme.heading}`}>{t.business.buyerGuide}</p>
                <p className={`text-sm ${theme.muted}`}>{t.business.buyerGuideBanner}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 text-sm font-semibold ${theme.accent} group-hover:gap-2 transition-all`}>
              {t.business.buyerGuideCta}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <p className={`text-xs uppercase tracking-wider ${theme.subtle} mb-3`}>{t.business.industryBrowse}</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {INDUSTRIES.filter((i) => i !== "All").map((industry) => {
            const count = industryCounts[industry] ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={industry}
                type="button"
                onClick={() => setIndustryFilter(industryFilter === industry ? "All" : industry)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  industryFilter === industry ? theme.filterActive : theme.filterPillInactive
                }`}
              >
                <span>{industry}</span>
                <span className="ml-2 opacity-70 text-xs">{t.business.listingsCount(count)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className={`${theme.glass} p-6 md:p-8`}>
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <p className={`text-xs uppercase tracking-wider ${theme.subtle} mb-3`}>{t.business.filterIndustry}</p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => setIndustryFilter(industry)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      industryFilter === industry ? theme.filterActive : theme.filterPillInactive
                    }`}
                  >
                    {industry === "All" ? t.business.allIndustries : industry}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider ${theme.subtle} mb-3`}>{t.business.filterDistrict}</p>
              <div className="flex flex-wrap gap-2">
                {districts.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => setDistrictFilter(district)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      districtFilter === district ? theme.filterActive : theme.filterPillInactive
                    }`}
                  >
                    {district === "All" ? t.business.allDistricts : district}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`${theme.savingsHighlight} p-4 md:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
            <div className="flex items-start gap-3">
              <Store className={`w-6 h-6 ${theme.accent} shrink-0 mt-0.5`} />
              <div>
                <p className={`font-semibold ${theme.heading}`}>{t.business.sellTitle}</p>
                <p className={`text-sm ${theme.muted}`}>{t.business.sellBody}</p>
              </div>
            </div>
            <Link href={path("/provider-signup")}>
              <Button className={theme.primaryBtn}>
                {t.business.sellCta}
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className={`text-center py-16 ${theme.muted}`}>{t.business.loading}</div>
          ) : filteredListings.length === 0 ? (
            <div className={`text-center py-16 ${theme.muted}`}>
              <p className="mb-4">{t.business.empty}</p>
              <Link href={path("/provider-signup")}>
                <Button className={theme.primaryBtn}>{t.business.sellCta}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredListings.map((listing) => (
                <BusinessListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          <div className={`mt-8 flex items-center gap-2 text-xs ${theme.subtle}`}>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            {t.business.footerNote}
          </div>
        </div>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
