'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const ADMIN_EMAIL = 'admin@agrovia.com';
const ADMIN_PASSWORD = 'admin@1234';

export default function AdminAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Session check — localStorage only, zero network requests
  useEffect(() => {
    if (localStorage.getItem('agrovia:admin') === 'true') {
      router.replace('/admin/dashboard');
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError('Invalid admin credentials.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem('agrovia:admin', 'true');
    localStorage.setItem('agrovia:adminEmail', email);
    setSuccess('Signed in! Redirecting…');
    setTimeout(() => router.push('/admin/dashboard'), 700);
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={24} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT — image panel */}
      <div className="relative md:w-1/2 h-80 md:h-auto overflow-hidden bg-neutral-900 shrink-0 md:rounded-r-3xl shadow-2xl">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            alt="Farm" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

        <div className="hidden md:flex absolute top-8 left-8 items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">Agrovia Admin</span>
        </div>

        <div className="absolute bottom-10 left-8 right-8 z-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={24} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-black leading-tight drop-shadow-lg mb-3">
            Secure Access Only
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed drop-shadow max-w-sm">
            Manage fields, coordinate agents, and monitor all farming operations from a single dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 md:py-16 bg-white overflow-y-auto md:rounded-l-3xl">
        <div className="w-full max-w-[400px] flex flex-col gap-7">
          <div className="flex md:hidden items-center justify-center gap-2 mb-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-black text-neutral-900 text-lg tracking-tight">Agrovia Admin</span>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">Admin Access</h1>
            <p className="text-sm text-neutral-500 mt-2">Sign in to manage fields, agents, and monitor operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agrovia.com" required
                className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-150"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

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
                : <>Sign In as Admin<ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="text-center">
            <button type="button" onClick={() => router.push('/auth')}
              className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
              ← Back to Agent Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}