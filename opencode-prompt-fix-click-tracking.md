# OPENCODE PROMPT — Perbaikan Click Tracking + Searchbar Pintar + Minor Cleanup

## Fix 1 (prioritas utama) — Pastikan recordClick selalu selesai walau response udah dikirim

File: `src/app/go/[productId]/route.ts`

Ganti baris ini:
```ts
recordClick(productId).catch(() => {});
```

Menjadi pakai `after()` dari `next/server` (API resmi Next.js 15 buat kerjaan yang harus tetap jalan setelah response dikirim ke pengunjung):

```ts
import { NextResponse, after } from "next/server";
```

lalu:
```ts
if (!isPrefetch) {
  after(() => recordClick(productId).catch(() => {}));
}
```

`after()` menjamin runtime Vercel gak membekukan function sebelum `recordClick` selesai, walau `NextResponse.redirect` udah dikirim lebih dulu ke browser pengunjung. Redirect tetap terasa instan (pengunjung gak nunggu apa-apa), tapi sekarang klik dijamin tercatat.

## Fix 2 (kecil) — Tambahkan GEMINI_API_KEY ke .env.example

File: `.env.example`, tambahkan section baru:
```
# Gemini Vision AI (fitur AI Content Studio di /admin/aichat-gemini)
GEMINI_API_KEY=""
```

## Fix 3 (kecil) — Batas panjang query pencarian

File: `src/lib/data.ts`, fungsi `recordSearch`. Tambahkan batas atas panjang string supaya gak ada yang bisa nge-spam entry raksasa:

```ts
export async function recordSearch(query: string): Promise<boolean> {
  const clean = query.trim().toLowerCase().slice(0, 80); // batasi 80 karakter
  if (!clean || clean.length < 2 || /^\d{1,3}$/.test(clean)) return false;
  // ...lanjut kode yang sudah ada
}
```

## Fix 4 — Searchbar lebih pintar: toleransi typo + expansion kategori

### 4a. Aktifkan fuzzy search (toleransi typo) pakai pg_trgm

Buat migration Prisma baru (`npx prisma migrate dev --name add_trgm_search --create-only`), isi SQL-nya manual:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS product_label_trgm_idx ON "Product" USING GIN (label gin_trgm_ops);
```
Lalu jalankan migration-nya.

### 4b. Tambahkan kamus sinonim kategori

File baru `src/lib/search-synonyms.ts`:
```ts
// Kamus kata kunci umum -> kategori. Tambah/edit sesuai kategori produk kamu.
export const CATEGORY_SYNONYMS: Record<string, string> = {
  baju: "fashion", outfit: "fashion", atasan: "fashion", kemeja: "fashion", kaos: "fashion", dress: "fashion",
  skincare: "skincare", wajah: "skincare", serum: "skincare", cream: "skincare",
  gadget: "gadget", hp: "gadget", aksesoris: "gadget", charger: "gadget",
  rumah: "rumah-tangga", dapur: "rumah-tangga", peralatan: "rumah-tangga",
};

export function expandCategoryFromQuery(query: string): string | null {
  const q = query.trim().toLowerCase();
  return CATEGORY_SYNONYMS[q] ?? null;
}
```

### 4c. Gabungkan ke query search di `getPublicProductsPaginated`

Ganti bagian search di `src/lib/data.ts` (blok `if (isDb())`, sebelum `whereClause.label = {...}`) jadi:

```ts
import { expandCategoryFromQuery } from "@/lib/search-synonyms";
// ...

if (cleanSearch) {
  const expandedCategory = expandCategoryFromQuery(cleanSearch);

  // Fuzzy search pakai similarity trigram (toleran typo) + fallback contains,
  // DITAMBAH produk dari kategori hasil expansion kamus sinonim (kalau ada match).
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Product"
    WHERE "isActive" = true
      AND (
        similarity(label, ${cleanSearch}) > 0.25
        OR label ILIKE ${"%" + cleanSearch + "%"}
        OR category ILIKE ${"%" + cleanSearch + "%"}
        ${expandedCategory ? Prisma.sql`OR category = ${expandedCategory}` : Prisma.empty}
      )
    ORDER BY similarity(label, ${cleanSearch}) DESC
  `;
  const matchedIds = rows.map((r) => r.id);
  whereClause.id = { in: matchedIds.length ? matchedIds : ["__none__"] };
} else if (cleanSearch === "" ) {
  // biarkan whereClause label seperti semula kalau search kosong
}
```

Catatan: import `Prisma` dari `@prisma/client` di bagian atas file kalau belum ada (`import { Prisma } from "@prisma/client";`), dibutuhkan untuk `Prisma.sql`/`Prisma.empty` pada raw query kondisional di atas.

### 4d. Bersihkan dependency mati (fuse.js)

`fuse.js` masih tercatat di `package.json` tapi sudah tidak dipakai di kode manapun (sempat dipakai untuk fuzzy search client-side, lalu dihapus saat migrasi ke server-side search+pagination). Hapus supaya tidak nyampah:
```
npm uninstall fuse.js
```

### Kenapa ini masih aman buat skala kecil
- Index GIN trigram bikin fuzzy search tetap cepat bahkan sampai puluhan ribu baris — jauh di atas kebutuhan kamu sekarang.
- Kamus sinonim itu manual & kamu yang kontrol — gampang ditambah kapan aja tanpa perlu API eksternal atau biaya AI.
- Kalau nanti kamu mau upgrade ke pencarian semantik beneran (paham makna, bukan cuma kata kunci terdaftar), itu baru butuh model embedding — tapi untuk katalog kurasi berisi puluhan produk, ini biasanya berlebihan.

### Verifikasi Fix 4
- [ ] Cari "skincer" (typo) di storefront → tetap nemu produk kategori skincare
- [ ] Cari "baju" → produk berlabel "Kemeja"/"Kaos" (kategori fashion) ikut muncul
- [ ] Cari sesuatu yang gak ada sama sekali → tetap nampilin state "produk tidak ditemukan", gak error

## Fix 5 — Search Intelligence kotor karena ngelog tiap jeda ketik, bukan cuma pas selesai

File: `src/components/product-gallery.tsx`

Sekarang debounce buat filter produk (350ms) dan debounce buat nyatet ke `SearchLog` itu jadi satu — akibatnya kata yang belum selesai diketik (mis. "Kao" sebelum jadi "Kaos") ikut kecatet sebagai entri terpisah di dashboard "Kata Kunci Dicari Pengunjung", bikin datanya berisik/gak akurat.

Pisahkan jadi 2 timer independen — satu tetap cepat buat live-filter, satu lebih lama khusus logging:

```tsx
useEffect(() => {
  // Timer 1: live-filter produk, tetap cepat biar berasa instant
  const filterTimer = setTimeout(() => {
    const trimmed = query.trim();
    const currentQ = searchParams.get("q") ?? "";
    if (trimmed !== currentQ) {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, 350);

  // Timer 2: catat ke Search Intelligence, HANYA kalau user beneran berhenti ngetik
  const logTimer = setTimeout(() => {
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      logSearchAction(trimmed).catch(() => {});
    }
  }, 1200);

  return () => {
    clearTimeout(filterTimer);
    clearTimeout(logTimer);
  };
}, [query, pathname, router, searchParams]);
```

### Verifikasi Fix 5
- [ ] Ketik "kaos" pelan-pelan (jeda antar huruf < 1 detik) → cuma "kaos" yang muncul di dashboard Search Intelligence, bukan "k", "ka", "kao" juga
- [ ] List produk tetap ke-filter cepat pas ngetik (gak nunggu 1.2 detik buat lihat hasil)
- [ ] Data lama yang udah kepalang kotor di `SearchLog` boleh dibiarkan aja, gak perlu dihapus manual — cuma data baru ke depannya yang bakal lebih bersih

