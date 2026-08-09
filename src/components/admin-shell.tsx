"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Settings,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { BottomNav } from "@/components/bottom-nav";
import { logoutAction } from "@/server/actions/auth";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/earnings", label: "Earnings", icon: Wallet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  title,
  subtitle,
  backHref,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background-base">
      {/* Sidebar — desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-dvh w-64 flex-col border-r border-border-subtle bg-surface-container lg:flex">
        <div className="px-5 pb-6 pt-6">
          <Logo />
        </div>

        <Link
          href="/admin/products/new"
          className="mx-3 mb-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-container text-[15px] font-[600] text-white transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Tambah Produk
        </Link>

        <nav aria-label="Navigasi admin" className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-[600] transition-colors",
                  active
                    ? "bg-primary-container-dark text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "fill-primary/15")} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-border-subtle p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-[600] text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="lg:pl-64">
        {/* Header mobile */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border-subtle bg-background-base/90 px-4 backdrop-blur-md lg:hidden">
          <div className="flex min-w-0 items-center">
            {backHref && (
              <Link
                href={backHref}
                aria-label="Kembali"
                className="-ml-2 mr-2 flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-opacity hover:opacity-80"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            <h1 className="truncate text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
              {title}
            </h1>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>

        {/* Header desktop */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border-subtle bg-background-base/90 px-8 backdrop-blur-md lg:flex">
          <div>
            <h1 className="text-[24px] font-[700] leading-8 tracking-[-0.02em] text-text-primary">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[14px] leading-5 text-text-secondary">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </header>

        <main
          id="main-content"
          className="px-4 pb-28 pt-20 lg:px-8 lg:pb-16 lg:pt-8"
        >
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
