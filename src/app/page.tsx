import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, MoreVertical, Package, MousePointerClick } from "lucide-react";

import { getPublicProducts, getTotalClicks, getProfile } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { ProductRow } from "@/components/product-row";
import { CategoryTabs } from "@/components/category-tabs";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Etalase Affiliate",
  description:
    "Kurasi produk affiliate TikTok Shop & Shopee dalam satu etalase. Tap produk untuk langsung checkout di platform resmi.",
};

export default async function StorefrontPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;
  const active = k ?? "all";

  const [products, totalClicks, profile] = await Promise.all([
    getPublicProducts(),
    getTotalClicks(),
    getProfile(),
  ]);

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden bg-background-base pb-10"
    >
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border-subtle bg-background-base px-4 py-2">
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-sm font-[700] text-accent-green">
            {profile.displayName.charAt(0)}
          </span>
          <span className="text-sm font-bold tracking-tight text-text-primary">
            ETALASE AFFILIATE
          </span>
        </span>
        <button
          type="button"
          aria-label="Menu"
          className="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-variant"
        >
          <MoreVertical className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 py-4">
        {/* Profile */}
        <section className="flex flex-col items-center gap-2 pt-4 text-center">
          <span
            aria-hidden="true"
            className="mb-2 flex h-24 w-24 items-center justify-center rounded-full border-2 border-border-subtle bg-[radial-gradient(circle_at_30%_25%,#22c55e33,#111214_60%)] text-3xl font-[800] text-accent-green"
          >
            {profile.displayName.charAt(0)}
          </span>
          <h1 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
            {profile.handle}
          </h1>
          <p className="max-w-[280px] text-[14px] leading-5 text-text-secondary">{profile.bio}</p>

          {/* Status etalase */}
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card px-3 py-1.5">
            <span className="pulse-dot h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-secondary">
              Etalase aktif
            </span>
          </span>

          {/* Stat mini */}
          <div className="mt-3 flex items-center gap-2" aria-label="Statistik etalase">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card px-3 py-1.5 text-[12px] font-[600] text-text-secondary">
              <Package className="h-3.5 w-3.5 text-accent-green" aria-hidden="true" />
              {formatNumber(products.length)} Produk
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card px-3 py-1.5 text-[12px] font-[600] text-text-secondary">
              <MousePointerClick className="h-3.5 w-3.5 text-accent-green" aria-hidden="true" />
              {formatNumber(totalClicks)} Klik
            </span>
          </div>
        </section>

        {/* Category filters */}
        <section className="w-full" aria-label="Kategori produk">
          <Suspense fallback={null}>
            <CategoryTabs active={active} />
          </Suspense>
        </section>

        {/* Product list */}
        <section aria-label="Daftar produk" className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-[14px] text-text-secondary">
              Belum ada produk di kategori ini. Nanti ya, aku lagi restock!
            </p>
          ) : (
            filtered.map((product) => (
              <ProductRow
                key={product.id}
                product={{
                  id: product.id,
                  label: product.label,
                  category: product.category,
                  iconKey: product.iconKey,
                  platform: product.platform,
                }}
              />
            ))
          )}
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-4 z-10 mt-auto px-4">
        <Link
          href="/?k=all"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary-container bg-primary-container text-[15px] font-[600] text-white transition-all hover:bg-primary-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
        >
          Lihat Semua Produk
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
