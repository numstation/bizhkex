import { useEffect, useMemo, useState } from "react";
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
    <div className={`h-full min-w-0 ${className}`}>
      <div className="mb-8 min-w-0">
        <h2 className="text-2xl font-medium tracking-[-0.02em] text-foreground mb-2">
          {t.home.calculatorTitle}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.home.calculatorSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-8">
        <div className="min-w-0">
          <label className="text-xs text-muted-foreground mb-1.5 block">{t.home.teamSize}</label>
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
        <div className="min-w-0">
          <label className="text-xs text-muted-foreground mb-1.5 block">{t.home.targetDistrict}</label>
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
          <label className="text-xs text-muted-foreground mb-1.5 block">{t.home.calcSqft}</label>
          <Select value={sqftPerPerson} onValueChange={setSqftPerPerson}>
            <SelectTrigger className={`${theme.input} h-11 w-full min-w-0`}>
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
          <label className="text-xs text-muted-foreground mb-1.5 block">{t.home.calcLease}</label>
          <Select value={leaseMonths} onValueChange={setLeaseMonths}>
            <SelectTrigger className={`${theme.input} h-11 w-full min-w-0`}>
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

      <div className="border-t border-border pt-6 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[13px] text-muted-foreground mb-5">
          <span>{t.home.calcCompare}</span>
          <span className="tabular-nums">
            {result.heads} {t.home.calcHeads} · {result.sqft} {t.home.calcSqftUnit}
          </span>
        </div>

        {isCalculating ? (
          <div className="h-40 flex items-center text-sm text-primary">{t.home.calcRunning}</div>
        ) : (
          <div className={`space-y-4 transition-opacity duration-300 ${showResult ? "opacity-100" : "opacity-0"}`}>
            {result.breakdown.map((row) => (
              <div key={row.label} className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[13px] text-muted-foreground mb-1.5">
                  <span>{row.label}</span>
                  <span className="tabular-nums text-right">
                    {formatHKD(row.traditional)} → {formatHKD(row.serviced)}
                  </span>
                </div>
                <div className="flex h-1 gap-1.5">
                  <div
                    className="bg-foreground/20 transition-all duration-500"
                    style={{ width: `${(row.traditional / result.maxBar) * 100}%` }}
                  />
                  <div
                    className="bg-primary transition-all duration-500"
                    style={{ width: `${(row.serviced / result.maxBar) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-4 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-2 bg-foreground/20 shrink-0" />
            {t.home.calcTraditional}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 bg-primary shrink-0" />
            {t.home.calcServiced}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 border-t border-border">
        <div className="min-w-0 py-5 pr-4">
          <p className="mb-1 text-[13px] text-muted-foreground">{t.home.calcTraditionalTotal}</p>
          <p className="break-all text-xl font-normal tabular-nums text-foreground">
            {formatHKD(result.traditional)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t.home.calcPerMonth}</p>
        </div>
        <div className="min-w-0 border-l border-border py-5 pl-4">
          <p className="mb-1 text-[13px] text-muted-foreground">{t.home.calcServicedTotal}</p>
          <p className="break-all text-xl font-normal tabular-nums text-primary">
            {formatHKD(result.serviced)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t.home.calcPerMonth}</p>
        </div>
      </div>

      <div className="min-w-0 border-t border-border py-5">
        <p className="text-sm text-muted-foreground">{t.home.estimatedSaving}</p>
        <p className="mt-1 break-all text-[2rem] font-normal tabular-nums tracking-[-0.02em] text-primary md:text-[2.5rem]">
          {isCalculating ? "—" : formatHKD(result.monthlySaving)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.home.savingHint}</p>
      </div>

      <div className="grid grid-cols-3 border-t border-border">
        <div className="min-w-0 py-4 pr-3">
          <p className="text-base font-normal tabular-nums text-foreground">
            {isCalculating ? "—" : `${result.opexReduction}%`}
          </p>
          <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{t.home.calcOpexCut}</p>
        </div>
        <div className="min-w-0 border-l border-border px-3 py-4">
          <p className="break-all text-sm font-normal tabular-nums text-foreground">
            {isCalculating ? "—" : formatHKD(result.annualSaving)}
          </p>
          <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{t.home.calcAnnual}</p>
        </div>
        <div className="min-w-0 border-l border-border py-4 pl-3">
          <p className="break-all text-sm font-normal tabular-nums text-foreground">
            {isCalculating ? "—" : formatHKD(result.depositFreed)}
          </p>
          <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{t.home.calcDeposit}</p>
        </div>
      </div>
    </div>
  );
}
