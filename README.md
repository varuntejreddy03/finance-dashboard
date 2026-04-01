# FinTrack — Finance Dashboard

A modern, interactive finance dashboard built with **React**, **TypeScript**, **Tailwind CSS v4**, and **Recharts**. Designed to help users track income, expenses, and understand spending patterns through clean visualizations and an intuitive interface.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

---

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with color-coded change badges
- **Balance Trend Chart** — Area chart showing running balance over time (Recharts)
- **Spending Breakdown** — Donut chart with category legend and percentage breakdown
- **Recent Transactions** — Quick-view of the 5 latest transactions

### 💳 Transactions
- Full list of 30 mock transactions across 9 categories
- **Search** — Filter by description, category, or amount
- **Advanced Filters** — By type (income/expense), category, and date range
- **Sorting** — Click column headers to sort by date, amount, or category
- **CSV Export** — Download filtered transactions as a `.csv` file
- **CRUD Operations** — Add, edit, and delete transactions (Admin role only)

### 🧠 Insights
- **Savings Rate** calculation
- **Top Spending Category** with percentage breakdown
- **Month-over-Month comparison** table
- **Horizontal Bar Chart** for category spending
- **Smart Tips** — AI-style personalized financial recommendations

### 🛡️ Role-Based UI (RBAC)
- **Admin** — Full access: add, edit, and delete transactions
- **Viewer** — Read-only: can view all data but cannot modify
- Switch roles via the sidebar dropdown for demonstration

### 🌙 Dark Mode
- Toggle between light and dark themes
- Theme preference persisted to `localStorage`
- Smooth transitions between modes

### 💾 Data Persistence
- Transactions, theme, and role saved to `localStorage`
- State survives page refreshes

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling with custom theme |
| **Recharts** | Data visualizations (Area, Pie, Bar charts) |
| **React Router v7** | Client-side routing |
| **Lucide React** | Modern icon library |
| **Vite** | Fast build tool and dev server |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx              # Navigation + role/theme controls
│   ├── SummaryCards.tsx          # Balance, Income, Expenses cards
│   ├── BalanceTrendChart.tsx     # Area chart (Recharts)
│   ├── SpendingBreakdownChart.tsx # Donut chart with legend
│   └── TransactionModal.tsx     # Add/Edit form modal
├── context/
│   └── AppContext.tsx            # Global state (Context API)
├── data/
│   └── mockData.ts              # 30 mock transactions + category metadata
├── hooks/
│   └── useFinance.ts            # Derived data hooks (filtering, summaries)
├── pages/
│   ├── DashboardPage.tsx        # Main overview page
│   ├── TransactionsPage.tsx     # Transaction list + filters
│   └── InsightsPage.tsx         # Analytics + smart tips
├── types/
│   └── index.ts                 # TypeScript interfaces
├── App.tsx                      # Root layout + routing
├── main.tsx                     # Entry point
└── index.css                    # Tailwind v4 theme configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📐 Design Approach

### Architecture Decisions
- **React Context** chosen over Redux/Zustand for simplicity — appropriate for an app of this scale
- **Custom hooks** (`useFinance.ts`) encapsulate all derived calculations, keeping components lean
- **Co-located types** in a dedicated `types/` directory for maintainability
- **Component composition** — each component has a single responsibility

### UI/UX Philosophy
- **Dark sidebar + light content** layout for high readability
- **Indigo accent color** for a professional fintech feel
- **Subtle animations** (fade-in, slide-up) for polish without distraction
- **Responsive design** — sidebar collapses to hamburger on mobile, grids adapt from 1 to 3 columns
- **Empty states** handled with helpful messages and illustrations

### State Management
- `AppContext` manages: transactions array, filters, role, and theme
- `localStorage` provides persistence across sessions
- `useMemo`-based derived hooks prevent unnecessary re-renders

---

## 🎯 Evaluation Checklist

| Criteria | Implementation |
|---|---|
| Design & Creativity | Custom color theme, gradient cards, donut/area charts, smart tips |
| Responsiveness | Mobile hamburger menu, adaptive grids, touch-friendly controls |
| Functionality | CRUD, filtering, sorting, search, CSV export, role switching |
| User Experience | Smooth transitions, empty states, clear typography hierarchy |
| Technical Quality | TypeScript, modular components, custom hooks, Context API |
| State Management | Context + localStorage persistence, memoized derivations |
| Documentation | This README with architecture explanation |
| Attention to Detail | Hover effects, animated badges, gradient accents, favicon |

---

## 📝 License

This project was built as a frontend development internship assignment.
