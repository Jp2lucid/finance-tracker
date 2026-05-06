import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const defaultForm = {
  description: '',
  category: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  type: 'personal',
  transactionType: 'expense',
  account: '',
  notes: '',
  tags: '',
  isRecurring: false,
  recurringInterval: 'monthly',
  taxDeductible: false,
  costPrice: '',
  salePrice: '',
};

export default function TransactionForm({ transaction, onClose, defaultType }) {
  const { addTransaction, updateTransaction, categories, accounts } = useApp();
  const [form, setForm] = useState(defaultForm);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const { addCategory } = useApp();

  useEffect(() => {
    if (transaction) {
      setForm({
        ...defaultForm,
        ...transaction,
        tags: Array.isArray(transaction.tags) ? transaction.tags.join(', ') : (transaction.tags || ''),
      });
    } else {
      setForm(f => ({ ...defaultForm, type: defaultType || f.type }));
    }
  }, [transaction, defaultType]);

  const currentCategories = categories?.[form.type] || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      salePrice: parseFloat(form.salePrice) || 0,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    if (transaction) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(form.type, newCategory.trim());
      setForm(f => ({ ...f, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCat(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type toggles */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">View</label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                {['personal', 'business'].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, type: t, category: '' }))}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${form.type === t
                      ? (t === 'business' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white')
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {t === 'business' ? '💼' : '🏠'} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Transaction Type</label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                {['income', 'expense'].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, transactionType: t }))}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${form.transactionType === t
                      ? (t === 'income' ? 'bg-green-600 text-white' : 'bg-red-500 text-white')
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {t === 'income' ? '↑' : '↓'} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <input className="input" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Monthly Rent" required />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount *</label>
              <input className="input" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" required />
            </div>
            <div>
              <label className="label">Date *</label>
              <input className="input" name="date" type="date" value={form.date} onChange={handleChange} required />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <div className="flex gap-2">
              <select className="input" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category...</option>
                {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" onClick={() => setShowNewCat(!showNewCat)}
                className="btn-secondary text-sm px-3 whitespace-nowrap">
                + New
              </button>
            </div>
            {showNewCat && (
              <div className="flex gap-2 mt-2">
                <input className="input text-sm" placeholder="New category name" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                <button type="button" onClick={handleAddCategory} className="btn-primary text-sm px-3">Add</button>
              </div>
            )}
          </div>

          {/* Account */}
          <div>
            <label className="label">Account</label>
            <select className="input" name="account" value={form.account} onChange={handleChange}>
              <option value="">Select account...</option>
              {(accounts || []).map(a => <option key={a.id} value={a.name}>{a.icon} {a.name}</option>)}
            </select>
          </div>

          {/* Cost & Sale Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Cost Price</label>
              <input className="input" name="costPrice" type="number" min="0" step="0.01" value={form.costPrice} onChange={handleChange} placeholder="0.00" />
            </div>
            <div>
              <label className="label">Sale Price / Revenue</label>
              <input className="input" name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={handleChange} placeholder="0.00" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input className="input" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. monthly, subscription, work" />
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" name="notes" rows={2} value={form.notes} onChange={handleChange} placeholder="Additional notes or receipt description..." />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isRecurring" checked={form.isRecurring} onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Recurring</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="taxDeductible" checked={form.taxDeductible} onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Tax Deductible</span>
            </label>
          </div>

          {form.isRecurring && (
            <div>
              <label className="label">Recurring Interval</label>
              <select className="input" name="recurringInterval" value={form.recurringInterval} onChange={handleChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
