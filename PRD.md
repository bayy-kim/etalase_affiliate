# PRD — Etalase Affiliate (Link-in-Bio Storefront)

**Pemilik produk:** Bayu Muhamad Arib Irfani
**Status:** Draft v1
**Terakhir diperbarui:** Agustus 2026

---

## 1. Ringkasan

Website "link in bio" mobile-first untuk affiliate TikTok Shop & Shopee. Berfungsi sebagai etalase produk yang link-nya ditaruh di bio TikTok, sebagai pengganti sementara fitur keranjang kuning otomatis yang baru aktif setelah followers ≥ 600. Web ini murni etalase + redirect + pencatatan performa — tidak memproses transaksi/pembayaran apa pun.

## 2. Latar Belakang & Masalah

TikTok mensyaratkan minimal 600 followers untuk mengaktifkan Etalase (Showcase) dan keranjang kuning otomatis di video. Akun Bayu belum memenuhi syarat ini, sehingga produk affiliate tidak bisa ditampilkan langsung di video/profil TikTok. Tanpa jalan keluar, potensi komisi affiliate hilang selama masa menunggu followers bertambah.

**Solusi:** halaman "link in bio" independen (di luar TikTok) yang menampung semua link produk affiliate, ditaruh sebagai satu-satunya link di bio TikTok. Pola ini umum dipakai kreator affiliate kecil dan tetap sah karena affiliate link tetap mengarah ke platform resmi (TikTok Shop/Shopee) untuk transaksi.

## 3. Tujuan Produk

1. Menyediakan titik akses produk affiliate yang bisa langsung dipakai walau syarat followers belum terpenuhi.
2. Mencatat performa tiap produk (klik) supaya Bayu tahu produk mana yang layak terus dipromosikan di konten.
3. Mencatat komisi/penghasilan secara manual per produk/platform supaya ada gambaran ROI dari waktu yang dihabiskan bikin konten untuk produk tertentu.
4. Semua ini bisa dikelola penuh dari HP, tanpa perlu buka laptop.

## 4. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| **Pengunjung TikTok** (follower/penonton yang klik link di bio) | Cepat nemu produk yang dibahas di video, klik, langsung diarahkan checkout di app TikTok Shop/Shopee. Mayoritas akses dari in-app browser TikTok di HP. |
| **Bayu (admin, satu-satunya pengelola)** | Nambah/edit produk dengan cepat dari HP di sela waktu luang, lihat produk mana yang paling banyak diklik, catat komisi masuk biar ada rekap penghasilan. |

## 5. Ruang Lingkup

### In-scope (MVP)
- Halaman storefront publik (list produk, filter kategori, redirect + click tracking)
- Login admin dengan 2FA wajib
- CRUD produk (label, kategori, icon, platform, link affiliate, rentang harga)
- Pencatatan penghasilan manual + dashboard ringkasan
- Pengaturan profil (bio, avatar, social link)
- Mobile-first di seluruh halaman termasuk admin

### Out-of-scope (untuk sekarang)
- Payment gateway / checkout di web ini — transaksi selalu terjadi di app TikTok Shop/Shopee
- Integrasi API otomatis ke TikTok Shop/Shopee affiliate dashboard (belum tersedia untuk individual creator)
- Multi-admin / role-based access — cukup satu akun admin
- Sistem review/rating dari pengunjung
- Foto produk asli dan nama produk verbatim dari marketplace (lihat catatan di bawah)

### Catatan desain produk
Storefront sengaja **tidak menampilkan foto asli, nama produk verbatim, atau nomor SKU** dari marketplace. Yang tampil ke publik hanya label kurasi singkat (mis. "Skincare Wajah", "Aksesoris Gadget") + icon kategori + tombol Beli. Ini pilihan sadar untuk menjaga tampilan tetap bersih dan konsisten secara visual, bukan keterbatasan teknis. Nama/detail asli produk tetap tersimpan di `internalNote` untuk referensi admin.

## 6. User Flow

**Pengunjung:**
1. Buka bio TikTok → klik link storefront
2. Landing di halaman utama, lihat profil singkat + daftar produk
3. (Opsional) filter berdasarkan kategori
4. Klik salah satu produk → sistem catat klik → redirect otomatis ke link affiliate asli
5. Checkout terjadi di app TikTok Shop/Shopee, di luar web ini

**Admin (Bayu):**
1. Buka `/admin/login` dari HP → masukkan email + password → masukkan kode TOTP
2. Dashboard: lihat ringkasan klik & earnings terbaru
3. Tambah produk baru: pilih icon, isi label, kategori, platform, link affiliate, rentang harga → simpan
4. Setelah dapat notifikasi komisi dari TikTok Shop/Shopee, buka `/admin/earnings` → catat manual (produk, platform, nominal, tanggal)
5. Cek dashboard berkala untuk lihat produk mana yang paling worth dilanjutkan kontennya

## 7. Fitur Utama & Prioritas

| Fitur | Prioritas | Catatan |
|---|---|---|
| Storefront publik + filter kategori | P0 | Halaman utama, harus sempurna dari hari pertama |
| Redirect + click tracking (`/go/[id]`) | P0 | Inti dari value proposition produk ini |
| Login admin + 2FA TOTP | P0 | Tidak bisa ditawar, ini satu-satunya pintu masuk data |
| CRUD produk | P0 | Tanpa ini admin panel tidak berguna |
| Pencatatan earnings manual | P1 | Bisa menyusul minggu kedua kalau perlu ship storefront duluan |
| Dashboard chart (klik & earnings) | P1 | Nilai tambah, bukan blocker untuk go-live |
| Pengaturan profil (bio/avatar) | P1 | Bisa hardcode dulu di MVP, jadi form belakangan |
| Reorder drag-and-drop produk | P2 | Input angka manual untuk `sortOrder` cukup untuk MVP |
| Audit log | P1 | Ringan untuk diimplementasi, penting untuk keamanan |

## 8. Non-Functional Requirements

- **Mobile-first**: seluruh UI (publik & admin) didesain dan diuji dari breakpoint 375px terlebih dahulu. Tidak ada halaman yang hanya nyaman di desktop.
- **Performa**: storefront harus terasa instan dibuka dari in-app browser TikTok yang sering lebih lambat dari browser biasa — hindari asset berat, gunakan Next.js static/ISR di halaman publik kalau memungkinkan.
- **Keamanan**: lihat detail lengkap di prompt OpenCode (2FA wajib, middleware-level auth guard, audit log, rate limiting login).
- **Reliabilitas redirect**: jika `affiliateUrl` produk berubah atau produk dinonaktifkan, pengunjung tidak boleh mendarat di halaman error kosong — arahkan balik ke storefront dengan pesan yang jelas.
- **Data uang**: semua nominal (harga, komisi) disimpan sebagai integer Rupiah, tidak pernah float.

## 9. Metrik Keberhasilan

- Storefront live dan link aktif di bio TikTok dalam 1–2 minggu
- Setidaknya bisa lihat 1 siklus penuh: produk ditambah → dapat klik → dapat komisi → tercatat di earnings
- Tidak ada insiden keamanan (kebocoran data admin/produk) dalam 3 bulan pertama
- Admin panel bisa dipakai sepenuhnya dari HP tanpa keluhan UX dari Bayu sendiri

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| TikTok/Shopee mengubah format link affiliate sewaktu-waktu | Field `affiliateUrl` bebas teks, gampang diedit lewat admin panel tanpa perlu deploy ulang |
| Data earnings manual rawan salah ketik/lupa dicatat | Form input sesederhana mungkin, taruh reminder di deskripsi produk saat cek dashboard |
| Followers tembus 600 dan fitur showcase asli TikTok aktif | Web ini tetap berguna sebagai backup/redundant channel, tidak perlu dibongkar |
| Kebocoran akses admin (satu-satunya titik kegagalan) | 2FA wajib + rate limiting + audit log, lihat bagian Keamanan di prompt OpenCode |

## 11. Roadmap / Fase

- **Fase 1 (MVP):** Storefront publik + redirect/click tracking + login admin & 2FA + CRUD produk dasar → go-live secepatnya biar link bisa langsung dipasang di bio
- **Fase 2:** Earnings manual + dashboard chart + audit log
- **Fase 3:** Pengaturan profil dari UI (bio/avatar/social link), reorder drag-and-drop
- **Fase 4 (opsional, kalau followers sudah tembus 600):** Evaluasi apakah web ini tetap dipertahankan sebagai channel tambahan atau di-pause
