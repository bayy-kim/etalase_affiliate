"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { earningSchema } from "@/lib/validations";
import { addEarning, deleteEarning, writeAudit } from "@/lib/data";
import { getSession } from "@/lib/session";

async function requireAdmin(): Promise<{ adminId: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "Tidak terautentikasi." };
  return { adminId: session.adminId };
}

export type EarningActionState = { error?: string; fieldErrors?: Record<string, string>; ok?: boolean };

export async function addEarningAction(_: EarningActionState, formData: FormData): Promise<EarningActionState> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const parsed = earningSchema.safeParse({
    productId: formData.get("productId") || null,
    platform: formData.get("platform"),
    amount: formData.get("amount"),
    periodDate: formData.get("periodDate"),
    note: formData.get("note") || null,
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.issues?.reduce<Record<string, string>>((acc, issue) => {
      acc[String(issue.path[0])] = issue.message;
      return acc;
    }, {}) ?? {};
    return { fieldErrors };
  }

  const entry = await addEarning(parsed.data);
  await writeAudit(auth.adminId, "create_earning", "earning", entry.id, {
    amount: entry.amount,
    platform: entry.platform,
  });
  revalidatePath("/admin/earnings");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteEarningAction(id: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  await deleteEarning(id);
  await writeAudit(auth.adminId, "delete_earning", "earning", id);
  revalidatePath("/admin/earnings");
  revalidatePath("/admin/dashboard");
  return {};
}

export { redirect };
