'use client';
import { cn } from '@/lib/utils';
import type { Status, Stage } from '@/types';

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase',
        status === 'Active' && 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        status === 'At Risk' && 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        status === 'Completed' && 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'Active' && 'bg-emerald-500',
          status === 'At Risk' && 'bg-amber-500 animate-pulse',
          status === 'Completed' && 'bg-sky-500'
        )}
      />
      {status}
    </span>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  const colors: Record<Stage, string> = {
    Planted: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200',
    Growing: 'bg-lime-50 text-lime-700 ring-1 ring-lime-200',
    Ready: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
    Harvested: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[stage])}>
      {stage}
    </span>
  );
}