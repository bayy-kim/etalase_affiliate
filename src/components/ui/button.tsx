import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-[600] text-[15px] leading-5 transition-all select-none disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-container text-white hover:bg-primary-hover active:scale-[0.98]",
        outline:
          "border border-border-subtle bg-transparent text-text-primary hover:bg-surface-variant",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-variant",
        danger: "bg-error-container text-on-error-container hover:opacity-90",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-10 px-3 text-[14px]",
        icon: "h-12 w-12",
        iconSm: "h-11 w-11",
      },
      radius: {
        md: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      radius: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, radius }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
