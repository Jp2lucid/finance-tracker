import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useInvoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useContext(AppContext);
  return { invoices, addInvoice, updateInvoice, deleteInvoice };
}
