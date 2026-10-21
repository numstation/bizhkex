import { Link } from "wouter";
import { MapPin, ChevronRight } from "lucide-react";
import { formatBusinessCode, getMonthlyProfit, isNewBusinessListing, isSampleBusinessListing, type BusinessListing } from "@shared/businessListings";
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
        className={`${theme.glass} overflow-hidden ${theme.cardHover} transition-colors h-full flex flex-col cursor-pointer group`}
      >
        <div className="relative h-44 sm:h-48 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isNew && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow">
                {t.business.newListing}
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary text-primary-foreground">
              {item.industry}
            </span>
            {isSample && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/55 text-white">
                {t.business.sampleBadge}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <p className={`text-[11px] font-mono mb-2 ${theme.subtle}`}>{formatBusinessCode(listing.id)}</p>
          <p className={`flex items-center gap-1 text-xs ${theme.subtle} mb-2`}>
            <MapPin className="w-3 h-3 shrink-0" />
            {item.district}
          </p>
          <h3
            className={`font-semibold text-sm sm:text-base mb-4 line-clamp-2 group-hover:text-primary transition-colors ${theme.heading}`}
          >
            {item.title}
          </h3>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs border-t border-border pt-3 mb-4">
            <div>
              <dt className={theme.subtle}>{t.business.cardAsking}</dt>
              <dd className={`font-semibold mt-0.5 ${theme.accent}`}>{formatCurrency(item.askingPrice)}</dd>
            </div>
            <div>
              <dt className={theme.subtle}>{t.business.cardProfit}</dt>
              <dd className={`font-semibold mt-0.5 ${theme.heading}`}>{formatCurrency(monthlyProfit)}</dd>
            </div>
            <div>
              <dt className={theme.subtle}>{t.business.cardRent}</dt>
              <dd className={`font-medium mt-0.5 ${theme.body}`}>{formatCurrency(item.monthlyRent)}/mo</dd>
            </div>
            <div>
              <dt className={theme.subtle}>{t.business.cardArea}</dt>
              <dd className={`font-medium mt-0.5 ${theme.body}`}>
                {item.areaSqft} {t.business.sqftUnit}
              </dd>
            </div>
          </dl>

          {isSample && (
            <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300 mb-3">
              {t.business.unverifiedFigures}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
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
