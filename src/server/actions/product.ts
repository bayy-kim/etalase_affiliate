"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { productSchema } from "@/lib/validations";
import {
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
  updateProductOrders,
  writeAudit,
} from "@/lib/data";
import { getSession } from "@/lib/session";

async function requireAdmin(): Promise<{ adminId: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "Tidak terautentikasi." };
  return { adminId: session.adminId };
}

function fieldErrors(err: { issues?: { path: (string | number)[]; message: string }[] }) {
  return err.issues?.reduce<Record<string, string>>((acc, issue) => {
    acc[String(issue.path[0])] = issue.message;
    return acc;
  }, {}) ?? {};
}

export type ActionState = { error?: string; fieldErrors?: Record<string, string> };

export async function createProductAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const parsed = productSchema.safeParse({
    label: formData.get("label"),
    internalNote: formData.get("internalNote") || null,
    category: formData.get("category"),
    iconKey: formData.get("iconKey"),
    platform: formData.get("platform"),
    affiliateUrl: formData.get("affiliateUrl"),
    income: formData.get("income") || null,
    isMall: formData.get("isMall") === "on",
    isActive: formData.get("isActive") === "on",
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const product = await createProduct(parsed.data);
  await writeAudit(auth.adminId, "create_product", "product", product.id, {
    label: product.label,
    platform: product.platform,
  });
  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const parsed = productSchema.safeParse({
    label: formData.get("label"),
    internalNote: formData.get("internalNote") || null,
    category: formData.get("category"),
    iconKey: formData.get("iconKey"),
    platform: formData.get("platform"),
    affiliateUrl: formData.get("affiliateUrl"),
    income: formData.get("income") || null,
    isMall: formData.get("isMall") === "on",
    isActive: formData.get("isActive") === "on",
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  await updateProduct(id, parsed.data);
  await writeAudit(auth.adminId, "update_product", "product", id, {
    label: parsed.data.label,
  });
  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function toggleProductAction(id: string, isActive: boolean): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  await setProductActive(id, isActive);
  await writeAudit(auth.adminId, isActive ? "activate_product" : "deactivate_product", "product", id);
  revalidatePath("/");
  revalidatePath("/admin/products");
  return {};
}

export async function deleteProductAction(id: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  await deleteProduct(id);
  await writeAudit(auth.adminId, "delete_product", "product", id);
  revalidatePath("/");
  revalidatePath("/admin/products");
  return {};
}

export async function reorderProductsAction(orders: { id: string; sortOrder: number }[]): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  await updateProductOrders(orders);
  await writeAudit(auth.adminId, "reorder_products", "product", null, { count: orders.length });
  revalidatePath("/");
  revalidatePath("/admin/products");
  return {};
}

