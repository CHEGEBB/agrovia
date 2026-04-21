'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Direct Unsplash source URLs — no API key needed, free for use
const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    headline: 'Monitor Every Field,\nIn Real Time.',
    sub: 'Agrovia gives coordinators and agents a single source of truth for crop health.',
  },
  {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&q=80',
    headline: 'From Planting\nTo Harvest.',
    sub: 'Track every stage with timestamped updates and rich observation notes.',
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
    headline: 'Know When\nFields Are At Risk.',
    sub: 'Automatic risk detection flags neglected or overdue fields before it\'s too late.',
  },
  {
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80',
    headline: 'Empower\nField Agents.',
    sub: 'Mobile-ready interface so agents can log updates straight from the field.',
  },
  {
    url: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1600&q=80',
    headline: 'Built for African\nAgriculture.',
    sub: 'Designed with local farming cycles and multi-agent coordination in mind.',
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-[92vh] min-h-[560px] overflow-hidden bg-neutral-900">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            i === active ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={s.url}
            alt={s.headline}
            fill
            className="object-cover scale-105"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>
      ))}

      {/* content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-end pb-20 px-6 md:px-16 lg:px-24 max-w-5xl">
        <div
          key={active}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Agrovia · Field Monitoring
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight whitespace-pre-line mb-5 drop-shadow-lg">
            {SLIDES[active].headline}
          </h1>
          <p className="text-neutral-200 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
            {SLIDES[active].sub}
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/register"
              className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-7 py-3 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-8 right-8 md:right-16 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === active ? 'w-6 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </div>
  );
}