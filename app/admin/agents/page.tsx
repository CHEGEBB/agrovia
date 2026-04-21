// app/admin/agents/page.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Activity,
  Map,
  Clock,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronRight,
  Archive,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFields } from '@/hooks/useFields';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import type { Field } from '@/hooks/useFields';
import type { AppwriteUserRecord } from '@/hooks/useAdminUsers';

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

const STATUS_META = {
  Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: CheckCircle  },
  'At Risk': { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400',   icon: AlertTriangle },
  Completed: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', icon: Archive       },
};

// ─── Agent card ───────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  agentFields,
}: {
  agent: AppwriteUserRecord;
  agentFields: (Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' })[];
}) {
  const [expanded, setExpanded] = useState(false);

  const active    = agentFields.filter((f) => f.computedStatus === 'Active').length;
  const atRisk    = agentFields.filter((f) => f.computedStatus === 'At Risk').length;
  const completed = agentFields.filter((f) => f.computedStatus === 'Completed').length;

  const memberSince = new Date(agent.$createdAt).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden">
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-sm bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-black text-emerald-700">{agent.name?.charAt(0)?.toUpperCase() ?? 'A'}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-neutral-900 text-[15px]">{agent.name}</h3>
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                agent.status ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
              )}>
                {agent.status ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">{agent.email}</p>
            <p className="text-[11px] text-neutral-300 mt-0.5">Member since {memberSince}</p>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0 rounded"
          >
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-neutral-50 p-2.5 text-center rounded-sm">
            <p className="text-xl font-black text-neutral-900">{agentFields.length}</p>
            <p className="text-[10px] text-neutral-400 font-medium">Total</p>
          </div>
          <div className="bg-emerald-50 p-2.5 text-center rounded-sm">
            <p className="text-xl font-black text-emerald-700">{active}</p>
            <p className="text-[10px] text-emerald-500 font-medium">Active</p>
          </div>
          <div className="bg-amber-50 p-2.5 text-center rounded-sm">
            <p className="text-xl font-black text-amber-700">{atRisk}</p>
            <p className="text-[10px] text-amber-500 font-medium">At Risk</p>
          </div>
          <div className="bg-neutral-50 p-2.5 text-center rounded-sm">
            <p className="text-xl font-black text-neutral-500">{completed}</p>
            <p className="text-[10px] text-neutral-400 font-medium">Done</p>
          </div>
        </div>
      </div>

      {/* Expanded field list */}
      {expanded && (
        <div className="border-t border-neutral-100 px-5 pb-4">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest py-3">Assigned Fields</p>
          {agentFields.length === 0 ? (
            <p className="text-sm text-neutral-400 pb-2">No fields assigned.</p>
          ) : (
            <div className="space-y-2">
              {agentFields.map((f) => {
                const meta = STATUS_META[f.computedStatus];
                const StatusIcon = meta.icon;
                return (
                  <div key={f.id} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                    <div className={cn('w-1.5 h-full min-h-[8px] rounded-full shrink-0', meta.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-800 truncate">{f.name}</p>
                      <p className="text-[11px] text-neutral-400">{f.crop} · {f.stage}</p>
                    </div>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0', meta.bg, meta.text)}>
                      <StatusIcon size={9} /> {f.computedStatus}
                    </span>
                    <span className="text-[11px] text-neutral-300 flex items-center gap-1 shrink-0">
                      <Clock size={9} />
                      {daysSince(f.lastUpdate) === 0 ? 'Today' : `${daysSince(f.lastUpdate)}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main agents page ─────────────────────────────────────────────────────────
export default function AdminAgentsPage() {
  const { fields } = useFields();
  const { users, loading, error, refresh } = useAdminUsers();

  const [search, setSearch] = useState('');

  const enrichedFields = useMemo(
    () => fields.map((f) => ({ ...f, computedStatus: computeStatus(f) })),
    [fields]
  );

  const agentUsers = useMemo(
    () => users.filter((u) => u.prefs?.role === 'agent'),
    [users]
  );

  const adminUsers = useMemo(
    () => users.filter((u) => u.prefs?.role === 'admin'),
    [users]
  );

  const filteredAgents = useMemo(() =>
    agentUsers.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ),
    [agentUsers, search]
  );

  // Unassigned fields
  const unassignedFields = useMemo(
    () => enrichedFields.filter((f) => !f.assignedTo),
    [enrichedFields]
  );

  return (
    <div className="space-y-6 pb-12">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Admin · Agents</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">Field Agents</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage agents and view their field assignments</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-700 text-sm font-bold hover:bg-neutral-50 transition-colors shrink-0"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Users',       value: users.length,           icon: Users,     bg: 'bg-white border border-neutral-200',       ic: 'text-neutral-600' },
          { label: 'Field Agents',      value: agentUsers.length,      icon: UserCheck, bg: 'bg-emerald-50 border border-emerald-200',  ic: 'text-emerald-600' },
          { label: 'Admins',            value: adminUsers.length,      icon: Shield,    bg: 'bg-white border border-neutral-200',       ic: 'text-neutral-500' },
          { label: 'Unassigned Fields', value: unassignedFields.length, icon: Map,      bg: 'bg-amber-50 border border-amber-200',      ic: 'text-amber-500'   },
        ].map(({ label, value, icon: Icon, bg, ic }) => (
          <div key={label} className={cn('p-5 flex flex-col gap-3', bg)}>
            <div className="flex items-start justify-between">
              <Icon size={18} className={ic} />
              <span className="text-3xl font-black text-neutral-900 tabular-nums">
                {loading ? '…' : value}
              </span>
            </div>
            <p className="text-sm font-bold text-neutral-800">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Search ────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search agents by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-white"
        />
      </div>

      {/* ── Error state ───────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">Failed to load users</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-neutral-400">Loading agents from Appwrite…</span>
        </div>
      )}

      {/* ── Agent cards ───────────────────────────────────────────────── */}
      {!loading && !error && (
        <>
          {filteredAgents.length === 0 ? (
            <div className="bg-white border border-dashed border-neutral-300 p-12 text-center">
              <UserX size={36} className="text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">
                {search ? 'No agents match your search' : 'No field agents registered yet'}
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Agents need to register with role &quot;agent&quot; to appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAgents.map((agent) => {
                const agentFields = enrichedFields.filter((f) => f.assignedTo === agent.$id);
                return (
                  <AgentCard key={agent.$id} agent={agent} agentFields={agentFields} />
                );
              })}
            </div>
          )}

          {/* Unassigned fields */}
          {unassignedFields.length > 0 && (
            <div className="bg-white border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-amber-500" />
                <h2 className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                  Unassigned Fields ({unassignedFields.length})
                </h2>
              </div>
              <div className="space-y-2">
                {unassignedFields.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
                    <Map size={13} className="text-neutral-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-800">{f.name}</p>
                      <p className="text-[11px] text-neutral-400">{f.crop} · {f.stage}</p>
                    </div>
                    <span className="text-[11px] text-amber-600 font-semibold">Needs assignment</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-400 mt-3">
                Go to <a href="/admin/fields" className="text-emerald-600 font-semibold hover:underline">Fields</a> to assign these fields to agents.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}