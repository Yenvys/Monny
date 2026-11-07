import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { getMonthName } from '../utils/formatters';
import { useWallet } from '../context/WalletContext';

interface CustomMonthSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

export const CustomMonthSelect: React.FC<CustomMonthSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  const { language, t } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatMonthLabel = (val: string) => {
    if (val === 'all') return t('allTime');
    const [year, month] = val.split('-');
    const mIdx = parseInt(month, 10) - 1;
    return `${getMonthName(mIdx, language)} ${year}`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const allOptions = ['all', ...options.filter((o) => o !== 'all')];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 bg-neutral-200/70 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 font-medium transition cursor-pointer"
        aria-label="Pilih Periode Bulan"
      >
        <Calendar className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
        <span className="truncate max-w-[110px]">{formatMonthLabel(value)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            {t('selectPeriod')}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {allOptions.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                    isSelected
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <span>{formatMonthLabel(opt)}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
