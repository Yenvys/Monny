import React from 'react';
import type { Transaction } from '../types';
import { ALL_CATEGORIES, getCategoryLabel, getWalletLabel } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { WalletIcon } from './WalletIcon';
import { formatCurrency, formatRelativeDay } from '../utils/formatters';
import { useWallet } from '../context/WalletContext';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const { wallets, currency, language, t } = useWallet();

  const category = ALL_CATEGORIES.find((c) => c.id === transaction.category) || {
    id: transaction.category,
    label: transaction.category,
    icon: 'CircleHelp',
    color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700',
    type: transaction.type,
  };

  const categoryLabel = getCategoryLabel(transaction.category, language);
  const wallet = wallets.find((w) => w.id === transaction.walletId);
  const walletName = wallet ? getWalletLabel(wallet.id, wallet.name, language) : 'Wallet';
  const isIncome = transaction.type === 'income';

  return (
    <div
      onClick={() => onClick && onClick(transaction)}
      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition cursor-pointer active:scale-[0.99]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            isIncome
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <CategoryIcon name={category.icon} className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {categoryLabel}
            </h3>
          </div>
          {transaction.note && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
              {transaction.note}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 dark:text-neutral-400">
            <span>{formatRelativeDay(transaction.date, language)}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {wallet && <WalletIcon type={wallet.type} className="w-3 h-3 text-neutral-400" />}
              <span className="truncate max-w-[90px]">{walletName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <span
          className={`text-sm font-bold block ${
            isIncome
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
        </span>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-400 uppercase font-medium">
          {isIncome ? t('txTypeIn') : t('txTypeOut')}
        </span>
      </div>
    </div>
  );
};
