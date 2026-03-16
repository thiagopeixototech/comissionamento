import type { FastifyInstance } from "fastify";
import { getImportWizardOptions, listImports } from "./imports.service";

export async function importRoutes(app: FastifyInstance) {
  app.get("/", async () => listImports());
  app.get("/wizard-options", async () => getImportWizardOptions());
}
