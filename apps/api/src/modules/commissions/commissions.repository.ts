import { query } from "../../lib/db";

interface TotalsRow {
  total_sales: string;
  total_reconciled: string;
  total_installed: string;
  total_not_installed: string;
  total_divergent: string;
  total_commissionable_value: string;
  total_commission_amount: string;
  total_blocked_amount: string;
  total_pending_amount: string;
  total_adjusted_amount: string;
}

interface SellerRow {
  seller_id: number;
  seller_name: string;
  total_sales: string;
  reconciled_sales: string;
  installed_sales: string;
  divergent_sales: string;
  commissionable_value: string;
  commission_amount: string;
}

export async function fetchCommissionSummary() {
  const totalsResult = await query<TotalsRow>(
    `
      WITH seller_sales AS (
        SELECT
          COUNT(ns.id)::text AS total_sales,
          COUNT(ns.id) FILTER (WHERE r.status = 'conciliado')::text AS total_reconciled,
          COUNT(ns.id) FILTER (WHERE ns.status_normalized = 'instalada')::text AS total_installed,
          COUNT(ns.id) FILTER (WHERE ns.status_normalized <> 'instalada')::text AS total_not_installed,
          COUNT(ns.id) FILTER (WHERE r.status = 'divergente')::text AS total_divergent
        FROM normalized_sales ns
        LEFT JOIN reconciliations r ON r.normalized_sale_id = ns.id
      )
      SELECT
        ss.total_sales,
        ss.total_reconciled,
        ss.total_installed,
        ss.total_not_installed,
        ss.total_divergent,
        COALESCE(SUM(ci.commissionable_value), 0)::text AS total_commissionable_value,
        COALESCE(SUM(ci.commission_amount), 0)::text AS total_commission_amount,
        COALESCE(SUM(ci.commission_amount) FILTER (WHERE ci.commission_status = 'bloqueada'), 0)::text AS total_blocked_amount,
        COALESCE(SUM(ci.commission_amount) FILTER (WHERE ci.commission_status = 'pendente'), 0)::text AS total_pending_amount,
        COALESCE(SUM(ci.commission_amount) FILTER (WHERE ci.commission_status = 'ajustada'), 0)::text AS total_adjusted_amount
      FROM seller_sales ss
      LEFT JOIN commission_items ci ON TRUE
      GROUP BY ss.total_sales, ss.total_reconciled, ss.total_installed, ss.total_not_installed, ss.total_divergent
    `
  );

  const sellersResult = await query<SellerRow>(
    `
      SELECT
        s.id AS seller_id,
        s.full_name AS seller_name,
        COUNT(ns.id)::text AS total_sales,
        COUNT(ns.id) FILTER (WHERE r.status = 'conciliado')::text AS reconciled_sales,
        COUNT(ns.id) FILTER (WHERE ns.status_normalized = 'instalada')::text AS installed_sales,
        COUNT(ns.id) FILTER (WHERE r.status = 'divergente')::text AS divergent_sales,
        COALESCE(SUM(ci.commissionable_value), 0)::text AS commissionable_value,
        COALESCE(SUM(ci.commission_amount), 0)::text AS commission_amount
      FROM sellers s
      LEFT JOIN normalized_sales ns ON ns.seller_id = s.id
      LEFT JOIN reconciliations r ON r.normalized_sale_id = ns.id
      LEFT JOIN commission_items ci ON ci.normalized_sale_id = ns.id
      GROUP BY s.id, s.full_name
      ORDER BY s.full_name
      LIMIT 100
    `
  );

  return {
    totals: totalsResult.rows[0],
    sellers: sellersResult.rows
  };
}
