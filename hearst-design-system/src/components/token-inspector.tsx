"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TokenInfo {
  property: string;
  variable: string;
  fallback: string;
  resolved: string;
  layer: string;
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
      variable: "--font-brand-sans",
      fallback: "sans-serif",
      resolved: getComputedStyle(el).fontFamily,
      layer: "typography",
    });
  }
  if (classList.includes("headline")) {
    tokens.push({
      property: "font-family",
      variable: "--font-brand-headline",
      fallback: "sans-serif",
      resolved: getComputedStyle(el).fontFamily,
      layer: "typography",
    });
  }

  return tokens;
}

function TokenTooltip({
  tokens,
  rect,
  component,
}: {
  tokens: TokenInfo[];
  rect: DOMRect;
  component: string;
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
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 max-w-[380px] text-xs leading-relaxed">
        {component && (
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 pb-1.5 border-b border-gray-700">
            {component}
          </div>
        )}
        <div className="space-y-2">
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
  } | null>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;

      const el = e.target as HTMLElement;
      if (!el || el.closest("[data-token-inspector]")) return;

      const styleTokens = extractTokensFromElement(el);
      const classTokens = extractTokensFromClasses(el);
      const tokens = [...styleTokens, ...classTokens];

      if (tokens.length === 0) {
        setHovered(null);
        setHighlightRect(null);
        return;
      }

      const rect = el.getBoundingClientRect();
      const component = getComponentName(el);
      setHovered({ tokens, rect, component });
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
        {enabled ? "Inspector ON" : "Token Inspector"}
      </button>

      {enabled && highlightRect && (
        <div
          className="fixed pointer-events-none z-[99997] border-2 border-dashed transition-all duration-75"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            borderColor: "#e91e63",
            backgroundColor: "rgba(233, 30, 99, 0.05)",
          }}
        />
      )}

      {enabled && hovered && (
        <TokenTooltip
          tokens={hovered.tokens}
          rect={hovered.rect}
          component={hovered.component}
        />
      )}

      {enabled && (
        <div
          data-token-inspector
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[99998] bg-gray-900 text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center gap-3"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            Token Inspector Active
          </span>
          <span className="text-gray-500">Hover elements to see tokens</span>
          <span className="text-gray-600">Cmd+Shift+I to toggle</span>
        </div>
      )}
    </>
  );
}
