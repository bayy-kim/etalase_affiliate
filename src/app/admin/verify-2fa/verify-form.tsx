"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/otp-input";
import { verifyTotpAction } from "@/server/actions/auth";

export function Verify2faForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(verifyTotpAction, null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }, [state, router]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0d0e10] px-4 py-8 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Background Radial Glow Effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[420px]">
        <form
          action={formAction}
          className="flex w-full flex-col gap-6 rounded-3xl border border-slate-800/80 bg-[#151619]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 blur opacity-45"
                aria-hidden="true"
              />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-[#1a1c21] text-emerald-400 shadow-md">
                <ShieldAlert className="h-7 w-7" aria-hidden="true" />
              </span>
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-500">
                Two-Factor Auth
              </span>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Verifikasi Keamanan
              </h1>
              <p className="mt-1 text-[13px] text-slate-400 leading-normal">
                Buka aplikasi authenticator kamu dan masukkan kode OTP 6 digit
              </p>
            </div>
          </div>

          {state && "error" in state && state.error && (
            <p
              role="alert"
              className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-[13px] font-medium text-rose-400"
            >
              {state.error}
            </p>
          )}

          <div className="flex flex-col gap-8">
            {/* Input OTP */}
            <div className="flex justify-center">
              <OtpInput error={state && "error" in state ? state.error : undefined} />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="h-12 w-full bg-emerald-600 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 active:scale-[0.99]"
                disabled={pending}
                aria-busy={pending}
              >
                {pending ? "Memverifikasi..." : "Verifikasi & Masuk"}
              </Button>

              <p className="text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Kembali ke halaman Login
                </Link>
              </p>
            </div>
          </div>
        </form>

        <footer className="mt-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            © 2026 Etalase Affiliate · Secure Portal
          </p>
        </footer>
      </div>
    </main>
  );
}
