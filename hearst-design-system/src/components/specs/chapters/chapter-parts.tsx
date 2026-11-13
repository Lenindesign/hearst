/**
 * Small parts shared by the reader, carousel and system chapters: headed
 * groups inside SpecColumns, small notes, and findings that keep their
 * "F1 · LAYOUT" tag and anchor id.
 */
import type React from "react";

import { SpecFinding, SpecSubhead } from "@/components/specs/spec-kit";

/** One headed group in a SpecColumns column (h4 + list or paragraph). */
export function ColGroup({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <SpecSubhead>{title}</SpecSubhead>
      {children}
    </div>
  );
}

/** A column of SpecColumns holding several headed groups. */
export function Col({ children }: { children: React.ReactNode }) {
  return <div className="min-w-0 space-y-6">{children}</div>;
}

/** Ordered list styled like SpecColumns' unordered lists. */
export function NumberedList({ children }: { children: React.ReactNode }) {
  return <ol className="mt-2 list-decimal space-y-2 pl-5 [&_li]:leading-7">{children}</ol>;
}

/** A small, muted note (the HTML specs' .small paragraphs). */
export function SmallNote({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{children}</p>;
}

export function FindingList({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

/** A finding with its tag line ("F1 · LAYOUT") and an anchor id. */
export function TaggedFinding({ id, tag, title, children }: { id: string; tag: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28">
      <SpecFinding title={title}>
        <p className="font-mono text-xs font-semibold text-foreground">{tag}</p>
        {children}
      </SpecFinding>
    </div>
  );
}
