import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useFinanceSummary } from '../hooks/useFinance';
import { categoryColors, categoryIcons } from '../data/mockData';

export default function SpendingBreakdownChart() {
  const { categoryBreakdown, totalExpenses } = useFinanceSummary();

  const chartData = Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-center h-full">
        <p className="text-surface-400">No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">Spending Breakdown</h3>
        <p className="text-sm text-surface-500 mt-0.5">Expenses by category</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-52 h-52 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={categoryColors[entry.name] || '#94A3B8'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1E293B',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
                itemStyle={{ color: '#fff', fontSize: 13 }}
                formatter={(value: any) => `$${Number(value).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          {chartData.map((item) => {
            const pct = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : '0';
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="text-lg">{categoryIcons[item.name] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-surface-500">{pct}%</p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${categoryColors[item.name]}20`,
                    color: categoryColors[item.name],
                  }}
                >
                  ${item.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
