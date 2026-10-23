import { VacationInputState, VacationCalculationResult, WorkPresetType } from '../types/vacation';

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
 * Váhové rozdělení 260 pracovních dnů do 12 měsíců (součet dnů = 260 = 52 týdnů × 5 dnů)
 */
export const MONTH_WORK_DAYS = [
  22, 20, 22, 21, 22, 21, 23, 22, 21, 23, 21, 22
];

/**
 * Bezpečné naparsování čísla s podporou tečky i čárky jako desetinného oddělovače
 */
export function parseLocaleFloat(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const str = String(value).trim().replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Vygeneruje hodiny pro měsíce a roční sumu podle předvolby (celý rok, půlrok, čtvrtletí) pro libovolný úvazek
 */
export function generateHoursForPreset(preset: WorkPresetType, userTPD: number): { monthly: number[]; total: number } {
  const safeTPD = Math.max(0.1, userTPD);
  const dailyHours = safeTPD / 5;

  if (preset === 'full-year') {
    // 52 týdnů × úvazek
    const total = Math.round(52 * safeTPD * 100) / 100;
    // Měsíce rozpočítané podle dnů, s dorovnáním zaokrouhlení v posledním měsíci
    let acc = 0;
    const monthly = MONTH_WORK_DAYS.map((days, idx) => {
      if (idx === 11) {
        return Math.max(0, Math.round((total - acc) * 10) / 10);
      }
      const mHours = Math.round(days * dailyHours * 10) / 10;
      acc += mHours;
      return mHours;
    });
    return { monthly, total };
  }

  if (preset === 'half-year') {
    // 26 týdnů × úvazek (prvních 6 měsíců)
    const total = Math.round(26 * safeTPD * 100) / 100;
    let acc = 0;
    const monthly = MONTH_WORK_DAYS.map((days, idx) => {
      if (idx >= 6) return 0;
      if (idx === 5) {
        return Math.max(0, Math.round((total - acc) * 10) / 10);
      }
      const mHours = Math.round(days * dailyHours * 10) / 10;
      acc += mHours;
      return mHours;
    });
    return { monthly, total };
  }

  if (preset === 'quarter-year') {
    // 13 týdnů × úvazek (první 3 měsíce)
    const total = Math.round(13 * safeTPD * 100) / 100;
    let acc = 0;
    const monthly = MONTH_WORK_DAYS.map((days, idx) => {
      if (idx >= 3) return 0;
      if (idx === 2) {
        return Math.max(0, Math.round((total - acc) * 10) / 10);
      }
      const mHours = Math.round(days * dailyHours * 10) / 10;
      acc += mHours;
      return mHours;
    });
    return { monthly, total };
  }

  return {
    monthly: new Array(12).fill(0),
    total: 0,
  };
}

/**
 * Hlavní kalkulační funkce podle platného znění Zákoníku práce (§ 211 - § 216 ZP)
 */
export function calculateVacation(state: VacationInputState): VacationCalculationResult {
  const userTPD = Math.max(0.1, state.userTPD || 40);
  const standardVacationWeeks = Math.max(1, state.standardVacationWeeks || 4);
  
  // Celková odpracovaná doba
  let totalWorkedHours = 0;
  if (state.inputMode === 'monthly') {
    totalWorkedHours = state.monthlyHours.reduce((acc, h) => acc + (Number(h) || 0), 0);
  } else {
    totalWorkedHours = Number(state.annualTotal) || 0;
  }
  totalWorkedHours = Math.max(0, totalWorkedHours);

  // Plný roční nárok při odpracování 52 týdnů
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
    // Vzorec: (počet celých odpracovaných týdnů / 52) * TPD * výměra v týdnech
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
  const safeTPD = Math.max(0.1, tpd);
  const weeks = hours / safeTPD;
  const days = hours / (safeTPD / 5);
  return { weeks, days };
}

/**
 * Přepočet z týdnů dovolené na hodiny a dny při daném úvazku
 */
export function convertWeeksToHoursAndDays(weeks: number, tpd: number): { hours: number; days: number } {
  const safeTPD = Math.max(0.1, tpd);
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
