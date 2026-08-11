"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/otp-input";
import { setupTotpAction } from "@/server/actions/auth";

export function Setup2faForm({ email }: { email: string }) {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const generated = new OTPAuth.Secret({ size: 20 });
    const base32 = generated.base32;
    const totp = new OTPAuth.TOTP({
      issuer: "Etalase Affiliate",
      label: email,
      secret: generated,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });
    setSecret(base32);
    QRCode.toDataURL(totp.toString(), { margin: 1, width: 240 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [email]);

  const handleSubmit = async (formData: FormData) => {
    if (!secret) return;
    setPending(true);
    setError(null);
    const result = await setupTotpAction(secret, String(formData.get("code") ?? ""));
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0d0e10] px-4 py-8 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Background Radial Glow Effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[440px]">
        <form
          action={handleSubmit}
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
                <KeyRound className="h-7 w-7" aria-hidden="true" />
              </span>
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-500">
                Security Shield
              </span>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Aktifkan 2FA
              </h1>
              <p className="mt-1 text-[13px] text-slate-400 leading-normal">
                Scan QR ini menggunakan Google Authenticator / Authy untuk pendaftaran
              </p>
            </div>
          </div>

          {qr ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative rounded-2xl border-4 border-[#1c1e22] bg-white p-3 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr}
                  alt="QR code setup untuk aplikasi authenticator"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <div className="w-full text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tidak bisa scan? Ketik kode manual:
                </p>
                <div className="mt-1.5 flex justify-center">
                  <code className="select-all rounded-xl border border-slate-800 bg-[#1c1e22] px-3.5 py-2 font-mono text-[12px] font-bold tracking-wider text-emerald-400 shadow-inner">
                    {secret}
                  </code>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="mx-auto h-[200px] w-[200px] animate-pulse rounded-2xl border border-slate-800 bg-[#1c1e22]"
              aria-hidden="true"
            />
          )}

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-[13px] font-medium text-rose-400"
            >
              {error}
            </p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-center">
              <OtpInput error={error ?? undefined} />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="h-12 w-full bg-emerald-600 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50"
                disabled={pending || !secret}
                aria-busy={pending}
              >
                {pending ? "Mengaktifkan..." : "Aktifkan & Lanjutkan"}
              </Button>
              
              <p className="text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Batal / Kembali
                </Link>
              </p>
            </div>
          </motion.div>
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
