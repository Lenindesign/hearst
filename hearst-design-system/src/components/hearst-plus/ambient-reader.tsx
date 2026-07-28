"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { BrandLogo } from "../brand-logo";
import type { LifestyleRiverStory } from "../lifestyle-river-types";
import { useModalIsolation } from "../ui/use-modal-isolation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Moon,
  SlidersHorizontal,
  Sun,
  X,
} from "../ui/icons";
import { getHearstBrandSection } from "@/lib/hearst-routes";
import {
  ambientInterstitialThemes,
  type AmbientInterstitialAdvertiser,
} from "@/lib/ambient-interstitial-themes";
import { ambientReaderTheme } from "@/lib/ambient-reader-theme";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { themeOptions } from "@/lib/theme-options";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { cn } from "@/lib/utils";
import {
  verifiedAmbientCommerceCollections,
  type VerifiedAmbientCommerceCollection,
} from "@/lib/ambient-commerce-catalog.generated";
import {
  ambientReaderCenterSurfaceIndex,
  getSettledAmbientSurfaceIndex,
} from "@/lib/ambient-reader-snap";
import { getSelectedBrandTheme } from "./brand-theme-resolution";
import {
  formatReaderPublishedDate,
  formatReaderUpdatedDate,
  isMeaningfulArticleUpdate,
} from "./reader-action-bar";
import type { ReaderArticleLoadState } from "./reader-article-body";
import type { FullscreenReaderImage } from "./fullscreen-image-viewer";
import { getLifestyleByline } from "./story-metadata";

/**
 * Production Ambient Reader presentation and interaction boundary.
 *
 * The routed Hearst+ reader and Storybook specifications import this same
 * module. Page-level discovery, route history, and article loading remain in
 * the owning template and enter through the explicit component contract.
 */

export type AmbientReaderDensity = "compact" | "comfortable" | "airy";

export function isCompleteAmbientArticle(liveArticle?: ReaderArticleLoadState) {
  if (liveArticle?.status !== "ready") return false;

  const textBlockCount = liveArticle.data.blocks.filter((block) => block.type !== "image").length;
  const imageBlockCount = liveArticle.data.blocks.filter((block) => block.type === "image").length;

  return textBlockCount >= 4 || (textBlockCount >= 2 && imageBlockCount >= 3);
}

export function getAmbientReaderState(
  story: LifestyleRiverStory,
  liveArticle?: ReaderArticleLoadState
): "loading" | "ready" | "unavailable" | undefined {
  if (!story.sourceUrl || story.videoUrl) return undefined;
  if (isCompleteAmbientArticle(liveArticle)) return "ready";
  if (liveArticle?.status === "ready" || liveArticle?.status === "error") return "unavailable";
  return "loading";
}

function getAmbientReaderMinutes(story: LifestyleRiverStory, article: LiveArticleData) {
  const wordCount = article.blocks.reduce((total, block) => {
    if (block.type === "image") return total;
    if (block.type === "list") return total + block.items.join(" ").split(/\s+/).filter(Boolean).length;
    return total + block.text.split(/\s+/).filter(Boolean).length;
  }, 0);
  const sourceEstimate = Number.parseInt(story.readTime, 10);
  return Math.max(1, Number.isFinite(sourceEstimate) ? sourceEstimate : Math.ceil(wordCount / 220));
}

export function getAmbientRelatedScore(
  currentStory: LifestyleRiverStory,
  candidateStory: LifestyleRiverStory,
  currentIndex: number,
  candidateIndex: number
) {
  const sharedTagCount = candidateStory.tags.filter((tag) => currentStory.tags.includes(tag)).length;
  let score = 0;
  if (candidateStory.brandSlug === currentStory.brandSlug) score += 12;
  if (candidateStory.topic === currentStory.topic) score += 10;
  if (getAmbientStoryDestination(candidateStory.brandSlug) === getAmbientStoryDestination(currentStory.brandSlug)) score += 5;
  score += Math.min(sharedTagCount, 4) * 3;
  score += Math.max(0, 4 - Math.abs(candidateIndex - currentIndex));
  score += Math.min(candidateStory.popularity, 100) / 100;
  return score;
}

function AmbientReaderImageBlock({
  block,
  compactTop = false,
  onOpenImage,
}: {
  block: Extract<LiveArticleData["blocks"][number], { type: "image" }>;
  compactTop?: boolean;
  onOpenImage: (image: FullscreenReaderImage) => void;
}) {
  const [naturalRatio, setNaturalRatio] = React.useState<number | null>(null);
  const isPortrait = naturalRatio !== null && naturalRatio < 0.9;
  const imageAspectRatio = naturalRatio ?? 1.5;

  return (
    <figure
      className={cn(
        "relative left-1/2 w-[calc(100vw-2.5rem)] max-w-[1180px] -translate-x-1/2 sm:w-[calc(100vw-4rem)] lg:w-[calc(100vw-6rem)]",
        compactTop ? "pb-4 pt-1 sm:pb-7 sm:pt-2" : "py-4 sm:py-7"
      )}
      style={compactTop ? { marginTop: "calc(var(--ambient-block-gap) * -0.55)" } : undefined}
    >
      <button
        type="button"
        className={cn(
          "group relative block overflow-hidden bg-[var(--ambient-rule)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isPortrait ? "mx-auto w-full max-w-[min(100%,720px)]" : "w-full"
        )}
        style={{ aspectRatio: imageAspectRatio }}
        onClick={() => onOpenImage({
          src: block.url,
          alt: block.alt,
          caption: block.caption,
          credit: block.credit,
        })}
        aria-label={`View image fullscreen: ${block.alt}`}
      >
        <Image
          src={block.url}
          alt={block.alt}
          fill
          sizes={isPortrait
            ? "(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1024px) min(720px, calc(100vw - 4rem)), 720px"
            : "(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1024px) calc(100vw - 4rem), 1180px"}
          className="object-contain transition-opacity group-hover:opacity-95"
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalWidth > 0 && image.naturalHeight > 0) {
              setNaturalRatio(image.naturalWidth / image.naturalHeight);
            }
          }}
        />
      </button>
      {block.caption || block.credit ? (
        <figcaption className={cn(
          "mt-3 font-brand text-xs leading-5 text-[var(--ambient-muted)]",
          isPortrait && "mx-auto max-w-[min(100%,720px)]"
        )}>
          {[block.caption, block.credit].filter(Boolean).join(" · ")}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function getAmbientBrandForeground(background: string) {
  if (!/^#[\da-f]{6}$/i.test(background)) return ambientReaderTheme.lightContent;
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(background.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast >= whiteContrast
    ? ambientReaderTheme.darkContent
    : ambientReaderTheme.lightContent;
}

export type AmbientReaderDestination = "lifestyle" | "autos" | "flux" | "ew";

const defaultAmbientDestinationThemeSlugs: Record<AmbientReaderDestination, string> = {
  lifestyle: "hearst-lifestyle",
  autos: "hearst-plus",
  flux: "hearst-flux",
  ew: "hearst-ew",
};

function getAmbientStoryDestination(brandSlug: string): AmbientReaderDestination {
  return getHearstBrandSection(brandSlug);
}

function getAmbientDestinationTheme(
  destination: AmbientReaderDestination,
  destinationThemeSlugs?: Partial<Record<AmbientReaderDestination, string>>,
) {
  const destinationThemeSlug =
    destinationThemeSlugs?.[destination] ?? defaultAmbientDestinationThemeSlugs[destination];
  return themeOptions.find((theme) => theme.slug === destinationThemeSlug) ?? themeOptions[0];
}

function AmbientReaderHeroImage({
  story,
  hasPortraitHeroImage,
  className,
  imageClassName,
  sizes,
  onLoad,
  onOpenImage,
  galleryImageCount = 1,
}: {
  story: LifestyleRiverStory;
  hasPortraitHeroImage: boolean;
  className: string;
  imageClassName?: string;
  sizes?: string;
  onLoad: (ratio: number) => void;
  onOpenImage?: (image: FullscreenReaderImage) => void;
  galleryImageCount?: number;
}) {
  const image = (
    <Image
      src={story.image}
      alt={story.title}
      fill
      sizes={sizes ?? (hasPortraitHeroImage
        ? "(max-width: 1024px) 100vw, 34vw"
        : "(max-width: 1024px) 100vw, 62vw")}
      className={cn("object-cover", imageClassName)}
      priority
      onLoad={(event) => {
        const loadedImage = event.currentTarget;
        if (loadedImage.naturalWidth > 0 && loadedImage.naturalHeight > 0) {
          onLoad(loadedImage.naturalWidth / loadedImage.naturalHeight);
        }
      }}
    />
  );

  return (
    <figure className={cn("relative overflow-hidden bg-black", className)}>
      {onOpenImage ? (
        <button
          type="button"
          className="group absolute inset-0 cursor-zoom-in overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
          onClick={() => onOpenImage({
            src: story.image,
            alt: story.title,
            credit: story.imageCredit,
          })}
          aria-label={galleryImageCount > 1
            ? `Open photo gallery for ${story.title}`
            : `Open image viewer for ${story.title}`}
        >
          {image}
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {galleryImageCount > 1 ? `View ${galleryImageCount} photos` : "View image"}
          </span>
        </button>
      ) : image}
      {story.imageCredit ? (
        <figcaption className="pointer-events-none absolute bottom-3 right-4 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
          {story.imageCredit}
        </figcaption>
      ) : null}
    </figure>
  );
}

function AmbientReaderHeroMeta({
  story,
  article,
  ambientPublishedAt,
  hasAmbientPublishedDate,
  className,
}: {
  story: LifestyleRiverStory;
  article: LiveArticleData;
  ambientPublishedAt?: string;
  hasAmbientPublishedDate: boolean;
  className?: string;
}) {
  return (
    <>
      <div className={cn(
        "mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-current/25 pt-5 text-xs font-semibold uppercase tracking-[0.12em]",
        className
      )}>
        <span>{getLifestyleByline(story, article)}</span>
        {hasAmbientPublishedDate ? (
          <>
            <span aria-hidden>·</span>
            <time dateTime={ambientPublishedAt}>{formatReaderPublishedDate(ambientPublishedAt!)}</time>
          </>
        ) : null}
      </div>
      {isMeaningfulArticleUpdate(ambientPublishedAt, article.updatedAt) ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] opacity-75">
          Updated <time dateTime={article.updatedAt}>{formatReaderUpdatedDate(article.updatedAt!)}</time>
        </p>
      ) : null}
    </>
  );
}

function AmbientReaderHero({
  story,
  article,
  destination,
  brandPrimary,
  brandForeground,
  hasPortraitHeroImage,
  ambientPublishedAt,
  hasAmbientPublishedDate,
  onHeroImageRatio,
  onOpenImage,
}: {
  story: LifestyleRiverStory;
  article: LiveArticleData;
  destination: AmbientReaderDestination;
  brandPrimary: string;
  brandForeground: string;
  hasPortraitHeroImage: boolean;
  ambientPublishedAt?: string;
  hasAmbientPublishedDate: boolean;
  onHeroImageRatio: (ratio: number) => void;
  onOpenImage: (image: FullscreenReaderImage) => void;
}) {
  const metaProps = {
    story,
    article,
    ambientPublishedAt,
    hasAmbientPublishedDate,
  };
  const heroGalleryImageCount = 1 + new Set(
    article.blocks
      .filter((block): block is Extract<LiveArticleData["blocks"][number], { type: "image" }> => (
        block.type === "image" && block.url !== story.image
      ))
      .map((block) => block.url)
  ).size;
  const isMotorTrend = story.brandSlug === "motortrend";
  const usesBuzzHeadline = story.brandSlug === "road-and-track";

  if (destination === "autos") {
    return (
      <section
        className="min-h-[78vh] bg-[var(--ambient-autos-surface)] text-[var(--ambient-dark-ink)]"
        style={{
          "--ambient-autos-surface": ambientReaderTheme.autosSurface,
          "--ambient-dark-ink": ambientReaderTheme.dark.ink,
        } as React.CSSProperties}
        data-ambient-layout="autos"
        aria-label="Autos article opening"
      >
        <AmbientReaderHeroImage
          story={story}
          hasPortraitHeroImage={hasPortraitHeroImage}
          className="min-h-[42vh] border-b border-white/25 sm:min-h-[56vh] lg:min-h-[62vh]"
          sizes="100vw"
          onLoad={onHeroImageRatio}
          onOpenImage={onOpenImage}
          galleryImageCount={heroGalleryImageCount}
        />
        <div
          className={cn(
            "mx-auto grid max-w-[1600px] gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)] lg:gap-16 lg:px-[clamp(3rem,6vw,7rem)]",
            isMotorTrend && "max-w-none"
          )}
          style={isMotorTrend ? { backgroundColor: brandPrimary, color: brandForeground } : undefined}
        >
          <div className="min-w-0">
            <p className={cn(
              "mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]",
              !isMotorTrend && "text-white/70"
            )}>
              <span
                className="h-2.5 w-10"
                style={{ backgroundColor: isMotorTrend ? brandForeground : brandPrimary }}
                aria-hidden
              />
              {story.topic} · {story.brand}
            </p>
            <h1
              className={cn(
                "max-w-[20ch] break-words font-headline text-[clamp(2.8rem,5.2vw,5.8rem)] font-[var(--font-headline-weight)] tracking-[-0.025em] text-balance",
                usesBuzzHeadline ? "leading-[1.06]" : "leading-[0.95]"
              )}
            >
              {story.title}
            </h1>
          </div>
          <div className="self-end border-t border-current/25 pt-6 lg:border-t-0 lg:pt-0">
            <p className={cn(
              "max-w-xl font-brand-secondary text-lg leading-7 sm:text-xl sm:leading-8",
              !isMotorTrend && "text-white/80"
            )}>
              {story.summary}
            </p>
            <AmbientReaderHeroMeta
              {...metaProps}
              className={isMotorTrend ? undefined : "text-white/75"}
            />
          </div>
        </div>
      </section>
    );
  }

  if (destination === "ew") {
    return (
      <section
        className="grid min-h-[78vh] bg-black lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]"
        data-ambient-layout="enthusiast-wellness"
        aria-label="Enthusiast and Wellness article opening"
      >
        <AmbientReaderHeroImage
          story={story}
          hasPortraitHeroImage={hasPortraitHeroImage}
          className="min-h-[48vh] border-b-4 border-black lg:min-h-[78vh] lg:border-b-0 lg:border-r-4"
          imageClassName={story.brandSlug === "oprah-daily"
            ? "lg:origin-top lg:scale-[1.12]"
            : undefined}
          onLoad={onHeroImageRatio}
          onOpenImage={onOpenImage}
          galleryImageCount={heroGalleryImageCount}
        />
        <div
          className="flex min-w-0 flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-[clamp(3rem,5vw,6rem)] lg:py-20"
          style={{ backgroundColor: brandPrimary, color: brandForeground }}
        >
          <p className="mb-7 border-y border-current/30 py-3 text-xs font-bold uppercase tracking-[0.2em]">
            {story.topic} · {story.brand}
          </p>
          <h1 className="max-w-full break-words font-headline text-[clamp(2.6rem,4.2vw,4.8rem)] font-[var(--font-headline-weight)] uppercase leading-[0.94] tracking-[-0.025em] text-balance">
            {story.title}
          </h1>
          <p className="mt-8 max-w-xl font-brand-secondary text-xl leading-8 opacity-90 sm:text-2xl">
            {story.summary}
          </p>
          <AmbientReaderHeroMeta {...metaProps} />
        </div>
      </section>
    );
  }

  if (destination === "lifestyle") {
    return (
      <section
        className="relative bg-[var(--ambient-paper)]"
        data-ambient-layout="lifestyle"
        aria-label="Lifestyle article opening"
      >
        <div className="grid min-h-[calc(100dvh-4rem)] w-full overflow-hidden bg-[var(--ambient-paper)] lg:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex min-w-0 flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-[clamp(3rem,5vw,6.5rem)] lg:py-20">
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: brandPrimary }}>
              {story.topic} · {story.brand}
            </p>
            <h1 className="max-w-full break-words font-headline text-[clamp(2.65rem,4.2vw,5.2rem)] font-[var(--font-headline-weight)] leading-[1.02] tracking-[-0.025em] text-balance">
              {story.title}
            </h1>
            <p className="mt-8 max-w-xl font-brand-secondary text-xl leading-8 text-[var(--ambient-muted)] sm:text-2xl">
              {story.summary}
            </p>
            <AmbientReaderHeroMeta {...metaProps} className="text-[var(--ambient-muted)]" />
          </div>
          <AmbientReaderHeroImage
            story={story}
            hasPortraitHeroImage={hasPortraitHeroImage}
            className="min-h-[48vh] h-full lg:min-h-[calc(100dvh-4rem)]"
            onLoad={onHeroImageRatio}
            onOpenImage={onOpenImage}
            galleryImageCount={heroGalleryImageCount}
          />
        </div>
        <a
          href="#ambient-article-body"
          className="group absolute left-1/2 top-[calc(100dvh-7rem)] z-10 inline-flex -translate-x-1/2 items-center gap-2 bg-[var(--ambient-paper)]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ambient-ink)] backdrop-blur-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:bottom-5 lg:top-auto"
        >
          Continue reading
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
        </a>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "grid min-h-[70vh]",
        hasPortraitHeroImage
          ? "lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]"
          : "lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]"
      )}
      data-ambient-layout="fashion-luxury"
      aria-label="Fashion and Luxury article opening"
    >
      <div
        className="flex min-w-0 flex-col justify-center overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-[clamp(3rem,6vw,7rem)] lg:py-20"
        style={{ backgroundColor: brandPrimary, color: brandForeground }}
      >
        <div className="max-w-full">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] opacity-80">
            {story.topic} · {story.brand}
          </p>
          <h1 className="max-w-full break-words font-headline text-[clamp(2.6rem,3.7vw,4.75rem)] font-[var(--font-headline-weight)] leading-[1.08] tracking-[-0.03em] text-balance">
            {story.title}
          </h1>
          <p className="mt-7 max-w-xl font-brand-secondary text-xl leading-8 opacity-90 sm:text-2xl">
            {story.summary}
          </p>
          <AmbientReaderHeroMeta {...metaProps} />
        </div>
      </div>
      <AmbientReaderHeroImage
        story={story}
        hasPortraitHeroImage={hasPortraitHeroImage}
        className="min-h-[42vh] lg:min-h-[70vh]"
        onLoad={onHeroImageRatio}
        onOpenImage={onOpenImage}
        galleryImageCount={heroGalleryImageCount}
      />
    </section>
  );
}

function isCanonicalAmazonProductUrl(url: string) {
  return /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/.test(url);
}

function isVerifiedAmbientCommerceCollection(collection: VerifiedAmbientCommerceCollection) {
  return collection.products.length > 0
    && collection.products.every((product) => (
      Boolean(product.name)
      && Boolean(product.imageUrl)
      && Boolean(product.sourceUrl)
      && isCanonicalAmazonProductUrl(product.amazonUrl)
    ));
}

function getAmbientCommerceConfig(story: LifestyleRiverStory): VerifiedAmbientCommerceCollection | null {
  return verifiedAmbientCommerceCollections.find((collection) => {
    const isEligibleBrand = !collection.brandSlugs || collection.brandSlugs.includes(story.brandSlug);
    return isEligibleBrand
      && collection.storyIds.includes(story.id)
      && isVerifiedAmbientCommerceCollection(collection);
  }) ?? null;
}

function AmbientCommerceModule({ config }: { config: VerifiedAmbientCommerceCollection }) {
  return (
    <section
      aria-labelledby="ambient-commerce-title"
      className="mt-16 border-y border-[var(--ambient-rule)] py-8 sm:py-10"
      data-ambient-commerce="amazon-prototype"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--ambient-ink)]">{config.eyebrow}</p>
          <h2 id="ambient-commerce-title" className="mt-2 font-headline text-3xl font-[var(--font-headline-weight)] leading-tight text-[var(--ambient-ink)]">
            {config.title}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[var(--ambient-muted)]">
          {config.description}
        </p>
      </div>
      <div className={`mt-7 grid gap-3 ${config.products.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {config.products.map((product) => (
          <article key={product.name} className="flex min-h-44 flex-col border border-[var(--ambient-rule)] p-4 sm:p-5">
            <div className="mb-4 flex h-32 items-center justify-center overflow-hidden bg-white p-3">
              {/* Product images are sourced from the brands' public product pages. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt="" className="h-full w-full object-contain" loading="lazy" />
            </div>
            <h3 className="font-brand text-base font-bold leading-snug text-[var(--ambient-ink)]">{product.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--ambient-muted)]">{product.context}</p>
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex min-h-10 items-center pt-5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--ambient-ink)] underline decoration-[var(--ambient-ink)]/50 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              View on Amazon
              <span className="sr-only"> for {product.name}</span>
            </a>
          </article>
        ))}
      </div>
      <p className="mt-5 text-xs leading-5 text-[var(--ambient-muted)]">
        Prototype commerce links. We do not earn a commission from these Amazon links; prices, sellers, and availability may change.
      </p>
    </section>
  );
}

function AmbientReaderSwipeArticleSurface({
  story,
  article,
  colorMode,
  destinationThemeSlugs,
}: {
  story: LifestyleRiverStory;
  article: LiveArticleData;
  colorMode: "light" | "dark";
  destinationThemeSlugs?: Partial<Record<AmbientReaderDestination, string>>;
}) {
  const destination = getAmbientStoryDestination(story.brandSlug);
  const destinationTheme = getAmbientDestinationTheme(destination, destinationThemeSlugs);
  const contextualTheme = getSelectedBrandTheme(
    { name: story.brand, slug: story.brandSlug },
    destinationTheme
  ) ?? destinationTheme;
  const themeCssVars = {
    ...brandToCssVars(contextualTheme, colorMode),
    "--ambient-paper": ambientReaderTheme[colorMode].paper,
    "--ambient-ink": ambientReaderTheme[colorMode].ink,
    "--ambient-muted": ambientReaderTheme[colorMode].muted,
    "--ambient-rule": ambientReaderTheme[colorMode].rule,
  } as React.CSSProperties;
  const publishedAt = article.publishedAt ?? story.publishedAt;
  const hasPublishedDate = Number.isFinite(Date.parse(publishedAt ?? ""));
  const brandPrimary = contextualTheme.colors["1"] ?? ambientReaderTheme.fallbackBrandPrimary;
  const previewBlocks = article.blocks
    .filter((block): block is { type: "paragraph" | "heading"; text: string } =>
      block.type === "paragraph" || block.type === "heading"
    )
    .slice(0, 4);

  return (
    <div
      className="hearst-plus-theme h-full overflow-hidden bg-[var(--ambient-paper)] text-[var(--ambient-ink)]"
      data-mode={colorMode}
      data-testid="ambient-reader-preloaded-article"
      style={themeCssVars}
    >
      <header className="relative z-10 border-b border-[var(--ambient-rule)] bg-[var(--ambient-paper)]/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-10">
          <div className="h-6 max-w-[180px] sm:h-7">
            <BrandLogo
              slug={story.brandSlug}
              color={colorMode === "dark"
                ? ambientReaderTheme.dark.ink
                : story.brandSlug === "motortrend"
                  ? ambientReaderTheme.motorTrendPrimary
                  : undefined}
              className="flex h-full items-center [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
            />
          </div>
          <span className="hidden truncate text-xs font-semibold text-[var(--ambient-muted)] md:inline">
            Ambient Reader
          </span>
        </div>
      </header>
      <div className="h-[calc(100dvh-4rem)] overflow-hidden">
        <AmbientReaderHero
          story={story}
          article={article}
          destination={destination}
          brandPrimary={brandPrimary}
          brandForeground={getAmbientBrandForeground(brandPrimary)}
          hasPortraitHeroImage={false}
          ambientPublishedAt={publishedAt}
          hasAmbientPublishedDate={hasPublishedDate}
          onHeroImageRatio={() => undefined}
          onOpenImage={() => undefined}
        />
        <section className="mx-auto max-w-[68ch] space-y-5 px-5 py-10 font-brand-secondary text-lg leading-8 sm:px-8">
          {previewBlocks.map((block, index) => block.type === "heading" ? (
            <h2 key={index} className="font-headline text-3xl font-[var(--font-headline-weight)] leading-tight">
              {block.text}
            </h2>
          ) : (
            <p key={index}>{block.text}</p>
          ))}
        </section>
      </div>
    </div>
  );
}

export type { AmbientInterstitialAdvertiser } from "@/lib/ambient-interstitial-themes";

export interface AmbientArticleReaderProps {
  story: LifestyleRiverStory;
  article: LiveArticleData;
  destinationThemeSlugs?: Partial<Record<AmbientReaderDestination, string>>;
  previousStory?: LifestyleRiverStory;
  nextStory?: LifestyleRiverStory;
  previousArticle?: LiveArticleData;
  nextArticle?: LiveArticleData;
  previousInterstitialAdvertiser?: AmbientInterstitialAdvertiser | null;
  nextInterstitialAdvertiser?: AmbientInterstitialAdvertiser | null;
  discoveryStatus?: "idle" | "loading" | "error" | "complete";
  discoveryScope?: string;
  discoveryCount?: number;
  relatedStories?: LifestyleRiverStory[];
  onClose: () => void;
  onNavigateStory: (storyId: string) => void;
  onOpenImage: (image: FullscreenReaderImage) => void;
  showInterstitialAd?: boolean;
  interstitialAdvertiser?: AmbientInterstitialAdvertiser;
  onDismissInterstitialAd?: () => void;
}

export function AmbientArticleReader({
  story,
  article,
  destinationThemeSlugs,
  previousStory,
  nextStory,
  previousArticle,
  nextArticle,
  previousInterstitialAdvertiser,
  nextInterstitialAdvertiser,
  discoveryStatus = "idle",
  discoveryScope = "brand-category",
  discoveryCount = 1,
  relatedStories = [],
  onClose,
  onNavigateStory,
  onOpenImage,
  showInterstitialAd = false,
  interstitialAdvertiser = "van-cleef",
  onDismissInterstitialAd = () => undefined,
}: AmbientArticleReaderProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(
    typeof document !== "undefined" && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  );
  const trackFrameRef = React.useRef<number | null>(null);
  const trackSettleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackNavigationPendingRef = React.useRef(false);
  const [colorMode, setColorMode] = React.useState<"light" | "dark">("light");
  const [density, setDensity] = React.useState<AmbientReaderDensity>("airy");
  const [progress, setProgress] = React.useState(0);
  const [heroImageRatios, setHeroImageRatios] = React.useState<Record<string, number>>({});
  useModalIsolation(true, dialogRef);
  const destination = getAmbientStoryDestination(story.brandSlug);
  const destinationTheme = getAmbientDestinationTheme(destination, destinationThemeSlugs);
  const contextualTheme = getSelectedBrandTheme(
    { name: story.brand, slug: story.brandSlug },
    destinationTheme
  ) ?? destinationTheme;
  const themeCssVars = {
    ...brandToCssVars(contextualTheme, colorMode),
    "--ambient-paper": ambientReaderTheme[colorMode].paper,
    "--ambient-ink": ambientReaderTheme[colorMode].ink,
    "--ambient-muted": ambientReaderTheme[colorMode].muted,
    "--ambient-rule": ambientReaderTheme[colorMode].rule,
  } as React.CSSProperties;
  const readMinutes = getAmbientReaderMinutes(story, article);
  const ambientPublishedAt = article.publishedAt ?? story.publishedAt;
  const hasAmbientPublishedDate = Number.isFinite(Date.parse(ambientPublishedAt ?? ""));
  const brandPrimary = contextualTheme.colors["1"] ?? ambientReaderTheme.fallbackBrandPrimary;
  const brandForeground = getAmbientBrandForeground(brandPrimary);
  const heroImageRatio = heroImageRatios[story.id] ?? null;
  const hasPortraitHeroImage = heroImageRatio !== null && heroImageRatio < 0.9;
  const firstParagraphIndex = article.blocks.findIndex((block) => block.type === "paragraph");
  const commerceConfig = getAmbientCommerceConfig(story);
  const densityStyles: Record<AmbientReaderDensity, string> = {
    compact: "max-w-[68ch] text-[17px] leading-7 [--ambient-block-gap:1.25rem]",
    comfortable: "max-w-[62ch] text-[19px] leading-8 [--ambient-block-gap:1.75rem]",
    airy: "max-w-[58ch] text-[21px] leading-9 [--ambient-block-gap:2.25rem]",
  };
  const densityOrder: AmbientReaderDensity[] = ["compact", "comfortable", "airy"];

  React.useEffect(() => {
    const restoreTarget = restoreFocusRef.current;
    return () => {
      window.requestAnimationFrame(() => {
        if (restoreTarget?.isConnected) restoreTarget.focus();
      });
    };
  }, []);

  const updateProgress = React.useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight;
    setProgress(scrollableHeight > 0 ? Math.min(100, (scroller.scrollTop / scrollableHeight) * 100) : 100);
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    updateProgress();
  }, [density, showInterstitialAd, story.id, updateProgress]);

  const scrollToReaderSurface = React.useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    const targetStory = direction < 0 ? previousStory : nextStory;
    const canRevealCurrentArticle = showInterstitialAd && direction > 0;
    if (!track || (!targetStory && !canRevealCurrentArticle)) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: (ambientReaderCenterSurfaceIndex + direction) * track.clientWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [nextStory, previousStory, showInterstitialAd]);

  const settleReaderSurface = React.useCallback(() => {
    const track = trackRef.current;
    if (!track || trackNavigationPendingRef.current) return;

    const settledIndex = getSettledAmbientSurfaceIndex(track.scrollLeft, track.clientWidth);
    if (settledIndex === ambientReaderCenterSurfaceIndex) return;

    const direction = settledIndex < ambientReaderCenterSurfaceIndex ? -1 : 1;
    if (showInterstitialAd) {
      trackNavigationPendingRef.current = true;
      onDismissInterstitialAd();
      if (direction < 0 && previousStory) onNavigateStory(previousStory.id);
      return;
    }

    const targetStory = direction < 0 ? previousStory : nextStory;
    if (!targetStory) {
      track.scrollTo({
        left: ambientReaderCenterSurfaceIndex * track.clientWidth,
        behavior: "smooth",
      });
      return;
    }

    trackNavigationPendingRef.current = true;
    onNavigateStory(targetStory.id);
  }, [
    nextStory,
    onDismissInterstitialAd,
    onNavigateStory,
    previousStory,
    showInterstitialAd,
  ]);

  const handleTrackScroll = React.useCallback(() => {
    if (trackFrameRef.current !== null) window.cancelAnimationFrame(trackFrameRef.current);
    trackFrameRef.current = window.requestAnimationFrame(() => {
      trackFrameRef.current = null;
      if (trackSettleTimerRef.current) clearTimeout(trackSettleTimerRef.current);
      trackSettleTimerRef.current = setTimeout(settleReaderSurface, 140);
    });
  }, [settleReaderSurface]);

  React.useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: ambientReaderCenterSurfaceIndex * track.clientWidth,
      behavior: "auto",
    });
    trackNavigationPendingRef.current = false;
  }, [nextStory?.id, previousStory?.id, showInterstitialAd, story.id]);

  React.useEffect(() => {
    const handleResize = () => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({
        left: ambientReaderCenterSurfaceIndex * track.clientWidth,
        behavior: "auto",
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (trackFrameRef.current !== null) window.cancelAnimationFrame(trackFrameRef.current);
      if (trackSettleTimerRef.current) clearTimeout(trackSettleTimerRef.current);
    };
  }, []);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (showInterstitialAd) onDismissInterstitialAd();
      else onClose();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      scrollToReaderSurface(event.key === "ArrowLeft" ? -1 : 1);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ) ?? []
    ).filter((element) => element.getClientRects().length > 0);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const previousSurface = showInterstitialAd
    ? previousStory && previousArticle
      ? <AmbientReaderSwipeArticleSurface story={previousStory} article={previousArticle} colorMode={colorMode} destinationThemeSlugs={destinationThemeSlugs} />
      : null
    : previousInterstitialAdvertiser
      ? <AmbientReaderInterstitialAd advertiser={previousInterstitialAdvertiser} onDismiss={() => undefined} />
      : previousStory && previousArticle
        ? <AmbientReaderSwipeArticleSurface story={previousStory} article={previousArticle} colorMode={colorMode} destinationThemeSlugs={destinationThemeSlugs} />
        : null;
  const nextSurface = showInterstitialAd
    ? <AmbientReaderSwipeArticleSurface story={story} article={article} colorMode={colorMode} destinationThemeSlugs={destinationThemeSlugs} />
    : nextInterstitialAdvertiser
      ? <AmbientReaderInterstitialAd advertiser={nextInterstitialAdvertiser} onDismiss={() => undefined} />
      : nextStory && nextArticle
        ? <AmbientReaderSwipeArticleSurface story={nextStory} article={nextArticle} colorMode={colorMode} destinationThemeSlugs={destinationThemeSlugs} />
        : null;

  return createPortal(
    <div
      ref={dialogRef}
      className="hearst-plus-theme fixed inset-0 z-[220] bg-[var(--ambient-paper)] text-[var(--ambient-ink)]"
      data-mode={colorMode}
      style={themeCssVars}
      role="dialog"
      aria-modal="true"
      aria-label={`Ambient Reader: ${story.title}`}
      onKeyDown={handleDialogKeyDown}
    >
      <p className="sr-only">
        Swipe horizontally or use the previous and next controls to move between articles and advertisements.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {discoveryStatus === "loading" ? "Loading more relevant articles." : ""}
      </p>
      <div
        ref={trackRef}
        className="flex h-[100dvh] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
        data-testid="ambient-reader-scroll-snap-track"
        data-ambient-discovery-status={discoveryStatus}
        data-ambient-discovery-scope={discoveryScope}
        data-ambient-discovery-count={discoveryCount}
        data-ambient-current-brand={story.brandSlug}
        data-ambient-current-section={destination}
        data-ambient-current-category={story.topic}
        onScroll={handleTrackScroll}
      >
        <section
          className="h-[100dvh] w-full shrink-0 snap-center snap-always overflow-hidden bg-[var(--ambient-paper)]"
          data-ambient-reader-surface="previous"
          aria-hidden="true"
          inert
        >
          {previousSurface}
        </section>
        <section
          className="h-[100dvh] w-full shrink-0 snap-center snap-always overflow-hidden bg-[var(--ambient-paper)]"
          data-ambient-reader-surface="current"
        >
          {showInterstitialAd ? (
            <AmbientReaderInterstitialAd advertiser={interstitialAdvertiser} onDismiss={onDismissInterstitialAd} />
          ) : (
          <div
            ref={scrollRef}
            className="h-[100dvh] overflow-x-clip overflow-y-auto overscroll-y-contain bg-[var(--ambient-paper)]"
            onScroll={updateProgress}
          >
        <header className="sticky top-0 z-50 border-b border-[var(--ambient-rule)] bg-[var(--ambient-paper)]/95 backdrop-blur-sm">
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--ambient-rule)]" aria-hidden>
            <div className="h-full bg-primary transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
          <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-1 px-2 sm:gap-3 sm:px-6 lg:px-10">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-6 w-full max-w-[120px] sm:h-7 sm:max-w-[180px]">
                <BrandLogo
                  slug={story.brandSlug}
                  color={colorMode === "dark"
                    ? ambientReaderTheme.dark.ink
                    : story.brandSlug === "motortrend"
                      ? ambientReaderTheme.motorTrendPrimary
                      : undefined}
                  className="flex h-full items-center [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
                />
              </div>
              <span className="hidden truncate text-xs font-semibold text-[var(--ambient-muted)] md:inline">
                Ambient Reader
              </span>
            </div>
            <button
              type="button"
              onClick={() => scrollToReaderSurface(-1)}
              disabled={!previousStory}
              className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 px-2 text-xs font-semibold text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={previousStory ? `Previous article: ${previousStory.title}` : "Previous article unavailable"}
              title={previousStory ? `Previous: ${previousStory.title}` : "Previous article unavailable"}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              <span className="hidden xl:inline">Prev</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToReaderSurface(1)}
              disabled={!nextStory}
              className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 px-2 text-xs font-semibold text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={nextStory ? `Next article: ${nextStory.title}` : "Next article unavailable"}
              title={nextStory ? `Next: ${nextStory.title}` : "Next article unavailable"}
            >
              <span className="hidden xl:inline">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <span className="mx-1 hidden h-5 w-px bg-[var(--ambient-rule)] sm:block" aria-hidden />
            <button
              type="button"
              onClick={() => setDensity((current) => densityOrder[(densityOrder.indexOf(current) + 1) % densityOrder.length])}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-xs font-semibold capitalize text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Reading density: ${density}. Change density`}
              title="Change reading density"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{density}</span>
            </button>
            <button
              type="button"
              onClick={() => setColorMode((current) => current === "light" ? "dark" : "light")}
              className="inline-flex h-11 w-11 items-center justify-center text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={colorMode === "light" ? "Use dark reader theme" : "Use light reader theme"}
              title={colorMode === "light" ? "Dark theme" : "Light theme"}
            >
              {colorMode === "light" ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
            </button>
            <span className="hidden items-center gap-1.5 text-xs font-semibold tabular-nums text-[var(--ambient-muted)] sm:inline-flex">
              <Clock className="h-4 w-4" aria-hidden />
              {readMinutes} min
            </span>
            <span className="hidden min-w-10 text-right text-xs font-semibold tabular-nums text-[var(--ambient-muted)] lg:inline">
              {Math.round(progress)}%
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Close Ambient Reader"
              title="Close Ambient Reader"
              autoFocus
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </header>

        <main>
          <AmbientReaderHero
            story={story}
            article={article}
            destination={destination}
            brandPrimary={brandPrimary}
            brandForeground={brandForeground}
            hasPortraitHeroImage={hasPortraitHeroImage}
            ambientPublishedAt={ambientPublishedAt}
            hasAmbientPublishedDate={hasAmbientPublishedDate}
            onHeroImageRatio={(ratio) => setHeroImageRatios((current) =>
              current[story.id] === ratio
                ? current
                : { ...current, [story.id]: ratio }
            )}
            onOpenImage={onOpenImage}
          />

          <section
            id="ambient-article-body"
            className={cn(
              "relative mx-auto max-w-[1440px] scroll-mt-16 px-5 sm:px-8 lg:px-12",
              destination === "lifestyle"
                ? "py-12 sm:py-14 lg:py-16"
                : destination === "autos"
                  ? "pt-12 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-32"
                : "py-16 sm:py-24 lg:py-32",
              destination === "autos" && "border-t-4 border-primary"
            )}
            data-ambient-body={destination}
          >
            {destination === "flux" ? (
              <div className="pointer-events-none absolute left-8 top-28 hidden text-xs font-semibold tabular-nums text-[var(--ambient-muted)] xl:block">
                01
                <span className="mt-3 block h-px w-8 bg-[var(--ambient-rule)]" />
              </div>
            ) : null}
            <article className={cn("mx-auto font-brand-secondary text-[var(--ambient-ink)]", densityStyles[density])}>
              <div className="space-y-[var(--ambient-block-gap)]">
                {article.blocks.map((block, index) => {
                  if (block.type === "image") {
                    return (
                      <AmbientReaderImageBlock
                        key={`${block.url}-${index}`}
                        block={block}
                        compactTop={article.blocks[index - 1]?.type === "heading"}
                        onOpenImage={onOpenImage}
                      />
                    );
                  }
                  if (block.type === "heading") {
                    return <h2 key={index} className="pt-6 font-headline text-[clamp(2rem,4vw,3.5rem)] font-[var(--font-headline-weight)] leading-[1.05] tracking-[-0.025em] text-balance">{block.text}</h2>;
                  }
                  if (block.type === "quote") {
                    return <blockquote key={index} className="my-12 border-y border-[var(--ambient-rule)] py-8 font-headline text-[clamp(1.75rem,3.5vw,3rem)] font-[var(--font-headline-weight)] leading-tight text-balance">“{block.text}”</blockquote>;
                  }
                  if (block.type === "list") {
                    return <ul key={index} className="list-disc space-y-3 pl-6">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
                  }
                  return (
                    <p
                      key={index}
                      className={cn(
                        "text-pretty",
                        index === firstParagraphIndex && "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-headline first-letter:text-[4.8em] first-letter:font-[var(--font-headline-weight)] first-letter:leading-[0.78] first-letter:text-primary"
                      )}
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
              {commerceConfig ? <AmbientCommerceModule config={commerceConfig} /> : null}
              <footer className="mt-20 border-t border-[var(--ambient-rule)] pt-8 font-brand text-sm text-[var(--ambient-muted)]">
                <p>End of article · {story.brand}</p>
                {relatedStories.length > 0 ? (
                  <section className="mt-10" aria-label="Related Ambient Reader stories">
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                          Keep reading
                        </p>
                        <h2 className="mt-2 font-headline text-2xl font-[var(--font-headline-weight)] leading-tight text-[var(--ambient-ink)]">
                          Related ambient reads
                        </h2>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {relatedStories.map((relatedStory) => (
                        <button
                          key={relatedStory.id}
                          type="button"
                          onClick={() => onNavigateStory(relatedStory.id)}
                          className="group grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-t border-[var(--ambient-rule)] py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <span className="relative block aspect-square overflow-hidden bg-[var(--ambient-rule)]">
                            <Image
                              src={relatedStory.image}
                              alt=""
                              fill
                              sizes="88px"
                              className="object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            />
                          </span>
                          <span className="min-w-0 self-center">
                            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                              {relatedStory.topic} · {relatedStory.brand}
                            </span>
                            <span className="mt-1 block font-headline text-xl font-[var(--font-headline-weight)] leading-tight text-[var(--ambient-ink)] text-balance">
                              {relatedStory.title}
                            </span>
                            <span className="mt-2 block text-xs font-semibold text-[var(--ambient-muted)]">
                              Open in Ambient Reader
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}
              </footer>
            </article>
          </section>
        </main>
          </div>
          )}
        </section>
        <section
          className="h-[100dvh] w-full shrink-0 snap-center snap-always overflow-hidden bg-[var(--ambient-paper)]"
          data-ambient-reader-surface="next"
          aria-hidden="true"
          inert
        >
          {nextSurface}
        </section>
      </div>
    </div>,
    document.body
  );
}

const vanCleefSnowflakeUrl = "https://www.vancleefarpels.com/us/en/collections/high-jewelry/classic-high-jewelry/snowflake.html?category=all";
const vanCleefLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/0/06/Van_Cleef_Arpels_logo.svg";
const vanCleefCampaignImageUrl = "https://www.vancleefarpels.com/content/dam/vancleefarpels/collections/high-jewelry/classic-high-jewelry/univers-corpo-2024/van-cleef-arpels-classic-high-jewelry-1-snowflake-cover-1328x747.jpg";

export function getAmbientInterstitialAdvertiser(
  story: LifestyleRiverStory | undefined,
  visitNumber: number,
): AmbientInterstitialAdvertiser {
  const destination = story ? getAmbientStoryDestination(story.brandSlug) : "lifestyle";
  if (destination === "ew") return "princess";
  if (destination === "autos") return visitNumber % 6 === 0 ? "lexus" : "porsche";
  if (story?.brandSlug === "harpers-bazaar") return "marriott";
  if (story?.brandSlug === "esquire") return "lexus";
  return visitNumber % 6 === 0 ? "blancpain" : "van-cleef";
}

function getAmbientInterstitialCssVars(
  advertiser: AmbientInterstitialAdvertiser,
): React.CSSProperties {
  const theme = ambientInterstitialThemes[advertiser];
  return {
    "--ambient-ad-shell": theme.shell,
    "--ambient-ad-surface": theme.surface,
    "--ambient-ad-ink": theme.ink,
    "--ambient-ad-muted": theme.muted,
    "--ambient-ad-body": theme.body,
    "--ambient-ad-cta": theme.cta,
    "--ambient-ad-cta-content": theme.ctaContent,
    "--ambient-ad-cta-hover": theme.ctaHover,
    "--ambient-ad-media": theme.media,
    "--ambient-ad-overlay": theme.overlay,
  } as React.CSSProperties;
}

function AmbientReaderInterstitialAd({ advertiser, onDismiss }: { advertiser: AmbientInterstitialAdvertiser; onDismiss: () => void }) {
  if (advertiser === "blancpain") {
    return <BlancpainInterstitialAd onDismiss={onDismiss} />;
  }
  if (advertiser === "lexus") {
    return <LexusInterstitialAd onDismiss={onDismiss} />;
  }
  if (advertiser === "marriott") {
    return <MarriottInterstitialAd onDismiss={onDismiss} />;
  }
  if (advertiser === "porsche") {
    return <PorscheInterstitialAd onDismiss={onDismiss} />;
  }
  if (advertiser === "princess") {
    return <PrincessInterstitialAd onDismiss={onDismiss} />;
  }

  return (
    <div className="relative h-full w-full bg-[var(--ambient-ad-shell)]" style={getAmbientInterstitialCssVars("van-cleef")} role="region" aria-roledescription="advertisement" aria-labelledby="ambient-ad-title" aria-describedby="ambient-ad-description">
      <div className="relative grid h-full w-full grid-rows-[minmax(0,11fr)_minmax(15rem,9fr)] bg-[var(--ambient-ad-surface)] text-[var(--ambient-ad-ink)] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-4 top-4 z-30 inline-flex h-11 items-center border border-[var(--ambient-ad-ink)]/55 bg-[var(--ambient-ad-surface)]/40 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:bg-[var(--ambient-ad-ink)] hover:text-[var(--ambient-ad-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-ink)] sm:right-8 sm:top-8 sm:px-4 sm:text-[10px] lg:right-10 lg:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-5 sm:p-8 lg:p-16">
          <div className="flex items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vanCleefLogoUrl} alt="Van Cleef & Arpels" className="h-auto w-[min(11rem,62%)] brightness-0 invert sm:w-[min(14rem,68%)] lg:w-[min(17rem,76%)]" />
          </div>
          <div className="max-w-xl py-3 sm:py-6 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ambient-ad-muted)] sm:text-[10px] sm:tracking-[0.28em]">Advertisement · High jewelry</p>
            <h2 id="ambient-ad-title" className="mt-3 font-serif text-[clamp(2.25rem,10vw,3.25rem)] leading-[0.94] tracking-[-0.04em] sm:mt-4 lg:mt-6 lg:text-[clamp(3rem,6vw,6.5rem)] lg:leading-[0.92]">Snowflake</h2>
            <p id="ambient-ad-description" className="mt-3 max-w-md font-serif text-base leading-6 text-[var(--ambient-ad-body)] sm:mt-4 sm:text-lg sm:leading-7 lg:mt-7 lg:text-2xl lg:leading-8">Discover a constellation of diamonds and the savoir-faire of Van Cleef &amp; Arpels.</p>
          </div>
          <a href={vanCleefSnowflakeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center bg-[var(--ambient-ad-cta)] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ambient-ad-cta-content)] transition-colors hover:bg-[var(--ambient-ad-cta-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-cta)] sm:min-h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em]">Explore the collection</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[var(--ambient-ad-media)] lg:min-h-full">
          {/* The official campaign asset is used as a still because the public collection page does not expose a stable embeddable video URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vanCleefCampaignImageUrl} alt="Van Cleef & Arpels Snowflake high jewelry" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[image:var(--ambient-ad-overlay)]" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Van Cleef &amp; Arpels · Snowflake</p>
        </div>
      </div>
    </div>
  );
}

const blancpainUrl = "https://www.blancpain.com/en-us";
const blancpainHeroVideoUrl = "https://assets.blancpain.com/asset/6e1cc3cd-1b01-4aef-b28f-b28b79af9d61/WebUrl/Villeret_F_16-9_4k.mp4";

function BlancpainInterstitialAd({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative h-full w-full bg-[var(--ambient-ad-shell)]" style={getAmbientInterstitialCssVars("blancpain")} role="region" aria-roledescription="advertisement" aria-labelledby="blancpain-ad-title" aria-describedby="blancpain-ad-description">
      <div className="relative grid h-full w-full grid-rows-[minmax(0,11fr)_minmax(15rem,9fr)] bg-[var(--ambient-ad-surface)] text-[var(--ambient-ad-ink)] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-4 top-4 z-30 inline-flex h-11 items-center border border-[var(--ambient-ad-ink)]/45 bg-[var(--ambient-ad-surface)]/70 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:bg-[var(--ambient-ad-ink)] hover:text-[var(--ambient-ad-cta-content)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-ink)] sm:right-8 sm:top-8 sm:px-4 sm:text-[10px] lg:right-10 lg:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-5 sm:p-8 lg:p-16">
          <div className="flex items-center justify-between gap-4">
            <div className="font-serif text-base tracking-[0.24em] sm:text-xl sm:tracking-[0.28em] lg:text-2xl" aria-label="Blancpain logo">BLANCPAIN <span className="text-[0.55em] tracking-[0.18em]">1735</span></div>
          </div>
          <div className="max-w-xl py-3 sm:py-6 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ambient-ad-muted)] sm:text-[10px] sm:tracking-[0.28em]">Advertisement · Fine watchmaking</p>
            <h2 id="blancpain-ad-title" className="mt-3 font-serif text-[clamp(2.25rem,10vw,3.25rem)] leading-[0.94] tracking-[-0.04em] sm:mt-4 lg:mt-6 lg:text-[clamp(3rem,6vw,6.5rem)] lg:leading-[0.92]">The Thinnest Argument</h2>
            <p id="blancpain-ad-description" className="mt-3 max-w-md font-serif text-base leading-6 text-[var(--ambient-ad-body)] sm:mt-4 sm:text-lg sm:leading-7 lg:mt-7 lg:text-2xl lg:leading-8">Discover Blancpain’s latest timepieces, where watchmaking excellence becomes a way of life.</p>
          </div>
          <a href={blancpainUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center bg-[var(--ambient-ad-cta)] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ambient-ad-cta-content)] transition-colors hover:bg-[var(--ambient-ad-cta-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-cta)] sm:min-h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em]">Discover Blancpain</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[var(--ambient-ad-media)] lg:min-h-full">
          <video className="absolute inset-0 h-full w-full object-cover" src={blancpainHeroVideoUrl} autoPlay muted loop playsInline preload="metadata" aria-label="Blancpain timepiece film" />
          <div className="absolute inset-0 bg-[image:var(--ambient-ad-overlay)]" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Blancpain · Villeret</p>
        </div>
      </div>
    </div>
  );
}

const lexusRxOffersUrl = "https://www.lexus.com/models/RX-hybrid/offers?showOffers=current&zip=92656&cid=FT%3Acy26_na-market_national_retail_new-car_model-sustain_as_na-model_na-trim_cv_feb%3AP3C3CD9%3A19289%3A287222%3A10419950%3A5016352%3A38953306&trim=rxh-1";
const lexusLogoUrl = "/logos/lexus.svg";
const lexusRxHighResolutionImageUrl = "https://www.the360mag.com/wp-content/uploads/2022/06/lexus-rx-scaled.jpg";

function LexusInterstitialAd({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative h-full w-full bg-[var(--ambient-ad-shell)]" style={getAmbientInterstitialCssVars("lexus")} role="region" aria-roledescription="advertisement" aria-labelledby="lexus-ad-title" aria-describedby="lexus-ad-description">
      <div className="relative grid h-full w-full grid-rows-[minmax(0,11fr)_minmax(15rem,9fr)] bg-[var(--ambient-ad-surface)] text-[var(--ambient-ad-ink)] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-4 top-4 z-30 inline-flex h-11 items-center border border-[var(--ambient-ad-ink)]/45 bg-[var(--ambient-ad-surface)]/75 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:bg-[var(--ambient-ad-ink)] hover:text-[var(--ambient-ad-cta-content)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-ink)] sm:right-8 sm:top-8 sm:px-4 sm:text-[10px] lg:right-10 lg:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-5 sm:p-8 lg:p-16">
          {/* Official Lexus emblem supplied by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lexusLogoUrl} alt="Lexus" className="h-9 w-16 max-w-full object-contain object-left sm:h-12 sm:w-20 lg:h-14 lg:w-24" />
          <div className="max-w-xl py-3 sm:py-6 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ambient-ad-muted)] sm:text-[10px] sm:tracking-[0.28em]">Advertisement · Luxury hybrid</p>
            <h2 id="lexus-ad-title" className="mt-3 font-sans text-[clamp(2.25rem,10vw,3.25rem)] font-medium leading-[0.94] tracking-[-0.04em] sm:mt-4 lg:mt-6 lg:text-[clamp(3rem,6vw,6.5rem)] lg:leading-[0.92]">The RX Hybrid</h2>
            <p id="lexus-ad-description" className="mt-3 max-w-md font-sans text-base font-light leading-6 text-[var(--ambient-ad-body)] sm:mt-4 sm:text-lg sm:leading-7 lg:mt-7 lg:text-2xl lg:leading-8">Experience the refined balance of electrified performance and considered luxury.</p>
          </div>
          <a href={lexusRxOffersUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center bg-[var(--ambient-ad-cta)] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ambient-ad-cta-content)] transition-colors hover:bg-[var(--ambient-ad-cta-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-cta)] sm:min-h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em]">Explore RX Hybrid offers</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[var(--ambient-ad-media)] lg:min-h-full">
          {/* Keep the product image stable until Lexus exposes a direct, lightweight RX Hybrid video asset suitable for background playback. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lexusRxHighResolutionImageUrl} alt="Lexus vehicle" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[image:var(--ambient-ad-overlay)]" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Lexus · RX Hybrid</p>
        </div>
      </div>
    </div>
  );
}

const marriottLuxuryUrl = "https://www.marriott.com/luxury";
const marriottLuxuryImageUrl = "https://cache.marriott.com/is/image/marriotts7prod/rz-miakb-lobby-ocean-views-39643?wid=1800";
const marriottLogoUrl = "/logos/marriott-international.svg";

function MarriottInterstitialAd({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative h-full w-full bg-[var(--ambient-ad-shell)]" style={getAmbientInterstitialCssVars("marriott")} role="region" aria-roledescription="advertisement" aria-labelledby="marriott-ad-title" aria-describedby="marriott-ad-description">
      <div className="relative grid h-full w-full grid-rows-[minmax(0,11fr)_minmax(15rem,9fr)] bg-[var(--ambient-ad-surface)] text-[var(--ambient-ad-ink)] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-4 top-4 z-30 inline-flex h-11 items-center border border-[var(--ambient-ad-ink)]/45 bg-[var(--ambient-ad-surface)]/75 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:bg-[var(--ambient-ad-ink)] hover:text-[var(--ambient-ad-cta-content)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-ink)] sm:right-8 sm:top-8 sm:px-4 sm:text-[10px] lg:right-10 lg:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-5 sm:p-8 lg:p-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={marriottLogoUrl}
            alt="Marriott International"
            className="h-auto w-[160px] max-w-[52vw] sm:w-[220px] lg:w-[280px]"
          />
          <div className="max-w-xl py-3 sm:py-6 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ambient-ad-muted)] sm:text-[10px] sm:tracking-[0.28em]">Advertisement · Luxury travel</p>
            <h2 id="marriott-ad-title" className="mt-3 font-serif text-[clamp(2.25rem,10vw,3.25rem)] leading-[0.94] tracking-[-0.04em] sm:mt-4 lg:mt-6 lg:text-[clamp(3rem,6vw,6.5rem)] lg:leading-[0.92]">An Invitation to the Extraordinary</h2>
            <p id="marriott-ad-description" className="mt-3 max-w-md font-serif text-base leading-6 text-[var(--ambient-ad-body)] sm:mt-4 sm:text-lg sm:leading-7 lg:mt-7 lg:text-2xl lg:leading-8">Discover stays shaped by beauty, belonging, and the moments that linger long after you return home.</p>
          </div>
          <a href={marriottLuxuryUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center bg-[var(--ambient-ad-cta)] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ambient-ad-cta-content)] transition-colors hover:bg-[var(--ambient-ad-cta-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-cta)] sm:min-h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em]">Explore luxury stays</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[var(--ambient-ad-media)] lg:min-h-full">
          {/* The official Marriott Luxury page exposes campaign stills but no stable embeddable video asset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={marriottLuxuryImageUrl} alt="Luxury Marriott resort overlooking the ocean" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[image:var(--ambient-ad-overlay)]" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Marriott Luxury · Extraordinary stays</p>
        </div>
      </div>
    </div>
  );
}

const porscheUsaUrl = "https://www.porsche.com/usa/";
const porscheLogoUrl = "/logos/porsche.svg";
const porscheHeroImageUrl = "https://images.porsche.com/f/338913/3840x2880/9cb0f564b9/04-macan-electric.jpg/m/2560x1920/filters%3Aformat%28webp%29%3Aquality%2880%29";
const porscheHeroVideoUrl = "https://newstv.porsche.com/porschevideos/newstv.porsche.com_296175_en.mp4";

function PorscheInterstitialAd({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative h-full w-full bg-[var(--ambient-ad-shell)]" style={getAmbientInterstitialCssVars("porsche")} role="region" aria-roledescription="advertisement" aria-labelledby="porsche-ad-title" aria-describedby="porsche-ad-description">
      <div className="relative grid h-full w-full grid-rows-[minmax(0,11fr)_minmax(15rem,9fr)] bg-[var(--ambient-ad-surface)] text-[var(--ambient-ad-ink)] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-4 top-4 z-30 inline-flex h-11 items-center border border-[var(--ambient-ad-ink)]/45 bg-[var(--ambient-ad-surface)]/75 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:bg-[var(--ambient-ad-ink)] hover:text-[var(--ambient-ad-cta-content)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-ink)] sm:right-8 sm:top-8 sm:px-4 sm:text-[10px] lg:right-10 lg:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-5 sm:p-8 lg:p-16">
          {/* Official Porsche crest supplied by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={porscheLogoUrl} alt="Porsche" className="h-auto w-28 max-w-full object-contain object-left sm:w-36 lg:w-48" />
          <div className="max-w-xl py-3 sm:py-6 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ambient-ad-muted)] sm:text-[10px] sm:tracking-[0.28em]">Advertisement · Performance automotive</p>
            <h2 id="porsche-ad-title" className="mt-3 font-sans text-[clamp(2.25rem,10vw,3.25rem)] font-light leading-[0.94] tracking-[-0.05em] sm:mt-4 lg:mt-6 lg:text-[clamp(3rem,6vw,6.5rem)] lg:leading-[0.92]">Your Porsche Journey Starts Now</h2>
            <p id="porsche-ad-description" className="mt-3 max-w-md font-sans text-base font-light leading-6 text-[var(--ambient-ad-body)] sm:mt-4 sm:text-lg sm:leading-7 lg:mt-7 lg:text-2xl lg:leading-8">Discover iconic sports cars, electric performance, and the freedom to choose your next Porsche.</p>
          </div>
          <a href={porscheUsaUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center bg-[var(--ambient-ad-cta)] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ambient-ad-cta-content)] transition-colors hover:bg-[var(--ambient-ad-cta-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-cta)] sm:min-h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em]">Explore Porsche</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[var(--ambient-ad-media)] lg:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={porscheHeroImageUrl} alt="Porsche Macan Electric driving through the city" className="absolute inset-0 h-full w-full object-cover" />
          <video className="absolute inset-0 h-full w-full object-cover" src={porscheHeroVideoUrl} autoPlay muted loop playsInline preload="metadata" aria-label="Porsche performance film" />
          <div className="absolute inset-0 bg-[image:var(--ambient-ad-overlay)]" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Porsche · Macan Electric</p>
        </div>
      </div>
    </div>
  );
}

const princessUrl = "https://www.princess.com/";
const princessLogoUrl = "https://upload.wikimedia.org/wikipedia/it/1/14/Princess_Cruises_logo.svg?utm_source=it.wikipedia.org&utm_campaign=index&utm_content=original";
const princessHeroImageUrl = "https://www.princess.com/content/dam/princess/promos-deals/denali-national-park-1220x686.jpg";

function PrincessInterstitialAd({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative h-full w-full bg-[var(--ambient-ad-shell)]" style={getAmbientInterstitialCssVars("princess")} role="region" aria-roledescription="advertisement" aria-labelledby="princess-ad-title" aria-describedby="princess-ad-description">
      <div className="relative grid h-full w-full grid-rows-[minmax(0,11fr)_minmax(15rem,9fr)] bg-[var(--ambient-ad-surface)] text-[var(--ambient-ad-ink)] lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-1">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-4 top-4 z-30 inline-flex h-11 items-center border border-[var(--ambient-ad-ink)]/45 bg-[var(--ambient-ad-surface)]/75 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:bg-[var(--ambient-ad-ink)] hover:text-[var(--ambient-ad-cta-content)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-ink)] sm:right-8 sm:top-8 sm:px-4 sm:text-[10px] lg:right-10 lg:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-5 sm:p-8 lg:p-16">
          {/* Official Princess Cruises logo supplied by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={princessLogoUrl} alt="Princess Cruises" className="h-auto w-28 max-w-full object-contain object-left sm:w-36 lg:w-48" />
          <div className="max-w-xl py-3 sm:py-6 lg:py-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ambient-ad-muted)] sm:text-[10px] sm:tracking-[0.28em]">Advertisement · Cruise travel</p>
            <h2 id="princess-ad-title" className="mt-3 font-serif text-[clamp(2.25rem,10vw,3.25rem)] leading-[0.94] tracking-[-0.04em] sm:mt-4 lg:mt-6 lg:text-[clamp(3rem,6vw,6.5rem)] lg:leading-[0.92]">Sail Into the Extraordinary</h2>
            <p id="princess-ad-description" className="mt-3 max-w-md font-sans text-base font-light leading-6 text-[var(--ambient-ad-body)] sm:mt-4 sm:text-lg sm:leading-7 lg:mt-7 lg:text-2xl lg:leading-8">Experience glaciers, coastlines, and unforgettable moments with Princess.</p>
          </div>
          <a href={princessUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center bg-[var(--ambient-ad-cta)] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ambient-ad-cta-content)] transition-colors hover:bg-[var(--ambient-ad-cta-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ambient-ad-cta)] sm:min-h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em]">Explore Princess</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[var(--ambient-ad-media)] lg:min-h-full">
          {/* Official Princess campaign imagery is used as the reliable creative for this placement. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={princessHeroImageUrl} alt="Princess cruise destination near Denali National Park" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[image:var(--ambient-ad-overlay)]" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Princess · Alaska</p>
        </div>
      </div>
    </div>
  );
}
