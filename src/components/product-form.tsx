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
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const err = state && "fieldErrors" in state ? state.fieldErrors : undefined;
  const topError = state && "error" in state && state.error ? state.error : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {topError && (
        <p
          role="alert"
          className="rounded-xl border border-error/40 bg-error-container/30 px-3 py-2 text-[13px] text-on-error-container"
        >
          {topError}
        </p>
      )}

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
          <p id="label-error" className="text-[12px] text-error" role="alert">
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
          <p className="text-[12px] text-error" role="alert">
            {err.category}
          </p>
        )}
      </div>

      {/* Icon */}
      <div className="flex flex-col gap-2">
        <Label>Pilih Icon</Label>
        <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 py-1">
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
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-primary-container",
                  selected
                    ? "border-primary-container bg-primary-container-dark text-primary"
                    : "border-border-subtle bg-surface-card text-text-secondary"
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <input type="hidden" name="iconKey" value={iconKey} />
        {err?.iconKey && (
          <p className="text-[12px] text-error" role="alert">
            {err.iconKey}
          </p>
        )}
      </div>

      {/* Platform */}
      <div className="flex flex-col gap-2">
        <Label>Platform</Label>
        <div className="flex h-14 gap-1 rounded-xl border border-border-subtle bg-surface-card p-1">
          {(["TIKTOK_SHOP", "SHOPEE"] as PlatformKey[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              aria-pressed={platform === p}
              className={cn(
                "flex-1 rounded-lg text-[15px] font-[600] leading-5 transition-all",
                platform === p
                  ? "border border-border-subtle bg-background-base text-text-primary"
                  : "text-text-secondary"
              )}
            >
              {platformLabel[p]}
            </button>
          ))}
        </div>
        <input type="hidden" name="platform" value={platform} />
        {err?.platform && (
          <p className="text-[12px] text-error" role="alert">
            {err.platform}
          </p>
        )}
      </div>

      {/* Affiliate URL */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="affiliateUrl">Link Affiliate</Label>
        <div className="relative">
          <Link2
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
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
          <p id="url-error" className="text-[12px] text-error" role="alert">
            {err.affiliateUrl}
          </p>
        )}
      </div>

      {/* Harga */}
      <div className="flex flex-col gap-2">
        <Label>Rentang Harga</Label>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-text-secondary">
              Rp
            </span>
            <Input
              name="priceMin"
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={product?.priceMin ?? ""}
              placeholder="0"
              className="pl-12"
            />
          </div>
          <span className="text-[15px] text-text-secondary" aria-hidden="true">
            -
          </span>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-text-secondary">
              Rp
            </span>
            <Input
              name="priceMax"
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={product?.priceMax ?? ""}
              placeholder="0"
              className="pl-12"
            />
          </div>
        </div>
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

      {/* Aktif */}
      <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-card p-4">
        <div className="flex flex-col">
          <span className="text-[16px] font-[600] leading-6 text-text-primary">
            Tampilkan di Etalase
          </span>
          <span className="text-[14px] leading-5 text-text-secondary">
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

      {/* Submit sticky */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border-subtle bg-background-base px-4 py-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
          {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}
