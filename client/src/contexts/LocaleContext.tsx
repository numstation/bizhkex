import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import {
  DEFAULT_LOCALE,
  getTranslations,
  parseLocaleFromPath,
  stripLocaleFromPath,
  switchLocaleInPath,
  withLocalePath,
  type Locale,
  type Translations,
} from "@/i18n";

type LocaleContextValue = {
  locale: Locale;
  t: Translations;
  path: (subpath?: string) => string;
  switchLocalePath: (locale: Locale) => string;
  basePath: string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const locale = parseLocaleFromPath(location) ?? DEFAULT_LOCALE;
  const basePath = stripLocaleFromPath(location);

  const path = useCallback(
    (subpath = "/") => withLocalePath(locale, subpath),
    [locale]
  );

  const switchLocale = useCallback(
    (newLocale: Locale) => switchLocaleInPath(location, newLocale),
    [location]
  );

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hant" : "en";
    document.title = getTranslations(locale).meta.documentTitle;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      t: getTranslations(locale),
      path,
      switchLocalePath: switchLocale,
      basePath,
    }),
    [locale, path, switchLocale, basePath]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
