import React from 'react';
import { CalendarDays, Trash2 } from 'lucide-react';
import { VacationInputState, WorkPresetType } from '../types/vacation';
import { CZECH_MONTHS, formatCzechNumber, generateHoursForPreset, parseLocaleFloat } from '../utils/calculator';

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

  const handleMonthChange = (index: number, valStr: string) => {
    const num = Math.max(0, parseLocaleFloat(valStr));
    const newMonthly = [...state.monthlyHours];
    newMonthly[index] = num;
    const newTotal = Math.round(newMonthly.reduce((a, b) => a + b, 0) * 10) / 10;
    onChange({
      monthlyHours: newMonthly,
      annualTotal: newTotal,
      activePreset: null, // ruční editace ruší aktivní předvolbu
    });
  };

  const handleAnnualChange = (valStr: string) => {
    const num = Math.max(0, parseLocaleFloat(valStr));
    onChange({
      annualTotal: num,
      activePreset: null,
    });
  };

  const applyPreset = (preset: WorkPresetType) => {
    if (!preset) return;
    const { monthly, total } = generateHoursForPreset(preset, state.userTPD);
    onChange({
      monthlyHours: monthly,
      annualTotal: total,
      activePreset: preset,
    });
  };

  const resetAll = () => {
    onChange({
      monthlyHours: new Array(12).fill(0),
      annualTotal: 0,
      activePreset: null,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Odpracovaná doba v kalendářním roce
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

      {/* Rychlé předvolby a tlačítko Vynulovat */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => applyPreset('full-year')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              state.activePreset === 'full-year'
                ? 'bg-teal-600 border-teal-600 text-white font-semibold shadow-xs'
                : 'bg-teal-50 border-teal-200 dark:bg-teal-950/60 dark:border-teal-800 text-teal-800 dark:text-teal-200 hover:bg-teal-100'
            }`}
            title="Nastaví 52 týdnů odpovídajících vašemu úvazku"
          >
            Celý rok (52 týdnů)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('half-year')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              state.activePreset === 'half-year'
                ? 'bg-teal-600 border-teal-600 text-white font-semibold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Nastaví 26 týdnů (prvních 6 měsíců)"
          >
            Půl roku (26 týdnů)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('quarter-year')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              state.activePreset === 'quarter-year'
                ? 'bg-teal-600 border-teal-600 text-white font-semibold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Nastaví 13 týdnů (první 3 měsíce)"
          >
            3 měsíce (13 týdnů)
          </button>
        </div>

        {/* Intuitivní tlačítko Vynulovat s textem a ikonou koše */}
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Smazat všechny zadané odpracované hodiny"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vynulovat</span>
        </button>
      </div>

      {/* Zadávání: Měsíce */}
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
                type="text"
                inputMode="decimal"
                value={state.monthlyHours[idx] === 0 ? '' : String(state.monthlyHours[idx])}
                onChange={(e) => handleMonthChange(idx, e.target.value)}
                placeholder="0"
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          ))}
        </div>
      ) : (
        /* Zadávání: Celková roční suma */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={state.annualTotal === 0 ? '' : String(state.annualTotal)}
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
