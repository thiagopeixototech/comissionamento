export interface CommissionTotals {
  totalSales: number;
  totalReconciled: number;
  totalInstalled: number;
  totalNotInstalled: number;
  totalDivergent: number;
  totalCommissionableValue: number;
  totalCommissionAmount: number;
  totalBlockedAmount: number;
  totalPendingAmount: number;
  totalAdjustedAmount: number;
}

export interface CommissionSellerSummary {
  sellerId: string;
  sellerName: string;
  totalSales: number;
  reconciledSales: number;
  installedSales: number;
  divergentSales: number;
  commissionableValue: number;
  commissionAmount: number;
  adjustments: number;
  notes: string;
}

export interface CommissionSummary {
  referencePeriod: string;
  totals: CommissionTotals;
  sellers: CommissionSellerSummary[];
}
