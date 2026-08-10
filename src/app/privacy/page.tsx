import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Database,
  Cookie,
  ExternalLink,
  Mail,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Etalase Affiliate",
  description: "Kebijakan privasi Etalase Affiliate. Kami berkomitmen menjaga keamanan informasimu.",
};

const sections = [
  {
    icon: Database,
    title: "Data yang Kami Kumpulkan",
    color: "text-primary",
    bg: "bg-primary/10",
    content: (
      <>
        <p>
          Etalase Affiliate <strong>tidak mengumpulkan data pribadi</strong> pengunjung
          seperti nama, email, atau nomor telepon. Kami hanya mencatat{" "}
          <strong>agregat klik anonim</strong> (waktu klik dan produk yang diklik)
          untuk mengukur performa etalase secara keseluruhan.
        </p>
        <ul className="mt-3 space-y-1.5 text-[13px] sm:text-[14px]">
          {[
            "Alamat IP tidak disimpan",
            "Tidak ada pelacakan lintas-situs",
            "Tidak ada profil pengguna dibuat",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: Cookie,
    title: "Cookie & Penyimpanan Lokal",
    color: "text-amber-600",
    bg: "bg-amber-50",
    content: (
      <p>
        Cookie sesi <code className="rounded bg-surface-variant px-1 py-0.5 text-[12px] font-mono">httpOnly</code>{" "}
        hanya digunakan untuk area <strong>admin</strong> yang dilindungi login.
        Storefront publik <strong>tidak memasang cookie</strong> maupun
        localStorage apa pun pada perangkatmu.
      </p>
    ),
  },
  {
    icon: ExternalLink,
    title: "Tautan ke Platform Lain",
    color: "text-blue-600",
    bg: "bg-blue-50",
    content: (
      <p>
        Klik pada produk akan mengarahkanmu ke platform resmi seperti{" "}
        <strong>TikTok Shop</strong> atau <strong>Shopee</strong> untuk proses
        transaksi. Setelah meninggalkan etalase ini, kebijakan privasi
        platform tujuan yang berlaku — kami tidak mengontrol atau bertanggung
        jawab atas praktik data mereka.
      </p>
    ),
  },
  {
    icon: Lock,
    title: "Keamanan Data",
    color: "text-violet-600",
    bg: "bg-violet-50",
    content: (
      <p>
        Seluruh komunikasi antara browser dan server menggunakan enkripsi{" "}
        <strong>HTTPS/TLS</strong>. Area admin dilindungi autentikasi sesi
        terenkripsi. Kami menerapkan prinsip{" "}
        <em>minimal data collection</em> — hanya mengumpulkan apa yang
        benar-benar diperlukan.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "Hubungi Kami",
    color: "text-green-700",
    bg: "bg-green-50",
    content: (
      <p>
        Punya pertanyaan terkait privasi? Silakan hubungi kami melalui kanal
        yang tersedia di profil etalase. Kami berkomitmen merespons dalam{" "}
        <strong>2 × 24 jam</strong> pada hari kerja.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background-base">
      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-primary/10 via-background-base to-background-base">
        <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-variant hover:text-text-primary sm:h-11 sm:w-11"
            aria-label="Kembali ke etalase"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>

          {/* Hero content */}
          <div className="mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 shadow-clay-sm sm:h-16 sm:w-16">
              <Shield className="h-7 w-7 text-primary sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary sm:text-[12px]">
                Legal
              </p>
              <h1 className="mt-0.5 text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
                Kebijakan Privasi
              </h1>
              <p className="mt-1 text-[13px] text-text-secondary sm:text-[14px]">
                Terakhir diperbarui: Januari 2026
              </p>
            </div>
          </div>

          {/* Intro card */}
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 sm:mt-8 sm:px-5 sm:py-5">
            <p className="text-[13px] leading-relaxed text-text-secondary sm:text-[14px]">
              Kami berkomitmen menjaga kepercayaan dan keamanan pengunjung etalase ini.
              Halaman ini menjelaskan secara transparan data apa yang kami kumpulkan,
              bagaimana kami menggunakannya, dan hak-hakmu.
            </p>
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8">
        <div className="flex flex-col gap-4 sm:gap-5">
          {sections.map(({ icon: Icon, title, color, bg, content }, idx) => (
            <section
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-clay-sm transition-shadow hover:shadow-clay"
            >
              {/* Left accent bar */}
              <div className={`absolute inset-y-0 left-0 w-1 ${bg.replace("bg-", "bg-").replace("/10", "").replace("/50", "")} opacity-60`} />

              <div className="px-5 py-5 sm:px-6 sm:py-6">
                {/* Section header */}
                <div className="mb-3 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} sm:h-10 sm:w-10`}>
                    <Icon className={`h-4 w-4 ${color} sm:h-5 sm:w-5`} aria-hidden="true" />
                  </div>
                  <h2 className="text-[15px] font-semibold leading-snug text-text-primary sm:text-[17px]">
                    {title}
                  </h2>
                  <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-variant text-[11px] font-bold text-text-secondary">
                    {idx + 1}
                  </span>
                </div>

                {/* Section body */}
                <div className="pl-12 text-[13px] leading-relaxed text-on-surface-variant sm:text-[14px]">
                  {content}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="mt-12 flex flex-col items-center gap-3 border-t border-border-subtle pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[12px] text-text-secondary">
            © 2026 Etalase Affiliate · Semua hak dilindungi
          </p>
          <div className="flex items-center gap-4 text-[12px] text-text-secondary">
            <Link
              href="/terms"
              className="underline-offset-2 hover:text-primary hover:underline transition-colors"
            >
              Syarat & Ketentuan
            </Link>
            <span className="text-outline-variant">·</span>
            <Link
              href="/"
              className="underline-offset-2 hover:text-primary hover:underline transition-colors"
            >
              Kembali ke Etalase
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
