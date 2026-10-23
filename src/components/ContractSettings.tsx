import React, { useState } from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { VacationInputState } from '../types/vacation';
import { formatCzechNumber, parseLocaleFloat } from '../utils/calculator';

interface ContractSettingsProps {
  state: VacationInputState;
  onChange: (updates: Partial<VacationInputState>) => void;
}

export const ContractSettings: React.FC<ContractSettingsProps> = ({ state, onChange }) => {
  const [entitlementUnit, setEntitlementUnit] = useState<'weeks' | 'hours'>('weeks');
  
  // Řetězcové stavy pro vstupy, aby uživatel mohl pohodlně psát čárku i tečku bez přeskakování
  const [workloadInput, setWorkloadInput] = useState<string>(String(state.userTPD));
  const currentCalculatedHours = state.userTPD * state.standardVacationWeeks;
  const [weeksInput, setWeeksInput] = useState<string>(String(state.standardVacationWeeks));
  const [hoursInput, setHoursInput] = useState<string>(String(currentCalculatedHours));

  // Synchronizace při změně zvenčí (např. při kliku na tlačítko předvolby)
  React.useEffect(() => {
    setWorkloadInput(String(state.userTPD));
  }, [state.userTPD]);

  React.useEffect(() => {
    setWeeksInput(String(state.standardVacationWeeks));
    setHoursInput(String(Math.round(state.userTPD * state.standardVacationWeeks * 10) / 10));
  }, [state.standardVacationWeeks, state.userTPD]);

  const handleWorkloadChange = (valStr: string) => {
    setWorkloadInput(valStr);
    const parsed = parseLocaleFloat(valStr);
    if (parsed > 0) {
      onChange({ userTPD: parsed });
    }
  };

  const handleWorkloadPreset = (preset: number) => {
    setWorkloadInput(String(preset));
    onChange({ userTPD: preset });
  };

  const handleWeeksChange = (valStr: string) => {
    setWeeksInput(valStr);
    const parsed = parseLocaleFloat(valStr);
    if (parsed > 0) {
      onChange({ standardVacationWeeks: parsed });
    }
  };

  const handleHoursChange = (valStr: string) => {
    setHoursInput(valStr);
    const parsed = parseLocaleFloat(valStr);
    if (parsed > 0 && state.userTPD > 0) {
      const weeks = parsed / state.userTPD;
      onChange({ standardVacationWeeks: Number(weeks.toFixed(4)) });
    }
  };

  const handleWeeksPreset = (weeks: number) => {
    setWeeksInput(String(weeks));
    onChange({ standardVacationWeeks: weeks });
  };

  const WORKLOAD_PRESETS = [
    { label: '40 h (standard)', value: 40 },
    { label: '38,75 h (2 směny)', value: 38.75 },
    { label: '37,5 h (3 směny)', value: 37.5 },
    { label: '30 h (¾ úvazek)', value: 30 },
    { label: '20 h (½ úvazek)', value: 20 },
    { label: '10 h', value: 10 },
  ];

  const currentCalculatedDays = currentCalculatedHours / (state.userTPD / 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
          Úvazek a nárok na dovolenou
        </h2>
      </div>

      <div className="space-y-4">
        {/* 1. Týdenní úvazek */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Váš týdenní úvazek (hodin/týden)
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Zadejte hodnotu ručně nebo klikněte na předvolbu
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={workloadInput}
                onChange={(e) => handleWorkloadChange(e.target.value)}
                placeholder="40"
                className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="ml-1.5 text-xs text-slate-500 font-medium">h / týden</span>
            </div>

            {/* Rychlé předvolby úvazků */}
            <div className="flex flex-wrap items-center gap-1">
              {WORKLOAD_PRESETS.map((p) => {
                const isSelected = Math.abs(state.userTPD - p.value) < 0.01;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handleWorkloadPreset(p.value)}
                    className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950 dark:border-teal-500 dark:text-teal-300 font-semibold shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Roční výměra dovolené */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div>
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Roční výměra dovolené
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Zákonné minimum 4 týdny (§ 212 ZP), u státu/benefit 5 týdnů
              </span>
            </div>

            {/* Přepínač V týdnech / V hodinách */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-[11px] shrink-0">
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

          <div className="flex flex-wrap items-center gap-2">
            {entitlementUnit === 'weeks' ? (
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={weeksInput}
                  onChange={(e) => handleWeeksChange(e.target.value)}
                  placeholder="4"
                  className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <span className="ml-1.5 text-xs text-slate-500 font-medium">týdnů</span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={hoursInput}
                  onChange={(e) => handleHoursChange(e.target.value)}
                  placeholder="160"
                  className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <span className="ml-1.5 text-xs text-slate-500 font-medium">hodin</span>
              </div>
            )}

            {/* Předvolby týdnů */}
            <div className="flex items-center gap-1">
              {[
                { label: '4 týdny (min)', weeks: 4 },
                { label: '5 týdnů (benefit)', weeks: 5 },
                { label: '8 týdnů (školství)', weeks: 8 },
              ].map((item) => {
                const isSelected = Math.abs(state.standardVacationWeeks - item.weeks) < 0.01;
                return (
                  <button
                    key={item.weeks}
                    type="button"
                    onClick={() => handleWeeksPreset(item.weeks)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950 dark:border-teal-500 dark:text-teal-300 font-semibold shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>
              Při odpracování plného roku:{' '}
              <strong className="text-slate-800 dark:text-slate-200">{formatCzechNumber(currentCalculatedHours)} hodin</strong> dovolené{' '}
              ({formatCzechNumber(currentCalculatedDays)} dnů po {formatCzechNumber(state.userTPD / 5, 1)} h)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
