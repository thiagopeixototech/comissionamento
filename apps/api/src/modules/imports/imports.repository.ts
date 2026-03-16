import { query } from "../../lib/db";

interface ImportRow {
  id: number;
  source_type: string;
  company: string | null;
  operator: string | null;
  status: string;
  total_read: number;
  total_valid: number;
  total_rejected: number;
  processing_time_ms: number | null;
  created_at: string;
}

export async function fetchImports() {
  const result = await query<ImportRow>(
    `
      SELECT
        i.id,
        i.source_type,
        c.name AS company,
        o.name AS operator,
        i.status,
        i.total_read,
        i.total_valid,
        i.total_rejected,
        i.processing_time_ms,
        i.created_at::text
      FROM imports i
      LEFT JOIN companies c ON c.id = i.company_id
      LEFT JOIN operators o ON o.id = i.operator_id
      ORDER BY i.created_at DESC
      LIMIT 100
    `
  );

  return result.rows.map((row) => ({
    id: `imp_${row.id}`,
    sourceType: row.source_type as
      | "arquivo"
      | "vendas_internas"
      | "linha_a_linha"
      | "operadora"
      | "auxiliar",
    company: row.company ?? "Nao informada",
    operator: row.operator ?? "Nao informada",
    status: row.status,
    totalRead: row.total_read,
    totalValid: row.total_valid,
    totalRejected: row.total_rejected,
    processingTimeMs: row.processing_time_ms ?? 0,
    createdAt: row.created_at
  }));
}
