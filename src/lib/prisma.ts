import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Simpan instance secara global di semua lingkungan (termasuk Production serverless)
// untuk mencegah penumpukan koneksi baru (Connection Pool Exhaustion) pada re-invokasi fungsi serverless
globalForPrisma.prisma = prisma;
