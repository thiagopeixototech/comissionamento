import { createServer } from "./server";

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number(process.env.API_PORT ?? 3333);

async function bootstrap() {
  const app = await createServer();

  try {
    await app.listen({ host, port });
    app.log.info(`TeleConcilia API listening on ${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void bootstrap();
