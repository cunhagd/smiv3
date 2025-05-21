// src/components/StatCard.tsx
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  isPositive = false,
  isNegative = false,
  icon, 
  className,
  children 
}: StatCardProps) => {
  return (
    <div className={cn("dashboard-card min-h-[140px] flex flex-col justify-between", className)}>
      <div className="dashboard-card-header">
        <span className="text-sm text-gray-400">{title}</span>
        <button className="p-1 hover:bg-white/5 rounded-full">
          <ArrowUpRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold">{value}</h3>
          {change && (
            <span 
              className={cn(
                "text-sm flex items-center gap-1",
                isPositive && "text-brand-yellow",
                isNegative && "text-brand-red",
                !isPositive && !isNegative && "text-gray-400"
              )}
            >
              {change}
            </span>
          )}
          {children && (
            <div className="mt-1 text-sm flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-brand-yellow">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;