import { Redirect } from "wouter";
import { DEFAULT_LOCALE, withLocalePath } from "@/i18n";

/** Redirects legacy non-localized paths to /zh/... */
export function LocaleRedirect({ to }: { to: string }) {
  return <Redirect to={withLocalePath(DEFAULT_LOCALE, to)} />;
}
