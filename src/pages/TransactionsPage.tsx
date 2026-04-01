import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  SlidersHorizontal,
  X,
  Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useFilteredTransactions } from '../hooks/useFinance';
import { categories, categoryColors, categoryIcons } from '../data/mockData';
import TransactionModal from '../components/TransactionModal';
import type { Transaction } from '../types';

export default function TransactionsPage() {
  const { role, filters, setFilters, resetFilters, deleteTransaction } = useApp();
  const filtered = useFilteredTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);
  const isSearching = localSearch !== debouncedSearch;

  // Sync debounced search to global filters
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = role === 'admin';

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortBy: field, sortOrder: 'desc' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filtered.map((t) => [t.date, t.description, t.category, t.type, t.amount.toString()]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeFilterCount = [
    filters.type !== 'all',
    filters.category !== 'all',
    !!filters.dateFrom,
    !!filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setEditTx(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all"
            >
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 border border-surface-200 dark:border-surface-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            {isSearching && (
              <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 animate-spin" />
            )}
            <input
              type="text"
              placeholder="Search transactions... (debounced 300ms)"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
              showFilters || activeFilterCount > 0
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[11px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-surface-100 dark:border-surface-700 animate-slide-up">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value as typeof filters.type })}
              className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-sm text-surface-700 dark:text-surface-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value as typeof filters.category })}
              className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-sm text-surface-700 dark:text-surface-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ dateFrom: e.target.value })}
              className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-sm text-surface-700 dark:text-surface-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="From"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ dateTo: e.target.value })}
              className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-sm text-surface-700 dark:text-surface-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="To"
            />

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-danger-600 dark:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-750">
          <button
            onClick={() => handleSort('date')}
            className="col-span-2 flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
          >
            Date
            <ArrowUpDown
              size={13}
              className={filters.sortBy === 'date' ? 'text-primary-500' : ''}
            />
          </button>
          <div className="col-span-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Description
          </div>
          <button
            onClick={() => handleSort('category')}
            className="col-span-2 flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
          >
            Category
            <ArrowUpDown
              size={13}
              className={filters.sortBy === 'category' ? 'text-primary-500' : ''}
            />
          </button>
          <div className="col-span-2 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Type
          </div>
          <button
            onClick={() => handleSort('amount')}
            className="col-span-2 flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider hover:text-surface-700 dark:hover:text-surface-300 transition-colors justify-end"
          >
            Amount
            <ArrowUpDown
              size={13}
              className={filters.sortBy === 'amount' ? 'text-primary-500' : ''}
            />
          </button>
          {isAdmin && (
            <div className="col-span-1 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">
              Actions
            </div>
          )}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-surface-500 text-sm font-medium">No transactions found</p>
            <p className="text-surface-400 text-xs mt-1">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors items-center group"
              >
                {/* Date */}
                <div className="md:col-span-2">
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Description */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: `${categoryColors[tx.category]}15` }}
                  >
                    {categoryIcons[tx.category] || '📌'}
                  </div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
                    {tx.description}
                  </p>
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: `${categoryColors[tx.category]}15`,
                      color: categoryColors[tx.category],
                    }}
                  >
                    {tx.category}
                  </span>
                </div>

                {/* Type */}
                <div className="md:col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      tx.type === 'income'
                        ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                        : 'bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {tx.type}
                  </span>
                </div>

                {/* Amount */}
                <div className="md:col-span-2 text-right">
                  <p
                    className={`text-sm font-bold ${
                      tx.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}$
                    {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Actions (Admin only) */}
                {isAdmin && (
                  <div className="md:col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditTx(tx);
                        setModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-surface-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this transaction?')) deleteTransaction(tx.id);
                      }}
                      className="p-2 rounded-lg text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10 dark:hover:text-danger-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTx(null);
        }}
        editTransaction={editTx}
      />
    </div>
  );
}
