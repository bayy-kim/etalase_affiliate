import { Search, TrendingUp } from "lucide-react";

import type { PopularSearch } from "@/lib/data";

export function SearchAnalyticsCard({
  searches,
}: {
  searches: PopularSearch[];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-[18px] text-slate-900">
          <Search className="h-5 w-5 text-indigo-600" />
          <span>Kata Kunci Dicari Pengunjung</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
          Search Intelligence
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-slate-500">
        Menampilkan kata kunci terbanyak yang diketik pengunjung di etalase Anda. Gunakan data ini untuk menambah produk yang paling banyak dicari!
      </p>

      {searches.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 text-center text-[13px] text-slate-400">
          Belum ada data pencarian dari pengunjung.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {searches.map((item, idx) => (
            <div
              key={item.query}
              className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 shadow-sm transition-all hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-mono text-[12px] font-extrabold text-indigo-600">
                  #{idx + 1}
                </span>
                <span className="truncate text-[14px] font-bold text-slate-800 capitalize">
                  {item.query}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-600 shrink-0">
                <TrendingUp className="h-3.5 w-3.5" />
                {item.count}x
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
