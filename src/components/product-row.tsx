"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

import { getIcon, platformUppercase, type PlatformKey } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type ProductRowData = {
  id: string;
  label: string;
  category: string;
  iconKey: string;
  platform: PlatformKey;
  pos?: number;
};

const platformStyles: Record<
  PlatformKey,
  {
    badge: string;
    badgeHover: string;
    num: string;
    chevron: string;
    label: string;
    ring: string;
  }
> = {
  TIKTOK_SHOP: {
    badge:
      "border-green-200/60 bg-gradient-to-b from-green-100 to-green-200/90 text-green-600 shadow-[0_6px_14px_-3px_rgba(22,163,74,0.25)]",
    badgeHover:
      "group-hover:from-green-600 group-hover:to-green-700 group-hover:text-white group-hover:shadow-[0_8px_18px_-3px_rgba(22,163,74,0.4)]",
    num: "text-green-600",
    chevron: "group-hover:text-green-600",
    label: "group-hover:text-green-700",
    ring: "focus-visible:outline-green-600",
  },
  SHOPEE: {
    badge:
      "border-orange-200/60 bg-gradient-to-b from-orange-100 to-orange-200/90 text-orange-600 shadow-[0_6px_14px_-3px_rgba(249,115,22,0.25)]",
    badgeHover:
      "group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-[0_8px_18px_-3px_rgba(249,115,22,0.4)]",
    num: "text-orange-500",
    chevron: "group-hover:text-orange-500",
    label: "group-hover:text-orange-600",
    ring: "focus-visible:outline-orange-500",
  },
};

export function ProductRow({ product }: { product: ProductRowData }) {
  const Icon = getIcon(product.iconKey);
  const style = platformStyles[product.platform];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
    >
      <Link
        href={`/go/${product.id}`}
        prefetch={false}
        className={cn(
          "group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-clay-card transition-all duration-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2",
          style.ring
        )}
      >
        <span className="flex min-w-0 items-center gap-3.5">
          {product.pos !== undefined && (
            <span className={cn("font-mono text-[15px] font-extrabold shrink-0 min-w-[24px]", style.num)}>
              {String(product.pos).padStart(2, "0")}
            </span>
          )}
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b transition-all duration-200 group-hover:scale-105",
              style.badge,
              style.badgeHover
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className={cn("truncate text-[15px] font-bold leading-5 text-slate-800 transition-colors", style.label)}>
              {product.label}
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {platformUppercase[product.platform]}
            </span>
          </span>
        </span>
        <ChevronRight
          className={cn("ml-3 h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5", style.chevron)}
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
