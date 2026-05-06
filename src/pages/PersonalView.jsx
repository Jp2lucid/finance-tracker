import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionList from '../components/TransactionList';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { sumByType, calcNetProfit, getFilteredTransactions, estimateTax } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportUtils';

export default function PersonalView() {
  const { transactions, period, setPeriod } = useApp();
  const [showTax, setShowTax] = useState(false);

  const allPersonal = transactions.filter(t => t.type === 'personal');
  const filtered = getFilteredTransactions(allPersonal, 'personal', period);
  const income = sumByType(filtered, 'income');
  const expenses = sumByType(filtered, 'expense');
  const net = calcNetProfit(filtered);
  const tax = estimateTax(allPersonal, 'personal');

  const PERIODS = ['daily', 'weekly', 'monthly', 'yearly', 'all'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Finance</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportTransactionsToCSV(filtered, 'personal-transactions.csv')}
            className="btn-secondary text-sm"
          >
            📥 Export CSV
          </button>
          <button onClick={() => setShowTax(!showTax)} className="btn-secondary text-sm">
            🧮 Tax Estimate
          </button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map(p => (
          <button key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300'}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Tax estimate panel */}
      {showTax && (
        <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">🧮 Personal Tax Estimate (22%)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-xs">Total Income</p>
              <p className="font-bold text-amber-900 dark:text-amber-200">{formatCurrency(sumByType(allPersonal.filter(t => t.transactionType === 'income'), 'income'))}</p>
            </div>
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-xs">Deductible Expenses</p>
              <p className="font-bold text-amber-900 dark:text-amber-200">{formatCurrency(tax.deductibleExpenses)}</p>
            </div>
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-xs">Taxable Income</p>
              <p className="font-bold text-amber-900 dark:text-amber-200">{formatCurrency(tax.taxableIncome)}</p>
            </div>
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-xs">Estimated Tax Owed</p>
              <p className="font-bold text-red-700 dark:text-red-400 text-lg">{formatCurrency(tax.estimatedTax)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Income" value={income} icon="💚" color="green" />
        <SummaryCard title="Expenses" value={expenses} icon="🔴" color="red" />
        <SummaryCard title="Net" value={net} icon={net >= 0 ? '📈' : '📉'} color={net >= 0 ? 'green' : 'red'} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart transactions={allPersonal} />
        <CategoryPieChart transactions={filtered} />
      </div>

      {/* Transactions */}
      <TransactionList transactions={filtered} title="Personal Transactions" />
    </div>
  );
}
