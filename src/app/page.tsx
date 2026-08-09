import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, MoreVertical, Package, MousePointerClick } from "lucide-react";

import { getPublicProducts, getTotalClicks, getProfile } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductGallery } from "@/components/product-gallery";
import { Avatar } from "@/components/avatar";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Etalase Affiliate",
  description:
    "Kurasi produk affiliate dalam satu etalase. Tap produk untuk langsung checkout di platform resmi.",
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

  return (
    <main
      id="main-content"
      className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-background-base"
    >
      {/* Top bar mobile */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border-subtle bg-background-base/90 px-4 py-2 backdrop-blur-md lg:hidden">
        <span className="flex items-center gap-3">
          <Avatar name={profile.displayName} src={profile.avatar} className="h-11 w-11 text-sm" />
          <span className="text-sm font-bold tracking-tight text-text-primary">
            ETALASE AFFILIATE
          </span>
        </span>
        <Link
          href="/admin/login"
          aria-label="Menu admin"
          className="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-variant"
        >
          <MoreVertical className="h-5 w-5" aria-hidden="true" />
        </Link>
      </header>

      {/* Konten */}
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pb-10 lg:max-w-7xl lg:px-8 lg:pt-16">
        {/* Profil */}
        <section className="flex flex-col items-center gap-2 pt-4 text-center lg:pt-0">
          <Avatar
            name={profile.displayName}
            src={profile.avatar}
            className="mb-2 h-24 w-24 text-3xl lg:mb-3 lg:h-32 lg:w-32 lg:text-4xl"
          />
          <h1 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary lg:text-[24px] lg:leading-8 lg:tracking-[-0.02em]">
            {profile.handle}
            {profile.displayName && profile.handle !== profile.displayName && (
              <span className="text-text-secondary"> &middot; {profile.displayName}</span>
            )}
          </h1>
          <p className="max-w-[280px] text-[14px] leading-5 text-text-secondary lg:max-w-md lg:text-[16px] lg:leading-6">
            {profile.bio}
          </p>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card px-3 py-1.5">
            <span className="pulse-dot h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-secondary">
              Etalase aktif
            </span>
          </span>

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

        {/* Filter kategori */}
        <section className="mt-6 w-full" aria-label="Kategori produk">
          <Suspense fallback={null}>
            <CategoryTabs active={active} />
          </Suspense>
        </section>

        {/* Featured + search */}
        <section className="mt-6 w-full" aria-label="Produk pilihan">
          <div className="mb-4 flex items-baseline justify-between lg:mb-6">
            <h2 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
              Featured Finds
            </h2>
            <span className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
              Top Picks
            </span>
          </div>
          <ProductGallery products={products} activeCategory={active} />
        </section>
      </div>

      {/* CTA mobile */}
      <div className="sticky bottom-4 z-10 mt-auto px-4 lg:hidden">
        <Link
          href="/?k=all"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary-container bg-primary-container text-[15px] font-[600] text-white transition-all hover:bg-primary-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
        >
          Lihat Semua Produk
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      {/* Footer desktop */}
      <footer className="mt-auto hidden w-full border-t border-border-subtle bg-surface-dim py-8 lg:block">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <span className="text-[12px] font-[600] uppercase tracking-[0.05em] text-on-surface-variant">
            © 2026 Etalase Affiliate
          </span>
          <nav aria-label="Footer" className="flex gap-4">
            <Link href="/privacy" className="text-[12px] font-[600] uppercase tracking-[0.05em] text-on-surface-variant transition-colors hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-[12px] font-[600] uppercase tracking-[0.05em] text-on-surface-variant transition-colors hover:text-primary">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
