"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { type PlatformKey, platformLabel } from "@/lib/icons";

export function PixelLoadingOverlay({
  label,
  platform,
  onClose,
}: {
  label: string;
  platform: PlatformKey;
  onClose?: () => void;
}) {
  const isShopee = platform === "SHOPEE";

  useEffect(() => {
    // Auto close overlay after 6 seconds safety fallback (jika redirect tertahan)
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 6000);

    // Reset overlay jika pengunjung menekan tombol Back di browser (bfcache pageshow event)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && onClose) {
        onClose();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-clay-card"
      >
        {/* Tombol Tutup / Batal Manual */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau"
            className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Pixel Art 8-bit Shopping Bag Container */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-t border-white border-b border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-md">
          {/* Animated Pixel Art SVG */}
          <div className="animate-bounce">
            <svg
              width="48"
              height="48"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shape-rendering-crisp"
              style={{ imageRendering: "pixelated" }}
            >
              {/* Handles */}
              <path d="M5 2H11V4H9V3H7V4H5V2Z" fill={isShopee ? "#ea580c" : "#16a34a"} />
              {/* Bag Body Outer Outline */}
              <path d="M3 4H13V14H3V4Z" fill={isShopee ? "#ea580c" : "#16a34a"} />
              {/* Bag Body Inner Light */}
              <path d="M4 5H12V13H4V5Z" fill={isShopee ? "#f97316" : "#22c55e"} />
              {/* Pixel Heart / Star Center */}
              <path d="M7 7H9V8H10V9H9V10H7V9H6V8H7V7Z" fill="#ffffff" />
              <path d="M8 6H8V7H8V6Z" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-1.5 px-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
              isShopee ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            Mengalihkan ke {platformLabel[platform]}
          </span>
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-800">
            {label}
          </h3>
        </div>

        {/* 8-bit loading bar dots */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
          <span className="h-2 w-2 animate-ping rounded-full bg-indigo-500 [animation-delay:0.2s]" />
          <span className="h-2 w-2 animate-ping rounded-full bg-indigo-500 [animation-delay:0.4s]" />
        </div>

        <p className="text-[12px] font-semibold text-slate-400">
          Membuka aplikasi resmi secara otomatis...
        </p>
      </motion.div>
    </motion.div>
  );
}
