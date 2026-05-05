import React from 'react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'combined', label: 'Combined View', icon: '🔗' },
  { id: 'personal', label: 'Personal', icon: '🏠' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'invoices', label: 'Invoices', icon: '🧾' },
  { id: 'budgets', label: 'Budgets', icon: '🎯' },
  { id: 'accounts', label: 'Accounts', icon: '🏦' },
];

export default function Sidebar({ onClose }) {
  const { currentPage, setCurrentPage, transactions } = useApp();

  const handleNav = (id) => {
    setCurrentPage(id);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Finance Tracker</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Personal & Business</p>
          </div>
        </div>
        <button onClick={onClose} className="ml-auto lg:hidden p-1 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`sidebar-link w-full text-left ${currentPage === item.id ? 'active' : ''}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer stats */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {transactions.length} transactions tracked
        </div>
      </div>
    </div>
  );
}
