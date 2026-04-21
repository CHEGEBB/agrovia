import type { Field, Status } from '@/types';
import { differenceInDays, parseISO } from 'date-fns';

export function computeStatus(field: Field): Status {
  const now = new Date();
  const planting = parseISO(field.plantingDate);
  const lastUpdated = parseISO(field.lastUpdated);

  const daysSincePlanting = differenceInDays(now, planting);
  const daysSinceLastUpdate = differenceInDays(now, lastUpdated);

  if (field.currentStage === 'Harvested') return 'Completed';
  if (
    (field.currentStage === 'Growing' && daysSincePlanting > 90) ||
    daysSinceLastUpdate > 30
  )
    return 'At Risk';
  return 'Active';
}