"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MousePointerClick, Plus, Search } from "lucide-react";

import { ProductActions } from "@/components/product-actions";
import { Select } from "@/components/ui/select";
import { categorySelectOptions, getIcon, platformUppercase } from "@/lib/icons";
import { formatNumber, formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

type SortKey = "order" | "name" | "clicks";

export function ProductBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("order");

  const list = useMemo(() => {
    let out = products;
    if (category !== "all") out = out.filter((p) => p.category === category);
    if (platform !== "all") out = out.filter((p) => p.platform === platform);
    if (status === "active") out = out.filter((p) => p.isActive);
    if (status === "inactive") out = out.filter((p) => !p.isActive);
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (p) => p.label.toLowerCase().includes(q) || (p.internalNote ?? "").toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "name":
        out = [...out].sort((a, b) => a.label.localeCompare(b.label, "id"));
        break;
      case "clicks":
        out = [...out].sort((a, b) => b.clickCount - a.clickCount);
        break;
      default:
        out = [...out].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return out;
  }, [products, query, category, platform, status, sort]);

  return (
    <div className="flex flex-col gap-4">
      {/* Kontrol */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk…"
            aria-label="Cari produk"
            className="h-11 w-full rounded-xl border border-border-subtle bg-surface-card pl-10 pr-4 text-[14px] text-text-primary transition-colors placeholder:text-text-secondary focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter kategori">
            <option value="all">Semua Kategori</option>
            {categorySelectOptions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)} aria-label="Filter platform">
            <option value="all">Semua Platform</option>
            <option value="TIKTOK_SHOP">TikTok Shop</option>
            <option value="SHOPEE">Shopee</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Urutkan">
            <option value="order">Urutan</option>
            <option value="name">Nama A–Z</option>
            <option value="clicks">Klik Tertinggi</option>
          </Select>
        </div>
        <p className="text-[12px] text-text-secondary" aria-live="polite">
          {list.length} produk
        </p>
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-card p-8 text-center">
          <p className="text-[14px] leading-5 text-text-secondary">
            Tidak ada produk yang cocok dengan filter.
          </p>
          <Link
            href="/admin/products/new"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-primary-container bg-primary-container px-4 text-[15px] font-[600] text-white transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Tambah Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {list.map((product) => {
            const Icon = getIcon(product.iconKey);
            const income = product.income ?? 0;
            return (
              <div
                key={product.id}
                className={cn(
                  "flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 transition-colors",
                  product.isActive ? "" : "opacity-75"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-background-base",
                      product.isActive ? "text-text-primary" : "text-text-secondary"
                    )}
                  >
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        "truncate text-[18px] font-[600] leading-6 tracking-[-0.01em]",
                        product.isActive ? "text-on-surface" : "text-text-secondary"
                      )}
                    >
                      {product.label}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="inline-block rounded-full border border-border-subtle bg-surface-container px-2 py-0.5 text-[10px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                        {platformUppercase[product.platform]}
                      </span>
                      <span className="text-[11px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                        {categorySelectOptions.find((c) => c.value === product.category)?.label ?? product.category}
                      </span>
                    </div>
                    {income > 0 ? (
                      <p className="mt-1 text-[14px] font-[600] text-secondary">
                        Pendapatan: {formatRupiah(income)}
                      </p>
                    ) : (
                      <p className="mt-1 text-[14px] font-[600] text-text-secondary">
                        Belum ada pendapatan
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-4">
                  <span className="flex items-center gap-1.5 text-[14px] text-text-secondary">
                    <MousePointerClick className="h-4 w-4" aria-hidden="true" />
                    {formatNumber(product.clickCount)} klik
                  </span>
                  <ProductActions
                    product={{ id: product.id, label: product.label, isActive: product.isActive }}
                    layout="card"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
