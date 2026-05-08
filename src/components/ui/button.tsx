"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-white shadow-sm shadow-black/5 hover:bg-[var(--accent-hover)]",
        destructive:
          "bg-red-600 text-white shadow-sm shadow-black/5 hover:bg-red-500",
        outline:
          "border border-[var(--line-strong)] bg-[var(--background)] shadow-sm shadow-black/5 hover:bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] hover:text-[var(--foreground)]",
        secondary:
          "bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] text-[var(--foreground)] shadow-sm shadow-black/5 hover:bg-[color-mix(in_oklab,var(--background)_82%,white_18%)]",
        ghost:
          "hover:bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] hover:text-[var(--foreground)]",
        link: "text-[var(--accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(Comp === "button" ? { type: type ?? "button" } : {})}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

