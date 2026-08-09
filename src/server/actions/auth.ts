"use server";

import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { loginSchema, totpSchema } from "@/lib/validations";
import {
  getAdminByEmail,
  saveTotpSecret,
  markLogin,
  writeAudit,
} from "@/lib/data";
import {
  createSession,
  destroySession,
  createPending2fa,
  getPending2fa,
  destroyPending2fa,
  getSession,
} from "@/lib/session";
import { rateLimit, clearRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

export type LoginResult = { error?: string } | { step: "2fa" } | { step: "done"; to: string };

export async function loginAction(_: LoginResult | null, formData: FormData): Promise<LoginResult> {
  const h = await headers();
  const ip = clientIpFromHeaders(h);
  const limiter = rateLimit(`login:${ip}`);
  if (!limiter.ok) {
    return { error: "Terlalu banyak percobaan. Coba lagi beberapa menit." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const admin = await getAdminByEmail(parsed.data.email);
  const passwordOk = admin !== null && (await bcrypt.compare(parsed.data.password, admin.passwordHash));

  if (!admin || !passwordOk) {
    return { error: "Email atau password salah." };
  }

  if (admin.totpEnabled) {
    await createPending2fa(admin.email);
    return { step: "2fa" };
  }

  await createSession({ adminId: admin.id, email: admin.email });
  await writeAudit(admin.id, "login_password", "admin", admin.id, { step: "initial" });
  clearRateLimit(`login:${ip}`);
  return { step: "done", to: "/admin/setup-2fa" };
}

export type TotpResult = { error?: string } | { ok: true };

export async function verifyTotpAction(_: TotpResult | null, formData: FormData): Promise<TotpResult> {
  const h = await headers();
  const ip = clientIpFromHeaders(h);
  const limiter = rateLimit(`totp:${ip}`);
  if (!limiter.ok) {
    return { error: "Terlalu banyak percobaan. Coba lagi beberapa menit." };
  }

  const pending = await getPending2fa();
  if (!pending) return { error: "Sesi kedaluwarsa. Login ulang." };

  const parsed = totpSchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Kode tidak valid." };

  const admin = await getAdminByEmail(pending.email);
  if (!admin?.totpSecret) return { error: "Akun tidak valid." };

  const { decryptSecret } = await import("@/lib/encryption");
  let base32: string;
  try {
    base32 = decryptSecret(admin.totpSecret);
  } catch {
    return { error: "Terjadi kesalahan. Hubungi admin." };
  }

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(base32),
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });
  const delta = totp.validate({ token: parsed.data.code, window: 1 });
  if (delta === null) return { error: "Kode salah atau sudah kedaluwarsa." };

  await createSession({ adminId: admin.id, email: admin.email });
  await destroyPending2fa();
  await markLogin(admin.id);
  await writeAudit(admin.id, "login_2fa", "admin", admin.id, { ok: true });
  clearRateLimit(`totp:${ip}`);
  return { ok: true };
}

export async function setupTotpAction(secretBase32: string, code: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Tidak terautentikasi." };

  const parsed = totpSchema.safeParse({ code });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Kode tidak valid." };

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secretBase32),
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });
  const delta = totp.validate({ token: parsed.data.code, window: 1 });
  if (delta === null) return { error: "Kode salah. Coba lagi." };

  await saveTotpSecret(session.adminId, secretBase32, true);
  await writeAudit(session.adminId, "setup_2fa", "admin", session.adminId, { enabled: true });
  return {};
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) await writeAudit(session.adminId, "logout", "admin", session.adminId);
  await destroySession();
  redirect("/admin/login");
}

export { getSession, getPending2fa };
