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
    <div
      className={`${theme.glass} flex flex-col h-full min-w-0 overflow-hidden p-5 md:p-6 ${className}`}
    >
      <div className="mb-4 min-w-0">
        <h2 className={`text-lg sm:text-xl font-semibold leading-tight break-words ${theme.heading}`}>
          {t.home.leadTitle}
        </h2>
        <p className={`${theme.subtle} text-xs sm:text-sm mt-1 leading-relaxed break-words`}>
          {t.home.leadSubtitle}
        </p>
      </div>

      {monthlySaving > 0 && (
        <div className={`${theme.savingsHighlight} p-3.5 mb-4 min-w-0`}>
          <p className={`text-[11px] ${theme.subtle}`}>{t.home.leadSavingsHint}</p>
          <p className={`text-xl sm:text-2xl font-semibold tabular-nums break-all ${theme.accent} mt-0.5`}>
            {formatHKD(monthlySaving)}
          </p>
          <p className={`text-[11px] ${theme.subtle} mt-1 leading-relaxed`}>{t.home.savingHint}</p>
        </div>
      )}

      <ul className="space-y-2 mb-5">
        {t.home.leadTrustPoints.map((point) => (
          <li key={point} className={`flex items-start gap-2 text-xs sm:text-sm min-w-0 ${theme.muted}`}>
            <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${theme.accent}`} />
            <span className="break-words leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>

      {formSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <CheckCircle className={`w-12 h-12 ${theme.accent} mb-3`} />
          <p className={`${theme.accent} font-semibold text-lg`}>{t.home.leadSuccess}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-3 min-w-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className={`text-xs ${theme.label} mb-1.5 block truncate`}>{t.home.district}</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className={`${theme.input} w-full min-w-0`}>
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
              <label className={`text-xs ${theme.label} mb-1.5 block truncate`}>{t.home.headcount}</label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger className={`${theme.input} w-full min-w-0`}>
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
            <label className={`text-xs ${theme.label} mb-2 block`}>{t.home.leadRequirements}</label>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={t.home.leadRequirementsPlaceholder}
              className={`${theme.input} min-h-[100px] resize-y`}
            />
          </div>
          <Input type="tel" placeholder={t.home.phone} className={theme.input} />
          <Button
            type="submit"
            className={`${theme.primaryBtn} w-full h-11 text-base mt-auto`}
          >
            {t.home.leadSubmit}
          </Button>
        </form>
      )}
    </div>
  );
}
