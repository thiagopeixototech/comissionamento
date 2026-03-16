import type { ImportSourceType } from "./core";

export interface ImportListItem {
  id: string;
  sourceType: ImportSourceType;
  company: string;
  operator: string;
  status: string;
  totalRead: number;
  totalValid: number;
  totalRejected: number;
  processingTimeMs: number;
  createdAt: string;
}

export interface ImportWizardOptions {
  sourceTypes: Array<{ value: ImportSourceType; label: string }>;
  companies: Array<{ id: string; name: string }>;
  operators: Array<{ id: string; name: string }>;
  sellers: Array<{ id: string; name: string }>;
}
