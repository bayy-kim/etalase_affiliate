import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { ProductBrowser } from "./product-browser";
import { getAllProducts } from "@/lib/data";
import { formatNumber } from "@/lib/format";

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
      <ProductBrowser products={products} />
      <p className="mt-6 text-[12px] text-text-secondary">
        Total {formatNumber(products.length)} produk tersimpan.
      </p>
    </AdminShell>
  );
}
