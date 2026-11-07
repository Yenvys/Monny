import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Settings2, Plus } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export type NavTab = 'dashboard' | 'transactions' | 'recap' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddModal,
}) => {
  const { t } = useWallet();

  return (
    <nav
      aria-label="Navigasi Bawah"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-200 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Tab: Beranda / Dashboard */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'dashboard'
              ? 'text-neutral-900 dark:text-white font-bold'
              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t('navDashboard')}</span>
        </button>

        {/* Tab: Transaksi / Transactions */}
        <button
          onClick={() => onChangeTab('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'transactions'
              ? 'text-neutral-900 dark:text-white font-bold'
              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t('navTransactions')}</span>
        </button>

        {/* Center Prominent Add Button */}
        <div className="flex-1 flex justify-center -translate-y-3">
          <button
            onClick={onOpenAddModal}
            className="w-13 h-13 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-lg border-4 border-neutral-100 dark:border-neutral-950 hover:scale-105 active:scale-95 transition-all"
            aria-label={t('navAddTx')}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab: Rekapan / Recap */}
        <button
          onClick={() => onChangeTab('recap')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'recap'
              ? 'text-neutral-900 dark:text-white font-bold'
              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t('navRecap')}</span>
        </button>

        {/* Tab: Pengaturan / Settings */}
        <button
          onClick={() => onChangeTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'settings'
              ? 'text-neutral-900 dark:text-white font-bold'
              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <Settings2 className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t('navSettings')}</span>
        </button>
      </div>
    </nav>
  );
};
