'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, Tractor, ShieldCheck } from 'lucide-react';
import { authService } from '@/services/authService';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    headline: 'Field Intelligence',
    caption: 'Monitor every field in real time with precision data and actionable insights for better harvests.',
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
    headline: 'Full Crop Lifecycle',
    caption: 'From planting to harvest — track every growth stage with timestamped updates and progress analytics.',
  },
  {
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80',
    headline: 'Team Coordination',
    caption: 'Coordinate agents across your farms with real-time assignments and field-level communication.',
  },
  {
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80',
    headline: 'Data-Driven Farming',
    caption: 'Healthier crops start with better data. Make informed decisions with automated risk detection.',
  },
];

function Field({
  label, type, value, onChange, placeholder, showPass, onTogglePass,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  showPass?: boolean; onTogglePass?: () => void;
}) {
  const [localShow, setLocalShow] = useState(false);
  const isPassword = type === 'password';
  const visible = showPass !== undefined ? showPass : localShow;
  const toggle = onTogglePass ?? (() => setLocalShow((s) => !s));

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (visible ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-150"
        />
        {isPassword && (
          <button type="button" tabIndex={-1} onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function AuthInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  // Slideshow
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const advance = useCallback(() => {
    setFading(true);
    setTimeout(() => { setSlide((s) => (s + 1) % SLIDES.length); setFading(false); }, 400);
  }, []);
  useEffect(() => { const t = setInterval(advance, 5000); return () => clearInterval(t); }, [advance]);
  const goToSlide = (i: number) => {
    setFading(true);
    setTimeout(() => { setSlide(i); setFading(false); }, 400);
  };

  // Form state
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = (m: 'login' | 'register') => {
    setError(''); setSuccess(''); setMode(m); setName(''); setEmail(''); setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    try {
      // Always kill any existing session first so there's no stale agent/admin conflict
      try { await authService.logout(); } catch (_) { /* no session to clear, that's fine */ }

      if (mode === 'login') {
        const user = await authService.login(email, password);
        const role = user?.prefs?.role ?? 'agent';
        const destination = role === 'admin' ? '/admin/dashboard' : '/agent/dashboard';
        setSuccess(role === 'admin' ? 'Welcome, Admin! Redirecting…' : 'Signed in! Redirecting…');
        // Use replace so the auth page is not in browser history, and go immediately
        router.replace(destination);
      } else {
        await authService.register(name, email, password, 'agent');
        setSuccess('Account created! Redirecting…');
        router.replace('/agent/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false); // only reset loading on error — on success we're navigating away
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT — image panel */}
      <div className="relative md:w-1/2 h-80 md:h-auto overflow-hidden bg-neutral-900 shrink-0 md:rounded-r-3xl shadow-2xl">
        <div className={cn('absolute inset-0 transition-opacity duration-500', fading ? 'opacity-0' : 'opacity-100')}>
          <Image src={SLIDES[slide].url} alt="Farm" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

        <div className="hidden md:flex absolute top-8 left-8 items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">Agrovia</span>
        </div>

        <div className={cn('absolute bottom-10 left-8 right-8 z-10 transition-opacity duration-500', fading ? 'opacity-0' : 'opacity-100')}>
          <h2 className="text-white text-3xl md:text-4xl font-black leading-tight drop-shadow-lg mb-3">
            {SLIDES[slide].headline}
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed drop-shadow max-w-sm">
            {SLIDES[slide].caption}
          </p>
          <div className="flex gap-2 mt-6">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)}
                className={cn('h-1.5 rounded-full transition-all duration-300',
                  i === slide ? 'w-8 bg-emerald-400' : 'w-1.5 bg-white/40 hover:bg-white/70')} />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 md:py-16 bg-white overflow-y-auto">
        <div className="w-full max-w-[400px] flex flex-col gap-7">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-black text-neutral-900 text-lg tracking-tight">Agrovia</span>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome back' : 'Become a Field Agent'}
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              {mode === 'login'
                ? 'Sign in to access your dashboard and monitor your fields.'
                : 'Join Agrovia as a field agent and start managing crop data in real-time.'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex bg-neutral-100 p-1 gap-1">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} type="button" onClick={() => switchMode(m)}
                className={cn('flex-1 py-2.5 text-sm font-semibold transition-all duration-200',
                  mode === m ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700')}>
                {m === 'login' ? 'Sign In' : 'Agent Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="Brian Mwangi" />
            )}
            <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword}
              placeholder="••••••••" showPass={showPass} onTogglePass={() => setShowPass((s) => !s)} />

            {mode === 'register' && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Your Role</label>
                <div className="flex flex-col items-start gap-1.5 p-4 border-2 border-emerald-500 bg-emerald-50/80">
                  <Tractor size={18} className="text-emerald-600" />
                  <p className="text-[13px] font-bold leading-tight text-emerald-800">Field Agent</p>
                  <p className="text-[11px] text-neutral-400 leading-snug">Monitor your assigned fields and log updates</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-[13px] px-3.5 py-2.5 leading-snug">
                <span className="mt-0.5 shrink-0 font-bold">!</span><span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-3.5 py-2.5">
                <span className="font-bold">✓</span><span>{success}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="mt-2 w-full py-3.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-emerald-200">
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-[12px] text-neutral-500">
            {mode === 'login' ? "Don't have an agent account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-emerald-600 font-semibold hover:underline">
              {mode === 'login' ? 'Sign up as agent' : 'Sign in'}
            </button>
          </p>

          {/* Admin note */}
          <div className="flex items-start gap-2.5 bg-neutral-50 border border-neutral-200 px-4 py-3">
            <ShieldCheck size={14} className="text-neutral-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-neutral-400 leading-snug">
              Admins can also enter their credentials above to access the admin dashboard.
              You will be redirected automatically based on your role.
            </p>
          </div>

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