// app/admin/layout.tsx
'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminMobileTopbar } from '@/components/AdminMobileTopbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await authService.getUser();
        if (user && user.prefs?.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.replace('/auth');
        }
      } catch {
        router.replace('/auth');
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminMobileTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}