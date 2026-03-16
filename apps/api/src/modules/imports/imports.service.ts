import type { ImportListItem, ImportWizardOptions } from "@teleconcilia/contracts/imports";
import { mockImportWizardOptions, mockImports } from "../../lib/mock-data";
import { fetchCompanies, fetchOperators, fetchSellers } from "../masters/masters.repository";
import { fetchImports } from "./imports.repository";

export async function listImports(): Promise<ImportListItem[]> {
  try {
    return await fetchImports();
  } catch {
    return mockImports;
  }
}

export async function getImportWizardOptions(): Promise<ImportWizardOptions> {
  try {
    const [companies, operators, sellers] = await Promise.all([
      fetchCompanies(),
      fetchOperators(),
      fetchSellers()
    ]);

    return {
      sourceTypes: [
        { value: "arquivo", label: "Importar por arquivo" },
        { value: "vendas_internas", label: "Vendas internas do sistema" },
        { value: "linha_a_linha", label: "Linha a linha da operadora" }
      ],
      companies: companies.map(({ id, name }) => ({ id, name })),
      operators: operators.map(({ id, name }) => ({ id, name })),
      sellers: sellers.map(({ id, fullName }) => ({ id, name: fullName }))
    };
  } catch {
    return mockImportWizardOptions;
  }
}
