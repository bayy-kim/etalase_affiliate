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
  Package,
  type LucideIcon,
} from "lucide-react";

export const categoryOptions = [
  { value: "skincare", label: "Skincare" },
  { value: "gadget", label: "Gadget" },
  { value: "fashion", label: "Fashion" },
  { value: "rumah-tangga", label: "Rumah Tangga" },
] as const;

export const categorySelectOptions = [
  { value: "skincare", label: "Beauty & Personal Care" },
  { value: "gadget", label: "Elektronik & Gadget" },
  { value: "fashion", label: "Fashion & Aksesoris" },
  { value: "rumah-tangga", label: "Home & Living" },
] as const;

export const iconPicker = [
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
  { value: "star", label: "Star", icon: Star },
  { value: "favorite", label: "Favorite", icon: Heart },
  { value: "shopping_bag", label: "Belanja", icon: ShoppingBag },
  { value: "storefront", label: "Etalase", icon: Store },
  { value: "local_fire_department", label: "Viral", icon: Flame },
  { value: "face_retouching_natural", label: "Glow", icon: SmilePlus },
  { value: "checkroom", label: "Fashion", icon: Shirt },
  { value: "headphones", label: "Audio", icon: Headphones },
  { value: "home", label: "Rumah", icon: Home },
  { value: "smartphone", label: "Gadget", icon: Smartphone },
  { value: "sell", label: "Promo", icon: Tag },
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
  gaming: Gamepad2,
  wallet: Wallet,
  watch: Watch,
  lamp: Lamp,
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
