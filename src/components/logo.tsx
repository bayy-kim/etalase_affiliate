import { ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-primary-container text-white",
        className
      )}
      aria-hidden="true"
    >
      <ShoppingBag className="h-[52%] w-[52%]" strokeWidth={2.2} />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-11 w-11" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-[700] tracking-tight text-text-primary">ETALASE</span>
        <span className="text-[10px] font-[600] uppercase tracking-[0.18em] text-accent-green">
          Affiliate
        </span>
      </span>
    </span>
  );
}
