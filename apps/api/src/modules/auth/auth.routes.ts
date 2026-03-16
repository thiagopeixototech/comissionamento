import type { FastifyInstance } from "fastify";
import { getSession, login } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
  app.get("/session", async () => getSession());
  app.post("/login", async () => login());
}
