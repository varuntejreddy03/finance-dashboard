import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { FilterState, Role, ThemeMode, Transaction } from '../types';
import { mockTransactions } from '../data/mockData';

interface AppState {
  theme: ThemeMode;
  role: Role;
  transactions: Transaction[];
  filters: FilterState;
  sidebarCollapsed: boolean;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  setRole: (r: Role) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setTransactions: (t: Transaction[]) => void;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (f: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

const AppContext = createContext<AppState | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => loadFromStorage('fd-theme', 'light'));
  const [role, setRole] = useState<Role>(() => loadFromStorage('fd-role', 'admin'));
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage('fd-transactions', mockTransactions)
  );
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('fd-theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fd-role', JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    localStorage.setItem('fd-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  const addTransaction = (t: Transaction) => setTransactions((prev) => [t, ...prev]);
  const updateTransaction = (id: string, updates: Partial<Transaction>) =>
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  const deleteTransaction = (id: string) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const setFilters = (partial: Partial<FilterState>) =>
    setFiltersState((prev) => ({ ...prev, ...partial }));
  const resetFilters = () => setFiltersState(defaultFilters);

  return (
    <AppContext.Provider
      value={{
        theme,
        role,
        transactions,
        filters,
        sidebarCollapsed,
        setTheme,
        toggleTheme,
        setRole,
        setSidebarCollapsed,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
