import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function BudgetProgress({ budgets }) {
  if (!budgets.length) {
    return (
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Budget Goals</h3>
        <div className="py-8 text-center text-gray-400 dark:text-gray-500">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm">No budgets set. Add budget goals to track spending.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Budget Goals</h3>
      <div className="space-y-4">
        {budgets.map(budget => {
          const pct = Math.min(budget.percentage, 100);
          const isWarning = budget.percentage >= 75 && budget.percentage < 100;
          const isOver = budget.percentage >= 100;
          const barColor = isOver ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-green-500';
          const textColor = isOver ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400';

          return (
            <div key={budget.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: budget.color || '#3b82f6' }} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{budget.category}</span>
                  {isOver && (
                    <span className="badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px]">Over budget!</span>
                  )}
                  {isWarning && (
                    <span className="badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px]">Near limit</span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${textColor}`}>
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500"> / {formatCurrency(budget.limit)}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400 dark:text-gray-500">
                <span>{formatPercent(budget.percentage)} used</span>
                <span>{formatCurrency(Math.max(0, budget.limit - budget.spent))} remaining</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
