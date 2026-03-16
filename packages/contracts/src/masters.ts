export interface CompanyListItem {
  id: string;
  name: string;
  tradeName: string;
  status: "ativa" | "inativa";
  teams: number;
  sellers: number;
}

export interface OperatorListItem {
  id: string;
  name: string;
  code: string;
  status: "ativa" | "inativa";
  reconciliationRate: number;
}

export interface SellerListItem {
  id: string;
  fullName: string;
  companyName: string;
  operatorName: string;
  teamName: string;
  status: "ativa" | "inativa";
}
