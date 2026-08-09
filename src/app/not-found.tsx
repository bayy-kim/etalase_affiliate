import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-4 bg-background-base px-6 text-center">
      <p className="text-6xl font-[800] tracking-tight text-primary-container">404</p>
      <h1 className="text-[20px] font-[600] leading-7 text-text-primary">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-xs text-[14px] leading-5 text-text-secondary">
        Sepertinya kamu nyasar. Balik ke etalase yuk.
      </p>
      <Link
        href="/"
        className="mt-2 flex h-12 w-full max-w-[280px] items-center justify-center rounded-xl border border-primary-container bg-primary-container text-[15px] font-[600] text-white transition-colors hover:bg-primary-hover"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
