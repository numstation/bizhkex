import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme: appTheme } = useTheme();
  const surface = theme ?? (appTheme === "dark" ? "dark" : "light");
  const isDark = surface === "dark";
  const homeHref = path("/");
  const resolvedBackHref = backHref ?? homeHref;
  const resolvedBackLabel = backLabel ?? t.nav.backHome;

  const navClass = isDark
    ? "border-b border-white/[0.06] sticky top-0 bg-[#070A13]/90 backdrop-blur-md z-50"
    : "border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm";
  const logoClass = isDark
    ? "text-2xl font-black text-white cursor-pointer hover:text-emerald-400 transition-colors"
    : "text-2xl font-black text-gray-900 cursor-pointer hover:text-emerald-700 transition-colors";
  const linkClass = isDark
    ? "text-gray-400 hover:text-emerald-400 transition-colors font-medium text-sm"
    : "text-gray-700 hover:text-emerald-700 transition-colors font-medium text-sm";

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
            <span
              className={
                isDark
                  ? "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border text-gray-300 border-white/[0.12] hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  : "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border text-gray-700 border-gray-300 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              }
            >
              {t.nav.providerSignup}
            </span>
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={surface} />
          <LanguageSwitcher theme={surface} />
          <Link href={path("/providers")}>
            <span className="text-xs font-medium text-gray-400 hover:text-emerald-400 px-2 cursor-pointer">
              {t.nav.providerSignup}
            </span>
          </Link>
          <Link href={path("/offices")}>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">
              {t.nav.browse}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
