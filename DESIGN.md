---
version: alpha
name: Etalase Dark Commerce
description: Dark commerce minimalis terinspirasi TikTok Shop — hijau sebagai satu-satunya driver interaksi di atas kanvas hitam pekat, dirancang mobile-first.
colors:
  primary: "#15803D"
  secondary: "#22C55E"
  tertiary: "#1A1D1A"
  neutral: "#111214"
  surface: "#1B1C1E"
  border: "#2A2B2D"
  textPrimary: "#FFFFFF"
  textMuted: "#8A8D91"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: 500
    lineHeight: 1.5
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 12px
    typography: "{typography.body-md}"
  button-primary-hover:
    backgroundColor: "#166534"
  surface-base:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.textPrimary}"
  product-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.lg}"
    padding: 14px
  product-row-hover:
    backgroundColor: "{colors.tertiary}"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: 8px
  chip-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.textMuted}"
    rounded: "{rounded.pill}"
    padding: 8px
  stat-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.md}"
    padding: 12px
  admin-input:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 44px
---

## Overview

Etalase Dark Commerce adalah identitas visual untuk web link-in-bio affiliate TikTok Shop & Shopee. Nuansa yang dikejar: dark commerce minimalis — kanvas hitam pekat memberi kesan premium dan fokus, hijau muncul secara sangat terbatas hanya di titik-titik interaksi (tombol, angka statistik, kategori aktif) supaya mata pengunjung langsung tertarik ke elemen yang bisa diklik. Identitas ini dipakai konsisten di storefront publik maupun admin panel — admin panel tidak boleh terasa seperti "aplikasi lain", harus tetap satu keluarga visual.

## Colors

- **Primary (#15803D):** Satu-satunya warna untuk aksi utama — tombol "Beli", tombol simpan di admin, tab kategori aktif. Dipilih sedikit lebih gelap dari hijau TikTok Shop standar supaya teks putih di atasnya tetap lolos kontras WCAG AA (4.5:1). Dipakai hemat, bukan dekorasi.
- **Secondary (#22C55E):** Hijau lebih terang, khusus untuk angka/statistik (jumlah klik, total earnings) dan ikon aktif — memberi kesan "data hidup" tanpa bersaing dengan tombol utama.
- **Tertiary (#1A1D1A):** Warna hover/pressed state untuk kartu dan row — transisi halus dari surface ke state aktif.
- **Neutral (#111214):** Warna latar utama seluruh aplikasi, hampir hitam tapi tidak solid `#000000` supaya tidak terasa keras di layar OLED.
- **Surface (#1B1C1E):** Latar kartu/row produk, sedikit lebih terang dari neutral supaya ada kedalaman tanpa perlu shadow berat.
- **Border (#2A2B2D):** Garis pemisah tipis antar-row, dipakai sangat halus.
- **Text Primary/Muted:** Putih untuk teks utama, abu-abu redup untuk metadata (harga, timestamp, keterangan sekunder).

## Typography

Plus Jakarta Sans dipakai di seluruh aplikasi — satu keluarga font, dibedakan lewat weight dan size saja, bukan mencampur font lain. `h1` untuk nama profil/judul halaman, `h2` untuk judul section (mis. "Dashboard", "Tambah Produk"), `body-md` untuk label produk dan isi form, `body-sm` untuk metadata, `label` (uppercase, letter-spacing lebar) untuk tag kecil seperti nama platform (TIKTOK SHOP / SHOPEE).

## Layout

Mobile-first, single column, lebar maksimum konten ~420px lalu di-center di layar lebih lebar (tidak melebar penuh di desktop — tetap terasa seperti "kartu HP" bahkan di browser besar). Spacing antar-section pakai `spacing.lg` (24px), spacing internal card pakai `spacing.md` (16px). Admin panel mengikuti pola yang sama: di layar sempit, tabel berubah jadi tumpukan card vertikal, bukan tabel horizontal-scroll.

## Elevation & Depth

Tidak memakai drop shadow berat — kedalaman dibangun lewat kontras warna surface (`#1B1C1E`) terhadap background (`#111214`) dan border tipis 1px (`#2A2B2D`). Ini menjaga performa render tetap ringan di in-app browser TikTok yang sering kurang bertenaga.

## Shapes

Radius besar dan konsisten memberi kesan modern dan ramah disentuh: `rounded.lg` (16px) untuk card/row produk, `rounded.md` (12px) untuk tombol dan input, `rounded.pill` untuk chip kategori dan badge platform. Tidak ada sudut tajam (0px radius) di komponen interaktif manapun.

## Components

- `button-primary`: satu-satunya tombol high-emphasis di tiap layar. Tinggi minimum 44px, full-width di mobile untuk aksi utama (Beli, Simpan).
- `product-row`: unit dasar storefront — icon bulat di kiri, label + platform badge di tengah, chevron di kanan. Tidak ada foto produk.
- `chip-active` / `chip-inactive`: filter kategori, hanya satu chip aktif dalam satu waktu.
- `stat-card`: dipakai di dashboard admin, angka besar warna `secondary` di atas label kecil warna `textMuted`.
- `admin-input`: seragam di semua form admin, tinggi 44px supaya nyaman disentuh di HP.

## Do's and Don'ts

**Do:**
- Pakai hijau hanya untuk elemen yang bisa diinteraksi (tombol, tab aktif, angka penting).
- Jaga kontras teks putih di atas surface gelap tetap AA minimum (target rasio ≥ 4.5:1).
- Konsisten pakai radius besar di semua komponen — ini identitas utama, bukan detail kosmetik.

**Don't:**
- Jangan pakai hijau sebagai warna dekoratif/background besar — itu bikin hierarki visual hilang.
- Jangan tambah font kedua "biar variatif" — satu keluarga font, dibedakan lewat weight/size saja.
- Jangan pakai foto produk asli atau logo resmi platform (TikTok/Shopee) — badge platform cukup teks/label, bukan logo, untuk menghindari isu merek dagang.
