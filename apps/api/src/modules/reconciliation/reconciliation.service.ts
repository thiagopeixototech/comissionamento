import type { ReconciliationListItem } from "@teleconcilia/contracts/reconciliation";
import { mockReconciliations } from "../../lib/mock-data";
import { fetchReconciliations } from "./reconciliation.repository";

export async function getReconciliationList(): Promise<ReconciliationListItem[]> {
  try {
    return await fetchReconciliations();
  } catch {
    return mockReconciliations;
  }
}
