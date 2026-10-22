import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, Timer } from 'lucide-react';
import { VacationCalculationResult } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface ResultSummaryProps {
  result: VacationCalculationResult;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const averageDayLength = result.userTPD / 5;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-teal-800/40">
      {/* Horní stavový řádek */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Nárok na dovolenou
        </span>

        {result.qualifies ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Podmínka splněna
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Méně než 4 týdny
          </span>
        )}
      </div>

      {result.qualifies ? (
        /* 3 čisté karty: Hodiny, Dny, Týdny */
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* 1. Hodiny */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
            <div className="text-[11px] sm:text-xs font-medium text-teal-200 flex items-center gap-1.5 mb-1">
              <Timer className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>V hodinách</span>
            </div>
            <div className="my-0.5">
              <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {formatCzechNumber(result.roundedEntitlementHours)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-teal-200 ml-1">
                h
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-teal-300/80 truncate">
              hlavní zákonný nárok
            </div>
          </div>

          {/* 2. Dny */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
            <div className="text-[11px] sm:text-xs font-medium text-teal-200 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Ve dnech</span>
            </div>
            <div className="my-0.5">
              <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {formatCzechNumber(result.entitlementDays, 1)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-teal-200 ml-1">
                dnů
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-teal-300/80 truncate">
              směna {formatCzechNumber(averageDayLength, 1)} h
            </div>
          </div>

          {/* 3. Týdny */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
            <div className="text-[11px] sm:text-xs font-medium text-teal-200 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>V týdnech</span>
            </div>
            <div className="my-0.5">
              <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {formatCzechNumber(result.entitlementWeeks, 2)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-teal-200 ml-1">
                týdnů
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-teal-300/80 truncate">
              úvazek {result.userTPD} h/týden
            </div>
          </div>
        </div>
      ) : (
        <div className="py-2">
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 mb-1">
            0 hodin nároku
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dle § 213 odst. 3 ZP je pro vznik nároku nutné odpracovat alespoň 4 celé týdny ({4 * result.userTPD} h). Aktuálně máte odpracováno {formatCzechNumber(result.totalWorkedHours)} h ({formatCzechNumber(result.workedWeeksExact, 1)} týdnů).
          </p>
        </div>
      )}
    </div>
  );
};
