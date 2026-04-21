'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RolePicker } from './RolePicker';
import type { Role } from '@/types';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('agent');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, type: string, value: string, onChange: (v: string) => void) => (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type === 'password' ? (showPass ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === 'register' && field('Full Name', 'text', name, setName)}
      {field('Email address', 'email', email, setEmail)}
      {field('Password', 'password', password, setPassword)}

      {mode === 'register' && (
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Your Role</label>
          <RolePicker value={role} onChange={setRole} />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>

      <p className="text-center text-xs text-neutral-400">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <Link
          href={mode === 'login' ? '/register' : '/login'}
          className="text-emerald-600 font-semibold hover:underline"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </form>
  );
}