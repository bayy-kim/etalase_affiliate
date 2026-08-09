# OPENCODE PROMPT — Etalase Affiliate (Link-in-Bio Storefront)

## 1. Konteks & Tujuan

Buatkan web "link in bio" ala lynk.id untuk affiliate TikTok Shop & Shopee. Akun TikTok belum bisa nampilin keranjang kuning otomatis di video (syarat 600 followers belum tercapai), jadi web ini jadi jembatan: link ditaruh di bio TikTok → pengunjung klik produk → di-redirect ke link affiliate asli di TikTok Shop/Shopee untuk checkout di sana. **Web ini TIDAK memproses pembayaran sama sekali** — murni etalase + redirect + tracking klik.

Tone visual: dark commerce minimalis, hijau/hitam, terinspirasi TikTok Shop tapi bukan tiruan identitas resminya.

## 2. Tech Stack (WAJIB, konsisten dengan project lain)

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first, `@theme` di `globals.css`, **JANGAN** buat `tailwind.config.ts`)
- shadcn/ui (new-york style) untuk komponen dasar
- Prisma ORM + PostgreSQL (Neon)
- NextAuth v5 — hanya untuk login admin (single-user, tidak ada halaman registrasi publik)
- lucide-react untuk SEMUA icon (jangan pakai emoji di UI produksi)
- Recharts untuk chart di dashboard admin
- Framer Motion untuk micro-interaction ringan (hover, transisi tab)
- Font: Plus Jakarta Sans (Google Fonts)
- Deploy target: Vercel

## 3. Mobile-First (WAJIB, prioritas di atas segalanya)

Bayu kerja & ngecek project ini dari HP, dan mayoritas pengunjung storefront juga datang dari in-app browser TikTok di HP. Jadi bukan cuma storefront publik yang mobile-first — **admin panel juga wajib nyaman dipakai dari HP**, bukan versi desktop yang di-shrink.

- Desain & coding dimulai dari breakpoint mobile (baseline 375px, uji juga di 320px), baru di-scale ke tablet/desktop pakai `min-width` media query (default Tailwind, base style = mobile, `md:`/`lg:` buat override ke atas).
- Admin panel: tabel produk di layar sempit HARUS berubah jadi list/card, bukan tabel horizontal-scroll. Form tambah/edit produk full-screen di mobile, input besar dan mudah di-tap.
- Semua tombol aksi penting (Simpan, Tambah Produk, Beli) minimal 44×44px dan gampang dijangkau ibu jari (idealnya di area bawah layar, bisa pakai sticky bottom bar untuk form panjang).
- Chart di dashboard admin (Recharts) harus tetap kebaca di layar sempit — pakai `ResponsiveContainer`, hindari legend/label yang kepotong.
- Jangan sampai ada horizontal scroll yang tidak disengaja di halaman manapun, termasuk halaman admin.
- Font body minimum 14px, line-height cukup lega biar kebaca di layar kecil tanpa zoom.
- Test akhir wajib di viewport 375×667 (iPhone SE) sebagai baseline minimum — kalau nyaman di situ, otomatis nyaman di layar yang lebih besar.

## 4. Design Tokens (dari mockup terpilih — Style B: Minimalist Dark Commerce)

```css
--color-bg: #111214;
--color-surface: rgba(255,255,255,0.04);
--color-surface-hover: #1a1d1a;
--color-border: rgba(255,255,255,0.06);
--color-accent: #16a34a;      /* tombol utama */
--color-accent-light: #22c55e; /* highlight teks, angka statistik */
--color-text: #ffffff;
--color-text-muted: rgba(255,255,255,0.5);
--radius-card: 1rem;   /* 16px */
--radius-pill: 9999px;
--font-display: "Plus Jakarta Sans", sans-serif;
```

Layout: single column, max-width mobile-first (~420px, di-center di desktop), profile header di atas, stat bar kecil (jumlah produk / total klik), tab filter (Semua / per kategori), lalu list produk berbentuk row (bukan card foto besar — cuma icon bulat + label + chevron).

## 5. Data Model (Prisma)

```prisma
model Product {
  id            String   @id @default(cuid())
  label         String   // label singkat yang tampil publik, kurasi Bayu, BUKAN nama asli marketplace
  internalNote  String?  // catatan internal, boleh nama asli produk buat referensi admin
  category      String   // contoh: "skincare", "gadget", "fashion", "rumah-tangga"
  iconKey       String   // nama icon lucide-react, contoh: "sparkles", "smartphone"
  platform      Platform
  affiliateUrl  String
  priceMin      Int?     // Rupiah, integer, boleh null
  priceMax      Int?
  isActive      Boolean  @default(true)
  sortOrder     Int      @default(0)
  clicks        ClickLog[]
  earnings      EarningEntry[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Platform {
  TIKTOK_SHOP
  SHOPEE
}

model ClickLog {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  // jangan simpan IP mentah — cukup createdAt buat agregasi harian/mingguan
}

model EarningEntry {
  id          String   @id @default(cuid())
  productId   String?
  product     Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  platform    Platform
  amount      Int      // Rupiah, integer, NEVER float
  periodDate  DateTime
  note        String?
  createdAt   DateTime @default(now())
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  totpSecret   String?  // terenkripsi AES-256-GCM sebelum disimpan
  totpEnabled  Boolean  @default(false)
  lastLoginAt  DateTime?
  createdAt    DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  adminId    String
  action     String   // "create_product", "update_earning", dll
  targetType String
  targetId   String?
  metadata   Json?
  createdAt  DateTime @default(now())
}
```

## 6. Routes & Halaman

### Publik
- `GET /` — Storefront: profile header (avatar, @username, bio), stat bar (jumlah produk aktif, total klik), tab kategori, list produk (icon + label + badge platform kecil + chevron). Klik row = navigate ke `/go/[productId]`, bukan langsung affiliateUrl di href (biar klik selalu tercatat).
- `GET /go/[productId]` — Route handler (bukan client-side redirect): catat 1 baris di `ClickLog`, lalu `redirect()` (302) ke `product.affiliateUrl`. Kalau produk `isActive=false` atau tidak ditemukan → redirect ke `/` dengan toast/param error.

### Admin (semua di bawah middleware auth, path `/admin/*`)
- `GET /admin/login` — email + password, lanjut ke step TOTP kalau `totpEnabled=true`.
- `GET /admin/setup-2fa` — hanya bisa diakses sebelum `totpEnabled=true`, generate QR (pakai `otpauth` + `qrcode`), simpan secret terenkripsi setelah verifikasi kode pertama berhasil.
- `GET /admin/dashboard` — ringkasan: total klik 7/30 hari terakhir (chart), total earnings per platform per bulan (chart), top 5 produk by klik, top 5 produk by earnings.
- `GET /admin/products` — tabel/list semua produk, filter by platform/kategori/status, drag-reorder `sortOrder` (opsional kalau waktu cukup, kalau tidak pakai input angka manual).
- `GET /admin/products/new`, `GET /admin/products/[id]/edit` — form dengan Zod validation (label, category, iconKey via icon picker dari lucide-react, platform, affiliateUrl wajib URL valid, priceMin/Max integer).
- `GET /admin/earnings` — list entri earnings + form tambah manual (platform, produk opsional, amount, tanggal, catatan).
- `GET /admin/settings` — edit bio, avatar (upload ke Vercel Blob), social links.

## 7. Keamanan (WAJIB, ini bukan opsional)

- **Tidak ada** halaman/route registrasi admin publik. Admin pertama dibuat lewat seed script sekali jalan, bukan UI.
- Password di-hash pakai bcrypt (cost ≥ 12) atau argon2.
- **2FA TOTP wajib** — setelah setup pertama, login tanpa kode TOTP valid harus ditolak. Secret TOTP dienkripsi AES-256-GCM sebelum masuk DB (pola sama seperti enkripsi API key di project IdeForge).
- Rate limiting di `/admin/login` dan endpoint verifikasi TOTP — lock sementara setelah beberapa kali gagal berturut-turut.
- Proteksi route admin dilakukan di **middleware level** (`middleware.ts` matcher `/admin/:path*`), BUKAN cuma cek session di tiap page component. Ini pelajaran dari bug debug-2FA di project M2A yang sempat expose TOTP secret lewat route publik — jangan sampai kejadian lagi di sini.
- Semua mutation (create/update/delete product, tambah earning) tercatat di `AuditLog` dengan `adminId` yang login.
- Cookie session: `httpOnly`, `secure`, `sameSite: lax`.
- Validasi input pakai Zod di semua server action / route handler admin, jangan percaya input dari client mentah-mentah.
- Tidak boleh ada API route yang expose data `ClickLog`/`EarningEntry`/`AdminUser` tanpa autentikasi — cek eksplisit di setiap handler, jangan andalkan "gak ada yang tau URL-nya" sebagai proteksi.
- Pastikan tidak ada file `.env` yang ke-commit; simpan semua secret (`DATABASE_URL`, `NEXTAUTH_SECRET`, `ENCRYPTION_KEY`, dll) di Vercel Environment Variables.

## 8. Guardrail Teknis (WAJIB dipatuhi, ini bug berulang di project-project sebelumnya)

- Tailwind v4 CSS-first — JANGAN bikin custom `--spacing-*` token yang bentrok sama utility class bawaan (pernah kejadian `--spacing-md` nge-override `max-w-md`).
- Semua pemakaian `useSearchParams()` WAJIB dibungkus `<Suspense>` boundary, kalau tidak build/deploy bakal gagal.
- NextAuth v5 di Vercel WAJIB set `trustHost: true`, kalau tidak akan error PKCE/cookie.
- JANGAN pasang `backdrop-filter` di parent element yang punya child `position: fixed` (mis. drawer/modal) — bikin fixed positioning rusak. Kalau butuh drawer, render lewat React Portal ke `document.body`.
- JANGAN pakai CSS shorthand `inset` — pakai `top/right/bottom/left` eksplisit satu-satu (masalah kompatibilitas di beberapa environment mobile).
- Pakai `100dvh`, JANGAN `100vh`, untuk elemen full-height di mobile.
- Semua target sentuh (tombol, row produk) minimal 44×44px.
- Semua nilai uang (`priceMin`, `priceMax`, `amount`) disimpan sebagai **integer Rupiah**, jangan pernah pakai float/decimal.
- Icon HANYA dari `lucide-react`, jangan emoji di UI produksi (mockup sketsa boleh emoji, tapi kode final tidak).

## 9. Definition of Done

- [ ] `npx prisma migrate dev` jalan tanpa error, seed script bikin 1 admin user awal
- [ ] Halaman `/` menampilkan produk aktif sesuai `sortOrder`, filter kategori berfungsi
- [ ] Klik produk tercatat di `ClickLog` dan redirect ke `affiliateUrl` yang benar
- [ ] Login admin + 2FA TOTP end-to-end berfungsi (setup QR → scan → verifikasi → login berikutnya minta kode)
- [ ] CRUD produk & earnings berfungsi penuh dengan validasi Zod
- [ ] Dashboard admin menampilkan chart klik & earnings yang benar secara matematis
- [ ] Semua route `/admin/*` return 401/redirect kalau diakses tanpa session valid (test manual pakai curl atau incognito)
- [ ] `npm run build` sukses tanpa warning terkait Suspense/useSearchParams
- [ ] Deploy ke Vercel sukses, `trustHost: true` sudah di-set, env vars lengkap
