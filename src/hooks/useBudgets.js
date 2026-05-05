import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useBudgets() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useContext(AppContext);
  return { budgets, addBudget, updateBudget, deleteBudget };
}
