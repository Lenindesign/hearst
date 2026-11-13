/**
 * Small helpers for the Blocks and Nav chapters, in the spec kit's look:
 * a table whose cells can span columns, a small note paragraph, a callout
 * and a tag. Everything else comes from spec-kit.tsx.
 */
import React from "react";

import { cn } from "@/lib/utils";

type SpanCell = { readonly span: number; readonly content: React.ReactNode; readonly spanCell: true };
type Cell = React.ReactNode | SpanCell;

/** A cell that spans `n` columns. */
export function span(n: number, content: React.ReactNode): SpanCell {
  return { span: n, content, spanCell: true };
}

function isSpan(cell: Cell): cell is SpanCell {
  return typeof cell === "object" && cell !== null && !React.isValidElement(cell) && "spanCell" in cell;
}

/** SpecTable's look, with column spans. `numeric` marks columns set in tabular figures. */
export function SpanTable({
  caption,
  headers,
  rows,
  numeric = [],
  minWidth = "40rem",
}: {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly Cell[])[];
  numeric?: readonly number[];
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-card bg-card shadow-[var(--hp-shadow-card)]">
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={`${header}-${index}`} scope="col" className="border-b border-border px-4 py-3 type-k1 text-muted-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            let column = 0;
            return (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                {row.map((cell, index) => {
                  const start = column;
                  const colSpan = isSpan(cell) ? cell.span : 1;
                  column += colSpan;
                  return (
                    <td
                      key={index}
                      colSpan={colSpan > 1 ? colSpan : undefined}
                      className={cn("px-4 py-3 align-top leading-6", start === 0 && "font-semibold", numeric.includes(start) && colSpan === 1 && "whitespace-nowrap tabular-nums")}
                    >
                      {isSpan(cell) ? cell.content : cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The HTML specs' small paragraph: a secondary note under a table or drawing. */
export function SpecNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("max-w-3xl text-sm leading-6 text-muted-foreground [&_b]:text-foreground", className)}>{children}</p>;
}

/** A highlighted status note (the HTML's `.flag`). */
export function SpecCallout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl border-l-2 border-primary bg-muted px-4 py-3 text-sm leading-6 [&_b]:text-foreground">{children}</div>;
}

/** A small caps tag (the HTML's `.tag`). */
export function SpecTag({ children }: { children: React.ReactNode }) {
  return <span className="mr-1 inline-block rounded-sm border border-border px-1.5 py-0.5 type-k1 text-primary">{children}</span>;
}
