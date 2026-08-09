"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, ChevronDown, CircleDollarSign, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addEarningAction } from "@/server/actions/earning";
import { platformLabel, type PlatformKey } from "@/lib/icons";
import { toDateInputValue } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductOption = { id: string; label: string };

export function EarningsSheet({
  products,
  open,
  onOpenChange,
}: {
  products: ProductOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [platform, setPlatform] = useState<PlatformKey>("TIKTOK_SHOP");
  const [state, formAction, pending] = useActionState(addEarningAction, {});
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => toDateInputValue(new Date()));

  const close = () => {
    onOpenChange(false);
  };

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      setAmount("");
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  const today = toDateInputValue(new Date());

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            aria-hidden="true"
            className="fixed top-0 right-0 bottom-0 left-0 z-40 bg-black/60"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Tambah Earning"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 z-50 flex max-h-[88dvh] w-full max-w-[480px] -translate-x-1/2 flex-col rounded-t-2xl border border-b-0 border-border-subtle bg-surface-card"
          >
            {/* Handle */}
            <div className="flex w-full justify-center py-3">
              <div className="h-1.5 w-12 rounded-full bg-border-subtle" />
            </div>

            <div className="flex items-center justify-between border-b border-border-subtle px-4 pb-3">
              <h3 className="text-[18px] font-[600] leading-6 tracking-[-0.01em] text-text-primary">
                Tambah Earning
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="Tutup"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form
              action={formAction}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4">
                {/* Platform toggle */}
                <div>
                  <Label className="mb-2 block">Platform</Label>
                  <div className="flex w-full rounded-lg border border-border-subtle bg-surface-container-low p-1">
                    {(["TIKTOK_SHOP", "SHOPEE"] as PlatformKey[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        aria-pressed={platform === p}
                        className={cn(
                          "flex-1 rounded-md px-3 py-2 text-[15px] font-[600] leading-5 transition-all",
                          platform === p
                            ? "border border-border-subtle bg-surface-card text-text-primary"
                            : "text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {platformLabel[p]}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="platform" value={platform} />
                </div>

                {/* Product select */}
                <div>
                  <Label className="mb-2 block" htmlFor="productSelect">
                    Produk (Opsional)
                  </Label>
                  <div className="relative">
                    <Select id="productSelect" name="productId" defaultValue="">
                      <option value="" disabled>
                        Pilih Produk
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </Select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Nominal */}
                <div>
                  <Label className="mb-2 block" htmlFor="nominalInput">
                    Nominal Komisi
                  </Label>
                  <div className="flex h-14 items-center overflow-hidden rounded-xl border border-border-subtle bg-background-base transition-shadow focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container">
                    <CircleDollarSign
                      className="ml-4 h-5 w-5 shrink-0 text-text-secondary"
                      aria-hidden="true"
                    />
                    <span className="pl-2 pr-1 text-[20px] font-[700] leading-7 tracking-[-0.02em] text-text-secondary">
                      Rp
                    </span>
                    <input
                      id="nominalInput"
                      name="amount"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-full w-full border-none bg-transparent p-3 pl-1 text-[20px] font-[700] leading-7 tracking-[-0.02em] text-accent-green placeholder:text-surface-variant focus:outline-none focus:ring-0"
                    />
                  </div>
                  {state.fieldErrors?.amount && (
                    <p className="mt-1 text-[12px] text-error" role="alert">
                      {state.fieldErrors.amount}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <Label className="mb-2 block" htmlFor="dateInput">
                    Tanggal
                  </Label>
                  <div className="relative">
                    <input
                      id="dateInput"
                      name="periodDate"
                      type="date"
                      max={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="block w-full rounded-xl border border-border-subtle bg-background-base p-3 pr-10 text-[14px] text-text-primary focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
                    />
                    <Calendar
                      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                  {state.fieldErrors?.periodDate && (
                    <p className="mt-1 text-[12px] text-error" role="alert">
                      {state.fieldErrors.periodDate}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label className="mb-2 block" htmlFor="notesInput">
                    Catatan (Opsional)
                  </Label>
                  <Textarea
                    id="notesInput"
                    name="note"
                    rows={2}
                    placeholder="Tulis catatan di sini..."
                  />
                </div>

                {state.error && (
                  <p className="rounded-xl border border-error/40 bg-error-container/30 px-3 py-2 text-[13px] text-on-error-container" role="alert">
                    {state.error}
                  </p>
                )}
              </div>

              <div className="border-t border-border-subtle p-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full"
                  aria-busy={pending}
                >
                  {pending ? "Menyimpan..." : "Simpan Earnings"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
