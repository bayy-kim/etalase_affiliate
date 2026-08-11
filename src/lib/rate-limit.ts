type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 menit
} as const;

/**
 * Rate limiter in-memory sederhana (per IP + key).
 * Untuk single-user & multi-instance, pindahkan ke Redis/Upstash.
 */
export function rateLimit(key: string, max: number = RATE_LIMIT.MAX_ATTEMPTS, windowMs: number = RATE_LIMIT.WINDOW_MS): {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= max) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count, retryAfterMs: 0 };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}

/** Ambil IP klien dengan aman dari headers proxy (Vercel/Cloudflare). */
export function clientIpFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
