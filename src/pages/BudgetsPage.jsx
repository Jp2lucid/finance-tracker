import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BudgetProgress from '../components/BudgetProgress';
import { calcBudgetUsage } from '../utils/calculations';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const defaultForm = {
  category: '',
  limit: '',
  period: 'monthly',
  type: 'personal',
  color: '#3b82f6',
};

export default function BudgetsPage() {
  const { budgets, addBudget, deleteBudget, updateBudget, transactions, categories } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  const budgetsWithUsage = calcBudgetUsage(transactions, budgets, 'monthly');

  const allCategories = [
    ...(categories?.personal || []),
    ...(categories?.business || []),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, limit: parseFloat(form.limit) || 0 };
    if (editingId) {
      updateBudget(editingId, data);
      setEditingId(null);
    } else {
      addBudget(data);
    }
    setForm(defaultForm);
    setShowForm(false);
  };

  const handleEdit = (budget) => {
    setForm({ ...defaultForm, ...budget });
    setEditingId(budget.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Budget Goals</h2>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(defaultForm); setShowForm(true); }}
          className="btn-primary text-sm"
        >
          + Add Budget
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Budget' : 'New Budget Goal'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <select className="input" name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category...</option>
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Monthly Limit ($)</label>
                <input className="input" name="limit" type="number" min="0" step="0.01" value={form.limit} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">View Type</label>
                <select className="input" name="type" value={form.type} onChange={handleChange}>
                  <option value="personal">🏠 Personal</option>
                  <option value="business">💼 Business</option>
                  <option value="all">🔗 Both</option>
                </select>
              </div>
              <div>
                <label className="label">Color</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {COLORS.map(c => (
                    <button key={c} type="button"
                      onClick={() => setForm(f => ({ ...f, color: c }))}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${form.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">{editingId ? 'Save Changes' : 'Add Budget'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Budget list with progress */}
      <BudgetProgress budgets={budgetsWithUsage} />

      {/* Budget management table */}
      {budgets.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Manage Budgets</h3>
          <div className="space-y-2">
            {budgets.map(budget => (
              <div key={budget.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: budget.color || '#3b82f6' }} />
                  <span className="text-sm text-gray-900 dark:text-white">{budget.category}</span>
                  <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px]">{budget.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">${budget.limit}/mo</span>
                  <button onClick={() => handleEdit(budget)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => { if (window.confirm('Delete budget?')) deleteBudget(budget.id); }} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
