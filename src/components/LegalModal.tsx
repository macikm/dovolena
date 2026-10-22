import React from 'react';
import { X, Scale, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 relative transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Zavřít"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Legislativní pravidla pro výpočet dovolené
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zákoník práce č. 262/2006 Sb. (ve znění novely od 1. 1. 2021)
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Základní princip od 2021 */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50">
            <h3 className="font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
              Dovolená se počítá v hodinách (nikoli ve dnech)
            </h3>
            <p>
              Od 1. 1. 2021 se nárok na dovolenou odvíjí od <strong>odpracované týdenní pracovní doby (TPD)</strong>. To zajišťuje naprostou spravedlnost pro zaměstnance se zkrácenými či nerovnoměrně rozvrženými úvazky.
            </p>
          </div>

          {/* Podmínka vzniku nároku: 4 týdny vs 12 týdnů */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
              Podmínka vzniku nároku: 4 týdny (§ 213 odst. 3 ZP)
            </h3>
            <p>
              Základní podmínkou pro vznik práva na dovolenou (či její poměrnou část) za kalendářní rok je, aby zaměstnanec odpracoval <strong>alespoň 4násobek své týdenní pracovní doby</strong> (tj. alespoň 4 celé týdny).
            </p>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Jak je to s 12 týdny?</strong> Hranice 12 odpracovaných týdnů (12násobek TPD) se uplatňuje u <em>překážek v práci</em> (např. dočasná pracovní neschopnost či rodičovská dovolená), které se pro účely dovolené započítávají jako výkon práce nejvýše do 20násobku TPD pouze tehdy, pokud zaměstnanec mimo ně v daném roce odpracoval alespoň 12násobek TPD. Pro samotný vznik základního nároku však stačí <strong>4 týdny</strong>.
              </div>
            </div>
          </div>

          {/* Pravidlo 1/52 a celé týdny */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Výpočet 1/52 za každý celý týden (§ 213 odst. 1 ZP)
            </h3>
            <p>
              Za každý odpracovaný <strong>celý násobek</strong> své týdenní pracovní doby má zaměstnanec nárok na <strong>1/52</strong> své celoroční výměry. Pokud má rok standardních 52 týdnů a zaměstnanec odpracuje 26 celých týdnů, vzniká nárok přesně na polovinu (26/52) roční dovolené.
            </p>
          </div>

          {/* Zaokrouhlování */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Zaokrouhlování na celé hodiny nahoru (§ 216 odst. 5 ZP)
            </h3>
            <p>
              Zákon výslovně stanoví: <em>„Dovolená, na niž vzniklo právo v příslušném kalendářním roce, se zaokrouhluje na celé hodiny nahoru.“</em> Například výsledek 61,2 hodiny se zaokrouhlí na 62 hodin.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            Rozumím
          </button>
        </div>
      </div>
    </div>
  );
};
