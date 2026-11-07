import React, { useState, useMemo } from 'react';
import { Search, Receipt, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '../types';
import { ALL_CATEGORIES, getCategoryLabel } from '../data/categories';
import { TransactionItem } from './TransactionItem';
import { CustomSelect } from './CustomSelect';
import { useWallet } from '../context/WalletContext';

interface TransactionHistoryViewProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  onSelectTransaction,
}) => {
  const { filteredTransactions, language, t } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return filteredTransactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const cat = getCategoryLabel(tx.category, language).toLowerCase();
        const note = (tx.note || '').toLowerCase();
        const amountStr = tx.amount.toString();
        return cat.includes(term) || note.includes(term) || amountStr.includes(term);
      }

      return true;
    });
  }, [filteredTransactions, typeFilter, categoryFilter, searchTerm, language]);

  const categoryOptions = useMemo(() => {
    return [
      { id: 'all', label: t('allCategories') },
      ...ALL_CATEGORIES.map((c) => ({
        id: c.id,
        label: getCategoryLabel(c.id, language),
      })),
    ];
  }, [language, t]);

  return (
    <div className="space-y-3.5 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-neutral-900 dark:text-white" />
          <span>{t('txListTitle')}</span>
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          {t('txCountDesc', { count: filtered.length })}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500"
        />
      </div>

      {/* Filter Chips: Type and Category */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Type selector */}
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
            typeFilter === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          {t('filterAll')}
        </button>
        <button
          onClick={() => setTypeFilter('expense')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
            typeFilter === 'expense'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{t('filterExpense')}</span>
        </button>
        <button
          onClick={() => setTypeFilter('income')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
            typeFilter === 'income'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>{t('filterIncome')}</span>
        </button>

        {/* Custom Category Dropdown */}
        <CustomSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
          placeholder={t('allCategories')}
        />
      </div>

      {/* List */}
      <div className="space-y-2 pt-1">
        {filtered.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
            <Receipt className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">
              {t('noTxFound')}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {t('noTxFoundDesc')}
            </p>
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onClick={() => onSelectTransaction(tx)}
            />
          ))
        )}
      </div>
    </div>
  );
};
