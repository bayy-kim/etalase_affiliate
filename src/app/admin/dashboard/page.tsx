import type { Metadata } from "next";
import {
  Package,
  MousePointerClick,
  CircleDollarSign,
  Gauge,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { StatCard } from "@/components/stat-card";
import { ClickTrendChart, PlatformBarChart } from "@/components/dashboard-charts";
import {
  getAllProducts,
  getClickTrend,
  getClickDelta,
  getEarningsStats,
  getEarningsDelta,
} from "@/lib/data";
import { formatNumber, formatRupiah, formatRupiahCompact } from "@/lib/format";
import { platformLabel, type PlatformKey } from "@/lib/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [products, trend, clickDelta, earningsByPlatform, earningsDelta] = await Promise.all([
    getAllProducts(),
    getClickTrend(7),
    getClickDelta(7),
    getEarningsStats(),
    getEarningsDelta(),
  ]);

  const activeCount = products.filter((p) => p.isActive).length;
  const totalClicks = products.reduce((s, p) => s + p.clickCount, 0);
  const topProducts = [...products].sort((a, b) => b.clickCount - a.clickCount).slice(0, 5);
  const avgClicks = activeCount > 0 ? Math.round(totalClicks / activeCount) : 0;

  return (
    <AdminShell title="Dashboard" subtitle="Ringkasan performa etalase">
      <div className="flex flex-col gap-6">
        {/* Stat cards */}
        <section
          aria-label="Ringkasan statistik"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Produk Aktif"
            value={formatNumber(activeCount)}
            icon={Package}
            sub={`${formatNumber(products.length)} total produk`}
          />
          <StatCard
            label="Klik 7 Hari"
            value={formatNumber(clickDelta.current)}
            icon={MousePointerClick}
            trendPct={clickDelta.deltaPct}
          />
          <StatCard
            label="Earnings Bulan Ini"
            value={formatRupiahCompact(earningsDelta.current)}
            icon={CircleDollarSign}
            trendPct={earningsDelta.deltaPct}
          />
          <StatCard
            label="Rata-rata Klik / Produk"
            value={formatNumber(avgClicks)}
            icon={Gauge}
            sub="produk aktif"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div
            aria-labelledby="trend-heading"
            className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 lg:col-span-2 lg:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="trend-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
                Click Trend (7 Hari)
              </h2>
              <div className="flex gap-1 rounded-full border border-border-subtle bg-surface-container p-1">
                {["7D", "30D", "All"].map((p, i) => (
                  <span
                    key={p}
                    aria-hidden="true"
                    className={
                      i === 0
                        ? "rounded-full bg-primary-container px-3 py-1 text-[12px] font-[600] text-white"
                        : "rounded-full px-3 py-1 text-[12px] font-[600] text-text-secondary"
                    }
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-52 w-full lg:h-64">
              <ClickTrendChart data={trend} />
            </div>
          </div>

          <div
            aria-labelledby="platform-heading"
            className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 lg:p-6"
          >
            <h2 id="platform-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
              Earnings by Platform
            </h2>
            <div className="relative h-52 w-full lg:h-64">
              <PlatformBarChart data={normalizePlatforms(earningsByPlatform)} />
            </div>
          </div>
        </section>

        {/* Top products — daftar mobile */}
        <section
          aria-labelledby="top-heading"
          className="flex flex-col rounded-2xl border border-border-subtle bg-surface-card p-4 lg:hidden"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id="top-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
              Produk Terlaris
            </h2>
            <a href="/admin/products" className="text-[12px] font-[600] uppercase tracking-[0.05em] text-primary hover:underline">
              Lihat Semua
            </a>
          </div>
          <ul className="flex flex-col divide-y divide-border-subtle">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-[600] leading-6 text-on-surface">{p.label}</p>
                  <span className="mt-1 inline-block rounded-full border border-border-subtle bg-surface-container px-2 py-0.5 text-[10px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                    {platformLabel[p.platform]}
                  </span>
                </div>
                <div className="ml-3 flex flex-col items-end">
                  <span className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-accent-green">
                    {formatNumber(p.clickCount)}
                  </span>
                  <span className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Klik</span>
                </div>
              </li>
            ))}
            {topProducts.length === 0 && (
              <li className="py-8 text-center text-[14px] text-text-secondary">Belum ada data klik.</li>
            )}
          </ul>
        </section>

        {/* Top products — tabel desktop */}
        <section
          aria-labelledby="top-table"
          className="hidden overflow-hidden rounded-2xl border border-border-subtle bg-surface-card lg:block"
        >
          <div className="flex items-center justify-between border-b border-border-subtle p-6">
            <h2 id="top-table" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
              Produk Terlaris
            </h2>
            <a href="/admin/products" className="text-[15px] font-[600] text-primary hover:underline">
              Lihat Semua
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-container-highest">
                  <th className="p-4 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Produk</th>
                  <th className="p-4 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Platform</th>
                  <th className="p-4 text-right text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Klik</th>
                  <th className="p-4 text-right text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-container-low">
                    <td className="p-4 text-[15px] font-[600] text-on-surface">{p.label}</td>
                    <td className="p-4">
                      <span className="rounded-full border border-border-subtle bg-surface-container px-2.5 py-1 text-[11px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                        {platformLabel[p.platform]}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[15px] text-on-surface">{formatNumber(p.clickCount)}</td>
                    <td className="p-4 text-right text-[15px] font-bold text-accent-green">
                      {p.earningsTotal > 0 ? formatRupiah(p.earningsTotal) : "—"}
                    </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[14px] text-text-secondary">
                      Belum ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function normalizePlatforms(data: { platform: PlatformKey; total: number }[]) {
  const order: PlatformKey[] = ["TIKTOK_SHOP", "SHOPEE"];
  return order
    .map((p) => data.find((d) => d.platform === p) ?? { platform: p, total: 0 })
    .filter((d) => d.total > 0);
}
