"use client";

import { useEffect, useState } from "react";
import { getBrandLogoSrc } from "@/lib/logos";

interface BrandLogoProps {
  slug: string;
  className?: string;
  color?: string;
  variant?: "logo" | "icon";
}

function applySvgColor(markup: string, color: string) {
  const recoloredMarkup = markup
    .replace(/\b(fill|stroke)=(["'])([^"']*)\2/gi, (match, property, quote, value) =>
      value.trim().toLowerCase() === "none"
        ? match
        : `${property}=${quote}${color}${quote}`
    )
    .replace(/\b(fill|stroke)\s*:\s*([^;"}]+)/gi, (match, property, value) =>
      value.trim().toLowerCase() === "none"
        ? match
        : `${property}:${color}`
    );

  return recoloredMarkup.replace(/<svg\b[^>]*>/i, (svgTag) => {
    const withColor = /\bcolor=(["'])/i.test(svgTag)
      ? svgTag.replace(/\bcolor=(["'])[^"']*\1/i, `color="${color}"`)
      : svgTag.replace("<svg", `<svg color="${color}"`);

    return /\bfill=(["'])/i.test(withColor)
      ? withColor
      : withColor.replace("<svg", `<svg fill="${color}"`);
  });
}

export function BrandLogo({ slug, className = "", color, variant = "logo" }: BrandLogoProps) {
  const [loadedSvg, setLoadedSvg] = useState<{ src: string; markup: string } | null>(null);
  const src = getBrandLogoSrc(slug, variant);

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

  const html = color ? applySvgColor(loadedSvg.markup, color) : loadedSvg.markup;

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
