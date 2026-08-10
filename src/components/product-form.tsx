"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createProductAction, updateProductAction, type ActionState } from "@/server/actions/product";
import { categorySelectOptions, iconPicker, platformLabel, type PlatformKey } from "@/lib/icons";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

const initial: ActionState = {};

export function ProductForm({
  product,
  isEdit,
}: {
  product?: Product;
  isEdit?: boolean;
}) {
  const action = isEdit
    ? updateProductAction.bind(null, product!.id)
    : createProductAction;

  const [state, formAction, pending] = useActionState(action, initial);
  const [platform, setPlatform] = useState<PlatformKey>(product?.platform ?? "TIKTOK_SHOP");
  const [iconKey, setIconKey] = useState(product?.iconKey ?? "sparkles");
  const [isMall, setIsMall] = useState(product?.isMall ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const err = state && "fieldErrors" in state ? state.fieldErrors : undefined;
  const topError = state && "error" in state && state.error ? state.error : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-6 pb-28 lg:pb-0">
      {topError && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 font-medium"
        >
          {topError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Label */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="label">Label Produk</Label>
          <Input
            id="label"
            name="label"
            defaultValue={product?.label ?? ""}
            placeholder="Contoh: Skincare Anti-Aging"
            aria-invalid={Boolean(err?.label)}
            aria-describedby={err?.label ? "label-error" : undefined}
          />
          {err?.label && (
            <p id="label-error" className="text-[12px] text-rose-600 font-medium" role="alert">
              {err.label}
            </p>
          )}
        </div>

        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Kategori</Label>
          <Select id="category" name="category" defaultValue={product?.category ?? ""}>
            <option value="" disabled>
              Pilih Kategori
            </option>
            {categorySelectOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
          {err?.category && (
            <p className="text-[12px] text-rose-600 font-medium" role="alert">
              {err.category}
            </p>
          )}
        </div>
      </div>

      {/* Icon */}
      <div className="flex flex-col gap-2">
        <Label>Pilih Icon</Label>
        <div className="no-scrollbar -mx-1 flex gap-3.5 overflow-x-auto px-1 py-2">
          {iconPicker.map((item) => {
            const Icon = item.icon;
            const selected = iconKey === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setIconKey(item.value)}
                aria-pressed={selected}
                aria-label={item.label}
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-indigo-500",
                  selected
                    ? "border-t border-white border-b border-indigo-700 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_8px_16px_-3px_rgba(99,102,241,0.4)] scale-105"
                    : "border-t border-white border-b border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100 text-slate-500 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <input type="hidden" name="iconKey" value={iconKey} />
        {err?.iconKey && (
          <p className="text-[12px] text-rose-600 font-medium" role="alert">
            {err.iconKey}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform */}
        <div className="flex flex-col gap-2">
          <Label>Platform</Label>
          <div className="flex h-14 gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-1.5 shadow-inner">
            {(["TIKTOK_SHOP", "SHOPEE"] as PlatformKey[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                aria-pressed={platform === p}
                className={cn(
                  "flex-1 rounded-xl text-[14px] font-semibold transition-all",
                  platform === p
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {platformLabel[p]}
              </button>
            ))}
          </div>
          <input type="hidden" name="platform" value={platform} />
          {err?.platform && (
            <p className="text-[12px] text-rose-600 font-medium" role="alert">
              {err.platform}
            </p>
          )}
        </div>

        {/* Affiliate URL */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="affiliateUrl">Link Affiliate</Label>
          <div className="relative">
            <Link2
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              defaultValue={product?.affiliateUrl ?? ""}
              placeholder="https://..."
              className="pl-12"
              aria-invalid={Boolean(err?.affiliateUrl)}
              aria-describedby={err?.affiliateUrl ? "url-error" : undefined}
            />
          </div>
          {err?.affiliateUrl && (
            <p id="url-error" className="text-[12px] text-rose-600 font-medium" role="alert">
              {err.affiliateUrl}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pendapatan dari produk */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="income">Pendapatan awal (opsional)</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-slate-400">
              Rp
            </span>
            <Input
              id="income"
              name="income"
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={product?.income ?? ""}
              placeholder="0"
              className="pl-12"
            />
          </div>
          <p className="text-[12px] text-slate-500">
            Otomatis bertambah tiap kamu mencatat earning untuk produk ini.
          </p>
        </div>

        {/* Catatan internal */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="internalNote">Catatan Internal (opsional)</Label>
          <Input
            id="internalNote"
            name="internalNote"
            defaultValue={product?.internalNote ?? ""}
            placeholder="Nama asli produk untuk referensi admin"
          />
        </div>
      </div>

      {/* Mall / Official Store */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-slate-800">
            Toko Resmi / Official Mall
          </span>
          <span className="text-[13px] text-slate-500">
            Tampilkan badge Mall pada produk ini
          </span>
        </div>
        <Switch
          checked={isMall}
          onCheckedChange={setIsMall}
          aria-label="Toko Resmi Mall"
        />
      </div>
      <input type="hidden" name="isMall" value={isMall ? "on" : "off"} />

      {/* Aktif */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-slate-800">
            Tampilkan di Etalase
          </span>
          <span className="text-[13px] text-slate-500">
            Produk ini akan terlihat oleh publik
          </span>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          aria-label="Tampilkan di etalase"
        />
      </div>
      <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />

      {/* Submit button - Full visibility di mobile & desktop */}
      <div className="mt-4 flex w-full justify-end">
        <Button type="submit" className="w-full h-12 text-[15px] font-semibold lg:w-auto lg:px-8" disabled={pending} aria-busy={pending}>
          {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}
