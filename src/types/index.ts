export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Salary'
  | 'Freelance'
  | 'Bills'
  | 'Travel';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export type Role = 'admin' | 'viewer';

export type ThemeMode = 'light' | 'dark';

export interface FilterState {
  search: string;
  type: TransactionType | 'all';
  category: Category | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}
