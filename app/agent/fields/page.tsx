'use client';

import { useFields } from '@/hooks/useFields';
import { useMemo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Sprout, AlertTriangle, CheckCircle, Activity,
  ChevronRight, Clock, Search, SlidersHorizontal,
  TrendingUp, Layers, CalendarDays, ArrowUpRight,
  Archive, Flag, Wheat, Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stage, Field } from '@/hooks/useFields';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, Filler, Title
);

// ─── helpers ─────────────────────────────────────────────────────────────────
const STAGE_ORDER: Stage[] = ['Planted', 'Growing', 'Ready', 'Harvested'];

function daysSince(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
}

function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const daysPlanted = daysSince(field.plantingDate);
  const daysUpdated = daysSince(field.lastUpdate);
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && daysPlanted > 90) return 'At Risk';
  if (daysUpdated > 14) return 'At Risk';
  return 'Active';
}

const STAGE_META: Record<Stage, { bar: string; hex: string; label: string; bg: string; text: string }> = {
  Planted:   { bar: 'bg-sky-400',     hex: '#38bdf8', label: 'Planted',   bg: 'bg-sky-50',      text: 'text-sky-700'     },
  Growing:   { bar: 'bg-emerald-500', hex: '#10b981', label: 'Growing',   bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  Ready:     { bar: 'bg-amber-400',   hex: '#fbbf24', label: 'Ready',     bg: 'bg-amber-50',    text: 'text-amber-700'   },
  Harvested: { bar: 'bg-neutral-400', hex: '#a3a3a3', label: 'Harvested', bg: 'bg-neutral-100', text: 'text-neutral-500' },
};

const STATUS_META = {
  Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: Activity    },
  'At Risk': { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400',   icon: AlertTriangle },
  Completed: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', icon: Archive     },
};

// ─── Chart.js default overrides ───────────────────────────────────────────────
const chartDefaults = {
  font: { family: "'DM Sans', sans-serif" },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#fafafa',
      bodyColor: '#a1a1aa',
      padding: 10,
      cornerRadius: 4,
    },
  },
};

// ─── Compact field row ────────────────────────────────────────────────────────
function FieldRow({ field, status }: { field: Field; status: 'Active' | 'At Risk' | 'Completed' }) {
  const sm = STATUS_META[status];
  const stm = STAGE_META[field.stage];
  const StatusIcon = sm.icon;

  return (
    <Link
      href={`/agent/fields/${field.id}`}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0 group"
    >
      {/* Status stripe */}
      <div className={cn('w-1 h-8 rounded-full shrink-0', sm.dot)} />

      {/* Name + crop */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-900 truncate group-hover:text-emerald-700 transition-colors">
          {field.name}
        </p>
        <p className="text-[11px] text-neutral-400 mt-0.5">{field.crop} · {daysSince(field.plantingDate)}d old</p>
      </div>

      {/* Stage pill */}
      <span className={cn('hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0', stm.bg, stm.text)}>
        {field.stage}
      </span>

      {/* Status pill */}
      <span className={cn('hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0', sm.bg, sm.text)}>
        <StatusIcon size={10} /> {status}
      </span>

      {/* Last update */}
      <span className="hidden lg:flex items-center gap-1 text-[11px] text-neutral-400 shrink-0">
        <Clock size={10} />
        {daysSince(field.lastUpdate) === 0 ? 'Today' : `${daysSince(field.lastUpdate)}d ago`}
      </span>

      <ChevronRight size={14} className="text-neutral-300 group-hover:text-emerald-500 transition-colors shrink-0" />
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FieldsPage() {
  const { fields } = useFields();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'At Risk' | 'Completed'>('All');

  const enriched = useMemo(
    () => fields.map((f) => ({ ...f, computedStatus: computeStatus(f) })),
    [fields]
  );

  const stats = useMemo(() => ({
    total:     enriched.length,
    active:    enriched.filter((f) => f.computedStatus === 'Active').length,
    atRisk:    enriched.filter((f) => f.computedStatus === 'At Risk').length,
    completed: enriched.filter((f) => f.computedStatus === 'Completed').length,
  }), [enriched]);

  // filtered list
  const filtered = useMemo(() => enriched.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.crop.toLowerCase().includes(search.toLowerCase());
    const matchStage  = stageFilter  === 'All' || f.stage === stageFilter;
    const matchStatus = statusFilter === 'All' || f.computedStatus === statusFilter;
    return matchSearch && matchStage && matchStatus;
  }), [enriched, search, stageFilter, statusFilter]);

  // ── Chart data ──────────────────────────────────────────────────────────────

  // Doughnut — status breakdown
  const doughnutData = {
    labels: ['Active', 'At Risk', 'Completed'],
    datasets: [{
      data: [stats.active, stats.atRisk, stats.completed],
      backgroundColor: ['#10b981', '#fbbf24', '#a3a3a3'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  // Bar — fields per stage
  const barData = {
    labels: STAGE_ORDER,
    datasets: [{
      label: 'Fields',
      data: STAGE_ORDER.map((s) => enriched.filter((f) => f.stage === s).length),
      backgroundColor: STAGE_ORDER.map((s) => STAGE_META[s].hex),
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  // Line — notes activity over last 14 days
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });
  const notesByDay = last14.map((day) =>
    enriched.flatMap((f) => f.notes).filter((n) => n.date.startsWith(day)).length
  );
  const lineData = {
    labels: last14.map((d) => {
      const dt = new Date(d);
      return dt.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
    }),
    datasets: [{
      label: 'Notes',
      data: notesByDay,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10b981',
      pointRadius: 3,
      pointHoverRadius: 5,
    }],
  };

  // Crop distribution horizontal bar
  const cropMap: Record<string, number> = {};
  enriched.forEach((f) => { cropMap[f.crop] = (cropMap[f.crop] ?? 0) + 1; });
  const cropEntries = Object.entries(cropMap).sort((a, b) => b[1] - a[1]);
  const cropBarData = {
    labels: cropEntries.map(([c]) => c),
    datasets: [{
      label: 'Fields',
      data: cropEntries.map(([, n]) => n),
      backgroundColor: '#6ee7b7',
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  return (
    <div className="space-y-6 pb-12">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Fields Overview</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">All Fields</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {stats.total} fields tracked · {stats.atRisk} need attention
          </p>
        </div>
        <Link
          href="/agent/dashboard"
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-emerald-700 transition-colors mt-1"
        >
          <ArrowUpRight size={14} /> Dashboard
        </Link>
      </div>

      {/* ── KPI strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total,     icon: Layers,        bg: 'bg-white border border-neutral-200',      ic: 'text-neutral-600' },
          { label: 'Active', value: stats.active,   icon: Activity,      bg: 'bg-emerald-50 border border-emerald-200', ic: 'text-emerald-600' },
          { label: 'At Risk', value: stats.atRisk,  icon: AlertTriangle, bg: 'bg-amber-50 border border-amber-200',     ic: 'text-amber-500'   },
          { label: 'Done', value: stats.completed,  icon: CheckCircle,   bg: 'bg-white border border-neutral-200',      ic: 'text-neutral-400' },
        ].map(({ label, value, icon: Icon, bg, ic }) => (
          <div key={label} className={cn('p-5 flex items-center justify-between', bg)}>
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">{label}</p>
              <p className="text-3xl font-black text-neutral-900 tabular-nums mt-1">{value}</p>
            </div>
            <Icon size={24} className={cn(ic, 'opacity-40')} />
          </div>
        ))}
      </div>

      {/* ── Charts row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Doughnut — status */}
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Status Mix</p>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 shrink-0">
              <Doughnut
                data={doughnutData}
                options={{
                  ...chartDefaults,
                  cutout: '70%',
                  plugins: { ...chartDefaults.plugins, legend: { display: false } },
                }}
              />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Active',    color: 'bg-emerald-500', value: stats.active    },
                { label: 'At Risk',   color: 'bg-amber-400',   value: stats.atRisk    },
                { label: 'Completed', color: 'bg-neutral-400', value: stats.completed },
              ].map(({ label, color, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', color)} />
                  <span className="text-[12px] text-neutral-600">{label}</span>
                  <span className="text-[12px] font-bold text-neutral-900 ml-auto pl-3">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar — stage distribution */}
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">By Stage</p>
          <div className="h-28">
            <Bar
              data={barData}
              options={{
                ...chartDefaults,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
                  y: { grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3', stepSize: 1 }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Line — note activity */}
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Note Activity (14d)</p>
          <div className="h-28">
            <Line
              data={lineData}
              options={{
                ...chartDefaults,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#a3a3a3', maxTicksLimit: 5 } },
                  y: { grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3', stepSize: 1 }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Horizontal bar — crop distribution */}
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Crop Split</p>
          <div className="h-28">
            <Bar
              data={cropBarData}
              options={{
                ...chartDefaults,
                indexAxis: 'y' as const,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { grid: { color: '#f5f5f5' }, ticks: { font: { size: 9 }, color: '#a3a3a3', stepSize: 1 }, beginAtZero: true },
                  y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#525252' } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Search + filter bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or crop…"
            className="w-full pl-9 pr-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stage filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {(['All', ...STAGE_ORDER] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s as Stage | 'All')}
              className={cn(
                'px-3 py-2 text-[11px] font-bold transition-colors border',
                stageFilter === s
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {(['All', 'Active', 'At Risk', 'Completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 text-[11px] font-bold transition-colors border',
                statusFilter === s
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Fields table ───────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-neutral-100 bg-neutral-50">
          <div className="w-1 shrink-0" />
          <p className="flex-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Field / Crop</p>
          <p className="hidden sm:block text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-24">Stage</p>
          <p className="hidden md:block text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-24">Status</p>
          <p className="hidden lg:block text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-24">Last Update</p>
          <div className="w-4 shrink-0" />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Sprout size={32} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No fields match your filters</p>
            <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filtered.map((f) => (
            <FieldRow key={f.id} field={f} status={f.computedStatus} />
          ))
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
            <p className="text-[11px] text-neutral-400">
              Showing <span className="font-bold text-neutral-700">{filtered.length}</span> of <span className="font-bold text-neutral-700">{enriched.length}</span> fields
            </p>
          </div>
        )}
      </div>
    </div>
  );
}