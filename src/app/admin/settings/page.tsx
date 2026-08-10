import type { Metadata } from "next";
import { ShieldCheck, LogOut, AtSign, UserRound } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { SettingsForm } from "./settings-form";
import { getProfile, getAdminById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/server/actions/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [profile, session] = await Promise.all([getProfile(), getSession()]);
  const admin = session ? await getAdminById(session.adminId) : null;

  return (
    <AdminShell title="Settings" subtitle="Pengaturan profil, foto, keamanan, dan akun">
      <div className="flex flex-col gap-6">
        <SettingsForm profile={profile} />

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <section
            aria-labelledby="security-heading"
            className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card"
          >
            <h2 id="security-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Keamanan
            </h2>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-100 to-indigo-200/90 text-indigo-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-slate-900">2FA Authenticator</p>
                  <p className="text-[12px] text-slate-500">
                    {admin?.totpEnabled ? "Aktif — login wajib kode" : "Belum diaktifkan"}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                  admin?.totpEnabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "border border-slate-200 bg-slate-100 text-slate-500"
                }`}
              >
                {admin?.totpEnabled ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 text-[15px] font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white active:scale-98"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Keluar dari Sesi
              </button>
            </form>
          </section>

          <section
            aria-labelledby="account-heading"
            className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card"
          >
            <h2 id="account-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Informasi Akun
            </h2>
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <AtSign className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Admin</span>
                <span className="truncate text-[14px] font-bold text-slate-800">{admin?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hak Akses</span>
                <span className="text-[14px] font-bold text-slate-800">Single Administrator</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
