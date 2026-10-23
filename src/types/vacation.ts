export type WorkPresetType = 'full-year' | 'half-year' | 'quarter-year' | null;

export interface VacationInputState {
  // Úvazek zaměstnance (hodin/týden) - např. 40, 38.75, 37.5, 30, 20...
  userTPD: number;
  
  // Výměra dovolené u zaměstnavatele v týdnech - např. 4, 5, 8
  standardVacationWeeks: number;
  
  // Způsob zadávání odpracovaných hodin
  inputMode: 'monthly' | 'annual';
  monthlyHours: number[]; // 12 hodnot pro leden - prosinec
  annualTotal: number; // přímá suma odpracovaných hodin
  
  // Příznak aktivní rychlé předvolby (celý rok, půlrok...)
  activePreset?: WorkPresetType;
}

export interface VacationCalculationResult {
  totalWorkedHours: number;
  userTPD: number;
  standardVacationWeeks: number;
  fullYearEntitlementHours: number; // Roční nárok při plném odpracování (userTPD * standardVacationWeeks)
  fullYearEntitlementDays: number;
  
  workedWeeksExact: number; // totalWorkedHours / userTPD (např. 26.5)
  workedFullWeeks: number; // Math.floor (např. 26)
  effectiveWeeks: number; // Math.min(workedFullWeeks, 52)
  surplusHoursInCurrentWeek: number; // zbytek hodin v neúplném týdnu
  hoursNeededForNextWeek: number; // kolik hodin zbývá k dokončení dalšího celého týdne
  
  qualifies: boolean; // Splnil alespoň 4 celé týdny? (§ 213 ZP)
  minWeeksRequired: number; // 4
  
  exactEntitlementHours: number; // Nezaokrouhlený nárok
  roundedEntitlementHours: number; // Zaokrouhleno nahoru dle § 216 odst. 5 ZP
  entitlementWeeks: number; // roundedEntitlementHours / userTPD
  entitlementDays: number; // roundedEntitlementHours / (userTPD / 5)
  
  fractionOfFullYear: number; // effectiveWeeks / 52
  singleWeekHourValue: number; // (1 / 52) * userTPD * standardVacationWeeks
}
