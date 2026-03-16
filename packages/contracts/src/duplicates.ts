export interface DuplicateItem {
  id: string;
  seller: string;
  saleDate: string;
  status: string;
  operatorRecognition: boolean;
  priorityScore: number;
}

export interface DuplicateGroup {
  id: string;
  customerName: string;
  cpf: string;
  recordCount: number;
  suggestedRecordId: string;
  conflictLevel: "baixo" | "medio" | "alto";
  items: DuplicateItem[];
}
