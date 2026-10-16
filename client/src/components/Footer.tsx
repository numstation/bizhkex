import { Link } from "wouter";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface FooterProps {
  variant?: "light" | "dark";
}

export default function Footer({ variant = "light" }: FooterProps) {
  const { t, path } = useLocale();
  const currentYear = new Date().getFullYear();
  const isDark = variant === "dark";
  const homePath = path("/");

  const navigationLinks = [
    { label: t.footer.home, href: homePath },
    { label: t.footer.findOffices, href: path("/offices") },
    { label: t.footer.businessTrading, href: path("/business-marketplace") },
    { label: t.footer.knowledgeHub, href: path("/knowledge-hub") },
    { label: t.footer.howItWorks, href: `${homePath}#how-it-works` },
    { label: t.footer.faq, href: `${homePath}#faq` },
    { label: t.footer.forProviders, href: path("/provider-signup") },
  ];

  const districtLinks = t.footer.districtItems.map((item) => ({
    label: item.label,
    href: `${homePath}?district=${item.slug}`,
  }));

  const legalLinks = [
    { label: t.footer.terms, href: path("/terms") },
    { label: t.footer.privacy, href: path("/privacy") },
    { label: t.footer.about, href: path("/about") },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const copyright = `© ${currentYear} ${t.meta.siteName}. ${t.footer.rights}`;

  if (isDark) {
    return (
      <footer className="bg-[#050810] border-t border-white/[0.06] text-white">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            <div className="lg:col-span-4 space-y-5">
              <h3 className="text-2xl font-black tracking-tight">{t.meta.siteName}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{t.footer.tagline}</p>
            </div>
            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-5">
                {t.footer.navigation}
              </h4>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-gray-500 hover:text-white transition-colors text-sm">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-5">
                {t.footer.contact}
              </h4>
              <div className="space-y-2 text-sm text-gray-500">
                <a href="tel:+85235653138" className="block hover:text-white transition-colors">
                  +852 3565 3138
                </a>
                <a href="mailto:info@bizhkex.hk" className="block hover:text-white transition-colors">
                  info@bizhkex.hk
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <p className="text-gray-600 text-sm text-center">{copyright}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-emerald-950 text-white">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-5">
            <h3 className="text-2xl font-black tracking-tight">{t.meta.siteName}</h3>
            <p className="text-emerald-200/80 text-sm leading-relaxed max-w-sm">{t.footer.tagline}</p>
            <div className="space-y-3 pt-1">
              <a
                href="tel:+85235653138"
                className="flex items-center gap-3 text-emerald-200/70 hover:text-white transition-colors text-sm group"
              >
                <span className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center group-hover:bg-emerald-800 transition-colors">
                  <Phone className="w-4 h-4" />
                </span>
                +852 3565 3138
              </a>
              <a
                href="mailto:info@bizhkex.hk"
                className="flex items-center gap-3 text-emerald-200/70 hover:text-white transition-colors text-sm group"
              >
                <span className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center group-hover:bg-emerald-800 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                info@bizhkex.hk
              </a>
              <div className="flex items-center gap-3 text-emerald-200/70 text-sm">
                <span className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </span>
                {t.footer.location}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-5">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-emerald-200/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-5">
              {t.footer.districts}
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {districtLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-emerald-200/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-5">
              {t.footer.legal}
            </h4>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-emerald-200/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              {t.footer.follow}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-emerald-900/60 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900/60">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-emerald-300/60 text-sm">{copyright}</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-emerald-300/60 hover:text-white transition-colors text-sm">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
