"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { getBrandLogoSrc } from "@/lib/logos";
import { cn } from "@/lib/utils";

function getBrandInitials(brand: string) {
  return brand
    .split(/\s+|&/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function BrandSourceIcon({
  brand,
  brandSlug,
  className,
  imageClassName,
}: {
  brand: string;
  brandSlug: string;
  className?: string;
  imageClassName?: string;
}) {
  const { colorMode } = useTheme();
  const iconUrl = getBrandLogoSrc(brandSlug, "icon");
  const wordmarkUrl = getBrandLogoSrc(brandSlug);
  const needsLightSurface = colorMode === "dark" && iconUrl === wordmarkUrl;
  const [failedUrl, setFailedUrl] = useState<string>();
  const showImage = Boolean(iconUrl && failedUrl !== iconUrl);

  return (
    <span
      aria-hidden
      data-brand-source-icon
      data-brand-slug={brandSlug}
      data-image-state={showImage ? "available" : "fallback"}
      className={cn(
        "relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-transparent p-0 text-[8px] font-black leading-none text-primary",
        needsLightSurface && "bg-white",
        className,
      )}
    >
      {showImage && (
        <img
          src={iconUrl}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-contain",
            imageClassName,
          )}
          onError={() => setFailedUrl(iconUrl)}
        />
      )}
      {!showImage ? <span>{getBrandInitials(brand)}</span> : null}
    </span>
  );
}
