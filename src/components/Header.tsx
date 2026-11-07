import React from 'react';
import { WalletCards, Sun, Moon } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CustomMonthSelect } from './CustomMonthSelect';

export const Header: React.FC = () => {
  const { selectedMonth, setSelectedMonth, availableMonths, theme, toggleTheme, t } = useWallet();

  return (
    <header className="sticky top-0 z-30 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 transition-colors duration-200">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-sm">
            <WalletCards className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
              {t('appName')}
            </h1>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Custom Month Dropdown Popup */}
          <CustomMonthSelect
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={availableMonths}
          />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Ubah Tema Terang / Gelap"
            className="w-8 h-8 rounded-lg bg-neutral-200/70 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
