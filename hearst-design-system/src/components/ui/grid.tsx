"use client";

/**
 * Grid System
 * -----------------------------------------------------------------------------
 * A 4 / 8 / 12 responsive grid built on Tailwind v4 utility classes.
 *
 *   Mobile  (base)    : 4 columns,  16px gutter, 16px outer padding
 *   Tablet  (md ≥768) : 8 columns,  20px gutter, 24px outer padding
 *   Desktop (lg ≥1024): 12 columns, 24px gutter, up to 48px outer padding
 *
 * Use these primitives instead of hand-rolling `grid grid-cols-*` per layout.
 * They guarantee that every page obeys the same spatial contract.
 *
 * - `PageContainer` constrains content to `--width-content-max` and applies the
 *   responsive outer padding.
 * - `Grid` is the responsive grid track (4 / 8 / 12 columns by default).
 * - `Col` declares span and start at each breakpoint using safelisted classes.
 *
 * See: Foundation / Grid System (Storybook).
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Breakpoints ─────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * The grid only changes column count at three breakpoints. We ignore `sm`
 * intentionally: jumping from 4 → 8 columns at 640px is too jittery on
 * landscape phones, so the grid stays at 4 until `md`.
 */
export const GRID_COLUMNS: Record<"mobile" | "tablet" | "desktop", number> = {
  mobile: 4,
  tablet: 8,
  desktop: 12,
};

// ─── PageContainer ───────────────────────────────────────────────────────────

export interface PageContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (default `div`). */
  as?: keyof React.JSX.IntrinsicElements;
  /** Remove the responsive outer padding (full bleed). */
  bleed?: boolean;
  /**
   * Constrain to a narrower max width. Defaults to `content` (1360px).
   * `narrow` matches an article reading column.
   */
  width?: "content" | "narrow" | "full";
}

const widthClass: Record<NonNullable<PageContainerProps["width"]>, string> = {
  content: "max-w-[var(--width-content-max)]",
  narrow: "max-w-[720px]",
  full: "max-w-none",
};

export function PageContainer({
  as: Tag = "div",
  className,
  bleed = false,
  width = "content",
  ...rest
}: PageContainerProps) {
  const Component = Tag as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  // #region agent log
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const data = {
      width: rect.width,
      left: rect.left,
      right: rect.right,
      paddingLeft: cs.paddingLeft,
      paddingRight: cs.paddingRight,
      maxWidth: cs.maxWidth,
      marginLeft: cs.marginLeft,
      marginRight: cs.marginRight,
      viewport: window.innerWidth,
    };
    fetch("http://127.0.0.1:7869/ingest/908fc3d2-a6e0-4381-89dd-35644ae2aa2c", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5e7435" },
      body: JSON.stringify({
        sessionId: "5e7435",
        location: "grid.tsx:PageContainer",
        message: "PageContainer measured",
        hypothesisId: "H1,H2,H6",
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);
  // #endregion
  return (
    <Component
      ref={ref}
      data-slot="page-container"
      className={cn(
        "mx-auto w-full",
        widthClass[width],
        !bleed && "px-4 md:px-6 lg:px-12",
        className,
      )}
      {...rest}
    />
  );
}

// ─── Grid ────────────────────────────────────────────────────────────────────

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (default `div`). */
  as?: keyof React.JSX.IntrinsicElements;
  /**
   * Override the column count at each breakpoint. Defaults to 4 / 8 / 12.
   * Pass a single number to use the same count everywhere.
   */
  columns?:
    | number
    | {
        base?: 1 | 2 | 3 | 4;
        md?: 4 | 6 | 8;
        lg?: 8 | 10 | 12;
      };
  /**
   * Override the gap. Defaults to the responsive grid gutter.
   * Use `none` for a flush layout (e.g. image mosaics).
   */
  gap?: "default" | "tight" | "loose" | "none";
  /**
   * If `true`, items align to the top of their cell instead of stretching.
   * Useful when cells have different intrinsic heights.
   */
  alignStart?: boolean;
}

const baseColsClass: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const mdColsClass: Record<4 | 6 | 8, string> = {
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  8: "md:grid-cols-8",
};

const lgColsClass: Record<8 | 10 | 12, string> = {
  8: "lg:grid-cols-8",
  10: "lg:grid-cols-10",
  12: "lg:grid-cols-12",
};

const gapClass: Record<NonNullable<GridProps["gap"]>, string> = {
  default: "gap-4 md:gap-5 lg:gap-6",
  tight: "gap-2 md:gap-3 lg:gap-4",
  loose: "gap-6 md:gap-8 lg:gap-10",
  none: "gap-0",
};

function resolveColumns(columns: GridProps["columns"]) {
  if (typeof columns === "number") {
    const n = Math.min(Math.max(columns, 1), 12);
    if (n <= 4) {
      return cn(baseColsClass[n as 1 | 2 | 3 | 4], "md:grid-cols-none lg:grid-cols-none");
    }
    if (n <= 8) {
      return cn("grid-cols-4", mdColsClass[n as 4 | 6 | 8]);
    }
    return cn("grid-cols-4", "md:grid-cols-8", lgColsClass[n as 10 | 12]);
  }

  const base = (columns?.base ?? 4) as 1 | 2 | 3 | 4;
  const md = (columns?.md ?? 8) as 4 | 6 | 8;
  const lg = (columns?.lg ?? 12) as 8 | 10 | 12;
  return cn(baseColsClass[base], mdColsClass[md], lgColsClass[lg]);
}

export function Grid({
  as: Tag = "div",
  className,
  columns,
  gap = "default",
  alignStart = false,
  ...rest
}: GridProps) {
  const Component = Tag as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  // #region agent log
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const tracks = cs.gridTemplateColumns.split(" ").map(parseFloat);
    const data = {
      width: rect.width,
      left: rect.left,
      gap: cs.gap,
      gridTemplateColumns: cs.gridTemplateColumns,
      trackCount: tracks.length,
      trackWidthPx: tracks[0],
      sumTracksPlusGaps:
        tracks.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0) +
        (tracks.length - 1) * parseFloat(cs.columnGap || "0"),
      childrenCount: el.children.length,
      viewport: window.innerWidth,
    };
    fetch("http://127.0.0.1:7869/ingest/908fc3d2-a6e0-4381-89dd-35644ae2aa2c", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5e7435" },
      body: JSON.stringify({
        sessionId: "5e7435",
        location: "grid.tsx:Grid",
        message: "Grid measured",
        hypothesisId: "H1,H4",
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);
  // #endregion
  return (
    <Component
      ref={ref}
      data-slot="grid"
      className={cn(
        "grid",
        resolveColumns(columns),
        gapClass[gap],
        alignStart && "items-start",
        className,
      )}
      {...rest}
    />
  );
}

// ─── Col ─────────────────────────────────────────────────────────────────────

type SpanBase = 1 | 2 | 3 | 4 | "full";
type SpanMd = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "full";
type SpanLg = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";

type StartMd = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type StartLg = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (default `div`). */
  as?: keyof React.JSX.IntrinsicElements;
  /** Span at base/mobile (1-4 columns or `"full"`). Defaults to `"full"`. */
  span?: SpanBase;
  /** Span at md/tablet (1-8 columns or `"full"`). */
  spanMd?: SpanMd;
  /** Span at lg/desktop (1-12 columns or `"full"`). */
  spanLg?: SpanLg;
  /** Optional column-start at md. */
  startMd?: StartMd;
  /** Optional column-start at lg. */
  startLg?: StartLg;
  /** Optional row-start at all breakpoints. Use to compose overlapping layouts. */
  rowStart?: 1 | 2 | 3 | 4;
  /** Optional row-start at md only (tablet+). */
  rowStartMd?: 1 | 2 | 3 | 4;
  /** Optional row-start at lg only (desktop+). */
  rowStartLg?: 1 | 2 | 3 | 4;
  /**
   * Lift the column up/down by an integer multiple of the grid gap.
   * Used sparingly to create intentional overlap. Use `0` to disable.
   */
  offsetYMd?: -2 | -1 | 0 | 1 | 2;
  offsetYLg?: -2 | -1 | 0 | 1 | 2;
  /** Stack the cell above siblings (use with `offsetY*` for overlap). */
  raised?: boolean;
}

const spanBase: Record<SpanBase, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  full: "col-span-full",
};

const spanMd: Record<SpanMd, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  full: "md:col-span-full",
};

const spanLg: Record<SpanLg, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
  full: "lg:col-span-full",
};

const startMd: Record<StartMd, string> = {
  1: "md:col-start-1",
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
  5: "md:col-start-5",
  6: "md:col-start-6",
  7: "md:col-start-7",
  8: "md:col-start-8",
};

const startLg: Record<StartLg, string> = {
  1: "lg:col-start-1",
  2: "lg:col-start-2",
  3: "lg:col-start-3",
  4: "lg:col-start-4",
  5: "lg:col-start-5",
  6: "lg:col-start-6",
  7: "lg:col-start-7",
  8: "lg:col-start-8",
  9: "lg:col-start-9",
  10: "lg:col-start-10",
  11: "lg:col-start-11",
  12: "lg:col-start-12",
};

const rowStartClass: Record<1 | 2 | 3 | 4, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
};

const rowStartMdClass: Record<1 | 2 | 3 | 4, string> = {
  1: "md:row-start-1",
  2: "md:row-start-2",
  3: "md:row-start-3",
  4: "md:row-start-4",
};

const rowStartLgClass: Record<1 | 2 | 3 | 4, string> = {
  1: "lg:row-start-1",
  2: "lg:row-start-2",
  3: "lg:row-start-3",
  4: "lg:row-start-4",
};

const offsetYMdClass: Record<-2 | -1 | 0 | 1 | 2, string> = {
  [-2]: "md:-translate-y-12",
  [-1]: "md:-translate-y-6",
  0: "md:translate-y-0",
  1: "md:translate-y-6",
  2: "md:translate-y-12",
};

const offsetYLgClass: Record<-2 | -1 | 0 | 1 | 2, string> = {
  [-2]: "lg:-translate-y-16",
  [-1]: "lg:-translate-y-8",
  0: "lg:translate-y-0",
  1: "lg:translate-y-8",
  2: "lg:translate-y-16",
};

export function Col({
  as: Tag = "div",
  className,
  span = "full",
  spanMd: spanMdProp,
  spanLg: spanLgProp,
  startMd: startMdProp,
  startLg: startLgProp,
  rowStart,
  rowStartMd,
  rowStartLg,
  offsetYMd,
  offsetYLg,
  raised = false,
  ...rest
}: ColProps) {
  const Component = Tag as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  // #region agent log
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const firstChild = el.firstElementChild as HTMLElement | null;
    const childRect = firstChild?.getBoundingClientRect();
    fetch("http://127.0.0.1:7869/ingest/908fc3d2-a6e0-4381-89dd-35644ae2aa2c", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5e7435" },
      body: JSON.stringify({
        sessionId: "5e7435",
        location: "grid.tsx:Col",
        message: "Col measured",
        hypothesisId: "H3,H5",
        data: {
          spanBase: span,
          spanMd: spanMdProp ?? null,
          spanLg: spanLgProp ?? null,
          startLg: startLgProp ?? null,
          width: rect.width,
          left: rect.left,
          right: rect.right,
          gridColumnStart: cs.gridColumnStart,
          gridColumnEnd: cs.gridColumnEnd,
          firstChildTag: firstChild?.tagName ?? null,
          firstChildWidth: childRect?.width ?? null,
          firstChildLeft: childRect?.left ?? null,
          firstChildRight: childRect?.right ?? null,
          overflowsCol: childRect ? childRect.right > rect.right + 0.5 : false,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [span, spanMdProp, spanLgProp, startLgProp]);
  // #endregion
  return (
    <Component
      ref={ref}
      data-slot="col"
      className={cn(
        "min-w-0",
        spanBase[span],
        spanMdProp && spanMd[spanMdProp],
        spanLgProp && spanLg[spanLgProp],
        startMdProp && startMd[startMdProp],
        startLgProp && startLg[startLgProp],
        rowStart && rowStartClass[rowStart],
        rowStartMd && rowStartMdClass[rowStartMd],
        rowStartLg && rowStartLgClass[rowStartLg],
        offsetYMd !== undefined && offsetYMdClass[offsetYMd],
        offsetYLg !== undefined && offsetYLgClass[offsetYLg],
        raised && "relative z-10",
        className,
      )}
      {...rest}
    />
  );
}

// ─── Grid Overlay (debug guide) ──────────────────────────────────────────────

export interface GridOverlayProps {
  /** Visually highlight the grid columns. Renders inside a `relative` parent. */
  className?: string;
  /** Hide on mobile (recommended — overlay is a tablet/desktop guide). */
  hideOnMobile?: boolean;
}

/**
 * Renders 12 columns layered behind content. Use inside a `relative` parent
 * — typically a `PageContainer`. Columns 5-8 appear at `md`, 9-12 at `lg`.
 * Aria-hidden so it never reaches assistive tech.
 */
export function GridOverlay({
  className,
  hideOnMobile = true,
}: GridOverlayProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  // #region agent log
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const firstCol = el.children[0] as HTMLElement | undefined;
    const lastVisibleCol = Array.from(el.children)
      .filter((c) => (c as HTMLElement).offsetParent !== null)
      .pop() as HTMLElement | undefined;
    const firstRect = firstCol?.getBoundingClientRect();
    const lastRect = lastVisibleCol?.getBoundingClientRect();
    fetch("http://127.0.0.1:7869/ingest/908fc3d2-a6e0-4381-89dd-35644ae2aa2c", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5e7435" },
      body: JSON.stringify({
        sessionId: "5e7435",
        location: "grid.tsx:GridOverlay",
        message: "GridOverlay measured",
        hypothesisId: "H1,H4",
        data: {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          gap: cs.gap,
          gridTemplateColumns: cs.gridTemplateColumns,
          firstColLeft: firstRect?.left ?? null,
          firstColWidth: firstRect?.width ?? null,
          lastColRight: lastRect?.right ?? null,
          visibleColCount: Array.from(el.children).filter(
            (c) => (c as HTMLElement).offsetParent !== null,
          ).length,
          viewport: window.innerWidth,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);
  // #endregion
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-4 inset-y-0 z-0 grid grid-cols-4 gap-4 md:inset-x-6 md:grid-cols-8 md:gap-5 lg:inset-x-12 lg:grid-cols-12 lg:gap-6",
        hideOnMobile && "hidden sm:grid",
        className,
      )}
    >
      {Array.from({ length: 12 }).map((_, index) => {
        const column = index + 1;
        return (
          <div
            key={column}
            className={cn(
              "relative h-full rounded-sm border border-primary/15 bg-primary/[0.04]",
              column > 4 && column <= 8 && "hidden md:block",
              column > 8 && "hidden lg:block",
            )}
          >
            <span className="sticky top-2 m-1 inline-flex h-4 min-w-5 items-center justify-center rounded-sm bg-background/80 px-1 text-[10px] font-semibold text-primary/70 shadow-sm">
              {column}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── useBreakpoint hook ──────────────────────────────────────────────────────

/**
 * Returns the active breakpoint based on `window.matchMedia`. Use sparingly —
 * for documentation, debug overlays, or behavior that genuinely cannot be
 * expressed in CSS. Prefer Tailwind's responsive prefixes for layout.
 */
export function useBreakpoint(): Breakpoint {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const queries = (Object.entries(BREAKPOINTS) as [Breakpoint, number][])
      .filter(([, min]) => min > 0)
      .map(([, min]) => window.matchMedia(`(min-width: ${min}px)`));
    queries.forEach((q) => q.addEventListener("change", onStoreChange));
    return () => {
      queries.forEach((q) => q.removeEventListener("change", onStoreChange));
    };
  }, []);

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return "base" as Breakpoint;
    const entries = Object.entries(BREAKPOINTS) as [Breakpoint, number][];
    let active: Breakpoint = "base";
    for (const [name, min] of entries) {
      if (min === 0) continue;
      if (window.matchMedia(`(min-width: ${min}px)`).matches) {
        active = name;
      }
    }
    return active;
  }, []);

  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "base" as Breakpoint,
  );
}
