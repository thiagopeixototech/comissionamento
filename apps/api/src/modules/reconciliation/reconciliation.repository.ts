import { query } from "../../lib/db";

interface ReconciliationRow {
  id: number;
  customer_name: string | null;
  cpf: string | null;
  operator: string | null;
  seller: string | null;
  sale_date: string | null;
  status: string;
  match_score: string;
  applied_rule: string | null;
  divergence_summary: string;
}

export async function fetchReconciliations() {
  const result = await query<ReconciliationRow>(
    `
      SELECT
        r.id,
        ns.customer_name,
        ns.cpf,
        o.name AS operator,
        s.full_name AS seller,
        ns.sale_date::text,
        r.status,
        r.match_score::text,
        rr.name AS applied_rule,
        CASE
          WHEN jsonb_array_length(r.divergences) = 0 THEN 'Sem divergencias'
          ELSE 'Divergencias identificadas'
        END AS divergence_summary
      FROM reconciliations r
      INNER JOIN normalized_sales ns ON ns.id = r.normalized_sale_id
      LEFT JOIN operators o ON o.id = ns.operator_id
      LEFT JOIN sellers s ON s.id = ns.seller_id
      LEFT JOIN reconciliation_rules rr ON rr.id = r.applied_rule_id
      ORDER BY r.created_at DESC
      LIMIT 100
    `
  );

  return result.rows.map((row) => ({
    id: `rec_${row.id}`,
    customerName: row.customer_name ?? "Cliente sem nome",
    cpf: row.cpf ?? "",
    operator: row.operator ?? "Nao informada",
    seller: row.seller ?? "Nao informado",
    saleDate: row.sale_date ?? "",
    status: row.status as
      | "conciliado"
      | "nao_conciliado"
      | "duplicado"
      | "divergente"
      | "pendente_analise"
      | "match_sugerido"
      | "descartado"
      | "comissao_aprovada"
      | "comissao_bloqueada",
    matchScore: Number(row.match_score),
    appliedRule: row.applied_rule ?? "sem_regra",
    divergenceSummary: row.divergence_summary
  }));
}
