import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinanceSummary } from '../hooks/useFinance';

export default function BalanceTrendChart() {
  const { balanceTrend } = useFinanceSummary();

  // Aggregate by day — keep last entry per date
  const byDate = new Map<string, number>();
  balanceTrend.forEach((d) => byDate.set(d.date, d.balance));
  const chartData = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, balance]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rawDate: date,
      balance,
    }));

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Balance Trend</h3>
          <p className="text-sm text-surface-500 mt-0.5">Running balance over time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span className="text-xs text-surface-500">Balance</span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#1E293B',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: '#94A3B8', fontSize: 12, marginBottom: 4 }}
              itemStyle={{ color: '#fff', fontSize: 14, fontWeight: 600 }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{ r: 6, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
