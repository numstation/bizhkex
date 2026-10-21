import { Link } from "wouter";
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
  const logoClass = "text-lg font-semibold tracking-tight text-primary";
  const linkClass = "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap";

  const primaryLinks = [
    { href: path("/offices"), label: t.nav.findOffices },
    { href: path("/business-marketplace"), label: t.nav.businessTrading },
    { href: path("/providers"), label: t.nav.providerSignup },
  ];

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
      <div className="container py-4">
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-x-6">
          <Link href={homeHref} className="justify-self-start">
            <span className={logoClass}>{t.meta.siteName}</span>
          </Link>
          <div className="hidden md:flex items-center justify-center gap-8">
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={linkClass}>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="justify-self-end flex items-center gap-4">
            <ThemeToggle theme={surface} />
            <LanguageSwitcher theme={surface} />
          </div>
        </div>
        <div className="md:hidden mt-3 flex gap-5 overflow-x-auto">
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={linkClass}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
