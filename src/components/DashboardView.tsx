import React from 'react';
import { ArrowRight, Receipt, PlusCircle, Sparkles } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { WalletList } from './WalletList';
import { TransactionItem } from './TransactionItem';
import { useWallet } from '../context/WalletContext';
import type { Transaction } from '../types';

interface DashboardViewProps {
  onOpenAddModal: () => void;
  onGoToTransactions: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddModal,
  onGoToTransactions,
  onSelectTransaction,
}) => {
  const { filteredTransactions, transactions, loadDemoData, t } = useWallet();
  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Hero Financial Summary */}
      <BalanceCard />

      {/* Wallet / Accounts carousel */}
      <WalletList />

      {/* Recent Transactions Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 tracking-tight">
              {t('recentTransactions')}
            </h2>
            <span className="text-[11px] text-neutral-400">({filteredTransactions.length})</span>
          </div>

          {filteredTransactions.length > 5 && (
            <button
              onClick={onGoToTransactions}
              className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-10 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
            <Receipt className="w-9 h-9 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {transactions.length === 0 ? t('dbCleanState') : t('noTxYet')}
            </p>
            <p className="text-xs text-neutral-500 mt-1 mb-4 max-w-xs mx-auto">
              {transactions.length === 0 ? t('dbCleanDesc') : t('filterPeriodDesc')}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t('recordTxBtn')}</span>
              </button>

              {transactions.length === 0 && (
                <button
                  onClick={loadDemoData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 text-xs font-medium transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span>Isi Data Demo</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onClick={() => onSelectTransaction(tx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
