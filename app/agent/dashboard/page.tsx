/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useFields } from '@/hooks/useFields';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Map,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sprout,
  Clock,
  ChevronRight,
  Droplets,
  Sun,
  CloudRain,
  Cloud,
  CloudSnow,
  Wind,
  Plus,
  X,
  Leaf,
  Edit,
  MessageSquare,
  BarChart2,
  Activity,
  ArrowUpRight,
  CircleDot,
  Flame,
  Zap,
  Eye,
  Trash2,
  MapPin,
  CalendarDays,
  ThermometerSun,
  Waves,
  Navigation,
  RefreshCw,
  Star,
  Archive,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stage, Field } from '@/hooks/useFields';

// ─── Status logic ─────────────────────────────────────────────────────────────
// Active    → stage is Planted or Growing and within expected window
// At Risk   → Growing >90 days OR Ready but not harvested OR no update >14 days
// Completed → stage is Harvested
function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const daysSincePlanting = Math.floor(
    (Date.now() - new Date(field.plantingDate).getTime()) / 86_400_000
  );
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(field.lastUpdate).getTime()) / 86_400_000
  );
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && daysSincePlanting > 90) return 'At Risk';
  if (daysSinceUpdate > 14) return 'At Risk';
  return 'Active';
}

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

// ─── Time of day config ───────────────────────────────────────────────────────
function getTimeConfig() {
  const h = new Date().getHours();
  if (h >= 5 && h < 9)
    return {
      label: 'Good morning',
      sub: 'Early riser — the fields await.',
      unsplash: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      overlay: 'from-black/70 via-black/40 to-transparent',
      icon: Sun,
      color: 'text-amber-300',
    };
  if (h >= 9 && h < 12)
    return {
      label: 'Good morning',
      sub: 'Perfect conditions for field checks.',
      unsplash: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80',
      overlay: 'from-black/60 via-black/30 to-transparent',
      icon: Sun,
      color: 'text-yellow-300',
    };
  if (h >= 12 && h < 15)
    return {
      label: 'Good afternoon',
      sub: 'Peak hours — keep your fields on track.',
      unsplash: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80',
      overlay: 'from-black/65 via-black/35 to-transparent',
      icon: Sun,
      color: 'text-orange-300',
    };
  if (h >= 15 && h < 18)
    return {
      label: 'Good afternoon',
      sub: 'Golden hour — great time for observations.',
      unsplash: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      overlay: 'from-black/70 via-black/40 to-transparent',
      icon: Sun,
      color: 'text-orange-400',
    };
  if (h >= 18 && h < 21)
    return {
      label: 'Good evening',
      sub: 'Review today\'s field activity.',
      unsplash: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
      overlay: 'from-black/75 via-black/50 to-transparent',
      icon: CloudRain,
      color: 'text-indigo-300',
    };
  return {
    label: 'Good evening',
    sub: 'Wrap up your reports before tomorrow.',
    unsplash: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1600&q=80',
    overlay: 'from-black/80 via-black/60 to-transparent',
    icon: CloudRain,
    color: 'text-blue-300',
  };
}

// ─── Weather fetch (Open-Meteo, free, no key) ─────────────────────────────────
interface WeatherData {
  temp: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
}

function getWeatherDesc(code: number): { label: string; Icon: any } {
  if (code === 0) return { label: 'Clear sky', Icon: Sun };
  if (code <= 3) return { label: 'Partly cloudy', Icon: Cloud };
  if (code <= 48) return { label: 'Foggy', Icon: Cloud };
  if (code <= 67) return { label: 'Rainy', Icon: CloudRain };
  if (code <= 77) return { label: 'Snowy', Icon: CloudSnow };
  if (code <= 82) return { label: 'Showers', Icon: CloudRain };
  return { label: 'Thunderstorm', Icon: Waves };
}

// ─── Stage config ─────────────────────────────────────────────────────────────
const STAGE_ORDER: Stage[] = ['Planted', 'Growing', 'Ready', 'Harvested'];

const STAGE_META: Record<Stage, { color: string; bg: string; bar: string; label: string }> = {
  Planted:   { color: 'text-sky-700',     bg: 'bg-sky-50 border-sky-200',     bar: 'bg-sky-400',     label: 'Planted'   },
  Growing:   { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500', label: 'Growing'   },
  Ready:     { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',  bar: 'bg-amber-400',   label: 'Ready'     },
  Harvested: { color: 'text-neutral-500', bg: 'bg-neutral-100 border-neutral-200', bar: 'bg-neutral-400', label: 'Harvested' },
};

// ─── Status config (no border colors — using icons + pill backgrounds) ────────
const STATUS_META = {
  Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle,   dot: 'bg-emerald-500', label: 'Active'    },
  'At Risk': { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: AlertTriangle, dot: 'bg-amber-400',   label: 'At Risk'   },
  Completed: { bg: 'bg-neutral-100', text: 'text-neutral-500', icon: Archive,       dot: 'bg-neutral-400', label: 'Completed' },
};

// ─── Stage progress bar ───────────────────────────────────────────────────────
function StageBar({ stage }: { stage: Stage }) {
  const idx = STAGE_ORDER.indexOf(stage);
  return (
    <div className="flex items-center gap-1">
      {STAGE_ORDER.map((s, i) => (
        <div
          key={s}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-all',
            i <= idx ? STAGE_META[stage].bar : 'bg-neutral-200'
          )}
        />
      ))}
    </div>
  );
}

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

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="font-bold text-neutral-900 text-[15px]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors rounded">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onClose }: {
  title: string; message: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-neutral-600 mb-5">{message}</p>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
          Confirm
        </button>
      </div>
    </Modal>
  );
}

// ─── Field card (status shown via left icon column + pill, not border color) ──
function FieldCard({
  field,
  onEdit,
  onNote,
  onView,
  onDelete,
  onFlag,
}: {
  field: Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' };
  onEdit: () => void;
  onNote: () => void;
  onView: () => void;
  onDelete: () => void;
  onFlag: () => void;
}) {
  const stageMeta = STAGE_META[field.stage];
  const statusMeta = STATUS_META[field.computedStatus];
  const StatusIcon = statusMeta.icon;
  const age = daysSince(field.plantingDate);
  const lastUpdated = daysSince(field.lastUpdate);

  return (
    <div className="bg-white border border-neutral-200 hover:shadow-md transition-all group flex">
      {/* Left status column — replaces border color trick */}
      <div className={cn('w-1.5 shrink-0 rounded-l-sm', statusMeta.dot)} />

      <div className="flex-1 p-4 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <StatusIcon size={13} className={statusMeta.text} />
              <span className={cn('text-[11px] font-bold px-1.5 py-0.5 rounded-full', statusMeta.bg, statusMeta.text)}>
                {statusMeta.label}
              </span>
            </div>
            <h3 className="font-black text-neutral-900 text-[15px] truncate">{field.name}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{field.crop} · planted {age}d ago</p>
          </div>
          {field.assignedTo && (
            <div className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-700">
                {field.agentName?.charAt(0) ?? 'A'}
              </span>
            </div>
          )}
        </div>

        {/* Stage progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className={cn('text-[11px] font-semibold px-2 py-0.5 border rounded-full', stageMeta.bg, stageMeta.color)}>
              {field.stage}
            </span>
            <span className="text-[11px] text-neutral-400">
              Stage {STAGE_ORDER.indexOf(field.stage) + 1}/{STAGE_ORDER.length}
            </span>
          </div>
          <StageBar stage={field.stage} />
        </div>

        {/* Latest note */}
        {field.notes.length > 0 && (
          <div className="bg-neutral-50 border border-neutral-100 px-3 py-2 mb-3 rounded-sm">
            <p className="text-[10px] text-neutral-400 mb-0.5 font-semibold uppercase tracking-wide">Latest note</p>
            <p className="text-xs text-neutral-700 line-clamp-2">
              {field.notes[field.notes.length - 1].text}
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Clock size={10} />
            {lastUpdated === 0 ? 'Updated today' : `Updated ${lastUpdated}d ago`}
          </span>
          <div className="flex items-center gap-0.5">
            <button onClick={onNote}   title="Add note"     className="p-1.5 text-neutral-400 hover:text-blue-600   hover:bg-blue-50   transition-colors rounded"><MessageSquare size={13} /></button>
            <button onClick={onEdit}   title="Update stage" className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded"><Edit           size={13} /></button>
            <button onClick={onFlag}   title="Flag field"   className="p-1.5 text-neutral-400 hover:text-amber-600  hover:bg-amber-50  transition-colors rounded"><Flag           size={13} /></button>
            <button onClick={onView}   title="View details" className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors rounded"><Eye            size={13} /></button>
            <button onClick={onDelete} title="Delete field" className="p-1.5 text-neutral-400 hover:text-red-500   hover:bg-red-50    transition-colors rounded"><Trash2         size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Field detail panel (slide-over) ─────────────────────────────────────────
function FieldDetailPanel({ field, onClose }: {
  field: Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' };
  onClose: () => void;
}) {
  const statusMeta = STATUS_META[field.computedStatus];
  const stageMeta  = STAGE_META[field.stage];
  const StatusIcon = statusMeta.icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-neutral-900">{field.name}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 text-neutral-400 rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status + stage */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full', statusMeta.bg, statusMeta.text)}>
              <StatusIcon size={12} /> {statusMeta.label}
            </span>
            <span className={cn('text-[12px] font-semibold px-2.5 py-1 border rounded-full', stageMeta.bg, stageMeta.color)}>
              {field.stage}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Crop', value: field.crop },
              { label: 'Planted', value: new Date(field.plantingDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Last Update', value: new Date(field.lastUpdate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) },
              { label: 'Days Old', value: `${daysSince(field.plantingDate)} days` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-50 p-3 rounded-sm">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-neutral-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Stage progress */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Progress</p>
            <StageBar stage={field.stage} />
            <div className="flex justify-between mt-1.5">
              {STAGE_ORDER.map((s) => (
                <span key={s} className={cn('text-[10px]', s === field.stage ? stageMeta.color + ' font-bold' : 'text-neutral-300')}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Notes timeline */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              Field Notes ({field.notes.length})
            </p>
            {field.notes.length === 0 ? (
              <p className="text-sm text-neutral-400">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {field.notes.slice().reverse().map((note, i) => (
                  <div key={note.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', i === 0 ? stageMeta.bar : 'bg-neutral-300')} />
                      {i < field.notes.length - 1 && <div className="w-px flex-1 bg-neutral-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-[11px] text-neutral-400 mb-0.5">
                        {new Date(note.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-neutral-700">{note.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AgentDashboardPage() {
  const { user } = useAuth();
  const { fields, updateFieldStage, addNote, addField, deleteField } = useFields();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Fetch weather — Nairobi coords as fallback, tries geolocation first
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          windspeed: Math.round(data.current_weather.windspeed),
          weathercode: data.current_weather.weathercode,
          humidity: data.hourly?.relativehumidity_2m?.[new Date().getHours()] ?? 0,
        });
      } catch {
        // silently fail
      } finally {
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(-1.286389, 36.817223) // Nairobi fallback
      );
    } else {
      fetchWeather(-1.286389, 36.817223);
    }
  }, []);

  const timeConfig = useMemo(() => getTimeConfig(), []);
  const TimeIcon = timeConfig.icon;

  // Enrich fields with computed status
  const enrichedFields = useMemo(
    () => fields.map((f) => ({ ...f, computedStatus: computeStatus(f) })),
    [fields]
  );

  const stats = useMemo(() => ({
    total:     enrichedFields.length,
    active:    enrichedFields.filter((f) => f.computedStatus === 'Active').length,
    atRisk:    enrichedFields.filter((f) => f.computedStatus === 'At Risk').length,
    completed: enrichedFields.filter((f) => f.computedStatus === 'Completed').length,
  }), [enrichedFields]);

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
    if (msgs.length === 0)
      msgs.push({ icon: CheckCircle, text: 'All fields are on track — great work!', color: 'text-emerald-600' });
    return msgs;
  }, [enrichedFields, stats]);

  const stageCounts = useMemo(() =>
    STAGE_ORDER.map((s) => ({
      stage: s,
      count: enrichedFields.filter((f) => f.stage === s).length,
    })), [enrichedFields]);

  // Modal state
  const [addModal, setAddModal]     = useState(false);
  const [editModal, setEditModal]   = useState<Field | null>(null);
  const [noteModal, setNoteModal]   = useState<Field | null>(null);
  const [deleteModal, setDeleteModal] = useState<Field | null>(null);
  const [viewPanel, setViewPanel]   = useState<(Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' }) | null>(null);

  const [newField, setNewField]   = useState({ name: '', crop: '', plantingDate: '', stage: 'Planted' as Stage });
  const [newStage, setNewStage]   = useState<Stage>('Planted');
  const [noteText, setNoteText]   = useState('');

  const [filter, setFilter] = useState<'All' | 'Active' | 'At Risk' | 'Completed'>('All');

  const filteredFields = useMemo(() =>
    filter === 'All' ? enrichedFields : enrichedFields.filter((f) => f.computedStatus === filter),
    [enrichedFields, filter]
  );

  const handleAddField = () => {
    if (!newField.name || !newField.crop || !newField.plantingDate) return;
    addField({ ...newField, assignedTo: user?.$id ?? null });
    setAddModal(false);
    setNewField({ name: '', crop: '', plantingDate: '', stage: 'Planted' });
  };

  const handleUpdateStage = () => {
    if (!editModal) return;
    updateFieldStage(editModal.id, newStage);
    setEditModal(null);
  };

  const handleAddNote = () => {
    if (!noteModal || !noteText.trim()) return;
    addNote(noteModal.id, noteText);
    setNoteModal(null);
    setNoteText('');
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    deleteField(deleteModal.id);
    setDeleteModal(null);
  };

  const handleFlag = (field: Field) => {
    // Flag = add a system note marking it as flagged for review
    addNote(field.id, '⚑ Flagged for supervisor review');
  };

  const weatherInfo = weather ? getWeatherDesc(weather.weathercode) : null;

  return (
    <div className="space-y-6 pb-12">

      {/* ── Hero banner with Unsplash time-based image ────────────────── */}
      <div className="relative -mt-4 -mx-4 md:-mx-6 lg:-mx-8 mb-2">
        <div className="relative h-60 md:h-72 overflow-hidden">
          <img
            src={timeConfig.unsplash}
            alt="Farm field"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className={cn('absolute inset-0 bg-gradient-to-r', timeConfig.overlay)} />
          {/* Fade to page bg at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent" />

          <div className="relative h-full flex items-end px-4 md:px-6 lg:px-8 pb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TimeIcon size={16} className={timeConfig.color} />
                <span className="text-white/70 text-sm font-medium">{timeConfig.label}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {user?.name?.split(' ')[0] ?? 'Agent'}&apos;s Fields
              </h1>
              <p className="text-white/60 text-sm mt-1">{timeConfig.sub}</p>
            </div>

            {/* Weather widget */}
            <div className="shrink-0 bg-black/30 backdrop-blur-md border border-white/15 px-4 py-3 text-white min-w-[130px]">
              {weatherLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-white/50" />
                  <span className="text-xs text-white/50">Loading...</span>
                </div>
              ) : weather && weatherInfo ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <weatherInfo.Icon size={18} className="text-white/80" />
                    <span className="text-2xl font-black">{weather.temp}°C</span>
                  </div>
                  <p className="text-[11px] text-white/60 font-medium">{weatherInfo.label}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-white/50 flex items-center gap-1">
                      <Wind size={9} /> {weather.windspeed} km/h
                    </span>
                    <span className="text-[10px] text-white/50 flex items-center gap-1">
                      <Droplets size={9} /> {weather.humidity}%
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-white/50">Weather unavailable</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Header row ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-neutral-400">
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shrink-0"
        >
          <Plus size={15} /> Add Field
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Fields"  value={stats.total}     icon={Map}           bg="bg-white border border-neutral-200"  iconColor="text-neutral-600"  sub="across all crops" />
        <StatCard label="Active"        value={stats.active}    icon={Activity}      bg="bg-emerald-50 border border-emerald-200" iconColor="text-emerald-600" sub="on schedule" />
        <StatCard label="At Risk"       value={stats.atRisk}    icon={AlertTriangle} bg="bg-amber-50 border border-amber-200"  iconColor="text-amber-500"    sub="need attention" />
        <StatCard label="Harvested"     value={stats.completed} icon={CheckCircle}   bg="bg-white border border-neutral-200"  iconColor="text-neutral-400"  sub="completed" />
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
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Recent Activity</p>
            {enrichedFields
              .flatMap((f) => f.notes.map((n) => ({ ...n, fieldName: f.name, fieldId: f.id })))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((n) => (
                <div key={n.id} className="flex items-start gap-3 py-2.5 border-b border-neutral-100 last:border-0">
                  <CircleDot size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-neutral-700 line-clamp-1">{n.text}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {n.fieldName} · {daysSince(n.date) === 0 ? 'today' : `${daysSince(n.date)}d ago`}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewPanel(enrichedFields.find((f) => f.id === n.fieldId) ?? null)}
                    className="text-neutral-300 hover:text-neutral-600 transition-colors shrink-0"
                  >
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              ))}
            {enrichedFields.every((f) => f.notes.length === 0) && (
              <p className="text-sm text-neutral-400 py-2">No activity yet.</p>
            )}
          </div>
        </div>

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

          {/* Ready to harvest */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Next to Harvest</p>
            {enrichedFields.filter((f) => f.stage === 'Ready').length === 0 ? (
              <p className="text-sm text-neutral-400">No fields ready yet.</p>
            ) : (
              enrichedFields.filter((f) => f.stage === 'Ready').map((f) => (
                <div key={f.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <Sprout size={12} className="text-amber-500" />
                    <span className="text-[13px] text-neutral-700">{f.name}</span>
                  </div>
                  <span className="text-[11px] text-amber-600 font-bold">Harvest now</span>
                </div>
              ))
            )}
          </div>

          {/* Status legend */}
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Status Key</p>
            {(Object.entries(STATUS_META) as [string, typeof STATUS_META['Active']][]).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={key} className="flex items-center gap-2 mb-2">
                  <div className={cn('w-1.5 h-5 rounded-full', meta.dot)} />
                  <Icon size={12} className={meta.text} />
                  <span className="text-[12px] text-neutral-600">{key}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Fields list ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Your Fields</h2>
          <div className="flex items-center gap-1.5">
            {(['All', 'Active', 'At Risk', 'Completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-bold transition-colors',
                  filter === f
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredFields.length === 0 ? (
          <div className="bg-white border border-dashed border-neutral-300 p-12 text-center">
            <Sprout size={36} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No fields found</p>
            <p className="text-sm text-neutral-400 mt-1 mb-4">
              {filter === 'All' ? 'Add your first field to get started' : `No fields with status "${filter}"`}
            </p>
            {filter === 'All' && (
              <button
                onClick={() => setAddModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Add First Field
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onEdit={()   => { setEditModal(field); setNewStage(field.stage); }}
                onNote={()   => { setNoteModal(field); setNoteText(''); }}
                onView={()   => setViewPanel(field)}
                onDelete={()  => setDeleteModal(field)}
                onFlag={()   => handleFlag(field)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Add Field Modal ───────────────────────────────────────────── */}
      {addModal && (
        <Modal title="Add New Field" onClose={() => setAddModal(false)}>
          <div className="space-y-3">
            {[
              { label: 'Field Name', key: 'name', type: 'text', placeholder: 'e.g. North Block' },
              { label: 'Crop Type',  key: 'crop', type: 'text', placeholder: 'e.g. Maize, Wheat, Sorghum' },
              { label: 'Planting Date', key: 'plantingDate', type: 'date', placeholder: '' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  value={(newField as any)[key]}
                  onChange={(e) => setNewField({ ...newField, [key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">Initial Stage</label>
              <select
                className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                value={newField.stage}
                onChange={(e) => setNewField({ ...newField, stage: e.target.value as Stage })}
              >
                {STAGE_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={handleAddField}
              disabled={!newField.name || !newField.crop || !newField.plantingDate}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-1"
            >
              Create Field
            </button>
          </div>
        </Modal>
      )}

      {/* ── Update Stage Modal ────────────────────────────────────────── */}
      {editModal && (
        <Modal title={`Update Stage — ${editModal.name}`} onClose={() => setEditModal(null)}>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Current: <span className="font-bold text-neutral-800">{editModal.stage}</span>
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
              disabled={newStage === editModal.stage}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Update
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add Note Modal ────────────────────────────────────────────── */}
      {noteModal && (
        <Modal title={`Add Note — ${noteModal.name}`} onClose={() => setNoteModal(null)}>
          <div className="space-y-3">
            {noteModal.notes.length > 0 && (
              <div className="bg-neutral-50 border border-neutral-100 p-3 max-h-36 overflow-y-auto space-y-2">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Previous notes</p>
                {noteModal.notes.slice().reverse().map((n) => (
                  <div key={n.id} className="text-xs text-neutral-600 border-l-2 border-neutral-200 pl-2">
                    {n.text}
                    <span className="text-neutral-400 ml-2">{new Date(n.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">Observation</label>
              <textarea
                placeholder="Describe what you observed in the field..."
                className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors h-28 resize-none"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save Note
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ──────────────────────────────────────── */}
      {deleteModal && (
        <ConfirmModal
          title={`Delete "${deleteModal.name}"?`}
          message={`This will permanently remove ${deleteModal.name} and all its notes. This cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteModal(null)}
        />
      )}

      {/* ── Field detail side panel ───────────────────────────────────── */}
      {viewPanel && (
        <FieldDetailPanel
          field={viewPanel}
          onClose={() => setViewPanel(null)}
        />
      )}
    </div>
  );
}