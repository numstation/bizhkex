import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Store,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import VendorPhotoUpload from "@/components/VendorPhotoUpload";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { getVendorSignupContent } from "@/i18n/pages/vendorSignupContent";
import { trpc } from "@/lib/trpc";
import {
  generateVendorListing,
  type GeneratedListing,
  type VendorListingType,
} from "@shared/vendorListingGenerator";

type Step = "choose" | "form" | "ai" | "preview" | "done";

export default function ProviderSignup() {
  const { locale, path } = useLocale();
  const c = getVendorSignupContent(locale);
  const theme = usePublicTheme();
  const glass = theme.glass;

  const [step, setStep] = useState<Step>("choose");
  const [listingType, setListingType] = useState<VendorListingType | null>(null);
  const [aiStepIndex, setAiStepIndex] = useState(0);
  const [generated, setGenerated] = useState<GeneratedListing | null>(null);
  const [referenceId, setReferenceId] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [form, setForm] = useState({
    contactName: "",
    name: "",
    email: "",
    phone: "",
    district: "",
    industry: "F&B",
    summary: "",
    referenceUrl: "",
  });

  const submitMutation = trpc.vendor.submit.useMutation();

  const steps: Step[] = ["choose", "form", "ai", "preview", "done"];
  const stepLabels = [c.stepChoose, c.stepForm, c.stepAi, c.stepPreview, c.stepDone];

  useEffect(() => {
    if (step !== "ai") return;
    setAiStepIndex(0);
    const interval = setInterval(() => {
      setAiStepIndex((i) => Math.min(i + 1, c.aiSteps.length - 1));
    }, 500);
    return () => clearInterval(interval);
  }, [step, c.aiSteps.length]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.contactName || !form.name || !form.email || !form.phone || !form.district || !form.summary) {
      toast.error(c.errors.required);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error(c.errors.email);
      return false;
    }
    return true;
  };

  const runAiGeneration = async () => {
    if (!listingType || !validateForm()) return;
    setStep("ai");
    try {
      const [listing] = await Promise.all([
        Promise.resolve(
          generateVendorListing({
            type: listingType,
            name: form.name,
            district: form.district,
            industry: listingType === "business" ? form.industry : undefined,
            summary: form.summary,
            referenceUrl: form.referenceUrl || undefined,
            locale,
          })
        ),
        new Promise((r) => setTimeout(r, 2600)),
      ]);
      setGenerated(listing);
      setStep("preview");
    } catch {
      toast.error(locale === "zh" ? "生成失敗，請稍後再試" : "Generation failed, please try again");
      setStep("form");
    }
  };

  const handleSubmit = async () => {
    if (!listingType) return;
    try {
      const result = await submitMutation.mutateAsync({
        type: listingType,
        contactName: form.contactName,
        name: form.name,
        email: form.email,
        phone: form.phone,
        district: form.district,
        industry: listingType === "business" ? form.industry : undefined,
        summary: form.summary,
        referenceUrl: form.referenceUrl || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
        locale,
      });
      setReferenceId(result.referenceId);
      setStep("done");
      toast.success(c.successTitle);
    } catch {
      toast.error(locale === "zh" ? "提交失敗，請稍後再試" : "Submission failed, please try again");
    }
  };

  return (
    <div className={theme.page}>
      <SiteNav />

      <section className="container py-10 md:py-14 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">{c.pageTitle}</h1>
          <p className={theme.muted}>{c.pageSubtitle}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const active = steps.indexOf(step) >= i;
            const current = step === s;
            return (
              <div key={s} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    current
                      ? "bg-emerald-600 text-white"
                      : active
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/[0.04] text-gray-600 border border-white/[0.06]"
                  }`}
                >
                  {steps.indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${current ? (theme.isDark ? "text-white" : "text-gray-900") : theme.subtle}`}>
                  {stepLabels[i]}
                </span>
                {i < steps.length - 1 && <div className="w-6 h-px bg-white/[0.08]" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left info panel */}
          <div className={`${glass} p-6 lg:col-span-2 hidden lg:block`}>
            <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold mb-3">{c.leftPanelTitle}</h2>
            <p className={`${theme.muted} text-sm leading-relaxed mb-6`}>{c.leftPanelDesc}</p>
            <ul className="space-y-3">
              {c.leftBullets.map((b) => (
                <li key={b} className={`flex items-start gap-2 text-sm ${theme.muted}`}>
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-3">
            {step === "choose" && (
              <div className={`${glass} p-6 md:p-8`}>
                <h2 className="text-2xl font-bold mb-2">{c.chooseTitle}</h2>
                <p className="text-gray-400 text-sm mb-8">{c.chooseSubtitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setListingType("office")}
                    className={`p-6 rounded-xl border text-left transition-all ${
                      listingType === "office"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]"
                    }`}
                  >
                    <Building2 className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="font-bold mb-2">{c.officeType}</h3>
                    <p className="text-gray-500 text-sm">{c.officeTypeDesc}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType("business")}
                    className={`p-6 rounded-xl border text-left transition-all ${
                      listingType === "business"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]"
                    }`}
                  >
                    <Store className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="font-bold mb-2">{c.businessType}</h3>
                    <p className="text-gray-500 text-sm">{c.businessTypeDesc}</p>
                  </button>
                </div>
                <Button
                  disabled={!listingType}
                  onClick={() => setStep("form")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-6"
                >
                  {c.continue} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === "form" && listingType && (
              <div id="signup-form" className={`${glass} p-6 md:p-8`}>
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6"
                >
                  <ArrowLeft className="w-4 h-4" /> {c.back}
                </button>
                <h2 className="text-2xl font-bold mb-2">{c.formTitle}</h2>
                <p className="text-gray-400 text-sm mb-6">{c.formSubtitle}</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">{c.nameLabel} *</label>
                      <Input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder={
                          listingType === "office" ? c.namePlaceholderOffice : c.namePlaceholderBusiness
                        }
                        className={theme.input}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">{c.contactLabel} *</label>
                      <Input
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        className={theme.input}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">{c.emailLabel} *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={theme.input}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">{c.phoneLabel} *</label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={theme.input}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">{c.districtLabel} *</label>
                      <Select value={form.district} onValueChange={(v) => update("district", v)}>
                        <SelectTrigger className={theme.input}>
                          <SelectValue placeholder={c.districtLabel} />
                        </SelectTrigger>
                        <SelectContent>
                          {c.districts.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {listingType === "business" && (
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">{c.industryLabel} *</label>
                        <Select value={form.industry} onValueChange={(v) => update("industry", v)}>
                          <SelectTrigger className={theme.input}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {c.industries.map((ind) => (
                              <SelectItem key={ind.value} value={ind.value}>
                                {ind.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">{c.summaryLabel} *</label>
                    <p className="text-[11px] text-emerald-400/80 mb-2">{c.summaryHint}</p>
                    <Textarea
                      value={form.summary}
                      onChange={(e) => update("summary", e.target.value)}
                      placeholder={
                        listingType === "office"
                          ? c.summaryPlaceholderOffice
                          : c.summaryPlaceholderBusiness
                      }
                      className={`${theme.input} min-h-28`}
                    />
                  </div>
                  <VendorPhotoUpload
                    label={c.photosLabel}
                    hint={c.photosHint}
                    uploadingLabel={c.photosUploading}
                    maxReachedLabel={c.photosMax}
                    invalidTypeLabel={c.photosInvalidType}
                    tooLargeLabel={c.photosTooLarge}
                    uploadErrorLabel={c.photosUploadError}
                    photos={photoUrls}
                    onChange={setPhotoUrls}
                  />
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">{c.referenceLabel}</label>
                    <Input
                      value={form.referenceUrl}
                      onChange={(e) => update("referenceUrl", e.target.value)}
                      placeholder={c.referencePlaceholder}
                      className={theme.input}
                    />
                  </div>
                </div>

                <Button
                  onClick={runAiGeneration}
                  className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 font-bold py-6 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {c.generateBtn}
                </Button>
              </div>
            )}

            {step === "ai" && (
              <div className={`${glass} p-10 md:p-14 text-center`}>
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-6" />
                <h2 className="text-xl font-bold mb-8">{c.aiTitle}</h2>
                <div className="space-y-3 max-w-sm mx-auto text-left">
                  {c.aiSteps.map((label, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 text-sm transition-opacity ${
                        i <= aiStepIndex ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {i < aiStepIndex ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : i === aiStepIndex ? (
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                      )}
                      <span className={i <= aiStepIndex ? "text-gray-300" : "text-gray-600"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "preview" && generated && (
              <div className={`${glass} p-6 md:p-8`}>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-emerald-400" />
                  {c.previewTitle}
                </h2>
                <p className="text-gray-400 text-sm mb-6">{c.previewSubtitle}</p>

                <div className="bg-white/[0.02] border border-emerald-500/20 rounded-xl p-6 mb-6">
                  {photoUrls[0] && (
                    <div className="mb-4 -mx-2 -mt-2 rounded-lg overflow-hidden h-40">
                      <img src={photoUrls[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg px-3 py-2 mb-4">
                    {c.previewDraftNotice}
                  </p>
                  <h3 className="text-xl font-bold mb-3">{generated.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{generated.description}</p>

                  {generated.type === "office" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">{c.previewOfficePrice}</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          HK${generated.basePrice.toLocaleString()}
                          <span className="text-sm text-gray-500">/mo</span>
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 mb-2">{c.previewAmenities}</p>
                        <div className="flex flex-wrap gap-2">
                          {generated.amenities.map((a) => (
                            <span
                              key={a}
                              className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: c.previewAsking, value: `HK$${generated.askingPrice.toLocaleString()}` },
                          {
                            label: c.previewTurnover,
                            value: `HK$${generated.turnover.toLocaleString()}`,
                          },
                          { label: c.previewProfit, value: `HK$${generated.netProfit.toLocaleString()}` },
                          {
                            label: c.previewPayback,
                            value: `${generated.paybackPeriod} ${locale === "zh" ? "個月" : "mo"}`,
                          },
                        ].map((m) => (
                          <div key={m.label} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                            <p className="text-[10px] text-gray-500">{m.label}</p>
                            <p className="font-bold text-emerald-400 text-sm mt-1">{m.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 h-16 items-end">
                        {[
                          { h: 100, label: c.previewTurnover, val: generated.turnover },
                          { h: (generated.netProfit / generated.turnover) * 100, label: c.previewProfit, val: generated.netProfit },
                          { h: ((generated.monthlyRent * 12) / generated.turnover) * 100, label: "Rent", val: generated.monthlyRent * 12 },
                        ].map((bar) => (
                          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-emerald-500/50 rounded-t-md transition-all duration-700"
                              style={{ height: `${Math.max(12, bar.h * 0.5)}%` }}
                            />
                            <span className="text-[9px] text-gray-500">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {generated.badges.map((b) => (
                          <span
                            key={b}
                            className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-300"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1 border-white/[0.12] text-white hover:bg-white/[0.05]"
                  >
                    {c.editBtn}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-6"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      c.submitBtn
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className={`${glass} p-10 md:p-14 text-center`}>
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-3">{c.successTitle}</h2>
                <p className="text-gray-400 mb-6">{c.successSubtitle}</p>
                {referenceId && (
                  <p className="text-sm text-emerald-400 font-mono mb-8">
                    {c.successRef}: {referenceId}
                  </p>
                )}
                <Link href={path("/")}>
                  <Button className="bg-emerald-600 hover:bg-emerald-500 font-bold px-8">
                    {c.backHome}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          {c.loginPrompt}{" "}
          <Link href={path("/provider")}>
            <span className="text-emerald-400 hover:underline cursor-pointer">{c.loginLink}</span>
          </Link>
        </p>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
