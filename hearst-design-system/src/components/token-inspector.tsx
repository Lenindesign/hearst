"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TokenInfo {
  property: string;
  variable: string;
  fallback: string;
  resolved: string;
  layer: string;
}

interface ComputedSpecs {
  tag: string;
  fontFamily: string;
  fontFamilyShort: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  color: string;
  colorHex: string;
  backgroundColor: string;
  backgroundColorHex: string;
  width: string;
  height: string;
  padding: string;
  margin: string;
  borderRadius: string;
  gap: string;
  display: string;
  isText: boolean;
}

const VAR_RE = /var\(--([^,)]+)(?:,\s*([^)]+))?\)/g;

function classifyToken(name: string): string {
  if (name.startsWith("brand-")) return "brand";
  if (name.startsWith("palette-brand")) return "brand";
  if (name.startsWith("palette-content")) return "semantic";
  if (name.startsWith("palette-background")) return "semantic";
  if (name.startsWith("palette-neutral")) return "core";
  if (name.startsWith("palette-alert")) return "semantic";
  if (name.startsWith("palette-primary")) return "semantic";
  if (name.startsWith("component-")) return "component";
  if (name.startsWith("font-")) return "typography";
  if (name.startsWith("typography-")) return "typography";
  if (name.startsWith("layout-") || name.startsWith("space-")) return "layout";
  if (name.startsWith("border-")) return "border";
  return "other";
}

const LAYER_COLORS: Record<string, string> = {
  brand: "#e91e63",
  semantic: "#2196f3",
  core: "#607d8b",
  component: "#ff9800",
  typography: "#9c27b0",
  layout: "#4caf50",
  border: "#795548",
  other: "#9e9e9e",
};

const TEXT_TAGS = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "A", "LABEL", "BUTTON", "LI", "STRONG", "EM", "CODE"]);

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const [, r, g, b] = match;
  return `#${[r, g, b].map((c) => parseInt(c).toString(16).padStart(2, "0")).join("")}`;
}

function shortenFontFamily(ff: string): string {
  const first = ff.split(",")[0].trim().replace(/["']/g, "");
  return first;
}

function collapseBoxValue(val: string): string {
  const parts = val.split(" ").filter(Boolean);
  if (parts.length === 4 && parts[0] === parts[1] && parts[1] === parts[2] && parts[2] === parts[3]) return parts[0];
  if (parts.length === 4 && parts[0] === parts[2] && parts[1] === parts[3]) return `${parts[0]} ${parts[1]}`;
  return val;
}

function getComputedSpecs(el: HTMLElement): ComputedSpecs {
  const cs = getComputedStyle(el);
  const tag = el.tagName;
  const isText = TEXT_TAGS.has(tag) || (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE);
  const rect = el.getBoundingClientRect();

  const padding = collapseBoxValue(`${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`);
  const margin = collapseBoxValue(`${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`);

  return {
    tag: tag.toLowerCase(),
    fontFamily: cs.fontFamily,
    fontFamilyShort: shortenFontFamily(cs.fontFamily),
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing === "normal" ? "0" : cs.letterSpacing,
    textTransform: cs.textTransform,
    color: cs.color,
    colorHex: rgbToHex(cs.color),
    backgroundColor: cs.backgroundColor,
    backgroundColorHex: cs.backgroundColor === "rgba(0, 0, 0, 0)" ? "transparent" : rgbToHex(cs.backgroundColor),
    width: `${Math.round(rect.width)}px`,
    height: `${Math.round(rect.height)}px`,
    padding: padding === "0px" ? "0" : padding,
    margin: margin === "0px" ? "0" : margin,
    borderRadius: cs.borderRadius === "0px" ? "0" : cs.borderRadius,
    gap: cs.gap === "normal" ? "0" : cs.gap,
    display: cs.display,
    isText,
  };
}

function extractTokensFromElement(el: HTMLElement): TokenInfo[] {
  const tokens: TokenInfo[] = [];
  const style = el.getAttribute("style");
  if (!style) return tokens;

  const computed = getComputedStyle(el);
  const props = style.split(";").filter(Boolean);

  for (const prop of props) {
    const colonIdx = prop.indexOf(":");
    if (colonIdx === -1) continue;
    const property = prop.slice(0, colonIdx).trim();
    const value = prop.slice(colonIdx + 1).trim();

    let match;
    VAR_RE.lastIndex = 0;
    while ((match = VAR_RE.exec(value)) !== null) {
      const varName = match[1].trim();
      const fallback = match[2]?.trim() || "";
      const cssProperty = property.replace(/^--/, "");

      let resolved = "";
      try {
        resolved = computed.getPropertyValue(`--${varName}`).trim() || fallback;
      } catch {
        resolved = fallback;
      }

      tokens.push({
        property: cssProperty,
        variable: `--${varName}`,
        fallback,
        resolved,
        layer: classifyToken(varName),
      });
    }
  }

  return tokens;
}

function extractTokensFromClasses(el: HTMLElement): TokenInfo[] {
  const tokens: TokenInfo[] = [];
  const classList = el.className;
  if (typeof classList !== "string") return tokens;

  if (classList.includes("font-brand-secondary")) {
    tokens.push({
      property: "font-family",
      variable: "--font-brand-secondary",
      fallback: "serif",
      resolved: getComputedStyle(el).fontFamily,
      layer: "typography",
    });
  }
  if (classList.includes("font-brand") && !classList.includes("font-brand-secondary")) {
    tokens.push({
      property: "font-family",
      variable: "--font-brand",
      fallback: "sans-serif",
      resolved: getComputedStyle(el).fontFamily,
      layer: "typography",
    });
  }
  if (classList.includes("headline")) {
    tokens.push({
      property: "font-family",
      variable: "--font-headline",
      fallback: "sans-serif",
      resolved: getComputedStyle(el).fontFamily,
      layer: "typography",
    });
    tokens.push({
      property: "font-weight",
      variable: "--font-headline-weight",
      fallback: "700",
      resolved: getComputedStyle(el).fontWeight,
      layer: "typography",
    });
  }

  return tokens;
}

function SpecRow({ label, value, color }: { label: string; value: string; color?: string }) {
  if (!value || value === "0" || value === "none" || value === "normal") return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        {color && color !== "transparent" && (
          <span
            className="inline-block w-3 h-3 rounded-sm border border-white/20 shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-gray-300 font-mono text-[10px] truncate">{value}</span>
      </div>
    </div>
  );
}

function TokenTooltip({
  tokens,
  rect,
  component,
  specs,
}: {
  tokens: TokenInfo[];
  rect: DOMRect;
  component: string;
  specs: ComputedSpecs;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!tooltipRef.current) return;
    const ttRect = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.bottom + 8;
    let left = rect.left;

    if (top + ttRect.height > vh) {
      top = rect.top - ttRect.height - 8;
    }
    if (left + ttRect.width > vw) {
      left = vw - ttRect.width - 8;
    }
    if (left < 8) left = 8;
    if (top < 8) top = rect.bottom + 8;

    setPos({ top, left });
  }, [rect]);

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[99999] pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 max-w-[420px] text-xs leading-relaxed">
        {/* Header: component + element tag */}
        <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-gray-700">
          {component && (
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              {component}
            </span>
          )}
          <span className="text-[10px] font-mono text-gray-600">
            &lt;{specs.tag}&gt; {specs.width} x {specs.height}
          </span>
        </div>

        {/* Typography section */}
        {specs.isText && (
          <div className="mb-2 pb-2 border-b border-gray-800 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-purple-400 mb-1">Typography</div>
            <SpecRow label="Font" value={specs.fontFamilyShort} />
            <SpecRow label="Size" value={specs.fontSize} />
            <SpecRow label="Weight" value={specs.fontWeight} />
            <SpecRow label="Line Height" value={specs.lineHeight} />
            <SpecRow label="Spacing" value={specs.letterSpacing} />
            {specs.textTransform !== "none" && (
              <SpecRow label="Transform" value={specs.textTransform} />
            )}
            <SpecRow label="Color" value={specs.colorHex} color={specs.colorHex} />
          </div>
        )}

        {/* Layout section */}
        {(specs.padding !== "0" || specs.gap !== "0" || specs.borderRadius !== "0") && (
          <div className="mb-2 pb-2 border-b border-gray-800 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-green-400 mb-1">Layout</div>
            <SpecRow label="Padding" value={specs.padding} />
            {specs.gap !== "0" && <SpecRow label="Gap" value={specs.gap} />}
            {specs.borderRadius !== "0" && <SpecRow label="Radius" value={specs.borderRadius} />}
            {specs.backgroundColorHex !== "transparent" && (
              <SpecRow label="Background" value={specs.backgroundColorHex} color={specs.backgroundColorHex} />
            )}
          </div>
        )}

        {/* Non-text color/bg when no typography section */}
        {!specs.isText && specs.backgroundColorHex !== "transparent" && specs.padding === "0" && specs.gap === "0" && specs.borderRadius === "0" && (
          <div className="mb-2 pb-2 border-b border-gray-800 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-blue-400 mb-1">Visual</div>
            <SpecRow label="Background" value={specs.backgroundColorHex} color={specs.backgroundColorHex} />
          </div>
        )}

        {/* Token variables */}
        {tokens.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] uppercase tracking-wider text-emerald-400 mb-1">Design Tokens</div>
            {tokens.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: LAYER_COLORS[t.layer] }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <code className="font-mono text-[11px] text-emerald-400">
                      {t.variable}
                    </code>
                    <span className="text-gray-500">{t.property}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {t.resolved && /^#[0-9a-fA-F]{3,8}$/.test(t.resolved) && (
                      <span
                        className="inline-block w-3 h-3 rounded-sm border border-white/20 shrink-0"
                        style={{ backgroundColor: t.resolved }}
                      />
                    )}
                    <span className="text-gray-400 font-mono text-[10px]">
                      {t.resolved || t.fallback}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Layer legend */}
        {tokens.length > 0 && (
          <div className="mt-2 pt-1.5 border-t border-gray-700 flex gap-2 flex-wrap">
            {[...new Set(tokens.map((t) => t.layer))].map((layer) => (
              <span
                key={layer}
                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider"
                style={{ color: LAYER_COLORS[layer] }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: LAYER_COLORS[layer] }}
                />
                {layer}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getComponentName(el: HTMLElement): string {
  const walk = (node: HTMLElement | null, depth: number): string => {
    if (!node || depth > 10) return "";
    const id = node.getAttribute("data-cursor-element-id");
    if (id) {
      const tag = node.tagName.toLowerCase();
      const cls = node.className;
      if (typeof cls === "string") {
        if (cls.includes("font-brand")) return "BrandHomePage";
        if (cls.includes("headline") && tag === "h3") return "CollectionList";
        if (cls.includes("headline") && tag === "h2" && cls.includes("text-4xl"))
          return "TrendingSection";
        if (cls.includes("headline") && tag === "h2") return "HeroCard";
        if (cls.includes("headline") && tag === "h1") return "MainNav (Logo)";
      }
    }
    return walk(node.parentElement, depth + 1);
  };

  const tag = el.tagName.toLowerCase();
  const cls = typeof el.className === "string" ? el.className : "";

  if (tag === "footer") return "Footer";
  if (cls.includes("border-b") && cls.includes("py-2")) return "MainNav";
  if (cls.includes("aspect-[16/10]")) return "HeroCard";
  if (cls.includes("aspect-square")) return "TrendingCard";
  if (cls.includes("headline") && tag === "h3") return "CollectionList";
  if (cls.includes("headline") && tag === "h2" && cls.includes("text-4xl"))
    return "TrendingSection";
  if (cls.includes("headline") && tag === "h2") return "HeroCard";
  if (cls.includes("headline") && tag === "h1") return "MainNav";

  const style = el.getAttribute("style") || "";
  if (style.includes("--brand-primary")) {
    if (tag === "div" && cls.includes("h-8")) return "UtilityBar";
    if (tag === "h3") return "CollectionList";
    if (tag === "span" && cls.includes("text-xs")) return "HeroCard (eyebrow)";
    if (tag === "span" && cls.includes("text-[11px]"))
      return "RightRailCard (eyebrow)";
    if (cls.includes("w-5") || cls.includes("w-6")) return "NumberBadge";
  }
  if (style.includes("--palette-neutral-300") && tag === "footer")
    return "Footer";
  if (style.includes("--palette-neutral-300") && cls.includes("border-b"))
    return "MainNav";
  if (style.includes("--palette-neutral-900")) return "MainNav (link)";
  if (style.includes("--palette-neutral-600") && cls.includes("text-xs"))
    return "Meta / Timestamp";
  if (style.includes("--palette-neutral-700")) return "HeroCard (description)";
  if (style.includes("--palette-neutral-100") && cls.includes("p-6"))
    return "NewsletterPromo";
  if (style.includes("--palette-neutral-100") && cls.includes("flex-col"))
    return "Ad Slot";
  if (style.includes("--palette-neutral-200") && cls.includes("w-[300px]"))
    return "Ad Placeholder";
  if (style.includes("--palette-neutral-200") && cls.includes("rounded"))
    return "Image Placeholder";
  if (style.includes("--palette-neutral-lightest")) return "BrandHomePage";

  return walk(el.parentElement, 0) || tag;
}

export function TokenInspector() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<{
    tokens: TokenInfo[];
    rect: DOMRect;
    component: string;
    specs: ComputedSpecs;
  } | null>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;

      const el = e.target as HTMLElement;
      if (!el || el.nodeType !== 1 || el.closest("[data-token-inspector]")) return;

      const styleTokens = extractTokensFromElement(el);
      const classTokens = extractTokensFromClasses(el);
      const tokens = [...styleTokens, ...classTokens];
      const specs = getComputedSpecs(el);

      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        setHovered(null);
        setHighlightRect(null);
        return;
      }

      const component = getComponentName(el);
      setHovered({ tokens, rect, component, specs });
      setHighlightRect(rect);
    },
    [enabled]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setHighlightRect(null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setHovered(null);
      setHighlightRect(null);
      return;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, handleMouseMove, handleMouseLeave]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setEnabled((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        data-token-inspector
        onClick={() => setEnabled((v) => !v)}
        className="fixed bottom-4 right-4 z-[99998] flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium shadow-lg transition-all"
        style={{
          backgroundColor: enabled ? "#e91e63" : "#1e293b",
          color: "#fff",
        }}
        title="Toggle Token Inspector (Cmd+Shift+I)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        {enabled ? "Inspector ON" : "Visual Dictionary"}
      </button>

      {enabled && highlightRect && (
        <div
          className="fixed pointer-events-none z-[99997] transition-all duration-75"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            border: "1.5px solid #e91e63",
            backgroundColor: "rgba(233, 30, 99, 0.04)",
            boxShadow: "0 0 0 1px rgba(233, 30, 99, 0.15)",
          }}
        >
          {/* Dimension labels */}
          <span className="absolute -top-4 left-0 text-[9px] font-mono px-1 rounded-sm"
            style={{ backgroundColor: "#e91e63", color: "#fff" }}>
            {Math.round(highlightRect.width)}
          </span>
          <span className="absolute top-0 -right-4 text-[9px] font-mono px-1 rounded-sm"
            style={{ backgroundColor: "#e91e63", color: "#fff", writingMode: "vertical-lr" }}>
            {Math.round(highlightRect.height)}
          </span>
        </div>
      )}

      {enabled && hovered && (
        <TokenTooltip
          tokens={hovered.tokens}
          rect={hovered.rect}
          component={hovered.component}
          specs={hovered.specs}
        />
      )}

      {enabled && (
        <div
          data-token-inspector
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[99998] bg-gray-900 text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center gap-3"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            Visual Dictionary Active
          </span>
          <span className="text-gray-500">Hover any element for specs</span>
          <span className="text-gray-600">Cmd+Shift+I to toggle</span>
        </div>
      )}
    </>
  );
}
