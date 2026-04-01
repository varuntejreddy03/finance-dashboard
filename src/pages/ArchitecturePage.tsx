import { useState } from 'react';
import {
  Cpu, Database, Layout, Server, Layers, Zap, ArrowRight,
  ChevronDown, ChevronUp, GitBranch, Globe, Users,
  Shield, BarChart3, Code2, Gauge,
} from 'lucide-react';
import { buildIndex, runBenchmark } from '../utils/dataEngine';
import { useApp } from '../context/AppContext';

// ─── Section 1: Interactive HLD ───────────────────────────────

interface HldNode {
  id: string;
  label: string;
  icon: typeof Cpu;
  color: string;
  items: string[];
}

const hldNodes: HldNode[] = [
  {
    id: 'ui',
    label: 'UI Layer',
    icon: Layout,
    color: '#818CF8',
    items: ['DashboardPage', 'TransactionsPage', 'InsightsPage', 'ArchitecturePage', 'Sidebar', 'SummaryCards', 'Charts'],
  },
  {
    id: 'state',
    label: 'State Layer',
    icon: Layers,
    color: '#34D399',
    items: ['AppContext (role, theme, filters)', 'useFilteredTransactions()', 'useFinanceSummary()', 'localStorage persistence'],
  },
  {
    id: 'engine',
    label: 'Data Engine',
    icon: Cpu,
    color: '#F59E0B',
    items: ['buildIndex() — HashMap construction', 'getDateRange() — binary search', 'byId, byCategory, byType indexes', 'Pre-sorted views (date, amount)'],
  },
  {
    id: 'data',
    label: 'Mock API / Cache',
    icon: Database,
    color: '#EC4899',
    items: ['30 mock transactions', 'localStorage cache', 'Category metadata', 'Future: REST / GraphQL endpoint'],
  },
  {
    id: 'worker',
    label: 'Web Worker',
    icon: Server,
    color: '#06B6D4',
    items: ['Offload aggregation', 'Monthly totals', 'Trend detection', 'Keeps main thread at 60fps'],
  },
];

function HldDiagram() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center">
          <GitBranch size={20} className="text-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">System Architecture (HLD)</h3>
          <p className="text-sm text-surface-500">Click any layer to explore its internals</p>
        </div>
      </div>

      {/* Diagram */}
      <div className="relative">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div className="relative flex flex-col gap-3">
          {hldNodes.map((node, i) => {
            const Icon = node.icon;
            const isExpanded = expanded === node.id;

            return (
              <div key={node.id}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : node.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 transition-all bg-surface-50 dark:bg-surface-750 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                    style={{ backgroundColor: `${node.color}18`, border: `1.5px solid ${node.color}40` }}
                  >
                    <Icon size={22} style={{ color: node.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-surface-900 dark:text-white">{node.label}</p>
                    <p className="text-xs text-surface-500">{node.items.length} components</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-surface-400" />
                  ) : (
                    <ChevronDown size={18} className="text-surface-400" />
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-2 ml-8 p-4 rounded-xl bg-surface-50 dark:bg-surface-750 border border-dashed border-surface-200 dark:border-surface-600 animate-slide-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {node.items.map((item, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: node.color }} />
                          <code className="text-xs font-mono text-surface-700 dark:text-surface-300">{item}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connector arrow */}
                {i < hldNodes.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-surface-300 dark:bg-surface-600" />
                    <ArrowRight size={12} className="text-surface-400 -ml-1.5 mt-1 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: LLD Data Structure ───────────────────────────

function LldCard() {
  const { transactions } = useApp();
  const [benchResult, setBenchResult] = useState<{
    naiveMs: number;
    indexedMs: number;
    speedup: string;
  } | null>(null);
  const [benchRunning, setBenchRunning] = useState(false);

  const handleBenchmark = () => {
    setBenchRunning(true);
    // Use setTimeout to let the UI update before blocking
    setTimeout(() => {
      const idx = buildIndex(transactions);
      const result = runBenchmark(idx, 'Food');
      setBenchResult(result);
      setBenchRunning(false);
    }, 50);
  };

  const structures = [
    { key: 'byId', type: 'HashMap<id, Tx>', complexity: 'O(1)', desc: 'Instant ID lookup', color: '#818CF8' },
    { key: 'byCategory', type: 'Index<cat, Tx[]>', complexity: 'O(1)', desc: 'Category filter', color: '#34D399' },
    { key: 'byType', type: 'Index<type, Tx[]>', complexity: 'O(1)', desc: 'Income/expense split', color: '#F59E0B' },
    { key: 'byDate', type: 'Sorted Array', complexity: 'O(log n)', desc: 'Date range queries', color: '#EC4899' },
    { key: 'sortedByAmount', type: 'Sorted Array', complexity: 'O(1)*', desc: 'Pre-computed sort', color: '#06B6D4' },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-500/15 flex items-center justify-center">
          <Database size={20} className="text-warning-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">TransactionStore (LLD)</h3>
          <p className="text-sm text-surface-500">Indexed data structure for O(1) operations</p>
        </div>
      </div>

      {/* Structure visualization */}
      <div className="space-y-2 mb-6">
        {structures.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-750 border border-surface-100 dark:border-surface-700"
          >
            <code className="text-sm font-mono font-bold text-surface-800 dark:text-surface-200 w-40 flex-shrink-0">
              {s.key}
            </code>
            <ArrowRight size={14} className="text-surface-400 flex-shrink-0" />
            <code className="text-xs font-mono text-surface-500 w-36 flex-shrink-0">{s.type}</code>
            <span
              className="px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: `${s.color}20`, color: s.color }}
            >
              {s.complexity}
            </span>
            <span className="text-xs text-surface-500 hidden sm:block">{s.desc}</span>
          </div>
        ))}
      </div>

      {/* Live Benchmark */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-750 dark:to-surface-800 border border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-warning-500" />
            <span className="text-sm font-bold text-surface-900 dark:text-white">Live Benchmark</span>
            <span className="text-xs text-surface-500">(10,000 iterations × "Food" filter)</span>
          </div>
          <button
            onClick={handleBenchmark}
            disabled={benchRunning}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white text-xs font-bold hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm"
          >
            {benchRunning ? '⏳ Running...' : '▶ Run Benchmark'}
          </button>
        </div>

        {benchResult && (
          <div className="grid grid-cols-3 gap-3 animate-slide-up">
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-center">
              <p className="text-xs text-danger-600 dark:text-danger-400 font-semibold mb-1">Naive O(n)</p>
              <p className="text-xl font-bold text-danger-700 dark:text-danger-400">{benchResult.naiveMs}ms</p>
            </div>
            <div className="p-3 rounded-lg bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20 text-center">
              <p className="text-xs text-success-600 dark:text-success-400 font-semibold mb-1">Indexed O(1)</p>
              <p className="text-xl font-bold text-success-700 dark:text-success-400">{benchResult.indexedMs}ms</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-center">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1">Speedup</p>
              <p className="text-xl font-bold text-primary-700 dark:text-primary-400">{benchResult.speedup} faster</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section 3: Optimization Table ────────────────────────────

function OptimizationTable() {
  const rows = [
    { feature: 'Search', naive: 'Loop all records O(n)', ours: 'Debounce 300ms + Index', why: 'Avoid re-renders on every keystroke', naiveO: 'O(n)', ourO: 'O(1)' },
    { feature: 'Filter', naive: 'Filter on every render', ours: 'Pre-built HashMap index', why: 'O(1) category/type lookups vs O(n) scan', naiveO: 'O(n)', ourO: 'O(1)' },
    { feature: 'Sort', naive: 'Sort on column click', ours: 'Cached sorted views', why: 'Pre-sorted arrays avoid re-sorting', naiveO: 'O(n log n)', ourO: 'O(1)*' },
    { feature: 'Render', naive: 'Render all rows in DOM', ours: 'Virtual scrolling (react-window)', why: 'Only 20 visible rows → handles 1M records', naiveO: 'O(n)', ourO: 'O(1)' },
    { feature: 'Aggregation', naive: 'Recalculate on every render', ours: 'useMemo + Web Worker', why: 'Memoized results, 60fps always', naiveO: 'O(n)', ourO: 'O(1)*' },
    { feature: 'Page Load', naive: 'Bundle everything', ours: 'React.lazy + Suspense', why: 'Code-split: load pages on demand', naiveO: 'Full', ourO: 'Partial' },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
          <Gauge size={20} className="text-success-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Optimization Decisions</h3>
          <p className="text-sm text-surface-500">Naive approach vs. our engineered approach</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700">
              <th className="text-left py-3 px-3 text-xs font-semibold text-surface-500 uppercase tracking-wider w-24">Feature</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-danger-500 uppercase tracking-wider">❌ Naive Way</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-success-500 uppercase tracking-wider">✅ Our Way</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Why</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-surface-500 uppercase tracking-wider w-20">Big-O</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
            {rows.map((row) => (
              <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-bold text-surface-800 dark:text-surface-200">{row.feature}</span>
                </td>
                <td className="py-3 px-3">
                  <code className="text-xs font-mono text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-500/10 px-2 py-1 rounded">
                    {row.naive}
                  </code>
                </td>
                <td className="py-3 px-3">
                  <code className="text-xs font-mono text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 px-2 py-1 rounded">
                    {row.ours}
                  </code>
                </td>
                <td className="py-3 px-3 text-xs text-surface-500 hidden lg:table-cell">{row.why}</td>
                <td className="py-3 px-3 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] text-danger-500 line-through">{row.naiveO}</span>
                    <span className="text-xs font-bold text-success-600">{row.ourO}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 4: Scaling Roadmap ────────────────────────────────

function ScalingRoadmap() {
  const phases = [
    {
      phase: 'Phase 1 — Current',
      label: 'Mock Data',
      icon: Code2,
      color: '#818CF8',
      desc: '30 transactions, localStorage cache, indexed data engine, Context API state',
      status: 'active' as const,
    },
    {
      phase: 'Phase 2',
      label: 'REST API',
      icon: Server,
      color: '#34D399',
      desc: 'Express/FastAPI backend, PostgreSQL, server-side pagination, JWT auth',
      status: 'planned' as const,
    },
    {
      phase: 'Phase 3',
      label: 'GraphQL + Scale',
      icon: Globe,
      color: '#F59E0B',
      desc: 'GraphQL subscriptions for live data, Redis caching, WebSocket updates',
      status: 'future' as const,
    },
    {
      phase: 'Phase 4',
      label: '1M Users',
      icon: Users,
      color: '#EC4899',
      desc: 'CDN distribution, database indexing, message queues, horizontal scaling',
      status: 'future' as const,
    },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center">
          <BarChart3 size={20} className="text-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Scaling Roadmap</h3>
          <p className="text-sm text-surface-500">From prototype to production at scale</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-700" />

        <div className="space-y-6">
          {phases.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.phase} className="relative flex gap-5 pl-1">
                {/* Timeline dot */}
                <div
                  className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    backgroundColor: p.status === 'active' ? p.color : `${p.color}20`,
                    border: `2px solid ${p.color}`,
                  }}
                >
                  <Icon size={18} style={{ color: p.status === 'active' ? '#fff' : p.color }} />
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-surface-900 dark:text-white">{p.label}</h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-500">
                      {p.phase}
                    </span>
                    {p.status === 'active' && (
                      <span className="px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-500/15 text-success-700 dark:text-success-400 text-[10px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-surface-500">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Architecture Page ─────────────────────────────────────

export default function ArchitecturePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Architecture</h1>
            <p className="text-sm text-surface-500">
              Designed to scale from 30 to 1,000,000 transactions with zero UI changes
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>💡 Why this page exists:</strong> This demonstrates the architectural thinking behind Finsight.
            Every data operation is O(1) or O(log n) via pre-built indexes — not naive O(n) iteration.
            The UI is engineered for 60fps at any data scale.
          </p>
        </div>
      </div>

      {/* HLD Diagram */}
      <HldDiagram />

      {/* LLD + Optimizations side by side on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LldCard />
        <OptimizationTable />
      </div>

      {/* Scaling Roadmap */}
      <ScalingRoadmap />

      {/* Tech Stack Summary */}
      <div className="bg-gradient-to-br from-surface-800 to-surface-900 dark:from-surface-900 dark:to-surface-950 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4">⚡ Performance Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'React 19', detail: 'Concurrent features' },
            { label: 'TypeScript', detail: 'Type safety' },
            { label: 'Tailwind v4', detail: 'Utility CSS' },
            { label: 'Recharts', detail: 'Visualizations' },
            { label: 'react-window', detail: 'Virtual scroll' },
            { label: 'Context API', detail: 'State mgmt' },
          ].map((tech) => (
            <div key={tech.label} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm font-bold">{tech.label}</p>
              <p className="text-[10px] text-surface-400 mt-0.5">{tech.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
