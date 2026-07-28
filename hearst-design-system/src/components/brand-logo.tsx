"use client";

import { useEffect, useState } from "react";
import { getBrandLogoLabel, getBrandLogoSrc } from "@/lib/logos";

export interface BrandLogoProps {
  slug: string;
  className?: string;
  color?: string;
  /** Overrides the canonical publication or destination name. */
  label?: string;
  /** Hides the logo from assistive technology when nearby text already names it. */
  decorative?: boolean;
}

const logoMarkupCache = new Map<string, Promise<string>>();

function loadLogoMarkup(src: string) {
  const cached = logoMarkupCache.get(src);
  if (cached) return cached;

  const request = fetch(src)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load logo: ${response.status}`);
      }
      return response.text();
    })
    .then((markup) => {
      const cleaned = markup
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/var\(--primary\s*,\s*([^)]+)\)/g, "$1")
        .replace(/<(script|foreignObject|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/\son[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi, "")
        .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
        .replace(/<desc\b[^>]*>[\s\S]*?<\/desc>/gi, "");

      const svgStart = cleaned.search(/<svg\b/i);
      const svgEnd = cleaned.toLowerCase().lastIndexOf("</svg>");
      if (svgStart < 0 || svgEnd < svgStart) {
        throw new Error("Brand logo asset is not an SVG");
      }

      return cleaned
        .slice(svgStart, svgEnd + "</svg>".length)
        .replace(/<svg\b[^>]*>/i, (svgTag) => {
        const withoutOwnedSemantics = svgTag
          .replace(/\s(?:role|aria-label|aria-labelledby|aria-describedby|focusable)=(["'])[^"']*\1/gi, "")
          .replace(/\saria-hidden(?:=(["'])[^"']*\1)?/gi, "");

        return withoutOwnedSemantics.replace(
          "<svg",
          '<svg aria-hidden="true" focusable="false"',
        );
        });
    })
    .catch((error) => {
      logoMarkupCache.delete(src);
      throw error;
    });

  logoMarkupCache.set(src, request);
  return request;
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

export function BrandLogo({
  slug,
  className = "",
  color,
  label,
  decorative = false,
}: BrandLogoProps) {
  const [loadResult, setLoadResult] = useState<
    | { src: string; status: "ready"; markup: string }
    | { src: string; status: "error" }
    | null
  >(null);
  const src = getBrandLogoSrc(slug);
  const accessibleName = label ?? getBrandLogoLabel(slug);

  useEffect(() => {
    if (!src) return;

    let active = true;

    loadLogoMarkup(src)
      .then((markup) => {
        if (active) setLoadResult({ src, status: "ready", markup });
      })
      .catch(() => {
        if (!active) return;
        setLoadResult({ src, status: "error" });
      });

    return () => {
      active = false;
    };
  }, [src]);

  if (!src || !accessibleName) return null;

  const ready = loadResult?.src === src && loadResult.status === "ready";
  const failed = loadResult?.src === src && loadResult.status === "error";
  const html = ready
    ? color
      ? applySvgColor(loadResult.markup, color)
      : loadResult.markup
    : "";

  return (
    <span
      className={className}
      data-brand-logo={slug}
      data-state={ready ? "ready" : failed ? "error" : "loading"}
      {...(decorative
        ? { "aria-hidden": true }
        : {
            role: "img",
            "aria-label": accessibleName,
            "aria-busy": ready ? undefined : true,
          })}
      {...(ready ? { dangerouslySetInnerHTML: { __html: html } } : {})}
    />
  );
}
