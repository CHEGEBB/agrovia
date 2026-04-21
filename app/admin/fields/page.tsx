/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/fields/page.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  Map,
  AlertTriangle,
  CheckCircle,
  Archive,
  Clock,
  Search,
  Edit,
  MessageSquare,
  Eye,
  X,
  Sprout,
  Flag,
  Trash2,
  ChevronDown,
  Shield,
  Users,
  UserCheck,
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

// ─── Field detail panel ────────────────────────────────────────────────────────
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full', statusMeta.bg, statusMeta.text)}>
              <StatusIcon size={12} /> {field.computedStatus}
            </span>
            <span className={cn('text-[12px] font-semibold px-2.5 py-1 border rounded-full', stageMeta.bg, stageMeta.color)}>
              {field.stage}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Crop',        value: field.crop },
              { label: 'Planted',     value: new Date(field.plantingDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Last Update', value: new Date(field.lastUpdate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) },
              { label: 'Days Old',    value: `${daysSince(field.plantingDate)} days` },
              { label: 'Agent',       value: field.agentName ?? 'Unassigned' },
              { label: 'Agent ID',    value: field.assignedTo ?? 'None' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-50 p-3 rounded-sm">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-neutral-800 truncate">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Progress</p>
            <div className="flex items-center gap-1">
              {STAGE_ORDER.map((s, i) => (
                <div
                  key={s}
                  className={cn('h-1.5 flex-1 rounded-full', STAGE_ORDER.indexOf(field.stage) >= i ? stageMeta.bar : 'bg-neutral-200')}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {STAGE_ORDER.map((s) => (
                <span key={s} className={cn('text-[10px]', s === field.stage ? stageMeta.color + ' font-bold' : 'text-neutral-300')}>
                  {s}
                </span>
              ))}
            </div>
          </div>

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

// ─── Field card ────────────────────────────────────────────────────────────────
function FieldCard({
  field,
  agentOptions,
  onView,
  onUpdateStage,
  onAddNote,
  onAssign,
  onDelete,
  onFlag,
}: {
  field: Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' };
  agentOptions: { id: string; name: string }[];
  onView: () => void;
  onUpdateStage: () => void;
  onAddNote: () => void;
  onAssign: (agentId: string, agentName: string) => void;
  onDelete: () => void;
  onFlag: () => void;
}) {
  const stageMeta  = STAGE_META[field.stage];
  const statusMeta = STATUS_META[field.computedStatus];
  const StatusIcon = statusMeta.icon;
  const age = daysSince(field.plantingDate);
  const lastUpdated = daysSince(field.lastUpdate);
  const [assigning, setAssigning] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 hover:shadow-md transition-all flex">
      <div className={cn('w-1.5 shrink-0 rounded-l-sm', statusMeta.dot)} />
      <div className="flex-1 p-4 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <StatusIcon size={13} className={statusMeta.text} />
              <span className={cn('text-[11px] font-bold px-1.5 py-0.5 rounded-full', statusMeta.bg, statusMeta.text)}>
                {field.computedStatus}
              </span>
            </div>
            <h3 className="font-black text-neutral-900 text-[15px] truncate">{field.name}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{field.crop} · planted {age}d ago</p>
          </div>
          {/* Agent badge */}
          <div className="shrink-0 flex items-center gap-1.5">
            {field.assignedTo ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                <div className="w-4 h-4 rounded-full bg-emerald-200 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-emerald-700">{field.agentName?.charAt(0) ?? 'A'}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 truncate max-w-[60px]">{field.agentName}</span>
              </div>
            ) : (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                Unassigned
              </span>
            )}
          </div>
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
          <div className="flex items-center gap-1">
            {STAGE_ORDER.map((s, i) => (
              <div
                key={s}
                className={cn('h-1.5 flex-1 rounded-full', i <= STAGE_ORDER.indexOf(field.stage) ? stageMeta.bar : 'bg-neutral-200')}
              />
            ))}
          </div>
        </div>

        {/* Latest note */}
        {field.notes.length > 0 && (
          <div className="bg-neutral-50 border border-neutral-100 px-3 py-2 mb-3 rounded-sm">
            <p className="text-[10px] text-neutral-400 mb-0.5 font-semibold uppercase tracking-wide">Latest note</p>
            <p className="text-xs text-neutral-700 line-clamp-2">{field.notes[field.notes.length - 1].text}</p>
          </div>
        )}

        {/* Assign dropdown */}
        {assigning && (
          <div className="mb-3 p-3 bg-neutral-50 border border-neutral-200 rounded-sm space-y-2">
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Assign to agent</p>
            <select
              className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white"
              defaultValue=""
              onChange={(e) => {
                const [id, name] = e.target.value.split('||');
                if (id && name) {
                  onAssign(id, name);
                  setAssigning(false);
                }
              }}
            >
              <option value="" disabled>Select an agent…</option>
              {agentOptions.map((a) => (
                <option key={a.id} value={`${a.id}||${a.name}`}>{a.name}</option>
              ))}
            </select>
            <button
              onClick={() => setAssigning(false)}
              className="text-xs text-neutral-400 hover:text-neutral-600"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Clock size={10} />
            {lastUpdated === 0 ? 'Updated today' : `Updated ${lastUpdated}d ago`}
          </span>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setAssigning((v) => !v)} title="Assign agent" className="p-1.5 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 transition-colors rounded">
              <UserCheck size={13} />
            </button>
            <button onClick={onAddNote}    title="Add note"     className="p-1.5 text-neutral-400 hover:text-blue-600    hover:bg-blue-50    transition-colors rounded"><MessageSquare size={13} /></button>
            <button onClick={onUpdateStage} title="Update stage" className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded"><Edit          size={13} /></button>
            <button onClick={onFlag}       title="Flag field"   className="p-1.5 text-neutral-400 hover:text-amber-600   hover:bg-amber-50   transition-colors rounded"><Flag          size={13} /></button>
            <button onClick={onView}       title="View details" className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors rounded"><Eye           size={13} /></button>
            <button onClick={onDelete}     title="Delete field" className="p-1.5 text-neutral-400 hover:text-red-500    hover:bg-red-50     transition-colors rounded"><Trash2        size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main fields page ─────────────────────────────────────────────────────────
export default function AdminFieldsPage() {
  const { fields, updateFieldStage, addNote, assignField, deleteField } = useFields();
  const { users } = useAdminUsers();

  const enrichedFields = useMemo(
    () => fields.map((f) => ({ ...f, computedStatus: computeStatus(f) })),
    [fields]
  );

  const agentOptions = useMemo(
    () => users.filter((u) => u.prefs?.role === 'agent').map((u) => ({ id: u.$id, name: u.name })),
    [users]
  );

  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState<'All' | 'Active' | 'At Risk' | 'Completed'>('All');
  const [stageFilter, setStageFilter] = useState<'All' | Stage>('All');
  const [viewPanel, setViewPanel]   = useState<(Field & { computedStatus: 'Active' | 'At Risk' | 'Completed' }) | null>(null);
  const [editModal, setEditModal]   = useState<Field | null>(null);
  const [newStage, setNewStage]     = useState<Stage>('Planted');
  const [noteModal, setNoteModal]   = useState<Field | null>(null);
  const [noteText, setNoteText]     = useState('');
  const [deleteModal, setDeleteModal] = useState<Field | null>(null);

  const filteredFields = useMemo(() => {
    let result = enrichedFields;
    if (filter !== 'All') result = result.filter((f) => f.computedStatus === filter);
    if (stageFilter !== 'All') result = result.filter((f) => f.stage === stageFilter);
    if (search) result = result.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.crop.toLowerCase().includes(search.toLowerCase()) ||
      (f.agentName ?? '').toLowerCase().includes(search.toLowerCase())
    );
    return result;
  }, [enrichedFields, filter, stageFilter, search]);

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

  const stats = useMemo(() => ({
    total:     enrichedFields.length,
    active:    enrichedFields.filter((f) => f.computedStatus === 'Active').length,
    atRisk:    enrichedFields.filter((f) => f.computedStatus === 'At Risk').length,
    completed: enrichedFields.filter((f) => f.computedStatus === 'Completed').length,
  }), [enrichedFields]);

  return (
    <div className="space-y-6 pb-12">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={14} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Admin · Fields</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">All Fields</h1>
        <p className="text-sm text-neutral-400 mt-1">Monitor and manage every field across all agents</p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total,     icon: Map,           bg: 'bg-white border border-neutral-200',       ic: 'text-neutral-600' },
          { label: 'Active', value: stats.active,   icon: CheckCircle,  bg: 'bg-emerald-50 border border-emerald-200',  ic: 'text-emerald-600' },
          { label: 'At Risk', value: stats.atRisk,  icon: AlertTriangle, bg: 'bg-amber-50 border border-amber-200',     ic: 'text-amber-500'   },
          { label: 'Done', value: stats.completed,  icon: Archive,      bg: 'bg-white border border-neutral-200',       ic: 'text-neutral-400' },
        ].map(({ label, value, icon: Icon, bg, ic }) => (
          <div key={label} className={cn('p-5 flex flex-col gap-3', bg)}>
            <div className="flex items-start justify-between">
              <Icon size={18} className={ic} />
              <span className="text-3xl font-black text-neutral-900 tabular-nums">{value}</span>
            </div>
            <p className="text-sm font-bold text-neutral-800">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search fields, crops, agents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {(['All', 'Active', 'At Risk', 'Completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-bold transition-colors',
                filter === f ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stage filter */}
        <div className="flex items-center gap-1">
          {(['All', ...STAGE_ORDER] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s as any)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-medium transition-colors',
                stageFilter === s ? 'bg-emerald-600 text-white' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Fields grid ───────────────────────────────────────────────── */}
      {filteredFields.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-300 p-12 text-center">
          <Sprout size={36} className="text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 font-medium">No fields found</p>
          <p className="text-sm text-neutral-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredFields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              agentOptions={agentOptions}
              onView={() => setViewPanel(field)}
              onUpdateStage={() => { setEditModal(field); setNewStage(field.stage); }}
              onAddNote={() => { setNoteModal(field); setNoteText(''); }}
              onAssign={(agentId, agentName) => assignField(field.id, agentId, agentName)}
              onDelete={() => setDeleteModal(field)}
              onFlag={() => addNote(field.id, '⚑ Flagged for supervisor review')}
            />
          ))}
        </div>
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
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">Admin Note</label>
              <textarea
                placeholder="Add an observation or instruction for this field…"
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
        <FieldDetailPanel field={viewPanel} onClose={() => setViewPanel(null)} />
      )}
    </div>
  );
}