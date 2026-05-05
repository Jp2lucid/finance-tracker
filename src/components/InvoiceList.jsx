import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useApp } from '../context/AppContext';

const statusColors = {
  paid:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  sent:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  overdue: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  draft:   'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

export default function InvoiceList({ invoices }) {
  const { updateInvoice, deleteInvoice } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  const totals = {
    outstanding: invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + Number(i.amount), 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + Number(i.amount), 0),
  };

  return (
    <div className="space-y-4">
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Paid', value: totals.paid, color: 'text-green-600 dark:text-green-400' },
          { label: 'Outstanding', value: totals.outstanding, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Overdue', value: totals.overdue, color: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <div key={s.label} className="card text-center py-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'sent', 'paid', 'overdue', 'draft'].map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">
              ({s === 'all' ? invoices.length : invoices.filter(i => i.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Invoice cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card py-12 text-center text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-2">🧾</div>
            <p>No invoices found</p>
          </div>
        ) : (
          filtered.map(inv => (
            <div key={inv.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{inv.invoiceNumber}</span>
                    <span className={`badge ${statusColors[inv.status] || statusColors.draft}`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{inv.client}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{inv.description}</p>
                  {inv.notes && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">{inv.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(inv.amount)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Issued: {formatDate(inv.issueDate)}
                  </p>
                  <p className={`text-xs mt-0.5 ${inv.status === 'overdue' ? 'text-red-500 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                    Due: {formatDate(inv.dueDate)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <select
                  value={inv.status}
                  onChange={e => updateInvoice(inv.id, { status: e.target.value })}
                  className="input text-xs py-1.5 w-auto"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button
                  onClick={() => { if (window.confirm('Delete invoice?')) deleteInvoice(inv.id); }}
                  className="ml-auto text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
