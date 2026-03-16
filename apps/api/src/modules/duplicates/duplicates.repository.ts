import { query } from "../../lib/db";

interface GroupRow {
  id: number;
  customer_name: string | null;
  cpf: string | null;
  record_count: number;
  suggested_primary_sale_id: number | null;
}

interface ItemRow {
  duplicate_group_id: number;
  normalized_sale_id: number;
  seller: string | null;
  sale_date: string | null;
  status: string | null;
  priority_score: string;
  operator_recognition: boolean;
}

export async function fetchDuplicateGroups() {
  const groupsResult = await query<GroupRow>(
    `
      SELECT id, customer_name, cpf, record_count, suggested_primary_sale_id
      FROM duplicate_groups
      ORDER BY created_at DESC
      LIMIT 50
    `
  );

  const itemsResult = await query<ItemRow>(
    `
      SELECT
        di.duplicate_group_id,
        di.normalized_sale_id,
        s.full_name AS seller,
        ns.sale_date::text,
        ns.status_normalized AS status,
        di.priority_score::text,
        EXISTS (
          SELECT 1
          FROM reconciliations r
          WHERE r.normalized_sale_id = ns.id
            AND r.status = 'conciliado'
        ) AS operator_recognition
      FROM duplicate_items di
      INNER JOIN normalized_sales ns ON ns.id = di.normalized_sale_id
      LEFT JOIN sellers s ON s.id = ns.seller_id
    `
  );

  return groupsResult.rows.map((group) => ({
    id: `dup_${group.id}`,
    customerName: group.customer_name ?? "Cliente sem nome",
    cpf: group.cpf ?? "",
    recordCount: group.record_count,
    suggestedRecordId: group.suggested_primary_sale_id
      ? `sale_${group.suggested_primary_sale_id}`
      : "sem_sugestao",
    conflictLevel: group.record_count > 2 ? "medio" : "alto",
    items: itemsResult.rows
      .filter((item) => item.duplicate_group_id === group.id)
      .map((item) => ({
        id: `sale_${item.normalized_sale_id}`,
        seller: item.seller ?? "Nao informado",
        saleDate: item.sale_date ?? "",
        status: item.status ?? "pendente",
        operatorRecognition: item.operator_recognition,
        priorityScore: Number(item.priority_score)
      }))
  }));
}
