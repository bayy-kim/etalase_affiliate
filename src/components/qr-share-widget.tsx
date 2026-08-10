"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Download, QrCode, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QrShareWidget({ appUrl }: { appUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 80;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 40, 40);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "etalase-qr-code.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-[18px] text-slate-900">
          <QrCode className="h-5 w-5 text-indigo-600" />
          <span>QR Code & Bagikan Etalase</span>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600">
          Promosi Bio
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* QR Display */}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-inner">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <QRCodeSVG
              id="qr-code-svg"
              value={appUrl}
              size={120}
              level="H"
              includeMargin={false}
            />
          </div>
          <button
            type="button"
            onClick={downloadQr}
            className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh QR PNG</span>
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-[13px] leading-relaxed text-slate-600">
            Gunakan Kode QR ini di poster cetak/stiker video TikTok, atau bagikan link etalase Anda secara instan ke media sosial:
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyUrl}
              className="h-10 text-[13px] font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Salin Link</span>
                </>
              )}
            </Button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Cek rekomendasi produk terbaik pilihan saya di etalase ini: ${appUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-[13px] font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white active:scale-98 shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                appUrl
              )}&text=${encodeURIComponent("Cek rekomendasi produk pilihan di etalase ini:")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-[13px] font-bold text-sky-700 transition-all hover:bg-sky-600 hover:text-white active:scale-98 shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
