import type { Transaction } from '../types';

export const mockTransactions: Transaction[] = [
  { id: '1',  date: '2026-04-01', description: 'Monthly Salary',        amount: 5200, type: 'income',  category: 'Salary' },
  { id: '2',  date: '2026-03-31', description: 'Grocery Store',          amount: 87.50, type: 'expense', category: 'Food' },
  { id: '3',  date: '2026-03-30', description: 'Uber Ride to Airport',   amount: 42.00, type: 'expense', category: 'Transport' },
  { id: '4',  date: '2026-03-29', description: 'Freelance Web Design',   amount: 1200, type: 'income',  category: 'Freelance' },
  { id: '5',  date: '2026-03-28', description: 'Amazon Order',           amount: 156.99, type: 'expense', category: 'Shopping' },
  { id: '6',  date: '2026-03-27', description: 'Movie Tickets',          amount: 32.00, type: 'expense', category: 'Entertainment' },
  { id: '7',  date: '2026-03-26', description: 'Pharmacy',               amount: 28.50, type: 'expense', category: 'Health' },
  { id: '8',  date: '2026-03-25', description: 'Electric Bill',          amount: 120.00, type: 'expense', category: 'Bills' },
  { id: '9',  date: '2026-03-24', description: 'Restaurant Dinner',      amount: 65.00, type: 'expense', category: 'Food' },
  { id: '10', date: '2026-03-22', description: 'Gas Station',            amount: 55.00, type: 'expense', category: 'Transport' },
  { id: '11', date: '2026-03-20', description: 'Freelance Logo Design',  amount: 800, type: 'income',  category: 'Freelance' },
  { id: '12', date: '2026-03-18', description: 'Netflix Subscription',   amount: 15.99, type: 'expense', category: 'Entertainment' },
  { id: '13', date: '2026-03-15', description: 'Dentist Visit',          amount: 200.00, type: 'expense', category: 'Health' },
  { id: '14', date: '2026-03-12', description: 'Coffee & Snacks',        amount: 18.75, type: 'expense', category: 'Food' },
  { id: '15', date: '2026-03-10', description: 'Internet Bill',          amount: 79.99, type: 'expense', category: 'Bills' },
  { id: '16', date: '2026-03-08', description: 'Monthly Salary',         amount: 5200, type: 'income',  category: 'Salary' },
  { id: '17', date: '2026-03-06', description: 'Flight to NYC',          amount: 380.00, type: 'expense', category: 'Travel' },
  { id: '18', date: '2026-03-05', description: 'Hotel Stay NYC',         amount: 250.00, type: 'expense', category: 'Travel' },
  { id: '19', date: '2026-03-03', description: 'Gym Membership',         amount: 45.00, type: 'expense', category: 'Health' },
  { id: '20', date: '2026-03-01', description: 'Spotify Premium',        amount: 11.99, type: 'expense', category: 'Entertainment' },
  { id: '21', date: '2026-02-28', description: 'Grocery Delivery',       amount: 110.00, type: 'expense', category: 'Food' },
  { id: '22', date: '2026-02-25', description: 'Freelance Consulting',   amount: 1500, type: 'income',  category: 'Freelance' },
  { id: '23', date: '2026-02-22', description: 'New Headphones',         amount: 299.99, type: 'expense', category: 'Shopping' },
  { id: '24', date: '2026-02-20', description: 'Bus Pass Monthly',       amount: 75.00, type: 'expense', category: 'Transport' },
  { id: '25', date: '2026-02-18', description: 'Concert Tickets',        amount: 120.00, type: 'expense', category: 'Entertainment' },
  { id: '26', date: '2026-02-15', description: 'Monthly Salary',         amount: 5200, type: 'income',  category: 'Salary' },
  { id: '27', date: '2026-02-12', description: 'Water Bill',             amount: 42.00, type: 'expense', category: 'Bills' },
  { id: '28', date: '2026-02-10', description: 'Clothing Store',         amount: 189.99, type: 'expense', category: 'Shopping' },
  { id: '29', date: '2026-02-08', description: 'Sushi Restaurant',       amount: 72.50, type: 'expense', category: 'Food' },
  { id: '30', date: '2026-02-05', description: 'Freelance App Dev',      amount: 2000, type: 'income',  category: 'Freelance' },
];

export const categories = [
  'Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Salary', 'Freelance', 'Bills', 'Travel',
] as const;

export const categoryColors: Record<string, string> = {
  Food:          '#F59E0B',
  Transport:     '#3B82F6',
  Shopping:      '#EC4899',
  Health:        '#10B981',
  Entertainment: '#8B5CF6',
  Salary:        '#06B6D4',
  Freelance:     '#14B8A6',
  Bills:         '#EF4444',
  Travel:        '#F97316',
};

export const categoryIcons: Record<string, string> = {
  Food:          '🍔',
  Transport:     '🚗',
  Shopping:      '🛍️',
  Health:        '💊',
  Entertainment: '🎬',
  Salary:        '💰',
  Freelance:     '💻',
  Bills:         '📄',
  Travel:        '✈️',
};
