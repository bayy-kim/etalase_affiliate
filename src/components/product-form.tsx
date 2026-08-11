"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Link2, Clipboard, Check, AlertCircle } from "lucide-react";

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
  
  // State terkendali (controlled state) untuk memelihara input saat error/submitting
  const [labelValue, setLabelValue] = useState(product?.label ?? "");
  const [noteValue, setNoteValue] = useState(product?.internalNote ?? "");
  const [categoryValue, setCategoryValue] = useState(product?.category ?? "");
  const [urlValue, setUrlValue] = useState(product?.affiliateUrl ?? "");
  const [incomeValue, setIncomeValue] = useState(product?.income?.toString() ?? "");
  const [platform, setPlatform] = useState<PlatformKey>(product?.platform ?? "TIKTOK_SHOP");
  const [iconKey, setIconKey] = useState(product?.iconKey ?? "sparkles");
  const [isMall, setIsMall] = useState(product?.isMall ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  // Status notifikasi auto-detect
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [showPasteSuccess, setShowPasteSuccess] = useState(false);

  const err = state && "fieldErrors" in state ? state.fieldErrors : undefined;
  const topError = state && "error" in state && state.error ? state.error : undefined;

  // Handler untuk mendeteksi platform dari URL
  const handleUrlChange = (value: string) => {
    setUrlValue(value);
    const lower = value.toLowerCase();
    
    if (lower.includes("shopee") || lower.includes("shp.ee")) {
      setPlatform("SHOPEE");
      setDetectedPlatform("Shopee");
    } else if (
      lower.includes("tiktok") ||
      lower.includes("tokopedia") ||
      lower.includes("vt.tokopedia")
    ) {
      setPlatform("TIKTOK_SHOP");
      setDetectedPlatform("TikTok Shop");
    } else {
      setDetectedPlatform(null);
    }
  };

  // Fungsi Paste dari Clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleUrlChange(text);
        setShowPasteSuccess(true);
        setTimeout(() => setShowPasteSuccess(false), 2000);
      }
    } catch (err) {
      console.warn("Gagal membaca clipboard. Berikan izin akses clipboard di browsermu.", err);
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-6 pb-28 lg:pb-0">
      
      {/* ⚠️ NOTIFIKASI ERROR DETIL (Menjelaskan field mana yang salah / kurang) */}
      {(topError || (err && Object.keys(err).length > 0)) && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-[13px] text-rose-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-extrabold text-[14px] leading-tight text-rose-800">
                ⚠️ Mohon lengkapi atau perbaiki data produk:
              </p>
              {topError && <p className="mt-1 font-semibold">{topError}</p>}
              {err && Object.keys(err).length > 0 && (
                <ul className="mt-2 list-disc pl-4 space-y-1 font-medium">
                  {Object.entries(err).map(([field, msg]) => {
                    let fieldLabel = field;
                    if (field === "label") fieldLabel = "Label Produk";
                    if (field === "category") fieldLabel = "Kategori";
                    if (field === "iconKey") fieldLabel = "Icon";
                    if (field === "platform") fieldLabel = "Platform";
                    if (field === "affiliateUrl") fieldLabel = "Link Affiliate";
                    
                    return (
                      <li key={field}>
                        <span className="font-bold text-rose-900">{fieldLabel}:</span> {msg}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Label */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="label" className={cn(err?.label && "text-rose-600 font-semibold")}>
              Label Produk
            </Label>
            <span
              className={cn(
                "text-[11px] font-bold transition-colors",
                labelValue.length > 55
                  ? "text-rose-600 font-extrabold"
                  : labelValue.length > 45
                  ? "text-amber-600"
                  : "text-slate-400"
              )}
            >
              {labelValue.length} / 60
            </span>
          </div>
          <Input
            id="label"
            name="label"
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value.slice(0, 60))}
            maxLength={60}
            placeholder="Contoh: Skincare Anti-Aging"
            className={cn(
              err?.label && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
            )}
            aria-invalid={Boolean(err?.label)}
            aria-describedby={err?.label ? "label-error" : undefined}
          />
          {err?.label && (
            <p id="label-error" className="text-[12px] text-rose-600 font-semibold" role="alert">
              {err.label}
            </p>
          )}
        </div>

        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="category" className={cn(err?.category && "text-rose-600 font-semibold")}>
            Kategori
          </Label>
          <Select 
            id="category" 
            name="category" 
            value={categoryValue}
            onChange={(e) => setCategoryValue(e.target.value)}
            className={cn(
              err?.category && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
            )}
          >
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
            <p className="text-[12px] text-rose-600 font-semibold" role="alert">
              {err.category}
            </p>
          )}
        </div>
      </div>

      {/* Icon */}
      <div className="flex flex-col gap-2">
        <Label className={cn(err?.iconKey && "text-rose-600 font-semibold")}>Pilih Icon</Label>
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
                    : "border-t border-white border-b border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100 text-slate-500 shadow-sm hover:border-indigo-300 hover:text-indigo-600",
                  err?.iconKey && !selected && "border-rose-300 hover:border-rose-400"
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <input type="hidden" name="iconKey" value={iconKey} />
        {err?.iconKey && (
          <p className="text-[12px] text-rose-600 font-semibold" role="alert">
            {err.iconKey}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform */}
        <div className="flex flex-col gap-2">
          <Label className={cn(err?.platform && "text-rose-600 font-semibold")}>Platform</Label>
          <div className="flex h-14 gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-1.5 shadow-inner">
            {(["TIKTOK_SHOP", "SHOPEE"] as PlatformKey[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPlatform(p);
                  setDetectedPlatform(null); // Reset alert auto-detect jika dipencet manual
                }}
                aria-pressed={platform === p}
                className={cn(
                  "flex-1 rounded-xl text-[14px] font-semibold transition-all",
                  platform === p
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60 animate-in fade-in duration-200"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {platformLabel[p]}
              </button>
            ))}
          </div>
          <input type="hidden" name="platform" value={platform} />
          {err?.platform && (
            <p className="text-[12px] text-rose-600 font-semibold" role="alert">
              {err.platform}
            </p>
          )}
        </div>

        {/* Affiliate URL */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="affiliateUrl" className={cn(err?.affiliateUrl && "text-rose-600 font-semibold")}>
              Link Affiliate
            </Label>
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {showPasteSuccess ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500 animate-in zoom-in duration-150" />
                  <span className="text-emerald-600">Berhasil Ditempel!</span>
                </>
              ) : (
                <>
                  <Clipboard className="h-3 w-3" />
                  <span>Tempel Link</span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <Link2
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              value={urlValue}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://..."
              className={cn(
                "pl-12 pr-4",
                err?.affiliateUrl && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
              )}
              aria-invalid={Boolean(err?.affiliateUrl)}
              aria-describedby={err?.affiliateUrl ? "url-error" : undefined}
            />
          </div>
          
          {/* Badge Pemberitahuan Auto-Detect Platform */}
          {detectedPlatform && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 animate-in slide-in-from-top-1 duration-150">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Auto-detect: Platform {detectedPlatform} terpilih!
            </p>
          )}

          {err?.affiliateUrl && (
            <p id="url-error" className="text-[12px] text-rose-600 font-semibold" role="alert">
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
              value={incomeValue}
              onChange={(e) => setIncomeValue(e.target.value)}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="internalNote">Catatan Internal (opsional)</Label>
            <span
              className={cn(
                "text-[11px] font-bold transition-colors",
                noteValue.length > 280
                  ? "text-rose-600 font-extrabold"
                  : noteValue.length > 240
                  ? "text-amber-600"
                  : "text-slate-400"
              )}
            >
              {noteValue.length} / 300
            </span>
          </div>
          <Input
            id="internalNote"
            name="internalNote"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value.slice(0, 300))}
            maxLength={300}
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
