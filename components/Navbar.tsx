'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Agrovia logo"
            width={32}
            height={32}
            className="rounded-xl shadow-sm group-hover:opacity-90 transition-opacity"
          />
          <span
            className={cn(
              'font-black text-[17px] tracking-tight transition-colors',
              scrolled ? 'text-neutral-900' : 'text-white'
            )}
          >
            Agrovia
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled ? 'text-neutral-500 hover:text-neutral-900' : 'text-white/80 hover:text-white'
              )}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              'text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
              scrolled
                ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                : 'text-white/90 hover:text-white'
            )}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-900/20"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors',
            scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-white border-t border-neutral-100 px-5 py-5 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 py-2.5 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="h-px bg-neutral-100 my-2" />
          <Link
            href="/auth"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-neutral-600 py-2.5 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth"
            onClick={() => setOpen(false)}
            className="text-sm font-bold text-emerald-600 py-2.5 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </header>
  );
}