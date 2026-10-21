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
import { Link, useLocation } from "wouter";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import SavingsCalculator from "@/components/SavingsCalculator";
import QuoteLeadForm, { type CalcSnapshot } from "@/components/QuoteLeadForm";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { localizeOffice } from "@shared/officeLocalization";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t, path, locale } = useLocale();
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

  const heroOffice = localizeOffice(
    { id: 101, name: "觀塘友邦九龍大樓商務中心", inventoryKind: "operator" as const },
    locale,
  );

  const paths = [
    {
      n: "01",
      title: t.home.officesCardTitle,
      body: t.home.officesCardDesc,
      href: path("/offices"),
    },
    {
      n: "02",
      title: t.home.businessCardTitle,
      body: t.home.businessCardDesc,
      href: path("/business-marketplace"),
    },
    {
      n: "03",
      title: t.home.partnerTitle,
      body: `${t.home.partnerBody} ${t.home.partnerCommission}`,
      href: path("/providers"),
    },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground mb-5">
              {t.home.heroKicker}
            </p>
            <h1 className="text-4xl md:text-[3.25rem] font-bold tracking-tight leading-[1.15] text-foreground mb-5">
              {t.home.heroTitle}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">{t.home.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={path("/offices")}>
                <Button className={`${theme.primaryBtn} h-11 px-5`}>
                  {t.home.officesCardCta}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" className={`${theme.outlineBtn} h-11 px-5 font-medium`}>
                  {t.nav.howItWorks}
                </Button>
              </a>
            </div>
          </div>
          <Link href={path("/office/101")} className="block min-w-0">
            <img
              src="/offices/aia/03-lobby.jpg"
              alt={heroOffice.name}
              className="w-full aspect-[4/3] object-cover rounded-md"
            />
            <p className="mt-2 text-xs text-muted-foreground">{heroOffice.name}</p>
          </Link>
        </div>
      </section>

      <section className="container pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
          {paths.map((item, index) => (
            <Link
              key={item.n}
              href={item.href}
              className={`block py-8 md:py-10 ${index === 0 ? "md:pr-8" : "border-t md:border-t-0 md:border-l border-border md:px-8"}`}
            >
              <p className="text-3xl font-semibold tabular-nums text-foreground mb-4">{item.n}</p>
              <h2 className="text-lg font-semibold text-foreground mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </Link>
          ))}
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
              <p className="text-sm font-semibold text-foreground tabular-nums mb-3">{item.step.padStart(2, "0")}</p>
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
