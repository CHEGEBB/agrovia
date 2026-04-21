/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useFields } from '@/hooks/useFields';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, AlertTriangle, CheckCircle, Activity,
  Clock, Sprout, Edit, MessageSquare, Trash2, Flag,
  CalendarDays, TrendingUp, X, Archive, ChevronRight,
  CircleDot, Layers, Leaf, BarChart2, ThermometerSun,
  Hash, Star, Target,
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
  RadialLinearScale,
} from 'chart.js';
import { Line, Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, Filler,
  RadialLinearScale
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STAGE_ORDER: Stage[] = ['Planted', 'Growing', 'Ready', 'Harvested'];

function daysSince(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
}
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const dp = daysSince(field.plantingDate);
  const du = daysSince(field.lastUpdate);
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && dp > 90) return 'At Risk';
  if (du > 14) return 'At Risk';
  return 'Active';
}

const STAGE_META: Record<Stage, { bar: string; hex: string; bg: string; text: string; border: string }> = {
  Planted:   { bar: 'bg-sky-400',     hex: '#38bdf8', bg: 'bg-sky-50',      text: 'text-sky-700',     border: 'border-sky-200'     },
  Growing:   { bar: 'bg-emerald-500', hex: '#10b981', bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  Ready:     { bar: 'bg-amber-400',   hex: '#fbbf24', bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200'   },
  Harvested: { bar: 'bg-neutral-400', hex: '#a3a3a3', bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200' },
};

const STATUS_META = {
  Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: Activity      },
  'At Risk': { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400',   icon: AlertTriangle },
  Completed: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', icon: Archive       },
};

// ─── Health score (0–100) ─────────────────────────────────────────────────────
function computeHealthScore(field: Field): number {
  let score = 80;
  const du = daysSince(field.lastUpdate);
  const dp = daysSince(field.plantingDate);
  if (du > 14) score -= 20;
  else if (du > 7) score -= 10;
  if (field.stage === 'Growing' && dp > 90) score -= 25;
  if (field.stage === 'Ready') score -= 15; // needs harvesting
  if (field.notes.length > 3) score += 10;
  if (field.notes.length > 6) score += 5;
  return Math.max(0, Math.min(100, score));
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="font-bold text-neutral-900 text-[15px]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 text-neutral-400 rounded transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Stage stepper ────────────────────────────────────────────────────────────
function StageStepper({ current }: { current: Stage }) {
  const idx = STAGE_ORDER.indexOf(current);
  const meta = STAGE_META[current];
  return (
    <div className="flex items-center gap-0">
      {STAGE_ORDER.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        const sm = STAGE_META[s];
        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all',
                done   ? 'bg-neutral-200 text-neutral-500' :
                active ? cn(sm.bar, 'text-white ring-4 ring-offset-2', active && s === 'Planted' ? 'ring-sky-100' : active && s === 'Growing' ? 'ring-emerald-100' : active && s === 'Ready' ? 'ring-amber-100' : 'ring-neutral-100') :
                         'bg-neutral-100 text-neutral-300'
              )}>
                {done ? '✓' : i + 1}
              </div>
              <span className={cn(
                'text-[10px] font-bold',
                done ? 'text-neutral-400' : active ? sm.text : 'text-neutral-300'
              )}>
                {s}
              </span>
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <div className={cn('h-0.5 flex-1 mb-5', i < idx ? 'bg-neutral-300' : 'bg-neutral-100')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Health ring ─────────────────────────────────────────────────────────────
function HealthRing({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#fbbf24' : '#ef4444';
  const data = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [color, '#f5f5f5'],
      borderWidth: 0,
      hoverOffset: 0,
    }],
  };
  return (
    <div className="relative w-20 h-20">
      <Doughnut
        data={data}
        options={{
          cutout: '72%',
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          animation: { duration: 800 },
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black" style={{ color }}>{score}</span>
        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wide">health</span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fields, updateFieldStage, addNote, deleteField } = useFields();

  const field = fields.find((f) => f.id === params.id);

  const [editModal, setEditModal]     = useState(false);
  const [noteModal, setNoteModal]     = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newStage, setNewStage]       = useState<Stage>('Planted');
  const [noteText, setNoteText]       = useState('');
  const [activeTab, setActiveTab]     = useState<'overview' | 'notes' | 'analytics'>('overview');

  const status = field ? computeStatus(field) : 'Active';
  const statusMeta = STATUS_META[status];
  const StatusIcon = statusMeta.icon;
  const health = field ? computeHealthScore(field) : 0;

  // ── Chart data ──────────────────────────────────────────────────────────────

  // Notes over time — last 30 days
  const last30 = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  }), []);

  const noteActivityData = useMemo(() => ({
    labels: last30.map((d, i) =>
      i % 7 === 0 ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : ''
    ),
    datasets: [{
      label: 'Notes logged',
      data: last30.map((day) =>
        (field?.notes ?? []).filter((n) => n.date.startsWith(day)).length
      ),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.07)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10b981',
      pointRadius: (ctx: any) => ctx.raw > 0 ? 4 : 2,
      pointHoverRadius: 6,
    }],
  }), [field, last30]);

  // Radar — field health dimensions
  const radarData = useMemo(() => {
    if (!field) return null;
    const du = daysSince(field.lastUpdate);
    const dp = daysSince(field.plantingDate);
    const noteFreq = Math.min(100, (field.notes.length / 10) * 100);
    const recency  = Math.max(0, 100 - du * 5);
    const stageAdv = (STAGE_ORDER.indexOf(field.stage) / 3) * 100;
    const ageOk    = field.stage === 'Harvested' ? 100 : Math.max(0, 100 - Math.max(0, dp - 60) * 1.5);
    return {
      labels: ['Updates', 'Note Frequency', 'Stage Progress', 'Age Suitability', 'Health Score'],
      datasets: [{
        label: field.name,
        data: [recency, noteFreq, stageAdv, ageOk, health],
        backgroundColor: 'rgba(16,185,129,0.12)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
        borderWidth: 2,
      }],
    };
  }, [field, health]);

  if (!field) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Sprout size={40} className="text-neutral-300" />
        <p className="text-neutral-500 font-medium">Field not found</p>
        <Link href="/agent/fields" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to fields
        </Link>
      </div>
    );
  }

  const stageMeta = STAGE_META[field.stage];
  const age = daysSince(field.plantingDate);
  const lu  = daysSince(field.lastUpdate);

  const handleUpdateStage = () => {
    updateFieldStage(field.id, newStage);
    setEditModal(false);
  };
  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(field.id, noteText);
    setNoteModal(false);
    setNoteText('');
  };
  const handleDelete = () => {
    deleteField(field.id);
    router.push('/agent/fields');
  };
  const handleFlag = () => addNote(field.id, '⚑ Flagged for supervisor review');

  return (
    <div className="space-y-6 pb-12">

      {/* ── Breadcrumb + back ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-neutral-400 pt-1">
        <Link href="/agent/dashboard" className="hover:text-neutral-700 transition-colors">Dashboard</Link>
        <ChevronRight size={13} />
        <Link href="/agent/fields" className="hover:text-neutral-700 transition-colors">Fields</Link>
        <ChevronRight size={13} />
        <span className="text-neutral-700 font-medium">{field.name}</span>
      </div>

      {/* ── Hero header ────────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        {/* Colored top bar showing status */}
        <div className={cn('h-1', statusMeta.dot)} />

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Status + stage badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={cn('flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full', statusMeta.bg, statusMeta.text)}>
                  <StatusIcon size={11} /> {status}
                </span>
                <span className={cn('text-[12px] font-semibold px-2.5 py-1 border rounded-full', stageMeta.bg, stageMeta.text, stageMeta.border)}>
                  {field.stage}
                </span>
                {lu > 14 && (
                  <span className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                    <Clock size={10} /> Stale
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{field.name}</h1>
              <p className="text-neutral-500 mt-1">{field.crop} · planted {age} days ago</p>
            </div>

            {/* Health ring */}
            <HealthRing score={health} />
          </div>

          {/* Stage stepper */}
          <div className="mt-6">
            <StageStepper current={field.stage} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-neutral-100">
            <button
              onClick={() => { setEditModal(true); setNewStage(field.stage); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              <Edit size={14} /> Update Stage
            </button>
            <button
              onClick={() => { setNoteModal(true); setNoteText(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              <MessageSquare size={14} /> Add Note
            </button>
            <button
              onClick={handleFlag}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
            >
              <Flag size={14} /> Flag Field
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-500 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors ml-auto"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex border-b border-neutral-200 gap-0">
        {(['overview', 'notes', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview tab ───────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Crop',        value: field.crop,                       icon: Leaf          },
              { label: 'Days in Ground', value: `${age}d`,                     icon: CalendarDays  },
              { label: 'Last Updated', value: lu === 0 ? 'Today' : `${lu}d ago`, icon: Clock        },
              { label: 'Total Notes', value: `${field.notes.length}`,          icon: MessageSquare },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-neutral-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} className="text-neutral-400" />
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{label}</p>
                </div>
                <p className="text-xl font-black text-neutral-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Note activity chart */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-neutral-400" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Note Activity — Last 30 Days</p>
            </div>
            <div className="h-40">
              <Line
                data={noteActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
                  scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#a3a3a3' } },
                    y: { grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3', stepSize: 1 }, beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          {/* Latest notes preview */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-neutral-400" />
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Recent Notes</p>
              </div>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-[11px] text-emerald-600 hover:underline font-medium"
              >
                View all →
              </button>
            </div>
            {field.notes.length === 0 ? (
              <p className="text-sm text-neutral-400">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {field.notes.slice(-3).reverse().map((note, i) => (
                  <div key={note.id} className="flex gap-3">
                    <CircleDot size={13} className={cn('mt-0.5 shrink-0', i === 0 ? 'text-emerald-400' : 'text-neutral-300')} />
                    <div>
                      <p className="text-sm text-neutral-700">{note.text}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {new Date(note.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Notes tab ──────────────────────────────────────────────────── */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-neutral-700">{field.notes.length} notes logged</p>
            <button
              onClick={() => { setNoteModal(true); setNoteText(''); }}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare size={12} /> Add Note
            </button>
          </div>

          {field.notes.length === 0 ? (
            <div className="bg-white border border-dashed border-neutral-300 p-16 text-center">
              <MessageSquare size={32} className="text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No notes yet</p>
              <p className="text-sm text-neutral-400 mt-1">Start logging field observations</p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 divide-y divide-neutral-100">
              {field.notes.slice().reverse().map((note, i) => {
                const isLatest = i === 0;
                return (
                  <div key={note.id} className={cn('flex gap-4 p-5', isLatest && 'bg-emerald-50/40')}>
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center pt-1">
                      <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', isLatest ? stageMeta.bar : 'bg-neutral-200')} />
                      {i < field.notes.length - 1 && (
                        <div className="w-px flex-1 bg-neutral-100 mt-2" style={{ minHeight: 24 }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[11px] text-neutral-400 font-medium">
                          {new Date(note.date).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                          {isLatest && (
                            <span className="ml-2 text-emerald-600 font-bold">· Latest</span>
                          )}
                        </p>
                        <span className="text-[10px] text-neutral-400 shrink-0">
                          {daysSince(note.date) === 0 ? 'Today' : `${daysSince(note.date)}d ago`}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-800 leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Analytics tab ──────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">

          {/* Health score breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Radar chart */}
            <div className="bg-white border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-neutral-400" />
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Field Health Dimensions</p>
              </div>
              <div className="h-56 flex items-center justify-center">
                {radarData && (
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
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
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: { display: false, stepSize: 25 },
                          grid: { color: '#f5f5f5' },
                          pointLabels: { font: { size: 11, weight: 'bold' }, color: '#737373' },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Health score + breakdown metrics */}
            <div className="bg-white border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ThermometerSun size={14} className="text-neutral-400" />
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Health Breakdown</p>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <HealthRing score={health} />
                <div>
                  <p className="text-sm font-bold text-neutral-700">
                    {health >= 70 ? 'Good condition' : health >= 40 ? 'Needs attention' : 'Critical — act now'}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">Based on activity & growth metrics</p>
                </div>
              </div>

              {[
                {
                  label: 'Update Recency',
                  value: Math.max(0, 100 - daysSince(field.lastUpdate) * 5),
                  good: daysSince(field.lastUpdate) <= 7,
                  note: daysSince(field.lastUpdate) === 0 ? 'Updated today' : `${daysSince(field.lastUpdate)}d since last update`,
                },
                {
                  label: 'Note Frequency',
                  value: Math.min(100, (field.notes.length / 10) * 100),
                  good: field.notes.length >= 3,
                  note: `${field.notes.length} notes logged`,
                },
                {
                  label: 'Stage Progress',
                  value: (STAGE_ORDER.indexOf(field.stage) / 3) * 100,
                  good: field.stage !== 'Planted',
                  note: `${field.stage} — stage ${STAGE_ORDER.indexOf(field.stage) + 1}/4`,
                },
                {
                  label: 'Age Suitability',
                  value: Math.max(0, 100 - Math.max(0, daysSince(field.plantingDate) - 60) * 1.5),
                  good: daysSince(field.plantingDate) <= 90,
                  note: `${daysSince(field.plantingDate)} days in ground`,
                },
              ].map(({ label, value, good, note }) => (
                <div key={label} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-neutral-600">{label}</span>
                    <span className="text-[12px] font-bold text-neutral-800">{Math.round(value)}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', good ? 'bg-emerald-400' : 'bg-amber-400')}
                      style={{ width: `${Math.round(value)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Full 30-day note activity */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-neutral-400" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Note Activity — Last 30 Days</p>
            </div>
            <div className="h-48">
              <Line
                data={noteActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
                  scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#a3a3a3' } },
                    y: { grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#a3a3a3', stepSize: 1 }, beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          {/* Field timeline summary */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Hash size={14} className="text-neutral-400" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Field Timeline</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Planted',      date: field.plantingDate, done: true  },
                { label: 'First Update', date: field.notes[0]?.date ?? field.plantingDate, done: true },
                { label: 'Latest Note',  date: field.notes[field.notes.length - 1]?.date ?? field.plantingDate, done: true },
                { label: 'Last Update',  date: field.lastUpdate,   done: true  },
              ].map(({ label, date, done }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', done ? stageMeta.bar : 'bg-neutral-200')} />
                  <span className="text-[12px] text-neutral-500 w-28">{label}</span>
                  <span className="text-[12px] font-bold text-neutral-800">
                    {new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[11px] text-neutral-400 ml-auto">
                    {daysSince(date) === 0 ? 'Today' : `${daysSince(date)}d ago`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Update Stage Modal ────────────────────────────────────────── */}
      {editModal && (
        <Modal title={`Update Stage — ${field.name}`} onClose={() => setEditModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Current: <span className="font-bold text-neutral-800">{field.stage}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STAGE_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStage(s)}
                  className={cn(
                    'px-3 py-3 text-sm font-medium border transition-all text-left',
                    newStage === s
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full mb-1.5', STAGE_META[s].bar)} />
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleUpdateStage}
              disabled={newStage === field.stage}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              Confirm Update
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add Note Modal ────────────────────────────────────────────── */}
      {noteModal && (
        <Modal title={`Add Note — ${field.name}`} onClose={() => setNoteModal(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">Observation</label>
              <textarea
                placeholder="Describe what you observed in the field..."
                className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors h-32 resize-none"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                autoFocus
              />
            </div>
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              Save Note
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ──────────────────────────────────────── */}
      {deleteModal && (
        <Modal title={`Delete "${field.name}"?`} onClose={() => setDeleteModal(false)}>
          <p className="text-sm text-neutral-600 mb-5">
            This will permanently remove <span className="font-bold">{field.name}</span> and all its notes. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setDeleteModal(false)} className="flex-1 py-2.5 border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors">
              Delete Field
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}