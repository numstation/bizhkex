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

      <section className="container pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary text-xs font-medium tracking-[0.16em] uppercase mb-5">
            {t.home.heroKicker}
          </p>
          <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-5 ${theme.heading}`}>
            {t.home.heroTitle}
          </h1>
          <p className={`text-base md:text-lg ${theme.muted} leading-relaxed max-w-2xl`}>{t.home.heroSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={path("/offices")} className="md:col-span-1 lg:col-span-1">
            <div className={`${theme.glass} p-6 h-full ${theme.cardHover} transition-colors`}>
              <Building2 className="w-5 h-5 text-primary mb-5" strokeWidth={1.75} />
              <h3 className={`text-lg font-semibold mb-2 ${theme.heading}`}>{t.home.officesCardTitle}</h3>
              <p className={`${theme.subtle} text-sm leading-relaxed mb-5`}>{t.home.officesCardDesc}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                {t.home.officesCardCta} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href={path("/business-marketplace")} className="md:col-span-1 lg:col-span-1">
            <div className={`${theme.glass} p-6 h-full ${theme.cardHover} transition-colors`}>
              <Store className="w-5 h-5 text-primary mb-5" strokeWidth={1.75} />
              <h3 className={`text-lg font-semibold mb-2 ${theme.heading}`}>{t.home.businessCardTitle}</h3>
              <p className={`${theme.subtle} text-sm leading-relaxed mb-5`}>{t.home.businessCardDesc}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                {t.home.businessCardCta} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href={path("/providers")} className="md:col-span-2 lg:col-span-2">
            <div className={`${theme.glass} p-6 h-full ${theme.cardHover} transition-colors`}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.75} />
                <h3 className={`text-lg font-semibold ${theme.heading}`}>{t.home.partnerTitle}</h3>
              </div>
              <p className={`${theme.muted} text-sm leading-relaxed mb-3`}>{t.home.partnerBody}</p>
              <p className="text-sm font-medium text-primary mb-5">{t.home.partnerCommission}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                {t.home.partnerCta} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>

        <div className={`${theme.glass} mt-4 overflow-hidden`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {valueProps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 md:p-7 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <h4 className={`font-semibold text-base ${theme.heading}`}>{title}</h4>
                </div>
                <p className={`${theme.subtle} text-sm leading-relaxed`}>{desc}</p>
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
        <h2 className={`text-2xl md:text-3xl font-semibold mb-10 ${theme.heading}`}>{t.home.howTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {howSteps.map((item) => (
            <div key={item.step} className="border-t border-border pt-5">
              <p className="text-sm font-semibold text-primary tabular-nums mb-3">{item.step.padStart(2, "0")}</p>
              <h3 className={`text-lg font-semibold mb-2 ${theme.heading}`}>{item.title}</h3>
              <p className={`${theme.subtle} text-sm leading-relaxed`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="container pb-16 md:pb-24 max-w-3xl">
        <h2 className={`text-2xl md:text-3xl font-semibold mb-8 ${theme.heading}`}>{t.home.faqTitle}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((faq: { id: number; question: string; answer: string }) => (
            <AccordionItem key={faq.id} value={`faq-${faq.id}`} className={`${theme.glass} px-5`}>
              <AccordionTrigger className={`hover:no-underline font-medium text-left ${theme.heading}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className={`${theme.accordionAnswer} pb-4`}>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container pb-20">
        <div className="border-t border-border pt-12 md:pt-16 text-center">
          <h2 className={`text-2xl md:text-3xl font-semibold mb-3 ${theme.heading}`}>{t.home.ctaTitle}</h2>
          <p className={`${theme.muted} mb-8 max-w-xl mx-auto`}>{t.home.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={path("/offices")}>
              <Button className={`${theme.primaryBtn} h-11 px-6 text-base w-full sm:w-auto`}>
                {t.home.ctaOffices}
              </Button>
            </Link>
            <Link href={path("/business-marketplace")}>
              <Button variant="outline" className={`${theme.outlineBtn} h-11 px-6 text-base font-semibold w-full sm:w-auto`}>
                {t.home.ctaBusiness}
              </Button>
            </Link>
            <Link href={path("/providers")}>
              <Button variant="outline" className={`${theme.outlineBtn} h-11 px-6 text-base font-semibold w-full sm:w-auto`}>
                {t.home.ctaProvider}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
