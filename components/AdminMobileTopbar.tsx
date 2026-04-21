// components/AdminMobileTopbar.tsx
'use client';
import Image from 'next/image';
import { Menu } from 'lucide-react';

export function AdminMobileTopbar() {
  return (
    <header className="md:hidden h-14 bg-white border-b border-neutral-100 px-4 flex items-center gap-3 shrink-0 z-10">
      <button
        className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
        onClick={() => window.dispatchEvent(new CustomEvent('agrovia:admin-sidebar-open'))}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Agrovia" width={24} height={24} />
        <span className="font-black text-sm text-neutral-900 tracking-tight">Agrovia</span>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
      </div>
    </header>
  );
}