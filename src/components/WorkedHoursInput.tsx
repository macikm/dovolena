import React from 'react';
import { CalendarDays, RotateCcw } from 'lucide-react';
import { VacationInputState } from '../types/vacation';
import { CZECH_MONTHS, STANDARD_MONTH_HOURS_40H, formatCzechNumber } from '../utils/calculator';

interface WorkedHoursInputProps {
  state: VacationInputState;
  onChange: (updates: Partial<VacationInputState>) => void;
  calculatedWeeksExact: number;
  calculatedFullWeeks: number;
}

export const WorkedHoursInput: React.FC<WorkedHoursInputProps> = ({
  state,
  onChange,
  calculatedWeeksExact,
  calculatedFullWeeks,
}) => {
  const currentTotal = state.inputMode === 'monthly'
    ? state.monthlyHours.reduce((acc, h) => acc + (Number(h) || 0), 0)
    : (Number(state.annualTotal) || 0);

  const effectiveUserTPD = state.isFullTime ? state.standardTPD : state.userTPD;

  const handleMonthChange = (index: number, value: string) => {
    const num = parseFloat(value) || 0;
    const newMonthly = [...state.monthlyHours];
    newMonthly[index] = Math.max(0, num);
    const newTotal = newMonthly.reduce((a, b) => a + b, 0);
    onChange({
      monthlyHours: newMonthly,
      annualTotal: newTotal,
    });
  };

  const handleAnnualChange = (value: string) => {
    const num = Math.max(0, parseFloat(value) || 0);
    onChange({
      annualTotal: num,
    });
  };

  // 52 týdnů (plný fond roku)
  const fillFullYear = () => {
    const ratio = effectiveUserTPD / 40;
    const filled = STANDARD_MONTH_HOURS_40H.map((h) => Math.round(h * ratio));
    const total = filled.reduce((a, b) => a + b, 0);
    onChange({
      monthlyHours: filled,
      annualTotal: total, // přesně 52 * effectiveUserTPD (např. 2080 pro 40h)
    });
  };

  // 26 týdnů (půl roku)
  const fillHalfYear = () => {
    const ratio = effectiveUserTPD / 40;
    const filled = STANDARD_MONTH_HOURS_40H.map((h, i) => (i < 6 ? Math.round(h * ratio) : 0));
    const total = filled.reduce((a, b) => a + b, 0);
    onChange({
      monthlyHours: filled,
      annualTotal: total, // přesně 26 * effectiveUserTPD (např. 1040 pro 40h)
    });
  };

  // 13 týdnů (čtvrt roku)
  const fillQuarterYear = () => {
    const ratio = effectiveUserTPD / 40;
    const filled = STANDARD_MONTH_HOURS_40H.map((h, i) => (i < 3 ? Math.round(h * ratio) : 0));
    const total = filled.reduce((a, b) => a + b, 0);
    onChange({
      monthlyHours: filled,
      annualTotal: total,
    });
  };

  const resetAll = () => {
    onChange({
      monthlyHours: new Array(12).fill(0),
      annualTotal: 0,
    });
  };

  const setDirectWeeks = (weeks: number) => {
    const hours = Math.round(weeks * effectiveUserTPD);
    onChange({ annualTotal: hours });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Odpracovaná doba v roce
          </h2>
        </div>

        {/* Přepínač Měsíce vs Suma */}
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onChange({ inputMode: 'monthly' })}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              state.inputMode === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Po měsících (12×)
          </button>
          <button
            type="button"
            onClick={() => onChange({ inputMode: 'annual' })}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              state.inputMode === 'annual'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Celková suma
          </button>
        </div>
      </div>

      {/* Rychlé předvolby */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={state.inputMode === 'monthly' ? fillFullYear : () => setDirectWeeks(52)}
            className="px-2.5 py-1 rounded-lg font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 transition-colors"
          >
            Celý rok (52 týdnů)
          </button>
          <button
            type="button"
            onClick={state.inputMode === 'monthly' ? fillHalfYear : () => setDirectWeeks(26)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Půl roku (26 týdnů)
          </button>
          <button
            type="button"
            onClick={state.inputMode === 'monthly' ? fillQuarterYear : () => setDirectWeeks(13)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            3 měsíce (13 týdnů)
          </button>
        </div>

        <button
          type="button"
          onClick={resetAll}
          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
          title="Vynulovat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zadávání */}
      {state.inputMode === 'monthly' ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {CZECH_MONTHS.map((monthName, idx) => (
            <div
              key={monthName}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800"
            >
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mb-1">
                {idx + 1}. {monthName}
              </div>
              <input
                type="number"
                min="0"
                max="350"
                step="1"
                value={state.monthlyHours[idx] === 0 ? '' : state.monthlyHours[idx]}
                onChange={(e) => handleMonthChange(idx, e.target.value)}
                placeholder="0"
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="4000"
              step="1"
              value={state.annualTotal === 0 ? '' : state.annualTotal}
              onChange={(e) => handleAnnualChange(e.target.value)}
              placeholder="0"
              className="w-full text-xl font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <span className="absolute right-3 top-3 text-xs text-slate-400 pointer-events-none">
              hodin za rok
            </span>
          </div>
        </div>
      )}

      {/* Souhrnný pruh */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">
          Součet:{' '}
          <strong className="text-slate-900 dark:text-white">
            {formatCzechNumber(currentTotal)} h
          </strong>
        </span>
        <span className="text-teal-700 dark:text-teal-300 font-semibold">
          = {formatCzechNumber(calculatedWeeksExact, 2)} týdnů ({calculatedFullWeeks} celých týdnů)
        </span>
      </div>
    </div>
  );
};
