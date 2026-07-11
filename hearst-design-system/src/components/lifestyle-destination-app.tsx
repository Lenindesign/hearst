"use client";

import React from "react";
import {
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  CircleUserRound,
  Compass,
  EyeOff,
  Heart,
  Menu,
  Plus,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  ArticleCard,
  ArticleCardContent,
  ArticleCardDescription,
  ArticleCardEyebrow,
  ArticleCardImage,
  ArticleCardMeta,
  ArticleCardMetaItem,
  ArticleCardTitle,
} from "@/components/ui/article-card";
import { BrandLogo } from "@/components/brand-logo";
import { brandLogos } from "@/lib/logos";
import { brands } from "@/lib/brands";
import { hearstPlusLightVars, type HearstPlusCssVars } from "@/lib/hearst-plus-theme";
import { cn } from "@/lib/utils";

type StoryFormat = "feature" | "service" | "recipe" | "shopping" | "quick-read";
type ReaderMode = "morning" | "weekend" | "shopping";
type FeedbackAction = "save" | "followTopic" | "followBrand" | "hide" | "collect" | "moreLikeThis";

export type LifestyleDestinationProps = {
  readerMode?: ReaderMode;
  topicFocus?: string;
  showPersonalization?: boolean;
};

type LifestyleStory = {
  id: string;
  brandSlug: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  readTime: string;
  signal: string;
  tags: string[];
  format: StoryFormat;
  publishedAt: string;
};

type ReaderProfile = {
  followedTopics: string[];
  followedBrands: string[];
  savedTags: string[];
  savedCollections: string[];
  recentlyReadIds: string[];
  mutedTopics: string[];
  timeOfDay: ReaderMode;
};

type RankedStory = LifestyleStory & {
  personalizationScore: number;
  scoreBreakdown: string[];
};

const H = "https://hips.hearstapps.com/hmg-prod/images/";

const lifestyleVars: HearstPlusCssVars = {
  ...hearstPlusLightVars,
  "--background": "#f7f7f4",
  "--foreground": "#171714",
  "--card": "#ffffff",
  "--muted": "#eeeee9",
  "--muted-foreground": "#5d615b",
  "--primary": "#24524b",
  "--ring": "#e0b44f",
  "--hp-background": "#f7f7f4",
  "--hp-nav": "#171714",
  "--hp-logo": "#e0b44f",
  "--hp-primary": "#24524b",
  "--hp-primary-soft": "#e9dcc2",
  "--hp-action": "#24524b",
  "--hp-action-hover": "#1d433d",
  "--hp-action-soft": "#e9dcc2",
  "--hp-action-soft-text": "#24524b",
  "--hp-friendly-accent": "#efe3c8",
  "--hp-friendly-accent-hover": "#e6d5ad",
  "--hp-friendly-accent-border": "#24524b",
  "--hp-friendly-accent-text": "#213d38",
  "--hp-focus": "#e0b44f",
  "--hp-signal": "#24524b",
  "--hp-rank-bg": "#efe3c8",
  "--hp-rank-border": "#e0b44f",
  "--hp-rank-text": "#24524b",
  "--hp-shadow-card": "none",
};

const lifestyleBrandSlugs = [
  "cosmopolitan",
  "country-living",
  "delish",
  "good-housekeeping",
  "house-beautiful",
  "the-pioneer-woman",
  "prevention",
  "redbook",
  "seventeen",
  "womans-day",
];

const topicChips = [
  "For You",
  "Dinner",
  "Home",
  "Wellness",
  "Style",
  "Shopping",
  "Family",
  "Entertainment",
  "Trending",
];

const lifestyleStories: LifestyleStory[] = [
  {
    id: "cosmo-style-reset",
    brandSlug: "cosmopolitan",
    topic: "Style",
    title: "The easy outfit reset editors are saving for every summer weekend",
    summary: "A low-effort mix of color, denim, and accessories that moves from brunch to late plans.",
    image: `${H}843c358a-a55b-487d-af41-35a871b22cfd.jpg?crop=1xw:0.65xh;0xw,0.10xh&resize=1200:*`,
    readTime: "4 min",
    signal: "Because you follow style ideas",
    tags: ["Style", "Weekend", "Shopping"],
    format: "shopping",
    publishedAt: "2026-07-11T08:15:00-07:00",
  },
  {
    id: "cl-front-porch",
    brandSlug: "country-living",
    topic: "Home",
    title: "Small front porch changes that make the whole house feel happier",
    summary: "Paint, planters, vintage seating, and lighting details that add charm without a renovation.",
    image: `${H}6f324cc1-2238-4f3f-a7c9-e9a9bf59f7b3.jpg?crop=0.5xw:1xh;0xw,0xh&resize=1200:*`,
    readTime: "6 min",
    signal: "Because you saved cottage decorating",
    tags: ["Home", "Decorating", "Weekend"],
    format: "service",
    publishedAt: "2026-07-10T18:45:00-07:00",
  },
  {
    id: "delish-summer-dinner",
    brandSlug: "delish",
    topic: "Dinner",
    title: "The no-stress summer dinner plan for nights when everyone is hungry now",
    summary: "Fast mains, cold sides, and one dessert that can sit on the counter until people show up.",
    image: `${H}brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg?crop=1.00xw:0.75xh;0,0.15xh&resize=1200:*`,
    readTime: "5 min",
    signal: "Because you saved dinner ideas",
    tags: ["Dinner", "Recipes", "Summer"],
    format: "recipe",
    publishedAt: "2026-07-11T06:30:00-07:00",
  },
  {
    id: "gh-lab-tested-cooling",
    brandSlug: "good-housekeeping",
    topic: "Shopping",
    title: "Cooling bedding that actually held up in lab testing",
    summary: "The sheets, pillows, and mattress pads that stayed breathable after repeat washes.",
    image: `${H}bedding-awards-index-69ab12c972312.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=1000:*`,
    readTime: "8 min",
    signal: "Because you trust tested home picks",
    tags: ["Shopping", "Home", "Tested"],
    format: "shopping",
    publishedAt: "2026-07-10T12:20:00-07:00",
  },
  {
    id: "hb-hosting-room",
    brandSlug: "house-beautiful",
    topic: "Home",
    title: "The hosting room designers keep returning to for better parties",
    summary: "A layered living space proves that seating plans, lighting, and texture matter more than size.",
    image: `${H}53bef857-0f56-4bbe-a0be-60f51d27ed82.jpg?crop=0.85xw:1xh;center,top&resize=1200:*`,
    readTime: "7 min",
    signal: "Because you read room tours",
    tags: ["Home", "Design", "Hosting"],
    format: "feature",
    publishedAt: "2026-07-09T14:10:00-07:00",
  },
  {
    id: "pw-sheet-pan",
    brandSlug: "the-pioneer-woman",
    topic: "Dinner",
    title: "A sheet-pan dinner that gives you the good part of a cookout indoors",
    summary: "Peppers, onions, chicken, and a bright sauce do the work while the oven stays in charge.",
    image: `${H}beet-reuben-sandwich-index-web-3917-del029926-69a9f90c9b041.jpg?crop=1xw:0.75xh;center,top&resize=1000:*`,
    readTime: "4 min",
    signal: "Related to your weeknight meals collection",
    tags: ["Dinner", "Recipes", "Family"],
    format: "recipe",
    publishedAt: "2026-07-11T05:45:00-07:00",
  },
  {
    id: "prevention-walking",
    brandSlug: "prevention",
    topic: "Wellness",
    title: "The walking intervals that make a short morning loop count",
    summary: "A simple pace pattern for heart health, mood, and energy before the day gets loud.",
    image: `${H}dsc01737-1-jpg-68539980992c9.jpg?crop=1xw:0.7xh;center,top&resize=1000:*`,
    readTime: "5 min",
    signal: "Because you follow wellness routines",
    tags: ["Wellness", "Fitness", "Morning"],
    format: "service",
    publishedAt: "2026-07-11T07:10:00-07:00",
  },
  {
    id: "redbook-friendship",
    brandSlug: "redbook",
    topic: "Family",
    title: "The low-pressure way busy friends are making plans again",
    summary: "Experts explain why repeatable rituals work better than the perfect open weekend.",
    image: `${H}d3f8e6f2-d609-4161-b9f8-b56af736c3ec.jpeg?crop=1xw:0.7xh;center,top&resize=1000:*`,
    readTime: "6 min",
    signal: "Because you saved relationship advice",
    tags: ["Family", "Relationships", "Life"],
    format: "quick-read",
    publishedAt: "2026-07-10T09:30:00-07:00",
  },
  {
    id: "seventeen-pop-culture",
    brandSlug: "seventeen",
    topic: "Entertainment",
    title: "The pop culture moments your group chat is already debating",
    summary: "Music, shows, beauty drops, and celebrity style that crossed over this week.",
    image: `${H}f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg?crop=1xw:0.74xh;center,top&resize=1000:*`,
    readTime: "3 min",
    signal: "Trending with Seventeen readers",
    tags: ["Entertainment", "Style", "Celebs"],
    format: "quick-read",
    publishedAt: "2026-07-11T09:40:00-07:00",
  },
  {
    id: "wd-money-habits",
    brandSlug: "womans-day",
    topic: "Family",
    title: "The weekly money habit that makes back-to-school season less chaotic",
    summary: "A practical checklist for expenses, pantry planning, and the little fees that sneak up.",
    image: `${H}8d200d0a-0603-4451-90d9-623b7d78475d.jpg?crop=1xw:0.72xh;center,top&resize=1000:*`,
    readTime: "7 min",
    signal: "Because you follow family planning",
    tags: ["Family", "Money", "Planning"],
    format: "service",
    publishedAt: "2026-07-09T07:25:00-07:00",
  },
  {
    id: "gh-quick-clean",
    brandSlug: "good-housekeeping",
    topic: "Home",
    title: "A 20-minute kitchen reset before guests arrive",
    summary: "The Good Housekeeping order of operations: surfaces, sink, scent, and the one thing to skip.",
    image: `${H}8e00c74c-5dc8-41a4-ad99-c54bfae9eacb.jpg?crop=0.85xw:1.00xh;0.08xw,0&resize=1000:*`,
    readTime: "4 min",
    signal: "Because you saved cleaning shortcuts",
    tags: ["Home", "Cleaning", "Hosting"],
    format: "service",
    publishedAt: "2026-07-10T17:50:00-07:00",
  },
  {
    id: "delish-strawberry",
    brandSlug: "delish",
    topic: "Dinner",
    title: "The strawberry dessert that disappears before the plates do",
    summary: "A make-ahead sweet that works for a backyard table, a birthday, or a Thursday night.",
    image: `${H}547251bc-b6aa-4730-ac6e-6f91204fef8c.jpeg?crop=0.8xw:1xh;center,top&resize=1000:*`,
    readTime: "4 min",
    signal: "Trending with Delish readers",
    tags: ["Recipes", "Dessert", "Summer"],
    format: "recipe",
    publishedAt: "2026-07-08T16:10:00-07:00",
  },
];

const trendLiftByStoryId: Record<string, number> = {
  "delish-summer-dinner": 39,
  "cosmo-style-reset": 34,
  "prevention-walking": 31,
  "seventeen-pop-culture": 29,
  "gh-lab-tested-cooling": 27,
  "pw-sheet-pan": 25,
  "cl-front-porch": 22,
  "gh-quick-clean": 20,
  "hb-hosting-room": 18,
  "redbook-friendship": 16,
  "wd-money-habits": 15,
  "delish-strawberry": 14,
};

const collectionInterestMap: Record<string, string[]> = {
  "Dinner Ideas": ["Dinner", "Recipes", "Summer", "Family"],
  "Home Refresh": ["Home", "Decorating", "Cleaning", "Design", "Hosting"],
  "Feel Better": ["Wellness", "Fitness", "Morning"],
  "Smart Shopping": ["Shopping", "Style", "Tested"],
};

const topicInterestMap: Record<string, string[]> = {
  "For You": ["Dinner", "Home", "Wellness", "Style", "Shopping", "Family", "Entertainment"],
  Dinner: ["Dinner", "Recipes", "Summer", "Dessert"],
  Home: ["Home", "Decorating", "Cleaning", "Design", "Hosting"],
  Wellness: ["Wellness", "Fitness", "Morning"],
  Style: ["Style", "Shopping", "Celebs"],
  Shopping: ["Shopping", "Tested", "Style"],
  Family: ["Family", "Relationships", "Money", "Planning"],
  Entertainment: ["Entertainment", "Celebs", "Style"],
  Trending: ["Trending", "Entertainment", "Style", "Dinner"],
};

function titleize(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getBrand(slug: string) {
  const brand = brands.find((item) => item.slug === slug);
  return {
    slug,
    name: brand?.name ?? titleize(slug),
    accent: brand?.colors["1"] ?? "#24524b",
    secondary: brand?.colors["2"] ?? "#f3efe4",
    mark: (brand?.name ?? titleize(slug))
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 3),
  };
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function removeValues(values: string[], removedValues: string[]) {
  const removed = new Set(removedValues.map(normalizeValue));
  return values.filter((value) => !removed.has(normalizeValue(value)));
}

function getStoryTokens(story: LifestyleStory) {
  const brand = getBrand(story.brandSlug);
  return new Set([story.id, story.brandSlug, brand.name, story.topic, story.format, ...story.tags].map(normalizeValue));
}

function storyMatchesInterest(story: LifestyleStory, interest: string) {
  const tokens = getStoryTokens(story);
  const aliases = topicInterestMap[interest] ?? [interest];
  return aliases.some((alias) => tokens.has(normalizeValue(alias)));
}

function getSavedTagMatch(story: LifestyleStory, profile: ReaderProfile) {
  const tokens = getStoryTokens(story);
  return profile.savedTags.find((tag) => tokens.has(normalizeValue(tag)));
}

function getFollowedTopicMatch(story: LifestyleStory, profile: ReaderProfile) {
  return profile.followedTopics.find((topic) => storyMatchesInterest(story, topic));
}

function collectionMatchesStory(story: LifestyleStory, collectionTitle: string) {
  const tokens = getStoryTokens(story);
  const collectionTokens = [collectionTitle, ...(collectionInterestMap[collectionTitle] ?? [])].map(normalizeValue);
  return collectionTokens.some((token) => tokens.has(token));
}

function getCollectionMatch(story: LifestyleStory, profile: ReaderProfile) {
  return profile.savedCollections.find((collectionTitle) => collectionMatchesStory(story, collectionTitle));
}

function getBestCollectionForStory(story: LifestyleStory) {
  return Object.keys(collectionInterestMap).find((collectionTitle) => collectionMatchesStory(story, collectionTitle));
}

function daysSincePublished(story: LifestyleStory) {
  const now = new Date("2026-07-11T12:00:00-07:00").getTime();
  const published = new Date(story.publishedAt).getTime();
  return Math.max(0, Math.round((now - published) / 86_400_000));
}

function formatRecommendationValue(value: string) {
  return value.length <= 4 || /^[A-Z0-9&]+$/.test(value) ? value : value.toLowerCase();
}

function getRecommendationReason(story: LifestyleStory, profile: ReaderProfile) {
  const savedTag = getSavedTagMatch(story, profile);
  if (savedTag) return `Because you saved ${formatRecommendationValue(savedTag)}`;

  const collectionTitle = getCollectionMatch(story, profile);
  if (collectionTitle) return `Related to your ${collectionTitle} collection`;

  const followedTopic = getFollowedTopicMatch(story, profile);
  if (followedTopic) return `Because you follow ${formatRecommendationValue(followedTopic)}`;

  if (profile.followedBrands.includes(story.brandSlug)) return `Because you follow ${getBrand(story.brandSlug).name}`;

  if ((trendLiftByStoryId[story.id] ?? 0) > 0) return `Trending with ${getBrand(story.brandSlug).name} readers`;

  return story.signal;
}

function scoreStory(story: LifestyleStory, profile: ReaderProfile, topicFocus: string) {
  const breakdown: string[] = [];
  let score = 10;

  if (topicFocus !== "For You" && storyMatchesInterest(story, topicFocus)) {
    score += 46;
    breakdown.push(`focus:${topicFocus}`);
  }

  const followedTopic = getFollowedTopicMatch(story, profile);
  if (followedTopic) {
    score += 36;
    breakdown.push(`topic:${followedTopic}`);
  }

  const savedTag = getSavedTagMatch(story, profile);
  if (savedTag) {
    score += 30;
    breakdown.push(`saved:${savedTag}`);
  }

  if (profile.followedBrands.includes(story.brandSlug)) {
    score += 22;
    breakdown.push(`brand:${story.brandSlug}`);
  }

  const collectionTitle = getCollectionMatch(story, profile);
  if (collectionTitle) {
    score += 26;
    breakdown.push(`collection:${collectionTitle}`);
  }

  const trendLift = trendLiftByStoryId[story.id] ?? 0;
  if (trendLift > 0) {
    score += Math.round(trendLift * 0.45);
    breakdown.push(`trending:${trendLift}`);
  }

  const recencyBoost = Math.max(0, 16 - daysSincePublished(story) * 5);
  if (recencyBoost > 0) {
    score += recencyBoost;
    breakdown.push(`fresh:${recencyBoost}`);
  }

  if (profile.timeOfDay === "morning" && ["Dinner", "Wellness", "Family", "Shopping"].includes(story.topic)) {
    score += 8;
    breakdown.push("morning");
  }

  if (profile.timeOfDay === "weekend" && ["Home", "Dinner", "Entertainment"].includes(story.topic)) {
    score += 12;
    breakdown.push("weekend");
  }

  if (profile.timeOfDay === "shopping" && ["Shopping", "Style", "Home"].includes(story.topic)) {
    score += 14;
    breakdown.push("shopping");
  }

  if (profile.recentlyReadIds.includes(story.id)) {
    score -= 24;
    breakdown.push("recently-read");
  }

  if (profile.mutedTopics.some((topic) => storyMatchesInterest(story, topic))) {
    score -= 100;
    breakdown.push("muted");
  }

  return { score, breakdown };
}

function enforceDiversity(stories: RankedStory[]) {
  const remaining = [...stories];
  const result: RankedStory[] = [];

  while (remaining.length > 0) {
    const pickIndex = remaining.findIndex((story) => {
      const lastTwo = result.slice(-2);
      if (lastTwo.length < 2) return true;
      const repeatsBrand = lastTwo.every((item) => item.brandSlug === story.brandSlug);
      const repeatsTopic = lastTwo.every((item) => item.topic === story.topic);
      return !repeatsBrand && !repeatsTopic;
    });

    const [next] = remaining.splice(pickIndex === -1 ? 0 : pickIndex, 1);
    result.push(next);
  }

  return result;
}

function getPersonalizedFeed(stories: LifestyleStory[], profile: ReaderProfile, topicFocus: string): RankedStory[] {
  const ranked = stories
    .map((story) => {
      const { score, breakdown } = scoreStory(story, profile, topicFocus);
      return {
        ...story,
        signal: getRecommendationReason(story, profile),
        personalizationScore: score,
        scoreBreakdown: breakdown,
      };
    })
    .filter((story) => story.personalizationScore > -20)
    .sort((a, b) => {
      if (b.personalizationScore !== a.personalizationScore) return b.personalizationScore - a.personalizationScore;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return enforceDiversity(ranked);
}

function applyFeedback(profile: ReaderProfile, story: LifestyleStory, action: FeedbackAction, isActive: boolean): ReaderProfile {
  if (action === "save") {
    return {
      ...profile,
      savedTags: isActive ? uniqueValues([...profile.savedTags, ...story.tags]) : removeValues(profile.savedTags, story.tags),
    };
  }

  if (action === "followTopic" || action === "moreLikeThis") {
    return {
      ...profile,
      followedTopics: isActive ? uniqueValues([...profile.followedTopics, story.topic]) : removeValues(profile.followedTopics, [story.topic]),
      savedTags: action === "moreLikeThis" && isActive ? uniqueValues([...profile.savedTags, ...story.tags]) : profile.savedTags,
    };
  }

  if (action === "followBrand") {
    return {
      ...profile,
      followedBrands: isActive ? uniqueValues([...profile.followedBrands, story.brandSlug]) : removeValues(profile.followedBrands, [story.brandSlug]),
    };
  }

  if (action === "collect") {
    const collectionTitle = getBestCollectionForStory(story);
    if (!collectionTitle) return profile;
    return {
      ...profile,
      savedCollections: isActive
        ? uniqueValues([...profile.savedCollections, collectionTitle])
        : removeValues(profile.savedCollections, [collectionTitle]),
    };
  }

  return {
    ...profile,
    mutedTopics: isActive ? uniqueValues([...profile.mutedTopics, story.topic]) : removeValues(profile.mutedTopics, [story.topic]),
  };
}

function getInitialProfile(readerMode: ReaderMode): ReaderProfile {
  const modeProfiles: Record<ReaderMode, ReaderProfile> = {
    morning: {
      followedTopics: ["Dinner", "Wellness", "Home", "Family"],
      followedBrands: ["delish", "good-housekeeping", "prevention", "country-living"],
      savedTags: ["Dinner", "Recipes", "Cleaning", "Morning", "Planning"],
      savedCollections: ["Dinner Ideas", "Home Refresh", "Feel Better"],
      recentlyReadIds: ["delish-strawberry"],
      mutedTopics: [],
      timeOfDay: "morning",
    },
    weekend: {
      followedTopics: ["Home", "Dinner", "Entertainment", "Style"],
      followedBrands: ["house-beautiful", "country-living", "the-pioneer-woman", "seventeen"],
      savedTags: ["Hosting", "Decorating", "Recipes", "Summer"],
      savedCollections: ["Home Refresh", "Dinner Ideas"],
      recentlyReadIds: [],
      mutedTopics: [],
      timeOfDay: "weekend",
    },
    shopping: {
      followedTopics: ["Shopping", "Style", "Home", "Wellness"],
      followedBrands: ["cosmopolitan", "good-housekeeping", "house-beautiful"],
      savedTags: ["Shopping", "Tested", "Style", "Home"],
      savedCollections: ["Smart Shopping", "Home Refresh"],
      recentlyReadIds: [],
      mutedTopics: [],
      timeOfDay: "shopping",
    },
  };

  return modeProfiles[readerMode];
}

function BrandAvatar({ slug, size = "md" }: { slug: string; size?: "sm" | "md" | "lg" }) {
  const brand = getBrand(slug);
  const hasLogo = Boolean(brandLogos[slug]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-black/10 bg-white",
        size === "sm" && "size-7",
        size === "md" && "size-9",
        size === "lg" && "size-11",
      )}
      style={{ color: brand.accent }}
    >
      {hasLogo ? (
        <BrandLogo
          slug={slug}
          className={cn(
            "block [&_svg]:w-auto",
            size === "sm" && "[&_svg]:h-3 [&_svg]:max-w-5",
            size === "md" && "[&_svg]:h-3.5 [&_svg]:max-w-7",
            size === "lg" && "[&_svg]:h-4 [&_svg]:max-w-8",
          )}
          color={brand.accent}
        />
      ) : (
        <span className="text-xs font-black">{brand.mark}</span>
      )}
    </span>
  );
}

function SourceLabel({ slug }: { slug: string }) {
  const brand = getBrand(slug);

  return (
    <span className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--hp-border)] bg-white px-2 py-1 text-xs font-bold text-[var(--hp-text-primary)]">
      <BrandAvatar slug={slug} size="sm" />
      {brand.name}
    </span>
  );
}

function IconButton({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-control)] text-[var(--hp-text-ui)] transition hover:bg-[var(--hp-control-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function FeedbackButton({
  icon: Icon,
  label,
  activeLabel,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  activeLabel: string;
  onChange: (isActive: boolean) => void;
}) {
  const [active, setActive] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={active ? activeLabel : label}
      aria-pressed={active}
      onClick={() => {
        setActive((current) => {
          const next = !current;
          onChange(next);
          return next;
        });
      }}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[var(--hp-border)] px-3 text-xs font-bold text-[var(--hp-text-secondary)] transition hover:bg-[var(--hp-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]",
        active && "border-[var(--hp-friendly-accent-border)] bg-[var(--hp-friendly-accent)] text-[var(--hp-friendly-accent-text)]",
      )}
    >
      <Icon className="size-4" />
      <span>{active ? activeLabel : label}</span>
    </button>
  );
}

function DailyBrief({ rankedStories }: { rankedStories: RankedStory[] }) {
  const topStory = rankedStories[0];
  const trending = [...rankedStories].sort((a, b) => (trendLiftByStoryId[b.id] ?? 0) - (trendLiftByStoryId[a.id] ?? 0))[0];

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {[
        { label: "For You", value: topStory?.title ?? "Fresh stories are ready", icon: Sparkles },
        { label: "Trending", value: trending?.title ?? "Readers are moving fast", icon: TrendingUp },
        { label: "Continue Reading", value: "2 saved stories and 4 new follow-ups", icon: Bookmark },
      ].map((item) => (
        <article key={item.label} className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.06em] text-[var(--hp-text-muted)]">
            <item.icon className="size-4 text-[var(--hp-primary)]" />
            {item.label}
          </div>
          <p className="text-sm font-bold leading-5 text-[var(--hp-text-primary)]">{item.value}</p>
        </article>
      ))}
    </section>
  );
}

function HeroStack({
  stories,
  onFeedback,
  showPersonalization,
}: {
  stories: RankedStory[];
  onFeedback: (story: RankedStory, action: FeedbackAction, isActive: boolean) => void;
  showPersonalization: boolean;
}) {
  const [lead, ...secondary] = stories.slice(0, 5);
  if (!lead) return null;

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
      <article className="overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)]">
        <div className="relative min-h-[360px] bg-cover bg-center md:min-h-[520px]" style={{ backgroundImage: `url(${lead.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <SourceLabel slug={lead.brandSlug} />
              <Badge className="h-7 rounded-[8px] bg-white/86 px-2 text-xs font-bold text-black">{lead.topic}</Badge>
            </div>
            <h1 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] md:text-6xl">{lead.title}</h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/86">{lead.summary}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          <FeedbackButton icon={Bookmark} label="Save" activeLabel="Saved" onChange={(isActive) => onFeedback(lead, "save", isActive)} />
          <FeedbackButton icon={Heart} label="More like this" activeLabel="Tuned" onChange={(isActive) => onFeedback(lead, "moreLikeThis", isActive)} />
          <FeedbackButton icon={EyeOff} label="Hide topic" activeLabel="Hidden" onChange={(isActive) => onFeedback(lead, "hide", isActive)} />
        </div>
      </article>

      <div className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)]">
        <div className="border-b border-[var(--hp-border)] p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.08em] text-[var(--hp-text-primary)]">Your next reads</h2>
        </div>
        <div className="divide-y divide-[var(--hp-border)]">
          {secondary.map((story, index) => (
            <article key={story.id} className="grid grid-cols-[32px_minmax(0,1fr)_88px] gap-3 p-4">
              <span className="flex size-8 items-center justify-center rounded-[8px] bg-[var(--hp-rank-bg)] text-sm font-black text-[var(--hp-rank-text)]">{index + 1}</span>
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <BrandAvatar slug={story.brandSlug} size="sm" />
                  <span className="truncate text-xs font-bold text-[var(--hp-text-secondary)]">{getBrand(story.brandSlug).name}</span>
                </div>
                <h3 className="text-base font-black leading-tight text-[var(--hp-text-primary)]">{story.title}</h3>
                {showPersonalization && <p className="mt-2 text-xs font-semibold text-[var(--hp-signal)]">{story.signal}</p>}
              </div>
              <img src={story.image} alt="" className="h-20 w-[88px] rounded-[8px] object-cover" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedStoryCard({
  story,
  index,
  onFeedback,
  showPersonalization,
}: {
  story: RankedStory;
  index: number;
  onFeedback: (story: RankedStory, action: FeedbackAction, isActive: boolean) => void;
  showPersonalization: boolean;
}) {
  const isFeature = story.format === "feature" || index % 4 === 0;

  return (
    <article className="overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)]">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--hp-border)] p-4">
        <div className="flex min-w-0 gap-3">
          <BrandAvatar slug={story.brandSlug} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-black text-[var(--hp-text-primary)]">{getBrand(story.brandSlug).name}</span>
              <span className="text-xs font-bold text-[var(--hp-text-muted)]">{story.topic}</span>
              <span className="text-xs text-[var(--hp-text-muted)]">{story.readTime} read</span>
            </div>
            {showPersonalization && <p className="mt-1 text-xs font-bold leading-5 text-[var(--hp-signal)]">{story.signal}</p>}
          </div>
        </div>
        <IconButton label={`Share ${story.title}`}>
          <Share2 className="size-4" />
        </IconButton>
      </div>

      <div className={cn("grid gap-4 p-4", isFeature ? "md:grid-cols-[minmax(0,1fr)_220px]" : "md:grid-cols-[180px_minmax(0,1fr)]")}>
        {isFeature ? (
          <>
            <div className="space-y-3">
              <Badge variant="outline" className="h-7 rounded-[8px] border-[var(--hp-border)] px-2 text-xs font-bold">{story.format}</Badge>
              <h2 className="text-pretty text-3xl font-black leading-[1.04] text-[var(--hp-text-primary)]">{story.title}</h2>
              <p className="max-w-2xl text-sm leading-6 text-[var(--hp-text-secondary)]">{story.summary}</p>
            </div>
            <img src={story.image} alt="" className="h-52 w-full rounded-[8px] object-cover md:h-full" />
          </>
        ) : (
          <>
            <img src={story.image} alt="" className="h-48 w-full rounded-[8px] object-cover md:h-full" />
            <div className="space-y-3">
              <Badge variant="outline" className="h-7 rounded-[8px] border-[var(--hp-border)] px-2 text-xs font-bold">{story.format}</Badge>
              <h2 className="text-pretty text-2xl font-black leading-[1.06] text-[var(--hp-text-primary)]">{story.title}</h2>
              <p className="text-sm leading-6 text-[var(--hp-text-secondary)]">{story.summary}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--hp-border)] p-4">
        <FeedbackButton icon={Bookmark} label="Save" activeLabel="Saved" onChange={(isActive) => onFeedback(story, "save", isActive)} />
        <FeedbackButton icon={Plus} label="Collect" activeLabel="Collected" onChange={(isActive) => onFeedback(story, "collect", isActive)} />
        <FeedbackButton icon={Check} label="Follow topic" activeLabel="Following topic" onChange={(isActive) => onFeedback(story, "followTopic", isActive)} />
        <FeedbackButton icon={Heart} label="Follow brand" activeLabel="Following brand" onChange={(isActive) => onFeedback(story, "followBrand", isActive)} />
        <FeedbackButton icon={X} label="Hide" activeLabel="Hidden" onChange={(isActive) => onFeedback(story, "hide", isActive)} />
      </div>
    </article>
  );
}

function NewsletterCard() {
  return (
    <article className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-primary)] p-5 text-white">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-1 size-5 shrink-0" />
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight">Make tomorrow&apos;s feed sharper</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/82">
            Save two stories or follow one topic and the prototype re-ranks the next set instantly.
          </p>
        </div>
      </div>
      <Button variant="secondary" className="mt-5 h-10 rounded-[8px] px-4 text-xs font-black">
        Review your interests
      </Button>
    </article>
  );
}

function RightRail({ rankedStories, profile }: { rankedStories: RankedStory[]; profile: ReaderProfile }) {
  const trendingStories = [...rankedStories]
    .sort((a, b) => (trendLiftByStoryId[b.id] ?? 0) - (trendLiftByStoryId[a.id] ?? 0))
    .slice(0, 4);

  return (
    <aside className="hidden space-y-4 lg:block">
      <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4">
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--hp-text-primary)]">Trending now</h2>
        <div className="space-y-3">
          {trendingStories.map((story) => (
            <article key={story.id} className="flex gap-3">
              <img src={story.image} alt="" className="size-16 rounded-[8px] object-cover" />
              <div>
                <p className="text-xs font-bold text-[var(--hp-signal)]">+{trendLiftByStoryId[story.id]}%</p>
                <h3 className="text-sm font-black leading-tight text-[var(--hp-text-primary)]">{story.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4">
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--hp-text-primary)]">Followed brands</h2>
        <div className="flex flex-wrap gap-2">
          {lifestyleBrandSlugs.map((slug) => (
            <SourceLabel key={slug} slug={slug} />
          ))}
        </div>
      </section>

      <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4">
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--hp-text-primary)]">Why this feed</h2>
        <div className="space-y-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
          <p>Topics: {profile.followedTopics.join(", ")}</p>
          <p>Saved signals: {profile.savedTags.slice(0, 6).join(", ")}</p>
          <p>Collections: {profile.savedCollections.join(", ")}</p>
        </div>
      </section>
    </aside>
  );
}

function BrandStrip() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {lifestyleBrandSlugs.map((slug) => (
        <SourceLabel key={slug} slug={slug} />
      ))}
    </div>
  );
}

function CardGridPreview({ stories }: { stories: RankedStory[] }) {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {stories.slice(5, 8).map((story) => (
        <ArticleCard key={story.id} className="rounded-[8px]">
          <ArticleCardImage src={story.image} alt="" aspectRatio="4/3" />
          <ArticleCardContent>
            <ArticleCardEyebrow>{getBrand(story.brandSlug).name}</ArticleCardEyebrow>
            <ArticleCardTitle>{story.title}</ArticleCardTitle>
            <ArticleCardDescription>{story.summary}</ArticleCardDescription>
            <ArticleCardMeta>
              <ArticleCardMetaItem>{story.readTime} read</ArticleCardMetaItem>
            </ArticleCardMeta>
          </ArticleCardContent>
        </ArticleCard>
      ))}
    </section>
  );
}

export function LifestyleDestinationApp({
  readerMode = "morning",
  topicFocus = "For You",
  showPersonalization = true,
}: LifestyleDestinationProps) {
  const [selectedTopic, setSelectedTopic] = React.useState(topicFocus);
  const [profile, setProfile] = React.useState(() => getInitialProfile(readerMode));

  React.useEffect(() => {
    setProfile(getInitialProfile(readerMode));
  }, [readerMode]);

  React.useEffect(() => {
    setSelectedTopic(topicFocus);
  }, [topicFocus]);

  const rankedStories = React.useMemo(() => getPersonalizedFeed(lifestyleStories, profile, selectedTopic), [profile, selectedTopic]);

  const handleFeedback = React.useCallback((story: RankedStory, action: FeedbackAction, isActive: boolean) => {
    setProfile((current) => applyFeedback(current, story, action, isActive));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--hp-background)] font-[var(--hp-font-ui)] text-[var(--hp-text-primary)]" style={lifestyleVars}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--hp-nav)] text-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 lg:px-6">
          <IconButton label="Open menu" className="border-white/15 bg-white/8 text-white hover:bg-white/14">
            <Menu className="size-5" />
          </IconButton>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[var(--hp-logo)] text-sm font-black text-black">H</div>
            <div className="min-w-0">
              <p className="text-lg font-black leading-none tracking-[-0.01em]">Hearst Lifestyle</p>
              <p className="hidden text-xs font-semibold text-white/68 sm:block">Personalized stories from ten lifestyle brands</p>
            </div>
          </div>
          <div className="hidden h-10 min-w-[280px] items-center gap-2 rounded-[8px] border border-white/15 bg-white/10 px-3 text-white/68 md:flex">
            <Search className="size-4" />
            <span className="text-sm font-semibold">Search recipes, rooms, style, wellness</span>
          </div>
          <IconButton label="Saved stories" className="border-white/15 bg-white/8 text-white hover:bg-white/14">
            <Bookmark className="size-5" />
          </IconButton>
          <IconButton label="Notifications" className="hidden border-white/15 bg-white/8 text-white hover:bg-white/14 sm:flex">
            <Bell className="size-5" />
          </IconButton>
          <IconButton label="Profile" className="border-white/15 bg-white/8 text-white hover:bg-white/14">
            <CircleUserRound className="size-5" />
          </IconButton>
        </div>
        <nav className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-4 pb-3 lg:px-6">
          {topicChips.map((topic) => (
            <Chip
              key={topic}
              variant={selectedTopic === topic ? "selected" : "default"}
              size="lg"
              onClick={() => setSelectedTopic(topic)}
              className={cn(
                "shrink-0 rounded-[8px] border-white/18",
                selectedTopic === topic ? "bg-white text-black" : "bg-white/8 text-white hover:bg-white/14",
              )}
            >
              {topic}
            </Chip>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-6">
        <div className="min-w-0 space-y-5">
          <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--hp-signal)]">
                  <Compass className="size-4" />
                  Adaptive lifestyle desk
                </p>
                <h1 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.02em] text-[var(--hp-text-primary)] md:text-6xl">
                  A daily feed that learns what your reader does next.
                </h1>
              </div>
              <Button className="h-11 rounded-[8px] bg-[var(--hp-action)] px-4 text-xs font-black hover:bg-[var(--hp-action-hover)]">
                Tune the feed
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <BrandStrip />
          </section>

          <DailyBrief rankedStories={rankedStories} />
          <HeroStack stories={rankedStories} onFeedback={handleFeedback} showPersonalization={showPersonalization} />
          <CardGridPreview stories={rankedStories} />
          <NewsletterCard />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black tracking-[-0.01em] text-[var(--hp-text-primary)]">Personalized feed</h2>
              <p className="hidden text-sm font-semibold text-[var(--hp-text-secondary)] md:block">
                Ranked by topic, brand, saves, recency, trend lift, and diversity.
              </p>
            </div>
            {rankedStories.slice(1).map((story, index) => (
              <FeedStoryCard
                key={story.id}
                story={story}
                index={index}
                onFeedback={handleFeedback}
                showPersonalization={showPersonalization}
              />
            ))}
          </section>
        </div>

        <RightRail rankedStories={rankedStories} profile={profile} />
      </main>
    </div>
  );
}
