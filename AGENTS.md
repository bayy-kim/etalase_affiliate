# AGENTS.md

## Etalase Affiliate — Pedoman untuk agent

### Stack (wajib konsisten)
- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4 **CSS-first** — token ada di `src/app/globals.css` (`@theme`). **JANGAN** buat `tailwind.config.ts`.
- lucide-react untuk SEMUA icon (bukan emoji).
- Data via `src/lib/data.ts` — memakai Prisma bila `DATABASE_URL` ter-set, selain itu **mock store**. Jangan panggil Prisma langsung dari komponen.
- Uang selalu **integer Rupiah**, jangan float.

### Perintah
- `npm run dev` — dev server
- `npm run build` — build produksi (harus bersih)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run prisma:seed` — seed admin + produk

### Guardrail (bug berulang — patuhi)
- `useSearchParams()` WAJIB dibungkus `<Suspense>`.
- Jangan buat token `--spacing-*` custom yang bentrok dengan utility bawaan.
- JANGAN `backdrop-filter` di parent yang punya child `position: fixed`.
- JANGAN shorthand `inset` — pakai `top/right/bottom/left` eksplisit.
- Full-height mobile pakai `100dvh`, bukan `100vh`.
- Target sentuh min 44×44px.
- Proteksi `/admin/*` di `src/middleware.ts`, bukan cuma guard halaman.
- Animasi hanya `transform` & `opacity`; hormati `prefers-reduced-motion`.

### Desain
Design system lengkap ada di `DESIGN.md` (Etalase Dark Commerce: `#111214` bg, `#1B1C1E` surface, `#15803D` primary, `#22C55E` accent, Plus Jakarta Sans, radius besar, tanpa shadow berat). Konsisten antar semua halaman, termasuk admin.

### Setup DB (opsional, hanya bila pakai Neon)
`DATABASE_URL`, `SESSION_SECRET`, `ENCRYPTION_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` di `.env` — jangan pernah commit `.env`.
