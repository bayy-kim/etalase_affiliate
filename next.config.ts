import type { NextConfig } from "next";

// Fail-fast: di production, `next start` WAJIB punya session secret.
// Build (NEXT_PHASE phase-production-build) tetap boleh jalan tanpa secret.
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE === "phase-production-server" &&
  !process.env.SESSION_SECRET &&
  !process.env.NEXTAUTH_SECRET
) {
  throw new Error(
    "SESSION_SECRET wajib di-set di production (NEXTAUTH_SECRET boleh sebagai alternatif)."
  );
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
