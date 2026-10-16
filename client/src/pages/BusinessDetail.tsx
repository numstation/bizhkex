import { useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { formatBusinessCode, getMonthlyProfit, isNewBusinessListing, isSampleBusinessListing, publicBusinessBadges } from "@shared/businessListings";
import { getBusinessImageUrl } from "@shared/businessImages";
import { localizeBusinessListing } from "@shared/businessLocalization";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import BusinessInquiryForm from "@/components/BusinessInquiryForm";
import BusinessListingCard from "@/components/BusinessListingCard";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  TrendingUp,
  Zap,
  BarChart3,
  PieChart,
} from "lucide-react";

function formatCurrency(value: number) {
  return `HK$${value.toLocaleString()}`;
}

function MetricBar({
  label,
  value,
  max,
  color,
  theme,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  theme: ReturnType<typeof usePublicTheme>;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className={theme.muted}>{label}</span>
        <span className={`font-medium ${theme.heading}`}>{formatCurrency(value)}</span>
      </div>
      <div className="h-2.5 bg-gray-200 dark:bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t, path, locale } = useLocale();
  const theme = usePublicTheme();
  const { setBusinessInquiry, openWhatsApp } = useWhatsApp();
  const listingId = id && !isNaN(parseInt(id)) ? parseInt(id) : 0;

  const { data: listing, isLoading } = trpc.business.getById.useQuery(
    { id: listingId },
    { enabled: listingId > 0 }
  );
  const { data: allListings = [] } = trpc.business.list.useQuery({});

  useEffect(() => {
    if (listingId === 0 && id) setLocation(path("/business-marketplace"));
  }, [listingId, id, setLocation, path]);

  useEffect(() => {
    if (listing?.id) setBusinessInquiry(listing.id, listing.title);
  }, [listing?.id, listing?.title, setBusinessInquiry]);

  if (isLoading) {
    return (
      <div className={`${theme.page} flex items-center justify-center ${theme.subtle}`}>
        {t.businessDetail.loading}
      </div>
    );
  }

  if (!listing) {
    return (
      <div className={`${theme.page} flex flex-col items-center justify-center gap-4`}>
        <p>{t.businessDetail.notFound}</p>
        <Link href={path("/business-marketplace")}>
          <span className={`${theme.accent} hover:underline`}>{t.businessDetail.backMarketplace}</span>
        </Link>
      </div>
    );
  }

  const item = localizeBusinessListing(listing, locale);
  const badges = publicBusinessBadges(item);
  const isSample = isSampleBusinessListing(item);
  const monthlyProfit = getMonthlyProfit(item);
  const profitMargin = item.turnover > 0 ? Math.round((item.netProfit / item.turnover) * 100) : 0;
  const rentRatio = item.turnover > 0 ? Math.round(((item.monthlyRent * 12) / item.turnover) * 100) : 0;
  const roi = item.askingPrice > 0 ? Math.round((item.netProfit / item.askingPrice) * 100) : 0;
  const annualRent = item.monthlyRent * 12;
  const chartMax = Math.max(item.turnover, item.netProfit, annualRent);
  const imageUrl = getBusinessImageUrl(listing);
  const isNew = isNewBusinessListing(listing.createdAt);

  const related = allListings
    .filter((l) => l.id !== item.id && (l.industry === item.industry || l.district === item.district))
    .slice(0, 3);

  const metrics = [
    { label: t.businessDetail.askingPrice, value: formatCurrency(item.askingPrice), highlight: true },
    { label: t.businessDetail.monthlyProfit, value: formatCurrency(monthlyProfit), highlight: false },
    { label: t.businessDetail.annualTurnover, value: formatCurrency(item.turnover), highlight: false },
    { label: t.businessDetail.monthlyRent, value: formatCurrency(item.monthlyRent), highlight: false },
    { label: t.businessDetail.area, value: `${item.areaSqft} ${t.businessDetail.sqft}`, highlight: false },
    { label: t.businessDetail.payback, value: `${item.paybackPeriod} ${t.businessDetail.months}`, highlight: false },
  ];

  const handleWhatsApp = () => {
    setBusinessInquiry(item.id, item.title);
    openWhatsApp();
  };

  return (
    <div className={theme.page}>
      <SiteNav />

      <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden bg-gray-200 dark:bg-white/[0.04]">
        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A13] via-[#070A13]/40 to-transparent dark:from-[#070A13]" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent dark:hidden" />
        <div className="absolute bottom-0 left-0 right-0 container pb-6 md:pb-8">
          <Link href={path("/business-marketplace")}>
            <span className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.businessDetail.backMarketplace}
            </span>
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {isNew && (
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500 text-white">
                {t.business.newListing}
              </span>
            )}
            <span className="px-2.5 py-1 rounded text-xs bg-emerald-600/90 text-white">{item.industry}</span>
            <span className="px-2.5 py-1 rounded text-xs bg-black/40 text-white flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.district}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white max-w-3xl">{item.title}</h1>
          <p className="text-emerald-300 font-mono text-sm mt-2">
            {t.businessDetail.projectCode}: {formatBusinessCode(item.id)}
          </p>
        </div>
      </div>

      <section className={`border-b ${theme.divider}`}>
        <div className="container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className={`rounded-xl p-4 border ${
                  m.highlight ? theme.metricBoxAccent : theme.metricBox
                }`}
              >
                <p className={`text-[10px] uppercase tracking-wider ${theme.subtle} mb-1`}>{m.label}</p>
                <p className={`text-base font-bold ${m.highlight ? theme.accent : theme.heading}`}>{m.value}</p>
              </div>
            ))}
          </div>
          {isSample && (
            <p className={`text-sm mt-4 ${theme.muted}`}>{t.trust.sampleNotice}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${theme.glass} p-6 md:p-8`}>
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.heading}`}>
                <BarChart3 className={`w-5 h-5 ${theme.accent}`} />
                {t.businessDetail.financialSnapshot}
              </h2>
              <div className="space-y-4 mb-8">
                <MetricBar
                  label={t.businessDetail.chartTurnover}
                  value={item.turnover}
                  max={chartMax}
                  color="bg-blue-500/70"
                  theme={theme}
                />
                <MetricBar
                  label={t.businessDetail.chartProfit}
                  value={item.netProfit}
                  max={chartMax}
                  color="bg-emerald-500/70"
                  theme={theme}
                />
                <MetricBar
                  label={t.businessDetail.chartRent}
                  value={annualRent}
                  max={chartMax}
                  color="bg-amber-500/50"
                  theme={theme}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className={`text-center p-4 rounded-xl ${theme.glassInner}`}>
                  <PieChart className={`w-5 h-5 ${theme.accent} mx-auto mb-2`} />
                  <p className={`text-2xl font-black ${theme.accent}`}>{profitMargin}%</p>
                  <p className={`text-[10px] ${theme.subtle} mt-1`}>{t.businessDetail.profitMargin}</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${theme.glassInner}`}>
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{rentRatio}%</p>
                  <p className={`text-[10px] ${theme.subtle} mt-1`}>{t.businessDetail.rentRatio}</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${theme.glassInner}`}>
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{roi}%</p>
                  <p className={`text-[10px] ${theme.subtle} mt-1`}>{t.businessDetail.roi}</p>
                </div>
              </div>
            </div>

            <div className={`${theme.glass} p-6 md:p-8 space-y-6`}>
              <div>
                <h2 className={`text-lg font-bold mb-3 ${theme.heading}`}>{t.businessDetail.intro}</h2>
                <p className={`${theme.muted} leading-relaxed text-sm`}>{item.description}</p>
              </div>
              <div>
                <h2 className={`text-lg font-bold mb-3 ${theme.heading}`}>{t.businessDetail.transferReason}</h2>
                <p className={`${theme.muted} leading-relaxed text-sm`}>{item.transferReason}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-sm">
                  <p className={`${theme.subtle} text-xs mb-1`}>{t.businessDetail.transferType}</p>
                  <p className={`font-medium ${theme.heading}`}>{item.transferType}</p>
                </div>
                <div className="text-sm">
                  <p className={`${theme.subtle} text-xs mb-1`}>{t.businessDetail.operationMode}</p>
                  <p className={`font-medium ${theme.heading}`}>{item.operationMode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className={`${theme.glass} p-6 sticky top-24`}>
              <p className={`text-xs font-mono mb-1 ${theme.subtle}`}>{formatBusinessCode(item.id)}</p>
              <p className={`text-3xl font-black mb-1 ${theme.accent}`}>{formatCurrency(item.askingPrice)}</p>
              <p className={`text-xs mb-5 ${theme.subtle}`}>{t.businessDetail.askingPrice}</p>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mb-5"
              >
                <MessageCircle className="w-5 h-5" />
                {t.businessDetail.cta}
              </button>
              <p className={`text-[11px] text-center mb-6 ${theme.subtle}`}>{t.businessDetail.ctaNote}</p>

              <div className={`border-t pt-5 ${theme.divider}`}>
                <BusinessInquiryForm listingId={item.id} listingTitle={item.title} compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container pb-16">
          <h2 className={`text-xl font-bold mb-6 ${theme.heading}`}>{t.businessDetail.related}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((rel) => (
              <BusinessListingCard key={rel.id} listing={rel} />
            ))}
          </div>
        </section>
      )}

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
