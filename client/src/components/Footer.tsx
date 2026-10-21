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
    { label: t.footer.forProviders, href: path("/providers") },
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
      <footer className="bg-card border-t border-border text-foreground">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            <div className="lg:col-span-4 space-y-5">
              <h3 className="text-xl font-semibold tracking-tight">{t.meta.siteName}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">{t.footer.tagline}</p>
            </div>
            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-5">
                {t.footer.navigation}
              </h4>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-5">
                {t.footer.contact}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="tel:+85235653138" className="block hover:text-foreground transition-colors">
                  +852 3565 3138
                </a>
                <a href="mailto:info@bizhkex.com" className="block hover:text-foreground transition-colors">
                  info@bizhkex.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <p className="text-muted-foreground text-sm text-center">{copyright}</p>
          </div>
        </div>
      </footer>
    );
  }

  const headingClass = "text-xs font-medium text-muted-foreground mb-4";
  const itemClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";

  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-base font-medium tracking-tight text-foreground">{t.meta.siteName}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">{t.footer.tagline}</p>
            <div className="space-y-2 pt-1 text-sm text-muted-foreground">
              <a href="tel:+85235653138" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="w-3.5 h-3.5" />
                +852 3565 3138
              </a>
              <a href="mailto:info@bizhkex.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-3.5 h-3.5" />
                info@bizhkex.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                {t.footer.location}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className={headingClass}>{t.footer.navigation}</h4>
            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className={itemClass}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className={headingClass}>{t.footer.districts}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {districtLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className={itemClass}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className={headingClass}>{t.footer.legal}</h4>
            <ul className="space-y-2.5 mb-8">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className={itemClass}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className={headingClass}>{t.footer.follow}</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <p className="text-muted-foreground text-sm">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
