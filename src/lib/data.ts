import "server-only";

import type { PlatformKey } from "./icons";
import { prisma } from "./prisma";
import { encryptSecret } from "./encryption";

/* =========================================================================
 * Types
 * ======================================================================== */

export type Product = {
  id: string;
  label: string;
  internalNote: string | null;
  category: string;
  iconKey: string;
  platform: PlatformKey;
  affiliateUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  isActive: boolean;
  sortOrder: number;
  clickCount: number;
  earningsTotal: number;
  createdAt: string;
  updatedAt: string;
};

export type Earning = {
  id: string;
  productId: string | null;
  productLabel: string | null;
  platform: PlatformKey;
  amount: number;
  periodDate: string;
  note: string | null;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  totpSecret: string | null;
  totpEnabled: boolean;
  lastLoginAt: string | null;
};

export type AuditEntry = {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type Profile = {
  handle: string;
  displayName: string;
  bio: string;
  avatar: string | null;
  link: string;
};

const isDb = () => Boolean(process.env.DATABASE_URL);

function toIso(d: Date | string): string {
  return typeof d === "string" ? d : d.toISOString();
}

/* =========================================================================
 * Mock store (dipakai saat DATABASE_URL belum di-set)
 * ======================================================================== */

const daysAgo = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 30, 0, 0);
  return d;
};

type MockClick = { productId: string; createdAt: Date };

type MockProduct = {
  id: string;
  label: string;
  internalNote: string | null;
  category: string;
  iconKey: string;
  platform: PlatformKey;
  affiliateUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const mockProducts: MockProduct[] = [
  {
    id: "p-skincare",
    label: "Skincare Wajah Pilihan",
    internalNote: "Skincare Set Glowing — TikTok Shop",
    category: "skincare",
    iconKey: "sparkles",
    platform: "TIKTOK_SHOP" as PlatformKey,
    affiliateUrl: "https://vt.tokopedia.com/etalase-skincare",
    priceMin: 45000,
    priceMax: 120000,
    isActive: true,
    sortOrder: 0,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(1),
  },
  {
    id: "p-gadget",
    label: "Gadget Setup Murah",
    internalNote: "Minimalist Desk Lamp",
    category: "gadget",
    iconKey: "smartphone",
    platform: "SHOPEE" as PlatformKey,
    affiliateUrl: "https://shopee.co.id/etalase-gadget",
    priceMin: 99000,
    priceMax: 350000,
    isActive: true,
    sortOrder: 1,
    createdAt: daysAgo(28),
    updatedAt: daysAgo(2),
  },
  {
    id: "p-fashion",
    label: "OOTD Fashion Pria",
    internalNote: "Oversized T-Shirt Black",
    category: "fashion",
    iconKey: "shirt",
    platform: "TIKTOK_SHOP" as PlatformKey,
    affiliateUrl: "https://vt.tokopedia.com/etalase-fashion",
    priceMin: 75000,
    priceMax: 180000,
    isActive: true,
    sortOrder: 2,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(3),
  },
  {
    id: "p-rumah",
    label: "Keperluan Kos",
    internalNote: "Perabotan kosan estetik",
    category: "rumah-tangga",
    iconKey: "home",
    platform: "SHOPEE" as PlatformKey,
    affiliateUrl: "https://shopee.co.id/etalase-rumah",
    priceMin: 15000,
    priceMax: 60000,
    isActive: true,
    sortOrder: 3,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(1),
  },
  {
    id: "p-lipstick",
    label: "Lip Tint Viral (Bundle 3)",
    internalNote: "Lip tint tahan lama",
    category: "skincare",
    iconKey: "favorite",
    platform: "TIKTOK_SHOP" as PlatformKey,
    affiliateUrl: "https://vt.tokopedia.com/etalase-lip",
    priceMin: 89000,
    priceMax: 89000,
    isActive: false,
    sortOrder: 4,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(0),
  },
  {
    id: "p-earbuds",
    label: "Wireless Earbuds Pro",
    internalNote: "Earbuds TWS",
    category: "gadget",
    iconKey: "headphones",
    platform: "TIKTOK_SHOP" as PlatformKey,
    affiliateUrl: "https://vt.tokopedia.com/etalase-earbuds",
    priceMin: 199000,
    priceMax: 199000,
    isActive: true,
    sortOrder: 5,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(0),
  },
];

// Seed klik deterministik: 7 hari, pola naik.
const clickPattern = [120, 190, 150, 220, 180, 280, 310];
const mockClicks: MockClick[] = mockProducts.flatMap((p) =>
  clickPattern.map((count, i) => {
    const day = daysAgo(6 - i);
    return Array.from({ length: count }, () => ({
      productId: p.id,
      createdAt: new Date(day.getTime() + (i * 3 + (p.id.length % 5)) * 3600_000),
    }));
  }).flat()
);

const mockEarnings: {
  id: string;
  productId: string | null;
  platform: PlatformKey;
  amount: number;
  periodDate: Date;
  note: string | null;
}[] = [
  { id: "e1", productId: "p-skincare", platform: "TIKTOK_SHOP", amount: 25000, periodDate: daysAgo(1), note: "Komisi TikTok Shop" },
  { id: "e2", productId: null, platform: "SHOPEE", amount: 12500, periodDate: daysAgo(2), note: "Shopee Affiliate Comm" },
  { id: "e3", productId: "p-lipstick", platform: "TIKTOK_SHOP", amount: 45000, periodDate: daysAgo(4), note: "Bundle viral" },
  { id: "e4", productId: "p-gadget", platform: "SHOPEE", amount: 82000, periodDate: daysAgo(6), note: "Desk lamp best seller" },
  { id: "e5", productId: "p-skincare", platform: "TIKTOK_SHOP", amount: 18500, periodDate: daysAgo(9), note: "" },
  { id: "e6", productId: "p-fashion", platform: "TIKTOK_SHOP", amount: 30500, periodDate: daysAgo(12), note: "" },
  { id: "e7", productId: null, platform: "SHOPEE", amount: 22000, periodDate: daysAgo(15), note: "Cashback shopee" },
];

const mockAudit: AuditEntry[] = [];

const mockAdmin = (): AdminUser => ({
  id: "admin-mock",
  email: process.env.ADMIN_EMAIL ?? "muhamadaibayu@gmail.com",
  passwordHash: "$2a$12$mockhash",
  totpSecret: null,
  totpEnabled: false,
  lastLoginAt: null,
});

/* =========================================================================
 * Profile (static di MVP, sesuai PRD Fase 3)
 * ======================================================================== */

export function getProfile(): Profile {
  return {
    handle: process.env.ADMIN_HANDLE ?? "@namatiktokkamu",
    displayName: process.env.ADMIN_DISPLAY_NAME ?? "Etalase Affiliate",
    bio: "Curating the best finds for your daily life.",
    avatar: null,
    link: "https://vt.tokopedia.com",
  };
}

/* =========================================================================
 * Products
 * ======================================================================== */

type ProductRowInput = {
  id: string;
  label: string;
  internalNote: string | null;
  category: string;
  iconKey: string;
  platform: PlatformKey;
  affiliateUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  clicks: number;
  earnings: number;
};

function toProduct(p: ProductRowInput): Product {
  return {
    id: p.id,
    label: p.label,
    internalNote: p.internalNote,
    category: p.category,
    iconKey: p.iconKey,
    platform: p.platform,
    affiliateUrl: p.affiliateUrl,
    priceMin: p.priceMin,
    priceMax: p.priceMax,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    clickCount: p.clicks,
    earningsTotal: p.earnings,
  };
}

export async function getPublicProducts(): Promise<Product[]> {
  if (isDb()) {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true, label: true, internalNote: true, category: true, iconKey: true,
        platform: true, affiliateUrl: true, priceMin: true, priceMax: true,
        isActive: true, sortOrder: true, createdAt: true, updatedAt: true,
        _count: { select: { clicks: true } },
        earnings: { select: { amount: true } },
      },
    });
    return rows.map((r) =>
      toProduct({
        id: r.id, label: r.label, internalNote: r.internalNote, category: r.category,
        iconKey: r.iconKey, platform: r.platform as PlatformKey, affiliateUrl: r.affiliateUrl,
        priceMin: r.priceMin, priceMax: r.priceMax, isActive: r.isActive, sortOrder: r.sortOrder,
        createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt),
        clicks: r._count.clicks,
        earnings: r.earnings.reduce((s, e) => s + e.amount, 0),
      })
    );
  }

  return mockProducts
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) =>
      toProduct({
        ...p,
        createdAt: toIso(p.createdAt),
        updatedAt: toIso(p.updatedAt),
        clicks: mockClicks.filter((c) => c.productId === p.id).length,
        earnings: mockEarnings.filter((e) => e.productId === p.id).reduce((s, e) => s + e.amount, 0),
      })
    );
}

export async function getAllProducts(): Promise<Product[]> {
  if (isDb()) {
    const rows = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true, label: true, internalNote: true, category: true, iconKey: true,
        platform: true, affiliateUrl: true, priceMin: true, priceMax: true,
        isActive: true, sortOrder: true, createdAt: true, updatedAt: true,
        _count: { select: { clicks: true } },
        earnings: { select: { amount: true } },
      },
    });
    return rows.map((r) =>
      toProduct({
        id: r.id, label: r.label, internalNote: r.internalNote, category: r.category,
        iconKey: r.iconKey, platform: r.platform as PlatformKey, affiliateUrl: r.affiliateUrl,
        priceMin: r.priceMin, priceMax: r.priceMax, isActive: r.isActive, sortOrder: r.sortOrder,
        createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt),
        clicks: r._count.clicks,
        earnings: r.earnings.reduce((s, e) => s + e.amount, 0),
      })
    );
  }

  return [...mockProducts]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) =>
      toProduct({
        ...p,
        createdAt: toIso(p.createdAt),
        updatedAt: toIso(p.updatedAt),
        clicks: mockClicks.filter((c) => c.productId === p.id).length,
        earnings: mockEarnings.filter((e) => e.productId === p.id).reduce((s, e) => s + e.amount, 0),
      })
    );
}

export async function getProduct(id: string): Promise<Product | null> {
  if (isDb()) {
    const r = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true, label: true, internalNote: true, category: true, iconKey: true,
        platform: true, affiliateUrl: true, priceMin: true, priceMax: true,
        isActive: true, sortOrder: true, createdAt: true, updatedAt: true,
        _count: { select: { clicks: true } },
        earnings: { select: { amount: true } },
      },
    });
    if (!r) return null;
    return toProduct({
      id: r.id, label: r.label, internalNote: r.internalNote, category: r.category,
      iconKey: r.iconKey, platform: r.platform as PlatformKey, affiliateUrl: r.affiliateUrl,
      priceMin: r.priceMin, priceMax: r.priceMax, isActive: r.isActive, sortOrder: r.sortOrder,
      createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt),
      clicks: r._count.clicks,
      earnings: r.earnings.reduce((s, e) => s + e.amount, 0),
    });
  }

  const p = mockProducts.find((x) => x.id === id);
  if (!p) return null;
  return toProduct({
    ...p,
    createdAt: toIso(p.createdAt),
    updatedAt: toIso(p.updatedAt),
    clicks: mockClicks.filter((c) => c.productId === p.id).length,
    earnings: mockEarnings.filter((e) => e.productId === p.id).reduce((s, e) => s + e.amount, 0),
  });
}

export type ProductInput = {
  label: string;
  internalNote?: string | null;
  category: string;
  iconKey: string;
  platform: PlatformKey;
  affiliateUrl: string;
  priceMin?: number | null;
  priceMax?: number | null;
  isActive?: boolean;
  sortOrder?: number;
};

export async function createProduct(input: ProductInput): Promise<Product> {
  if (isDb()) {
    const r = await prisma.product.create({ data: input });
    return (await getProduct(r.id))!;
  }

  const id = `p-${Date.now().toString(36)}`;
  const now = new Date();
  const maxOrder =
    mockProducts.reduce((m, p) => Math.max(m, p.sortOrder), -1);
  const p = {
    id,
    label: input.label,
    internalNote: input.internalNote ?? null,
    category: input.category,
    iconKey: input.iconKey,
    platform: input.platform,
    affiliateUrl: input.affiliateUrl,
    priceMin: input.priceMin ?? null,
    priceMax: input.priceMax ?? null,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  mockProducts.push(p);
  return toProduct({ ...p, createdAt: toIso(p.createdAt), updatedAt: toIso(p.updatedAt), clicks: 0, earnings: 0 });
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  if (isDb()) {
    await prisma.product.update({ where: { id }, data: input });
    return getProduct(id);
  }

  const p = mockProducts.find((x) => x.id === id);
  if (!p) return null;
  Object.assign(p, { ...input, updatedAt: new Date() });
  return getProduct(id);
}

export async function setProductActive(id: string, isActive: boolean): Promise<Product | null> {
  if (isDb()) {
    await prisma.product.update({ where: { id }, data: { isActive } });
    return getProduct(id);
  }
  const p = mockProducts.find((x) => x.id === id);
  if (!p) return null;
  p.isActive = isActive;
  p.updatedAt = new Date();
  return getProduct(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isDb()) {
    try {
      await prisma.product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
  const i = mockProducts.findIndex((x) => x.id === id);
  if (i === -1) return false;
  mockProducts.splice(i, 1);
  return true;
}

/* =========================================================================
 * Click tracking
 * ======================================================================== */

export async function recordClick(productId: string): Promise<boolean> {
  if (isDb()) {
    try {
      await prisma.clickLog.create({ data: { productId } });
      return true;
    } catch {
      return false;
    }
  }
  mockClicks.push({ productId, createdAt: new Date() });
  return true;
}

export type DailyClick = { label: string; clicks: number };

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export async function getClickTrend(days = 7): Promise<DailyClick[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));

  // Ambil klik sebaris dari DB atau mock, lalu agregasi per hari di JS.
  let rows: { createdAt: Date }[];
  if (isDb()) {
    rows = await prisma.clickLog.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    });
  } else {
    rows = mockClicks.filter((c) => c.createdAt >= start);
  }

  const out: DailyClick[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = rows.filter((c) => c.createdAt >= d && c.createdAt < next).length;
    out.push({ label: DAY_NAMES[d.getDay()], clicks: count });
  }
  return out;
}

export async function getTotalClicks(): Promise<number> {
  if (isDb()) return prisma.clickLog.count();
  return mockClicks.length;
}

export type TrendDelta = { current: number; previous: number; deltaPct: number | null };

/** Bandingkan total klik N hari terakhir vs N hari sebelumnya. */
export async function getClickDelta(days = 7): Promise<TrendDelta> {
  const current = await getClickTrend(days);
  const prevStart = new Date();
  prevStart.setHours(0, 0, 0, 0);
  prevStart.setDate(prevStart.getDate() - (days * 2 - 1));
  const prevEnd = new Date(prevStart);
  prevEnd.setDate(prevStart.getDate() + days);

  let prevCount: number;
  if (isDb()) {
    prevCount = await prisma.clickLog.count({
      where: { createdAt: { gte: prevStart, lt: prevEnd } },
    });
  } else {
    prevCount = mockClicks.filter((c) => c.createdAt >= prevStart && c.createdAt < prevEnd).length;
  }

  const currentCount = current.reduce((s, d) => s + d.clicks, 0);
  const deltaPct =
    prevCount === 0 ? (currentCount > 0 ? 100 : null) : ((currentCount - prevCount) / prevCount) * 100;
  return { current: currentCount, previous: prevCount, deltaPct };
}

/* =========================================================================
 * Earnings
 * ======================================================================== */

export type EarningInput = {
  productId?: string | null;
  platform: PlatformKey;
  amount: number;
  periodDate: string;
  note?: string | null;
};

export async function listEarnings(): Promise<Earning[]> {
  if (isDb()) {
    const rows = await prisma.earningEntry.findMany({
      orderBy: { periodDate: "desc" },
      include: { product: { select: { id: true, label: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      productLabel: r.product?.label ?? null,
      platform: r.platform as PlatformKey,
      amount: r.amount,
      periodDate: toIso(r.periodDate),
      note: r.note,
      createdAt: toIso(r.createdAt),
    }));
  }

  return [...mockEarnings]
    .sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime())
    .map((e) => {
      const product = mockProducts.find((p) => p.id === e.productId);
      return {
        id: e.id,
        productId: e.productId,
        productLabel: product?.label ?? null,
        platform: e.platform,
        amount: e.amount,
        periodDate: toIso(e.periodDate),
        note: e.note,
        createdAt: toIso(e.periodDate),
      };
    });
}

export async function addEarning(input: EarningInput): Promise<Earning> {
  if (isDb()) {
    const r = await prisma.earningEntry.create({
      data: {
        productId: input.productId ?? null,
        platform: input.platform,
        amount: input.amount,
        periodDate: new Date(input.periodDate),
        note: input.note ?? null,
      },
      include: { product: { select: { id: true, label: true } } },
    });
    return {
      id: r.id,
      productId: r.productId,
      productLabel: r.product?.label ?? null,
      platform: r.platform as PlatformKey,
      amount: r.amount,
      periodDate: toIso(r.periodDate),
      note: r.note,
      createdAt: toIso(r.createdAt),
    };
  }

  const entry = {
    id: `e-${Date.now().toString(36)}`,
    productId: input.productId ?? null,
    platform: input.platform,
    amount: input.amount,
    periodDate: new Date(input.periodDate),
    note: input.note ?? null,
  };
  mockEarnings.push(entry);
  const product = mockProducts.find((p) => p.id === entry.productId);
  return {
    id: entry.id,
    productId: entry.productId,
    productLabel: product?.label ?? null,
    platform: entry.platform,
    amount: entry.amount,
    periodDate: toIso(entry.periodDate),
    note: entry.note,
    createdAt: toIso(entry.periodDate),
  };
}

export async function deleteEarning(id: string): Promise<boolean> {
  if (isDb()) {
    try {
      await prisma.earningEntry.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
  const i = mockEarnings.findIndex((e) => e.id === id);
  if (i === -1) return false;
  mockEarnings.splice(i, 1);
  return true;
}

export type EarningsByPlatform = { platform: PlatformKey; total: number };

export async function getEarningsStats(): Promise<EarningsByPlatform[]> {
  const earnings = await listEarnings();
  const map = new Map<PlatformKey, number>();
  for (const e of earnings) {
    map.set(e.platform, (map.get(e.platform) ?? 0) + e.amount);
  }
  return Array.from(map.entries()).map(([platform, total]) => ({ platform, total }));
}

export async function getEarningsMonth(): Promise<number> {
  const earnings = await listEarnings();
  const now = new Date();
  return earnings
    .filter((e) => {
      const d = new Date(e.periodDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + e.amount, 0);
}

export type EarningsDelta = { current: number; previous: number; deltaPct: number | null };

export async function getEarningsDelta(): Promise<EarningsDelta> {
  const earnings = await listEarnings();
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  let current = 0;
  let previous = 0;
  for (const e of earnings) {
    const d = new Date(e.periodDate);
    if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) current += e.amount;
    else if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) previous += e.amount;
  }
  const deltaPct =
    previous === 0 ? (current > 0 ? 100 : null) : ((current - previous) / previous) * 100;
  return { current, previous, deltaPct };
}

/* =========================================================================
 * Admin & audit
 * ======================================================================== */

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  if (isDb()) {
    const r = await prisma.adminUser.findUnique({ where: { email } });
    if (!r) return null;
    return {
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      totpSecret: r.totpSecret,
      totpEnabled: r.totpEnabled,
      lastLoginAt: r.lastLoginAt ? toIso(r.lastLoginAt) : null,
    };
  }
  const admin = mockAdmin();
  return admin.email === email ? admin : null;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  if (isDb()) {
    const r = await prisma.adminUser.findUnique({ where: { id } });
    if (!r) return null;
    return {
      id: r.id, email: r.email, passwordHash: r.passwordHash,
      totpSecret: r.totpSecret, totpEnabled: r.totpEnabled,
      lastLoginAt: r.lastLoginAt ? toIso(r.lastLoginAt) : null,
    };
  }
  const admin = mockAdmin();
  return admin.id === id ? admin : null;
}

export async function saveTotpSecret(adminId: string, secret: string, totpEnabled: boolean): Promise<void> {
  const encrypted = encryptSecret(secret);
  if (isDb()) {
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { totpSecret: encrypted, totpEnabled },
    });
    return;
  }
  const admin = mockAdmin();
  if (admin.id === adminId) {
    admin.totpSecret = encrypted;
    admin.totpEnabled = totpEnabled;
  }
}

export async function markLogin(adminId: string): Promise<void> {
  if (isDb()) {
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { lastLoginAt: new Date() },
    });
    return;
  }
  const admin = mockAdmin();
  if (admin.id === adminId) admin.lastLoginAt = new Date().toISOString();
}

export async function writeAudit(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string | null = null,
  metadata: Record<string, unknown> | null = null
): Promise<void> {
  if (isDb()) {
    await prisma.auditLog.create({
      data: { adminId, action, targetType, targetId, metadata: metadata as object | undefined },
    });
    return;
  }
  mockAudit.push({
    id: `a-${Date.now().toString(36)}`,
    adminId,
    action,
    targetType,
    targetId,
    metadata,
    createdAt: new Date().toISOString(),
  });
}

export async function listAuditLogs(limit = 50): Promise<AuditEntry[]> {
  if (isDb()) {
    const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: limit });
    return rows.map((r) => ({
      id: r.id, adminId: r.adminId, action: r.action, targetType: r.targetType,
      targetId: r.targetId, metadata: r.metadata as Record<string, unknown> | null,
      createdAt: toIso(r.createdAt),
    }));
  }
  return [...mockAudit].reverse().slice(0, limit);
}

