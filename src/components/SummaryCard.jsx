import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function SummaryCard({ title, value, subtitle, icon, trend, trendValue, color = 'blue', variant = 'default' }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', text: 'text-blue-700 dark:text-blue-300' },
    green:  { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400', text: 'text-green-700 dark:text-green-300' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-600 dark:text-red-400', text: 'text-red-700 dark:text-red-300' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', text: 'text-purple-700 dark:text-purple-300' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', text: 'text-amber-700 dark:text-amber-300' },
    gray:   { bg: 'bg-gray-50 dark:bg-gray-800', icon: 'text-gray-600 dark:text-gray-400', text: 'text-gray-700 dark:text-gray-300' },
  };

  const c = colorMap[color] || colorMap.blue;

  const isNegative = typeof value === 'number' && value < 0;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center text-xl`}>
            {icon}
          </div>
        )}
      </div>

      {(trend !== undefined || trendValue !== undefined) && (
        <div className="flex items-center gap-1 text-xs">
          {trend === 'up' && <span className="text-green-600 dark:text-green-400">▲</span>}
          {trend === 'down' && <span className="text-red-600 dark:text-red-400">▼</span>}
          {trendValue !== undefined && (
            <span className={trend === 'up' ? 'text-green-600 dark:text-green-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}>
              {typeof trendValue === 'number' ? formatPercent(Math.abs(trendValue)) : trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
