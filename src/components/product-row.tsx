"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

import { getIcon, platformUppercase, type PlatformKey } from "@/lib/icons";

export type ProductRowData = {
  id: string;
  label: string;
  category: string;
  iconKey: string;
  platform: PlatformKey;
};

export function ProductRow({ product }: { product: ProductRowData }) {
  const Icon = getIcon(product.iconKey);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
    >
      <Link
        href={`/go/${product.id}`}
        prefetch={false}
        className="group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-clay-card transition-all duration-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <span className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200/60 bg-gradient-to-b from-indigo-100 to-indigo-200/90 text-indigo-600 shadow-[0_6px_14px_-3px_rgba(99,102,241,0.25)] transition-all duration-200 group-hover:scale-105 group-hover:from-indigo-600 group-hover:to-indigo-700 group-hover:text-white group-hover:shadow-[0_8px_18px_-3px_rgba(99,102,241,0.4)]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-bold leading-5 text-slate-800 transition-colors group-hover:text-indigo-600">
              {product.label}
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {platformUppercase[product.platform]}
            </span>
          </span>
        </span>
        <ChevronRight
          className="ml-3 h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
