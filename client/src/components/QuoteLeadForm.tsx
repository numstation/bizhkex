import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";

const TEAM_KEYS = ["1-2", "3-5", "6-10", "10+"] as const;
const DISTRICT_KEYS = ["central", "wanchai", "tst", "kwuntong"] as const;

export type CalcSnapshot = {
  teamSize: string;
  district: string;
  monthlySaving: number;
};

type Props = {
  calcValues?: CalcSnapshot;
  className?: string;
};

function formatHKD(n: number) {
  return `HK$${Math.round(n).toLocaleString()}`;
}

export default function QuoteLeadForm({ calcValues, className = "" }: Props) {
  const { t } = useLocale();
  const theme = usePublicTheme();
  const { openWhatsApp } = useWhatsApp();
  const [district, setDistrict] = useState(calcValues?.district ?? "central");
  const [teamSize, setTeamSize] = useState(calcValues?.teamSize ?? "3-5");
  const [requirements, setRequirements] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (calcValues) {
      setDistrict(calcValues.district);
      setTeamSize(calcValues.teamSize);
    }
  }, [calcValues?.district, calcValues?.teamSize]);

  const monthlySaving = calcValues?.monthlySaving ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openWhatsApp(
      t.home.leadWhatsApp(
        t.home.districtOptions[district],
        t.home.teamOptions[teamSize],
        monthlySaving,
        requirements
      )
    );
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className={`flex h-full min-w-0 flex-col ${className}`}>
      <div className="mb-6 min-w-0">
        <h2 className="text-2xl font-medium leading-tight tracking-[-0.02em] text-foreground">
          {t.home.leadTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.home.leadSubtitle}</p>
      </div>

      {monthlySaving > 0 && (
        <div className="mb-6 min-w-0 border-t border-border py-4">
          <p className="text-[13px] text-muted-foreground">{t.home.leadSavingsHint}</p>
          <p className="mt-1 break-all text-[2rem] font-normal tabular-nums tracking-[-0.02em] text-primary">
            {formatHKD(monthlySaving)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.home.savingHint}</p>
        </div>
      )}

      <ul className="mb-8 space-y-2.5">
        {t.home.leadTrustPoints.map((point) => (
          <li key={point} className="flex min-w-0 items-start gap-2.5 text-sm text-muted-foreground">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>

      {formSubmitted ? (
        <div className="border-t border-border py-12 text-center">
          <CheckCircle className="mx-auto mb-3 h-8 w-8 text-primary" strokeWidth={1.75} />
          <p className="font-medium text-primary">{t.home.leadSuccess}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4 border-t border-border pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="mb-1.5 block text-xs text-muted-foreground">{t.home.district}</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className={`${theme.input} h-11 w-full min-w-0`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICT_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t.home.districtOptions[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0">
              <label className="mb-1.5 block text-xs text-muted-foreground">{t.home.headcount}</label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger className={`${theme.input} h-11 w-full min-w-0`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t.home.teamOptions[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">{t.home.leadRequirements}</label>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={t.home.leadRequirementsPlaceholder}
              className={`${theme.input} min-h-[100px] resize-y`}
            />
          </div>
          <Input type="tel" placeholder={t.home.phone} className={`${theme.input} h-11`} />
          <Button
            type="submit"
            className={`${theme.primaryBtn} mt-1 h-12 w-full px-6 text-[15px] font-medium shadow-[0_1px_1px_rgba(16,24,40,0.04),0_6px_14px_rgba(16,24,40,0.08)]`}
          >
            {t.home.leadSubmit}
          </Button>
        </form>
      )}
    </div>
  );
}
