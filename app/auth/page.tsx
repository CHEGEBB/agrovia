'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sprout, ArrowRight, ShieldCheck, Tractor } from 'lucide-react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

const SLIDES = [
  { 
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80', 
    headline: 'Field Intelligence',
    caption: 'Monitor every field in real time with precision data and actionable insights for better harvests.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80', 
    headline: 'Full Crop Lifecycle',
    caption: 'From planting to harvest — track every growth stage with timestamped updates and progress analytics.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80', 
    headline: 'Team Coordination',
    caption: 'Coordinate agents across your farms with real-time assignments and field-level communication.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80', 
    headline: 'Data-Driven Farming',
    caption: 'Healthier crops start with better data. Make informed decisions with automated risk detection.'
  },
];

const ROLES: { role: Role; label: string; sub: string; icon: typeof ShieldCheck }[] = [
  { role: 'admin', label: 'Admin / Coordinator', sub: 'Full access — all fields & agents', icon: ShieldCheck },
  { role: 'agent', label: 'Field Agent',          sub: 'Monitor your assigned fields',      icon: Tractor },
];

function AuthInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initialMode  = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [slide,  setSlide]  = useState(0);
  const [fading, setFading] = useState(false);

  const advance = useCallback(() => {
    setFading(true);
    setTimeout(() => { setSlide((s) => (s + 1) % SLIDES.length); setFading(false); }, 400);
  }, []);

  useEffect(() => {
    const t = setInterval(advance, 5000);
    return () => clearInterval(t);
  }, [advance]);

  const goToSlide = (i: number) => {
    setFading(true);
    setTimeout(() => { setSlide(i); setFading(false); }, 400);
  };

  const [mode,     setMode]     = useState<'login' | 'register'>(initialMode);
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState<Role>('agent');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const switchMode = (m: 'login' | 'register') => { setError(''); setSuccess(''); setMode(m); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);
        const dest = (user.prefs?.role as Role) === 'admin' ? '/admin/dashboard' : '/agent/dashboard';
        setSuccess('Signed in! Redirecting…');
        setTimeout(() => router.push(dest), 700);
      } else {
        await authService.register(name, email, password, role);
        const dest = role === 'admin' ? '/admin/dashboard' : '/agent/dashboard';
        setSuccess('Account created! Redirecting…');
        setTimeout(() => router.push(dest), 700);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-150';

  const Field = ({
    label, type, value, onChange, placeholder,
  }: {
    label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string;
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
          className={inputCls}
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

      {/* LEFT — image panel with better visibility */}
      <div className="relative md:w-1/2 h-80 md:h-auto overflow-hidden bg-neutral-900 shrink-0 md:rounded-r-3xl shadow-2xl">
        <div className={cn('absolute inset-0 transition-opacity duration-500', fading ? 'opacity-0' : 'opacity-100')}>
          <Image
            src={SLIDES[slide].url}
            alt="Farm"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {/* Emerald + Dark Overlay - image visible but branded */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

        {/* Logo on image panel */}
        <div className="hidden md:flex absolute top-8 left-8 items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">Agrovia</span>
        </div>

        {/* Text content - bigger and more visible */}
        <div className={cn('absolute bottom-10 left-8 right-8 z-10 transition-opacity duration-500', fading ? 'opacity-0' : 'opacity-100')}>
          <h2 className="text-white text-3xl md:text-4xl font-black leading-tight drop-shadow-lg mb-3">
            {SLIDES[slide].headline}
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed drop-shadow max-w-sm">
            {SLIDES[slide].caption}
          </p>
          <div className="flex gap-2 mt-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === slide ? 'w-8 bg-emerald-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel with rounded corners */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 md:py-16 bg-white overflow-y-auto md:rounded-l-3xl">
        <div className="w-full max-w-[400px] flex flex-col gap-7">

          {/* Logo mobile */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-black text-neutral-900 text-lg tracking-tight">Agrovia</span>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              {mode === 'login'
                ? 'Sign in to access your field dashboard and monitor your crops.'
                : 'Join Agrovia and start monitoring your fields with real-time data.'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                  mode === m ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
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
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(({ role: r, label, sub, icon: Icon }) => {
                    const active = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                          'flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left transition-all duration-200',
                          active ? 'border-emerald-500 bg-emerald-50/80' : 'border-neutral-200 hover:border-emerald-200 hover:bg-neutral-50'
                        )}
                      >
                        <Icon size={18} strokeWidth={active ? 2.2 : 1.7} className={active ? 'text-emerald-600' : 'text-neutral-400'} />
                        <p className={cn('text-[13px] font-bold leading-tight', active ? 'text-emerald-800' : 'text-neutral-700')}>{label}</p>
                        <p className="text-[11px] text-neutral-400 leading-snug">{sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-[13px] px-3.5 py-2.5 rounded-xl leading-snug">
                <span className="mt-0.5 shrink-0 font-bold">!</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-3.5 py-2.5 rounded-xl">
                <span className="font-bold">✓</span>
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[12px] text-neutral-500">
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

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={24} className="animate-spin text-emerald-600" />
      </div>
    }>
      <AuthInner />
    </Suspense>
  );
}