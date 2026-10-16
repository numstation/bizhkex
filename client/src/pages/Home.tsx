import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Zap,
  Clock,
  Briefcase,
  Building2,
  Store,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import SavingsCalculator from "@/components/SavingsCalculator";
import QuoteLeadForm, { type CalcSnapshot } from "@/components/QuoteLeadForm";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t, path } = useLocale();
  const theme = usePublicTheme();
  const [calcSnapshot, setCalcSnapshot] = useState<CalcSnapshot>({
    teamSize: "3-5",
    district: "central",
    monthlySaving: 0,
  });

  const { data: faqs = [] } = trpc.faqs.list.useQuery();

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin");
    else if (user?.role === "provider") navigate("/provider-dashboard");
  }, [user, navigate]);

  if (user?.role && user.role !== "user") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.page}`}>
        <div className={`text-center ${theme.muted}`}>Redirecting…</div>
      </div>
    );
  }

  const valueProps = [
    { icon: Zap, title: t.home.value1Title, desc: t.home.value1Desc },
    { icon: Clock, title: t.home.value2Title, desc: t.home.value2Desc },
    { icon: Briefcase, title: t.home.value3Title, desc: t.home.value3Desc },
  ];

  const howSteps = [
    { step: "1", title: t.home.step1Title, desc: t.home.step1Desc },
    { step: "2", title: t.home.step2Title, desc: t.home.step2Desc },
    { step: "3", title: t.home.step3Title, desc: t.home.step3Desc },
  ];

  const faqItems =
    faqs.length > 0
      ? faqs
      : t.home.fallbackFaqs.map((faq, index) => ({ id: index + 1, ...faq }));

  return (
    <div className={theme.page}>
      <SiteNav />

      <section className="container py-12 md:py-20">
        <div className="mb-10 max-w-4xl">
          <p className={`${theme.kicker} text-sm font-semibold tracking-widest uppercase mb-4`}>
            {t.home.heroKicker}
          </p>
          <h1 className={`text-4xl md:text-6xl font-black leading-tight mb-6 ${theme.heading}`}>{t.home.heroTitle}</h1>
          <p className={`text-lg md:text-xl ${theme.muted} leading-relaxed`}>{t.home.heroSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <Link href={path("/offices")} className="md:col-span-1 lg:col-span-1">
            <div className={`${theme.glass} p-6 h-full ${theme.cardHover} transition-all group cursor-pointer`}>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                <Building2 className={`w-6 h-6 ${theme.accent}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme.heading}`}>{t.home.officesCardTitle}</h3>
              <p className={`${theme.subtle} text-sm mb-4`}>{t.home.officesCardDesc}</p>
              <span className={`${theme.accent} text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                {t.home.officesCardCta} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href={path("/business-marketplace")} className="md:col-span-1 lg:col-span-1">
            <div className={`${theme.glass} p-6 h-full ${theme.cardHover} transition-all group cursor-pointer`}>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                <Store className={`w-6 h-6 ${theme.accent}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme.heading}`}>{t.home.businessCardTitle}</h3>
              <p className={`${theme.subtle} text-sm mb-4`}>{t.home.businessCardDesc}</p>
              <span className={`${theme.accent} text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                {t.home.businessCardCta} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <div className={`${theme.glass} p-6 md:col-span-2 lg:col-span-2 overflow-hidden`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-5 h-5 ${theme.accent}`} />
              <h3 className={`font-bold ${theme.heading}`}>{t.home.tickerTitle}</h3>
              <span className={`w-2 h-2 rounded-full ${theme.isDark ? "bg-emerald-400" : "bg-emerald-600"} animate-pulse`} />
            </div>
            <div className="space-y-3">
              {t.home.ticker.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-2 border-b ${theme.dividerLight} last:border-0`}
                >
                  <span className={`${theme.muted} text-sm`}>{item.label}</span>
                  <div className="text-right">
                    <span className={`${theme.value} text-sm`}>{item.value}</span>
                    <span className={`${theme.accent} text-xs ml-2`}>{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${theme.glass} mt-4 md:mt-5 overflow-hidden`}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x ${theme.divider}`}
          >
            {valueProps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 md:p-6 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Icon className={`w-6 h-6 ${theme.accent}`} />
                </div>
                <div className="min-w-0">
                  <h4 className={`font-bold text-base mb-1 ${theme.heading}`}>{title}</h4>
                  <p className={`${theme.subtle} text-sm leading-relaxed`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section id="lead-form" className="container pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 items-stretch">
          <div className="min-w-0">
            <SavingsCalculator onValuesChange={setCalcSnapshot} />
          </div>
          <div className="min-w-0 lg:sticky lg:top-24 self-start">
            <QuoteLeadForm calcValues={calcSnapshot} />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container pb-16 md:pb-24">
        <h2 className={`text-3xl font-black mb-8 text-center ${theme.heading}`}>{t.home.howTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {howSteps.map((item) => (
            <div key={item.step} className={`${theme.glass} p-6`}>
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4">
                {item.step}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${theme.heading}`}>{item.title}</h3>
              <p className={`${theme.subtle} text-sm`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="container pb-16 md:pb-24 max-w-3xl">
        <h2 className={`text-3xl font-black mb-8 text-center ${theme.heading}`}>{t.home.faqTitle}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((faq: { id: number; question: string; answer: string }) => (
            <AccordionItem key={faq.id} value={`faq-${faq.id}`} className={`${theme.glass} px-6 border-none`}>
              <AccordionTrigger className={`hover:no-underline font-semibold text-left ${theme.heading}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className={`${theme.accordionAnswer} pb-4`}>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container pb-20 text-center">
        <div className={`${theme.glass} p-10 md:p-14`}>
          <h2 className={`text-3xl md:text-4xl font-black mb-4 ${theme.heading}`}>{t.home.ctaTitle}</h2>
          <p className={`${theme.muted} mb-8 max-w-xl mx-auto`}>{t.home.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={path("/offices")}>
              <Button className="bg-emerald-600 hover:bg-emerald-500 font-bold py-6 px-8 text-lg w-full sm:w-auto">
                {t.home.ctaOffices}
              </Button>
            </Link>
            <Link href={path("/business-marketplace")}>
              <Button
                variant="outline"
                className={`${theme.outlineBtn} font-bold py-6 px-8 text-lg w-full sm:w-auto`}
              >
                {t.home.ctaBusiness}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
