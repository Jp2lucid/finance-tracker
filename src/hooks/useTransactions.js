import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useContext(AppContext);
  return { transactions, addTransaction, updateTransaction, deleteTransaction };
}
