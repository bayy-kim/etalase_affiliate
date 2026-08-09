import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold text-[15px] leading-5 transition-all select-none disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/35",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900",
        ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
        danger: "bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-10 px-4 text-[14px]",
        icon: "h-12 w-12",
        iconSm: "h-10 w-10",
      },
      radius: {
        md: "rounded-2xl",
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
