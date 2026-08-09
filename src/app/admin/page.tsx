import { redirect } from "next/navigation";

export const metadata = { title: "Admin" };

export default function AdminIndex() {
  redirect("/admin/dashboard");
}
