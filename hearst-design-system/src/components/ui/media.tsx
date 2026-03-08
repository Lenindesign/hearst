"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Play, Headphones, type LucideIcon } from "lucide-react";

const mediaVariants = cva("relative overflow-hidden bg-muted", {
  variants: {
    ratio: {
      "1:1": "aspect-square",
      "4:3": "aspect-[4/3]",
      "3:2": "aspect-[3/2]",
      "16:9": "aspect-video",
      "21:9": "aspect-[21/9]",
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

const iconPositionClasses: Record<string, string> = {
  center: "inset-0 flex items-center justify-center",
  "top-left": "top-0 left-0 p-2",
  "top-right": "top-0 right-0 p-2",
  "bottom-left": "bottom-0 left-0 p-2",
  "bottom-right": "bottom-0 right-0 p-2",
};

const mediaIcons: Record<string, LucideIcon> = {
  play: Play,
  headphones: Headphones,
};

interface MediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mediaVariants> {
  src?: string;
  alt?: string;
  icon?: keyof typeof mediaIcons;
  iconPosition?: keyof typeof iconPositionClasses;
  iconMode?: "light" | "dark";
  iconSize?: number;
}

const Media = React.forwardRef<HTMLDivElement, MediaProps>(
  (
    {
      className,
      ratio,
      inset,
      rounded,
      src,
      alt,
      icon = "play",
      iconPosition = "center",
      iconMode = "light",
      iconSize = 40,
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent = mediaIcons[icon] ?? Play;
    const posClass = iconPositionClasses[iconPosition] ?? iconPositionClasses.center;
    const isLight = iconMode === "light";

    return (
      <div
        ref={ref}
        className={cn(mediaVariants({ ratio, inset, rounded, className }))}
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

        <div className={cn("absolute", posClass)}>
          <div
            className={cn(
              "rounded-full flex items-center justify-center shadow-sm",
              isLight
                ? "bg-white/90 text-gray-900"
                : "bg-black/70 text-white"
            )}
            style={{ width: iconSize, height: iconSize }}
          >
            <IconComponent size={iconSize * 0.5} />
          </div>
        </div>
      </div>
    );
  }
);
Media.displayName = "Media";

export { Media, mediaVariants, mediaIcons, iconPositionClasses };
