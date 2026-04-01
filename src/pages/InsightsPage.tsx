import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { useFinanceSummary } from '../hooks/useFinance';
import { categoryColors, categoryIcons } from '../data/mockData';

export default function InsightsPage() {
  const { categoryBreakdown, monthlyData, highestCategory, totalIncome, totalExpenses } =
    useFinanceSummary();

  // Category spending for horizontal bar chart
  const categoryData = Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Monthly comparison
  const months = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      ...data,
      net: data.income - data.expenses,
    }));

  // Smart tips
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0';
  const highestPct =
    highestCategory && totalExpenses > 0
      ? ((highestCategory.amount / totalExpenses) * 100).toFixed(1)
      : '0';

  // Month-over-month comparison for expenses
  const lastTwoMonthExpenses = months.slice(-2);
  const expenseChange =
    lastTwoMonthExpenses.length === 2 && lastTwoMonthExpenses[0].expenses > 0
      ? (
          ((lastTwoMonthExpenses[1].expenses - lastTwoMonthExpenses[0].expenses) /
            lastTwoMonthExpenses[0].expenses) *
          100
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Insights</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Understand your spending patterns and financial health
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
              <Target size={20} className="text-success-500" />
            </div>
            <span className="text-sm font-semibold text-surface-600 dark:text-surface-400">
              Savings Rate
            </span>
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-white">{savingsRate}%</p>
          <p className="text-xs text-surface-500 mt-1">of your income saved</p>
        </div>

        <div
          className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-500/15 flex items-center justify-center">
              <AlertTriangle size={20} className="text-warning-500" />
            </div>
            <span className="text-sm font-semibold text-surface-600 dark:text-surface-400">
              Top Category
            </span>
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-white">
            {highestCategory ? categoryIcons[highestCategory.category] : '—'}{' '}
            {highestCategory?.category || 'N/A'}
          </p>
          <p className="text-xs text-surface-500 mt-1">
            {highestPct}% of total expenses ($
            {highestCategory?.amount.toLocaleString() || '0'})
          </p>
        </div>

        <div
          className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up"
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                expenseChange && parseFloat(expenseChange) > 0
                  ? 'bg-danger-50 dark:bg-danger-500/15'
                  : 'bg-success-50 dark:bg-success-500/15'
              }`}
            >
              {expenseChange && parseFloat(expenseChange) > 0 ? (
                <TrendingUp size={20} className="text-danger-500" />
              ) : (
                <TrendingDown size={20} className="text-success-500" />
              )}
            </div>
            <span className="text-sm font-semibold text-surface-600 dark:text-surface-400">
              Monthly Change
            </span>
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-white">
            {expenseChange ? `${parseFloat(expenseChange) > 0 ? '+' : ''}${expenseChange}%` : 'N/A'}
          </p>
          <p className="text-xs text-surface-500 mt-1">expense change from last month</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">
            Spending by Category
          </h3>
          <p className="text-sm text-surface-500 mb-6">Horizontal breakdown of expense categories</p>

          {categoryData.length === 0 ? (
            <p className="text-surface-400 text-center py-8">No expense data</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 70, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${v}`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 13, fill: '#64748B', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1E293B',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    }}
                    itemStyle={{ color: '#fff', fontSize: 13 }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Spent']}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={categoryColors[entry.name] || '#94A3B8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Comparison Table */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">
            Monthly Comparison
          </h3>
          <p className="text-sm text-surface-500 mb-6">Income vs expenses by month</p>

          {months.length === 0 ? (
            <p className="text-surface-400 text-center py-8">No monthly data</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100 dark:border-surface-700">
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 pr-4">
                      Month
                    </th>
                    <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-4">
                      Income
                    </th>
                    <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-4">
                      Expenses
                    </th>
                    <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 pl-4">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50 dark:divide-surface-700">
                  {months.map((m) => (
                    <tr key={m.month} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                      <td className="py-4 pr-4">
                        <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                          {m.month}
                        </span>
                      </td>
                      <td className="text-right py-4 px-4">
                        <span className="text-sm font-semibold text-success-600">
                          +${m.income.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right py-4 px-4">
                        <span className="text-sm font-semibold text-danger-600">
                          -${m.expenses.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right py-4 pl-4">
                        <span
                          className={`text-sm font-bold ${
                            m.net >= 0 ? 'text-success-600' : 'text-danger-600'
                          }`}
                        >
                          {m.net >= 0 ? '+' : ''}${m.net.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Smart Tips */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">💡 Smart Tips</h3>
            <div className="space-y-3">
              {highestCategory && (
                <div className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-primary-200" />
                  <p className="text-sm text-primary-100">
                    Your highest spending category is <strong>{highestCategory.category}</strong> at $
                    {highestCategory.amount.toLocaleString()} ({highestPct}% of expenses). Consider
                    setting a monthly budget for this category.
                  </p>
                </div>
              )}
              {expenseChange && parseFloat(expenseChange) > 0 && (
                <div className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-primary-200" />
                  <p className="text-sm text-primary-100">
                    Your expenses increased by <strong>{expenseChange}%</strong> compared to last
                    month. Review your recent transactions to identify areas for savings.
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-primary-200" />
                <p className="text-sm text-primary-100">
                  Your current savings rate is <strong>{savingsRate}%</strong>.{' '}
                  {parseFloat(savingsRate) >= 20
                    ? "Great job! You're on track for strong financial health."
                    : 'Financial advisors recommend aiming for at least 20% savings rate.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
