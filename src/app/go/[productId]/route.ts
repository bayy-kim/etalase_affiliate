import { NextResponse } from "next/server";

import { getProduct, recordClick } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product || !product.isActive) {
    const home = new URL("/", _req.url);
    home.searchParams.set("error", "produk-tidak-tersedia");
    const res = NextResponse.redirect(home, 302);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Catat klik secara server-side (100% terekam walau JS di-strip in-app browser)
  await recordClick(productId);

  const res = NextResponse.redirect(product.affiliateUrl, 302);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
