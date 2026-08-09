import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tambah Produk" };

export default function NewProductPage() {
  return (
    <AdminShell title="Tambah Produk" subtitle="Buat tautan affiliate baru ke etalase" backHref="/admin/products">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card lg:p-8">
        <ProductForm />
      </div>
    </AdminShell>
  );
}
