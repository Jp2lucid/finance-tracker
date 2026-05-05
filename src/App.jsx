import React from 'react';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PersonalView from './pages/PersonalView';
import BusinessView from './pages/BusinessView';
import CombinedView from './pages/CombinedView';
import InvoicesPage from './pages/InvoicesPage';
import BudgetsPage from './pages/BudgetsPage';
import AccountsPage from './pages/AccountsPage';

const pages = {
  dashboard: Dashboard,
  personal: PersonalView,
  business: BusinessView,
  combined: CombinedView,
  invoices: InvoicesPage,
  budgets: BudgetsPage,
  accounts: AccountsPage,
};

export default function App() {
  const { currentPage } = useApp();
  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
}
