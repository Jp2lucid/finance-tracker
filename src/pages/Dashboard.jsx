import React from 'react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import ProfitTrendChart from '../components/charts/ProfitTrendChart';
import BudgetProgress from '../components/BudgetProgress';
import TransactionList from '../components/TransactionList';
import { sumByType, calcNetProfit, calcBudgetUsage, getFilteredTransactions } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const PERIODS = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'yearly', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

export default function Dashboard() {
  const { transactions, budgets, period, setPeriod } = useApp();

  const filtered = getFilteredTransactions(transactions, 'combined', period);
  const income = sumByType(filtered, 'income');
  const expenses = sumByType(filtered, 'expense');
  const net = calcNetProfit(filtered);
  const budgetsWithUsage = calcBudgetUsage(transactions, budgets, 'monthly');

  const recentTransactions = [...transactions]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p.value ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Income" value={income} icon="💚" color="green" />
        <SummaryCard title="Total Expenses" value={expenses} icon="🔴" color="red" />
        <SummaryCard title="Net Profit/Loss" value={net} icon={net >= 0 ? '📈' : '📉'} color={net >= 0 ? 'green' : 'red'} />
        <SummaryCard title="Transactions" value={filtered.length} icon="📋" color="blue" subtitle={`${period === 'all' ? 'All time' : period}`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart transactions={transactions} />
        <CategoryPieChart transactions={filtered} />
      </div>

      {/* Profit trend */}
      <ProfitTrendChart transactions={transactions} />

      {/* Budget progress */}
      <BudgetProgress budgets={budgetsWithUsage.slice(0, 6)} />

      {/* Recent transactions */}
      <TransactionList
        transactions={recentTransactions}
        title="Recent Transactions"
        showViewType={true}
      />
    </div>
  );
}
