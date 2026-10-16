import { useEffect, useMemo, useState } from "react";
import { Calculator, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import type { CalcSnapshot } from "@/components/QuoteLeadForm";

const TEAM_KEYS = ["1-2", "3-5", "6-10", "10+"] as const;
const DISTRICT_KEYS = ["central", "wanchai", "tst", "kwuntong"] as const;
const SQFT_KEYS = ["80", "100", "120"] as const;
const LEASE_KEYS = ["12", "24", "36"] as const;

const HEADCOUNT: Record<string, number> = { "1-2": 2, "3-5": 4, "6-10": 8, "10+": 12 };
const RENT_PER_SQFT: Record<string, number> = {
  central: 55,
  wanchai: 42,
  tst: 38,
  kwuntong: 28,
};
const SERVICED_PER_HEAD: Record<string, number> = {
  central: 4200,
  wanchai: 3500,
  tst: 3200,
  kwuntong: 2600,
};

type BreakdownItem = { label: string; traditional: number; serviced: number };

function formatHKD(n: number) {
  return `HK$${Math.round(n).toLocaleString()}`;
}

type Props = {
  className?: string;
  onValuesChange?: (values: CalcSnapshot) => void;
};

export default function SavingsCalculator({ className = "", onValuesChange }: Props) {
  const { t } = useLocale();
  const theme = usePublicTheme();
  const [teamSize, setTeamSize] = useState("3-5");
  const [district, setDistrict] = useState("central");
  const [sqftPerPerson, setSqftPerPerson] = useState("100");
  const [leaseMonths, setLeaseMonths] = useState("24");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(true);

  const calcKey = `${teamSize}-${district}-${sqftPerPerson}-${leaseMonths}`;

  useEffect(() => {
    setIsCalculating(true);
    setShowResult(false);
    const timer = setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 650);
    return () => clearTimeout(timer);
  }, [calcKey]);

  const result = useMemo(() => {
    const heads = HEADCOUNT[teamSize];
    const sqft = heads * Number(sqftPerPerson);
    const rentRate = RENT_PER_SQFT[district];
    const months = Number(leaseMonths);

    const baseRent = sqft * rentRate;
    const management = baseRent * 0.1;
    const utilities = heads * 850;
    const cleaning = 1200 + heads * 150;
    const reception = heads > 3 ? 2800 : 0;
    const fitOutTotal = sqft * 220;
    const fitOutMonthly = fitOutTotal / months;
    const depositLockup = (baseRent * 3 * 0.05) / 12;

    const traditional =
      baseRent + management + utilities + cleaning + reception + fitOutMonthly + depositLockup;

    const servicedBase = heads * SERVICED_PER_HEAD[district];
    const meetingRooms = heads > 5 ? 800 : 400;
    const serviced = servicedBase + meetingRooms;

    const monthlySaving = Math.max(0, traditional - serviced);
    const annualSaving = monthlySaving * 12;
    const depositFreed = baseRent * 3 - servicedBase;
    const opexReduction = traditional > 0 ? Math.round((monthlySaving / traditional) * 100) : 0;

    const breakdown: BreakdownItem[] = [
      { label: t.home.calcBreakdown.rent, traditional: baseRent, serviced: servicedBase * 0.72 },
      { label: t.home.calcBreakdown.mgmt, traditional: management, serviced: 0 },
      { label: t.home.calcBreakdown.utilities, traditional: utilities, serviced: 0 },
      { label: t.home.calcBreakdown.fitout, traditional: fitOutMonthly, serviced: 0 },
      { label: t.home.calcBreakdown.extras, traditional: cleaning + reception + depositLockup, serviced: meetingRooms },
    ];

    return {
      heads,
      sqft,
      traditional,
      serviced,
      monthlySaving,
      annualSaving,
      depositFreed,
      opexReduction,
      breakdown,
      maxBar: Math.max(traditional, serviced),
    };
  }, [teamSize, district, sqftPerPerson, leaseMonths, t]);

  useEffect(() => {
    if (!isCalculating && showResult) {
      onValuesChange?.({ teamSize, district, monthlySaving: result.monthlySaving });
    }
  }, [teamSize, district, result.monthlySaving, isCalculating, showResult, onValuesChange]);

  return (
    <div className={`${theme.glass} p-5 md:p-6 h-full min-w-0 overflow-hidden ${className}`}>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Calculator className={`w-5 h-5 ${theme.accent}`} />
        </div>
        <div className="min-w-0">
          <h3 className={`text-lg font-bold flex flex-wrap items-center gap-2 ${theme.heading}`}>
            {t.home.calculatorTitle}
            <Sparkles className={`w-4 h-4 shrink-0 ${theme.accent}`} />
          </h3>
          <p className={`${theme.subtle} text-xs leading-relaxed break-words`}>{t.home.calculatorSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="min-w-0">
          <label className={`text-xs ${theme.label} mb-1.5 block truncate`}>{t.home.teamSize}</label>
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
        <div className="min-w-0">
          <label className={`text-xs ${theme.label} mb-1.5 block truncate`}>{t.home.targetDistrict}</label>
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
          <label className={`text-xs ${theme.label} mb-1.5 block truncate`}>{t.home.calcSqft}</label>
          <Select value={sqftPerPerson} onValueChange={setSqftPerPerson}>
            <SelectTrigger className={`${theme.input} w-full min-w-0`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SQFT_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {t.home.calcSqftOptions[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0">
          <label className={`text-xs ${theme.label} mb-1.5 block truncate`}>{t.home.calcLease}</label>
          <Select value={leaseMonths} onValueChange={setLeaseMonths}>
            <SelectTrigger className={`${theme.input} w-full min-w-0`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEASE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {t.home.calcLeaseOptions[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-3 min-w-0">
          <div className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs ${theme.subtle} uppercase tracking-wider`}>
            <span className="shrink-0">{t.home.calcCompare}</span>
            <span className="tabular-nums">
              {result.heads} {t.home.calcHeads} · {result.sqft} {t.home.calcSqftUnit}
            </span>
          </div>

          {isCalculating ? (
            <div className={`h-48 flex items-center justify-center ${theme.accent} text-sm animate-pulse`}>
              {t.home.calcRunning}
            </div>
          ) : (
            <div className={`space-y-3 transition-opacity duration-300 ${showResult ? "opacity-100" : "opacity-0"}`}>
              {result.breakdown.map((row) => (
                <div key={row.label} className="min-w-0">
                  <div className={`flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs ${theme.subtle} mb-1`}>
                    <span className="shrink-0">{row.label}</span>
                    <span className="tabular-nums text-right break-all">
                      {formatHKD(row.traditional)} → {formatHKD(row.serviced)}
                    </span>
                  </div>
                  <div className="flex gap-2 h-2">
                    <div
                      className="bg-red-500/40 rounded-full transition-all duration-500"
                      style={{ width: `${(row.traditional / result.maxBar) * 100}%` }}
                    />
                    <div
                      className="bg-emerald-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${(row.serviced / result.maxBar) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs pt-1">
            <span className={`flex items-center gap-1.5 ${theme.subtle}`}>
              <span className="w-3 h-3 rounded-full bg-red-500/40 shrink-0" />
              {t.home.calcTraditional}
            </span>
            <span className={`flex items-center gap-1.5 ${theme.subtle}`}>
              <span className="w-3 h-3 rounded-full bg-emerald-500/60 shrink-0" />
              {t.home.calcServiced}
            </span>
          </div>
        </div>

        <div className="space-y-3 min-w-0">
          <div className="grid grid-cols-2 gap-2">
            <div className={`${theme.metricBox} p-3 min-w-0`}>
              <p className={`text-[11px] ${theme.subtle} mb-1 leading-tight`}>{t.home.calcTraditionalTotal}</p>
              <p className={`text-base sm:text-lg font-bold tabular-nums break-all ${theme.redValue}`}>
                {formatHKD(result.traditional)}
              </p>
              <p className={`text-[10px] ${theme.subtle} mt-0.5`}>{t.home.calcPerMonth}</p>
            </div>
            <div className={`${theme.metricBoxAccent} p-3 min-w-0`}>
              <p className={`text-[11px] ${theme.subtle} mb-1 leading-tight`}>{t.home.calcServicedTotal}</p>
              <p className={`text-base sm:text-lg font-bold tabular-nums break-all ${theme.accent}`}>
                {formatHKD(result.serviced)}
              </p>
              <p className={`text-[10px] ${theme.subtle} mt-0.5`}>{t.home.calcPerMonth}</p>
            </div>
          </div>

          <div className={`${theme.savingsHighlight} p-4 min-w-0`}>
            <p className={`text-xs sm:text-sm ${theme.muted}`}>{t.home.estimatedSaving}</p>
            <p className={`text-2xl sm:text-3xl font-black tabular-nums break-all ${theme.accent} mt-1`}>
              {isCalculating ? "—" : formatHKD(result.monthlySaving)}
            </p>
            <p className={`text-[11px] ${theme.subtle} mt-1.5 leading-relaxed`}>{t.home.savingHint}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`${theme.glassInner} rounded-lg p-2 min-w-0`}>
              <p className={`text-sm sm:text-base font-bold tabular-nums ${theme.heading}`}>
                {isCalculating ? "—" : `${result.opexReduction}%`}
              </p>
              <p className={`text-[10px] ${theme.subtle} leading-tight mt-0.5`}>{t.home.calcOpexCut}</p>
            </div>
            <div className={`${theme.glassInner} rounded-lg p-2 min-w-0`}>
              <p className={`text-xs sm:text-sm font-bold tabular-nums break-all ${theme.heading}`}>
                {isCalculating ? "—" : formatHKD(result.annualSaving)}
              </p>
              <p className={`text-[10px] ${theme.subtle} leading-tight mt-0.5`}>{t.home.calcAnnual}</p>
            </div>
            <div className={`${theme.glassInner} rounded-lg p-2 min-w-0`}>
              <p className={`text-xs sm:text-sm font-bold tabular-nums break-all ${theme.heading}`}>
                {isCalculating ? "—" : formatHKD(result.depositFreed)}
              </p>
              <p className={`text-[10px] ${theme.subtle} leading-tight mt-0.5`}>{t.home.calcDeposit}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
