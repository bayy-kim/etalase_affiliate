"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, MousePointerClick, Plus, Search } from "lucide-react";

import { ProductActions } from "@/components/product-actions";
import { Select } from "@/components/ui/select";
import { categorySelectOptions, getIcon, platformUppercase } from "@/lib/icons";
import { formatNumber, formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { reorderProductsAction } from "@/server/actions/product";

type SortKey = "order" | "name" | "clicks";

export function ProductBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("order");
  const [reordering, setReordering] = useState(false);

  const moveProduct = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    setReordering(true);

    // Swap sortOrder
    const currentItem = list[index];
    const targetItem = list[targetIndex];

    const currentOrder = currentItem.sortOrder;
    const targetOrder = targetItem.sortOrder === currentOrder
      ? (direction === "up" ? currentOrder - 1 : currentOrder + 1)
      : targetItem.sortOrder;

    const updates = [
      { id: currentItem.id, sortOrder: targetOrder },
      { id: targetItem.id, sortOrder: currentOrder },
    ];

    await reorderProductsAction(updates);
    setReordering(false);
    router.refresh();
  };

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
          {list.map((product, idx) => {
            const Icon = getIcon(product.iconKey);
            const income = product.income ?? 0;
            const canReorder = sort === "order" && category === "all" && platform === "all" && status === "all" && !query;

            return (
              <div
                key={product.id}
                className={cn(
                  "flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                  product.isActive ? "" : "opacity-60"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200/60 shadow-[0_6px_14px_-3px_rgba(99,102,241,0.25)] transition-transform duration-200 group-hover:scale-105",
                      product.isActive
                        ? "bg-gradient-to-b from-indigo-100 to-indigo-200/90 text-indigo-600"
                        : "bg-slate-100 text-slate-400 border-slate-200 shadow-none"
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={cn(
                          "truncate text-[16px] font-bold leading-6 tracking-tight",
                          product.isActive ? "text-slate-900" : "text-slate-500"
                        )}
                      >
                        {product.label}
                      </h3>
                      {canReorder && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0 || reordering}
                            onClick={() => moveProduct(idx, "up")}
                            title="Naikkan urutan"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === list.length - 1 || reordering}
                            onClick={() => moveProduct(idx, "down")}
                            title="Turunkan urutan"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {product.isMall && (
                        <span className="inline-block rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                          MALL
                        </span>
                      )}
                      <span className="inline-block rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {platformUppercase[product.platform]}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {categorySelectOptions.find((c) => c.value === product.category)?.label ?? product.category}
                      </span>
                    </div>
                    {income > 0 ? (
                      <p className="mt-2 text-[13px] font-bold text-emerald-600">
                        Pendapatan: {formatRupiah(income)}
                      </p>
                    ) : (
                      <p className="mt-2 text-[13px] font-medium text-slate-400">
                        Belum ada pendapatan
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
                    <MousePointerClick className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                    <strong className="text-slate-800 font-bold">{formatNumber(product.clickCount)}</strong> klik
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
