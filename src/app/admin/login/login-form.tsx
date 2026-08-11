"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/server/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state && "step" in state) {
      if (state.step === "2fa") {
        router.push("/admin/verify-2fa");
      } else if (state.step === "done") {
        router.push(state.to);
      }
    }
  }, [state, router]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0d0e10] px-4 py-8 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Background Radial Glow Effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden="true"
      />

      {/* Back to Storefront Link */}
      <Link
        href="/"
        className="group absolute left-4 top-4 inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#16171a]/80 px-3.5 py-2 text-[13px] font-semibold text-slate-400 backdrop-blur-md transition-all hover:border-slate-700 hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Ke Etalase
      </Link>

      <div className="relative w-full max-w-[420px]">
        <form
          action={formAction}
          className="flex w-full flex-col gap-6 rounded-3xl border border-slate-800/80 bg-[#151619]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 blur opacity-40"
                aria-hidden="true"
              />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-[#1a1c21] text-emerald-400 shadow-md">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </span>
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-500">
                Admin Access
              </span>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Masuk Etalase Admin
              </h1>
              <p className="mt-1 text-[13px] text-slate-400">
                Kelola produk, analitik &amp; penghasilan etalase
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

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-slate-300">
                Email Admin
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@etalase.com"
                  className="h-12 border-slate-800 bg-[#1c1e22] pl-11 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-12 border-slate-800 bg-[#1c1e22] pl-11 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 h-12 w-full bg-emerald-600 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Memproses..." : "Masuk ke Admin"}
            </Button>
          </div>
        </form>

        <footer className="mt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            © 2026 Etalase Affiliate · Secure Portal
          </p>
          <nav aria-label="Footer Legal" className="mt-1 flex gap-4 text-[12px] text-slate-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-emerald-400 hover:underline"
            >
              Privacy
            </Link>
            <span>·</span>
            <Link
              href="/terms"
              className="transition-colors hover:text-emerald-400 hover:underline"
            >
              Terms
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
