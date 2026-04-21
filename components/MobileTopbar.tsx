'use client';
import Image from 'next/image';
import { Menu } from 'lucide-react';

export function MobileTopbar() {
  return (
    <header className="md:hidden h-14 bg-white border-b border-neutral-100 px-4 flex items-center gap-3 shrink-0 z-10">
      <button
        className="p-2 -ml-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
        onClick={() => window.dispatchEvent(new CustomEvent('agrovia:sidebar-open'))}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Agrovia" width={24} height={24} className="rounded-md" />
        <span className="font-black text-sm text-neutral-900 tracking-tight">Agrovia</span>
      </div>
    </header>
  );
}