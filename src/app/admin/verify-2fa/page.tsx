import type { Metadata } from "next";

import { Verify2faForm } from "./verify-form";

export const metadata: Metadata = { title: "Verifikasi 2FA" };

export default function Verify2faPage() {
  return <Verify2faForm />;
}
