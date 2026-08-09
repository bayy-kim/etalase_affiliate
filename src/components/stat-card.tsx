import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trendPct,
  variant = "violet",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  trendPct?: number | null;
  variant?: "violet" | "mint" | "amber" | "rose";
}) {
  const hasTrend = trendPct !== undefined;
  const up = hasTrend && trendPct !== null && trendPct >= 0;

  const colorStyles = {
    violet: {
      bg: "bg-indigo-50/70 border-indigo-100",
      iconBg: "bg-gradient-to-b from-indigo-100 to-indigo-200/90 text-indigo-600 border-t border-white shadow-[0_6px_12px_-2px_rgba(99,102,241,0.3)]",
      value: "text-indigo-900",
    },
    mint: {
      bg: "bg-emerald-50/70 border-emerald-100",
      iconBg: "bg-gradient-to-b from-emerald-100 to-emerald-200/90 text-emerald-600 border-t border-white shadow-[0_6px_12px_-2px_rgba(16,185,129,0.3)]",
      value: "text-emerald-900",
    },
    amber: {
      bg: "bg-amber-50/70 border-amber-100",
      iconBg: "bg-gradient-to-b from-amber-100 to-amber-200/90 text-amber-600 border-t border-white shadow-[0_6px_12px_-2px_rgba(245,158,11,0.3)]",
      value: "text-amber-900",
    },
    rose: {
      bg: "bg-rose-50/70 border-rose-100",
      iconBg: "bg-gradient-to-b from-rose-100 to-rose-200/90 text-rose-600 border-t border-white shadow-[0_6px_12px_-2px_rgba(244,63,94,0.3)]",
      value: "text-rose-900",
    },
  }[variant];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border p-5 shadow-clay-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        colorStyles.bg
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {Icon && (
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl border-b border-slate-300/40", colorStyles.iconBg)}>
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          </span>
        )}
      </div>
      <span className={cn("text-[28px] font-extrabold leading-8 tracking-tight", colorStyles.value)}>
        {value}
      </span>
      {hasTrend ? (
        <span
          className={cn(
            "flex items-center gap-1.5 text-[12px] font-semibold leading-4",
            up ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {trendPct === null ? (
            "—"
          ) : (
            <>
              {up ? (
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              )}
              {up ? "+" : ""}
              {trendPct.toFixed(1)}% vs 7 hari lalu
            </>
          )}
        </span>
      ) : sub ? (
        <span className="text-[12px] font-medium leading-4 text-slate-500">{sub}</span>
      ) : null}
    </div>
  );
}
