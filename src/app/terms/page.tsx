import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ScrollText,
  Store,
  ArrowRightLeft,
  BadgeDollarSign,
  UserCheck,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Etalase Affiliate",
  description: "Syarat dan ketentuan penggunaan Etalase Affiliate.",
};

const sections = [
  {
    icon: Store,
    title: "Sifat Layanan",
    color: "text-primary",
    bg: "bg-primary/10",
    badge: "Umum",
    content: (
      <p>
        Etalase Affiliate adalah halaman <em>link in bio</em> yang menampilkan
        kumpulan tautan produk afiliasi. Situs ini{" "}
        <strong>bukan platform transaksi</strong> — pembelian, pembayaran, dan
        pengiriman terjadi sepenuhnya di platform resmi tujuan yang kamu pilih.
      </p>
    ),
  },
  {
    icon: ArrowRightLeft,
    title: "Redirect ke Platform Resmi",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "Redirect",
    content: (
      <>
        <p>
          Setiap klik pada produk akan mengarahkanmu ke tautan affiliate resmi
          (TikTok Shop, Shopee, atau platform lain). Kami{" "}
          <strong>tidak bertanggung jawab</strong> atas:
        </p>
        <ul className="mt-3 space-y-1.5 text-[13px] sm:text-[14px]">
          {[
            "Ketersediaan atau kehabisan stok produk",
            "Akurasi harga di platform tujuan",
            "Proses pembayaran dan pengiriman",
            "Kebijakan pengembalian barang",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: BadgeDollarSign,
    title: "Pengungkapan Afiliasi",
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "Transparansi",
    content: (
      <>
        <p>
          Sesuai prinsip keterbukaan, kami menyatakan bahwa{" "}
          <strong>sebagian atau seluruh tautan</strong> di etalase ini bersifat
          afiliasi. Artinya, kami dapat memperoleh komisi dari pembelian yang
          terjadi melalui tautan tersebut.
        </p>
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-3 text-[12px] text-amber-800 sm:text-[13px]">
          💡 Komisi ini <strong>tidak menambah biaya apa pun</strong> bagimu.
          Harga yang kamu bayar sama dengan harga normal di platform resmi.
          Dukunganmu membantu kelangsungan etalase ini.
        </div>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: "Tanggung Jawab Pengguna",
    color: "text-violet-600",
    bg: "bg-violet-50",
    badge: "Pengguna",
    content: (
      <p>
        Dengan menggunakan etalase ini, kamu menyetujui bahwa kamu bertanggung
        jawab untuk memastikan penggunaan tautan sesuai dengan{" "}
        <strong>kebijakan platform tujuan</strong> serta peraturan yang berlaku
        di wilayahmu. Dilarang menggunakan etalase ini untuk tujuan yang
        melanggar hukum.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "Perubahan Syarat",
    color: "text-rose-600",
    bg: "bg-rose-50",
    badge: "Pembaruan",
    content: (
      <p>
        Kami berhak memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa
        pemberitahuan terlebih dahulu. Perubahan berlaku efektif sejak
        diterbitkan di halaman ini. Disarankan untuk meninjau halaman ini
        secara berkala. Penggunaan berkelanjutan dianggap sebagai{" "}
        <strong>penerimaan syarat terbaru</strong>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-background-base">
      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-blue-50/60 via-background-base to-background-base">
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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 shadow-clay-sm sm:h-16 sm:w-16">
              <ScrollText className="h-7 w-7 text-blue-600 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 sm:text-[12px]">
                Legal
              </p>
              <h1 className="mt-0.5 text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
                Syarat &amp; Ketentuan
              </h1>
              <p className="mt-1 text-[13px] text-text-secondary sm:text-[14px]">
                Terakhir diperbarui: Januari 2026
              </p>
            </div>
          </div>

          {/* Intro card */}
          <div className="mt-6 rounded-2xl border border-blue-200/60 bg-blue-50/60 px-4 py-4 sm:mt-8 sm:px-5 sm:py-5">
            <p className="text-[13px] leading-relaxed text-text-secondary sm:text-[14px]">
              Harap baca syarat dan ketentuan berikut sebelum menggunakan etalase ini.
              Dengan mengakses dan menggunakan layanan, kamu menyatakan telah membaca
              dan menyetujui ketentuan yang berlaku.
            </p>
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8">
        <div className="flex flex-col gap-4 sm:gap-5">
          {sections.map(({ icon: Icon, title, color, bg, badge, content }, idx) => (
            <section
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-clay-sm transition-shadow hover:shadow-clay"
            >
              {/* Left accent bar */}
              <div
                className="absolute inset-y-0 left-0 w-1 opacity-50"
                style={{ background: "currentColor" }}
                aria-hidden="true"
              />

              <div className="px-5 py-5 sm:px-6 sm:py-6">
                {/* Section header */}
                <div className="mb-3 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} sm:h-10 sm:w-10`}>
                    <Icon className={`h-4 w-4 ${color} sm:h-5 sm:w-5`} aria-hidden="true" />
                  </div>
                  <h2 className="text-[15px] font-semibold leading-snug text-text-primary sm:text-[17px]">
                    {title}
                  </h2>
                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    <span className="hidden rounded-full border border-border-subtle bg-surface-variant px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary sm:inline-flex">
                      {badge}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-variant text-[11px] font-bold text-text-secondary">
                      {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Section body */}
                <div className="pl-12 text-[13px] leading-relaxed text-on-surface-variant sm:text-[14px]">
                  {content}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* ── Acceptance Banner ── */}
        <div className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/8 to-transparent px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary sm:text-[14px]">
                Penerimaan Syarat
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-text-secondary sm:text-[13px]">
                Dengan terus menggunakan etalase ini, kamu dianggap telah membaca,
                memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-10 flex flex-col items-center gap-3 border-t border-border-subtle pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[12px] text-text-secondary">
            © 2026 Etalase Affiliate · Semua hak dilindungi
          </p>
          <div className="flex items-center gap-4 text-[12px] text-text-secondary">
            <Link
              href="/privacy"
              className="underline-offset-2 hover:text-primary hover:underline transition-colors"
            >
              Kebijakan Privasi
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
