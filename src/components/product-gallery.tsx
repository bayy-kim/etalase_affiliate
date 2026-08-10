"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";

import { ProductRow } from "@/components/product-row";
import { getIcon, platformLabel } from "@/lib/icons";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { logSearchAction } from "@/server/actions/search";

export function ProductGallery({
  products,
  totalCount,
  hasMore,
  initialPage,
}: {
  products: Product[];
  activeCategory?: string;
  totalCount: number;
  hasMore: boolean;
  initialPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = query.trim();
      const currentQ = searchParams.get("q") ?? "";
      if (trimmed !== currentQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (trimmed) {
          params.set("q", trimmed);
          logSearchAction(trimmed).catch(() => {});
        } else {
          params.delete("q");
        }
        params.delete("page"); // Reset page on new search
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query, pathname, router, searchParams]);

  const loadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(initialPage + 1));
    const qs = params.toString();
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  const results = useMemo(
    () =>
      products.map((p, i) => ({
        ...p,
        pos: (initialPage - 1) * 20 + i + 1,
      })),
    [products, initialPage]
  );

  const hasQuery = query.trim().length > 0;
  const empty = results.length === 0;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search */}
      <div role="search" aria-label="Cari produk" className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari produk… (ketik angka untuk cari urutan)"
          className="h-13 w-full rounded-2xl border border-slate-200/80 bg-white pl-12 pr-12 text-[15px] font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Hapus pencarian"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {hasQuery && (
        <p className="text-[13px] font-semibold text-slate-500" aria-live="polite">
          {empty ? "Tidak ditemukan." : `${totalCount} hasil`}
        </p>
      )}

      {empty ? (
        <p className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center text-[14px] text-slate-500 shadow-clay-card">
          Tidak ditemukan — coba kata kunci lain atau hapus pencarian.
        </p>
      ) : (
        <>
          {/* List mobile */}
          <div className="flex flex-col gap-3.5 lg:hidden">
            {results.map((it) => (
              <ProductRow
                key={it.id}
                product={{ id: it.id, label: it.label, category: it.category, iconKey: it.iconKey, platform: it.platform, isMall: it.isMall, pos: it.pos }}
              />
            ))}
          </div>

          {/* Grid desktop */}
          <div className="hidden grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid">
            {results.map((it) => {
              const Icon = getIcon(it.iconKey);
              const isShopee = it.platform === "SHOPEE";
              return (
                <Link
                  key={it.id}
                  href={`/go/${it.id}`}
                  prefetch={false}
                  className={cn(
                    "group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-clay-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2",
                    isShopee ? "focus-visible:outline-orange-500" : "focus-visible:outline-emerald-600"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[16px] font-extrabold shrink-0",
                      isShopee ? "text-orange-500" : "text-emerald-600"
                    )}
                  >
                    {String(it.pos).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b transition-all duration-200 group-hover:scale-105 group-hover:text-white",
                      isShopee
                        ? "border-orange-200/60 bg-gradient-to-b from-orange-100 to-orange-200/90 text-orange-600 shadow-[0_6px_14px_-3px_rgba(249,115,22,0.25)] group-hover:from-orange-500 group-hover:to-orange-600 group-hover:shadow-[0_8px_18px_-3px_rgba(249,115,22,0.4)]"
                        : "border-green-200/60 bg-gradient-to-b from-green-100 to-green-200/90 text-green-600 shadow-[0_6px_14px_-3px_rgba(22,163,74,0.25)] group-hover:from-green-600 group-hover:to-green-700 group-hover:shadow-[0_8px_18px_-3px_rgba(22,163,74,0.4)]"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          "block truncate text-[15px] font-bold leading-5 text-slate-800 transition-colors",
                          isShopee ? "group-hover:text-orange-600" : "group-hover:text-emerald-600"
                        )}
                      >
                        {it.label}
                      </span>
                      {it.isMall && (
                        <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white tracking-wider shadow-sm">
                          MALL
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {platformLabel[it.platform]}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      isShopee ? "group-hover:text-orange-500" : "group-hover:text-emerald-600"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>

          {/* Load More Button for 100+ items */}
          {hasMore && (
            <div className="mt-6 flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={loadMore}
                className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-[14px] font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-600 hover:text-white hover:shadow-md active:scale-98"
              >
                <span>Tampilkan Lebih Banyak ({totalCount - results.length} produk tersisa)</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-[12px] font-semibold text-slate-400">
                Menampilkan {results.length} dari {totalCount} produk
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
