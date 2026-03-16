import { query } from "../../lib/db";

interface CompanyRow {
  id: number;
  name: string;
  trade_name: string | null;
  status: "ativa" | "inativa";
  teams: string;
  sellers: string;
}

interface OperatorRow {
  id: number;
  name: string;
  code: string;
  status: "ativa" | "inativa";
  reconciliation_rate: string;
}

interface SellerRow {
  id: number;
  full_name: string;
  company_name: string;
  operator_name: string | null;
  team_name: string | null;
  status: "ativa" | "inativa";
}

export async function fetchCompanies() {
  const result = await query<CompanyRow>(
    `
      SELECT
        c.id,
        c.name,
        c.name AS trade_name,
        CASE WHEN c.is_active THEN 'ativa' ELSE 'inativa' END AS status,
        COUNT(DISTINCT t.id)::text AS teams,
        COUNT(DISTINCT s.id)::text AS sellers
      FROM companies c
      LEFT JOIN teams t ON t.company_id = c.id
      LEFT JOIN sellers s ON s.company_id = c.id
      GROUP BY c.id, c.name, c.is_active
      ORDER BY c.name
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    tradeName: row.trade_name ?? row.name,
    status: row.status,
    teams: Number(row.teams),
    sellers: Number(row.sellers)
  }));
}

export async function fetchOperators() {
  const result = await query<OperatorRow>(
    `
      SELECT
        o.id,
        o.name,
        o.code,
        CASE WHEN o.is_active THEN 'ativa' ELSE 'inativa' END AS status,
        COALESCE(AVG(CASE WHEN r.status = 'conciliado' THEN 100 ELSE 65 END), 0)::numeric(5,2)::text AS reconciliation_rate
      FROM operators o
      LEFT JOIN normalized_sales ns ON ns.operator_id = o.id
      LEFT JOIN reconciliations r ON r.normalized_sale_id = ns.id
      GROUP BY o.id, o.name, o.code, o.is_active
      ORDER BY o.name
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    code: row.code,
    status: row.status,
    reconciliationRate: Math.round(Number(row.reconciliation_rate))
  }));
}

export async function fetchSellers() {
  const result = await query<SellerRow>(
    `
      SELECT
        s.id,
        s.full_name,
        c.name AS company_name,
        COALESCE(o.name, 'Nao vinculada') AS operator_name,
        COALESCE(t.name, 'Sem equipe') AS team_name,
        CASE WHEN s.is_active THEN 'ativa' ELSE 'inativa' END AS status
      FROM sellers s
      LEFT JOIN companies c ON c.id = s.company_id
      LEFT JOIN teams t ON t.id = s.team_id
      LEFT JOIN normalized_sales ns ON ns.seller_id = s.id
      LEFT JOIN operators o ON o.id = ns.operator_id
      ORDER BY s.full_name
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    fullName: row.full_name,
    companyName: row.company_name,
    operatorName: row.operator_name ?? "Nao vinculada",
    teamName: row.team_name ?? "Sem equipe",
    status: row.status
  }));
}
