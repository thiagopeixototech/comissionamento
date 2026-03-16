import type { ImportListItem, ImportWizardOptions } from "@teleconcilia/contracts/imports";
import { mockImports, mockImportWizardOptions } from "../../lib/mock-data";

export function listImports(): ImportListItem[] {
  return mockImports;
}

export function getImportWizardOptions(): ImportWizardOptions {
  return mockImportWizardOptions;
}
