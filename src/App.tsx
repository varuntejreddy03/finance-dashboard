import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
          <Sidebar />
          <main className="flex-1 lg:ml-0 mt-16 lg:mt-0 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/insights" element={<InsightsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
