"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dividerVariants = cva("shrink-0 w-full", {
  variants: {
    size: {
      sm: "h-px",
      md: "h-0.5",
      lg: "h-1",
    },
    variant: {
      subtle: "bg-border",
      default: "bg-foreground",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "subtle",
  },
});

interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ size, variant, className }))}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";

export { Divider, dividerVariants };
