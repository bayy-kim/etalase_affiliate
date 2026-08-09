import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin-header";
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
    <main className="min-h-dvh bg-background-base">
      <AdminPageHeader title="Edit Produk" backHref="/admin/products" />
      <div className="px-4 pb-36 pt-16">
        <ProductForm product={product} isEdit />
      </div>
    </main>
  );
}
