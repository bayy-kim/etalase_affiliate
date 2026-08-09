import type { Metadata } from "next";
import { ShieldCheck, LogOut, Link2, AtSign, UserRound } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { getProfile, getAdminById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/server/actions/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = getProfile();
  const session = await getSession();
  const admin = session ? await getAdminById(session.adminId) : null;

  return (
    <AdminShell title="Settings" subtitle="Pengaturan profil, keamanan, dan akun">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profil */}
        <section
          aria-labelledby="profile-heading"
          className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-5"
        >
          <h2 id="profile-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
            Profil Etalase
          </h2>

          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-border-subtle bg-[radial-gradient(circle_at_30%_25%,#22c55e33,#111214_60%)] text-2xl font-[800] text-accent-green"
            >
              {profile.displayName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-[600] leading-6 text-text-primary">{profile.displayName}</p>
              <p className="text-[14px] leading-5 text-text-secondary">{profile.handle}</p>
            </div>
          </div>

          <p className="text-[14px] leading-5 text-text-secondary">{profile.bio}</p>

          <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-background-base px-3 py-2.5">
            <Link2 className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
            <span className="truncate text-[14px] text-text-secondary">{profile.link}</span>
          </div>

          <p className="text-[12px] text-text-secondary">
            Upload avatar & edit bio tersedia di fase berikutnya (MVP memakai data ini).
          </p>
        </section>

        {/* Keamanan + akun */}
        <section className="flex flex-col gap-6">
          <section
            aria-labelledby="security-heading"
            className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-5"
          >
            <h2 id="security-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
              Keamanan
            </h2>

            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-base">
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-[600] leading-5 text-text-primary">2FA Authenticator</p>
                  <p className="text-[12px] text-text-secondary">
                    {admin?.totpEnabled ? "Aktif — login wajib kode" : "Belum diaktifkan"}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-[600] uppercase tracking-[0.05em] ${
                  admin?.totpEnabled
                    ? "bg-primary-container-dark text-primary"
                    : "border border-border-subtle bg-surface-container text-text-secondary"
                }`}
              >
                {admin?.totpEnabled ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-error/40 bg-error-container/20 text-[15px] font-[600] text-on-error-container transition-colors hover:bg-error-container/30"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Keluar dari Sesi
              </button>
            </form>
          </section>

          <section
            aria-labelledby="account-heading"
            className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-card p-5"
          >
            <h2 id="account-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
              Akun
            </h2>
            <div className="flex items-center gap-3">
              <AtSign className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
              <span className="truncate text-[14px] text-text-primary">{admin?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <UserRound className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
              <span className="text-[14px] text-text-primary">Single admin</span>
            </div>
          </section>
        </section>
      </div>
    </AdminShell>
  );
}
