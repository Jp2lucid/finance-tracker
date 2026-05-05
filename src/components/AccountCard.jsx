import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../context/AppContext';

const accountTypeIcons = {
  bank: '🏦',
  credit: '💳',
  cash: '💵',
  digital: '📱',
  investment: '📈',
};

export default function AccountCard({ account }) {
  const { deleteAccount, updateAccount } = useApp();
  const isNegative = account.balance < 0;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: account.color + '20' }}
          >
            {account.icon || accountTypeIcons[account.type] || '💰'}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{account.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.type} account</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {formatCurrency(account.balance)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {isNegative ? 'Outstanding' : 'Available'}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => {
            const newBalance = parseFloat(prompt('Update balance:', account.balance));
            if (!isNaN(newBalance)) updateAccount(account.id, { balance: newBalance });
          }}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Update Balance
        </button>
        <button
          onClick={() => { if (window.confirm('Delete account?')) deleteAccount(account.id); }}
          className="ml-auto text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
