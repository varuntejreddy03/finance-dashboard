import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinanceSummary } from '../hooks/useFinance';

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useFinanceSummary();

  const cards = [
    {
      label: 'Total Balance',
      value: totalBalance,
      icon: Wallet,
      change: '+12.5%',
      changeType: 'positive' as const,
      gradient: 'from-primary-500 to-primary-700',
      iconBg: 'bg-primary-400/20',
      iconColor: 'text-primary-300',
    },
    {
      label: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      change: '+8.2%',
      changeType: 'positive' as const,
      gradient: 'from-success-500 to-success-700',
      iconBg: 'bg-success-500/20',
      iconColor: 'text-success-500',
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      change: '+3.1%',
      changeType: 'negative' as const,
      gradient: 'from-danger-500 to-danger-700',
      iconBg: 'bg-danger-500/20',
      iconColor: 'text-danger-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="animate-slide-up bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-lg transition-all duration-300 group"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon size={22} className={card.iconColor} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  card.changeType === 'positive'
                    ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                    : 'bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500'
                }`}
              >
                {card.changeType === 'positive' ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}
                {card.change}
              </div>
            </div>
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
              ${card.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {/* Decorative gradient */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </div>
        );
      })}
    </div>
  );
}
