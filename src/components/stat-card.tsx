import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trendPct,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  trendPct?: number | null;
}) {
  const hasTrend = trendPct !== undefined;
  const up = hasTrend && trendPct !== null && trendPct >= 0;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface-card p-4 lg:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
          {label}
        </span>
        {Icon && <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
      </div>
      <span className="text-[24px] font-[700] leading-8 tracking-[-0.02em] text-accent-green">
        {value}
      </span>
      {hasTrend ? (
        <span
          className={cn(
            "flex items-center gap-1 text-[12px] font-[600] leading-4",
            up ? "text-secondary" : "text-error"
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
              {trendPct.toFixed(1)}%
            </>
          )}
        </span>
      ) : sub ? (
        <span className="text-sm leading-5 text-on-surface">{sub}</span>
      ) : null}
    </div>
  );
}
