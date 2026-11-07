import React from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/formatters';

export const BalanceCard: React.FC = () => {
  const { summary, currency, t } = useWallet();

  const isNetPositive = summary.netSavings >= 0;
  const expenseRatio = summary.totalIncome > 0
    ? Math.min(Math.round((summary.totalExpense / summary.totalIncome) * 100), 100)
    : summary.totalExpense > 0 ? 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm transition-colors duration-200">
      {/* Total Balance */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">
          <span>{t('totalWalletBalance')}</span>
          <div className="flex items-center gap-1 text-[11px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300">
            <Scale className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
            <span>{t('allAccounts')}</span>
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {formatCurrency(summary.totalWalletBalance, currency)}
        </div>
      </div>

      {/* Income & Expense Two Columns */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        {/* Income Card (Green Accent) */}
        <div className="bg-neutral-50 dark:bg-neutral-950/60 border border-emerald-500/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-1">
            <div className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
            <span>{t('income')}</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrency(summary.totalIncome, currency)}
          </div>
        </div>

        {/* Expense Card (Red Accent) */}
        <div className="bg-neutral-50 dark:bg-neutral-950/60 border border-rose-500/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-1">
            <div className="w-5 h-5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <span>{t('expense')}</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 truncate">
            {formatCurrency(summary.totalExpense, currency)}
          </div>
        </div>
      </div>

      {/* Monthly Net Cashflow & Ratio */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300">
        <div className="flex items-center gap-1.5">
          {isNetPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          )}
          <span>{t('netPeriod')}</span>
          <span className={`font-semibold ${isNetPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isNetPositive ? '+' : ''}{formatCurrency(summary.netSavings, currency)}
          </span>
        </div>

        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {t('spent')} <span className="font-semibold text-neutral-900 dark:text-neutral-200">{expenseRatio}%</span>
        </div>
      </div>

      {/* Spending Progress Bar */}
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            expenseRatio > 90
              ? 'bg-rose-500'
              : expenseRatio > 70
              ? 'bg-neutral-500 dark:bg-neutral-400'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${expenseRatio}%` }}
        />
      </div>
    </div>
  );
};
