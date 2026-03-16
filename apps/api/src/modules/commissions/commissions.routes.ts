import type { FastifyInstance } from "fastify";
import { getCommissionSummary } from "./commissions.service";

export async function commissionRoutes(app: FastifyInstance) {
  app.get("/summary", async () => getCommissionSummary());
}
