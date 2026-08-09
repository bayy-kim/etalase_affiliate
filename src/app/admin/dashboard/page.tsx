import type { Metadata } from "next";
import { User } from "lucide-react";

import { AdminPageHeader } from "@/components/admin-header";
import { BottomNav } from "@/components/bottom-nav";
import { StatCard } from "@/components/stat-card";
import { ClickTrendChart, PlatformBarChart } from "@/components/dashboard-charts";
import {
  getAllProducts,
  getClickTrend,
  getEarningsStats,
  getEarningsMonth,
} from "@/lib/data";
import { formatNumber, formatRupiahCompact } from "@/lib/format";
import { platformLabel, type PlatformKey } from "@/lib/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [products, trend, earningsByPlatform, earningsMonth] = await Promise.all([
    getAllProducts(),
    getClickTrend(7),
    getEarningsStats(),
    getEarningsMonth(),
  ]);

  const activeCount = products.filter((p) => p.isActive).length;
  const totalClicks = products.reduce((s, p) => s + p.clickCount, 0);
  const topProducts = [...products].sort((a, b) => b.clickCount - a.clickCount).slice(0, 5);

  return (
    <main className="min-h-dvh bg-background-base pb-24">
      <AdminPageHeader
        title="Admin Dashboard"
        actions={
          <span className="flex items-center gap-2">
            <span className="hidden text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary sm:inline">
              Admin
            </span>
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-surface-card">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
          </span>
        }
      />

      <div className="flex flex-col gap-6 px-4 pt-20">
        {/* Stats row */}
        <section
          aria-label="Ringkasan statistik"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1"
        >
          <StatCard label="Produk Aktif" value={formatNumber(activeCount)} sub="Total Produk" />
          <StatCard label="Total Klik" value={formatNumber(totalClicks)} sub="Klik 7 Hari" />
          <StatCard
            label="Estimasi"
            value={formatRupiahCompact(earningsMonth)}
            sub="Earnings Bulan Ini"
          />
        </section>

        {/* Click trend */}
        <section
          aria-labelledby="trend-heading"
          className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4"
        >
          <h2 id="trend-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
            Click Trend (7 Hari)
          </h2>
          <div className="relative h-48 w-full">
            <ClickTrendChart data={trend} />
          </div>
        </section>

        {/* Platform earnings */}
        <section
          aria-labelledby="platform-heading"
          className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4"
        >
          <h2 id="platform-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
            Earnings by Platform
          </h2>
          <div className="relative h-32 w-full">
            <PlatformBarChart data={normalizePlatforms(earningsByPlatform)} />
          </div>
        </section>

        {/* Top products */}
        <section
          aria-labelledby="top-heading"
          className="flex flex-col rounded-2xl border border-border-subtle bg-surface-card p-4"
        >
          <h2 id="top-heading" className="mb-4 text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
            Produk Terlaris
          </h2>
          <ul className="flex flex-col divide-y divide-border-subtle">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-[600] leading-6 text-on-surface">
                    {p.label}
                  </p>
                  <span className="mt-1 inline-block rounded-full border border-border-subtle bg-surface-container px-2 py-0.5 text-[10px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                    {platformLabel[p.platform]}
                  </span>
                </div>
                <div className="ml-3 flex flex-col items-end">
                  <span className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-accent-green">
                    {formatNumber(p.clickCount)}
                  </span>
                  <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
                    Klik
                  </span>
                </div>
              </li>
            ))}
            {topProducts.length === 0 && (
              <li className="py-8 text-center text-[14px] text-text-secondary">
                Belum ada data klik.
              </li>
            )}
          </ul>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}

function normalizePlatforms(data: { platform: PlatformKey; total: number }[]) {
  const order: PlatformKey[] = ["TIKTOK_SHOP", "SHOPEE"];
  return order
    .map((p) => data.find((d) => d.platform === p) ?? { platform: p, total: 0 })
    .filter((d) => d.total > 0);
}
