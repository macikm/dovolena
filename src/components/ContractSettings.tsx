import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { VacationInputState } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface ContractSettingsProps {
  state: VacationInputState;
  onChange: (updates: Partial<VacationInputState>) => void;
}

export const ContractSettings: React.FC<ContractSettingsProps> = ({ state, onChange }) => {
  const [entitlementUnit, setEntitlementUnit] = useState<'weeks' | 'hours'>('weeks');
  const currentCalculatedHours = state.standardTPD * state.standardVacationWeeks;
  const currentCalculatedDays = currentCalculatedHours / (state.standardTPD / 5);

  const handleWeeksChange = (weeks: number) => {
    onChange({ standardVacationWeeks: Math.max(0, weeks) });
  };

  const handleHoursChange = (hours: number) => {
    const safeHours = Math.max(0, hours);
    const standardTPD = state.standardTPD || 40;
    const weeks = standardTPD > 0 ? safeHours / standardTPD : 0;
    onChange({ standardVacationWeeks: Number(weeks.toFixed(4)) });
  };

  const handleStandardTPDChange = (tpd: number) => {
    const safeTPD = Math.max(1, tpd);
    onChange({
      standardTPD: safeTPD,
      ...(state.isFullTime ? { userTPD: safeTPD } : {}),
    });
  };

  const handleFullTimeToggle = (isFull: boolean) => {
    onChange({
      isFullTime: isFull,
      userTPD: isFull ? state.standardTPD : (state.userTPD || state.standardTPD / 2),
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
          Úvazek a standardní nárok
        </h2>
      </div>

      <div className="space-y-3.5">
        {/* Standardní úvazek */}
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
            Standardní úvazek firmy (hod/týden)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.25"
              min="1"
              max="80"
              value={state.standardTPD}
              onChange={(e) => handleStandardTPDChange(parseFloat(e.target.value) || 0)}
              className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <div className="flex items-center gap-1">
              {[40, 38.75, 37.5].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleStandardTPDChange(preset)}
                  className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors ${
                    state.standardTPD === preset
                      ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950 dark:border-teal-500 dark:text-teal-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {preset} h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Standardní výměra dovolené */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Výměra dovolené
            </label>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setEntitlementUnit('weeks')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  entitlementUnit === 'weeks'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                V týdnech
              </button>
              <button
                type="button"
                onClick={() => setEntitlementUnit('hours')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  entitlementUnit === 'hours'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                V hodinách
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {entitlementUnit === 'weeks' ? (
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="20"
                  value={state.standardVacationWeeks}
                  onChange={(e) => handleWeeksChange(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="800"
                  value={currentCalculatedHours}
                  onChange={(e) => handleHoursChange(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center gap-1">
              {[
                { label: '4 týdny (min)', weeks: 4 },
                { label: '5 týdnů', weeks: 5 },
                { label: '8 týdnů', weeks: 8 },
              ].map((item) => (
                <button
                  key={item.weeks}
                  type="button"
                  onClick={() => handleWeeksChange(item.weeks)}
                  className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors ${
                    state.standardVacationWeeks === item.weeks
                      ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950 dark:border-teal-500 dark:text-teal-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            = {formatCzechNumber(state.standardVacationWeeks)} týdnů = {formatCzechNumber(currentCalculatedHours)} h ({formatCzechNumber(currentCalculatedDays)} dnů)
          </div>
        </div>

        {/* Váš úvazek */}
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
            Váš pracovní úvazek
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFullTimeToggle(true)}
              className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                state.isFullTime
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Plný ({state.standardTPD} h/týden)
            </button>
            <button
              type="button"
              onClick={() => handleFullTimeToggle(false)}
              className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                !state.isFullTime
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Zkrácený {!state.isFullTime && `(${state.userTPD} h)`}
            </button>
          </div>

          {!state.isFullTime && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="1"
                max={state.standardTPD}
                value={state.userTPD}
                onChange={(e) => onChange({ userTPD: parseFloat(e.target.value) || 0 })}
                className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                hod/týden ({formatCzechNumber((state.userTPD / state.standardTPD) * 100, 0)} % úvazek)
              </span>
              <div className="flex items-center gap-1 ml-auto">
                {[20, 30].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onChange({ userTPD: h })}
                    className={`px-2 py-0.5 text-xs rounded border ${
                      state.userTPD === h
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {h} h
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
