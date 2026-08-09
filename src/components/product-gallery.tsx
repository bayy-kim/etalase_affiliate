"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { ArrowUpRight, Search, X } from "lucide-react";

import { ProductRow } from "@/components/product-row";
import { categoryOptions, getIcon, platformLabel, type PlatformKey } from "@/lib/icons";
import type { Product } from "@/lib/data";

type IndexItem = {
  id: string;
  label: string;
  category: string;
  categoryLabel: string;
  platform: PlatformKey;
  sortOrder: number;
  iconKey: string;
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

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  const indexItems = useMemo<IndexItem[]>(
    () =>
      products.map((p) => ({
        id: p.id,
        label: p.label,
        category: p.category,
        categoryLabel: categoryLabelOf(p.category),
        platform: p.platform,
        sortOrder: p.sortOrder,
        iconKey: p.iconKey,
      })),
    [products]
  );

  const byCategory = useMemo(
    () =>
      activeCategory === "all"
        ? indexItems
        : indexItems.filter((it) => it.category === activeCategory),
    [indexItems, activeCategory]
  );

  const results = useMemo(() => {
    const q = debounced.trim();
    if (!q) return byCategory;

    // Angka = urutan produk di etalase (posisi 1-based)
    const numeric = /^\d{1,3}$/.test(q) ? parseInt(q, 10) : null;
    if (numeric !== null) {
      const positional = byCategory.filter((it) => it.sortOrder + 1 === numeric);
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
      minMatchCharLength: 2,
    });
    return fuse.search(q).map((r) => r.item);
  }, [debounced, byCategory]);

  const hasQuery = debounced.trim().length > 0;
  const empty = results.length === 0;

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Search */}
      <div role="search" aria-label="Cari produk" className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari produk… (ketik angka untuk cari urutan)"
          className="h-12 w-full rounded-xl border border-border-subtle bg-surface-card pl-12 pr-12 text-[15px] text-text-primary transition-colors placeholder:text-text-secondary focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Hapus pencarian"
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-text-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {hasQuery && (
        <p className="text-[13px] text-text-secondary" aria-live="polite">
          {empty ? "Tidak ditemukan." : `${results.length} hasil`}
        </p>
      )}

      {empty ? (
        <p className="rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-[14px] text-text-secondary">
          Tidak ditemukan — coba kata kunci lain atau hapus pencarian.
        </p>
      ) : (
        <>
          {/* List mobile */}
          <div className="flex flex-col gap-3 lg:hidden">
            {results.map((it) => (
              <ProductRow
                key={it.id}
                product={{ id: it.id, label: it.label, category: it.category, iconKey: it.iconKey, platform: it.platform }}
              />
            ))}
          </div>

          {/* Grid desktop */}
          <div className="hidden grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4 lg:grid">
            {results.map((it) => {
              const Icon = getIcon(it.iconKey);
              return (
                <Link
                  key={it.id}
                  href={`/go/${it.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-card p-4 transition-colors hover:border-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
                >
                  <span className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-primary">
                    {String(it.sortOrder + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-base text-text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-bold leading-6 text-text-primary">
                      {it.label}
                    </span>
                    <span className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                      {platformLabel[it.platform]}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-text-secondary transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
