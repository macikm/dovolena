import React from 'react';
import { Palmtree, Sun, Moon, Download, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLegalModal: () => void;
  installPrompt: any;
  onInstallApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenLegalModal,
  installPrompt,
  onInstallApp,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Logo and title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
            <Palmtree className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                Kalkulačka dovolené
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                <ShieldCheck className="w-3 h-3" />
                ZP ČR
              </span>
            </div>
            <a
              href="https://buymeacoffee.com/martinmacko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline transition-colors mt-0.5"
              title="Podpořit tvůrce - Kup mi pizzu na buymeacoffee.com"
            >
              <span>🍕</span>
              <span>Kup mi pizzu</span>
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {installPrompt && (
            <button
              onClick={onInstallApp}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all active:scale-95"
              title="Instalovat aplikaci do zařízení (PWA)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Instalovat</span>
            </button>
          )}

          <button
            onClick={onOpenLegalModal}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Informace k české legislativě a výpočtu"
            aria-label="Informace k legislativě"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={darkMode ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            aria-label="Přepnout motiv vzhledu"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
