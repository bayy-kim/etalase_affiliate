import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { getSessionSecretKey } from "@/lib/session-secret";

const SESSION_COOKIE = "etalase_session";
const PENDING_COOKIE = "etalase_pending_2fa";

async function readToken(value: string | undefined): Promise<unknown | null> {
  if (!value) return null;
  try {
    const { payload } = await jwtVerify(value, getSessionSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await readToken(req.cookies.get(SESSION_COOKIE)?.value);
  const pending = await readToken(req.cookies.get(PENDING_COOKIE)?.value);

  // Halaman auth publik
  if (pathname === "/admin/login") {
    if (session) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    return NextResponse.next();
  }

  if (pathname === "/admin/verify-2fa") {
    if (session) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (!pending) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  if (pathname === "/admin/setup-2fa") {
    if (!session) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  // Proteksi level middleware untuk seluruh /admin/* (pelajaran M2A: jangan andalkan guard halaman saja)
  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
