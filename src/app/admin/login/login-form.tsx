"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";

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
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background-base px-4">
      <form
        action={formAction}
        className="flex w-full flex-col gap-6 rounded-2xl border border-border-subtle bg-surface-card p-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-white">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
            Masuk sebagai Admin
          </h1>
          <p className="text-[14px] leading-5 text-text-secondary">
            Akses dashboard pengelolaan Etalase.
          </p>
        </div>

        {state && "error" in state && state.error && (
          <p
            role="alert"
            className="rounded-xl border border-error/40 bg-error-container/30 px-3 py-2 text-[13px] text-on-error-container"
          >
            {state.error}
          </p>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@etalase.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={pending} aria-busy={pending}>
            {pending ? "Memproses..." : "Masuk"}
          </Button>
        </div>
      </form>

      <footer className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
          © 2026 Etalase Affiliate. Secure Admin Access.
        </p>
        <nav aria-label="Footer" className="mt-1 flex gap-4">
          <a href="#" className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary transition-colors hover:text-primary">
            Privacy
          </a>
          <a href="#" className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary transition-colors hover:text-primary">
            Terms
          </a>
          <a href="#" className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary transition-colors hover:text-primary">
            Support
          </a>
        </nav>
      </footer>
    </main>
  );
}

