"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { categoryOptions } from "@/lib/icons";

export function CategoryTabs({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const select = (value: string) => {
    if (value === active) return;
    const params = new URLSearchParams();
    if (value !== "all") params.set("k", value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const tabs = [{ value: "all", label: "Semua" }, ...categoryOptions];

  return (
    <div
      role="tablist"
      aria-label="Filter kategori"
      className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 py-2"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => select(tab.value)}
            className={cn(
              "relative shrink-0 rounded-2xl border px-5 py-2.5 text-[14px] font-bold leading-5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
              isActive
                ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-2xl bg-emerald-600"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                aria-hidden="true"
              />
            )}
            <span className={cn("relative z-10", isActive && "text-white")}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
