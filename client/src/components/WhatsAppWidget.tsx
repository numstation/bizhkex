import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useLocale } from "@/contexts/LocaleContext";

export function WhatsAppWidget({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { message, openWhatsApp } = useWhatsApp();
  const { t } = useLocale();

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-4 shadow-sm transition-colors flex items-center justify-center w-14 h-14"
        aria-label={t.whatsapp.widgetTitle}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-card text-card-foreground border border-border rounded-xl shadow-md p-4 w-72 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">{t.whatsapp.widgetTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.whatsapp.widgetDesc}</p>
            <p className="text-xs text-muted-foreground bg-muted border border-border rounded-lg p-3 line-clamp-3">
              {message}
            </p>
            <button
              onClick={() => openWhatsApp()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              {t.whatsapp.startChat}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
