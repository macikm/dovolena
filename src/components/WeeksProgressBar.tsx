import React from 'react';
import { VacationCalculationResult } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface WeeksProgressBarProps {
  result: VacationCalculationResult;
}

export const WeeksProgressBar: React.FC<WeeksProgressBarProps> = ({ result }) => {
  const percentage = Math.min(100, (result.effectiveWeeks / 52) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Odpracováno {result.effectiveWeeks} z 52 týdnů ({formatCzechNumber(result.fractionOfFullYear * 100, 1)} %)
        </span>
        {result.effectiveWeeks < 52 && result.surplusHoursInCurrentWeek > 0 && (
          <span className="text-slate-500 dark:text-slate-400">
            +{formatCzechNumber(result.hoursNeededForNextWeek)} h do dalšího týdne
          </span>
        )}
      </div>

      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            result.qualifies
              ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
              : 'bg-amber-400'
          }`}
          style={{ width: `${Math.max(percentage, result.workedWeeksExact > 0 ? 3 : 0)}%` }}
        />
        {/* 4 týdny značka */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
          style={{ left: `${(4 / 52) * 100}%` }}
          title="Min. 4 týdny"
        />
        {/* 26 týdnů značka */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 z-10"
          style={{ left: '50%' }}
          title="Polovina roku (26 týdnů)"
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
        <span>0</span>
        <span className="text-rose-500 font-medium">4 týdny (min)</span>
        <span>26 týdnů (½)</span>
        <span>52 týdnů (plný rok)</span>
      </div>
    </div>
  );
};
