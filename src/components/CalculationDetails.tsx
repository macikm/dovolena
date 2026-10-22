import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { VacationCalculationResult } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface CalculationDetailsProps {
  result: VacationCalculationResult;
}

export const CalculationDetails: React.FC<CalculationDetailsProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 transition-colors overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Detailní rozpis postupu výpočtu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vzorec a legislativní kroky podle § 211 - § 216 Zákoníku práce
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 ml-2">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 sm:px-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {/* Krok 1 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="font-semibold text-slate-900 dark:text-white mb-1">
              1. Plný roční nárok na dovolenou pro váš úvazek
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Vzorec: Sjednaná týdenní doba × Výměra dovolené v týdnech
            </p>
            <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs">
              {result.userTPD} h/týden × {result.standardVacationWeeks} týdnů ={' '}
              <strong>{formatCzechNumber(result.fullYearEntitlementHours)} hodin</strong> ({formatCzechNumber(result.fullYearEntitlementDays)} dnů)
            </div>
          </div>

          {/* Krok 2 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="font-semibold text-slate-900 dark:text-white mb-1">
              2. Počet odpracovaných celých násobků týdenní pracovní doby
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Do výpočtu vstupují pouze <strong>celé dokončené týdny</strong> (nejvýše 52 týdnů za rok). Zbytek hodin se pro poměrnou část nezapočítává.
            </p>
            <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs">
              {formatCzechNumber(result.totalWorkedHours)} h ÷ {result.userTPD} h = {formatCzechNumber(result.workedWeeksExact, 2)} týdnů →{' '}
              <strong>{result.effectiveWeeks} celých týdnů</strong>{' '}
              {result.surplusHoursInCurrentWeek > 0 && `(zbytek: ${formatCzechNumber(result.surplusHoursInCurrentWeek)} h)`}
            </div>
          </div>

          {/* Krok 3 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="font-semibold text-slate-900 dark:text-white mb-1">
              3. Ověření zákonné podmínky vzniku práva (§ 213 odst. 3 ZP)
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Zaměstnanec musí za kalendářní rok odpracovat alespoň <strong>4 celé týdny</strong> své TPD.
            </p>
            <div className="p-2 rounded-lg text-xs font-medium flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span>Odpracováno: {result.workedFullWeeks} celých týdnů (požadováno: min. 4)</span>
              <span className={result.qualifies ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                {result.qualifies ? '✓ Podmínka splněna' : '✗ Podmínka nesplněna'}
              </span>
            </div>
          </div>

          {/* Krok 4 */}
          {result.qualifies && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                4. Výpočet poměrné části a zákonné zaokrouhlení (§ 213 odst. 1 + § 216 odst. 5 ZP)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Vzorec: (odpracované celé týdny / 52) × roční nárok v hodinách. Výsledek se zaokrouhluje <strong>na celé hodiny nahoru</strong>.
              </p>
              <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs space-y-1">
                <div>
                  ({result.effectiveWeeks} / 52) × {formatCzechNumber(result.fullYearEntitlementHours)} h ={' '}
                  {formatCzechNumber(result.exactEntitlementHours, 4)} h
                </div>
                <div className="text-teal-600 dark:text-teal-400 font-bold pt-1 border-t border-slate-100 dark:border-slate-800">
                  Zaokrouhleno nahoru = {formatCzechNumber(result.roundedEntitlementHours)} hodin
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
