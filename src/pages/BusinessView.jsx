import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionList from '../components/TransactionList';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import ProfitTrendChart from '../components/charts/ProfitTrendChart';
import { sumByType, calcNetProfit, calcProfitMargin, getFilteredTransactions, estimateTax } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportUtils';

export default function BusinessView() {
  const { transactions, period, setPeriod } = useApp();
  const [showTax, setShowTax] = useState(false);

  const allBusiness = transactions.filter(t => t.type === 'business');
  const filtered = getFilteredTransactions(allBusiness, 'business', period);
  const income = sumByType(filtered, 'income');
  const expenses = sumByType(filtered, 'expense');
  const net = calcNetProfit(filtered);
  const margin = calcProfitMargin(filtered);
  const tax = estimateTax(allBusiness, 'business');

  const PERIODS = ['daily', 'weekly', 'monthly', 'yearly', 'all'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💼</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Business Finance</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportTransactionsToCSV(filtered, 'business-transactions.csv')}
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Tax estimate panel */}
      {showTax && (
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">🧮 Business Tax Estimate (25%)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-xs">Total Revenue</p>
              <p className="font-bold text-blue-900 dark:text-blue-200">{formatCurrency(sumByType(allBusiness, 'income'))}</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-xs">Deductible Expenses</p>
              <p className="font-bold text-blue-900 dark:text-blue-200">{formatCurrency(tax.deductibleExpenses)}</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-xs">Taxable Income</p>
              <p className="font-bold text-blue-900 dark:text-blue-200">{formatCurrency(tax.taxableIncome)}</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-xs">Estimated Tax Owed</p>
              <p className="font-bold text-red-700 dark:text-red-400 text-lg">{formatCurrency(tax.estimatedTax)}</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
            * Based on {formatPercent(tax.rate)} flat rate. Consult a tax professional for actual filing.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Revenue" value={income} icon="💙" color="blue" />
        <SummaryCard title="Expenses" value={expenses} icon="🔴" color="red" />
        <SummaryCard title="Net Profit" value={net} icon={net >= 0 ? '📈' : '📉'} color={net >= 0 ? 'blue' : 'red'} />
        <SummaryCard
          title="Profit Margin"
          value={formatPercent(margin)}
          icon="📊"
          color="purple"
          subtitle="Revenue − Costs / Revenue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart transactions={allBusiness} />
        <CategoryPieChart transactions={filtered} />
      </div>

      <ProfitTrendChart transactions={allBusiness} />

      {/* Transactions */}
      <TransactionList transactions={filtered} title="Business Transactions" />
    </div>
  );
}
