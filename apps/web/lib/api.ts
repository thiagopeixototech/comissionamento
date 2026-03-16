import type {
  CommissionSummary,
  CompanyListItem,
  DashboardSummary,
  DuplicateGroup,
  ImportListItem,
  OperatorListItem,
  ReconciliationListItem,
  SellerListItem
} from "@teleconcilia/contracts";
import {
  commissionSummary as commissionSummaryFallback,
  companies as companiesFallback,
  dashboardSummary as dashboardFallback,
  duplicateGroups as duplicatesFallback,
  imports as importsFallback,
  operators as operatorsFallback,
  reconciliations as reconciliationsFallback,
  sellers as sellersFallback
} from "./mock-data";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getDashboardSummary() {
  return fetchJson<DashboardSummary>("/dashboard/summary", dashboardFallback);
}

export function getCompanies() {
  return fetchJson<CompanyListItem[]>("/masters/companies", companiesFallback);
}

export function getOperators() {
  return fetchJson<OperatorListItem[]>("/masters/operators", operatorsFallback);
}

export function getSellers() {
  return fetchJson<SellerListItem[]>("/masters/sellers", sellersFallback);
}

export function getImports() {
  return fetchJson<ImportListItem[]>("/imports", importsFallback);
}

export function getReconciliations() {
  return fetchJson<ReconciliationListItem[]>("/reconciliations", reconciliationsFallback);
}

export function getDuplicateGroups() {
  return fetchJson<DuplicateGroup[]>("/duplicates", duplicatesFallback);
}

export function getCommissionSummary() {
  return fetchJson<CommissionSummary>("/commissions/summary", commissionSummaryFallback);
}
