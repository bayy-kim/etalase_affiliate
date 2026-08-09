import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Etalase Affiliate.",
};

export default function PrivacyPage() {
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
        Kebijakan Privasi
      </h1>
      <p className="mt-1 text-[13px] text-text-secondary">Terakhir diperbarui: 2026</p>

      <div className="prose-p:my-3 mt-6 flex flex-col gap-4 text-[14px] leading-6 text-on-surface">
        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Data yang kami kumpulkan</h2>
          <p>
            Etalase Affiliate tidak mengumpulkan data pribadi pengunjung. Kami hanya mencatat
            <strong> agregat klik</strong> (waktu klik dan produk mana yang diklik) untuk mengukur
            performa etalase. Alamat IP tidak disimpan.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Cookie</h2>
          <p>
            Cookie sesi <em>httpOnly</em> hanya digunakan untuk area admin yang dilindungi login.
            Storefront publik tidak memasang cookie.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Tautan ke platform lain</h2>
          <p>
            Klik pada produk akan mengarahkanmu ke platform resmi (TikTok Shop / Shopee) untuk
            transaksi. Kebijakan privasi platform tersebut yang berlaku setelah kamu meninggalkan
            etalase ini.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-[600] text-text-primary">Kontak</h2>
          <p>
            Untuk pertanyaan terkait privasi, silakan hubungi melalui kanal yang tersedia di profil
            etalase.
          </p>
        </section>
      </div>

      <footer className="mt-auto pt-8 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">
        © 2026 Etalase Affiliate
      </footer>
    </main>
  );
}
