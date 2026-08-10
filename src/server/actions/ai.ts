"use server";

import { getSession } from "@/lib/session";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";

export type AiAnalysisResult = {
  error?: string;
  category?: string;
  visualConcept?: string;
  flowPrompt?: string;
  negativePrompt?: string;
  suggestedSettings?: {
    aspectRatio: string;
    motionSpeed: string;
    cameraAngle: string;
    lighting: string;
  };
};

const PRODUCT_FIDELITY_RULE = `ATURAN KETAT (WAJIB): JANGAN PERNAH MENDESKRIPSIKAN ULANG TAMPILAN PRODUK DALAM TEKS PROMPT.
DILARANG menyebut warna, motif, kain, desain, packaging, label, atau branding produk dalam teks.
Gunakan frasa "[product reference image attached]" sebagai subjek, karena pengguna akan mengunggah foto produk langsung ke Google Flow (image-to-video) sehingga produk diambil 100% dari foto asli.
Prompt hanya mendeskripsikan gerakan kamera, pencahayaan, scene, dan styling model — BUKAN tampilan produk.`;

function systemInstructionsFor(category: string): string {
  if (category === "skincare") {
    return `KATEGORI: Skincare & Beauty.
ATURAN UTAMA: DILARANG MENAMPILKAN WAJAH MODEL (STRICTLY NO FACES).
Gunakan demonstrasi TANGAN SAJA (Hand-only demonstration), close-up tekstur cream/serum pada punggung tangan atau telapak tangan dengan pencahayaan lembut.
${PRODUCT_FIDELITY_RULE}`;
  }
  if (category === "fashion") {
    return `KATEGORI: Fashion & Apparel.
ATURAN UTAMA: Wajib menggunakan Model Wanita Lokal / Micro-Influencer Natural (Aesthetic everyday female model).
DILARANG MENAMPILKAN ARTIS ATAU SELEBRITI TERNAMA (STRICTLY NO FAMOUS CELEBRITIES / ARTISTS).
${PRODUCT_FIDELITY_RULE}`;
  }
  return `KATEGORI: Gadget / Lifestyle.
Aturan: Konsep estetis hands-on desk setup / aesthetic daily use.
${PRODUCT_FIDELITY_RULE}`;
}

function parseJsonFromText(rawText: string): AiAnalysisResult {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  return JSON.parse(jsonMatch[0]) as AiAnalysisResult;
}

export async function generateContentPromptAction(
  category: string,
  imageBase64?: string
): Promise<AiAnalysisResult> {
  const session = await getSession();
  if (!session) return { error: "Tidak terautentikasi." };
  if (!API_KEY) return { error: "GEMINI_API_KEY belum diatur di environment Vercel." };

  const promptText = `
Anda adalah Pakar Video Director & Prompt Engineer Khusus untuk Google Flow / Veo / VideoFX.
Tugas Anda adalah mengidentifikasi produk (bila ada gambar) dan menghasilkan prompt video 3D/Photorealistic berdurasi singkat yang siap ditempel ke Google Flow.

${systemInstructionsFor(category)}

${PRODUCT_FIDELITY_RULE}

Berikan respon DALAM FORMAT JSON VALID tanpa markdown wrapper dengan struktur:
{
  "category": "${category}",
  "visualConcept": "Penjelasan singkat konsep video dalam Bahasa Indonesia",
  "flowPrompt": "Prompt Video bahasa Inggris untuk Google Flow yang TIDAK mendeskripsikan tampilan produk (JANGAN sebut warna/motif/desain produk). Gunakan frasa '[product reference image attached]' sebagai subjek, lalu hanya deskripsikan gerakan kamera slow pan, pencahayaan natural 4k photorealistic, scene, dan styling model.",
  "negativePrompt": "Kata kunci terlarang bahasa Inggris (misal: celebrity, famous face, distorted fingers, blurry video, warped fabric, wrong colors, face jika skincare)",
  "suggestedSettings": {
    "aspectRatio": "9:16 (Vertical TikTok)",
    "motionSpeed": "3 - Smooth & Steady",
    "cameraAngle": "Macro Close-up / Eye-level Slow Pan",
    "lighting": "Soft Window Light / Studio Ambient"
  }
}
`;

  try {
    const parts: unknown[] = [{ text: promptText }];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.unshift({
        inline_data: {
          mime_type: "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Gemini API error:", response.status, errText.slice(0, 300));
      return {
        error: `Gagal menghubungi API Gemini (HTTP ${response.status}). Periksa API Key atau kuota akun.`,
      };
    }

    const data = await response.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.thought ??
      "";

    if (!rawText) {
      return { error: "Gemini tidak mengembalikan hasil. Coba lagi." };
    }

    return parseJsonFromText(rawText);
  } catch (e) {
    console.error("Gemini Error:", e);
    return { error: "Terjadi kesalahan sistem saat menghubungi Gemini AI." };
  }
}
