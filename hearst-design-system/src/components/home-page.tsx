"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandIconLogos, brandLogos } from "@/lib/logos";
import {
  getHearstBrandSection,
  getHearstBrandRoute,
  getHearstDestinationCategoryRoute,
  getHearstDestinationRoute,
} from "@/lib/hearst-routes";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
import { getHearstStoryRoute } from "@/lib/story-routes";
import { themeOptions } from "@/lib/theme-options";
import { brandToCssVars } from "@/lib/theme-css-vars";
import type { BrandTheme } from "@/lib/brands";
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
  BookOpenText,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Clock,
  EyeOff,
  ImageIcon,
  Info,
  Mail,
  MessageCircle,
  Moon,
  Pause,
  Play,
  Plus,
  Send,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Sun,
  ThumbsUp,
  X,
} from "@/components/ui/icons";
import {
  getBrandImages,
  getBaseContent,
  type BaseContentType,
} from "./homepage-data";
import type { LifestyleRiverProfile, LifestyleRiverStory } from "./lifestyle-river-types";
import type { LiveArticleData, LiveFeedData } from "@/lib/live-feed-types";
import { useReaderAccount } from "./reader-account";
import { ReaderAuthDialog, ReaderAvatar, ReaderProfileDialog } from "./reader-account-ui";

interface ContentType extends BaseContentType {
  footerCols: string[][];
}

const readerReturnFocusStorageKey = "hearst-reader-return-focus-label";
const reducedMotionMediaQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const mediaQuery = window.matchMedia(reducedMotionMediaQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionPreference() {
  return typeof window !== "undefined" && window.matchMedia(reducedMotionMediaQuery).matches;
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false
  );
}

export interface HomePageTemplateProps {
  /**
   * Classic preserves the current production homepage. Overlap grid makes the
   * breakpoint behavior visible for Storybook and design review.
   */
  layout?: "classic" | "overlapGrid";
  showGridOverlay?: boolean;
  initialBrandSlug?: string;
  liveFeedData?: LiveFeedData;
  liveFeedMode?: "replace" | "blend";
  videoFeedData?: LiveFeedData;
  initialFilter?: string;
  initialOpenStoryId?: string;
  readerReturnHref?: string;
  navLinksOverride?: string[];
  staticDestinationData?: HearstDestinationStaticData;
}

interface ProgressiveFeedPage {
  stories: LifestyleRiverStory[];
  nextOffset: number;
  total: number;
  hasMore: boolean;
}

const defaultFooterCols: string[][] = [
  ["News", "Features", "Culture", "Lifestyle", "Opinion", "Wellness", "Travel"],
  ["Style", "Beauty", "Food", "Home", "Entertainment", "Shopping", "Tech"],
  ["Videos", "Podcasts", "Newsletters", "Events", "Awards", "Archive", "About"],
  ["Contact", "Careers", "Advertise", "Subscribe", "Press", "Privacy", "Terms"],
];

const selectedBrandThemeAliases: Record<string, string> = {
  "pioneer-woman": "the-pioneer-woman",
};

function normalizeReaderReturnHref(value?: string | null) {
  if (!value) return null;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.startsWith("/read/")) {
    return null;
  }

  return decoded;
}

function appendReaderReturnHref(storyId: string, returnHref: string | null) {
  const route = getHearstStoryRoute(storyId);
  const safeReturnHref = normalizeReaderReturnHref(returnHref);

  if (!safeReturnHref) return route;

  return `${route}?from=${encodeURIComponent(safeReturnHref)}`;
}

function getReaderOriginBrandSlug(returnHref?: string | null) {
  const safeReturnHref = normalizeReaderReturnHref(returnHref);
  if (!safeReturnHref) return null;

  const pathname = safeReturnHref.split(/[?#]/, 1)[0];
  const match = pathname.match(/^\/(?:brands|lifestyle|autos|flux|ew)\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

const supplementalBrandProfiles: Record<string, { primary: string; secondary: string; fontDefault: string; fontHeadline: string; fontHeadlineWeight: number }> = {
  "bring-a-trailer": {
    primary: "#f40217",
    secondary: "#f5f5f5",
    fontDefault: "Open Sans",
    fontHeadline: "Open Sans",
    fontHeadlineWeight: 700,
  },
  "hot-rod": {
    primary: "#c11b17",
    secondary: "#141416",
    fontDefault: "Geist",
    fontHeadline: "Barlow Condensed",
    fontHeadlineWeight: 700,
  },
  motortrend: {
    primary: "#e90c17",
    secondary: "#141416",
    fontDefault: "Poppins",
    fontHeadline: "Poppins",
    fontHeadlineWeight: 700,
  },
};

function getSelectedBrandTheme(selectedBrand: { name: string; slug: string } | null, baseTheme: BrandTheme) {
  if (!selectedBrand) return null;

  const normalizedSlug = selectedBrandThemeAliases[selectedBrand.slug] ?? selectedBrand.slug;
  const existingTheme = themeOptions.find((option) => option.slug === normalizedSlug);
  if (existingTheme) return existingTheme;

  const supplemental = supplementalBrandProfiles[selectedBrand.slug];
  if (!supplemental) return null;

  return {
    ...baseTheme,
    name: selectedBrand.name,
    slug: selectedBrand.slug,
    colors: {
      ...baseTheme.colors,
      "1": supplemental.primary,
      "2": supplemental.secondary,
      "3": supplemental.secondary,
    },
    fontDefault: supplemental.fontDefault,
    fontSecondary: supplemental.fontDefault,
    fontHeadline: supplemental.fontHeadline,
    fontHeadlineWeight: supplemental.fontHeadlineWeight,
    semanticColors: {
      ...baseTheme.semanticColors,
      "palette-background-brand": supplemental.primary,
      "palette-background-default-link": supplemental.primary,
      "palette-background-utility": supplemental.primary,
      "palette-content-brand": supplemental.primary,
    },
    componentTokens: {
      ...baseTheme.componentTokens,
      "component-button-background-primary-solid-default": supplemental.primary,
      "component-chip-border-neutral-selected": supplemental.primary,
      "component-chip-content-neutral-selected": supplemental.primary,
      "component-badge-background-primary": supplemental.primary,
    },
  } satisfies BrandTheme;
}

const initialLifestyleProfile: LifestyleRiverProfile = {
  followedTopics: ["Food", "Home"],
  followedBrands: ["Good Housekeeping", "Country Living"],
  savedTags: ["dinner ideas", "sleep", "decorating", "kitchen", "design", "home"],
  boostedTags: ["kitchen", "design", "home", "country living"],
  savedIds: [],
  hiddenIds: [],
};

const initialAutosProfile: LifestyleRiverProfile = {
  followedTopics: ["Reviews", "Buying Guides"],
  followedBrands: ["Car and Driver", "Road & Track"],
  savedTags: ["evs", "electric", "reviews", "performance", "maserati", "grecale", "folgore", "price"],
  boostedTags: ["maserati", "grecale", "folgore", "price", "electric"],
  savedIds: [],
  hiddenIds: [],
};

const initialFluxProfile: LifestyleRiverProfile = {
  followedTopics: ["Style", "Culture"],
  followedBrands: ["Elle", "Harper's Bazaar"],
  savedTags: ["style", "design", "culture"],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
};

const initialEWProfile: LifestyleRiverProfile = {
  followedTopics: ["Fitness", "Wellness"],
  followedBrands: ["Men's Health", "Women's Health"],
  savedTags: ["fitness", "gear", "wellness"],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
};

const initialAllProfile: LifestyleRiverProfile = {
  followedTopics: ["Home", "Reviews", "Style", "Fitness"],
  followedBrands: ["Country Living", "Car and Driver", "Elle", "Men's Health"],
  savedTags: ["home", "reviews", "style", "fitness", "shopping", "wellness", "design"],
  boostedTags: ["kitchen", "design", "electric", "culture", "training"],
  savedIds: [],
  hiddenIds: [],
};

const lifestyleDefaultLeadStoryId =
  "cosmopolitan-entertainment-celebs-a71899516-margaret-qualley-rep-denies-jack-antonoff-cheating";
const allDefaultLeadStoryId =
  "country-living-home-design-decorating-ideas-a71717114-joydrenching-kitchen-trend-2026";

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

const demoDaypartReturnHours: Record<LifestyleDemoDaypart, number> = {
  morning: 0,
  afternoon: 5,
  evening: 10,
  lateNight: 14,
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

const autosDemoDayparts: typeof lifestyleDemoDayparts = {
  morning: {
    label: "Morning Drive",
    time: "8 AM",
    description: "Fresh news, reviews, EVs, and buying advice for a first check-in.",
    preferredTopics: ["News", "Reviews", "Buying Guides", "EVs"],
    preferredKinds: ["article", "recipe", "gallery"],
    preferredTags: ["reviews", "buying", "electric", "evs", "news"],
  },
  afternoon: {
    label: "Afternoon Test Drive",
    time: "1 PM",
    description: "Reviews, performance, and comparison stories move up as intent gets sharper.",
    preferredTopics: ["Reviews", "Performance", "EVs", "Racing"],
    preferredKinds: ["recipe", "video", "gallery"],
    preferredTags: ["review", "performance", "drive", "horsepower", "racing"],
  },
  evening: {
    label: "Evening Garage",
    time: "6 PM",
    description: "Classics, trucks, auction finds, and longer reads fit a return session.",
    preferredTopics: ["Classics", "Trucks", "Auctions", "Performance"],
    preferredKinds: ["gallery", "article", "shopping"],
    preferredTags: ["classic", "auction", "truck", "muscle", "collector"],
  },
  lateNight: {
    label: "Late Night Scroll",
    time: "10 PM",
    description: "Racing, culture, video, and dream-car content rise for passive browsing.",
    preferredTopics: ["Racing", "Classics", "Performance", "News"],
    preferredKinds: ["video", "gallery", "article"],
    preferredTags: ["racing", "classic", "performance", "engine", "speed"],
  },
};

const fluxDemoDayparts: typeof lifestyleDemoDayparts = {
  morning: {
    label: "Morning Edit",
    time: "8 AM",
    description: "Style, beauty, design, and culture stories for a first check-in.",
    preferredTopics: ["Style", "Beauty", "Design", "Culture"],
    preferredKinds: ["article", "gallery", "shopping"],
    preferredTags: ["style", "beauty", "design", "culture", "fashion"],
  },
  afternoon: {
    label: "Afternoon Radar",
    time: "1 PM",
    description: "Shopping, events, celebrity, and culture stories rise as browsing intent increases.",
    preferredTopics: ["Shopping", "Events", "Culture", "Style"],
    preferredKinds: ["shopping", "gallery", "video"],
    preferredTags: ["shopping", "celebrity", "events", "red", "fashion"],
  },
  evening: {
    label: "Evening Culture",
    time: "6 PM",
    description: "Longer culture, design, home, and travel reads fit a return session.",
    preferredTopics: ["Culture", "Design", "Travel", "Features"],
    preferredKinds: ["article", "gallery", "video"],
    preferredTags: ["culture", "design", "travel", "home", "feature"],
  },
  lateNight: {
    label: "Late Night Browse",
    time: "10 PM",
    description: "Fashion, celebrity, interiors, and save-for-later stories move up.",
    preferredTopics: ["Style", "Culture", "Design", "Beauty"],
    preferredKinds: ["gallery", "video", "shopping"],
    preferredTags: ["style", "celebrity", "design", "beauty", "shopping"],
  },
};

const ewDemoDayparts: typeof lifestyleDemoDayparts = {
  morning: {
    label: "Morning Reset",
    time: "8 AM",
    description: "Fitness, wellness, nutrition, and gear stories for a useful first check-in.",
    preferredTopics: ["Fitness", "Wellness", "Nutrition", "Gear"],
    preferredKinds: ["article", "recipe", "shopping"],
    preferredTags: ["fitness", "wellness", "nutrition", "gear", "health"],
  },
  afternoon: {
    label: "Afternoon Boost",
    time: "1 PM",
    description: "Gear, tech, adventure, and training stories rise as active intent increases.",
    preferredTopics: ["Gear", "Tech", "Adventure", "Fitness"],
    preferredKinds: ["shopping", "gallery", "article"],
    preferredTags: ["gear", "tech", "training", "running", "cycling"],
  },
  evening: {
    label: "Evening Recharge",
    time: "6 PM",
    description: "Health, life, recovery, and practical service stories fit a return session.",
    preferredTopics: ["Wellness", "Life", "Fitness", "Nutrition"],
    preferredKinds: ["article", "video", "recipe"],
    preferredTags: ["health", "sleep", "recovery", "relationships", "food"],
  },
  lateNight: {
    label: "Late Night Deep Dive",
    time: "10 PM",
    description: "Science, mechanics, adventure, and save-for-later reads move up.",
    preferredTopics: ["Tech", "Adventure", "Life", "Gear"],
    preferredKinds: ["article", "gallery", "video"],
    preferredTags: ["science", "mechanics", "adventure", "gear", "life"],
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

const autosBrandFavicons: Record<string, string> = {
  autoweek: "https://www.autoweek.com/_assets/design-tokens/autoweek/static/images/apple-touch-icon.b919ce0.png",
  "bring-a-trailer": "https://bringatrailer.com/wp-content/themes/bringatrailer/assets/img/google-chrome-icon-192x192.png?v=4be5ad7eef",
  "car-and-driver": "https://www.caranddriver.com/_assets/design-tokens/caranddriver/static/images/apple-touch-icon.57b92b6.png",
  "hot-rod": "https://www.hotrod.com/logo/hotrod/icon.ico",
  motortrend: "https://www.motortrend.com/logo/motortrend/icon.ico",
  "road-and-track": "https://www.roadandtrack.com/_assets/design-tokens/roadandtrack/static/images/apple-touch-icon.dda61a5.png",
};

const fluxBrandFavicons: Record<string, string> = {
  elle: "https://www.elle.com/_assets/design-tokens/elle/static/images/apple-touch-icon.0dd915e.png",
  "elle-decor": "https://www.elledecor.com/_assets/design-tokens/elledecor/static/images/apple-touch-icon.c51311f.png",
  esquire: "https://www.esquire.com/_assets/design-tokens/esquire/static/images/apple-touch-icon.1801cd0.png",
  "harpers-bazaar": "https://www.harpersbazaar.com/_assets/design-tokens/harpersbazaar/static/images/apple-touch-icon.b5179c9.png",
  "town-and-country": "https://www.townandcountrymag.com/_assets/design-tokens/townandcountrymag/static/images/apple-touch-icon.3ab52cc.png",
  veranda: "https://www.veranda.com/_assets/design-tokens/veranda/static/images/apple-touch-icon.bed0f30.png",
};

const ewBrandFavicons: Record<string, string> = {
  "best-products": "https://www.bestproducts.com/_assets/design-tokens/bestproducts/static/images/apple-touch-icon.721cffe.png",
  bicycling: "https://www.bicycling.com/_assets/design-tokens/bicycling/static/images/apple-touch-icon.5c91a4c.png",
  "mens-health": "https://www.menshealth.com/_assets/design-tokens/menshealth/static/images/apple-touch-icon.35eef3d.png",
  "oprah-daily": "https://www.oprahdaily.com/_assets/design-tokens/oprahdaily/static/images/apple-touch-icon.e245e23.png",
  "popular-mechanics": "https://www.popularmechanics.com/_assets/design-tokens/popularmechanics/static/images/apple-touch-icon.5d5fa0d.png",
  "runners-world": "https://www.runnersworld.com/_assets/design-tokens/runnersworld/static/images/favicon.7c41e8e.ico",
  "womens-health": "https://www.womenshealthmag.com/_assets/design-tokens/womenshealthmag/static/images/apple-touch-icon.6b2985f.png",
};

function getBrandIconUrl(brandSlug: string) {
  return brandIconLogos[brandSlug] ?? lifestyleBrandFavicons[brandSlug] ?? autosBrandFavicons[brandSlug] ?? fluxBrandFavicons[brandSlug] ?? ewBrandFavicons[brandSlug] ?? brandLogos[brandSlug];
}

function getBrandInitials(brand: string) {
  return brand
    .split(/\s+|&/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function BrandSourceIcon({
  brand,
  brandSlug,
  className,
}: {
  brand: string;
  brandSlug: string;
  className?: string;
}) {
  const iconUrl = getBrandIconUrl(brandSlug);

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border bg-background p-0.5 text-[8px] font-black leading-none text-primary",
        className
      )}
      style={iconUrl ? {
        backgroundImage: `url("${iconUrl}")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "85% auto",
      } : undefined}
    >
      {iconUrl ? null : getBrandInitials(brand)}
    </span>
  );
}

type DestinationMode = "all" | "lifestyle" | "autos" | "flux" | "ew";
type DestinationSourceNote = {
  brand: string;
  brandSlug: string;
  feedCount: number;
  importedCount: number;
  selectedCount: number;
};

type DestinationConfig = {
  mode: DestinationMode;
  brandSlug: string;
  productName: string;
  riverLabel: string;
  storyRiverLabel: string;
  filters: string[];
  stories: LifestyleRiverStory[];
  sourceNotes: readonly DestinationSourceNote[];
  initialProfile: LifestyleRiverProfile;
  defaultLeadStoryId?: string;
  dayparts: typeof lifestyleDemoDayparts;
  nextDayTopics: string[];
  brandSummary: string;
  dataSourceCopy: string;
  collectionLabels: string[];
  liveFeedStatus?: {
    fetchedAt: string;
    isFallback: boolean;
  };
  liveFeedMode?: "replace" | "blend";
};

type LifestyleStoryComment = {
  id: string;
  author: string;
  role: string;
  body: string;
  age: string;
  likes: number;
};

type HearstOnboardingResult = {
  id: number;
  interests: string[];
  brands: string[];
  tags: string[];
};

function mergeUnique(items: string[], nextItems: string[]) {
  return Array.from(new Set([...items, ...nextItems]));
}

function getOnboardingSignalTags(stories: LifestyleRiverStory[], result: HearstOnboardingResult) {
  const normalizedInterests = new Set(result.interests.map((interest) => interest.toLowerCase()));
  const selectedBrands = new Set(result.brands);
  const signalTags = stories
    .filter((story) => {
      const topicMatch = normalizedInterests.has(story.topic.toLowerCase())
        || result.interests.some((interest) => story.topic.startsWith(`${interest} `));
      return topicMatch || selectedBrands.has(story.brand);
    })
    .flatMap((story) => story.tags);

  return mergeUnique(result.tags, signalTags).slice(0, 16);
}

const baseDestinationConfigs: Record<DestinationMode, DestinationConfig> = {
  all: {
    mode: "all",
    brandSlug: "hearst-all",
    productName: "Hearst Magazines",
    riverLabel: "Personalized Hearst story river",
    storyRiverLabel: "Hearst stories",
    filters: ["For You", "Home", "Style", "Reviews", "Fitness", "Cars", "Videos", "Shopping", "Games", "Saved"],
    stories: [],
    sourceNotes: [],
    initialProfile: initialAllProfile,
    defaultLeadStoryId: allDefaultLeadStoryId,
    dayparts: lifestyleDemoDayparts,
    nextDayTopics: ["Home", "Style", "Reviews", "Fitness", "Shopping"],
    brandSummary:
      "Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness brands combined into one cross-Hearst personalized destination.",
    dataSourceCopy:
      "public RSS metadata from the Hearst destination sections, filtered to stories with real Hearst CDN images.",
    collectionLabels: ["Daily edit", "Shopping ideas", "Weekend plans"],
  },
  lifestyle: {
    mode: "lifestyle",
    brandSlug: "hearst-lifestyle",
    productName: "Hearst Lifestyle",
    riverLabel: "Personalized lifestyle story river",
    storyRiverLabel: "lifestyle stories",
    filters: ["For You", "Food", "Home", "Wellness", "Style", "Shopping", "Family", "Entertainment", "Saved"],
    stories: [],
    sourceNotes: [],
    initialProfile: initialLifestyleProfile,
    defaultLeadStoryId: lifestyleDefaultLeadStoryId,
    dayparts: lifestyleDemoDayparts,
    nextDayTopics: ["Entertainment", "Shopping", "Home"],
    brandSummary:
      "Cosmopolitan, Country Living, Delish, Good Housekeeping, House Beautiful, The Pioneer Woman, Prevention, Redbook, Seventeen, and Woman's Day.",
    dataSourceCopy:
      "public Hearst lifestyle RSS metadata and filtered to stories with Hearst CDN images. Public Redbook RSS returned no image-backed items during the latest import.",
    collectionLabels: ["Dinner ideas", "Weekend projects", "Sleep better"],
  },
  autos: {
    mode: "autos",
    brandSlug: "hearst-plus",
    productName: "Hearst Autos",
    riverLabel: "Personalized autos story river",
    storyRiverLabel: "autos stories",
    filters: ["For You", "News", "Reviews", "Buying Guides", "EVs", "Racing", "Trucks", "Classics", "Saved"],
    stories: [],
    sourceNotes: [],
    initialProfile: initialAutosProfile,
    dayparts: autosDemoDayparts,
    nextDayTopics: ["News", "Reviews", "EVs", "Performance"],
    brandSummary: "Autoweek, Bring a Trailer, Car and Driver, HOT ROD, MotorTrend, and Road & Track.",
    dataSourceCopy:
      "public autos RSS feeds and public article metadata from the requested Autos brands, filtered to stories with real images.",
    collectionLabels: ["EV shortlist", "Weekend drives", "Auction watch"],
  },
  flux: {
    mode: "flux",
    brandSlug: "hearst-flux",
    productName: "Hearst Flux",
    riverLabel: "Personalized Flux story river",
    storyRiverLabel: "Flux stories",
    filters: ["For You", "Style", "Beauty", "Design", "Culture", "Shopping", "Events", "Travel", "Saved"],
    stories: [],
    sourceNotes: [],
    initialProfile: initialFluxProfile,
    dayparts: fluxDemoDayparts,
    nextDayTopics: ["Style", "Culture", "Design", "Shopping"],
    brandSummary: "Elle, Elle Décor, Esquire, Harper's Bazaar, Town & Country, and Veranda.",
    dataSourceCopy:
      "public Flux brand RSS metadata from the requested fashion, design, culture, and luxury brands, filtered to stories with real images.",
    collectionLabels: ["Style file", "Design ideas", "Culture queue"],
  },
  ew: {
    mode: "ew",
    brandSlug: "hearst-ew",
    productName: "Hearst E&W",
    riverLabel: "Personalized E&W story river",
    storyRiverLabel: "E&W stories",
    filters: ["For You", "Fitness", "Wellness", "Gear", "Tech", "Adventure", "Nutrition", "Life", "Saved"],
    stories: [],
    sourceNotes: [],
    initialProfile: initialEWProfile,
    dayparts: ewDemoDayparts,
    nextDayTopics: ["Fitness", "Wellness", "Gear", "Tech"],
    brandSummary: "Best Products, Bicycling, Men's Health, Oprah Daily, Popular Mechanics, Runner's World, and Women's Health.",
    dataSourceCopy:
      "public E&W brand RSS metadata from the requested health, gear, fitness, wellness, and science brands, filtered to stories with real images.",
    collectionLabels: ["Training plan", "Gear shortlist", "Wellness queue"],
  },
};

const DestinationConfigsContext = React.createContext(baseDestinationConfigs);

function useDestinationConfigs() {
  return React.useContext(DestinationConfigsContext);
}

function createDestinationConfigs(staticData?: HearstDestinationStaticData) {
  if (!staticData) return baseDestinationConfigs;

  return Object.fromEntries(
    Object.entries(baseDestinationConfigs).map(([mode, config]) => [
      mode,
      { ...config, ...staticData[mode as DestinationMode] },
    ])
  ) as Record<DestinationMode, DestinationConfig>;
}

function getDestinationMode(brandSlug: string): DestinationMode {
  if (brandSlug === "hearst-all") return "all";
  if (brandSlug === "hearst-ew") return "ew";
  if (brandSlug === "hearst-flux") return "flux";
  if (brandSlug === "hearst-plus") return "autos";
  return getHearstBrandSection(brandSlug);
}

function getStoryDestinationMode(brandSlug: string): Exclude<DestinationMode, "all"> {
  return getHearstBrandSection(brandSlug);
}

function getReaderDestinationLabel(mode: Exclude<DestinationMode, "all">) {
  if (mode === "autos") return "Autos";
  if (mode === "flux") return "Fashion and Luxury";
  if (mode === "ew") return "Enthusiast and Wellness";
  return "Lifestyle";
}

function insertVideosFilter(filters: string[]) {
  if (filters.includes("Videos")) return filters;

  const carsIndex = filters.indexOf("Cars");
  if (carsIndex >= 0) {
    return [...filters.slice(0, carsIndex + 1), "Videos", ...filters.slice(carsIndex + 1)];
  }

  const shoppingIndex = filters.indexOf("Shopping");
  if (shoppingIndex >= 0) {
    return [...filters.slice(0, shoppingIndex), "Videos", ...filters.slice(shoppingIndex)];
  }

  const savedIndex = filters.indexOf("Saved");
  if (savedIndex >= 0) {
    return [...filters.slice(0, savedIndex), "Videos", ...filters.slice(savedIndex)];
  }

  return [...filters, "Videos"];
}

function getBrandContextualFilters(
  brandSlug: string,
  stories: LifestyleRiverStory[],
  includeVideos = false
) {
  const topicCounts = stories
    .filter((story) => story.brandSlug === brandSlug)
    .reduce<Record<string, number>>((counts, story) => {
      counts[story.topic] = (counts[story.topic] ?? 0) + 1;
      return counts;
    }, {});

  const topics = Object.entries(topicCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([topic]) => topic);

  const brandSections = brandSlug === "car-and-driver"
    ? ["Shop New Cars", "Shop Used Cars", "Research Cars"]
    : [];

  const filters = ["For You", ...topics, ...brandSections, "Saved"];
  return includeVideos ? insertVideosFilter(filters) : filters;
}

function getBrandRouteInfo(sourceNotes: readonly DestinationSourceNote[], brandSlug?: string) {
  if (!brandSlug) return null;
  const note = sourceNotes.find((brand) => brand.brandSlug === brandSlug);
  return note ? { name: note.brand, slug: note.brandSlug } : null;
}

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  return { ...base, footerCols: defaultFooterCols };
}

function getLifestyleTimeOfDayScore(
  story: LifestyleRiverStory,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  const daypart = config.dayparts[demoState.daypart];
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
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  const popularity = story.popularity;
  const isOnboardingPersonalized = profile.personalizationMode === "onboarding";
  const followedTopicMatch = profile.followedTopics.some((topic) => story.topic === topic || story.topic.startsWith(`${topic} `));
  const followedTopic = followedTopicMatch ? (isOnboardingPersonalized ? 34 : 18) : 0;
  const followedBrand = profile.followedBrands.includes(story.brand) ? 16 : 0;
  const savedTagMatches = story.tags.filter((tag) => profile.savedTags.includes(tag)).length;
  const boostedTagMatches = story.tags.filter((tag) => profile.boostedTags.includes(tag)).length;
  const savedTag = savedTagMatches > 0 ? (isOnboardingPersonalized ? 24 : 14) + Math.min(24, (savedTagMatches - 1) * 6) : 0;
  const moreLikeThis = boostedTagMatches > 0 ? (isOnboardingPersonalized ? 34 : 22) + Math.min(32, (boostedTagMatches - 1) * 8) : 0;
  const savedStory = profile.savedIds.includes(story.id) ? 6 : 0;
  const recency = getLifestyleRecencyScore(story, demoState);
  const timeOfDay = getLifestyleTimeOfDayScore(story, demoState, config);
  const isFirstMorningVisit =
    demoState.contentDay === "today" && demoState.returnHours === 0 && demoState.daypart === "morning";
  const defaultLead = !isOnboardingPersonalized && config.defaultLeadStoryId === story.id && isFirstMorningVisit ? 80 : 0;
  const returnFreshness =
    demoState.returnHours > 0 && story.id !== demoState.previousLeadId && story.age <= demoState.returnHours + 4
      ? 24
      : 0;
  const nextDayNovelty =
    demoState.contentDay === "nextDay" && story.id !== demoState.previousLeadId
      ? config.nextDayTopics.includes(story.topic)
        ? 28
        : 10
      : 0;
  const repeatLeadPenalty = demoState.returnHours > 0 && story.id === demoState.previousLeadId ? -140 : 0;
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
    defaultLead,
    returnFreshness,
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
      defaultLead +
      returnFreshness +
      nextDayNovelty +
      repeatLeadPenalty +
      hidden,
  };
}

function getLifestyleScore(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  return getLifestyleScoreBreakdown(story, profile, demoState, config).total;
}

function getLifestyleStrategyReason(
  story: LifestyleRiverStory,
  breakdown: ReturnType<typeof getLifestyleScoreBreakdown>,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  const activeDaypart = config.dayparts[demoState.daypart];
  const reasons: string[] = [];

  if (breakdown.repeatLeadPenalty < 0) {
    reasons.push("previous lead suppressed");
  }
  if (breakdown.returnFreshness > 0) {
    reasons.push("fresh since last visit");
  }
  if (breakdown.timeOfDay > 0) {
    reasons.push(`${activeDaypart.label.toLowerCase()} fit`);
  }
  if (breakdown.moreLikeThis > 0 || breakdown.savedTag > 0) {
    reasons.push("behavior match");
  }
  if (breakdown.followedBrand > 0 || breakdown.followedTopic > 0) {
    reasons.push("followed interest");
  }
  if (breakdown.nextDayNovelty > 0) {
    reasons.push("new edition novelty");
  }
  if (breakdown.defaultLead > 0) {
    reasons.push("editorial starting point");
  }
  if (reasons.length === 0) {
    reasons.push(`${story.popularity} popularity signal`);
  }

  return reasons.slice(0, 3).join(", ");
}

function rankLifestyleRiver(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  const scored = stories
    .filter((story) => !profile.hiddenIds.includes(story.id))
    .map((story) => ({ ...story, score: getLifestyleScore(story, profile, demoState, config) }))
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

function getStoryIdentity(story: LifestyleRiverStory) {
  const sourceUrl = story.sourceUrl?.trim().toLowerCase();
  if (sourceUrl) return `url:${sourceUrl}`;

  return `story:${story.brandSlug}:${story.title.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function mergeUniqueStories(...storyGroups: LifestyleRiverStory[][]) {
  const seen = new Set<string>();

  return storyGroups.flat().filter((story) => {
    const identity = getStoryIdentity(story);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function isCurrentFeedStory(story: LifestyleRiverStory) {
  return story.id.startsWith("live-");
}

function diversifyCurrentFeedStories(stories: LifestyleRiverStory[]) {
  const remaining = [...stories];
  const diversified: LifestyleRiverStory[] = [];

  while (remaining.length > 0) {
    const previousWasVideo = diversified.at(-1)?.videoUrl !== undefined;
    const differentMediaIndex = diversified.length === 0
      ? -1
      : remaining.findIndex((story) => Boolean(story.videoUrl) !== previousWasVideo);
    const nextIndex = differentMediaIndex >= 0 ? differentMediaIndex : 0;
    diversified.push(remaining.splice(nextIndex, 1)[0]);
  }

  return diversified;
}

function applyContextualFeedCadence(stories: LifestyleRiverStory[]) {
  const editorialStories = stories.filter((story) => !isCurrentFeedStory(story));
  const currentFeedStories = diversifyCurrentFeedStories(
    stories.filter((story) => isCurrentFeedStory(story))
  );

  if (currentFeedStories.length === 0 || editorialStories.length < 3) return stories;

  const blended: LifestyleRiverStory[] = [];
  let editorialIndex = 0;
  let currentIndex = 0;
  const initialEditorialCount = Math.min(5, editorialStories.length);

  blended.push(...editorialStories.slice(0, initialEditorialCount));
  editorialIndex = initialEditorialCount;

  if (currentIndex < currentFeedStories.length) {
    blended.push(currentFeedStories[currentIndex]);
    currentIndex += 1;
  }

  if (editorialIndex < editorialStories.length && currentIndex < currentFeedStories.length) {
    blended.push(editorialStories[editorialIndex], currentFeedStories[currentIndex]);
    editorialIndex += 1;
    currentIndex += 1;
  }

  while (editorialIndex < editorialStories.length) {
    const nextEditorialStories = editorialStories.slice(editorialIndex, editorialIndex + 3);
    blended.push(...nextEditorialStories);
    editorialIndex += nextEditorialStories.length;

    if (nextEditorialStories.length === 3 && currentIndex < currentFeedStories.length) {
      blended.push(currentFeedStories[currentIndex]);
      currentIndex += 1;
    }
  }

  return blended;
}

function getLifestyleDemoStoryPool(
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  if (demoState.contentDay === "today") return config.stories;

  const nextDayStories = config.stories
    .filter((story, index) => index % 2 === 1 || config.nextDayTopics.includes(story.topic))
    .map((story) => ({
      ...story,
      age: Math.max(0, story.age - 24),
      popularity:
        config.nextDayTopics.includes(story.topic)
          ? Math.min(100, story.popularity + 8)
          : story.topic.startsWith("Food") || story.topic === "Reviews"
          ? Math.max(1, story.popularity - 8)
          : Math.max(1, story.popularity - 2),
      signal: story.age <= 24 ? "Trending" : story.signal,
    } satisfies LifestyleRiverStory));

  return nextDayStories.length >= 80 ? nextDayStories : config.stories;
}

function storyMatchesLifestyleFilter(story: LifestyleRiverStory, filter: string) {
  if (filter === "For You" || filter === "Saved") return true;
  if (filter === "Videos") return Boolean(story.videoUrl);
  if (story.brandSlug === "car-and-driver") {
    if (filter === "Shop New Cars") {
      return story.topic === "EVs" || /\b20(?:26|27|28|29)\b/.test(story.title);
    }
    if (filter === "Shop Used Cars") {
      return /\b(?:19\d{2}|20(?:0\d|1\d|2[0-5]))\b/.test(story.title);
    }
    if (filter === "Research Cars") return true;
  }
  if (filter === "Lifestyle") return getStoryDestinationMode(story.brandSlug) === "lifestyle";
  if (filter === "Autos") return getStoryDestinationMode(story.brandSlug) === "autos";
  if (filter === "Cars") return getStoryDestinationMode(story.brandSlug) === "autos";
  if (filter === "Fashion & Luxury") return getStoryDestinationMode(story.brandSlug) === "flux";
  if (filter === "Enthusiast & Wellness") return getStoryDestinationMode(story.brandSlug) === "ew";
  return story.topic === filter || story.topic.startsWith(`${filter} `);
}

const hearstDestinationSections = [
  { label: "All", href: getHearstDestinationRoute("all") },
  { label: "Lifestyle", href: getHearstDestinationRoute("lifestyle") },
  { label: "Autos", href: getHearstDestinationRoute("autos") },
  { label: "Fashion & Luxury", href: getHearstDestinationRoute("flux") },
  { label: "Enthusiast & Wellness", href: getHearstDestinationRoute("ew") },
];

const hearstDestinationNavHrefs = new Map(
  hearstDestinationSections
    .filter((section) => section.label !== "All")
    .map((section) => [section.label, section.href])
);
const hearstGamesHref = "https://motortrend-carmash.lovable.app/";
const utilityLinks = [
  { label: "Shop", href: "/hearst-plus/shopping/" },
  { label: "Newsletter", href: "https://www.hearst.co.uk/newsletter" },
] as const;

function UtilityBar({
  selectedBrand,
  onCreateAccount,
  onOpenProfile,
  darkMode = false,
}: {
  selectedBrand?: { name: string; slug: string } | null;
  onCreateAccount?: () => void;
  onOpenProfile?: () => void;
  darkMode?: boolean;
}) {
  const { brand } = useTheme();
  const { account } = useReaderAccount();
  const selectedDestination = selectedBrand ? getStoryDestinationMode(selectedBrand.slug) : null;
  const activeDestination = selectedDestination === "autos"
    ? "Autos"
    : selectedDestination === "flux"
    ? "Fashion & Luxury"
    : selectedDestination === "ew"
    ? "Enthusiast & Wellness"
    : selectedDestination === "lifestyle"
    ? "Lifestyle"
    : brand.slug === "hearst-all"
      ? "All"
      : brand.slug === "hearst-plus"
      ? "Autos"
      : brand.slug === "hearst-flux"
      ? "Fashion & Luxury"
      : brand.slug === "hearst-ew"
      ? "Enthusiast & Wellness"
      : "Lifestyle";

  return (
    <div
      className={cn(
        "sticky top-0 z-50 h-8 text-[length:var(--text-token-4xs)] font-semibold",
        darkMode
          ? "border-b border-white/10 bg-[#0d1014] text-[#f4f7fb]"
          : "bg-primary text-primary-foreground"
      )}
    >
      <PageContainer className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-3">
        <nav className="hidden items-center gap-3 sm:flex" aria-label="Utility navigation">
          {utilityLinks.map((link) => (
            <LinkComponent
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                variant="neutral"
                underline={false}
                size="xs"
                className={cn(
                  "font-semibold",
                  darkMode
                    ? "text-[#f4f7fb] hover:text-[#BDDDFC]"
                    : "text-primary-foreground hover:text-primary-foreground"
                )}
              >
                {link.label}
              </LinkComponent>
          ))}
        </nav>
        <nav
          className="flex min-w-0 items-center justify-start overflow-x-auto [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
          aria-label="Hearst destination sections"
        >
          <div className={cn("flex min-w-max items-center gap-1 rounded-full p-0.5", darkMode ? "bg-white/[0.06]" : "bg-black/10")}>
            {hearstDestinationSections.map((section) => (
              <LinkComponent
                key={section.label}
                href={section.href}
                variant="neutral"
                underline={false}
                size="xs"
                aria-current={section.label === activeDestination ? "page" : undefined}
                className={cn(
                  "rounded-full px-2 py-0.5 font-bold",
                  section.label === activeDestination
                    ? darkMode
                      ? "bg-[#BDDDFC] text-[#0d1014] hover:text-[#0d1014]"
                      : "bg-white text-black hover:text-black"
                    : darkMode
                      ? "text-[#f4f7fb] opacity-85 hover:bg-white/10 hover:text-white hover:opacity-100"
                      : "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                )}
              >
                {section.label}
              </LinkComponent>
            ))}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="xs"
            className={cn(
              "shrink-0 text-[length:var(--text-token-4xs)] font-semibold",
              account
                ? cn(
                    "gap-1.5 bg-transparent px-0.5 hover:bg-white/10 sm:pr-2",
                    darkMode ? "text-[#f4f7fb] hover:text-white" : "text-primary-foreground hover:text-primary-foreground"
                  )
                : darkMode
                  ? "bg-[#BDDDFC] px-2 text-[#0d1014] hover:bg-[#d7eaff] hover:text-[#0d1014] sm:px-3"
                  : "bg-white px-2 text-black hover:bg-white/90 hover:text-black sm:px-3"
            )}
            aria-label={account ? "Open your profile" : "Sign up or sign in"}
            onClick={account ? onOpenProfile : onCreateAccount}
          >
            {account ? <ReaderAvatar account={account} size="sm" className="!size-4 ring-1 ring-white/50 [&_[data-slot=avatar-fallback]]:text-[8px]" /> : null}
            <span className={account ? "hidden text-xs sm:inline" : "text-[10px] sm:text-xs"}>{account ? account.firstName : "Sign Up / Sign In"}</span>
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}

function getOnboardingInterestOptions(config: DestinationConfig) {
  const broadDestinationFilters = new Set(["For You", "Saved", "Lifestyle", "Autos", "Fashion & Luxury", "Enthusiast & Wellness"]);
  const filterOptions = config.filters.filter((filter) => !broadDestinationFilters.has(filter));
  const topicOptions = Array.from(new Set(config.stories.map((story) => story.topic)))
    .filter((topic) => !broadDestinationFilters.has(topic))
    .sort((a, b) => a.localeCompare(b));

  return Array.from(new Set([...filterOptions, ...topicOptions])).slice(0, 12);
}

const onboardingVisuals: Record<DestinationMode, { image: string; objectPosition: string }> = {
  all: {
    image: "/images/hearst-plus-onboarding.png",
    objectPosition: "center center",
  },
  lifestyle: {
    image: "/images/hearst-plus-onboarding.png",
    objectPosition: "center center",
  },
  autos: {
    image: "/images/hearst-autos-onboarding.avif",
    objectPosition: "center center",
  },
  flux: {
    image: "/images/hearst-flux-onboarding.png",
    objectPosition: "center center",
  },
  ew: {
    image: "/images/hearst-ew-onboarding.png",
    objectPosition: "center center",
  },
};

function getOnboardingVisual(config: DestinationConfig) {
  return onboardingVisuals[config.mode] ?? onboardingVisuals.all;
}

function HearstOnboardingModal({
  open,
  destination,
  onClose,
  onComplete,
  onRequestAuthentication,
}: {
  open: boolean;
  destination: DestinationMode;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onRequestAuthentication: (mode: "create" | "signIn", result: HearstOnboardingResult) => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const config = destinationConfigs[destination];
  const [step, setStep] = React.useState(0);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [brandPage, setBrandPage] = React.useState(0);
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const interestOptions = React.useMemo(() => getOnboardingInterestOptions(config), [config]);
  const onboardingVisual = React.useMemo(() => getOnboardingVisual(config), [config]);
  const brandOptions = React.useMemo(() => {
    const allBrandsConfig = destinationConfigs.all;
    const counts = allBrandsConfig.stories.reduce<Record<string, number>>((acc, story) => {
      acc[story.brand] = (acc[story.brand] ?? 0) + 1;
      return acc;
    }, {});

    return allBrandsConfig.sourceNotes
      .map((note) => ({
        brand: note.brand,
        brandSlug: note.brandSlug,
        count: counts[note.brand] ?? 0,
      }));
  }, [destinationConfigs.all]);
  const storyCount = config.stories.length.toLocaleString();
  const brandCount = destination === "all" ? 29 : config.sourceNotes.length;
  const proofLine = destination === "all"
    ? `Thousands of stories from ${brandCount} trusted Hearst brands, organized around your interests in one place.`
    : `${storyCount}+ stories from ${brandCount} trusted Hearst brands, organized around your interests in one place.`;

  React.useEffect(() => {
    if (!open) return;
    setStep(0);
    setSelectedInterests([]);
    setSelectedBrands([]);
    setBrandPage(0);
  }, [open, destination]);

  React.useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      headingRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, step]);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };
  const toggleBrand = (brandName: string) => {
    setSelectedBrands((current) =>
      current.includes(brandName)
        ? current.filter((item) => item !== brandName)
        : [...current, brandName]
    );
  };
  const getResult = (): HearstOnboardingResult => ({
      id: Date.now(),
      interests: selectedInterests,
      brands: selectedBrands,
      tags: selectedInterests.map((interest) => interest.toLowerCase()),
    });
  const canContinueInterests = selectedInterests.length >= 3;
  const canContinueBrands = selectedBrands.length >= 2;
  const stepCount = 5;
  const interestSelectionLabel = `${selectedInterests.length} selected`;
  const brandSelectionLabel = `${selectedBrands.length} selected`;
  const brandsPerPage = 12;
  const brandPageCount = Math.max(1, Math.ceil(brandOptions.length / brandsPerPage));
  const currentBrandPage = Math.min(brandPage, brandPageCount - 1);
  const visibleBrandOptions = brandOptions.slice(
    currentBrandPage * brandsPerPage,
    currentBrandPage * brandsPerPage + brandsPerPage
  );
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} />
      <section
        ref={dialogRef}
        className="relative z-10 mx-auto grid h-[min(760px,calc(100dvh-2rem))] w-full max-w-5xl overflow-hidden rounded-[8px] bg-background shadow-2xl sm:h-[min(760px,calc(100dvh-3rem))] lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hearst-onboarding-title"
        aria-describedby="hearst-onboarding-description"
      >
        <div className="relative hidden h-full overflow-hidden bg-muted lg:block">
          {onboardingVisual.image ? (
            <Image
              src={onboardingVisual.image}
              alt=""
              fill
              sizes="50vw"
              className="absolute inset-0 h-full w-full object-cover outline-none ring-0"
              style={{ objectPosition: onboardingVisual.objectPosition }}
              aria-hidden
              preload
            />
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                Create Account
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Step {step + 1} of {stepCount}
              </p>
            </div>
            <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close onboarding">
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
          {onboardingVisual.image ? (
            <div className="mb-6 overflow-hidden rounded-[12px] bg-muted lg:hidden">
              <Image
                src={onboardingVisual.image}
                alt=""
                width={1200}
                height={600}
                sizes="100vw"
                className="h-48 w-full object-cover outline-none ring-0"
                style={{ objectPosition: onboardingVisual.objectPosition }}
                aria-hidden
                preload
              />
            </div>
          ) : null}

          {step === 0 ? (
            <div className="space-y-6">
              <div>
                <h2
                  ref={headingRef}
                  id="hearst-onboarding-title"
                  tabIndex={-1}
                  className="headline text-4xl leading-tight outline-none"
                >
                  Your daily Hearst feed, tuned to you.
                </h2>
                <p id="hearst-onboarding-description" className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  Tell us what you care about. We&apos;ll build your daily feed from across Hearst.
                </p>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                  {proofLine}
                </p>
              </div>
              <div className="rounded-[12px] border border-border bg-muted/35 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">What your account saves</p>
                <ul className="mt-4 space-y-3 text-sm leading-5">
                  {["Followed topics and brands", "Saved stories and collections", "Continue reading across devices", "Comment identity and replies"].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2
                    ref={headingRef}
                    id="hearst-onboarding-title"
                    tabIndex={-1}
                    className="headline text-3xl leading-tight outline-none sm:text-4xl"
                  >
                    What should your feed learn first?
                  </h2>
                  <p id="hearst-onboarding-description" className="mt-3 text-sm leading-6 text-muted-foreground">
                    Choose at least 3 interests. These shape the first version of your For You page.
                  </p>
                </div>
                <p className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-xs font-bold text-foreground">
                  {interestSelectionLabel}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                      )}
                      aria-pressed={active}
                    >
                      {active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2
                    ref={headingRef}
                    id="hearst-onboarding-title"
                    tabIndex={-1}
                    className="headline text-3xl leading-tight outline-none sm:text-4xl"
                  >
                    Follow brands you trust.
                  </h2>
                  <p id="hearst-onboarding-description" className="mt-3 text-sm leading-6 text-muted-foreground">
                    Pick at least 2. Your feed will still discover across all Hearst brands, but these voices get a stronger signal.
                  </p>
                </div>
                <p className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-xs font-bold text-foreground">
                  {brandSelectionLabel}
                </p>
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleBrandOptions.map((brandOption) => {
                  const active = selectedBrands.includes(brandOption.brand);
                  return (
                    <button
                      key={brandOption.brandSlug}
                      type="button"
                      onClick={() => toggleBrand(brandOption.brand)}
                      className={cn(
                        "flex min-h-[64px] min-w-0 items-center gap-3 rounded-[8px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                      )}
                      aria-pressed={active}
                    >
                      <BrandSourceIcon brand={brandOption.brand} brandSlug={brandOption.brandSlug} className="h-8 w-8 rounded-[6px]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{brandOption.brand}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{brandOption.count} stories</span>
                      </span>
                      {active ? (
                        <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" aria-hidden />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                {Array.from({ length: brandsPerPage - visibleBrandOptions.length }).map((_, index) => (
                  <div
                    key={`brand-picker-placeholder-${index}`}
                    className="hidden min-h-[64px] rounded-[8px] border border-transparent lg:block"
                    aria-hidden="true"
                  />
                ))}
              </div>
              {brandPageCount > 1 ? (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Showing {currentBrandPage * brandsPerPage + 1}-{Math.min((currentBrandPage + 1) * brandsPerPage, brandOptions.length)} of {brandOptions.length} brands
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setBrandPage((current) => (current - 1 + brandPageCount) % brandPageCount)}
                      aria-label="Show previous brands"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </Button>
                    <div className="flex items-center gap-1" aria-label="Brand pages">
                      {Array.from({ length: brandPageCount }).map((_, index) => (
                        <button
                          key={`brand-page-${index}`}
                          type="button"
                          onClick={() => setBrandPage(index)}
                          className={cn(
                            "h-2 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            index === currentBrandPage
                              ? "w-6 bg-primary"
                              : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                          )}
                          aria-label={`Show brand page ${index + 1}`}
                          aria-current={index === currentBrandPage ? "page" : undefined}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setBrandPage((current) => (current + 1) % brandPageCount)}
                      aria-label="Show next brands"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <div>
                <h2
                  ref={headingRef}
                  id="hearst-onboarding-title"
                  tabIndex={-1}
                  className="headline text-3xl leading-tight outline-none sm:text-4xl"
                >
                  Create a free account to save your feed.
                </h2>
                <p id="hearst-onboarding-description" className="mt-3 text-sm leading-6 text-muted-foreground">
                  Your choices can tune this session now. An account keeps them available whenever you come back.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {[
                    "Personalized Daily Brief",
                    "Saved stories",
                    "Followed topics",
                    "Comment history",
                  ].map((benefit) => (
                    <div key={benefit} className="rounded-[8px] border border-border bg-muted/30 px-3 py-2 text-sm font-semibold">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[12px] border border-border bg-muted/35 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Your selections</p>
                <p className="mt-4 text-sm font-bold">Interests</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{selectedInterests.join(", ")}</p>
                <p className="mt-4 text-sm font-bold">Brands</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{selectedBrands.join(", ")}</p>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="text-center">
              <p className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                <Check className="h-5 w-5" aria-hidden />
              </p>
              <h2
                ref={headingRef}
                id="hearst-onboarding-title"
                tabIndex={-1}
                className="headline mx-auto mt-5 max-w-xl text-4xl leading-tight outline-none"
              >
                Your feed is ready.
              </h2>
              <p id="hearst-onboarding-description" className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Your For You page now starts with your selected interests and brands. The more you read, save, and follow, the sharper it gets.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            {step === 4 ? "Close" : "Skip for now"}
          </button>
          <div className="flex flex-wrap justify-end gap-2">
            {step > 0 && step < 4 ? (
              <Button variant="outline" size="sm" onClick={() => setStep((current) => current - 1)}>
                Back
              </Button>
            ) : null}
            {step === 0 ? (
              <Button size="sm" onClick={() => setStep(1)}>Personalize My Feed</Button>
            ) : null}
            {step === 1 ? (
              <Button size="sm" onClick={() => setStep(2)} disabled={!canContinueInterests}>
                Continue
              </Button>
            ) : null}
            {step === 2 ? (
              <Button size="sm" onClick={() => setStep(3)} disabled={!canContinueBrands}>
                Follow Selected
              </Button>
            ) : null}
            {step === 3 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onComplete(getResult());
                    setStep(4);
                  }}
                  className="whitespace-nowrap"
                >
                  Continue without account
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onRequestAuthentication("signIn", getResult())}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => onRequestAuthentication("create", getResult())} className="whitespace-nowrap">
                  Create Free Account
                </Button>
              </>
            ) : null}
            {step === 4 ? (
              <Button size="sm" onClick={onClose}>
                Start Reading
              </Button>
            ) : null}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

function MainNav({
  brandSlug,
  activeFilter,
  onFilterChange,
  selectedBrand,
  navLinksOverride,
  includeVideos,
  darkMode = false,
}: {
  brandSlug: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  selectedBrand?: { name: string; slug: string } | null;
  navLinksOverride?: string[];
  includeVideos?: boolean;
  darkMode?: boolean;
}) {
  const destinationConfigs = useDestinationConfigs();
  const { brand, colorMode, toggleColorMode } = useTheme();
  const [mastheadCompact, setMastheadCompact] = React.useState(false);
  const mastheadSlug = selectedBrand?.slug ?? brand.slug;
  const logo = brandLogos[mastheadSlug];
  const content = getContent(brandSlug);
  const isDestinationRiver = brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew";
  const destinationConfig = destinationConfigs[getDestinationMode(brand.slug)];
  const baseNavLinks = navLinksOverride ?? (selectedBrand
    ? getBrandContextualFilters(selectedBrand.slug, destinationConfigs.all.stories, includeVideos)
    : isDestinationRiver
      ? destinationConfig.filters
      : content.navLinks);
  const navLinks = includeVideos ? insertVideosFilter(baseNavLinks) : baseNavLinks;

  React.useEffect(() => {
    let frame = 0;
    const updateMasthead = () => {
      frame = 0;
      setMastheadCompact((current) => {
        if (window.scrollY >= 96) return true;
        if (window.scrollY <= 64) return false;
        return current;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMasthead);
    };

    updateMasthead();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const shouldUseNativeLogoColor = mastheadSlug === "car-and-driver";
  const mobileMastheadSlug = !selectedBrand && mastheadSlug === "hearst-ew"
    ? "hearst-eandw"
    : !selectedBrand && mastheadSlug === "hearst-flux"
      ? "hearst-flux-compact"
      : mastheadSlug;
  const usesCompactMobileDestinationMark = mobileMastheadSlug !== mastheadSlug;
  const mastheadHearstGeometry = selectedBrand
    ? {
        compact: "h-[16px] max-w-[220px] sm:h-[23px] sm:max-w-[400px]",
        regular: "h-[22px] max-w-[280px] sm:h-[34px] sm:max-w-[580px]",
      }
    : mastheadSlug === "hearst-all"
      ? {
          compact: "h-[16.057px] max-w-[220px] sm:h-[23.082px] sm:max-w-[400px]",
          regular: "h-[22.079px] max-w-[280px] sm:h-[34.122px] sm:max-w-[580px]",
        }
      : mastheadSlug === "hearst-lifestyle"
        ? {
            compact: "h-[18.734px] max-w-[260px] sm:h-[26.929px] sm:max-w-[400px]",
            regular: "h-[25.759px] max-w-[320px] sm:h-[39.809px] sm:max-w-[580px]",
          }
        : mastheadSlug === "hearst-flux"
          ? {
              compact: "h-[18.945px] max-w-[260px] sm:h-[27.233px] sm:max-w-[400px]",
              regular: "h-[26.049px] max-w-[320px] sm:h-[40.257px] sm:max-w-[580px]",
            }
          : mastheadSlug === "hearst-ew" || mastheadSlug === "hearst-autos" || mastheadSlug === "hearst-plus"
            ? {
                compact: "h-[16.238px] max-w-[360px] sm:h-[23.342px] sm:max-w-[400px]",
                regular: "h-[22.327px] max-w-[360px] sm:h-[34.506px] sm:max-w-[580px]",
              }
            : {
                compact: "h-[16px] max-w-[220px] sm:h-[23px] sm:max-w-[400px]",
                regular: "h-[22px] max-w-[280px] sm:h-[34px] sm:max-w-[580px]",
              };
  const logoColor = selectedBrand
    ? mastheadSlug === "motortrend"
      ? "#e90c17"
      : mastheadSlug === "hot-rod"
      ? "#c11b17"
      : shouldUseNativeLogoColor
      ? undefined
      : colorMode === "dark"
        ? "#ffffff"
        : "#121212"
    : darkMode
      ? "#ffffff"
    : brand.slug === "hearst-flux" && colorMode === "dark"
      ? "#ffffff"
      : undefined;

  const mastheadLogoBaseClasses = "mx-auto w-auto items-center justify-center leading-none [&_svg]:block [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full motion-reduce:[&_svg]:transition-none";
  const renderMastheadLogo = (compact: boolean) => logo ? usesCompactMobileDestinationMark ? (
    <>
      <BrandLogo
        slug={mobileMastheadSlug}
        color={logoColor}
        className={cn(
          mastheadLogoBaseClasses,
          "flex max-w-[260px] sm:hidden",
          compact ? "h-[16.238px]" : "h-[22.327px]"
        )}
      />
      <BrandLogo
        slug={mastheadSlug}
        color={logoColor}
        className={cn(
          mastheadLogoBaseClasses,
          "hidden sm:flex",
          compact ? mastheadHearstGeometry.compact : mastheadHearstGeometry.regular
        )}
      />
    </>
  ) : (
    <BrandLogo
      slug={mastheadSlug}
      color={logoColor}
      className={cn(
        mastheadLogoBaseClasses,
        "flex",
        compact ? mastheadHearstGeometry.compact : mastheadHearstGeometry.regular
      )}
    />
  ) : (
    <h1 className="text-2xl tracking-widest uppercase headline">
      {brand.name}
    </h1>
  );

  const renderNavLinks = () => navLinks.map((link) => {
    const active = activeFilter === link;
    const destinationHref = brand.slug === "hearst-all" ? hearstDestinationNavHrefs.get(link) : undefined;
    const categoryHref = isDestinationRiver && !selectedBrand && link !== "Games"
      ? getHearstDestinationCategoryRoute(getDestinationMode(brand.slug), link)
      : undefined;
    const useDarkActiveState = darkMode || (brand.slug === "hearst-flux" && colorMode === "dark");
    const navLinkClasses = darkMode
      ? "text-[#f4f7fb] hover:border-[#BDDDFC]/60 hover:text-[#BDDDFC]"
      : "text-foreground hover:border-primary/40 hover:text-primary";

    return destinationHref ? (
      <LinkComponent
        key={link}
        href={destinationHref}
        variant="neutral"
        underline={false}
        size="sm"
        className={cn("min-h-11 whitespace-nowrap border-b-2 border-transparent px-0.5 font-normal hover:no-underline md:min-h-0 md:pb-1", navLinkClasses)}
      >
        {link}
      </LinkComponent>
    ) : categoryHref ? (
      <LinkComponent
        key={link}
        href={categoryHref}
        variant="neutral"
        underline={false}
        size="sm"
        aria-current={active ? "page" : undefined}
        className={cn(
          "min-h-11 whitespace-nowrap border-b-2 border-transparent px-0.5 font-normal hover:no-underline md:min-h-0 md:pb-1",
          navLinkClasses,
          active
            ? useDarkActiveState
              ? "border-[#BDDDFC] font-semibold text-[#BDDDFC]"
              : "border-primary font-semibold text-[var(--hp-section-title)]"
            : ""
        )}
      >
        {link}
      </LinkComponent>
    ) : link === "Games" ? (
      <LinkComponent
        key={link}
        href={hearstGamesHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="neutral"
        underline={false}
        size="sm"
        className={cn("min-h-11 whitespace-nowrap border-b-2 border-transparent px-0.5 font-normal hover:no-underline md:min-h-0 md:pb-1", navLinkClasses)}
      >
        {link}
      </LinkComponent>
    ) : isDestinationRiver ? (
      <button
        key={link}
        type="button"
        onClick={() => onFilterChange?.(link)}
        className={cn(
          "min-h-11 whitespace-nowrap border-b-2 border-transparent px-0.5 text-sm font-normal transition-colors md:min-h-0 md:pb-1",
          active
            ? useDarkActiveState
              ? "border-[#BDDDFC] font-semibold text-[#BDDDFC]"
              : "border-primary font-semibold text-[var(--hp-section-title)]"
            : navLinkClasses
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
        className="min-h-11 whitespace-nowrap font-normal md:min-h-0"
      >
        {link}
      </LinkComponent>
    );
  });

  return (
    <>
    <div className={cn("flex h-20 border-b sm:h-24", darkMode ? "border-white/10 bg-[#0d1014] text-[#f4f7fb]" : "border-border bg-[var(--hp-surface)]")}>
      <PageContainer className="flex items-center justify-between">
        <div className="flex w-10 shrink-0 justify-start sm:w-[var(--width-sidebar-narrow)]">
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 sm:h-7 sm:w-7",
              darkMode ? "border-white/20 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white" : undefined
            )}
            onClick={toggleColorMode}
            aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
          >
            {colorMode === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </Button>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {renderMastheadLogo(false)}
        </div>
        <div className="flex w-10 shrink-0 justify-end sm:w-[var(--width-sidebar-narrow)]">
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 sm:h-7 sm:w-7",
              darkMode ? "border-white/20 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white" : undefined
            )}
            aria-label="Search"
            title="Search"
          >
            <Search className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
      </PageContainer>
    </div>
    <div className={cn(
      "border-b",
      darkMode ? "border-white/10 bg-[#0d1014]" : "border-border",
      isDestinationRiver && (darkMode ? "sticky top-8 z-30 md:static" : "sticky top-8 z-30 bg-[var(--hp-surface)] md:static"),
      mastheadCompact && "md:invisible"
    )}>
      <PageContainer as="nav" className="flex items-center justify-start gap-6 overflow-x-auto py-2 scrollbar-hide md:justify-center">
        {renderNavLinks()}
      </PageContainer>
    </div>
    <div
      aria-hidden={!mastheadCompact}
      inert={!mastheadCompact}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-8 z-40 hidden -translate-y-2 transform-gpu border-b opacity-0 transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:block",
        darkMode ? "border-white/10 bg-[#0d1014]" : "border-border bg-[var(--hp-surface)]",
        mastheadCompact && "pointer-events-auto translate-y-0 opacity-100"
      )}
    >
      <PageContainer as="nav" className="flex items-center justify-center gap-6 overflow-x-auto py-2 scrollbar-hide">
        {renderNavLinks()}
      </PageContainer>
    </div>
    </>
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
        <LinkComponent href="https://subscribe.hearstmags.com/circulation/shared/terms.html" target="_blank" rel="noopener noreferrer" variant="neutral" underline size="xs" className="font-normal">Terms of Use</LinkComponent>{" "}
        (including the{" "}
        <LinkComponent href="https://subscribe.hearstmags.com/circulation/shared/terms.html" target="_blank" rel="noopener noreferrer" variant="neutral" underline size="xs" className="font-normal">dispute resolution procedures</LinkComponent>
        ) and have reviewed the{" "}
        <LinkComponent href="https://subscribe.hearstmags.com/circulation/shared/privacy.html" target="_blank" rel="noopener noreferrer" variant="neutral" underline size="xs" className="font-normal">Privacy Notice</LinkComponent>.
        This site is protected by reCAPTCHA and the Google{" "}
        <LinkComponent href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" variant="neutral" underline size="xs" className="font-normal">Privacy Policy</LinkComponent>{" "}
        and{" "}
        <LinkComponent href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" variant="neutral" underline size="xs" className="font-normal">Terms of Service</LinkComponent>{" "}
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

function Footer({ flushTop = false }: { flushTop?: boolean }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];

  const footerLogo = logo ? (
    <BrandLogo
      slug={brand.slug}
      className="flex h-8 max-w-full items-center [&_svg]:h-auto [&_svg]:max-h-8 [&_svg]:w-auto [&_svg]:max-w-full"
      color="#fff"
    />
  ) : (
    brand.name
  );

  return (
    <div className={cn(flushTop ? "pt-0" : "pt-12")}>
      <SiteFooter
        siteName={footerLogo}
        socialLinks={["YouTube", "Facebook", "Instagram", "Pinterest"]}
        legalLinks={["Privacy Notice", "Terms of Use", "Hearst brands"]}
        copyrightYear={2026}
      />
    </div>
  );
}

function LifestyleRiverImage({
  story,
  className,
  priority = false,
}: {
  story: LifestyleRiverStory;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={story.image}
      alt={`${story.brand}: ${story.title}`}
      width={1200}
      height={675}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 640px"
      className={cn("min-w-0 bg-muted object-cover", className)}
      style={{ objectPosition: getLifestyleImagePosition(story) }}
      preload={priority}
    />
  );
}

function getLifestyleImagePosition(story: LifestyleRiverStory) {
  const peopleForwardBrands = new Set([
    "cosmopolitan",
    "seventeen",
    "elle",
    "harpers-bazaar",
    "town-country",
    "esquire",
    "redbook",
    "oprah-daily",
  ]);
  const peopleForwardTopics = new Set([
    "Beauty",
    "Culture",
    "Entertainment",
    "Events",
    "Lifestyle",
    "Pleasure",
    "Relationships",
    "Style",
    "Style Beauty",
  ]);
  const headCropRiskTerms = [
    "actor",
    "actress",
    "bob haircut",
    "boyfriend",
    "cast",
    "celebrity",
    "characters",
    "dating",
    "fiancé",
    "girlfriend",
    "joining",
    "looks",
    "relationship",
    "spotted",
    "style",
    "taylor swift",
    "wedding",
  ];
  const title = story.title.toLowerCase();

  if (story.id === lifestyleDefaultLeadStoryId) return "center 22%";
  if (story.title === "Is Dee Valladares Joining BB28? Here’s Why Fans Are Convinced She’s Another ‘Survivor’ Alum-Turned-Houseguest") return "center 6%";
  if (story.title === "Are Corbin and Parmida Still Together? Corbin Speaks Out") return "center 18%";
  if (story.title === "All About Zoey Deutch’s Fiancé, Jimmy Tatro") return "center 10%";
  if (story.title === "Inside Adéla’s Night Out in Paris With Wardrobe.NYC and H&M") return "center 8%";
  if (story.title === "Kate Middleton’s Style at Wimbledon Throughout the Years") return "center 5%";
  if (story.title === "Minka Kelly and Dan Reynolds’s Complete Relationship Timeline") return "center 18%";
  if (peopleForwardBrands.has(story.brandSlug) && peopleForwardTopics.has(story.topic)) return "center 16%";
  if (headCropRiskTerms.some((term) => title.includes(term))) return "center 16%";
  return "center";
}

function getLifestyleByline(story: LifestyleRiverStory) {
  return story.byline || `${story.brand} editors`;
}

function LifestyleBrandSource({ story }: { story: LifestyleRiverStory }) {
  const byline = getLifestyleByline(story);

  return (
    <a
      href={getHearstBrandRoute(story.brandSlug)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      className="relative z-20 inline-flex min-w-0 items-center gap-1.5 rounded-[4px] text-[length:var(--text-token-4xs)] text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      aria-label={`Open ${story.brand} brand page`}
    >
      <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
      <span className="min-w-0 truncate">
        {story.brand} · {story.topic} · {byline}
      </span>
    </a>
  );
}

type LifestyleCardKind = "article" | "gallery" | "video" | "recipe" | "shopping";

type ContextualAdUnit = {
  id: string;
  sponsor: string;
  title: string;
  summary: string;
  cta: string;
  topics: string[];
  tags: string[];
  creativeLabel: string;
  imageUrl: string;
  palette: {
    background: string;
    foreground: string;
    accent: string;
    soft: string;
  };
};

type ContextualAdTuple = readonly [
  string,
  string,
  string,
  string,
  string,
  string[],
  string[],
  string,
  string,
  string,
  string,
  string,
  string
];

const contextualAdCatalog = {
  lifestyle: [
    ["lifestyle-home-refresh", "Hearst Market", "Summer Home Refresh", "Editor-picked bedding, cookware, storage, and patio upgrades for the rooms readers are saving now.", "Shop the edit", ["Home", "Shopping"], ["decorating", "products", "summer", "home"], "Home", "#fff7f4", "#3b1e2f", "#7A2E57", "#f0dbe6", "https://hips.hearstapps.com/hmg-prod/images/824e435b-c480-4cba-92e3-cb4f5f72286e.jpg"],
    ["lifestyle-dinner-planner", "Delish Selects", "Tonight's Dinner Plan", "Fast mains, flexible sides, and kitchen tools matched to food and weeknight-cooking intent.", "Build dinner", ["Food", "Food Drinks", "Food News"], ["dinner ideas", "recipe", "cookout", "food"], "Food", "#fff6e8", "#3a2514", "#9a4c13", "#f3d29f", "https://hips.hearstapps.com/hmg-prod/images/f6b3c525-576e-4b56-a6d3-350a327a4531.jpg"],
    ["lifestyle-sleep-reset", "Prevention Wellness", "Sleep Better Tonight", "Pillows, routines, and calm-down tools for readers returning to wellness content late in the day.", "See sleep picks", ["Wellness"], ["sleep", "health", "wellness"], "Wellness", "#f3f7ff", "#18243f", "#435f9a", "#dbe6ff", "https://hips.hearstapps.com/hmg-prod/images/13cee80d-3684-44b4-b7d4-56465a4730b2.jpeg"],
    ["lifestyle-beauty-counter", "Cosmo Beauty Lab", "The 10-Minute Beauty Counter", "High-signal beauty products and routines for style, shopping, and celebrity browsing sessions.", "Open the counter", ["Style", "Shopping", "Entertainment"], ["beauty", "style", "products", "celebrity"], "Beauty", "#fff1f7", "#431525", "#b51d62", "#f8c5df", "https://hips.hearstapps.com/hmg-prod/images/body-lotion-opener-691e31beacd6b.png"],
    ["lifestyle-garden-weekend", "Country Living Finds", "Weekend Garden List", "Planters, tools, and porch pieces tuned to gardening, outdoor, and weekend-project signals.", "Plan the weekend", ["Home", "Shopping"], ["garden", "outdoor", "decorating", "weekend"], "Garden", "#f4faef", "#17321c", "#3f7a47", "#d6e9c8", "https://hips.hearstapps.com/hmg-prod/images/ad14fef8-09c7-421e-af6b-71e2dc6f4894.jpeg"],
    ["lifestyle-hosting-kit", "Good Housekeeping Tested", "Hosting Without the Guesswork", "Lab-informed serveware, cleaning helpers, and party tools for readers saving home-service content.", "See tested picks", ["Home", "Food", "Shopping"], ["cleaning", "products", "party", "home"], "Tested", "#f7fbfb", "#15333a", "#0b7285", "#cdebf0", "https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg"],
    ["lifestyle-small-space", "House Beautiful Studio", "Small-Space Fixes", "Storage, lighting, and furniture picks for apartment, room refresh, and design-intent sessions.", "Refresh a room", ["Home", "Shopping"], ["decorating", "rooms", "products", "design"], "Rooms", "#f8f5ef", "#31261d", "#80613d", "#e5d8c3", "https://hips.hearstapps.com/hmg-prod/images/bd62be17-e3bc-47ce-998b-df0fb3603b5b.jpeg"],
    ["lifestyle-teen-style", "Seventeen Style", "Back-to-School Style Drop", "Trend-led fashion, beauty, and dorm finds for younger style and shopping journeys.", "Shop trends", ["Style", "Shopping"], ["style", "beauty", "products", "school"], "Style", "#f6f0ff", "#251342", "#7b45c4", "#dfcff6", "https://hips.hearstapps.com/hmg-prod/images/03aba195-11cd-441a-914b-e56bf5cdc562.jpeg"],
    ["lifestyle-family-meal-kit", "Woman's Day Kitchen", "Family Meal Shortcut", "A practical sponsor module for meal planning, leftovers, and family dinner intent.", "Get the shortcut", ["Food", "Family"], ["dinner ideas", "family", "food", "recipe"], "Family", "#fff8ed", "#362312", "#a65d13", "#f4ddb7", "https://hips.hearstapps.com/hmg-prod/images/8c75311c-1d90-4191-b4dd-cfb0577ad148.jpeg"],
    ["lifestyle-cozy-collection", "Pioneer Woman Picks", "Cozy Kitchen Collection", "Cookware, table linens, and colorful prep tools aligned with recipe and home-commerce behavior.", "Explore picks", ["Food", "Home", "Shopping"], ["cookware", "recipe", "products", "home"], "Kitchen", "#fff2ee", "#351b17", "#b94b3f", "#f3c8c0", "https://hips.hearstapps.com/hmg-prod/images/72849786-d2ce-4cfe-8e54-2aea79b0db5c.jpeg"],
  ],
  autos: [
    ["autos-ev-home-charge", "ChargePoint", "EV Charging, Matched to Your Garage", "A contextual offer for readers comparing EVs, range, charging speed, and home setup decisions.", "Estimate charging", ["EVs", "Buying Guides"], ["evs", "electric", "buying", "reviews"], "EV", "#eef8ff", "#10283b", "#1b5f8a", "#cce8f7", "https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-equinox-rs-awd-132-67110e2133505.jpg"],
    ["autos-tire-finder", "Michelin Garage", "Find the Right Performance Tire", "Tire and handling recommendations for readers deep in reviews, performance, and track-day content.", "Match tires", ["Reviews", "Performance", "Racing"], ["performance", "drive", "racing", "reviews"], "Grip", "#f2f7fb", "#101f2a", "#1b5f8a", "#d8e9f2", "https://hips.hearstapps.com/hmg-prod/images/d91a8038-0b16-435e-9cc3-e5629f2c0d81.jpeg"],
    ["autos-auction-alert", "Collector Watch", "Auction Watchlist", "Collector-car alerts aligned to classics, Bring a Trailer behavior, and save-for-later browsing.", "Track listings", ["Classics", "Auctions"], ["auction", "classic", "collector", "used"], "Bid", "#f8f4ec", "#302414", "#7b5a27", "#e8d8b7", "https://hips.hearstapps.com/hmg-prod/images/92a52d3f-3d3c-4e38-b3bd-7f82dc8b7146.jpg"],
    ["autos-tool-chest", "Craftsman Pro", "Build the Home Garage", "Tools, lifts, storage, and detailing gear for readers acting on trucks, classics, and project-car intent.", "Open garage", ["Trucks", "Classics", "Performance"], ["truck", "classic", "gear", "engine"], "Garage", "#f3f5f6", "#1e2529", "#4f6673", "#dce5e9", "https://hips.hearstapps.com/hmg-prod/images/f04e60d2-9db2-4c60-91ba-a037f75a8fce.jpeg"],
    ["autos-insurance", "Hagerty", "Collector Coverage Check", "Insurance guidance for readers browsing classics, auctions, and collectible performance cars.", "Check coverage", ["Classics", "Auctions", "Buying Guides"], ["classic", "collector", "auction", "buying"], "Cover", "#eef5f8", "#0f2a38", "#1b5f8a", "#d5e8f0", "https://hips.hearstapps.com/hmg-prod/images/4d6fd00c-2cd1-4bf1-bbba-fca826f647e6.jpg"],
    ["autos-racing-weekend", "TrackPass", "Your Racing Weekend", "Tickets, streams, and schedules for readers consuming racing news and late-night performance content.", "Plan race day", ["Racing", "Performance"], ["racing", "speed", "performance", "track"], "Race", "#f6f9ff", "#13213f", "#1b5f8a", "#d9e5fa", "https://hips.hearstapps.com/hmg-prod/images/b3eae25c-4d64-4443-aa85-d92038993110.jpeg"],
    ["autos-detail-kit", "Meguiar's", "Weekend Detail Kit", "Wash, wax, ceramic, and interior care surfaced when the reader leans toward ownership utility.", "Build the kit", ["Buying Guides", "Classics", "Trucks"], ["used", "classic", "truck", "products"], "Detail", "#f5fbff", "#122533", "#1b5f8a", "#d7edf7", "https://hips.hearstapps.com/hmg-prod/images/35a0cc29-04f8-4da2-8884-4db6a81a1814.jpg"],
    ["autos-finance", "Auto Finance Desk", "Know Your Monthly Number", "Financing and value tools for readers comparing models, reviews, and buying-guide content.", "Estimate payment", ["Buying Guides", "Reviews"], ["buying", "reviews", "used", "evs"], "Value", "#f4f8f9", "#162a31", "#1b5f8a", "#d9e8ed", "https://hips.hearstapps.com/hmg-prod/images/b259176b-4ee0-448c-9af3-d0a8c63a86af.jpg"],
    ["autos-truck-cargo", "WeatherTech", "Truck Bed and Cabin Protection", "Cargo liners, mats, and storage systems for readers signaling truck and adventure utility.", "Fit my truck", ["Trucks", "Buying Guides"], ["truck", "gear", "products", "buying"], "Truck", "#f7f7f2", "#272a1e", "#5d6b39", "#e1e6cc", "https://hips.hearstapps.com/hmg-prod/images/52484e15-9a72-4b16-baf8-8470bd98f328.jpg"],
    ["autos-performance-parts", "Summit Racing", "Performance Parts Finder", "Engine, exhaust, and suspension modules for readers following horsepower and racing signals.", "Find parts", ["Performance", "Racing", "Classics"], ["performance", "engine", "horsepower", "racing"], "Parts", "#fff3f0", "#331914", "#b33b2e", "#f3c8bf", "https://hips.hearstapps.com/hmg-prod/images/500cbd60-b7a3-4bad-9abe-367c1ff574f8.jpg"],
  ],
  flux: [
    ["flux-designer-sale", "Luxury Edit", "The Designer Sale Watch", "A shopping module for readers browsing style, celebrity looks, and high-intent product stories.", "Watch the edit", ["Style", "Shopping"], ["style", "shopping", "fashion", "products"], "Style", "#f7f7f7", "#000000", "#000000", "#e5e5e5", "https://hips.hearstapps.com/hmg-prod/images/b2d33641-54c4-4049-bf45-dd15e0316852.jpg"],
    ["flux-beauty-wardrobe", "Beauty Counter", "Build a Summer Beauty Wardrobe", "Fragrance, skin, and makeup picks aligned to beauty and style behavior.", "Open beauty", ["Beauty", "Style"], ["beauty", "style", "shopping", "fashion"], "Beauty", "#fff6fa", "#1c1016", "#000000", "#f1d9e3", "https://hips.hearstapps.com/hmg-prod/images/a52e5ed3-b530-41c3-a9e1-457d122763f8.jpg"],
    ["flux-art-weekend", "Culture Pass", "Your Culture Weekend", "Gallery openings, restaurants, performances, and bookable moments for culture-led sessions.", "Plan the weekend", ["Culture", "Events", "Travel"], ["culture", "events", "travel", "feature"], "Culture", "#f6f3ee", "#16110c", "#000000", "#e5ded0", "https://hips.hearstapps.com/hmg-prod/images/bfa63434-07db-4da1-ad7c-9ea52c6e56ee.jpeg"],
    ["flux-interior-materials", "Design Materials", "A Better Room Starts With Texture", "Furniture, lighting, and fabric recommendations for interiors and design-intent readers.", "Source the room", ["Design", "Shopping"], ["design", "home", "products", "interiors"], "Design", "#f4f2ef", "#181512", "#000000", "#ded8d0", "https://hips.hearstapps.com/hmg-prod/images/30454208-2b0a-4ed8-91a1-537490290eaf.jpg"],
    ["flux-travel-club", "Town & Country Travel", "The Long Weekend List", "Hotels, luggage, and reservations tied to travel, culture, and luxury browsing behavior.", "See the list", ["Travel", "Culture", "Shopping"], ["travel", "culture", "shopping", "leisure"], "Travel", "#f2f6f7", "#101719", "#000000", "#dbe6e8", "https://hips.hearstapps.com/hmg-prod/images/cccaef24-76e6-4809-9500-8bb1d70824ab.jpg"],
    ["flux-watch-jewelry", "Fine Objects", "Jewelry and Watch Radar", "Luxury objects matched to celebrity, event, and shopping signals.", "View radar", ["Shopping", "Style", "Events"], ["jewelry", "shopping", "celebrity", "events"], "Objects", "#faf7ef", "#1d1810", "#000000", "#e9dfc6", "https://hips.hearstapps.com/hmg-prod/images/a5eadcc3-e1d6-48d4-ad47-d42dc01a22b4.jpg"],
    ["flux-mens-style", "Esquire Shop", "Sharper Summer Dressing", "Menswear, grooming, and accessories for culture and style readers.", "Get dressed", ["Style", "Shopping"], ["style", "fashion", "shopping", "grooming"], "Menswear", "#f5f5f4", "#111111", "#000000", "#dedede", "https://hips.hearstapps.com/hmg-prod/images/20eda3cc-1ce6-4365-ad78-44219f1391eb.png"],
    ["flux-garden-party", "Veranda Entertains", "Garden Party Checklist", "Outdoor furniture, tabletop, flowers, and entertaining ideas for design and events sessions.", "Host outside", ["Design", "Events"], ["design", "home", "events", "garden"], "Host", "#f3f8f0", "#121d10", "#000000", "#dce8d6", "https://hips.hearstapps.com/hmg-prod/images/9357bef4-cbb5-4634-b167-58897274f85c.jpeg"],
    ["flux-red-carpet", "Red Carpet Desk", "The Event Lookbook", "Dresses, beauty, accessories, and editor context for celebrity and event-led browsing.", "Open lookbook", ["Events", "Style", "Beauty"], ["celebrity", "events", "style", "beauty"], "Event", "#fff1f1", "#241010", "#000000", "#f0cccc", "https://hips.hearstapps.com/hmg-prod/images/7984ffdf-0689-4cd5-a2fc-966eb9187dba.jpeg"],
    ["flux-design-consult", "Elle Decor Studio", "Find Your Design Direction", "A high-touch design consult module for readers saving interiors and home inspiration.", "Start consult", ["Design"], ["design", "home", "interiors", "products"], "Studio", "#f8f8f5", "#171713", "#000000", "#e5e5db", "https://hips.hearstapps.com/hmg-prod/images/d4338644-77dd-4f18-980f-e99a3f966d50.jpg"],
  ],
  ew: [
    ["ew-running-shoe", "Runner's Lab", "Find Your Next Running Shoe", "Shoe, training, and recovery recommendations for fitness and running behavior.", "Match my run", ["Fitness", "Gear"], ["fitness", "running", "gear", "training"], "Run", "#fff0f0", "#3a080e", "#E50022", "#ffd7dc", "https://hips.hearstapps.com/hmg-prod/images/d75dce99-2d12-45cc-ad48-8e5fabb43be2.jpg"],
    ["ew-home-gym", "Garage Gym Builder", "Build a Smarter Home Gym", "Weights, mats, benches, and programming for readers engaging with strength and gear stories.", "Plan gym", ["Fitness", "Gear"], ["fitness", "gear", "training", "products"], "Gym", "#fff4f4", "#34080d", "#E50022", "#ffdadd", "https://hips.hearstapps.com/hmg-prod/images/bass-headphones-earbuds-001-669a8ef2be058.jpg"],
    ["ew-bike-fit", "Bicycling Fit Studio", "Dial In Your Bike Fit", "Fit tools, shoes, saddles, and gear surfaced for cycling and adventure intent.", "Tune fit", ["Gear", "Adventure", "Fitness"], ["bike", "cycling", "gear", "adventure"], "Bike", "#f2f8ff", "#102235", "#E50022", "#d8e9fb", "https://hips.hearstapps.com/hmg-prod/images/01074154-c6c1-4856-bca5-7ab2ea491991.jpeg"],
    ["ew-recovery-kit", "Recovery Desk", "Recovery That Fits Your Routine", "Sleep, mobility, massage, and recovery tools matched to wellness and fitness signals.", "Recover better", ["Wellness", "Fitness"], ["wellness", "recovery", "sleep", "health"], "Recover", "#f6f8fb", "#111b28", "#E50022", "#dfe8f1", "https://hips.hearstapps.com/hmg-prod/images/adventure-toys-for-kids-69a8a11950639.png"],
    ["ew-tech-kit", "Popular Mechanics Tested", "Gear That Solves the Problem", "Tech, tools, and tested equipment for science, mechanics, and gear browsing.", "See tested gear", ["Tech", "Gear"], ["tech", "gear", "science", "products"], "Tested", "#f3f6f7", "#121f25", "#E50022", "#dce6ea", "https://hips.hearstapps.com/hmg-prod/images/amazon-tech-products-2021-1635430982.jpg"],
    ["ew-nutrition-plan", "Fuel Plan", "Nutrition for the Next Goal", "Meal, protein, hydration, and supplement signals for wellness and training readers.", "Build fuel plan", ["Nutrition", "Wellness", "Fitness"], ["nutrition", "food", "health", "training"], "Fuel", "#fff8ed", "#34220e", "#E50022", "#f2dfbd", "https://hips.hearstapps.com/hmg-prod/images/f0fa3667-bbf0-40c8-b8e9-e7bd5d82876d.jpg"],
    ["ew-adventure-pack", "Trail Kit", "Weekend Adventure Pack", "Bags, shoes, layers, and safety gear for readers signaling adventure and outdoor interest.", "Pack better", ["Adventure", "Gear"], ["adventure", "gear", "outdoor", "products"], "Trail", "#f4faef", "#142b16", "#E50022", "#dceccd", "https://hips.hearstapps.com/hmg-prod/images/dorm-room-ideas-681a6f88db8db.jpg"],
    ["ew-health-check", "Health Navigator", "Your Next Health Check", "Screenings, routines, and practical next steps aligned with health and life content.", "Make a plan", ["Wellness", "Life"], ["health", "wellness", "life", "sleep"], "Health", "#fff5f6", "#33080d", "#E50022", "#ffdce0", "https://hips.hearstapps.com/hmg-prod/images/pedaling-daniel-wakefield-pasley-1658942201.jpg"],
    ["ew-smartwatch", "Wearable Lab", "Track What Actually Matters", "Watch, heart-rate, and recovery tools matched to tech, fitness, and training sessions.", "Compare watches", ["Tech", "Fitness", "Gear"], ["tech", "fitness", "gear", "training"], "Track", "#f7f7ff", "#171730", "#E50022", "#e1e1fb", "https://hips.hearstapps.com/hmg-prod/images/b32ab90f-fef4-4582-a72f-d1a8621e1148.jpg"],
    ["ew-book-club", "Oprah Daily Life", "A Better Night Routine", "Books, journaling, sleep, and reflection picks for late-night life and wellness browsing.", "Start tonight", ["Life", "Wellness"], ["life", "sleep", "wellness", "books"], "Life", "#fff2f6", "#34101b", "#E50022", "#f4d4de", "https://hips.hearstapps.com/hmg-prod/images/ba0b950d-7abb-4544-b6df-13f3ce1d21bf.jpg"],
  ],
} satisfies Record<Exclude<DestinationMode, "all">, ContextualAdTuple[]>;

function normalizeContextualAds(units: ContextualAdTuple[]): ContextualAdUnit[] {
  return units.map(([id, sponsor, title, summary, cta, topics, tags, creativeLabel, background, foreground, accent, soft, imageUrl]) => ({
    id,
    sponsor,
    title,
    summary,
    cta,
    topics,
    tags,
    creativeLabel,
    imageUrl,
    palette: { background, foreground, accent, soft },
  }));
}

const contextualAdsByDestination: Record<DestinationMode, ContextualAdUnit[]> = {
  all: normalizeContextualAds([
    ...contextualAdCatalog.lifestyle,
    ...contextualAdCatalog.autos,
    ...contextualAdCatalog.flux,
    ...contextualAdCatalog.ew,
  ]),
  lifestyle: normalizeContextualAds(contextualAdCatalog.lifestyle),
  autos: normalizeContextualAds(contextualAdCatalog.autos),
  flux: normalizeContextualAds(contextualAdCatalog.flux),
  ew: normalizeContextualAds(contextualAdCatalog.ew),
};

function scoreContextualAd(
  ad: ContextualAdUnit,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config: DestinationConfig,
  activeFilter: string,
  surroundingStories: LifestyleRiverStory[]
) {
  const daypart = config.dayparts[demoState.daypart];
  let score = 0;

  if (activeFilter !== "For You" && ad.topics.some((topic) => topic === activeFilter || topic.startsWith(activeFilter))) score += 28;
  score += ad.topics.filter((topic) => profile.followedTopics.includes(topic)).length * 16;
  score += ad.tags.filter((tag) => profile.savedTags.includes(tag) || profile.boostedTags.includes(tag)).length * 14;
  score += ad.topics.filter((topic) => daypart.preferredTopics.includes(topic)).length * 12;
  score += ad.tags.filter((tag) => daypart.preferredTags.includes(tag)).length * 10;
  score += surroundingStories.filter((story) => ad.topics.includes(story.topic)).length * 8;
  score += surroundingStories.filter((story) => story.tags.some((tag) => ad.tags.includes(tag))).length * 6;

  return score;
}

function getContextualAdForSlot({
  destination,
  slotIndex,
  profile,
  demoState,
  config,
  activeFilter,
  stories,
}: {
  destination: DestinationMode;
  slotIndex: number;
  profile: LifestyleRiverProfile;
  demoState: LifestyleDemoState;
  config: DestinationConfig;
  activeFilter: string;
  stories: LifestyleRiverStory[];
}) {
  const surroundingStories = stories.slice(Math.max(0, slotIndex - 2), Math.min(stories.length, slotIndex + 3));
  const rankedAds = contextualAdsByDestination[destination]
    .map((ad) => ({
      ad,
      score: scoreContextualAd(ad, profile, demoState, config, activeFilter, surroundingStories),
    }))
    .sort((a, b) => b.score - a.score || a.ad.id.localeCompare(b.ad.id));

  const match = rankedAds[slotIndex % rankedAds.length] ?? rankedAds[0];
  return match;
}

function ContextualRiverAdCard({
  ad,
  score,
  slotNumber,
}: {
  ad: ContextualAdUnit;
  score: number;
  slotNumber: number;
}) {
  return (
    <article
      className="grid min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4"
      aria-label={`Sponsored: ${ad.title}`}
      style={{ backgroundColor: ad.palette.background, color: ad.palette.foreground }}
    >
      <div className="relative aspect-video min-w-0 overflow-hidden rounded-[4px] sm:h-full sm:min-h-44 sm:aspect-auto">
        <Image
          src={ad.imageUrl}
          alt={`${ad.sponsor}: ${ad.title}`}
          width={704}
          height={396}
          sizes="(max-width: 640px) 100vw, 176px"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 text-white">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest">
            Sponsored
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black shadow-sm"
            style={{ backgroundColor: ad.palette.accent, color: "#fff" }}
          >
            AD
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest opacity-90">
            {ad.creativeLabel}
          </p>
          <p className="mt-2 max-w-[12rem] text-sm font-bold leading-4 text-white">
            Matched to this part of the river
          </p>
        </div>
      </div>
      <div className="min-w-0 pt-4 sm:pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest"
            style={{ color: ad.palette.accent }}
          >
            Contextual Ad
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold"
            style={{ backgroundColor: ad.palette.soft, color: ad.palette.foreground }}
          >
            Slot {slotNumber}
          </span>
          <span className="text-xs opacity-70">{ad.sponsor}</span>
        </div>
        <h2 className="headline mt-3 text-2xl leading-tight sm:text-3xl">
          {ad.title}
        </h2>
        <p className="mt-3 text-sm leading-6 opacity-80">
          {ad.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {ad.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full border px-2 py-1 text-[length:var(--text-token-4xs)] font-semibold"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.38)",
                borderColor: ad.palette.soft,
                color: ad.palette.foreground,
              }}
            >
              {topic}
            </span>
          ))}
        </div>
        <div
          className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4"
          style={{ borderColor: ad.palette.soft }}
        >
          <Button variant="outline" size="xs" className="bg-background/80">
            {ad.cta}
          </Button>
          <span className="text-xs opacity-70">
            Matched to intent score {score}
          </span>
        </div>
      </div>
    </article>
  );
}

const brandPromotionPriority = [
  "elle",
  "car-and-driver",
  "delish",
  "good-housekeeping",
  "country-living",
  "cosmopolitan",
  "mens-health",
  "esquire",
  "harpers-bazaar",
  "road-and-track",
  "house-beautiful",
  "prevention",
  "seventeen",
  "bicycling",
  "oprah-daily",
  "popular-mechanics",
  "veranda",
  "elle-decor",
];

type BrandPromotionMatch = {
  brand: string;
  brandSlug: string;
  topics: string[];
  stories: LifestyleRiverStory[];
};

function scoreBrandPromotionStory(story: LifestyleRiverStory, activeFilter: string) {
  const topicScore = activeFilter !== "For You" && story.topic === activeFilter ? 120 : 0;
  const popularityScore = story.popularity ?? 0;
  const freshnessScore = Math.max(0, 40 - story.age);

  return topicScore + popularityScore + freshnessScore;
}

function getBrandPromotionForSlot({
  stories,
  fallbackStories,
  activeFilter,
  slotNumber,
  excludedBrandSlug,
}: {
  stories: LifestyleRiverStory[];
  fallbackStories: LifestyleRiverStory[];
  activeFilter: string;
  slotNumber: number;
  excludedBrandSlug?: string;
}): BrandPromotionMatch | null {
  const groups = new Map<string, BrandPromotionMatch>();
  const candidateStories = excludedBrandSlug
    ? fallbackStories.filter((story) => story.brandSlug !== excludedBrandSlug)
    : stories;

  candidateStories.forEach((story) => {
    const existing = groups.get(story.brandSlug);
    if (existing) {
      existing.stories.push(story);
      if (!existing.topics.includes(story.topic)) existing.topics.push(story.topic);
      return;
    }

    groups.set(story.brandSlug, {
      brand: story.brand,
      brandSlug: story.brandSlug,
      topics: [story.topic],
      stories: [story],
    });
  });

  const orderedGroups = Array.from(groups.values())
    .map((group) => {
      const storyPool = [...group.stories, ...fallbackStories.filter((story) => story.brandSlug === group.brandSlug)];
      const selectedStories = storyPool
        .filter((story, index, array) => array.findIndex((candidate) => candidate.id === story.id) === index)
        .sort((a, b) => scoreBrandPromotionStory(b, activeFilter) - scoreBrandPromotionStory(a, activeFilter))
        .slice(0, 4);

      return {
        ...group,
        stories: selectedStories,
        topics: Array.from(new Set(selectedStories.map((story) => story.topic))).slice(0, 4),
      };
    })
    .filter((group) => group.stories.length >= 3)
    .sort((a, b) => {
      const aPriority = brandPromotionPriority.includes(a.brandSlug)
        ? brandPromotionPriority.indexOf(a.brandSlug)
        : brandPromotionPriority.length;
      const bPriority = brandPromotionPriority.includes(b.brandSlug)
        ? brandPromotionPriority.indexOf(b.brandSlug)
        : brandPromotionPriority.length;

      return aPriority - bPriority || a.brand.localeCompare(b.brand);
    });

  if (!orderedGroups.length) return null;

  const promoIndex = Math.max(0, Math.floor(slotNumber / 2) - 1);
  const selectedGroup = orderedGroups[promoIndex % orderedGroups.length];

  return {
    ...selectedGroup,
  };
}

function BrandPromotionRiverModule({
  promotion,
  onOpenStory,
}: {
  promotion: BrandPromotionMatch;
  onOpenStory: (storyId: string) => void;
}) {
  const [featuredStory, ...secondaryStories] = promotion.stories;
  const topicSummary = promotion.topics.slice(0, 3).join(", ");

  if (!featuredStory) return null;

  return (
    <section
      className="min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-label={`Brand spotlight: ${promotion.brand}`}
    >
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <a
              href={getHearstBrandRoute(promotion.brandSlug)}
              className="flex shrink-0 text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={`${promotion.brand} brand page`}
            >
              <BrandLogo
                slug={promotion.brandSlug}
                color="currentColor"
                className="[&_svg]:h-9 [&_svg]:w-auto [&_svg]:max-w-[180px]"
              />
            </a>
            <span className="hidden h-10 w-px shrink-0 bg-border sm:block" aria-hidden />
            <div className="min-w-0">
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                Brand spotlight
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Follow {promotion.brand} for {topicSummary.toLowerCase()} picks and related stories inside this river.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0 p-5 sm:p-6">
        <div>
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Related from {promotion.brand}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Current stories ranked by topic match, freshness, and reader intent.
          </p>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <button
            type="button"
            onClick={() => onOpenStory(featuredStory.id)}
            className="group min-w-0 self-start text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <LifestyleRiverImage story={featuredStory} className="aspect-[4/3] w-full rounded-[8px]" />
            <span className="mt-4 flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              <BrandSourceIcon brand={featuredStory.brand} brandSlug={featuredStory.brandSlug} />
              {getLifestyleKindLabel(getLifestyleCardKind(featuredStory), featuredStory)}
            </span>
            <span className="headline mt-2 block text-2xl leading-tight text-foreground">
              {featuredStory.title}
            </span>
            <span className="mt-2 line-clamp-3 [display:-webkit-box] text-sm leading-6 text-muted-foreground">
              {featuredStory.summary}
            </span>
          </button>

          <div className="divide-y divide-border">
            {secondaryStories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => onOpenStory(story.id)}
                className="group grid w-full grid-cols-[88px_minmax(0,1fr)] gap-4 py-4 text-left first:pt-0 last:pb-0 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:grid-cols-[112px_minmax(0,1fr)]"
              >
                <LifestyleRiverImage story={story} className="aspect-square w-full rounded-[8px]" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                    <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
                    {getLifestyleKindLabel(getLifestyleCardKind(story), story)}
                  </span>
                  <span className="headline mt-1 block text-lg leading-tight text-foreground">
                    {story.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {story.topic} · {getLifestyleByline(story)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getLifestyleCardKind(story: LifestyleRiverStory): LifestyleCardKind {
  const searchable = `${story.topic} ${story.title}`.toLowerCase();

  if (storyHasPlayableVideo(story)) return "video";
  if (story.topic.startsWith("Food")) return "recipe";
  if (isYearMakeModelStory(story)) return "recipe";
  if (/shopping|products|tested|best|buy|sale|deals|favorite|picks/.test(searchable)) return "shopping";
  if (story.topic === "Buying Guides" || story.topic === "Auctions") return "shopping";
  if (/photos|gallery|style|jeans|rooms|decorating|porch|garden|designers|living room|classic|collector|auction/.test(searchable) || story.age % 5 === 0) return "gallery";

  return "article";
}

function storyHasPlayableVideo(story: LifestyleRiverStory) {
  return Boolean(story.videoUrl);
}

function isYearMakeModelStory(story: LifestyleRiverStory) {
  const autosBrandSlugs = new Set([
    "autoweek",
    "bring-a-trailer",
    "car-and-driver",
    "hot-rod",
    "motortrend",
    "road-and-track",
  ]);
  const autosTopics = new Set(["Reviews", "EVs", "Performance", "Buying Guides"]);

  if (!autosBrandSlugs.has(story.brandSlug) && !autosTopics.has(story.topic)) return false;

  return /^(?:19|20)\d{2}\s+[A-Z0-9][A-Za-z0-9-]*(?:\s+[A-Z0-9][A-Za-z0-9-]*){1,6}\b/.test(story.title);
}

function getLifestyleKindLabel(kind: LifestyleCardKind, story?: LifestyleRiverStory) {
  if (story && kind === "recipe" && isYearMakeModelStory(story)) return "Specs";
  if (story && kind === "shopping" && !["Shopping", "Style"].includes(story.topic)) return "Guide";

  const labels = {
    article: "Article",
    gallery: "Gallery",
    video: "Watch",
    recipe: "Recipe",
    shopping: "Shop",
  };

  return labels[kind];
}

function LifestyleKindBadge({
  kind,
  story,
}: {
  kind: LifestyleCardKind;
  story: LifestyleRiverStory;
}) {
  if (kind === "article" || kind === "gallery") return null;

  const label = getLifestyleKindLabel(kind, story);
  const iconClassName = "h-3 w-3 shrink-0";
  const icon = kind === "video"
    ? <Play className={cn(iconClassName, "fill-current")} aria-hidden />
    : label === "Guide"
      ? <ShoppingBag className={iconClassName} aria-hidden />
      : null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hp-chip-border)] bg-[var(--hp-chip)] px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-[var(--hp-text-chip)]">
      {icon}
      {label}
    </span>
  );
}

function LiveStoryBadge({
  story,
  className,
}: {
  story: LifestyleRiverStory;
  className?: string;
}) {
  if (!story.id.startsWith("live-")) return null;

  return (
    <span className="inline-flex shrink-0 items-center" title="Current feed story">
      <span
        className={cn("block h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white", className)}
        aria-hidden="true"
      />
      <span className="sr-only">Current feed story</span>
    </span>
  );
}

function formatLiveFeedUpdatedAt(fetchedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(new Date(fetchedAt));
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
    <section className="mt-4 rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" aria-label="Lifestyle river card models">
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          River Content Models
        </p>
        <h2 className="headline mt-1 text-2xl leading-tight">
          Five card styles share one atomic structure.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          The personalization layer picks the story order. The content model picks the best card treatment for the reader intent,
          so every item still feels like one coherent Hearst destination river.
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

function ContextualAdLogicGuide({
  profile,
  demoState,
  config,
  activeFilter,
  stories,
}: {
  profile: LifestyleRiverProfile;
  demoState: LifestyleDemoState;
  config: DestinationConfig;
  activeFilter: string;
  stories: LifestyleRiverStory[];
}) {
  const firstAdMatch = getContextualAdForSlot({
    destination: config.mode,
    slotIndex: 0,
    profile,
    demoState,
    config,
    activeFilter,
    stories,
  });
  const units = contextualAdsByDestination[config.mode];

  return (
    <section className="mt-4 rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" aria-label="Contextual ad logic">
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Contextual Ad Logic
        </p>
        <h2 className="headline mt-1 text-2xl leading-tight">
          Sponsored units enter the river every five cards.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Ads use the same intent context as the editorial ranking layer: active section, followed topics, saved tags,
          more-like-this behavior, time of day, and the surrounding story cluster. Creative imagery uses a dedicated
          live-feed image set pulled from public Hearst brand feeds and pre-filtered against the river dataset.
        </p>
      </div>

      <div className="grid divide-y divide-border lg:grid-cols-[minmax(0,1fr)_320px] lg:divide-x lg:divide-y-0">
        <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Placement</p>
            <p className="mt-2 text-sm font-bold">After cards 5, 10, 15...</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The first unit appears after the fifth editorial card. Infinite scroll adds more as more story cards load.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Matching inputs</p>
            <p className="mt-2 text-sm font-bold">{activeFilter} · {config.dayparts[demoState.daypart].label}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Followed topics, saved tags, boosted tags, daypart preferences, and nearby story tags all add to the ad score.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Creative source</p>
            <p className="mt-2 text-sm font-bold">Dedicated ad image set</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The ad slot uses a same-topic or same-tag CDN image that is not already in the story river data.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Next matched ad</p>
          {firstAdMatch ? (
            <div className="mt-3 space-y-3">
              <div className="overflow-hidden rounded-[8px] border border-border">
                <div
                  role="img"
                  aria-label={`Ad creative: ${firstAdMatch.ad.title}`}
                  className="aspect-video w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${firstAdMatch.ad.imageUrl}")` }}
                />
                <div className="p-3">
                  <p className="text-sm font-bold leading-5">{firstAdMatch.ad.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {firstAdMatch.ad.sponsor} · score {firstAdMatch.score}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Image source: live Hearst feed image outside the river dataset
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No ad match in this filtered view.</p>
          )}
        </div>
      </div>

      <div className="border-t border-border p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Available {config.productName} ad set</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {units.map((ad) => (
            <div key={ad.id} className="rounded-[8px] border border-border p-3">
              <p className="text-sm font-bold leading-5">{ad.title}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{ad.sponsor}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {ad.topics.slice(0, 2).map((topic) => (
                  <span key={topic} className="rounded-full bg-muted px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
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
    : "aspect-video w-full self-start sm:h-full sm:min-h-44 sm:aspect-auto sm:rounded-[4px]";
  const videoClassName = featured
    ? "aspect-video w-full 2xl:self-center"
    : "aspect-video w-full self-start rounded-[4px]";

  if (kind !== "video") {
    return <LifestyleRiverImage story={story} className={imageClassName} priority={featured} />;
  }

  if (story.videoUrl) {
    if (!playing) {
      return (
        <div
          className={cn("relative min-w-0 overflow-hidden bg-black", videoClassName)}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Image
            src={story.image}
            alt=""
            width={1200}
            height={675}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="h-full w-full object-cover"
            preload={featured}
          />
          <div className="absolute inset-0 bg-black/15" />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onTogglePlaying();
            }}
            className="absolute inset-0 flex items-center justify-center text-white"
            aria-label={`Play video: ${story.title}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 shadow-sm transition-colors hover:bg-black/85">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />
            </span>
          </button>
          {story.videoDuration ? (
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold tabular-nums text-white shadow-sm">
              {formatVideoDuration(story.videoDuration)}
            </span>
          ) : null}
        </div>
      );
    }

    return (
      <div
        className={cn("relative min-w-0 overflow-hidden bg-black", videoClassName)}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <video
          src={story.videoUrl}
          poster={story.image}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="h-full w-full bg-black object-contain"
          aria-label={`Play video: ${story.title}`}
        />
        {story.videoDuration ? (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold tabular-nums text-white shadow-sm">
            {formatVideoDuration(story.videoDuration)}
          </span>
        ) : null}
      </div>
    );
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

function formatVideoDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function LifestyleCardModule({
  story,
  kind,
}: {
  story: LifestyleRiverStory;
  kind: LifestyleCardKind;
}) {
  const recipeMinutes = 20 + ((story.age * 5) % 35);
  const productCount = 5 + (story.age % 8);

  if (kind === "gallery") {
    return null;
  }

  if (kind === "video") {
    return null;
  }

  if (kind === "recipe") {
    if (isYearMakeModelStory(story)) {
      return (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
          <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
            <p className="font-bold">{3 + (story.age % 5)} sec</p>
            <p className="text-muted-foreground">0-60</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
            <p className="font-bold">{240 + ((story.age * 17) % 360)} hp</p>
            <p className="text-muted-foreground">Estimate</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
            <p className="flex items-center justify-center gap-1 font-bold">
              <Star className="h-3.5 w-3.5" aria-hidden />
              Tested
            </p>
            <p className="text-muted-foreground">Signal</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
        <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
          <p className="font-bold">{recipeMinutes} min</p>
          <p className="text-muted-foreground">Total</p>
        </div>
        <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
          <p className="font-bold">{2 + (story.age % 5)}</p>
          <p className="text-muted-foreground">Servings</p>
        </div>
        <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
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

  return null;
}

function LifestyleRiverCard({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  onMoreLikeThis,
  onHide,
  featured = false,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  onHide: () => void;
  featured?: boolean;
}) {
  const kind = getLifestyleCardKind(story);
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const isVideo = kind === "video";

  return (
    <article className={cn(
      "group/card relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50",
      isVideo
        ? "grid"
      : featured
        ? "grid items-stretch 2xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]"
        : "grid gap-0 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4 sm:p-4"
    )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="peer absolute inset-0 z-10 rounded-[8px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
        aria-label={`Open story: ${story.title}`}
      />
      <div className={cn("relative min-w-0", isVideo && "z-20")}>
        <LifestyleRiverMedia
          story={story}
          kind={kind}
          featured={featured}
          playing={videoPlaying}
          onTogglePlaying={() => setVideoPlaying((playing) => !playing)}
        />
      </div>
      <div className={cn(
        "relative min-w-0",
        isVideo ? "p-4 sm:p-5" : featured ? "flex flex-col justify-center p-5 sm:p-6 lg:p-8" : "p-4 sm:p-0"
      )}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {story.signal}
          </span>
          <LifestyleKindBadge kind={kind} story={story} />
          <LifestyleBrandSource story={story} />
        </div>
        <h2 className={cn(
          "headline break-words leading-tight transition-colors group-hover/card:text-primary group-focus-within/card:text-primary",
          featured ? "w-full text-3xl sm:text-[2rem] lg:text-4xl" : "text-xl sm:text-2xl"
        )}>
          {story.title}
        </h2>
        <p className={cn(
          "line-clamp-3 text-muted-foreground",
          featured ? "mt-3 max-w-prose text-base leading-7" : "mt-2 hidden text-sm leading-6 sm:[display:-webkit-box]"
        )}>
          {story.summary}
        </p>
        <LifestyleCardModule story={story} kind={kind} />
        <div className="relative z-20 mt-5 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
          <Button variant={saved ? "default" : "outline"} size="xs" onClick={onSave} aria-pressed={saved}>
            <Bookmark className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="xs" onClick={onMoreLikeThis}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            More like this
          </Button>
          <Button variant="ghost" size="xs" onClick={onOpen}>
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {commentCount}
          </Button>
          <span className="inline-flex items-center gap-1 max-[640px]:hidden">
            <Button variant="ghost" size="xs" onClick={onHide}>
              <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Hide
            </Button>
            <LiveStoryBadge story={story} />
          </span>
        </div>
      </div>
    </article>
  );
}

function VideoPlaySurface({
  story,
  featured = false,
  priority = false,
}: {
  story: LifestyleRiverStory;
  featured?: boolean;
  priority?: boolean;
}) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden bg-black",
        featured ? "aspect-video rounded-t-[8px]" : "aspect-video rounded-[6px]"
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {playing && story.videoUrl ? (
        <video
          src={story.videoUrl}
          poster={story.image}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="h-full w-full bg-black object-contain"
          aria-label={`Play video: ${story.title}`}
        />
      ) : (
        <>
          <Image
            src={story.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="scale-110 object-cover opacity-60 blur-xl"
            aria-hidden
          />
          <Image
            src={story.image}
            alt=""
            width={1200}
            height={675}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="relative z-10 h-full w-full object-contain"
            preload={priority}
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setPlaying(true);
            }}
            className={cn(
              "absolute z-30 inline-flex items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/80 motion-reduce:transition-none",
              featured ? "bottom-5 left-5 h-14 w-14" : "left-3 top-3 h-10 w-10"
            )}
            aria-label={`Play video: ${story.title}`}
          >
            <Play className={cn("ml-0.5 fill-current", featured ? "h-6 w-6" : "h-4 w-4")} aria-hidden />
          </button>
        </>
      )}
      {story.videoDuration ? (
        <span className="pointer-events-none absolute right-3 top-3 z-30 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
          <Clock className="h-3 w-3" aria-hidden />
          {formatVideoDuration(story.videoDuration)}
        </span>
      ) : null}
    </div>
  );
}

function VideoFeedLeadCard({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  variant = "videoIndex",
  eyebrowLabel,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  variant?: "videoIndex" | "hearstPlus";
  eyebrowLabel?: string;
}) {
  const useHearstPlusStyle = variant === "hearstPlus";

  return (
    <article className="group overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
      <VideoPlaySurface story={story} featured priority />
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {eyebrowLabel ?? (useHearstPlusStyle ? "Recommended video" : "Featured video")}
          </span>
          <LifestyleBrandSource story={story} />
          <LiveStoryBadge story={story} />
        </div>
        <button type="button" className="block text-left focus:outline-none focus:ring-2 focus:ring-primary/30" onClick={onOpen}>
          <h1
            className={cn(
              "text-balance",
              useHearstPlusStyle
                ? "headline text-3xl font-bold leading-tight text-[var(--hp-text-headline)] sm:text-4xl"
                : "text-3xl font-black leading-[1.02] tracking-[-0.025em] text-foreground sm:text-4xl"
            )}
          >
            {story.title}
          </h1>
        </button>
        <p
          className={cn(
            "mt-2 line-clamp-2 max-w-3xl text-base leading-7",
            useHearstPlusStyle ? "text-[var(--hp-text-secondary)]" : "text-muted-foreground"
          )}
        >
          {story.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved videos" : "Save video"}
              className={cn("inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0", saved ? "text-primary" : "")}
            >
              <Bookmark className="h-4 w-4" weight={saved ? "fill" : "regular"} aria-hidden />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button type="button" onClick={onOpen} className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0">
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span>{commentCount}</span>
            </button>
          </div>
          <Button variant="outline" size="sm" className="h-11 sm:h-7" onClick={onOpen}>
            Open story
          </Button>
        </div>
      </div>
    </article>
  );
}

function VideoIndexCard({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  onHide,
  variant = "videoIndex",
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onHide: () => void;
  variant?: "videoIndex" | "hearstPlus";
}) {
  const useHearstPlusStyle = variant === "hearstPlus";

  return (
    <article className="group overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50">
      <VideoPlaySurface story={story} featured />
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} className="h-5 w-5" />
          <span className="truncate normal-case tracking-normal text-muted-foreground">
            {story.brand}
            {story.topic ? ` · ${story.topic}` : ""}
          </span>
          <LiveStoryBadge story={story} />
        </div>
        <button type="button" className="block text-left focus:outline-none focus:ring-2 focus:ring-primary/30" onClick={onOpen}>
          <h3
            className={cn(
              "text-balance",
              useHearstPlusStyle
                ? "headline text-2xl font-bold leading-tight text-[var(--hp-text-headline)] sm:text-3xl"
                : "text-3xl font-black leading-[1.02] tracking-[-0.025em] text-foreground sm:text-4xl"
            )}
          >
            {story.title}
          </h3>
        </button>
        <p
          className={cn(
            "mt-2 line-clamp-2 max-w-3xl text-base leading-7",
            useHearstPlusStyle ? "text-[var(--hp-text-secondary)]" : "text-muted-foreground"
          )}
        >
          {story.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved videos" : "Save video"}
              className={cn("inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0", saved ? "text-primary" : "")}
            >
              <Bookmark className="h-4 w-4" weight={saved ? "fill" : "regular"} aria-hidden />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button type="button" onClick={onOpen} className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0">
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span>{commentCount}</span>
            </button>
            <button type="button" onClick={onHide} aria-label="Hide video" className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0">
              <EyeOff className="h-4 w-4" aria-hidden />
              <span>Hide</span>
            </button>
          </div>
          <Button variant="outline" size="sm" className="h-11 sm:h-7" onClick={onOpen}>
            Open story
          </Button>
        </div>
      </div>
    </article>
  );
}

function VideoRailCard({
  story,
  onOpen,
}: {
  story: LifestyleRiverStory;
  onOpen: () => void;
}) {
  return (
    <button type="button" className="grid w-full grid-cols-[96px_minmax(0,1fr)] gap-3 text-left" onClick={onOpen}>
      <span className="relative aspect-video overflow-hidden rounded-[6px] bg-muted">
        <Image src={story.image} alt="" fill sizes="96px" className="object-cover" />
        {story.videoDuration ? (
          <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
            {formatVideoDuration(story.videoDuration)}
          </span>
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">{story.brand}</span>
        <span className="mt-1 line-clamp-3 [display:-webkit-box] text-sm font-bold leading-snug text-foreground">{story.title}</span>
      </span>
    </button>
  );
}

function getPersonalizedLeadSliderStories(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
  count = 5,
  includeCurrentFeed = false
) {
  const selected: LifestyleRiverStory[] = [];
  const usedBrands = new Set<string>();
  const personalizedStories = stories
    .map((story, index) => ({
      story,
      index,
      score: getLifestyleScore(story, profile, demoState, config),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ story }) => story);
  const editorialStories = personalizedStories.filter((story) => !isCurrentFeedStory(story));
  const currentArticleStories = personalizedStories.filter((story) => isCurrentFeedStory(story) && !story.videoUrl);
  const currentVideoStories = personalizedStories.filter((story) => isCurrentFeedStory(story) && Boolean(story.videoUrl));

  const addStories = (candidates: LifestyleRiverStory[]) => {
    for (const story of candidates) {
      if (usedBrands.has(story.brandSlug)) continue;
      selected.push(story);
      usedBrands.add(story.brandSlug);
      if (selected.length === count) return true;
    }

    for (const story of candidates) {
      if (selected.some((item) => item.id === story.id)) continue;
      selected.push(story);
      if (selected.length === count) return true;
    }

    return false;
  };

  if (!includeCurrentFeed) {
    if (addStories(editorialStories.filter((story) => !story.videoUrl))) return selected;
    addStories(currentArticleStories);
    return selected;
  }

  addStories(editorialStories.slice(0, Math.max(0, count - 2)));
  if (selected.length < count) addStories(currentArticleStories.slice(0, 1));
  if (selected.length < count) addStories(currentVideoStories.slice(0, 1));
  if (selected.length < count) {
    addStories([...currentArticleStories, ...currentVideoStories, ...editorialStories]);
  }

  return selected;
}

function LifestyleLeadSlider({
  stories,
  savedIds,
  commentsByStoryId,
  onOpenStory,
  onSave,
  onMoreLikeThis,
  onFollowBrand,
}: {
  stories: LifestyleRiverStory[];
  savedIds: string[];
  commentsByStoryId: Record<string, LifestyleStoryComment[]>;
  onOpenStory: (story: LifestyleRiverStory) => void;
  onSave: (story: LifestyleRiverStory) => void;
  onMoreLikeThis: (story: LifestyleRiverStory) => void;
  onFollowBrand: (brandName: string) => void;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const swipeStartRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeLastRef = React.useRef<{ x: number; y: number } | null>(null);
  const suppressSlideClickRef = React.useRef(false);
  const swipeInstructionsId = React.useId();
  const activeStory = stories[activeIndex] ?? stories[0];
  const storyIdsKey = stories.map((story) => story.id).join("|");

  React.useEffect(() => {
    setActiveIndex(0);
  }, [storyIdsKey]);

  React.useEffect(() => {
    if (paused || prefersReducedMotion || isDragging || stories.length < 2) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % stories.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [isDragging, paused, prefersReducedMotion, stories.length]);

  if (!activeStory) return null;

  const saved = savedIds.includes(activeStory.id);
  const goToPrevious = () => setActiveIndex((index) => (index - 1 + stories.length) % stories.length);
  const goToNext = () => setActiveIndex((index) => (index + 1) % stories.length);
  const resetSwipe = () => {
    swipeStartRef.current = null;
    swipeLastRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (stories.length < 2 || event.button !== 0) return;

    swipeStartRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    swipeLastRef.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    swipeLastRef.current = { x: event.clientX, y: event.clientY };
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaY) >= Math.abs(deltaX)) return;

    if (Math.abs(deltaX) >= 8 && !event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    const maxOffset = event.currentTarget.clientWidth * 0.22;
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    const end = swipeLastRef.current ?? { x: event.clientX, y: event.clientY };
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const elapsed = Math.max(performance.now() - start.time, 1);
    const velocity = Math.abs(deltaX) / elapsed;
    const threshold = Math.min(64, event.currentTarget.clientWidth * 0.14);
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.2
      && (Math.abs(deltaX) >= threshold || (Math.abs(deltaX) >= 24 && velocity >= 0.45));

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (isHorizontalSwipe) {
      suppressSlideClickRef.current = true;
      if (deltaX < 0) goToNext();
      else goToPrevious();
      window.setTimeout(() => {
        suppressSlideClickRef.current = false;
      }, 0);
    }

    resetSwipe();
  };

  return (
    <article
      className="group relative min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      aria-describedby={swipeInstructionsId}
    >
      <p id={swipeInstructionsId} className="sr-only">
        Swipe left or right to move between featured stories.
      </p>
      <div
        className="relative h-[min(128vw,520px)] w-full min-w-0 touch-pan-y select-none overflow-hidden bg-muted sm:h-auto sm:min-h-[430px] sm:aspect-[16/11] lg:min-h-[460px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetSwipe}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={cn(
            "flex h-full ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isDragging ? "transition-none" : "transition-transform duration-500"
          )}
          style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))` }}
        >
          {stories.map((story, index) => {
            const slideCommentCount = getLifestyleCommentCount(story, commentsByStoryId[story.id]?.length ?? 0);

            return (
              <button
                key={story.id}
                type="button"
                className="relative h-full w-full shrink-0 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30"
                onClick={(event) => {
                  if (suppressSlideClickRef.current) {
                    event.preventDefault();
                    return;
                  }
                  onOpenStory(story);
                }}
                aria-label={`Open story: ${story.title}`}
                aria-hidden={index !== activeIndex}
                tabIndex={index === activeIndex ? 0 : -1}
                data-feed-source={isCurrentFeedStory(story) ? "current" : "editorial"}
                data-media-kind={story.videoUrl ? "video" : "article"}
              >
                <LifestyleRiverImage
                  story={story}
                  className="h-full w-full"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} className="h-5 w-5 rounded-[4px] border-border" />
                    <span>{story.brand}</span>
                    {story.videoUrl ? (
                      <>
                        <span aria-hidden>/</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-bold text-white backdrop-blur">
                          <Play className="h-3 w-3 fill-current" aria-hidden />
                          Video{story.videoDuration ? ` · ${formatVideoDuration(story.videoDuration)}` : ""}
                        </span>
                      </>
                    ) : null}
                    <span aria-hidden>/</span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      {slideCommentCount}
                    </span>
                  </div>
                  <h2 className={cn(
                    "headline line-clamp-3 max-w-[min(42rem,100%)] break-words text-balance text-[clamp(2rem,4.5vw,2.75rem)] sm:text-[clamp(2.25rem,3.25vw,3rem)]",
                    story.brandSlug === "road-and-track" ? "leading-[1.12]" : "leading-[1.08]"
                  )}>
                    {story.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                    {story.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-black/45 px-3 py-1 text-sm font-bold text-white backdrop-blur">
            {activeIndex + 1} of {stories.length}
          </span>
          <div
            className="flex items-center gap-1.5"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {stories.length > 1 ? (
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:h-7 sm:w-7"
                onClick={goToPrevious}
                aria-label="Previous featured story"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:h-7 sm:w-7"
              aria-label={prefersReducedMotion ? "Automatic rotation disabled because reduced motion is enabled" : paused ? "Resume slider" : "Pause slider"}
              onClick={() => setPaused((value) => !value)}
              disabled={prefersReducedMotion}
            >
              {paused || prefersReducedMotion ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            </button>
            {stories.length > 1 ? (
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:h-7 sm:w-7"
                onClick={goToNext}
                aria-label="Next featured story"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-[var(--hp-surface)] px-4 py-3">
        <div className="flex min-w-0 flex-wrap gap-1.5" aria-label="Featured story slides">
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-muted/60 sm:h-6 sm:w-auto"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show story ${index + 1}: ${story.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full transition-all motion-reduce:transition-none",
                  index === activeIndex ? "w-8 bg-primary" : "w-4 bg-muted-foreground/30"
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant={saved ? "default" : "outline"}
            size="xs"
            className="h-11 sm:h-6"
            onClick={() => onSave(activeStory)}
            aria-pressed={saved}
          >
            <Bookmark className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="xs" className="h-11 sm:h-6" onClick={() => onMoreLikeThis(activeStory)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            More like this
          </Button>
          <span className="inline-flex items-center gap-1">
            <Button variant="ghost" size="xs" className="h-11 sm:h-6" onClick={() => onFollowBrand(activeStory.brand)}>
              Follow {activeStory.brand}
            </Button>
            <LiveStoryBadge story={activeStory} />
          </span>
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
    `The reader view keeps the session moving: open a story from the river, keep reading, and let the next ranked story load into the same flow.`,
  ];
}

type LiveArticleLoadState =
  | { status: "loading" }
  | { status: "ready"; data: LiveArticleData }
  | { status: "error" };

type FullscreenReaderImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

type FullscreenGalleryState = {
  story: LifestyleRiverStory;
  images: FullscreenReaderImage[];
  initialIndex: number;
};

function getFullscreenReaderImages(
  story: LifestyleRiverStory,
  liveArticle?: LiveArticleLoadState
) {
  const images: FullscreenReaderImage[] = [{
    src: story.image,
    alt: `${story.brand}: ${story.title}`,
  }];

  if (liveArticle?.status === "ready") {
    liveArticle.data.blocks.forEach((block) => {
      if (block.type !== "image" || images.some((image) => image.src === block.url)) return;
      images.push({
        src: block.url,
        alt: block.alt,
        caption: block.caption,
        credit: block.credit,
      });
    });
  }

  return images;
}

function FullscreenImageViewer({
  gallery,
  saved,
  onClose,
  onSave,
  onMoreLikeThis,
}: {
  gallery: FullscreenGalleryState;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(gallery.initialIndex);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const [captionOpen, setCaptionOpen] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [imageVisible, setImageVisible] = React.useState(true);
  const controlsTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerPositionsRef = React.useRef(new Map<number, { x: number; y: number }>());
  const dragStartRef = React.useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const pinchStartRef = React.useRef<{ distance: number; zoom: number } | null>(null);
  const activeImage = gallery.images[activeIndex] ?? gallery.images[0];
  const hasMultipleImages = gallery.images.length > 1;

  const resetTransform = React.useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const selectImage = React.useCallback((nextIndex: number) => {
    const normalizedIndex = (nextIndex + gallery.images.length) % gallery.images.length;
    if (normalizedIndex === activeIndex) return;
    if (prefersReducedMotion) {
      setActiveIndex(normalizedIndex);
      resetTransform();
      setImageVisible(true);
      return;
    }
    setImageVisible(false);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setActiveIndex(normalizedIndex);
      resetTransform();
      window.requestAnimationFrame(() => setImageVisible(true));
    }, 180);
  }, [activeIndex, gallery.images.length, prefersReducedMotion, resetTransform]);

  const showControls = React.useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (!captionOpen) setControlsVisible(false);
    }, 2800);
  }, [captionOpen]);

  const setClampedZoom = React.useCallback((nextZoom: number) => {
    const clampedZoom = Math.min(4, Math.max(1, nextZoom));
    setZoom(clampedZoom);
    if (clampedZoom === 1) setOffset({ x: 0, y: 0 });
  }, []);

  React.useEffect(() => {
    if (!playing) showControls();
  }, [activeIndex, playing, showControls]);

  React.useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!playing || prefersReducedMotion || !hasMultipleImages) return;
    const intervalId = window.setInterval(() => selectImage(activeIndex + 1), 6500);
    return () => window.clearInterval(intervalId);
  }, [activeIndex, hasMultipleImages, playing, prefersReducedMotion, selectImage]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && hasMultipleImages) selectImage(activeIndex - 1);
      if (event.key === "ArrowRight" && hasMultipleImages) selectImage(activeIndex + 1);
      if (event.key === "+" || event.key === "=") setClampedZoom(zoom + 0.35);
      if (event.key === "-") setClampedZoom(zoom - 0.35);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, hasMultipleImages, onClose, selectImage, setClampedZoom, zoom]);

  const getPointerDistance = () => {
    const points = Array.from(pointerPositionsRef.current.values());
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerPositionsRef.current.size === 1) {
      dragStartRef.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
    } else if (pointerPositionsRef.current.size === 2) {
      pinchStartRef.current = { distance: getPointerDistance(), zoom };
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!pointerPositionsRef.current.has(event.pointerId)) return;
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerPositionsRef.current.size === 2 && pinchStartRef.current) {
      const ratio = getPointerDistance() / Math.max(1, pinchStartRef.current.distance);
      setClampedZoom(pinchStartRef.current.zoom * ratio);
      return;
    }
    if (zoom > 1 && dragStartRef.current) {
      setOffset({
        x: dragStartRef.current.offsetX + event.clientX - dragStartRef.current.x,
        y: dragStartRef.current.offsetY + event.clientY - dragStartRef.current.y,
      });
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    const dragStart = dragStartRef.current;
    if (pointerPositionsRef.current.size === 1 && zoom === 1 && dragStart && hasMultipleImages) {
      const distanceX = event.clientX - dragStart.x;
      if (Math.abs(distanceX) > 70) selectImage(activeIndex + (distanceX < 0 ? 1 : -1));
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) dragStartRef.current = null;
  };

  const chromeVisible = controlsVisible || captionOpen;
  const controlButtonClass = "inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-black/35 px-3 text-sm font-semibold text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-black/55 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70";

  return createPortal(
    <div
      className="fixed inset-0 z-[240] flex touch-none items-center justify-center overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen gallery for ${gallery.story.title}`}
      onMouseMove={showControls}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Image
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        sizes="100vw"
        preload
        className={cn(
          "select-none object-contain transition-opacity duration-700 ease-out motion-reduce:transition-none",
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : hasMultipleImages ? "cursor-ew-resize" : "cursor-zoom-in",
          imageVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}
        draggable={false}
        onDoubleClick={() => setClampedZoom(zoom > 1 ? 1 : 2.5)}
        onWheel={(event) => {
          event.preventDefault();
          setClampedZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div className={cn("pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-3 transition-opacity duration-300 motion-reduce:transition-none", chromeVisible ? "opacity-100" : "opacity-0")}>
        <div className="pointer-events-auto inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-black/35 px-3 text-sm font-semibold text-white/80 ring-1 ring-inset ring-white/15">
          {activeIndex + 1} of {gallery.images.length}
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <button type="button" className={cn(controlButtonClass, "max-sm:px-0")} onClick={onSave} aria-pressed={saved} aria-label={saved ? "Remove saved story" : "Save story"}>
            <Bookmark className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
            <span className="max-sm:sr-only">{saved ? "Saved" : "Save story"}</span>
          </button>
          <button type="button" className={cn(controlButtonClass, "max-sm:px-0")} onClick={onMoreLikeThis} aria-label="More like this">
            <Plus className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
            <span className="max-sm:sr-only">More like this</span>
          </button>
          <button type="button" className={controlButtonClass} onClick={() => setClampedZoom(zoom - 0.35)} aria-label="Zoom out">−</button>
          <button type="button" className={controlButtonClass} onClick={() => setClampedZoom(zoom + 0.35)} aria-label="Zoom in">+</button>
          {hasMultipleImages ? (
            <button type="button" className={controlButtonClass} onClick={() => {
              setPlaying((value) => !value);
            }} aria-label={prefersReducedMotion ? "Slideshow disabled because reduced motion is enabled" : playing ? "Pause slideshow" : "Play slideshow"} aria-pressed={playing} disabled={prefersReducedMotion}>
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
          ) : null}
          {activeImage.caption || activeImage.credit ? (
            <button type="button" className={controlButtonClass} onClick={() => setCaptionOpen((value) => !value)} aria-label="Show caption and credit" aria-expanded={captionOpen}>
              <Info className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" className={controlButtonClass} onClick={onClose} aria-label="Close fullscreen gallery" autoFocus>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {hasMultipleImages ? (
        <>
          <button type="button" className={cn(controlButtonClass, "absolute left-4 top-1/2 -translate-y-1/2 px-0 transition-opacity duration-300 motion-reduce:transition-none", chromeVisible ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => selectImage(activeIndex - 1)} aria-label="Previous photo">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className={cn(controlButtonClass, "absolute right-4 top-1/2 -translate-y-1/2 px-0 transition-opacity duration-300 motion-reduce:transition-none", chromeVisible ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => selectImage(activeIndex + 1)} aria-label="Next photo">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className={cn("pointer-events-none absolute inset-x-4 bottom-4 flex flex-col items-center gap-3 transition-opacity duration-300 motion-reduce:transition-none", chromeVisible ? "opacity-100" : "opacity-0")}>
        {captionOpen && (activeImage.caption || activeImage.credit) ? (
          <div className="pointer-events-auto w-full max-w-3xl bg-black/55 px-4 py-3 text-center text-sm leading-6 text-white/85 backdrop-blur-sm">
            {activeImage.caption ? <p>{activeImage.caption}</p> : null}
            {activeImage.credit ? <p className="mt-1 text-xs text-white/60">Photo: {activeImage.credit}</p> : null}
          </div>
        ) : null}
        {hasMultipleImages ? (
          <div className="pointer-events-auto flex max-w-full gap-2 overflow-x-auto rounded-[8px] bg-black/35 p-2 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={cn("relative h-12 w-16 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-inset transition-opacity motion-reduce:transition-none", index === activeIndex ? "ring-white opacity-100" : "ring-white/20 opacity-55 hover:opacity-90")}
                onClick={() => selectImage(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

function LifestyleReaderActions({
  story,
  saved,
  followed,
  commentCount,
  onSave,
  onToggleFollowBrand,
  ambientReaderState,
  onOpenAmbientReader,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  followed: boolean;
  commentCount: number;
  onSave: () => void;
  onToggleFollowBrand: () => void;
  ambientReaderState?: "loading" | "ready" | "unavailable";
  onOpenAmbientReader?: () => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const byline = getLifestyleByline(story);
  const storyDestination = getStoryDestinationMode(story.brandSlug);
  const destinationTheme = themeOptions.find(
    (theme) => theme.slug === destinationConfigs[storyDestination].brandSlug
  );
  const publicationTheme = destinationTheme
    ? getSelectedBrandTheme(
        { name: story.brand, slug: story.brandSlug },
        destinationTheme
      ) ?? destinationTheme
    : undefined;
  const followBadgeBackground = publicationTheme?.colors["1"] ?? "#242D39";
  const followBadgeForeground = getAmbientBrandForeground(followBadgeBackground);

  return (
    <div className="my-6 min-w-0 border-y border-border py-3">
      <div className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-5">
        <button
          type="button"
          onClick={onToggleFollowBrand}
          aria-pressed={followed}
          aria-label={followed ? `Unfollow ${story.brand} brand` : `Follow ${story.brand} brand`}
          title={followed ? `Unfollow ${story.brand} brand` : `Follow ${story.brand} brand`}
          className="inline-flex min-h-11 min-w-0 flex-1 items-center gap-1.5 rounded-[4px] text-[length:var(--text-token-4xs)] text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:min-h-0"
        >
          <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
          <span className="min-w-0 truncate">
            {story.brand} · {story.topic} · {byline}
          </span>
          <span
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors"
            style={{
              backgroundColor: followBadgeBackground,
              borderColor: followBadgeBackground,
              color: followBadgeForeground,
            }}
          >
            {followed ? <Check className="h-3 w-3" aria-hidden /> : <Plus className="h-3 w-3" aria-hidden />}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {ambientReaderState ? (
            <button
              type="button"
              onClick={onOpenAmbientReader}
              disabled={ambientReaderState !== "ready"}
              aria-keyshortcuts="P"
              aria-label={ambientReaderState === "ready"
                ? "Open premium reading experience. Shortcut P"
                : ambientReaderState === "loading"
                  ? "Preparing premium reading experience"
                  : "Premium reading experience unavailable for this story"}
              title={ambientReaderState === "ready"
                ? "Premium reading experience · Shortcut P"
                : ambientReaderState === "loading"
                  ? "Preparing premium reader…"
                  : "Premium reader unavailable"}
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center border-0 bg-transparent p-0 shadow-none outline-none ring-0 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-7 sm:w-7",
                ambientReaderState === "ready"
                  ? "text-muted-foreground hover:text-primary"
                  : "cursor-wait text-muted-foreground opacity-65"
              )}
            >
              <BookOpenText
                className={cn("h-4 w-4", ambientReaderState === "loading" && "animate-pulse")}
                weight="regular"
                aria-hidden
              />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved stories" : "Save story"}
            title={saved ? "Remove from saved stories" : "Save story"}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center border-0 bg-transparent p-0 shadow-none outline-none ring-0 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:h-7 sm:w-7",
              saved ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Bookmark className="h-4 w-4" weight={saved ? "fill" : "regular"} aria-hidden />
          </button>
          <a
            href={`#reader-comments-${story.id}`}
            aria-label={`Jump to ${commentCount} comments`}
            title={`${commentCount} comments`}
            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-7 sm:min-w-0"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span className="tabular-nums">{commentCount}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

type AmbientReaderDensity = "compact" | "comfortable" | "airy";

function isCompleteAmbientArticle(liveArticle?: LiveArticleLoadState) {
  return liveArticle?.status === "ready"
    && liveArticle.data.blocks.filter((block) => block.type !== "image").length >= 4;
}

function getAmbientReaderState(
  story: LifestyleRiverStory,
  liveArticle?: LiveArticleLoadState
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

function getAmbientBrandForeground(background: string) {
  if (!/^#[\da-f]{6}$/i.test(background)) return "#FFFFFF";
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(background.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast >= whiteContrast ? "#111111" : "#FFFFFF";
}

function AmbientArticleReader({
  story,
  article,
  onClose,
  onOpenImage,
}: {
  story: LifestyleRiverStory;
  article: LiveArticleData;
  onClose: () => void;
  onOpenImage: (image: FullscreenReaderImage) => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const [colorMode, setColorMode] = React.useState<"light" | "dark">("light");
  const [density, setDensity] = React.useState<AmbientReaderDensity>("airy");
  const [progress, setProgress] = React.useState(0);
  const destination = getStoryDestinationMode(story.brandSlug);
  const destinationTheme = themeOptions.find(
    (theme) => theme.slug === destinationConfigs[destination].brandSlug
  ) ?? themeOptions[0];
  const contextualTheme = getSelectedBrandTheme(
    { name: story.brand, slug: story.brandSlug },
    destinationTheme
  ) ?? destinationTheme;
  const themeCssVars = {
    ...brandToCssVars(contextualTheme, colorMode),
    "--ambient-paper": colorMode === "dark" ? "#151719" : "#F7F7F5",
    "--ambient-ink": colorMode === "dark" ? "#F2F2EE" : "#171717",
    "--ambient-muted": colorMode === "dark" ? "#A7AAA8" : "#5D5D59",
    "--ambient-rule": colorMode === "dark" ? "#333638" : "#D7D7D2",
  } as React.CSSProperties;
  const readMinutes = getAmbientReaderMinutes(story, article);
  const brandPrimary = contextualTheme.colors["1"] ?? "#242D39";
  const brandForeground = getAmbientBrandForeground(brandPrimary);
  const firstParagraphIndex = article.blocks.findIndex((block) => block.type === "paragraph");
  const densityStyles: Record<AmbientReaderDensity, string> = {
    compact: "max-w-[68ch] text-[17px] leading-7 [--ambient-block-gap:1.25rem]",
    comfortable: "max-w-[62ch] text-[19px] leading-8 [--ambient-block-gap:1.75rem]",
    airy: "max-w-[58ch] text-[21px] leading-9 [--ambient-block-gap:2.25rem]",
  };
  const densityOrder: AmbientReaderDensity[] = ["compact", "comfortable", "airy"];

  const updateProgress = React.useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight;
    setProgress(scrollableHeight > 0 ? Math.min(100, (scroller.scrollTop / scrollableHeight) * 100) : 100);
  }, []);

  React.useEffect(() => {
    updateProgress();
  }, [density, updateProgress]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
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
      <div
        ref={scrollRef}
        className="h-[100dvh] overflow-y-auto overscroll-contain bg-[var(--ambient-paper)]"
        onScroll={updateProgress}
      >
        <header className="sticky top-0 z-50 border-b border-[var(--ambient-rule)] bg-[var(--ambient-paper)]/95 backdrop-blur-sm">
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--ambient-rule)]" aria-hidden>
            <div className="h-full bg-primary transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
          <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-10">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-6 max-w-[180px] sm:h-7">
                <BrandLogo
                  slug={story.brandSlug}
                  color={colorMode === "dark" ? "#F2F2EE" : undefined}
                  className="flex h-full items-center [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
                />
              </div>
              <span className="hidden truncate text-xs font-semibold text-[var(--ambient-muted)] md:inline">
                Ambient Reader
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDensity((current) => densityOrder[(densityOrder.indexOf(current) + 1) % densityOrder.length])}
              className="inline-flex min-h-11 items-center gap-2 px-2 text-xs font-semibold capitalize text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
          <section className="grid min-h-[70vh] lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
            <div
              className="flex flex-col justify-end px-6 py-12 sm:px-10 sm:py-16 lg:px-[clamp(3rem,6vw,7rem)] lg:py-20"
              style={{ backgroundColor: brandPrimary, color: brandForeground }}
            >
              <div className="max-w-3xl">
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] opacity-80">
                  {story.topic} · {story.brand}
                </p>
                <h1 className="font-headline text-[clamp(2.6rem,3.7vw,4.75rem)] font-[var(--font-headline-weight)] leading-[1.08] tracking-[-0.03em] text-balance">
                  {story.title}
                </h1>
                <p className="mt-7 max-w-xl font-brand-secondary text-xl leading-8 opacity-90 sm:text-2xl">
                  {story.summary}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-current/25 pt-5 text-xs font-semibold uppercase tracking-[0.12em] opacity-85">
                  <span>{getLifestyleByline(story)}</span>
                  <span aria-hidden>·</span>
                  <span>{readMinutes} min read</span>
                </div>
              </div>
            </div>
            <figure className="relative min-h-[42vh] overflow-hidden bg-black lg:min-h-[70vh]">
              <Image
                src={story.image}
                alt={story.title}
                fill
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
                priority
              />
              {story.imageCredit ? (
                <figcaption className="absolute bottom-3 right-4 bg-black/65 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
                  {story.imageCredit}
                </figcaption>
              ) : null}
            </figure>
          </section>

          <section className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
            <div className="pointer-events-none absolute left-8 top-28 hidden text-xs font-semibold tabular-nums text-[var(--ambient-muted)] xl:block">
              01
              <span className="mt-3 block h-px w-8 bg-[var(--ambient-rule)]" />
            </div>
            <article className={cn("mx-auto font-brand-secondary text-[var(--ambient-ink)]", densityStyles[density])}>
              <div className="space-y-[var(--ambient-block-gap)]">
                {article.blocks.map((block, index) => {
                  if (block.type === "image") {
                    return (
                      <figure key={`${block.url}-${index}`} className="py-4 sm:py-7">
                        <button
                          type="button"
                          className="group block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                            width={1200}
                            height={800}
                            sizes="(max-width: 768px) 100vw, 900px"
                            className="max-h-[780px] w-full bg-[var(--ambient-rule)] object-cover transition-opacity group-hover:opacity-95"
                          />
                        </button>
                        {block.caption || block.credit ? (
                          <figcaption className="mt-3 font-brand text-xs leading-5 text-[var(--ambient-muted)]">
                            {[block.caption, block.credit].filter(Boolean).join(" · ")}
                          </figcaption>
                        ) : null}
                      </figure>
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
              <footer className="mt-20 border-t border-[var(--ambient-rule)] pt-8 font-brand text-sm text-[var(--ambient-muted)]">
                <p>End of article · {story.brand}</p>
              </footer>
            </article>
          </section>
        </main>
      </div>
    </div>,
    document.body
  );
}

function LifestyleReaderBody({
  story,
  liveArticle,
  onOpenImage,
}: {
  story: LifestyleRiverStory;
  liveArticle?: LiveArticleLoadState;
  onOpenImage: (image: FullscreenReaderImage) => void;
}) {
  if (story.videoUrl) {
    return (
      <div className="mt-6 space-y-4 text-[18px] leading-8 text-foreground/85">
        <p>{story.summary}</p>
        <p className="border-t border-border pt-4 text-sm font-semibold text-muted-foreground">
          Hearst video{story.videoDuration ? ` · ${formatVideoDuration(story.videoDuration)}` : ""}
        </p>
      </div>
    );
  }

  if (story.sourceUrl && (!liveArticle || liveArticle.status === "loading")) {
    return (
      <div className="mt-6 space-y-3" aria-live="polite">
        <p className="text-sm font-semibold text-muted-foreground">Loading the full article and photos...</p>
        <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

  if (liveArticle?.status === "ready") {
    return (
      <div className="mt-6 space-y-7 text-[18px] leading-8 text-foreground/85">
        {liveArticle.data.blocks.map((block, index) => {
          let content: React.ReactNode;

          if (block.type === "image") {
            content = (
              <figure key={`${block.url}-${index}`} className="py-2">
                <button
                  type="button"
                  className="group block w-full cursor-zoom-in rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="max-h-[720px] w-full rounded-[4px] object-cover transition-opacity group-hover:opacity-95"
                  />
                </button>
                {block.caption || block.credit ? (
                  <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
                    {[block.caption, block.credit].filter(Boolean).join(" · ")}
                  </figcaption>
                ) : null}
              </figure>
            );
          } else if (block.type === "heading") {
            content = <h3 className="headline !mb-3 pt-3 text-2xl leading-tight text-foreground sm:text-3xl">{block.text}</h3>;
          } else if (block.type === "quote") {
            content = <blockquote className="border-y border-border py-5 font-brand-secondary text-xl leading-8 text-foreground">{block.text}</blockquote>;
          } else if (block.type === "list") {
            content = <ul className="list-disc space-y-2 pl-6">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
          } else {
            content = <p>{block.text}</p>;
          }

          return <React.Fragment key={`reader-block-${index}`}>{content}</React.Fragment>;
        })}
      </div>
    );
  }

  if (story.sourceUrl && liveArticle?.status === "error") {
    return (
      <div className="mt-6 rounded-[8px] border border-border bg-muted/25 p-5" role="status">
        <p className="font-bold text-foreground">This complete article could not be loaded.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Try reopening the story to refresh the executive POC reader.
        </p>
      </div>
    );
  }

  const readerParagraphs = getLifestyleReaderParagraphs(story);

  return (
    <div className="mt-6 space-y-5 text-base leading-8 text-foreground/80">
      {readerParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  );
}

function getLifestyleCommentCount(story: LifestyleRiverStory, addedCount = 0) {
  return Math.max(3, Math.round(story.popularity / 7) + (story.age % 9) + addedCount);
}

function getLifestyleSeedComments(story: LifestyleRiverStory): LifestyleStoryComment[] {
  const kind = getLifestyleCardKind(story);
  const topic = story.topic.toLowerCase();
  const tag = story.tags[0] ?? topic;
  const authors = [
    ["Maya Chen", "saved this"],
    ["Jordan Ellis", "follows this topic"],
    ["Priya Shah", "regular reader"],
    ["Andre Miles", "collection builder"],
    ["Nora Patel", "morning reader"],
  ] as const;
  const offset = story.title.length % authors.length;
  const templates: Record<LifestyleCardKind, string[]> = {
    article: [
      `This is the kind of ${topic} context I want in the morning brief.`,
      `Helpful framing. I would read a follow-up with the practical next steps.`,
      `The ${story.brand} angle is why this feels worth saving instead of skimming.`,
    ],
    gallery: [
      `The image selection is doing a lot of the work here. Saving this for reference.`,
      `This belongs in a collection. I want more visual examples around ${tag}.`,
      `Good inspiration piece, especially if the next story keeps the same mood.`,
    ],
    recipe: [
      `I would make this if the prep list stays simple.`,
      `The ${topic} signal is right. I want the shopping list next to the recipe.`,
      `Saving this for the weekend. The short read time helps.`,
    ],
    shopping: [
      `Useful if the picks stay edited down. I do not need a giant list.`,
      `I would compare this with a tested option before buying.`,
      `The brand attribution helps here. I want to know who chose the picks.`,
    ],
    video: [
      `This is a good quick-watch candidate before opening the full story.`,
      `I would keep this in the queue if the clip starts with the main point.`,
      `The topic match is strong, but I still want a written recap below it.`,
    ],
  };

  return templates[kind].map((body, index) => {
    const [author, role] = authors[(offset + index) % authors.length];
    return {
      id: `${story.id}-seed-comment-${index}`,
      author,
      role,
      body,
      age: `${index + 1}h ago`,
      likes: 2 + ((story.popularity + story.age + index) % 18),
    };
  });
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

function scoreLifestyleRelatedStory(currentStory: LifestyleRiverStory, story: LifestyleRiverStory) {
  const sharedTagCount = story.tags.filter((tag) => currentStory.tags.includes(tag)).length;
  const sameTopicScore = story.topic === currentStory.topic ? 80 : 0;
  const sameBrandScore = story.brand === currentStory.brand ? 34 : 0;
  const sharedTagScore = sharedTagCount * 14;
  const signalScore = story.signal === currentStory.signal ? 6 : 0;
  const popularityScore = Math.round(story.popularity / 8);
  const freshnessScore = Math.max(0, 10 - story.age);

  return sameTopicScore + sameBrandScore + sharedTagScore + signalScore + popularityScore + freshnessScore;
}

function getLifestyleArticleRecommendations(currentStory: LifestyleRiverStory, stories: LifestyleRiverStory[]) {
  const otherStories = stories.filter((story) => story.id !== currentStory.id);
  const exactTopicStories = otherStories
    .filter((story) => story.topic === currentStory.topic)
    .sort((a, b) => scoreLifestyleRelatedStory(currentStory, b) - scoreLifestyleRelatedStory(currentStory, a));
  const scoredStories = otherStories
    .map((story) => ({
      story,
      score: scoreLifestyleRelatedStory(currentStory, story),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ story }) => story);
  const relatedStories = [...exactTopicStories, ...scoredStories].filter(
    (story, index, array) => array.findIndex((candidate) => candidate.id === story.id) === index
  );

  return relatedStories.slice(0, 4);
}

function LifestyleStoryComments({
  story,
  comments,
  onAddComment,
}: {
  story: LifestyleRiverStory;
  comments: LifestyleStoryComment[];
  onAddComment: (body: string) => void;
}) {
  const [draft, setDraft] = React.useState("");
  const seededComments = React.useMemo(() => getLifestyleSeedComments(story), [story]);
  const visibleComments = [...comments, ...seededComments].slice(0, 5);
  const totalCount = getLifestyleCommentCount(story, comments.length);

  React.useEffect(() => {
    setDraft("");
  }, [story.id]);

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    onAddComment(trimmed);
    setDraft("");
  };

  return (
    <section
      id={`reader-comments-${story.id}`}
      className="mt-8 scroll-mt-32 rounded-[8px] border border-border bg-muted/25 p-4 sm:p-5"
      aria-label={`Comments for ${story.title}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold">
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden />
            Comments
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{totalCount}</span>
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Reader notes from people following {story.topic.toLowerCase()} and {story.brand}.
          </p>
        </div>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          Top comments
        </span>
      </div>

      <form onSubmit={submitComment} className="mt-4 flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          You
        </div>
        <div className="min-w-0 flex-1">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Add a comment"
            className="min-h-20 w-full resize-y rounded-[8px] border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Keep comments useful and tied to the story.</p>
            <Button size="xs" type="submit" disabled={!draft.trim()}>
              <Send className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Post
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-5 space-y-4">
        {visibleComments.map((comment) => (
          <article key={comment.id} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-xs font-bold text-primary ring-1 ring-border">
              {comment.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-bold">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{comment.role} · {comment.age}</p>
              </div>
              <p className="mt-1 text-sm leading-6 text-foreground/85">{comment.body}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                <button type="button" className="inline-flex items-center gap-1 hover:text-primary">
                  <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                  {comment.likes}
                </button>
                <button type="button" className="hover:text-primary">Reply</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LifestyleArticleRecommendationsModule({
  currentStory,
  stories,
  productName,
  onOpenStory,
}: {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  productName: string;
  onOpenStory: (storyId: string) => void;
}) {
  const recommendations = getLifestyleArticleRecommendations(currentStory, stories);
  const [featuredStory, ...secondaryStories] = recommendations;

  if (!featuredStory) return null;

  return (
    <section className="mt-8 border-t border-border py-6" aria-label={`More in ${currentStory.topic}`}>
      <div className="mb-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          More in {currentStory.topic}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Related picks from {productName}, ranked from this article&apos;s topic, brand, tags, freshness, and reader intent.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => onOpenStory(featuredStory.id)}
          className="group min-w-0 self-start text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <LifestyleRiverImage story={featuredStory} className="aspect-[4/3] w-full rounded-[8px]" />
          <span className="mt-4 flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            <BrandSourceIcon brand={featuredStory.brand} brandSlug={featuredStory.brandSlug} />
            {featuredStory.brand}
          </span>
          <span className="mt-2 block font-brand-secondary text-2xl font-bold leading-tight text-foreground group-hover:text-primary">
            {featuredStory.title}
          </span>
          <span className="mt-2 line-clamp-3 [display:-webkit-box] text-sm leading-6 text-muted-foreground">
            {featuredStory.summary}
          </span>
        </button>

        <div className="divide-y divide-border">
          {secondaryStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => onOpenStory(story.id)}
              className="group grid w-full grid-cols-[96px_minmax(0,1fr)] gap-4 py-4 text-left first:pt-0 last:pb-0 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:grid-cols-[128px_minmax(0,1fr)]"
            >
              <LifestyleRiverImage story={story} className="aspect-square w-full rounded-[8px]" />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                  <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
                  {getLifestyleKindLabel(getLifestyleCardKind(story), story)}
                </span>
                <span className="mt-1 block text-base font-bold leading-snug text-foreground group-hover:text-primary">
                  {story.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {story.brand} · {story.topic} · {getLifestyleByline(story)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
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
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {modules.map((module) => (
          <div key={module.label} className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
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
                    <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
                    {getLifestyleKindLabel(getLifestyleCardKind(story), story)}
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

        <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
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
      </div>
    </aside>
  );
}

function getLifestyleReaderAd(currentStory: LifestyleRiverStory, slotIndex = 0) {
  const rankedAds = contextualAdsByDestination.all
    .map((ad) => {
      const topicScore = ad.topics.includes(currentStory.topic) ? 40 : 0;
      const tagScore = ad.tags.filter((tag) => currentStory.tags.includes(tag)).length * 18;
      const brandKeyword = currentStory.brand.toLowerCase().split(" ")[0] ?? "";
      const brandSignalScore = brandKeyword && ad.sponsor.toLowerCase().includes(brandKeyword) ? 28 : 0;

      return {
        ad,
        score: topicScore + tagScore + brandSignalScore,
      };
    })
    .sort((a, b) => b.score - a.score || a.ad.id.localeCompare(b.ad.id));

  return rankedAds[slotIndex % rankedAds.length]?.ad ?? rankedAds[0]?.ad ?? contextualAdsByDestination.all[0];
}

function LifestyleReaderSidebarAd({ currentStory, slotIndex = 0 }: { currentStory: LifestyleRiverStory; slotIndex?: number }) {
  const ad = getLifestyleReaderAd(currentStory, slotIndex);

  if (!ad) return null;

  return (
    <aside className="hidden lg:block" aria-label="Advertisement">
      <div
        className="sticky top-32 flex h-[600px] max-h-[calc(100dvh-10rem)] w-[300px] flex-col overflow-hidden rounded-[8px] border border-border bg-background"
        style={{ backgroundColor: ad.palette.background, color: ad.palette.foreground }}
      >
        <div className="relative h-[268px] overflow-hidden border-b border-black/10">
          <Image
            src={ad.imageUrl}
            alt={`${ad.sponsor}: ${ad.title}`}
            width={600}
            height={536}
            sizes="300px"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 to-black/45" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white">
            <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-[0.24em]">
              Advertisement
            </span>
            <span className="rounded-full border border-white/50 bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
              {ad.creativeLabel}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">{ad.sponsor}</p>
            <p className="mt-1 font-brand-secondary text-3xl font-bold leading-none text-white">
              {ad.title}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <p className="text-sm leading-6" style={{ color: ad.palette.foreground }}>
              {ad.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {ad.topics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                  style={{ borderColor: ad.palette.soft, backgroundColor: ad.palette.soft, color: ad.palette.foreground }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              className="w-full rounded-full px-4 py-3 text-center text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:translate-y-0"
              style={{ backgroundColor: ad.palette.accent, color: "#fff" }}
            >
              {ad.cta}
            </button>
            <p className="text-center text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest" style={{ color: ad.palette.foreground }}>
              Matched to {currentStory.topic} intent
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function LifestyleStoryReaderModal({
  stories,
  availableStories,
  openStoryId,
  savedIds,
  followedBrands,
  commentsByStoryId,
  readerReturnHref,
  onClose,
  onOpenStory,
  onSave,
  onMoreLikeThis,
  onToggleFollowBrand,
  onAddComment,
}: {
  stories: LifestyleRiverStory[];
  availableStories: LifestyleRiverStory[];
  openStoryId: string | null;
  savedIds: string[];
  followedBrands: string[];
  commentsByStoryId: Record<string, LifestyleStoryComment[]>;
  readerReturnHref?: string;
  onClose: () => void;
  onOpenStory: (storyId: string) => void;
  onSave: (story: LifestyleRiverStory) => void;
  onMoreLikeThis: (story: LifestyleRiverStory) => void;
  onToggleFollowBrand: (brandName: string) => void;
  onAddComment: (storyId: string, body: string) => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const onCloseRef = React.useRef(onClose);
  const [readerDestinationOverride, setReaderDestinationOverride] = React.useState<Exclude<DestinationMode, "all"> | null>(null);
  const readerOriginBrandSlug = getReaderOriginBrandSlug(readerReturnHref);
  const publicationStories = readerOriginBrandSlug
    ? mergeUniqueStories(stories, availableStories).filter(
        (story) => story.brandSlug === readerOriginBrandSlug
      )
    : [];
  const readerStories = readerDestinationOverride
    ? availableStories.filter((story) => getStoryDestinationMode(story.brandSlug) === readerDestinationOverride)
    : publicationStories.length > 0
      ? publicationStories
      : stories;
  const openIndex = openStoryId ? readerStories.findIndex((story) => story.id === openStoryId) : -1;
  const [visibleReaderCount, setVisibleReaderCount] = React.useState(1);
  const [liveArticles, setLiveArticles] = React.useState<Record<string, LiveArticleLoadState>>({});
  const [fullscreenGallery, setFullscreenGallery] = React.useState<FullscreenGalleryState | null>(null);
  const [ambientReaderStoryId, setAmbientReaderStoryId] = React.useState<string | null>(null);
  const fullscreenGalleryRef = React.useRef(fullscreenGallery);
  const storyQueue = openIndex >= 0
    ? [...readerStories.slice(openIndex), ...readerStories.slice(0, openIndex)]
    : [];
  const visibleReaderStories = storyQueue.slice(0, visibleReaderCount);
  const visibleReaderStoryIds = visibleReaderStories.map((story) => story.id).join("|");
  const readerContextStory = storyQueue[0];
  const readerDestination = readerContextStory
    ? getStoryDestinationMode(readerContextStory.brandSlug)
    : "lifestyle";
  const readerDestinationLabel = getReaderDestinationLabel(readerDestination);
  const readerDestinationConfig = destinationConfigs[readerDestination];
  const readerColorMode = readerDestination === "flux" ? "dark" : "light";
  const readerDestinationTheme = themeOptions.find((theme) => theme.slug === readerDestinationConfig.brandSlug);
  const usePublicationTheme = Boolean(
    readerContextStory
    && readerOriginBrandSlug === readerContextStory.brandSlug
  );
  const readerTheme = readerDestinationTheme && usePublicationTheme && readerContextStory
    ? getSelectedBrandTheme(
        { name: readerContextStory.brand, slug: readerContextStory.brandSlug },
        readerDestinationTheme
      ) ?? readerDestinationTheme
    : readerDestinationTheme;
  const readerLogoSlug = usePublicationTheme && readerContextStory
    ? readerContextStory.brandSlug
    : readerDestinationConfig.brandSlug;
  const readerContextLabel = usePublicationTheme && readerContextStory
    ? readerContextStory.brand
    : readerDestinationLabel;
  const readerThemeCssVars = readerTheme
    ? brandToCssVars(readerTheme, readerColorMode) as React.CSSProperties
    : undefined;
  const isReaderOpen = Boolean(openStoryId);
  const readerSections: Array<{ label: string; mode: Exclude<DestinationMode, "all"> }> = [
    { label: "Lifestyle", mode: "lifestyle" },
    { label: "Autos", mode: "autos" },
    { label: "Fashion & Luxury", mode: "flux" },
    { label: "Enthusiast & Wellness", mode: "ew" },
  ];
  const otherReaderSections = readerSections.filter((section) => section.mode !== readerDestination);
  const readerActiveFilter = readerContextStory
    ? readerDestinationConfig.filters.find((filter) =>
        filter !== "For You"
        && filter !== "Saved"
        && storyMatchesLifestyleFilter(readerContextStory, filter)
      ) ?? "For You"
    : "For You";

  const getReaderFilterStory = (filter: string) => {
    if (!readerContextStory) return undefined;
    if (filter === "For You") return readerContextStory;

    return readerStories.find((story) =>
      getStoryDestinationMode(story.brandSlug) === readerDestination
      && (filter === "Saved"
        ? savedIds.includes(story.id)
        : storyMatchesLifestyleFilter(story, filter))
    );
  };

  React.useEffect(() => {
    if (!openStoryId) setReaderDestinationOverride(null);
  }, [openStoryId]);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    fullscreenGalleryRef.current = fullscreenGallery;
  }, [fullscreenGallery]);

  React.useEffect(() => {
    setVisibleReaderCount(1);
    setFullscreenGallery(null);
    setAmbientReaderStoryId(null);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [openStoryId]);

  React.useEffect(() => {
    if (!isReaderOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const returnFocusLabel = window.sessionStorage.getItem(readerReturnFocusStorageKey);
    const previousOverflow = document.body.style.overflow;
    const siblingStates = Array.from(dialog.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== dialog)
      .map((element) => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      }));
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () => Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter((element) => element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (fullscreenGalleryRef.current) {
          setFullscreenGallery(null);
          return;
        }
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || fullscreenGalleryRef.current) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    siblingStates.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const focusFrame = window.requestAnimationFrame(() => {
      dialog.querySelector<HTMLElement>("[data-reader-close]")?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      siblingStates.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      if (returnFocusLabel) {
        let attempts = 0;
        const restoreFocus = () => {
          attempts += 1;
          if (!window.location.pathname.startsWith("/read/")) {
            const returnTarget = Array.from(document.querySelectorAll<HTMLElement>("[aria-label]"))
              .find((element) => element.getAttribute("aria-label") === returnFocusLabel);
            if (returnTarget) {
              returnTarget.focus();
              window.sessionStorage.removeItem(readerReturnFocusStorageKey);
              return true;
            }
          }
          return attempts >= 20;
        };

        if (!restoreFocus()) {
          const restoreTimer = window.setInterval(() => {
            if (restoreFocus()) window.clearInterval(restoreTimer);
          }, 50);
        }
      }
    };
  }, [isReaderOpen]);

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

  React.useEffect(() => {
    const controller = new AbortController();
    visibleReaderStories.forEach((story) => {
      if (!story.sourceUrl || liveArticles[story.id]) return;
      setLiveArticles((current) => ({ ...current, [story.id]: { status: "loading" } }));
      fetch(`/api/live-article/?url=${encodeURIComponent(story.sourceUrl)}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error(`Article request failed with ${response.status}`);
          return response.json() as Promise<LiveArticleData>;
        })
        .then((data) => setLiveArticles((current) => ({ ...current, [story.id]: { status: "ready", data } })))
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setLiveArticles((current) => ({ ...current, [story.id]: { status: "error" } }));
        });
    });
    return () => controller.abort();
  // The ID key intentionally represents the current lazy-loaded reader queue.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleReaderStoryIds]);

  React.useEffect(() => {
    if (!isReaderOpen || ambientReaderStoryId || fullscreenGallery) return;

    const openPremiumReaderFromKeyboard = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "p"
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
        || event.repeat
      ) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      if (
        target?.isContentEditable
        || target?.matches("input, textarea, select, [role='textbox']")
      ) return;

      const readerScroller = scrollRef.current;
      if (!readerScroller) return;
      const scrollerRect = readerScroller.getBoundingClientRect();
      const readingAnchor = scrollerRect.top + Math.min(180, scrollerRect.height * 0.25);
      const visibleArticles = Array.from(
        readerScroller.querySelectorAll<HTMLElement>("[data-reader-story-id]")
      )
        .map((article) => ({ article, rect: article.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > scrollerRect.top && rect.top < scrollerRect.bottom)
        .sort((first, second) => {
          const firstDistance = first.rect.top <= readingAnchor && first.rect.bottom >= readingAnchor
            ? 0
            : Math.abs(first.rect.top - readingAnchor);
          const secondDistance = second.rect.top <= readingAnchor && second.rect.bottom >= readingAnchor
            ? 0
            : Math.abs(second.rect.top - readingAnchor);
          return firstDistance - secondDistance;
        });
      const activeStoryId = visibleArticles[0]?.article.dataset.readerStoryId;
      if (!activeStoryId || !isCompleteAmbientArticle(liveArticles[activeStoryId])) return;

      event.preventDefault();
      setAmbientReaderStoryId(activeStoryId);
    };

    window.addEventListener("keydown", openPremiumReaderFromKeyboard);
    return () => window.removeEventListener("keydown", openPremiumReaderFromKeyboard);
  }, [ambientReaderStoryId, fullscreenGallery, isReaderOpen, liveArticles, visibleReaderStoryIds]);

  React.useEffect(() => {
    if (!fullscreenGallery) return;
    const storyId = fullscreenGallery.story.id;
    const nextImages = getFullscreenReaderImages(fullscreenGallery.story, liveArticles[storyId]);
    const currentSignature = fullscreenGallery.images.map((image) => image.src).join("|");
    const nextSignature = nextImages.map((image) => image.src).join("|");
    if (currentSignature === nextSignature) return;

    const activeSrc = fullscreenGallery.images[fullscreenGallery.initialIndex]?.src;
    setFullscreenGallery((current) => current ? {
      ...current,
      images: nextImages,
      initialIndex: Math.max(0, nextImages.findIndex((image) => image.src === activeSrc)),
    } : current);
  }, [fullscreenGallery, liveArticles]);

  if (!openStoryId || openIndex < 0) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Story reader"
      tabIndex={-1}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={scrollRef}
        className="hearst-plus-theme absolute inset-0 mx-auto flex h-[100dvh] w-full max-w-[1360px] flex-col overflow-y-auto bg-background text-foreground shadow-2xl sm:inset-y-6 sm:h-auto sm:rounded-[8px]"
        data-mode={readerColorMode}
        data-reader-destination={readerDestination}
        style={readerThemeCssVars}
      >
        <div className="sticky top-0 z-[110] border-b border-border bg-background/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 border-b border-border/70 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div
                className="flex h-6 min-w-0 max-w-[230px] flex-1 items-center sm:h-7 sm:flex-none sm:basis-[230px]"
                role="img"
                aria-label={readerContextLabel}
              >
                <BrandLogo
                  slug={readerLogoSlug}
                  color={readerDestination === "flux" ? "#ffffff" : undefined}
                  className="flex h-full w-full items-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-full"
                />
              </div>
              <div className="hidden min-w-0 border-l border-border pl-4 sm:block">
                <p className="truncate text-xs font-bold text-foreground">
                  Reading {readerContextLabel}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {visibleReaderStories.length} of {storyQueue.length} stories loaded
                </p>
              </div>
            </div>
            <nav className="ml-auto hidden shrink-0 items-center justify-end gap-5 lg:flex" aria-label="Other Hearst sections">
              {otherReaderSections.map((section) => {
                const nextStory = availableStories.find((story) =>
                  getStoryDestinationMode(story.brandSlug) === section.mode
                );

                return (
                  <button
                    key={section.mode}
                    type="button"
                    disabled={!nextStory}
                    onClick={() => {
                      if (!nextStory) return;
                      setReaderDestinationOverride(section.mode);
                      onOpenStory(nextStory.id);
                    }}
                    className="whitespace-nowrap text-xs font-semibold text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Show ${section.label} stories in reader`}
                  >
                    {section.label}
                  </button>
                );
              })}
            </nav>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close story reader"
              data-reader-close
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <nav
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={`${readerDestinationConfig.productName} reader sections`}
          >
            <div className="mx-auto flex min-w-max items-center gap-6 px-4 sm:justify-center sm:px-6">
              {readerDestinationConfig.filters.map((filter) => {
                const filterStory = getReaderFilterStory(filter);
                const active = filter === readerActiveFilter;

                return (
                  <button
                    key={filter}
                    type="button"
                    disabled={!filterStory}
                    onClick={() => filterStory && onOpenStory(filterStory.id)}
                    className={cn(
                      "whitespace-nowrap border-b-2 px-0.5 py-3 text-sm transition-colors",
                      active
                        ? "border-primary font-semibold text-primary"
                        : "border-transparent text-foreground hover:border-primary/40 hover:text-primary",
                      !filterStory && "cursor-not-allowed opacity-40"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="grid gap-8 px-4 py-6 sm:px-8 lg:px-10 xl:grid-cols-[220px_minmax(0,1fr)]">
          <LifestyleReaderContextRail
            currentStory={storyQueue[0]}
            stories={readerStories}
            onOpenStory={onOpenStory}
          />
          <div className="min-w-0">
            {visibleReaderStories.map((story, index) => {
              const kind = getLifestyleCardKind(story);
              const useRoadAndTrackHeadline = story.brandSlug === "road-and-track";

              return (
                <React.Fragment key={story.id}>
                  {index > 0 ? (
                    <div className="flex items-center gap-4 py-10" aria-label="Up next">
                      <span className="h-px flex-1 bg-border" aria-hidden="true" />
                      <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                        Up next
                      </span>
                      <span className="h-px flex-1 bg-border" aria-hidden="true" />
                    </div>
                  ) : null}
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <article
                      data-reader-story-id={story.id}
                      className={cn(
                        "relative min-w-0 rounded-[8px] border px-5 py-5 sm:px-7 sm:py-7",
                        readerDestination === "flux"
                          ? "border-white/15 bg-[#171b21] text-[#f7f8fa] [--border:#343b46] [--foreground:#f7f8fa] [--muted-foreground:#aeb8c5]"
                          : "border-border bg-white text-[#121212] [--foreground:#121212] [--muted-foreground:#5f6b7a]"
                      )}
                      style={{
                        contentVisibility: "auto",
                        containIntrinsicSize: "1200px",
                        ...(useRoadAndTrackHeadline ? {
                          "--font-headline": '"Buzz", "Barlow Condensed", system-ui, sans-serif',
                          "--font-headline-weight": "900",
                        } : {}),
                      } as React.CSSProperties}
                    >
                      {story.videoUrl ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-[4px] bg-black">
                          <video
                            src={story.videoUrl}
                            poster={story.image}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-full w-full bg-black object-contain"
                            aria-label={`Play video: ${story.title}`}
                          />
                          {story.videoDuration ? (
                            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold tabular-nums text-white shadow-sm">
                              {formatVideoDuration(story.videoDuration)}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="group block w-full cursor-zoom-in rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                          onClick={() => setFullscreenGallery({
                            story,
                            images: getFullscreenReaderImages(story, liveArticles[story.id]),
                            initialIndex: 0,
                          })}
                          aria-label={`View image fullscreen: ${story.title}`}
                        >
                          <LifestyleRiverImage
                            story={story}
                            className="aspect-video w-full rounded-[4px] transition-opacity group-hover:opacity-95"
                          />
                        </button>
                      )}
                      <div className="mx-auto mt-6 max-w-3xl">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                            {story.signal}
                          </span>
                        </div>
                        <h2 className={cn(
                          "headline text-4xl sm:text-5xl",
                          useRoadAndTrackHeadline ? "leading-[1.12]" : "leading-[1.05]"
                        )}>
                          {story.title}
                        </h2>
                        <LifestyleReaderActions
                          story={story}
                          saved={savedIds.includes(story.id)}
                          followed={followedBrands.includes(story.brand)}
                          commentCount={getLifestyleCommentCount(story, commentsByStoryId[story.id]?.length ?? 0)}
                          onSave={() => onSave(story)}
                          onToggleFollowBrand={() => onToggleFollowBrand(story.brand)}
                          ambientReaderState={getAmbientReaderState(story, liveArticles[story.id])}
                          onOpenAmbientReader={isCompleteAmbientArticle(liveArticles[story.id])
                            ? () => setAmbientReaderStoryId(story.id)
                            : undefined}
                        />
                        <LifestyleReaderBody
                          story={story}
                          liveArticle={liveArticles[story.id]}
                          onOpenImage={(image) => {
                            const images = getFullscreenReaderImages(story, liveArticles[story.id]);
                            setFullscreenGallery({
                              story,
                              images,
                              initialIndex: Math.max(0, images.findIndex((candidate) => candidate.src === image.src)),
                            });
                          }}
                        />
                        <LifestyleCardModule story={story} kind={kind} />
                        <LifestyleStoryComments
                          story={story}
                          comments={commentsByStoryId[story.id] ?? []}
                          onAddComment={(body) => onAddComment(story.id, body)}
                        />
                        <LifestyleArticleRecommendationsModule
                          currentStory={story}
                          stories={readerStories}
                          productName={destinationConfigs[getStoryDestinationMode(story.brandSlug)].productName}
                          onOpenStory={onOpenStory}
                        />
                      </div>
                    </article>
                    <LifestyleReaderSidebarAd currentStory={story} slotIndex={index} />
                  </div>
                </React.Fragment>
              );
            })}

            <div ref={sentinelRef} className="flex justify-center py-8">
              {visibleReaderCount < storyQueue.length ? (
                <p className="text-sm text-[var(--hp-text-ui)]">Loading the next story...</p>
              ) : (
                <p className="text-sm text-[var(--hp-text-ui)]">End of this filtered story river.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {fullscreenGallery ? (
        <FullscreenImageViewer
          gallery={fullscreenGallery}
          saved={savedIds.includes(fullscreenGallery.story.id)}
          onClose={() => setFullscreenGallery(null)}
          onSave={() => onSave(fullscreenGallery.story)}
          onMoreLikeThis={() => onMoreLikeThis(fullscreenGallery.story)}
        />
      ) : null}
      {ambientReaderStoryId && liveArticles[ambientReaderStoryId]?.status === "ready" ? (
        <AmbientArticleReader
          story={readerStories.find((story) => story.id === ambientReaderStoryId) ?? storyQueue[0]}
          article={liveArticles[ambientReaderStoryId].data}
          onClose={() => setAmbientReaderStoryId(null)}
          onOpenImage={(image) => {
            const ambientStory = readerStories.find((story) => story.id === ambientReaderStoryId) ?? storyQueue[0];
            const images = getFullscreenReaderImages(ambientStory, liveArticles[ambientReaderStoryId]);
            setFullscreenGallery({
              story: ambientStory,
              images,
              initialIndex: Math.max(0, images.findIndex((candidate) => candidate.src === image.src)),
            });
          }}
        />
      ) : null}
    </div>
  );
}

function TodayEditDashboard({
  stories,
  profile,
  onOpenStory,
  onShowFollowedBrands,
}: {
  stories: LifestyleRiverStory[];
  profile: LifestyleRiverProfile;
  onOpenStory: (storyId: string) => void;
  onShowFollowedBrands: () => void;
}) {
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const updateCarouselControls = React.useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCardOffset = (carousel.firstElementChild as HTMLElement | null)?.offsetLeft ?? 0;

    setCanScrollLeft(carousel.scrollLeft > firstCardOffset + 2);
    setCanScrollRight(carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 2);
  }, []);

  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateCarouselControls();
    carousel.addEventListener("scroll", updateCarouselControls, { passive: true });
    const resizeObserver = new ResizeObserver(updateCarouselControls);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateCarouselControls);
      resizeObserver.disconnect();
    };
  }, [updateCarouselControls]);

  const usedStoryIds = new Set<string>();
  const compactStories = (items: Array<LifestyleRiverStory | undefined>) =>
    items.filter((story): story is LifestyleRiverStory => Boolean(story));
  const takeUnusedStory = (candidates: LifestyleRiverStory[]) => {
    const story = candidates.find((candidate) => !usedStoryIds.has(candidate.id))
      || stories.find((candidate) => !usedStoryIds.has(candidate.id));

    if (story) usedStoryIds.add(story.id);
    return story;
  };

  const continueStory = takeUnusedStory(compactStories([
    ...stories.filter((story) => getLifestyleCardKind(story) === "video"),
    stories[1],
    stories[0],
  ]));
  const followedBrandStory = takeUnusedStory([
    ...stories.filter((story) => profile.followedBrands.includes(story.brand)),
    ...stories,
  ]);
  const trendingStory = takeUnusedStory([...stories].sort((a, b) => b.popularity - a.popularity));
  const collectionStory = takeUnusedStory([
    ...stories.filter((story) => story.tags.some((tag) => profile.savedTags.includes(tag))),
    ...stories,
  ]);

  if (!continueStory || !followedBrandStory || !trendingStory || !collectionStory) return null;

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * Math.max(320, carousel.clientWidth * 0.72),
      behavior: "smooth",
    });
  };

  const modules = [
    {
      story: continueStory,
      label: "Continue Reading",
      title: continueStory.title,
      image: continueStory.image,
      onClick: () => onOpenStory(continueStory.id),
    },
    {
      story: followedBrandStory,
      label: "New From Your Brands",
      title: followedBrandStory.title,
      image: followedBrandStory.image,
      onClick: onShowFollowedBrands,
    },
    {
      story: trendingStory,
      label: "Trending Today",
      title: trendingStory.title,
      image: trendingStory.image,
      onClick: () => onOpenStory(trendingStory.id),
    },
    {
      story: collectionStory,
      label: "Your Collections",
      title: collectionStory.title,
      image: collectionStory.image,
      onClick: () => onOpenStory(collectionStory.id),
    },
  ];

  return (
    <section
      className="relative left-1/2 w-screen -translate-x-1/2 border-b border-border bg-[var(--hp-strip)] shadow-[var(--hp-shadow-card)]"
      aria-label="Today&apos;s edit"
    >
      <div
        ref={carouselRef}
        className="mx-auto flex w-full max-w-[var(--width-content-max)] snap-x snap-mandatory overflow-x-auto px-4 [scrollbar-width:none] md:px-6 lg:px-12 xl:grid xl:grid-cols-4 xl:divide-x xl:divide-border xl:overflow-visible xl:snap-none xl:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden xl:[&::-webkit-scrollbar]:block"
      >
        {modules.map((module) => (
          <button
            key={module.label}
            type="button"
            onClick={module.onClick}
            className="group relative flex min-h-[190px] w-[88vw] shrink-0 snap-start scroll-ml-0 flex-col border-r border-border px-5 py-6 text-left transition-colors last:border-r-0 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 sm:w-[58vw] md:min-h-[144px] md:w-[44vw] md:p-6 lg:w-[34vw] xl:w-auto xl:min-w-0 xl:border-0"
          >
            <span>
              <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
                {module.label}
              </span>
              <span className="mt-3 flex items-start gap-3">
                {module.image ? (
                  <span
                    aria-hidden="true"
                    className="mt-0.5 block h-16 w-20 shrink-0 rounded-[8px] bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url("${module.image}")` }}
                  />
                ) : null}
                <span className="line-clamp-3 min-w-0 text-sm font-bold leading-snug text-foreground">
                  {module.title}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
      {canScrollLeft || canScrollRight ? (
        <div className="absolute right-5 top-5 hidden items-center gap-1.5 sm:flex xl:hidden">
          {canScrollLeft ? (
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Previous stories in today's edit"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
          {canScrollRight ? (
            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Next stories in today's edit"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function LifestylePersonalizationDemoPanel({
  demoState,
  profile,
  topStory,
  config,
  onDaypartChange,
  onSimulateReturn,
  currentLeadId,
  onApplyBehaviorPreset,
  onResetDemo,
}: {
  demoState: LifestyleDemoState;
  profile: LifestyleRiverProfile;
  topStory?: LifestyleRiverStory;
  config: DestinationConfig;
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
  const activeDaypart = config.dayparts[demoState.daypart];
  const topBreakdown = topStory ? getLifestyleScoreBreakdown(topStory, profile, demoState, config) : null;
  const topStrategyReason = topStory && topBreakdown
    ? getLifestyleStrategyReason(topStory, topBreakdown, demoState, config)
    : null;

  return (
    <section
      className="rounded-[8px] border border-border bg-white text-[#121212] [--background:#ffffff] [--foreground:#121212] [--muted-foreground:#5f6b7a]"
      aria-label="Personalization demo controls"
    >
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
                This demo follows the product strategy for a daily destination: keep the first visit
                editorially useful, then refresh the lead on return visits using recency, daypart
                mission, reader intent, and diversity rules.
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
                {(Object.keys(config.dayparts) as LifestyleDemoDaypart[]).map((daypart) => {
                  const item = config.dayparts[daypart];
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
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Changing the hour simulates a return visit, so the previous lead is deprioritized and a
                fresher story that fits the moment can move up.
              </p>
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
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Fresh return</dt>
                  <dd className="font-bold">{topBreakdown.returnFreshness}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Repeat guard</dt>
                  <dd className="font-bold">{topBreakdown.repeatLeadPenalty}</dd>
                </div>
              </dl>
              {topStrategyReason ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  Strategy link: {topStrategyReason}.
                </p>
              ) : null}
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

function LifestylePersonalizationRulesGuide() {
  const rules = [
    {
      number: "1",
      title: "Start with eligible content",
      body: "Use stories from the active Hearst destination and category. Remove hidden, duplicate, excluded, or unplayable items before ranking begins.",
      proof: "Change destination, category, or brand filters.",
    },
    {
      number: "2",
      title: "Build an editorial baseline",
      body: "Popularity, freshness, and an editor-selected starting point keep a first visit useful even when little or no reader history exists.",
      proof: "Reset the demo to see the first-visit edition.",
    },
    {
      number: "3",
      title: "Add reader intent",
      body: "Followed topics and brands, saved-story tags, and More Like This behavior raise relevant stories. Hides remove a story from future consideration.",
      proof: "Apply a behavior preset, save, hide, or choose More Like This.",
    },
    {
      number: "4",
      title: "Adapt to the moment",
      body: "Time of day and return-visit freshness change the mission. The previous lead is deliberately reduced so the experience can feel new when a reader comes back.",
      proof: "Change the time or simulate a return visit.",
    },
    {
      number: "5",
      title: "Apply experience guardrails",
      body: "Brand and topic diversity prevent repetition. The slideshow keeps the personalized order while balancing editorial stories, current articles, and playable videos.",
      proof: "Compare the river and all five featured slides.",
    },
    {
      number: "6",
      title: "Explain the result",
      body: "The score panel shows why the current lead won. The same scoring model orders the river and rescoring happens again before the slideshow applies its mix rules.",
      proof: "Watch the score and lead update together.",
    },
  ];

  return (
    <section
      className="mt-4 overflow-hidden rounded-[8px] border border-border bg-white text-[#121212] [--foreground:#121212] [--muted-foreground:#5f6b7a]"
      aria-labelledby="personalization-rules-title"
    >
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          How personalization works
        </p>
        <h2 id="personalization-rules-title" className="headline mt-1 text-2xl leading-tight">
          One ranking model, shaped by clear editorial guardrails.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Personalization does not invent or rewrite content. It decides which eligible Hearst stories
          appear first, then the content model chooses the right card treatment. Use these six rules as
          the stakeholder talk track.
        </p>
      </div>

      <ol className="grid md:grid-cols-2 xl:grid-cols-3">
        {rules.map((rule) => (
          <li
            key={rule.number}
            className="border-b border-border p-4 last:border-b-0 md:[&:nth-child(odd)]:border-r xl:[&:nth-child(odd)]:border-r-0 xl:[&:not(:nth-child(3n))]:border-r xl:[&:nth-last-child(-n+3)]:border-b-0"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {rule.number}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-5">{rule.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{rule.body}</p>
                <p className="mt-3 text-xs leading-5">
                  <span className="font-bold">Show it:</span>{" "}
                  <span className="text-muted-foreground">{rule.proof}</span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-border bg-[#f5f7fa] px-4 py-3 text-xs leading-5 text-[#445064] sm:px-5">
        <span className="font-bold text-[#121212]">Stakeholder summary:</span>{" "}
        editorial quality sets the foundation; reader behavior and context improve relevance; diversity,
        exclusions, and playable-media rules protect the final experience.
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
  config,
  activeFilter,
  stories,
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
  config: DestinationConfig;
  activeFilter: string;
  stories: LifestyleRiverStory[];
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
            config={config}
            currentLeadId={topStory?.id}
            onDaypartChange={onDaypartChange}
            onSimulateReturn={onSimulateReturn}
            onApplyBehaviorPreset={onApplyBehaviorPreset}
            onResetDemo={onResetDemo}
          />
          <LifestylePersonalizationRulesGuide />
          <LifestyleCardModelGuide />
          <ContextualAdLogicGuide
            profile={profile}
            demoState={demoState}
            config={config}
            activeFilter={activeFilter}
            stories={stories}
          />
        </div>
      </div>
    </div>
  );
}

function MobileCollapsibleSidebarCard({
  title,
  summary,
  children,
  className,
  defaultOpen = false,
  mobileActionLabel,
  onMobileAction,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  mobileActionLabel?: string;
  onMobileAction?: () => void;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section className={cn("min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]", className)}>
      <div className="hidden lg:block">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
          {title}
        </p>
      </div>
      <div className="flex min-h-11 min-w-0 items-stretch gap-3 lg:hidden">
        <button
          type="button"
          className="min-h-11 min-w-0 flex-1 overflow-hidden text-left"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {title}
          </span>
          <span className="mt-1 line-clamp-2 block max-w-full break-words text-xs font-normal normal-case tracking-normal text-muted-foreground lg:hidden">
            {summary}
          </span>
        </button>
        {mobileActionLabel && onMobileAction ? (
          <button
            type="button"
            onClick={onMobileAction}
            className="min-h-11 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))] transition-colors hover:text-[var(--hp-text-primary)] focus-visible:text-[var(--hp-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {mobileActionLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]"
          aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
          aria-expanded={open}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>
      <div className={cn("mt-4 lg:block", open ? "block" : "hidden")}>{children}</div>
    </section>
  );
}

function LifestyleLeftSidebar({
  profile,
  topStories,
  topics,
  brands,
  brandFilterTitle = "Filter Brands",
  activeBrandFilters,
  collectionLabels,
  onToggleBrandFilter,
  onClearBrandFilters,
  onFollowTopic,
  onOpenStory,
}: {
  profile: LifestyleRiverProfile;
  topStories: LifestyleRiverStory[];
  topics: { name: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  brandFilterTitle?: string;
  activeBrandFilters: string[];
  collectionLabels: string[];
  onToggleBrandFilter: (brandName: string) => void;
  onClearBrandFilters: () => void;
  onFollowTopic: (topic: string) => void;
  onOpenStory: (story: LifestyleRiverStory) => void;
}) {
  const activeTopicSummary = profile.followedTopics.slice(0, 3).join(", ");
  const brandStoryCount = brands.reduce((total, brand) => total + brand.count, 0);
  const brandSummary =
    activeBrandFilters.length > 0
      ? activeBrandFilters[0]
      : `All brands · ${brandStoryCount} stories`;
  const topicSummary = activeTopicSummary || `${topics.length} topics`;
  const collectionSummary = `${collectionLabels.length} collections`;

  return (
    <aside
      className="min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:max-h-[calc(100dvh-136px)] lg:self-start lg:overflow-y-auto lg:pr-1"
      aria-label="Lifestyle discovery sidebar"
    >
      <MobileCollapsibleSidebarCard
        title="Your Daily Habit"
        summary={topStories[0]?.title || "Top stories ready"}
        className="hidden lg:block"
      >
        <div className="space-y-3">
          {topStories.slice(0, 3).map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => onOpenStory(story)}
              className="group block w-full border-b border-border pb-3 text-left last:border-0 last:pb-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={`Open story: ${story.title}`}
            >
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                {story.topic}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
                {story.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{story.brand} · Popularity {story.popularity}</p>
            </button>
          ))}
        </div>
      </MobileCollapsibleSidebarCard>

      <MobileCollapsibleSidebarCard
        title={brandFilterTitle}
        summary={brandSummary}
        mobileActionLabel={activeBrandFilters.length > 0 ? "Clear" : undefined}
        onMobileAction={activeBrandFilters.length > 0 ? onClearBrandFilters : undefined}
      >
        {activeBrandFilters.length > 0 ? (
          <div className="-mt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={onClearBrandFilters}
              className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Clear
            </button>
          </div>
        ) : null}
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
                  <BrandSourceIcon
                    brand={brand.name}
                    brandSlug={brand.slug}
                    className={cn(
                      "h-5 w-5 rounded-[4px]",
                      active ? "border-primary ring-2 ring-primary/20" : "border-border"
                    )}
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
            ? `Showing ${activeBrandFilters[0]}.`
            : "All brands are included in the river."}
        </p>
      </MobileCollapsibleSidebarCard>

      <MobileCollapsibleSidebarCard title="Follow Topics" summary={topicSummary} className="hidden lg:block">
        <div className="flex flex-wrap gap-2">
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
      </MobileCollapsibleSidebarCard>

      <MobileCollapsibleSidebarCard title="Collections" summary={collectionSummary} className="hidden bg-muted/30 lg:block">
        <div className="space-y-2 text-sm">
          {collectionLabels.map((label) => (
            <p key={label} className="font-bold">{label}</p>
          ))}
          <p className="text-xs text-[var(--hp-text-ui)]">
            Saved stories and more-like-this actions tune these collections over time.
          </p>
        </div>
      </MobileCollapsibleSidebarCard>
    </aside>
  );
}

type LifestyleRiverHomePageProps = {
  activeFilter: string;
  destination: DestinationMode;
  destinationConfig?: DestinationConfig;
  videoFeedData?: LiveFeedData;
  initialBrandSlug?: string;
  initialOpenStoryId?: string;
  readerReturnHref?: string;
  onboardingResult?: HearstOnboardingResult | null;
  onRiverReset?: () => void;
  onBrandFilterChange?: () => void;
  onSelectedBrandChange?: (brand: { name: string; slug: string } | null) => void;
};

function getLifestyleRiverPageHeading(config: DestinationConfig, initialBrandSlug?: string) {
  const initialBrandName = config.sourceNotes.find((note) => note.brandSlug === initialBrandSlug)?.brand;
  return `${initialBrandName ?? config.productName} personalized story feed`;
}

function LifestyleRiverLoadingState({ pageHeading }: { pageHeading: string }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite" aria-label="Loading your personalized feed">
      <h1 className="sr-only">{pageHeading}</h1>
      <span className="sr-only">Loading your personalized feed.</span>
      <section className="grid gap-4 border-b border-border bg-[var(--hp-surface)] py-5 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex min-w-0 items-center gap-3 px-4 xl:border-r xl:border-border xl:last:border-r-0">
            <span className="h-14 w-20 shrink-0 rounded-[6px] bg-muted motion-safe:animate-pulse" />
            <span className="min-w-0 flex-1 space-y-2">
              <span className="block h-2.5 w-24 rounded-full bg-muted motion-safe:animate-pulse" />
              <span className="block h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
              <span className="block h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
            </span>
          </div>
        ))}
      </section>
      <div className="grid min-w-0 gap-5 lg:grid-cols-[200px_minmax(0,1fr)_240px]">
        <aside className="hidden h-[360px] rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 lg:block" aria-hidden="true">
          <div className="h-3 w-28 rounded-full bg-muted motion-safe:animate-pulse" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-2 border-b border-border pb-4 last:border-b-0">
                <div className="h-2.5 w-16 rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
        <main className="min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)]" aria-hidden="true">
          <div className="aspect-[16/10] bg-muted motion-safe:animate-pulse" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-3 w-32 rounded-full bg-muted motion-safe:animate-pulse" />
            <div className="h-7 w-full rounded-full bg-muted motion-safe:animate-pulse" />
            <div className="h-7 w-3/4 rounded-full bg-muted motion-safe:animate-pulse" />
            <div className="h-3 w-5/6 rounded-full bg-muted motion-safe:animate-pulse" />
          </div>
        </main>
        <aside className="hidden h-[360px] rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 lg:block" aria-hidden="true">
          <div className="h-3 w-36 rounded-full bg-muted motion-safe:animate-pulse" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-6 w-6 shrink-0 rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                  <div className="h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function LifestyleRiverHydrationGate(props: LifestyleRiverHomePageProps) {
  const destinationConfigs = useDestinationConfigs();
  const { isHydrated } = useReaderAccount();
  const config = props.destinationConfig ?? destinationConfigs[props.destination];
  const pageHeading = getLifestyleRiverPageHeading(config, props.initialBrandSlug);

  if (!isHydrated) return <LifestyleRiverLoadingState pageHeading={pageHeading} />;
  return <LifestyleRiverHomePage {...props} />;
}

function LifestyleRiverHomePage({
  activeFilter,
  destination,
  destinationConfig,
  videoFeedData,
  initialBrandSlug,
  initialOpenStoryId,
  readerReturnHref,
  onboardingResult,
  onRiverReset,
  onBrandFilterChange,
  onSelectedBrandChange,
}: LifestyleRiverHomePageProps) {
  const destinationConfigs = useDestinationConfigs();
  const config = destinationConfig ?? destinationConfigs[destination];
  const { account, updatePreferences, addComment } = useReaderAccount();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [profile, setProfile] = React.useState<LifestyleRiverProfile>(() => account?.preferences ?? config.initialProfile);
  const [demoState, setDemoState] = React.useState<LifestyleDemoState>(initialLifestyleDemoState);
  const initialBrandName = config.sourceNotes.find((note) => note.brandSlug === initialBrandSlug)?.brand;
  const [activeBrandFilters, setActiveBrandFilters] = React.useState<string[]>(initialBrandName ? [initialBrandName] : []);
  const [openStoryId, setOpenStoryId] = React.useState<string | null>(initialOpenStoryId ?? null);
  const [commentsByStoryId, setCommentsByStoryId] = React.useState<Record<string, LifestyleStoryComment[]>>({});
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(8);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveFilterRef = React.useRef<string | null>(null);
  const profileRef = React.useRef(profile);
  const appliedOnboardingResultRef = React.useRef<HearstOnboardingResult | null>(null);
  const resolvedCommentsByStoryId = account?.commentsByStoryId ?? commentsByStoryId;
  const readerAccountId = account?.id;
  const safeReaderReturnHref = React.useMemo(() => normalizeReaderReturnHref(readerReturnHref), [readerReturnHref]);
  const pageHeading = getLifestyleRiverPageHeading(config, initialBrandSlug);
  const currentPageReturnHref = React.useMemo(() => {
    if (!pathname || pathname.startsWith("/read/")) return null;

    const query = searchParams?.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);
  const currentReaderReturnHref = safeReaderReturnHref ?? (initialBrandSlug ? getHearstBrandRoute(initialBrandSlug) : getHearstDestinationRoute(destination));
  const storyOpenReturnHref = safeReaderReturnHref ?? currentPageReturnHref ?? currentReaderReturnHref;

  React.useEffect(() => {
    setOpenStoryId(initialOpenStoryId ?? null);
  }, [initialOpenStoryId]);

  const openStory = React.useCallback((storyId: string) => {
    const activeElement = document.activeElement;
    const returnFocusLabel = activeElement instanceof HTMLElement
      ? activeElement.getAttribute("aria-label")
      : null;
    if (returnFocusLabel?.startsWith("Open story:")) {
      window.sessionStorage.setItem(readerReturnFocusStorageKey, returnFocusLabel);
    } else {
      window.sessionStorage.removeItem(readerReturnFocusStorageKey);
    }
    setOpenStoryId(storyId);
    router.push(appendReaderReturnHref(storyId, storyOpenReturnHref), { scroll: false });
  }, [router, storyOpenReturnHref]);

  const closeStory = React.useCallback(() => {
    setOpenStoryId(null);
    if (pathname?.startsWith("/read/")) {
      router.push(currentReaderReturnHref, { scroll: false });
    }
  }, [currentReaderReturnHref, pathname, router]);

  const updateReaderProfile = React.useCallback((updater: React.SetStateAction<LifestyleRiverProfile>) => {
    const current = profileRef.current;
    const next = typeof updater === "function" ? updater(current) : updater;
    profileRef.current = next;
    setProfile(next);
    if (readerAccountId) updatePreferences(next);
  }, [readerAccountId, updatePreferences]);

  React.useEffect(() => {
    const next = account?.preferences ?? config.initialProfile;
    profileRef.current = next;
    setProfile(next);
  }, [account?.id, account?.preferences, config.initialProfile]);

  const videoTabStories = React.useMemo(() => {
    return (videoFeedData?.stories ?? []).filter((story) => getLifestyleCardKind(story) === "video");
  }, [videoFeedData?.stories]);
  const usingVideoTabFeed = activeFilter === "Videos" && Boolean(videoFeedData);
  const activeVideoBrandFilters = React.useMemo(() => {
    if (!usingVideoTabFeed || activeBrandFilters.length === 0) return activeBrandFilters;
    const availableVideoBrands = new Set(videoTabStories.map((story) => story.brand));
    return activeBrandFilters.filter((brandName) => availableVideoBrands.has(brandName));
  }, [activeBrandFilters, usingVideoTabFeed, videoTabStories]);
  const effectiveBrandFilters = usingVideoTabFeed ? activeVideoBrandFilters : activeBrandFilters;
  const activeSourceNotes = usingVideoTabFeed
    ? videoFeedData?.sourceNotes ?? config.sourceNotes
    : config.sourceNotes;
  const activeDataSourceCopy = usingVideoTabFeed
    ? videoFeedData?.dataSourceCopy ?? config.dataSourceCopy
    : config.dataSourceCopy;
  const activeLiveFeedStatus = usingVideoTabFeed && videoFeedData
    ? {
        fetchedAt: videoFeedData.fetchedAt,
        isFallback: videoFeedData.isFallback,
      }
    : config.liveFeedStatus;
  const activeStoryPool = React.useMemo(
    () => usingVideoTabFeed ? videoTabStories : getLifestyleDemoStoryPool(demoState, config),
    [config, demoState, usingVideoTabFeed, videoTabStories]
  );

  React.useEffect(() => {
    if (activeFilter === "Videos" && previousActiveFilterRef.current !== "Videos") {
      setActiveBrandFilters([]);
    }
    previousActiveFilterRef.current = activeFilter;
  }, [activeFilter]);
  const rankingProfile = React.useMemo(
    () => usingVideoTabFeed ? { ...profile, hiddenIds: [] } : profile,
    [profile, usingVideoTabFeed]
  );
  const rankedStories = React.useMemo(
    () => rankLifestyleRiver(activeStoryPool, rankingProfile, demoState, config),
    [activeStoryPool, config, demoState, rankingProfile]
  );
  const filteredStories = React.useMemo(() => {
    const brandFilteredStories = effectiveBrandFilters.length > 0
      ? rankedStories.filter((story) => effectiveBrandFilters.includes(story.brand))
      : rankedStories;

    if (activeFilter === "Saved") {
      return brandFilteredStories.filter((story) => profile.savedIds.includes(story.id));
    }

    if (usingVideoTabFeed) {
      return brandFilteredStories;
    }

    const contextStories = brandFilteredStories.filter((story) => storyMatchesLifestyleFilter(story, activeFilter));
    return config.liveFeedMode === "blend"
      ? applyContextualFeedCadence(contextStories)
      : contextStories;
  }, [activeFilter, config.liveFeedMode, effectiveBrandFilters, profile.savedIds, rankedStories, usingVideoTabFeed]);
  const availableReaderStories = React.useMemo(() => {
    const seenStoryIds = new Set<string>();
    return [
      ...config.stories,
      ...destinationConfigs.all.stories,
      ...videoTabStories,
    ].filter((story) => {
      if (seenStoryIds.has(story.id)) return false;
      seenStoryIds.add(story.id);
      return true;
    });
  }, [config.stories, destinationConfigs.all.stories, videoTabStories]);
  const displayStories = React.useMemo(() => {
    if (!config.liveFeedStatus || config.liveFeedMode === "blend") return filteredStories;
    const firstVideoIndex = filteredStories.findIndex((story) => Boolean(story.videoUrl));
    if (firstVideoIndex < 0 || firstVideoIndex < 8) return filteredStories;

    const reorderedStories = [...filteredStories];
    const [firstVideo] = reorderedStories.splice(firstVideoIndex, 1);
    reorderedStories.splice(Math.min(5, reorderedStories.length), 0, firstVideo);
    return reorderedStories;
  }, [config.liveFeedMode, config.liveFeedStatus, filteredStories]);
  const visibleStories = displayStories.slice(0, visibleCount);
  const heroStories = getPersonalizedLeadSliderStories(
    visibleStories,
    rankingProfile,
    demoState,
    config,
    5,
    config.liveFeedMode === "blend"
  );
  const leadStory = heroStories[0] ?? visibleStories[0];
  const heroStoryIds = new Set(heroStories.map((story) => story.id));
  const riverStories = visibleStories.filter((story) => !heroStoryIds.has(story.id));
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

    return activeSourceNotes.map((note) => ({
      name: note.brand,
      slug: note.brandSlug,
      count: counts[note.brand] ?? 0,
    }));
  }, [activeSourceNotes, activeStoryPool]);

  React.useEffect(() => {
    if (usingVideoTabFeed) return;
    const selectedBrand = effectiveBrandFilters.length === 1
      ? sidebarBrands.find((brand) => brand.name === effectiveBrandFilters[0]) ?? null
      : null;
    onSelectedBrandChange?.(selectedBrand ? { name: selectedBrand.name, slug: selectedBrand.slug } : null);
  }, [effectiveBrandFilters, onSelectedBrandChange, sidebarBrands, usingVideoTabFeed]);

  React.useEffect(() => {
    setVisibleCount(8);
  }, [activeFilter, demoState.contentDay, demoState.daypart, effectiveBrandFilters]);

  React.useEffect(() => {
    if (!onboardingResult || appliedOnboardingResultRef.current === onboardingResult) return;
    appliedOnboardingResultRef.current = onboardingResult;

    const signalTags = getOnboardingSignalTags(config.stories, onboardingResult);
    updateReaderProfile((current) => ({
      ...current,
      followedTopics: onboardingResult.interests.length > 0 ? onboardingResult.interests : current.followedTopics,
      followedBrands: onboardingResult.brands.length > 0 ? onboardingResult.brands : current.followedBrands,
      savedTags: signalTags,
      boostedTags: signalTags,
      personalizationMode: "onboarding",
    }));
    setDemoState(initialLifestyleDemoState);
    setActiveBrandFilters([]);
    onRiverReset?.();
  }, [config.stories, onRiverReset, onboardingResult, updateReaderProfile]);

  const anchorRiverToTop = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      onRiverReset?.();
    });
  }, [onRiverReset]);

  const anchorBrandToTop = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      onBrandFilterChange?.();
    });
  }, [onBrandFilterChange]);

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

  const resetDemo = () => {
    updateReaderProfile(config.initialProfile);
    setDemoState(initialLifestyleDemoState);
    setActiveBrandFilters([]);
    setOpenStoryId(null);
    setCommentsByStoryId({});
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
      homeCook: destination === "all" ? {
        followedTopics: ["Home", "Food", "Reviews", "Style", "Fitness"],
        followedBrands: ["Good Housekeeping", "Country Living", "Car and Driver", "Elle", "Men's Health"],
        savedTags: ["home", "recipe", "reviews", "style", "fitness"],
        boostedTags: ["kitchen", "electric", "fashion", "training"],
      } : destination === "autos" ? {
        followedTopics: ["Reviews", "Buying Guides", "EVs"],
        followedBrands: ["Car and Driver", "MotorTrend", "Road & Track"],
        savedTags: ["reviews", "evs", "buying", "electric"],
        boostedTags: ["review", "drive", "evs", "buying"],
      } : destination === "flux" ? {
        followedTopics: ["Style", "Beauty", "Culture"],
        followedBrands: ["Elle", "Harper's Bazaar", "Esquire"],
        savedTags: ["style", "beauty", "culture", "fashion"],
        boostedTags: ["style", "beauty", "fashion", "celebrity"],
      } : destination === "ew" ? {
        followedTopics: ["Fitness", "Wellness", "Nutrition"],
        followedBrands: ["Men's Health", "Women's Health", "Runner's World"],
        savedTags: ["fitness", "wellness", "nutrition", "training"],
        boostedTags: ["fitness", "training", "health", "wellness"],
      } : {
        followedTopics: ["Food", "Food Drinks", "Home"],
        followedBrands: ["Delish", "Good Housekeeping", "Country Living"],
        savedTags: ["dinner ideas", "cookout", "cleaning", "decorating"],
        boostedTags: ["recipe", "dinner ideas", "cookout", "food"],
      },
      shoppingBrowser: destination === "all" ? {
        followedTopics: ["Shopping", "Buying Guides", "Style", "Gear"],
        followedBrands: ["Good Housekeeping", "Car and Driver", "Harper's Bazaar", "Best Products"],
        savedTags: ["shopping", "products", "buying", "gear", "style"],
        boostedTags: ["products", "shopping", "reviews", "gear"],
      } : destination === "autos" ? {
        followedTopics: ["Buying Guides", "Auctions", "Classics"],
        followedBrands: ["Bring a Trailer", "Autoweek", "HOT ROD"],
        savedTags: ["auction", "classic", "collector", "used"],
        boostedTags: ["auction", "classic", "buying", "collector"],
      } : destination === "flux" ? {
        followedTopics: ["Shopping", "Style", "Design"],
        followedBrands: ["Elle", "Elle Décor", "Veranda"],
        savedTags: ["shopping", "design", "gifts", "jewelry"],
        boostedTags: ["shopping", "style", "design", "products"],
      } : destination === "ew" ? {
        followedTopics: ["Gear", "Tech", "Adventure"],
        followedBrands: ["Best Products", "Popular Mechanics", "Bicycling"],
        savedTags: ["gear", "tech", "adventure", "products"],
        boostedTags: ["gear", "reviews", "tech", "bike"],
      } : {
        followedTopics: ["Shopping", "Style", "Home"],
        followedBrands: ["Good Housekeeping", "Cosmopolitan", "House Beautiful"],
        savedTags: ["products", "style", "beauty", "decorating"],
        boostedTags: ["products", "shopping", "editor picks", "style"],
      },
      wellnessReader: destination === "all" ? {
        followedTopics: ["Wellness", "Fitness", "Life", "Home"],
        followedBrands: ["Prevention", "Men's Health", "Women's Health", "Oprah Daily"],
        savedTags: ["wellness", "health", "fitness", "sleep", "home"],
        boostedTags: ["wellness", "fitness", "health", "recovery"],
      } : destination === "autos" ? {
        followedTopics: ["Performance", "Racing", "Trucks"],
        followedBrands: ["HOT ROD", "Road & Track", "MotorTrend"],
        savedTags: ["performance", "racing", "truck", "engine"],
        boostedTags: ["performance", "racing", "horsepower", "truck"],
      } : destination === "flux" ? {
        followedTopics: ["Design", "Travel", "Events"],
        followedBrands: ["Town & Country", "Veranda", "Elle Décor"],
        savedTags: ["design", "travel", "events", "home"],
        boostedTags: ["design", "travel", "culture", "home"],
      } : destination === "ew" ? {
        followedTopics: ["Wellness", "Life", "Fitness"],
        followedBrands: ["Oprah Daily", "Women's Health", "Men's Health"],
        savedTags: ["wellness", "life", "sleep", "health"],
        boostedTags: ["wellness", "health", "life", "recovery"],
      } : {
        followedTopics: ["Wellness", "Style", "Food"],
        followedBrands: ["Prevention", "Good Housekeeping", "Cosmopolitan"],
        savedTags: ["sleep", "health", "beauty", "food"],
        boostedTags: ["sleep", "health", "wellness", "beauty"],
      },
    };

    const selected = presets[preset];

    updateReaderProfile((current) => ({
      ...current,
      followedTopics: mergeUnique(current.followedTopics, selected.followedTopics ?? []),
      followedBrands: mergeUnique(current.followedBrands, selected.followedBrands ?? []),
      savedTags: mergeUnique(current.savedTags, selected.savedTags ?? []),
      boostedTags: mergeUnique(current.boostedTags, selected.boostedTags ?? []),
    }));
  };

  const toggleSaved = (story: LifestyleRiverStory) => {
    updateReaderProfile((current) => {
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
    updateReaderProfile((current) => ({
      ...current,
      boostedTags: mergeUnique(current.boostedTags, story.tags),
      followedTopics: mergeUnique(current.followedTopics, [story.topic]),
    }));
  };

  const followTopic = (topic: string) => {
    updateReaderProfile((current) => ({
      ...current,
      followedTopics: current.followedTopics.includes(topic)
        ? current.followedTopics.filter((item) => item !== topic)
        : [...current.followedTopics, topic],
    }));
    anchorRiverToTop();
  };

  const toggleBrandFilter = (brandName: string) => {
    setActiveBrandFilters((current) =>
      current.includes(brandName)
        ? []
        : [brandName]
    );
    anchorBrandToTop();
  };

  const clearBrandFilters = () => {
    setActiveBrandFilters([]);
    anchorBrandToTop();
  };

  const followBrand = (brandName: string) => {
    updateReaderProfile((current) => ({
      ...current,
      followedBrands: mergeUnique(current.followedBrands, [brandName]),
    }));
  };

  const toggleFollowBrand = (brandName: string) => {
    updateReaderProfile((current) => ({
      ...current,
      followedBrands: current.followedBrands.includes(brandName)
        ? current.followedBrands.filter((brand) => brand !== brandName)
        : [...current.followedBrands, brandName],
    }));
  };

  const showFollowedBrands = () => {
    const availableFollowedBrands = sidebarBrands
      .filter((brand) => brand.count > 0 && profile.followedBrands.includes(brand.name))
      .map((brand) => brand.name);

    setActiveBrandFilters(availableFollowedBrands.slice(0, 1));
    anchorBrandToTop();
  };

  const hideStory = (id: string) => {
    updateReaderProfile((current) => ({
      ...current,
      hiddenIds: mergeUnique(current.hiddenIds, [id]),
    }));
  };

  const addStoryComment = (storyId: string, body: string) => {
    if (account) {
      const story = config.stories.find((item) => item.id === storyId);
      addComment({ storyId, storyTitle: story?.title ?? "Hearst story", body });
      return;
    }
    setCommentsByStoryId((current) => {
      const nextComment: LifestyleStoryComment = {
        id: `${storyId}-session-comment-${Date.now()}`,
        author: "You",
        role: "reader",
        body,
        age: "now",
        likes: 0,
      };

      return {
        ...current,
        [storyId]: [nextComment, ...(current[storyId] ?? [])],
      };
    });
  };

  const isVideoIndexPage = config.productName.includes("Video Feed");
  const isVideoQueueView = isVideoIndexPage || usingVideoTabFeed;
  const useVideoDarkMode = isVideoIndexPage || usingVideoTabFeed;
  const videoQueueStories = visibleStories;
  const videoStories = isVideoQueueView
    ? videoQueueStories.filter((story) => getLifestyleCardKind(story) === "video")
    : [];
  const featuredVideo = videoStories[0] ?? leadStory;
  const remainingVideoStories = featuredVideo
    ? videoStories.filter((story) => story.id !== featuredVideo.id)
    : videoStories;
  // Scoped exception: the Videos tab uses the dark video-index treatment inside otherwise light destinations.
  // Keep these tokens local to this wrapper so the exception does not affect the global Hearst+ theme.
  const videoDarkModeThemeClasses =
    "hearst-plus-theme bg-[var(--hp-background)] text-[var(--hp-text-primary)] [--background:#000000] [--foreground:#f8fbff] [--card:#181b20] [--card-foreground:#f4f7fb] [--popover:#181b20] [--popover-foreground:#f4f7fb] [--muted:#20242b] [--muted-foreground:#aab5c3] [--secondary:#20242b] [--secondary-foreground:#f4f7fb] [--accent:#232a33] [--accent-foreground:#dbe3ed] [--border:rgba(255,255,255,0.12)] [--input:rgba(255,255,255,0.16)] [--primary:#BDDDFC] [--primary-foreground:#0d1014] [--ring:#BDDDFC] [--hp-background:#000000] [--hp-surface-deep:#05070a] [--hp-surface-low:#181b20] [--hp-surface:#181b20] [--hp-control:#20242b] [--hp-control-hover:#2a3038] [--hp-chip:rgba(255,255,255,0.07)] [--hp-chip-border:rgba(255,255,255,0.08)] [--hp-border:rgba(255,255,255,0.12)] [--hp-border-strong:rgba(255,255,255,0.22)] [--hp-text-headline:#f8fbff] [--hp-text-primary:#f4f7fb] [--hp-text-ui:#dbe3ed] [--hp-text-chip:#cad5e2] [--hp-text-secondary:#aab5c3] [--hp-text-muted:#95a0ad] [--hp-sidebar-heading:#BDDDFC] [--hp-primary:#BDDDFC] [--hp-primary-soft:#253746] [--hp-friendly-accent:#253746] [--hp-friendly-accent-border:#BDDDFC] [--hp-friendly-accent-text:#BDDDFC] [--hp-focus:#BDDDFC] [--hp-signal:#BDDDFC] [--hp-action:#BDDDFC] [--hp-action-text:#0d1014] [--hp-shadow-card:0_2px_6px_rgba(0,0,0,0.18)] [--color-accent-foreground:var(--accent-foreground)] [--color-accent:var(--accent)] [--color-background:var(--background)] [--color-border:var(--border)] [--color-card-foreground:var(--card-foreground)] [--color-card:var(--card)] [--color-foreground:var(--foreground)] [--color-muted-foreground:var(--muted-foreground)] [--color-muted:var(--muted)] [--color-primary-foreground:var(--primary-foreground)] [--color-primary:var(--primary)] [--color-secondary-foreground:var(--secondary-foreground)] [--color-secondary:var(--secondary)]";

  if (isVideoQueueView) {
    return (
      <div
        className={cn(
          "space-y-6",
          useVideoDarkMode && videoDarkModeThemeClasses,
          usingVideoTabFeed &&
            "relative isolate bg-black py-4 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-black"
        )}
        data-mode={useVideoDarkMode ? "dark" : undefined}
      >
        <div
          className={cn(
            "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]",
            usingVideoTabFeed ? "mt-3 sm:mt-4" : "mt-6 sm:mt-8"
          )}
        >
          <LifestyleLeftSidebar
            profile={profile}
            topStories={filteredStories}
            topics={sidebarTopics}
            brands={sidebarBrands}
            brandFilterTitle={usingVideoTabFeed ? "Videos by brand" : undefined}
            activeBrandFilters={effectiveBrandFilters}
            collectionLabels={config.collectionLabels}
            onToggleBrandFilter={toggleBrandFilter}
            onClearBrandFilters={clearBrandFilters}
            onFollowTopic={followTopic}
            onOpenStory={(story) => openStory(story.id)}
          />

          <main
            className={cn("min-w-0 space-y-4", usingVideoTabFeed && "lg:pt-2")}
            aria-label={usingVideoTabFeed ? "Hearst videos" : "Autos video index"}
          >
            {featuredVideo ? (
              <>
                <VideoFeedLeadCard
                  story={featuredVideo}
                  saved={profile.savedIds.includes(featuredVideo.id)}
                  commentCount={getLifestyleCommentCount(featuredVideo, resolvedCommentsByStoryId[featuredVideo.id]?.length ?? 0)}
                  onOpen={() => openStory(featuredVideo.id)}
                  onSave={() => toggleSaved(featuredVideo)}
                  variant="videoIndex"
                  eyebrowLabel={usingVideoTabFeed ? "Recommended video" : undefined}
                />

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">Recommended videos</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {filteredStories.length} videos across {activeSourceNotes.map((note) => note.brand).join(" and ")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {remainingVideoStories.map((story) => (
                    <VideoIndexCard
                      key={story.id}
                      story={story}
                      saved={profile.savedIds.includes(story.id)}
                      commentCount={getLifestyleCommentCount(story, resolvedCommentsByStoryId[story.id]?.length ?? 0)}
                      onOpen={() => openStory(story.id)}
                      onSave={() => toggleSaved(story)}
                      onHide={() => hideStory(story.id)}
                      variant="videoIndex"
                    />
                  ))}
                </div>

                <div ref={sentinelRef} className="flex justify-center py-6">
                  {visibleCount < filteredStories.length ? (
                    <Button
                      variant="outline"
                      onClick={() => setVisibleCount((count) => Math.min(count + 4, filteredStories.length))}
                    >
                      Load more videos
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You&rsquo;re caught up on this video feed.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-8 text-center shadow-[var(--hp-shadow-card)]">
                <p className="text-2xl font-black">No videos in {activeFilter} yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clear a brand filter or switch back to For You to keep watching.
                </p>
              </div>
            )}
          </main>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:max-h-[calc(100dvh-136px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                Up next
              </p>
              <div className="mt-4 space-y-4">
                {videoStories.slice(1, 5).map((story) => (
                  <VideoRailCard
                    key={story.id}
                    story={story}
                    onOpen={() => openStory(story.id)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                Video source
              </p>
              <p className="mt-3 text-sm font-bold">
                {activeStoryPool.length} playable videos
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Pulled from {activeDataSourceCopy}
              </p>
            </div>

            <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                Why this queue
              </p>
              <div className="mt-4 space-y-4 text-sm">
                {activeLiveFeedStatus ? (
                  <div role="status">
                    <p className="inline-flex items-center gap-2 font-bold">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          activeLiveFeedStatus.isFallback ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        aria-hidden="true"
                      />
                      {activeLiveFeedStatus.isFallback ? "Cached videos" : "Current videos"}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Updated {formatLiveFeedUpdatedAt(activeLiveFeedStatus.fetchedAt)}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="font-bold">Active filter</p>
                  <p className="mt-1 text-muted-foreground">{activeFilter}</p>
                </div>
                <div>
                  <p className="font-bold">Brands</p>
                  <p className="mt-1 text-muted-foreground">
                    {effectiveBrandFilters.length > 0 ? effectiveBrandFilters.join(", ") : activeSourceNotes.map((note) => note.brand).join(", ")}
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
          availableStories={availableReaderStories}
          openStoryId={openStoryId}
          savedIds={profile.savedIds}
          followedBrands={profile.followedBrands}
          commentsByStoryId={resolvedCommentsByStoryId}
          readerReturnHref={storyOpenReturnHref}
          onClose={closeStory}
          onOpenStory={openStory}
          onSave={toggleSaved}
          onMoreLikeThis={boostStory}
          onToggleFollowBrand={toggleFollowBrand}
          onAddComment={addStoryComment}
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
          topStory={featuredVideo}
          config={config}
          activeFilter={activeFilter}
          stories={visibleStories}
          onDaypartChange={(daypart) =>
            setDemoState((current) => ({
              ...current,
              daypart,
              returnHours: demoDaypartReturnHours[daypart],
              contentDay: "today",
              previousLeadId: featuredVideo?.id ?? current.previousLeadId,
            }))
          }
          onSimulateReturn={simulateReturn}
          onApplyBehaviorPreset={applyBehaviorPreset}
          onResetDemo={resetDemo}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="sr-only">{pageHeading}</h1>
      <TodayEditDashboard
        stories={filteredStories}
        profile={profile}
        onOpenStory={openStory}
        onShowFollowedBrands={showFollowedBrands}
      />

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <LifestyleLeftSidebar
          profile={profile}
          topStories={filteredStories}
          topics={sidebarTopics}
          brands={sidebarBrands}
          activeBrandFilters={effectiveBrandFilters}
          collectionLabels={config.collectionLabels}
          onToggleBrandFilter={toggleBrandFilter}
          onClearBrandFilters={clearBrandFilters}
          onFollowTopic={followTopic}
          onOpenStory={(story) => openStory(story.id)}
        />

        <main className="min-w-0 space-y-4" aria-label={config.riverLabel}>
          {leadStory ? (
            <>
              <LifestyleLeadSlider
                stories={heroStories}
                savedIds={profile.savedIds}
                commentsByStoryId={resolvedCommentsByStoryId}
                onOpenStory={(story) => openStory(story.id)}
                onSave={toggleSaved}
                onMoreLikeThis={boostStory}
                onFollowBrand={followBrand}
              />

              {riverStories.map((story, index) => {
                const storyPosition = index + heroStories.length + 1;
                const shouldShowFeedModule = storyPosition % 5 === 0;
                const moduleSlotNumber = storyPosition / 5;
                const shouldShowBrandPromotion = shouldShowFeedModule && moduleSlotNumber % 2 === 0;
                const brandPromotion = shouldShowBrandPromotion
                  ? getBrandPromotionForSlot({
                      stories: filteredStories,
                      fallbackStories: rankedStories,
                      activeFilter,
                      slotNumber: moduleSlotNumber,
                      excludedBrandSlug: initialBrandSlug,
                    })
                  : null;
                const adMatch = shouldShowFeedModule && !shouldShowBrandPromotion
                  ? getContextualAdForSlot({
                      destination,
                      slotIndex: moduleSlotNumber - 1,
                      profile,
                      demoState,
                      config,
                      activeFilter,
                      stories: visibleStories,
                    })
                  : null;

                return (
                  <React.Fragment key={story.id}>
                    {getLifestyleCardKind(story) === "video" ? (
                      <VideoIndexCard
                        story={story}
                        saved={profile.savedIds.includes(story.id)}
                        commentCount={getLifestyleCommentCount(story, resolvedCommentsByStoryId[story.id]?.length ?? 0)}
                        onOpen={() => openStory(story.id)}
                        onSave={() => toggleSaved(story)}
                        onHide={() => hideStory(story.id)}
                        variant="hearstPlus"
                      />
                    ) : (
                      <LifestyleRiverCard
                        story={story}
                        saved={profile.savedIds.includes(story.id)}
                        commentCount={getLifestyleCommentCount(story, resolvedCommentsByStoryId[story.id]?.length ?? 0)}
                        onOpen={() => openStory(story.id)}
                        onSave={() => toggleSaved(story)}
                        onMoreLikeThis={() => boostStory(story)}
                        onHide={() => hideStory(story.id)}
                      />
                    )}
                    {adMatch ? (
                      <ContextualRiverAdCard
                        ad={adMatch.ad}
                        score={adMatch.score}
                        slotNumber={moduleSlotNumber}
                      />
                    ) : null}
                    {brandPromotion ? (
                      <BrandPromotionRiverModule
                        promotion={brandPromotion}
                        onOpenStory={openStory}
                      />
                    ) : null}
                  </React.Fragment>
                );
              })}

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
                    You&rsquo;re caught up on this river.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-8 text-center shadow-[var(--hp-shadow-card)]">
              <p className="headline text-2xl">No stories in {activeFilter} yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear a brand filter or switch back to For You to keep exploring.
              </p>
            </div>
          )}
        </main>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:max-h-[calc(100dvh-136px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
              Trending Across Brands
            </p>
            <ol className="mt-4 space-y-3">
              {filteredStories.slice(0, 5).map((story, index) => (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => openStory(story.id)}
                    className="group grid w-full grid-cols-[28px_minmax(0,1fr)] gap-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label={`Open story: ${story.title}`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold leading-none text-primary-foreground">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
                        {story.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{story.brand} · {story.topic}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
              Story Source
            </p>
            <p className="mt-3 text-sm font-bold">
              {activeStoryPool.length} real-image stories
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {demoState.contentDay === "nextDay" ? "Next-day demo edition generated from " : "Pulled from "}
              {config.dataSourceCopy}
            </p>
            {destination === "all" && !config.liveFeedStatus ? (
              <LinkComponent
                href="/hearst-plus/live-feed/"
                size="xs"
                className="mt-3 font-bold"
              >
                View live feed demo
              </LinkComponent>
            ) : null}
          </div>
          <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
              Why Your River Looks Like This
            </p>
            <div className="mt-4 space-y-4 text-sm">
              {config.liveFeedStatus ? (
                <div role="status">
                  <p className="inline-flex items-center gap-2 font-bold">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        config.liveFeedStatus.isFallback ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      aria-hidden="true"
                    />
                    {config.liveFeedStatus.isFallback ? "Cached stories" : "Current stories"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Updated {formatLiveFeedUpdatedAt(config.liveFeedStatus.fetchedAt)}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="font-bold">Demo moment</p>
                <p className="mt-1 text-muted-foreground">
                  {demoState.contentDay === "nextDay" ? "Next day edition · " : ""}
                  {config.dayparts[demoState.daypart].label}
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
                  {effectiveBrandFilters.length > 0 ? effectiveBrandFilters.join(", ") : "All brands"}
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
        availableStories={availableReaderStories}
          openStoryId={openStoryId}
        savedIds={profile.savedIds}
        followedBrands={profile.followedBrands}
        commentsByStoryId={resolvedCommentsByStoryId}
        readerReturnHref={storyOpenReturnHref}
        onClose={closeStory}
        onOpenStory={openStory}
        onSave={toggleSaved}
        onMoreLikeThis={boostStory}
        onToggleFollowBrand={toggleFollowBrand}
        onAddComment={addStoryComment}
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
        config={config}
        activeFilter={activeFilter}
        stories={visibleStories}
        onDaypartChange={(daypart) =>
          setDemoState((current) => ({
            ...current,
            daypart,
            returnHours: demoDaypartReturnHours[daypart],
            contentDay: "today",
            previousLeadId: leadStory?.id ?? current.previousLeadId,
          }))
        }
        onSimulateReturn={simulateReturn}
        onApplyBehaviorPreset={applyBehaviorPreset}
        onResetDemo={resetDemo}
      />

      <section
        className="grid gap-4 border-t border-border pt-8 lg:grid-cols-[minmax(0,1fr)_320px]"
        aria-labelledby="personalized-river-heading"
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--hp-section-title)]">
            Personalized Popular River
          </p>
          <h2 id="personalized-river-heading" className="headline text-4xl leading-tight sm:text-6xl">
            Most popular {config.storyRiverLabel}, tuned by what you do next.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-[var(--hp-text-ui)]">
            A continuously ranked {config.productName} feed across {config.brandSummary}
          </p>
        </div>
        <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
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
      </section>
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
  initialBrandSlug,
  liveFeedData,
  liveFeedMode = "replace",
  videoFeedData,
  initialFilter,
  initialOpenStoryId,
  readerReturnHref,
  navLinksOverride,
  staticDestinationData,
}: HomePageTemplateProps = {}) {
  const { brand, colorMode } = useTheme();
  const { account } = useReaderAccount();
  const router = useRouter();
  const pathname = usePathname();
  const destinationConfigs = React.useMemo(
    () => createDestinationConfigs(staticDestinationData),
    [staticDestinationData]
  );
  const [activeLifestyleFilter, setActiveLifestyleFilter] = React.useState(initialFilter ?? "For You");
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [onboardingResult, setOnboardingResult] = React.useState<HearstOnboardingResult | null>(null);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"create" | "signIn">("signIn");
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [pendingOnboardingResult, setPendingOnboardingResult] = React.useState<HearstOnboardingResult | null>(null);
  const [selectedBrand, setSelectedBrand] = React.useState<{ name: string; slug: string } | null>(() =>
    getBrandRouteInfo(destinationConfigs.all.sourceNotes, initialBrandSlug)
  );
  React.useEffect(() => {
    if (initialFilter) setActiveLifestyleFilter(initialFilter);
  }, [initialFilter]);
  const selectedBrandTheme = React.useMemo(
    () => getSelectedBrandTheme(selectedBrand, brand),
    [brand, selectedBrand]
  );
  const selectedBrandCssVars = React.useMemo(
    () => selectedBrandTheme ? brandToCssVars(selectedBrandTheme, colorMode) : undefined,
    [colorMode, selectedBrandTheme]
  );
  const homePageThemeCssVars = React.useMemo(
    () => ({
      ...selectedBrandCssVars,
      "--hp-section-title": selectedBrand?.slug === "autoweek"
        ? "#242424"
        : colorMode === "dark"
          ? "var(--primary)"
          : "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      "--hp-sidebar-heading": selectedBrand?.slug === "autoweek"
        ? "#242424"
        : colorMode === "dark"
          ? "var(--primary)"
          : "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      ...(colorMode === "dark"
        ? {
            "--primary": "var(--brand-primary, #BDDDFC)",
            "--primary-foreground": "#0d1014",
          }
        : {}),
    }),
    [colorMode, selectedBrand?.slug, selectedBrandCssVars]
  );
  const destinationContentRef = React.useRef<HTMLDivElement | null>(null);
  const isDestinationRiver = brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew";
  const destinationMode = getDestinationMode(selectedBrand?.slug ?? initialBrandSlug ?? brand.slug);
  const progressiveFeedBrandSlug = selectedBrand?.slug ?? getReaderOriginBrandSlug(readerReturnHref);
  const [resolvedVideoFeedData, setResolvedVideoFeedData] = React.useState(videoFeedData);
  React.useEffect(() => {
    setResolvedVideoFeedData(videoFeedData);
  }, [destinationMode, selectedBrand?.slug, videoFeedData]);
  React.useEffect(() => {
    if (!videoFeedData || liveFeedMode !== "blend") return;

    const controller = new AbortController();
    let idleCallbackId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const idleScheduler = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const waitForIdleTime = () => new Promise<void>((resolve) => {
      if (idleScheduler.requestIdleCallback) {
        idleCallbackId = idleScheduler.requestIdleCallback(() => resolve(), { timeout: 750 });
      } else {
        timeoutId = setTimeout(resolve, 150);
      }
    });
    const loadRemainingVideoPages = async () => {
      let offset = 0;
      let hasMore = true;

      while (hasMore && !controller.signal.aborted) {
        await waitForIdleTime();
        if (controller.signal.aborted) return;

        const searchParams = new URLSearchParams({
          destination: destinationMode,
          offset: String(offset),
          limit: "36",
        });
        if (progressiveFeedBrandSlug) searchParams.set("brandSlug", progressiveFeedBrandSlug);

        try {
          const response = await fetch(`/api/video-feed/?${searchParams.toString()}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`Progressive video feed returned ${response.status}`);
          const page = await response.json() as ProgressiveFeedPage;
          if (controller.signal.aborted) return;

          setResolvedVideoFeedData((currentFeed) => {
            const baseFeed = currentFeed ?? videoFeedData;
            return {
              ...baseFeed,
              stories: mergeUniqueStories(baseFeed.stories, page.stories),
            };
          });
          offset = page.nextOffset;
          hasMore = page.hasMore;
        } catch (error) {
          if (!controller.signal.aborted) {
            console.warn("Unable to progressively load the remaining videos.", error);
          }
          return;
        }
      }
    };

    void loadRemainingVideoPages();

    return () => {
      controller.abort();
      if (idleCallbackId !== undefined) idleScheduler.cancelIdleCallback?.(idleCallbackId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [
    destinationMode,
    liveFeedMode,
    progressiveFeedBrandSlug,
    videoFeedData,
  ]);
  const [progressiveEditorialStories, setProgressiveEditorialStories] = React.useState<LifestyleRiverStory[]>([]);
  React.useEffect(() => {
    setProgressiveEditorialStories([]);
  }, [destinationMode, progressiveFeedBrandSlug, staticDestinationData]);
  const shouldProgressivelyLoadEditorial = activeLifestyleFilter !== "Videos" && liveFeedMode === "blend";
  React.useEffect(() => {
    if (!shouldProgressivelyLoadEditorial) return;

    const controller = new AbortController();
    let idleCallbackId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const idleScheduler = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const waitForIdleTime = () => new Promise<void>((resolve) => {
      if (idleScheduler.requestIdleCallback) {
        idleCallbackId = idleScheduler.requestIdleCallback(() => resolve(), { timeout: 900 });
      } else {
        timeoutId = setTimeout(resolve, 180);
      }
    });
    const loadRemainingStoryPages = async () => {
      let offset = 0;
      let hasMore = true;

      while (hasMore && !controller.signal.aborted) {
        await waitForIdleTime();
        if (controller.signal.aborted) return;

        const searchParams = new URLSearchParams({
          destination: destinationMode,
          offset: String(offset),
          limit: "80",
        });
        if (progressiveFeedBrandSlug) searchParams.set("brandSlug", progressiveFeedBrandSlug);

        try {
          const response = await fetch(`/api/story-feed/?${searchParams.toString()}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`Progressive story feed returned ${response.status}`);
          const page = await response.json() as ProgressiveFeedPage;
          if (controller.signal.aborted) return;

          setProgressiveEditorialStories((currentStories) =>
            mergeUniqueStories(currentStories, page.stories)
          );
          offset = page.nextOffset;
          hasMore = page.hasMore;
        } catch (error) {
          if (!controller.signal.aborted) {
            console.warn("Unable to progressively load the remaining stories.", error);
          }
          return;
        }
      }
    };

    void loadRemainingStoryPages();

    return () => {
      controller.abort();
      if (idleCallbackId !== undefined) idleScheduler.cancelIdleCallback?.(idleCallbackId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [
    destinationMode,
    progressiveFeedBrandSlug,
    shouldProgressivelyLoadEditorial,
  ]);
  const rawBaseDestinationConfig = destinationConfigs[destinationMode];
  const baseDestinationConfig = React.useMemo<DestinationConfig>(() => ({
    ...rawBaseDestinationConfig,
    stories: mergeUniqueStories(rawBaseDestinationConfig.stories, progressiveEditorialStories),
  }), [progressiveEditorialStories, rawBaseDestinationConfig]);
  const hasScopedVideoFeed = React.useMemo(
    () => Boolean(resolvedVideoFeedData?.stories.some((story) => getLifestyleCardKind(story) === "video")),
    [resolvedVideoFeedData?.stories]
  );
  const destinationConfig = React.useMemo<DestinationConfig>(() => {
    if (!liveFeedData || liveFeedData.stories.length === 0) {
      return baseDestinationConfig;
    }

    if (liveFeedMode === "blend") {
      const blendedStories = mergeUniqueStories(
        baseDestinationConfig.stories,
        liveFeedData.stories,
        resolvedVideoFeedData?.stories ?? []
      );

      return {
        ...baseDestinationConfig,
        stories: blendedStories,
        dataSourceCopy: `${baseDestinationConfig.dataSourceCopy.replace(/\.$/, "")}, blended contextually with current Personalize article and playable video recommendations.`,
        liveFeedStatus: {
          fetchedAt: liveFeedData.fetchedAt,
          isFallback: liveFeedData.isFallback && (resolvedVideoFeedData?.isFallback ?? true),
        },
        liveFeedMode,
      };
    }

    const featuredFashionStory = destinationMode === "all"
      && !liveFeedData.productName?.includes("Video Feed")
      && !liveFeedData.productName?.includes("Complete Article Viewer")
      ? destinationConfigs.flux.stories.find(
          (story) => story.title === "The Best Dressed Celebrities at Paris Couture Week"
        )
      : undefined;
    const curatedLeadStory = featuredFashionStory
      ? {
          ...featuredFashionStory,
          id: `live-curated-${featuredFashionStory.id}`,
          popularity: 101,
          signal: "Editor Pick" as const,
          age: 0,
        }
      : undefined;
    const liveStories = curatedLeadStory
      ? [
          curatedLeadStory,
          ...liveFeedData.stories.filter((story) => story.sourceUrl !== curatedLeadStory.sourceUrl),
        ]
      : liveFeedData.stories;
    const liveSourceNotes = curatedLeadStory && !liveFeedData.sourceNotes.some((note) => note.brandSlug === curatedLeadStory.brandSlug)
      ? [
          {
            brand: curatedLeadStory.brand,
            brandSlug: curatedLeadStory.brandSlug,
            feedCount: 1,
            importedCount: 1,
            selectedCount: 1,
          },
          ...liveFeedData.sourceNotes,
        ]
      : liveFeedData.sourceNotes;

    return {
      ...baseDestinationConfig,
      productName: liveFeedData.productName ?? (destinationMode === "lifestyle" ? "Lifestyle Live" : baseDestinationConfig.productName),
      stories: liveStories,
      sourceNotes: liveSourceNotes,
      brandSummary: liveSourceNotes.map((note) => note.brand).join(", "),
      defaultLeadStoryId: liveStories[0]?.id,
      dataSourceCopy: curatedLeadStory
        ? `${liveFeedData.dataSourceCopy.replace(/\.$/, "")}, with an editor-selected Fashion & Luxury lead from Hearst RSS metadata.`
        : liveFeedData.dataSourceCopy,
      liveFeedStatus: {
        fetchedAt: liveFeedData.fetchedAt,
        isFallback: liveFeedData.isFallback,
      },
      liveFeedMode,
    };
  }, [baseDestinationConfig, destinationConfigs.flux.stories, destinationMode, liveFeedData, liveFeedMode, resolvedVideoFeedData]);
  const profileTopics = React.useMemo(
    () => Array.from(new Set(destinationConfig.stories.map((story) => story.topic))).sort(),
    [destinationConfig.stories]
  );
  const profileBrands = React.useMemo(
    () => destinationConfig.sourceNotes.map((note) => note.brand),
    [destinationConfig.sourceNotes]
  );
  const anchorDestinationContent = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      destinationContentRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, []);
  const anchorPageToTop = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);
  const handleLifestyleFilterChange = React.useCallback((filter: string) => {
    setActiveLifestyleFilter(filter);

    anchorDestinationContent();
  }, [anchorDestinationContent]);
  const handleSelectedBrandChange = React.useCallback((nextBrand: { name: string; slug: string } | null) => {
    if ((selectedBrand?.slug ?? null) === (nextBrand?.slug ?? null)) return;

    setActiveLifestyleFilter("For You");
    setSelectedBrand(nextBrand);

    const currentPath = window.location.pathname;
    if (nextBrand) {
      const nextPath = getHearstBrandRoute(nextBrand.slug);
      if (currentPath !== nextPath) router.push(nextPath, { scroll: false });
    } else if (
      currentPath.startsWith("/brands/")
      || currentPath.startsWith("/lifestyle/")
      || currentPath.startsWith("/autos/")
      || currentPath.startsWith("/flux/")
      || currentPath.startsWith("/ew/")
    ) {
      router.push(getHearstDestinationRoute("all"), { scroll: false });
    }
  }, [router, selectedBrand?.slug]);
  const useVideosDarkHeader = pathname.replace(/\/$/, "") === "/hearst-plus/videos"
    && !selectedBrand
    && activeLifestyleFilter === "Videos";

  return (
    <DestinationConfigsContext.Provider value={destinationConfigs}>
    <div
      className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] font-brand"
      data-filter-brand={selectedBrand?.slug}
      data-mode={colorMode}
      style={homePageThemeCssVars as React.CSSProperties}
    >
      {/* Utility Bar — full width */}
      <UtilityBar
        selectedBrand={selectedBrand}
        onCreateAccount={() => setOnboardingOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        darkMode={useVideosDarkHeader}
      />

      {/* Main Nav — full width background, content constrained */}
      <MainNav
        brandSlug={brand.slug}
        activeFilter={activeLifestyleFilter}
        onFilterChange={handleLifestyleFilterChange}
        selectedBrand={selectedBrand}
        navLinksOverride={navLinksOverride}
        includeVideos={hasScopedVideoFeed}
        darkMode={useVideosDarkHeader}
      />

      {/* Page Body — constrained by the shared PageContainer */}
      <PageContainer className={cn("relative", isDestinationRiver ? "pt-0" : "pt-8 lg:pt-12")}>
        {showGridOverlay && <GridOverlay />}
        <div
          ref={isDestinationRiver ? destinationContentRef : undefined}
          className={cn("relative scroll-mt-[75px]", isDestinationRiver ? "space-y-8" : "space-y-12 lg:space-y-16")}
        >
          {isDestinationRiver ? (
            <LifestyleRiverHydrationGate
              activeFilter={activeLifestyleFilter}
              destination={destinationMode}
              destinationConfig={destinationConfig}
              videoFeedData={resolvedVideoFeedData}
              initialBrandSlug={initialBrandSlug}
              initialOpenStoryId={initialOpenStoryId}
              readerReturnHref={readerReturnHref}
              onboardingResult={onboardingResult}
              onRiverReset={anchorDestinationContent}
              onBrandFilterChange={anchorPageToTop}
              onSelectedBrandChange={handleSelectedBrandChange}
            />
          ) : layout === "overlapGrid" ? (
            <OverlapGridHomepageBody brandSlug={brand.slug} />
          ) : (
            <ClassicHomepageBody brandSlug={brand.slug} />
          )}
        </div>
      </PageContainer>

      {isDestinationRiver ? (
        <HearstOnboardingModal
          open={onboardingOpen}
          destination={destinationMode}
          onClose={() => setOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setOnboardingResult(result);
            anchorDestinationContent();
          }}
          onRequestAuthentication={(mode, result) => {
            setPendingOnboardingResult(result);
            setOnboardingOpen(false);
            setAuthMode(mode);
            setAuthOpen(true);
          }}
        />
      ) : null}

      {isDestinationRiver ? (
        <>
          <ReaderAuthDialog
            open={authOpen}
            initialMode={authMode}
            defaultPreferences={pendingOnboardingResult ? {
              ...destinationConfig.initialProfile,
              followedTopics: pendingOnboardingResult.interests,
              followedBrands: pendingOnboardingResult.brands,
              savedTags: pendingOnboardingResult.tags,
              boostedTags: pendingOnboardingResult.tags,
              personalizationMode: "onboarding",
            } : destinationConfig.initialProfile}
            onClose={() => { setAuthOpen(false); setPendingOnboardingResult(null); }}
            onAuthenticated={() => {
              if (pendingOnboardingResult) {
                setOnboardingResult(pendingOnboardingResult);
                setActiveLifestyleFilter("For You");
                anchorDestinationContent();
              }
            }}
          />
          {account ? (
            <ReaderProfileDialog
              open={profileOpen}
              stories={destinationConfig.stories}
              topics={profileTopics}
              brands={profileBrands}
              onClose={() => setProfileOpen(false)}
            />
          ) : null}
        </>
      ) : null}

      {/* Footer — full width */}
      <Footer flushTop={isDestinationRiver && activeLifestyleFilter === "Videos"} />
    </div>
    </DestinationConfigsContext.Provider>
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
