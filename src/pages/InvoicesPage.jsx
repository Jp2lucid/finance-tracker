import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import InvoiceList from '../components/InvoiceList';

const defaultForm = {
  invoiceNumber: '',
  client: '',
  amount: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  status: 'draft',
  description: '',
  notes: '',
};

export default function InvoicesPage() {
  const { invoices, addInvoice } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addInvoice({ ...form, amount: parseFloat(form.amount) || 0 });
    setForm(defaultForm);
    setShowForm(false);
  };

  // Auto-generate invoice number
  const nextNum = () => {
    const nums = invoices.map(i => parseInt((i.invoiceNumber || '').replace(/\D/g, '')) || 0);
    const max = nums.length ? Math.max(...nums) : 0;
    const year = new Date().getFullYear();
    return `INV-${year}-${String(max + 1).padStart(3, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧾</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invoices</h2>
        </div>
        <button
          onClick={() => {
            setForm(f => ({ ...defaultForm, invoiceNumber: nextNum() }));
            setShowForm(true);
          }}
          className="btn-primary text-sm"
        >
          + New Invoice
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Invoice</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Invoice Number</label>
                <input className="input" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Client Name</label>
                <input className="input" name="client" value={form.client} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Amount</label>
                <input className="input" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" name="status" value={form.status} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Issue Date</label>
                <input className="input" name="issueDate" type="date" value={form.issueDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Due Date</label>
                <input className="input" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea className="input resize-none" name="notes" rows={2} value={form.notes} onChange={handleChange} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Create Invoice</button>
            </div>
          </form>
        </div>
      )}

      <InvoiceList invoices={invoices} />
    </div>
  );
}
