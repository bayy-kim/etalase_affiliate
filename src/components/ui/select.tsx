import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-[48px] w-full appearance-none rounded-xl border border-border-subtle bg-surface-card px-4 text-[15px] text-text-primary transition-colors focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60 [&>option]:bg-surface-card",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { Select };
