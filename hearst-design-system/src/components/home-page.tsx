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
  SlidersHorizontal,
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

const lifestyleDefaultLeadStoryId =
  "cosmopolitan-entertainment-celebs-a71899516-margaret-qualley-rep-denies-jack-antonoff-cheating";

type LifestyleDemoDaypart = "morning" | "afternoon" | "evening" | "lateNight";

type LifestyleDemoState = {
  daypart: LifestyleDemoDaypart;
  returnHours: number;
  contentDay: "today" | "nextDay";
  previousLeadId?: string;
};

const initialLifestyleDemoState: LifestyleDemoState = {
  daypart: "morning",
  returnHours: 0,
  contentDay: "today",
};

const lifestyleDemoDayparts: Record<
  LifestyleDemoDaypart,
  {
    label: string;
    time: string;
    description: string;
    preferredTopics: string[];
    preferredKinds: LifestyleCardKind[];
    preferredTags: string[];
  }
> = {
  morning: {
    label: "Morning Brief",
    time: "8 AM",
    description: "Fresh service, food, home, and wellness stories for a first check-in.",
    preferredTopics: ["Food", "Food News", "Home", "Wellness"],
    preferredKinds: ["article", "recipe", "gallery"],
    preferredTags: ["breakfast", "cleaning", "decorating", "health", "summer"],
  },
  afternoon: {
    label: "Afternoon Momentum",
    time: "1 PM",
    description: "Stories gaining popularity while readers browse between tasks.",
    preferredTopics: ["Shopping", "Style", "Entertainment", "Food News"],
    preferredKinds: ["shopping", "gallery", "video"],
    preferredTags: ["products", "style", "celebrity", "deals", "editor picks"],
  },
  evening: {
    label: "Evening Return",
    time: "6 PM",
    description: "Dinner, home, continue-reading, and saved-intent stories move up.",
    preferredTopics: ["Food", "Food Drinks", "Home", "Entertainment"],
    preferredKinds: ["recipe", "video", "shopping"],
    preferredTags: ["dinner ideas", "cookout", "decorating", "sleep", "tv"],
  },
  lateNight: {
    label: "Late Night Wind Down",
    time: "10 PM",
    description: "Softer wellness, relationships, beauty, and save-for-later content.",
    preferredTopics: ["Wellness", "Style", "Relationships", "Entertainment"],
    preferredKinds: ["article", "gallery", "video"],
    preferredTags: ["sleep", "beauty", "relationships", "health", "celebrity"],
  },
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

function getLifestyleTimeOfDayScore(story: LifestyleRiverStory, demoState: LifestyleDemoState) {
  const daypart = lifestyleDemoDayparts[demoState.daypart];
  const kind = getLifestyleCardKind(story);
  let score = 0;

  if (daypart.preferredTopics.some((topic) => story.topic === topic || story.topic.startsWith(`${topic} `))) {
    score += 16;
  }
  if (daypart.preferredKinds.includes(kind)) score += 10;
  if (story.tags.some((tag) => daypart.preferredTags.includes(tag))) score += 8;

  return score;
}

function getLifestyleRecencyScore(story: LifestyleRiverStory, demoState: LifestyleDemoState) {
  const freshSinceLastVisit = demoState.returnHours > 0 && story.age <= demoState.returnHours + 2;
  return Math.max(0, 12 - story.age) + (freshSinceLastVisit ? 12 : 0);
}

function getLifestyleScoreBreakdown(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState
) {
  const popularity = story.popularity;
  const followedTopic = profile.followedTopics.includes(story.topic) ? 18 : 0;
  const followedBrand = profile.followedBrands.includes(story.brand) ? 16 : 0;
  const savedTag = story.tags.some((tag) => profile.savedTags.includes(tag)) ? 14 : 0;
  const moreLikeThis = story.tags.some((tag) => profile.boostedTags.includes(tag)) ? 22 : 0;
  const savedStory = profile.savedIds.includes(story.id) ? 6 : 0;
  const recency = getLifestyleRecencyScore(story, demoState);
  const timeOfDay = getLifestyleTimeOfDayScore(story, demoState);
  const nextDayNovelty =
    demoState.contentDay === "nextDay" && story.id !== demoState.previousLeadId
      ? story.topic === "Entertainment" || story.topic === "Shopping" || story.topic === "Home"
        ? 28
        : 10
      : 0;
  const repeatLeadPenalty = demoState.contentDay === "nextDay" && story.id === demoState.previousLeadId ? -120 : 0;
  const hidden = profile.hiddenIds.includes(story.id) ? -500 : 0;

  return {
    popularity,
    followedTopic,
    followedBrand,
    savedTag,
    moreLikeThis,
    savedStory,
    recency,
    timeOfDay,
    nextDayNovelty,
    repeatLeadPenalty,
    hidden,
    total:
      popularity +
      followedTopic +
      followedBrand +
      savedTag +
      moreLikeThis +
      savedStory +
      recency +
      timeOfDay +
      nextDayNovelty +
      repeatLeadPenalty +
      hidden,
  };
}

function getLifestyleScore(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState
) {
  return getLifestyleScoreBreakdown(story, profile, demoState).total;
}

function getLifestylePersonalizationReason(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState
) {
  const daypart = lifestyleDemoDayparts[demoState.daypart];

  if (story.tags.some((tag) => profile.boostedTags.includes(tag))) return "More like stories you boosted";
  if (demoState.contentDay === "nextDay" && story.id !== demoState.previousLeadId) return "Fresh for the next day";
  if (story.tags.some((tag) => profile.savedTags.includes(tag))) {
    const tag = story.tags.find((item) => profile.savedTags.includes(item));
    return `Because you saved ${tag}`;
  }
  if (profile.followedBrands.includes(story.brand)) return `New from ${story.brand}`;
  if (profile.followedTopics.includes(story.topic)) return `Matches your ${story.topic} interest`;
  if (demoState.returnHours > 0 && story.age <= demoState.returnHours + 2) return "New since last visit";
  if (getLifestyleTimeOfDayScore(story, demoState) > 0) return `Fits your ${daypart.label.toLowerCase()}`;
  if (story.popularity >= 92) return "Trending across Hearst Lifestyle";

  return "Balanced for freshness and variety";
}

function rankLifestyleRiver(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState
) {
  const scored = stories
    .filter((story) => !profile.hiddenIds.includes(story.id))
    .map((story) => ({ ...story, score: getLifestyleScore(story, profile, demoState) }))
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

function getLifestyleDemoStoryPool(demoState: LifestyleDemoState) {
  if (demoState.contentDay === "today") return lifestyleRiverStories;

  const nextDayStories = lifestyleRiverStories
    .filter((story, index) => index % 2 === 1 || story.topic === "Entertainment" || story.topic === "Shopping")
    .map((story) => ({
      ...story,
      age: Math.max(0, story.age - 24),
      popularity:
        story.topic === "Entertainment" || story.topic === "Shopping" || story.topic === "Home"
          ? Math.min(100, story.popularity + 8)
          : story.topic.startsWith("Food")
          ? Math.max(1, story.popularity - 8)
          : Math.max(1, story.popularity - 2),
      signal: story.age <= 24 ? "Trending" : story.signal,
    } satisfies LifestyleRiverStory));

  return nextDayStories.length >= 80 ? nextDayStories : lifestyleRiverStories;
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
        <Button
          variant="secondary"
          size="xs"
          className="bg-white text-[length:var(--text-token-4xs)] font-semibold text-[#7A2E57] hover:bg-white/90 hover:text-[#7A2E57]"
        >
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
      className={cn("min-w-0 bg-muted bg-cover", className)}
      style={{
        backgroundImage: `url("${story.image}")`,
        backgroundPosition: getLifestyleImagePosition(story),
      }}
    />
  );
}

function getLifestyleImagePosition(story: LifestyleRiverStory) {
  if (story.id === lifestyleDefaultLeadStoryId) return "center 22%";
  if (story.title === "Are Corbin and Parmida Still Together? Corbin Speaks Out") return "center 18%";
  return "center";
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

const lifestyleCardModelGuide: {
  kind: LifestyleCardKind;
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  when: string;
  module: string;
  riverUse: string;
}[] = [
  {
    kind: "article",
    title: "Article card",
    icon: ImageIcon,
    when: "Use for reported reads, explainers, service pieces, and stories where the headline and summary carry the value.",
    module: "Image, source, signal, headline, summary, explanation chip, save and feedback actions.",
    riverUse: "Default river unit. It should appear whenever a story does not need a specialized media, recipe, or commerce treatment.",
  },
  {
    kind: "gallery",
    title: "Photo gallery card",
    icon: Camera,
    when: "Use for rooms, outfits, garden ideas, beauty looks, transformations, and any story where browsing visuals is the main action.",
    module: "Image-led card with photo count, swipe-style cue, editor caption promise, and the same action row.",
    riverUse: "Ranks up for home, style, beauty, and design intent. It breaks up text-heavy feed stretches with visual discovery.",
  },
  {
    kind: "video",
    title: "Watch card",
    icon: Play,
    when: "Use for entertainment clips, quick demos, interviews, explainers, and stories a reader can preview without leaving the river.",
    module: "16:9 playable media surface, inline play or pause control, runtime, headline, summary, and feedback actions.",
    riverUse: "Ranks up in afternoon and late-night sessions when the model sees entertainment, TV, celebrity, or passive browsing intent.",
  },
  {
    kind: "recipe",
    title: "Recipe card",
    icon: ChefHat,
    when: "Use for food stories where time, servings, difficulty, or meal context helps the reader decide quickly.",
    module: "Food image, recipe badge, prep metrics, serving count, difficulty, summary, and save or more-like-this actions.",
    riverUse: "Ranks up around morning planning and evening return visits, especially when saved tags include dinner or cooking signals.",
  },
  {
    kind: "shopping",
    title: "Shopping card",
    icon: ShoppingBag,
    when: "Use for tested products, editor picks, deals, buying guides, lab recommendations, and service commerce stories.",
    module: "Product or lifestyle image, shop badge, editor-pick count, trust signal, summary, and save or follow actions.",
    riverUse: "Ranks up for shopping behavior, product tags, followed brands, and utility moments where a reader is comparing options.",
  },
];

function LifestyleCardModelGuide() {
  return (
    <section className="mt-4 rounded-[8px] border border-border bg-background" aria-label="Lifestyle river card models">
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          River Content Models
        </p>
        <h2 className="headline mt-1 text-2xl leading-tight">
          Five card styles share one atomic structure.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          The personalization layer picks the story order. The content model picks the best card treatment for the reader intent,
          so every item still feels like one coherent Hearst Lifestyle river.
        </p>
      </div>

      <div className="grid divide-y divide-border lg:grid-cols-5 lg:divide-x lg:divide-y-0">
        {lifestyleCardModelGuide.map((model) => {
          const Icon = model.icon;

          return (
            <article key={model.kind} className="min-w-0 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{model.title}</p>
                  <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                    {getLifestyleKindLabel(model.kind)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 space-y-3 text-xs leading-5">
                <div>
                  <dt className="font-bold text-foreground">When to use</dt>
                  <dd className="mt-1 text-muted-foreground">{model.when}</dd>
                </div>
                <div>
                  <dt className="font-bold text-foreground">Card modules</dt>
                  <dd className="mt-1 text-muted-foreground">{model.module}</dd>
                </div>
                <div>
                  <dt className="font-bold text-foreground">How it ranks</dt>
                  <dd className="mt-1 text-muted-foreground">{model.riverUse}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
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
    ? "aspect-video w-full"
    : "h-full min-h-32 w-full rounded-[4px]";
  const videoClassName = featured
    ? "aspect-video w-full 2xl:self-center"
    : "aspect-video w-full self-start rounded-[4px]";

  if (kind !== "video") {
    return <LifestyleRiverImage story={story} className={imageClassName} />;
  }

  return (
    <div
      className={cn("relative min-w-0 overflow-hidden bg-muted bg-cover", videoClassName)}
      style={{
        backgroundImage: `url("${story.image}")`,
        backgroundPosition: getLifestyleImagePosition(story),
      }}
    >
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
        <div className="rounded-[8px] bg-muted px-2 py-2">
          <p className="font-bold">{recipeMinutes} min</p>
          <p className="text-muted-foreground">Total</p>
        </div>
        <div className="rounded-[8px] bg-muted px-2 py-2">
          <p className="font-bold">{2 + (story.age % 5)}</p>
          <p className="text-muted-foreground">Servings</p>
        </div>
        <div className="rounded-[8px] bg-muted px-2 py-2">
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
  reason,
  score,
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
  reason: string;
  score: number;
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
      "min-w-0 cursor-pointer overflow-hidden rounded-[8px] border border-border bg-background transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30",
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
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
            {reason}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            Score {score}
          </span>
        </div>
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

function getLifestyleContextStories(currentStory: LifestyleRiverStory, stories: LifestyleRiverStory[]) {
  const otherStories = stories.filter((story) => story.id !== currentStory.id);
  const sameTopic = otherStories
    .filter((story) => story.topic === currentStory.topic)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
  const sameBrand = otherStories
    .filter((story) => story.brand === currentStory.brand)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
  const sharedIntent = otherStories
    .filter((story) => story.tags.some((tag) => currentStory.tags.includes(tag)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  return {
    sameTopic,
    sameBrand,
    sharedIntent,
    intentTags: currentStory.tags.slice(0, 4),
  };
}

function LifestyleReaderContextRail({
  currentStory,
  stories,
  onOpenStory,
}: {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
}) {
  const recommendations = getLifestyleContextStories(currentStory, stories);
  const kind = getLifestyleCardKind(currentStory);
  const intentLabel = {
    article: "Read next",
    gallery: "Visual ideas",
    video: "Watch next",
    recipe: "Cook next",
    shopping: "Shop the edit",
  }[kind];

  const modules = [
    {
      label: intentLabel,
      description: `More ${currentStory.topic.toLowerCase()} picks with similar reader intent.`,
      stories: recommendations.sharedIntent,
    },
    {
      label: `More from ${currentStory.brand}`,
      description: "Keep the session inside the same trusted brand voice.",
      stories: recommendations.sameBrand,
    },
    {
      label: `${currentStory.topic} signal`,
      description: "Related stories gaining momentum in this topic.",
      stories: recommendations.sameTopic,
    },
  ].filter((module) => module.stories.length > 0);

  return (
    <aside className="hidden xl:block" aria-label="Contextual story recommendations">
      <div className="sticky top-20 space-y-4">
        <div className="rounded-[8px] border border-border bg-muted/30 p-4">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Reader Intent
          </p>
          <p className="mt-3 text-sm font-bold leading-5">{currentStory.topic}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recommendations.intentTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-2 py-1 text-[length:var(--text-token-4xs)] font-semibold text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {modules.map((module) => (
          <div key={module.label} className="rounded-[8px] border border-border bg-background p-4">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              {module.label}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{module.description}</p>
            <div className="mt-4 space-y-3">
              {module.stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => onOpenStory(story.id)}
                  className="group w-full border-t border-border pt-3 text-left first:border-t-0 first:pt-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
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
                    {getLifestyleKindLabel(getLifestyleCardKind(story))}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-5 group-hover:text-primary">
                    {story.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {story.brand} · Popularity {story.popularity}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function LifestyleReaderSidebarAd() {
  return (
    <aside className="hidden lg:block" aria-label="Advertisement">
      <div className="sticky top-20 flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[8px] border border-[#d7c7b8] bg-[#fffaf4] shadow-sm">
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
  onOpenStory,
}: {
  stories: LifestyleRiverStory[];
  openStoryId: string | null;
  onClose: () => void;
  onOpenStory: (storyId: string) => void;
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
        className="absolute inset-x-0 bottom-0 top-6 mx-auto flex w-full max-w-[1360px] flex-col overflow-y-auto bg-background shadow-2xl sm:inset-y-6 sm:rounded-[8px]"
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

        <div className="grid gap-8 px-4 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <LifestyleReaderContextRail
            currentStory={storyQueue[0]}
            stories={stories}
            onOpenStory={onOpenStory}
          />
          <div className="min-w-0">
            {visibleReaderStories.map((story, index) => {
              const kind = getLifestyleCardKind(story);

              return (
                <article
                  key={story.id}
                  className={cn("border-b border-border pb-10", index > 0 && "pt-10")}
                >
                  <LifestyleRiverImage story={story} className="aspect-video w-full rounded-[4px]" />
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

function TodayEditDashboard({
  stories,
  profile,
  demoState,
  onOpenStory,
  onShowFollowedBrands,
}: {
  stories: LifestyleRiverStory[];
  profile: LifestyleRiverProfile;
  demoState: LifestyleDemoState;
  onOpenStory: (storyId: string) => void;
  onShowFollowedBrands: () => void;
}) {
  const continueStory = stories.find((story) => getLifestyleCardKind(story) === "video") || stories[1] || stories[0];
  const followedBrandStory =
    stories.find((story) => profile.followedBrands.includes(story.brand)) || stories[0];
  const trendingStory = [...stories].sort((a, b) => b.popularity - a.popularity)[0];
  const collectionStory =
    stories.find((story) => story.tags.some((tag) => profile.savedTags.includes(tag))) || stories[2] || stories[0];

  if (!continueStory || !followedBrandStory || !trendingStory || !collectionStory) return null;

  const modules = [
    {
      label: "Continue Reading",
      title: continueStory.title,
      meta: `${continueStory.brand} · ${continueStory.readTime}`,
      action: "Resume story",
      onClick: () => onOpenStory(continueStory.id),
    },
    {
      label: "New From Your Brands",
      title: followedBrandStory.title,
      meta: profile.followedBrands.slice(0, 2).join(", "),
      action: "Show my brands",
      onClick: onShowFollowedBrands,
    },
    {
      label: "Trending Today",
      title: trendingStory.title,
      meta: `${trendingStory.popularity} popularity · ${trendingStory.topic}`,
      action: "Open trend",
      onClick: () => onOpenStory(trendingStory.id),
    },
    {
      label: "Your Collections",
      title: collectionStory.title,
      meta: `${profile.savedTags.slice(0, 3).join(", ")}`,
      action: "Open collection pick",
      onClick: () => onOpenStory(collectionStory.id),
    },
  ];

  return (
    <section className="rounded-b-[8px] border-x border-b border-border bg-background" aria-label="Today&apos;s edit">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Today&apos;s Edit
          </p>
          <h2 className="headline mt-1 text-2xl leading-tight">
            Start with what changed since your last visit.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          A compact {lifestyleDemoDayparts[demoState.daypart].time} briefing built from your brands,
          saved signals, and the stories gaining momentum now.
        </p>
      </div>
      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
        {modules.map((module) => (
          <button
            key={module.label}
            type="button"
            onClick={module.onClick}
            className="group flex min-h-[144px] flex-col justify-between p-4 text-left transition-colors hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <span>
              <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                {module.label}
              </span>
              <span className="mt-3 block text-base font-bold leading-snug text-foreground">
                {module.title}
              </span>
              <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                {module.meta}
              </span>
            </span>
            <span className="mt-4 text-xs font-bold text-primary underline-offset-4 group-hover:underline">
              {module.action}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function LifestylePersonalizationDemoPanel({
  demoState,
  profile,
  topStory,
  onDaypartChange,
  onSimulateReturn,
  currentLeadId,
  onApplyBehaviorPreset,
  onResetDemo,
}: {
  demoState: LifestyleDemoState;
  profile: LifestyleRiverProfile;
  topStory?: LifestyleRiverStory;
  onDaypartChange: (daypart: LifestyleDemoDaypart) => void;
  onSimulateReturn: (
    hours: number,
    daypart: LifestyleDemoDaypart,
    contentDay?: LifestyleDemoState["contentDay"],
    previousLeadId?: string
  ) => void;
  currentLeadId?: string;
  onApplyBehaviorPreset: (preset: "homeCook" | "shoppingBrowser" | "wellnessReader") => void;
  onResetDemo: () => void;
}) {
  const activeDaypart = lifestyleDemoDayparts[demoState.daypart];
  const topBreakdown = topStory ? getLifestyleScoreBreakdown(topStory, profile, demoState) : null;

  return (
    <section className="rounded-[8px] border border-border bg-muted/25" aria-label="Personalization demo controls">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                Personalization Demo
              </p>
              <h2 className="headline mt-1 text-2xl leading-tight">
                Show how the river changes when the reader comes back.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                This is a deterministic POC model. It re-ranks the same story pool using recency,
                popularity, time of day, followed brands, saved tags, and observed behavior.
              </p>
            </div>
            <Button variant="outline" size="xs" onClick={onResetDemo}>
              Reset demo
            </Button>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Time of day</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(lifestyleDemoDayparts) as LifestyleDemoDaypart[]).map((daypart) => {
                  const item = lifestyleDemoDayparts[daypart];
                  const active = demoState.daypart === daypart;

                  return (
                    <Button
                      key={daypart}
                      variant={active ? "default" : "outline"}
                      size="xs"
                      onClick={() => onDaypartChange(daypart)}
                      aria-pressed={active}
                    >
                      {item.time}
                    </Button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm font-bold">{activeDaypart.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{activeDaypart.description}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Return visit</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="xs" onClick={() => onSimulateReturn(4, "afternoon")}>
                  +4 hours
                </Button>
                <Button variant="outline" size="xs" onClick={() => onSimulateReturn(10, "evening")}>
                  Evening return
                </Button>
                <Button variant="outline" size="xs" onClick={() => onSimulateReturn(14, "lateNight")}>
                  Late night
                </Button>
                <Button variant={demoState.contentDay === "nextDay" ? "default" : "outline"} size="xs" onClick={() => onSimulateReturn(24, "morning", "nextDay", currentLeadId)}>
                  Next day
                </Button>
              </div>
              <p className="mt-3 text-sm font-bold">
                {demoState.contentDay === "nextDay"
                  ? "Next day edition"
                  : demoState.returnHours > 0
                  ? `Back after ${demoState.returnHours} hours`
                  : "First visit today"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {demoState.contentDay === "nextDay"
                  ? "A refreshed story pool loads first, then the selected time of day ranks that new edition."
                  : "Return visits lift stories that are fresh since the last session and relevant to the new context."}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Behavior presets</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="xs" onClick={() => onApplyBehaviorPreset("homeCook")}>
                  Home cook
                </Button>
                <Button variant="outline" size="xs" onClick={() => onApplyBehaviorPreset("shoppingBrowser")}>
                  Shops picks
                </Button>
                <Button variant="outline" size="xs" onClick={() => onApplyBehaviorPreset("wellnessReader")}>
                  Wellness
                </Button>
              </div>
              <p className="mt-3 text-sm font-bold">Demo behavior changes ranking live</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Presets simulate saves, follows, more-like-this activity, and topic intent.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4 sm:p-5 lg:border-l lg:border-t-0">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Current top story score
          </p>
          {topStory && topBreakdown ? (
            <div className="mt-3 space-y-3 text-sm">
              <p className="font-bold leading-5">{topStory.title}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Popularity</dt>
                  <dd className="font-bold">{topBreakdown.popularity}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Recency</dt>
                  <dd className="font-bold">{topBreakdown.recency}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Behavior</dt>
                  <dd className="font-bold">
                    {topBreakdown.followedTopic +
                      topBreakdown.followedBrand +
                      topBreakdown.savedTag +
                      topBreakdown.moreLikeThis}
                  </dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Daypart</dt>
                  <dd className="font-bold">{topBreakdown.timeOfDay}</dd>
                </div>
              </dl>
              <p className="rounded-[8px] bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground">
                Total score {topBreakdown.total}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No story selected in the current filter.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function LifestylePersonalizationDemoModal({
  open,
  onClose,
  demoState,
  profile,
  topStory,
  onDaypartChange,
  onSimulateReturn,
  onApplyBehaviorPreset,
  onResetDemo,
}: {
  open: boolean;
  onClose: () => void;
  demoState: LifestyleDemoState;
  profile: LifestyleRiverProfile;
  topStory?: LifestyleRiverStory;
  onDaypartChange: (daypart: LifestyleDemoDaypart) => void;
  onSimulateReturn: (
    hours: number,
    daypart: LifestyleDemoDaypart,
    contentDay?: LifestyleDemoState["contentDay"],
    previousLeadId?: string
  ) => void;
  onApplyBehaviorPreset: (preset: "homeCook" | "shoppingBrowser" | "wellnessReader") => void;
  onResetDemo: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Personalization demo controls"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div className="absolute inset-x-3 bottom-4 top-4 mx-auto flex w-auto max-w-6xl flex-col overflow-hidden bg-background shadow-2xl sm:inset-x-8 sm:bottom-auto sm:top-12 sm:max-h-[calc(100vh-6rem)]">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Stakeholder Demo Console
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              Control daypart, return visit, behavior presets, and score explanation.
            </p>
          </div>
          <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close personalization demo">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">
          <LifestylePersonalizationDemoPanel
            demoState={demoState}
            profile={profile}
            topStory={topStory}
            currentLeadId={topStory?.id}
            onDaypartChange={onDaypartChange}
            onSimulateReturn={onSimulateReturn}
            onApplyBehaviorPreset={onApplyBehaviorPreset}
            onResetDemo={onResetDemo}
          />
          <LifestyleCardModelGuide />
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
    <aside
      className="space-y-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
      aria-label="Lifestyle discovery sidebar"
    >
      <div className="rounded-[8px] border border-border p-4">
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

      <div className="rounded-[8px] border border-border p-4">
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
                      "inline-block h-5 w-5 shrink-0 rounded-[8px] border bg-background",
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

      <div className="rounded-[8px] border border-border p-4">
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

      <div className="rounded-[8px] border border-border bg-muted/30 p-4">
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
  const [demoState, setDemoState] = React.useState<LifestyleDemoState>(initialLifestyleDemoState);
  const [activeBrandFilters, setActiveBrandFilters] = React.useState<string[]>([]);
  const [openStoryId, setOpenStoryId] = React.useState<string | null>(null);
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(8);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const activeStoryPool = React.useMemo(() => getLifestyleDemoStoryPool(demoState), [demoState]);
  const rankedStories = React.useMemo(
    () => rankLifestyleRiver(activeStoryPool, profile, demoState),
    [activeStoryPool, demoState, profile]
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
    const counts = activeStoryPool.reduce<Record<string, number>>((acc, story) => {
      acc[story.topic] = (acc[story.topic] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [activeStoryPool]);
  const sidebarBrands = React.useMemo(() => {
    const counts = activeStoryPool.reduce<Record<string, number>>((acc, story) => {
      acc[story.brand] = (acc[story.brand] ?? 0) + 1;
      return acc;
    }, {});

    return lifestyleRiverSourceNotes.map((note) => ({
      name: note.brand,
      slug: note.brandSlug,
      count: counts[note.brand] ?? 0,
    }));
  }, [activeStoryPool]);

  React.useEffect(() => {
    setVisibleCount(8);
  }, [activeBrandFilters, activeFilter, demoState.contentDay, demoState.daypart]);

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

  const resetDemo = () => {
    setProfile(initialLifestyleProfile);
    setDemoState(initialLifestyleDemoState);
    setActiveBrandFilters([]);
    setOpenStoryId(null);
  };

  const simulateReturn = (
    returnHours: number,
    daypart: LifestyleDemoDaypart,
    contentDay: LifestyleDemoState["contentDay"] = "today",
    previousLeadId?: string
  ) => {
    setDemoState({ returnHours, daypart, contentDay, previousLeadId });
  };

  const applyBehaviorPreset = (preset: "homeCook" | "shoppingBrowser" | "wellnessReader") => {
    const presets: Record<"homeCook" | "shoppingBrowser" | "wellnessReader", Partial<LifestyleRiverProfile>> = {
      homeCook: {
        followedTopics: ["Food", "Food Drinks", "Home"],
        followedBrands: ["Delish", "Good Housekeeping", "Country Living"],
        savedTags: ["dinner ideas", "cookout", "cleaning", "decorating"],
        boostedTags: ["recipe", "dinner ideas", "cookout", "food"],
      },
      shoppingBrowser: {
        followedTopics: ["Shopping", "Style", "Home"],
        followedBrands: ["Good Housekeeping", "Cosmopolitan", "House Beautiful"],
        savedTags: ["products", "style", "beauty", "decorating"],
        boostedTags: ["products", "shopping", "editor picks", "style"],
      },
      wellnessReader: {
        followedTopics: ["Wellness", "Style", "Food"],
        followedBrands: ["Prevention", "Good Housekeeping", "Cosmopolitan"],
        savedTags: ["sleep", "health", "beauty", "food"],
        boostedTags: ["sleep", "health", "wellness", "beauty"],
      },
    };

    const selected = presets[preset];

    setProfile((current) => ({
      ...current,
      followedTopics: mergeUnique(current.followedTopics, selected.followedTopics ?? []),
      followedBrands: mergeUnique(current.followedBrands, selected.followedBrands ?? []),
      savedTags: mergeUnique(current.savedTags, selected.savedTags ?? []),
      boostedTags: mergeUnique(current.boostedTags, selected.boostedTags ?? []),
    }));
  };

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

  const showFollowedBrands = () => {
    const availableFollowedBrands = sidebarBrands
      .filter((brand) => brand.count > 0 && profile.followedBrands.includes(brand.name))
      .map((brand) => brand.name);

    setActiveBrandFilters(availableFollowedBrands);
  };

  const hideStory = (id: string) => {
    setProfile((current) => ({
      ...current,
      hiddenIds: mergeUnique(current.hiddenIds, [id]),
    }));
  };

  return (
    <div className="space-y-8">
      <TodayEditDashboard
        stories={filteredStories}
        profile={profile}
        demoState={demoState}
        onOpenStory={setOpenStoryId}
        onShowFollowedBrands={showFollowedBrands}
      />

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
                reason={getLifestylePersonalizationReason(leadStory, profile, demoState)}
                score={getLifestyleScoreBreakdown(leadStory, profile, demoState).total}
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
                  reason={getLifestylePersonalizationReason(story, profile, demoState)}
                  score={getLifestyleScoreBreakdown(story, profile, demoState).total}
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
            <div className="rounded-[8px] border border-border bg-muted/30 p-8 text-center">
              <p className="headline text-2xl">No stories in {activeFilter} yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear a brand filter or switch back to For You to keep exploring.
              </p>
            </div>
          )}
        </main>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <div className="rounded-[8px] border border-border p-4">
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
          <div className="rounded-[8px] border border-border bg-muted/30 p-4">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              POC Data Source
            </p>
            <p className="mt-3 text-sm font-bold">
              {activeStoryPool.length} real-image stories
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {demoState.contentDay === "nextDay" ? "Next-day demo edition generated from " : "Pulled from "}
              public Hearst lifestyle RSS metadata and filtered to stories with Hearst CDN images.
              Public Redbook RSS returned no image-backed items during the latest import.
            </p>
          </div>
          <div className="rounded-[8px] border border-border p-4">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Why Your River Looks Like This
            </p>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-bold">Demo moment</p>
                <p className="mt-1 text-muted-foreground">
                  {demoState.contentDay === "nextDay" ? "Next day edition · " : ""}
                  {lifestyleDemoDayparts[demoState.daypart].label}
                  {demoState.returnHours > 0 ? ` · back after ${demoState.returnHours} hours` : " · first visit"}
                </p>
              </div>
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
        onOpenStory={setOpenStoryId}
      />

      <Button
        type="button"
        variant="default"
        size="icon"
        onClick={() => setDemoModalOpen(true)}
        className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full shadow-lg"
        aria-label="Open personalization demo controls"
      >
        <SlidersHorizontal className="h-5 w-5" aria-hidden />
      </Button>

      <LifestylePersonalizationDemoModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        demoState={demoState}
        profile={profile}
        topStory={leadStory}
        onDaypartChange={(daypart) => setDemoState((current) => ({ ...current, daypart }))}
        onSimulateReturn={simulateReturn}
        onApplyBehaviorPreset={applyBehaviorPreset}
        onResetDemo={resetDemo}
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
        <div className="rounded-[8px] border border-border bg-muted/40 p-4">
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
            activity, recency, time of day, return-visit freshness, and diversity rules.
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
      <PageContainer className={cn("relative", brand.slug === "hearst-lifestyle" ? "pt-0" : "pt-8 lg:pt-12")}>
        {showGridOverlay && <GridOverlay />}
        <div className={cn("relative z-10", brand.slug === "hearst-lifestyle" ? "space-y-8" : "space-y-12 lg:space-y-16")}>
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
