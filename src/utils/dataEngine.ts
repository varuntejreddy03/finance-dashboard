/**
 * DataEngine — Indexed Transaction Store
 *
 * Instead of iterating over a plain array for every operation,
 * we build multiple indexes on load for O(1) lookups and O(log n) range queries.
 *
 * Structure:
 *   byId:        HashMap<id, Transaction>        → O(1) lookup
 *   byCategory:  HashMap<category, Transaction[]> → O(1) category filter
 *   byType:      HashMap<type, Transaction[]>     → O(1) income/expense split
 *   byDate:      Transaction[] (sorted asc)       → O(log n) date range via binary search
 *   sortedByAmount: Transaction[] (sorted desc)   → pre-computed sort
 */

import type { Transaction, Category, TransactionType } from '../types';

export interface TransactionIndex {
  byId: Map<string, Transaction>;
  byCategory: Map<string, Transaction[]>;
  byType: Map<TransactionType, Transaction[]>;
  byDate: Transaction[]; // sorted ascending
  sortedByAmount: Transaction[]; // sorted descending
  all: Transaction[];
}

/**
 * Build all indexes from a flat transaction array.
 * Called once on load and after any mutation.
 */
export function buildIndex(transactions: Transaction[]): TransactionIndex {
  const byId = new Map<string, Transaction>();
  const byCategory = new Map<string, Transaction[]>();
  const byType = new Map<TransactionType, Transaction[]>();

  for (const tx of transactions) {
    // byId — O(1) lookup
    byId.set(tx.id, tx);

    // byCategory index
    if (!byCategory.has(tx.category)) byCategory.set(tx.category, []);
    byCategory.get(tx.category)!.push(tx);

    // byType index
    if (!byType.has(tx.type)) byType.set(tx.type, []);
    byType.get(tx.type)!.push(tx);
  }

  // Sorted views
  const byDate = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const sortedByAmount = [...transactions].sort((a, b) => b.amount - a.amount);

  return { byId, byCategory, byType, byDate, sortedByAmount, all: transactions };
}

/**
 * Binary search for date range — O(log n) instead of O(n)
 */
export function getDateRange(
  sortedByDate: Transaction[],
  from: string,
  to: string
): Transaction[] {
  if (sortedByDate.length === 0) return [];

  let lo = 0;
  let hi = sortedByDate.length - 1;

  // Find first index >= from
  let startIdx = sortedByDate.length;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedByDate[mid].date >= from) {
      startIdx = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  lo = startIdx;
  hi = sortedByDate.length - 1;

  // Find last index <= to
  let endIdx = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedByDate[mid].date <= to) {
      endIdx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (startIdx > endIdx) return [];
  return sortedByDate.slice(startIdx, endIdx + 1);
}

/**
 * Benchmark utility — runs a naive O(n) scan vs indexed O(1) lookup
 * and returns timing results in microseconds
 */
export function runBenchmark(
  index: TransactionIndex,
  category: Category
): { naiveMs: number; indexedMs: number; speedup: string } {
  const iterations = 10000;

  // Naive: O(n) linear scan
  const naiveStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    index.all.filter((t) => t.category === category);
  }
  const naiveMs = performance.now() - naiveStart;

  // Indexed: O(1) HashMap lookup
  const indexedStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    index.byCategory.get(category) || [];
  }
  const indexedMs = performance.now() - indexedStart;

  const speedup = naiveMs > 0 ? `${(naiveMs / Math.max(indexedMs, 0.001)).toFixed(0)}x` : '∞';

  return {
    naiveMs: Math.round(naiveMs * 100) / 100,
    indexedMs: Math.round(indexedMs * 100) / 100,
    speedup,
  };
}
