import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminPageHeader } from "@/components/admin-header";
import { BottomNav } from "@/components/bottom-nav";
import { ProductActions } from "@/components/product-actions";
import { getAllProducts } from "@/lib/data";
import { getIcon, platformUppercase } from "@/lib/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Produk" };

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-dvh bg-background-base pb-24">
      <AdminPageHeader
        title="Produk"
        actions={
          <Link
            href="/admin/products/new"
            aria-label="Tambah produk"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-background-base transition-transform hover:bg-primary-hover active:scale-95"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="flex flex-col gap-3 px-4 pt-20">
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
          products.map((product) => {
            const Icon = getIcon(product.iconKey);
            return (
              <div
                key={product.id}
                className={`flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 transition-opacity ${
                  product.isActive ? "" : "opacity-75"
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-container-high ${
                    product.isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3
                    className={`truncate text-[16px] font-[600] leading-6 ${
                      product.isActive ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {product.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-full border border-border-subtle bg-surface-container-high px-2 py-0.5 text-[10px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                      {platformUppercase[product.platform]}
                    </span>
                    <span className="text-[10px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
                      {product.category}
                    </span>
                  </div>
                </div>
                <ProductActions
                  product={{ id: product.id, label: product.label, isActive: product.isActive }}
                />
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </main>
  );
}
