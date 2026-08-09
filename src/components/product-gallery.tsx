"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";

import { ProductRow } from "@/components/product-row";
import { categoryOptions, getIcon, platformLabel, type PlatformKey } from "@/lib/icons";
import type { Product } from "@/lib/data";

const PAGE_SIZE = 20;

type IndexItem = {
  id: string;
  label: string;
  category: string;
  categoryLabel: string;
  platform: PlatformKey;
  iconKey: string;
  pos: number;
};

function categoryLabelOf(value: string): string {
  return categoryOptions.find((c) => c.value === value)?.label ?? value;
}

export function ProductGallery({
  products,
  activeCategory,
}: {
  products: Product[];
  activeCategory: string;
}) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, debounced]);

  const indexItems = useMemo<IndexItem[]>(
    () =>
      products.map((p) => ({
        id: p.id,
        label: p.label,
        category: p.category,
        categoryLabel: categoryLabelOf(p.category),
        platform: p.platform,
        iconKey: p.iconKey,
        pos: 0,
      })),
    [products]
  );

  const byCategory = useMemo(
    () =>
      (activeCategory === "all"
        ? indexItems
        : indexItems.filter((it) => it.category === activeCategory)
      ).map((it, i) => ({ ...it, pos: i + 1 })),
    [indexItems, activeCategory]
  );

  const results = useMemo(() => {
    const q = debounced.trim();
    if (!q) return byCategory;

    const numeric = /^\d{1,3}$/.test(q) ? parseInt(q, 10) : null;
    if (numeric !== null) {
      const positional = byCategory.filter((it) => it.pos === numeric);
      if (positional.length > 0) return positional;
    }

    const fuse = new Fuse(byCategory, {
      keys: [
        { name: "label", weight: 0.6 },
        { name: "categoryLabel", weight: 0.25 },
        { name: "platform", weight: 0.15 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
    return fuse.search(q).map((r) => r.item);
  }, [debounced, byCategory]);

  const visibleResults = useMemo(
    () => results.slice(0, visibleCount),
    [results, visibleCount]
  );

  const hasQuery = debounced.trim().length > 0;
  const empty = results.length === 0;
  const hasMore = visibleCount < results.length;

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
          className="h-13 w-full rounded-2xl border border-slate-200/80 bg-white pl-12 pr-12 text-[15px] font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
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
          {empty ? "Tidak ditemukan." : `${results.length} hasil`}
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
            {visibleResults.map((it) => (
              <ProductRow
                key={it.id}
                product={{ id: it.id, label: it.label, category: it.category, iconKey: it.iconKey, platform: it.platform }}
              />
            ))}
          </div>

          {/* Grid desktop */}
          <div className="hidden grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid">
            {visibleResults.map((it) => {
              const Icon = getIcon(it.iconKey);
              return (
                <Link
                  key={it.id}
                  href={`/go/${it.id}`}
                  prefetch={false}
                  className="group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-clay-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span className="font-mono text-[16px] font-extrabold text-indigo-600">
                    {String(it.pos).padStart(2, "0")}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200/60 bg-gradient-to-b from-indigo-100 to-indigo-200/90 text-indigo-600 shadow-[0_6px_14px_-3px_rgba(99,102,241,0.25)] transition-all duration-200 group-hover:scale-105 group-hover:from-indigo-600 group-hover:to-indigo-700 group-hover:text-white group-hover:shadow-[0_8px_18px_-3px_rgba(99,102,241,0.4)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold leading-5 text-slate-800 transition-colors group-hover:text-indigo-600">
                      {it.label}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {platformLabel[it.platform]}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>

          {/* Load More Button for 100+ items */}
          {hasMore && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-3 text-[14px] font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white hover:shadow-md active:scale-98"
              >
                <span>Tampilkan Lebih Banyak ({results.length - visibleCount} produk tersisa)</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-[12px] font-semibold text-slate-400">
                Menampilkan {visibleResults.length} dari {results.length} produk
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
