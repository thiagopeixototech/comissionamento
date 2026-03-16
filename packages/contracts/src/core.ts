export type ReconciliationStatus =
  | "conciliado"
  | "nao_conciliado"
  | "duplicado"
  | "divergente"
  | "pendente_analise"
  | "match_sugerido"
  | "descartado"
  | "comissao_aprovada"
  | "comissao_bloqueada";

export type ImportSourceType =
  | "arquivo"
  | "vendas_internas"
  | "linha_a_linha"
  | "operadora"
  | "auxiliar";
