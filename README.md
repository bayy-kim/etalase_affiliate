# Etalase Affiliate

Link-in-bio storefront untuk affiliate **TikTok Shop & Shopee** — dark commerce minimalis, mobile-first. Web ini murni **etalase + redirect + pencatatan performa**, tidak memproses pembayaran apa pun. Transaksi selalu terjadi di platform resmi.

## Fitur

- **Storefront publik** (`/`) — profil, stat mini, filter kategori, daftar produk (icon + label + badge platform + chevron)
- **Redirect + click tracking** (`/go/[id]`) — klik tercatat 100% server-side, lalu 302 ke link affiliate
- **Login admin + 2FA TOTP wajib** — dua langkah (password → kode authenticator), secret terenkripsi AES-256-GCM
- **CRUD produk** — label, kategori, icon picker, platform toggle, link affiliate, rentang harga, toggle tampil
- **Catat earnings manual** — bottom sheet, produk opsional, nominal integer Rupiah, tanggal, catatan
- **Dashboard admin** — stat card, chart klik 7 hari, chart earnings per platform, top 5 produk
- **Settings** — profil, status 2FA, logout

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

Tanpa database, app memakai **mock store** (produk & data contoh) supaya langsung bisa dibuka. Login demo:
email `admin@etalase.com` · password `changeme` (lihat `.env.example`).

### Aktifkan PostgreSQL (Neon)

```bash
cp .env.example .env   # isi DATABASE_URL, SESSION_SECRET, ENCRYPTION_KEY, ADMIN_PASSWORD
npx prisma migrate dev --name init
npm run prisma:seed    # 1 admin user + produk awal
npm run dev
```

> Semua mutasi admin tercatat di tabel `AuditLog`. Proteksi `/admin/*` dilakukan di **middleware level**, bukan cuma per-halaman.

## Struktur

```
prisma/                 # schema + seed
src/app/                # halaman & route handler
src/app/(public) → page # storefront
src/app/go/[productId]  # redirect + click tracking
src/app/admin/*         # login, verify-2fa, setup-2fa, dashboard, products, earnings, settings
src/components/         # ui primitives + storefront + admin
src/lib/                # data, session, encryption, rate-limit, validations
src/server/actions/     # server actions (auth, product, earning)
src/middleware.ts       # auth guard level middleware
```

## Deploy (Vercel)

Env vars wajib: `DATABASE_URL`, `SESSION_SECRET`, `ENCRYPTION_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
`SESSION_SECRET` wajib di-set di production (session memakai jose HMAC).
