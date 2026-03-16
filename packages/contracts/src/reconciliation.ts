import type { ReconciliationStatus } from "./core";

export interface ReconciliationListItem {
  id: string;
  customerName: string;
  cpf: string;
  operator: string;
  seller: string;
  saleDate: string;
  status: ReconciliationStatus;
  matchScore: number;
  appliedRule: string;
  divergenceSummary: string;
}
