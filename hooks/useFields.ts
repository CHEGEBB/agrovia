'use client';
import { create } from 'zustand';
import { fields as initialFields } from '@/lib/data';
import { computeStatus } from '@/lib/statusLogic';
import { ID } from 'appwrite';
import type { Field, Stage } from '@/types';

interface FieldsStore {
  fields: Field[];
  updateStage: (fieldId: string, stage: Stage, note: string, userId: string) => void;
  assignField: (fieldId: string, agentId: string, agentName: string) => void;
}

export const useFields = create<FieldsStore>((set) => ({
  fields: initialFields,

  updateStage(fieldId, stage, note, userId) {
    set((state) => ({
      fields: state.fields.map((f) => {
        if (f.id !== fieldId) return f;
        const now = new Date().toISOString();
        const updated: Field = {
          ...f,
          currentStage: stage,
          lastUpdated: now,
          updates: [
            ...f.updates,
            { id: ID.unique(), stage, note, updatedAt: now, updatedBy: userId },
          ],
        };
        updated.status = computeStatus(updated);
        return updated;
      }),
    }));
  },

  assignField(fieldId, agentId, agentName) {
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === fieldId ? { ...f, assignedTo: agentId, assignedToName: agentName } : f
      ),
    }));
  },
}));