import React, { useState } from 'react';
import { X, Check, Trash2, ArrowDownLeft, ArrowUpRight, FileText } from 'lucide-react';
import type { Transaction, TransactionType } from '../types';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryLabel,
  getWalletLabel,
} from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { WalletIcon } from './WalletIcon';
import { CustomDatePicker } from './CustomDatePicker';
import { useWallet } from '../context/WalletContext';
import { CURRENCY_OPTIONS, convertFromIDR, convertToIDR } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

interface FormProps {
  initialData?: Transaction | null;
  onClose: () => void;
}

const TransactionForm: React.FC<FormProps> = ({ initialData, onClose }) => {
  const { wallets, currency, language, addTransaction, updateTransaction, deleteTransaction, t } =
    useWallet();

  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  
  // Initialize amount: if editing, convert the base IDR amount to current currency
  const [amountStr, setAmountStr] = useState<string>(() => {
    if (!initialData) return '';
    const converted = convertFromIDR(initialData.amount, currency);
    return currency === 'IDR' || currency === 'JPY'
      ? Math.round(converted).toString()
      : converted.toFixed(2).replace(/\.00$/, '');
  });

  const [category, setCategory] = useState<string>(
    initialData?.category || (initialData?.type === 'income' ? 'gaji' : 'makanan')
  );
  const [walletId, setWalletId] = useState<string>(
    initialData?.walletId || wallets[0]?.id || 'w_cash'
  );
  const [date, setDate] = useState<string>(initialData?.date || getTodayString);
  const [note, setNote] = useState<string>(initialData?.note || '');
  const [error, setError] = useState<string>('');

  const currencyConfig = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('makanan');
    } else {
      setCategory('gaji');
    }
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleQuickAdd = (value: number) => {
    const current = parseFloat(amountStr) || 0;
    const newVal = current + value;
    setAmountStr(currency === 'IDR' || currency === 'JPY' ? Math.round(newVal).toString() : newVal.toString());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amountStr);
    if (!cleanAmount || cleanAmount <= 0) {
      setError(t('errorValidAmount'));
      return;
    }
    if (!category) {
      setError(t('errorSelectCategory'));
      return;
    }

    // Convert input amount to base IDR for persistent storage
    const amountInIDR = convertToIDR(cleanAmount, currency);

    if (initialData) {
      updateTransaction({
        ...initialData,
        type,
        amount: amountInIDR,
        category,
        walletId,
        date,
        note: note.trim(),
      });
    } else {
      addTransaction({
        type,
        amount: amountInIDR,
        category,
        walletId,
        date,
        note: note.trim(),
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (initialData && confirm(t('deleteTxConfirm'))) {
      deleteTransaction(initialData.id);
      onClose();
    }
  };

  // Quick preset values tailored per currency
  const quickPresets =
    currency === 'IDR'
      ? [10000, 20000, 50000, 100000, 500000]
      : currency === 'JPY'
      ? [500, 1000, 2000, 5000, 10000]
      : currency === 'MYR'
      ? [10, 20, 50, 100, 200]
      : [5, 10, 20, 50, 100];

  return (
    <div
      className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl transition-colors duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          {initialData ? t('modalEditTitle') : t('modalAddTitle')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="overflow-y-auto p-5 space-y-4 flex-1">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Type Toggle: Expense / Income */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition ${
              type === 'expense'
                ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 border border-neutral-300 dark:border-neutral-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('expense')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition ${
              type === 'income'
                ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 border border-neutral-300 dark:border-neutral-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{t('income')}</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {t('amountLabel')} ({currencyConfig.code})
            </label>
            <span className="text-[10px] text-neutral-500">
              1 {currencyConfig.code} = {currencyConfig.rateToIDR.toLocaleString('id-ID')} IDR
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
              {currencyConfig.symbol}
            </span>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="0"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-xl font-bold text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 transition"
            />
          </div>

          {/* Quick Add Buttons */}
          <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
            {quickPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg shrink-0 transition"
              >
                +{currencyConfig.symbol}
                {val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            {t('categoryLabel')}
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = category === cat.id;
              const catLabel = getCategoryLabel(cat.id, language);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] text-center leading-tight truncate w-full ${
                      isSelected
                        ? 'font-bold text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {catLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wallet Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            {t('walletLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {wallets.map((w) => {
              const isSelected = walletId === w.id;
              const wName = getWalletLabel(w.id, w.name, language);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWalletId(w.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                    <WalletIcon type={w.type} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium truncate">{wName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Date Picker */}
        <CustomDatePicker
          value={date}
          onChange={setDate}
          label={t('dateLabel')}
        />

        {/* Notes Input */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            {t('noteLabel')}
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition flex items-center justify-center shrink-0"
              title="Hapus Transaksi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
          >
            <Check className="w-4 h-4" />
            <span>{initialData ? t('updateBtn') : t('saveBtn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <TransactionForm
        key={`${initialData ? initialData.id : 'new-tx'}`}
        initialData={initialData}
        onClose={onClose}
      />
    </div>
  );
};
