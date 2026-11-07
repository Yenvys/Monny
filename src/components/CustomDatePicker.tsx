import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { useWallet } from '../context/WalletContext';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
  const { language } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const monthNames = language === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ID;
  const dayNames = language === 'en' ? DAY_NAMES_EN : DAY_NAMES_ID;

  // Parse current value
  const parseDate = (dStr: string) => {
    if (!dStr) return new Date();
    const [y, m, d] = dStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const currentDateObj = parseDate(value);

  // Calendar view state (which month/year is being viewed in calendar)
  const [viewYear, setViewYear] = useState(currentDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDateObj.getMonth());

  // Reset view when opening
  useEffect(() => {
    if (isOpen) {
      const d = parseDate(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [isOpen, value]);

  // Click outside to close (desktop)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Quick shortcuts
  const setQuickDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  // Generate days grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevM = viewMonth === 0 ? 12 : viewMonth;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    days.push({
      day,
      isCurrentMonth: false,
      dateStr: `${prevY}-${String(prevM).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    days.push({
      day: d,
      isCurrentMonth: true,
      dateStr: `${viewYear}-${mStr}-${dStr}`,
    });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextM = viewMonth === 11 ? 1 : viewMonth + 2;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    days.push({
      day: i,
      isCurrentMonth: false,
      dateStr: `${nextY}-${String(nextM).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-xl py-2.5 px-3.5 text-xs text-neutral-900 dark:text-neutral-100 transition shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <span className="font-medium">{formatDate(value, language)}</span>
        </div>
        <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-200/60 dark:bg-neutral-900 px-2 py-0.5 rounded-md">
          {value === todayStr
            ? language === 'en'
              ? 'Today'
              : 'Hari Ini'
            : language === 'en'
            ? 'Pick'
            : 'Pilih'}
        </span>
      </button>

      {/* Custom Calendar Popup / Modal */}
      {isOpen && (
        <div className="fixed sm:absolute inset-0 sm:inset-auto sm:top-full sm:left-0 sm:mt-2 z-50 flex items-end sm:items-start justify-center sm:justify-start bg-black/60 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none animate-in fade-in duration-150">
          <div
            className="w-full sm:w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Month & Year navigation + Close */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {monthNames[viewMonth]} {viewYear}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center sm:hidden ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick date shortcuts */}
            <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg shrink-0 transition ${
                  value === todayStr
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {language === 'en' ? 'Today' : 'Hari Ini'}
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(-1)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 shrink-0 transition"
              >
                {language === 'en' ? 'Yesterday' : 'Kemarin'}
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(-2)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 shrink-0 transition"
              >
                {language === 'en' ? '2 Days Ago' : '2 Hari Lalu'}
              </button>
            </div>

            {/* Day name headers */}
            <div className="grid grid-cols-7 gap-1 text-center py-1">
              {dayNames.map((name, idx) => (
                <span
                  key={name}
                  className={`text-[10px] font-semibold ${
                    idx === 0
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 pt-1">
              {days.map((item, idx) => {
                const isSelected = item.dateStr === value;
                const isToday = item.dateStr === todayStr;

                return (
                  <button
                    key={`${item.dateStr}-${idx}`}
                    type="button"
                    onClick={() => handleSelectDay(item.dateStr)}
                    className={`h-8 rounded-lg text-xs font-medium flex flex-col items-center justify-center relative transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-xs'
                        : item.isCurrentMonth
                        ? 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        : 'text-neutral-400 dark:text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                    }`}
                  >
                    <span>{item.day}</span>
                    {isToday && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-neutral-900 dark:bg-white absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom confirmation */}
            <div className="pt-3 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                {language === 'en' ? 'Selected:' : 'Terpilih:'}{' '}
                <strong className="text-neutral-800 dark:text-neutral-200">
                  {formatDate(value, language)}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-bold flex items-center gap-1 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Done' : 'Pilih'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
