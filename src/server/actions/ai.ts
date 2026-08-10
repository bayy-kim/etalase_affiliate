"use server";

import { getSession } from "@/lib/session";

const API_KEY = process.env.GEMINI_API_KEY;

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

export async function generateContentPromptAction(
  category: string,
  imageBase64?: string
): Promise<AiAnalysisResult> {
  const session = await getSession();
  if (!session) return { error: "Tidak terautentikasi." };

  let systemInstructions = "";
  if (category === "skincare") {
    systemInstructions = `KATEGORI: Skincare & Beauty.
ATURAN UTAMA: DILARANG MENAMPILKAN WAJAH MODEL (STRICTLY NO FACES).
Gunakan demonstrasi TANGAN SAJA (Hand-only demonstration), close-up tekstur cream/serum pada punggung tangan atau telapak tangan dengan pencahayaan lembut.`;
  } else if (category === "fashion") {
    systemInstructions = `KATEGORI: Fashion & Apparel.
ATURAN UTAMA: Wajib menggunakan Model Wanita Lokal / Micro-Influencer Natural (Aesthetic everyday female model).
DILARANG MENAMPILKAN ARTIS ATAU SELEBRITI TERNAMA (STRICTLY NO FAMOUS CELEBRITIES / ARTISTS).`;
  } else {
    systemInstructions = `KATEGORI: Gadget / Lifestyle.
Aturan: Konsep estetis hands-on desk setup / aesthetic daily use.`;
  }

  const promptText = `
Anda adalah Pakar Video Director & Prompt Engineer Khusus untuk Google Flow / Veo / VideoFX.
Tugas Anda adalah mengidentifikasi produk (bila ada gambar) dan menghasilkan prompt video 3D/Photorealistic berdurasi singkat yang siap ditempel ke Google Flow.

${systemInstructions}

Berikan respon DALAM FORMAT JSON VALID tanpa markdown wrapper dengan struktur:
{
  "category": "${category}",
  "visualConcept": "Penjelasan singkat konsep video dalam Bahasa Indonesia",
  "flowPrompt": "Prompt Video bahasa Inggris lengkap untuk Google Flow (Deskripsikan subjek, gerakan kamera slow pan, lighting 4k photorealistic, aesthetic)",
  "negativePrompt": "Kata kunci terlarang bahasa Inggris (misal: celebrity, famous face, distorted fingers, blurry product, face jika skincare)",
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );

    if (!response.ok) {
      // Fallback ke model gemini-1.5-flash jika gemini-2.5-flash belum rilis di endpoint tersebut
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts }] }),
        }
      );
      if (!fallbackResponse.ok) {
        return { error: "Gagal menghubungi API Gemini. Periksa koneksi atau API Key." };
      }
      const fbData = await fallbackResponse.json();
      const rawText = fbData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return { error: "Gagal memproses analisis AI." };
      return JSON.parse(jsonMatch[0]);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { error: "Gagal memproses analisis AI." };
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Gemini Error:", e);
    return { error: "Terjadi kesalahan sistem saat menghubungi Gemini AI." };
  }
}
