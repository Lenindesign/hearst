"use client";

import { useEffect, useState } from "react";
import { brandLogos } from "@/lib/logos";

interface BrandLogoProps {
  slug: string;
  className?: string;
}

export function BrandLogo({ slug, className = "" }: BrandLogoProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const src = brandLogos[slug];

  useEffect(() => {
    if (!src) return;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        let cleaned = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
        cleaned = cleaned.replace(/var\(--primary\s*,\s*([^)]+)\)/g, "$1");
        setSvg(cleaned);
      })
      .catch(() => setSvg(null));
  }, [src]);

  if (!svg) return null;

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
