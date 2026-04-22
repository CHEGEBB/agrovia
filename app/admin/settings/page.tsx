/* eslint-disable react-hooks/set-state-in-effect */
// app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Shield, User, LogOut, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'admin@agrovia.com';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Read from localStorage — no Appwrite
    const stored = localStorage.getItem('agrovia:adminEmail') ?? ADMIN_EMAIL;
    setAdminEmail(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agrovia:admin');
    localStorage.removeItem('agrovia:adminEmail');
    router.replace('/admin-auth');
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={14} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Admin · Settings</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage your admin account</p>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-neutral-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={15} className="text-neutral-500" />
          <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Profile</h2>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-emerald-100 flex items-center justify-center rounded-sm relative">
            <span className="text-xl font-black text-emerald-700">A</span>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
              <Shield size={10} className="text-white" />
            </span>
          </div>
          <div>
            <p className="font-black text-neutral-900 text-lg">Admin</p>
            <p className="text-sm text-neutral-400">{adminEmail}</p>
            <span className="inline-flex mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Administrator
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Name',  value: 'Admin' },
            { label: 'Email', value: adminEmail },
            { label: 'Role',  value: 'Admin / Coordinator' },
            { label: 'Auth',  value: 'Hardcoded' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-neutral-50 p-3 rounded-sm">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-neutral-800 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={15} className="text-red-500" />
          <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-800">Sign out</p>
            <p className="text-xs text-neutral-400 mt-0.5">You will be redirected to the admin login page.</p>
          </div>
          {logoutConfirm ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="px-3 py-1.5 border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLogoutConfirm(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          )}
        </div>
      </div>

      {/* System info */}
      <div className="bg-neutral-50 border border-neutral-200 p-5">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">System</p>
        <div className="space-y-2">
          {[
            { label: 'App',      value: 'Agrovia Field Monitor' },
            { label: 'Version',  value: '1.0.0' },
            { label: 'Database', value: 'Appwrite (Cloud)' },
            { label: 'Storage',  value: 'Zustand + localStorage' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-neutral-200 last:border-0">
              <span className="text-[12px] text-neutral-500">{label}</span>
              <span className="text-[12px] font-semibold text-neutral-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}