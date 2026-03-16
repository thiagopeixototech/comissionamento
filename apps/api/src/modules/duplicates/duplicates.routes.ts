import type { FastifyInstance } from "fastify";
import { getDuplicateGroups } from "./duplicates.service";

export async function duplicateRoutes(app: FastifyInstance) {
  app.get("/", async () => getDuplicateGroups());
}
