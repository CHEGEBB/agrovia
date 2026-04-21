'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sprout, ArrowRight, ShieldCheck, Tractor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

/* ── Unsplash slide images ───────────────────────────── */
const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    caption: 'Monitor every field in real time',
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80',
    caption: 'From planting to harvest — tracked',
  },
  {
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80',
    caption: 'Coordinate agents across your farms',
  },
  {
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
    caption: 'Healthier crops start with better data',
  },
];

/* ── Role picker ─────────────────────────────────────── */
const roles: { role: Role; label: string; sub: string; icon: typeof ShieldCheck }[] = [
  { role: 'admin', label: 'Admin / Coordinator', sub: 'Full access — fields & agents', icon: ShieldCheck },
  { role: 'agent', label: 'Field Agent',          sub: 'Monitor your assigned fields', icon: Tractor },
];

function RoleChip({
  value,
  onChange,
}: {
  value: Role;
  onChange: (r: Role) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {roles.map(({ role, label, sub, icon: Icon }) => {
        const active = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={cn(
              'flex flex-col items-start gap-1.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              active
                ? 'border-emerald-500 bg-emerald-50/80'
                : 'border-neutral-200 hover:border-emerald-200 hover:bg-neutral-50'
            )}
          >
            <Icon
              size={17}
              strokeWidth={active ? 2.2 : 1.7}
              className={active ? 'text-emerald-600' : 'text-neutral-400'}
            />
            <p className={cn('text-[13px] font-bold leading-tight', active ? 'text-emerald-800' : 'text-neutral-700')}>
              {label}
            </p>
            <p className="text-[11px] text-neutral-400 leading-snug">{sub}</p>
          </button>
        );
      })}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth() as {
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  };

  /* slide state */
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  const advanceSlide = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const t = setInterval(advanceSlide, 4500);
    return () => clearInterval(t);
  }, [advanceSlide]);

  /* form state */
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('agent');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = (m: 'login' | 'register') => {
    setError('');
    setSuccess('');
    setMode(m);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccess('Signed in! Redirecting…');
        setTimeout(() => router.push('/dashboard'), 800);
      } else {
        await register(name, email, password, role);
        setSuccess('Account created! Redirecting…');
        const dest = role === 'admin' ? '/admin/dashboard' : '/agent/dashboard';
        setTimeout(() => router.push(dest), 800);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-150';

  const Field = ({
    label,
    type,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</label>
      <div className="relative">
        <input
          type={type === 'password' ? (showPass ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className={inputBase}
        />
        {type === 'password' && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* ── LEFT — image panel ────────────────────────────── */}
      <div className="relative md:w-1/2 h-48 md:h-auto overflow-hidden bg-neutral-900 shrink-0">
        {/* Slides */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            fading ? 'opacity-0' : 'opacity-100'
          )}
        >
          <Image
            src={SLIDES[slide].url}
            alt="Farm field"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Logo — desktop */}
        <div className="hidden md:flex absolute top-8 left-8 items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Sprout size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-black text-white text-[17px] tracking-tight drop-shadow">Agrovia</span>
        </div>

        {/* Caption */}
        <div
          className={cn(
            'absolute bottom-8 left-8 right-8 z-10 transition-opacity duration-500',
            fading ? 'opacity-0' : 'opacity-100'
          )}
        >
          <p className="text-white text-xl md:text-2xl font-bold leading-snug drop-shadow-sm max-w-xs">
            {SLIDES[slide].caption}
          </p>

          {/* Dot indicators */}
          <div className="flex gap-1.5 mt-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setFading(true);
                  setTimeout(() => { setSlide(i); setFading(false); }, 400);
                }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — form panel ───────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 md:py-16 bg-white">
        <div className="w-full max-w-[360px] flex flex-col gap-7">

          {/* Logo — mobile */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Sprout size={15} className="text-white" />
            </div>
            <span className="font-black text-neutral-900 text-[15px] tracking-tight">Agrovia</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[26px] font-black text-neutral-900 tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-neutral-400">
              {mode === 'login'
                ? 'Sign in to access your field dashboard.'
                : 'Join Agrovia and start monitoring your fields.'}
            </p>
          </div>

          {/* Mode toggle pills */}
          <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200',
                  mode === m
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="Brian Mwangi" />
            )}
            <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Your Role</label>
                <RoleChip value={role} onChange={setRole} />
              </div>
            )}

            {/* Feedback */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-[13px] px-3.5 py-2.5 rounded-xl leading-snug">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[13px] px-3.5 py-2.5 rounded-xl leading-snug">
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 rounded-xl bg-emerald-600 text-white text-[14px] font-bold hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[12px] text-neutral-400 -mt-2">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}