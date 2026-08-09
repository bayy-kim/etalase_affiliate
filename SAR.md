# SAR — System Architecture Report
## Etalase Affiliate (Link-in-Bio Storefront)

**Terakhir diperbarui:** Agustus 2026

---

## 1. Ringkasan Arsitektur

Aplikasi web monolitik berbasis Next.js 15 App Router, di-deploy di Vercel, dengan satu database PostgreSQL (Neon). Tidak ada layanan pembayaran/checkout — sistem hanya mencatat klik dan data komisi manual, lalu me-redirect pengunjung ke platform pihak ketiga (TikTok Shop/Shopee) untuk transaksi sesungguhnya. Ada dua zona akses yang tegas dipisah lewat middleware: **publik** (storefront, tanpa autentikasi) dan **admin** (butuh login + 2FA, satu user saja).

## 2. Diagram Arsitektur (High-Level)

```
┌─────────────┐      ┌──────────────────────────────┐      ┌──────────────┐
│  Pengunjung  │─────▶│  Next.js App (Vercel)         │─────▶│  TikTok Shop  │
│  (in-app     │      │  ┌────────────┐ ┌───────────┐ │      │  / Shopee     │
│  browser     │      │  │ Storefront │ │  /go/[id]  │ │      │  (checkout    │
│  TikTok)     │      │  │  (publik)  │ │  redirect  │ │      │  terjadi di   │
└─────────────┘      │  └────────────┘ │  + logging │ │      │  sana)        │
                       │                 └─────┬──────┘ │      └──────────────┘
┌─────────────┐        │                       │        │
│    Bayu      │───────▶│  ┌────────────────────▼──────┐ │
│  (admin, HP) │  auth  │  │  /admin/*  (proteksi        │ │
└─────────────┘        │  │  middleware + NextAuth v5    │ │
                        │  │  + TOTP 2FA)                 │ │
                        │  └───────────────┬──────────────┘ │
                        └──────────────────┼────────────────┘
                                            │ Prisma ORM
                                            ▼
                                  ┌───────────────────┐
                                  │  PostgreSQL (Neon)  │
                                  │  Product/ClickLog/  │
                                  │  EarningEntry/      │
                                  │  AdminUser/AuditLog  │
                                  └───────────────────┘
```

## 3. Struktur Folder

```
etalase-affiliate/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                          # bikin 1 admin user awal, TIDAK lewat UI
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx               # shell publik, font, meta tags
│   │   │   └── page.tsx                 # storefront home
│   │   ├── go/
│   │   │   └── [productId]/
│   │   │       └── route.ts             # log klik lalu redirect() ke affiliateUrl
│   │   ├── admin/
│   │   │   ├── layout.tsx               # admin shell + guard sisi UI (redundan dgn middleware)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── setup-2fa/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx             # list (card di mobile, table di desktop)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/edit/
│   │   │   │       └── page.tsx
│   │   │   ├── earnings/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/
│   │   │       └── route.ts
│   │   ├── layout.tsx                   # root layout
│   │   └── globals.css                  # @theme Tailwind v4 tokens (dari DESIGN.md)
│   ├── components/
│   │   ├── ui/                          # shadcn/ui primitives (button, input, dialog, dst)
│   │   ├── storefront/
│   │   │   ├── profile-header.tsx
│   │   │   ├── category-tabs.tsx
│   │   │   └── product-row.tsx
│   │   └── admin/
│   │       ├── product-form.tsx
│   │       ├── product-list.tsx         # responsif: card mobile / table desktop
│   │       ├── earnings-form.tsx
│   │       ├── stat-card.tsx
│   │       └── dashboard-chart.tsx      # Recharts, ResponsiveContainer
│   ├── lib/
│   │   ├── auth.ts                      # konfigurasi NextAuth v5, trustHost: true
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   ├── encryption.ts                # AES-256-GCM untuk TOTP secret
│   │   ├── rate-limit.ts                # limiter percobaan login
│   │   ├── audit-log.ts                 # helper tulis ke tabel AuditLog
│   │   └── validations/
│   │       ├── product.schema.ts        # Zod
│   │       └── earning.schema.ts        # Zod
│   ├── server/
│   │   └── actions/
│   │       ├── product.actions.ts       # server actions CRUD produk
│   │       └── earning.actions.ts       # server actions earnings
│   └── middleware.ts                    # matcher: /admin/:path* — auth guard di sini
├── public/
├── .env.example
├── DESIGN.md
├── PRD.md
├── SAR.md
├── AGENTS.md
├── README.md
├── opencode.json
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 4. Alur Data

**Alur klik publik:**
`Pengunjung buka /` → server component fetch daftar `Product` (where `isActive: true`, order by `sortOrder`) → render list → klik row → navigate ke `/go/[productId]` (route handler, server-side) → tulis satu baris `ClickLog` → `redirect()` HTTP 302 ke `product.affiliateUrl`. Tidak ada client-side JS yang wajib jalan supaya tracking tetap akurat walau in-app browser TikTok membatasi script.

**Alur autentikasi admin:**
`/admin/login` (credentials: email+password via NextAuth) → jika `totpEnabled=false`, redirect wajib ke `/setup-2fa` sebelum bisa akses halaman lain → setelah 2FA aktif, tiap login berikutnya wajib input kode TOTP → session dibuat → `middleware.ts` cek session di setiap request ke `/admin/*`, bukan hanya di level halaman.

**Alur pencatatan earnings:**
Bayu cek notifikasi komisi di app TikTok Shop/Shopee (di luar sistem ini) → buka `/admin/earnings` → isi form (produk opsional, platform, nominal integer, tanggal, catatan) → server action validasi Zod → simpan `EarningEntry` → tulis `AuditLog` → dashboard otomatis re-agregasi total per platform/bulan.

## 5. Keputusan Teknis & Rationale

| Keputusan | Alasan |
|---|---|
| Redirect lewat route handler server (`/go/[id]`), bukan `<a href>` langsung | Klik harus tercatat 100% termasuk dari in-app browser yang sering strip JavaScript pihak ketiga |
| Earnings manual, bukan integrasi API | TikTok Shop & Shopee belum punya API affiliate publik untuk individual creator — dipaksakan integrasi hanya menambah kerapuhan sistem |
| Satu admin user, tanpa role-based access | Skala pemakaian saat ini hanya Bayu sendiri; multi-role akan jadi over-engineering untuk MVP |
| Middleware-level auth guard, bukan cuma page-level | Insiden route debug-2FA publik di project M2A jadi pelajaran — jangan andalkan cek di komponen React saja |
| Tidak simpan foto/nama produk asli di UI publik | Keputusan desain (lihat PRD & DESIGN.md), bukan keterbatasan teknis — mengurangi kompleksitas storage aset juga |
| Neon Postgres + Prisma | Konsisten dengan seluruh project Bayu lainnya (M2A, Shopby, dst), memudahkan reuse pola kode |

## 6. Environment & Deployment

- **Hosting:** Vercel, target awal subdomain `*.vercel.app` sebelum custom domain diputuskan
- **Database:** Neon Postgres, connection string di `DATABASE_URL`
- **Secrets wajib di Vercel Environment Variables** (jangan pernah commit `.env`):
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (atau andalkan `trustHost: true`)
  - `ENCRYPTION_KEY` (AES-256-GCM untuk TOTP secret)
  - `BLOB_READ_WRITE_TOKEN` (kalau avatar/upload dipakai di fase Pengaturan Profil)
- **Build check wajib sebelum deploy:** `npm run build` bersih tanpa warning Suspense/useSearchParams (lihat AGENTS.md/prompt OpenCode untuk daftar guardrail lengkap)

## 7. Skalabilitas & Batasan Teknis

- Desain single-admin ini bukan batasan sementara — sengaja disederhanakan. Kalau nanti ada kebutuhan multi-admin (misal untuk Muda Mudi Al-Mubarok II ikut kelola), perlu migrasi skema `AdminUser` ke role-based, di luar scope MVP ini.
- `ClickLog` tanpa IP mentah demi privasi — konsekuensinya analitik terbatas ke agregasi waktu (harian/mingguan) dan per-produk, tidak granular sampai per-pengunjung. Cukup untuk kebutuhan "produk mana yang worth dilanjutkan kontennya".
- Kalau volume klik jadi sangat tinggi (viral), `ClickLog` bisa berkembang cepat — pertimbangkan job pembersihan/agregasi berkala di fase selanjutnya (di luar MVP).

## 8. Observability

- `AuditLog` mencatat semua mutasi admin (create/update/delete produk, tambah earnings) — cukup untuk investigasi kalau ada perubahan tak terduga.
- `ClickLog` berfungsi ganda sebagai analitik ringan dan bukti performa produk.
- Belum ada integrasi monitoring eksternal (Sentry, dll) di MVP — bisa jadi item Fase 2/3 kalau traffic sudah signifikan.
