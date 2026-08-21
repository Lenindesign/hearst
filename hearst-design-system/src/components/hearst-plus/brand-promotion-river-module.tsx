"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandRoute } from "@/lib/hearst-routes";
import { BrandSourceIcon } from "./brand-source-icon";
import type { BrandPromotionMatch } from "./brand-promotion-model";
import {
  getLifestyleCardKind,
  getLifestyleKindLabel,
  LifestyleRiverImage,
} from "./story-presentation";
import { getLifestyleByline } from "./story-metadata";
import { cn } from "@/lib/utils";

const aeFamilyBrandSlugs = new Set(["a-e", "history", "lifetime", "lmn", "fyi", "vice-tv", "biography"]);

function getEditorialFormatLabel(story: LifestyleRiverStory) {
  const kind = getLifestyleCardKind(story);
  if (kind === "article" || kind === "gallery" || kind === "video") return null;
  return getLifestyleKindLabel(kind, story);
}

export type BrandPromotionRiverModuleProps = {
  promotion?: BrandPromotionMatch | null;
  onOpenStory: (storyId: string) => void;
};

function PromotionStoryAction({
  story,
  onOpenStory,
  className,
  children,
}: {
  story: LifestyleRiverStory;
  onOpenStory: (storyId: string) => void;
  className: string;
  children: React.ReactNode;
}) {
  if (story.sourceUrl) {
    if (story.sourceUrl.startsWith("/")) {
      return (
        <Link
          href={story.sourceUrl}
          className={className}
          aria-label={`Open story: ${story.title}`}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={story.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className={className}
        aria-label={`Open story: ${story.title}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenStory(story.id)}
      className={className}
      aria-label={`Open story: ${story.title}`}
    >
      {children}
    </button>
  );
}

export function BrandPromotionRiverModule({
  promotion,
  onOpenStory,
}: BrandPromotionRiverModuleProps) {
  const [featuredStory, ...secondaryStories] = promotion?.stories ?? [];

  if (!promotion || !featuredStory) return null;

  const headingId = `brand-spotlight-${promotion.brandSlug}`;
  const topicSummary = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  }).format(promotion.topics.slice(0, 3));
  const description = topicSummary
    ? `Explore ${topicSummary} from ${promotion.brand}.`
    : `Explore more from ${promotion.brand}.`;
  const brandHref = promotion.href ?? getHearstBrandRoute(promotion.brandSlug);
  const isAEFamilyPromotion = aeFamilyBrandSlugs.has(promotion.brandSlug);

  const renderFormatLabel = (story: LifestyleRiverStory) => {
    const formatLabel = getEditorialFormatLabel(story);
    if (!formatLabel) return null;

    return (
      <span className={cn(
        "flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest",
        isAEFamilyPromotion ? "text-[#79B9FF]" : "text-primary",
      )}>
        <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
        {formatLabel}
      </span>
    );
  };

  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-[8px] border shadow-[var(--hp-shadow-card)]",
        isAEFamilyPromotion
          ? "border-[#2A2E35] bg-[#0D1014] text-white"
          : "border-border bg-[var(--hp-surface)]",
      )}
      aria-labelledby={headingId}
    >
      <div className={cn(
        "border-b p-5 sm:p-6",
        isAEFamilyPromotion ? "border-[#2A2E35] bg-[#15181D]" : "border-border",
      )}>
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <a
            href={brandHref}
            className={cn(
              "flex min-h-11 shrink-0 items-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
              isAEFamilyPromotion ? "text-white hover:text-[#79B9FF]" : "text-foreground hover:text-primary",
            )}
            aria-label={`Open ${promotion.brand} publication`}
          >
            <BrandLogo
              slug={promotion.brandSlug}
              color={promotion.brandSlug === "car-and-driver" ? undefined : "currentColor"}
              className="[&_svg]:h-9 [&_svg]:w-auto [&_svg]:max-w-[180px]"
            />
          </a>
          <span className={cn(
            "hidden h-10 w-px shrink-0 sm:block",
            isAEFamilyPromotion ? "bg-[#3A414B]" : "bg-border",
          )} aria-hidden />
          <div className="min-w-0">
            <h2
              id={headingId}
              aria-label={`Brand spotlight: ${promotion.brand}`}
              className={cn(
                "text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest",
                isAEFamilyPromotion ? "text-[#79B9FF]" : "text-primary",
              )}
            >
              Brand spotlight
            </h2>
            <p className={cn(
              "mt-1 text-sm leading-6",
              isAEFamilyPromotion ? "text-white/70" : "text-muted-foreground",
            )}>
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className={cn("min-w-0 p-5 sm:p-6", isAEFamilyPromotion && "bg-[#0D1014]")}>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <PromotionStoryAction
            story={featuredStory}
            onOpenStory={onOpenStory}
            className="group min-w-0 self-start text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <LifestyleRiverImage story={featuredStory} className="aspect-[4/3] w-full rounded-[8px]" />
            <span className="mt-4 block">
              {renderFormatLabel(featuredStory)}
              <span className={cn(
                "headline mt-2 block text-2xl leading-tight",
                isAEFamilyPromotion ? "text-white" : "text-foreground",
              )}>
                {featuredStory.title}
              </span>
              <span className={cn(
                "mt-2 line-clamp-3 [display:-webkit-box] text-sm leading-6",
                isAEFamilyPromotion ? "text-white/70" : "text-muted-foreground",
              )}>
                {featuredStory.summary}
              </span>
            </span>
          </PromotionStoryAction>

          <div className={cn(
            "@container divide-y",
            isAEFamilyPromotion ? "divide-[#2A2E35]" : "divide-border",
          )}>
            {secondaryStories.map((story) => (
              <PromotionStoryAction
                key={story.id}
                story={story}
                onOpenStory={onOpenStory}
                className="group grid w-full grid-cols-[88px_minmax(0,1fr)] gap-4 py-4 text-left first:pt-0 last:pb-0 focus:outline-none focus:ring-2 focus:ring-primary/30 @max-[119px]:grid-cols-1 @max-[119px]:gap-3 sm:grid-cols-[112px_minmax(0,1fr)]"
              >
                <LifestyleRiverImage story={story} className="aspect-square w-full rounded-[8px]" />
                <span className="min-w-0">
                  {renderFormatLabel(story)}
                  <span className={cn(
                    "headline mt-1 block text-base leading-tight",
                    isAEFamilyPromotion ? "text-white" : "text-foreground",
                  )}>
                    {story.title}
                  </span>
                  <span className={cn(
                    "mt-1 block text-xs leading-5",
                    isAEFamilyPromotion ? "text-white/60" : "text-muted-foreground",
                  )}>
                    {story.topic} · {getLifestyleByline(story)}
                  </span>
                </span>
              </PromotionStoryAction>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
