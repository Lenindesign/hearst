import type { Metadata } from "next";

import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { BlocksChapter } from "@/components/specs/chapters/blocks-chapter";
import { CarouselChapter } from "@/components/specs/chapters/carousel-chapter";
import { CtaChapter } from "@/components/specs/chapters/cta-chapter";
import { LayoutChapter } from "@/components/specs/chapters/layout-chapter";
import { NavChapter } from "@/components/specs/chapters/nav-chapter";
import { ReaderChapter } from "@/components/specs/chapters/reader-chapter";
import { SystemChapter } from "@/components/specs/chapters/system-chapter";
import { TaxonomyChapter } from "@/components/specs/chapters/taxonomy-chapter";
import { TokensChapter } from "@/components/specs/chapters/tokens-chapter";
import { TypeChapter } from "@/components/specs/chapters/type-chapter";
import { SpecFilm } from "@/components/specs/spec-kit";

export const metadata: Metadata = {
  title: "Specifications | Hearst+",
  description:
    "Every Hearst+ specification on one page: CTAs, breakpoints and grid, type metrics, tokens and brands, blocks, navigation, the reader, the featured carousel and the agentic design system, each with its measurements, drawing and film.",
};

/** Chapter order and anchors. The site header links to these anchors (product-story-shell.tsx). */
const chapters = [
  ["cta", "CTAs"],
  ["layout", "Breakpoints & grid"],
  ["type", "Type metrics"],
  ["tokens", "Tokens & brands"],
  ["blocks", "Blocks"],
  ["nav", "Nav"],
  ["reader", "Reader"],
  ["carousel", "Carousel"],
  ["system", "System"],
  ["taxonomy", "Taxonomy"],
] as const;

/** Start of each chapter in the combined film (public/specs/specs-all-films.mp4), in seconds. */
const filmChapters = [
  [4, "CTAs"],
  [56, "Breakpoints & grid"],
  [156, "Type metrics"],
  [267, "Tokens & brands"],
  [441, "Blocks"],
  [701, "Nav"],
  [870, "Reader"],
  [1039, "Carousel"],
  [1168, "System"],
] as const;

export default function SpecsPage() {
  return (
    <div className="hearst-plus-theme min-h-screen bg-background font-sans text-foreground">
      <ProductHeader current="specs" />
      <main className="mx-auto max-w-[var(--width-content-max)] space-y-20 px-4 py-10 md:px-6 md:py-16 xl:px-12">
        <header className="max-w-4xl">
          <p className="type-k1 text-muted-foreground">Hearst Design System · Hearst+</p>
          <h1 className="headline mt-4 text-balance text-4xl leading-[1.05] sm:text-6xl">Specifications</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Every Hearst+ specification in one document. Each chapter covers one part of the system with values measured in the running app, a dimensional drawing, a motion film and a live reference of the real thing. Every state and variant of each component is in Storybook.
          </p>
          <nav aria-label="Chapters" className="mt-7 flex flex-wrap gap-2">
            {chapters.map(([id, label], index) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </a>
            ))}
          </nav>
        </header>

        <section id="specs-film" aria-labelledby="specs-film-title" className="scroll-mt-28 space-y-6">
          <div className="max-w-3xl">
            <p className="type-k1 text-muted-foreground">All chapters · 21 min</p>
            <h2 id="specs-film-title" className="headline mt-3 text-2xl leading-tight sm:text-3xl">Watch every chapter</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Every chapter&rsquo;s motion film in page order, each followed by a recording of its live reference. Pick a chapter to jump to it.
            </p>
          </div>
          <SpecFilm
            src="/specs/specs-all-films.mp4"
            poster="/specs/specs-all-films-poster.jpg"
            label="All specification films in chapter order, each followed by a recording of the chapter's live reference. 21 minutes, no sound."
            caption={<p><b className="text-foreground">All chapters · 21:34 · no sound.</b> Nine chapters, ten films and nine live references. <a href="/specs/specs-all-films.mp4" className="underline underline-offset-4">Download the film</a>.</p>}
            chapters={filmChapters}
          />
        </section>

        <CtaChapter />
        <LayoutChapter />
        <TypeChapter />
        <TokensChapter />
        <BlocksChapter />
        <NavChapter />
        <ReaderChapter />
        <CarouselChapter />
        <SystemChapter />
        <TaxonomyChapter />
      </main>
      <ProductFooter />
    </div>
  );
}
