import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { groupByCategory } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#a855f7'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-gray-900 dark:text-white">{name}</p>
      <p className="text-gray-600 dark:text-gray-400">{formatCurrency(value)}</p>
    </div>
  );
};

export default function CategoryPieChart({ transactions }) {
  const [filter, setFilter] = useState('expense');
  const filtered = transactions.filter(t => filter === 'all' || t.transactionType === filter);
  const grouped = groupByCategory(filtered);
  const data = Object.entries(grouped)
    .map(([name, value]) => ({ name, value: Math.abs(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  if (!data.length) {
    return (
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Breakdown by Category</h3>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden text-xs">
          {['expense', 'income', 'all'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
