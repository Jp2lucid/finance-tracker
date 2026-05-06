// Simple ID generator
const id = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const today = new Date();
const fmt = (daysAgo) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const seedAccounts = [
  { id: id(), name: 'Checking Account', type: 'bank', balance: 8450.00, color: '#3b82f6', icon: '🏦' },
  { id: id(), name: 'Savings Account', type: 'bank', balance: 22100.00, color: '#22c55e', icon: '💰' },
  { id: id(), name: 'Credit Card', type: 'credit', balance: -1340.50, color: '#f59e0b', icon: '💳' },
  { id: id(), name: 'Cash Wallet', type: 'cash', balance: 320.00, color: '#8b5cf6', icon: '💵' },
  { id: id(), name: 'PayPal', type: 'digital', balance: 540.25, color: '#06b6d4', icon: '🅿️' },
  { id: id(), name: 'Business Account', type: 'bank', balance: 15800.00, color: '#2563eb', icon: '🏢' },
];

export const seedCategories = {
  personal: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Rent', 'Personal Care', 'Education', 'Salary', 'Freelance', 'Investment Returns', 'Other'],
  business: ['Office Supplies', 'Marketing', 'Software & Tools', 'Travel', 'Equipment', 'Consulting', 'Client Revenue', 'Product Sales', 'Payroll', 'Taxes', 'Insurance', 'Utilities', 'Other'],
};

export const seedTransactions = [
  // Personal income
  {
    id: id(), description: 'Monthly Salary', category: 'Salary', amount: 5500.00, date: fmt(0),
    type: 'personal', transactionType: 'income', account: 'Checking Account', notes: 'Net salary after deductions',
    tags: ['salary', 'monthly'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 0, salePrice: 5500.00, taxDeductible: false,
  },
  {
    id: id(), description: 'Freelance Web Project', category: 'Freelance', amount: 1200.00, date: fmt(3),
    type: 'personal', transactionType: 'income', account: 'PayPal', notes: 'Logo & website redesign for local client',
    tags: ['freelance', 'design'], isRecurring: false,
    costPrice: 0, salePrice: 1200.00, taxDeductible: false,
  },
  {
    id: id(), description: 'Grocery Shopping', category: 'Food & Dining', amount: 142.50, date: fmt(2),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Weekly groceries from Whole Foods',
    tags: ['food', 'weekly'], isRecurring: true, recurringInterval: 'weekly',
    costPrice: 142.50, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, date: fmt(5),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Monthly streaming plan',
    tags: ['subscription', 'entertainment'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 15.99, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Electricity Bill', category: 'Utilities', amount: 98.00, date: fmt(7),
    type: 'personal', transactionType: 'expense', account: 'Checking Account', notes: 'Monthly electric bill',
    tags: ['utilities', 'monthly'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 98.00, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Rent Payment', category: 'Rent', amount: 1600.00, date: fmt(1),
    type: 'personal', transactionType: 'expense', account: 'Checking Account', notes: 'Monthly apartment rent',
    tags: ['rent', 'housing'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 1600.00, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Gym Membership', category: 'Health', amount: 49.99, date: fmt(10),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Monthly gym membership',
    tags: ['health', 'subscription'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 49.99, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Uber Rides', category: 'Transportation', amount: 67.40, date: fmt(6),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Multiple rides this week',
    tags: ['transport', 'commute'], isRecurring: false,
    costPrice: 67.40, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Investment Dividend', category: 'Investment Returns', amount: 320.00, date: fmt(15),
    type: 'personal', transactionType: 'income', account: 'Savings Account', notes: 'Q4 dividend payout',
    tags: ['investment', 'passive'], isRecurring: false,
    costPrice: 0, salePrice: 320.00, taxDeductible: false,
  },
  {
    id: id(), description: 'Restaurant Dinner', category: 'Food & Dining', amount: 78.50, date: fmt(4),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Birthday dinner with family',
    tags: ['food', 'dining-out'], isRecurring: false,
    costPrice: 78.50, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Online Shopping', category: 'Shopping', amount: 215.99, date: fmt(8),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Clothes and home items',
    tags: ['shopping', 'amazon'], isRecurring: false,
    costPrice: 215.99, salePrice: 0, taxDeductible: false,
  },
  {
    id: id(), description: 'Online Course - React Advanced', category: 'Education', amount: 89.00, date: fmt(12),
    type: 'personal', transactionType: 'expense', account: 'Credit Card', notes: 'Udemy course for skill development',
    tags: ['education', 'learning'], isRecurring: false,
    costPrice: 89.00, salePrice: 0, taxDeductible: false,
  },

  // Business transactions
  {
    id: id(), description: 'Client Project - E-commerce Site', category: 'Client Revenue', amount: 4500.00, date: fmt(2),
    type: 'business', transactionType: 'income', account: 'Business Account', notes: 'Full stack e-commerce development',
    tags: ['client', 'development', 'project'], isRecurring: false,
    costPrice: 800.00, salePrice: 4500.00, taxDeductible: false,
  },
  {
    id: id(), description: 'Monthly Retainer - Tech Corp', category: 'Consulting', amount: 2000.00, date: fmt(1),
    type: 'business', transactionType: 'income', account: 'Business Account', notes: 'Ongoing technical consulting',
    tags: ['consulting', 'retainer', 'monthly'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 0, salePrice: 2000.00, taxDeductible: false,
  },
  {
    id: id(), description: 'Adobe Creative Suite', category: 'Software & Tools', amount: 54.99, date: fmt(5),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Monthly design software subscription',
    tags: ['software', 'subscription'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 54.99, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'Google Workspace', category: 'Software & Tools', amount: 12.00, date: fmt(5),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Business email and productivity suite',
    tags: ['software', 'subscription'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 12.00, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'Office Supplies', category: 'Office Supplies', amount: 134.75, date: fmt(9),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Printer ink, notebooks, pens',
    tags: ['office', 'supplies'], isRecurring: false,
    costPrice: 134.75, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'Facebook Ads Campaign', category: 'Marketing', amount: 350.00, date: fmt(11),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Q1 social media ad spend',
    tags: ['marketing', 'ads'], isRecurring: false,
    costPrice: 350.00, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'Laptop Purchase - MacBook Pro', category: 'Equipment', amount: 2499.00, date: fmt(20),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'New development laptop',
    tags: ['equipment', 'hardware'], isRecurring: false,
    costPrice: 2499.00, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'Product Sales - Digital Templates', category: 'Product Sales', amount: 875.00, date: fmt(14),
    type: 'business', transactionType: 'income', account: 'PayPal', notes: '35 template sales @ $25 each',
    tags: ['product', 'digital', 'passive'], isRecurring: false,
    costPrice: 50.00, salePrice: 875.00, taxDeductible: false,
  },
  {
    id: id(), description: 'Business Travel - Conference', category: 'Travel', amount: 680.00, date: fmt(18),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Flight + hotel for tech conference',
    tags: ['travel', 'conference'], isRecurring: false,
    costPrice: 680.00, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'AWS Hosting Services', category: 'Software & Tools', amount: 87.50, date: fmt(3),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Monthly cloud infrastructure',
    tags: ['hosting', 'infrastructure', 'aws'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 87.50, salePrice: 0, taxDeductible: true,
  },
  {
    id: id(), description: 'Quarterly Tax Payment', category: 'Taxes', amount: 1200.00, date: fmt(25),
    type: 'business', transactionType: 'expense', account: 'Business Account', notes: 'Q4 estimated tax payment',
    tags: ['taxes', 'quarterly'], isRecurring: true, recurringInterval: 'monthly',
    costPrice: 1200.00, salePrice: 0, taxDeductible: false,
  },
];

const nextInvoiceId = id();
const nextInvoiceId2 = id();
const nextInvoiceId3 = id();
const nextInvoiceId4 = id();

export const seedInvoices = [
  {
    id: nextInvoiceId,
    invoiceNumber: 'INV-2024-001',
    client: 'Acme Corporation',
    amount: 4500.00,
    issueDate: fmt(15),
    dueDate: fmt(-15),
    status: 'paid',
    description: 'E-commerce website development',
    notes: 'Payment received via wire transfer',
    linkedTransactionId: null,
  },
  {
    id: nextInvoiceId2,
    invoiceNumber: 'INV-2024-002',
    client: 'TechStartup Inc.',
    amount: 2000.00,
    issueDate: fmt(5),
    dueDate: fmt(25),
    status: 'sent',
    description: 'Monthly consulting retainer - January',
    notes: 'Net 30 payment terms',
    linkedTransactionId: null,
  },
  {
    id: nextInvoiceId3,
    invoiceNumber: 'INV-2024-003',
    client: 'RetailBrand Co.',
    amount: 1800.00,
    issueDate: fmt(40),
    dueDate: fmt(10),
    status: 'overdue',
    description: 'Brand identity design package',
    notes: 'Client has been unresponsive - follow up needed',
    linkedTransactionId: null,
  },
  {
    id: nextInvoiceId4,
    invoiceNumber: 'INV-2024-004',
    client: 'Local Restaurant',
    amount: 750.00,
    issueDate: fmt(2),
    dueDate: fmt(-28),
    status: 'draft',
    description: 'Social media management - setup fee',
    notes: 'Waiting for contract signing',
    linkedTransactionId: null,
  },
];

export const seedBudgets = [
  { id: id(), category: 'Food & Dining', limit: 400.00, period: 'monthly', type: 'personal', color: '#f59e0b' },
  { id: id(), category: 'Transportation', limit: 200.00, period: 'monthly', type: 'personal', color: '#06b6d4' },
  { id: id(), category: 'Entertainment', limit: 150.00, period: 'monthly', type: 'personal', color: '#8b5cf6' },
  { id: id(), category: 'Shopping', limit: 300.00, period: 'monthly', type: 'personal', color: '#ec4899' },
  { id: id(), category: 'Health', limit: 200.00, period: 'monthly', type: 'personal', color: '#22c55e' },
  { id: id(), category: 'Utilities', limit: 250.00, period: 'monthly', type: 'personal', color: '#64748b' },
  { id: id(), category: 'Marketing', limit: 500.00, period: 'monthly', type: 'business', color: '#3b82f6' },
  { id: id(), category: 'Software & Tools', limit: 300.00, period: 'monthly', type: 'business', color: '#2563eb' },
  { id: id(), category: 'Travel', limit: 1000.00, period: 'monthly', type: 'business', color: '#0ea5e9' },
  { id: id(), category: 'Office Supplies', limit: 200.00, period: 'monthly', type: 'business', color: '#6366f1' },
];
