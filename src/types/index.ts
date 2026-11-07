export type TransactionType = 'income' | 'expense';

export type WalletType = 'cash' | 'bca' | 'mandiri' | 'bri' | 'gopay' | 'ovo' | 'dana' | 'shopeepay' | 'lainnya';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  initialBalance: number;
  color: string;
}

export interface Category {
  id: string;
  label: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  walletId: string;
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: number;
}

export type PeriodFilter = 'this_month' | 'last_month' | 'this_year' | 'all';
