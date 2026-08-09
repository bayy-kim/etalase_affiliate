"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveProfile, writeAudit } from "@/lib/data";
import { getSession } from "@/lib/session";

const profileSchema = z.object({
  handle: z.string().trim().min(1, "Handle wajib diisi").max(60),
  displayName: z.string().trim().min(1, "Nama wajib diisi").max(60),
  bio: z.string().trim().max(300).optional(),
  link: z.string().trim().max(500).optional(),
});

export type ProfileActionResult = { ok: boolean; error?: string };

async function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function saveProfileAction(
  _: unknown,
  formData: FormData
): Promise<ProfileActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Tidak terautentikasi." };

  const parsed = profileSchema.safeParse({
    handle: formData.get("handle"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio") || undefined,
    link: formData.get("link") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  await saveProfile({ ...parsed.data, link: parsed.data.link ?? "" });
  await writeAudit(session.adminId, "update_profile", "profile");
  await refresh();
  return { ok: true };
}

export async function saveAvatarAction(
  _: unknown,
  formData: FormData
): Promise<ProfileActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Tidak terautentikasi." };

  // Mode 1: tempel URL
  const url = String(formData.get("avatarUrl") ?? "").trim();
  if (url) {
    if (!/^https?:\/\/\S+$/i.test(url)) {
      return { ok: false, error: "URL avatar tidak valid (harus http/https)." };
    }
    await saveProfile({ avatar: url });
    await writeAudit(session.adminId, "update_avatar", "profile");
    await refresh();
    return { ok: true };
  }

  // Mode 2: upload lokal → Vercel Blob
  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "Pilih file gambar atau tempel URL." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "File harus berupa gambar." };
  }
  if (file.size > 4 * 1024 * 1024) {
    return { ok: false, error: "Ukuran file maksimal 4MB." };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "Upload nonaktif — set BLOB_READ_WRITE_TOKEN (Vercel Blob). URL tetap bisa dipakai." };
  }

  try {
    const safeName = file.name.replace(/[^a-z0-9.\-]/gi, "") || "avatar";
    const blob = await put(`avatars/${Date.now()}-${safeName}`, file, { access: "public" });
    await saveProfile({ avatar: blob.url });
    await writeAudit(session.adminId, "update_avatar", "profile", null, { blob: true });
    await refresh();
    return { ok: true };
  } catch {
    return { ok: false, error: "Upload gagal. Coba lagi atau pakai URL." };
  }
}
