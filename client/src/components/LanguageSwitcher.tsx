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

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-border bg-muted p-0.5"
      aria-label={t.lang.switchTo}
    >
      {(["zh", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSwitch(code)}
          className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
            locale === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code === "zh" ? "繁" : "EN"}
        </button>
      ))}
    </div>
  );
}
