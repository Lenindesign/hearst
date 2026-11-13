/**
 * Spec kit: the building blocks of the single specifications page (/specs/).
 *
 * Every spec is a chapter (SpecChapter, an <h2> with an anchor id such as
 * "reader"); its parts are sections (SpecSection, <h3>, ids prefixed with the
 * chapter: "reader-anatomy"). Tables, film, drawing sheets, column lists and
 * findings share one look, so the nine specs read as one document. Films load
 * nothing until played (preload="none"), so the long page stays light.
 */
import type React from "react";

import { cn } from "@/lib/utils";

export { SpecFilm } from "./spec-film";

export type SpecChapterProps = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  lede?: React.ReactNode;
  meta?: readonly (readonly [string, React.ReactNode])[];
  contents?: readonly (readonly [string, string])[];
  children: React.ReactNode;
};

export function SpecChapter({ id, number, kicker, title, lede, meta, contents, children }: SpecChapterProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 space-y-12 border-t-2 border-foreground pt-12">
      <header className="max-w-4xl">
        <p className="type-k1 text-muted-foreground">{number} · {kicker}</p>
        <h2 id={`${id}-title`} className="headline mt-3 text-balance text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
        {lede ? <div className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{lede}</div> : null}
        {meta?.length ? (
          <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[max-content_minmax(0,1fr)]">
            {meta.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="type-k1 text-muted-foreground sm:pt-0.5">{label}</dt>
                <dd className="min-w-0 leading-6 text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {contents?.length ? (
          <nav aria-label={`${title} contents`} className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
            {contents.map(([label, href]) => (
              <a key={href} href={href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function SpecSection({
  id,
  kicker,
  title,
  intro,
  children,
}: {
  id: string;
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 space-y-6">
      <div className="max-w-3xl">
        {kicker ? <p className="type-k1 text-muted-foreground">{kicker}</p> : null}
        <h3 id={`${id}-title`} className="headline mt-3 text-2xl leading-tight sm:text-3xl">{title}</h3>
        {intro ? <div className="mt-3 space-y-3 leading-7 text-muted-foreground">{intro}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function SpecSubhead({ children }: { children: React.ReactNode }) {
  return <h4 className="type-k1 text-muted-foreground">{children}</h4>;
}

export function SpecProse({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("max-w-3xl space-y-3 leading-7 text-foreground [&_code]:text-[0.92em]", className)}>{children}</div>;
}

export function SpecTable({
  caption,
  headers,
  rows,
  numeric = [],
  codeFirst = true,
  minWidth = "40rem",
}: {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
  numeric?: readonly number[];
  /** Render the first column as code (tokens, selectors, breakpoints). */
  codeFirst?: boolean;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-card bg-card shadow-[var(--hp-shadow-card)]">
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={`${header}-${index}`} scope="col" className={cn("border-b border-border px-4 py-3 type-k1 text-muted-foreground", numeric.includes(index) && "text-right")}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={index} className={cn("px-4 py-3 align-top leading-6", index === 0 && "font-semibold", numeric.includes(index) && "text-right tabular-nums")}>
                  {index === 0 && codeFirst && typeof cell === "string" ? <code>{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A dimensional drawing sheet (image or SVG), linking to its full HTML sheet with notes. */
export function SpecSheet({
  src,
  alt,
  width,
  height,
  href,
  caption,
  minWidth = 960,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  href?: string;
  caption?: React.ReactNode;
  minWidth?: number;
}) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- static drawing sheet
    <img src={src} width={width} height={height} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" style={{ minWidth }} />
  );
  return (
    <figure className="min-w-0">
      <div className="overflow-x-auto rounded-card bg-white shadow-[var(--hp-shadow-card)]">
        {href ? <a href={href} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{image}</a> : image}
      </div>
      {caption || href ? (
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{caption}</span>
          {href ? <a href={href} className="inline-flex min-h-11 items-center font-semibold text-foreground underline-offset-4 hover:underline">Open the full sheet with notes</a> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Two or three columns of short headed lists (anatomy notes, rules). */
export function SpecColumns({ children, columns = 2 }: { children: React.ReactNode; columns?: 2 | 3 }) {
  return (
    <div className={cn("grid gap-x-10 gap-y-8 [&_li]:leading-7 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5", columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
      {children}
    </div>
  );
}

/** One finding or open issue: what is wrong, where, and the fix. */
export function SpecFinding({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-card bg-card p-5 shadow-[var(--hp-shadow-card)]">
      <h4 className="font-semibold">{title}</h4>
      <div className="mt-2 space-y-2 leading-7 text-muted-foreground [&_b]:text-foreground">{children}</div>
    </article>
  );
}
