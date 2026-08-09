import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin-header";
import { ProductForm } from "@/components/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tambah Produk" };

export default function NewProductPage() {
  return (
    <main className="min-h-dvh bg-background-base">
      <AdminPageHeader title="Tambah Produk" backHref="/admin/products" />
      <div className="px-4 pb-36 pt-16">
        <ProductForm />
      </div>
    </main>
  );
}
