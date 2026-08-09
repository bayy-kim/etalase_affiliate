# Etalase Affiliate

Web **link-in-bio** untuk affiliate marketplace (TikTok Shop & Shopee) — dark commerce minimalis, mobile-first. Web ini murni **etalase + redirect + pencatatan performa**, tidak memproses pembayaran apa pun. Transaksi selalu terjadi di platform resmi.

## Fitur

- **Storefront publik** (`/`) — profil, statistik ringkas, filter kategori, daftar produk (icon + label + badge platform + chevron); layout desktop terpisah dengan grid produk pilihan
- **Redirect + click tracking** (`/go/[id]`) — klik tercatat 100% server-side, lalu redirect ke link affiliate
- **Login admin + 2FA TOTP wajib** — dua langkah (password → kode authenticator), secret terenkripsi AES-256-GCM
- **CRUD produk** — label, kategori, icon picker, platform toggle, link affiliate, rentang harga, toggle tampil
- **Catat earnings manual** — form mobile (bottom sheet) + form desktop inline, nominal integer Rupiah
- **Dashboard admin** — stat card dengan tren, chart klik 7 hari, chart earnings per platform, top produk (list mobile / tabel desktop)
- **Panel admin responsif** — bottom nav di mobile, sidebar di desktop

## Tech Stack

- Next.js 15 (App Router) + TypeScript + Server Actions
- Tailwind CSS v4 (CSS-first `@theme`, tanpa `tailwind.config.ts`)
- lucide-react (semua icon) · Motion (Framer Motion) · Recharts
- Prisma ORM + PostgreSQL (Neon) — **fallback mock store** otomatis saat `DATABASE_URL` belum di-set
- JWT session (jose) httpOnly cookie · bcryptjs · OTPAuth TOTP · rate limiting login

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Tanpa database, app memakai **mock store** (produk & data contoh) supaya langsung bisa dicoba. Konfigurasi admin awal (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) dibaca dari `.env` — lihat `.env.example`.

### Aktifkan PostgreSQL (Neon)

```bash
cp .env.example .env   # isi DATABASE_URL, SESSION_SECRET, ENCRYPTION_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma migrate dev --name init
npm run prisma:seed    # admin user + produk awal
npm run dev
```

> Semua mutasi admin tercatat di tabel `AuditLog`. Proteksi `/admin/*` dilakukan di **middleware level**, bukan cuma per-halaman.

## Struktur

```
prisma/                 # schema + seed
src/app/                # halaman & route handler
src/app/page.tsx        # storefront (mobile + desktop)
src/app/go/[productId]  # redirect + click tracking
src/app/admin/*         # login, verify-2fa, setup-2fa, dashboard, products, earnings, settings
src/components/         # ui primitives + storefront + admin (AdminShell sidebar desktop)
src/lib/                # data, session, encryption, rate-limit, validations
src/server/actions/     # server actions (auth, product, earning)
src/middleware.ts       # auth guard level middleware
```

## Deploy (Vercel)

Env vars wajib: `DATABASE_URL`, `SESSION_SECRET`, `ENCRYPTION_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
`SESSION_SECRET` dan `ENCRYPTION_KEY` wajib di-set di production.
