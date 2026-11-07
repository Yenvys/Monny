import React from 'react';
import { WalletIcon } from './WalletIcon';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/formatters';
import { getWalletLabel } from '../data/categories';

export const WalletList: React.FC = () => {
  const { wallets, summary, currency, language, t } = useWallet();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 tracking-tight">
          {t('accountsAndFunds')}
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {wallets.length} {t('accountsCount')}
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
        {wallets.map((wallet) => {
          const balance = summary.walletBalances[wallet.id] ?? 0;
          const walletName = getWalletLabel(wallet.id, wallet.name, language);

          return (
            <div
              key={wallet.id}
              className="shrink-0 w-36 sm:w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  <WalletIcon type={wallet.type} className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                  {wallet.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate font-medium">
                  {walletName}
                </p>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 truncate">
                  {formatCurrency(balance, currency)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
