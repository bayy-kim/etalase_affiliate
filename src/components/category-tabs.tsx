"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { categoryOptions } from "@/lib/icons";

export function CategoryTabs({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const select = (value: string) => {
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
      className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-2"
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
              "relative shrink-0 rounded-full border px-5 py-2 text-[15px] font-[600] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container",
              isActive
                ? "border-primary-container bg-primary-container text-white"
                : "border-border-subtle bg-transparent text-text-secondary hover:bg-surface-card"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute top-0 right-0 bottom-0 left-0 rounded-full bg-primary-container"
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
