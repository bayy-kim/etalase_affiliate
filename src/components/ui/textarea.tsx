import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full resize-none rounded-xl border border-border-subtle bg-surface-card px-4 py-3 text-[14px] text-text-primary transition-colors placeholder:text-text-secondary focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
