import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  Copy,
  CheckCheck,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ALL_CATEGORIES, getCategoryLabel } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, getMonthName } from '../utils/formatters';

export const RecapView: React.FC = () => {
  const { filteredTransactions, summary, selectedMonth, currency, language, t } = useWallet();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [copied, setCopied] = useState(false);

  // Group transactions by category for current filtered transactions
  const categoryRecap = useMemo(() => {
    const expenseMap: Record<string, { total: number; count: number }> = {};
    const incomeMap: Record<string, { total: number; count: number }> = {};

    filteredTransactions.forEach((tx) => {
      const map = tx.type === 'expense' ? expenseMap : incomeMap;
      if (!map[tx.category]) {
        map[tx.category] = { total: 0, count: 0 };
      }
      map[tx.category].total += tx.amount;
      map[tx.category].count += 1;
    });

    const formatList = (
      map: Record<string, { total: number; count: number }>,
      grandTotal: number,
      type: 'expense' | 'income'
    ) => {
      return Object.entries(map)
        .map(([categoryId, data]) => {
          const categoryObj = ALL_CATEGORIES.find((c) => c.id === categoryId) || {
            id: categoryId,
            label: categoryId,
            icon: 'CircleHelp',
            color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700',
            type,
          };
          const percentage = grandTotal > 0 ? Math.round((data.total / grandTotal) * 100) : 0;
          return {
            category: categoryObj,
            total: data.total,
            count: data.count,
            percentage,
          };
        })
        .sort((a, b) => b.total - a.total);
    };

    return {
      expenses: formatList(expenseMap, summary.totalExpense, 'expense'),
      incomes: formatList(incomeMap, summary.totalIncome, 'income'),
    };
  }, [filteredTransactions, summary.totalExpense, summary.totalIncome, language, currency]);

  // Average daily expense
  const averageDailyExpense = useMemo(() => {
    if (summary.totalExpense === 0) return 0;
    let daysCount = 30;
    if (selectedMonth !== 'all') {
      const today = new Date();
      const [, m] = selectedMonth.split('-').map(Number);
      if (m === today.getMonth() + 1) {
        daysCount = Math.max(today.getDate(), 1);
      }
    }
    return Math.round(summary.totalExpense / daysCount);
  }, [summary.totalExpense, selectedMonth]);

  // Health status
  const financialStatus = useMemo(() => {
    if (summary.totalIncome === 0 && summary.totalExpense === 0) {
      return {
        label: t('noDataStatus'),
        desc: t('noDataStatusDesc'),
        icon: HelpCircle,
        color: 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800',
      };
    }
    if (summary.netSavings < 0) {
      return {
        label: t('deficitStatus'),
        desc: t('deficitStatusDesc'),
        icon: AlertCircle,
        color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
      };
    }
    if (summary.savingsRate >= 30) {
      return {
        label: t('primeStatus'),
        desc: t('primeStatusDesc', { rate: summary.savingsRate }),
        icon: ShieldCheck,
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      };
    }
    return {
      label: t('fairStatus'),
      desc: t('fairStatusDesc', { rate: summary.savingsRate }),
      icon: ShieldCheck,
      color: 'text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
    };
  }, [summary.totalIncome, summary.totalExpense, summary.netSavings, summary.savingsRate, t, language]);

  // Copy text report
  const handleCopyReport = () => {
    let periodName = t('allTime');
    if (selectedMonth !== 'all') {
      const [y, m] = selectedMonth.split('-');
      periodName = `${getMonthName(parseInt(m, 10) - 1, language)} ${y}`;
    }

    const isEn = language === 'en';
    let report = `[${isEn ? 'MONNY FINANCIAL RECAP' : 'REKAPAN KEUANGAN MONNY'} - ${periodName}]\n`;
    report += `--------------------------------------\n`;
    report += `${isEn ? 'Total Income ' : 'Total Pemasukan  '}: ${formatCurrency(summary.totalIncome, currency)}\n`;
    report += `${isEn ? 'Total Expense' : 'Total Pengeluaran'}: ${formatCurrency(summary.totalExpense, currency)}\n`;
    report += `${isEn ? 'Net Balance  ' : 'Selisih Bersih   '}: ${formatCurrency(summary.netSavings, currency)}\n`;
    report += `${isEn ? 'Cash Balance ' : 'Total Saldo Kas  '}: ${formatCurrency(summary.totalWalletBalance, currency)}\n`;
    report += `--------------------------------------\n`;
    report += `${isEn ? 'EXPENSES BREAKDOWN:' : 'RINCIAN PENGELUARAN:'}\n`;
    if (categoryRecap.expenses.length === 0) {
      report += isEn ? `(No expenses recorded)\n` : `(Belum ada pengeluaran)\n`;
    } else {
      categoryRecap.expenses.forEach((item, idx) => {
        const catName = getCategoryLabel(item.category.id, language);
        report += `${idx + 1}. ${catName}: ${formatCurrency(item.total, currency)} (${item.percentage}%)\n`;
      });
    }
    report += `--------------------------------------\n`;
    report += `${isEn ? 'INCOME BREAKDOWN:' : 'RINCIAN PEMASUKAN:'}\n`;
    if (categoryRecap.incomes.length === 0) {
      report += isEn ? `(No income recorded)\n` : `(Belum ada pemasukan)\n`;
    } else {
      categoryRecap.incomes.forEach((item, idx) => {
        const catName = getCategoryLabel(item.category.id, language);
        report += `${idx + 1}. ${catName}: ${formatCurrency(item.total, currency)} (${item.percentage}%)\n`;
      });
    }

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentList = activeTab === 'expense' ? categoryRecap.expenses : categoryRecap.incomes;
  const currentTotal = activeTab === 'expense' ? summary.totalExpense : summary.totalIncome;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Title & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-neutral-900 dark:text-white" />
            <span>{t('recapTitle')}</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t('recapSubtitle')}
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('copiedReport')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>{t('copyReport')}</span>
            </>
          )}
        </button>
      </div>

      {/* Financial Health Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${financialStatus.color}`}>
        <financialStatus.icon className="w-5 h-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold leading-none">{financialStatus.label}</p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">
            {financialStatus.desc}
          </p>
        </div>
      </div>

      {/* 2x2 Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('income')}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalIncome, currency)}
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>{t('expense')}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(summary.totalExpense, currency)}
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            {summary.netSavings >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            )}
            <span>{t('netPeriod')}</span>
          </div>
          <p
            className={`text-sm sm:text-base font-bold ${
              summary.netSavings >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {summary.netSavings >= 0 ? '+' : ''}{formatCurrency(summary.netSavings, currency)}
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>{t('dailyAverage')}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-200">
            {formatCurrency(averageDailyExpense, currency)}
          </p>
        </div>
      </div>

      {/* Tab Switcher: Pengeluaran vs Pemasukan */}
      <div className="pt-2">
        <div className="grid grid-cols-2 p-1 bg-neutral-200/60 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'expense'
                ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 border border-neutral-300 dark:border-neutral-700 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('expenseCategories')} ({categoryRecap.expenses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'income'
                ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 border border-neutral-300 dark:border-neutral-700 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{t('incomeCategories')} ({categoryRecap.incomes.length})</span>
          </button>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <span>{t('categoryAndPercent')}</span>
          <span>{t('nominalTotal')} ({formatCurrency(currentTotal, currency)})</span>
        </div>

        {currentList.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-400">
            {t('noRecapData')}
          </div>
        ) : (
          currentList.map((item) => {
            const catName = getCategoryLabel(item.category.id, language);

            return (
              <div key={item.category.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0">
                      <CategoryIcon name={item.category.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 truncate leading-tight">
                        {catName}
                      </p>
                      <p className="text-[10px] text-neutral-400 leading-tight">
                        {item.count} tx ({item.percentage}%)
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(item.total, currency)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-100 dark:bg-neutral-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeTab === 'expense' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
