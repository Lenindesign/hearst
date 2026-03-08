"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const aspectImageVariants = cva("relative overflow-hidden bg-muted", {
  variants: {
    ratio: {
      "1:1": "aspect-square",
      "4:3": "aspect-[4/3]",
      "3:2": "aspect-[3/2]",
      "16:9": "aspect-video",
      "2:1": "aspect-[2/1]",
      "4:5": "aspect-[4/5]",
      "3:4": "aspect-[3/4]",
      "4:6": "aspect-[4/6]",
      "9:16": "aspect-[9/16]",
    },
    inset: {
      none: "p-0",
      "2xs": "p-1",
      xs: "p-2",
      sm: "p-3",
      md: "p-4",
    },
    rounded: {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
    },
  },
  defaultVariants: {
    ratio: "16:9",
    inset: "none",
    rounded: "none",
  },
});

interface AspectImageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aspectImageVariants> {
  src?: string;
  alt?: string;
}

const AspectImage = React.forwardRef<HTMLDivElement, AspectImageProps>(
  ({ className, ratio, inset, rounded, src, alt, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(aspectImageVariants({ ratio, inset, rounded, className }))}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            className="w-full h-full object-cover"
          />
        ) : children ? (
          children
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
            {ratio}
          </div>
        )}
      </div>
    );
  }
);
AspectImage.displayName = "AspectImage";

export { AspectImage, aspectImageVariants };
