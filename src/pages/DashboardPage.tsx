import SummaryCards from '../components/SummaryCards';
import BalanceTrendChart from '../components/BalanceTrendChart';
import SpendingBreakdownChart from '../components/SpendingBreakdownChart';
import { useApp } from '../context/AppContext';
import { useFilteredTransactions } from '../hooks/useFinance';
import { categoryColors, categoryIcons } from '../data/mockData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardPage() {
  const { role } = useApp();
  const transactions = useFilteredTransactions();
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              role === 'admin'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
            }`}
          >
            {role === 'admin' ? '🛡️ Admin' : '👁️ Viewer'}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">
            Recent Transactions
          </h3>
          <a
            href="/transactions"
            className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors"
          >
            View All →
          </a>
        </div>

        {recentTx.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-surface-400 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${categoryColors[tx.category]}15` }}
                >
                  {categoryIcons[tx.category] || '📌'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {tx.category} ·{' '}
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm font-bold flex items-center gap-1 ${
                      tx.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    ${tx.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
