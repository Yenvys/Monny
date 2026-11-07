import type { Category, Wallet, Transaction } from '../types';
import type { Language } from '../utils/i18n';

export const CATEGORY_LABELS: Record<string, { id: string; en: string }> = {
  makanan: { id: 'Makanan & Minuman', en: 'Food & Drinks' },
  transport: { id: 'Transportasi', en: 'Transportation' },
  belanja: { id: 'Belanja Kebutuhan', en: 'Groceries & Shopping' },
  tagihan: { id: 'Tagihan & Utilitas', en: 'Bills & Utilities' },
  hiburan: { id: 'Hiburan & Ngopi', en: 'Entertainment & Cafe' },
  kesehatan: { id: 'Kesehatan & Obat', en: 'Health & Pharmacy' },
  pendidikan: { id: 'Edukasi & Kursus', en: 'Education & Courses' },
  keluarga: { id: 'Keluarga & Donasi', en: 'Family & Charity' },
  elektronik: { id: 'Gadget & Alat', en: 'Gadgets & Tech' },
  lainnya_keluar: { id: 'Pengeluaran Lain', en: 'Other Expense' },
  gaji: { id: 'Gaji Bulanan', en: 'Monthly Salary' },
  bisnis: { id: 'Bisnis & Jualan', en: 'Business & Sales' },
  freelance: { id: 'Freelance & Side Job', en: 'Freelance & Side Gig' },
  investasi: { id: 'Investasi & Dividen', en: 'Investments & Dividends' },
  bonus: { id: 'Bonus & THR', en: 'Bonus & Incentives' },
  hadiah: { id: 'Hadiah & Transfer', en: 'Gifts & Transfers' },
  lainnya_masuk: { id: 'Pemasukan Lain', en: 'Other Income' },
};

export const WALLET_LABELS: Record<string, { id: string; en: string }> = {
  w_cash: { id: 'Uang Tunai', en: 'Cash' },
  w_bca: { id: 'Rekening Bank', en: 'Bank Account' },
  w_ewallet: { id: 'E-Wallet', en: 'E-Wallet' },
};

export const getCategoryLabel = (id: string, lang: Language = 'id'): string => {
  return CATEGORY_LABELS[id]?.[lang] || id;
};

export const getWalletLabel = (id: string, fallback: string, lang: Language = 'id'): string => {
  return WALLET_LABELS[id]?.[lang] || fallback;
};

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'makanan', label: 'Makanan & Minuman', type: 'expense', icon: 'Utensils', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'transport', label: 'Transportasi', type: 'expense', icon: 'Car', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'belanja', label: 'Belanja Kebutuhan', type: 'expense', icon: 'ShoppingBag', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'tagihan', label: 'Tagihan & Utilitas', type: 'expense', icon: 'ReceiptText', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'hiburan', label: 'Hiburan & Ngopi', type: 'expense', icon: 'Film', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'kesehatan', label: 'Kesehatan & Obat', type: 'expense', icon: 'HeartPulse', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'pendidikan', label: 'Edukasi & Kursus', type: 'expense', icon: 'GraduationCap', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'keluarga', label: 'Keluarga & Donasi', type: 'expense', icon: 'Users', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'elektronik', label: 'Gadget & Alat', type: 'expense', icon: 'Laptop', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'lainnya_keluar', label: 'Pengeluaran Lain', type: 'expense', icon: 'CircleEllipsis', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'gaji', label: 'Gaji Bulanan', type: 'income', icon: 'Briefcase', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'bisnis', label: 'Bisnis & Jualan', type: 'income', icon: 'Store', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'freelance', label: 'Freelance & Side Job', type: 'income', icon: 'LaptopMinimal', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'investasi', label: 'Investasi & Dividen', type: 'income', icon: 'TrendingUp', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'bonus', label: 'Bonus & THR', type: 'income', icon: 'Sparkles', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'hadiah', label: 'Hadiah & Transfer', type: 'income', icon: 'Gift', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
  { id: 'lainnya_masuk', label: 'Pemasukan Lain', type: 'income', icon: 'PlusCircle', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const DEFAULT_WALLETS: Wallet[] = [
  { id: 'w_cash', name: 'Uang Tunai', type: 'cash', initialBalance: 0, color: 'text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700' },
  { id: 'w_bca', name: 'Rekening Bank', type: 'bca', initialBalance: 0, color: 'text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700' },
  { id: 'w_ewallet', name: 'E-Wallet', type: 'gopay', initialBalance: 0, color: 'text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700' },
];

export const getInitialTransactions = (): Transaction[] => {
  return [];
};

export const getDemoTransactions = (): Transaction[] => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yd = String(yesterday.getDate()).padStart(2, '0');
  const ym = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yy = yesterday.getFullYear();

  return [
    {
      id: 'tx_demo_1',
      type: 'income',
      amount: 5000000,
      category: 'gaji',
      walletId: 'w_bca',
      date: `${yy}-${ym}-01`,
      note: 'Gaji Pokok',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'tx_demo_2',
      type: 'expense',
      amount: 50000,
      category: 'makanan',
      walletId: 'w_cash',
      date: `${y}-${m}-${d}`,
      note: 'Makan Siang',
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'tx_demo_3',
      type: 'expense',
      amount: 30000,
      category: 'transport',
      walletId: 'w_ewallet',
      date: `${yy}-${ym}-${yd}`,
      note: 'Bensin & Ongkos',
      createdAt: Date.now() - 86400000,
    },
  ];
};
