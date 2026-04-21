export type Stage = 'Planted' | 'Growing' | 'Ready' | 'Harvested';
export type Status = 'Active' | 'At Risk' | 'Completed';
export type Role = 'admin' | 'agent';

export interface StageUpdate {
  id: string;
  stage: Stage;
  note: string;
  updatedAt: string; // ISO string
  updatedBy: string; // user ID
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  location: string;
  plantingDate: string; // ISO string
  assignedTo: string; // agent user ID
  assignedToName: string;
  currentStage: Stage;
  status: Status;
  lastUpdated: string; // ISO string
  hectares: number;
  updates: StageUpdate[];
}

export interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  $createdAt?: string;
  prefs: {
    role: Role;
  };
}