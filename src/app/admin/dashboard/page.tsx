import type { Metadata } from "next";
import Link from "next/link";
import { default as NextDynamic } from "next/dynamic";
import {
  Package,
  MousePointerClick,
  CircleDollarSign,
  Gauge,
  Store,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { StatCard } from "@/components/stat-card";
import { ClickTrendCard } from "@/components/click-trend-card";
import { QrShareWidget } from "@/components/qr-share-widget";
import { SearchAnalyticsCard } from "@/components/search-analytics-card";
import {
  getAllProducts,
  getClickTrend,
  getClickDelta,
  getEarningsStats,
  getEarningsDelta,
  getPopularSearches,
} from "@/lib/data";
import { formatNumber, formatRupiah, formatRupiahCompact } from "@/lib/format";
import { platformLabel, type PlatformKey } from "@/lib/icons";

// Recharts dimuat on-demand supaya bundle dashboard tidak menahan navigasi.
const PlatformBarChart = NextDynamic(
  () => import("@/components/dashboard-charts").then((m) => m.PlatformBarChart),
  {
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-3xl bg-slate-100" aria-hidden="true" />
    ),
  }
);

const PlatformPieChart = NextDynamic(
  () => import("@/components/dashboard-charts").then((m) => m.PlatformPieChart),
  {
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-full bg-slate-100" aria-hidden="true" />
    ),
  }
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://etalaseaffiliate.vercel.app";

  const [products, trend7, trend30, clickDelta, earningsByPlatform, earningsDelta, popularSearches] =
    await Promise.all([
      getAllProducts(),
      getClickTrend(7),
      getClickTrend(30),
      getClickDelta(7),
      getEarningsStats(),
      getEarningsDelta(),
      getPopularSearches(6),
    ]);

  const activeCount = products.filter((p) => p.isActive).length;
  const totalClicks = products.reduce((s, p) => s + p.clickCount, 0);
  const topProducts = [...products].sort((a, b) => b.clickCount - a.clickCount).slice(0, 5);
  const avgClicks = activeCount > 0 ? Math.round(totalClicks / activeCount) : 0;

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Ringkasan performa etalase"
      actions={
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-text-primary transition-colors hover:bg-surface-variant lg:h-10 lg:w-auto lg:gap-2 lg:rounded-xl lg:px-4 lg:text-[15px] lg:font-[600]"
        >
          <Store className="h-5 w-5" aria-hidden="true" />
          <span className="hidden lg:inline">Lihat Katalog</span>
        </Link>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Stat cards */}
        <section
          aria-label="Ringkasan statistik"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Produk Aktif"
            value={formatNumber(activeCount)}
            icon={Package}
            sub={`${formatNumber(products.length)} total produk`}
            variant="mint"
          />
          <StatCard
            label="Klik 7 Hari"
            value={formatNumber(clickDelta.current)}
            icon={MousePointerClick}
            trendPct={clickDelta.deltaPct}
            variant="violet"
          />
          <StatCard
            label="Earnings Bulan Ini"
            value={formatRupiahCompact(earningsDelta.current)}
            icon={CircleDollarSign}
            trendPct={earningsDelta.deltaPct}
            variant="amber"
          />
          <StatCard
            label="Rata-rata Klik / Produk"
            value={formatNumber(avgClicks)}
            icon={Gauge}
            sub="produk aktif"
            variant="rose"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ClickTrendCard trend7={trend7} trend30={trend30} />

          {/* Donut Chart Rasio Platform */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card lg:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold tracking-tight text-slate-900">
                Rasio Klik Platform
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
                Share
              </span>
            </div>
            <div className="relative h-48 w-full">
              <PlatformPieChart
                data={[
                  {
                    platform: "TIKTOK_SHOP",
                    clicks: products.filter((p) => p.platform === "TIKTOK_SHOP").reduce((s, p) => s + p.clickCount, 0),
                  },
                  {
                    platform: "SHOPEE",
                    clicks: products.filter((p) => p.platform === "SHOPEE").reduce((s, p) => s + p.clickCount, 0),
                  },
                ]}
              />
            </div>
            <div className="flex items-center justify-center gap-4 text-[12px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                TikTok Shop
              </span>
              <span className="flex items-center gap-1.5 text-orange-500">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                Shopee
              </span>
            </div>
          </div>
        </section>

        {/* Bar Chart Earnings */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-1">
          <div
            aria-labelledby="platform-heading"
            className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card lg:p-6"
          >
            <h2 id="platform-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Earnings by Platform
            </h2>
            <div className="relative h-48 w-full lg:h-56">
              <PlatformBarChart data={normalizePlatforms(earningsByPlatform)} />
            </div>
          </div>
        </section>

        {/* QR Share Widget */}
        <section aria-label="QR Code dan Bagikan">
          <QrShareWidget appUrl={appUrl} />
        </section>

        {/* Search Analytics Card */}
        <section aria-label="Kata kunci populer pengunjung">
          <SearchAnalyticsCard searches={popularSearches} />
        </section>

        {/* Top products — daftar mobile */}
        <section
          aria-labelledby="top-heading"
          className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card lg:hidden"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id="top-heading" className="text-[18px] font-bold tracking-tight text-slate-900">
              Produk Terlaris
            </h2>
            <Link href="/admin/products" className="text-[12px] font-bold uppercase tracking-wider text-indigo-600 hover:underline">
              Lihat Semua
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-slate-100">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-slate-800">{p.label}</p>
                  <span className="mt-1 inline-block rounded-full border border-indigo-100 bg-indigo-50/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {platformLabel[p.platform]}
                  </span>
                </div>
                <div className="ml-3 flex flex-col items-end">
                  <span className="text-[18px] font-extrabold text-emerald-600">
                    {formatNumber(p.clickCount)}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Klik</span>
                </div>
              </li>
            ))}
            {topProducts.length === 0 && (
              <li className="py-8 text-center text-[14px] text-slate-500">Belum ada data klik.</li>
            )}
          </ul>
        </section>

        {/* Top products — tabel desktop */}
        <section
          aria-labelledby="top-table"
          className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-clay-card lg:block"
        >
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h2 id="top-table" className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Produk Terlaris
            </h2>
            <Link href="/admin/products" className="text-[14px] font-semibold text-indigo-600 hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 pl-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Produk</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Platform</th>
                  <th className="p-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Klik</th>
                  <th className="p-4 pr-6 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50">
                    <td className="p-4 pl-6 text-[15px] font-semibold text-slate-800">{p.label}</td>
                    <td className="p-4">
                      <span className="rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {platformLabel[p.platform]}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[15px] font-semibold text-slate-700">{formatNumber(p.clickCount)}</td>
                    <td className="p-4 pr-6 text-right text-[15px] font-bold text-emerald-600">
                      {(p.income ?? 0) > 0 ? formatRupiah(p.income) : "—"}
                    </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[14px] text-slate-500">
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


