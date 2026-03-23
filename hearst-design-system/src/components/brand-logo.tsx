"use client";

import { useEffect, useState } from "react";
import { brandLogos } from "@/lib/logos";

interface BrandLogoProps {
  slug: string;
  className?: string;
  color?: string;
}

export function BrandLogo({ slug, className = "", color }: BrandLogoProps) {
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

  let html = svg;
  if (color) {
    html = html
      .replace(/fill="[^"]*"/g, `fill="${color}"`)
      .replace(/style="[^"]*fill:\s*[^;"]*;?/g, (m) =>
        m.replace(/fill:\s*[^;"]*/, `fill:${color}`)
      );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
