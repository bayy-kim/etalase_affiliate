/**
 * Sumber tunggal session secret — aman dipakai di Edge Runtime (middleware)
 * maupun Node runtime (server actions). JANGAN import next/headers atau
 * modul apa pun yang butuh runtime penuh.
 *
 * Produksi: wajib SESSION_SECRET / NEXTAUTH_SECRET, tanpa itu app gagal.
 * Development: fallback dev-only supaya bisa jalan tanpa setup.
 */

const DEV_FALLBACK = "dev-only-secret-etl-2026-jangan-pakai-di-produksi";

export function getSessionSecretRaw(): string {
  const raw = process.env.SESSION_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (raw) return raw;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET wajib di-set di production.");
  }
  return DEV_FALLBACK;
}

export function getSessionSecretKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecretRaw());
}
