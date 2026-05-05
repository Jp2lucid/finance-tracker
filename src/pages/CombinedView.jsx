import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionList from '../components/TransactionList';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import ProfitTrendChart from '../components/charts/ProfitTrendChart';
import { sumByType, calcNetProfit, getFilteredTransactions } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportUtils';

export default function CombinedView() {
  const { transactions, period, setPeriod } = useApp();
  const [chartFilter, setChartFilter] = useState('combined');

  const filtered = getFilteredTransactions(transactions, 'combined', period);
  const personalFiltered = filtered.filter(t => t.type === 'personal');
  const businessFiltered = filtered.filter(t => t.type === 'business');

  const personalIncome = sumByType(personalFiltered, 'income');
  const personalExpenses = sumByType(personalFiltered, 'expense');
  const businessIncome = sumByType(businessFiltered, 'income');
  const businessExpenses = sumByType(businessFiltered, 'expense');
  const totalIncome = personalIncome + businessIncome;
  const totalExpenses = personalExpenses + businessExpenses;
  const totalNet = calcNetProfit(filtered);

  const chartData = chartFilter === 'personal' ? personalFiltered : chartFilter === 'business' ? businessFiltered : filtered;
  const PERIODS = ['daily', 'weekly', 'monthly', 'yearly', 'all'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Combined View</h2>
        </div>
        <button
          onClick={() => exportTransactionsToCSV(filtered, 'combined-transactions.csv')}
          className="btn-secondary text-sm"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map(p => (
          <button key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* 3-column summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personal column */}
        <div className="card border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏠</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">Personal</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Income</span>
              <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(personalIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Expenses</span>
              <span className="text-red-500 dark:text-red-400 font-medium">{formatCurrency(personalExpenses)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-2">
              <span className="font-medium text-gray-900 dark:text-white">Net</span>
              <span className={`font-bold ${personalIncome - personalExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {formatCurrency(personalIncome - personalExpenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Business column */}
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💼</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">Business</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Revenue</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{formatCurrency(businessIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Expenses</span>
              <span className="text-red-500 dark:text-red-400 font-medium">{formatCurrency(businessExpenses)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-2">
              <span className="font-medium text-gray-900 dark:text-white">Net</span>
              <span className={`font-bold ${businessIncome - businessExpenses >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
                {formatCurrency(businessIncome - businessExpenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall column */}
        <div className="card border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📊</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">Overall Total</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Income</span>
              <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Expenses</span>
              <span className="text-red-500 dark:text-red-400 font-medium">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-2">
              <span className="font-medium text-gray-900 dark:text-white">Net P&L</span>
              <span className={`font-bold text-lg ${totalNet >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-500 dark:text-red-400'}`}>
                {formatCurrency(totalNet)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart filter toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Chart filter:</span>
        {['combined', 'personal', 'business'].map(f => (
          <button key={f}
            onClick={() => setChartFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${chartFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart transactions={chartData} />
        <CategoryPieChart transactions={chartData} />
      </div>

      <ProfitTrendChart transactions={chartData} />

      {/* Combined transactions with color coding */}
      <TransactionList
        transactions={filtered}
        title="All Transactions (🔵 Business | 🟢 Personal)"
        showViewType={true}
      />
    </div>
  );
}
