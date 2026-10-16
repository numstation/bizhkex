import { Link } from "wouter";
import { MapPin, ChevronRight } from "lucide-react";
import { formatBusinessCode, getMonthlyProfit, isNewBusinessListing, isSampleBusinessListing, publicBusinessBadges, type BusinessListing } from "@shared/businessListings";
import { getBusinessImageUrl } from "@shared/businessImages";
import { localizeBusinessListing } from "@shared/businessLocalization";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";

function formatCurrency(value: number) {
  return `HK$${value.toLocaleString()}`;
}

export default function BusinessListingCard({ listing }: { listing: BusinessListing }) {
  const { path, locale, t } = useLocale();
  const theme = usePublicTheme();
  const item = localizeBusinessListing(listing, locale);
  const monthlyProfit = getMonthlyProfit(item);
  const isNew = isNewBusinessListing(listing.createdAt);
  const imageUrl = getBusinessImageUrl(listing);
  const isSample = isSampleBusinessListing(item);

  return (
    <Link href={path(`/business/${listing.id}`)}>
      <article
        className={`${theme.glass} overflow-hidden ${theme.cardHover} transition-all h-full flex flex-col cursor-pointer group`}
      >
        <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-200 dark:bg-white/[0.04]">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isNew && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow">
                {t.business.newListing}
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600/90 text-white">
              {item.industry}
            </span>
            {isSample && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/55 text-white">
                {t.business.sampleBadge}
              </span>
            )}
          </div>
          <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded">
            {formatBusinessCode(listing.id)}
          </span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <p className={`flex items-center gap-1 text-xs ${theme.subtle} mb-2`}>
            <MapPin className="w-3 h-3 shrink-0" />
            {item.district}
          </p>
          <h3
            className={`font-bold text-sm sm:text-base mb-3 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors ${theme.heading}`}
          >
            {item.title}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className={`${theme.glassInner} rounded-lg p-2.5`}>
              <p className={`${theme.subtle} text-[10px] mb-0.5`}>{t.business.cardAsking}</p>
              <p className={`font-bold ${theme.accent}`}>{formatCurrency(item.askingPrice)}</p>
            </div>
            <div className={`${theme.glassInner} rounded-lg p-2.5`}>
              <p className={`${theme.subtle} text-[10px] mb-0.5`}>{t.business.cardProfit}</p>
              <p className={`font-bold ${theme.heading}`}>{formatCurrency(monthlyProfit)}</p>
            </div>
            <div className={`${theme.glassInner} rounded-lg p-2.5`}>
              <p className={`${theme.subtle} text-[10px] mb-0.5`}>{t.business.cardRent}</p>
              <p className={`font-medium ${theme.body}`}>{formatCurrency(item.monthlyRent)}/mo</p>
            </div>
            <div className={`${theme.glassInner} rounded-lg p-2.5`}>
              <p className={`${theme.subtle} text-[10px] mb-0.5`}>{t.business.cardArea}</p>
              <p className={`font-medium ${theme.body}`}>
                {item.areaSqft} {t.business.sqftUnit}
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.06]">
            <span className={`text-[11px] ${theme.subtle}`}>{item.operationMode}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${theme.accent}`}>
              {t.business.viewDetails}
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
