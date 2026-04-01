import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import type { Transaction, TransactionType, Category } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export default function TransactionModal({ open, onClose, editTransaction }: Props) {
  const { addTransaction, updateTransaction } = useApp();
  const isEdit = !!editTransaction;

  const [form, setForm] = useState({
    description: editTransaction?.description || '',
    amount: editTransaction?.amount?.toString() || '',
    type: (editTransaction?.type || 'expense') as TransactionType,
    category: (editTransaction?.category || 'Food') as Category,
    date: editTransaction?.date || new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;

    if (isEdit && editTransaction) {
      updateTransaction(editTransaction.id, {
        ...form,
        amount: parseFloat(form.amount),
      });
    } else {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        description: form.description,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
      };
      addTransaction(newTx);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-white dark:bg-surface-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-surface-200 dark:border-surface-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            <X size={18} className="text-surface-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Grocery Store"
              required
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Amount ($)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              Type
            </label>
            <div className="flex gap-3">
              {(['expense', 'income'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-success-500 text-white shadow-lg shadow-success-500/25'
                        : 'bg-danger-500 text-white shadow-lg shadow-danger-500/25'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all"
            >
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
