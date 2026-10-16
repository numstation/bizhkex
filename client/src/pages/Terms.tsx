import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { LegalSections } from "@/components/LegalSections";
import { useLocale } from "@/contexts/LocaleContext";
import { getTermsContent } from "@/i18n/pages/termsContent";

export default function Terms() {
  const { locale, path, t } = useLocale();
  const content = getTermsContent(locale);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteNav variant="minimal" />

      <main className="flex-grow">
        <section className="bg-gray-50 border-b border-gray-200 py-12 md:py-16">
          <div className="container max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{content.title}</h1>
            <p className="text-gray-600">{content.updated}</p>
          </div>
        </section>

        <div className="container max-w-3xl py-12 md:py-16">
          <LegalSections sections={content.sections} />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href={path("/")}>
              <Button className="btn-primary">{t.nav.backHome}</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
