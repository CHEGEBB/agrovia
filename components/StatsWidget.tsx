'use client';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsWidgetProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: 'emerald' | 'amber' | 'sky' | 'violet';
}

export function StatsWidget({ label, value, icon: Icon, trend, trendUp, accent = 'emerald' }: StatsWidgetProps) {
  const accentMap = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', accentMap[accent])}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-neutral-800 tabular-nums">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-1 font-medium', trendUp ? 'text-emerald-600' : 'text-amber-600')}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </div>
  );
}