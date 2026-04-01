import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  Eye,
  ChevronDown,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/insights', icon: Lightbulb, label: 'Insights' },
];

export default function Sidebar() {
  const { theme, toggleTheme, role, setRole } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-surface-900 dark:bg-surface-950 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">FinTrack</span>
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
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-surface-900 dark:bg-surface-950
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Wallet size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">FinTrack</h1>
            <p className="text-surface-400 text-xs tracking-wide">Finance Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={closeMobile}
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
                  className={`transition-colors ${isActive ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-300'}`}
                />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Controls */}
        <div className="px-4 pb-6 space-y-3 border-t border-white/5 pt-4">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdown(!roleDropdown)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/8 text-sm text-surface-300 transition-all"
            >
              {role === 'admin' ? (
                <ShieldCheck size={18} className="text-primary-400" />
              ) : (
                <Eye size={18} className="text-surface-400" />
              )}
              <span className="flex-1 text-left font-medium">
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/8 text-sm text-surface-300 transition-all"
          >
            {theme === 'light' ? (
              <Moon size={18} className="text-primary-400" />
            ) : (
              <Sun size={18} className="text-warning-500" />
            )}
            <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
