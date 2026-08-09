import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";
import { getAdminById } from "@/lib/data";
import { Setup2faForm } from "./setup-form";

export const metadata: Metadata = { title: "Aktifkan 2FA" };

export default async function Setup2faPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const admin = await getAdminById(session.adminId);
  if (admin?.totpEnabled) redirect("/admin/dashboard");

  return <Setup2faForm email={session.email} />;
}
