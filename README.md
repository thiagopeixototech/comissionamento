# TeleConcilia

Plataforma web de conciliacao de vendas para telecom, focada em importacao de multiplas fontes, normalizacao, conciliacao auditavel, deteccao de duplicidades e apuracao de comissao com alto volume de dados.

## Estrutura

- `docs/teleconcilia-architecture.md`: arquitetura, modulos, regras e estrategia de performance
- `docs/teleconcilia-roadmap.md`: MVP, v2 e melhorias futuras
- `apps/web`: frontend operacional e executivo
- `apps/api`: API, motor de conciliacao e calculo de comissao
- `packages/contracts`: contratos tipados compartilhados
- `database/schema.sql`: modelagem relacional inicial em PostgreSQL

## Stack proposta

- Frontend: Next.js + TypeScript + TanStack Table + TanStack Query
- Backend: Node.js + Fastify + TypeScript + Zod
- Banco: PostgreSQL
- Filas: BullMQ + Redis
- Storage: S3 compativel para arquivos importados

## Docker

1. Copie `.env.example` para `.env`
2. Suba os containers com `npm run docker:up`
3. Acesse:
   - Web: `http://localhost:3000`
   - API: `http://localhost:3333/health`

Servicos previstos no `docker-compose.yml`:

- `web`
- `api`
- `postgres`
- `redis`

Atualizacao em servidor:

1. `git pull`
2. `docker compose up -d --build`
3. `docker compose logs -f`

## Principios

- Nunca perder o dado original
- Processar pesado no backend
- Regra versionada e auditavel
- Paginar, filtrar e agregar no banco
- Explicar toda decisao automatica relevante
