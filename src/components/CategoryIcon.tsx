import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  ReceiptText,
  Film,
  HeartPulse,
  GraduationCap,
  Users,
  Laptop,
  CircleEllipsis,
  Briefcase,
  Store,
  LaptopMinimal,
  TrendingUp,
  Sparkles,
  Gift,
  PlusCircle,
  Package,
  CircleHelp,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  ReceiptText,
  Film,
  HeartPulse,
  GraduationCap,
  Users,
  Laptop,
  CircleEllipsis,
  Briefcase,
  Store,
  LaptopMinimal,
  TrendingUp,
  Sparkles,
  Gift,
  PlusCircle,
  Package,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const IconComponent = iconMap[name] || CircleHelp;
  return <IconComponent className={className} size={size} />;
};
