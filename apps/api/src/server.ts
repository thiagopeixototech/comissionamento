import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config";
import { registerRoutes } from "./routes";
import { ensureRuntime } from "./lib/runtime";

export async function createServer() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: config.webOrigin
  });

  await registerRoutes(app);
  await ensureRuntime();

  return app;
}
