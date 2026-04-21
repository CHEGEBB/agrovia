/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';

export function useSidebar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_open');
    if (saved !== null) setOpen(saved === 'true');
  }, []);

  const toggle = () => {
    setOpen((v) => {
      localStorage.setItem('sidebar_open', String(!v));
      return !v;
    });
  };

  return { open, toggle, setOpen };
}