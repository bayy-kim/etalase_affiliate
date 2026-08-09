"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { KeyRound } from "lucide-react";

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
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background-base px-4 py-8">
      <form
        action={handleSubmit}
        className="flex w-full flex-col gap-6 rounded-2xl border border-border-subtle bg-surface-card p-6"
      >
        <div className="flex flex-col gap-2 text-center">
          <span className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-background-base">
            <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
          </span>
          <h1 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
            Aktifkan 2FA
          </h1>
          <p className="text-[14px] leading-5 text-text-secondary">
            Scan QR ini dengan Google Authenticator / Authy, lalu masukkan kode untuk verifikasi.
          </p>
        </div>

        {qr ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt="QR code setup untuk aplikasi authenticator"
              width={220}
              height={220}
              className="rounded-xl border border-border-subtle bg-white p-2"
            />
            <p className="text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
              Tidak bisa scan? Ketik kode manual:
            </p>
            <code className="select-all rounded-lg border border-border-subtle bg-background-base px-3 py-1.5 font-mono text-[12px] tracking-wider text-accent-green">
              {secret}
            </code>
          </div>
        ) : (
          <div className="mx-auto h-[220px] w-[220px] animate-pulse rounded-xl border border-border-subtle bg-surface-variant" aria-hidden="true" />
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-error/40 bg-error-container/30 px-3 py-2 text-[13px] text-on-error-container"
          >
            {error}
          </p>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
          <OtpInput error={error ?? undefined} />
          <Button type="submit" className="w-full" disabled={pending || !secret} aria-busy={pending}>
            {pending ? "Menyimpan..." : "Aktifkan 2FA"}
          </Button>
        </motion.div>
      </form>
    </main>
  );
}
