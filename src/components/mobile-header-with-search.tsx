"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar } from "@/components/avatar";
import { logSearchAction } from "@/server/actions/search";

interface MobileHeaderWithSearchProps {
  displayName?: string;
  avatar?: string | null;
}

export function MobileHeaderWithSearch({
  displayName = "",
  avatar = null,
}: MobileHeaderWithSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [isOpen, setIsOpen] = useState(initialQuery.length > 0);
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state lokal dengan URL search query
  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.length > 0) {
      setIsOpen(true);
    }
  }, [initialQuery]);

  // Debounce filter (350ms) + Debounce logging (1200ms)
  useEffect(() => {
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
        params.delete("page"); // Reset ke hal 1
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
    }, 350);

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

  // Auto-focus ketika input dibuka
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setQuery("");
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("q")) {
      params.delete("q");
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/60 bg-[#f0f2f7]/95 px-4 backdrop-blur-md lg:hidden">
      <div className="relative flex h-full w-full items-center overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {!isOpen ? (
            /* Mode Tertutup: Avatar + Judul Etalase + Tombol Teleskop */
            <motion.div
              key="brand-bar"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Avatar
                  name={displayName}
                  src={avatar}
                  className="h-9 w-9 shrink-0 text-xs shadow-sm"
                />
                <span className="truncate text-sm font-extrabold tracking-tight text-slate-900">
                  ETALASE AFFILIATE
                </span>
              </div>

              {/* Tombol Kaca Pembesar (Search) */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={handleOpen}
                aria-label="Buka pencarian produk"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50 text-emerald-600 shadow-clay-sm transition-all hover:bg-emerald-100 active:scale-95"
              >
                <Search className="h-5 w-5 text-emerald-600" />
              </motion.button>
            </motion.div>
          ) : (
            /* Mode Terbuka: Searchbar Memanjang + ArrowLeft + Clear (X) */
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, scaleX: 0.8, originX: 1 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex w-full items-center gap-2"
            >
              {/* Tombol Kemball / Tutup Search */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleClose}
                aria-label="Tutup pencarian"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>

              {/* Input Searchbar */}
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari produk di etalase..."
                  className="h-10 w-full rounded-2xl border border-slate-200/80 bg-white pl-4 pr-10 text-[14px] font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Hapus teks pencarian"
                    className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
