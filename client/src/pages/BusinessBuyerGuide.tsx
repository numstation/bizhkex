import { Link } from "wouter";
import { ArrowRight, ShieldCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { getBusinessBuyerGuideContent } from "@/i18n/pages/businessBuyerGuideContent";

export default function BusinessBuyerGuide() {
  const { path, locale } = useLocale();
  const theme = usePublicTheme();
  const c = getBusinessBuyerGuideContent(locale);

  return (
    <div className={theme.page}>
      <SiteNav />

      <section className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-gray-900 text-white py-14 md:py-20">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-emerald-200 text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            BizHKEx
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{c.pageTitle}</h1>
          <p className="text-lg text-emerald-100 leading-relaxed mb-8">{c.pageSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={path("/business-marketplace")}>
              <Button className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold w-full sm:w-auto">
                {c.ctaMarketplace} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={path("/provider-signup")}>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                {c.ctaRegister}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <h2 className={`text-2xl font-black mb-10 ${theme.heading}`}>{c.stepsTitle}</h2>
        <div className="space-y-6">
          {c.steps.map((step) => (
            <div key={step.step} className={`${theme.glass} p-6 md:p-8 flex gap-5`}>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
                {step.step}
              </div>
              <div className="min-w-0">
                <h3 className={`text-xl font-bold mb-2 ${theme.heading}`}>{step.title}</h3>
                <p className={`${theme.muted} mb-4`}>{step.desc}</p>
                <ul className="space-y-2">
                  {step.bullets.map((b) => (
                    <li key={b} className={`text-sm ${theme.body} flex items-start gap-2`}>
                      <span className={`${theme.accent} mt-1`}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`border-y ${theme.divider} ${theme.isDark ? "bg-white/[0.02]" : "bg-emerald-50/50"}`}>
        <div className="container py-14 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className={`text-2xl font-black mb-6 ${theme.heading}`}>{c.faqTitle}</h2>
            <div className="space-y-4">
              {c.faqs.map((faq) => (
                <div key={faq.q} className={`${theme.glass} p-5`}>
                  <p className={`font-semibold mb-2 ${theme.heading}`}>{faq.q}</p>
                  <p className={`text-sm ${theme.muted}`}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`${theme.glass} p-6 md:p-8`}>
            <ShieldCheck className={`w-10 h-10 ${theme.accent} mb-4`} />
            <h2 className={`text-xl font-black mb-4 ${theme.heading}`}>{c.protectionTitle}</h2>
            <ul className="space-y-3">
              {c.protectionBullets.map((b) => (
                <li key={b} className={`text-sm ${theme.muted} flex items-start gap-2`}>
                  <ShieldCheck className={`w-4 h-4 ${theme.accent} flex-shrink-0 mt-0.5`} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
