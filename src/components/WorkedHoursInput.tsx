import React from 'react';
import { CalendarDays, Hash, RotateCcw, Zap } from 'lucide-react';
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

  // Rychlé akce pro měsíční zadávání
  const fillFullYear = () => {
    const ratio = effectiveUserTPD / 40;
    const filled = STANDARD_MONTH_HOURS_40H.map((h) => Math.round(h * ratio));
    const total = filled.reduce((a, b) => a + b, 0);
    onChange({
      monthlyHours: filled,
      annualTotal: total,
    });
  };

  const fillHalfYear = () => {
    const ratio = effectiveUserTPD / 40;
    const filled = STANDARD_MONTH_HOURS_40H.map((h, i) => (i < 6 ? Math.round(h * ratio) : 0));
    const total = filled.reduce((a, b) => a + b, 0);
    onChange({
      monthlyHours: filled,
      annualTotal: total,
    });
  };

  const fillTrialPeriod = () => {
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

  // Rychlé akce pro přímou roční sumu
  const setDirectWeeks = (weeks: number) => {
    const hours = Math.round(weeks * effectiveUserTPD);
    onChange({ annualTotal: hours });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
            Odpracovaná doba v kalendářním roce
          </h2>
        </div>

        {/* Přepínač způsobu zadání: Měsíce vs Suma */}
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChange({ inputMode: 'monthly' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              state.inputMode === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Po měsících (12×)
          </button>
          <button
            type="button"
            onClick={() => onChange({ inputMode: 'annual' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              state.inputMode === 'annual'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Celková roční suma
          </button>
        </div>
      </div>

      {/* Režim: Po měsících */}
      {state.inputMode === 'monthly' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Vyplňte odpracované hodiny za jednotlivé kalendářní měsíce:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={fillFullYear}
                className="px-2 py-1 text-[11px] font-medium rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 transition-colors"
                title="Doplní standardní fond pracovní doby pro celý rok"
              >
                Celý rok
              </button>
              <button
                type="button"
                onClick={fillHalfYear}
                className="px-2 py-1 text-[11px] font-medium rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                6 měsíců
              </button>
              <button
                type="button"
                onClick={fillTrialPeriod}
                className="px-2 py-1 text-[11px] font-medium rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                3 měsíce
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition-colors"
                title="Vynulovat vše"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mřížka 12 měsíců – mobilní optimalizace: 2 sloupce na malých displejích, 3-4 na tabletech a desktopech */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {CZECH_MONTHS.map((monthName, idx) => (
              <div
                key={monthName}
                className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {idx + 1}. {monthName}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    hod
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="350"
                  step="0.5"
                  value={state.monthlyHours[idx] === 0 ? '' : state.monthlyHours[idx]}
                  onChange={(e) => handleMonthChange(idx, e.target.value)}
                  placeholder="0"
                  className="w-full text-base sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Režim: Přímá celková roční suma */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
              Zadejte celkový počet odpracovaných hodin za kalendářní rok
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="4000"
                step="0.5"
                value={state.annualTotal === 0 ? '' : state.annualTotal}
                onChange={(e) => handleAnnualChange(e.target.value)}
                placeholder="např. 1040"
                className="w-full text-lg sm:text-xl font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="absolute right-3.5 top-3 text-xs sm:text-sm text-slate-400 dark:text-slate-500 pointer-events-none">
                odpracovaných hodin
              </span>
            </div>

            {/* Rychlé předvolby týdnů */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Rychlé volby:
              </span>
              {[
                { label: '4 týdny (min)', weeks: 4 },
                { label: '13 týdnů (čtvrtletí)', weeks: 13 },
                { label: '26 týdnů (půlrok)', weeks: 26 },
                { label: '52 týdnů (celý rok)', weeks: 52 },
              ].map((btn) => (
                <button
                  key={btn.weeks}
                  type="button"
                  onClick={() => setDirectWeeks(btn.weeks)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Součtový pruh a přepočet na týdny */}
      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Celkem odpracováno za rok
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCzechNumber(currentTotal)} hodin
            </div>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Přepočet přes váš úvazek ({effectiveUserTPD} h/týden)
          </div>
          <div className="text-sm sm:text-base font-bold text-teal-700 dark:text-teal-300">
            {formatCzechNumber(calculatedWeeksExact, 2)} týdnů{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({calculatedFullWeeks} celých násobků TPD)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
