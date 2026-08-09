import * as React from "react";

import { cn } from "@/lib/utils";

type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, "aria-label": ariaLabel, ...props }, ref) => {
    const [internal, setInternal] = React.useState(checked);
    const isChecked = onCheckedChange ? checked : internal;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel}
        onClick={() => {
          const next = !isChecked;
          if (onCheckedChange) onCheckedChange(next);
          else setInternal(next);
        }}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container",
          isChecked ? "border-primary-container bg-primary-container" : "border-border-subtle bg-surface-card",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full border transition-transform",
            isChecked
              ? "translate-x-[22px] border-white bg-white"
              : "translate-x-[2px] border-border-subtle bg-text-primary"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
