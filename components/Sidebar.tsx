/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
// components/Sidebar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Sprout,
  AlertTriangle,
  CheckCircle,
  Activity,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useFields } from '@/hooks/useFields';
import type { Stage, Field } from '@/hooks/useFields';

// ─── Status logic (mirrors dashboard) ────────────────────────────────────────
function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const daysPlanted = Math.floor((Date.now() - new Date(field.plantingDate).getTime()) / 86_400_000);
  const daysUpdated = Math.floor((Date.now() - new Date(field.lastUpdate).getTime()) / 86_400_000);
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && daysPlanted > 90) return 'At Risk';
  if (daysUpdated > 14) return 'At Risk';
  return 'Active';
}

const STATUS_DOT: Record<'Active' | 'At Risk' | 'Completed', string> = {
  Active:    'bg-emerald-500',
  'At Risk': 'bg-amber-400',
  Completed: 'bg-neutral-300',
};

const STAGE_COLOR: Record<Stage, string> = {
  Planted:   'text-sky-500',
  Growing:   'text-emerald-500',
  Ready:     'text-amber-500',
  Harvested: 'text-neutral-400',
};

// ─── Top-level nav items ──────────────────────────────────────────────────────
const nav = [
  { href: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agent/fields',    label: 'Fields',     icon: Map,             hasSubmenu: true },
  { href: '/agent/settings',  label: 'Settings',   icon: Settings },
];

export function Sidebar({ userRole = 'agent' }: { userRole?: string }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuth();
  const { fields } = useFields();

  // ── Collapsed state ───────────────────────────────────────────────────────
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

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const open = () => setDrawerOpen(true);
    window.addEventListener('agrovia:sidebar-open', open);
    return () => window.removeEventListener('agrovia:sidebar-open', open);
  }, []);

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setDrawerOpen(false);
    }
  }, [pathname]);

  // ── Fields submenu open state ─────────────────────────────────────────────
  // Auto-open when on any /agent/fields route
  const onFieldsRoute = pathname.startsWith('/agent/fields');
  const [fieldsOpen, setFieldsOpen] = useState(onFieldsRoute);
  useEffect(() => {
    if (onFieldsRoute) setFieldsOpen(true);
  }, [onFieldsRoute]);

  // Current field id (if on detail page)
  const fieldIdMatch = pathname.match(/^\/agent\/fields\/([^/]+)/);
  const currentFieldId = fieldIdMatch?.[1] ?? null;

  // Enrich fields with status
  const enrichedFields = fields.map((f) => ({ ...f, computedStatus: computeStatus(f) }));

  // Stats for the Fields nav badge
  const atRiskCount = enrichedFields.filter((f) => f.computedStatus === 'At Risk').length;

  // ── Nav content ────────────────────────────────────────────────────────────
  const NavContent = ({ mobile = false }: { mobile?: boolean }) => {
    const isExpanded = mobile || !collapsed;

    return (
      <div className="flex flex-col h-full">

        {/* ── Header ─────────────────────────────────────────────────── */}
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
                <p className="font-black text-[15px] text-neutral-900 tracking-tight leading-none">Agrovia</p>
                <p className="text-[10px] text-neutral-400 font-medium mt-0.5 uppercase tracking-wider">Field Monitor</p>
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

        {/* ── Nav ────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {isExpanded && (
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-3">Menu</p>
          )}

          {nav.map(({ href, label, icon: Icon, hasSubmenu }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            const isFields = hasSubmenu && href === '/agent/fields';

            return (
              <div key={href}>
                {/* ── Main nav item ─────────────────────────────────── */}
                <div className="flex items-center gap-0">
                  <Link
                    href={href}
                    className={cn(
                      'flex-1 flex items-center gap-3 px-2 py-2.5 text-sm font-medium transition-all group rounded-sm',
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

                    {/* At-risk badge on Fields item */}
                    {isExpanded && isFields && atRiskCount > 0 && (
                      <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {atRiskCount}
                      </span>
                    )}

                    {/* Active dot */}
                    {active && isExpanded && !isFields && (
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}

                    {/* Collapsed active dot */}
                    {active && !isExpanded && (
                      <span className="absolute right-1.5 w-1 h-1 bg-emerald-500 rounded-full" />
                    )}
                  </Link>

                  {/* Chevron toggle for Fields submenu */}
                  {isExpanded && isFields && (
                    <button
                      onClick={() => setFieldsOpen((v) => !v)}
                      className={cn(
                        'p-2 transition-colors rounded-sm shrink-0',
                        active ? 'text-emerald-500 hover:bg-emerald-100' : 'text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100'
                      )}
                    >
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform duration-200', fieldsOpen ? 'rotate-0' : '-rotate-90')}
                      />
                    </button>
                  )}
                </div>

                {/* ── Fields submenu ────────────────────────────────── */}
                {isExpanded && isFields && fieldsOpen && (
                  <div className="mt-0.5 ml-2 pl-4 border-l border-neutral-100 space-y-0.5 pb-1">

                    {/* All Fields link */}
                    <Link
                      href="/agent/fields"
                      className={cn(
                        'flex items-center gap-2 px-2 py-1.5 text-[12px] font-semibold transition-colors rounded-sm group',
                        pathname === '/agent/fields'
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                      )}
                    >
                      <Map size={12} className="shrink-0 text-neutral-400 group-hover:text-neutral-600" />
                      <span>All Fields</span>
                      <span className="ml-auto text-[10px] text-neutral-400 font-normal">{fields.length}</span>
                    </Link>

                    {/* Section header */}
                    {enrichedFields.length > 0 && (
                      <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest px-2 pt-2 pb-1">
                        Your Fields
                      </p>
                    )}

                    {/* Individual field items */}
                    {enrichedFields.map((f) => {
                      const isActive = currentFieldId === f.id;
                      return (
                        <Link
                          key={f.id}
                          href={`/agent/fields/${f.id}`}
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 text-[12px] transition-colors rounded-sm group',
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 font-medium'
                          )}
                        >
                          {/* Status dot */}
                          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 mt-px', STATUS_DOT[f.computedStatus])} />

                          {/* Field name */}
                          <span className="flex-1 truncate">{f.name}</span>

                          {/* Stage label */}
                          <span className={cn('text-[10px] font-bold shrink-0', STAGE_COLOR[f.stage])}>
                            {f.stage === 'Growing' ? 'Grwg' : f.stage === 'Harvested' ? 'Done' : f.stage === 'Planted' ? 'Pltd' : 'Rdy'}
                          </span>
                        </Link>
                      );
                    })}

                    {/* Empty state */}
                    {enrichedFields.length === 0 && (
                      <div className="px-2 py-3 text-center">
                        <Sprout size={16} className="text-neutral-300 mx-auto mb-1" />
                        <p className="text-[11px] text-neutral-400">No fields yet</p>
                      </div>
                    )}

                    {/* At-risk callout */}
                    {atRiskCount > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1.5 mt-1 bg-amber-50 border border-amber-100 rounded-sm">
                        <AlertTriangle size={11} className="text-amber-500 shrink-0" />
                        <span className="text-[11px] text-amber-700 font-semibold">
                          {atRiskCount} field{atRiskCount > 1 ? 's' : ''} at risk
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── User footer ────────────────────────────────────────────── */}
        <div
          className={cn(
            'shrink-0 border-t border-neutral-100 px-2 py-3',
            !isExpanded ? 'flex flex-col items-center gap-2' : ''
          )}
        >
          {isExpanded ? (
            <div
              className="flex items-center gap-3 px-2 py-2 hover:bg-neutral-50 transition-colors group cursor-pointer rounded-sm"
              onClick={() => router.push('/agent/settings')}
              title="Go to settings"
            >
              <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center shrink-0 rounded-sm">
                <span className="text-xs font-black text-emerald-700">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-neutral-800 truncate">{user?.name ?? 'Agent'}</p>
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
                className="w-8 h-8 bg-emerald-100 flex items-center justify-center cursor-pointer hover:bg-emerald-200 transition-colors rounded-sm"
                onClick={() => router.push('/agent/settings')}
                title="Settings"
              >
                <span className="text-xs font-black text-emerald-700">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
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