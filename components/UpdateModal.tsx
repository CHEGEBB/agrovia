'use client';
import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFields } from '@/hooks/useFields';
import { cn } from '@/lib/utils';
import type { Stage } from '@/types';

const STAGES: Stage[] = ['Planted', 'Growing', 'Ready', 'Harvested'];

interface UpdateModalProps {
  fieldId: string;
  currentStage: Stage;
  userId: string;
  onClose: () => void;
}

export function UpdateModal({ fieldId, currentStage, userId, onClose }: UpdateModalProps) {
  const updateStage = useFields((s) => s.updateStage);
  const [stage, setStage] = useState<Stage>(currentStage);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate async
    updateStage(fieldId, stage, note.trim(), userId);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors">
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold text-neutral-800 mb-1">Update Field Stage</h2>
        <p className="text-sm text-neutral-400 mb-5">Record the latest stage and add an observation note.</p>

        {/* stage selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Stage</label>
          <div className="grid grid-cols-4 gap-2">
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                  'py-2 rounded-xl text-xs font-semibold border transition-all',
                  stage === s
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-emerald-300'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* note */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Observation Note</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe current field conditions…"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!note.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? 'Saving…' : 'Save Update'}
          </button>
        </div>
      </div>
    </div>
  );
}