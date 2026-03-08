"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground hover:bg-muted",
        selected:
          "border-foreground bg-foreground text-background hover:bg-foreground/90",
      },
      size: {
        md: "h-6 px-2 text-xs",
        lg: "h-8 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
);

interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  onDismiss?: () => void;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, children, onDismiss, ...props }, ref) => {
    if (onDismiss) {
      return (
        <span
          className={cn(
            chipVariants({ variant: "default", size }),
            "pr-1",
            className
          )}
        >
          <span className="leading-none">{children}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/15 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Remove"
          >
            <X className="size-3" />
          </button>
        </span>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(chipVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
