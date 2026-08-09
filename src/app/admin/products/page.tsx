import type { Metadata } from "next";
import Link from "next/link";
import { MousePointerClick, Plus, SlidersHorizontal } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { ProductActions } from "@/components/product-actions";
import { getAllProducts } from "@/lib/data";
import { getIcon, platformUppercase } from "@/lib/icons";
import { formatNumber, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Produk" };

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <AdminShell
      title="Produk"
      subtitle="Kelola semua produk affiliate etalase"
      actions={
        <Link
          href="/admin/products/new"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-background-base transition-transform hover:bg-primary-hover active:scale-95 lg:h-10 lg:w-auto lg:gap-2 lg:rounded-xl lg:px-4 lg:text-[15px] lg:font-[600] lg:text-white"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="hidden lg:inline">Tambah Produk</span>
        </Link>
      }
    >
      {/* Controls bar — desktop */}
      <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl border border-border-subtle bg-surface-card px-4 text-[15px] font-[600] text-on-surface transition-colors hover:bg-surface-bright"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filter
        </button>
        <span className="text-sm text-text-secondary">{formatNumber(products.length)} produk</span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-card p-8 text-center">
          <p className="text-[14px] leading-5 text-text-secondary">
            Belum ada produk. Tambah produk pertama kamu supaya etalase mulai berisi.
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
          {products.map((product) => {
            const Icon = getIcon(product.iconKey);
            const price =
              product.priceMin !== null || product.priceMax !== null
                ? `${formatRupiah(product.priceMin ?? product.priceMax)}${product.priceMin !== null && product.priceMax !== null && product.priceMin !== product.priceMax ? ` – ${formatRupiah(product.priceMax)}` : ""}`
                : null;
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
                      {price && (
                        <span className="text-[14px] font-[600] text-secondary">{price}</span>
                      )}
                    </div>
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
    </AdminShell>
  );
}
