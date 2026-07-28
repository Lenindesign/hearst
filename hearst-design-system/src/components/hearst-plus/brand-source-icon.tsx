"use client";

import { useState } from "react";
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
}: {
  brand: string;
  brandSlug: string;
  className?: string;
}) {
  const iconUrl = getBrandLogoSrc(brandSlug, "icon");
  const [failedUrl, setFailedUrl] = useState<string>();
  const showImage = Boolean(iconUrl && failedUrl !== iconUrl);

  return (
    <span
      aria-hidden
      data-brand-source-icon
      data-brand-slug={brandSlug}
      data-image-state={showImage ? "available" : "fallback"}
      className={cn(
        "relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-border bg-background p-0.5 text-[8px] font-black leading-none text-primary",
        className,
      )}
    >
      <span>{getBrandInitials(brand)}</span>
      {showImage && (
        <img
          src={iconUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full bg-background object-contain p-0.5"
          onError={() => setFailedUrl(iconUrl)}
        />
      )}
    </span>
  );
}
