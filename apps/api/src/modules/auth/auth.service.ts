import type { AuthSession } from "@teleconcilia/contracts";
import { mockSession } from "../../lib/mock-data";
import { findUserByEmail } from "./auth.repository";

const defaultEmail = "admin@teleconcilia.local";

export async function getSession(): Promise<AuthSession> {
  try {
    const user = await findUserByEmail(defaultEmail);

    if (!user) {
      return mockSession;
    }

    return {
      accessToken: "teleconcilia-mvp-token",
      user
    };
  } catch {
    return mockSession;
  }
}

export async function login(): Promise<AuthSession> {
  return getSession();
}
