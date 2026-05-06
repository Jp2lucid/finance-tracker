import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AccountCard from '../components/AccountCard';
import { formatCurrency } from '../utils/formatters';

const ACCOUNT_TYPES = ['bank', 'credit', 'cash', 'digital', 'investment'];
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#ef4444', '#14b8a6'];
const ICONS = ['🏦', '💳', '💵', '📱', '📈', '💰', '🏢', '🅿️'];

const defaultForm = {
  name: '',
  type: 'bank',
  balance: '',
  color: '#3b82f6',
  icon: '🏦',
};

export default function AccountsPage() {
  const { accounts, addAccount, transactions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);
  const netWorth = totalAssets - totalLiabilities;

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAccount({ ...form, balance: parseFloat(form.balance) || 0 });
    setForm(defaultForm);
    setShowForm(false);
  };

  const getAccountTransactions = (accountName) =>
    transactions.filter(t => t.account === accountName).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏦</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Accounts & Wallets</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-sm"
        >
          + Add Account
        </button>
      </div>

      {/* Net worth summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Assets</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Liabilities</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalLiabilities)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net Worth</p>
          <p className={`text-xl font-bold ${netWorth >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(netWorth)}
          </p>
        </div>
      </div>

      {/* Add account form */}
      {showForm && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Account Name</label>
                <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chase Checking" required />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" name="type" value={form.type} onChange={handleChange}>
                  {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Current Balance</label>
              <input className="input" name="balance" type="number" step="0.01" value={form.balance} onChange={handleChange} placeholder="0.00" required />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Use negative values for credit card balances you owe.</p>
            </div>
            <div>
              <label className="label">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(icon => (
                  <button key={icon} type="button"
                    onClick={() => setForm(f => ({ ...f, icon }))}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${form.icon === icon ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-transparent bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button"
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${form.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Add Account</button>
            </div>
          </form>
        </div>
      )}

      {/* Account grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.length === 0 ? (
          <div className="col-span-full card py-12 text-center text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-2">🏦</div>
            <p>No accounts added yet</p>
          </div>
        ) : (
          accounts.map(account => (
            <div key={account.id}>
              <AccountCard account={account} />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                {getAccountTransactions(account.name)} transactions
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
