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
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200/60 bg-[#f0f2f7]/90 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <span className="flex items-center gap-3">
          <Avatar name={profile.displayName} src={profile.avatar} className="h-10 w-10 text-sm shadow-sm" />
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            ETALASE AFFILIATE
          </span>
        </span>
        <Link
          href="/admin/login"
          aria-label="Menu admin"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-white hover:shadow-sm"
        >
          <MoreVertical className="h-5 w-5" aria-hidden="true" />
        </Link>
      </header>

      {/* Konten */}
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pb-12 lg:max-w-7xl lg:px-8 lg:pt-10">
        {/* Profil Card Taskly Clay style */}
        <section className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card pt-8 text-center lg:p-8">
          <div className="relative mb-1">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-200 to-emerald-200 blur-lg opacity-60" aria-hidden="true" />
            <Avatar
              name={profile.displayName}
              src={profile.avatar}
              className="relative h-24 w-24 border-4 border-white text-3xl shadow-md lg:h-32 lg:w-32 lg:text-4xl"
            />
          </div>
          <h1 className="text-[22px] font-extrabold leading-7 tracking-tight text-slate-900 lg:text-[28px] lg:leading-8">
            {profile.handle}
            {profile.displayName && profile.handle !== profile.displayName && (
              <span className="font-medium text-slate-500"> &middot; {profile.displayName}</span>
            )}
          </h1>
          <p className="max-w-[320px] text-[14px] leading-relaxed text-slate-600 lg:max-w-md lg:text-[15px]">
            {profile.bio}
          </p>

          <span className="mt-1 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-sm">
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Etalase Aktif
            </span>
          </span>

          <div className="mt-2 flex items-center justify-center gap-3" aria-label="Statistik etalase">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 text-[13px] font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-100">
              <Package className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <strong className="text-slate-900 font-bold">{formatNumber(products.length)}</strong> Produk
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 text-[13px] font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-100">
              <MousePointerClick className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              <strong className="text-slate-900 font-bold">{formatNumber(totalClicks)}</strong> Klik
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
            <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Featured Finds
            </h2>
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              Top Picks
            </span>
          </div>
          <ProductGallery products={products} activeCategory={active} />
        </section>
      </div>

      {/* CTA mobile */}
      <div className="sticky bottom-4 z-30 mt-auto px-4 lg:hidden">
        <Link
          href="/?k=all"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-[15px] font-bold text-white shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Lihat Semua Produk
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      {/* Footer desktop */}
      <footer className="mt-auto hidden w-full border-t border-slate-200/80 bg-white py-8 lg:block">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
            © 2026 Etalase Affiliate
          </span>
          <nav aria-label="Footer" className="flex gap-4">
            <Link href="/privacy" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600">
              Privacy
            </Link>
            <Link href="/terms" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
