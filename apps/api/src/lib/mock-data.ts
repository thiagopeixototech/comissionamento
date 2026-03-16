import type {
  AuthSession,
  CommissionSummary,
  CompanyListItem,
  DashboardSummary,
  DuplicateGroup,
  ImportListItem,
  ImportWizardOptions,
  OperatorListItem,
  ReconciliationListItem,
  SellerListItem
} from "@teleconcilia/contracts";

export const mockSession: AuthSession = {
  accessToken: "teleconcilia-mvp-token",
  user: {
    id: "usr_001",
    fullName: "Administrador TeleConcilia",
    email: "admin@teleconcilia.local",
    roles: ["administrador", "auditor"]
  }
};

export const mockCompanies: CompanyListItem[] = [
  {
    id: "cmp_01",
    name: "Conecta Sul",
    tradeName: "Conecta Sul Telecom",
    status: "ativa",
    teams: 4,
    sellers: 36
  },
  {
    id: "cmp_02",
    name: "Foco Telecom",
    tradeName: "Foco Telecom Vendas",
    status: "ativa",
    teams: 3,
    sellers: 24
  },
  {
    id: "cmp_03",
    name: "Nexa Fibra",
    tradeName: "Nexa Fibra",
    status: "inativa",
    teams: 1,
    sellers: 8
  }
];

export const mockOperators: OperatorListItem[] = [
  {
    id: "op_01",
    name: "Vivo",
    code: "VIVO",
    status: "ativa",
    reconciliationRate: 84
  },
  {
    id: "op_02",
    name: "Claro",
    code: "CLARO",
    status: "ativa",
    reconciliationRate: 76
  },
  {
    id: "op_03",
    name: "Tim",
    code: "TIM",
    status: "ativa",
    reconciliationRate: 71
  }
];

export const mockSellers: SellerListItem[] = [
  {
    id: "sel_01",
    fullName: "Marina Costa",
    companyName: "Conecta Sul",
    operatorName: "Vivo",
    status: "ativa",
    teamName: "Inside Sales Sul"
  },
  {
    id: "sel_02",
    fullName: "Carlos Neri",
    companyName: "Conecta Sul",
    operatorName: "Claro",
    status: "ativa",
    teamName: "B2C Sul"
  },
  {
    id: "sel_03",
    fullName: "Joana Luz",
    companyName: "Foco Telecom",
    operatorName: "Tim",
    status: "ativa",
    teamName: "Field Regional"
  }
];

export const mockDashboardSummary: DashboardSummary = {
  totalImportedSales: 128430,
  totalReconciled: 101245,
  totalNotReconciled: 18240,
  reconciliationRate: 78.83,
  totalDuplicates: 4210,
  totalDivergences: 3674,
  totalInstalled: 92458,
  estimatedCommission: 1845230.44,
  approvedCommission: 1629980.02,
  blockedCommission: 215250.42,
  charts: {
    salesByPeriod: [
      { label: "Nov", value: 38120 },
      { label: "Dez", value: 42010 },
      { label: "Jan", value: 48300 }
    ],
    reconciliationByOperator: [
      { label: "Vivo", value: 84 },
      { label: "Claro", value: 76 },
      { label: "Tim", value: 71 }
    ],
    commissionBySeller: [
      { label: "Marina Costa", value: 132500.14 },
      { label: "Carlos Neri", value: 127830.4 },
      { label: "Joana Luz", value: 121480.2 }
    ]
  }
};

export const mockImports: ImportListItem[] = [
  {
    id: "imp_001",
    sourceType: "arquivo",
    company: "Conecta Sul",
    operator: "Vivo",
    status: "processado",
    totalRead: 24876,
    totalValid: 24102,
    totalRejected: 774,
    processingTimeMs: 18240,
    createdAt: "2026-03-10T14:22:00Z"
  },
  {
    id: "imp_002",
    sourceType: "linha_a_linha",
    company: "Conecta Sul",
    operator: "Claro",
    status: "normalizado",
    totalRead: 33210,
    totalValid: 32901,
    totalRejected: 309,
    processingTimeMs: 26110,
    createdAt: "2026-03-11T09:14:00Z"
  },
  {
    id: "imp_003",
    sourceType: "vendas_internas",
    company: "Foco Telecom",
    operator: "Multi",
    status: "pendente_conciliacao",
    totalRead: 14520,
    totalValid: 14520,
    totalRejected: 0,
    processingTimeMs: 6120,
    createdAt: "2026-03-12T16:40:00Z"
  }
];

export const mockImportWizardOptions: ImportWizardOptions = {
  sourceTypes: [
    { value: "arquivo", label: "Importar por arquivo" },
    { value: "vendas_internas", label: "Vendas internas do sistema" },
    { value: "linha_a_linha", label: "Linha a linha da operadora" }
  ],
  companies: mockCompanies.map(({ id, name }) => ({ id, name })),
  operators: mockOperators.map(({ id, name }) => ({ id, name })),
  sellers: mockSellers.map(({ id, fullName }) => ({ id, name: fullName }))
};

export const mockReconciliations: ReconciliationListItem[] = [
  {
    id: "rec_001",
    customerName: "Ana Elzira de Sousa",
    cpf: "12345678901",
    operator: "Vivo",
    seller: "Marina Costa",
    saleDate: "2026-03-01",
    status: "divergente",
    matchScore: 92,
    appliedRule: "cpf_data_aproximada",
    divergenceSummary: "Data de instalacao ausente no linha a linha"
  },
  {
    id: "rec_002",
    customerName: "Paulo Ricardo Mendes",
    cpf: "32165498700",
    operator: "Claro",
    seller: "Carlos Neri",
    saleDate: "2026-03-02",
    status: "conciliado",
    matchScore: 100,
    appliedRule: "cpf_exato",
    divergenceSummary: "Sem divergencias"
  },
  {
    id: "rec_003",
    customerName: "Luciana Pires",
    cpf: "98765432100",
    operator: "Tim",
    seller: "Joana Luz",
    saleDate: "2026-03-05",
    status: "match_sugerido",
    matchScore: 74,
    appliedRule: "nome_telefone",
    divergenceSummary: "Contrato parcial e status divergente"
  }
];

export const mockDuplicateGroups: DuplicateGroup[] = [
  {
    id: "dup_001",
    customerName: "Ana Elzira de Sousa",
    cpf: "12345678901",
    recordCount: 2,
    suggestedRecordId: "sale_101",
    conflictLevel: "alto",
    items: [
      {
        id: "sale_101",
        seller: "Marina Costa",
        saleDate: "2026-03-01",
        status: "instalada",
        operatorRecognition: true,
        priorityScore: 96
      },
      {
        id: "sale_102",
        seller: "Carlos Neri",
        saleDate: "2026-03-03",
        status: "nao_instalada",
        operatorRecognition: false,
        priorityScore: 58
      }
    ]
  },
  {
    id: "dup_002",
    customerName: "Rogeria Lima",
    cpf: "56789012345",
    recordCount: 3,
    suggestedRecordId: "sale_220",
    conflictLevel: "medio",
    items: [
      {
        id: "sale_220",
        seller: "Joana Luz",
        saleDate: "2026-03-04",
        status: "ativa",
        operatorRecognition: true,
        priorityScore: 89
      },
      {
        id: "sale_221",
        seller: "Joana Luz",
        saleDate: "2026-03-02",
        status: "cancelada",
        operatorRecognition: false,
        priorityScore: 37
      },
      {
        id: "sale_222",
        seller: "Marina Costa",
        saleDate: "2026-03-05",
        status: "pendente",
        operatorRecognition: false,
        priorityScore: 52
      }
    ]
  }
];

export const mockCommissionSummary: CommissionSummary = {
  referencePeriod: "2026-03-01",
  totals: {
    totalSales: 128430,
    totalReconciled: 101245,
    totalInstalled: 92458,
    totalNotInstalled: 8977,
    totalDivergent: 3674,
    totalCommissionableValue: 5201440.21,
    totalCommissionAmount: 1845230.44,
    totalBlockedAmount: 215250.42,
    totalPendingAmount: 143800.11,
    totalAdjustedAmount: 32520.66
  },
  sellers: [
    {
      sellerId: "sel_01",
      sellerName: "Marina Costa",
      totalSales: 1182,
      reconciledSales: 1015,
      installedSales: 973,
      divergentSales: 44,
      commissionableValue: 438200.22,
      commissionAmount: 132500.14,
      adjustments: 1220.3,
      notes: "2 bloqueios aguardando validacao"
    },
    {
      sellerId: "sel_02",
      sellerName: "Carlos Neri",
      totalSales: 1109,
      reconciledSales: 954,
      installedSales: 918,
      divergentSales: 51,
      commissionableValue: 421305.77,
      commissionAmount: 127830.4,
      adjustments: -840.9,
      notes: "1 venda reprocessada"
    },
    {
      sellerId: "sel_03",
      sellerName: "Joana Luz",
      totalSales: 1068,
      reconciledSales: 927,
      installedSales: 902,
      divergentSales: 37,
      commissionableValue: 399410.3,
      commissionAmount: 121480.2,
      adjustments: 0,
      notes: "Sem apontamentos"
    }
  ]
};
