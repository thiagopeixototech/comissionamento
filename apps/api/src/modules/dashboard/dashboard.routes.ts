import type { FastifyInstance } from "fastify";
import { getDashboardSummary } from "./dashboard.service";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/summary", async () => getDashboardSummary());
}
