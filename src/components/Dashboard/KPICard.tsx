import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

export default function KPICard({ title, value, change, icon }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-secondary-900 dark:text-secondary-100">{value}</p>
    </div>
  );
}