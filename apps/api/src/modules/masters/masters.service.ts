import type { CompanyListItem, OperatorListItem, SellerListItem } from "@teleconcilia/contracts";
import { mockCompanies, mockOperators, mockSellers } from "../../lib/mock-data";

export function listCompanies(): CompanyListItem[] {
  return mockCompanies;
}

export function listOperators(): OperatorListItem[] {
  return mockOperators;
}

export function listSellers(): SellerListItem[] {
  return mockSellers;
}
