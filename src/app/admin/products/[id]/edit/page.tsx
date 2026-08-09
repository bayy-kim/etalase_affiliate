import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";
import { getProduct } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit Produk" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <AdminShell title="Edit Produk" backHref="/admin/products">
      <div className="mx-auto max-w-xl">
        <ProductForm product={product} isEdit />
      </div>
    </AdminShell>
  );
}
