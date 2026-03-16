import type { FastifyInstance } from "fastify";
import { pingDatabase } from "../../lib/db";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    let database = "offline";

    try {
      await pingDatabase();
      database = "online";
    } catch {
      database = "offline";
    }

    return {
      status: database === "online" ? "ok" : "degraded",
      service: "teleconcilia-api",
      database
    };
  });
}
