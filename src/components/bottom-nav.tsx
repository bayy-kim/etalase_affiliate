"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/earnings", label: "Earnings", icon: Wallet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi admin"
      className="fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-border-subtle bg-surface-container px-4 pb-[max(env(safe-area-inset-bottom),0px)] lg:hidden"
    >
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-full w-16 flex-col items-center justify-center gap-1 rounded-lg transition-transform hover:bg-surface-bright active:scale-90",
              active ? "font-bold text-primary" : "text-on-surface-variant"
            )}
          >
            <Icon className={cn("h-6 w-6", active && "fill-primary/20")} aria-hidden="true" />
            <span className="text-[12px] font-[600] leading-4">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
