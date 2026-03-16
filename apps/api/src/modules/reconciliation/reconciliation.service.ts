import type { ReconciliationListItem } from "@teleconcilia/contracts/reconciliation";
import { mockReconciliations } from "../../lib/mock-data";

export function getReconciliationList(): ReconciliationListItem[] {
  return mockReconciliations;
}
