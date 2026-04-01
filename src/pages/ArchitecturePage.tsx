import { useState } from 'react';
import {
  Cpu, Database, Layout, Server, Layers, Zap, ArrowRight,
  ChevronDown, ChevronUp, GitBranch, Globe, Users,
  Shield, BarChart3, Code2, Gauge,
} from 'lucide-react';
import { buildIndex, runBenchmark } from '../utils/dataEngine';
import { useApp } from '../context/AppContext';

// ─── Section 1: How the App is Built ──────────────────────────

const hldNodes = [
  {
    id: 'ui',
    label: 'UI Layer',
    icon: Layout,
    color: '#818CF8',
    items: ['Dashboard Page', 'Transactions Page', 'Insights Page', 'Sidebar & Navigation', 'Charts (Recharts)'],
  },
  {
    id: 'state',
    label: 'State Management',
    icon: Layers,
    color: '#34D399',
    items: ['React Context API', 'Theme & Role state', 'Filter & Search state', 'localStorage sync'],
  },
  {
    id: 'engine',
    label: 'Data Processing',
    icon: Cpu,
    color: '#F59E0B',
    items: ['Indexed data lookups', 'Category grouping', 'Date range filtering', 'Pre-sorted views'],
  },
  {
    id: 'data',
    label: 'Data Source',
    icon: Database,
    color: '#EC4899',
    items: ['30 mock transactions', 'localStorage persistence', 'Category metadata'],
  },
];

function HldDiagram() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
          <GitBranch size={20} className="text-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">How the App is Structured</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">Click a layer to see what's inside</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {hldNodes.map((node, i) => {
          const Icon = node.icon;
          const isOpen = expanded === node.id;

          return (
            <div key={node.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : node.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500 transition-all bg-surface-50 dark:bg-surface-700 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${node.color}20`, border: `1.5px solid ${node.color}50` }}
                >
                  <Icon size={20} style={{ color: node.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-surface-900 dark:text-white">{node.label}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{node.items.length} parts</p>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-surface-400" />
                ) : (
                  <ChevronDown size={16} className="text-surface-400" />
                )}
              </button>

              {isOpen && (
                <div className="mt-2 ml-8 p-3 rounded-xl bg-surface-100 dark:bg-surface-700 border border-dashed border-surface-300 dark:border-surface-600 animate-slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {node.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: node.color }} />
                        <span className="text-xs text-surface-700 dark:text-surface-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {i < hldNodes.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight size={12} className="text-surface-400 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section 2: Data Structure ───────────────────────────────

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
    setTimeout(() => {
      const idx = buildIndex(transactions);
      const result = runBenchmark(idx, 'Food');
      setBenchResult(result);
      setBenchRunning(false);
    }, 50);
  };

  const structures = [
    { key: 'byId', desc: 'Find any transaction instantly', speed: 'Fast', color: '#818CF8' },
    { key: 'byCategory', desc: 'Group by Food, Shopping, etc.', speed: 'Fast', color: '#34D399' },
    { key: 'byType', desc: 'Split income vs expenses', speed: 'Fast', color: '#F59E0B' },
    { key: 'byDate', desc: 'Filter by date range', speed: 'Fast', color: '#EC4899' },
    { key: 'sorted', desc: 'Already sorted, no re-sorting', speed: 'Instant', color: '#06B6D4' },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-500/15 flex items-center justify-center">
          <Database size={20} className="text-warning-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Data Organization</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">How transactions are stored for fast access</p>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        {structures.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-100 dark:border-surface-600"
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm font-semibold text-surface-800 dark:text-surface-200 w-28 flex-shrink-0">{s.key}</span>
            <span className="text-xs text-surface-500 dark:text-surface-400 flex-1">{s.desc}</span>
            <span
              className="px-2 py-0.5 rounded-md text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: `${s.color}20`, color: s.color }}
            >
              {s.speed}
            </span>
          </div>
        ))}
      </div>

      {/* Benchmark */}
      <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-warning-500" />
            <span className="text-sm font-bold text-surface-900 dark:text-white">Speed Test</span>
          </div>
          <button
            onClick={handleBenchmark}
            disabled={benchRunning}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white text-xs font-bold hover:bg-primary-600 disabled:opacity-50 transition-all"
          >
            {benchRunning ? '⏳ Running...' : '▶ Run Test'}
          </button>
        </div>

        {benchResult && (
          <div className="grid grid-cols-3 gap-3 animate-slide-up">
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-center">
              <p className="text-[11px] text-danger-600 dark:text-danger-400 font-semibold mb-1">Slow Way</p>
              <p className="text-lg font-bold text-danger-700 dark:text-danger-400">{benchResult.naiveMs}ms</p>
            </div>
            <div className="p-3 rounded-lg bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20 text-center">
              <p className="text-[11px] text-success-600 dark:text-success-400 font-semibold mb-1">Our Way</p>
              <p className="text-lg font-bold text-success-700 dark:text-success-400">{benchResult.indexedMs}ms</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-center">
              <p className="text-[11px] text-primary-600 dark:text-primary-400 font-semibold mb-1">Result</p>
              <p className="text-lg font-bold text-primary-700 dark:text-primary-400">{benchResult.speedup} faster</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section 3: What We Optimized ─────────────────────────────

function OptimizationTable() {
  const rows = [
    { feature: 'Search', basic: 'Check every record', ours: 'Wait 300ms, then search' },
    { feature: 'Filter', basic: 'Loop through all data', ours: 'Pre-grouped by category' },
    { feature: 'Sort', basic: 'Re-sort every time', ours: 'Already sorted on load' },
    { feature: 'Render', basic: 'Show all rows at once', ours: 'Only show visible rows' },
    { feature: 'Charts', basic: 'Recalculate always', ours: 'Cache results with useMemo' },
    { feature: 'Pages', basic: 'Load everything upfront', ours: 'Load pages when visited' },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
          <Gauge size={20} className="text-success-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">What We Optimized</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">Basic approach vs our approach</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-600">
              <th className="text-left py-3 px-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Feature</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-danger-500 uppercase tracking-wider">❌ Basic</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-success-500 uppercase tracking-wider">✅ Our Way</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-600">
            {rows.map((row) => (
              <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-semibold text-surface-800 dark:text-surface-200">{row.feature}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-500/10 px-2 py-1 rounded-lg">
                    {row.basic}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 px-2 py-1 rounded-lg">
                    {row.ours}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 4: Future Plans ───────────────────────────────────

function ScalingRoadmap() {
  const phases = [
    {
      phase: 'Now',
      label: 'Mock Data',
      icon: Code2,
      color: '#818CF8',
      desc: '30 transactions stored locally in the browser',
      status: 'active' as const,
    },
    {
      phase: 'Next',
      label: 'Real Backend',
      icon: Server,
      color: '#34D399',
      desc: 'Connect to a REST API with a database',
      status: 'planned' as const,
    },
    {
      phase: 'Future',
      label: 'Live Updates',
      icon: Globe,
      color: '#F59E0B',
      desc: 'Real-time data with WebSocket connections',
      status: 'future' as const,
    },
    {
      phase: 'Goal',
      label: 'Full Scale',
      icon: Users,
      color: '#EC4899',
      desc: 'Handle thousands of users and millions of records',
      status: 'future' as const,
    },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
          <BarChart3 size={20} className="text-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Future Plans</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">How this app could grow</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-600" />

        <div className="space-y-5">
          {phases.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.phase} className="relative flex gap-5 pl-1">
                <div
                  className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: p.status === 'active' ? p.color : `${p.color}20`,
                    border: `2px solid ${p.color}`,
                  }}
                >
                  <Icon size={18} style={{ color: p.status === 'active' ? '#fff' : p.color }} />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-surface-900 dark:text-white">{p.label}</h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{p.phase}</span>
                    {p.status === 'active' && (
                      <span className="px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-500/15 text-success-700 dark:text-success-400 text-[10px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{p.desc}</p>
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
            <p className="text-sm text-surface-500 dark:text-surface-400">
              How this dashboard is built and organized
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            💡 This page shows how the app is structured — the components, data flow, and optimizations used to keep it fast and organized.
          </p>
        </div>
      </div>

      {/* HLD */}
      <HldDiagram />

      {/* Data + Optimizations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LldCard />
        <OptimizationTable />
      </div>

      {/* Roadmap */}
      <ScalingRoadmap />

      {/* Tech Stack */}
      <div className="bg-gradient-to-br from-surface-800 to-surface-900 dark:from-surface-800 dark:to-surface-950 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4">⚡ Tech Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'React 19', detail: 'UI framework' },
            { label: 'TypeScript', detail: 'Type safety' },
            { label: 'Tailwind v4', detail: 'Styling' },
            { label: 'Recharts', detail: 'Charts' },
            { label: 'react-window', detail: 'Virtual scroll' },
            { label: 'Context API', detail: 'State' },
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
