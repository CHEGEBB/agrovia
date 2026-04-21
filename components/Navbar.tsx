'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur border-b border-neutral-100 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-500 transition-colors">
            <Leaf size={16} className="text-white" strokeWidth={2} />
          </div>
          <span className={cn('font-black text-lg tracking-tight', scrolled ? 'text-neutral-800' : 'text-white')}>
            Agrovia
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {['Features', 'How It Works'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled ? 'text-neutral-500 hover:text-neutral-800' : 'text-white/80 hover:text-white'
              )}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              'text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
              scrolled ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/90 hover:text-white'
            )}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* mobile hamburger */}
        <button
          className={cn('md:hidden p-1.5', scrolled ? 'text-neutral-700' : 'text-white')}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-5 py-4 flex flex-col gap-3">
          <Link href="/login" className="text-sm font-medium text-neutral-700 py-2" onClick={() => setOpen(false)}>Sign In</Link>
          <Link href="/register" className="text-sm font-bold text-emerald-600 py-2" onClick={() => setOpen(false)}>Get Started →</Link>
        </div>
      )}
    </header>
  );
}