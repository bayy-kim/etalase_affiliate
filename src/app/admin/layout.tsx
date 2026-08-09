import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Etalase Affiliate",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-background-base">
      {children}
    </div>
  );
}
