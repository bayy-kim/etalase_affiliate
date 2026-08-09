import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-[48px] w-full rounded-xl border border-border-subtle bg-surface-card px-4 text-[15px] text-text-primary transition-colors placeholder:text-text-secondary focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
