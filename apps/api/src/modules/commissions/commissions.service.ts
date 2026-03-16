import type { CommissionSummary } from "@teleconcilia/contracts/commissions";
import { mockCommissionSummary } from "../../lib/mock-data";
import { fetchCommissionSummary } from "./commissions.repository";

export async function getCommissionSummary(): Promise<CommissionSummary> {
  try {
    const data = await fetchCommissionSummary();

    return {
      referencePeriod: "2026-03-01",
      totals: {
        totalSales: Number(data.totals?.total_sales ?? 0),
        totalReconciled: Number(data.totals?.total_reconciled ?? 0),
        totalInstalled: Number(data.totals?.total_installed ?? 0),
        totalNotInstalled: Number(data.totals?.total_not_installed ?? 0),
        totalDivergent: Number(data.totals?.total_divergent ?? 0),
        totalCommissionableValue: Number(data.totals?.total_commissionable_value ?? 0),
        totalCommissionAmount: Number(data.totals?.total_commission_amount ?? 0),
        totalBlockedAmount: Number(data.totals?.total_blocked_amount ?? 0),
        totalPendingAmount: Number(data.totals?.total_pending_amount ?? 0),
        totalAdjustedAmount: Number(data.totals?.total_adjusted_amount ?? 0)
      },
      sellers: data.sellers.map((seller) => ({
        sellerId: String(seller.seller_id),
        sellerName: seller.seller_name,
        totalSales: Number(seller.total_sales),
        reconciledSales: Number(seller.reconciled_sales),
        installedSales: Number(seller.installed_sales),
        divergentSales: Number(seller.divergent_sales),
        commissionableValue: Number(seller.commissionable_value),
        commissionAmount: Number(seller.commission_amount),
        adjustments: 0,
        notes: "Calculado a partir da base persistida"
      }))
    };
  } catch {
    return mockCommissionSummary;
  }
}
