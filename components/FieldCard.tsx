'use client';
import Link from 'next/link';
import { MapPin, Wheat, CalendarDays, User } from 'lucide-react';
import { StatusBadge, StageBadge } from './StatusBadge';
import { formatDate, stagePercent } from '@/lib/utils';
import type { Field } from '@/types';

const STAGE_ORDER = ['Planted', 'Growing', 'Ready', 'Harvested'];

export function FieldCard({ field }: { field: Field }) {
  const pct = stagePercent(field.currentStage);

  return (
    <Link
      href={`/fields/${field.id}`}
      className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* colour strip */}
      <div className="h-1 w-full bg-neutral-100">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-neutral-800 text-sm leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
              {field.name}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
              <MapPin size={11} /> {field.location}
            </p>
          </div>
          <StatusBadge status={field.status} />
        </div>

        {/* meta */}
        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Wheat size={12} className="text-emerald-500" />
            {field.cropType}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={12} className="text-emerald-500" />
            {formatDate(field.plantingDate)}
          </span>
          <span className="flex items-center gap-1.5 col-span-2">
            <User size={12} className="text-emerald-500" />
            {field.assignedToName}
          </span>
        </div>

        {/* stage progress */}
        <div className="mt-auto pt-2 border-t border-neutral-50">
          <div className="flex justify-between mb-1.5">
            {STAGE_ORDER.map((s) => (
              <span
                key={s}
                className={`text-[10px] font-medium ${
                  s === field.currentStage ? 'text-emerald-600' : 'text-neutral-300'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* stage badge */}
        <div className="flex items-center justify-between">
          <StageBadge stage={field.currentStage} />
          <span className="text-[10px] text-neutral-400">{field.hectares} ha</span>
        </div>
      </div>
    </Link>
  );
}