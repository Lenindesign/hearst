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
  getHearstDestinationCategoryLabel,
  getHearstDestinationCategoryRoute,
  getHearstDestinationRoute,
} from "@/lib/hearst-routes";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
import { getHearstStoryRoute, normalizeReaderReturnHref } from "@/lib/story-routes";
import { themeOptions } from "@/lib/theme-options";
import { brandToCssVars } from "@/lib/theme-css-vars";
import type { BrandTheme } from "@/lib/brands";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ChevronUpIcon,
  ChefHat,
  Clock,
  EyeOff,
  ExternalLink,
  ImageIcon,
  Info,
  Mail,
  Menu,
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
  Volume2,
  VolumeX,
  X,
} from "@/components/ui/icons";
import {
  getBrandImages,
  getBaseContent,
  type BaseContentType,
} from "./homepage-data";
import type { LifestyleRiverProfile, LifestyleRiverStory } from "./lifestyle-river-types";
import type { LiveArticleData, LiveFeedData } from "@/lib/live-feed-types";
import { loadLiveArticle } from "@/lib/live-article-client-cache";
import { useReaderAccount } from "./reader-account";
import { ReaderAuthDialog, ReaderProfileDialog } from "./reader-account-ui";
import { AdaptiveVideo } from "./adaptive-video";
import { useProgressiveFeed } from "./hearst-plus/use-progressive-feed";
import {
  LifestylePersonalizationRulesGuide,
  LifestyleTechnologyGuide,
} from "./hearst-plus/lifestyle-technology-guide";
import { ReaderMastheadCarousel } from "./hearst-plus/reader-masthead-carousel";
import { hearstDestinationSections, UtilityBar } from "./hearst-plus/utility-bar";
import { useBodyPortalTarget, useModalIsolation } from "./ui/use-modal-isolation";
import {
  normalizeStorySearchText,
  searchLifestyleStories,
} from "@/lib/story-search";
import { mergeStableStoryOrder } from "@/lib/stable-story-order";
import {
  getContinueReadingStoryIds,
  readReadingHistory,
  readingHistoryChangedEvent,
  readingHistoryStorageKey,
  recordStoryOpened,
  recordStoryProgress,
  type ReadingHistoryEntry,
} from "@/lib/reading-history";
import {
  currentDailyEditionSelectionVersion,
  getLocalEditionDate,
  readDailyEditionRecords,
  resolveDailyEdition,
  writeDailyEditionRecords,
} from "@/lib/daily-edition";
import {
  readVisitRecords,
  resolveVisitContext,
  upsertVisitRecord,
  writeVisitRecords,
  type VisitDaypart,
} from "@/lib/visit-context";
import {
  getReturnWindow,
  markUsefulSession,
  trackProductEvent,
  trackProductEventOnce,
} from "@/lib/product-analytics";
import { getRecommendationReason } from "@/lib/recommendation-reason";
import {
  verifiedAmbientCommerceCollections,
  type VerifiedAmbientCommerceCollection,
} from "@/lib/ambient-commerce-catalog.generated";
import {
  allocateStoryModules,
  type TodayEditStorySelection,
} from "@/lib/story-module-allocation";

interface ContentType extends BaseContentType {
  footerCols: string[][];
}

const quietStoryActionButtonClass =
  "border-0 bg-transparent px-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-primary focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/30";

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

function useReadingHistoryState() {
  const [state, setState] = React.useState<{
    entries: ReadingHistoryEntry[];
    hydrated: boolean;
  }>({ entries: [], hydrated: false });

  React.useEffect(() => {
    const syncReadingHistory = () => {
      setState({ entries: readReadingHistory(), hydrated: true });
    };
    const syncStorageEvent = (event: StorageEvent) => {
      if (event.key === readingHistoryStorageKey) syncReadingHistory();
    };

    syncReadingHistory();
    window.addEventListener(readingHistoryChangedEvent, syncReadingHistory);
    window.addEventListener("storage", syncStorageEvent);
    return () => {
      window.removeEventListener(readingHistoryChangedEvent, syncReadingHistory);
      window.removeEventListener("storage", syncStorageEvent);
    };
  }, []);

  return state;
}

function useReadingHistoryEntries() {
  return useReadingHistoryState().entries;
}

function useContinueReadingStoryIds() {
  const entries = useReadingHistoryEntries();
  return React.useMemo(() => getContinueReadingStoryIds(entries), [entries]);
}

function useDailyEditionStories(
  editionKey: string,
  stories: LifestyleRiverStory[],
  editionSize = 6
) {
  const storyIdentityKey = stories.slice(0, 40).map((story) => story.id).join("|");
  const [storyIds, setStoryIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (!editionKey || stories.length === 0) {
        setStoryIds([]);
        return;
      }

      const records = resolveDailyEdition(
        readDailyEditionRecords(),
        editionKey,
        stories,
        Date.now(),
        editionSize,
        currentDailyEditionSelectionVersion
      );
      writeDailyEditionRecords(records);
      setStoryIds(records.find((record) => record.editionKey === editionKey)?.storyIds ?? []);
    });
    return () => {
      cancelled = true;
    };
  // The bounded identity key intentionally tracks the ranked candidates that can seed the edition.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editionKey, editionSize, storyIdentityKey]);

  return React.useMemo(
    () => storyIds
      .map((storyId) => stories.find((story) => story.id === storyId))
      .filter((story): story is LifestyleRiverStory => Boolean(story)),
    [stories, storyIds]
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
  initialOpenAmbientReader?: boolean;
  readerReturnHref?: string;
  navLinksOverride?: string[];
  staticDestinationData?: HearstDestinationStaticData;
  globalBrandInventory?: Record<string, number>;
  onboardingBrandInventory?: Record<string, number>;
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

function appendReaderReturnHref(storyId: string, returnHref: string | null) {
  const route = getHearstStoryRoute(storyId);
  const safeReturnHref = normalizeReaderReturnHref(returnHref);

  if (!safeReturnHref) return route;

  return `${route}?from=${encodeURIComponent(safeReturnHref)}`;
}

const readerReturnScrollStoragePrefix = "hearst-plus-reader-return-scroll:";
const readerRiverAllocationStoragePrefix = "hearst-plus-river-allocation:";

function getSessionContinueReadingStoryIds(scopeKey: string, editionDate: string) {
  const initialStoryIds = getContinueReadingStoryIds(readReadingHistory());

  if (typeof window === "undefined") return initialStoryIds;

  const storageKey = `${readerRiverAllocationStoragePrefix}${editionDate}:${scopeKey}`;

  try {
    const storedValue = window.sessionStorage.getItem(storageKey);
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      if (Array.isArray(parsed)) {
        const storedStoryIds = parsed.filter((storyId): storyId is string => typeof storyId === "string");
        // Preserve the current visit's stable allocation, while allowing a
        // story opened since the allocation was created to enter the queue.
        return [
          ...initialStoryIds.filter((storyId) => !storedStoryIds.includes(storyId)),
          ...storedStoryIds,
        ];
      }
    }

    window.sessionStorage.setItem(storageKey, JSON.stringify(initialStoryIds));
  } catch {
    // The river remains usable when session storage is unavailable.
  }

  return initialStoryIds;
}

interface ReaderReturnScrollSnapshot {
  href: string;
  scrollX: number;
  scrollY: number;
  storyId: string;
  storyIds: string[];
  createdAt: number;
}

function getReaderReturnScrollStorageKey(returnHref: string | null) {
  const safeReturnHref = normalizeReaderReturnHref(returnHref);

  if (!safeReturnHref) return null;

  return `${readerReturnScrollStoragePrefix}${safeReturnHref}`;
}

function saveReaderReturnScrollSnapshot(storyId: string, returnHref: string | null, storyIds: string[] = []) {
  if (typeof window === "undefined") return;

  const safeReturnHref = normalizeReaderReturnHref(returnHref);
  const storageKey = getReaderReturnScrollStorageKey(safeReturnHref);

  if (!safeReturnHref || !storageKey) return;

  const snapshot: ReaderReturnScrollSnapshot = {
    href: safeReturnHref,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    storyId,
    storyIds,
    createdAt: Date.now(),
  };

  window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
}

function readReaderReturnScrollSnapshot(returnHref: string | null): ReaderReturnScrollSnapshot | null {
  if (typeof window === "undefined") return null;

  const storageKey = getReaderReturnScrollStorageKey(returnHref);
  if (!storageKey) return null;

  try {
    const rawSnapshot = window.sessionStorage.getItem(storageKey);
    if (!rawSnapshot) return null;

    const snapshot = JSON.parse(rawSnapshot) as Partial<ReaderReturnScrollSnapshot>;
    const href = snapshot.href;
    const scrollX = snapshot.scrollX;
    const scrollY = snapshot.scrollY;
    const createdAt = snapshot.createdAt;
    const isValidSnapshot =
      typeof href === "string"
      && typeof scrollX === "number"
      && typeof scrollY === "number"
      && typeof createdAt === "number";

    if (!isValidSnapshot) {
      window.sessionStorage.removeItem(storageKey);
      return null;
    }

    const isStale = Date.now() - createdAt > 30 * 60 * 1000;
    if (isStale) {
      window.sessionStorage.removeItem(storageKey);
      return null;
    }

    return {
      href,
      scrollX,
      scrollY,
      storyId: snapshot.storyId ?? "",
      storyIds: Array.isArray(snapshot.storyIds)
        ? snapshot.storyIds.filter((storyId): storyId is string => typeof storyId === "string")
        : [],
      createdAt,
    };
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return null;
  }
}

function restoreReaderReturnScrollSnapshot(returnHref: string | null) {
  if (typeof window === "undefined") return;

  const snapshot = readReaderReturnScrollSnapshot(returnHref);
  const storageKey = getReaderReturnScrollStorageKey(returnHref);

  if (!snapshot) return;

  let attemptCount = 0;
  const attemptDelays = [0, 80, 200, 420];

  const restore = () => {
    const currentHref = `${window.location.pathname}${window.location.search}`;
    const isReturnPageVisible = currentHref === snapshot.href;
    const isFinalAttempt = attemptCount >= attemptDelays.length - 1;

    if (isReturnPageVisible || isFinalAttempt) {
      window.scrollTo(snapshot.scrollX, snapshot.scrollY);
      if (storageKey && isReturnPageVisible) {
        window.setTimeout(() => window.sessionStorage.removeItem(storageKey), 2000);
      }
      return;
    }

    attemptCount += 1;
    window.setTimeout(restore, attemptDelays[attemptCount]);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(restore);
  });
}

function applyReaderReturnStoryOrder(returnHref: string | null, candidateStoryIds: string[]) {
  const snapshot = readReaderReturnScrollSnapshot(returnHref);
  if (!snapshot?.storyIds.length) return candidateStoryIds;

  const candidateStoryIdSet = new Set(candidateStoryIds);
  const retainedStoryIds = snapshot.storyIds.filter((storyId) => candidateStoryIdSet.has(storyId));
  if (!retainedStoryIds.includes(snapshot.storyId)) return candidateStoryIds;

  const retainedStoryIdSet = new Set(retainedStoryIds);
  const appendedStoryIds = candidateStoryIds.filter((storyId) => !retainedStoryIdSet.has(storyId));

  return [...retainedStoryIds, ...appendedStoryIds];
}

function appendStakeholderDemoMode(path: string, enabled: boolean) {
  if (!enabled) return path;
  const url = new URL(path, "https://hearst.local");
  url.searchParams.set("demo", "1");
  return `${url.pathname}${url.search}${url.hash}`;
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

type LifestyleDemoDaypart = VisitDaypart;

type LifestyleDemoState = {
  daypart: LifestyleDemoDaypart;
  returnHours: number;
  contentDay: "today" | "nextDay";
  previousLeadId?: string;
  isSimulated: boolean;
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

function usesNativePublicationLogoColor(brandSlug: string) {
  return brandSlug === "car-and-driver";
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

const destinationPageNames: Record<DestinationMode, string> = {
  all: "Hearst+",
  lifestyle: "Hearst Lifestyle",
  autos: "Hearst Autos",
  flux: "Hearst Fashion & Luxury",
  ew: "Hearst Enthusiast & Wellness",
};

function getDestinationCategoryDocumentTitle(destination: DestinationMode, filter: string) {
  return `${filter} | ${destinationPageNames[destination]}`;
}
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
  brandInventoryCounts?: Record<string, number>;
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

function applyOnboardingPreferences(
  profile: LifestyleRiverProfile,
  stories: LifestyleRiverStory[],
  result: HearstOnboardingResult
): LifestyleRiverProfile {
  const signalTags = getOnboardingSignalTags(stories, result);

  return {
    ...profile,
    followedTopics: result.interests.length > 0 ? result.interests : profile.followedTopics,
    followedBrands: result.brands.length > 0 ? result.brands : profile.followedBrands,
    savedTags: signalTags,
    boostedTags: signalTags,
    personalizationMode: "onboarding",
  };
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
  const publicationFreshness =
    story.age <= 6
      ? 48
      : story.age <= 24
        ? 36
        : story.age <= 72
          ? 18
          : story.age <= 168
            ? 8
            : 0;

  return publicationFreshness + (freshSinceLastVisit ? 12 : 0);
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
  const defaultLead = !isOnboardingPersonalized && config.defaultLeadStoryId === story.id && isFirstMorningVisit ? 24 : 0;
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

function getLifestyleRecommendationReason(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle
) {
  const breakdown = getLifestyleScoreBreakdown(story, profile, demoState, config);
  const followedTopic = profile.followedTopics.find(
    (topic) => story.topic === topic || story.topic.startsWith(`${topic} `)
  );
  const followedBrand = profile.followedBrands.includes(story.brand) ? story.brand : undefined;

  return getRecommendationReason({
    freshSinceLastVisit: breakdown.returnFreshness > 0,
    newEdition: breakdown.nextDayNovelty > 0,
    followedTopic,
    followedBrand,
    daypart: breakdown.timeOfDay > 0 ? demoState.daypart : undefined,
    editorSelected: breakdown.defaultLead > 0,
  });
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

function getDelishShortsRiverInsertIndex({
  riverStories,
}: {
  riverStories: LifestyleRiverStory[];
}) {
  const leadingDelishStoryIndex = riverStories.findIndex((story) => story.brandSlug === "delish");

  return leadingDelishStoryIndex === -1 ? -1 : leadingDelishStoryIndex + 1;
}

function getStoryIdentity(story: LifestyleRiverStory) {
  const sourceUrl = story.sourceUrl?.trim().toLowerCase();
  if (sourceUrl) return `url:${sourceUrl}`;

  return `story:${story.brandSlug}:${story.title.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function getStoryVisualIdentity(story: LifestyleRiverStory) {
  return [
    "visual",
    story.brandSlug,
    story.title.trim().toLowerCase().replace(/\s+/g, " "),
    story.image.trim().toLowerCase(),
  ].join(":");
}

function mergeUniqueStories(...storyGroups: LifestyleRiverStory[][]) {
  const seen = new Set<string>();

  return storyGroups.flat().filter((story) => {
    const identities = [getStoryIdentity(story), getStoryVisualIdentity(story)];
    if (identities.some((identity) => seen.has(identity))) return false;
    identities.forEach((identity) => seen.add(identity));
    return true;
  });
}

function isDelishPortraitShort(story: LifestyleRiverStory) {
  return story.brandSlug === "delish"
    && Boolean(story.videoUrl)
    && Boolean(story.videoWidth)
    && Boolean(story.videoHeight)
    && (story.videoHeight ?? 0) > (story.videoWidth ?? 0);
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
  if (demoState.contentDay === "today" || !demoState.isSimulated) return config.stories;

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

const hearstDestinationNavHrefs = new Map(
  hearstDestinationSections
    .filter((section) => section.label !== "All")
    .map((section) => [section.label, section.href])
);
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
  brandInventory,
  onClose,
  onComplete,
  onCreateProfile,
  onSignIn,
}: {
  open: boolean;
  destination: DestinationMode;
  brandInventory?: Record<string, number>;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onCreateProfile: (result: HearstOnboardingResult) => void;
  onSignIn: () => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const config = destinationConfigs[destination];
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [completedResult, setCompletedResult] = React.useState<HearstOnboardingResult | null>(null);
  const [brandListAtEnd, setBrandListAtEnd] = React.useState(false);
  const portalTarget = useBodyPortalTarget();
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const contentScrollRef = React.useRef<HTMLDivElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = React.useRef(false);
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
        count: brandInventory?.[note.brandSlug] ?? counts[note.brand] ?? 0,
      }));
  }, [brandInventory, destinationConfigs.all]);
  React.useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => {
      const restoreTarget = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (!skipFocusRestoreRef.current) {
        window.requestAnimationFrame(() => restoreTarget?.focus());
      }
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

    const frame = window.requestAnimationFrame(() => {
      const contentScroller = contentScrollRef.current;
      if (contentScroller && contentScroller.scrollTop < 96) {
        contentScroller.scrollTop = 0;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, selectedInterests]);

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

  useModalIsolation(open && Boolean(portalTarget), dialogRef);

  if (!open || !portalTarget) return null;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : current.length < 2
          ? [...current, interest]
          : current
    );
  };
  const toggleBrand = (brandName: string) => {
    const brandOption = brandOptions.find((option) => option.brand === brandName);
    if (!brandOption || brandOption.count <= 0) return;
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
  const canContinueInterests = selectedInterests.length >= 1;
  const interestSelectionLabel = `${selectedInterests.length} of 2 selected`;
  const brandSelectionLabel = `${selectedBrands.length} selected`;
  const normalizedSelectedInterests = selectedInterests.map((interest) => interest.toLowerCase());
  const previewStories = normalizedSelectedInterests.length > 0
    ? (() => {
        const matchingStories = config.stories.filter((story) => {
          const searchableStory = [
            story.title,
            story.topic,
            story.brand,
            ...story.tags,
          ].join(" ").toLowerCase();

          return normalizedSelectedInterests.some((interest) => searchableStory.includes(interest));
        });
        const matchingStoryIds = new Set(matchingStories.map((story) => story.id));

        return [
          ...matchingStories,
          ...config.stories.filter((story) => !matchingStoryIds.has(story.id)),
        ].slice(0, 3);
      })()
    : [];
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
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
                Personalize your feed
              </p>
            </div>
            <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close onboarding">
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

        <div ref={contentScrollRef} className="min-h-0 flex-1 overflow-y-auto p-5 [overflow-anchor:none] sm:p-8">
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
                    Pick what you want to see more often.
                  </h2>
                  <p id="hearst-onboarding-description" className="mt-3 text-sm leading-6 text-muted-foreground">
                    Choose one or two interests. Your preview updates immediately.
                  </p>
                </div>
                <p className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-xs font-bold text-foreground">
                  {interestSelectionLabel}
                </p>
              </div>
              <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
                {interestOptions.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  const selectionLimitReached = selectedInterests.length >= 2 && !active;
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      disabled={selectionLimitReached}
                      className={cn(
                        "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        selectionLimitReached && "cursor-not-allowed opacity-45",
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
              <div className="mt-7 border-t border-border pt-6" aria-live="polite" aria-atomic="true">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Your feed preview
                </p>
                {previewStories.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {previewStories.map((story) => (
                      <article
                        key={story.id}
                        className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-[8px] border border-border bg-muted/25 p-2.5"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-[6px] bg-muted">
                          <Image
                            src={story.image}
                            alt=""
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 self-center">
                          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-wider text-primary">
                            {story.brand} · {story.topic}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5">
                            {story.title}
                          </h3>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-[8px] border border-dashed border-border bg-muted/20 px-4 py-5">
                    <p className="text-sm font-semibold">Choose an interest to preview your feed.</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      You can change these choices later from your profile.
                    </p>
                  </div>
                )}
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
                    Optional: choose the publications you return to most. Your feed will still discover across Hearst, while these voices get a stronger signal.
                  </p>
                </div>
                <p className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-xs font-bold text-foreground">
                  {brandSelectionLabel}
                </p>
              </div>
              <p className="mb-2 mt-6 text-xs font-semibold text-muted-foreground">
                Scroll to browse all {brandOptions.length} brands
              </p>
              <div className="relative">
                <div
                  role="region"
                  aria-label={`Choose from ${brandOptions.length} Hearst brands`}
                  tabIndex={0}
                  onScroll={(event) => {
                    const scroller = event.currentTarget;
                    setBrandListAtEnd(scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8);
                  }}
                  className="max-h-[min(42dvh,340px)] overflow-y-scroll overscroll-contain pr-1 [scrollbar-gutter:stable] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {brandOptions.map((brandOption) => {
                      const active = selectedBrands.includes(brandOption.brand);
                      const unavailable = brandOption.count <= 0;
                      return (
                        <button
                          key={brandOption.brandSlug}
                          type="button"
                          onClick={() => toggleBrand(brandOption.brand)}
                          disabled={unavailable}
                          className={cn(
                            "flex min-h-[64px] min-w-0 items-center gap-3 rounded-[8px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            unavailable && "cursor-not-allowed opacity-55",
                            active
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                          )}
                          aria-pressed={active}
                        >
                          <BrandSourceIcon brand={brandOption.brand} brandSlug={brandOption.brandSlug} className="h-8 w-8 rounded-[6px]" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">{brandOption.brand}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {unavailable ? "Unavailable in this demo" : `${brandOption.count} stories`}
                            </span>
                          </span>
                          {active ? (
                            <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-3 w-3" aria-hidden />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {!brandListAtEnd ? (
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex h-10 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-1"
                    aria-hidden="true"
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-xs font-semibold text-foreground">
                      More brands below
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
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
                Your For You page now reflects your selected interests and brands. Save it to a profile for access across devices, or keep reading with these choices in this browser.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {step === 1 ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={onClose}
                className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => {
                  skipFocusRestoreRef.current = true;
                  onSignIn();
                }}
                className="whitespace-nowrap text-sm font-semibold text-primary hover:underline"
              >
                Already have a profile? Sign in
              </button>
            </div>
          ) : step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Continue without an account
            </button>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            {step === 1 ? (
              <Button
                size="sm"
                onClick={() => setStep(2)}
                disabled={!canContinueInterests}
              >
                Continue
              </Button>
            ) : null}
            {step === 2 ? (
              <Button
                size="sm"
                onClick={() => {
                  const result = getResult();
                  setCompletedResult(result);
                  onComplete(result);
                  setStep(3);
                }}
              >
                Use this feed
              </Button>
            ) : null}
            {step === 3 ? (
              <Button
                size="sm"
                onClick={() => {
                  if (!completedResult) return;
                  skipFocusRestoreRef.current = true;
                  onCreateProfile(completedResult);
                }}
                disabled={!completedResult}
              >
                Save my feed
              </Button>
            ) : null}
          </div>
        </div>
        </div>
      </section>
    </div>,
    portalTarget
  );
}

export function MainNav({
  brandSlug,
  activeFilter,
  onFilterChange,
  selectedBrand,
  navLinksOverride,
  includeVideos,
  darkMode = false,
  mobileContinueStories = [],
  mobileBrands = [],
  searchStories = [],
  activeBrandFilters = [],
  onMobileStoryOpen,
  onMobileBrandToggle,
  onMobileBrandClear,
}: {
  brandSlug: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  selectedBrand?: { name: string; slug: string } | null;
  navLinksOverride?: string[];
  includeVideos?: boolean;
  darkMode?: boolean;
  mobileContinueStories?: LifestyleRiverStory[];
  mobileBrands?: { name: string; slug: string; count: number }[];
  searchStories?: LifestyleRiverStory[];
  activeBrandFilters?: string[];
  onMobileStoryOpen?: (storyId: string) => void;
  onMobileBrandToggle?: (brandName: string) => void;
  onMobileBrandClear?: () => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const { brand, colorMode, toggleColorMode } = useTheme();
  const [mastheadCompact, setMastheadCompact] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeSearchIndex, setActiveSearchIndex] = React.useState(0);
  const [overlayPortalTarget, setOverlayPortalTarget] = React.useState<HTMLElement | null>(null);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const mobileMenuTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const mobileMenuPanelRef = React.useRef<HTMLDivElement | null>(null);
  const mobileMenuDialogRef = React.useRef<HTMLDivElement | null>(null);
  const searchTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const searchPanelRef = React.useRef<HTMLDivElement | null>(null);
  const searchDialogRef = React.useRef<HTMLDivElement | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const restoreSearchTriggerFocus = React.useCallback(() => {
    let attempts = 0;
    const restore = () => {
      attempts += 1;
      const target = searchTriggerRef.current
        ?? document.querySelector<HTMLButtonElement>("[data-search-trigger]");
      if (target && document.contains(target)) {
        target.focus();
        return;
      }
      if (attempts < 4) window.setTimeout(restore, 50);
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(restore);
    });
  }, []);
  const closeMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => mobileMenuTriggerRef.current?.focus());
  }, [setMobileMenuOpen]);
  const closeSearch = React.useCallback(() => {
    setSearchOpen(false);
    restoreSearchTriggerFocus();
  }, [restoreSearchTriggerFocus, setSearchOpen]);
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
  const pinSavedOnMobile = isDestinationRiver && navLinks.includes("Saved");
  const normalizedSearchQuery = normalizeStorySearchText(deferredSearchQuery);
  const searchResults = React.useMemo(() => {
    return searchLifestyleStories(searchStories, deferredSearchQuery);
  }, [deferredSearchQuery, searchStories]);
  const activeSearchResultIndex = searchResults.length > 0
    ? Math.min(activeSearchIndex, searchResults.length - 1)
    : 0;
  useModalIsolation(mobileMenuOpen && Boolean(overlayPortalTarget), mobileMenuDialogRef);
  useModalIsolation(searchOpen && Boolean(overlayPortalTarget), searchDialogRef);

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

  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleMenuKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        mobileMenuPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleMenuKeyboard);
    window.requestAnimationFrame(() => {
      mobileMenuPanelRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => {
      window.removeEventListener("keydown", handleMenuKeyboard);
    };
  }, [closeMobileMenu, mobileMenuOpen]);

  React.useEffect(() => {
    if (!searchOpen) return;

    const handleSearchKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        searchPanelRef.current?.querySelectorAll<HTMLElement>(
          'input, a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleSearchKeyboard);
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", handleSearchKeyboard);
    };
  }, [closeSearch, searchOpen]);

  const shouldUseNativeLogoColor = usesNativePublicationLogoColor(mastheadSlug);
  const mobileMastheadSlug = !selectedBrand && mastheadSlug === "hearst-ew"
    ? "hearst-eandw"
    : !selectedBrand && mastheadSlug === "hearst-flux"
      ? "hearst-flux-compact"
      : mastheadSlug;
  const usesCompactMobileDestinationMark = mobileMastheadSlug !== mastheadSlug;
  const mastheadHearstGeometry = selectedBrand
    ? {
        compact: "h-[20px] max-w-[275px] sm:h-[28.75px] sm:max-w-[500px]",
        regular: "h-[27.5px] max-w-[350px] sm:h-[42.5px] sm:max-w-[725px]",
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
  const logoColor = darkMode || (selectedBrand && colorMode === "dark")
    ? "#ffffff"
    : selectedBrand
    ? mastheadSlug === "motortrend"
      ? "#e90c17"
      : mastheadSlug === "hot-rod"
      ? "#c11b17"
      : mastheadSlug === "cosmopolitan"
      ? "#d70000"
      : shouldUseNativeLogoColor
      ? undefined
      : "#121212"
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
    const hidePinnedSavedOnMobile = pinSavedOnMobile && link === "Saved";
    const destinationHref = brand.slug === "hearst-all" ? hearstDestinationNavHrefs.get(link) : undefined;
    const categoryHref = isDestinationRiver && !selectedBrand
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
        className={cn(
          "min-h-11 whitespace-nowrap border-b-2 border-transparent px-0.5 font-normal hover:no-underline md:min-h-0 md:pb-1",
          navLinkClasses,
          hidePinnedSavedOnMobile && "max-md:hidden"
        )}
      >
        {link}
      </LinkComponent>
    ) : categoryHref ? (
      <LinkComponent
        key={link}
        href={categoryHref}
        onClick={(event) => {
          if (!onFilterChange) return;
          event.preventDefault();
          onFilterChange(link);
        }}
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
            : "",
          hidePinnedSavedOnMobile && "max-md:hidden"
        )}
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
            : navLinkClasses,
          hidePinnedSavedOnMobile && "max-md:hidden"
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
        className={cn(
          "min-h-11 whitespace-nowrap font-normal md:min-h-0",
          hidePinnedSavedOnMobile && "max-md:hidden"
        )}
      >
        {link}
      </LinkComponent>
    );
  });

  const showMobileDiscoveryMenu = isDestinationRiver && mobileBrands.length > 0;

  const mobileMenu = mobileMenuOpen && overlayPortalTarget ? createPortal(
    <div ref={mobileMenuDialogRef} className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true" aria-label="Hearst discovery menu">
      <div
        className="absolute inset-0 bg-black/45"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
      <div ref={mobileMenuPanelRef} className={cn(
        "absolute inset-y-0 left-0 flex w-[min(91vw,400px)] flex-col overflow-hidden border-r shadow-xl",
        darkMode ? "border-white/10 bg-[#0d1014] text-[#f4f7fb]" : "border-border bg-background text-foreground"
      )}>
        <div className={cn("flex min-h-20 items-center justify-between border-b px-5", darkMode ? "border-white/10" : "border-border")}>
          <div>
            <p className="text-sm font-black">Explore Hearst+</p>
            <p className={cn("mt-0.5 text-xs", darkMode ? "text-white/65" : "text-muted-foreground")}>Pick up a story or filter your feed.</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={closeMobileMenu}
            className={cn("h-11 w-11", darkMode ? "text-white hover:bg-white/10 hover:text-white" : undefined)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
          <section aria-labelledby="mobile-continue-reading-title">
            <div className="flex items-center justify-between gap-4">
              <h2 id="mobile-continue-reading-title" className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
                Continue Reading
              </h2>
              <span className={cn("text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>Your queue</span>
            </div>
            <div className="mt-4 space-y-2">
              {mobileContinueStories.length > 0 ? mobileContinueStories.slice(0, 3).map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    onMobileStoryOpen?.(story.id);
                  }}
                  className={cn(
                    "group flex min-h-20 w-full items-center gap-3 rounded-[8px] p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    darkMode ? "hover:bg-white/[0.06]" : "hover:bg-muted/60"
                  )}
                  aria-label={`Open story: ${story.title}`}
                >
                  <span
                    className="h-16 w-20 shrink-0 rounded-[6px] bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url("${story.image}")` }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-sm font-bold leading-snug group-hover:text-primary">{story.title}</span>
                    <span className={cn("mt-1 block text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>{story.brand}</span>
                  </span>
                </button>
              )) : (
                <p className={cn(
                  "rounded-[8px] border px-3 py-4 text-sm leading-relaxed",
                  darkMode ? "border-white/10 bg-white/[0.03] text-white/65" : "border-border bg-muted/35 text-muted-foreground"
                )}>
                  Stories you open will appear here until you finish them.
                </p>
              )}
            </div>
          </section>

          <section className={cn("mt-7 border-t pt-6", darkMode ? "border-white/10" : "border-border")} aria-labelledby="mobile-filter-brands-title">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="mobile-filter-brands-title" className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
                  Filter Brands
                </h2>
                <p className={cn("mt-1 text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>{mobileBrands.length} brands</p>
              </div>
              {activeBrandFilters.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    onMobileBrandClear?.();
                    closeMobileMenu();
                  }}
                  className="min-h-11 px-1 text-xs font-bold text-[var(--hp-section-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  Show all
                </button>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mobileBrands.map((mobileBrand) => {
                const active = activeBrandFilters.includes(mobileBrand.name);
                return (
                  <button
                    key={mobileBrand.name}
                    type="button"
                    onClick={() => {
                      onMobileBrandToggle?.(mobileBrand.name);
                      closeMobileMenu();
                    }}
                    disabled={mobileBrand.count === 0}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-14 min-w-0 items-center gap-2 rounded-[8px] border px-2.5 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : darkMode
                          ? "border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                          : "border-border bg-background hover:border-primary/45 hover:bg-muted/40",
                      mobileBrand.count === 0 && "cursor-not-allowed opacity-45"
                    )}
                  >
                    <BrandSourceIcon brand={mobileBrand.name} brandSlug={mobileBrand.slug} className="h-6 w-6 rounded-[4px]" />
                    <span className="min-w-0 flex-1 truncate">{mobileBrand.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className={cn("border-t px-5 py-3", darkMode ? "border-white/10" : "border-border")}>
          <button
            type="button"
            onClick={toggleColorMode}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-[8px] px-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              darkMode ? "hover:bg-white/[0.06]" : "hover:bg-muted/50"
            )}
          >
            {colorMode === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            Switch to {colorMode === "dark" ? "light" : "dark"} mode
          </button>
        </div>
      </div>
    </div>,
    overlayPortalTarget
  ) : null;

  const openSearchStory = (story: LifestyleRiverStory) => {
    closeSearch();
    onMobileStoryOpen?.(story.id);
  };
  const searchDialog = searchOpen && overlayPortalTarget ? createPortal(
    <div ref={searchDialogRef} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="hearst-search-title">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeSearch}
        aria-hidden="true"
        data-search-backdrop
      />
      <div
        ref={searchPanelRef}
        data-search-panel
        className={cn(
          "absolute inset-x-3 top-16 mx-auto max-h-[calc(100dvh-5rem)] w-auto max-w-2xl overflow-hidden rounded-[8px] border border-t-4 shadow-xl sm:top-24",
          darkMode ? "border-white/15 border-t-[#BDDDFC] bg-[#0d1014] text-[#f4f7fb]" : "border-border border-t-primary bg-background text-foreground"
        )}
      >
        <div className={cn("flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6", darkMode ? "border-white/10" : "border-border")}>
          <div>
            <h2
              id="hearst-search-title"
              className={cn(
                "text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest",
                darkMode ? "text-[#BDDDFC]" : "text-primary"
              )}
            >
              Search Hearst+
            </h2>
            <p className={cn("mt-1.5 text-sm", darkMode ? "text-white/65" : "text-muted-foreground")}>
              Search stories by title, brand, topic, or tag.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={closeSearch}
            className={cn("h-11 w-11 shrink-0", darkMode ? "text-white hover:bg-white/10 hover:text-white" : undefined)}
            aria-label="Close search"
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="px-4 pt-4 sm:px-6">
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setActiveSearchIndex(0);
            }}
            onClear={() => {
              setSearchQuery("");
              setActiveSearchIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveSearchIndex((current) => searchResults.length ? (current + 1) % searchResults.length : 0);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveSearchIndex((current) => searchResults.length ? (current - 1 + searchResults.length) % searchResults.length : 0);
              } else if (event.key === "Enter" && searchResults[activeSearchResultIndex]) {
                event.preventDefault();
                openSearchStory(searchResults[activeSearchResultIndex]);
              }
            }}
            leadingIcon={Search}
            placeholder="Try ‘Goodwood’, ‘Cosmopolitan’, or ‘Fitness’"
            aria-label="Search Hearst stories"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="hearst-search-results"
            aria-activedescendant={searchResults[activeSearchResultIndex] ? `hearst-search-result-${activeSearchResultIndex}` : undefined}
            autoComplete="off"
            className={cn(darkMode && "[&_div]:border-white/20 [&_div]:bg-white/[0.06] [&_input]:text-white [&_input]:placeholder:text-white/45")}
          />
        </div>

        <div className="min-h-0 overflow-y-auto px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
          <div className="flex items-center justify-between gap-4 pb-3">
            <p className={cn(
              "text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest",
              darkMode ? "text-[#BDDDFC]" : "text-primary"
            )}>
              {normalizedSearchQuery ? "Search results" : "Popular now"}
            </p>
            <p className={cn("text-xs", darkMode ? "text-white/60" : "text-muted-foreground")} aria-live="polite">
              {searchResults.length} {searchResults.length === 1 ? "story" : "stories"}
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div id="hearst-search-results" role="listbox" aria-label="Story suggestions" className={cn("divide-y", darkMode ? "divide-white/10" : "divide-border")}>
              {searchResults.map((story, index) => (
                <button
                  key={story.id}
                  id={`hearst-search-result-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeSearchResultIndex}
                  onMouseEnter={() => setActiveSearchIndex(index)}
                  onFocus={() => setActiveSearchIndex(index)}
                  onClick={() => openSearchStory(story)}
                  className={cn(
                    "group flex min-h-20 w-full items-center gap-3 border-l-2 border-l-transparent px-2 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
                    index === activeSearchResultIndex
                      ? darkMode ? "border-l-[#BDDDFC] bg-white/[0.07]" : "border-l-primary bg-muted/40"
                      : darkMode ? "hover:bg-white/[0.04]" : "hover:bg-muted/30"
                  )}
                >
                  <span
                    className="h-16 w-20 shrink-0 rounded-[6px] bg-muted bg-cover bg-center sm:w-24"
                    style={{ backgroundImage: `url("${story.image}")` }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-sm font-bold leading-snug group-hover:text-primary sm:text-base">{story.title}</span>
                    <span className={cn("mt-1 block truncate text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>
                      {story.brand} · {story.topic} · {getLifestyleByline(story)}
                    </span>
                  </span>
                  <ChevronRight className={cn("h-4 w-4 shrink-0", darkMode ? "text-white/45" : "text-muted-foreground")} aria-hidden />
                </button>
              ))}
            </div>
          ) : (
            <div id="hearst-search-results" role="status" className={cn("rounded-[8px] border border-dashed px-5 py-10 text-center", darkMode ? "border-white/15" : "border-border")}>
              <p className="font-bold">No stories match “{searchQuery.trim()}”</p>
              <p className={cn("mt-1 text-sm", darkMode ? "text-white/60" : "text-muted-foreground")}>Try a different title, brand, topic, or tag.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    overlayPortalTarget
  ) : null;

  return (
    <>
    <div className={cn("flex h-20 border-b sm:h-24", darkMode ? "border-white/10 bg-[#0d1014] text-[#f4f7fb]" : "border-border bg-[var(--hp-surface)]")}>
      <PageContainer className="flex items-center justify-between">
        <div className="flex w-10 shrink-0 justify-start sm:w-[var(--width-sidebar-narrow)]">
          {showMobileDiscoveryMenu ? (
            <Button
              ref={mobileMenuTriggerRef}
              variant="outline"
              size="icon-sm"
              className={cn(
                "h-11 w-11 sm:hidden",
                darkMode ? "border-white/20 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white" : undefined
              )}
              onClick={() => {
                setOverlayPortalTarget(document.body);
                setSearchOpen(false);
                setMobileMenuOpen(true);
              }}
              aria-label="Open reading and brand menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 sm:h-7 sm:w-7",
              showMobileDiscoveryMenu && "hidden sm:inline-flex",
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
            ref={searchTriggerRef}
            data-search-trigger
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 sm:h-7 sm:w-7",
              darkMode ? "border-white/20 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white" : undefined
            )}
            aria-label="Search"
            title="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              setOverlayPortalTarget(document.body);
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
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
      <PageContainer as="nav" className="flex items-center gap-3 py-2 md:justify-center">
        <div className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto scrollbar-hide md:flex-none md:justify-center">
          {renderNavLinks()}
        </div>
        {pinSavedOnMobile ? (
          <button
            type="button"
            onClick={() => onFilterChange?.("Saved")}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-1.5 border-l pl-3 text-sm font-semibold transition-colors md:hidden",
              darkMode
                ? "border-white/15 text-white hover:text-[#BDDDFC]"
                : "border-border text-foreground hover:text-primary",
              activeFilter === "Saved" && (darkMode ? "text-[#BDDDFC]" : "text-[var(--hp-section-title)]")
            )}
            aria-current={activeFilter === "Saved" ? "page" : undefined}
          >
            <Bookmark className="h-4 w-4" aria-hidden />
            Saved
          </button>
        ) : null}
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
    {mobileMenu}
    {searchDialog}
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
        <Divider variant="default" size="sm" className="bg-primary" />
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
          aria-label={`Email address for ${brand.name}'s newsletter`}
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

function Footer({
  flushTop = false,
  socialFinePrintNote,
}: {
  flushTop?: boolean;
  socialFinePrintNote?: string;
}) {
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
        finePrintNote="Prototype only. Uses public story metadata and browser-local demo state; not a production account, access, or publishing surface."
        socialFinePrintNote={socialFinePrintNote}
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const imageKey = `${story.id}-${story.image}`;
  const [loadedImageKey, setLoadedImageKey] = React.useState<string | null>(null);
  const loaded = loadedImageKey === imageKey;

  return (
    <Image
      key={imageKey}
      src={story.image}
      alt={`${story.brand}: ${story.title}`}
      width={1200}
      height={675}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 640px"
      className={cn(
        "min-w-0 bg-muted object-cover",
        prefersReducedMotion ? "" : "transition-opacity duration-300 ease-out",
        loaded || priority ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ objectPosition: getLifestyleImagePosition(story) }}
      preload={priority}
      onLoad={() => setLoadedImageKey(imageKey)}
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

function getLifestyleByline(story: LifestyleRiverStory, article?: LiveArticleData) {
  return article?.byline || story.byline || `${story.brand} editors`;
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
                color={usesNativePublicationLogoColor(promotion.brandSlug) ? undefined : "currentColor"}
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

  if (isExplicitGalleryStory(story)) return "gallery";
  if (storyHasPlayableVideo(story)) return "video";
  if (story.topic.startsWith("Food")) return "recipe";
  if (isYearMakeModelStory(story)) return "recipe";
  if (/shopping|products|tested|best|buy|sale|deals|favorite|picks/.test(searchable)) return "shopping";
  if (story.topic === "Buying Guides" || story.topic === "Auctions") return "shopping";
  if (/photos|gallery|style|jeans|rooms|decorating|porch|garden|designers|living room|classic|collector|auction/.test(searchable) || story.age % 5 === 0) return "gallery";

  return "article";
}

function isExplicitGalleryStory(story: LifestyleRiverStory) {
  const searchable = [
    story.id,
    story.topic,
    story.title,
    story.sourceUrl ?? "",
    ...story.tags,
  ].join(" ").toLowerCase();

  return /\b(?:photos?|photo-gallery|gallery|galleries)\b|\/photos\//.test(searchable);
}

function ensureGallerySampleInRiver(
  riverStories: LifestyleRiverStory[],
  displayStories: LifestyleRiverStory[],
  excludedStoryIds: Set<string>,
  enabled: boolean
) {
  if (!enabled || riverStories.some(isExplicitGalleryStory)) return riverStories;

  const gallerySample = displayStories.find((story) =>
    isExplicitGalleryStory(story)
    && !excludedStoryIds.has(story.id)
    && !riverStories.some((riverStory) => riverStory.id === story.id)
  );

  if (!gallerySample) return riverStories;

  const nextStories = [...riverStories];
  nextStories.splice(Math.min(2, nextStories.length), 0, gallerySample);
  return nextStories;
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

function formatReaderPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date(value));
}

function formatReaderUpdatedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(new Date(value));
}

function isMeaningfulArticleUpdate(publishedAt: string | undefined, updatedAt: string | undefined) {
  const publishedTime = Date.parse(publishedAt ?? "");
  const updatedTime = Date.parse(updatedAt ?? "");
  return Number.isFinite(publishedTime)
    && Number.isFinite(updatedTime)
    && updatedTime - publishedTime >= 15 * 60 * 1000;
}

function ReaderPublicationDates({
  publishedAt,
  updatedAt,
  className,
}: {
  publishedAt?: string;
  updatedAt?: string;
  className?: string;
}) {
  const hasPublishedDate = Number.isFinite(Date.parse(publishedAt ?? ""));
  const hasUpdatedDate = isMeaningfulArticleUpdate(publishedAt, updatedAt);
  if (!hasPublishedDate) return null;

  return (
    <p className={cn("flex flex-wrap gap-x-3 gap-y-1 text-[length:var(--text-token-4xs)] leading-5 text-muted-foreground", className)}>
      <time dateTime={publishedAt}>{formatReaderPublishedDate(publishedAt!)}</time>
      {hasUpdatedDate ? (
        <span>
          Updated <time dateTime={updatedAt}>{formatReaderUpdatedDate(updatedAt!)}</time>
        </span>
      ) : null}
    </p>
  );
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
        <AdaptiveVideo
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

type GalleryPreviewState =
  | { status: "loading" }
  | { status: "ready"; images: FullscreenReaderImage[] }
  | { status: "unavailable" };

const richGalleryImageMinimum = 5;
const galleryPreviewCache = new Map<string, GalleryPreviewState>();
const galleryPreviewRequests = new Map<string, Promise<GalleryPreviewState>>();

function getGalleryPreviewImages(story: LifestyleRiverStory, article: LiveArticleData) {
  const images: FullscreenReaderImage[] = [{
    src: story.image,
    alt: `${story.brand}: ${story.title}`,
  }];

  article.blocks.forEach((block) => {
    if (block.type !== "image" || images.some((image) => image.src === block.url)) return;
    images.push({
      src: block.url,
      alt: block.alt,
      caption: block.caption,
      credit: block.credit,
    });
  });

  return images;
}

function loadGalleryPreview(story: LifestyleRiverStory) {
  const cached = galleryPreviewCache.get(story.id);
  if (cached) return Promise.resolve(cached);

  const activeRequest = galleryPreviewRequests.get(story.id);
  if (activeRequest) return activeRequest;

  if (!story.sourceUrl) {
    const unavailable = { status: "unavailable" } satisfies GalleryPreviewState;
    galleryPreviewCache.set(story.id, unavailable);
    return Promise.resolve(unavailable);
  }

  const request = loadLiveArticle(story.sourceUrl)
    .then((article) => {
      const images = getGalleryPreviewImages(story, article);
      return images.length >= richGalleryImageMinimum
        ? { status: "ready", images } satisfies GalleryPreviewState
        : { status: "unavailable" } satisfies GalleryPreviewState;
    })
    .catch(() => ({ status: "unavailable" }) satisfies GalleryPreviewState)
    .then((result) => {
      galleryPreviewCache.set(story.id, result);
      galleryPreviewRequests.delete(story.id);
      return result;
    });

  galleryPreviewRequests.set(story.id, request);
  return request;
}

function useGalleryPreview(story: LifestyleRiverStory, enabled: boolean) {
  const previewKey = `${story.id}:${enabled ? "enabled" : "disabled"}`;
  const initialPreview = galleryPreviewCache.get(story.id)
    ?? (enabled ? { status: "loading" } : { status: "unavailable" });
  const [previewState, setPreviewState] = React.useState<{
    key: string;
    preview: GalleryPreviewState;
  }>(() => ({ key: previewKey, preview: initialPreview }));
  const preview = previewState.key === previewKey
    ? previewState.preview
    : initialPreview;

  React.useEffect(() => {
    if (!enabled) return;
    let active = true;
    void loadGalleryPreview(story).then((result) => {
      if (active) setPreviewState({ key: previewKey, preview: result });
    });

    return () => {
      active = false;
    };
  }, [enabled, previewKey, story]);

  return preview;
}

export function LifestyleStoryActions({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  onMoreLikeThis,
  onHide,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  onHide: () => void;
}) {
  return (
    <div className="relative z-20 mt-5 flex flex-wrap gap-x-5 gap-y-2" onClick={(event) => event.stopPropagation()}>
      <Button
        variant="ghost"
        size="xs"
        className={cn(quietStoryActionButtonClass, saved && "text-primary hover:text-primary")}
        onClick={onSave}
        aria-pressed={saved}
      >
        <Bookmark className="h-3.5 w-3.5" weight={saved ? "fill" : "regular"} aria-hidden />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        className={quietStoryActionButtonClass}
        onClick={onMoreLikeThis}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
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
  );
}

function LifestyleRecommendationReason({ reason }: { reason?: string }) {
  if (!reason) return null;

  return (
    <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
      {reason}
    </p>
  );
}

export function RichPhotoGalleryCard({
  story,
  images,
  recommendationReason,
  saved,
  commentCount,
  onOpen,
  onSave,
  onMoreLikeThis,
  onHide,
}: {
  story: LifestyleRiverStory;
  images: FullscreenReaderImage[];
  recommendationReason?: string;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  onHide: () => void;
}) {
  const visibleImages = images.slice(0, richGalleryImageMinimum);
  const remainingImageCount = Math.max(0, images.length - visibleImages.length);

  return (
    <article
      className="group/card relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50"
      data-story-module="river"
      data-story-id={story.id}
    >
      <button
        type="button"
        onClick={onOpen}
        className="peer absolute inset-0 z-10 rounded-[8px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
        aria-label={`Open photo gallery: ${story.title}`}
      />

      <div className="relative min-w-0 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {story.signal}
          </span>
          <LifestyleBrandSource story={story} />
          <span className="inline-flex items-center gap-1 text-[length:var(--text-token-4xs)] font-semibold text-muted-foreground">
            <Camera className="h-3.5 w-3.5" aria-hidden />
            {images.length} photos
          </span>
        </div>
        <h2 className="headline break-words text-2xl leading-tight transition-colors group-hover/card:text-primary group-focus-within/card:text-primary sm:text-3xl">
          {story.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {story.summary}
        </p>
        <LifestyleRecommendationReason reason={recommendationReason} />
      </div>

      <div
        className="grid h-[300px] min-w-0 grid-cols-6 grid-rows-[minmax(0,1.35fr)_minmax(0,1fr)] gap-px bg-border sm:h-[440px]"
        aria-label={`${images.length} photos from ${story.title}`}
      >
        {visibleImages.map((image, index) => (
          <div
            key={image.src}
            className={cn(
              "relative min-w-0 overflow-hidden bg-muted",
              index < 2 ? "col-span-3" : "col-span-2"
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={index < 2
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 34vw, 320px"
                : "(max-width: 640px) 33vw, (max-width: 1024px) 22vw, 220px"}
              className="object-cover transition-transform duration-300 group-hover/card:scale-[1.01]"
            />
            {index === visibleImages.length - 1 && remainingImageCount > 0 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl font-bold text-white sm:text-4xl">
                +{remainingImageCount}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative min-w-0 px-4 pb-4 sm:px-5 sm:pb-5">
        <LifestyleStoryActions
          story={story}
          saved={saved}
          commentCount={commentCount}
          onOpen={onOpen}
          onSave={onSave}
          onMoreLikeThis={onMoreLikeThis}
          onHide={onHide}
        />
      </div>
    </article>
  );
}

export function LifestyleRiverCard({
  story,
  recommendationReason,
  saved,
  commentCount,
  onOpen,
  onSave,
  onMoreLikeThis,
  onHide,
  featured = false,
}: {
  story: LifestyleRiverStory;
  recommendationReason?: string;
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
  const galleryPreview = useGalleryPreview(story, kind === "gallery" && isExplicitGalleryStory(story));

  if (galleryPreview.status === "ready") {
    return (
      <RichPhotoGalleryCard
        story={story}
        images={galleryPreview.images}
        recommendationReason={recommendationReason}
        saved={saved}
        commentCount={commentCount}
        onOpen={onOpen}
        onSave={onSave}
        onMoreLikeThis={onMoreLikeThis}
        onHide={onHide}
      />
    );
  }

  return (
    <article
      className={cn(
        "group/card relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50",
        isVideo
          ? "grid"
        : featured
          ? "grid items-stretch 2xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]"
          : "grid gap-0 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4 sm:p-4"
      )}
      data-story-module="river"
      data-story-id={story.id}
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
        <LifestyleRecommendationReason reason={recommendationReason} />
        <LifestyleCardModule story={story} kind={kind} />
        <LifestyleStoryActions
          story={story}
          saved={saved}
          commentCount={commentCount}
          onOpen={onOpen}
          onSave={onSave}
          onMoreLikeThis={onMoreLikeThis}
          onHide={onHide}
        />
      </div>
    </article>
  );
}

export function VideoPlaySurface({
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
        <AdaptiveVideo
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

export function VideoFeedLeadCard({
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

export function VideoIndexCard({
  story,
  recommendationReason,
  saved,
  commentCount,
  onOpen,
  onSave,
  onHide,
  variant = "videoIndex",
}: {
  story: LifestyleRiverStory;
  recommendationReason?: string;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onHide: () => void;
  variant?: "videoIndex" | "hearstPlus";
}) {
  const useHearstPlusStyle = variant === "hearstPlus";

  return (
    <article
      className="group overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50"
      data-story-module="river"
      data-story-id={story.id}
    >
      <VideoPlaySurface story={story} featured />
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} className="h-5 w-5" />
          <span className="truncate normal-case tracking-normal text-muted-foreground">
            {story.brand}
            {story.topic ? ` · ${story.topic}` : ""}
            {` · ${getLifestyleByline(story)}`}
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
        <LifestyleRecommendationReason reason={recommendationReason} />
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

export function VideoRailCard({
  story,
  onOpen,
  rank,
}: {
  story: LifestyleRiverStory;
  onOpen: () => void;
  rank?: number;
}) {
  return (
    <button
      type="button"
      className="group grid w-full grid-cols-[96px_minmax(0,1fr)] gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
      onClick={onOpen}
      aria-label={rank ? `Trending video ${rank}: ${story.title}` : `Open video: ${story.title}`}
    >
      <span className="relative aspect-video overflow-hidden rounded-[6px] bg-muted">
        <Image src={story.image} alt="" fill sizes="96px" className="object-cover" />
        {rank ? (
          <span className="absolute left-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black tabular-nums text-primary-foreground shadow-sm">
            {rank}
          </span>
        ) : null}
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

type VerticalVideoCarouselProps = {
  stories: LifestyleRiverStory[];
  onOpen: (story: LifestyleRiverStory) => void;
  onSupplementalStories?: (stories: LifestyleRiverStory[]) => void;
  theme?: "dark" | "light";
  brandName?: string;
  brandSlug?: string;
  title?: string;
  summaryLabel?: string;
  filterBrandSlug?: string;
};

export function VerticalVideoCarousel({
  stories,
  onOpen,
  onSupplementalStories,
  theme = "dark",
  brandName,
  brandSlug,
  title,
  summaryLabel = "vertical",
  filterBrandSlug,
}: VerticalVideoCarouselProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const supplementalRequestRef = React.useRef<string | null>(null);
  const titleId = React.useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canScrollBackward, setCanScrollBackward] = React.useState(false);
  const [canScrollForward, setCanScrollForward] = React.useState(false);
  const [supplementalStories, setSupplementalStories] = React.useState<LifestyleRiverStory[]>([]);
  const requestedBrandSlug = filterBrandSlug;
  const availableStories = React.useMemo(
    () => mergeUniqueStories(stories, supplementalStories),
    [stories, supplementalStories]
  );
  const portraitStories = React.useMemo(
    () => availableStories.filter((story) =>
      (!filterBrandSlug || story.brandSlug === filterBrandSlug)
      && Boolean(story.videoUrl)
      && Boolean(story.videoWidth)
      && Boolean(story.videoHeight)
      && (story.videoHeight ?? 0) > (story.videoWidth ?? 0)
    ),
    [availableStories, filterBrandSlug]
  );
  const firstStory = portraitStories[0];
  const displayBrandName = brandName ?? firstStory?.brand ?? "Hearst";
  const displayBrandSlug = brandSlug ?? firstStory?.brandSlug ?? "hearst-all";
  const displayTitle = title ?? `${displayBrandName} Shorts`;

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || !requestedBrandSlug || supplementalRequestRef.current === requestedBrandSlug) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      supplementalRequestRef.current = requestedBrandSlug;

      const params = new URLSearchParams({
        destination: "all",
        brandSlug: requestedBrandSlug,
        offset: "0",
        limit: "48",
      });

      void fetch(`/api/video-feed/?${params.toString()}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Video feed returned ${response.status}`);
          return response.json() as Promise<{ stories?: LifestyleRiverStory[] }>;
        })
        .then((payload) => {
          const nextStories = Array.isArray(payload.stories) ? payload.stories : [];
          setSupplementalStories(nextStories);
          onSupplementalStories?.(nextStories);
        })
        .catch(() => {
          supplementalRequestRef.current = null;
        });
    }, { rootMargin: "240px 0px" });

    observer.observe(section);
    return () => observer.disconnect();
  }, [onSupplementalStories, requestedBrandSlug]);

  const updateScrollState = React.useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    setCanScrollBackward(scroller.scrollLeft > 2);
    setCanScrollForward(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const frame = window.requestAnimationFrame(updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateScrollState);
    };
  }, [portraitStories.length, updateScrollState]);

  const scrollCarousel = (direction: -1 | 1) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const firstCard = scroller.firstElementChild as HTMLElement | null;
    const cardStep = firstCard ? firstCard.offsetWidth + 12 : Math.max(180, scroller.clientWidth * 0.75);
    scroller.scrollBy({
      left: direction * cardStep * 2,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  if (portraitStories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        theme === "light"
          ? "rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] sm:p-5"
          : "border-y border-white/10 py-5"
      )}
      aria-labelledby={titleId}
      data-testid="vertical-video-carousel"
      data-publication={displayBrandSlug}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <BrandSourceIcon brand={displayBrandName} brandSlug={displayBrandSlug} className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <h2
              id={titleId}
              className={cn(
                "text-lg font-black leading-tight sm:text-xl",
                theme === "light" ? "text-foreground" : "text-[var(--hp-text-headline)]"
              )}
            >
              {displayTitle}
            </h2>
            <p
              className={cn("mt-0.5 text-xs", theme === "light" ? "text-muted-foreground" : "text-[var(--hp-text-secondary)]")}
              role="status"
              aria-live="polite"
            >
              {portraitStories.length} {summaryLabel} {portraitStories.length === 1 ? "video" : "videos"}
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex" aria-label={`${displayTitle} carousel controls`}>
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            disabled={!canScrollBackward}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-35",
              theme === "light" ? "bg-background hover:bg-muted" : "bg-[var(--hp-control)] hover:bg-[var(--hp-control-hover)]"
            )}
            aria-label={`Previous ${displayTitle}`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            disabled={!canScrollForward}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-35",
              theme === "light" ? "bg-background hover:bg-muted" : "bg-[var(--hp-control)] hover:bg-[var(--hp-control-hover)]"
            )}
            aria-label={`Next ${displayTitle}`}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={`Vertical videos from ${displayBrandName}`}
      >
        {portraitStories.map((story) => (
          <article key={story.id} className="w-[164px] shrink-0 snap-start sm:w-[180px]" role="listitem">
            <button
              type="button"
              onClick={() => onOpen(story)}
              className="group block w-full text-left focus-visible:outline-none"
              aria-label={`Open ${story.brand} short: ${story.title}`}
            >
              <span
                className={cn(
                  "relative block aspect-[9/16] overflow-hidden rounded-[8px] bg-[var(--hp-surface-low)] shadow-[var(--hp-shadow-card)] transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-primary/60 motion-reduce:transition-none",
                  theme === "light" ? "border border-border" : "border border-white/10"
                )}
              >
                <Image
                  src={story.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 164px, 180px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                />
                <span className="absolute bottom-2 left-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-transform group-hover:scale-105" aria-hidden>
                  <Play className="ml-0.5 h-3.5 w-3.5" weight="fill" />
                </span>
                {story.videoDuration ? (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2 py-1 text-[10px] font-bold tabular-nums text-white">
                    {formatVideoDuration(story.videoDuration)}
                  </span>
                ) : null}
              </span>
              <span className={cn("mt-2.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 transition-colors group-hover:text-primary", theme === "light" ? "text-foreground" : "text-[var(--hp-text-primary)]")}>
                {story.title}
              </span>
              <span className={cn("mt-1 block text-xs font-semibold", theme === "light" ? "text-muted-foreground" : "text-[var(--hp-text-secondary)]")}>
                {story.brand} · {story.topic}
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DelishVerticalVideoCarousel({
  stories,
  onOpen,
  onSupplementalStories,
  theme = "dark",
}: Pick<VerticalVideoCarouselProps, "stories" | "onOpen" | "onSupplementalStories" | "theme">) {
  return (
    <VerticalVideoCarousel
      stories={stories}
      onOpen={onOpen}
      onSupplementalStories={onSupplementalStories}
      theme={theme}
      brandName="Delish"
      brandSlug="delish"
      title="Delish Shorts"
      summaryLabel="vertical recipe"
      filterBrandSlug="delish"
    />
  );
}

function DelishShortsImmersiveModal({
  stories,
  openStoryId,
  savedIds,
  onClose,
  onSelectStory,
  onOpenStory,
  onSave,
}: {
  stories: LifestyleRiverStory[];
  openStoryId: string | null;
  savedIds: string[];
  onClose: () => void;
  onSelectStory: (storyId: string) => void;
  onOpenStory: (storyId: string) => void;
  onSave: (story: LifestyleRiverStory) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const shortsScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollFrameRef = React.useRef<number | null>(null);
  const scrollSelectionSourceRef = React.useRef<"scroll" | "programmatic" | null>(null);
  const swipeInstructionsId = React.useId();
  const [playing, setPlaying] = React.useState(true);
  const [muted, setMuted] = React.useState(true);
  const activeIndex = stories.findIndex((story) => story.id === openStoryId);
  const activeStory = activeIndex >= 0 ? stories[activeIndex] : null;
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < stories.length - 1;

  const selectStoryAtIndex = React.useCallback((nextIndex: number, behavior: ScrollBehavior = "smooth") => {
    const nextStory = stories[nextIndex];
    if (!nextStory) return;

    scrollSelectionSourceRef.current = "programmatic";
    setPlaying(true);
    onSelectStory(nextStory.id);
    const scroller = shortsScrollerRef.current;
    if (scroller) {
      scroller.scrollTo({
        top: nextIndex * scroller.clientHeight,
        behavior,
      });
    }
  }, [onSelectStory, stories]);

  const selectRelativeStory = React.useCallback((direction: -1 | 1) => {
    selectStoryAtIndex(activeIndex + direction);
  }, [activeIndex, selectStoryAtIndex]);

  const togglePlayback = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  const handleShortsScroll = React.useCallback(() => {
    if (scrollFrameRef.current !== null) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const scroller = shortsScrollerRef.current;
      if (!scroller) return;

      const itemHeight = Math.max(scroller.clientHeight, 1);
      const nextIndex = Math.max(0, Math.min(stories.length - 1, Math.round(scroller.scrollTop / itemHeight)));
      const nextStory = stories[nextIndex];
      if (!nextStory || nextStory.id === openStoryId) return;

      scrollSelectionSourceRef.current = "scroll";
      setPlaying(true);
      onSelectStory(nextStory.id);
    });
  }, [onSelectStory, openStoryId, stories]);

  React.useEffect(() => {
    const scroller = shortsScrollerRef.current;
    if (!scroller || activeIndex < 0) return;

    if (scrollSelectionSourceRef.current === "scroll") {
      scrollSelectionSourceRef.current = null;
      return;
    }

    scroller.scrollTo({
      top: activeIndex * scroller.clientHeight,
      behavior: "auto",
    });
    scrollSelectionSourceRef.current = null;
  }, [activeIndex, stories.length]);

  React.useEffect(() => {
    if (!activeStory) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        selectRelativeStory(-1);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectRelativeStory(1);
        return;
      }
      if (event.key === " " && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        togglePlayback();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyboard);
    window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLButtonElement>('[data-delish-short-close]')?.focus();
    });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [activeStory, onClose, selectRelativeStory, togglePlayback]);

  React.useEffect(() => () => {
    if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  if (!activeStory || typeof document === "undefined") return null;

  const saved = savedIds.includes(activeStory.id);
  const controlButtonClass = "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-30";

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[260] overflow-hidden bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delish-short-title"
      aria-describedby={swipeInstructionsId}
      data-testid="delish-shorts-immersive-modal"
    >
      <p id={swipeInstructionsId} className="sr-only">
        Swipe up for the next Delish Short or swipe down for the previous one. You can also use the up and down arrow keys.
      </p>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="pointer-events-auto flex min-w-0 items-center gap-2 rounded-full bg-black/70 px-3 py-2 ring-1 ring-inset ring-white/10">
          <BrandSourceIcon brand="Delish" brandSlug="delish" className="h-6 w-6 shrink-0" />
          <span className="truncate text-sm font-black">Delish Shorts</span>
          <span className="text-xs text-white/60">{activeIndex + 1}/{stories.length}</span>
        </div>
        <button
          type="button"
          data-delish-short-close
          onClick={onClose}
          className={cn(controlButtonClass, "pointer-events-auto bg-black/70")}
          aria-label="Close Delish Shorts viewer"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex h-full items-center justify-center gap-4 px-0 sm:px-4">
        <div
          data-testid="delish-short-swipe-surface"
          className={cn(
            "relative max-h-[100dvh] select-none overflow-hidden bg-[#111] sm:max-h-[calc(100dvh-32px)] sm:rounded-[14px] sm:ring-1 sm:ring-inset sm:ring-white/10"
          )}
          style={{
            width: "min(100vw, calc((100dvh - 32px) * 9 / 16))",
            aspectRatio: "9 / 16",
          }}
          onDragStart={(event) => event.preventDefault()}
        >
          <div
            ref={shortsScrollerRef}
            data-testid="delish-short-scroll-snap-track"
            className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={handleShortsScroll}
          >
            {stories.map((story, index) => {
              const isActive = index === activeIndex;
              const shouldRenderVideo = Math.abs(index - activeIndex) <= 1;

              return (
                <div
                  key={story.id}
                  className="relative h-full snap-start snap-always overflow-hidden"
                  aria-hidden={!isActive}
                >
                  {shouldRenderVideo ? (
                    <AdaptiveVideo
                      ref={isActive ? videoRef : undefined}
                      src={story.videoUrl}
                      poster={story.image}
                      autoPlay={isActive && playing}
                      muted={muted}
                      playsInline
                      preload="auto"
                      className="h-full w-full cursor-pointer bg-black object-contain"
                      aria-label={`Delish Short: ${story.title}`}
                      onClick={() => isActive && togglePlayback()}
                      onPlay={() => isActive && setPlaying(true)}
                      onPause={() => isActive && setPlaying(false)}
                      onEnded={() => isActive && selectRelativeStory(1)}
                    />
                  ) : (
                    <Image
                      src={story.image}
                      alt=""
                      fill
                      sizes="min(100vw, 56vh)"
                      className="object-contain"
                      aria-hidden="true"
                    />
                  )}

                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/75 p-4 pb-5 pr-16 sm:p-5 sm:pr-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/75">
                      <BrandSourceIcon brand="Delish" brandSlug="delish" className="h-5 w-5" />
                      <span>Delish · {story.topic}</span>
                      {story.videoDuration ? <span>· {formatVideoDuration(story.videoDuration)}</span> : null}
                    </div>
                    <h2
                      id={isActive ? "delish-short-title" : undefined}
                      className="mt-2 line-clamp-2 text-lg font-black leading-tight sm:text-xl"
                    >
                      {story.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => onOpenStory(story.id)}
                      tabIndex={isActive ? 0 : -1}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[6px] text-sm font-bold text-white underline decoration-white/45 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:min-h-0"
                      aria-label={`Read the full story: ${story.title}`}
                    >
                      <BookOpenText className="h-4 w-4" aria-hidden />
                      Read the full story
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-36 right-3 z-30 flex flex-col gap-3 sm:hidden">
            <button type="button" onClick={() => onSave(activeStory)} className={controlButtonClass} aria-label={saved ? "Remove saved short" : "Save short"} aria-pressed={saved}>
              <Bookmark className="h-5 w-5" weight={saved ? "fill" : "regular"} aria-hidden />
            </button>
            <button type="button" onClick={() => setMuted((value) => !value)} className={controlButtonClass} aria-label={muted ? "Unmute short" : "Mute short"} aria-pressed={!muted}>
              {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
            </button>
            <button type="button" onClick={togglePlayback} className={controlButtonClass} aria-label={playing ? "Pause short" : "Play short"} aria-pressed={playing}>
              {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" weight="fill" aria-hidden />}
            </button>
          </div>
        </div>

        <div className="hidden flex-col items-center gap-3 sm:flex" aria-label="Delish Shorts viewer controls">
          <button type="button" onClick={() => selectRelativeStory(-1)} disabled={!hasPrevious} className={controlButtonClass} aria-label="Previous Delish Short">
            <ChevronUpIcon className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => selectRelativeStory(1)} disabled={!hasNext} className={controlButtonClass} aria-label="Next Delish Short">
            <ChevronDown className="h-5 w-5" aria-hidden />
          </button>
          <span className="my-1 h-px w-7 bg-white/15" aria-hidden />
          <button type="button" onClick={() => onSave(activeStory)} className={controlButtonClass} aria-label={saved ? "Remove saved short" : "Save short"} aria-pressed={saved}>
            <Bookmark className="h-5 w-5" weight={saved ? "fill" : "regular"} aria-hidden />
          </button>
          <button type="button" onClick={() => setMuted((value) => !value)} className={controlButtonClass} aria-label={muted ? "Unmute short" : "Mute short"} aria-pressed={!muted}>
            {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
          </button>
          <button type="button" onClick={togglePlayback} className={controlButtonClass} aria-label={playing ? "Pause short" : "Play short"} aria-pressed={playing}>
            {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" weight="fill" aria-hidden />}
          </button>
        </div>
      </div>
    </div>,
    document.body
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
    .filter((story) => !/\.(?:mov|mp4|m4v|webm)$/i.test(story.title.trim()))
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
  editionLabel,
  initialStoryId,
  savedIds,
  commentsByStoryId,
  onOpenStory,
  onSave,
  onMoreLikeThis,
  onFollowBrand,
  onEditionImpression,
  onEditionStoryOpen,
  indicatorPalette,
}: {
  stories: LifestyleRiverStory[];
  editionLabel?: string;
  initialStoryId?: string;
  savedIds: string[];
  commentsByStoryId: Record<string, LifestyleStoryComment[]>;
  onOpenStory: (story: LifestyleRiverStory) => void;
  onSave: (story: LifestyleRiverStory) => void;
  onMoreLikeThis: (story: LifestyleRiverStory) => void;
  onFollowBrand: (brandName: string) => void;
  onEditionImpression?: () => void;
  onEditionStoryOpen?: (story: LifestyleRiverStory, position: number) => void;
  indicatorPalette?: readonly string[];
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const initialIndex = initialStoryId
      ? stories.findIndex((story) => story.id === initialStoryId)
      : 0;
    return Math.max(0, initialIndex);
  });
  const [paused, setPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const swipeStartRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeLastRef = React.useRef<{ x: number; y: number } | null>(null);
  const suppressSlideClickRef = React.useRef(false);
  const swipeInstructionsId = React.useId();
  const activeStory = stories[activeIndex] ?? stories[0];
  React.useEffect(() => {
    if (editionLabel) onEditionImpression?.();
  }, [editionLabel, onEditionImpression]);
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
      aria-label={editionLabel ?? "Featured stories"}
      aria-describedby={swipeInstructionsId}
      data-story-module={editionLabel ? "todays-picks" : "featured"}
    >
      <p id={swipeInstructionsId} className="sr-only">
        Swipe left or right to move between {editionLabel ? editionLabel : "featured stories"}.
      </p>
      <div
        className="relative w-full min-w-0 touch-pan-y select-none overflow-hidden bg-black"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetSwipe}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={cn(
            "flex w-full ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
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
                className="relative grid w-full shrink-0 grid-rows-[auto_112px] bg-black text-left text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 sm:grid-rows-[auto_144px]"
                onClick={(event) => {
                  if (suppressSlideClickRef.current) {
                    event.preventDefault();
                    return;
                  }
                  onEditionStoryOpen?.(story, index + 1);
                  onOpenStory(story);
                }}
                aria-label={`Open story: ${story.title}`}
                aria-hidden={index !== activeIndex}
                inert={index !== activeIndex ? true : undefined}
                tabIndex={index === activeIndex ? 0 : -1}
                data-feed-source={isCurrentFeedStory(story) ? "current" : "editorial"}
                data-media-kind={story.videoUrl ? "video" : "article"}
                data-story-id={story.id}
              >
                <div className="relative isolate">
                  <div className="relative h-[min(128vw,520px)] w-full overflow-hidden sm:h-auto sm:aspect-video">
                    <LifestyleRiverImage
                      story={story}
                      className="h-full w-full"
                      priority={index === 0}
                    />
                    <div
                      aria-hidden="true"
                      data-slider-layer="gradient"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.18)_30%,rgba(0,0,0,0.78)_72%,#000_100%)] sm:h-[220px] xl:h-[240px]"
                    />
                  </div>
                </div>
                <div data-slider-layer="frame" className="bg-black" />
                <div data-slider-content className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
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
                    story.brandSlug === "house-beautiful"
                      ? "pb-[0.12em] leading-[1.12]"
                      : story.brandSlug === "road-and-track"
                        ? "leading-[1.12]"
                        : "leading-[1.08]"
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
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-sm font-bold text-white backdrop-blur"
            aria-label={editionLabel
              ? `${editionLabel}, story ${activeIndex + 1} of ${stories.length}`
              : `Story ${activeIndex + 1} of ${stories.length}`}
          >
            {editionLabel ? (
              <>
                <span>{editionLabel}</span>
                <span aria-hidden>·</span>
              </>
            ) : null}
            <span>{activeIndex + 1} of {stories.length}</span>
          </span>
          <div
            className="flex items-center gap-1.5"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {stories.length > 1 ? (
              <button
                type="button"
                className="hidden h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:inline-flex"
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
                className="hidden h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:inline-flex"
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
                style={indicatorPalette?.length
                  ? { backgroundColor: indicatorPalette[index % indicatorPalette.length] }
                  : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all motion-reduce:transition-none",
                  index === activeIndex ? "w-8" : "w-4",
                  !indicatorPalette?.length && (index === activeIndex ? "bg-primary" : "bg-muted-foreground/30")
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Button
            variant="ghost"
            size="xs"
            className={cn(
              quietStoryActionButtonClass,
              "h-11 sm:h-6",
              saved && "text-primary hover:text-primary"
            )}
            onClick={() => onSave(activeStory)}
            aria-pressed={saved}
          >
            <Bookmark className="hidden h-3.5 w-3.5 sm:block" weight={saved ? "fill" : "regular"} aria-hidden />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className={cn(quietStoryActionButtonClass, "h-11 sm:h-6")}
            onClick={() => onMoreLikeThis(activeStory)}
          >
            <Plus className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
            More like this
          </Button>
          <span className="inline-flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              className="h-11 sm:h-6"
              onClick={() => onFollowBrand(activeStory.brand)}
              aria-label={`Follow ${activeStory.brand}`}
            >
              <span className="sm:hidden">Follow</span>
              <span className="hidden sm:inline">Follow {activeStory.brand}</span>
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

function getReadyLiveArticle(liveArticle?: LiveArticleLoadState) {
  return liveArticle?.status === "ready" ? liveArticle.data : undefined;
}

export type FullscreenReaderImage = {
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
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(gallery.initialIndex);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [zoomOrigin, setZoomOrigin] = React.useState("50% 50%");
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const [captionOpen, setCaptionOpen] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [imageVisible, setImageVisible] = React.useState(true);
  const controlsTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerPositionsRef = React.useRef(new Map<number, { x: number; y: number }>());
  const dragStartRef = React.useRef<{ x: number; y: number; time: number; offsetX: number; offsetY: number } | null>(null);
  const pinchStartRef = React.useRef<{ distance: number; zoom: number } | null>(null);
  const lastTapRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const activeImage = gallery.images[activeIndex] ?? gallery.images[0];
  const hasMultipleImages = gallery.images.length > 1;
  useModalIsolation(true, dialogRef);

  const resetTransform = React.useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setZoomOrigin("50% 50%");
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

  const toggleTapZoom = React.useCallback((clientX: number, clientY: number) => {
    if (zoom <= 1) {
      setZoomOrigin(`${(clientX / window.innerWidth) * 100}% ${(clientY / window.innerHeight) * 100}%`);
    }
    setClampedZoom(zoom > 1 ? 1 : 2.5);
    if (zoom > 1) {
      setOffset({ x: 0, y: 0 });
      setZoomOrigin("50% 50%");
    }
  }, [setClampedZoom, zoom]);

  React.useEffect(() => {
    if (playing) return;
    const frame = window.requestAnimationFrame(showControls);
    return () => window.cancelAnimationFrame(frame);
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
      dragStartRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp, offsetX: offset.x, offsetY: offset.y };
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
      const distanceY = event.clientY - dragStart.y;
      if (Math.abs(distanceX) > 70 && Math.abs(distanceX) > Math.abs(distanceY) * 1.35) {
        selectImage(activeIndex + (distanceX < 0 ? 1 : -1));
      }
    }
    if (pointerPositionsRef.current.size === 1 && dragStart) {
      const distanceX = event.clientX - dragStart.x;
      const distanceY = event.clientY - dragStart.y;
      const isTap = Math.hypot(distanceX, distanceY) < 12 && event.timeStamp - dragStart.time < 360;
      const lastTap = lastTapRef.current;
      const isDoubleTap = Boolean(
        isTap
        && lastTap
        && event.timeStamp - lastTap.time < 320
        && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 44
      );
      if (isDoubleTap) {
        toggleTapZoom(event.clientX, event.clientY);
        lastTapRef.current = null;
      } else if (isTap) {
        showControls();
        lastTapRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
      }
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) dragStartRef.current = null;
  };

  const chromeVisible = controlsVisible || captionOpen;
  const controlButtonClass = "inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-black/35 px-3 text-sm font-semibold text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-black/55 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70";

  return createPortal(
    <div
      ref={dialogRef}
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
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`, transformOrigin: zoomOrigin }}
        draggable={false}
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
        <p className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white/65 backdrop-blur-sm">
          {zoom > 1 ? "Drag to pan · double-tap to reset" : "Double-tap or pinch to zoom"}
        </p>
      </div>
    </div>,
    document.body
  );
}

function LifestyleReaderActions({
  story,
  article,
  saved,
  commentCount,
  onSave,
  ambientReaderState,
  onOpenAmbientReader,
}: {
  story: LifestyleRiverStory;
  article?: LiveArticleData;
  saved: boolean;
  commentCount: number;
  onSave: () => void;
  ambientReaderState?: "loading" | "ready" | "unavailable";
  onOpenAmbientReader?: () => void;
}) {
  const byline = getLifestyleByline(story, article);
  const publishedAt = article?.publishedAt ?? story.publishedAt;
  const authorAvatarUrl = article?.authorAvatarUrl;
  const authorInitials = byline
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();

  return (
    <div className="my-6 min-w-0 border-y border-border py-3">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <div className="inline-flex min-h-11 max-w-full min-w-0 items-center gap-1.5 text-[length:var(--text-token-4xs)] text-muted-foreground sm:min-h-0">
            <Avatar size="default" className="size-7" aria-hidden>
              {authorAvatarUrl ? <AvatarImage src={authorAvatarUrl} alt="" referrerPolicy="no-referrer" /> : null}
              <AvatarFallback>{authorInitials || "H+"}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 truncate">
              By {byline} · {story.topic}
            </span>
          </div>
          <ReaderPublicationDates
            publishedAt={publishedAt}
            updatedAt={article?.updatedAt}
            className="shrink-0"
          />
        </div>
        <div className="flex w-full shrink-0 items-center justify-center gap-1 sm:w-auto sm:justify-end sm:self-auto sm:gap-2">
          {ambientReaderState === "ready" || ambientReaderState === "loading" ? (
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

function ReaderBrandFollowButton({
  story,
  followed,
  onToggleFollowBrand,
}: {
  story: LifestyleRiverStory;
  followed: boolean;
  onToggleFollowBrand: () => void;
}) {
  const destinationConfigs = useDestinationConfigs();
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
    <button
      type="button"
      onClick={onToggleFollowBrand}
      aria-pressed={followed}
      aria-label={followed ? `Unfollow ${story.brand} brand` : `Follow ${story.brand} brand`}
      title={followed ? `Unfollow ${story.brand} brand` : `Follow ${story.brand} brand`}
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
          followed ? "" : "border-current bg-transparent text-current"
        )}
        style={followed
          ? {
              backgroundColor: followBadgeBackground,
              borderColor: followBadgeBackground,
              color: followBadgeForeground,
            }
          : undefined}
      >
        {followed ? <Check className="h-2.5 w-2.5" aria-hidden /> : <Plus className="h-2.5 w-2.5" aria-hidden />}
      </span>
    </button>
  );
}

type AmbientReaderDensity = "compact" | "comfortable" | "airy";

function isCompleteAmbientArticle(liveArticle?: LiveArticleLoadState) {
  if (liveArticle?.status !== "ready") return false;

  const textBlockCount = liveArticle.data.blocks.filter((block) => block.type !== "image").length;
  const imageBlockCount = liveArticle.data.blocks.filter((block) => block.type === "image").length;

  return textBlockCount >= 4 || (textBlockCount >= 2 && imageBlockCount >= 3);
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

function getAmbientRelatedScore(
  currentStory: LifestyleRiverStory,
  candidateStory: LifestyleRiverStory,
  currentIndex: number,
  candidateIndex: number
) {
  const sharedTagCount = candidateStory.tags.filter((tag) => currentStory.tags.includes(tag)).length;
  let score = 0;
  if (candidateStory.brandSlug === currentStory.brandSlug) score += 12;
  if (candidateStory.topic === currentStory.topic) score += 10;
  if (getStoryDestinationMode(candidateStory.brandSlug) === getStoryDestinationMode(currentStory.brandSlug)) score += 5;
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

type AmbientReaderDestination = Exclude<DestinationMode, "all">;

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
        className="min-h-[78vh] bg-[#0B1014] text-white"
        data-ambient-layout="autos"
        aria-label="Autos article opening"
      >
        <AmbientReaderHeroImage
          story={story}
          hasPortraitHeroImage={hasPortraitHeroImage}
          className="min-h-[48vh] border-b border-white/25 sm:min-h-[56vh] lg:min-h-[62vh]"
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

function AmbientArticleReader({
  story,
  article,
  previousStory,
  nextStory,
  relatedStories,
  onClose,
  onNavigateStory,
  onOpenImage,
  showInterstitialAd,
  interstitialAdvertiser,
  onDismissInterstitialAd,
}: {
  story: LifestyleRiverStory;
  article: LiveArticleData;
  previousStory?: LifestyleRiverStory;
  nextStory?: LifestyleRiverStory;
  relatedStories: LifestyleRiverStory[];
  onClose: () => void;
  onNavigateStory: (storyId: string) => void;
  onOpenImage: (image: FullscreenReaderImage) => void;
  showInterstitialAd: boolean;
  interstitialAdvertiser: AmbientInterstitialAdvertiser;
  onDismissInterstitialAd: () => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const touchStartRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const [colorMode, setColorMode] = React.useState<"light" | "dark">("light");
  const [density, setDensity] = React.useState<AmbientReaderDensity>("airy");
  const [progress, setProgress] = React.useState(0);
  const [heroImageRatio, setHeroImageRatio] = React.useState<number | null>(null);
  useModalIsolation(true, dialogRef);
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
  const ambientPublishedAt = article.publishedAt ?? story.publishedAt;
  const hasAmbientPublishedDate = Number.isFinite(Date.parse(ambientPublishedAt ?? ""));
  const brandPrimary = contextualTheme.colors["1"] ?? "#242D39";
  const brandForeground = getAmbientBrandForeground(brandPrimary);
  const hasPortraitHeroImage = heroImageRatio !== null && heroImageRatio < 0.9;
  const firstParagraphIndex = article.blocks.findIndex((block) => block.type === "paragraph");
  const commerceConfig = getAmbientCommerceConfig(story);
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
      if (showInterstitialAd) onDismissInterstitialAd();
      else onClose();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const targetStory = event.key === "ArrowLeft" ? previousStory : nextStory;
      if (!targetStory) return;
      event.preventDefault();
      event.stopPropagation();
      onNavigateStory(targetStory.id);
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

  const handleReaderTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleReaderTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const elapsed = Date.now() - start.time;

    if (elapsed > 900 || absX < 70 || absX < absY * 1.35) return;

    const targetStory = deltaX < 0 ? nextStory : previousStory;
    if (!targetStory) return;

    event.preventDefault();
    event.stopPropagation();
    onNavigateStory(targetStory.id);
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
        onTouchStart={handleReaderTouchStart}
        onTouchEnd={handleReaderTouchEnd}
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
                  color={colorMode === "dark" ? "#F2F2EE" : story.brandSlug === "motortrend" ? "#E90C17" : undefined}
                  className="flex h-full items-center [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
                />
              </div>
              <span className="hidden truncate text-xs font-semibold text-[var(--ambient-muted)] md:inline">
                Ambient Reader
              </span>
            </div>
            <button
              type="button"
              onClick={() => previousStory && onNavigateStory(previousStory.id)}
              disabled={!previousStory}
              className="inline-flex h-11 items-center gap-1.5 px-2 text-xs font-semibold text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={previousStory ? `Previous article: ${previousStory.title}` : "Previous article unavailable"}
              title={previousStory ? `Previous: ${previousStory.title}` : "Previous article unavailable"}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              <span className="hidden xl:inline">Prev</span>
            </button>
            <button
              type="button"
              onClick={() => nextStory && onNavigateStory(nextStory.id)}
              disabled={!nextStory}
              className="inline-flex h-11 items-center gap-1.5 px-2 text-xs font-semibold text-[var(--ambient-muted)] transition-colors hover:text-[var(--ambient-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-35"
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
          <AmbientReaderHero
            story={story}
            article={article}
            destination={destination}
            brandPrimary={brandPrimary}
            brandForeground={brandForeground}
            hasPortraitHeroImage={hasPortraitHeroImage}
            ambientPublishedAt={ambientPublishedAt}
            hasAmbientPublishedDate={hasAmbientPublishedDate}
            onHeroImageRatio={setHeroImageRatio}
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
      {showInterstitialAd ? (
        <AmbientReaderInterstitialAd advertiser={interstitialAdvertiser} onDismiss={onDismissInterstitialAd} />
      ) : null}
    </div>,
    document.body
  );
}

const vanCleefSnowflakeUrl = "https://www.vancleefarpels.com/us/en/collections/high-jewelry/classic-high-jewelry/snowflake.html?category=all";
const vanCleefLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/0/06/Van_Cleef_Arpels_logo.svg";
const vanCleefCampaignImageUrl = "https://www.vancleefarpels.com/content/dam/vancleefarpels/collections/high-jewelry/classic-high-jewelry/univers-corpo-2024/van-cleef-arpels-classic-high-jewelry-1-snowflake-cover-1328x747.jpg";

type AmbientInterstitialAdvertiser = "van-cleef" | "blancpain" | "lexus" | "marriott" | "porsche" | "princess";

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
    <div className="fixed inset-0 z-[260] bg-[#101b2e]" role="dialog" aria-modal="true" aria-labelledby="ambient-ad-title" aria-describedby="ambient-ad-description">
      <div className="relative grid h-full w-full bg-[#101b2e] text-[#f4f5f7] lg:grid-cols-[0.82fr_1.18fr]">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-6 top-6 z-30 inline-flex h-11 items-center border border-[#f4f5f7]/55 bg-[#101b2e]/40 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-[#f4f5f7] hover:text-[#101b2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f5f7] sm:right-10 sm:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-16">
          <div className="flex items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vanCleefLogoUrl} alt="Van Cleef & Arpels" className="h-auto w-[min(17rem,76%)] brightness-0 invert" />
          </div>
          <div className="max-w-xl py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b8c7df]">Advertisement · High jewelry</p>
            <h2 id="ambient-ad-title" className="mt-6 font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.04em]">Snowflake</h2>
            <p id="ambient-ad-description" className="mt-7 max-w-md font-serif text-xl leading-8 text-[#d8e0ee] sm:text-2xl">Discover a constellation of diamonds and the savoir-faire of Van Cleef &amp; Arpels.</p>
          </div>
          <a href={vanCleefSnowflakeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit items-center bg-[#f4f5f7] px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#101b2e] transition-colors hover:bg-[#cbd8ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f5f7]">Explore the collection</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#203b62] lg:min-h-full">
          {/* The official campaign asset is used as a still because the public collection page does not expose a stable embeddable video URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vanCleefCampaignImageUrl} alt="Van Cleef & Arpels Snowflake high jewelry" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101b2e]/55 via-transparent to-[#101b2e]/10" aria-hidden />
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
    <div className="fixed inset-0 z-[260] bg-[#111]" role="dialog" aria-modal="true" aria-labelledby="blancpain-ad-title" aria-describedby="blancpain-ad-description">
      <div className="relative grid h-full w-full bg-[#f4f2ed] text-[#171717] lg:grid-cols-[0.82fr_1.18fr]">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-6 top-6 z-30 inline-flex h-11 items-center border border-[#171717]/45 bg-[#f4f2ed]/70 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] sm:right-10 sm:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-16">
          <div className="flex items-center justify-between gap-4">
            <div className="font-serif text-xl tracking-[0.28em] sm:text-2xl" aria-label="Blancpain logo">BLANCPAIN <span className="text-[0.55em] tracking-[0.18em]">1735</span></div>
          </div>
          <div className="max-w-xl py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#5f665f]">Advertisement · Fine watchmaking</p>
            <h2 id="blancpain-ad-title" className="mt-6 font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.04em]">The Thinnest Argument</h2>
            <p id="blancpain-ad-description" className="mt-7 max-w-md font-serif text-xl leading-8 text-[#4f514e] sm:text-2xl">Discover Blancpain’s latest timepieces, where watchmaking excellence becomes a way of life.</p>
          </div>
          <a href={blancpainUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit items-center bg-[#171717] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#38443e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]">Discover Blancpain</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#26342f] lg:min-h-full">
          <video className="absolute inset-0 h-full w-full object-cover" src={blancpainHeroVideoUrl} autoPlay muted loop playsInline preload="metadata" aria-label="Blancpain timepiece film" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/45 via-transparent to-transparent" aria-hidden />
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
    <div className="fixed inset-0 z-[260] bg-[#111]" role="dialog" aria-modal="true" aria-labelledby="lexus-ad-title" aria-describedby="lexus-ad-description">
      <div className="relative grid h-full w-full bg-[#e9e9e7] text-[#161616] lg:grid-cols-[0.82fr_1.18fr]">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-6 top-6 z-30 inline-flex h-11 items-center border border-[#161616]/45 bg-[#e9e9e7]/75 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-[#161616] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] sm:right-10 sm:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-16">
          {/* Official Lexus emblem supplied by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lexusLogoUrl} alt="Lexus" className="h-12 w-20 max-w-full object-contain object-left sm:h-14 sm:w-24" />
          <div className="max-w-xl py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#5b5e5e]">Advertisement · Luxury hybrid</p>
            <h2 id="lexus-ad-title" className="mt-6 font-sans text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.04em]">The RX Hybrid</h2>
            <p id="lexus-ad-description" className="mt-7 max-w-md font-sans text-xl font-light leading-8 text-[#444847] sm:text-2xl">Experience the refined balance of electrified performance and considered luxury.</p>
          </div>
          <a href={lexusRxOffersUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit items-center bg-[#161616] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3b3f3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616]">Explore RX Hybrid offers</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#28302f] lg:min-h-full">
          {/* Keep the product image stable until Lexus exposes a direct, lightweight RX Hybrid video asset suitable for background playback. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lexusRxHighResolutionImageUrl} alt="Lexus vehicle" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/55 via-transparent to-transparent" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Lexus · RX Hybrid</p>
        </div>
      </div>
    </div>
  );
}

const marriottLuxuryUrl = "https://www.marriott.com/luxury";
const marriottLuxuryImageUrl = "https://cache.marriott.com/is/image/marriotts7prod/rz-miakb-lobby-ocean-views-39643?wid=1800";

function MarriottInterstitialAd({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[260] bg-[#111]" role="dialog" aria-modal="true" aria-labelledby="marriott-ad-title" aria-describedby="marriott-ad-description">
      <div className="relative grid h-full w-full bg-[#f1eee8] text-[#20252a] lg:grid-cols-[0.82fr_1.18fr]">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-6 top-6 z-30 inline-flex h-11 items-center border border-[#20252a]/45 bg-[#f1eee8]/75 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-[#20252a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20252a] sm:right-10 sm:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-16">
          <div className="font-sans text-xl font-semibold uppercase tracking-[0.28em]" aria-label="Marriott Luxury Group">Marriott <span className="font-serif normal-case tracking-normal">Luxury</span></div>
          <div className="max-w-xl py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#667078]">Advertisement · Luxury travel</p>
            <h2 id="marriott-ad-title" className="mt-6 font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.04em]">An Invitation to the Extraordinary</h2>
            <p id="marriott-ad-description" className="mt-7 max-w-md font-serif text-xl leading-8 text-[#4a5157] sm:text-2xl">Discover stays shaped by beauty, belonging, and the moments that linger long after you return home.</p>
          </div>
          <a href={marriottLuxuryUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit items-center bg-[#20252a] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#46515a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20252a]">Explore luxury stays</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#30424b] lg:min-h-full">
          {/* The official Marriott Luxury page exposes campaign stills but no stable embeddable video asset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={marriottLuxuryImageUrl} alt="Luxury Marriott resort overlooking the ocean" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/55 via-transparent to-transparent" aria-hidden />
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
    <div className="fixed inset-0 z-[260] bg-[#0b0b0b]" role="dialog" aria-modal="true" aria-labelledby="porsche-ad-title" aria-describedby="porsche-ad-description">
      <div className="relative grid h-full w-full bg-[#f4f3f0] text-[#171717] lg:grid-cols-[0.82fr_1.18fr]">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-6 top-6 z-30 inline-flex h-11 items-center border border-[#171717]/45 bg-[#f4f3f0]/75 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] sm:right-10 sm:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-16">
          {/* Official Porsche crest supplied by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={porscheLogoUrl} alt="Porsche" className="h-auto w-40 max-w-full object-contain object-left sm:w-48" />
          <div className="max-w-xl py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6c6c68]">Advertisement · Performance automotive</p>
            <h2 id="porsche-ad-title" className="mt-6 font-sans text-[clamp(3rem,6vw,6.5rem)] font-light leading-[0.92] tracking-[-0.05em]">Your Porsche Journey Starts Now</h2>
            <p id="porsche-ad-description" className="mt-7 max-w-md font-sans text-xl font-light leading-8 text-[#4d4d49] sm:text-2xl">Discover iconic sports cars, electric performance, and the freedom to choose your next Porsche.</p>
          </div>
          <a href={porscheUsaUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit items-center bg-[#171717] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]">Explore Porsche</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#303332] lg:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={porscheHeroImageUrl} alt="Porsche Macan Electric driving through the city" className="absolute inset-0 h-full w-full object-cover" />
          <video className="absolute inset-0 h-full w-full object-cover" src={porscheHeroVideoUrl} autoPlay muted loop playsInline preload="metadata" aria-label="Porsche performance film" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/55 via-transparent to-transparent" aria-hidden />
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
    <div className="fixed inset-0 z-[260] bg-[#101a2a]" role="dialog" aria-modal="true" aria-labelledby="princess-ad-title" aria-describedby="princess-ad-description">
      <div className="relative grid h-full w-full bg-[#eaf1f3] text-[#102338] lg:grid-cols-[0.82fr_1.18fr]">
        <button type="button" onClick={onDismiss} autoFocus className="absolute right-6 top-6 z-30 inline-flex h-11 items-center border border-[#102338]/45 bg-[#eaf1f3]/75 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-[#102338] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#102338] sm:right-10 sm:top-10" aria-label="Close advertisement">Close</button>
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-16">
          {/* Official Princess Cruises logo supplied by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={princessLogoUrl} alt="Princess Cruises" className="h-auto w-40 max-w-full object-contain object-left sm:w-48" />
          <div className="max-w-xl py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#5e7487]">Advertisement · Cruise travel</p>
            <h2 id="princess-ad-title" className="mt-6 font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.04em]">Sail Into the Extraordinary</h2>
            <p id="princess-ad-description" className="mt-7 max-w-md font-sans text-xl font-light leading-8 text-[#41566b] sm:text-2xl">Experience glaciers, coastlines, and unforgettable moments with Princess.</p>
          </div>
          <a href={princessUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit items-center bg-[#102338] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#39546b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#102338]">Explore Princess</a>
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#31546d] lg:min-h-full">
          {/* Official Princess campaign imagery is used as the reliable creative for this placement. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={princessHeroImageUrl} alt="Princess cruise destination near Denali National Park" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101a2a]/55 via-transparent to-transparent" aria-hidden />
          <p className="absolute bottom-6 left-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:left-10">Princess · Alaska</p>
        </div>
      </div>
    </div>
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
                    {story.brand} · {getLifestyleByline(story)} · Popularity {story.popularity}
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
  initialOpenAmbientReader = false,
  onClose,
  onOpenStory,
  onSwitchReaderStory,
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
  initialOpenAmbientReader?: boolean;
  onClose: () => void;
  onOpenStory: (storyId: string) => void;
  onSwitchReaderStory: (storyId: string) => void;
  onSave: (story: LifestyleRiverStory) => void;
  onMoreLikeThis: (story: LifestyleRiverStory) => void;
  onToggleFollowBrand: (brandName: string) => void;
  onAddComment: (storyId: string, body: string) => void;
}) {
  const destinationConfigs = useDestinationConfigs();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const portalTarget = useBodyPortalTarget();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const onCloseRef = React.useRef(onClose);
  const [readerDestinationOverride, setReaderDestinationOverride] = React.useState<Exclude<DestinationMode, "all"> | null>(null);
  const readerOriginBrandSlug = getReaderOriginBrandSlug(readerReturnHref);
  const [readerBrandOverrideSlug, setReaderBrandOverrideSlug] = React.useState<string | null>(null);
  const [readerFetchedStories, setReaderFetchedStories] = React.useState<LifestyleRiverStory[]>([]);
  const [loadingReaderBrandSlug, setLoadingReaderBrandSlug] = React.useState<string | null>(null);
  const activeReaderBrandSlug = readerBrandOverrideSlug ?? readerOriginBrandSlug;
  const readerAvailableStoryPool = mergeUniqueStories(stories, availableStories, readerFetchedStories);
  const readerAvailableStoryPoolRef = React.useRef(readerAvailableStoryPool);
  React.useEffect(() => {
    readerAvailableStoryPoolRef.current = readerAvailableStoryPool;
  }, [readerAvailableStoryPool]);
  const publicationStories = activeReaderBrandSlug
    ? readerAvailableStoryPool.filter(
        (story) => story.brandSlug === activeReaderBrandSlug
      )
    : [];
  const baseReaderStories = readerDestinationOverride
    ? readerAvailableStoryPool.filter((story) => getStoryDestinationMode(story.brandSlug) === readerDestinationOverride)
    : publicationStories.length > 0
      ? publicationStories
      : stories;
  // Continue Reading and discovery modules can surface a story that is outside
  // the currently rendered river window. Keep that selected story in the reader
  // queue so the click always opens the requested article instead of rendering
  // nothing when openIndex would otherwise be -1.
  const readerStories = openStoryId && !baseReaderStories.some((story) => story.id === openStoryId)
    ? [
        ...baseReaderStories,
        ...readerAvailableStoryPool.filter((story) => story.id === openStoryId),
      ]
    : baseReaderStories;
  const openIndex = openStoryId ? readerStories.findIndex((story) => story.id === openStoryId) : -1;
  const [visibleReaderCount, setVisibleReaderCount] = React.useState(1);
  const [liveArticles, setLiveArticles] = React.useState<Record<string, LiveArticleLoadState>>({});
  const [fullscreenGallery, setFullscreenGallery] = React.useState<FullscreenGalleryState | null>(null);
  const [ambientReaderStoryId, setAmbientReaderStoryId] = React.useState<string | null>(null);
  const initialAmbientReaderRequestRef = React.useRef<string | null>(
    initialOpenAmbientReader && openStoryId ? openStoryId : null
  );
  const [interstitialAdvertiser, setInterstitialAdvertiser] = React.useState<AmbientInterstitialAdvertiser>("van-cleef");
  const [showAmbientInterstitialAd, setShowAmbientInterstitialAd] = React.useState(false);
  const ambientOpenedStoryIdsRef = React.useRef<Set<string>>(new Set());
  const ambientArticleVisitCountRef = React.useRef(0);
  const fullscreenGalleryRef = React.useRef(fullscreenGallery);
  const activeReaderRouteStoryIdRef = React.useRef<string | null>(openStoryId);
  const resolvedFullscreenGallery = React.useMemo(() => {
    if (!fullscreenGallery) return null;

    const nextImages = getFullscreenReaderImages(
      fullscreenGallery.story,
      liveArticles[fullscreenGallery.story.id]
    );
    const currentSignature = fullscreenGallery.images.map((image) => image.src).join("|");
    const nextSignature = nextImages.map((image) => image.src).join("|");
    if (currentSignature === nextSignature) return fullscreenGallery;

    const activeSrc = fullscreenGallery.images[fullscreenGallery.initialIndex]?.src;
    return {
      ...fullscreenGallery,
      images: nextImages,
      initialIndex: Math.max(0, nextImages.findIndex((image) => image.src === activeSrc)),
    };
  }, [fullscreenGallery, liveArticles]);
  const storyQueue = openIndex >= 0
    ? [...readerStories.slice(openIndex), ...readerStories.slice(0, openIndex)]
    : [];
  const nextReaderImagePreloadKey = storyQueue
    .slice(1, 3)
    .map((story) => story.image)
    .join("|");
  const visibleReaderStories = storyQueue.slice(0, visibleReaderCount);
  const visibleReaderStoryIds = visibleReaderStories.map((story) => story.id).join("|");
  const ambientReaderIndex = ambientReaderStoryId
    ? storyQueue.findIndex((story) => story.id === ambientReaderStoryId)
    : -1;
  const ambientCurrentStory = ambientReaderIndex >= 0 ? storyQueue[ambientReaderIndex] : undefined;
  const ambientOrderedStories = ambientCurrentStory
    ? storyQueue
        .filter((story) =>
          Boolean(story.sourceUrl)
          && !story.videoUrl
          && getStoryDestinationMode(story.brandSlug) === getStoryDestinationMode(ambientCurrentStory.brandSlug)
        )
    : [];
  const ambientOrderedIndex = ambientReaderStoryId
    ? ambientOrderedStories.findIndex((story) => story.id === ambientReaderStoryId)
    : -1;
  const ambientPreviousCandidateStories = ambientOrderedIndex > 0
    ? ambientOrderedStories.slice(0, ambientOrderedIndex).reverse()
    : [];
  const ambientNextCandidateStories = ambientOrderedIndex >= 0
    ? ambientOrderedStories.slice(ambientOrderedIndex + 1)
    : [];
  const ambientPreviousStory = ambientPreviousCandidateStories.find((story) => isCompleteAmbientArticle(liveArticles[story.id]));
  const ambientNextStory = ambientNextCandidateStories.find((story) => isCompleteAmbientArticle(liveArticles[story.id]));
  const ambientRelatedCandidateStories = ambientCurrentStory && ambientOrderedIndex >= 0
    ? ambientOrderedStories
        .map((story, index) => ({ story, index }))
        .filter(({ index }) => index !== ambientOrderedIndex)
        .sort((first, second) =>
          (ambientCurrentStory
            ? getAmbientRelatedScore(ambientCurrentStory, second.story, ambientOrderedIndex, second.index)
              - getAmbientRelatedScore(ambientCurrentStory, first.story, ambientOrderedIndex, first.index)
            : 0)
          || Math.abs(first.index - ambientOrderedIndex) - Math.abs(second.index - ambientOrderedIndex)
        )
        .slice(0, 8)
        .map(({ story }) => story)
    : [];
  const ambientReaderPreloadStories = [
    ...ambientPreviousCandidateStories.slice(0, 4),
    ...ambientNextCandidateStories.slice(0, 12),
    ...ambientRelatedCandidateStories,
  ].filter(
    (story): story is LifestyleRiverStory => Boolean(story?.sourceUrl)
  ).filter((story, index, stories) => stories.findIndex((candidate) => candidate.id === story.id) === index);
  const ambientReaderPreloadStoryIds = ambientReaderPreloadStories.map((story) => story.id).join("|");
  const ambientRelatedReadyStories = ambientRelatedCandidateStories
    .filter((story) => isCompleteAmbientArticle(liveArticles[story.id]))
    .slice(0, 3);
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
    && activeReaderBrandSlug === readerContextStory.brandSlug
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
  const readerSectionBrands = readerDestinationConfig.sourceNotes;
  const readerMastheadNavItems = usePublicationTheme
    ? readerSectionBrands.map((brand) => ({
        type: "brand" as const,
        key: brand.brandSlug,
        label: brand.brand,
        brandSlug: brand.brandSlug,
      }))
    : readerSections.map((section) => ({
        type: "section" as const,
        key: section.mode,
        label: section.label,
        mode: section.mode,
      }));
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
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (openStoryId) recordStoryOpened(openStoryId);
  }, [openStoryId]);

  useModalIsolation(isReaderOpen && Boolean(portalTarget), dialogRef);

  React.useEffect(() => {
    fullscreenGalleryRef.current = resolvedFullscreenGallery;
  }, [resolvedFullscreenGallery]);

  const selectReaderStory = React.useCallback((storyId: string) => {
    setVisibleReaderCount(1);
    setFullscreenGallery(null);
    setAmbientReaderStoryId(null);
    activeReaderRouteStoryIdRef.current = storyId;
    scrollRef.current?.scrollTo({ top: 0 });
    onSwitchReaderStory(storyId);
  }, [
    onSwitchReaderStory,
    setAmbientReaderStoryId,
    setFullscreenGallery,
    setVisibleReaderCount,
  ]);

  const openAmbientReader = React.useCallback((storyId: string) => {
    setAmbientReaderStoryId(storyId);
    if (!ambientOpenedStoryIdsRef.current.has(storyId)) {
      ambientOpenedStoryIdsRef.current.add(storyId);
      ambientArticleVisitCountRef.current += 1;
      const shouldShowAd = ambientArticleVisitCountRef.current % 3 === 0;
      if (shouldShowAd) {
        const openedStory = readerAvailableStoryPoolRef.current.find((story) => story.id === storyId);
        const isEsquireReader = openedStory?.brandSlug === "esquire";
        const isHarpersBazaarReader = openedStory?.brandSlug === "harpers-bazaar";
        const isAutosReader = openedStory ? getStoryDestinationMode(openedStory.brandSlug) === "autos" : false;
        const isEnthusiastWellnessReader = openedStory ? getStoryDestinationMode(openedStory.brandSlug) === "ew" : false;
        setInterstitialAdvertiser(
          isEnthusiastWellnessReader
            ? "princess"
            : isAutosReader
              ? ambientArticleVisitCountRef.current % 6 === 0
                ? "lexus"
                : "porsche"
            : isHarpersBazaarReader
              ? "marriott"
              : isEsquireReader
                ? "lexus"
            : ambientArticleVisitCountRef.current % 6 === 0
              ? "blancpain"
              : "van-cleef"
        );
      }
      setShowAmbientInterstitialAd(shouldShowAd);
    }
  }, [setAmbientReaderStoryId, setShowAmbientInterstitialAd]);

  React.useEffect(() => {
    if (!openStoryId || typeof window === "undefined") return;

    storyQueue.slice(1, 3).forEach((story) => {
      if (!story.image) return;
      const image = new window.Image();
      image.decoding = "async";
      image.src = `/_next/image/?${new URLSearchParams({
        url: story.image,
        w: "640",
        q: "75",
      }).toString()}`;
    });
  // The key intentionally represents only the next two story hero images.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStoryId, nextReaderImagePreloadKey]);

  React.useEffect(() => {
    if (!isReaderOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const returnFocusLabel = window.sessionStorage.getItem(readerReturnFocusStorageKey);
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

    window.addEventListener("keydown", onKeyDown);

    const focusFrame = window.requestAnimationFrame(() => {
      dialog.querySelector<HTMLElement>("[data-reader-close]")?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
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
    const root = scrollRef.current;
    if (!root || !openStoryId || visibleReaderStories.length <= 1) return;

    const updateActiveReaderRoute = () => {
      const scrollerRect = root.getBoundingClientRect();
      const readingAnchor = scrollerRect.top + Math.min(scrollerRect.height * 0.45, 420);
      const activeArticle = Array.from(root.querySelectorAll<HTMLElement>("[data-reader-story-id]"))
        .map((article) => {
          const rect = article.getBoundingClientRect();
          const visiblePixels = Math.max(
            0,
            Math.min(rect.bottom, scrollerRect.bottom) - Math.max(rect.top, scrollerRect.top)
          );
          const containsReadingAnchor = rect.top <= readingAnchor && rect.bottom >= readingAnchor;
          const anchorDistance = containsReadingAnchor ? 0 : Math.abs(rect.top - readingAnchor);

          return {
            article,
            visiblePixels,
            anchorDistance,
          };
        })
        .filter(({ visiblePixels }) => visiblePixels >= Math.min(240, scrollerRect.height * 0.35))
        .sort((first, second) =>
          first.anchorDistance - second.anchorDistance
          || second.visiblePixels - first.visiblePixels
        )[0]?.article;
      const nextStoryId = activeArticle?.dataset.readerStoryId;

      if (!nextStoryId || activeReaderRouteStoryIdRef.current === nextStoryId) return;

      activeReaderRouteStoryIdRef.current = nextStoryId;
      window.history.replaceState(
        {
          ...window.history.state,
          hearstReaderStory: nextStoryId,
        },
        "",
        appendReaderReturnHref(nextStoryId, readerReturnHref ?? null)
      );
    };

    const observer = new IntersectionObserver(updateActiveReaderRoute, {
      root,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    root.querySelectorAll<HTMLElement>("[data-reader-story-id]").forEach((article) => observer.observe(article));
    root.addEventListener("scroll", updateActiveReaderRoute, { passive: true });
    updateActiveReaderRoute();

    return () => {
      observer.disconnect();
      root.removeEventListener("scroll", updateActiveReaderRoute);
    };
  }, [openStoryId, readerReturnHref, visibleReaderStoryIds, visibleReaderStories.length]);

  React.useEffect(() => {
    const root = scrollRef.current;
    if (!root || !openStoryId) return;

    let animationFrame = 0;
    const updateReadingProgress = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const activeStoryId = activeReaderRouteStoryIdRef.current ?? openStoryId;
        const activeArticle = Array.from(
          root.querySelectorAll<HTMLElement>("[data-reader-story-id]")
        ).find((article) => article.dataset.readerStoryId === activeStoryId);
        if (!activeArticle) return;

        const scrollerRect = root.getBoundingClientRect();
        const articleRect = activeArticle.getBoundingClientRect();
        const readingAnchor = scrollerRect.top + scrollerRect.height * 0.65;
        const readPixels = Math.min(articleRect.height, Math.max(0, readingAnchor - articleRect.top));
        recordStoryProgress(activeStoryId, articleRect.height > 0 ? readPixels / articleRect.height : 0);
      });
    };

    root.addEventListener("scroll", updateReadingProgress, { passive: true });
    updateReadingProgress();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      root.removeEventListener("scroll", updateReadingProgress);
    };
  }, [openStoryId, visibleReaderStoryIds]);

  React.useEffect(() => {
    if (initialOpenAmbientReader && openStoryId) {
      initialAmbientReaderRequestRef.current = openStoryId;
    }
  }, [initialOpenAmbientReader, openStoryId]);

  React.useEffect(() => {
    const requestedStoryId = initialAmbientReaderRequestRef.current;
    if (
      !requestedStoryId
      || ambientReaderStoryId
      || requestedStoryId !== openStoryId
      || !isCompleteAmbientArticle(liveArticles[requestedStoryId])
    ) return;

    initialAmbientReaderRequestRef.current = null;
    openAmbientReader(requestedStoryId);
  }, [ambientReaderStoryId, liveArticles, openAmbientReader, openStoryId]);

  React.useEffect(() => {
    let active = true;
    const storiesToLoad = [...visibleReaderStories, ...ambientReaderPreloadStories];
    const seenStoryIds = new Set<string>();
    storiesToLoad.forEach((story) => {
      if (seenStoryIds.has(story.id)) return;
      seenStoryIds.add(story.id);
      if (!story.sourceUrl || liveArticles[story.id]) return;
      setLiveArticles((current) => ({ ...current, [story.id]: { status: "loading" } }));
      void loadLiveArticle(story.sourceUrl)
        .then((data) => {
          if (!active) return;
          setLiveArticles((current) => ({ ...current, [story.id]: { status: "ready", data } }));
        })
        .catch(() => {
          if (!active) return;
          setLiveArticles((current) => ({ ...current, [story.id]: { status: "error" } }));
        });
    });
    return () => {
      active = false;
    };
  // The ID key intentionally represents the current lazy-loaded reader queue.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientReaderPreloadStoryIds, visibleReaderStoryIds]);

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
      openAmbientReader(activeStoryId);
    };

    window.addEventListener("keydown", openPremiumReaderFromKeyboard);
    return () => window.removeEventListener("keydown", openPremiumReaderFromKeyboard);
  }, [ambientReaderStoryId, fullscreenGallery, isReaderOpen, liveArticles, openAmbientReader, visibleReaderStoryIds]);

  if (!openStoryId || openIndex < 0 || !portalTarget) return null;

  const activeReaderMastheadNavKey = readerMastheadNavItems.find((item) =>
    item.type === "section"
      ? item.mode === readerDestination
      : item.brandSlug === readerContextStory?.brandSlug
  )?.key;

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[200] bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Story reader"
      tabIndex={-1}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={scrollRef}
        className="hearst-plus-theme absolute inset-0 mx-auto flex h-[100dvh] w-full max-w-[1360px] flex-col overflow-y-auto bg-background text-foreground shadow-2xl sm:inset-6 sm:h-auto sm:w-auto sm:rounded-[8px]"
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
                  color={readerDestination === "flux" ? "#ffffff" : readerLogoSlug === "motortrend" ? "#E90C17" : undefined}
                  className="flex h-full w-full items-center justify-start [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-full lg:[&_svg]:w-auto"
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
            <ReaderMastheadCarousel activeKey={activeReaderMastheadNavKey}>
              {readerMastheadNavItems.map((item) => {
                const isActiveReaderSection = item.type === "section" && item.mode === readerDestination;
                const isActiveReaderBrand = item.type === "brand" && item.brandSlug === readerContextStory?.brandSlug;
                const isActiveNavItem = isActiveReaderSection || isActiveReaderBrand;
                const nextStory = item.type === "brand"
                  ? readerAvailableStoryPool.find((story) => story.brandSlug === item.brandSlug)
                  : readerAvailableStoryPool.find((story) => getStoryDestinationMode(story.brandSlug) === item.mode);
                const isLoadingNavItem = item.type === "brand" && loadingReaderBrandSlug === item.brandSlug;

                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={item.type === "section" ? !nextStory : isLoadingNavItem}
                    onClick={async () => {
                      if (isActiveNavItem || (item.type === "section" && !nextStory)) return;
                      let targetStory = nextStory;
                      if (item.type === "brand" && !targetStory) {
                        setLoadingReaderBrandSlug(item.brandSlug);
                        try {
                          const searchParams = new URLSearchParams({
                            destination: readerDestination,
                            brandSlug: item.brandSlug,
                            offset: "0",
                            limit: "40",
                          });
                          const response = await fetch(`/api/story-feed/?${searchParams.toString()}`);
                          if (response.ok) {
                            const page = await response.json() as ProgressiveFeedPage;
                            setReaderFetchedStories((currentStories) => mergeUniqueStories(currentStories, page.stories));
                            targetStory = page.stories.find((story) => story.brandSlug === item.brandSlug);
                          }
                        } finally {
                          setLoadingReaderBrandSlug(null);
                        }
                      }
                      if (!targetStory) return;
                      if (item.type === "brand") {
                        setReaderBrandOverrideSlug(item.brandSlug);
                        setReaderDestinationOverride(null);
                      } else {
                        setReaderBrandOverrideSlug(null);
                        setReaderDestinationOverride(item.mode);
                      }
                      selectReaderStory(targetStory.id);
                    }}
                    className={cn(
                      "whitespace-nowrap border-b-2 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      isActiveNavItem
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-primary"
                    )}
                    aria-label={`Show ${item.label} stories in reader`}
                    aria-current={isActiveNavItem ? "page" : undefined}
                    data-reader-masthead-key={item.key}
                  >
                    {item.label}
                  </button>
                );
              })}
            </ReaderMastheadCarousel>
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
                    onClick={() => filterStory && selectReaderStory(filterStory.id)}
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
                          <AdaptiveVideo
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
                            className="aspect-video w-full rounded-[4px]"
                          />
                        </button>
                      )}
                      <div className="mx-auto mt-6 max-w-3xl">
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                          <span className="inline-flex items-center gap-1.5">
                            <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
                            <span>{story.brand}</span>
                          </span>
                          <ReaderBrandFollowButton
                            story={story}
                            followed={followedBrands.includes(story.brand)}
                            onToggleFollowBrand={() => onToggleFollowBrand(story.brand)}
                          />
                        </div>
                        <h2 className={cn(
                          "headline text-4xl sm:text-5xl",
                          useRoadAndTrackHeadline ? "leading-[1.12]" : "leading-[1.05]"
                        )}>
                          {story.title}
                        </h2>
                        <LifestyleReaderActions
                          story={story}
                          article={getReadyLiveArticle(liveArticles[story.id])}
                          saved={savedIds.includes(story.id)}
                          commentCount={getLifestyleCommentCount(story, commentsByStoryId[story.id]?.length ?? 0)}
                          onSave={() => onSave(story)}
                          ambientReaderState={getAmbientReaderState(story, liveArticles[story.id])}
                          onOpenAmbientReader={isCompleteAmbientArticle(liveArticles[story.id])
                            ? () => openAmbientReader(story.id)
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
                          key={story.id}
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
      {resolvedFullscreenGallery ? (
        <FullscreenImageViewer
          gallery={resolvedFullscreenGallery}
          saved={savedIds.includes(resolvedFullscreenGallery.story.id)}
          onClose={() => setFullscreenGallery(null)}
          onSave={() => onSave(resolvedFullscreenGallery.story)}
          onMoreLikeThis={() => onMoreLikeThis(resolvedFullscreenGallery.story)}
        />
      ) : null}
      {ambientReaderStoryId && liveArticles[ambientReaderStoryId]?.status === "ready" ? (
        <AmbientArticleReader
          key={ambientReaderStoryId}
          story={readerStories.find((story) => story.id === ambientReaderStoryId) ?? storyQueue[0]}
          article={liveArticles[ambientReaderStoryId].data}
          previousStory={ambientPreviousStory}
          nextStory={ambientNextStory}
          relatedStories={ambientRelatedReadyStories}
          onClose={() => setAmbientReaderStoryId(null)}
          onNavigateStory={(storyId) => {
            openAmbientReader(storyId);
            window.history.replaceState(
              {
                ...window.history.state,
                hearstReaderStory: storyId,
              },
              "",
              appendReaderReturnHref(storyId, readerReturnHref ?? null)
            );
            scrollRef.current?.scrollTo({ top: 0 });
          }}
          showInterstitialAd={showAmbientInterstitialAd}
          interstitialAdvertiser={interstitialAdvertiser}
          onDismissInterstitialAd={() => setShowAmbientInterstitialAd(false)}
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
    </div>,
    portalTarget
  );
}

function TodayEditDashboard({
  selection,
  measurementEnabled = true,
  onOpenStory,
  onContinueImpression,
  onContinueOpen,
}: {
  selection: TodayEditStorySelection<LifestyleRiverStory>;
  measurementEnabled?: boolean;
  onOpenStory: (storyId: string) => void;
  onContinueImpression?: (storyId: string) => void;
  onContinueOpen?: (storyId: string) => void;
}) {
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const previousCarouselWidthRef = React.useRef(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const {
    continueStory,
    followedBrandStory,
    trendingStory,
    collectionStory,
  } = selection;
  const carouselStoryKey = [
    continueStory?.id,
    followedBrandStory?.id,
    trendingStory?.id,
    collectionStory?.id,
  ].filter(Boolean).join(":");
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

    const resetForWidthChange = () => {
      const nextWidth = Math.round(carousel.getBoundingClientRect().width);
      if (nextWidth !== previousCarouselWidthRef.current) {
        previousCarouselWidthRef.current = nextWidth;
        carousel.scrollLeft = 0;
      }
      updateCarouselControls();
    };

    resetForWidthChange();
    carousel.addEventListener("scroll", updateCarouselControls, { passive: true });
    const resizeObserver = new ResizeObserver(resetForWidthChange);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateCarouselControls);
      resizeObserver.disconnect();
    };
  }, [updateCarouselControls]);

  React.useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollLeft = 0;
    updateCarouselControls();
  }, [carouselStoryKey, updateCarouselControls]);

  React.useEffect(() => {
    if (
      !measurementEnabled
      || !continueStory
      || !window.matchMedia("(min-width: 768px)").matches
    ) return;
    onContinueImpression?.(continueStory.id);
  }, [continueStory, measurementEnabled, onContinueImpression]);

  if (!followedBrandStory || !trendingStory || !collectionStory) return null;

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * Math.max(320, carousel.clientWidth * 0.72),
      behavior: "smooth",
    });
  };

  const modules = [
    ...(continueStory ? [{
      story: continueStory,
      label: "Continue Reading",
      title: continueStory.title,
      image: continueStory.image,
      onClick: () => {
        onContinueOpen?.(continueStory.id);
        onOpenStory(continueStory.id);
      },
    }] : []),
    {
      story: followedBrandStory,
      label: "New From Your Brands",
      title: followedBrandStory.title,
      image: followedBrandStory.image,
      onClick: () => onOpenStory(followedBrandStory.id),
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
      className="relative hidden w-full overflow-hidden rounded-[8px] border border-border bg-[var(--hp-strip)] shadow-[var(--hp-shadow-card)] md:block"
      aria-label="Today&apos;s edit"
      data-story-module="todays-edit"
    >
      <div
        ref={carouselRef}
        className={cn(
          "flex w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] xl:grid xl:divide-x xl:divide-border xl:overflow-visible xl:snap-none xl:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden xl:[&::-webkit-scrollbar]:block",
          modules.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
        )}
      >
        {modules.map((module) => (
          <button
            key={module.label}
            type="button"
            onClick={module.onClick}
            data-story-id={module.story.id}
            className="group relative flex w-[88vw] shrink-0 snap-start scroll-ml-0 flex-col border-r border-border p-4 text-left transition-colors last:border-r-0 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 sm:w-[50vw] md:w-[38vw] lg:w-[30vw] xl:w-auto xl:min-w-0 xl:border-0"
          >
            <span>
              <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase leading-none tracking-widest text-[var(--hp-section-title)]">
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
                      topBreakdown.moreLikeThis +
                      topBreakdown.savedStory}
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
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Configured lead</dt>
                  <dd className="font-bold">{topBreakdown.defaultLead}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Next-day novelty</dt>
                  <dd className="font-bold">{topBreakdown.nextDayNovelty}</dd>
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

function LifestyleEvidenceGuide({
  stories,
  eligibleStories,
  scopeLabel,
  profile,
  config,
  activeFilter,
}: {
  stories: LifestyleRiverStory[];
  eligibleStories: LifestyleRiverStory[];
  scopeLabel: string;
  profile: LifestyleRiverProfile;
  config: DestinationConfig;
  activeFilter: string;
}) {
  const representedBrands = new Set(stories.map((story) => story.brandSlug)).size;
  const playableVideos = stories.filter((story) => getLifestyleCardKind(story) === "video").length;
  const feedState = config.liveFeedStatus
    ? config.liveFeedStatus.isFallback
      ? "Cached fallback"
      : "Current feed"
    : "Bundled RSS catalog";

  const facts = [
    {
      label: "Current scope",
      value: `${scopeLabel} · ${activeFilter}`,
      detail: `${eligibleStories.length.toLocaleString()} items are currently eligible after the active route, category, brand, and reader exclusions.`,
    },
    {
      label: "Loaded inventory",
      value: `${stories.length.toLocaleString()} unique items`,
      detail: `${representedBrands} represented brands · ${playableVideos.toLocaleString()} playable videos. The count updates as progressive pages arrive.`,
    },
    {
      label: "Feed state",
      value: feedState,
      detail: config.liveFeedStatus
        ? `Feed response received ${formatLiveFeedUpdatedAt(config.liveFeedStatus.fetchedAt)}.`
        : "This view is using the deduplicated catalog bundled with the current build.",
    },
    {
      label: "Reader signals",
      value: `${profile.followedTopics.length} topics · ${profile.followedBrands.length} brands`,
      detail: `${profile.savedIds.length} saved · ${profile.hiddenIds.length} hidden. These prototype preferences are browser-local.`,
    },
  ];

  return (
    <section
      className="mt-4 overflow-hidden rounded-[8px] border border-border bg-white text-[#121212] [--foreground:#121212] [--muted-foreground:#5f6b7a]"
      aria-labelledby="evidence-guide-title"
    >
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Live evidence
        </p>
        <h2 id="evidence-guide-title" className="headline mt-1 text-2xl leading-tight">
          Facts from the running experience, not a static presentation.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Inventory, feed state, active scope, reader signals, and the score above are computed from
          the current application state. They update when the feed, filter, profile, or demo moment changes.
        </p>
      </div>
      <dl className="grid md:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-b border-border p-4 last:border-b-0 md:[&:nth-child(odd)]:border-r xl:border-b-0 xl:[&:not(:last-child)]:border-r"
          >
            <dt className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              {fact.label}
            </dt>
            <dd>
              <p className="mt-2 text-sm font-bold leading-5">{fact.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{fact.detail}</p>
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-border bg-[#f5f7fa] px-4 py-3 text-xs leading-5 text-[#445064] sm:px-5">
        <span className="font-bold text-[#121212]">Verification boundary:</span>{" "}
        this console describes the implemented prototype. It does not claim production identity,
        analytics, consent, publishing, or cross-device preference storage.
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
  inventoryStories,
  eligibleStories,
  scopeLabel,
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
  inventoryStories: LifestyleRiverStory[];
  eligibleStories: LifestyleRiverStory[];
  scopeLabel: string;
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
          <LifestyleEvidenceGuide
            stories={inventoryStories}
            eligibleStories={eligibleStories}
            scopeLabel={scopeLabel}
            profile={profile}
            config={config}
            activeFilter={activeFilter}
          />
          <LifestylePersonalizationRulesGuide />
          <LifestyleTechnologyGuide />
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
  globalInventory = false,
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
  globalInventory?: boolean;
  activeBrandFilters: string[];
  collectionLabels: string[];
  onToggleBrandFilter: (brandName: string) => void;
  onClearBrandFilters: () => void;
  onFollowTopic: (topic: string) => void;
  onOpenStory: (story: LifestyleRiverStory) => void;
}) {
  const activeTopicSummary = profile.followedTopics.slice(0, 3).join(", ");
  const brandStoryCount = brands.reduce((total, brand) => total + brand.count, 0);
  const brandSummary = globalInventory
    ? `${brands.length} brands · ${brandStoryCount} stories`
    : activeBrandFilters.length > 0
      ? activeBrandFilters[0]
      : `All brands · ${brandStoryCount} stories`;
  const topicSummary = activeTopicSummary || `${topics.length} topics`;
  const collectionSummary = `${collectionLabels.length} collections`;

  return (
    <aside
      className="hidden min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:block lg:max-h-[calc(100dvh-136px)] lg:self-start lg:overflow-y-auto lg:pr-1"
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
              data-story-module="daily-habit"
              data-story-id={story.id}
              className="group block w-full border-b border-border pb-3 text-left last:border-0 last:pb-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={`Open story: ${story.title}`}
            >
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                {story.topic}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
                {story.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{story.brand} · {getLifestyleByline(story)} · Popularity {story.popularity}</p>
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
          {globalInventory
            ? "Complete section inventory. Select a brand to open its publication."
            : activeBrandFilters.length > 0
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
  initialOpenAmbientReader?: boolean;
  readerReturnHref?: string;
  showStakeholderTools?: boolean;
  onboardingResult?: HearstOnboardingResult | null;
  onFilterChange?: (filter: string) => void;
  onRiverReset?: () => void;
  onBrandFilterChange?: () => void;
  onSelectedBrandChange?: (brand: { name: string; slug: string } | null) => void;
  indicatorPalette?: readonly string[];
  activeBrandFilters?: string[];
  onActiveBrandFiltersChange?: React.Dispatch<React.SetStateAction<string[]>>;
  feedHasMore?: boolean;
  feedLoading?: boolean;
  feedError?: string | null;
  onRequestNextFeedPage?: () => void;
};

function getLifestyleRiverPageHeading(config: DestinationConfig, initialBrandSlug?: string) {
  const initialBrandName = config.sourceNotes.find((note) => note.brandSlug === initialBrandSlug)?.brand;
  return `${initialBrandName ?? config.productName} personalized story feed`;
}

const initialLifestyleRiverStoryCount = 13;

function ProgressiveFeedSentinelStatus({
  error,
  hasLoadedStories,
  hasMore,
  isLoading,
  noun,
  onRetry,
}: {
  error: string | null;
  hasLoadedStories: boolean;
  hasMore: boolean;
  isLoading: boolean;
  noun: "stories" | "videos";
  onRetry?: () => void;
}) {
  if (error) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>More {noun} could not be loaded.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading more {noun}...</p>;
  }

  if (hasLoadedStories || hasMore) {
    return <p className="text-sm text-muted-foreground">More {noun} load as you continue.</p>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      You&rsquo;re caught up on this {noun === "videos" ? "video feed" : "river"}.
    </p>
  );
}

function LifestyleRiverLoadingState({ pageHeading }: { pageHeading: string }) {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite" aria-label="Loading your personalized feed">
      <span className="sr-only">Loading your personalized feed.</span>
      <section
        className="relative hidden w-full overflow-hidden rounded-[8px] border border-border bg-[var(--hp-strip)] shadow-[var(--hp-shadow-card)] md:block"
        aria-hidden="true"
      >
        <div className="flex w-full overflow-hidden xl:grid xl:grid-cols-4 xl:divide-x xl:divide-border">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex w-[88vw] shrink-0 flex-col border-r border-border p-4 last:border-r-0 sm:w-[58vw] md:w-[44vw] lg:w-[34vw] xl:w-auto xl:min-w-0 xl:border-0"
            >
              <span className="block h-[11px] w-28 rounded-full bg-muted motion-safe:animate-pulse" />
              <span className="mt-3 flex items-start gap-3">
                <span className="mt-0.5 h-16 w-20 shrink-0 rounded-[8px] bg-muted motion-safe:animate-pulse" />
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                  <span className="block h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden min-h-[360px] rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 lg:block" aria-hidden="true">
          <div className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            Your Daily Habit
          </div>
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2 border-b border-border pb-4 last:border-b-0">
                <div className="h-2.5 w-16 rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
        <main className="min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)]" aria-label={pageHeading}>
          <h1 className="sr-only">{pageHeading}</h1>
          <div className="relative w-full min-w-0 overflow-hidden bg-black motion-safe:animate-pulse" aria-hidden="true">
            <div className="relative isolate">
              <div className="relative h-[min(128vw,520px)] w-full overflow-hidden sm:h-auto sm:aspect-video">
                <div className="absolute inset-0 bg-muted" />
                <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent via-black/45 to-black sm:h-[220px] xl:h-[240px]" />
              </div>
            </div>
            <div className="h-[112px] bg-black sm:h-[144px]" />
            <div className="absolute inset-x-5 bottom-6 space-y-3 sm:inset-x-7 sm:bottom-7">
              <div className="h-3 w-32 rounded-full bg-white/35" />
              <div className="h-7 w-full max-w-xl rounded-full bg-white/35" />
              <div className="h-7 w-3/4 max-w-lg rounded-full bg-white/35" />
              <div className="h-3 w-5/6 max-w-xl rounded-full bg-white/25" />
            </div>
          </div>
          <div className="flex h-[125px] items-center justify-between gap-3 border-t border-border px-4 py-3 sm:h-[49px]" aria-hidden="true">
            <div className="h-2 w-28 rounded-full bg-muted motion-safe:animate-pulse" />
            <div className="h-6 w-48 rounded-[6px] bg-muted motion-safe:animate-pulse" />
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

const hearstGameConcepts = [
  {
    title: "Car Mash",
    format: "Autos game",
    habit: "2 to 4 min",
    source: "Hearst Car Mash",
    license: "External prototype",
    href: "https://motortrend-carmash.lovable.app/",
    externalHref: "https://motortrend-carmash.lovable.app/",
    proof: "Existing playable autos game prototype that can validate whether quick car-choice loops belong in the Hearst+ habit layer.",
    fit: "Forge the unholy mashup the auto industry won't build. Our AI editors deliver the full road test, invented horsepower, ruthless verdict, and a magazine-cover hero shot in under 30 seconds.",
    status: "Playable site",
    tone: "Autos",
    imageUrl: "/images/games/car-mash.png",
    imagePosition: "center",
    playKind: "external" as const,
  },
  {
    title: "Daily Mini Crossword",
    format: "Word puzzle",
    habit: "3 to 5 min",
    source: "Exolve",
    license: "MIT",
    href: "https://github.com/viresh-ratnakar/exolve",
    proof: "Mature open-source crossword engine with embeddable puzzle markup.",
    fit: "Best editorial fit. Clues can be written from Hearst culture, food, style, home, auto, and wellness coverage.",
    status: "Prototype first",
    tone: "Editorial",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/amazon-asuli-bookshelf-6627efda24610.jpg?crop=1.00xw:0.570xh;0,0.375xh&resize=1200:*",
    imagePosition: "center",
    playKind: "mini" as const,
  },
  {
    title: "Tile Merge",
    format: "Number puzzle",
    habit: "2 to 4 min",
    source: "2048",
    license: "MIT",
    href: "https://github.com/gabrielecirulli/2048",
    proof: "Very popular browser game repo with simple mechanics and mobile-friendly play.",
    fit: "Fast daily repeat play. Easy to theme as recipes, products, cars, colors, or trend tiles.",
    status: "Ready to adapt",
    tone: "Daily",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/where-to-buy-squishmallows-online-1641911882.jpg?crop=0.939xw:0.939xh;0.0321xw,0.0321xh&resize=1200:*",
    imagePosition: "center",
    playKind: "merge" as const,
  },
  {
    title: "Photo Puzzle",
    format: "Image game",
    habit: "4 to 7 min",
    source: "Puzzle",
    license: "Free HTML5 PWA",
    href: "https://github.com/grrd01/Puzzle",
    proof: "Lightweight browser puzzle pattern that can be driven by editorial imagery.",
    fit: "Strongest visual brand extension. Cars, homes, fashion, food, and travel images become playable.",
    status: "Best visual demo",
    tone: "Visual",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/083af0e2-6ac9-4362-9899-ae967559c01c.jpeg",
    imagePosition: "center",
    playKind: "photo" as const,
  },
  {
    title: "Memory Match",
    format: "Card match",
    habit: "2 to 5 min",
    source: "Memory Game",
    license: "MIT",
    href: "https://github.com/kubowania/memory-game",
    proof: "Simple open-source browser memory game, easy to reskin and extend.",
    fit: "Works for product picks, celebrity looks, car badges, recipe ingredients, and home design details.",
    status: "Low effort",
    tone: "Collections",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/beautiful-family-connecting-whilst-playing-games-royalty-free-image-1717003492.jpg?crop=0.668xw:1.00xh;0.147xw,0&resize=600:*",
    imagePosition: "center",
    playKind: "memory" as const,
  },
  {
    title: "Arcade Blocks",
    format: "Falling blocks",
    habit: "5 to 8 min",
    source: "React Tetris",
    license: "MIT",
    href: "https://github.com/brandly/react-tetris",
    proof: "React implementation with familiar arcade pacing and compact controls.",
    fit: "Useful as a lightweight arcade card, but should be renamed and visually differentiated before sharing.",
    status: "Needs reskin",
    tone: "Arcade",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/ed6cffef-45ed-4c26-be13-d38bfd05ad17.jpg",
    imagePosition: "center",
    playKind: "blocks" as const,
  },
  {
    title: "Daily Game Finder",
    format: "Discovery index",
    habit: "Browse",
    source: "Dles",
    license: "GPL-3.0",
    href: "https://github.com/aukspot/dles",
    proof: "Large curated directory of daily web games for market scanning.",
    fit: "Best used as research input, not copied into the product, because the license has obligations.",
    status: "Research only",
    tone: "Discovery",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/green-tea-cookies-1550241899.jpg?crop=0.481xw:0.321xh;0.449xw,0.532xh&resize=600:*",
    imagePosition: "center",
    playKind: "finder" as const,
  },
] as const;

function HearstGamesIndex() {
  const [activeGame, setActiveGame] = React.useState<(typeof hearstGameConcepts)[number] | null>(null);
  const playableGames = hearstGameConcepts.filter((game) => game.playKind !== "finder");
  const researchGame = hearstGameConcepts.find((game) => game.playKind === "finder") ?? hearstGameConcepts[hearstGameConcepts.length - 1];
  const openGame = (game: (typeof hearstGameConcepts)[number]) => {
    const externalHref = "externalHref" in game ? game.externalHref : null;
    if (externalHref) {
      window.open(externalHref, "_blank", "noopener,noreferrer");
      return;
    }

    setActiveGame(game);
  };

  return (
    <>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden min-w-0 space-y-5 lg:block">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Your daily habit
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              {playableGames.slice(0, 3).map((game) => (
                <button
                  key={game.title}
                  type="button"
                  className="block w-full border-b border-border pb-4 text-left transition-colors last:border-b-0 last:pb-0 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => openGame(game)}
                >
                  <span className="text-xs font-bold text-[var(--hp-section-title)]">{game.format}</span>
                  <span className="mt-1 block font-bold leading-snug">{game.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{game.habit}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Game types
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Words", "Photos", "Memory", "Pattern", "Arcade"].map((item) => (
                <span key={item} className="rounded-[6px] border border-border px-2 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <main className="min-w-0 space-y-4" aria-label="Hearst games river">
          <div className="space-y-4">
            {playableGames.map((game) => {
              const isExternalGame = "externalHref" in game;

              if (isExternalGame) {
                return (
                  <article
                    key={game.title}
                    role="link"
                    tabIndex={0}
                    className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                    onClick={() => openGame(game)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openGame(game);
                      }
                    }}
                  >
                    <div className="relative grid w-full grid-rows-[auto_112px] bg-black text-left text-white sm:grid-rows-[auto_144px]">
                      <div className="relative isolate">
                        <div className="relative h-[min(128vw,520px)] w-full overflow-hidden sm:h-auto sm:aspect-video">
                          <Image
                            src={game.imageUrl}
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 1024px) calc(100vw - 48px), 680px"
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            style={{ objectPosition: game.imagePosition }}
                          />
                          <div
                            aria-hidden="true"
                            data-slider-layer="gradient"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.18)_30%,rgba(0,0,0,0.78)_72%,#000_100%)] sm:h-[220px] xl:h-[240px]"
                          />
                        </div>
                      </div>
                      <div data-slider-layer="frame" className="bg-black" />
                    </div>
                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-black/45 px-3 py-1 text-sm font-bold uppercase tracking-[0.08em] text-white backdrop-blur">
                        {game.tone}
                      </span>
                      <span className="rounded-full bg-black/45 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                        {game.habit}
                      </span>
                    </div>
                    <div data-slider-content className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                        <span className="font-bold uppercase tracking-[0.14em] text-white">{game.format}</span>
                        <span>{game.status}</span>
                      </div>
                      <h2 className="headline line-clamp-3 max-w-[min(42rem,100%)] break-words text-balance text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.08] text-white transition-colors group-hover:text-[#BDDDFC] group-focus-visible:text-[#BDDDFC] sm:text-[clamp(2.25rem,3.25vw,3rem)]">
                        {game.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                        {game.fit}
                      </p>
                      <div className="relative z-30 mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" onClick={(event) => event.stopPropagation()}>
                        <Button variant="ghost" size="xs" className="border-0 bg-white px-3 text-black shadow-none hover:bg-white/90 hover:text-black focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-white/70" onClick={() => openGame(game)}>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          Open Car Mash
                        </Button>
                        <span className="text-white/80">{game.source} · {game.license}</span>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={game.title}
                  role="button"
                  tabIndex={0}
                  className="group relative grid min-w-0 cursor-pointer gap-4 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 sm:grid-cols-[176px_minmax(0,1fr)]"
                  onClick={() => openGame(game)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openGame(game);
                    }
                  }}
                >
                  <div className="relative aspect-video min-w-0 overflow-hidden rounded-[8px] bg-muted sm:h-full sm:min-h-36 sm:aspect-auto">
                    <Image
                      src={game.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) calc(100vw - 48px), 176px"
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={{ objectPosition: game.imagePosition }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65" />
                    <div className="absolute inset-x-0 top-0 p-3">
                      <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        {game.tone}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-20 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-[0.14em] text-[var(--hp-section-title)]">{game.format}</span>
                      <span>{game.habit}</span>
                      <span>{game.status}</span>
                    </div>
                    <h2 className="headline text-2xl leading-tight text-[var(--hp-text-headline)] transition-colors group-hover:text-primary group-focus-visible:text-primary">
                      {game.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {game.fit}
                    </p>
                    <div className="relative z-30 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" onClick={(event) => event.stopPropagation()}>
                      <Button variant="ghost" size="xs" className={quietStoryActionButtonClass} onClick={() => openGame(game)}>
                        <Play className="h-3.5 w-3.5" aria-hidden />
                        Play
                      </Button>
                      <span className="text-muted-foreground">{game.source} · {game.license}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:self-start">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Why games
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>They create a repeatable daily touchpoint without replacing the story river.</p>
              <p>Each game can inherit topic and brand signals from the reader profile.</p>
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Source review
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              {hearstGameConcepts.map((game) => (
                <div key={game.title} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <p className="font-bold">{game.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{game.source} · {game.license}</p>
                  <LinkComponent
                    href={game.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="neutral"
                    underline={false}
                    size="sm"
                    className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    View source
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </LinkComponent>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-sm font-bold text-foreground">Research only</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {researchGame.source} is useful for market scanning, but its {researchGame.license} license means it should stay a reference unless legal approves a compliant use.
            </p>
          </section>
        </aside>
      </div>
      <HearstGameModal game={activeGame} onClose={() => setActiveGame(null)} />
    </>
  );
}

function HearstGameModal({
  game,
  onClose,
}: {
  game: (typeof hearstGameConcepts)[number] | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!game) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [game, onClose]);

  if (!game) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={`${game.title} game`}>
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close game" />
      <div className="relative max-h-[min(820px,92dvh)] w-full max-w-3xl overflow-y-auto rounded-[12px] bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--hp-section-title)]">{game.format}</p>
            <h2 className="headline mt-1 text-3xl leading-tight">{game.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{game.habit} · Prototype game</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={onClose}
            aria-label="Close game"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <HearstGamePlayable game={game} />
          <div className="mt-6 rounded-[8px] border border-border bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-bold text-foreground">Prototype note</p>
            <p className="mt-1">
              This modal uses Hearst-owned demo logic. The referenced repo remains a source and license review input before any production implementation.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function HearstGamePlayable({ game }: { game: (typeof hearstGameConcepts)[number] }) {
  if (game.playKind === "mini") return <DailyMiniGame />;
  if (game.playKind === "merge") return <TileMergeGame />;
  if (game.playKind === "photo") return <PhotoPuzzleGame />;
  if (game.playKind === "memory") return <MemoryMatchGame />;
  return <ArcadeBlocksGame />;
}

function DailyMiniGame() {
  const [answers, setAnswers] = React.useState(["", "", ""]);
  const expected = ["style", "road", "home"];
  const solved = answers.filter((answer, index) => answer.trim().toLowerCase() === expected[index]).length;

  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">
        A tiny editorial clue set. Fill the three answers to complete today&rsquo;s mini.
      </p>
      <div className="mt-5 space-y-3">
        {[
          "Fashion and beauty coverage often starts with this five-letter section.",
          "The autos brand pairing in Road & Track starts with this word.",
          "Country Living and House Beautiful share this reader intent.",
        ].map((clue, index) => (
          <label key={clue} className="block rounded-[8px] border border-border p-3">
            <span className="text-sm font-bold">{clue}</span>
            <Input
              value={answers[index]}
              onChange={(event) => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? event.target.value : value))}
              className="mt-2"
              aria-label={`Answer ${index + 1}`}
            />
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-[var(--hp-section-title)]">{solved} of 3 solved</p>
    </div>
  );
}

function TileMergeGame() {
  const [tiles, setTiles] = React.useState([2, 2, 4, 8, 4, 16, 8, 2, 32, 4, 2, 0, 0, 0, 0, 0]);
  const score = tiles.reduce((sum, tile) => sum + tile, 0);
  const mergeTiles = () => {
    setTiles((current) => {
      const compact = current.filter(Boolean);
      const next: number[] = [];
      for (let index = 0; index < compact.length; index += 1) {
        if (compact[index] === compact[index + 1]) {
          next.push(compact[index] * 2);
          index += 1;
        } else {
          next.push(compact[index]);
        }
      }
      return [...next, 2, ...Array.from({ length: Math.max(0, 15 - next.length) }, () => 0)].slice(0, 16);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Merge matching tiles into a higher-value daily pattern.</p>
        <p className="shrink-0 text-sm font-bold">Score {score}</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 rounded-[8px] bg-muted p-2">
        {tiles.map((tile, index) => (
          <div key={`${tile}-${index}`} className="flex aspect-square items-center justify-center rounded-[6px] bg-background text-xl font-black text-[var(--hp-text-headline)]">
            {tile || ""}
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={mergeTiles}>Merge row</Button>
    </div>
  );
}

function PhotoPuzzleGame() {
  const [tiles, setTiles] = React.useState(["Home", "Style", "Cars", "Food", "Wellness", "Travel"]);

  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">
        A photo puzzle would use Hearst imagery. This prototype uses topic tiles to show the interaction model.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <button
            key={tile}
            type="button"
            className="aspect-[4/3] rounded-[8px] border border-border bg-muted text-lg font-black transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={() => setTiles((current) => [...current.slice(1), current[0]])}
          >
            {tile}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Tap any tile to reshuffle the editorial image board.</p>
    </div>
  );
}

function MemoryMatchGame() {
  const cards = ["Car", "Car", "Home", "Home", "Style", "Style", "Food", "Food"];
  const [revealed, setRevealed] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<string[]>([]);

  const reveal = (index: number) => {
    if (revealed.includes(index) || matched.includes(cards[index])) return;
    const next = revealed.length === 2 ? [index] : [...revealed, index];
    if (next.length === 2 && cards[next[0]] === cards[next[1]]) {
      setMatched((current) => [...current, cards[index]]);
      setRevealed([]);
      return;
    }
    setRevealed(next);
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">Match reader interests to clear the board.</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {cards.map((card, index) => {
          const open = revealed.includes(index) || matched.includes(card);
          return (
            <button
              key={`${card}-${index}`}
              type="button"
              className={cn(
                "aspect-square rounded-[8px] border border-border text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40",
                open ? "bg-background text-primary" : "bg-muted text-muted-foreground hover:border-primary"
              )}
              onClick={() => reveal(index)}
            >
              {open ? card : "Hearst"}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm font-bold text-[var(--hp-section-title)]">{matched.length} of 4 matches</p>
    </div>
  );
}

function ArcadeBlocksGame() {
  const [score, setScore] = React.useState(0);
  const blocks = ["Style", "Cars", "Food", "Home", "Gear", "Life"];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">A renamed falling-blocks concept, shown here as a simple scoring prototype.</p>
        <p className="text-sm font-bold">Score {score}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {blocks.map((block) => (
          <button
            key={block}
            type="button"
            className="h-20 rounded-[8px] border border-border bg-muted font-bold transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={() => setScore((current) => current + 10)}
          >
            {block}
          </button>
        ))}
      </div>
    </div>
  );
}

function LifestyleRiverHydrationGate(props: LifestyleRiverHomePageProps) {
  const destinationConfigs = useDestinationConfigs();
  const { isHydrated } = useReaderAccount();
  const config = props.destinationConfig ?? destinationConfigs[props.destination];
  const pageHeading = getLifestyleRiverPageHeading(config, props.initialBrandSlug);
  const useFlushVideoTop = props.activeFilter === "Videos" && Boolean(props.videoFeedData);

  return (
    <div className={cn("flow-root min-h-[calc(100dvh-173px)] md:min-h-[calc(100dvh-171px)]", !useFlushVideoTop && "md:pt-8")}>
      {isHydrated
        ? <LifestyleRiverHomePage {...props} />
        : <LifestyleRiverLoadingState pageHeading={pageHeading} />}
    </div>
  );
}

function LifestyleRiverHomePage({
  activeFilter,
  destination,
  destinationConfig,
  videoFeedData,
  initialBrandSlug,
  initialOpenStoryId,
  initialOpenAmbientReader = false,
  readerReturnHref,
  showStakeholderTools = false,
  onboardingResult,
  onFilterChange,
  onRiverReset,
  onBrandFilterChange,
  onSelectedBrandChange,
  indicatorPalette,
  activeBrandFilters: controlledActiveBrandFilters,
  onActiveBrandFiltersChange,
  feedHasMore = false,
  feedLoading = false,
  feedError = null,
  onRequestNextFeedPage,
}: LifestyleRiverHomePageProps) {
  const destinationConfigs = useDestinationConfigs();
  const config = destinationConfig ?? destinationConfigs[destination];
  const { account, updatePreferences, addComment } = useReaderAccount();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { entries: readingHistory } = useReadingHistoryState();
  const continueReadingStoryIds = React.useMemo(
    () => getContinueReadingStoryIds(readingHistory),
    [readingHistory]
  );
  const [visitStartedAt] = React.useState(() => Date.now());
  const [editionDate] = React.useState(() => getLocalEditionDate(new Date(visitStartedAt)));
  const visitScopeKey = `${destination}:${initialBrandSlug ?? "all-brands"}`;
  const [sessionContinueReadingState, setSessionContinueReadingState] = React.useState<{
    scopeKey: string;
    storyIds: string[];
  }>(() => ({
    scopeKey: visitScopeKey,
    storyIds: getSessionContinueReadingStoryIds(visitScopeKey, editionDate),
  }));
  const sessionContinueReadingStoryIds = sessionContinueReadingState.scopeKey === visitScopeKey
    ? sessionContinueReadingState.storyIds
    : continueReadingStoryIds;
  const [demoState, setDemoState] = React.useState<LifestyleDemoState>(() => ({
    ...resolveVisitContext(
      readVisitRecords(),
      visitScopeKey,
      editionDate,
      new Date(visitStartedAt)
    ),
    isSimulated: false,
  }));
  const recordedVisitScopeRef = React.useRef<string | null>(null);
  const initialBrandName = config.sourceNotes.find((note) => note.brandSlug === initialBrandSlug)?.brand;
  const [internalActiveBrandFilters, setInternalActiveBrandFilters] = React.useState<string[]>(initialBrandName ? [initialBrandName] : []);
  const activeBrandFilters = controlledActiveBrandFilters ?? internalActiveBrandFilters;
  const setActiveBrandFilters = onActiveBrandFiltersChange ?? setInternalActiveBrandFilters;
  const readerAccountId = account?.id;
  const profileSourceKey = `${readerAccountId ?? "guest"}:${config.productName}:${initialBrandSlug ?? ""}:${activeFilter}`;
  const sourceProfile = account?.preferences ?? config.initialProfile;
  const [profileState, setProfileState] = React.useState<{
    sourceKey: string;
    value: LifestyleRiverProfile;
  }>(() => ({
    sourceKey: profileSourceKey,
    value: sourceProfile,
  }));
  const profile = readerAccountId
    ? sourceProfile
    : profileState.sourceKey === profileSourceKey
      ? profileState.value
      : sourceProfile;
  const initialOpenStoryValue = initialOpenStoryId ?? null;
  const [openStoryState, setOpenStoryState] = React.useState<{
    sourceStoryId?: string;
    value: string | null;
  }>(() => ({
    sourceStoryId: initialOpenStoryId,
    value: initialOpenStoryValue,
  }));
  const openStoryId = openStoryState.sourceStoryId === initialOpenStoryId
    ? openStoryState.value
    : initialOpenStoryValue;
  const setOpenStoryId = React.useCallback((value: string | null) => {
    setOpenStoryState({ sourceStoryId: initialOpenStoryId, value });
  }, [initialOpenStoryId, setOpenStoryState]);
  const [openDelishShortId, setOpenDelishShortId] = React.useState<string | null>(null);
  const [openDelishShortStory, setOpenDelishShortStory] = React.useState<LifestyleRiverStory | null>(null);
  const [delishSupplementalStories, setDelishSupplementalStories] = React.useState<LifestyleRiverStory[]>([]);
  const delishShortOpenerRef = React.useRef<HTMLElement | null>(null);
  const displayStoryIdsRef = React.useRef<string[]>([]);
  const [commentsByStoryId, setCommentsByStoryId] = React.useState<Record<string, LifestyleStoryComment[]>>({});
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [delishShortsRiverPlacement, setDelishShortsRiverPlacement] = React.useState<{
    scopeKey: string;
    index: number;
  } | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelLastDemandScrollYRef = React.useRef(Number.NEGATIVE_INFINITY);
  const sentinelLastDemandAtRef = React.useRef(0);
  const feedDemandRef = React.useRef({
    feedHasMore,
    feedLoading,
    filteredStoryCount: 0,
    onRequestNextFeedPage,
    visibleCount: initialLifestyleRiverStoryCount,
  });
  const previousActiveFilterRef = React.useRef<string | null>(null);
  const appliedOnboardingResultRef = React.useRef<HearstOnboardingResult | null>(null);
  const resolvedCommentsByStoryId = account?.commentsByStoryId ?? commentsByStoryId;
  const safeReaderReturnHref = React.useMemo(() => normalizeReaderReturnHref(readerReturnHref), [readerReturnHref]);
  const pageHeading = getLifestyleRiverPageHeading(config, initialBrandSlug);
  const currentPageReturnHref = React.useMemo(() => {
    if (!pathname || pathname.startsWith("/read/")) return null;

    const query = searchParams?.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);
  const currentReaderReturnHref = safeReaderReturnHref ?? (initialBrandSlug ? getHearstBrandRoute(initialBrandSlug) : getHearstDestinationRoute(destination));
  const storyOpenReturnHref = safeReaderReturnHref ?? currentPageReturnHref ?? currentReaderReturnHref;
  const rememberSessionContinueReadingStory = React.useCallback((storyId: string) => {
    setSessionContinueReadingState((current) => {
      if (current.scopeKey !== visitScopeKey || current.storyIds.includes(storyId)) return current;

      const storyIds = [storyId, ...current.storyIds];
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem(
            `${readerRiverAllocationStoragePrefix}${editionDate}:${visitScopeKey}`,
            JSON.stringify(storyIds)
          );
        } catch {
          // The river remains usable when session storage is unavailable.
        }
      }
      return { ...current, storyIds };
    });
  }, [editionDate, visitScopeKey]);
  const restoreCurrentVisitContext = React.useCallback(() => {
    const now = new Date();
    setDemoState({
      ...resolveVisitContext(readVisitRecords(), visitScopeKey, editionDate, now),
      isSimulated: false,
    });
  }, [editionDate, visitScopeKey]);

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
    recordStoryOpened(storyId);
    rememberSessionContinueReadingStory(storyId);
    setOpenStoryId(storyId);
    saveReaderReturnScrollSnapshot(storyId, storyOpenReturnHref, displayStoryIdsRef.current);
    router.push(appendReaderReturnHref(storyId, storyOpenReturnHref), { scroll: false });
  }, [rememberSessionContinueReadingStory, router, setOpenStoryId, storyOpenReturnHref]);

  const switchReaderStory = React.useCallback((storyId: string) => {
    recordStoryOpened(storyId);
    rememberSessionContinueReadingStory(storyId);
    setOpenStoryId(storyId);
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {
          ...window.history.state,
          hearstReaderStory: storyId,
        },
        "",
        appendReaderReturnHref(storyId, storyOpenReturnHref)
      );
    }
  }, [rememberSessionContinueReadingStory, setOpenStoryId, storyOpenReturnHref]);

  const closeStory = React.useCallback(() => {
    setOpenStoryId(null);
    if (pathname?.startsWith("/read/")) {
      router.push(currentReaderReturnHref, { scroll: false });
      restoreReaderReturnScrollSnapshot(currentReaderReturnHref);
    }
  }, [currentReaderReturnHref, pathname, router, setOpenStoryId]);

  const openDelishShort = React.useCallback((story: LifestyleRiverStory) => {
    delishShortOpenerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setOpenDelishShortStory(story);
    setOpenDelishShortId(story.id);
  }, []);

  const closeDelishShort = React.useCallback(() => {
    setOpenDelishShortId(null);
    setOpenDelishShortStory(null);
    window.requestAnimationFrame(() => delishShortOpenerRef.current?.focus());
  }, []);

  const openStoryFromDelishShort = React.useCallback((storyId: string) => {
    setOpenDelishShortId(null);
    setOpenDelishShortStory(null);
    openStory(storyId);
  }, [openStory]);

  const updateReaderProfile = React.useCallback((
    updater: React.SetStateAction<LifestyleRiverProfile>,
    savedStory?: LifestyleRiverStory
  ) => {
    const next = typeof updater === "function" ? updater(profile) : updater;
    if (readerAccountId) {
      updatePreferences(next, savedStory ? [savedStory] : []);
    } else {
      setProfileState({ sourceKey: profileSourceKey, value: next });
    }
  }, [profile, profileSourceKey, readerAccountId, updatePreferences]);

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
  const visibleStoryScopeKey = [
    activeFilter,
    demoState.contentDay,
    demoState.daypart,
    effectiveBrandFilters.join(","),
  ].join(":");
  const [visibleStoryState, setVisibleStoryState] = React.useState({
    scopeKey: visibleStoryScopeKey,
    count: initialLifestyleRiverStoryCount,
  });
  const visibleCount = visibleStoryState.scopeKey === visibleStoryScopeKey
    ? visibleStoryState.count
    : initialLifestyleRiverStoryCount;
  const setVisibleCount = React.useCallback<React.Dispatch<React.SetStateAction<number>>>((updater) => {
    setVisibleStoryState((current) => {
      const currentCount = current.scopeKey === visibleStoryScopeKey
        ? current.count
        : initialLifestyleRiverStoryCount;
      const nextCount = typeof updater === "function" ? updater(currentCount) : updater;
      return { scopeKey: visibleStoryScopeKey, count: nextCount };
    });
  }, [visibleStoryScopeKey]);
  const activeStoryPool = React.useMemo(
    () => usingVideoTabFeed ? videoTabStories : getLifestyleDemoStoryPool(demoState, config),
    [config, demoState, usingVideoTabFeed, videoTabStories]
  );

  React.useEffect(() => {
    if (activeFilter === "Videos" && previousActiveFilterRef.current !== "Videos") {
      setActiveBrandFilters([]);
    }
    previousActiveFilterRef.current = activeFilter;
  }, [activeFilter, setActiveBrandFilters]);
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
  const savedSuggestionCandidates = React.useMemo(
    () => rankedStories.filter((story) =>
      !profile.savedIds.includes(story.id)
      && !profile.hiddenIds.includes(story.id)
      && (effectiveBrandFilters.length === 0 || effectiveBrandFilters.includes(story.brand))
    ),
    [effectiveBrandFilters, profile.hiddenIds, profile.savedIds, rankedStories]
  );
  const savedSuggestionStories = activeFilter === "Saved"
    ? getPersonalizedLeadSliderStories(
        savedSuggestionCandidates,
        rankingProfile,
        demoState,
        config,
        3,
        config.liveFeedMode === "blend"
      )
    : [];
  React.useEffect(() => {
    if (activeFilter !== "Saved" || profile.savedIds.length > 0) return;
    trackProductEventOnce(
      `saved-empty:${destination}:${initialBrandSlug ?? "all-brands"}`,
      "saved_empty_view",
      {
        destination,
        active_filter_count: effectiveBrandFilters.length,
        suggestion_count: savedSuggestionStories.length,
      }
    );
  }, [
    activeFilter,
    destination,
    effectiveBrandFilters.length,
    initialBrandSlug,
    profile.savedIds.length,
    savedSuggestionStories.length,
  ]);
  const shouldUseTodaysPicks = activeFilter === "For You"
    && !initialBrandSlug
    && effectiveBrandFilters.length === 0
    && !usingVideoTabFeed;
  const availableReaderStories = React.useMemo(() => {
    const seenStoryIds = new Set<string>();
    return [
      ...config.stories,
      ...destinationConfigs[destination].stories,
      ...destinationConfigs.all.stories,
      ...videoTabStories,
    ].filter((story) => {
      if (seenStoryIds.has(story.id)) return false;
      seenStoryIds.add(story.id);
      return true;
    });
  }, [config.stories, destination, destinationConfigs, videoTabStories]);
  const candidateDisplayStories = React.useMemo(() => {
    if (!config.liveFeedStatus || config.liveFeedMode === "blend") return filteredStories;
    const firstVideoIndex = filteredStories.findIndex((story) => Boolean(story.videoUrl));
    if (firstVideoIndex < 0 || firstVideoIndex < 8) return filteredStories;

    const reorderedStories = [...filteredStories];
    const [firstVideo] = reorderedStories.splice(firstVideoIndex, 1);
    reorderedStories.splice(Math.min(5, reorderedStories.length), 0, firstVideo);
    return reorderedStories;
  }, [config.liveFeedMode, config.liveFeedStatus, filteredStories]);
  const displayOrderScopeKey = React.useMemo(() => JSON.stringify({
    activeFilter,
    destination,
    effectiveBrandFilters,
    initialBrandSlug,
    demoState,
    profile: rankingProfile,
    usingVideoTabFeed,
  }), [activeFilter, demoState, destination, effectiveBrandFilters, initialBrandSlug, rankingProfile, usingVideoTabFeed]);
  const candidateDisplayStoryIds = React.useMemo(
    () => applyReaderReturnStoryOrder(
      storyOpenReturnHref,
      candidateDisplayStories.map((story) => story.id)
    ),
    [candidateDisplayStories, storyOpenReturnHref]
  );
  const [displayOrderState, setDisplayOrderState] = React.useState<{ scopeKey: string; storyIds: string[] }>({
    scopeKey: "",
    storyIds: [],
  });
  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setDisplayOrderState((current) =>
          mergeStableStoryOrder(current, displayOrderScopeKey, candidateDisplayStoryIds)
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [candidateDisplayStoryIds, displayOrderScopeKey]);
  const displayStories = React.useMemo(() => {
    const storiesById = new Map(candidateDisplayStories.map((story) => [story.id, story]));
    const activeStoryIds = displayOrderState.scopeKey === displayOrderScopeKey
      ? displayOrderState.storyIds
      : candidateDisplayStoryIds;

    return activeStoryIds
      .map((storyId) => storiesById.get(storyId))
      .filter((story): story is LifestyleRiverStory => Boolean(story));
  }, [candidateDisplayStories, candidateDisplayStoryIds, displayOrderScopeKey, displayOrderState]);
  React.useEffect(() => {
    displayStoryIdsRef.current = displayStories.map((story) => story.id);
  }, [displayStories]);
  const visibleStories = displayStories.slice(0, visibleCount);
  React.useEffect(() => {
    feedDemandRef.current = {
      feedHasMore,
      feedLoading,
      filteredStoryCount: filteredStories.length,
      onRequestNextFeedPage,
      visibleCount,
    };
  }, [
    feedHasMore,
    feedLoading,
    filteredStories.length,
    onRequestNextFeedPage,
    visibleCount,
  ]);
  const currentDelishVerticalVideoStories = React.useMemo(
    () => videoTabStories.filter(isDelishPortraitShort),
    [videoTabStories]
  );
  const delishVerticalVideoStories = React.useMemo(() => {
    const catalogVerticalVideoStories = config.stories.filter(isDelishPortraitShort);
    const supplementalVerticalVideoStories = delishSupplementalStories.filter(isDelishPortraitShort);

    // Keep one portrait-only inventory for both the carousel and immersive
    // viewer. Feed refreshes may replace either source, so merge all sources
    // here and never let the two surfaces count different subsets.
    return mergeUniqueStories(currentDelishVerticalVideoStories, catalogVerticalVideoStories, supplementalVerticalVideoStories);
  }, [config.stories, currentDelishVerticalVideoStories, delishSupplementalStories]);
  const handleDelishSupplementalStories = React.useCallback((stories: LifestyleRiverStory[]) => {
    setDelishSupplementalStories((current) => mergeUniqueStories(current, stories));
  }, []);
  const delishShortModalStories = React.useMemo(() => {
    if (!openDelishShortStory || delishVerticalVideoStories.some((story) => story.id === openDelishShortStory.id)) {
      return delishVerticalVideoStories;
    }

    // Keep the clicked card available if a progressive feed refresh replaces
    // the source array before the immersive viewer renders.
    return mergeUniqueStories(delishVerticalVideoStories, [openDelishShortStory]);
  }, [delishVerticalVideoStories, openDelishShortStory]);
  const delishVerticalVideoIds = new Set(delishVerticalVideoStories.map((story) => story.id));
  const isDelishPublicationRiver = initialBrandSlug === "delish" && !usingVideoTabFeed;
  const showDelishVerticalVideoCarousel = usingVideoTabFeed
    && (effectiveBrandFilters.length === 0 || effectiveBrandFilters.includes("Delish"));
  const showDelishPublicationShorts = isDelishPublicationRiver && delishVerticalVideoStories.length > 0;
  const showDelishShortsInHearstPlusRiver = destination === "all"
    && !initialBrandSlug
    && !usingVideoTabFeed
    && activeFilter === "For You"
    && delishVerticalVideoStories.length > 0
    && (effectiveBrandFilters.length === 0 || effectiveBrandFilters.includes("Delish"));
  const personalizedHeroStories = getPersonalizedLeadSliderStories(
    visibleStories,
    rankingProfile,
    demoState,
    config,
    shouldUseTodaysPicks ? 15 : 5,
    config.liveFeedMode === "blend"
  );
  const dailyEditionKey = shouldUseTodaysPicks
    ? `${editionDate}:${destination}:todays-picks`
    : "";
  const dailyEditionStories = useDailyEditionStories(
    dailyEditionKey,
    personalizedHeroStories,
    5
  );
  const heroStories = shouldUseTodaysPicks && dailyEditionStories.length > 0
    ? dailyEditionStories
    : personalizedHeroStories.slice(0, 5);
  const leadStory = (
    demoState.returnHours > 0 && demoState.previousLeadId
      ? heroStories.find((story) => story.id !== demoState.previousLeadId)
      : heroStories[0]
  ) ?? heroStories[0] ?? visibleStories[0];
  React.useEffect(() => {
    if (demoState.isSimulated || initialOpenStoryId) return;
    trackProductEventOnce(`return-session:${visitScopeKey}`, "return_session", {
      destination,
      edition_id: editionDate,
      daypart: demoState.daypart,
      returning: demoState.returnHours > 0,
      return_hours: demoState.returnHours,
      return_window: getReturnWindow(demoState.returnHours),
      unfinished_count: sessionContinueReadingStoryIds.length,
    });
  }, [
    sessionContinueReadingStoryIds.length,
    demoState.daypart,
    demoState.isSimulated,
    demoState.returnHours,
    destination,
    editionDate,
    initialOpenStoryId,
    visitScopeKey,
  ]);
  const trackTodaysPicksImpression = React.useCallback(() => {
    if (!shouldUseTodaysPicks || demoState.isSimulated || initialOpenStoryId) return;
    trackProductEventOnce(`edition-impression:${dailyEditionKey}`, "edition_impression", {
      destination,
      edition_id: dailyEditionKey,
      story_count: heroStories.length,
      daypart: demoState.daypart,
    });
  }, [
    dailyEditionKey,
    demoState.daypart,
    demoState.isSimulated,
    destination,
    heroStories.length,
    initialOpenStoryId,
    shouldUseTodaysPicks,
  ]);
  const trackTodaysPickOpen = React.useCallback((
    story: LifestyleRiverStory,
    position: number
  ) => {
    if (!shouldUseTodaysPicks || demoState.isSimulated) return;
    trackProductEvent("edition_story_open", {
      destination,
      edition_id: dailyEditionKey,
      story_id: story.id,
      position,
      format: story.videoUrl ? "video" : "article",
      brand: story.brand,
      topic: story.topic,
    });
  }, [dailyEditionKey, demoState.isSimulated, destination, shouldUseTodaysPicks]);
  React.useEffect(() => {
    if (
      demoState.isSimulated
      || !shouldUseTodaysPicks
      || !leadStory
      || recordedVisitScopeRef.current === visitScopeKey
    ) return;

    writeVisitRecords(upsertVisitRecord(readVisitRecords(), {
      scopeKey: visitScopeKey,
      visitedAt: visitStartedAt,
      editionId: editionDate,
      leadStoryId: leadStory.id,
    }));
    recordedVisitScopeRef.current = visitScopeKey;
  }, [
    demoState.isSimulated,
    editionDate,
    leadStory,
    shouldUseTodaysPicks,
    visitScopeKey,
    visitStartedAt,
  ]);
  const heroStoryIds = new Set(heroStories.map((story) => story.id));
  const moduleAllocation = allocateStoryModules({
    stories: displayStories,
    heroStoryIds,
    continueStoryIds: sessionContinueReadingStoryIds,
    followedBrands: profile.followedBrands,
    savedTags: profile.savedTags,
  });
  const moduleReservedStoryIds = new Set([
    ...heroStoryIds,
    ...Object.values(moduleAllocation.todayEdit)
      .filter((story): story is LifestyleRiverStory => Boolean(story))
      .map((story) => story.id),
    ...moduleAllocation.dailyHabitStories.map((story) => story.id),
    ...moduleAllocation.trendingStories.map((story) => story.id),
  ]);
  const completeBaseRiverStories = moduleAllocation.riverStories.filter(
    (story) => !showDelishShortsInHearstPlusRiver || !delishVerticalVideoIds.has(story.id)
  );
  const completeRiverStories = ensureGallerySampleInRiver(
    completeBaseRiverStories,
    displayStories,
    moduleReservedStoryIds,
    !usingVideoTabFeed && activeFilter !== "Saved"
  );
  const visibleRiverStoryCount = Math.max(0, visibleCount - heroStories.length);
  const baseRiverStories = moduleAllocation.riverStories
    .slice(0, visibleRiverStoryCount)
    .filter(
      (story) => !showDelishShortsInHearstPlusRiver || !delishVerticalVideoIds.has(story.id)
    );
  const riverStories = ensureGallerySampleInRiver(
    baseRiverStories,
    displayStories,
    moduleReservedStoryIds,
    !usingVideoTabFeed && activeFilter !== "Saved"
  );
  const candidateDelishShortsRiverInsertIndex = showDelishShortsInHearstPlusRiver
    ? getDelishShortsRiverInsertIndex({
        riverStories: completeRiverStories,
      })
    : -1;
  const delishShortsRiverScopeKey = [
    destination,
    initialBrandSlug ?? "all-brands",
    activeFilter,
    effectiveBrandFilters.join(","),
    demoState.contentDay,
    demoState.daypart,
    demoState.returnHours,
  ].join(":");
  const delishShortsRiverInsertIndex = delishShortsRiverPlacement?.scopeKey === delishShortsRiverScopeKey
    ? delishShortsRiverPlacement.index
    : candidateDelishShortsRiverInsertIndex;

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (!showDelishShortsInHearstPlusRiver || candidateDelishShortsRiverInsertIndex < 0) {
        setDelishShortsRiverPlacement(null);
        return;
      }

      setDelishShortsRiverPlacement((currentPlacement) =>
        currentPlacement?.scopeKey === delishShortsRiverScopeKey
          ? currentPlacement
          : {
              scopeKey: delishShortsRiverScopeKey,
              index: candidateDelishShortsRiverInsertIndex,
            }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [
    candidateDelishShortsRiverInsertIndex,
    delishShortsRiverScopeKey,
    showDelishShortsInHearstPlusRiver,
  ]);
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
      count: initialBrandSlug && !usingVideoTabFeed
        ? config.brandInventoryCounts?.[note.brandSlug] ?? counts[note.brand] ?? 0
        : counts[note.brand] ?? 0,
    }));
  }, [activeSourceNotes, activeStoryPool, config.brandInventoryCounts, initialBrandSlug, usingVideoTabFeed]);

  React.useEffect(() => {
    if (usingVideoTabFeed) return;
    const selectedBrand = effectiveBrandFilters.length === 1
      ? sidebarBrands.find((brand) => brand.name === effectiveBrandFilters[0]) ?? null
      : null;
    onSelectedBrandChange?.(selectedBrand ? { name: selectedBrand.name, slug: selectedBrand.slug } : null);
  }, [effectiveBrandFilters, onSelectedBrandChange, sidebarBrands, usingVideoTabFeed]);

  React.useEffect(() => {
    if (!onboardingResult || appliedOnboardingResultRef.current === onboardingResult) return;
    appliedOnboardingResultRef.current = onboardingResult;

    updateReaderProfile((current) => applyOnboardingPreferences(current, config.stories, onboardingResult));
    restoreCurrentVisitContext();
    setActiveBrandFilters([]);
    onRiverReset?.();
  }, [
    config.stories,
    onRiverReset,
    onboardingResult,
    restoreCurrentVisitContext,
    setActiveBrandFilters,
    updateReaderProfile,
  ]);

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
    if (!node) return;

    const requestMoreStories = () => {
      const sentinelBounds = node.getBoundingClientRect();
      const isNearViewport = sentinelBounds.top <= window.innerHeight + 800
        && sentinelBounds.bottom >= -800;
      if (!isNearViewport) {
        sentinelLastDemandScrollYRef.current = Number.NEGATIVE_INFINITY;
        return;
      }

      const now = window.performance.now();
      const scrollDistance = window.scrollY - sentinelLastDemandScrollYRef.current;
      if (scrollDistance < 24 || now - sentinelLastDemandAtRef.current < 300) return;

      sentinelLastDemandScrollYRef.current = window.scrollY;
      sentinelLastDemandAtRef.current = now;
      const demand = feedDemandRef.current;
      if (demand.visibleCount < demand.filteredStoryCount) {
        setVisibleCount((count) => Math.min(count + 12, demand.filteredStoryCount));
      }

      const remainingLoadedStories = demand.filteredStoryCount - demand.visibleCount;
      if (
        remainingLoadedStories <= 8
        && demand.feedHasMore
        && !demand.feedLoading
      ) {
        demand.onRequestNextFeedPage?.();
      }
    };

    let demandInterval: number | null = null;
    const stopDemandChecks = () => {
      if (demandInterval === null) return;
      window.clearInterval(demandInterval);
      demandInterval = null;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          sentinelLastDemandScrollYRef.current = Number.NEGATIVE_INFINITY;
          stopDemandChecks();
          return;
        }

        requestMoreStories();
        if (demandInterval === null) {
          demandInterval = window.setInterval(requestMoreStories, 350);
        }
      },
      { rootMargin: "800px 0px" }
    );

    observer.observe(node);
    return () => {
      sentinelLastDemandScrollYRef.current = Number.NEGATIVE_INFINITY;
      stopDemandChecks();
      observer.disconnect();
    };
  }, [displayOrderScopeKey, setVisibleCount]);

  const resetDemo = () => {
    updateReaderProfile(config.initialProfile);
    restoreCurrentVisitContext();
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
    setDemoState({
      returnHours,
      daypart,
      contentDay,
      previousLeadId,
      isSimulated: true,
    });
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
    const saved = profile.savedIds.includes(story.id);
    trackProductEvent("story_save_toggle", {
      destination,
      story_id: story.id,
      state: saved ? "unsaved" : "saved",
      surface: activeFilter === "Saved" ? "saved" : "river",
    });
    if (!saved) markUsefulSession(destination, "story_save", story.id);
    updateReaderProfile((current) => {
      return {
        ...current,
        savedIds: saved
          ? current.savedIds.filter((id) => id !== story.id)
          : [...current.savedIds, story.id],
        savedTags: saved ? current.savedTags : mergeUnique(current.savedTags, story.tags.slice(0, 2)),
      };
    }, story);
  };

  const boostStory = (story: LifestyleRiverStory) => {
    trackProductEvent("more_like_this", {
      destination,
      story_id: story.id,
      surface: activeFilter === "Saved" ? "saved" : "river",
    });
    markUsefulSession(destination, "more_like_this", story.id);
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
  const browseForYou = () => {
    trackProductEvent("saved_browse_for_you", { destination });
    setActiveBrandFilters([]);
    onFilterChange?.("For You");
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

  const hideStory = (id: string) => {
    trackProductEvent("story_hide", {
      destination,
      story_id: id,
      surface: activeFilter === "Videos" ? "video_river" : "river",
    });
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
  const standardVideoStories = videoStories.filter((story) => !delishVerticalVideoIds.has(story.id));
  const featuredVideo = standardVideoStories[0] ?? videoStories[0] ?? leadStory;
  const remainingVideoStories = featuredVideo
    ? standardVideoStories.filter((story) => story.id !== featuredVideo.id)
    : standardVideoStories;
  const trendingVideoStories = videoStories
    .filter((story) => story.id !== featuredVideo?.id)
    .sort((left, right) =>
      right.popularity - left.popularity
      || Date.parse(right.publishedAt ?? "") - Date.parse(left.publishedAt ?? "")
      || left.title.localeCompare(right.title)
    )
    .slice(0, 4);
  // Scoped exception: the Videos tab uses the dark video-index treatment inside otherwise light destinations.
  // Keep these tokens local to this wrapper so the exception does not affect the global Hearst+ theme.
  const videoDarkModeThemeClasses =
    "hearst-plus-theme bg-[var(--hp-background)] text-[var(--hp-text-primary)] [--background:#000000] [--foreground:#f8fbff] [--card:#181b20] [--card-foreground:#f4f7fb] [--popover:#181b20] [--popover-foreground:#f4f7fb] [--muted:#20242b] [--muted-foreground:#aab5c3] [--secondary:#20242b] [--secondary-foreground:#f4f7fb] [--accent:#232a33] [--accent-foreground:#dbe3ed] [--border:rgba(255,255,255,0.12)] [--input:rgba(255,255,255,0.16)] [--primary:#BDDDFC] [--primary-foreground:#0d1014] [--ring:#BDDDFC] [--hp-background:#000000] [--hp-surface-deep:#05070a] [--hp-surface-low:#181b20] [--hp-surface:#181b20] [--hp-control:#20242b] [--hp-control-hover:#2a3038] [--hp-chip:rgba(255,255,255,0.07)] [--hp-chip-border:rgba(255,255,255,0.08)] [--hp-border:rgba(255,255,255,0.12)] [--hp-border-strong:rgba(255,255,255,0.22)] [--hp-text-headline:#f8fbff] [--hp-text-primary:#f4f7fb] [--hp-text-ui:#dbe3ed] [--hp-text-chip:#cad5e2] [--hp-text-secondary:#aab5c3] [--hp-text-muted:#95a0ad] [--hp-sidebar-heading:#BDDDFC] [--hp-primary:#BDDDFC] [--hp-primary-soft:#253746] [--hp-friendly-accent:#253746] [--hp-friendly-accent-border:#BDDDFC] [--hp-friendly-accent-text:#BDDDFC] [--hp-focus:#BDDDFC] [--hp-signal:#BDDDFC] [--hp-action:#BDDDFC] [--hp-action-text:#0d1014] [--hp-shadow-card:0_2px_6px_rgba(0,0,0,0.18)] [--color-accent-foreground:var(--accent-foreground)] [--color-accent:var(--accent)] [--color-background:var(--background)] [--color-border:var(--border)] [--color-card-foreground:var(--card-foreground)] [--color-card:var(--card)] [--color-foreground:var(--foreground)] [--color-muted-foreground:var(--muted-foreground)] [--color-muted:var(--muted)] [--color-primary-foreground:var(--primary-foreground)] [--color-primary:var(--primary)] [--color-secondary-foreground:var(--secondary-foreground)] [--color-secondary:var(--secondary)]";

  if (activeFilter === "Games") {
    return <HearstGamesIndex />;
  }

  if (isVideoQueueView) {
    return (
      <div
        className={cn(
          "space-y-6",
          useVideoDarkMode && videoDarkModeThemeClasses,
          usingVideoTabFeed &&
            "relative isolate bg-black pb-4 pt-6 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-black sm:pt-8"
        )}
        data-mode={useVideoDarkMode ? "dark" : undefined}
      >
        <div
          className={cn(
            "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]",
            !usingVideoTabFeed && "mt-6 sm:mt-8"
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
            className="min-w-0 space-y-4"
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

                {showDelishVerticalVideoCarousel ? (
                  <DelishVerticalVideoCarousel
                    stories={delishVerticalVideoStories}
                    onOpen={openDelishShort}
                    onSupplementalStories={handleDelishSupplementalStories}
                  />
                ) : null}

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

                <div
                  ref={sentinelRef}
                  className="flex justify-center py-6"
                  data-story-river-sentinel
                  aria-live="polite"
                >
                  <ProgressiveFeedSentinelStatus
                    error={feedError}
                    hasLoadedStories={visibleCount < filteredStories.length}
                    hasMore={feedHasMore}
                    isLoading={feedLoading}
                    noun="videos"
                    onRetry={onRequestNextFeedPage}
                  />
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
                Trending videos
              </p>
              <div className="mt-4 space-y-4">
                {trendingVideoStories.map((story, index) => (
                  <VideoRailCard
                    key={story.id}
                    story={story}
                    onOpen={() => openStory(story.id)}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>

            {showStakeholderTools ? (
              <>
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
              </>
            ) : null}
          </aside>
        </div>

        {openStoryId ? (
          <LifestyleStoryReaderModal
            key={storyOpenReturnHref}
            stories={filteredStories}
            availableStories={availableReaderStories}
            openStoryId={openStoryId}
            savedIds={profile.savedIds}
            followedBrands={profile.followedBrands}
            commentsByStoryId={resolvedCommentsByStoryId}
            readerReturnHref={storyOpenReturnHref}
            initialOpenAmbientReader={initialOpenAmbientReader}
            onClose={closeStory}
            onOpenStory={openStory}
            onSwitchReaderStory={switchReaderStory}
            onSave={toggleSaved}
            onMoreLikeThis={boostStory}
            onToggleFollowBrand={toggleFollowBrand}
            onAddComment={addStoryComment}
          />
        ) : null}

        <DelishShortsImmersiveModal
          stories={delishShortModalStories}
          openStoryId={openDelishShortId}
          savedIds={profile.savedIds}
          onClose={closeDelishShort}
          onSelectStory={setOpenDelishShortId}
          onOpenStory={openStoryFromDelishShort}
          onSave={toggleSaved}
        />

        {showStakeholderTools ? (
          <>
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
              inventoryStories={activeStoryPool}
              eligibleStories={filteredStories}
              scopeLabel={effectiveBrandFilters.length > 0 ? effectiveBrandFilters.join(", ") : config.productName}
              onDaypartChange={(daypart) =>
                setDemoState((current) => ({
                  ...current,
                  daypart,
                  returnHours: demoDaypartReturnHours[daypart],
                  contentDay: "today",
                  previousLeadId: featuredVideo?.id ?? current.previousLeadId,
                  isSimulated: true,
                }))
              }
              onSimulateReturn={simulateReturn}
              onApplyBehaviorPreset={applyBehaviorPreset}
              onResetDemo={resetDemo}
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TodayEditDashboard
        selection={moduleAllocation.todayEdit}
        measurementEnabled={!openStoryId}
        onOpenStory={openStory}
        onContinueImpression={(storyId) => {
          trackProductEventOnce(
            `resume-impression:desktop:${storyId}`,
            "resume_impression",
            {
              destination,
              story_id: storyId,
              entry_point: "desktop_edit",
            }
          );
        }}
        onContinueOpen={(storyId) => {
          trackProductEvent("story_resume", {
            destination,
            story_id: storyId,
            entry_point: "desktop_edit",
          });
        }}
      />

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <LifestyleLeftSidebar
          profile={profile}
          topStories={moduleAllocation.dailyHabitStories}
          topics={sidebarTopics}
          brands={sidebarBrands}
          brandFilterTitle={initialBrandSlug && !usingVideoTabFeed ? "Global Story Inventory" : undefined}
          globalInventory={Boolean(initialBrandSlug && !usingVideoTabFeed)}
          activeBrandFilters={effectiveBrandFilters}
          collectionLabels={config.collectionLabels}
          onToggleBrandFilter={toggleBrandFilter}
          onClearBrandFilters={clearBrandFilters}
          onFollowTopic={followTopic}
          onOpenStory={(story) => openStory(story.id)}
        />

        <main id="hearst-story-river" className="min-w-0 scroll-mt-28 space-y-4" aria-label={config.riverLabel}>
          <h1 className="sr-only">{pageHeading}</h1>
          {leadStory ? (
            <>
              <LifestyleLeadSlider
                key={`${leadStory.id}:${heroStories.map((story) => story.id).join("|")}`}
                stories={heroStories}
                editionLabel={shouldUseTodaysPicks ? "Today’s Picks" : undefined}
                initialStoryId={leadStory.id}
                savedIds={profile.savedIds}
                commentsByStoryId={resolvedCommentsByStoryId}
                onOpenStory={(story) => openStory(story.id)}
                onSave={toggleSaved}
                onMoreLikeThis={boostStory}
                onFollowBrand={followBrand}
                onEditionImpression={trackTodaysPicksImpression}
                onEditionStoryOpen={trackTodaysPickOpen}
                indicatorPalette={indicatorPalette}
              />

              {showDelishPublicationShorts ? (
                <DelishVerticalVideoCarousel
                  stories={delishVerticalVideoStories}
                  onOpen={openDelishShort}
                  onSupplementalStories={handleDelishSupplementalStories}
                  theme="light"
                />
              ) : null}

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
                const recommendationReason = activeFilter === "For You"
                  ? getLifestyleRecommendationReason(story, rankingProfile, demoState, config)
                  : undefined;

                return (
                  <React.Fragment key={story.id}>
                    {index === delishShortsRiverInsertIndex ? (
                      <DelishVerticalVideoCarousel
                        stories={delishVerticalVideoStories}
                        onOpen={openDelishShort}
                        onSupplementalStories={handleDelishSupplementalStories}
                        theme="light"
                      />
                    ) : null}
                    {getLifestyleCardKind(story) === "video" ? (
                      <VideoIndexCard
                        story={story}
                        recommendationReason={recommendationReason}
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
                        recommendationReason={recommendationReason}
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

              {delishShortsRiverInsertIndex === riverStories.length ? (
                <DelishVerticalVideoCarousel
                  stories={delishVerticalVideoStories}
                  onOpen={openDelishShort}
                  onSupplementalStories={handleDelishSupplementalStories}
                  theme="light"
                />
              ) : null}

              <div
                ref={sentinelRef}
                className="flex justify-center py-6"
                data-story-river-sentinel
                aria-live="polite"
              >
                <ProgressiveFeedSentinelStatus
                  error={feedError}
                  hasLoadedStories={visibleCount < filteredStories.length}
                  hasMore={feedHasMore}
                  isLoading={feedLoading}
                  noun="stories"
                  onRetry={onRequestNextFeedPage}
                />
              </div>
            </>
          ) : (
            activeFilter === "Saved" ? (
              <section
                className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-5 shadow-[var(--hp-shadow-card)] sm:p-6"
                aria-labelledby="saved-empty-title"
              >
                <div className="max-w-xl">
                  <h2 id="saved-empty-title" className="headline text-2xl leading-tight sm:text-3xl">
                    {profile.savedIds.length === 0
                      ? "Save stories to build your reading list."
                      : "No saved stories match this view."}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {profile.savedIds.length === 0
                      ? "Keep articles, videos, and ideas here so they’re easy to find when you’re ready to return."
                      : "Browse all recommendations or clear the current brand filter to find the stories you saved."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" onClick={browseForYou}>
                      Browse For You
                    </Button>
                    {effectiveBrandFilters.length > 0 ? (
                      <Button type="button" variant="outline" onClick={clearBrandFilters}>
                        Clear brand filter
                      </Button>
                    ) : null}
                  </div>
                </div>

                {profile.savedIds.length === 0 && savedSuggestionStories.length > 0 ? (
                  <div className="mt-7 border-t border-border pt-5">
                    <h3 className="text-sm font-bold text-[var(--hp-section-title)]">
                      Suggested for you
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {savedSuggestionStories.map((story) => (
                        <article
                          key={story.id}
                          className="flex min-w-0 flex-col overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface-low)]"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              trackProductEvent("saved_suggestion_open", {
                                destination,
                                story_id: story.id,
                                position: savedSuggestionStories.indexOf(story) + 1,
                              });
                              openStory(story.id);
                            }}
                            className="group flex min-w-0 flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
                            aria-label={`Open suggested story: ${story.title}`}
                          >
                            <span className="block aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted" aria-hidden="true">
                              <img
                                src={story.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover object-top"
                                style={{ objectPosition: "center top" }}
                              />
                            </span>
                            <span className="block p-3">
                              <span className="block text-xs font-bold text-[var(--hp-section-title)]">
                                {story.brand} · {story.topic}
                              </span>
                              <span className="mt-1 line-clamp-3 block text-sm font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
                                {story.title}
                              </span>
                            </span>
                          </button>
                          <div className="border-t border-border px-3 py-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              className="w-full justify-center"
                              onClick={() => {
                                trackProductEvent("saved_suggestion_save", {
                                  destination,
                                  story_id: story.id,
                                  position: savedSuggestionStories.indexOf(story) + 1,
                                });
                                toggleSaved(story);
                              }}
                              aria-label={`Save suggested story: ${story.title}`}
                            >
                              <Bookmark className="h-4 w-4" aria-hidden />
                              Save story
                            </Button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ) : (
              <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-8 text-center shadow-[var(--hp-shadow-card)]">
                <p className="headline text-2xl">No stories in {activeFilter} yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clear a brand filter or switch back to For You to keep exploring.
                </p>
              </div>
            )
          )}
        </main>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:max-h-[calc(100dvh-136px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          {moduleAllocation.trendingStories.length > 0 ? (
          <div
            className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
            data-story-module="trending"
          >
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
              Trending Across Brands
            </p>
            <ol className="mt-4 space-y-3">
              {moduleAllocation.trendingStories.map((story, index) => (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => openStory(story.id)}
                    data-story-id={story.id}
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
                      <span className="text-xs text-muted-foreground">{story.brand} · {story.topic} · {getLifestyleByline(story)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          ) : null}
          {showStakeholderTools ? (
            <>
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
                    <p className="font-bold">Visit context</p>
                    <p className="mt-1 text-muted-foreground">
                      {demoState.isSimulated ? "Simulation · " : "Local visit · "}
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
            </>
          ) : null}
        </aside>
      </div>

      {openStoryId ? (
        <LifestyleStoryReaderModal
          key={storyOpenReturnHref}
          stories={filteredStories}
          availableStories={availableReaderStories}
          openStoryId={openStoryId}
          savedIds={profile.savedIds}
          followedBrands={profile.followedBrands}
          commentsByStoryId={resolvedCommentsByStoryId}
          readerReturnHref={storyOpenReturnHref}
          initialOpenAmbientReader={initialOpenAmbientReader}
          onClose={closeStory}
          onOpenStory={openStory}
          onSwitchReaderStory={switchReaderStory}
          onSave={toggleSaved}
          onMoreLikeThis={boostStory}
          onToggleFollowBrand={toggleFollowBrand}
          onAddComment={addStoryComment}
        />
      ) : null}

      <DelishShortsImmersiveModal
        stories={delishShortModalStories}
        openStoryId={openDelishShortId}
        savedIds={profile.savedIds}
        onClose={closeDelishShort}
        onSelectStory={setOpenDelishShortId}
        onOpenStory={openStoryFromDelishShort}
        onSave={toggleSaved}
      />

      {showStakeholderTools ? (
        <>
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
            inventoryStories={activeStoryPool}
            eligibleStories={filteredStories}
            scopeLabel={effectiveBrandFilters.length > 0 ? effectiveBrandFilters.join(", ") : config.productName}
            onDaypartChange={(daypart) =>
              setDemoState((current) => ({
                ...current,
                daypart,
                returnHours: demoDaypartReturnHours[daypart],
                contentDay: "today",
                previousLeadId: leadStory?.id ?? current.previousLeadId,
                isSimulated: true,
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
        </>
      ) : null}
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
  initialOpenAmbientReader,
  readerReturnHref,
  navLinksOverride,
  staticDestinationData,
  globalBrandInventory,
  onboardingBrandInventory,
}: HomePageTemplateProps = {}) {
  const { brand, colorMode } = useTheme();
  const { account } = useReaderAccount();
  const router = useRouter();
  const pathname = usePathname();
  const pageSearchParams = useSearchParams();
  const pageSearchQuery = pageSearchParams?.toString();
  const showStakeholderTools = pageSearchParams?.get("demo") === "1"
    || process.env.NEXT_PUBLIC_HEARST_STAKEHOLDER_TOOLS === "true";
  const continueReadingStoryIds = useContinueReadingStoryIds();
  const destinationConfigs = React.useMemo(
    () => createDestinationConfigs(staticDestinationData),
    [staticDestinationData]
  );
  const [activeLifestyleFilter, setActiveLifestyleFilter] = React.useState(initialFilter ?? "For You");
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [onboardingResult, setOnboardingResult] = React.useState<HearstOnboardingResult | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
  const [authDialogMode, setAuthDialogMode] = React.useState<"create" | "signIn">("create");
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [selectedBrand, setSelectedBrand] = React.useState<{ name: string; slug: string } | null>(() =>
    getBrandRouteInfo(destinationConfigs.all.sourceNotes, initialBrandSlug)
  );
  const selectedBrandTheme = React.useMemo(
    () => getSelectedBrandTheme(selectedBrand, brand),
    [brand, selectedBrand]
  );
  const selectedBrandCssVars = React.useMemo(
    () => selectedBrandTheme ? brandToCssVars(selectedBrandTheme, colorMode) : undefined,
    [colorMode, selectedBrandTheme]
  );
  const selectedBrandIndicatorPalette = React.useMemo(
    () => selectedBrand?.slug === "delish" && selectedBrandTheme
      ? ["1", "2", "3", "4", "5"].map((token) => selectedBrandTheme.colors[token])
      : undefined,
    [selectedBrand?.slug, selectedBrandTheme]
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
  const openPersonalization = React.useCallback(() => {
    if (account) {
      setProfileOpen(true);
      return;
    }
    setOnboardingOpen(true);
  }, [account]);
  React.useEffect(() => {
    if (selectedBrand) return;

    const syncFilterFromHistory = () => {
      const currentPath = window.location.pathname;
      const destinationRoot = getHearstDestinationRoute(destinationMode);
      if (currentPath === destinationRoot || currentPath === destinationRoot.replace(/\/$/, "")) {
        setActiveLifestyleFilter("For You");
        document.title = destinationPageNames[destinationMode];
        return;
      }

      const categorySlug = currentPath.split("/").filter(Boolean).at(-1);
      const categoryLabel = categorySlug
        ? getHearstDestinationCategoryLabel(destinationMode, categorySlug)
        : undefined;
      if (categoryLabel) {
        setActiveLifestyleFilter(categoryLabel);
        document.title = getDestinationCategoryDocumentTitle(destinationMode, categoryLabel);
      }
    };

    window.addEventListener("popstate", syncFilterFromHistory);
    return () => window.removeEventListener("popstate", syncFilterFromHistory);
  }, [destinationMode, selectedBrand]);
  const progressiveFeedBrandSlug = selectedBrand?.slug ?? getReaderOriginBrandSlug(readerReturnHref);
  const shouldProgressivelyLoadEditorial = activeLifestyleFilter !== "Videos"
    && activeLifestyleFilter !== "Saved"
    && liveFeedMode === "blend";
  const shouldProgressivelyLoadVideo = activeLifestyleFilter === "Videos"
    && Boolean(videoFeedData)
    && liveFeedMode === "blend";
  const progressiveEditorialFeed = useProgressiveFeed<LifestyleRiverStory>({
    enabled: shouldProgressivelyLoadEditorial,
    endpoint: "/api/story-feed/",
    destination: destinationMode,
    brandSlug: progressiveFeedBrandSlug,
    pageSize: 80,
    getIdentity: getStoryIdentity,
  });
  const progressiveVideoFeed = useProgressiveFeed<LifestyleRiverStory>({
    enabled: shouldProgressivelyLoadVideo,
    endpoint: "/api/video-feed/",
    destination: destinationMode,
    brandSlug: progressiveFeedBrandSlug,
    pageSize: 36,
    getIdentity: getStoryIdentity,
  });
  const progressiveEditorialStories = progressiveEditorialFeed.stories;
  const resolvedVideoFeedData = React.useMemo(() => {
    if (!videoFeedData) return undefined;

    return {
      ...videoFeedData,
      stories: mergeUniqueStories(videoFeedData.stories, progressiveVideoFeed.stories),
    };
  }, [progressiveVideoFeed.stories, videoFeedData]);
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
  const inventoryAwareDestinationConfig = React.useMemo<DestinationConfig>(() => (
    initialBrandSlug && globalBrandInventory
      ? { ...destinationConfig, brandInventoryCounts: globalBrandInventory }
      : destinationConfig
  ), [destinationConfig, globalBrandInventory, initialBrandSlug]);
  const initialActiveBrandName = destinationConfig.sourceNotes.find((note) => note.brandSlug === initialBrandSlug)?.brand;
  const initialActiveBrandFilters = React.useMemo(
    () => initialActiveBrandName ? [initialActiveBrandName] : [],
    [initialActiveBrandName]
  );
  const [activeBrandFilterState, setActiveBrandFilterState] = React.useState({
    sourceBrandName: initialActiveBrandName,
    value: initialActiveBrandFilters,
  });
  const activeBrandFilters = activeBrandFilterState.sourceBrandName === initialActiveBrandName
    ? activeBrandFilterState.value
    : initialActiveBrandFilters;
  const setActiveBrandFilters = React.useCallback<React.Dispatch<React.SetStateAction<string[]>>>((updater) => {
    setActiveBrandFilterState((current) => {
      const currentFilters = current.sourceBrandName === initialActiveBrandName
        ? current.value
        : initialActiveBrandFilters;
      const nextFilters = typeof updater === "function" ? updater(currentFilters) : updater;
      return { sourceBrandName: initialActiveBrandName, value: nextFilters };
    });
  }, [initialActiveBrandFilters, initialActiveBrandName]);
  const mobileContinueStories = React.useMemo(() => {
    return continueReadingStoryIds
      .map((storyId) => destinationConfig.stories.find((story) => story.id === storyId))
      .filter((story): story is LifestyleRiverStory => Boolean(story))
      .slice(0, 3);
  }, [continueReadingStoryIds, destinationConfig.stories]);
  React.useEffect(() => {
    const story = mobileContinueStories[0];
    if (
      initialOpenStoryId
      || !story
      || !window.matchMedia("(max-width: 767px)").matches
    ) return;
    trackProductEventOnce(
      `resume-impression:mobile:${story.id}`,
      "resume_impression",
      {
        destination: destinationMode,
        story_id: story.id,
        entry_point: "mobile_strip",
      }
    );
  }, [destinationMode, initialOpenStoryId, mobileContinueStories]);
  const mobileBrands = React.useMemo(() => {
    const counts = inventoryAwareDestinationConfig.stories.reduce<Record<string, number>>((acc, story) => {
      acc[story.brand] = (acc[story.brand] ?? 0) + 1;
      return acc;
    }, {});
    return inventoryAwareDestinationConfig.sourceNotes.map((note) => ({
      name: note.brand,
      slug: note.brandSlug,
      count: inventoryAwareDestinationConfig.brandInventoryCounts?.[note.brandSlug] ?? counts[note.brand] ?? 0,
    }));
  }, [inventoryAwareDestinationConfig]);
  const searchStories = React.useMemo(
    () => activeBrandFilters.length > 0
      ? destinationConfig.stories.filter((story) => activeBrandFilters.includes(story.brand))
      : destinationConfig.stories,
    [activeBrandFilters, destinationConfig.stories]
  );
  const profileTopics = React.useMemo(
    () => Array.from(new Set(destinationConfig.stories.map((story) => story.topic))).sort(),
    [destinationConfig.stories]
  );
  const profileBrands = React.useMemo(
    () => destinationConfig.sourceNotes.map((note) => note.brand),
    [destinationConfig.sourceNotes]
  );
  const accountStoryInventory = React.useMemo(
    () => mergeUniqueStories(
      destinationConfigs.all.stories,
      destinationConfig.stories,
      resolvedVideoFeedData?.stories ?? []
    ),
    [destinationConfig.stories, destinationConfigs.all.stories, resolvedVideoFeedData?.stories]
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
  const handleMobileBrandToggle = React.useCallback((brandName: string) => {
    setActiveBrandFilters((current) => current.includes(brandName) ? [] : [brandName]);
    anchorPageToTop();
  }, [anchorPageToTop, setActiveBrandFilters]);
  const handleMobileBrandClear = React.useCallback(() => {
    setActiveBrandFilters([]);
    anchorPageToTop();
  }, [anchorPageToTop, setActiveBrandFilters]);
  const handleMobileStoryOpen = React.useCallback((storyId: string) => {
    const currentPageHref = pathname
      ? `${pathname}${pageSearchQuery ? `?${pageSearchQuery}` : ""}`
      : null;
    const returnHref = readerReturnHref ?? currentPageHref ?? getHearstDestinationRoute(destinationMode);
    recordStoryOpened(storyId);
    saveReaderReturnScrollSnapshot(storyId, returnHref);
    router.push(appendReaderReturnHref(storyId, returnHref), { scroll: false });
  }, [destinationMode, pageSearchQuery, pathname, readerReturnHref, router]);
  const handleLifestyleFilterChange = React.useCallback((filter: string) => {
    setActiveLifestyleFilter(filter);

    if (!selectedBrand) {
      const nextPath = getHearstDestinationCategoryRoute(destinationMode, filter);
      const nextRoute = nextPath
        ? appendStakeholderDemoMode(nextPath, showStakeholderTools)
        : undefined;
      if (nextRoute && `${window.location.pathname}${window.location.search}` !== nextRoute) {
        window.history.pushState(window.history.state, "", nextRoute);
        document.title = getDestinationCategoryDocumentTitle(destinationMode, filter);
      }
    }

    anchorDestinationContent();
  }, [anchorDestinationContent, destinationMode, selectedBrand, showStakeholderTools]);
  const handleSelectedBrandChange = React.useCallback((nextBrand: { name: string; slug: string } | null) => {
    if ((selectedBrand?.slug ?? null) === (nextBrand?.slug ?? null)) return;

    setActiveLifestyleFilter("For You");
    setSelectedBrand(nextBrand);

    const currentPath = window.location.pathname;
    if (nextBrand) {
      const nextPath = appendStakeholderDemoMode(
        getHearstBrandRoute(nextBrand.slug),
        showStakeholderTools
      );
      if (currentPath !== nextPath) router.push(nextPath, { scroll: false });
    } else if (
      currentPath.startsWith("/brands/")
      || currentPath.startsWith("/lifestyle/")
      || currentPath.startsWith("/autos/")
      || currentPath.startsWith("/flux/")
      || currentPath.startsWith("/ew/")
    ) {
      router.push(
        appendStakeholderDemoMode(getHearstDestinationRoute("all"), showStakeholderTools),
        { scroll: false }
      );
    }
  }, [router, selectedBrand?.slug, showStakeholderTools]);
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
        onCreateAccount={openPersonalization}
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
        mobileContinueStories={mobileContinueStories}
        mobileBrands={mobileBrands}
        searchStories={searchStories}
        activeBrandFilters={activeBrandFilters}
        onMobileStoryOpen={handleMobileStoryOpen}
        onMobileBrandToggle={handleMobileBrandToggle}
        onMobileBrandClear={handleMobileBrandClear}
      />

      {isDestinationRiver && mobileContinueStories[0] ? (
        <PageContainer className="py-3 md:hidden">
          <button
            type="button"
            onClick={() => {
              trackProductEvent("story_resume", {
                destination: destinationMode,
                story_id: mobileContinueStories[0].id,
                entry_point: "mobile_strip",
              });
              handleMobileStoryOpen(mobileContinueStories[0].id);
            }}
            className={cn(
              "group flex min-h-16 w-full items-center gap-3 rounded-[8px] border px-2.5 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              useVideosDarkHeader
                ? "border-white/15 bg-[#0d1014] text-white"
                : "border-border bg-[var(--hp-surface)] text-foreground"
            )}
            aria-label={`Continue reading: ${mobileContinueStories[0].title}`}
          >
            <span
              className="h-12 w-16 shrink-0 rounded-[6px] bg-muted bg-cover bg-center"
              style={{ backgroundImage: `url("${mobileContinueStories[0].image}")` }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
                Continue Reading
              </span>
              <span className="mt-1 line-clamp-1 text-sm font-bold leading-snug group-hover:text-primary">
                {mobileContinueStories[0].title}
              </span>
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0",
                useVideosDarkHeader ? "text-white/60" : "text-muted-foreground"
              )}
              aria-hidden
            />
          </button>
        </PageContainer>
      ) : null}

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
              destinationConfig={inventoryAwareDestinationConfig}
              videoFeedData={resolvedVideoFeedData}
              initialBrandSlug={initialBrandSlug}
              initialOpenStoryId={initialOpenStoryId}
              initialOpenAmbientReader={initialOpenAmbientReader}
              readerReturnHref={readerReturnHref}
              showStakeholderTools={showStakeholderTools}
              onboardingResult={onboardingResult}
              onFilterChange={handleLifestyleFilterChange}
              onRiverReset={anchorDestinationContent}
              onBrandFilterChange={anchorPageToTop}
              onSelectedBrandChange={handleSelectedBrandChange}
              indicatorPalette={selectedBrandIndicatorPalette}
              activeBrandFilters={activeBrandFilters}
              onActiveBrandFiltersChange={setActiveBrandFilters}
              feedHasMore={activeLifestyleFilter === "Videos"
                ? progressiveVideoFeed.hasMore
                : progressiveEditorialFeed.hasMore}
              feedLoading={activeLifestyleFilter === "Videos"
                ? progressiveVideoFeed.isLoading
                : progressiveEditorialFeed.isLoading}
              feedError={activeLifestyleFilter === "Videos"
                ? progressiveVideoFeed.error
                : progressiveEditorialFeed.error}
              onRequestNextFeedPage={activeLifestyleFilter === "Videos"
                ? progressiveVideoFeed.loadNextPage
                : progressiveEditorialFeed.loadNextPage}
            />
          ) : layout === "overlapGrid" ? (
            <OverlapGridHomepageBody brandSlug={brand.slug} />
          ) : (
            <ClassicHomepageBody brandSlug={brand.slug} />
          )}
        </div>
      </PageContainer>

      {isDestinationRiver && onboardingOpen ? (
        <HearstOnboardingModal
          key={destinationMode}
          open={onboardingOpen}
          destination={destinationMode}
          brandInventory={onboardingBrandInventory}
          onClose={() => setOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setOnboardingResult(result);
            anchorDestinationContent();
          }}
          onCreateProfile={(result) => {
            setOnboardingResult(result);
            setOnboardingOpen(false);
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
          onSignIn={() => {
            setOnboardingOpen(false);
            setAuthDialogMode("signIn");
            setAuthDialogOpen(true);
          }}
        />
      ) : null}

      {isDestinationRiver ? (
        <ReaderAuthDialog
          key={`${destinationMode}-${authDialogMode}`}
          open={authDialogOpen}
          initialMode={authDialogMode}
          defaultPreferences={
            onboardingResult
              ? applyOnboardingPreferences(
                  destinationConfigs[destinationMode].initialProfile,
                  destinationConfigs[destinationMode].stories,
                  onboardingResult
                )
              : destinationConfigs[destinationMode].initialProfile
          }
          onClose={() => setAuthDialogOpen(false)}
          onAuthenticated={() => {
            setAuthDialogOpen(false);
            setProfileOpen(true);
          }}
        />
      ) : null}

      {isDestinationRiver ? (
        <>
          {account && profileOpen ? (
            <ReaderProfileDialog
              key={account.id}
              open
              stories={accountStoryInventory}
              topics={profileTopics}
              brands={profileBrands}
              onClose={() => setProfileOpen(false)}
            />
          ) : null}
        </>
      ) : null}

      {/* Footer — full width */}
      <Footer
        flushTop={isDestinationRiver && activeLifestyleFilter === "Videos"}
        socialFinePrintNote={
          isDestinationRiver && activeLifestyleFilter === "Videos"
            ? "Prototype note: videos use available source media in this demo; caption and transcript coverage remains a production content requirement."
            : undefined
        }
      />
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
