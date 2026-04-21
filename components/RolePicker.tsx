'use client';
import { ShieldCheck, Tractor } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface RolePickerProps {
  value: Role;
  onChange: (r: Role) => void;
}

const options: { role: Role; label: string; desc: string; icon: typeof ShieldCheck }[] = [
  { role: 'admin', label: 'Admin / Coordinator', desc: 'Full access to all fields & agents', icon: ShieldCheck },
  { role: 'agent', label: 'Field Agent', desc: 'Monitor your assigned fields', icon: Tractor },
];

export function RolePicker({ value, onChange }: RolePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ role, label, desc, icon: Icon }) => (
        <button
          key={role}
          type="button"
          onClick={() => onChange(role)}
          className={cn(
            'flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all',
            value === role
              ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-400'
              : 'border-neutral-200 hover:border-emerald-200 hover:bg-neutral-50'
          )}
        >
          <Icon
            size={18}
            className={value === role ? 'text-emerald-600' : 'text-neutral-400'}
            strokeWidth={1.8}
          />
          <p className={cn('text-sm font-semibold', value === role ? 'text-emerald-700' : 'text-neutral-700')}>
            {label}
          </p>
          <p className="text-xs text-neutral-400 leading-snug">{desc}</p>
        </button>
      ))}
    </div>
  );
}