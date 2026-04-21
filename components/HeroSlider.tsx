'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    tag: 'Field Monitoring',
    headline: 'Monitor Every Field,\nIn Real Time.',
    sub: 'Agrovia gives coordinators and agents a single source of truth for crop health across every region.',
  },
  {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&q=80',
    tag: 'Crop Lifecycle',
    headline: 'From Planting\nTo Harvest.',
    sub: 'Track every growth stage with timestamped updates, rich notes, and automatic progress tracking.',
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
    tag: 'Risk Detection',
    headline: 'Know When\nFields Are At Risk.',
    sub: "Automatic risk detection flags neglected or overdue fields before it's too late to act.",
  },
  {
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80',
    tag: 'Agent Tools',
    headline: 'Empower\nField Agents.',
    sub: 'Mobile-ready interface so agents can log updates, observations, and changes straight from the field.',
  },
  {
    url: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1600&q=80',
    tag: 'Built for Africa',
    headline: 'Built for African\nAgriculture.',
    sub: 'Designed with local farming cycles, regional crop types, and multi-agent coordination in mind.',
  },
];

export function HeroSlider() {
  const [active, setActive]   = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((index: number) => {
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 350);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      goTo((active + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [active, goTo]);

  return (
    <section className="relative h-[100svh] min-h-[600px] max-h-[960px] overflow-hidden bg-neutral-900">
      {/* Background images — crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            i === active ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden={i !== active}
        >
          <Image
            src={s.url}
            alt=""
            fill
            className="object-cover object-center scale-[1.04]"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 px-5 sm:px-10 md:px-16 lg:px-24">
        <div
          className={cn(
            'transition-all duration-500 ease-out max-w-3xl',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <p className="text-emerald-400 text-[11px] font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4">
            Agrovia · {SLIDES[active].tag}
          </p>
          <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-black text-white leading-[1.05] whitespace-pre-line mb-4 sm:mb-5 drop-shadow-lg">
            {SLIDES[active].headline}
          </h1>
          <p className="text-neutral-200 text-[clamp(0.875rem,2vw,1.125rem)] max-w-md mb-7 sm:mb-9 leading-relaxed">
            {SLIDES[active].sub}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight size={15} />
            </a>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-7 right-6 sm:right-10 md:right-16 z-10 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'rounded-full transition-all duration-300 focus:outline-none',
              i === active
                ? 'w-7 h-2 bg-emerald-400'
                : 'w-2 h-2 bg-white/35 hover:bg-white/60'
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 left-5 sm:left-10 md:left-16 z-10">
        <p className="text-white/40 text-xs font-medium tabular-nums">
          {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </p>
      </div>
    </section>
  );
}