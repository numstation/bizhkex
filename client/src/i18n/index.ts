import { en } from "./locales/en";
import { zh } from "./locales/zh";
import type { Locale, Translations } from "./types";
import { DEFAULT_LOCALE, LOCALES } from "./types";

export * from "./types";

const catalogs: Record<Locale, Translations> = { en, zh };

export function getTranslations(locale: Locale): Translations {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function parseLocaleFromPath(path: string): Locale | null {
  const match = path.match(/^\/(en|zh)(\/|$)/);
  return match && isLocale(match[1]) ? match[1] : null;
}

export function stripLocaleFromPath(path: string): string {
  const stripped = path.replace(/^\/(en|zh)/, "");
  return stripped === "" ? "/" : stripped;
}

export function withLocalePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function switchLocaleInPath(path: string, newLocale: Locale): string {
  const base = stripLocaleFromPath(path);
  return withLocalePath(newLocale, base);
}
