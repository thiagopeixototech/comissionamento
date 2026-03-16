function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  apiHost: getEnv("API_HOST", "0.0.0.0"),
  apiPort: Number(getEnv("API_PORT", "3333")),
  databaseUrl: getEnv(
    "DATABASE_URL",
    "postgres://teleconcilia:teleconcilia123@localhost:5432/teleconcilia"
  ),
  webOrigin: process.env.WEB_ORIGIN ?? true
};
