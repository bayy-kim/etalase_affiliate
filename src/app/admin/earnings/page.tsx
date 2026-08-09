import type { Metadata } from "next";

import { EarningsClient } from "./earnings-client";
import { listEarnings, getAllProducts } from "@/lib/data";
import type { PlatformKey } from "@/lib/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Catat Earnings" };

export default async function EarningsPage() {
  const [earnings, products] = await Promise.all([listEarnings(), getAllProducts()]);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  let monthTotal = 0;
  let countMonth = 0;
  const byPlatform = new Map<PlatformKey, number>();
  for (const e of earnings) {
    const d = new Date(e.periodDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      monthTotal += e.amount;
      countMonth += 1;
      byPlatform.set(e.platform, (byPlatform.get(e.platform) ?? 0) + 1);
    }
  }
  const topPlatform: PlatformKey | null =
    Array.from(byPlatform.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <main>
      <EarningsClient
        earnings={earnings}
        products={products.map((p) => ({ id: p.id, label: p.label }))}
        summary={{ month: monthTotal, countMonth, topPlatform }}
      />
    </main>
  );
}
