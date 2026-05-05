import { isInPeriod } from './formatters';

export function getFilteredTransactions(transactions, view, period) {
  return transactions.filter(t => {
    const matchesView = view === 'combined' || t.type === view;
    const matchesPeriod = period === 'all' || isInPeriod(t.date, period);
    return matchesView && matchesPeriod;
  });
}

export function sumByType(transactions, type) {
  return transactions
    .filter(t => t.transactionType === type)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

export function calcNetProfit(transactions) {
  const income = sumByType(transactions, 'income');
  const expenses = sumByType(transactions, 'expense');
  return income - expenses;
}

export function calcProfitMargin(transactions) {
  const income = sumByType(transactions, 'income');
  if (income === 0) return 0;
  return (calcNetProfit(transactions) / income) * 100;
}

export function groupByCategory(transactions) {
  return transactions.reduce((acc, t) => {
    const cat = t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {});
}

export function groupByMonth(transactions) {
  const months = {};
  transactions.forEach(t => {
    const month = t.date ? t.date.slice(0, 7) : 'unknown';
    if (!months[month]) months[month] = { income: 0, expense: 0, profit: 0 };
    if (t.transactionType === 'income') months[month].income += Number(t.amount);
    else months[month].expense += Number(t.amount);
    months[month].profit = months[month].income - months[month].expense;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));
}

export function calcBudgetUsage(transactions, budgets, period = 'monthly') {
  return budgets.map(budget => {
    const relevant = transactions.filter(t =>
      t.category === budget.category &&
      t.transactionType === 'expense' &&
      (budget.type === 'all' || t.type === budget.type) &&
      isInPeriod(t.date, period)
    );
    const spent = relevant.reduce((sum, t) => sum + Number(t.amount), 0);
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    return { ...budget, spent, percentage };
  });
}

export function estimateTax(transactions, type = 'business') {
  const rate = type === 'business' ? 0.25 : 0.22;
  const deductibleExpenses = transactions
    .filter(t => t.transactionType === 'expense' && t.taxDeductible)
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const income = sumByType(transactions.filter(t => t.type === type), 'income');
  const taxableIncome = Math.max(0, income - deductibleExpenses);
  return { taxableIncome, estimatedTax: taxableIncome * rate, rate: rate * 100, deductibleExpenses };
}

export function getTransactionProfit(transaction) {
  if (!transaction) return 0;
  const cost = Number(transaction.costPrice) || 0;
  const sale = Number(transaction.salePrice) || 0;
  if (transaction.transactionType === 'income') return sale - cost;
  return -cost;
}

export function getTransactionMargin(transaction) {
  const sale = Number(transaction?.salePrice) || 0;
  if (sale === 0) return 0;
  const profit = getTransactionProfit(transaction);
  return (profit / sale) * 100;
}
