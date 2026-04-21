// app/agent/layout.tsx
'use client';

import { Sidebar } from '@/components/Sidebar';
import { MobileTopbar } from '@/components/MobileTopbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth?mode=login');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || role !== 'agent') {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}