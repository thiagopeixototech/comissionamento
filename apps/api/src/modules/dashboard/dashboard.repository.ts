import { query } from "../../lib/db";

interface SummaryRow {
  total_imported_sales: string;
  total_reconciled: string;
  total_not_reconciled: string;
  total_duplicates: string;
  total_divergences: string;
  total_installed: string;
  estimated_commission: string;
  approved_commission: string;
  blocked_commission: string;
}

export async function fetchDashboardSummaryNumbers() {
  const result = await query<SummaryRow>(
    `
      WITH sales_totals AS (
        SELECT COUNT(*)::text AS total_imported_sales
        FROM normalized_sales
      ),
      reconciliation_totals AS (
        SELECT
          COUNT(*) FILTER (WHERE status = 'conciliado')::text AS total_reconciled,
          COUNT(*) FILTER (WHERE status <> 'conciliado')::text AS total_not_reconciled,
          COUNT(*) FILTER (WHERE status = 'divergente')::text AS total_divergences
        FROM reconciliations
      ),
      duplicate_totals AS (
        SELECT COALESCE(SUM(record_count), 0)::text AS total_duplicates
        FROM duplicate_groups
      ),
      installation_totals AS (
        SELECT COUNT(*) FILTER (WHERE status_normalized = 'instalada')::text AS total_installed
        FROM normalized_sales
      ),
      commission_totals AS (
        SELECT
          COALESCE(SUM(commission_amount), 0)::text AS estimated_commission,
          COALESCE(SUM(commission_amount) FILTER (WHERE commission_status = 'aprovada'), 0)::text AS approved_commission,
          COALESCE(SUM(commission_amount) FILTER (WHERE commission_status = 'bloqueada'), 0)::text AS blocked_commission
        FROM commission_items
      )
      SELECT *
      FROM sales_totals, reconciliation_totals, duplicate_totals, installation_totals, commission_totals
    `
  );

  return result.rows[0];
}
