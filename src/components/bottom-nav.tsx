"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Package, Settings, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/earnings", label: "Earnings", icon: Wallet },
  { href: "/admin/guide", label: "Panduan", icon: BookOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi admin"
      className="fixed bottom-4 left-4 right-4 z-40 flex h-16 max-w-[480px] mx-auto items-center justify-around rounded-full border border-slate-200/80 bg-white/90 px-3 shadow-clay backdrop-blur-lg lg:hidden"
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
              "flex h-12 w-16 flex-col items-center justify-center gap-0.5 rounded-full transition-all active:scale-95",
              active
                ? "bg-indigo-50 text-indigo-600 font-bold shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "text-indigo-600")} aria-hidden="true" />
            <span className="text-[11px] font-semibold leading-3">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
