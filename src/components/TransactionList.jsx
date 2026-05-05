import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';

export default function TransactionList({ transactions, title = 'Transactions', showViewType = false }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingTx, setEditingTx] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [activeTag, setActiveTag] = useState(null);
  const { deleteTransaction } = useApp();

  const allCategories = [...new Set(transactions.map(t => t.category).filter(Boolean))];
  const allTags = [...new Set(transactions.flatMap(t => t.tags || []))];

  const filtered = transactions
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.notes || '').toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q));
      const matchType = filterType === 'all' || t.transactionType === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      const matchTag = !activeTag || (t.tags || []).includes(activeTag);
      return matchSearch && matchType && matchCat && matchTag;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = (a.date || '').localeCompare(b.date || '');
      if (sortBy === 'amount') cmp = Number(a.amount) - Number(b.amount);
      if (sortBy === 'description') cmp = (a.description || '').localeCompare(b.description || '');
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id);
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTx(null);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        <button
          onClick={() => { setEditingTx(null); setShowForm(true); }}
          className="btn-primary text-sm py-1.5 flex items-center gap-1"
        >
          <span>+</span> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          className="input max-w-xs text-sm py-1.5"
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input w-auto text-sm py-1.5"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="input w-auto text-sm py-1.5"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setActiveTag(null)}
            className={`badge text-xs cursor-pointer ${!activeTag ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
          >
            All
          </button>
          {allTags.slice(0, 15).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`badge text-xs cursor-pointer ${activeTag === tag ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Sort header */}
      <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
        <button className="col-span-1 text-left" onClick={() => handleSort('date')}>Date {sortBy === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button>
        <button className="col-span-4 text-left" onClick={() => handleSort('description')}>Description {sortBy === 'description' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button>
        <span className="col-span-2">Category</span>
        {showViewType && <span className="col-span-1">Type</span>}
        <button className={`${showViewType ? 'col-span-2' : 'col-span-3'} text-right`} onClick={() => handleSort('amount')}>Amount {sortBy === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button>
        <span className="col-span-2 text-right">Actions</span>
      </div>

      {/* List */}
      <div className="space-y-1">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>No transactions found</p>
          </div>
        ) : (
          filtered.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showViewType={showViewType}
            />
          ))
        )}
      </div>

      <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-right">
        Showing {filtered.length} of {transactions.length} transactions
      </div>

      {/* Form modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTx}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
