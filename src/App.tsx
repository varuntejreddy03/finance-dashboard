import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-surface-500">Loading...</p>
      </div>
    </div>
  );
}

function AppLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      <Sidebar />
      <main
        className={`flex-1 mt-16 lg:mt-0 overflow-x-hidden transition-[margin-left] duration-300 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-72'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
