import React from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { VacationCalculationResult } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface WeeksProgressBarProps {
  result: VacationCalculationResult;
}

export const WeeksProgressBar: React.FC<WeeksProgressBarProps> = ({ result }) => {
  const percentage = Math.min(100, (result.effectiveWeeks / 52) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Odpracované týdny v roce</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
            {result.effectiveWeeks} z 52 týdnů ({formatCzechNumber(result.fractionOfFullYear * 100, 1)} %)
          </span>
        </h3>

        {/* Status splnění podmínky */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {result.qualifies ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Podmínka splněna (≥ 4 týdny)
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Chybí ještě {result.minWeeksRequired - result.workedFullWeeks} týdny k nároku
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative pt-1 pb-4">
        {/* Pozadí pruhu */}
        <div className="h-4 sm:h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative shadow-inner">
          {/* Výplň */}
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              result.qualifies
                ? 'bg-gradient-to-r from-teal-500 to-emerald-400 dark:from-teal-600 dark:to-emerald-500'
                : 'bg-amber-400 dark:bg-amber-500'
            }`}
            style={{ width: `${Math.max(percentage, result.workedWeeksExact > 0 ? 3 : 0)}%` }}
          />

          {/* Značka 4 týdny (4 / 52 = ~7.69%) */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500/80 dark:bg-rose-400 z-10"
            style={{ left: `${(4 / 52) * 100}%` }}
            title="Zákonné minimum: 4 týdny"
          />

          {/* Značka 26 týdnů (50%) */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 z-10"
            style={{ left: '50%' }}
            title="Polovina roku: 26 týdnů"
          />
        </div>

        {/* Popisky pod lištou */}
        <div className="relative text-[11px] text-slate-500 dark:text-slate-400 mt-2 h-4">
          <span className="absolute left-0">0 týdnů</span>
          <span
            className="absolute -translate-x-1/2 text-rose-600 dark:text-rose-400 font-semibold"
            style={{ left: `${(4 / 52) * 100}%` }}
          >
            4 týdny (min)
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: '50%' }}>
            26 týdnů (½)
          </span>
          <span className="absolute right-0 font-medium">52 týdnů (100 %)</span>
        </div>
      </div>

      {/* Doplňující informace o zbývajících hodinách do dalšího celého týdne */}
      {result.effectiveWeeks < 52 && (
        <div className="mt-2 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-start sm:items-center justify-between gap-2 flex-wrap">
          <div className="text-slate-600 dark:text-slate-300">
            {result.surplusHoursInCurrentWeek > 0 ? (
              <span>
                V neúplném týdnu máte rozpracováno{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formatCzechNumber(result.surplusHoursInCurrentWeek)} h
                </strong>
                . Zbývá ještě{' '}
                <strong className="text-teal-600 dark:text-teal-400">
                  {formatCzechNumber(result.hoursNeededForNextWeek)} h
                </strong>{' '}
                pro dokončení {result.workedFullWeeks + 1}. týdne.
              </span>
            ) : (
              <span>
                Máte přesně dokončených{' '}
                <strong className="text-slate-900 dark:text-white">{result.workedFullWeeks} týdnů</strong>.
              </span>
            )}
          </div>
          <div className="text-teal-700 dark:text-teal-300 font-medium shrink-0 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +1 týden = +{formatCzechNumber(result.singleWeekHourValue, 2)} h nároku
          </div>
        </div>
      )}
    </div>
  );
};
