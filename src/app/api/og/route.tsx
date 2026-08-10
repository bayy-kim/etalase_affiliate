import { ImageResponse } from "next/og";

import { getPublicProducts, getTotalClicks } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  const [products, totalClicks] = await Promise.all([
    getPublicProducts(),
    getTotalClicks(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f2f7",
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        {/* Main Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            borderRadius: "36px",
            border: "1px solid #e2e8f0",
            padding: "48px 64px",
            boxShadow: "0 20px 40px -15px rgba(166, 175, 195, 0.4)",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Avatar & Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "9999px",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                fontWeight: "bold",
                boxShadow: "0 10px 20px -5px rgba(22, 163, 74, 0.4)",
              }}
            >
              A
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#0f172a" }}>
                @abny2524
              </div>
              <div style={{ fontSize: "20px", fontWeight: 600, color: "#64748b" }}>
                abny
              </div>
            </div>
          </div>

          {/* Bio / Description */}
          <div
            style={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#334155",
              textAlign: "center",
              maxWidth: "750px",
              lineHeight: 1.4,
              marginBottom: "32px",
            }}
          >
            Kurasi & Rekomendasi Produk Pilihan Terbaik di TikTok Shop & Shopee 🛍️
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "9999px",
                padding: "12px 28px",
                color: "#047857",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              <span>{products.length} Produk Kurasi</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#e0e7ff",
                border: "1px solid #c7d2fe",
                borderRadius: "9999px",
                padding: "12px 28px",
                color: "#4338ca",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              <span>{totalClicks} Total Klik</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
