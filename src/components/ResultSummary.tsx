import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { VacationCalculationResult } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface ResultSummaryProps {
  result: VacationCalculationResult;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const averageDayLength = result.userTPD / 5;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-teal-800/40">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Nárok na dovolenou
        </span>

        {result.qualifies ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Podmínka splněna
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Méně než 4 týdny
          </span>
        )}
      </div>

      {result.qualifies ? (
        <div className="space-y-3">
          {/* Hlavní čísla */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {formatCzechNumber(result.roundedEntitlementHours)}
            </span>
            <span className="text-lg sm:text-xl font-medium text-teal-200">
              hodin
            </span>
            <span className="text-slate-400 text-sm">
              ({formatCzechNumber(result.entitlementDays, 1)} dnů / {formatCzechNumber(result.entitlementWeeks, 2)} týdnů)
            </span>
          </div>

          {/* Doplňkové rychlé karty */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-teal-800/40 text-xs">
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-teal-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Dny dovolené
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {formatCzechNumber(result.entitlementDays, 1)} dnů
              </div>
              <div className="text-[11px] text-slate-400">
                směna {formatCzechNumber(averageDayLength, 1)} h
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-teal-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Týdny dovolené
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {formatCzechNumber(result.entitlementWeeks, 2)} týdnů
              </div>
              <div className="text-[11px] text-slate-400">
                úvazek {result.userTPD} h/týden
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-1">
          <div className="text-3xl font-bold text-amber-300">0 hodin nároku</div>
          <p className="text-xs text-slate-300 mt-1">
            Dle § 213 odst. 3 ZP je nutné odpracovat alespoň 4 celé týdny ({4 * result.userTPD} h). Odpracováno {formatCzechNumber(result.totalWorkedHours)} h ({formatCzechNumber(result.workedWeeksExact, 1)} týdnů).
          </p>
        </div>
      )}
    </div>
  );
};
