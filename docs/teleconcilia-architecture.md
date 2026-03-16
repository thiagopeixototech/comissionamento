# TeleConcilia - Arquitetura de Produto e Sistema

## 1. Visao geral do produto

O TeleConcilia e uma plataforma operacional e executiva para conciliacao de vendas em telecom. O sistema cruza vendas internas, importacoes externas, linha a linha da operadora e regras de negocio para explicar:

- o que foi vendido
- o que foi reconhecido pela operadora
- o que virou instalacao
- o que esta divergente
- o que esta duplicado
- o que gera, bloqueia ou perde comissao

O produto foi desenhado para grandes volumes, rastreabilidade total e calculos deterministas.

## 2. Objetivos do produto

- Consolidar multiplas fontes de dados sem perder origem e historico
- Normalizar informacoes heterogeneas com camadas auditaveis
- Conciliar com regras explicitas, score e justificativa
- Tratar duplicidades com agrupamento navegavel e decisao manual auditada
- Calcular comissao com versao de regra, base de calculo e motivo de bloqueio
- Entregar operacao rapida com filtros fortes, exportacoes e dashboard executivo

## 3. Arquitetura recomendada

### 3.1 Macroarquitetura

- `apps/web`: aplicacao Next.js para operacao, dashboard e administracao
- `apps/api`: API modular com dominios separados
- `database/postgresql`: base transacional e analitica leve
- `redis + bullmq`: filas de importacao, normalizacao, conciliacao, exportacao e recalculo
- `object storage`: persistencia de arquivos originais e arquivos exportados

### 3.2 Estilo arquitetural

- Monorepo com TypeScript
- Backend em arquitetura modular, com separacao entre `routes`, `services`, `repositories`, `domain/rules`, `jobs`
- Regras de conciliacao e comissionamento versionadas
- Processos pesados assincronos e idempotentes
- Leitura otimizada com views/materialized views para dashboard e listagens agregadas

### 3.3 Stack sugerida

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, TanStack Table, TanStack Query, React Hook Form, Zod
- Backend: Node.js, Fastify, TypeScript, PostgreSQL driver/ORM, Zod, BullMQ
- Banco: PostgreSQL 16+
- Observabilidade: OpenTelemetry, logs estruturados, métricas por fila/processo
- Autenticacao: sessao segura com JWT rotativo ou cookie httpOnly, hash de senha com Argon2

## 4. Modulos do sistema

### 4.1 Identidade e acesso

- Login por email e senha
- Recuperacao de senha
- Sessao segura
- RBAC por perfil e permissoes granulares
- Escopo multiempresa

Perfis base:

- administrador
- gestor
- operador
- auditor
- financeiro_comissao

### 4.2 Cadastros mestres

- empresas
- operadoras
- vendedores
- supervisores
- equipes
- campanhas
- status internos
- modelos de importacao
- regras de conciliacao
- regras de comissao

### 4.3 Importacao

- Upload de CSV e XLSX
- Validacao previa
- Preview de colunas
- Mapeamento manual e sugestao automatica
- Persistencia do arquivo bruto
- Geracao de lote/importacao com status
- Download dos rejeitados

### 4.4 Normalizacao

Camada separada da importacao para garantir auditoria:

- limpeza de texto e encoding
- normalizacao de CPF, telefone, nomes e status
- parse de data e monetario
- remocao de caracteres invisiveis
- identificacao aproximada de vendedor/operadora
- score de confianca da normalizacao

### 4.5 Motor de conciliacao

Fluxo em camadas:

1. Match exato
2. Match forte
3. Match assistido

Cada decisao gera:

- status final
- score
- regra aplicada
- campos comparados
- divergencias encontradas
- snapshot dos dados envolvidos

### 4.6 Duplicidades

- agrupamento por identidade principal do cliente
- expansao sob demanda
- sugestao de registro prevalente
- descarte auditado dos demais
- justificativa obrigatoria em decisao manual

### 4.7 Comissionamento

- configuracao versionada por operadora, empresa, plano, vendedor, faixa e status
- calculo em lote e incremental
- bloqueio por divergencia ou ausencia de elegibilidade
- recalculo com historico

### 4.8 Relatorios e exportacoes

- exportacao assíncrona para grandes volumes
- CSV e XLSX
- filtros sempre executados no backend
- rastreamento de quem gerou, quando e com quais filtros

### 4.9 Auditoria

- eventos de sistema e de negocio
- before/after para alteracoes sensiveis
- quem executou
- regra/versao usada
- arquivo ou lote relacionado

## 5. Modelagem conceitual de dados

### 5.1 Separacao de camadas

- `raw_sales`: linha crua importada
- `normalized_sales`: registro tratado e padronizado
- `reconciliations`: resultado do motor
- `duplicate_groups` e `duplicate_items`: consolidacao de duplicidade
- `commission_calculations` e `commission_items`: calculo e detalhamento de comissao

### 5.2 Entidades centrais

- identidade: `users`, `roles`, `permissions`, `user_roles`
- base: `companies`, `operators`, `teams`, `sellers`, `campaigns`
- importacao: `imports`, `import_files`, `import_templates`, `mapped_columns`, `import_errors`
- vendas: `raw_sales`, `normalized_sales`, `status_history`
- conciliacao: `reconciliation_runs`, `reconciliations`, `reconciliation_rules`, `reconciliation_matches`
- duplicidade: `duplicate_groups`, `duplicate_items`, `duplicate_decisions`
- comissao: `commission_rules`, `commission_rule_versions`, `commission_calculations`, `commission_items`
- governanca: `manual_adjustments`, `audit_logs`, `exports`

## 6. Regras de negocio essenciais

### 6.1 Regras de conciliacao

Camada 1 - match exato:

- CPF exato
- contrato exato
- telefone exato

Camada 2 - match forte:

- CPF + data de venda dentro de janela configuravel
- CPF + operadora
- nome semelhante + telefone
- contrato parcial com validacao de contexto

Camada 3 - match assistido:

- score acima do limiar de sugestao
- nao consolida automaticamente se houver ambiguidade

Status sugeridos:

- conciliado
- nao_conciliado
- duplicado
- divergente
- pendente_analise
- match_sugerido
- descartado
- comissao_aprovada
- comissao_bloqueada

### 6.2 Regras de prioridade entre registros

Peso sugerido para prevalencia:

- instalacao confirmada: +50
- reconhecido em linha a linha: +30
- status ativo: +20
- contrato valido: +15
- maior completude de campos: +10
- cancelado: -25
- rejeitado/invalido: -40

Desempates:

- venda mais recente dentro da politica da operacao
- maior confianca de origem
- decisao manual auditada tem precedencia final

### 6.3 Regras de duplicidade

Agrupar inicialmente por:

- CPF
- telefone
- contrato
- nome semelhante + data proxima

O grupo deve exibir:

- identificador do cliente
- quantidade de registros
- melhor registro sugerido
- conflitos encontrados

Decisoes possiveis:

- manter principal
- descartar secundario
- fundir contexto logico sem alterar dado bruto
- encaminhar para analise

### 6.4 Regras de comissao

Elegibilidade:

- venda conciliada
- status elegivel configurado
- instalacao confirmada quando exigido
- dentro da janela de corte
- sem bloqueio por divergencia critica

Tipos de regra:

- valor fixo
- percentual
- faixa por valor
- regra combinada por operadora/plano/canal

Auditoria obrigatoria:

- versao da regra
- base usada
- valor calculado
- motivo de bloqueio
- data/hora do processamento

## 7. UX/UI recomendada

### 7.1 Diretrizes

- interface limpa e operacional
- filtros persistentes por modulo
- resumo no topo e detalhe logo abaixo
- tabelas com colunas configuraveis
- drawers para detalhe rapido
- modais apenas para confirmacoes e acoes curtas

### 7.2 Telas principais

- login
- dashboard
- empresas
- operadoras
- vendedores
- importacoes
- novo processo de importacao
- modelos de mapeamento
- conciliacao
- detalhe da conciliacao
- duplicidades
- comissionamento
- relatorios
- auditoria
- configuracoes

### 7.3 Comportamentos importantes

- filtros no topo com aplicacao server-side
- busca rapida por CPF, nome, contrato e telefone
- tabelas virtualizadas para grandes volumes
- agrupamento expansivel em duplicidades
- etapa do processo sempre visivel em importacao e conciliacao

## 8. Fluxo operacional ideal

1. Configurar entidades base e regras
2. Iniciar importacao ou selecionar vendas internas
3. Validar arquivo/fonte
4. Mapear colunas
5. Processar importacao
6. Normalizar registros
7. Executar conciliacao
8. Revisar duplicidades e divergencias
9. Aplicar ajustes manuais auditados
10. Calcular comissao
11. Exportar relatorios

## 9. Estrategia de performance

### 9.1 Banco

- indices compostos em campos de busca e filtros mais frequentes
- particionamento por competencia/data quando volume justificar
- materialized views para dashboard e consolidacoes pesadas
- `EXPLAIN ANALYZE` como criterio de aceite das consultas criticas

### 9.2 Backend

- jobs assincronos para importacao, normalizacao, conciliacao e exportacao
- reprocessamento incremental por lote e por regra
- cache de agregados com invalidador por evento
- endpoints de listagem sempre paginados

### 9.3 Frontend

- renderizacao parcial
- virtualizacao de tabela
- queries cacheadas por chave de filtro
- evitar megastates globais

### 9.4 Exportacao

- gerar arquivo em background
- stream de escrita
- link para download ao finalizar
- limitar exportacoes sincronas a pequenos volumes

## 10. Riscos tecnicos e mitigacoes

- Match falso positivo
  Mitigacao: score, camadas, limiares configuraveis e revisao manual

- Recalculo custoso de comissao
  Mitigacao: versionamento de regra e processamento incremental por lotes afetados

- Dashboards lentos com crescimento da base
  Mitigacao: agregados precomputados e cache

- Divergencia entre dado bruto e dado operacional
  Mitigacao: nunca sobrescrever origem; usar camadas separadas

- Acoes manuais sem rastreio
  Mitigacao: auditoria obrigatoria com before/after e justificativa

## 11. Precisao dos calculos

Para garantir confiabilidade:

- regras declarativas versionadas
- motor deterministico
- snapshots de contexto por execucao
- trilha completa de regras aplicadas
- simulacao de conciliacao/comissao antes da consolidacao final
- datasets de regressao para cenarios reais de telecom

## 12. Diferenciais do produto

- conciliacao explicavel e auditavel
- separacao entre dado bruto, normalizado e decidido
- duplicidade navegavel por grupo, sem poluicao visual
- comissionamento rastreavel por regra e versao
- foco real em performance operacional, nao apenas em interface
