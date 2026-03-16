import { createServer } from "./server";
import { config } from "./config";

async function bootstrap() {
  const app = await createServer();

  try {
    await app.listen({ host: config.apiHost, port: config.apiPort });
    app.log.info(`TeleConcilia API listening on ${config.apiHost}:${config.apiPort}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void bootstrap();
