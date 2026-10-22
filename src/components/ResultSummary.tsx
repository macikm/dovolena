import React from 'react';
import { Clock, Calendar, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VacationCalculationResult } from '../types/vacation';
import { formatCzechNumber } from '../utils/calculator';

interface ResultSummaryProps {
  result: VacationCalculationResult;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const averageDayLength = result.userTPD / 5;

  return (
    <div className="space-y-4">
      {/* Hlavní výsledková karta */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-teal-950/20 border border-teal-800/40 relative overflow-hidden">
        {/* Dekorativní gradientní kruh na pozadí */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Výsledný zákonný nárok na dovolenou
            </span>

            {result.qualifies ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                <CheckCircle className="w-3.5 h-3.5" />
                Zákonná podmínka splněna
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
                <AlertTriangle className="w-3.5 h-3.5" />
                Podmínka nesplněna (&lt; 4 týdny)
              </span>
            )}
          </div>

          {result.qualifies ? (
            <div>
              {/* Hlavní číslo: HODINY */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {formatCzechNumber(result.roundedEntitlementHours)}
                </span>
                <span className="text-xl sm:text-2xl font-semibold text-teal-200">
                  hodin dovolené
                </span>
              </div>

              {/* Informace o zaokrouhlení nahoru */}
              <div className="mt-1 text-xs text-teal-300/90 flex items-center gap-2 flex-wrap">
                <span>
                  § 216 odst. 5 ZP: zaokrouhleno na celé hodiny nahoru
                </span>
                {result.exactEntitlementHours !== result.roundedEntitlementHours && (
                  <span className="opacity-80">
                    (přesný matematický výpočet: {formatCzechNumber(result.exactEntitlementHours, 2)} h)
                  </span>
                )}
              </div>

              {/* Vedlejší metriky: Dny a Týdny */}
              <div className="mt-6 pt-5 border-t border-teal-800/50 grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-teal-200 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Přepočet na dny
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {formatCzechNumber(result.entitlementDays, 1)}{' '}
                    <span className="text-sm font-normal text-teal-200">dnů</span>
                  </div>
                  <div className="text-[11px] text-teal-300/70 mt-0.5">
                    při průměrné směně {formatCzechNumber(averageDayLength, 1)} h/den
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-teal-200 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Přepočet na týdny
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {formatCzechNumber(result.entitlementWeeks, 2)}{' '}
                    <span className="text-sm font-normal text-teal-200">týdnů</span>
                  </div>
                  <div className="text-[11px] text-teal-300/70 mt-0.5">
                    při úvazku {result.userTPD} h/týden
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Upozornění, když neodpracoval 4 týdny */
            <div className="py-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-200 mb-2">
                0 hodin nároku
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Podle <strong>§ 213 odst. 3 Zákoníku práce</strong> vzniká právo na poměrnou část dovolené pouze zaměstnanci, který za kalendářní rok odpracoval <strong>alespoň 4násobek své týdenní pracovní doby</strong> (4 celé týdny = {4 * result.userTPD} hodin).
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-200 text-xs font-medium border border-amber-500/30">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Aktuálně máte odpracováno {formatCzechNumber(result.totalWorkedHours)} h ({formatCzechNumber(result.workedWeeksExact, 1)} týdnů). Do splnění podmínky zbývá {result.minWeeksRequired - result.workedFullWeeks} týdny ({Math.max(0, (result.minWeeksRequired * result.userTPD) - result.totalWorkedHours)} hodin).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
