import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  Trash2,
  CheckCircle,
  ShieldCheck,
  Wallet,
  Globe,
  Coins,
  HardDrive,
  Info,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CURRENCY_OPTIONS, type CurrencyCode } from '../utils/formatters';
import type { Language } from '../utils/i18n';

export const SettingsView: React.FC = () => {
  const {
    transactions,
    wallets,
    currency,
    setCurrency,
    language,
    setLanguage,
    t,
    clearDatabase,
    importTransactions,
  } = useWallet();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const showStatus = (text: string, isError = false) => {
    setStatusMsg({ text, isError });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Export JSON
  const handleExport = () => {
    const data = {
      appName: 'Monny',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      currency,
      language,
      transactions,
      wallets,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monny_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus(t('backupExportSuccess'));
  };

  // Import JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json.transactions)) {
          importTransactions(json.transactions);
          showStatus(t('backupImportSuccess', { count: json.transactions.length }));
        } else {
          showStatus(t('backupImportError'), true);
        }
      } catch {
        showStatus(t('backupImportError'), true);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentCurrencyConfig =
    CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* App Header / Account Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t('monnyPersonal')}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {transactions.length} {t('offlineSecureLabel')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            statusMsg.isError
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Section 1: Preferensi Aplikasi (Tema removed, Currency & Language enhanced) */}
      <div className="space-y-1.5">
        <h3 className="px-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          {t('sectionPreferences')}
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-sm">
          {/* Currency Format with Multiple Currency Options */}
          <button
            type="button"
            onClick={() => setIsCurrencyModalOpen(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-850 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t('currencyFormat')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {currentCurrencyConfig.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-lg">
                {currentCurrencyConfig.code} ({currentCurrencyConfig.symbol})
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>

          {/* Interface Language (Bahasa Indonesia & English) */}
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-850 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t('languageSetting')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {language === 'en' ? 'English (US)' : 'Bahasa Indonesia'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-lg">
                {language === 'en' ? 'English' : 'Indonesia'}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Section 2: Cadangan & Penyimpanan */}
      <div className="space-y-1.5">
        <h3 className="px-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          {t('sectionStorage')}
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-sm">
          {/* Export Backup */}
          <button
            type="button"
            onClick={handleExport}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-850 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t('exportBackup')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {t('exportBackupDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          {/* Import Backup */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-850 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t('importBackup')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {t('importBackupDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          {/* Clear Database */}
          <button
            type="button"
            onClick={() => {
              if (confirm(t('clearDbConfirm'))) {
                clearDatabase();
                showStatus(t('clearDbSuccess'));
              }
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-500/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 leading-tight">
                  {t('clearAllData')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {t('clearAllDataDesc')}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 rounded-lg">
              {t('resetAction')}
            </span>
          </button>
        </div>
      </div>

      {/* Section 3: Informasi Aplikasi */}
      <div className="space-y-1.5">
        <h3 className="px-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          {t('sectionAbout')}
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-sm">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t('appVersion')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {t('appEdition')}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
              v1.0.0
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t('localStorageType')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {t('localStorageStatus')}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              {t('offlineSecureLabel')}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="text-center pt-2 pb-1">
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
          {t('footerBranding')}
        </p>
      </div>

      {/* Currency Selection Modal / Bottom Sheet */}
      {isCurrencyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsCurrencyModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t('selectCurrency')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-1 max-h-72 overflow-y-auto">
              {CURRENCY_OPTIONS.map((item) => {
                const isSelected = currency === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setCurrency(item.code as CurrencyCode);
                      setIsCurrencyModalOpen(false);
                      showStatus(`Mata uang diubah ke ${item.label}`);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
                        : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-neutral-200/50 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono font-bold">
                        {item.symbol}
                      </span>
                      <div className="text-left">
                        <p className="text-xs">{item.label}</p>
                        <p className="text-[10px] opacity-70">{item.code}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal / Bottom Sheet */}
      {isLanguageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsLanguageModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t('languageSetting')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-1">
              {[
                { code: 'id' as Language, title: 'Bahasa Indonesia', sub: 'Indonesian' },
                { code: 'en' as Language, title: 'English', sub: 'United States' },
              ].map((item) => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setIsLanguageModalOpen(false);
                      showStatus(
                        item.code === 'en'
                          ? 'Language changed to English'
                          : 'Bahasa diubah ke Bahasa Indonesia'
                      );
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
                        : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs">{item.title}</p>
                      <p className="text-[10px] opacity-70">{item.sub}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
