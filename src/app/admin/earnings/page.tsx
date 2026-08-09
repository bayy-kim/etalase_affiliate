import type { Metadata } from "next";

import { EarningsClient } from "./earnings-client";
import { listEarnings, getAllProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Catat Earnings" };

export default async function EarningsPage() {
  const [earnings, products] = await Promise.all([listEarnings(), getAllProducts()]);

  return (
    <main className="min-h-dvh bg-background-base pb-24">
      <EarningsClient
        earnings={earnings}
        products={products.map((p) => ({ id: p.id, label: p.label }))}
      />
    </main>
  );
}
