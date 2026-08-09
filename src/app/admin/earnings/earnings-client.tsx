"use client";

import { useState } from "react";
import { Plus, Store, ShoppingBag } from "lucide-react";

import { AdminPageHeader } from "@/components/admin-header";
import { EarningsSheet } from "@/components/earnings-sheet";
import { formatRupiah } from "@/lib/format";
import { platformLabel, type PlatformKey } from "@/lib/icons";
import type { Earning } from "@/lib/data";

const platformIcon = (p: PlatformKey) => (p === "TIKTOK_SHOP" ? Store : ShoppingBag);

export function EarningsClient({
  earnings,
  products,
}: {
  earnings: Earning[];
  products: { id: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdminPageHeader
        title="Catat Earnings"
        backHref="/admin/dashboard"
        actions={
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Tambah earning"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-background-base transition-transform hover:bg-primary-hover active:scale-95"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        }
      />

      <div className="flex flex-col gap-4 px-4 pt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] leading-5 text-text-secondary">Riwayat Terbaru</h2>
          <button
            type="button"
            className="text-[12px] font-[600] uppercase tracking-[0.05em] text-primary transition-colors hover:text-primary-fixed-dim"
          >
            Lihat Semua
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {earnings.length === 0 ? (
            <li className="rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-[14px] text-text-secondary">
              Belum ada earning tercatat. Tambah lewat tombol + di atas.
            </li>
          ) : (
            earnings.map((e) => {
              const Icon = platformIcon(e.platform);
              const date = new Date(e.periodDate);
              const month = new Intl.DateTimeFormat("id-ID", { month: "short" })
                .format(date)
                .replace(".", "");
              return (
                <li
                  key={e.id}
                  className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4"
                >
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-container-low">
                    <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
                      {month}
                    </span>
                    <span className="text-[16px] font-bold leading-6 text-text-primary">
                      {date.getDate()}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-[600] leading-5 text-text-primary">
                      {e.productLabel ?? "Komisi Tanpa Produk"}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {platformLabel[e.platform]}
                    </span>
                  </span>
                  <span className="shrink-0 text-[16px] font-bold leading-6 text-accent-green">
                    +{formatRupiah(e.amount)}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <EarningsSheet products={products} open={open} onOpenChange={setOpen} />
    </>
  );
}
