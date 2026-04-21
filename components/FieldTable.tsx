'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { StatusBadge, StageBadge } from './StatusBadge';
import { formatDate } from '@/lib/utils';
import type { Field, Stage, Status } from '@/types';

type SortKey = 'name' | 'cropType' | 'currentStage' | 'lastUpdated' | 'hectares';

export function FieldTable({ fields, isAdmin }: { fields: Field[]; isAdmin: boolean }) {
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'lastUpdated', asc: false });

  const sorted = [...fields].sort((a, b) => {
    const av = a[sort.key] as string | number;
    const bv = b[sort.key] as string | number;
    return sort.asc ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
  });

  const th = (label: string, key: SortKey) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 select-none whitespace-nowrap"
      onClick={() => setSort((s) => ({ key, asc: s.key === key ? !s.asc : true }))}
    >
      <span className="flex items-center gap-1">
        {label} <ArrowUpDown size={12} />
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-100 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50">
          <tr>
            {th('Field', 'name')}
            {th('Crop', 'cropType')}
            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
            {th('Stage', 'currentStage')}
            {isAdmin && <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Agent</th>}
            {th('Updated', 'lastUpdated')}
            {th('Ha', 'hectares')}
            <th />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {sorted.map((f) => (
            <tr key={f.id} className="hover:bg-neutral-50 transition-colors group">
              <td className="px-4 py-3.5">
                <p className="text-sm font-medium text-neutral-800 group-hover:text-emerald-700 transition-colors">{f.name}</p>
                <p className="text-xs text-neutral-400">{f.location}</p>
              </td>
              <td className="px-4 py-3.5 text-sm text-neutral-600">{f.cropType}</td>
              <td className="px-4 py-3.5"><StatusBadge status={f.status} /></td>
              <td className="px-4 py-3.5"><StageBadge stage={f.currentStage} /></td>
              {isAdmin && <td className="px-4 py-3.5 text-sm text-neutral-500">{f.assignedToName}</td>}
              <td className="px-4 py-3.5 text-sm text-neutral-400 whitespace-nowrap">{formatDate(f.lastUpdated)}</td>
              <td className="px-4 py-3.5 text-sm text-neutral-500 tabular-nums">{f.hectares}</td>
              <td className="px-4 py-3.5">
                <Link href={`/fields/${f.id}`} className="text-neutral-300 hover:text-emerald-600 transition-colors">
                  <ChevronRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-16 text-center text-neutral-400 text-sm">No fields match your filters.</div>
      )}
    </div>
  );
}