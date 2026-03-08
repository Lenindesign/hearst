"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const linkVariants = cva(
  "inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        primary: "text-primary hover:text-primary/80",
        neutral: "text-foreground hover:text-foreground/70",
      },
      underline: {
        true: "underline underline-offset-2",
        false: "no-underline hover:underline hover:underline-offset-2",
      },
      size: {
        inherit: "",
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      underline: true,
      size: "inherit",
    },
  }
);

interface LinkComponentProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
}

const LinkComponent = React.forwardRef<HTMLAnchorElement, LinkComponentProps>(
  (
    { className, variant, underline, size, external, children, ...props },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={cn(linkVariants({ variant, underline, size, className }))}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      >
        {children}
        {external && <ExternalLink className="size-[0.85em] shrink-0" />}
      </a>
    );
  }
);
LinkComponent.displayName = "LinkComponent";

export { LinkComponent, linkVariants };
