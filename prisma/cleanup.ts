import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Bersihkan data contoh (dummy) agar siap pakai produksi:
 * - hapus semua EarningEntry & ClickLog (contoh),
 * - hapus produk hasil seed lama (id diawali `seed-`).
 */
async function main() {
  const earnings = await prisma.earningEntry.deleteMany();
  const clicks = await prisma.clickLog.deleteMany();
  const products = await prisma.product.deleteMany({
    where: { id: { startsWith: "seed-" } },
  });

  console.log(
    `Cleanup selesai — earnings: ${earnings.count}, klik: ${clicks.count}, produk contoh: ${products.count} dihapus.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
