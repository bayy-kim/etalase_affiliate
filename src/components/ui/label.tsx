import * as React from "react";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
