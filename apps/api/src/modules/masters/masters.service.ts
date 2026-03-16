import type { CompanyListItem, OperatorListItem, SellerListItem } from "@teleconcilia/contracts";
import { mockCompanies, mockOperators, mockSellers } from "../../lib/mock-data";
import { fetchCompanies, fetchOperators, fetchSellers } from "./masters.repository";

export async function listCompanies(): Promise<CompanyListItem[]> {
  try {
    return await fetchCompanies();
  } catch {
    return mockCompanies;
  }
}

export async function listOperators(): Promise<OperatorListItem[]> {
  try {
    return await fetchOperators();
  } catch {
    return mockOperators;
  }
}

export async function listSellers(): Promise<SellerListItem[]> {
  try {
    return await fetchSellers();
  } catch {
    return mockSellers;
  }
}
