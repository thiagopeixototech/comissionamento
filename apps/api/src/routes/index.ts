import type { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.routes";
import { healthRoutes } from "../modules/health/health.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { masterRoutes } from "../modules/masters/masters.routes";
import { importRoutes } from "../modules/imports/imports.routes";
import { reconciliationRoutes } from "../modules/reconciliation/reconciliation.routes";
import { duplicateRoutes } from "../modules/duplicates/duplicates.routes";
import { commissionRoutes } from "../modules/commissions/commissions.routes";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes, { prefix: "/health" });
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(masterRoutes, { prefix: "/masters" });
  await app.register(dashboardRoutes, { prefix: "/dashboard" });
  await app.register(importRoutes, { prefix: "/imports" });
  await app.register(reconciliationRoutes, { prefix: "/reconciliations" });
  await app.register(duplicateRoutes, { prefix: "/duplicates" });
  await app.register(commissionRoutes, { prefix: "/commissions" });
}
