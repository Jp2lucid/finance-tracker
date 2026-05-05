import { format, parseISO } from 'date-fns';

export function exportTransactionsToCSV(transactions, filename = 'transactions.csv') {
  const headers = [
    'Date', 'Description', 'Category', 'Type', 'Transaction Type',
    'Amount', 'Cost Price', 'Sale Price', 'Account', 'Tags',
    'Tax Deductible', 'Recurring', 'Notes'
  ];
  const rows = transactions.map(t => [
    t.date,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.category || '',
    t.type || '',
    t.transactionType || '',
    t.amount,
    t.costPrice || 0,
    t.salePrice || 0,
    t.account || '',
    `"${(t.tags || []).join(', ')}"`,
    t.taxDeductible ? 'Yes' : 'No',
    t.isRecurring ? t.recurringInterval || 'Yes' : 'No',
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csv, filename, 'text/csv');
}

export function exportSummaryReport(transactions, period, filename = 'report.csv') {
  const income = transactions.filter(t => t.transactionType === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.transactionType === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const net = income - expenses;

  const summary = [
    ['Finance Tracker - Summary Report'],
    [`Period: ${period}`],
    [`Generated: ${format(new Date(), 'PPP')}`],
    [''],
    ['SUMMARY'],
    ['Total Income', income.toFixed(2)],
    ['Total Expenses', expenses.toFixed(2)],
    ['Net Profit/Loss', net.toFixed(2)],
    [''],
    ['TRANSACTIONS'],
    ['Date', 'Description', 'Category', 'Type', 'Amount'],
    ...transactions.map(t => [
      t.date,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.category || '',
      t.transactionType || '',
      (t.transactionType === 'expense' ? '-' : '') + Number(t.amount).toFixed(2),
    ])
  ];

  const csv = summary.map(r => Array.isArray(r) ? r.join(',') : r).join('\n');
  downloadFile(csv, filename, 'text/csv');
}

export function printReport(contentId) {
  window.print();
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
