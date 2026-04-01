import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Blocks,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/insights', icon: Lightbulb, label: 'Insights' },
  { path: '/architecture', icon: Blocks, label: 'Architecture' },
];

export default function Sidebar() {
  const { theme, toggleTheme, role, setRole, sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  // On desktop: show full width if not collapsed, or if collapsed but hovered
  const isExpanded = !collapsed || hovered;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-surface-900 dark:bg-surface-950 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Finsight</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => { setHovered(false); setRoleDropdown(false); }}
        className={`
          fixed top-0 left-0 z-50 h-screen bg-surface-900 dark:bg-surface-950
          flex flex-col transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:z-40
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
          ${isExpanded ? 'lg:w-72' : 'lg:w-[72px]'}
        `}
        style={{ willChange: 'width' }}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-5 border-b border-white/5 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
            <Wallet size={22} className="text-white" />
          </div>
          <div className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            <h1 className="text-white font-bold text-xl tracking-tight whitespace-nowrap">Finsight</h1>
            <p className="text-surface-400 text-xs tracking-wide whitespace-nowrap">Finance Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <p className={`text-surface-500 text-[11px] font-semibold uppercase tracking-widest px-3 mb-3 transition-opacity duration-200 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Menu
          </p>
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={closeMobile}
                title={!isExpanded ? label : undefined}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-primary-500/15 text-primary-400 shadow-sm'
                      : 'text-surface-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-300'}`}
                />
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {label}
                </span>
                {isActive && isExpanded && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Controls */}
        <div className="px-3 pb-4 space-y-2 border-t border-white/5 pt-4">
          {/* Role Switcher (only when expanded) */}
          {isExpanded && (
            <div className="relative">
              <button
                onClick={() => setRoleDropdown(!roleDropdown)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/8 text-sm text-surface-300 transition-all"
              >
                {role === 'admin' ? (
                  <ShieldCheck size={18} className="text-primary-400 flex-shrink-0" />
                ) : (
                  <Eye size={18} className="text-surface-400 flex-shrink-0" />
                )}
                <span className="flex-1 text-left font-medium whitespace-nowrap">
                  {role === 'admin' ? 'Admin' : 'Viewer'}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-surface-500 transition-transform ${roleDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {roleDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-800 rounded-xl border border-white/10 overflow-hidden shadow-xl animate-fade-in z-10">
                  <button
                    onClick={() => {
                      setRole('admin');
                      setRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      role === 'admin'
                        ? 'bg-primary-500/15 text-primary-400'
                        : 'text-surface-300 hover:bg-white/5'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    Admin
                    <span className="ml-auto text-[11px] text-surface-500">Full Access</span>
                  </button>
                  <button
                    onClick={() => {
                      setRole('viewer');
                      setRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      role === 'viewer'
                        ? 'bg-primary-500/15 text-primary-400'
                        : 'text-surface-300 hover:bg-white/5'
                    }`}
                  >
                    <Eye size={16} />
                    Viewer
                    <span className="ml-auto text-[11px] text-surface-500">Read Only</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Collapsed: icon-only role indicator */}
          {!isExpanded && (
            <div className="flex justify-center py-2" title={role === 'admin' ? 'Admin' : 'Viewer'}>
              {role === 'admin' ? (
                <ShieldCheck size={20} className="text-primary-400" />
              ) : (
                <Eye size={20} className="text-surface-400" />
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={!isExpanded ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : undefined}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/8 text-sm text-surface-300 transition-all"
          >
            {theme === 'light' ? (
              <Moon size={18} className="text-primary-400 flex-shrink-0" />
            ) : (
              <Sun size={18} className="text-warning-500 flex-shrink-0" />
            )}
            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {/* Collapse/Expand Toggle (desktop only) */}
          <button
            onClick={() => { setCollapsed(!collapsed); setHovered(false); }}
            className="hidden lg:flex w-full items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-surface-400 hover:text-surface-200 transition-all"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight size={18} className="flex-shrink-0" />
            ) : (
              <ChevronLeft size={18} className="flex-shrink-0" />
            )}
            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              Collapse
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
