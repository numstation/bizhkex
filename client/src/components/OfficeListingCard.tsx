import { Link } from "wouter";
import { MapPin, ChevronRight, ImageOff } from "lucide-react";
import { PromotionBadge } from "@/components/PromotionBadge";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { getOfficeInventory, type OfficeInventoryFields } from "@shared/officeInventory";
import { localizeOffice } from "@shared/officeLocalization";

type OfficeCardData = OfficeInventoryFields & {
  id: number;
  name: string;
  description?: string | null;
  address: string;
  thumbnailUrl?: string | null;
  rating?: number | string | null;
  reviewCount?: number | string | null;
  basePrice?: number | string | null;
  isPromoted?: number | boolean | null;
  discountPercentage?: number | string | null;
  amenitiesJson?: string[];
  occupancyNote?: string | null;
};

export default function OfficeListingCard({ office }: { office: OfficeCardData }) {
  const { t, path, locale } = useLocale();
  const theme = usePublicTheme();
  const localized = localizeOffice(office, locale);
  const meta = getOfficeInventory(office);
  const showPromo = !meta.isSample && (office.isPromoted === 1 || office.isPromoted === true);

  return (
    <Link href={path(`/office/${office.id}`)}>
      <div className={`${theme.glass} overflow-hidden ${theme.cardHover} transition-colors h-full flex flex-col`}>
        <div className="h-48 bg-muted relative overflow-hidden">
          {office.thumbnailUrl ? (
            <img src={office.thumbnailUrl} alt={localized.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-4 text-center">
              <ImageOff className={`w-8 h-8 ${theme.subtle}`} />
              <span className={`text-xs font-medium ${theme.muted}`}>{t.trust.awaitingPhotos}</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
            {meta.isOperatorOwned && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary text-primary-foreground">
                {t.trust.operatedBy}
              </span>
            )}
            {meta.isSample && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/55 text-white">
                {t.trust.sampleBadge}
              </span>
            )}
            {meta.awaitingPhotos && office.thumbnailUrl && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-white">
                {t.trust.awaitingPhotos}
              </span>
            )}
          </div>
          {showPromo && (
            <PromotionBadge
              isPromoted
              discountPercentage={Number(office.discountPercentage) || 0}
            />
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className={`font-semibold text-lg mb-2 ${theme.heading}`}>{localized.name}</h3>
          <div className={`flex items-center gap-2 mb-3 text-sm ${theme.muted}`}>
            <MapPin size={15} className="text-primary shrink-0" />
            <span className="line-clamp-1">{office.address}</span>
          </div>
          {localized.occupancyNote && (
            <p className={`text-xs mb-3 ${theme.subtle}`}>{localized.occupancyNote}</p>
          )}
          {meta.showReviews && (
            <p className={`text-sm mb-4 ${theme.muted}`}>
              {Number(office.rating).toFixed(1)} ({office.reviewCount} {t.officeDetail.reviews})
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3">
            <span className={`font-semibold ${theme.accent}`}>
              {meta.priceOnRequest
                ? meta.isSample
                  ? t.trust.samplePriceOnRequest
                  : t.trust.priceOnRequest
                : `${t.common.hkd}${Number(office.basePrice).toLocaleString()}${t.offices.perMonth}`}
            </span>
            <span className={`${theme.accent} text-sm flex items-center gap-1 shrink-0`}>
              {t.offices.viewDetails} <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
