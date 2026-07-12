"use client";

import { useEffect, useState } from "react";
import { brandLogos } from "@/lib/logos";

interface BrandLogoProps {
  slug: string;
  className?: string;
  color?: string;
}

export function BrandLogo({ slug, className = "", color }: BrandLogoProps) {
  const [loadedSvg, setLoadedSvg] = useState<{ src: string; markup: string } | null>(null);
  const src = brandLogos[slug];

  useEffect(() => {
    if (!src) return;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Unable to load logo: ${r.status}`);
        return r.text();
      })
      .then((text) => {
        let cleaned = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
        cleaned = cleaned.replace(/var\(--primary\s*,\s*([^)]+)\)/g, "$1");
        setLoadedSvg({ src, markup: cleaned });
      })
      .catch(() => setLoadedSvg(null));
  }, [src]);

  if (!src || loadedSvg?.src !== src) return null;

  let html = loadedSvg.markup;
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
