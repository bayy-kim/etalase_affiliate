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
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <Link
        href={`/go/${product.id}`}
        prefetch={false}
        className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-card p-4 transition-colors hover:bg-surface-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
      >
        <span className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-base text-text-primary transition-colors group-hover:border-primary-container">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-[600] leading-5 text-text-primary">
              {product.label}
            </span>
            <span className="mt-1 text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
              {platformUppercase[product.platform]}
            </span>
          </span>
        </span>
        <ChevronRight
          className="ml-4 h-5 w-5 shrink-0 text-text-secondary transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
