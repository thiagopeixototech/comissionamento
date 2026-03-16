import type { FastifyInstance } from "fastify";
import { getReconciliationList } from "./reconciliation.service";

export async function reconciliationRoutes(app: FastifyInstance) {
  app.get("/", async () => getReconciliationList());
}
