"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface InspectorData {
  tag: string;
  classes: string[];
  rect: DOMRect;
  styles: {
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    padding: string;
    margin: string;
    borderRadius: string;
    gap: string;
  };
  tokens: Record<string, string>;
  dataSlot: string | null;
  reactComponent: string | null;
}

const TOKEN_PROPS = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--accent",
  "--background",
  "--foreground",
  "--muted",
  "--muted-foreground",
  "--border",
  "--font-brand",
  "--font-brand-secondary",
  "--font-headline",
  "--font-headline-weight",
] as const;

function resolveTokenName(value: string, tokens: Record<string, string>): string | null {
  if (!value || value === "rgba(0, 0, 0, 0)" || value === "transparent") return null;
  for (const [name, tokenVal] of Object.entries(tokens)) {
    if (tokenVal && value === tokenVal) return name;
  }
  return null;
}

function getReactComponentName(el: HTMLElement): string | null {
  const fiber =
    (el as any).__reactFiber$ ||
    Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
  if (!fiber) return null;
  const key = typeof fiber === "string" ? (el as any)[fiber] : fiber;
  let node = key;
  while (node) {
    if (node.type && typeof node.type === "function") {
      return node.type.displayName || node.type.name || null;
    }
    node = node.return;
  }
  return null;
}

function InspectorOverlay({ data }: { data: InspectorData }) {
  const { rect } = data;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          border: "2px solid #3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.08)",
          pointerEvents: "none",
          zIndex: 99998,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: rect.top - 22,
          left: rect.left,
          backgroundColor: "#3b82f6",
          color: "#fff",
          fontSize: 11,
          fontFamily: "ui-monospace, monospace",
          fontWeight: 600,
          padding: "2px 6px",
          borderRadius: "3px 3px 0 0",
          pointerEvents: "none",
          zIndex: 99999,
          whiteSpace: "nowrap",
        }}
      >
        {data.reactComponent || data.dataSlot || data.tag}
        <span style={{ opacity: 0.7, marginLeft: 6 }}>
          {Math.round(rect.width)} x {Math.round(rect.height)}
        </span>
      </div>
    </>
  );
}

function InspectorPanel({ data }: { data: InspectorData }) {
  const colorToken = resolveTokenName(data.styles.color, data.tokens);
  const bgToken = resolveTokenName(data.styles.backgroundColor, data.tokens);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        width: 320,
        maxHeight: "50vh",
        overflowY: "auto",
        backgroundColor: "#1e1e2e",
        color: "#cdd6f4",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "ui-monospace, SFMono-Regular, monospace",
        fontSize: 12,
        lineHeight: 1.5,
        zIndex: 100000,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            backgroundColor: "#3b82f6",
            color: "#fff",
            padding: "1px 6px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {data.reactComponent || data.dataSlot || data.tag}
        </span>
        <span style={{ color: "#6c7086", fontSize: 11 }}>
          {Math.round(data.rect.width)} x {Math.round(data.rect.height)}
        </span>
      </div>

      <div style={{ padding: "8px 14px" }}>
        <Section title="Typography">
          <Row label="font-family" value={data.styles.fontFamily.split(",")[0].replace(/"/g, "")} />
          <Row label="font-size" value={data.styles.fontSize} />
          <Row label="font-weight" value={data.styles.fontWeight} />
          <Row label="line-height" value={data.styles.lineHeight} />
        </Section>

        <Section title="Colors">
          <ColorRow label="color" value={data.styles.color} token={colorToken} />
          <ColorRow label="background" value={data.styles.backgroundColor} token={bgToken} />
        </Section>

        <Section title="Spacing">
          <Row label="padding" value={data.styles.padding} />
          <Row label="margin" value={data.styles.margin} />
          <Row label="gap" value={data.styles.gap} />
          <Row label="border-radius" value={data.styles.borderRadius} />
        </Section>

        {data.classes.length > 0 && (
          <Section title="Classes">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                maxHeight: 80,
                overflowY: "auto",
              }}
            >
              {data.classes.map((c) => (
                <span
                  key={c}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    padding: "1px 5px",
                    borderRadius: 3,
                    fontSize: 10,
                    color: "#a6adc8",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#6c7086",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value || value === "normal" || value === "0px") return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1px 0" }}>
      <span style={{ color: "#6c7086" }}>{label}</span>
      <span style={{ color: "#cdd6f4" }}>{value}</span>
    </div>
  );
}

function ColorRow({ label, value, token }: { label: string; value: string; token: string | null }) {
  if (!value || value === "rgba(0, 0, 0, 0)" || value === "transparent") return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1px 0" }}>
      <span style={{ color: "#6c7086" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {token && (
          <span style={{ color: "#89b4fa", fontSize: 11 }}>{token}</span>
        )}
        <span
          style={{
            display: "inline-block",
            width: 14,
            height: 14,
            borderRadius: 3,
            backgroundColor: value,
            border: "1px solid rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        />
      </span>
    </div>
  );
}

export function VisualInspector({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [inspected, setInspected] = useState<InspectorData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !containerRef.current) return;
      const target = e.target as HTMLElement;
      if (!target || target === containerRef.current) return;

      const elRect = target.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const rect = new DOMRect(
        elRect.left - containerRect.left,
        elRect.top - containerRect.top + containerRef.current.scrollTop,
        elRect.width,
        elRect.height,
      );

      const computed = window.getComputedStyle(target);

      const tokens: Record<string, string> = {};
      for (const prop of TOKEN_PROPS) {
        const val = computed.getPropertyValue(prop).trim();
        if (val) tokens[prop] = val;
      }

      setInspected({
        tag: target.tagName.toLowerCase(),
        classes: target.className
          ? String(target.className).split(/\s+/).filter(Boolean)
          : [],
        rect,
        styles: {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
          padding: computed.padding,
          margin: computed.margin,
          borderRadius: computed.borderRadius,
          gap: computed.gap,
        },
        tokens,
        dataSlot: target.getAttribute("data-slot"),
        reactComponent: getReactComponentName(target),
      });
    },
    [enabled]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [enabled]
  );

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={() => {
          setEnabled((v) => !v);
          if (enabled) setInspected(null);
        }}
        style={{
          position: "fixed",
          bottom: 12,
          left: 12,
          zIndex: 100001,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.12)",
          backgroundColor: enabled ? "#3b82f6" : "#1e1e2e",
          color: enabled ? "#fff" : "#a6adc8",
          fontFamily: "ui-monospace, monospace",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          transition: "all 150ms ease",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        {enabled ? "Inspector ON" : "Inspect"}
      </button>

      <div
        onMouseMove={handleMouseMove}
        onClickCapture={handleClick}
        style={{ cursor: enabled ? "crosshair" : undefined }}
      >
        {children}
      </div>

      {enabled && inspected && (
        <>
          <InspectorOverlay data={inspected} />
          <InspectorPanel data={inspected} />
        </>
      )}
    </div>
  );
}
