import React from 'react';
import { Wallet, Building2, Smartphone, CreditCard } from 'lucide-react';
import type { WalletType } from '../types';

interface WalletIconProps {
  type: WalletType;
  className?: string;
  size?: number;
}

export const WalletIcon: React.FC<WalletIconProps> = ({ type, className = 'w-4 h-4', size = 16 }) => {
  switch (type) {
    case 'cash':
      return <Wallet className={className} size={size} />;
    case 'bca':
    case 'mandiri':
    case 'bri':
      return <Building2 className={className} size={size} />;
    case 'gopay':
    case 'ovo':
    case 'dana':
    case 'shopeepay':
      return <Smartphone className={className} size={size} />;
    default:
      return <CreditCard className={className} size={size} />;
  }
};
