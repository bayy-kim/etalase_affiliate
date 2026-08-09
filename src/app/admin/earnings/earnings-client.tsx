"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  Calendar,
  ChevronDown,
  CircleDollarSign,
  Plus,
  Store,
  ShoppingBag,
  Wallet,
  MousePointerClick,
  Trophy,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { EarningsSheet } from "@/components/earnings-sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addEarningAction } from "@/server/actions/earning";
import { formatRupiah, toDateInputValue } from "@/lib/format";
import { platformLabel, type PlatformKey } from "@/lib/icons";
import type { Earning } from "@/lib/data";
import { cn } from "@/lib/utils";

const platformIcon = (p: PlatformKey) => (p === "TIKTOK_SHOP" ? Store : ShoppingBag);

export function EarningsClient({
  earnings,
  products,
  summary,
}: {
  earnings: Earning[];
  products: { id: string; label: string }[];
  summary: {
    month: number;
    countMonth: number;
    topPlatform: PlatformKey | null;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <AdminShell
      title="Catat Earnings"
      subtitle="Catat komisi baru dan pantau performa affiliate"
      actions={
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Tambah earning"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-background-base transition-transform hover:bg-primary-hover active:scale-95 lg:h-10 lg:w-auto lg:gap-2 lg:rounded-xl lg:px-4 lg:text-[15px] lg:font-[600] lg:text-white"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="hidden lg:inline">Catat Earning</span>
        </button>
      }
    >
      {/* Mobile: daftar riwayat */}
      <section className="flex flex-col gap-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] leading-5 text-text-secondary">Riwayat Terbaru</h2>
          <span className="text-[12px] font-[600] uppercase tracking-[0.05em] text-primary">Lihat Semua</span>
        </div>
        <EarningList earnings={earnings} />
      </section>

      {/* Desktop: bento */}
      <section className="hidden gap-6 lg:grid lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-4">
          <DesktopEarningForm products={products} />
        </div>

        {/* Ringkasan + tabel */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryCard
              label="Earnings Bulan Ini"
              value={formatRupiah(summary.month)}
              icon={Wallet}
              note="total komisi bulan ini"
            />
            <SummaryCard
              label="Total Konversi"
              value={String(summary.countMonth)}
              icon={MousePointerClick}
              note="entri bulan ini"
            />
            <SummaryCard
              label="Platform Teratas"
              value={summary.topPlatform ? platformLabel[summary.topPlatform] : "—"}
              icon={Trophy}
              note="bulan ini"
            />
          </div>

          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-card">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h3 className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
                Riwayat Terbaru
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface">
                    <th className="whitespace-nowrap p-4 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Tanggal</th>
                    <th className="whitespace-nowrap p-4 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Produk / Platform</th>
                    <th className="whitespace-nowrap p-4 text-right text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.slice(0, 8).map((e) => (
                    <tr key={e.id} className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-variant">
                      <td className="whitespace-nowrap p-4 text-[14px] text-text-secondary">
                        {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(e.periodDate))}
                      </td>
                      <td className="p-4">
                        <div className="max-w-[220px] truncate text-[14px] font-[600] text-text-primary">
                          {e.productLabel ?? "Komisi Tanpa Produk"}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[12px] font-[600] text-text-secondary">
                          <span
                            className={cn(
                              "inline-block h-2 w-2 rounded-full",
                              e.platform === "TIKTOK_SHOP" ? "bg-primary" : "bg-secondary"
                            )}
                            aria-hidden="true"
                          />
                          {platformLabel[e.platform]}
                        </div>
                      </td>
                      <td className="whitespace-nowrap p-4 text-right text-[18px] font-[600] text-secondary">
                        +{formatRupiah(e.amount)}
                      </td>
                    </tr>
                  ))}
                  {earnings.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-[14px] text-text-secondary">
                        Belum ada earning tercatat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <EarningsSheet products={products} open={open} onOpenChange={setOpen} />
    </AdminShell>
  );
}

function EarningList({ earnings }: { earnings: Earning[] }) {
  if (earnings.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-[14px] text-text-secondary">
        Belum ada earning tercatat. Tambah lewat tombol + di atas.
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {earnings.map((e) => {
        const Icon = platformIcon(e.platform);
        const date = new Date(e.periodDate);
        const month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date).replace(".", "");
        return (
          <li key={e.id} className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4">
            <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-container-low">
              <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">{month}</span>
              <span className="text-[16px] font-bold leading-6 text-text-primary">{date.getDate()}</span>
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
            <span className="shrink-0 text-[16px] font-bold leading-6 text-accent-green">+{formatRupiah(e.amount)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  note,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  note?: string;
}) {
  return (
    <div className="relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-5">
      <div className="relative z-10">
        <div className="mb-1 text-[12px] font-[600] uppercase tracking-[0.05em] text-text-secondary">{label}</div>
        <div className="text-[24px] font-[700] leading-8 tracking-[-0.02em] text-primary">{value}</div>
      </div>
      {note && <div className="relative z-10 text-[12px] font-[600] text-text-secondary">{note}</div>}
      <Icon className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" aria-hidden="true" />
    </div>
  );
}

function DesktopEarningForm({ products }: { products: { id: string; label: string }[] }) {
  const [platform, setPlatform] = useState<PlatformKey>("TIKTOK_SHOP");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => toDateInputValue(new Date()));
  const [state, formAction, pending] = useActionState(addEarningAction, {});

  const err = state && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <div className="flex flex-col rounded-2xl border border-border-subtle bg-surface-card p-6">
      <h2 className="mb-6 flex items-center gap-2 text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
        <CircleDollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
        Catat Earning Baru
      </h2>
      <form action={formAction} className="flex flex-1 flex-col gap-5">
        <div>
          <Label className="mb-2 block">Platform</Label>
          <div className="flex gap-2">
            {(["TIKTOK_SHOP", "SHOPEE"] as PlatformKey[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                aria-pressed={platform === p}
                className={cn(
                  "h-10 flex-1 rounded-lg border text-[15px] font-[600] transition-colors",
                  platform === p
                    ? "border-primary-container bg-primary-container-dark text-primary"
                    : "border-border-subtle bg-surface text-text-primary hover:bg-surface-variant"
                )}
              >
                {platformLabel[p]}
              </button>
            ))}
          </div>
          <input type="hidden" name="platform" value={platform} />
        </div>

        <div>
          <Label className="mb-2 block" htmlFor="productSelect">Produk (Opsional)</Label>
          <div className="relative">
            <Select id="productSelect" name="productId" defaultValue="">
              <option value="" disabled>Pilih Produk</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          </div>
        </div>

        <div>
          <Label className="mb-2 block" htmlFor="amount">Nominal Komisi</Label>
          <div className="flex h-12 items-center overflow-hidden rounded-xl border border-border-subtle bg-background-base transition-shadow focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container">
            <span className="pl-3 text-[20px] font-[700] text-text-secondary">Rp</span>
            <input
              id="amount"
              name="amount"
              type="number"
              min={1}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-full w-full border-none bg-transparent px-2 text-right text-[20px] font-[700] text-accent-green placeholder:text-surface-variant focus:outline-none focus:ring-0"
            />
          </div>
          {err?.amount && <p className="mt-1 text-[12px] text-error" role="alert">{err.amount}</p>}
        </div>

        <div>
          <Label className="mb-2 block" htmlFor="dateInput">Tanggal</Label>
          <div className="relative">
            <input
              id="dateInput"
              name="periodDate"
              type="date"
              max={toDateInputValue(new Date())}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block h-12 w-full rounded-xl border border-border-subtle bg-background-base px-4 text-[14px] text-text-primary focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          </div>
          {err?.periodDate && <p className="mt-1 text-[12px] text-error" role="alert">{err.periodDate}</p>}
        </div>

        <div className="flex-1">
          <Label className="mb-2 block" htmlFor="notesInput">Catatan (Opsional)</Label>
          <Textarea id="notesInput" name="note" rows={3} placeholder="Mis. komisi video viral #42" />
        </div>

        {state && "error" in state && state.error && (
          <p className="rounded-xl border border-error/40 bg-error-container/30 px-3 py-2 text-[13px] text-on-error-container" role="alert">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} aria-busy={pending} className="mt-auto w-full">
          {pending ? "Menyimpan..." : "Simpan Earning"}
        </Button>
      </form>
    </div>
  );
}
