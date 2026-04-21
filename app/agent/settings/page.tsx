/* eslint-disable @typescript-eslint/no-explicit-any */
// app/agent/settings/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFields } from '@/hooks/useFields';
import { account } from '@/lib/appwrite';
import {
  User,
  Mail,
  Lock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Activity,
  Map,
  ChevronRight,
  Sprout,
  Archive,
  Layers,
  KeyRound,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Field } from '@/hooks/useFields';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed' {
  if (field.stage === 'Harvested') return 'Completed';
  const dp = Math.floor((Date.now() - new Date(field.plantingDate).getTime()) / 86_400_000);
  const du = Math.floor((Date.now() - new Date(field.lastUpdate).getTime()) / 86_400_000);
  if (field.stage === 'Ready') return 'At Risk';
  if (field.stage === 'Growing' && dp > 90) return 'At Risk';
  if (du > 14) return 'At Risk';
  return 'Active';
}

// ─── Password strength ────────────────────────────────────────────────────────
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-400'    };
  if (score <= 3) return { score, label: 'Fair',   color: 'bg-amber-400'  };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-emerald-400'};
  return              { score, label: 'Very Strong', color: 'bg-emerald-600' };
}

// ─── Alert banner ─────────────────────────────────────────────────────────────
function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 text-sm font-medium border',
      type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : 'bg-red-50 border-red-200 text-red-700'
    )}>
      {type === 'success'
        ? <CheckCircle size={15} className="shrink-0" />
        : <AlertTriangle size={15} className="shrink-0" />
      }
      {message}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-neutral-100">
        <Icon size={15} className="text-neutral-400" />
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────
function PasswordInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder ?? '••••••••'}
          className="w-full border border-neutral-200 px-3 py-2.5 text-sm pr-10 focus:outline-none focus:border-emerald-500 transition-colors bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, logout, refresh } = useAuth();
  const { fields } = useFields();

  // ── Password change state ─────────────────────────────────────────────────
  const [currentPw, setCurrentPw]  = useState('');
  const [newPw, setNewPw]          = useState('');
  const [confirmPw, setConfirmPw]  = useState('');
  const [pwLoading, setPwLoading]  = useState(false);
  const [pwAlert, setPwAlert]      = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const pwStrength = getPasswordStrength(newPw);

  const handlePasswordChange = async () => {
    setPwAlert(null);
    if (!currentPw || !newPw || !confirmPw) {
      setPwAlert({ type: 'error', msg: 'All password fields are required.' });
      return;
    }
    if (newPw !== confirmPw) {
      setPwAlert({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    if (newPw.length < 8) {
      setPwAlert({ type: 'error', msg: 'Password must be at least 8 characters.' });
      return;
    }
    setPwLoading(true);
    try {
      await account.updatePassword(newPw, currentPw);
      setPwAlert({ type: 'success', msg: 'Password updated successfully.' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: any) {
      setPwAlert({ type: 'error', msg: err?.message ?? 'Failed to update password. Check your current password.' });
    } finally {
      setPwLoading(false);
    }
  };

  // ── Field stats ───────────────────────────────────────────────────────────
  const enriched = fields.map((f) => ({ ...f, computedStatus: computeStatus(f) }));
  const stats = {
    total:     enriched.length,
    active:    enriched.filter((f) => f.computedStatus === 'Active').length,
    atRisk:    enriched.filter((f) => f.computedStatus === 'At Risk').length,
    completed: enriched.filter((f) => f.computedStatus === 'Completed').length,
  };

  // ── Member since ──────────────────────────────────────────────────────────
  const memberSince = user?.$createdAt
    ? new Date(user.$createdAt).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="space-y-6 pb-12 max-w-2xl">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={15} className="text-emerald-600" />
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Account</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your profile and account security</p>
      </div>

      {/* ── Profile card ──────────────────────────────────────────────── */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-emerald-700">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-black text-neutral-900 truncate">{user?.name ?? '—'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-neutral-400" />
              <p className="text-sm text-neutral-500 truncate">{user?.email ?? '—'}</p>
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                <BadgeCheck size={11} /> Field Agent
              </span>
              <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                <Clock size={11} /> Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Read-only info rows */}
        <div className="mt-5 space-y-0 border border-neutral-100 divide-y divide-neutral-100">
          {[
            { label: 'Full Name',  value: user?.name  ?? '—', icon: User  },
            { label: 'Email',      value: user?.email ?? '—', icon: Mail  },
            { label: 'Role',       value: 'Field Agent',      icon: Shield },
            { label: 'Account ID', value: user?.$id ? `#${user.$id.slice(0, 12)}…` : '—', icon: KeyRound },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 px-4 py-3 bg-neutral-50">
              <Icon size={13} className="text-neutral-400 shrink-0" />
              <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wide w-24 shrink-0">{label}</span>
              <span className="text-sm text-neutral-700 font-medium truncate">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Activity summary ──────────────────────────────────────────── */}
      <Section title="Field Activity" icon={Activity}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Fields', value: stats.total,     icon: Map,           color: 'text-neutral-600', bg: 'bg-neutral-50'  },
            { label: 'Active',       value: stats.active,    icon: Activity,      color: 'text-emerald-600', bg: 'bg-emerald-50'  },
            { label: 'At Risk',      value: stats.atRisk,    icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-50'    },
            { label: 'Completed',    value: stats.completed, icon: Archive,       color: 'text-neutral-400', bg: 'bg-neutral-100' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={cn('p-4 border border-neutral-200', bg)}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={14} className={color} />
                <span className="text-2xl font-black text-neutral-900 tabular-nums">{value}</span>
              </div>
              <p className="text-[11px] font-bold text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Change password ───────────────────────────────────────────── */}
      <Section title="Change Password" icon={Lock}>
        <div className="space-y-4">
          {pwAlert && <Alert type={pwAlert.type} message={pwAlert.msg} />}

          <PasswordInput
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="Enter your current password"
          />
          <PasswordInput
            label="New Password"
            value={newPw}
            onChange={setNewPw}
            placeholder="Enter a new password"
          />

          {/* Password strength bar */}
          {newPw.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-neutral-500">Password strength</span>
                <span className={cn(
                  'text-[11px] font-bold',
                  pwStrength.score <= 1 ? 'text-red-500' :
                  pwStrength.score <= 3 ? 'text-amber-500' : 'text-emerald-600'
                )}>
                  {pwStrength.label}
                </span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', pwStrength.color)}
                  style={{ width: `${(pwStrength.score / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                Use 8+ characters, uppercase, numbers and symbols for a stronger password.
              </p>
            </div>
          )}

          <PasswordInput
            label="Confirm New Password"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="Repeat your new password"
          />

          {/* Match indicator */}
          {confirmPw.length > 0 && (
            <div className={cn(
              'flex items-center gap-2 text-[12px] font-medium',
              newPw === confirmPw ? 'text-emerald-600' : 'text-red-500'
            )}>
              {newPw === confirmPw
                ? <><CheckCircle size={13} /> Passwords match</>
                : <><AlertTriangle size={13} /> Passwords do not match</>
              }
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={pwLoading || !currentPw || !newPw || !confirmPw}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <KeyRound size={14} />
            {pwLoading ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </Section>

      {/* ── Danger zone ───────────────────────────────────────────────── */}
      <Section title="Session" icon={Shield}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-800">Sign out of Agrovia</p>
            <p className="text-xs text-neutral-400 mt-0.5">You will be redirected to the login page.</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </Section>
    </div>
  );
}