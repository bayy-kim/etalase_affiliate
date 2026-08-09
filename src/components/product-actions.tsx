"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { toggleProductAction, deleteProductAction } from "@/server/actions/product";

export function ProductActions({
  product,
  layout = "row",
}: {
  product: { id: string; label: string; isActive: boolean };
  layout?: "row" | "card";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = async (checked: boolean) => {
    await toggleProductAction(product.id, checked);
    router.refresh();
  };

  const remove = async () => {
    setBusy(true);
    await deleteProductAction(product.id);
    setOpen(false);
    setConfirming(false);
    setBusy(false);
    router.refresh();
  };

  return (
    <div
      className={
        layout === "card"
          ? "flex shrink-0 items-center gap-2"
          : "flex shrink-0 flex-col items-end gap-2"
      }
    >
      <div className="relative">
        <button
          type="button"
          aria-label={`Menu aksi untuk ${product.label}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-text-primary"
        >
          <MoreVertical className="h-5 w-5" aria-hidden="true" />
        </button>

        <AnimatePresence>
          {open && (
            <>
              <button
                type="button"
                aria-label="Tutup menu"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className="fixed top-0 right-0 bottom-0 left-0 z-40 cursor-default"
              />
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-high p-1 shadow-lg"
              >
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] text-text-primary transition-colors hover:bg-surface-variant"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(true);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] text-error transition-colors hover:bg-surface-variant"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Hapus
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Switch
        checked={product.isActive}
        onCheckedChange={toggle}
        aria-label={product.isActive ? "Nonaktifkan produk" : "Aktifkan produk"}
        className={layout === "card" ? "order-first" : undefined}
      />

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 right-0 bottom-0 left-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={() => !busy && setConfirming(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              className="w-full max-w-sm rounded-2xl border border-border-subtle bg-surface-card p-5"
            >
              <h2 id="delete-title" className="text-[18px] font-[600] leading-6 text-text-primary">
                Hapus produk ini?
              </h2>
              <p className="mt-2 text-[14px] leading-5 text-text-secondary">
                “{product.label}” akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                  className="h-12 flex-1 rounded-xl border border-border-subtle bg-transparent text-[15px] font-[600] text-text-primary transition-colors hover:bg-surface-variant disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={remove}
                  className="h-12 flex-1 rounded-xl bg-error-container text-[15px] font-[600] text-on-error-container transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {busy ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
