"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// Public types — configure these to reuse in any project
// ---------------------------------------------------------------------------

export interface TokenLayer {
  prefixes: string[];
  color: string;
}

export interface ClassTokenMapping {
  className: string;
  excludeClassName?: string;
  tokens: { property: string; variable: string; fallback: string }[];
}

export interface TokenInspectorConfig {
  layers?: Record<string, TokenLayer>;
  classTokens?: ClassTokenMapping[];
  componentDetector?: (el: HTMLElement) => string;
  title?: string;
  accentColor?: string;
  shortcut?: { key: string; meta?: boolean; shift?: boolean };
}

// ---------------------------------------------------------------------------
// Hearst defaults — used when no config is provided
// ---------------------------------------------------------------------------

const HEARST_LAYERS: Record<string, TokenLayer> = {
  brand: { prefixes: ["brand-", "palette-brand"], color: "#e91e63" },
  semantic: {
    prefixes: [
      "palette-content",
      "palette-background",
      "palette-alert",
      "palette-primary",
    ],
    color: "#2196f3",
  },
  core: { prefixes: ["palette-neutral"], color: "#607d8b" },
  component: { prefixes: ["component-"], color: "#ff9800" },
  typography: { prefixes: ["font-", "typography-"], color: "#9c27b0" },
  layout: { prefixes: ["layout-", "space-"], color: "#4caf50" },
  border: { prefixes: ["border-"], color: "#795548" },
};

const HEARST_CLASS_TOKENS: ClassTokenMapping[] = [
  {
    className: "font-brand-secondary",
    tokens: [
      {
        property: "font-family",
        variable: "--font-brand-secondary",
        fallback: "serif",
      },
    ],
  },
  {
    className: "font-brand",
    excludeClassName: "font-brand-secondary",
    tokens: [
      {
        property: "font-family",
        variable: "--font-brand",
        fallback: "sans-serif",
      },
    ],
  },
  {
    className: "headline",
    tokens: [
      {
        property: "font-family",
        variable: "--font-headline",
        fallback: "sans-serif",
      },
      {
        property: "font-weight",
        variable: "--font-headline-weight",
        fallback: "700",
      },
    ],
  },
];

function hearstComponentDetector(el: HTMLElement): string {
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
  if (style.includes("--palette-neutral-700"))
    return "HeroCard (description)";
  if (style.includes("--palette-neutral-100") && cls.includes("p-6"))
    return "NewsletterPromo";
  if (style.includes("--palette-neutral-100") && cls.includes("flex-col"))
    return "Ad Slot";
  if (style.includes("--palette-neutral-200") && cls.includes("w-[300px]"))
    return "Ad Placeholder";
  if (style.includes("--palette-neutral-200") && cls.includes("rounded"))
    return "Image Placeholder";
  if (style.includes("--palette-neutral-lightest")) return "BrandHomePage";

  const walk = (node: HTMLElement | null, depth: number): string => {
    if (!node || depth > 10) return "";
    const id = node.getAttribute("data-cursor-element-id");
    if (id) {
      const nodeCls = typeof node.className === "string" ? node.className : "";
      const nodeTag = node.tagName.toLowerCase();
      if (nodeCls.includes("font-brand")) return "BrandHomePage";
      if (nodeCls.includes("headline") && nodeTag === "h3")
        return "CollectionList";
      if (
        nodeCls.includes("headline") &&
        nodeTag === "h2" &&
        nodeCls.includes("text-4xl")
      )
        return "TrendingSection";
      if (nodeCls.includes("headline") && nodeTag === "h2") return "HeroCard";
      if (nodeCls.includes("headline") && nodeTag === "h1")
        return "MainNav (Logo)";
    }
    return walk(node.parentElement, depth + 1);
  };

  return walk(el.parentElement, 0) || tag;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const VAR_RE = /var\(--([^,)]+)(?:,\s*([^)]+))?\)/g;

const TEXT_TAGS = new Set([
  "P", "H1", "H2", "H3", "H4", "H5", "H6",
  "SPAN", "A", "LABEL", "BUTTON", "LI", "STRONG", "EM", "CODE",
]);

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const [, r, g, b] = match;
  return `#${[r, g, b].map((c) => parseInt(c).toString(16).padStart(2, "0")).join("")}`;
}

function shortenFontFamily(ff: string): string {
  return ff.split(",")[0].trim().replace(/["']/g, "");
}

function collapseBoxValue(val: string): string {
  const parts = val.split(" ").filter(Boolean);
  if (parts.length === 4 && parts[0] === parts[1] && parts[1] === parts[2] && parts[2] === parts[3])
    return parts[0];
  if (parts.length === 4 && parts[0] === parts[2] && parts[1] === parts[3])
    return `${parts[0]} ${parts[1]}`;
  return val;
}

function getComputedSpecs(el: HTMLElement): ComputedSpecs {
  const cs = getComputedStyle(el);
  const tag = el.tagName;
  const isText =
    TEXT_TAGS.has(tag) ||
    (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE);
  const rect = el.getBoundingClientRect();

  const padding = collapseBoxValue(
    `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`
  );
  const margin = collapseBoxValue(
    `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`
  );

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
    backgroundColorHex:
      cs.backgroundColor === "rgba(0, 0, 0, 0)"
        ? "transparent"
        : rgbToHex(cs.backgroundColor),
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

// ---------------------------------------------------------------------------
// Token extraction (configurable)
// ---------------------------------------------------------------------------

function classifyToken(
  name: string,
  layers: Record<string, TokenLayer>
): string {
  for (const [layer, { prefixes }] of Object.entries(layers)) {
    if (prefixes.some((p) => name.startsWith(p))) return layer;
  }
  return "other";
}

function buildLayerColors(layers: Record<string, TokenLayer>): Record<string, string> {
  const colors: Record<string, string> = { other: "#9e9e9e" };
  for (const [layer, { color }] of Object.entries(layers)) {
    colors[layer] = color;
  }
  return colors;
}

function extractTokensFromElement(
  el: HTMLElement,
  layers: Record<string, TokenLayer>
): TokenInfo[] {
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
        layer: classifyToken(varName, layers),
      });
    }
  }

  return tokens;
}

function extractTokensFromClasses(
  el: HTMLElement,
  classTokens: ClassTokenMapping[]
): TokenInfo[] {
  const tokens: TokenInfo[] = [];
  const classList = el.className;
  if (typeof classList !== "string") return tokens;

  for (const mapping of classTokens) {
    if (!classList.includes(mapping.className)) continue;
    if (mapping.excludeClassName && classList.includes(mapping.excludeClassName))
      continue;

    for (const t of mapping.tokens) {
      tokens.push({
        property: t.property,
        variable: t.variable,
        fallback: t.fallback,
        resolved: getComputedStyle(el).getPropertyValue(t.variable).trim() ||
          getComputedStyle(el)[t.property as keyof CSSStyleDeclaration] as string ||
          t.fallback,
        layer: "typography",
      });
    }
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SpecRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  if (!value || value === "0" || value === "none" || value === "normal")
    return null;
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
        <span className="text-gray-300 font-mono text-[10px] truncate">
          {value}
        </span>
      </div>
    </div>
  );
}

function TokenTooltip({
  tokens,
  rect,
  component,
  specs,
  layerColors,
}: {
  tokens: TokenInfo[];
  rect: DOMRect;
  component: string;
  specs: ComputedSpecs;
  layerColors: Record<string, string>;
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

    if (top + ttRect.height > vh) top = rect.top - ttRect.height - 8;
    if (left + ttRect.width > vw) left = vw - ttRect.width - 8;
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

        {specs.isText && (
          <div className="mb-2 pb-2 border-b border-gray-800 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-purple-400 mb-1">
              Typography
            </div>
            <SpecRow label="Font" value={specs.fontFamilyShort} />
            <SpecRow label="Size" value={specs.fontSize} />
            <SpecRow label="Weight" value={specs.fontWeight} />
            <SpecRow label="Line Height" value={specs.lineHeight} />
            <SpecRow label="Spacing" value={specs.letterSpacing} />
            {specs.textTransform !== "none" && (
              <SpecRow label="Transform" value={specs.textTransform} />
            )}
            <SpecRow
              label="Color"
              value={specs.colorHex}
              color={specs.colorHex}
            />
          </div>
        )}

        {(specs.padding !== "0" ||
          specs.gap !== "0" ||
          specs.borderRadius !== "0") && (
          <div className="mb-2 pb-2 border-b border-gray-800 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-green-400 mb-1">
              Layout
            </div>
            <SpecRow label="Padding" value={specs.padding} />
            {specs.gap !== "0" && <SpecRow label="Gap" value={specs.gap} />}
            {specs.borderRadius !== "0" && (
              <SpecRow label="Radius" value={specs.borderRadius} />
            )}
            {specs.backgroundColorHex !== "transparent" && (
              <SpecRow
                label="Background"
                value={specs.backgroundColorHex}
                color={specs.backgroundColorHex}
              />
            )}
          </div>
        )}

        {!specs.isText &&
          specs.backgroundColorHex !== "transparent" &&
          specs.padding === "0" &&
          specs.gap === "0" &&
          specs.borderRadius === "0" && (
            <div className="mb-2 pb-2 border-b border-gray-800 space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-blue-400 mb-1">
                Visual
              </div>
              <SpecRow
                label="Background"
                value={specs.backgroundColorHex}
                color={specs.backgroundColorHex}
              />
            </div>
          )}

        {tokens.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] uppercase tracking-wider text-emerald-400 mb-1">
              Design Tokens
            </div>
            {tokens.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: layerColors[t.layer] || "#9e9e9e" }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <code className="font-mono text-[11px] text-emerald-400">
                      {t.variable}
                    </code>
                    <span className="text-gray-500">{t.property}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {t.resolved &&
                      /^#[0-9a-fA-F]{3,8}$/.test(t.resolved) && (
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

        {tokens.length > 0 && (
          <div className="mt-2 pt-1.5 border-t border-gray-700 flex gap-2 flex-wrap">
            {[...new Set(tokens.map((t) => t.layer))].map((layer) => (
              <span
                key={layer}
                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider"
                style={{ color: layerColors[layer] || "#9e9e9e" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: layerColors[layer] || "#9e9e9e",
                  }}
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TokenInspector({
  layers,
  classTokens,
  componentDetector,
  title = "Visual Dictionary",
  accentColor = "#e91e63",
  shortcut = { key: "i", meta: true, shift: true },
}: TokenInspectorConfig = {}) {
  const resolvedLayers = layers ?? HEARST_LAYERS;
  const resolvedClassTokens = classTokens ?? HEARST_CLASS_TOKENS;
  const resolvedDetector = componentDetector ?? hearstComponentDetector;
  const layerColors = buildLayerColors(resolvedLayers);

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
      if (!el || el.nodeType !== 1 || el.closest("[data-token-inspector]"))
        return;

      const styleTokens = extractTokensFromElement(el, resolvedLayers);
      const classTokenResults = extractTokensFromClasses(el, resolvedClassTokens);
      const tokens = [...styleTokens, ...classTokenResults];
      const specs = getComputedSpecs(el);

      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        setHovered(null);
        setHighlightRect(null);
        return;
      }

      const component = resolvedDetector(el);
      setHovered({ tokens, rect, component, specs });
      setHighlightRect(rect);
    },
    [enabled, resolvedLayers, resolvedClassTokens, resolvedDetector]
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
      const metaMatch = shortcut.meta ? e.metaKey || e.ctrlKey : true;
      const shiftMatch = shortcut.shift ? e.shiftKey : true;
      if (e.key === shortcut.key && metaMatch && shiftMatch) {
        e.preventDefault();
        setEnabled((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [shortcut]);

  const shortcutLabel = [
    shortcut.meta ? "Cmd" : "",
    shortcut.shift ? "Shift" : "",
    shortcut.key.toUpperCase(),
  ]
    .filter(Boolean)
    .join("+");

  return (
    <>
      <button
        data-token-inspector
        onClick={() => setEnabled((v) => !v)}
        className="fixed bottom-4 right-4 z-[99998] flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium shadow-lg transition-all"
        style={{
          backgroundColor: enabled ? accentColor : "#1e293b",
          color: "#fff",
        }}
        title={`Toggle ${title} (${shortcutLabel})`}
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
        {enabled ? "Inspector ON" : title}
      </button>

      {enabled && highlightRect && (
        <div
          className="fixed pointer-events-none z-[99997] transition-all duration-75"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            border: `1.5px solid ${accentColor}`,
            backgroundColor: `${accentColor}0a`,
            boxShadow: `0 0 0 1px ${accentColor}26`,
          }}
        >
          <span
            className="absolute -top-4 left-0 text-[9px] font-mono px-1 rounded-sm"
            style={{ backgroundColor: accentColor, color: "#fff" }}
          >
            {Math.round(highlightRect.width)}
          </span>
          <span
            className="absolute top-0 -right-4 text-[9px] font-mono px-1 rounded-sm"
            style={{
              backgroundColor: accentColor,
              color: "#fff",
              writingMode: "vertical-lr",
            }}
          >
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
          layerColors={layerColors}
        />
      )}

      {enabled && (
        <div
          data-token-inspector
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[99998] bg-gray-900 text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center gap-3"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            {title} Active
          </span>
          <span className="text-gray-500">Hover any element for specs</span>
          <span className="text-gray-600">{shortcutLabel} to toggle</span>
        </div>
      )}
    </>
  );
}
