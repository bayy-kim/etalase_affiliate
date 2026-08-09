import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tambah Produk" };

export default function NewProductPage() {
  return (
    <AdminShell title="Tambah Produk" backHref="/admin/products">
      <div className="mx-auto max-w-xl">
        <ProductForm />
      </div>
    </AdminShell>
  );
}
