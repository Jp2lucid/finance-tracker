import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionItem({ transaction: tx, onEdit, onDelete, showViewType = false }) {
  const isIncome = tx.transactionType === 'income';
  const isBusiness = tx.type === 'business';

  const typeColor = isBusiness
    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';

  return (
    <div className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group">
      {/* Date */}
      <div className="col-span-3 md:col-span-1 text-xs text-gray-500 dark:text-gray-400">
        {formatDate(tx.date, 'MMM d')}
      </div>

      {/* Description */}
      <div className="col-span-9 md:col-span-4">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{tx.description}</p>
            {tx.notes && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[180px]">{tx.notes}</p>
            )}
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-0.5">
              {(tx.tags || []).slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
              {tx.taxDeductible && (
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                  tax-deductible
                </span>
              )}
              {tx.isRecurring && (
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded">
                  🔄 {tx.recurringInterval}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="hidden md:block col-span-2 text-xs text-gray-500 dark:text-gray-400 truncate">
        {tx.category}
      </div>

      {/* View type badge */}
      {showViewType && (
        <div className="hidden md:block col-span-1">
          <span className={`badge border text-[10px] ${typeColor}`}>
            {isBusiness ? '💼' : '🏠'}
          </span>
        </div>
      )}

      {/* Amount */}
      <div className={`hidden md:block ${showViewType ? 'col-span-2' : 'col-span-3'} text-right`}>
        <span className={`text-sm font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
        </span>
      </div>

      {/* Mobile amount */}
      <div className="md:hidden col-span-12 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">{tx.category}</span>
        <span className={`text-sm font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
        </span>
      </div>

      {/* Actions */}
      <div className="hidden md:flex col-span-2 justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit?.(tx)}
          className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
          title="Edit"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete?.(tx.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
