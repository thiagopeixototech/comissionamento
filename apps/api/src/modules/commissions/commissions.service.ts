import type { CommissionSummary } from "@teleconcilia/contracts/commissions";
import { mockCommissionSummary } from "../../lib/mock-data";

export function getCommissionSummary(): CommissionSummary {
  return mockCommissionSummary;
}
