/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/dashboard/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Map,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
  Sprout,
  Clock,
  Flame,
  Zap,
  BarChart2,
  Leaf,
  CircleDot,
  ArrowUpRight,
  Archive,
  Flag,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFields } from '@/hooks/useFields';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import type { Stage, Field } from '@/hooks/useFields';

// ─── Status logic ─────────────────────────────────────────────────────────────
function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const daysPlanted = Math.floor((Date.now() - new Date(field.plantingDate).getTime()) / 86_400_000);
  const daysUpdated = Math.floor((Date.now() - new Date(field.lastUpdate).getTime()) / 86_400_000);
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && daysPlanted > 90) return 'At Risk';
  if (daysUpdated > 14) return 'At Risk';
  return 'Active';
}

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

const STAGE_ORDER: Stage[] = ['Planted', 'Growing', 'Ready', 'Harvested'];

const STAGE_META: Record<Stage, { color: string; bg: string; bar: string }> = {
  Planted:   { color: 'text-sky-700',     bg: 'bg-sky-50 border-sky-200',         bar: 'bg-sky-400'     },
  Growing:   { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',  bar: 'bg-emerald-500' },
  Ready:     { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',      bar: 'bg-amber-400'   },
  Harvested: { color: 'text-neutral-500', bg: 'bg-neutral-100 border-neutral-200', bar: 'bg-neutral-400' },
};

const STATUS_META = {
  Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle,   dot: 'bg-emerald-500' },
  'At Risk': { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: AlertTriangle, dot: 'bg-amber-400'   },
  Completed: { bg: 'bg-neutral-100', text: 'text-neutral-500', icon: Archive,       dot: 'bg-neutral-400' },
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, bg, iconColor, sub,
}: {
  label: string; value: number | string; icon: any; bg: string; iconColor: string; sub?: string;
}) {
  return (
    <div className={cn('p-5 flex flex-col gap-3 relative overflow-hidden', bg)}>
      <div className="flex items-start justify-between">
        <Icon size={20} className={iconColor} />
        <span className="text-3xl font-black text-neutral-900 tabular-nums">{value}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-800">{label}</p>
        {sub && <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Stage progress bar ───────────────────────────────────────────────────────
function StageBar({ stage }: { stage: Stage }) {
  const idx = STAGE_ORDER.indexOf(stage);
  return (
    <div className="flex items-center gap-1">
      {STAGE_ORDER.map((s, i) => (
        <div
          key={s}
          className={cn('h-1.5 flex-1 rounded-full', i <= idx ? STAGE_META[stage].bar : 'bg-neutral-200')}
        />
      ))}
    </div>
  );
}

// ─── Field row for admin table ────────────────────────────────────────────────
function FieldRow({ field }: { field: Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' } }) {
  const stageMeta = STAGE_META[field.stage];
  const statusMeta = STATUS_META[field.computedStatus];
  const StatusIcon = statusMeta.icon;
  const age = daysSince(field.plantingDate);
  const lastUpdated = daysSince(field.lastUpdate);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 px-3 -mx-3 transition-colors group">
      {/* Status dot */}
      <div className={cn('w-2 h-2 rounded-full shrink-0', statusMeta.dot)} />

      {/* Field name + crop */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-neutral-800 truncate">{field.name}</p>
        <p className="text-[11px] text-neutral-400">{field.crop} · {age}d old</p>
      </div>

      {/* Agent */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-[9px] font-bold text-emerald-700">{field.agentName?.charAt(0) ?? 'A'}</span>
        </div>
        <span className="text-[11px] text-neutral-500 truncate max-w-[80px]">{field.agentName ?? 'Unassigned'}</span>
      </div>

      {/* Stage pill */}
      <span className={cn('hidden md:inline-flex text-[10px] font-semibold px-2 py-0.5 border rounded-full shrink-0', stageMeta.bg, stageMeta.color)}>
        {field.stage}
      </span>

      {/* Status pill */}
      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1', statusMeta.bg, statusMeta.text)}>
        <StatusIcon size={10} /> {field.computedStatus}
      </span>

      {/* Last updated */}
      <span className="hidden lg:flex text-[11px] text-neutral-400 shrink-0 items-center gap-1">
        <Clock size={10} />
        {lastUpdated === 0 ? 'Today' : `${lastUpdated}d ago`}
      </span>

      <Link href="/admin/fields" className="text-neutral-300 hover:text-neutral-600 transition-colors shrink-0">
        <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}

// ─── Main admin dashboard ─────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { fields } = useFields();
  const { users, loading: usersLoading } = useAdminUsers();

  // Enrich fields
  const enrichedFields = useMemo(
    () => fields.map((f) => ({ ...f, computedStatus: computeStatus(f) })),
    [fields]
  );

  // Agent users only
  const agentUsers = useMemo(
    () => users.filter((u) => u.prefs?.role === 'agent'),
    [users]
  );

  const stats = useMemo(() => ({
    total:     enrichedFields.length,
    active:    enrichedFields.filter((f) => f.computedStatus === 'Active').length,
    atRisk:    enrichedFields.filter((f) => f.computedStatus === 'At Risk').length,
    completed: enrichedFields.filter((f) => f.computedStatus === 'Completed').length,
    agents:    agentUsers.length,
  }), [enrichedFields, agentUsers]);

  const insights = useMemo(() => {
    const msgs: { icon: any; text: string; color: string }[] = [];
    if (stats.atRisk > 0)
      msgs.push({ icon: Flame, text: `${stats.atRisk} field${stats.atRisk > 1 ? 's' : ''} need immediate attention`, color: 'text-amber-600' });
    const readyFields = enrichedFields.filter((f) => f.stage === 'Ready');
    if (readyFields.length > 0)
      msgs.push({ icon: Zap, text: `${readyFields.map((f) => f.name).join(', ')} ${readyFields.length === 1 ? 'is' : 'are'} ready to harvest`, color: 'text-emerald-600' });
    const staleFields = enrichedFields.filter((f) => daysSince(f.lastUpdate) > 7 && f.stage !== 'Harvested');
    if (staleFields.length > 0)
      msgs.push({ icon: Activity, text: `${staleFields.length} field${staleFields.length > 1 ? 's' : ''} not updated in over a week`, color: 'text-blue-600' });
    const unassigned = enrichedFields.filter((f) => !f.assignedTo);
    if (unassigned.length > 0)
      msgs.push({ icon: Flag, text: `${unassigned.length} field${unassigned.length > 1 ? 's' : ''} unassigned — consider assigning an agent`, color: 'text-rose-600' });
    if (msgs.length === 0)
      msgs.push({ icon: CheckCircle, text: 'All fields are on track — great coordination!', color: 'text-emerald-600' });
    return msgs;
  }, [enrichedFields, stats]);

  const stageCounts = useMemo(() =>
    STAGE_ORDER.map((s) => ({
      stage: s,
      count: enrichedFields.filter((f) => f.stage === s).length,
    })), [enrichedFields]);

  // Per-agent breakdown
  const agentBreakdown = useMemo(() => {
    return agentUsers.map((agent) => {
      const agentFields = enrichedFields.filter((f) => f.assignedTo === agent.$id);
      return {
        ...agent,
        fieldCount: agentFields.length,
        atRisk: agentFields.filter((f) => f.computedStatus === 'At Risk').length,
        active: agentFields.filter((f) => f.computedStatus === 'Active').length,
        completed: agentFields.filter((f) => f.computedStatus === 'Completed').length,
      };
    }).sort((a, b) => b.fieldCount - a.fieldCount);
  }, [agentUsers, enrichedFields]);

  const [fieldFilter, setFieldFilter] = useState<'All' | 'Active' | 'At Risk' | 'Completed'>('All');
  const filteredFields = useMemo(() =>
    fieldFilter === 'All' ? enrichedFields : enrichedFields.filter((f) => f.computedStatus === fieldFilter),
    [enrichedFields, fieldFilter]
  );

  // Recent activity across all fields
  const recentActivity = useMemo(() =>
    enrichedFields
      .flatMap((f) => f.notes.map((n) => ({ ...n, fieldName: f.name })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6),
    [enrichedFields]
  );

  return (
    <div className="space-y-6 pb-12">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">Operations Overview</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/agents"
            className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-700 text-sm font-bold hover:bg-neutral-50 transition-colors"
          >
            <Users size={14} /> Agents
          </Link>
          <Link
            href="/admin/fields"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
          >
            <Map size={14} /> All Fields
          </Link>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total Fields"  value={stats.total}     icon={Map}           bg="bg-white border border-neutral-200"       iconColor="text-neutral-600"  sub="across all agents" />
        <StatCard label="Active"        value={stats.active}    icon={Activity}      bg="bg-emerald-50 border border-emerald-200"  iconColor="text-emerald-600"  sub="on schedule" />
        <StatCard label="At Risk"       value={stats.atRisk}    icon={AlertTriangle} bg="bg-amber-50 border border-amber-200"      iconColor="text-amber-500"    sub="need attention" />
        <StatCard label="Harvested"     value={stats.completed} icon={CheckCircle}   bg="bg-white border border-neutral-200"       iconColor="text-neutral-400"  sub="completed" />
        <StatCard label="Field Agents"  value={usersLoading ? '…' : stats.agents} icon={Users} bg="bg-white border border-neutral-200" iconColor="text-emerald-500" sub="registered" />
      </div>

      {/* ── Two-col: insights + stage breakdown ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Insights + recent activity */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-neutral-500" />
            <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Insights</h2>
          </div>
          <div className="space-y-2">
            {insights.map((ins, i) => {
              const InsIcon = ins.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 border border-neutral-100">
                  <InsIcon size={14} className={cn('mt-0.5 shrink-0', ins.color)} />
                  <p className="text-sm text-neutral-700">{ins.text}</p>
                </div>
              );
            })}
          </div>

          {/* Recent activity */}
          <div className="mt-5">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Recent Activity (All Agents)</p>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-neutral-400 py-2">No activity yet.</p>
            ) : recentActivity.map((n) => (
              <div key={n.id} className="flex items-start gap-3 py-2.5 border-b border-neutral-100 last:border-0">
                <CircleDot size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-neutral-700 line-clamp-1">{n.text}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {n.fieldName} · {daysSince(n.date) === 0 ? 'today' : `${daysSince(n.date)}d ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage breakdown + agent list */}
        <div className="space-y-4">

          {/* Stage breakdown */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={15} className="text-neutral-500" />
              <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Stage Breakdown</h2>
            </div>
            <div className="space-y-3">
              {stageCounts.map(({ stage, count }) => {
                const meta = STAGE_META[stage];
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full shrink-0', meta.bar)} />
                        <span className="text-[13px] font-medium text-neutral-700">{stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-neutral-900 tabular-nums">{count}</span>
                        <span className="text-[11px] text-neutral-400 w-7 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-700', meta.bar)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent performance */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-neutral-500" />
                <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Agent Load</h2>
              </div>
              <Link href="/admin/agents" className="text-[11px] text-emerald-600 font-semibold hover:underline">View all</Link>
            </div>
            {usersLoading ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-neutral-400">Loading agents…</span>
              </div>
            ) : agentBreakdown.length === 0 ? (
              <p className="text-sm text-neutral-400">No agents registered yet.</p>
            ) : agentBreakdown.map((agent) => (
              <div key={agent.$id} className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-black text-emerald-700">{agent.name?.charAt(0) ?? 'A'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-neutral-800 truncate">{agent.name}</p>
                  <p className="text-[11px] text-neutral-400">{agent.fieldCount} field{agent.fieldCount !== 1 ? 's' : ''}</p>
                </div>
                {agent.atRisk > 0 && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                    {agent.atRisk} at risk
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── All fields table ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">All Fields</h2>
          <div className="flex items-center gap-1.5">
            {(['All', 'Active', 'At Risk', 'Completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFieldFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-bold transition-colors',
                  fieldFilter === f
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-4">
          {filteredFields.length === 0 ? (
            <div className="py-10 text-center">
              <Sprout size={32} className="text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-400 text-sm">No fields found</p>
            </div>
          ) : (
            filteredFields.map((field) => (
              <FieldRow key={field.id} field={field} />
            ))
          )}
        </div>

        {filteredFields.length > 0 && (
          <div className="mt-2 text-right">
            <Link href="/admin/fields" className="text-[12px] text-emerald-600 font-semibold hover:underline">
              Manage all fields →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}