import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan Etalase Affiliate.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background-base px-4 py-6">
      <Link
        href="/"
        className="-ml-2 mb-4 flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-variant"
        aria-label="Kembali ke etalase"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>

      <h1 className="text-[24px] font-[700] leading-8 tracking-[-0.02em] text-text-primary">
        Syarat &amp; Ketentuan
      </h1>
      <p className="mt-1 text-[13px] text-text-secondary">Terakhir diperbarui: 2026</p>

      <div className="prose-p:my-3 mt-6 flex flex-col gap-4 text-[14px] leading-6 text-on-surface">
        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Sifat layanan</h2>
          <p>
            Etalase Affiliate adalah halaman <em>link in bio</em> yang menampilkan tautan produk
            affiliate. Web ini <strong>bukan platform transaksi</strong> — pembelian dan pembayaran
            terjadi sepenuhnya di platform resmi tujuan.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Redirect ke platform resmi</h2>
          <p>
            Klik pada produk akan mengarahkanmu ke tautan affiliate resmi. Kami tidak bertanggung
            jawab atas ketersediaan, harga, maupun proses transaksi di platform tersebut.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Pengungkapan afiliasi</h2>
          <p>
            Beberapa tautan bersifat afiliasi — kami dapat memperoleh komisi dari pembelian tanpa
            biaya tambahan bagimu. Dukunganmu membantu kelangsungan etalase ini.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Tanggung jawab pengguna</h2>
          <p>
            Kamu bertanggung jawab untuk memastikan bahwa penggunaan tautan ini sesuai dengan
            kebijakan platform tujuan serta peraturan yang berlaku.
          </p>
        </section>
      </div>

      <footer className="mt-auto pt-8 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
        © 2026 Etalase Affiliate
      </footer>
    </main>
  );
}
