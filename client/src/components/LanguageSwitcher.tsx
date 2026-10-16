import { useLocation } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";
import type { Locale } from "@/i18n";

export default function LanguageSwitcher({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const { locale, t, switchLocalePath } = useLocale();
  const [, navigate] = useLocation();

  const isDark = theme === "dark";
  const baseClass = isDark
    ? "text-xs font-medium px-2.5 py-1 rounded-md transition-colors"
    : "text-xs font-medium px-2.5 py-1 rounded-md transition-colors";

  const handleSwitch = (target: Locale) => {
    if (target === locale) return;
    navigate(switchLocalePath(target));
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-lg p-0.5 ${
        isDark ? "bg-white/[0.04] border border-white/[0.08]" : "bg-gray-100 border border-gray-200"
      }`}
      aria-label={t.lang.switchTo}
    >
      {(["zh", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSwitch(code)}
          className={`${baseClass} ${
            locale === code
              ? isDark
                ? "bg-emerald-600 text-white"
                : "bg-emerald-600 text-white"
              : isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {code === "zh" ? "繁" : "EN"}
        </button>
      ))}
    </div>
  );
}
