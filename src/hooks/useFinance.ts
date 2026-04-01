import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Transaction } from '../types';

export function useFilteredTransactions(): Transaction[] {
  const { transactions, filters } = useApp();

  return useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Date range
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters]);
}

export function useFinanceSummary() {
  const { transactions } = useApp();

  return useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome - totalExpenses;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    // Monthly data
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expenses: 0 };
      if (t.type === 'income') monthlyData[month].income += t.amount;
      else monthlyData[month].expenses += t.amount;
    });

    // Running balance for trend
    const sortedByDate = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    let runningBalance = 0;
    const balanceTrend = sortedByDate.map((t) => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
      return { date: t.date, balance: runningBalance, name: t.description };
    });

    // Highest spending category
    const highestCategory = Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a)[0];

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      categoryBreakdown,
      monthlyData,
      balanceTrend,
      highestCategory: highestCategory
        ? { category: highestCategory[0], amount: highestCategory[1] }
        : null,
    };
  }, [transactions]);
}
