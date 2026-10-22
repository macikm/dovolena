import { VacationInputState, VacationCalculationResult } from '../types/vacation';

export const CZECH_MONTHS = [
  'Leden', 'Únor', 'Březen', 'Duben',
  'Květen', 'Červen', 'Červenec', 'Srpen',
  'Září', 'Říjen', 'Listopad', 'Prosinec'
];

export const CZECH_MONTHS_SHORT = [
  'Led', 'Úno', 'Bře', 'Dub',
  'Kvě', 'Čvn', 'Čvc', 'Srp',
  'Zář', 'Říj', 'Lis', 'Pro'
];

/**
 * Standardní roční fond pracovní doby včetně svátků dle § 348 ZP (260 pracovních dnů = 52 týdnů × 40 h = 2080 h)
 */
export const STANDARD_MONTH_HOURS_40H = [
  176, 160, 176, 168, 176, 168, 184, 176, 168, 184, 168, 176
];

/**
 * Hlavní kalkulační funkce podle platného znění Zákoníku práce (§ 211 - § 216 ZP)
 */
export function calculateVacation(state: VacationInputState): VacationCalculationResult {
  const standardTPD = Math.max(1, state.standardTPD || 40);
  const standardVacationWeeks = Math.max(1, state.standardVacationWeeks || 4);
  const userTPD = Math.max(1, state.isFullTime ? standardTPD : (state.userTPD || standardTPD));
  
  // Celková odpracovaná doba
  let totalWorkedHours = 0;
  if (state.inputMode === 'monthly') {
    totalWorkedHours = state.monthlyHours.reduce((acc, h) => acc + (Number(h) || 0), 0);
  } else {
    totalWorkedHours = Number(state.annualTotal) || 0;
  }
  totalWorkedHours = Math.max(0, totalWorkedHours);

  // Plný roční nárok při plném odpracování roku
  const fullYearEntitlementHours = userTPD * standardVacationWeeks;
  const fullYearEntitlementDays = fullYearEntitlementHours / (userTPD / 5);

  // Počet odpracovaných týdnů (násobků TPD zaměstnance)
  const workedWeeksExact = userTPD > 0 ? totalWorkedHours / userTPD : 0;
  const workedFullWeeks = Math.floor(workedWeeksExact);
  const effectiveWeeks = Math.min(workedFullWeeks, 52);

  // Zbytek hodin a kolik chybí do dalšího týdne
  const surplusHoursInCurrentWeek = Math.max(0, totalWorkedHours - (workedFullWeeks * userTPD));
  const hoursNeededForNextWeek = workedFullWeeks < 52 
    ? Math.max(0, userTPD - surplusHoursInCurrentWeek)
    : 0;

  // Zákonná podmínka: alespoň 4 celé týdny (§ 213 odst. 3 ZP)
  const minWeeksRequired = 4;
  const qualifies = workedFullWeeks >= minWeeksRequired;

  // Přesný a zaokrouhlený nárok
  let exactEntitlementHours = 0;
  let roundedEntitlementHours = 0;

  if (qualifies) {
    // Vzorec: (počet odpracovaných celých týdnů / 52) * TPD * výměra v týdnech
    exactEntitlementHours = (effectiveWeeks / 52) * fullYearEntitlementHours;
    // § 216 odst. 5 ZP: zaokrouhlení na celé hodiny nahoru
    roundedEntitlementHours = Math.ceil(exactEntitlementHours);
  }

  // Přepočet na týdny a dny
  const entitlementWeeks = userTPD > 0 ? roundedEntitlementHours / userTPD : 0;
  const standardWorkDayLength = userTPD / 5;
  const entitlementDays = standardWorkDayLength > 0 ? roundedEntitlementHours / standardWorkDayLength : 0;

  const fractionOfFullYear = effectiveWeeks / 52;
  const singleWeekHourValue = (1 / 52) * fullYearEntitlementHours;

  return {
    totalWorkedHours,
    userTPD,
    standardTPD,
    standardVacationWeeks,
    fullYearEntitlementHours,
    fullYearEntitlementDays,
    workedWeeksExact,
    workedFullWeeks,
    effectiveWeeks,
    surplusHoursInCurrentWeek,
    hoursNeededForNextWeek,
    qualifies,
    minWeeksRequired,
    exactEntitlementHours,
    roundedEntitlementHours,
    entitlementWeeks,
    entitlementDays,
    fractionOfFullYear,
    singleWeekHourValue,
  };
}

/**
 * Přepočet ze zadaných hodin dovolené zpět na týdny a dny při daném úvazku
 */
export function convertHoursToWeeksAndDays(hours: number, tpd: number): { weeks: number; days: number } {
  const safeTPD = Math.max(1, tpd);
  const weeks = hours / safeTPD;
  const days = hours / (safeTPD / 5);
  return { weeks, days };
}

/**
 * Přepočet z týdnů dovolené na hodiny a dny při daném úvazku
 */
export function convertWeeksToHoursAndDays(weeks: number, tpd: number): { hours: number; days: number } {
  const safeTPD = Math.max(1, tpd);
  const hours = weeks * safeTPD;
  const days = hours / (safeTPD / 5);
  return { hours, days };
}

/**
 * Formátování čísel do češtiny s volitelným počtem desetinných míst
 */
export function formatCzechNumber(num: number, maxDecimals: number = 2): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('cs-CZ', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  }).format(num);
}
