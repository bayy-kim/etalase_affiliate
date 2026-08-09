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
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 lg:col-span-2 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
          Click Trend ({range} Hari)
        </h2>
        <div role="group" aria-label="Rentang waktu" className="flex gap-1 rounded-full border border-border-subtle bg-surface-container p-1">
          {pills.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setRange(p.value)}
              aria-pressed={range === p.value}
              className={cn(
                "rounded-full px-3 py-1 text-[12px] font-[600] transition-colors",
                range === p.value
                  ? "bg-primary-container text-white"
                  : "text-text-secondary hover:text-on-surface"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-52 w-full lg:h-64">
        <ClickTrendChart data={data} />
      </div>
    </div>
  );
}
