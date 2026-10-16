import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { getProviderPitchContent } from "@/i18n/pages/providerPitchContent";

export default function ProviderPitch() {
  const { locale, path } = useLocale();
  const theme = usePublicTheme();
  const c = getProviderPitchContent(locale);
  const { openWhatsApp } = useWhatsApp();

  return (
    <div className={theme.page}>
      <SiteNav />
      <section className="container py-12 md:py-16 max-w-4xl">
        <p className={`${theme.kicker} text-sm font-semibold tracking-widest uppercase mb-3`}>{c.kicker}</p>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Building2 className={`w-6 h-6 ${theme.accent}`} />
          </div>
          <div>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 ${theme.heading}`}>{c.title}</h1>
            <p className={`${theme.muted} text-lg leading-relaxed`}>{c.subtitle}</p>
          </div>
        </div>
        <p className={`font-semibold mb-8 ${theme.accent}`}>{c.commission}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={path("/provider-signup")}>
            <Button className="bg-emerald-600 hover:bg-emerald-500 font-bold py-6 px-8 text-lg w-full sm:w-auto">
              {c.primaryCta}
            </Button>
          </Link>
          <Button
            variant="outline"
            className={`${theme.outlineBtn} font-bold py-6 px-8 text-lg w-full sm:w-auto`}
            onClick={() =>
              openWhatsApp(
                locale === "zh"
                  ? "你好，我想將商務中心上架到 BizHKEx。請講解 5–10% 成功佣金同審核流程。"
                  : "Hi BizHKEx — I want to list a serviced centre. Please explain the 5–10% success commission and review process."
              )
            }
          >
            {c.secondaryCta}
          </Button>
        </div>
      </section>

      <section className="container pb-16 max-w-4xl">
        <h2 className={`text-2xl font-black mb-6 ${theme.heading}`}>{c.stepsTitle}</h2>
        <div className="grid gap-4">
          {c.steps.map((step) => (
            <div key={step.title} className={`${theme.glass} p-6`}>
              <h3 className={`font-bold mb-2 ${theme.heading}`}>{step.title}</h3>
              <p className={`text-sm leading-relaxed ${theme.muted}`}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-16 max-w-4xl">
        <h2 className={`text-2xl font-black mb-6 ${theme.heading}`}>{c.pointsTitle}</h2>
        <ul className="space-y-3">
          {c.points.map((point) => (
            <li key={point} className={`flex items-start gap-2 ${theme.muted}`}>
              <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${theme.accent}`} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className={`${theme.glass} p-6 mt-8`}>
          <h2 className={`font-bold mb-2 ${theme.heading}`}>{c.reviewTitle}</h2>
          <p className={`text-sm leading-relaxed ${theme.muted}`}>{c.reviewBody}</p>
        </div>
        <p className={`text-sm mt-6 ${theme.subtle}`}>{c.contact}</p>
      </section>
      <Footer variant={theme.footerVariant} />
    </div>
  );
}
