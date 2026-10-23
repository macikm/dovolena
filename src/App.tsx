import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ContractSettings } from './components/ContractSettings';
import { WorkedHoursInput } from './components/WorkedHoursInput';
import { WeeksProgressBar } from './components/WeeksProgressBar';
import { ResultSummary } from './components/ResultSummary';
import { CalculationDetails } from './components/CalculationDetails';
import { LegalModal } from './components/LegalModal';
import { VacationInputState } from './types/vacation';
import { calculateVacation, generateHoursForPreset } from './utils/calculator';
import { Globe, Smartphone, GitBranch } from 'lucide-react';

export const App: React.FC = () => {
  // Inicializace stavu kalkulačky s výchozími hodnotami (plný rok pro 40h úvazek)
  const [vacationState, setVacationState] = useState<VacationInputState>(() => {
    const saved = localStorage.getItem('dovolena_input_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.userTPD === 'number') {
          return {
            userTPD: parsed.userTPD || 40,
            standardVacationWeeks: parsed.standardVacationWeeks || 4,
            inputMode: parsed.inputMode || 'monthly',
            monthlyHours: Array.isArray(parsed.monthlyHours) ? parsed.monthlyHours : generateHoursForPreset('full-year', parsed.userTPD || 40).monthly,
            annualTotal: parsed.annualTotal ?? generateHoursForPreset('full-year', parsed.userTPD || 40).total,
            activePreset: parsed.activePreset ?? 'full-year',
          };
        }
      } catch (e) {
        // Fallback
      }
    }

    const { monthly, total } = generateHoursForPreset('full-year', 40);
    return {
      userTPD: 40,
      standardVacationWeeks: 4,
      inputMode: 'monthly',
      monthlyHours: monthly,
      annualTotal: total,
      activePreset: 'full-year',
    };
  });

  // Ukládání do localStorage pro komfort uživatele
  useEffect(() => {
    try {
      localStorage.setItem('dovolena_input_state', JSON.stringify(vacationState));
    } catch (e) {}
  }, [vacationState]);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('dovolena_theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dovolena_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dovolena_theme', 'light');
    }
  }, [darkMode]);

  // PWA Instalace
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Modální okno s legislativou
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Hlavní výpočet
  const calculationResult = calculateVacation(vacationState);

  const handleStateChange = (updates: Partial<VacationInputState>) => {
    setVacationState((prev) => {
      const next = { ...prev, ...updates };

      // Při změně úvazku (userTPD): pokud je aktivní předvolba (celý rok, půlrok, 3 měsíce),
      // automaticky přepočítáme odpracované hodiny na nový úvazek
      if (updates.userTPD !== undefined && updates.userTPD !== prev.userTPD && prev.activePreset) {
        const { monthly, total } = generateHoursForPreset(prev.activePreset, updates.userTPD);
        next.monthlyHours = monthly;
        next.annualTotal = total;
      }

      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Pevná hlavička */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        installPrompt={installPrompt}
        onInstallApp={handleInstallApp}
      />

      {/* Hlavní obsah - kompaktní zobrazení pro mobil i desktop */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-5 py-3.5 sm:py-5 space-y-3.5 sm:space-y-4">
        {/* 1. Výsledek - 3 samostatné karty (hodiny, dny, týdny) */}
        <ResultSummary result={calculationResult} />

        {/* 2. Parametry smlouvy a úvazku */}
        <ContractSettings
          state={vacationState}
          onChange={handleStateChange}
        />

        {/* 3. Odpracovaná doba */}
        <WorkedHoursInput
          state={vacationState}
          onChange={handleStateChange}
          calculatedWeeksExact={calculationResult.workedWeeksExact}
          calculatedFullWeeks={calculationResult.workedFullWeeks}
        />

        {/* 4. Ukazatel 52 týdnů (umístěn přímo pod odpracovanou dobou) */}
        <WeeksProgressBar result={calculationResult} />

        {/* 5. Detailní rozpis výpočtu (rozbalovací) */}
        <CalculationDetails result={calculationResult} />
      </main>

      {/* Modální okno s legislativou */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Patička */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors safe-pb">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Kalkulačka dovolené
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              dovolena.martinmacko.cz
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              PWA Ready
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://buymeacoffee.com/martinmacko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
            >
              <span className="text-[13px] opacity-80">🍕</span>
              <span>Kup mi pizzu</span>
            </a>
            <a
              href="https://github.com/macikm/dovolena"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <GitBranch className="w-4 h-4 text-teal-600" />
              <span>macikm/dovolena</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
