import { pingDatabase } from "./db";

let checked = false;
let healthy = false;

export async function ensureRuntime() {
  if (checked) {
    return healthy;
  }

  try {
    await pingDatabase();
    healthy = true;
  } catch {
    healthy = false;
  }

  checked = true;
  return healthy;
}
