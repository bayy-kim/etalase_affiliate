import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { getSessionSecretKey } from "@/lib/session-secret";

const SESSION_COOKIE = "etalase_session";
const PENDING_COOKIE = "etalase_pending_2fa";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari
const PENDING_MAX_AGE = 60 * 5; // 5 menit

function cookieBase(): { httpOnly: true; secure: boolean; sameSite: "lax"; path: string } {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

export type SessionData = { adminId: string; email: string };

export async function createSession(session: SessionData): Promise<void> {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSessionSecretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, { ...cookieBase(), maxAge: SESSION_MAX_AGE });
}

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.adminId !== "string" || typeof payload.email !== "string") return null;
    return { adminId: payload.adminId, email: payload.email };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function createPending2fa(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PENDING_MAX_AGE}s`)
    .sign(getSessionSecretKey());
  const store = await cookies();
  store.set(PENDING_COOKIE, token, { ...cookieBase(), maxAge: PENDING_MAX_AGE });
}

export async function getPending2fa(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(PENDING_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function destroyPending2fa(): Promise<void> {
  const store = await cookies();
  store.delete(PENDING_COOKIE);
}
