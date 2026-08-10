"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Settings,
  Sparkles,
  Store,
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
  { href: "/admin/aichat-gemini", label: "AI Content Studio", icon: Sparkles },
  { href: "/admin/guide", label: "Panduan Admin", icon: BookOpen },
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
    <div className="min-h-dvh bg-[#f0f2f7] text-slate-800">
      {/* Sidebar — desktop Taskly style */}
      <aside className="fixed left-4 top-4 bottom-4 z-40 hidden w-64 flex-col overflow-y-auto no-scrollbar rounded-3xl border border-slate-200/80 bg-white p-4 shadow-clay-card lg:flex">
        <div className="px-3 pb-6 pt-2">
          <Logo />
        </div>

        <Link
          href="/admin/products/new"
          className="mx-1 mb-6 flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Tambah Produk
        </Link>

        <nav aria-label="Navigasi admin" className="flex-1 space-y-1.5 px-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[14px] font-semibold transition-all",
                  active
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-indigo-600" : "text-slate-400")} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade/Info Box Taskly style */}
        <div className="mx-1 mb-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-[13px]">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Etalase Affiliate
          </div>
          <p className="mt-1 text-[12px] text-amber-700/80 leading-snug">
            Kelola tautan komisi dengan tampilan modern & kencang.
          </p>
        </div>

        <div className="space-y-1 border-t border-slate-100 pt-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Store className="h-5 w-5 text-slate-400" aria-hidden="true" />
            Link-in-Bio
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-2.5 text-[14px] font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-rose-600" aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="lg:pl-72">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-[#f0f2f7]/90 px-4 backdrop-blur-md lg:hidden">
          <div className="flex min-w-0 items-center">
            {backHref && (
              <Link
                href={backHref}
                aria-label="Kembali"
                className="-ml-2 mr-2 flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-white"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            <h1 className="truncate text-[18px] font-bold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>

        {/* Header desktop */}
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between px-8 backdrop-blur-md lg:flex">
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[14px] text-slate-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </header>

        <main
          id="main-content"
          className="px-4 pb-28 pt-4 lg:px-8 lg:pb-12 lg:pt-2"
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
