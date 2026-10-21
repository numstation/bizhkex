import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

interface SiteNavProps {
  variant?: "default" | "minimal";
  theme?: "light" | "dark";
  backHref?: string;
  backLabel?: string;
}

export default function SiteNav({
  variant = "default",
  theme = "light",
  backHref,
  backLabel,
}: SiteNavProps) {
  const { t, path } = useLocale();
  const surface = theme;
  const homeHref = path("/");
  const resolvedBackHref = backHref ?? homeHref;
  const resolvedBackLabel = backLabel ?? t.nav.backHome;

  const navClass = "border-b border-border sticky top-0 bg-background z-50";
  const logoClass =
    "text-lg font-semibold tracking-tight text-foreground cursor-pointer hover:text-primary transition-colors";
  const linkClass = "text-muted-foreground hover:text-foreground transition-colors font-medium text-sm";

  if (variant === "minimal") {
    return (
      <nav className={navClass}>
        <div className="container flex items-center justify-between py-4">
          <Link href={homeHref}>
            <span className={logoClass}>{t.meta.siteName}</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={surface} />
            <LanguageSwitcher theme={surface} />
            <Link href={resolvedBackHref}>
              <span className={linkClass}>{resolvedBackLabel}</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClass}>
      <div className="container flex items-center justify-between py-4">
        <Link href={homeHref}>
          <span className={logoClass}>{t.meta.siteName}</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href={path("/offices")}>
            <span className={linkClass}>{t.nav.findOffices}</span>
          </Link>
          <Link href={path("/business-marketplace")}>
            <span className={linkClass}>{t.nav.businessTrading}</span>
          </Link>
          <Link href={path("/knowledge-hub")}>
            <span className={linkClass}>{t.nav.knowledgeHub}</span>
          </Link>
          <a href={`${homeHref}#how-it-works`} className={linkClass}>
            {t.nav.howItWorks}
          </a>
          <a href={`${homeHref}#faq`} className={linkClass}>
            {t.nav.faq}
          </a>
          <a href="tel:+85235653138" className={`${linkClass} flex items-center gap-1.5`}>
            <Phone className="w-4 h-4" />
            +852 3565 3138
          </a>
          <LanguageSwitcher theme={surface} />
          <ThemeToggle theme={surface} />
          <Link href={path("/providers")}>
            <span className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium rounded-lg border border-border text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
              {t.nav.providerSignup}
            </span>
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={surface} />
          <LanguageSwitcher theme={surface} />
          <Link href={path("/providers")}>
            <span className="text-xs font-medium text-muted-foreground hover:text-primary px-2 cursor-pointer">
              {t.nav.providerSignup}
            </span>
          </Link>
          <Link href={path("/offices")}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm">
              {t.nav.browse}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
