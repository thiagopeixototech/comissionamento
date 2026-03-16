import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: config.databaseUrl
});

export async function query<T>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}

export async function pingDatabase() {
  await query("SELECT 1");
}
