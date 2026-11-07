export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'SGD' | 'MYR' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
  digits: number;
  rateToIDR: number; // 1 Currency = X IDR
}

// User-specified live conversion rates
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  IDR: 1,
  USD: 18140, // $1 USD = 18.140 IDR
  EUR: 20220, // €1 EUR = 20.220 IDR
  SGD: 14160, // S$1 SGD = 14.160 IDR
  MYR: 4469,  // RM1 MYR = 4.469 IDR
  JPY: 114.9, // ¥1 JPY = 114,9 IDR
};

export const CURRENCY_OPTIONS: CurrencyConfig[] = [
  { code: 'IDR', label: 'Rupiah Indonesia (Rp)', symbol: 'Rp', locale: 'id-ID', digits: 0, rateToIDR: 1 },
  { code: 'USD', label: 'US Dollar ($)', symbol: '$', locale: 'en-US', digits: 2, rateToIDR: 18140 },
  { code: 'EUR', label: 'Euro (€)', symbol: '€', locale: 'de-DE', digits: 2, rateToIDR: 20220 },
  { code: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$', locale: 'en-SG', digits: 2, rateToIDR: 14160 },
  { code: 'MYR', label: 'Malaysian Ringgit (RM)', symbol: 'RM', locale: 'ms-MY', digits: 2, rateToIDR: 4469 },
  { code: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥', locale: 'ja-JP', digits: 0, rateToIDR: 114.9 },
];

// Convert base IDR amount to target currency amount
export const convertFromIDR = (amountInIDR: number, targetCurrency: CurrencyCode): number => {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return amountInIDR / rate;
};

// Convert target currency amount back to base IDR amount
export const convertToIDR = (amountInCurrency: number, sourceCurrency: CurrencyCode): number => {
  const rate = EXCHANGE_RATES[sourceCurrency] || 1;
  return Math.round(amountInCurrency * rate);
};

// Format amount (given in base IDR) converted into the target currency
export const formatCurrency = (amountInIDR: number, currencyCode: CurrencyCode = 'IDR'): string => {
  const config = CURRENCY_OPTIONS.find((c) => c.code === currencyCode) || CURRENCY_OPTIONS[0];
  const convertedAmount = convertFromIDR(amountInIDR, currencyCode);

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.digits,
      maximumFractionDigits: config.digits,
    }).format(convertedAmount);
  } catch {
    return `${config.symbol} ${convertedAmount.toFixed(config.digits)}`;
  }
};

// Backward-compatible alias
export const formatRupiah = (amountInIDR: number): string => formatCurrency(amountInIDR, 'IDR');

export const formatDate = (dateStr: string, lang: 'id' | 'en' = 'id'): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateIndo = (dateStr: string): string => formatDate(dateStr, 'id');

export const formatRelativeDay = (dateStr: string, lang: 'id' | 'en' = 'id'): string => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return lang === 'en' ? 'Today' : 'Hari Ini';
  }
  if (dateStr === yesterdayStr) {
    return lang === 'en' ? 'Yesterday' : 'Kemarin';
  }
  return formatDate(dateStr, lang);
};

export const getMonthName = (monthIndex: number, lang: 'id' | 'en' = 'id'): string => {
  const monthsId = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const list = lang === 'en' ? monthsEn : monthsId;
  return list[monthIndex] || '';
};
