import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { CheckCircle, Users, Globe, Award } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getAboutContent } from "@/i18n/pages/aboutContent";

const VALUE_ICONS = [Users, Globe, Award];

export default function About() {
  const { locale, path } = useLocale();
  const c = getAboutContent(locale);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteNav variant="minimal" />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 text-white py-16 md:py-24">
          <div className="container max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6">{c.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">{c.intro}</p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">{c.missionTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">{c.missionP1}</p>
            <p className="text-lg text-gray-600 leading-relaxed">{c.missionP2}</p>
          </div>
        </section>

        <section className="container max-w-6xl py-16 md:py-20">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 text-center">{c.valuesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.values.map((value, index) => {
              const Icon = VALUE_ICONS[index] ?? Users;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-xl p-8 border border-gray-200 text-center hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">{c.whyTitle}</h2>
            <div className="space-y-4">
              {c.whyItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container max-w-4xl py-16 md:py-20">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{c.teamTitle}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">{c.teamP1}</p>
          <p className="text-lg text-gray-600 leading-relaxed">{c.teamP2}</p>
        </section>

        <section className="bg-emerald-950 text-white py-16 md:py-20">
          <div className="container max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">{c.contactTitle}</h2>
            <p className="text-emerald-200/80 mb-8">{c.contactSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-emerald-100">
              <a href="mailto:info@bizhkex.hk" className="hover:text-white transition-colors">
                info@bizhkex.hk
              </a>
              <a href="tel:+85235653138" className="hover:text-white transition-colors">
                +852 3565 3138
              </a>
              <a href="mailto:providers@bizhkex.hk" className="hover:text-white transition-colors">
                providers@bizhkex.hk
              </a>
            </div>
          </div>
        </section>

        <section className="container max-w-4xl py-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{c.ctaTitle}</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={path("/offices")}>
              <Button className="btn-primary px-8 py-3 text-lg">{c.ctaBrowse}</Button>
            </Link>
            <Link href="/provider-signup">
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-700 rounded-lg"
              >
                {c.ctaProvider}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
