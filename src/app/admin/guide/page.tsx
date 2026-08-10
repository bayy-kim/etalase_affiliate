import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  MousePointerClick,
  Package,
  Wallet,
  Gauge,
  Settings,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
  Share2,
  Sparkles,
  Video,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panduan Penggunaan Admin",
};

export default function AdminGuidePage() {
  return (
    <AdminShell
      title="Panduan Admin"
      subtitle="Petunjuk lengkap penggunaan & keamanan sistem etalase affiliate"
    >
      <div className="flex flex-col gap-8 pb-10">
        {/* Banner Keamanan Komisi */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-teal-50/30 p-6 shadow-clay-card lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b border-emerald-300 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-md">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Keamanan Komisi 100% Guaranteed
                </span>
                <h2 className="mt-1 text-[22px] font-extrabold tracking-tight text-slate-900">
                  Apakah Komisi Pasti Masuk Saat Pengunjung Tekan Link?
                </h2>
                <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-slate-600">
                  <strong>YA, PASTI MASUK 100%!</strong> Sistem web ini menggunakan mekanisme{" "}
                  <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[12px] text-emerald-900">
                    HTTP 302 Direct Server Redirect
                  </code>
                  . Saat pengunjung menekan produk di Bio TikTok Anda, web langsung mengarahkan pengguna secara instan ke aplikasi resmi (Shopee / TikTok Shop) tanpa merusak atau memotong kode unik affiliate Anda.
                </p>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-98"
            >
              <span>Uji Coba Etalase</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Grid Modul Panduan */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Modul 1: Alur Kerja & Komisi */}
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white shadow-sm">
                <MousePointerClick className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Modul 1
                </span>
                <h3 className="text-[18px] font-extrabold text-slate-900">
                  Alur Kerja & Pelacakan Klik
                </h3>
              </div>
            </div>
            <ul className="space-y-3 text-[14px] text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Server-Side Tracking:</strong> Setiap klik dari Bio TikTok Anda dicatat secara akurat di server tanpa terhalang ad-blocker HP pengunjung.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Anti-Prefetch Protection:</strong> Fitur pre-load Next.js tidak dicatat sebagai klik palsu, sehingga angka klik di dashboard murni dari manusia.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Deep Linking Otomatis:</strong> HP pembeli akan otomatis membuka aplikasi Shopee / TikTok Shop resmi yang memasang cookie komisi Anda.
                </span>
              </li>
            </ul>
          </section>

          {/* Modul 2: Manajemen Produk */}
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white shadow-sm">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Modul 2
                </span>
                <h3 className="text-[18px] font-extrabold text-slate-900">
                  Manajemen & Nomor Urut Produk
                </h3>
              </div>
            </div>
            <ul className="space-y-3 text-[14px] text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Form Tambah/Edit Produk:</strong> Isi Label Produk, Kategori, Icon 3D, Platform (TikTok Shop/Shopee), dan Link Affiliate resmi Anda.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Pencarian Angka Urutan (Nomor Urut):</strong> Setiap produk otomatis memiliki nomor urut (`01`, `02`, dst). Pengunjung bisa langsung ketik angka urutan di kolom pencarian.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Toggle Aktif/Nonaktif:</strong> Sembunyikan produk yang sedang *out of stock* tanpa menghapus statistik kliknya.
                </span>
              </li>
            </ul>
          </section>

          {/* Modul 3: Catatan Earnings */}
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-t border-white border-b border-amber-200 bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-sm">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  Modul 3
                </span>
                <h3 className="text-[18px] font-extrabold text-slate-900">
                  Pencatatan Komisi (Earnings)
                </h3>
              </div>
            </div>
            <ul className="space-y-3 text-[14px] text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Pencatatan Ledger:</strong> Masukkan laporan pendapatan dari dashboard TikTok / Shopee Affiliate Anda di menu <code>/admin/earnings</code>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Sinkronisasi Otomatis:</strong> Saat mencatat komisi untuk produk tertentu, akumulasi pendapatan pada produk tersebut otomatis bertambah.
                </span>
              </li>
            </ul>
          </section>

          {/* Modul 4: Analytics Dashboard */}
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white shadow-sm">
                <Gauge className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Modul 4
                </span>
                <h3 className="text-[18px] font-extrabold text-slate-900">
                  Membaca Grafik Analytics
                </h3>
              </div>
            </div>
            <ul className="space-y-3 text-[14px] text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Stat Cards:</strong> Memantau total Produk Aktif, Jumlah Klik 7 Hari (dengan indikator tren vs 7 hari lalu), dan Rata-rata Klik.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Grafik Tren Klik:</strong> Beralih antara tampilan 7 Hari atau 30 Hari untuk melihat performa lalu lintas pengunjung.
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Modul AI Studio & Google Flow */}
        <section className="flex flex-col gap-6 rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/50 p-6 shadow-clay-card lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Fitur Unggulan Pro
              </span>
              <h3 className="text-[20px] font-extrabold text-slate-900">
                Panduan AI Content Studio & Setting Google Flow (Veo / VideoFX)
              </h3>
            </div>
          </div>

          <p className="text-[14px] leading-relaxed text-slate-600">
            Anda dapat menggunakan menu <code>/admin/aichat-gemini</code> untuk menganalisis foto produk Anda. AI akan secara otomatis merancang prompt video sinematik yang siap ditempelkan di <strong>Google Flow Pro</strong> tanpa menghabiskan kuota secara sia-sia.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Video className="h-5 w-5 text-indigo-600" />
                <span>Pengaturan Optimal di Google Flow</span>
              </div>
              <ul className="space-y-2 text-[13px] text-slate-600">
                <li>• <strong>Aspect Ratio:</strong> Pilih <code className="font-bold text-indigo-600">9:16</code> (Format Vertikal TikTok / Shorts / Reels).</li>
                <li>• <strong>Motion Speed:</strong> Atur ke nilai <code className="font-bold text-indigo-600">3 atau 4</code> (Gerakan sedang agar bentuk produk tetap stabil & tidak terdistorsi).</li>
                <li>• <strong>Camera Control:</strong> Pilih <code className="font-bold text-indigo-600">Slow Pan / Macro Close-up</code> untuk memperlihatkan tekstur produk secara jelas.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Aturan Khusus Kategori AI</span>
              </div>
              <ul className="space-y-2 text-[13px] text-slate-600">
                <li>• <strong>Skincare:</strong> AI otomatis mengunci prompt ke demonstrasi <code className="font-bold text-emerald-600">TANGAN SAJA</code> (tanpa wajah) dengan pencahayaan alami.</li>
                <li>• <strong>Fashion:</strong> AI otomatis menggunakan model <code className="font-bold text-emerald-600">Wanita Lokal Natural</code> (Strictly NO Celebrities/Famous Artists).</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tutorial Menyalin Link Affiliate (TikTok & Shopee) */}
        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-md">
              <Share2 className="h-6 w-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Tutorial Penting
              </span>
              <h3 className="text-[20px] font-extrabold text-slate-900">
                Cara Menyalin Link Affiliate dari Aplikasi
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* TikTok Shop */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                <span>1. TikTok Shop Affiliate</span>
              </div>
              <ol className="list-decimal space-y-2 pl-5 text-[14px] text-slate-600">
                <li>Buka aplikasi <strong>TikTok</strong> ➔ Masuk ke tab <strong>Profile</strong>.</li>
                <li>Pilih menu <strong>TikTok Shop / Pusat Kreator Affiliate</strong>.</li>
                <li>Cari produk yang ingin Anda tampilkan ➔ Tekan tombol <strong>Bagikan / Tautan</strong>.</li>
                <li>Pilih <strong>Salin Tautan</strong> (Link akan berbentuk <code className="text-indigo-600 font-mono">https://vt.tokopedia.com/...</code>).</li>
                <li>Tempelkan di kolom <strong>Link Affiliate</strong> pada Form Tambah Produk.</li>
              </ol>
            </div>

            {/* Shopee Affiliate */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <span>2. Shopee Affiliate Program</span>
              </div>
              <ol className="list-decimal space-y-2 pl-5 text-[14px] text-slate-600">
                <li>Buka aplikasi <strong>Shopee</strong> ➔ Cari produk favorit Anda.</li>
                <li>Tekan tombol **Bagikan (Share)** di pojok kanan atas halaman produk.</li>
                <li>Pilih **Salin Link / Shopee Affiliate** (Link akan berbentuk <code className="text-emerald-600 font-mono">https://s.shopee.co.id/...</code>).</li>
                <li>Tempelkan di kolom **Link Affiliate** pada Form Tambah Produk.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Pengaturan & Keamanan */}
        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-md">
              <Settings className="h-6 w-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Keamanan & Profil
              </span>
              <h3 className="text-[20px] font-extrabold text-slate-900">
                Pengaturan Profil & Keamanan 2FA
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <h4 className="font-bold text-slate-900 text-[15px]">Informasi Profil Etalase</h4>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Di menu <code>/admin/settings</code>, Anda bisa memperbarui Handle TikTok, Display Name, Bio, Foto Profil, serta Link Etalase Utama Anda yang akan tampil di halaman publik.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <h4 className="font-bold text-slate-900 text-[15px]">Autentikasi Dua Langkah (2FA)</h4>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Aktifkan TOTP (Google Authenticator / Authenticator App) di menu <code>/admin/setup-2fa</code> untuk memastikan akun admin Anda aman dari akses yang tidak sah.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Support */}
        <section className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-50/60 to-slate-50 p-8 text-center shadow-clay-card">
          <HelpCircle className="h-10 w-10 text-indigo-600" />
          <h3 className="text-[20px] font-extrabold text-slate-900">
            Butuh Bantuan Lainnya?
          </h3>
          <p className="max-w-xl text-[14px] text-slate-600 leading-relaxed">
            Jika ada pertanyaan seputar pelacakan klik, perubahan domain, atau integrasi database Neon/PostgreSQL, pastikan environment <code>DATABASE_URL</code> dan <code>SESSION_SECRET</code> terisi dengan benar di Vercel Dashboard.
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
