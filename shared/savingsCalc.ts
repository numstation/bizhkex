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

export function calculateOfficeSavings(params: {
  teamSize: string;
  district: string;
  sqftPerPerson?: string;
  leaseMonths?: string;
}) {
  const { teamSize, district, sqftPerPerson = "100", leaseMonths = "24" } = params;
  const heads = HEADCOUNT[teamSize] ?? 4;
  const sqft = heads * Number(sqftPerPerson);
  const rentRate = RENT_PER_SQFT[district] ?? 42;
  const months = Number(leaseMonths);

  const baseRent = sqft * rentRate;
  const management = baseRent * 0.1;
  const utilities = heads * 850;
  const cleaning = 1200 + heads * 150;
  const reception = heads > 3 ? 2800 : 0;
  const fitOutMonthly = (sqft * 220) / months;
  const depositLockup = (baseRent * 3 * 0.05) / 12;

  const traditional =
    baseRent + management + utilities + cleaning + reception + fitOutMonthly + depositLockup;

  const servicedBase = heads * (SERVICED_PER_HEAD[district] ?? 3500);
  const meetingRooms = heads > 5 ? 800 : 400;
  const serviced = servicedBase + meetingRooms;

  return Math.max(0, Math.round(traditional - serviced));
}
