import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Etalase Affiliate",
    template: "%s — Etalase Affiliate",
  },
  description:
    "Etalase link-in-bio untuk affiliate TikTok Shop & Shopee. Kurasi produk terbaik, satu tap langsung ke checkout di platform resmi.",
  applicationName: "Etalase Affiliate",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://etalaseaffiliate.vercel.app"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Etalase Affiliate — Kurasi Rekomendasi Produk Terbaik",
    description: "Kumpulan rekomendasi produk pilihan di TikTok Shop & Shopee. Tap produk untuk langsung checkout aman di aplikasi resmi.",
    url: "https://etalaseaffiliate.vercel.app",
    siteName: "Etalase Affiliate",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://etalaseaffiliate.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Etalase Affiliate Social Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Etalase Affiliate — Kurasi Rekomendasi Produk Terbaik",
    description: "Kumpulan rekomendasi produk pilihan di TikTok Shop & Shopee. Tap produk untuk langsung checkout aman di aplikasi resmi.",
    images: ["https://etalaseaffiliate.vercel.app/api/og"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f0f2f7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
