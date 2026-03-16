export interface DashboardChartItem {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalImportedSales: number;
  totalReconciled: number;
  totalNotReconciled: number;
  reconciliationRate: number;
  totalDuplicates: number;
  totalDivergences: number;
  totalInstalled: number;
  estimatedCommission: number;
  approvedCommission: number;
  blockedCommission: number;
  charts: {
    salesByPeriod: DashboardChartItem[];
    reconciliationByOperator: DashboardChartItem[];
    commissionBySeller: DashboardChartItem[];
  };
}
