"use client";

import { useState } from "react";
import {
  Camera,
  Check,
  Copy,
  ImagePlus,
  Loader2,
  Maximize2,
  Shirt,
  Sparkles,
  Video,
  Wand2,
  X,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateContentPromptAction, type AiAnalysisResult } from "@/server/actions/ai";
import { cn } from "@/lib/utils";

export default function AiChatGeminiPage() {
  const [category, setCategory] = useState<"skincare" | "fashion" | "gadget">("skincare");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const handlePickFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await generateContentPromptAction(category, preview ?? undefined);
      setResult(res);
    } catch {
      setResult({ error: "Gagal memproses analisis AI. Coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "prompt" | "negative") => {
    navigator.clipboard.writeText(text);
    if (type === "prompt") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    }
  };

  return (
    <AdminShell
      title="AI Content Studio"
      subtitle="Bikin prompt video profesional untuk Google Flow / Veo dari foto produk"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 pb-12">
        {/* Banner Info */}
        <div className="flex flex-col gap-3 rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-emerald-50/50 p-6 shadow-clay-card lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-t border-white border-b border-indigo-200 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                Gemini 2.5 Flash Vision AI
              </span>
              <h2 className="mt-1 text-[22px] font-extrabold tracking-tight text-slate-900">
                Studio Prompt Video Google Flow / Veo Pro
              </h2>
            </div>
          </div>
          <p className="max-w-3xl text-[14px] leading-relaxed text-slate-600">
            Unggah foto produk Anda, lalu pilih kategori untuk menghasilkan **Prompt Video Sinematik 9:16** yang dikunci sesuai standar iklan sosial media profesional (misal: <em>Skincare tanpa wajah/tangan saja</em> & <em>Fashion memakai model wanita natural non-artis</em>).
          </p>
        </div>

        {/* Form Input Studio */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Kolom Kiri: Input foto & kategori (5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Kategori Selector */}
            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card">
              <Label className="text-[14px] font-bold text-slate-900">1. Pilih Kategori Konten</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("skincare")}
                  aria-pressed={category === "skincare"}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all",
                    category === "skincare"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm"
                      : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-[12px]">Skincare</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("fashion")}
                  aria-pressed={category === "fashion"}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all",
                    category === "fashion"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm"
                      : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Shirt className="h-5 w-5" />
                  <span className="text-[12px]">Fashion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("gadget")}
                  aria-pressed={category === "gadget"}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all",
                    category === "gadget"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm"
                      : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-[12px]">Gadget</span>
                </button>
              </div>

              {/* Aturan Otomatis */}
              <div className="mt-1 rounded-2xl border border-slate-200/60 bg-slate-50 p-3 text-[12px] text-slate-500 leading-snug">
                {category === "skincare" && (
                  <p>🔒 <strong>Aturan Skincare:</strong> Mengunci visual pada demo TANGAN SAJA & close-up tekstur (tanpa wajah).</p>
                )}
                {category === "fashion" && (
                  <p>🔒 <strong>Aturan Fashion:</strong> Mengunci visual pada model wanita lokal natural (bukan artis/selebriti).</p>
                )}
                {category === "gadget" && (
                  <p>🔒 <strong>Aturan Gadget:</strong> Mengunci visual pada aesthetic hands-on desk setup / daily use.</p>
                )}
              </div>
            </div>

            {/* Upload Foto Produk */}
            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card">
              <Label className="text-[14px] font-bold text-slate-900">2. Unggah Foto Produk (Opsional)</Label>

              {preview ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Pratinjau Foto" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="absolute right-3 top-3 rounded-full bg-slate-900/80 p-2 text-white shadow-md hover:bg-slate-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center transition-all hover:bg-slate-100/80">
                  <ImagePlus className="h-8 w-8 text-indigo-500" />
                  <span className="text-[13px] font-semibold text-slate-700">
                    Pilih Foto Produk dari Galeri
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Format JPG/PNG (otomatis di-compress untuk hemat kuota)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handlePickFile(e.target.files?.[0])}
                  />
                </label>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-2 h-12 w-full text-[15px] font-bold shadow-md shadow-indigo-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Menganalisis & Bikin Prompt...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    <span>Generate Prompt Google Flow</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Kolom Kanan: Hasil Prompt & Setting Google Flow (7 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {result?.error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-[14px] text-rose-700 shadow-sm">
                {result.error}
              </div>
            ) : result ? (
              <div className="flex flex-col gap-6">
                {/* Visual Concept */}
                <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-indigo-600">
                    <Sparkles className="h-4 w-4" />
                    Konsep Visual Rekomendasi AI
                  </div>
                  <p className="text-[15px] font-semibold leading-relaxed text-slate-800">
                    {result.visualConcept}
                  </p>
                </div>

                {/* Prompt Utama untuk Google Flow */}
                <div className="flex flex-col gap-3 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-clay-card">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-indigo-700">
                      Prompt Utama (Salin ke Google Flow)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.flowPrompt ?? "", "prompt")}
                      className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-[12px] font-bold text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                    >
                      {copiedPrompt ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedPrompt ? "Tersalin!" : "Salin Prompt"}</span>
                    </button>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-[13px] text-indigo-300 leading-relaxed selection:bg-indigo-500 selection:text-white">
                    {result.flowPrompt}
                  </div>
                </div>

                {/* Negative Prompt */}
                {result.negativePrompt && (
                  <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-rose-600">
                        Negative Prompt (Elemen Terlarang)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.negativePrompt ?? "", "negative")}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-bold text-slate-700 shadow-sm hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                      >
                        {copiedNegative ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedNegative ? "Tersalin!" : "Salin Negative"}</span>
                      </button>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3.5 font-mono text-[12px] text-slate-700">
                      {result.negativePrompt}
                    </div>
                  </div>
                )}

                {/* Presets Setting Google Flow */}
                {result.suggestedSettings && (
                  <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card">
                    <div className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
                      <Video className="h-4 w-4 text-emerald-600" />
                      <span>Rekomendasi Parameter Google Flow</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aspect Ratio</span>
                        <span className="mt-1 text-[13px] font-bold text-slate-800">{result.suggestedSettings.aspectRatio}</span>
                      </div>
                      <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Motion Speed</span>
                        <span className="mt-1 text-[13px] font-bold text-slate-800">{result.suggestedSettings.motionSpeed}</span>
                      </div>
                      <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Camera</span>
                        <span className="mt-1 text-[13px] font-bold text-slate-800">{result.suggestedSettings.cameraAngle}</span>
                      </div>
                      <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lighting</span>
                        <span className="mt-1 text-[13px] font-bold text-slate-800">{result.suggestedSettings.lighting}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center shadow-sm">
                <Maximize2 className="h-10 w-10 text-slate-300" />
                <p className="max-w-sm text-[14px] font-semibold text-slate-500">
                  Pilih kategori & unggah foto produk di sebelah kiri, lalu tekan tombol Generate Prompt untuk memulai.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
