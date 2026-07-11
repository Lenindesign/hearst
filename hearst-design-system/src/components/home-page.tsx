"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { LinkComponent } from "@/components/ui/link";
import { Col, Grid, GridOverlay, PageContainer } from "@/components/ui/grid";
import { BigStoryFeedStacked } from "./fre/big-story-feed";
import { BigStoryImageRight } from "./fre/big-story";
import { FourAcrossGrid } from "./fre/four-across-grid";
import { SiteFooter } from "./fre/site-footer";
import {
  Bookmark,
  Camera,
  ChefHat,
  EyeOff,
  ImageIcon,
  Mail,
  Pause,
  Play,
  Plus,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import {
  getBrandImages,
  getBaseContent,
  type BaseContentType,
} from "./homepage-data";
import { lifestyleRiverSourceNotes, lifestyleRiverStories } from "./lifestyle-river-data";
import type { LifestyleRiverProfile, LifestyleRiverStory } from "./lifestyle-river-types";

interface ContentType extends BaseContentType {
  footerCols: string[][];
}

export interface HomePageTemplateProps {
  /**
   * Classic preserves the current production homepage. Overlap grid makes the
   * breakpoint behavior visible for Storybook and design review.
   */
  layout?: "classic" | "overlapGrid";
  showGridOverlay?: boolean;
}

const defaultFooterCols: string[][] = [
  ["News", "Features", "Culture", "Lifestyle", "Opinion", "Wellness", "Travel"],
  ["Style", "Beauty", "Food", "Home", "Entertainment", "Shopping", "Tech"],
  ["Videos", "Podcasts", "Newsletters", "Events", "Awards", "Archive", "About"],
  ["Contact", "Careers", "Advertise", "Subscribe", "Press", "Privacy", "Terms"],
];

const initialLifestyleProfile: LifestyleRiverProfile = {
  followedTopics: ["Food", "Home"],
  followedBrands: ["Good Housekeeping", "Country Living"],
  savedTags: ["dinner ideas", "sleep", "decorating"],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
};

const lifestyleBrandFavicons: Record<string, string> = {
  cosmopolitan: "https://www.cosmopolitan.com/_assets/design-tokens/cosmopolitan/static/images/apple-touch-icon.b887080.png",
  "country-living": "https://www.countryliving.com/_assets/design-tokens/countryliving/static/images/apple-touch-icon.d0a32c5.png",
  delish: "https://www.delish.com/_assets/design-tokens/delish/static/images/apple-touch-icon.8adc1b7.png",
  "good-housekeeping": "https://www.goodhousekeeping.com/_assets/design-tokens/goodhousekeeping/static/images/apple-touch-icon.da59c7c.png",
  "house-beautiful": "https://www.housebeautiful.com/_assets/design-tokens/housebeautiful/static/images/apple-touch-icon.72cedc1.png",
  "pioneer-woman": "https://www.thepioneerwoman.com/_assets/design-tokens/thepioneerwoman/static/images/apple-touch-icon.8133a54.png",
  prevention: "https://www.prevention.com/_assets/design-tokens/prevention/static/images/apple-touch-icon.ac12bc0.png",
  redbook: "https://www.redbookmag.com/_assets/design-tokens/redbookmag/static/images/apple-touch-icon.659f723.png",
  seventeen: "https://www.seventeen.com/_assets/design-tokens/seventeen/static/images/apple-touch-icon.11a9327.png",
  "womans-day": "https://www.womansday.com/_assets/design-tokens/womansday/static/images/apple-touch-icon.bc2afd6.png",
};

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  return { ...base, footerCols: defaultFooterCols };
}

function getLifestyleScore(story: LifestyleRiverStory, profile: LifestyleRiverProfile) {
  let score = story.popularity;

  if (profile.followedTopics.includes(story.topic)) score += 18;
  if (profile.followedBrands.includes(story.brand)) score += 16;
  if (story.tags.some((tag) => profile.savedTags.includes(tag))) score += 14;
  if (story.tags.some((tag) => profile.boostedTags.includes(tag))) score += 22;
  if (profile.savedIds.includes(story.id)) score += 6;

  score += Math.max(0, 12 - story.age);

  if (profile.hiddenIds.includes(story.id)) score -= 500;

  return score;
}

function rankLifestyleRiver(stories: LifestyleRiverStory[], profile: LifestyleRiverProfile) {
  const scored = stories
    .filter((story) => !profile.hiddenIds.includes(story.id))
    .map((story) => ({ ...story, score: getLifestyleScore(story, profile) }))
    .sort((a, b) => b.score - a.score);

  const ranked: typeof scored = [];
  const pool = [...scored];

  while (pool.length) {
    const recent = ranked.slice(-2);
    const nextIndex = pool.findIndex((story) => {
      const sameBrand = recent.length === 2 && recent.every((item) => item.brand === story.brand);
      const sameTopic = recent.length === 2 && recent.every((item) => item.topic === story.topic);
      return !sameBrand && !sameTopic;
    });
    ranked.push(pool.splice(nextIndex === -1 ? 0 : nextIndex, 1)[0]);
  }

  return ranked;
}

function storyMatchesLifestyleFilter(story: LifestyleRiverStory, filter: string) {
  if (filter === "For You" || filter === "Saved") return true;
  return story.topic === filter || story.topic.startsWith(`${filter} `);
}

function UtilityBar() {
  return (
    <div className="h-8 bg-primary text-primary-foreground text-[length:var(--text-token-4xs)] font-semibold">
      <PageContainer className="flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          {["Shop", "Newsletter", "Sign In"].map((label) => (
            <LinkComponent
              key={label}
              variant="neutral"
              underline={false}
              size="xs"
              className="opacity-90 text-primary-foreground hover:text-primary-foreground/80 font-semibold"
            >
              {label}
            </LinkComponent>
          ))}
        </div>
        <Button variant="secondary" size="xs" className="text-[length:var(--text-token-4xs)] font-semibold">
          Subscribe
        </Button>
      </PageContainer>
    </div>
  );
}

function MainNav({
  brandSlug,
  activeFilter,
  onFilterChange,
}: {
  brandSlug: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);
  const isLifestyle = brand.slug === "hearst-lifestyle";

  return (
    <div className="border-b border-border py-2">
      <PageContainer className="flex items-center justify-between py-2">
        <div className="w-[var(--width-sidebar-narrow)]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo
              slug={brand.slug}
              color={isLifestyle ? brand.colors["1"] : undefined}
              className={cn(
                "[&_svg]:w-auto mx-auto",
                isLifestyle
                  ? "[&_svg]:h-5 sm:[&_svg]:h-6 [&_svg]:max-w-[260px] sm:[&_svg]:max-w-[340px]"
                  : "[&_svg]:h-10"
              )}
            />
          ) : (
            <h1 className="text-2xl tracking-widest uppercase headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="w-[var(--width-sidebar-narrow)] flex justify-end gap-2">
          <Button variant="outline" size="icon-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button>
        </div>
      </PageContainer>
      <PageContainer as="nav" className="flex items-center justify-center gap-6 py-2 overflow-x-auto scrollbar-hide">
        {content.navLinks.map((link) => {
          const active = activeFilter === link;

          return isLifestyle ? (
            <button
              key={link}
              type="button"
              onClick={() => onFilterChange?.(link)}
              className={cn(
                "whitespace-nowrap border-b-2 border-transparent px-0.5 pb-1 text-sm font-normal transition-colors",
                active
                  ? "border-primary font-semibold text-primary"
                  : "text-foreground hover:border-primary/40 hover:text-primary"
              )}
              aria-pressed={active}
            >
              {link}
            </button>
          ) : (
            <LinkComponent
              key={link}
              variant="neutral"
              underline={false}
              size="sm"
              className="whitespace-nowrap font-normal"
            >
              {link}
            </LinkComponent>
          );
        })}
      </PageContainer>
    </div>
  );
}

function CollectionList({
  brandSlug,
  className,
}: {
  brandSlug: string;
  className?: string;
}) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  const feedItems = content.articles.map((article, i) => ({
    title: article.title,
    date: `${article.time} · ${article.readTime}`,
    image: images.articles[i % images.articles.length],
  }));

  return (
    <div className={cn("w-full min-w-0 space-y-3", className)}>
      <div className="space-y-2">
        <h3 className="text-xl uppercase headline text-primary">
          {content.collectionTitle}
        </h3>
        <Divider variant="default" size="lg" className="bg-primary" />
      </div>
      <BigStoryFeedStacked
        items={feedItems}
        thumbnailWidth={72}
        thumbnailHeight={72}
        headlineFontSize={14}
        showDividers={false}
        style={{ maxWidth: "100%", gap: "var(--space-sm, 12px)" }}
      />
    </div>
  );
}

function HeroCard({
  brandSlug,
  className,
}: {
  brandSlug: string;
  className?: string;
}) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  return (
    <div className={cn("w-full min-w-0", className)}>
      <BigStoryImageRight
        label={content.hero.eyebrow}
        headline={content.hero.title}
        description={content.hero.desc}
        author={content.hero.author}
        date=""
        image={images.hero}
        headlineFontSize={32}
        imagePosition="top"
        aspectRatio="1/1"
      />
    </div>
  );
}

function RightRail({
  brandSlug,
  className,
}: {
  brandSlug: string;
  className?: string;
}) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  const feedItems = content.rightRail.map((card, i) => ({
    title: card.title,
    eyebrow: card.eyebrow,
    author: card.author,
    date: "",
    image: images.rightRail[i % images.rightRail.length],
  }));

  return (
    <div className={cn("w-full min-w-0 space-y-8", className)}>
      <BigStoryFeedStacked
        items={feedItems}
        thumbnailWidth={100}
        thumbnailHeight={100}
        headlineFontSize={14}
        showDividers={false}
        style={{ maxWidth: "100%", gap: "var(--space-md, 16px)" }}
      />
      <div className="flex flex-col items-center gap-1 py-4 rounded bg-muted">
        <span className="text-[length:var(--text-token-4xs)] uppercase tracking-wider text-muted-foreground">
          Advertisement
        </span>
        <div className="w-full max-w-[300px] aspect-[6/5] rounded-md flex items-center justify-center text-sm bg-background text-muted-foreground border border-border">
          AD 300 × 250
        </div>
      </div>
    </div>
  );
}

function NewsletterPromo() {
  const { brand } = useTheme();

  return (
    <div className="py-10 px-6 lg:px-12 space-y-6 bg-accent">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest font-brand-secondary text-foreground">
          Sign up for {brand.name}&rsquo;s Newsletter
        </p>
        <h3 className="text-2xl lg:text-[length:var(--text-token-5xl)] leading-tight headline">
          Hear from our expert journalists.
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-0">
        <Input
          size="xl"
          placeholder="Enter your email here."
          leadingIcon={Mail}
          className="flex-1 [&>div]:rounded-none [&>div]:sm:rounded-l-sm [&>div]:border-border"
        />
        <Button size="lg" className="h-12 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap rounded-none sm:rounded-r-sm">
          Sign Me Up
        </Button>
      </div>
      <p className="text-[length:var(--text-token-4xs)] leading-relaxed text-muted-foreground">
        By signing up, I agree to the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Terms of Use</LinkComponent>{" "}
        (including the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">dispute resolution procedures</LinkComponent>
        ) and have reviewed the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Privacy Notice</LinkComponent>.
        This site is protected by reCAPTCHA and the Google{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Privacy Policy</LinkComponent>{" "}
        and{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Terms of Service</LinkComponent>{" "}
        apply.
      </p>
    </div>
  );
}

function TrendingSection({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  const gridItems = content.trending.map((card, i) => ({
    title: card.title,
    subtitle: card.time,
    image: images.trending[i % images.trending.length],
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-4xl lg:text-5xl headline">
        Trending
      </h2>
      <FourAcrossGrid
        items={gridItems}
        columns={5}
        gap={undefined}
        aspectRatio="1/1"
        showNumbers
      />
    </div>
  );
}

function Footer() {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];

  const footerLogo = logo ? (
    <BrandLogo slug={brand.slug} className="[&_svg]:h-8 [&_svg]:w-auto" color="#fff" />
  ) : (
    brand.name
  );

  return (
    <div className="pt-12">
      <SiteFooter
        siteName={footerLogo}
        socialLinks={["YouTube", "Facebook", "Instagram", "Pinterest"]}
        legalLinks={["Privacy Notice", "Terms of Use", "Site Map"]}
        copyrightYear={2026}
      />
    </div>
  );
}

function LifestyleRiverImage({
  story,
  className,
}: {
  story: LifestyleRiverStory;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${story.brand}: ${story.title}`}
      className={cn("min-w-0 bg-muted bg-cover bg-center", className)}
      style={{ backgroundImage: `url("${story.image}")` }}
    />
  );
}

function LifestyleBrandSource({ story }: { story: LifestyleRiverStory }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[length:var(--text-token-4xs)] text-muted-foreground">
      <span
        aria-hidden
        className="inline-block h-4 w-4 shrink-0 rounded-[3px] border border-border bg-background"
        style={{
          backgroundImage: `url("${lifestyleBrandFavicons[story.brandSlug]}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <span className="min-w-0 truncate">
        {story.brand} · {story.topic} · {story.readTime}
      </span>
    </span>
  );
}

type LifestyleCardKind = "article" | "gallery" | "video" | "recipe" | "shopping";

function getLifestyleCardKind(story: LifestyleRiverStory): LifestyleCardKind {
  const searchable = `${story.topic} ${story.title}`.toLowerCase();

  if (story.topic.startsWith("Food")) return "recipe";
  if (/shopping|products|tested|best|buy|sale|deals|favorite|picks/.test(searchable)) return "shopping";
  if (story.topic === "Entertainment" || /watch|video|tv|show|movie|internet/.test(searchable) || story.age % 7 === 0) return "video";
  if (/photos|gallery|style|jeans|rooms|decorating|porch|garden|designers|living room/.test(searchable) || story.age % 5 === 0) return "gallery";

  return "article";
}

function getLifestyleKindLabel(kind: LifestyleCardKind) {
  return {
    article: "Article",
    gallery: "Gallery",
    video: "Watch",
    recipe: "Recipe",
    shopping: "Shop",
  }[kind];
}

function LifestyleRiverMedia({
  story,
  kind,
  featured,
  playing,
  onTogglePlaying,
}: {
  story: LifestyleRiverStory;
  kind: LifestyleCardKind;
  featured: boolean;
  playing: boolean;
  onTogglePlaying: () => void;
}) {
  const imageClassName = featured
    ? "h-64 w-full sm:h-80 2xl:h-full 2xl:min-h-[360px]"
    : "h-full min-h-32 w-full rounded-sm";
  const videoClassName = featured
    ? "aspect-video w-full 2xl:self-center"
    : "aspect-video w-full self-start rounded-sm";

  if (kind !== "video") {
    return <LifestyleRiverImage story={story} className={imageClassName} />;
  }

  return (
    <div className={cn("relative min-w-0 overflow-hidden bg-muted bg-cover bg-center", videoClassName)} style={{ backgroundImage: `url("${story.image}")` }}>
      <div className="absolute inset-0 bg-black/20" />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onTogglePlaying();
        }}
        className="absolute inset-0 flex items-center justify-center text-background"
        aria-label={`${playing ? "Pause" : "Play"} video: ${story.title}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 shadow-sm">
          {playing ? <Pause className="h-6 w-6" aria-hidden /> : <Play className="ml-0.5 h-6 w-6" aria-hidden />}
        </span>
      </button>
      <div className="absolute inset-x-3 bottom-3 rounded-sm bg-black/75 px-3 py-2 text-background">
        <div className="flex items-center justify-between gap-3 text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest">
          <span>{playing ? "Playing Now" : "Tap to Watch"}</span>
          <span>{story.readTime.replace("read", "watch")}</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-background/30">
          <div className={cn("h-full rounded-full bg-background", playing ? "w-2/3" : "w-1/4")} />
        </div>
      </div>
    </div>
  );
}

function LifestyleCardModule({
  story,
  kind,
}: {
  story: LifestyleRiverStory;
  kind: LifestyleCardKind;
}) {
  const galleryCount = 6 + (story.age % 10);
  const recipeMinutes = 20 + ((story.age * 5) % 35);
  const productCount = 5 + (story.age % 8);

  if (kind === "gallery") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <ImageIcon className="h-3.5 w-3.5" aria-hidden />
          {galleryCount} photos
        </span>
        <span>Swipe-style visual story with editor captions.</span>
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <Play className="h-3.5 w-3.5" aria-hidden />
          Inline video
        </span>
        <span>Watch without leaving the river.</span>
      </div>
    );
  }

  if (kind === "recipe") {
    return (
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
        <div className="rounded-sm bg-muted px-2 py-2">
          <p className="font-bold">{recipeMinutes} min</p>
          <p className="text-muted-foreground">Total</p>
        </div>
        <div className="rounded-sm bg-muted px-2 py-2">
          <p className="font-bold">{2 + (story.age % 5)}</p>
          <p className="text-muted-foreground">Servings</p>
        </div>
        <div className="rounded-sm bg-muted px-2 py-2">
          <p className="flex items-center justify-center gap-1 font-bold">
            <ChefHat className="h-3.5 w-3.5" aria-hidden />
            Easy
          </p>
          <p className="text-muted-foreground">Level</p>
        </div>
      </div>
    );
  }

  if (kind === "shopping") {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
          {productCount} editor picks
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
          Lab-informed picks
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1 font-semibold text-foreground">
        <Camera className="h-3.5 w-3.5" aria-hidden />
        Editorial read
      </span>
      <span>Full story from {story.brand} editors.</span>
    </div>
  );
}

function LifestyleRiverCard({
  story,
  saved,
  onOpen,
  onSave,
  onMoreLikeThis,
  onFollowTopic,
  onFollowBrand,
  onHide,
  featured = false,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  onFollowTopic: () => void;
  onFollowBrand: () => void;
  onHide: () => void;
  featured?: boolean;
}) {
  const kind = getLifestyleCardKind(story);
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const isVideo = kind === "video";

  return (
    <article className={cn(
      "min-w-0 cursor-pointer overflow-hidden border border-border bg-background transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30",
      isVideo
        ? "grid"
        : featured
        ? "grid items-stretch 2xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]"
        : "grid grid-cols-[112px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[176px_minmax(0,1fr)]"
    )}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      aria-label={`Open story: ${story.title}`}
    >
      <LifestyleRiverMedia
        story={story}
        kind={kind}
        featured={featured}
        playing={videoPlaying}
        onTogglePlaying={() => setVideoPlaying((playing) => !playing)}
      />
      <div className={cn(
        "min-w-0",
        isVideo ? "p-4 sm:p-5" : featured ? "flex flex-col justify-center p-5 sm:p-6 lg:p-8" : ""
      )}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            {story.signal}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-muted-foreground">
            {getLifestyleKindLabel(kind)}
          </span>
          <LifestyleBrandSource story={story} />
        </div>
        <h2 className={cn(
          "headline break-words leading-tight",
          featured ? "w-full text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-2xl"
        )}>
          {story.title}
        </h2>
        <p className={cn(
          "mt-3 text-muted-foreground",
          featured ? "max-w-prose text-base leading-7" : "text-sm leading-6"
        )}>
          {story.summary}
        </p>
        <LifestyleCardModule story={story} kind={kind} />
        <div className="mt-5 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
          <Button variant={saved ? "default" : "outline"} size="xs" onClick={onSave} aria-pressed={saved}>
            <Bookmark className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="xs" onClick={onMoreLikeThis}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            More like this
          </Button>
          <Button variant="ghost" size="xs" onClick={onFollowTopic}>
            Follow {story.topic}
          </Button>
          <Button variant="ghost" size="xs" onClick={onFollowBrand}>
            Follow {story.brand}
          </Button>
          <Button variant="ghost" size="xs" onClick={onHide}>
            <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Hide
          </Button>
        </div>
      </div>
    </article>
  );
}

function getLifestyleReaderParagraphs(story: LifestyleRiverStory) {
  const topicPhrase = story.topic.toLowerCase();
  const tagPhrase = story.tags.slice(0, 3).join(", ");

  return [
    story.summary,
    `${story.brand} editors frame this ${topicPhrase} story around the signals readers are acting on right now: ${tagPhrase}.`,
    `In the full experience, this reader would continue into the original ${story.brand} article with inline media, related service modules, and commerce or recipe utilities when they are relevant.`,
    `This prototype keeps the modal focused on the discovery behavior: open a story from the river, keep reading, and let the next ranked story lazy-load into the same session.`,
  ];
}

function LifestyleReaderSidebarAd() {
  return (
    <aside className="hidden lg:block" aria-label="Advertisement">
      <div className="sticky top-20 flex h-[600px] w-[300px] flex-col overflow-hidden border border-[#d7c7b8] bg-[#fffaf4] shadow-sm">
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-[0.24em] text-primary">
              Advertisement
            </p>
            <p className="mt-8 font-brand-secondary text-4xl font-bold leading-none text-primary">
              Make Room for Summer
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Fresh furniture, cookware, linens, and garden finds selected for the season ahead.
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-[#e8d9c9]" />
              <div className="aspect-square bg-[#d7e4d1]" />
              <div className="aspect-square bg-[#f3c7b5]" />
              <div className="aspect-square bg-[#c9d8e8]" />
            </div>
            <div className="rounded-full bg-primary px-4 py-3 text-center text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary-foreground">
              Explore the Edit
            </div>
            <p className="text-center text-[length:var(--text-token-4xs)] uppercase tracking-widest text-muted-foreground">
              300 x 600 Sponsored Unit
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function LifestyleStoryReaderModal({
  stories,
  openStoryId,
  onClose,
}: {
  stories: LifestyleRiverStory[];
  openStoryId: string | null;
  onClose: () => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const openIndex = openStoryId ? stories.findIndex((story) => story.id === openStoryId) : -1;
  const [visibleReaderCount, setVisibleReaderCount] = React.useState(1);
  const storyQueue = openIndex >= 0 ? stories.slice(openIndex) : [];
  const visibleReaderStories = storyQueue.slice(0, visibleReaderCount);

  React.useEffect(() => {
    setVisibleReaderCount(1);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [openStoryId]);

  React.useEffect(() => {
    if (!openStoryId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, openStoryId]);

  React.useEffect(() => {
    const node = sentinelRef.current;
    const root = scrollRef.current;

    if (!node || !root || !openStoryId || visibleReaderCount >= storyQueue.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleReaderCount((count) => Math.min(count + 1, storyQueue.length));
        }
      },
      { root, rootMargin: "600px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [openStoryId, storyQueue.length, visibleReaderCount]);

  if (!openStoryId || openIndex < 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Story reader"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={scrollRef}
        className="absolute inset-x-0 bottom-0 top-6 mx-auto flex w-full max-w-6xl flex-col overflow-y-auto bg-background shadow-2xl sm:inset-y-6 sm:rounded-sm"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Hearst Lifestyle Reader
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              Lazy-loading {visibleReaderStories.length} of {storyQueue.length} stories from this river
            </p>
          </div>
          <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close story reader">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="grid gap-8 px-4 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10">
          <div className="min-w-0">
            {visibleReaderStories.map((story, index) => {
              const kind = getLifestyleCardKind(story);

              return (
                <article
                  key={story.id}
                  className={cn("border-b border-border pb-10", index > 0 && "pt-10")}
                >
                  <LifestyleRiverImage story={story} className="aspect-video w-full rounded-sm" />
                  <div className="mx-auto mt-6 max-w-3xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                        {story.signal}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-muted-foreground">
                        {getLifestyleKindLabel(kind)}
                      </span>
                      <LifestyleBrandSource story={story} />
                    </div>
                    <h2 className="headline text-4xl leading-tight sm:text-5xl">
                      {story.title}
                    </h2>
                    <div className="mt-6 space-y-5 text-base leading-8 text-foreground/80">
                      {getLifestyleReaderParagraphs(story).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <LifestyleCardModule story={story} kind={kind} />
                  </div>
                </article>
              );
            })}

            <div ref={sentinelRef} className="flex justify-center py-8">
              {visibleReaderCount < storyQueue.length ? (
                <p className="text-sm text-muted-foreground">Loading the next story...</p>
              ) : (
                <p className="text-sm text-muted-foreground">End of this filtered story river.</p>
              )}
            </div>
          </div>
          <LifestyleReaderSidebarAd />
        </div>
      </div>
    </div>
  );
}

function LifestyleLeftSidebar({
  profile,
  topStories,
  topics,
  brands,
  activeBrandFilters,
  onToggleBrandFilter,
  onClearBrandFilters,
  onFollowTopic,
}: {
  profile: LifestyleRiverProfile;
  topStories: LifestyleRiverStory[];
  topics: { name: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  activeBrandFilters: string[];
  onToggleBrandFilter: (brandName: string) => void;
  onClearBrandFilters: () => void;
  onFollowTopic: (topic: string) => void;
}) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start" aria-label="Lifestyle discovery sidebar">
      <div className="border border-border p-4">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Your Daily Edit
        </p>
        <div className="mt-4 space-y-3">
          {topStories.slice(0, 3).map((story) => (
            <div key={story.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                {story.topic}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug">{story.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{story.brand} · Popularity {story.popularity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Filter Brands
          </p>
          {activeBrandFilters.length > 0 ? (
            <button
              type="button"
              onClick={onClearBrandFilters}
              className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="mt-4 space-y-3">
          {brands.map((brand) => {
            const active = activeBrandFilters.includes(brand.name);
            return (
              <button
                key={brand.name}
                type="button"
                onClick={() => onToggleBrandFilter(brand.name)}
                disabled={brand.count === 0}
                className={cn(
                  "flex w-full min-w-0 items-center justify-between gap-3 border-b border-border pb-2 text-left text-sm transition-colors last:border-0 last:pb-0",
                  active && "font-bold text-primary",
                  brand.count === 0 && "cursor-not-allowed text-muted-foreground opacity-70"
                )}
                aria-pressed={active}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "inline-block h-5 w-5 shrink-0 rounded-sm border bg-background",
                      active ? "border-primary ring-2 ring-primary/20" : "border-border"
                    )}
                    style={{
                      backgroundImage: `url("${lifestyleBrandFavicons[brand.slug]}")`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                    }}
                  />
                  <span className="min-w-0 truncate">{brand.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{brand.count}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          {activeBrandFilters.length > 0
            ? `Showing ${activeBrandFilters.length} selected brand${activeBrandFilters.length === 1 ? "" : "s"}.`
            : "All brands are included in the river."}
        </p>
      </div>

      <div className="border border-border p-4">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Follow Topics
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => {
            const active = profile.followedTopics.includes(topic.name);
            return (
              <Button
                key={topic.name}
                variant={active ? "default" : "outline"}
                size="xs"
                onClick={() => onFollowTopic(topic.name)}
                aria-pressed={active}
              >
                {topic.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="border border-border bg-muted/30 p-4">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Collections
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-bold">Dinner ideas</p>
          <p className="font-bold">Weekend projects</p>
          <p className="font-bold">Sleep better</p>
          <p className="text-xs text-muted-foreground">
            Saved stories and more-like-this actions tune these collections in the prototype.
          </p>
        </div>
      </div>
    </aside>
  );
}

function LifestyleRiverHomePage({ activeFilter }: { activeFilter: string }) {
  const [profile, setProfile] = React.useState<LifestyleRiverProfile>(initialLifestyleProfile);
  const [activeBrandFilters, setActiveBrandFilters] = React.useState<string[]>([]);
  const [openStoryId, setOpenStoryId] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(8);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const rankedStories = React.useMemo(
    () => rankLifestyleRiver(lifestyleRiverStories, profile),
    [profile]
  );
  const filteredStories = React.useMemo(() => {
    const brandFilteredStories = activeBrandFilters.length > 0
      ? rankedStories.filter((story) => activeBrandFilters.includes(story.brand))
      : rankedStories;

    if (activeFilter === "Saved") {
      return brandFilteredStories.filter((story) => profile.savedIds.includes(story.id));
    }

    return brandFilteredStories.filter((story) => storyMatchesLifestyleFilter(story, activeFilter));
  }, [activeBrandFilters, activeFilter, profile.savedIds, rankedStories]);
  const visibleStories = filteredStories.slice(0, visibleCount);
  const leadStory = visibleStories[0];
  const riverStories = visibleStories.slice(1);
  const sidebarTopics = React.useMemo(() => {
    const counts = lifestyleRiverStories.reduce<Record<string, number>>((acc, story) => {
      acc[story.topic] = (acc[story.topic] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, []);
  const sidebarBrands = React.useMemo(() => {
    const counts = lifestyleRiverStories.reduce<Record<string, number>>((acc, story) => {
      acc[story.brand] = (acc[story.brand] ?? 0) + 1;
      return acc;
    }, {});

    return lifestyleRiverSourceNotes.map((note) => ({
      name: note.brand,
      slug: note.brandSlug,
      count: counts[note.brand] ?? 0,
    }));
  }, []);

  React.useEffect(() => {
    setVisibleCount(8);
  }, [activeBrandFilters, activeFilter]);

  React.useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visibleCount >= filteredStories.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + 4, filteredStories.length));
        }
      },
      { rootMargin: "500px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredStories.length, visibleCount]);

  const mergeUnique = (items: string[], nextItems: string[]) =>
    Array.from(new Set([...items, ...nextItems]));

  const toggleSaved = (story: LifestyleRiverStory) => {
    setProfile((current) => {
      const saved = current.savedIds.includes(story.id);
      return {
        ...current,
        savedIds: saved
          ? current.savedIds.filter((id) => id !== story.id)
          : [...current.savedIds, story.id],
        savedTags: saved ? current.savedTags : mergeUnique(current.savedTags, story.tags.slice(0, 2)),
      };
    });
  };

  const boostStory = (story: LifestyleRiverStory) => {
    setProfile((current) => ({
      ...current,
      boostedTags: mergeUnique(current.boostedTags, story.tags),
      followedTopics: mergeUnique(current.followedTopics, [story.topic]),
    }));
  };

  const followTopic = (topic: string) => {
    setProfile((current) => ({
      ...current,
      followedTopics: mergeUnique(current.followedTopics, [topic]),
    }));
  };

  const toggleBrandFilter = (brandName: string) => {
    setActiveBrandFilters((current) =>
      current.includes(brandName)
        ? current.filter((name) => name !== brandName)
        : [...current, brandName]
    );
  };

  const followBrand = (brandName: string) => {
    setProfile((current) => ({
      ...current,
      followedBrands: mergeUnique(current.followedBrands, [brandName]),
    }));
  };

  const hideStory = (id: string) => {
    setProfile((current) => ({
      ...current,
      hiddenIds: mergeUnique(current.hiddenIds, [id]),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <LifestyleLeftSidebar
          profile={profile}
          topStories={filteredStories}
          topics={sidebarTopics}
          brands={sidebarBrands}
          activeBrandFilters={activeBrandFilters}
          onToggleBrandFilter={toggleBrandFilter}
          onClearBrandFilters={() => setActiveBrandFilters([])}
          onFollowTopic={followTopic}
        />

        <main className="space-y-4" aria-label="Personalized lifestyle story river">
          {leadStory ? (
            <>
              <LifestyleRiverCard
                story={leadStory}
                saved={profile.savedIds.includes(leadStory.id)}
                onOpen={() => setOpenStoryId(leadStory.id)}
                onSave={() => toggleSaved(leadStory)}
                onMoreLikeThis={() => boostStory(leadStory)}
                onFollowTopic={() => followTopic(leadStory.topic)}
                onFollowBrand={() => followBrand(leadStory.brand)}
                onHide={() => hideStory(leadStory.id)}
                featured
              />

              {riverStories.map((story) => (
                <LifestyleRiverCard
                  key={story.id}
                  story={story}
                  saved={profile.savedIds.includes(story.id)}
                  onOpen={() => setOpenStoryId(story.id)}
                  onSave={() => toggleSaved(story)}
                  onMoreLikeThis={() => boostStory(story)}
                  onFollowTopic={() => followTopic(story.topic)}
                  onFollowBrand={() => followBrand(story.brand)}
                  onHide={() => hideStory(story.id)}
                />
              ))}

              <div ref={sentinelRef} className="flex justify-center py-6">
                {visibleCount < filteredStories.length ? (
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((count) => Math.min(count + 4, filteredStories.length))}
                  >
                    Load more popular stories
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You&rsquo;re caught up on this prototype river.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="border border-border bg-muted/30 p-8 text-center">
              <p className="headline text-2xl">No stories in {activeFilter} yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear a brand filter or switch back to For You to keep exploring.
              </p>
            </div>
          )}
        </main>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="border border-border p-4">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Trending Across Brands
            </p>
            <ol className="mt-4 space-y-3">
              {filteredStories.slice(0, 5).map((story, index) => (
                <li key={story.id} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold leading-none text-primary-foreground">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-bold leading-snug">{story.title}</span>
                    <span className="text-xs text-muted-foreground">{story.brand} · {story.topic}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="border border-border bg-muted/30 p-4">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              POC Data Source
            </p>
            <p className="mt-3 text-sm font-bold">
              {lifestyleRiverStories.length} real-image stories
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Pulled from public Hearst lifestyle RSS metadata and filtered to stories with Hearst CDN images.
              Public Redbook RSS returned no image-backed items during the latest import.
            </p>
          </div>
          <div className="border border-border p-4">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Why Your River Looks Like This
            </p>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-bold">Followed topics</p>
                <p className="mt-1 text-muted-foreground">{profile.followedTopics.join(", ")}</p>
              </div>
              <div>
                <p className="font-bold">Followed brands</p>
                <p className="mt-1 text-muted-foreground">{profile.followedBrands.join(", ")}</p>
              </div>
              <div>
                <p className="font-bold">Active brand filters</p>
                <p className="mt-1 text-muted-foreground">
                  {activeBrandFilters.length > 0 ? activeBrandFilters.join(", ") : "All brands"}
                </p>
              </div>
              <div>
                <p className="font-bold">Saved signals</p>
                <p className="mt-1 text-muted-foreground">{profile.savedTags.slice(0, 6).join(", ")}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <LifestyleStoryReaderModal
        stories={filteredStories}
        openStoryId={openStoryId}
        onClose={() => setOpenStoryId(null)}
      />

      <div className="grid gap-4 border-t border-border pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Personalized Popular River
          </p>
          <h1 className="headline text-4xl leading-tight sm:text-6xl">
            Most popular lifestyle stories, tuned by what you do next.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            A continuously ranked Hearst Lifestyle feed across Cosmopolitan, Country Living, Delish,
            Good Housekeeping, House Beautiful, The Pioneer Woman, Prevention, Redbook, Seventeen,
            and Woman&rsquo;s Day.
          </p>
        </div>
        <div className="rounded-sm border border-border bg-muted/40 p-4">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Behavior Model
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Saved</dt>
              <dd className="font-bold">{profile.savedIds.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Hidden</dt>
              <dd className="font-bold">{profile.hiddenIds.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Topics</dt>
              <dd className="font-bold">{profile.followedTopics.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Brands</dt>
              <dd className="font-bold">{profile.followedBrands.length}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Ranking uses popularity, followed topics, followed brands, saved tags, more-like-this
            activity, recency, and diversity rules.
          </p>
        </div>
      </div>
    </div>
  );
}

function ClassicHomepageBody({ brandSlug }: { brandSlug: string }) {
  return (
    <Grid alignStart>
      {/* Collection — sidebar on tablet, narrow column on desktop */}
      <Col span="full" spanMd={3} spanLg={3}>
        <CollectionList brandSlug={brandSlug} className="lg:w-full" />
      </Col>

      {/* Hero — fills the rest of the main column */}
      <Col span="full" spanMd={5} spanLg={6}>
        <HeroCard brandSlug={brandSlug} />
      </Col>

      {/* Right rail — full width on mobile, sidebar on desktop */}
      <Col span="full" spanLg={3}>
        <RightRail brandSlug={brandSlug} className="lg:w-full" />
      </Col>

      {/* Newsletter — spans the main 9 columns on desktop */}
      <Col span="full" spanLg={9}>
        <NewsletterPromo />
      </Col>

      {/* Trending — full bleed inside the page container */}
      <Col span="full">
        <TrendingSection brandSlug={brandSlug} />
      </Col>
    </Grid>
  );
}

function OverlapGridHomepageBody({ brandSlug }: { brandSlug: string }) {
  // NOTE: when items in the same row overlap, every item that shares the row
  // must be EXPLICITLY placed (rowStart + startMd/startLg). Mixing explicit
  // placement with auto-placement causes the browser to create implicit tracks
  // past the explicit grid and collapse the fr tracks to 0px.
  return (
    <Grid alignStart>
      {/* Hero — full width on mobile; center cols 4-9 on lg */}
      <Col
        span="full"
        spanMd={5}
        spanLg={6}
        startMd={4}
        startLg={4}
        rowStartMd={1}
      >
        <HeroCard brandSlug={brandSlug} />
      </Col>

      {/* Collection card — stacks below hero on mobile, cols 1-3 LEFT on md+ */}
      <Col
        as="aside"
        span="full"
        spanMd={3}
        spanLg={3}
        startMd={1}
        startLg={1}
        rowStartMd={1}
        raised
      >
        <CollectionList brandSlug={brandSlug} className="lg:w-full" />
      </Col>

      {/* Right rail — full width on mobile/tablet, sidebar on desktop */}
      <Col
        as="aside"
        span="full"
        spanLg={3}
        startLg={10}
        rowStartLg={1}
      >
        <RightRail brandSlug={brandSlug} className="lg:w-full" />
      </Col>

      {/* Newsletter — wide secondary row */}
      <Col span="full" spanLg={9} startLg={1} className="lg:pt-10">
        <NewsletterPromo />
      </Col>

      {/* Trending — full bleed inside the page container */}
      <Col span="full" startLg={1}>
        <TrendingSection brandSlug={brandSlug} />
      </Col>
    </Grid>
  );
}

export function HomePageTemplate({
  layout = "classic",
  showGridOverlay = false,
}: HomePageTemplateProps = {}) {
  const { brand } = useTheme();
  const [activeLifestyleFilter, setActiveLifestyleFilter] = React.useState("For You");

  return (
    <div className="min-h-screen font-brand bg-background">
      {/* Utility Bar — full width */}
      <UtilityBar />

      {/* Main Nav — full width background, content constrained */}
      <MainNav
        brandSlug={brand.slug}
        activeFilter={activeLifestyleFilter}
        onFilterChange={setActiveLifestyleFilter}
      />

      {/* Page Body — constrained by the shared PageContainer */}
      <PageContainer className="relative pt-8 lg:pt-12">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10 space-y-12 lg:space-y-16">
          {brand.slug === "hearst-lifestyle" ? (
            <LifestyleRiverHomePage activeFilter={activeLifestyleFilter} />
          ) : layout === "overlapGrid" ? (
            <OverlapGridHomepageBody brandSlug={brand.slug} />
          ) : (
            <ClassicHomepageBody brandSlug={brand.slug} />
          )}
        </div>
      </PageContainer>

      {/* Footer — full width */}
      <Footer />
    </div>
  );
}

export function BrandHomePage() {
  return (
    <>
      <NavBar />
      <HomePageTemplate />
    </>
  );
}
