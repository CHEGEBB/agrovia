/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import type { AppwriteUser, Role } from '@/types';

interface AuthState {
  user: AppwriteUser | null;
  loading: boolean;
  role: Role | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, role: null });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const user = await authService.getUser();
    setState({ user, loading: false, role: (user?.prefs?.role as Role) ?? null });
  }, []);

  useEffect(() => { refresh(); }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    const role = (user?.prefs?.role as Role) ?? 'agent';
    setState({ user, loading: false, role });
    return user;
  };

  const register = async (name: string, email: string, password: string, role: Role = 'agent') => {
    const user = await authService.register(name, email, password, role);
    setState({ user, loading: false, role });
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setState({ user: null, loading: false, role: null });
  };

  return { ...state, login, register, logout, refresh };
}