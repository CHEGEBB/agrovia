/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
// components/AdminSidebar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useFields } from '@/hooks/useFields';
import type { Field } from '@/hooks/useFields';

// ─── Status logic (mirrors agent dashboard) ───────────────────────────────────
function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const daysPlanted = Math.floor((Date.now() - new Date(field.plantingDate).getTime()) / 86_400_000);
  const daysUpdated = Math.floor((Date.now() - new Date(field.lastUpdate).getTime()) / 86_400_000);
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && daysPlanted > 90) return 'At Risk';
  if (daysUpdated > 14) return 'At Risk';
  return 'Active';
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const nav = [
  { href: '/admin/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/agents',    label: 'Agents',    icon: Users },
  { href: '/admin/fields',    label: 'All Fields', icon: Map },
  { href: '/admin/settings',  label: 'Settings',  icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const { fields } = useFields();

  // ── Collapsed state ─────────────────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('agrovia:admin-sidebar-collapsed');
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      localStorage.setItem('agrovia:admin-sidebar-collapsed', String(!v));
      return !v;
    });
  };

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const open = () => setDrawerOpen(true);
    window.addEventListener('agrovia:admin-sidebar-open', open);
    return () => window.removeEventListener('agrovia:admin-sidebar-open', open);
  }, []);

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setDrawerOpen(false);
    }
  }, [pathname]);

  // Stats
  const enrichedFields = fields.map((f) => ({ ...f, computedStatus: computeStatus(f) }));
  const atRiskCount = enrichedFields.filter((f) => f.computedStatus === 'At Risk').length;

  // ── Nav content ─────────────────────────────────────────────────────────────
  const NavContent = ({ mobile = false }: { mobile?: boolean }) => {
    const isExpanded = mobile || !collapsed;

    return (
      <div className="flex flex-col h-full">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          className={cn(
            'flex items-center shrink-0 border-b border-neutral-100 h-16',
            !isExpanded ? 'px-2 justify-center' : 'px-4 justify-between'
          )}
        >
          <button
            onClick={!isExpanded ? toggleCollapsed : undefined}
            className={cn(
              'flex items-center gap-2.5 min-w-0',
              !isExpanded ? 'cursor-pointer' : 'cursor-default'
            )}
            title={!isExpanded ? 'Expand sidebar' : undefined}
          >
            <div className="w-8 h-8 shrink-0 relative">
              <Image src="/logo.png" alt="Agrovia" fill className="object-contain" priority />
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-[15px] text-neutral-900 tracking-tight leading-none">Agrovia</p>
                  <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium mt-0.5 uppercase tracking-wider">Coordinator Panel</p>
              </div>
            )}
          </button>

          {mobile ? (
            <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
              <X size={18} />
            </button>
          ) : !isExpanded ? (
            <button onClick={toggleCollapsed} className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0" title="Expand">
              <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={toggleCollapsed} className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0" title="Collapse">
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {isExpanded && (
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-3">Menu</p>
          )}

          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            const isFieldsNav = href === '/admin/fields';
            const isAgentsNav = href === '/admin/agents';

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-2 py-2.5 text-sm font-medium transition-all group rounded-sm',
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                  !isExpanded && 'justify-center px-2'
                )}
                title={!isExpanded ? label : undefined}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={cn(
                    'shrink-0 transition-colors',
                    active ? 'text-emerald-600' : 'text-neutral-400 group-hover:text-neutral-700'
                  )}
                />
                {isExpanded && <span className="flex-1">{label}</span>}

                {/* At-risk badge on Fields */}
                {isExpanded && isFieldsNav && atRiskCount > 0 && (
                  <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {atRiskCount}
                  </span>
                )}

                {/* Active dot */}
                {active && isExpanded && !isFieldsNav && (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}

                {/* Collapsed active dot */}
                {active && !isExpanded && (
                  <span className="absolute right-1.5 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* At-risk callout */}
          {isExpanded && atRiskCount > 0 && (
            <div className="mx-2 mt-3 flex items-center gap-1.5 px-2 py-2 bg-amber-50 border border-amber-100 rounded-sm">
              <AlertTriangle size={11} className="text-amber-500 shrink-0" />
              <span className="text-[11px] text-amber-700 font-semibold">
                {atRiskCount} field{atRiskCount > 1 ? 's' : ''} at risk
              </span>
            </div>
          )}
        </nav>

        {/* ── User footer ──────────────────────────────────────────────── */}
        <div
          className={cn(
            'shrink-0 border-t border-neutral-100 px-2 py-3',
            !isExpanded ? 'flex flex-col items-center gap-2' : ''
          )}
        >
          {isExpanded ? (
            <div
              className="flex items-center gap-3 px-2 py-2 hover:bg-neutral-50 transition-colors group cursor-pointer rounded-sm"
              onClick={() => router.push('/admin/settings')}
              title="Go to settings"
            >
              <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center shrink-0 rounded-sm relative">
                <span className="text-xs font-black text-emerald-700">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </span>
                {/* Admin badge */}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Shield size={8} className="text-white" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-neutral-800 truncate">{user?.name ?? 'Admin'}</p>
                <p className="text-[11px] text-neutral-400 truncate">{user?.email ?? ''}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); logout(); }}
                className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 rounded-sm"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <>
              <div
                className="w-8 h-8 bg-emerald-100 flex items-center justify-center cursor-pointer hover:bg-emerald-200 transition-colors rounded-sm relative"
                onClick={() => router.push('/admin/settings')}
                title="Settings"
              >
                <span className="text-xs font-black text-emerald-700">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Shield size={6} className="text-white" />
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-sm"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-white border-r border-neutral-100 shrink-0 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[64px]' : 'w-[260px]'
        )}
      >
        <NavContent />
      </aside>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-[280px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent mobile />
      </aside>
    </>
  );
}