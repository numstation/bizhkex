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
    const meta = getTranslations(locale).meta;
    document.documentElement.lang = locale === "zh" ? "zh-Hant" : "en";
    document.title = meta.documentTitle;

    const setNamed = (selector: string, attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setNamed('meta[name="description"]', "name", "description", meta.description);
    setNamed('meta[property="og:title"]', "property", "og:title", meta.documentTitle);
    setNamed('meta[property="og:description"]', "property", "og:description", meta.description);
    setNamed('meta[property="og:locale"]', "property", "og:locale", locale === "zh" ? "zh_HK" : "en_HK");
    setNamed('meta[name="twitter:title"]', "name", "twitter:title", meta.documentTitle);
    setNamed('meta[name="twitter:description"]', "name", "twitter:description", meta.description);

    const path = location.startsWith("/") ? location : `/${location}`;
    const canonicalUrl = `https://www.bizhkex.com${path === "/" ? "/" : path}`;
    setNamed('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [locale, location]);

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
