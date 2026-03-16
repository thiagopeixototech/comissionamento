import type { DashboardSummary } from "@teleconcilia/contracts/dashboard";
import { mockDashboardSummary } from "../../lib/mock-data";
import { fetchDashboardSummaryNumbers } from "./dashboard.repository";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const row = await fetchDashboardSummaryNumbers();
    const totalImportedSales = Number(row?.total_imported_sales ?? 0);
    const totalReconciled = Number(row?.total_reconciled ?? 0);
    const totalNotReconciled = Number(row?.total_not_reconciled ?? 0);

    return {
      totalImportedSales,
      totalReconciled,
      totalNotReconciled,
      reconciliationRate:
        totalImportedSales === 0 ? 0 : Number(((totalReconciled / totalImportedSales) * 100).toFixed(2)),
      totalDuplicates: Number(row?.total_duplicates ?? 0),
      totalDivergences: Number(row?.total_divergences ?? 0),
      totalInstalled: Number(row?.total_installed ?? 0),
      estimatedCommission: Number(row?.estimated_commission ?? 0),
      approvedCommission: Number(row?.approved_commission ?? 0),
      blockedCommission: Number(row?.blocked_commission ?? 0),
      charts: {
        salesByPeriod: [
          { label: "Atual", value: totalImportedSales }
        ],
        reconciliationByOperator: [],
        commissionBySeller: []
      }
    };
  } catch {
    return mockDashboardSummary;
  }
}
