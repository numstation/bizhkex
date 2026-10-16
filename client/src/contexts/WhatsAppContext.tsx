import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { formatBusinessCode } from "@shared/businessListings";
import { useLocale } from "./LocaleContext";
import { stripLocaleFromPath } from "@/i18n";

type WhatsAppContextValue = {
  message: string;
  setMessage: (message: string) => void;
  setOfficeInquiry: (id: number, name?: string) => void;
  setBusinessInquiry: (id: number, title?: string) => void;
  resetMessage: () => void;
  openWhatsApp: (customMessage?: string) => void;
};

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({
  children,
  phoneNumber = "85235653138",
}: {
  children: ReactNode;
  phoneNumber?: string;
}) {
  const { t } = useLocale();
  const [message, setMessage] = useState(t.whatsapp.default);
  const [location] = useLocation();

  const resetMessage = useCallback(() => {
    setMessage(t.whatsapp.default);
  }, [t]);

  const setOfficeInquiry = useCallback(
    (id: number, name?: string) => {
      setMessage(t.whatsapp.office(id, name));
    },
    [t]
  );

  const setBusinessInquiry = useCallback(
    (id: number, title?: string) => {
      setMessage(t.whatsapp.business(formatBusinessCode(id), title));
    },
    [t]
  );

  const openWhatsApp = useCallback(
    (customMessage?: string) => {
      const text = encodeURIComponent(customMessage ?? message);
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
    },
    [message, phoneNumber]
  );

  useEffect(() => {
    setMessage(t.whatsapp.default);
  }, [t]);

  useEffect(() => {
    const base = stripLocaleFromPath(location);

    if (base === "/" || base.startsWith("/terms") || base.startsWith("/privacy") || base.startsWith("/about")) {
      resetMessage();
    } else if (base === "/business-marketplace" || base.startsWith("/business/")) {
      setMessage(t.whatsapp.marketplace);
    } else if (base === "/offices") {
      setMessage(t.whatsapp.offices);
    }
  }, [location, resetMessage, t]);

  const value = useMemo(
    () => ({
      message,
      setMessage,
      setOfficeInquiry,
      setBusinessInquiry,
      resetMessage,
      openWhatsApp,
    }),
    [message, setOfficeInquiry, setBusinessInquiry, resetMessage, openWhatsApp]
  );

  return (
    <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp must be used within WhatsAppProvider");
  }
  return context;
}
