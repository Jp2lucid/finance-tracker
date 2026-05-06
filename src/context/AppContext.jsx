import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { seedTransactions, seedInvoices, seedBudgets, seedAccounts, seedCategories } from '../data/seedData';

export const AppContext = createContext(null);

const genId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage('ft_darkMode', false);
  const [currentView, setCurrentView] = useLocalStorage('ft_view', 'combined');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [period, setPeriod] = useLocalStorage('ft_period', 'monthly');

  const [transactions, setTransactions] = useLocalStorage('ft_transactions', null);
  const [invoices, setInvoices] = useLocalStorage('ft_invoices', null);
  const [budgets, setBudgets] = useLocalStorage('ft_budgets', null);
  const [accounts, setAccounts] = useLocalStorage('ft_accounts', null);
  const [categories, setCategories] = useLocalStorage('ft_categories', null);

  // Seed data on first load
  useEffect(() => {
    if (!transactions) setTransactions(seedTransactions);
    if (!invoices) setInvoices(seedInvoices);
    if (!budgets) setBudgets(seedBudgets);
    if (!accounts) setAccounts(seedAccounts);
    if (!categories) setCategories(seedCategories);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Dark mode class on html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ---- Transactions CRUD ----
  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: genId(), createdAt: new Date().toISOString() };
    setTransactions(prev => [newTx, ...(prev || [])]);
    return newTx;
  }, [setTransactions]);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => (prev || []).map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTransactions]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => (prev || []).filter(t => t.id !== id));
  }, [setTransactions]);

  // ---- Invoices CRUD ----
  const addInvoice = useCallback((inv) => {
    const newInv = { ...inv, id: genId(), createdAt: new Date().toISOString() };
    setInvoices(prev => [newInv, ...(prev || [])]);
    return newInv;
  }, [setInvoices]);

  const updateInvoice = useCallback((id, updates) => {
    setInvoices(prev => (prev || []).map(i => i.id === id ? { ...i, ...updates } : i));
  }, [setInvoices]);

  const deleteInvoice = useCallback((id) => {
    setInvoices(prev => (prev || []).filter(i => i.id !== id));
  }, [setInvoices]);

  // ---- Budgets CRUD ----
  const addBudget = useCallback((budget) => {
    const newBudget = { ...budget, id: genId() };
    setBudgets(prev => [...(prev || []), newBudget]);
    return newBudget;
  }, [setBudgets]);

  const updateBudget = useCallback((id, updates) => {
    setBudgets(prev => (prev || []).map(b => b.id === id ? { ...b, ...updates } : b));
  }, [setBudgets]);

  const deleteBudget = useCallback((id) => {
    setBudgets(prev => (prev || []).filter(b => b.id !== id));
  }, [setBudgets]);

  // ---- Accounts CRUD ----
  const addAccount = useCallback((acct) => {
    const newAcct = { ...acct, id: genId() };
    setAccounts(prev => [...(prev || []), newAcct]);
    return newAcct;
  }, [setAccounts]);

  const updateAccount = useCallback((id, updates) => {
    setAccounts(prev => (prev || []).map(a => a.id === id ? { ...a, ...updates } : a));
  }, [setAccounts]);

  const deleteAccount = useCallback((id) => {
    setAccounts(prev => (prev || []).filter(a => a.id !== id));
  }, [setAccounts]);

  // ---- Categories ----
  const addCategory = useCallback((type, category) => {
    setCategories(prev => {
      const existing = prev || seedCategories;
      const list = existing[type] || [];
      if (list.includes(category)) return existing;
      return { ...existing, [type]: [...list, category] };
    });
  }, [setCategories]);

  const value = {
    // State
    darkMode, setDarkMode,
    currentView, setCurrentView,
    currentPage, setCurrentPage,
    period, setPeriod,

    // Data
    transactions: transactions || [],
    invoices: invoices || [],
    budgets: budgets || [],
    accounts: accounts || [],
    categories: categories || seedCategories,

    // Transactions
    addTransaction, updateTransaction, deleteTransaction,

    // Invoices
    addInvoice, updateInvoice, deleteInvoice,

    // Budgets
    addBudget, updateBudget, deleteBudget,

    // Accounts
    addAccount, updateAccount, deleteAccount,

    // Categories
    addCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
