import type { AuthSession } from "@teleconcilia/contracts";
import { mockSession } from "../../lib/mock-data";

export function getSession(): AuthSession {
  return mockSession;
}

export function login(): AuthSession {
  return mockSession;
}
