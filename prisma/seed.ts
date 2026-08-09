import { PrismaClient, Platform } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "muhamadaibayu@gmail.com";
  const password = process.env.ADMIN_PASSWORD ?? "bayy muhamad";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  const products = [
    {
      label: "Skincare Wajah Pilihan",
      internalNote: "Skincare Set Glowing — TikTok Shop",
      category: "skincare",
      iconKey: "sparkles",
      platform: Platform.TIKTOK_SHOP,
      affiliateUrl: "https://vt.tokopedia.com/placeholder",
      priceMin: 45000,
      priceMax: 120000,
      sortOrder: 0,
    },
    {
      label: "Gadget Setup Murah",
      internalNote: "Minimalist Desk Lamp / aksesoris gadget",
      category: "gadget",
      iconKey: "smartphone",
      platform: Platform.SHOPEE,
      affiliateUrl: "https://shopee.co.id/placeholder",
      priceMin: 99000,
      priceMax: 350000,
      sortOrder: 1,
    },
    {
      label: "OOTD Fashion Pria",
      internalNote: "Oversized T-Shirt Black",
      category: "fashion",
      iconKey: "shirt",
      platform: Platform.TIKTOK_SHOP,
      affiliateUrl: "https://vt.tokopedia.com/placeholder",
      priceMin: 75000,
      priceMax: 180000,
      sortOrder: 2,
    },
    {
      label: "Keperluan Kos",
      internalNote: "Perabotan kosan estetik",
      category: "rumah-tangga",
      iconKey: "home",
      platform: Platform.SHOPEE,
      affiliateUrl: "https://shopee.co.id/placeholder",
      priceMin: 15000,
      priceMax: 60000,
      sortOrder: 3,
    },
    {
      label: "Lip Tint Viral (Bundle 3)",
      internalNote: "Lip tint tahan lama",
      category: "skincare",
      iconKey: "sparkles",
      platform: Platform.TIKTOK_SHOP,
      affiliateUrl: "https://vt.tokopedia.com/placeholder",
      priceMin: 89000,
      priceMax: 89000,
      isActive: false,
      sortOrder: 4,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `seed-${product.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      update: {},
      create: {
        id: `seed-${product.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        ...product,
      },
    });
  }

  console.log("Seed selesai: 1 admin user + produk awal dibuat.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
