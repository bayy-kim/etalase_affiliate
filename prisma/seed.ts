import { PrismaClient } from "@prisma/client";
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

  console.log("Seed selesai: admin user dibuat (tanpa produk contoh).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
