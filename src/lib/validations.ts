import { z } from "zod";

export const platformSchema = z.enum(["TIKTOK_SHOP", "SHOPEE"]);

export const productSchema = z.object({
  label: z.string().trim().min(2, "Label minimal 2 karakter").max(60, "Label maksimal 60 karakter"),
  internalNote: z.string().trim().max(300).optional().nullable(),
  category: z.string().min(1, "Pilih kategori"),
  iconKey: z.string().min(1, "Pilih icon"),
  platform: platformSchema,
  affiliateUrl: z
    .string()
    .trim()
    .min(1, "Link affiliate wajib diisi")
    .url("Link affiliate harus berupa URL yang valid"),
  income: z.coerce.number().int().min(0).max(1_000_000_000).nullable().optional(),
  isMall: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;

export const earningSchema = z
  .object({
    productId: z.string().optional().nullable(),
    platform: platformSchema,
    amount: z.coerce.number().int().min(1, "Nominal minimal 1").max(1_000_000_000, "Nominal terlalu besar"),
    periodDate: z.string().min(1, "Tanggal wajib diisi"),
    note: z.string().trim().max(300).optional().nullable(),
  })
  .refine((d) => !Number.isNaN(new Date(d.periodDate).getTime()), {
    message: "Tanggal tidak valid",
    path: ["periodDate"],
  });

export type EarningSchema = z.infer<typeof earningSchema>;

export const totpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Kode harus 6 digit")
    .regex(/^\d{6}$/, "Kode hanya angka"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
