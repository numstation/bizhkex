import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, Phone, ImageOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getVendorSignupContent } from "@/i18n/pages/vendorSignupContent";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useLocale } from "@/contexts/LocaleContext";
import { localizeOffice } from "@shared/officeLocalization";
import { getOfficeInventory } from "@shared/officeInventory";
import { ImageGallery } from "@/components/ImageGallery";
import { DeskTypePricing, AmenityList } from "@/components/DeskTypePricing";
import { PromotionBadge } from "@/components/PromotionBadge";
import { OfficesMap } from "@/components/OfficesMap";

export default function OfficeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t, path, locale } = useLocale();
  const companyLabel = getVendorSignupContent(locale).nameLabel;
  const officeId = id && !isNaN(parseInt(id)) ? parseInt(id) : 0;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const { data: office, isLoading } = trpc.offices.getById.useQuery({ id: officeId }, { enabled: officeId > 0 });
  const { data: photos = [] } = trpc.photos.getByOffice.useQuery({ officeId }, { enabled: officeId > 0 });
  const { data: pricingPackages = [] } = trpc.pricing.getByOffice.useQuery({ officeId }, { enabled: officeId > 0 });
  const { setOfficeInquiry } = useWhatsApp();
  const trackView = trpc.offices.trackView.useMutation();
  const createInquiry = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success(t.business.inquirySuccess);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    },
    onError: () => {
      toast.error(t.business.inquiryError);
    },
  });

  useEffect(() => {
    if (officeId === 0 && id) {
      setLocation(path("/"));
    }
  }, [officeId, id, setLocation, path]);

  const localizedOfficeName = office
    ? localizeOffice(
        {
          ...office,
          amenitiesJson: Array.isArray(office.amenitiesJson) ? office.amenitiesJson : [],
        },
        locale
      ).name
    : undefined;

  useEffect(() => {
    if (office?.id) {
      trackView.mutate({ officeId: office.id });
      setOfficeInquiry(office.id, localizedOfficeName);
    }
  }, [office?.id, localizedOfficeName, trackView, setOfficeInquiry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInquiry.mutate({
      officeId,
      ...formData,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">{t.officeDetail.loading}</div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-xl mb-4 text-gray-900">{t.officeDetail.notFound}</p>
        <Button className="btn-primary" onClick={() => setLocation(path("/offices"))}>
          {t.officeDetail.backListings}
        </Button>
      </div>
    );
  }

  const displayOffice = localizeOffice(
    {
      ...office,
      amenitiesJson: Array.isArray(office.amenitiesJson) ? office.amenitiesJson : [],
    },
    locale
  );
  const amenities = Array.isArray(displayOffice.amenitiesJson) ? displayOffice.amenitiesJson : [];
  const pricing = office.pricing || [];
  const meta = getOfficeInventory(office);
  const showPromo = !meta.isSample && office.isPromoted === 1;

  return (
    <div className="min-h-screen bg-white">
      <SiteNav variant="minimal" backLabel={t.officeDetail.backListings} backHref={path("/offices")} />

      <div className="border-b border-gray-200">
        {photos.length > 0 ? (
          <ImageGallery images={photos.map(p => p.photoUrl)} title={displayOffice.name} className="px-4 py-4" />
        ) : office.thumbnailUrl ? (
          <div className="h-80 md:h-96 bg-gray-100 overflow-hidden">
            <img
              src={office.thumbnailUrl}
              alt={displayOffice.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-80 md:h-96 bg-gray-100 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <ImageOff className="w-10 h-10 text-gray-400" />
            <p className="text-gray-600 font-medium">{t.trust.awaitingPhotos}</p>
          </div>
        )}
      </div>

      <div className="container section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {meta.isOperatorOwned && (
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 text-white">
                    {t.trust.operatedBy}
                  </span>
                )}
                {meta.isSample && (
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-700">
                    {t.trust.sampleBadge}
                  </span>
                )}
                {meta.awaitingPhotos && (
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                    {t.trust.awaitingPhotos}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">{displayOffice.name}</h1>
                {showPromo && (
                  <PromotionBadge isPromoted discountPercentage={Number(office.discountPercentage) || 0} />
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-emerald-600 flex-shrink-0" />
                <span>{office.address}</span>
              </div>

              {displayOffice.occupancyNote && (
                <p className="text-sm text-gray-700">{displayOffice.occupancyNote}</p>
              )}

              {meta.isSample && <p className="text-sm text-gray-500">{t.trust.sampleNotice}</p>}

              {meta.showReviews && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(Number(office.rating))
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {office.rating} ({office.reviewCount} {t.officeDetail.reviews})
                  </span>
                </div>
              )}

              {meta.priceOnRequest && (
                <p className="text-lg font-bold text-emerald-700">
                  {meta.isSample ? t.trust.samplePriceOnRequest : t.trust.priceOnRequest}
                </p>
              )}
              {meta.awaitingPhotos && (
                <p className="text-sm text-gray-500">{t.trust.amenityPlaceholder}</p>
              )}
            </div>

            {displayOffice.description && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.officeDetail.about}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {displayOffice.description}
                </p>
              </div>
            )}

            {amenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.officeDetail.amenities}</h2>
                <AmenityList amenities={amenities} />
              </div>
            )}

            {pricingPackages.length > 0 && !meta.priceOnRequest && (
              <DeskTypePricing packages={pricingPackages} />
            )}

            {office.latitude && office.longitude && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.officeDetail.location}</h2>
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <OfficesMap
                    offices={[{
                      id: office.id,
                      name: displayOffice.name,
                      address: office.address,
                      latitude: office.latitude,
                      longitude: office.longitude,
                    }]}
                    className="h-[300px]"
                    initialZoom={15}
                  />
                </div>
              </div>
            )}

            {pricing.length > 0 && !pricingPackages.length && !meta.priceOnRequest && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{t.officeDetail.pricing}</h2>
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Details</th>
                        <th className="text-right">Price</th>
                        <th>Billing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.map((pkg: any) => (
                        <tr key={pkg.id}>
                          <td className="font-medium text-gray-900">{pkg.name}</td>
                          <td className="text-gray-600">
                            {pkg.description || (pkg.capacity ? `Up to ${pkg.capacity} people` : '—')}
                          </td>
                          <td className="text-right font-semibold text-emerald-700">
                            HK${Number(pkg.price).toLocaleString()}
                          </td>
                          <td className="text-gray-500 capitalize">per {pkg.billingCycle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">{t.officeDetail.getInTouch}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t.business.inquiryName} *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-base"
                    placeholder={t.business.inquiryName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t.business.inquiryEmail} *
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-base"
                    placeholder="name@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t.business.inquiryPhone}
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-base"
                    placeholder="+852"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {companyLabel}
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="input-base"
                    placeholder={companyLabel}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t.business.inquiryMessage} *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="input-base min-h-28"
                    placeholder={t.home.leadRequirementsPlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createInquiry.isPending}
                  className="btn-primary w-full"
                >
                  {createInquiry.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t.business.inquirySubmit
                  )}
                </Button>
              </form>

              <div className="border-t border-gray-200 my-6"></div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-emerald-600" />
                  <a href="tel:+85235653138" className="hover:text-emerald-700 transition-colors">
                    +852 3565 3138
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-emerald-600 mt-0.5" />
                  <span>{office.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
