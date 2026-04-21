/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAdminUsers.ts
'use client';
import { useState, useEffect, useCallback } from 'react';

export interface AppwriteUserRecord {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  status: boolean;
  $createdAt: string;
  prefs: { role?: string };
}

interface AdminUsersState {
  users: AppwriteUserRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminUsers(): AdminUsersState {
  const [users, setUsers] = useState<AppwriteUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { users, loading, error, refresh };
}