import React, { useState } from 'react';
import { Briefcase, Calendar, Sparkles } from 'lucide-react';
import { VacationInputState } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface ContractSettingsProps {
  state: VacationInputState;
  onChange: (updates: Partial<VacationInputState>) => void;
}

export const ContractSettings: React.FC<ContractSettingsProps> = ({ state, onChange }) => {
  // Lokální stav pro režim zadávání výměry: 'weeks' nebo 'hours'
  const [entitlementUnit, setEntitlementUnit] = useState<'weeks' | 'hours'>('weeks');
  
  // Pomocný stav pro hodnotu v hodinách, když uživatel edituje hodiny
  const currentCalculatedHours = state.standardTPD * state.standardVacationWeeks;
  const currentCalculatedDays = currentCalculatedHours / (state.standardTPD / 5);

  const handleWeeksChange = (weeks: number) => {
    const safeWeeks = Math.max(0, weeks);
    onChange({ standardVacationWeeks: safeWeeks });
  };

  const handleHoursChange = (hours: number) => {
    const safeHours = Math.max(0, hours);
    const standardTPD = state.standardTPD || 40;
    // Přepočet hodin zpátky na týdny
    const weeks = standardTPD > 0 ? safeHours / standardTPD : 0;
    onChange({ standardVacationWeeks: Number(weeks.toFixed(4)) });
  };

  const handleStandardTPDChange = (tpd: number) => {
    const safeTPD = Math.max(1, tpd);
    onChange({
      standardTPD: safeTPD,
      // Pokud má plný úvazek, aktualizujeme i userTPD
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h2 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
          Parametry úvazku a dovolené
        </h2>
      </div>

      <div className="space-y-5">
        {/* 1. Standardní stanovená týdenní pracovní doba (TPD) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Standardní týdenní úvazek u zaměstnavatele
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Obvykle 40 h (§ 79 ZP)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[140px]">
              <input
                type="number"
                step="0.25"
                min="1"
                max="80"
                value={state.standardTPD}
                onChange={(e) => handleStandardTPDChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
                placeholder="40"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">
                hod/týden
              </span>
            </div>

            {/* Rychlé předvolby standardních úvazků dle ZP */}
            <div className="flex items-center gap-1">
              {[40, 38.75, 37.5].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleStandardTPDChange(preset)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    state.standardTPD === preset
                      ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950/60 dark:border-teal-500 dark:text-teal-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {preset} h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Standardní nárok na dovolenou (v týdnech nebo v hodinách s obousměrným přepočtem) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Standardní roční výměra dovolené
            </label>
            {/* Přepínač zadání v týdnech vs v hodinách */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setEntitlementUnit('weeks')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  entitlementUnit === 'weeks'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                V týdnech
              </button>
              <button
                type="button"
                onClick={() => setEntitlementUnit('hours')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  entitlementUnit === 'hours'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                V hodinách
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {entitlementUnit === 'weeks' ? (
              <div className="relative flex-1 min-w-[140px]">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="20"
                  value={state.standardVacationWeeks}
                  onChange={(e) => handleWeeksChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
                  placeholder="4"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">
                  týdny
                </span>
              </div>
            ) : (
              <div className="relative flex-1 min-w-[140px]">
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="800"
                  value={currentCalculatedHours}
                  onChange={(e) => handleHoursChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
                  placeholder="160"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">
                  hodin
                </span>
              </div>
            )}

            {/* Rychlá tlačítka pro standardní výměry */}
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
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    state.standardVacationWeeks === item.weeks
                      ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950/60 dark:border-teal-500 dark:text-teal-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                  title={`${item.weeks} týdny = ${item.weeks * state.standardTPD} hodin`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Obousměrný přepočet badge */}
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 flex items-center justify-between flex-wrap gap-1.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-500" />
              <span>Přepočet plného ročního nároku:</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatCzechNumber(state.standardVacationWeeks)} týdnů = {formatCzechNumber(currentCalculatedHours)} hodin ({formatCzechNumber(currentCalculatedDays)} dnů)
            </span>
          </div>
        </div>

        {/* 3. Váš sjednaný úvazek (plný vs zkrácený) */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
            Váš pracovní úvazek
          </label>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleFullTimeToggle(true)}
              className={`p-3 rounded-xl border text-left transition-all ${
                state.isFullTime
                  ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-semibold">Plný úvazek</div>
              <div className="text-sm font-bold mt-0.5">{state.standardTPD} h / týden</div>
            </button>

            <button
              type="button"
              onClick={() => handleFullTimeToggle(false)}
              className={`p-3 rounded-xl border text-left transition-all ${
                !state.isFullTime
                  ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-semibold">Zkrácený / Vlastní</div>
              <div className="text-sm font-bold mt-0.5">
                {!state.isFullTime ? `${state.userTPD} h / týden` : 'Nastavit hodiny...'}
              </div>
            </button>
          </div>

          {/* Vstup pro zkrácený úvazek */}
          {!state.isFullTime && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Zadejte konkrétní týdenní úvazek (hodiny/týden):
                </span>
                <div className="flex items-center gap-1">
                  {[20, 30, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onChange({ userTPD: preset })}
                      className={`px-2 py-0.5 text-xs font-medium rounded border transition-colors ${
                        state.userTPD === preset
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {preset} h
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max={state.standardTPD}
                  value={state.userTPD}
                  onChange={(e) => onChange({ userTPD: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="20"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">
                  hodin / týden
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>
                  Poměr k plnému úvazku:{' '}
                  <strong>{formatCzechNumber((state.userTPD / state.standardTPD) * 100, 1)} %</strong>
                  {' • '}
                  Plný roční nárok při odpracování roku:{' '}
                  <strong>{formatCzechNumber(state.userTPD * state.standardVacationWeeks)} hodin</strong>
                  {' '}
                  ({formatCzechNumber((state.userTPD * state.standardVacationWeeks) / (state.userTPD / 5))} dnů po {formatCzechNumber(state.userTPD / 5, 1)} h)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
