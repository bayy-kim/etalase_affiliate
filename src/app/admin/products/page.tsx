import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { ProductBrowser } from "./product-browser";
import { getAllProductsPaginated } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Produk" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    k?: string;
    p?: string;
    s?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const category = params.k ?? "all";
  const platform = params.p ?? "all";
  const status = params.s ?? "all";
  const sort = params.sort ?? "order";
  const query = params.q ?? "";
  const page = parseInt(params.page ?? "1", 10) || 1;

  const { products, totalCount, hasMore } = await getAllProductsPaginated({
    page,
    limit: 21, // Kelipatan 3 untuk grid desktop yang seimbang
    category,
    platform,
    status,
    sort,
    search: query,
  });

  return (
    <AdminShell
      title="Produk"
      subtitle="Kelola semua produk affiliate etalase"
      actions={
        <Link
          href="/admin/products/new"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white transition-transform hover:bg-indigo-700 active:scale-95 lg:h-10 lg:w-auto lg:gap-2 lg:rounded-xl lg:px-4 lg:text-[15px] lg:font-[600]"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="hidden lg:inline">Tambah Produk</span>
        </Link>
      }
    >
      <ProductBrowser
        products={products}
        totalCount={totalCount}
        hasMore={hasMore}
        currentPage={page}
      />
    </AdminShell>
  );
}
