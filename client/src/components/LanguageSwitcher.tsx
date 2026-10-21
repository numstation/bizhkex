import { useLocation } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";
import type { Locale } from "@/i18n";

export default function LanguageSwitcher({ theme: _theme = "dark" }: { theme?: "light" | "dark" }) {
  const { locale, t, switchLocalePath } = useLocale();
  const [, navigate] = useLocation();

  const handleSwitch = (target: Locale) => {
    if (target === locale) return;
    navigate(switchLocalePath(target));
  };

  const itemClass = (code: Locale) =>
    `text-sm transition-colors ${
      locale === code ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="flex items-center gap-2" aria-label={t.lang.switchTo}>
      <button type="button" onClick={() => handleSwitch("zh")} className={itemClass("zh")}>
        繁
      </button>
      <span className="text-border select-none" aria-hidden="true">
        |
      </span>
      <button type="button" onClick={() => handleSwitch("en")} className={itemClass("en")}>
        EN
      </button>
    </div>
  );
}
