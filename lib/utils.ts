import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy');
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy · h:mm a');
}

export function stagePercent(stage: string): number {
  const map: Record<string, number> = {
    Planted: 10,
    Growing: 45,
    Ready: 80,
    Harvested: 100,
  };
  return map[stage] ?? 0;
}