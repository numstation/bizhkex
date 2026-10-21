import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { formatBusinessCode } from "@shared/businessListings";

type Props = {
  listingId: number;
  listingTitle: string;
  compact?: boolean;
};

export default function BusinessInquiryForm({ listingId, listingTitle, compact = false }: Props) {
  const { locale, t } = useLocale();
  const theme = usePublicTheme();
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const defaultMessage =
    locale === "zh"
      ? `我對「${listingTitle}」（${formatBusinessCode(listingId)}）有興趣，請提供完整財務報表及安排睇舖。`
      : `I'm interested in "${listingTitle}" (${formatBusinessCode(listingId)}) — please send the full financial pack.`;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage,
  });

  const mutation = trpc.business.submitInquiry.useMutation({
    onSuccess: (data) => {
      setReferenceId(data.referenceId);
      setSubmitted(true);
      toast.success(t.business.inquirySuccess);
    },
    onError: () => {
      toast.error(t.business.inquiryError);
    },
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error(t.business.inquiryRequired);
      return;
    }
    mutation.mutate({
      listingId,
      listingTitle,
      listingCode: formatBusinessCode(listingId),
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      locale,
    });
  };

  if (submitted) {
    return (
      <div className={`text-center py-6 ${compact ? "py-4" : ""}`}>
        <CheckCircle className={`w-10 h-10 ${theme.accent} mx-auto mb-3`} />
        <p className={`font-semibold mb-1 ${theme.heading}`}>{t.business.inquirySuccess}</p>
        {referenceId && (
          <p className={`text-xs font-mono ${theme.accent} mb-2`}>{referenceId}</p>
        )}
        <p className={`text-xs ${theme.muted}`}>{t.business.inquirySuccessNote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className={`font-bold ${compact ? "text-base mb-3" : "text-lg"} ${theme.heading}`}>
        {t.business.inquiryTitle}
      </h3>
      {!compact && <p className={`text-xs ${theme.muted} mb-2`}>{t.business.inquirySubtitle}</p>}
      <div>
        <label className={`text-xs ${theme.label} mb-1 block`}>{t.business.inquiryName} *</label>
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={theme.input}
          placeholder={t.business.inquiryName}
        />
      </div>
      <div>
        <label className={`text-xs ${theme.label} mb-1 block`}>{t.business.inquiryEmail} *</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={theme.input}
          placeholder="name@email.com"
        />
      </div>
      <div>
        <label className={`text-xs ${theme.label} mb-1 block`}>{t.business.inquiryPhone} *</label>
        <Input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={theme.input}
          placeholder="+852"
        />
      </div>
      <div>
        <label className={`text-xs ${theme.label} mb-1 block`}>{t.business.inquiryMessage} *</label>
        <Textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${theme.input} min-h-24`}
          placeholder={t.business.inquiryMessagePlaceholder}
        />
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className={`${theme.primaryBtn} w-full`}
      >
        {mutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {t.business.inquirySubmit}
          </>
        )}
      </Button>
      <p className={`text-[10px] text-center ${theme.subtle}`}>{t.business.inquiryPrivacy}</p>
    </form>
  );
}
