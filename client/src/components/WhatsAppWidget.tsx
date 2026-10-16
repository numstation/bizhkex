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
        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-4 shadow-lg shadow-emerald-900/30 transition-all duration-300 flex items-center justify-center w-14 h-14"
        aria-label={t.whatsapp.widgetTitle}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-[#0d1117] border border-white/[0.08] rounded-xl shadow-2xl p-4 w-72 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-3">
            <h3 className="font-semibold text-white">{t.whatsapp.widgetTitle}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{t.whatsapp.widgetDesc}</p>
            <p className="text-xs text-gray-500 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 line-clamp-3">
              {message}
            </p>
            <button
              onClick={() => openWhatsApp()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
