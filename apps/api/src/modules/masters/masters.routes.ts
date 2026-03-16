import type { FastifyInstance } from "fastify";
import { listCompanies, listOperators, listSellers } from "./masters.service";

export async function masterRoutes(app: FastifyInstance) {
  app.get("/companies", async () => listCompanies());
  app.get("/operators", async () => listOperators());
  app.get("/sellers", async () => listSellers());
}
