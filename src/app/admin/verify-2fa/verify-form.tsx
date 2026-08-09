"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LockKeyhole } from "lucide-react";

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
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background-base px-4">
      <header className="mb-6 flex items-center gap-2">
        <LockKeyhole className="h-6 w-6 text-primary" aria-hidden="true" />
        <span className="text-[24px] font-[700] leading-8 tracking-[-0.02em] text-primary">
          ETALASE
        </span>
      </header>

      <form
        action={formAction}
        className="flex w-full flex-col gap-6 rounded-2xl border border-border-subtle bg-surface-card p-6"
      >
        <div className="flex flex-col gap-2 text-center">
          <span className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-background-base">
            <LockKeyhole className="h-6 w-6 text-primary" aria-hidden="true" />
          </span>
          <h1 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
            Verifikasi 2FA
          </h1>
          <p className="text-[14px] leading-5 text-text-secondary">
            Buka aplikasi authenticator kamu dan masukkan kode 6 digit
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

        <div className="flex flex-col gap-8">
          <OtpInput error={state && "error" in state ? state.error : undefined} />

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
              {pending ? "Memverifikasi..." : "Verifikasi"}
            </Button>
            <p className="text-center">
              <a
                href="/admin/login"
                className="text-[14px] leading-5 text-text-secondary transition-colors hover:text-primary"
              >
                Kirim ulang / bantuan
              </a>
            </p>
          </div>
        </div>
      </form>

      <footer className="mt-6 text-center">
        <p className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
          © 2026 Etalase Affiliate. Secure Admin Access.
        </p>
      </footer>
    </main>
  );
}
