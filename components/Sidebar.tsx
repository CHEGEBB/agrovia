/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sprout,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fields',    label: 'Fields',     icon: Map },
  { href: '/agents',    label: 'Agents',      icon: Users, adminOnly: true },
  { href: '/settings',  label: 'Settings',    icon: Settings },
];

export function Sidebar() {
  const pathname   = usePathname();
  const { user, logout } = useAuth() as {
    user: { name?: string; email?: string; role?: string } | null;
    logout: () => void;
  };

  /* ── collapsed state (desktop) ─────────────────────── */
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('agrovia:sidebar-collapsed');
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);
  const toggleCollapsed = () => {
    setCollapsed((v) => {
      localStorage.setItem('agrovia:sidebar-collapsed', String(!v));
      return !v;
    });
  };

  /* ── mobile drawer state ────────────────────────────── */
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const open  = () => setDrawerOpen(true);
    window.addEventListener('agrovia:sidebar-open', open);
    return () => window.removeEventListener('agrovia:sidebar-open', open);
  }, []);

  /* close drawer on route change */
  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setDrawerOpen(false);
    }
  }, [pathname]);

  const isAdmin = user?.role === 'admin';

  const links = nav.filter((n) => !n.adminOnly || isAdmin);

  /* ── shared nav content ─────────────────────────────── */
  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 shrink-0',
          mobile ? 'h-16 border-b border-neutral-100 justify-between' : collapsed ? 'h-16 justify-center' : 'h-16 justify-between'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <Sprout size={16} className="text-white" strokeWidth={2} />
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <p className="font-black text-[15px] text-neutral-900 tracking-tight leading-none">Agrovia</p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5 uppercase tracking-wider">Field Monitor</p>
            </div>
          )}
        </div>

        {mobile ? (
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={toggleCollapsed}
            className={cn(
              'p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0',
              collapsed && 'hidden'
            )}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {!collapsed && !mobile && (
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-2 mb-3">Navigation</p>
        )}
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                collapsed && !mobile && 'justify-center px-2'
              )}
              title={collapsed && !mobile ? label : undefined}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.2 : 1.8}
                className={cn(
                  'shrink-0 transition-colors',
                  active ? 'text-emerald-600' : 'text-neutral-400 group-hover:text-neutral-700'
                )}
              />
              {(!collapsed || mobile) && <span>{label}</span>}
              {active && (!collapsed || mobile) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className={cn(
          'shrink-0 border-t border-neutral-100 px-3 py-3',
          collapsed && !mobile ? 'flex flex-col items-center gap-2' : ''
        )}
      >
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-emerald-700">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-neutral-800 truncate">{user?.name ?? 'User'}</p>
              <p className="text-[11px] text-neutral-400 truncate capitalize">{user?.role ?? 'agent'}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-700">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </>
        )}

        {/* Expand button when collapsed */}
        {collapsed && !mobile && (
          <button
            onClick={toggleCollapsed}
            className="mt-1 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-white border-r border-neutral-100 shrink-0 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[64px]' : 'w-[220px]'
        )}
      >
        <NavContent />
      </aside>

      {/* ── Mobile drawer backdrop ───────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-[260px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent mobile />
      </aside>
    </>
  );
}