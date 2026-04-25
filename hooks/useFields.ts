/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFields.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Stage = 'Planted' | 'Growing' | 'Ready' | 'Harvested';
export type Status = 'Active' | 'At Risk' | 'Completed';

export interface Field {
  id: string;
  name: string;
  crop: string;
  plantingDate: string;
  stage: Stage;
  status: Status;
  assignedTo: string | null;
  agentName?: string;
  notes: { id: string; text: string; date: string }[];
  lastUpdate: string;
}

// Compute status based on rules:
// - Harvested        → Completed
// - Ready            → At Risk (needs action)
// - Growing >90 days → At Risk
// - No update >14d   → At Risk
// - Otherwise        → Active
const computeStatus = (stage: Stage, plantingDate: string, lastUpdate: string): Status => {
  if (stage === 'Harvested') return 'Completed';
  const daysSincePlanting = Math.floor(
    (Date.now() - new Date(plantingDate).getTime()) / 86_400_000
  );
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(lastUpdate).getTime()) / 86_400_000
  );
  if (stage === 'Ready') return 'At Risk';
  if (stage === 'Growing' && daysSincePlanting > 90) return 'At Risk';
  if (daysSinceUpdate > 14) return 'At Risk';
  return 'Active';
};

// Helper: date string N days ago
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const initialFields: Field[] = [
  {
    id: '1',
    name: 'Ol Kalou Block A',
    crop: 'Maize',
    plantingDate: daysAgo(45),
    stage: 'Growing',
    status: 'Active',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n1a', text: 'Planted with certified hybrid seeds, 90cm row spacing.', date: daysAgo(45) },
      { id: 'n1b', text: 'Good germination observed across all rows.', date: daysAgo(38) },
      { id: 'n1c', text: 'First round of fertilizer applied. Growth looks healthy.', date: daysAgo(10) },
    ],
    lastUpdate: daysAgo(10),
  },
  {
    id: '2',
    name: 'Ol Kalou Block B',
    crop: 'Wheat',
    plantingDate: daysAgo(110),
    stage: 'Ready',
    status: 'At Risk',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n2a', text: 'Crop is golden and ready for harvest. Awaiting equipment.', date: daysAgo(5) },
    ],
    lastUpdate: daysAgo(5),
  },
  {
    id: '3',
    name: 'Mwea Section 3',
    crop: 'Soybeans',
    plantingDate: daysAgo(95),
    stage: 'Growing',
    status: 'At Risk',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n3a', text: 'Slow growth detected on western side, possible drainage issue.', date: daysAgo(60) },
      { id: 'n3b', text: 'Pest activity spotted. Pesticide applied to affected rows.', date: daysAgo(30) },
    ],
    lastUpdate: daysAgo(30),
  },
  {
    id: '4',
    name: 'Mwea Section 4',
    crop: 'Maize',
    plantingDate: daysAgo(180),
    stage: 'Harvested',
    status: 'Completed',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n4a', text: 'Harvest completed. Yield: 4.2 tonnes per acre.', date: daysAgo(20) },
    ],
    lastUpdate: daysAgo(20),
  },
  {
    id: '5',
    name: 'Kinangop Upper',
    crop: 'Sorghum',
    plantingDate: daysAgo(12),
    stage: 'Planted',
    status: 'Active',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n5a', text: 'Soil prepared and seeds sown. Irrigation scheduled.', date: daysAgo(12) },
    ],
    lastUpdate: daysAgo(3),
  },
  {
    id: '6',
    name: 'Kinangop Lower',
    crop: 'Sunflower',
    plantingDate: daysAgo(70),
    stage: 'Growing',
    status: 'Active',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n6a', text: 'Sunflowers reaching 1.2m height. Looking strong.', date: daysAgo(8) },
    ],
    lastUpdate: daysAgo(8),
  },
  {
    id: '7',
    name: 'Njabini Plot 1',
    crop: 'Cassava',
    plantingDate: daysAgo(200),
    stage: 'Harvested',
    status: 'Completed',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n7a', text: 'Cassava harvest done. Good root yield, storage arranged.', date: daysAgo(15) },
    ],
    lastUpdate: daysAgo(15),
  },
  {
    id: '8',
    name: 'Njabini Plot 2',
    crop: 'Beans',
    plantingDate: daysAgo(55),
    stage: 'Ready',
    status: 'At Risk',
    assignedTo: 'agent1',
    agentName: 'John Mwangi',
    notes: [
      { id: 'n8a', text: 'Beans fully matured and pods are drying. Harvest window is narrow.', date: daysAgo(4) },
    ],
    lastUpdate: daysAgo(4),
  },
];

interface FieldsState {
  [x: string]: any;
  fields: Field[];
  addField: (field: { name: string; crop: string; plantingDate: string; stage: Stage; assignedTo: string | null }) => void;
  updateFieldStage: (fieldId: string, newStage: Stage) => void;
  addNote: (fieldId: string, noteText: string) => void;
  assignField: (fieldId: string, agentId: string, agentName: string) => void;
  deleteField: (fieldId: string) => void;
  getFieldsByAgent: (agentId: string) => Field[];
  getStats: (agentId?: string) => { total: number; active: number; atRisk: number; completed: number };
}

export const useFields = create<FieldsState>()(
  persist(
    (set, get) => ({
      fields: initialFields,

      addField: (fieldData) => {
        const now = new Date().toISOString();
        const newField: Field = {
          id: Date.now().toString(),
          ...fieldData,
          status: 'Active',
          notes: [{ id: Date.now().toString(), text: 'Field created.', date: now }],
          lastUpdate: now,
        };
        set((state) => ({ fields: [...state.fields, newField] }));
      },

      updateFieldStage: (fieldId, newStage) => {
        set((state) => ({
          fields: state.fields.map((f) => {
            if (f.id !== fieldId) return f;
            const now = new Date().toISOString();
            const updated = { ...f, stage: newStage, lastUpdate: now };
            updated.status = computeStatus(updated.stage, updated.plantingDate, updated.lastUpdate);
            return updated;
          }),
        }));
      },

      addNote: (fieldId, noteText) => {
        set((state) => ({
          fields: state.fields.map((f) => {
            if (f.id !== fieldId) return f;
            const now = new Date().toISOString();
            const updated = {
              ...f,
              notes: [...f.notes, { id: Date.now().toString(), text: noteText, date: now }],
              lastUpdate: now,
            };
            updated.status = computeStatus(updated.stage, updated.plantingDate, updated.lastUpdate);
            return updated;
          }),
        }));
      },

      assignField: (fieldId, agentId, agentName) => {
        set((state) => ({
          fields: state.fields.map((f) =>
            f.id === fieldId ? { ...f, assignedTo: agentId, agentName } : f
          ),
        }));
      },

      deleteField: (fieldId) => {
        set((state) => ({ fields: state.fields.filter((f) => f.id !== fieldId) }));
      },

      getFieldsByAgent: (agentId) => {
        return get().fields.filter((f) => f.assignedTo === agentId);
      },

      getStats: (agentId) => {
        const target = agentId ? get().fields.filter((f) => f.assignedTo === agentId) : get().fields;
        return {
          total:     target.length,
          active:    target.filter((f) => f.status === 'Active').length,
          atRisk:    target.filter((f) => f.status === 'At Risk').length,
          completed: target.filter((f) => f.status === 'Completed').length,
        };
      },
    }),
    { name: 'smartseason-fields' }
  )
);