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

      <section className="container pt-20 pb-16 md:pt-32 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] gap-14 lg:gap-20 items-center">
          <div>
            <p className="text-[13px] tracking-normal text-muted-foreground mb-6">
              {t.home.heroKicker}
            </p>
            <h1 className="text-[2.5rem] md:text-[3.25rem] font-normal tracking-[-0.02em] leading-[1.12] text-foreground mb-6">
              {t.home.heroTitle}
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-9 max-w-md">{t.home.heroSubtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={path("/offices")}>
                <Button className={`${theme.primaryBtn} h-12 px-6 text-[15px] font-medium shadow-[0_1px_1px_rgba(16,24,40,0.04),0_6px_14px_rgba(16,24,40,0.08)]`}>
                  {t.home.officesCardCta}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" className={`${theme.outlineBtn} h-12 px-6 text-[15px] font-medium`}>
                  {t.nav.howItWorks}
                </Button>
              </a>
            </div>
          </div>
          <Link href={path("/office/101")} className="block min-w-0">
            <img
              src="/offices/aia/03-lobby.jpg"
              alt={heroOffice.name}
              className="w-full aspect-[4/3] object-cover rounded-[8px] border border-border"
            />
            <p className="mt-3 text-xs text-muted-foreground">{heroOffice.name}</p>
          </Link>
        </div>
      </section>

      <section id="lead-form" className="container pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-border">
          <div className="min-w-0 py-10 md:py-12 lg:pr-12 lg:border-r border-border">
            <SavingsCalculator onValuesChange={setCalcSnapshot} />
          </div>
          <div className="min-w-0 py-10 md:py-12 border-t lg:border-t-0 lg:pl-12">
            <QuoteLeadForm calcValues={calcSnapshot} />
          </div>
        </div>
      </section>

      <section className="container pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
          {paths.map((item, index) => (
            <Link
              key={item.n}
              href={item.href}
              className={`block py-10 md:py-12 ${index === 0 ? "md:pr-10" : "border-t md:border-t-0 md:border-l border-border md:px-10"}`}
            >
              <p className="text-[2rem] font-normal tabular-nums text-foreground mb-5">{item.n}</p>
              <h2 className="text-base font-medium text-foreground mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container pb-20 md:pb-28">
        <h2 className="text-2xl font-medium tracking-[-0.02em] mb-10 text-foreground">{t.home.howTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {howSteps.map((item, index) => (
            <div
              key={item.step}
              className={`border-t border-border py-8 ${index === 0 ? "md:pr-10" : "md:border-l md:px-10"}`}
            >
              <p className="text-[2rem] font-normal tabular-nums text-foreground mb-4">{item.step.padStart(2, "0")}</p>
              <h3 className="text-base font-medium mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="container pb-20 md:pb-28 max-w-3xl">
        <h2 className="text-2xl font-medium tracking-[-0.02em] mb-2 text-foreground">{t.home.faqTitle}</h2>
        <Accordion type="single" collapsible>
          {faqItems.map((faq: { id: number; question: string; answer: string }) => (
            <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border-b border-border">
              <AccordionTrigger className="hover:no-underline font-medium text-left text-foreground py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container pb-24">
        <div className="border-t border-border pt-16 md:pt-20">
          <h2 className="text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">{t.home.ctaTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl">{t.home.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={path("/offices")}>
              <Button className={`${theme.primaryBtn} h-12 px-6 text-[15px] font-medium w-full sm:w-auto shadow-[0_1px_1px_rgba(16,24,40,0.04),0_6px_14px_rgba(16,24,40,0.08)]`}>
                {t.home.ctaOffices}
              </Button>
            </Link>
            <Link href={path("/business-marketplace")}>
              <Button variant="outline" className={`${theme.outlineBtn} h-12 px-6 text-[15px] font-medium w-full sm:w-auto`}>
                {t.home.ctaBusiness}
              </Button>
            </Link>
            <Link href={path("/providers")}>
              <Button variant="outline" className={`${theme.outlineBtn} h-12 px-6 text-[15px] font-medium w-full sm:w-auto`}>
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
