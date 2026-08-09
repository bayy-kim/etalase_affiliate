import {
  Sparkles,
  Star,
  Heart,
  ShoppingBag,
  Store,
  Flame,
  SmilePlus,
  Shirt,
  Headphones,
  Home,
  Tag,
  Smartphone,
  Gamepad2,
  Wallet,
  Watch,
  Lamp,
  Coffee,
  BookOpen,
  Camera,
  Footprints,
  PawPrint,
  Music,
  Flower2,
  Gift,
  Package,
  type LucideIcon,
} from "lucide-react";

export const categoryOptions = [
  { value: "skincare", label: "Skincare" },
  { value: "fashion", label: "Fashion" },
  { value: "gadget", label: "Gadget" },
  { value: "rumah-tangga", label: "Rumah Tangga" },
  { value: "makanan-minuman", label: "Makanan" },
  { value: "kecantikan", label: "Kecantikan" },
  { value: "hobi", label: "Hobi" },
  { value: "aksesoris", label: "Aksesoris" },
] as const;

export const categorySelectOptions = [
  { value: "skincare", label: "Skincare & Perawatan Wajah" },
  { value: "fashion", label: "Fashion & Pakaian" },
  { value: "gadget", label: "Elektronik & Gadget" },
  { value: "rumah-tangga", label: "Rumah & Keperluan Harian" },
  { value: "makanan-minuman", label: "Makanan & Minuman" },
  { value: "kecantikan", label: "Kecantikan & Kosmetik" },
  { value: "hobi", label: "Hobi & Koleksi" },
  { value: "aksesoris", label: "Aksesoris" },
] as const;

export const iconPicker = [
  { value: "sparkles", label: "Kilau", icon: Sparkles },
  { value: "star", label: "Bintang", icon: Star },
  { value: "favorite", label: "Favorit", icon: Heart },
  { value: "shopping_bag", label: "Belanja", icon: ShoppingBag },
  { value: "storefront", label: "Etalase", icon: Store },
  { value: "local_fire_department", label: "Viral", icon: Flame },
  { value: "face_retouching_natural", label: "Glow", icon: SmilePlus },
  { value: "checkroom", label: "Baju", icon: Shirt },
  { value: "headphones", label: "Audio", icon: Headphones },
  { value: "home", label: "Rumah", icon: Home },
  { value: "smartphone", label: "Gadget", icon: Smartphone },
  { value: "sell", label: "Promo", icon: Tag },
  { value: "gamepad", label: "Gaming", icon: Gamepad2 },
  { value: "watch", label: "Jam Tangan", icon: Watch },
  { value: "wallet", label: "Dompet", icon: Wallet },
  { value: "lamp", label: "Lampu", icon: Lamp },
  { value: "coffee", label: "Kopi", icon: Coffee },
  { value: "book", label: "Buku", icon: BookOpen },
  { value: "camera", label: "Kamera", icon: Camera },
  { value: "shoe", label: "Sepatu", icon: Footprints },
  { value: "pet", label: "Hewan", icon: PawPrint },
  { value: "music", label: "Musik", icon: Music },
  { value: "flower", label: "Bunga", icon: Flower2 },
  { value: "gift", label: "Hadiah", icon: Gift },
] as const;

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  star: Star,
  favorite: Heart,
  shopping_bag: ShoppingBag,
  storefront: Store,
  local_fire_department: Flame,
  face_retouching_natural: SmilePlus,
  checkroom: Shirt,
  headphones: Headphones,
  home: Home,
  sell: Tag,
  smartphone: Smartphone,
  gadget: Smartphone,
  skincare: Sparkles,
  fashion: Shirt,
  "rumah-tangga": Home,
  "makanan-minuman": Coffee,
  kecantikan: Flower2,
  hobi: Gamepad2,
  aksesoris: Watch,
  gamepad: Gamepad2,
  watch: Watch,
  wallet: Wallet,
  lamp: Lamp,
  coffee: Coffee,
  book: BookOpen,
  camera: Camera,
  shoe: Footprints,
  pet: PawPrint,
  music: Music,
  flower: Flower2,
  gift: Gift,
};

export function getCategoryIcon(category: string): LucideIcon {
  return iconMap[category] ?? Package;
}

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Package;
}

export type PlatformKey = "TIKTOK_SHOP" | "SHOPEE";

export const platformLabel: Record<PlatformKey, string> = {
  TIKTOK_SHOP: "TikTok Shop",
  SHOPEE: "Shopee",
};

export const platformUppercase: Record<PlatformKey, string> = {
  TIKTOK_SHOP: "TIKTOK SHOP",
  SHOPEE: "SHOPEE",
};
