"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

const ClickTrendChart = dynamic(
  () => import("@/components/dashboard-charts").then((m) => m.ClickTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-xl bg-surface-variant" aria-hidden="true" />
    ),
  }
);

export function ClickTrendCard({
  trend7,
  trend30,
}: {
  trend7: { label: string; clicks: number }[];
  trend30: { label: string; clicks: number }[];
}) {
  const [range, setRange] = useState<7 | 30>(7);
  const data = range === 7 ? trend7 : trend30;

  const pills: { value: 7 | 30; label: string }[] = [
    { value: 7, label: "7 Hari" },
    { value: 30, label: "30 Hari" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card lg:col-span-2 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
          Tren Klik ({range} Hari)
        </h2>
        <div role="group" aria-label="Rentang waktu" className="flex gap-1 rounded-2xl border border-slate-200/80 bg-slate-50 p-1">
          {pills.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setRange(p.value)}
              aria-pressed={range === p.value}
              className={cn(
                "rounded-xl px-3.5 py-1 text-[12px] font-bold transition-all",
                range === p.value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-56 w-full lg:h-64">
        <ClickTrendChart data={data} />
      </div>
    </div>
  );
}
