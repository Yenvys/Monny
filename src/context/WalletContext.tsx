import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import type { Transaction, Wallet, WalletType } from '../types';
import { DEFAULT_WALLETS, getInitialTransactions, getDemoTransactions } from '../data/categories';
import type { CurrencyCode } from '../utils/formatters';
import { TRANSLATIONS, type Language } from '../utils/i18n';

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  totalWalletBalance: number;
  savingsRate: number;
  walletBalances: Record<string, number>;
}

export type ThemeMode = 'dark' | 'light';

interface WalletContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['id'], params?: Record<string, string | number>) => string;
  transactions: Transaction[];
  wallets: Wallet[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (data: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addWallet: (name: string, type: WalletType, initialBalance: number) => void;
  summary: SummaryData;
  filteredTransactions: Transaction[];
  clearDatabase: () => void;
  loadDemoData: () => void;
  importTransactions: (data: Transaction[]) => void;
}

const STORAGE_KEY_TX = 'monny_transactions_v2';
const STORAGE_KEY_WALLETS = 'monny_wallets_v2';
const STORAGE_KEY_THEME = 'monny_theme_v2';
const STORAGE_KEY_CURRENCY = 'monny_currency_v2';
const STORAGE_KEY_LANG = 'monny_lang_v2';

const getInitialMonthStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) || localStorage.getItem('dompku_theme_v2');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Currency state (defaults to IDR)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY_CURRENCY) || localStorage.getItem('dompku_currency_v2')) as CurrencyCode;
      if (saved && ['IDR', 'USD', 'EUR', 'SGD', 'MYR', 'JPY'].includes(saved)) {
        return saved;
      }
      return 'IDR';
    } catch {
      return 'IDR';
    }
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY_CURRENCY, c);
  };

  // Language state (defaults to 'id')
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY_LANG) || localStorage.getItem('dompku_lang_v2')) as Language;
      if (saved === 'id' || saved === 'en') return saved;
      return 'id';
    } catch {
      return 'id';
    }
  });

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem(STORAGE_KEY_LANG, l);
  };

  // Translation helper
  const t = useCallback(
    (key: keyof typeof TRANSLATIONS['id'], params?: Record<string, string | number>): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS['id'];
      let str = dict[key] || TRANSLATIONS['id'][key] || String(key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [language]
  );

  // Apply theme to HTML tag, meta tag, and native StatusBar
  useEffect(() => {
    const root = document.documentElement;
    const metaTheme = document.getElementById('meta-theme-color');
    const isDark = theme === 'dark';
    const barColor = isDark ? '#09090b' : '#fafafa';

    if (isDark) {
      root.classList.add('dark');
      if (metaTheme) metaTheme.setAttribute('content', barColor);
    } else {
      root.classList.remove('dark');
      if (metaTheme) metaTheme.setAttribute('content', barColor);
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);

    // Sync native Android status bar with Capacitor
    if (Capacitor.isPluginAvailable('StatusBar')) {
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(() => {});
      StatusBar.setBackgroundColor({ color: barColor }).catch(() => {});
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Wallets state
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WALLETS) || localStorage.getItem('dompku_wallets_v2');
      return saved ? JSON.parse(saved) : DEFAULT_WALLETS;
    } catch {
      return DEFAULT_WALLETS;
    }
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX) || localStorage.getItem('dompku_transactions_v2');
      return saved ? JSON.parse(saved) : getInitialTransactions();
    } catch {
      return getInitialTransactions();
    }
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getInitialMonthStr);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  // Available months
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(getInitialMonthStr());

    transactions.forEach((tx) => {
      if (tx.date) {
        set.add(tx.date.substring(0, 7));
      }
    });

    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (selectedMonth !== 'all') {
      list = list.filter((t) => t.date && t.date.startsWith(selectedMonth));
    }
    return list.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return b.createdAt - a.createdAt;
    });
  }, [transactions, selectedMonth]);

  // Financial calculations
  const summary = useMemo<SummaryData>(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    const walletBalances: Record<string, number> = {};
    wallets.forEach((w) => {
      walletBalances[w.id] = w.initialBalance || 0;
    });

    transactions.forEach((tx) => {
      if (walletBalances[tx.walletId] !== undefined) {
        if (tx.type === 'income') {
          walletBalances[tx.walletId] += tx.amount;
        } else {
          walletBalances[tx.walletId] -= tx.amount;
        }
      }
    });

    const totalWalletBalance = Object.values(walletBalances).reduce((acc, curr) => acc + curr, 0);

    return {
      totalIncome,
      totalExpense,
      netSavings,
      totalWalletBalance,
      savingsRate,
      walletBalances,
    };
  }, [transactions, filteredTransactions, wallets]);

  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addWallet = (name: string, type: WalletType, initialBalance: number) => {
    const newWallet: Wallet = {
      id: `w_${Date.now()}`,
      name,
      type,
      initialBalance,
      color: 'text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
    };
    setWallets((prev) => [...prev, newWallet]);
  };

  const clearDatabase = () => {
    setTransactions([]);
    setWallets(DEFAULT_WALLETS);
    localStorage.removeItem(STORAGE_KEY_TX);
    localStorage.removeItem(STORAGE_KEY_WALLETS);
  };

  const loadDemoData = () => {
    setWallets(DEFAULT_WALLETS);
    setTransactions(getDemoTransactions());
  };

  const importTransactions = (imported: Transaction[]) => {
    setTransactions(imported);
  };

  return (
    <WalletContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        language,
        setLanguage,
        t,
        transactions,
        wallets,
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addWallet,
        summary,
        filteredTransactions,
        clearDatabase,
        loadDemoData,
        importTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
