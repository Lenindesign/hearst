"use client";

import * as React from "react";

import {
  FeaturedStoryCarousel,
  LifestyleRiverCard,
  LifestyleRiverImage,
  getLifestyleRiverImagePreload,
  ReaderArticleBody,
} from "@/components/hearst-plus";
import { EditorialHomepageSection } from "@/components/home-page";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getFeaturedCardColors } from "@/lib/brand-banners";
import type { LiveArticleData } from "@/lib/live-feed-types";

import { LiveBrandFrame, liveBrands, type LiveBrand } from "./live-kit";

/** Production story components on /specs/, fed with the static story catalog. */

type StoriesByBrand = Record<string, LifestyleRiverStory[]>;

const noop = () => undefined;
const noSavedIds: string[] = [];

function storiesFor(storiesByBrand: StoriesByBrand, slug: string) {
  return storiesByBrand[slug]?.length ? storiesByBrand[slug] : Object.values(storiesByBrand).find((list) => list.length) ?? [];
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</p>;
}

/** The same article shape the reader builds from a fetched story, so ReaderArticleBody renders its ready state. */
function readyArticle(story: LifestyleRiverStory, imageStory: LifestyleRiverStory): LiveArticleData {
  return {
    sourceUrl: story.sourceUrl ?? "https://www.hearst.com/",
    byline: story.byline ?? `${story.brand} editors`,
    publishedAt: story.publishedAt,
    blocks: [
      { type: "paragraph", text: story.summary },
      { type: "heading", text: "What to know" },
      { type: "paragraph", text: "Body copy sets B1, 18 on 28, and keeps the publication face. Headings, quotes and lists below use the reader roles from this chapter." },
      { type: "quote", text: "The reader keeps one rhythm across every publication theme." },
      { type: "list", items: ["Body B1 in the publication text face", "Section headings and pull quotes in the headline face", "Lists and captions on the same 4 px grid"] },
      { type: "image", url: imageStory.image, alt: imageStory.title, caption: imageStory.title, credit: imageStory.brand },
    ],
  };
}

/** Type chapter: the story card and the reader body, the two stacks UI-TYPE-001 measures. */
export function TypeStacksLive({ storiesByBrand, brands = liveBrands }: { storiesByBrand: StoriesByBrand; brands?: LiveBrand[] }) {
  return (
    <LiveBrandFrame
      id="type"
      brands={brands}
      note={<p>The production <code className="text-foreground">LifestyleRiverCard</code> and <code className="text-foreground">ReaderArticleBody</code> with a story from the selected publication. Sizes and line heights come from the role utilities; only the faces change by brand.</p>}
    >
      {(slug) => {
        const stories = storiesFor(storiesByBrand, slug);
        const [story, imageStory = stories[0]] = stories;
        if (!story) return null;
        return (
          <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <div className="min-w-0">
              <Caption>Story card stack</Caption>
              <LifestyleRiverCard story={story} onOpen={noop} layoutOverride="cards" />
            </div>
            <div className="min-w-0 max-w-[680px]">
              <Caption>Reader stack</Caption>
              <ReaderArticleBody story={story} liveArticle={{ status: "ready", data: readyArticle(story, imageStory) }} onOpenImage={noop} />
            </div>
          </div>
        );
      }}
    </LiveBrandFrame>
  );
}

/** Blocks chapter: a story card row and two production block modes. */
export function BlocksLive({ storiesByBrand, brands = liveBrands }: { storiesByBrand: StoriesByBrand; brands?: LiveBrand[] }) {
  return (
    <LiveBrandFrame
      id="blocks"
      brands={brands}
      note={<p>The production <code className="text-foreground">EditorialHomepageSection</code>, in its Featured + Row and Feature + Sidebar modes, and the story card it is built from. Columns follow this frame&rsquo;s width through the <code className="text-foreground">hp-block</code> container, so resize the window to see them reflow.</p>}
    >
      {(slug) => {
        const stories = storiesFor(storiesByBrand, slug);
        if (stories.length < 5) return null;
        return (
          <div className="min-w-0 space-y-12">
            <EditorialHomepageSection section={{ title: "Featured + Row", stories: stories.slice(0, 5) }} selectionLabel="Hearst+ Selection" onOpen={noop} savedIds={noSavedIds} onSave={noop} featureFirstGrid />
            <EditorialHomepageSection section={{ title: "Feature + Sidebar", stories: stories.slice(3, 8).length === 5 ? stories.slice(3, 8) : stories.slice(0, 5) }} selectionLabel="Hearst+ Selection" onOpen={noop} savedIds={noSavedIds} onSave={noop} featureSidebar />
          </div>
        );
      }}
    </LiveBrandFrame>
  );
}

/** Carousel chapter: the production featured carousel at river width. */
export function CarouselLive({ storiesByBrand, brands = liveBrands }: { storiesByBrand: StoriesByBrand; brands?: LiveBrand[] }) {
  return (
    <LiveBrandFrame
      id="carousel"
      brands={brands}
      note={<p>The production <code className="text-foreground">FeaturedStoryCarousel</code> with five stories, capped at the 632 px river width. Swipe, drag or use the arrow keys. The text card takes the publication color from <code className="text-foreground">getFeaturedCardColors</code>, as on the home.</p>}
    >
      {(slug) => {
        const stories = storiesFor(storiesByBrand, slug).slice(0, 5);
        if (!stories.length) return null;
        return (
          <div className="mx-auto min-w-0 max-w-[632px]">
            <FeaturedStoryCarousel
              key={slug}
              stories={stories}
              editionLabel="Today’s Picks"
              cardColors={getFeaturedCardColors("all", slug.startsWith("hearst-") ? null : slug)}
              onOpenStory={noop}
              getImagePreload={getLifestyleRiverImagePreload}
              renderImage={(story, _index, active) => (
                <LifestyleRiverImage story={story} className="h-full w-full" priority={active} />
              )}
            />
          </div>
        );
      }}
    </LiveBrandFrame>
  );
}
