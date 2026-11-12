"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import {
  getHearstBrandRoute,
  getHearstDestinationCategoryDisplayLabel,
  getHearstSectionBrands,
  getHearstDestinationCategoryLabel,
  getHearstDestinationCategoryRoute,
  getHearstDestinationRoute,
  getHearstAllBrands,
  getHearstBrandSection,
  hearstReaderSections,
} from "@/lib/hearst-routes";
import {
  communityGroups,
  communityParticipationThreads,
  joinedBrandGroupsChangeEvent,
  joinedBrandGroupsStorageKey,
} from "@/lib/community-groups";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
import { todayEditLocalNewsStory } from "@/lib/hearst-plus-today-edit-stories";
import { hearstEvents } from "@/lib/hearst-events";
import { getHearstAutoResearchCarRating } from "@/lib/hearst-auto-research-cars";
import { getResearchCarFacet } from "@/lib/hearst-auto-research-car-catalog";
import { normalizeReaderReturnHref } from "@/lib/story-routes";
import {
  appendAmbientReaderHref,
  appendReaderReturnHref,
  applyReaderReturnStoryOrder,
  getReaderOriginBrandSlug,
  readReaderReturnScrollSnapshot,
  removeAmbientReaderHref,
  restoreReaderReturnScrollSnapshot,
  saveReaderReturnScrollSnapshot,
} from "@/lib/reader-navigation";
import { themeOptions } from "@/lib/theme-options";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { contentReaderTheme } from "@/lib/content-reader-theme";
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
import { destinationBanners, entertainmentBrandWallBanner, getFeaturedCardColors, hearstPlusBrandWallBanner } from "@/lib/brand-banners";
import { HearstPlusBrandWall } from "@/components/hearst-plus/hearst-plus-brand-wall";
import { BrandInstagramModule } from "@/components/hearst-plus/brand-instagram-module";
import {
  Bookmark,
  Camera,
  Check,
  ChevronRight,
  ChevronUpIcon,
  ChefHat,
  ImageIcon,
  Mail,
  Menu,
  Moon,
  Pause,
  Play,
  Plus,
  LayoutCards,
  LayoutFullWidth,
  LayoutList,
  LayoutSections,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
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
import { setRiverLayout, useRiverLayout, type RiverLayout } from "@/lib/river-layout";
import { useReaderAccount } from "./reader-account";
import { ReaderAuthDialog, ReaderProfileDialog, SaveAcrossDevicesDialog } from "./reader-account-ui";
import { StorySaveIconButton } from "@/components/hearst-plus/story-actions";
import { AdaptiveVideo } from "./adaptive-video";
import { useProgressiveFeed } from "./hearst-plus/use-progressive-feed";
import {
  LifestyleRiverLoadingState,
  ProgressiveFeedSentinelStatus,
} from "./hearst-plus/feed-states";
import { BrandSourceIcon } from "./hearst-plus/brand-source-icon";
import { CommunityHomeRiverCard } from "./hearst-plus/community-home-river-card";
import { CommunityRiverCard } from "./hearst-plus/community-client";
import { CommunityJoinedGroupsCard } from "./hearst-plus/community-joined-groups-card";
import type { CommunityFeedThread } from "./hearst-plus/community-client";
import {
  getLifestyleByline,
  LifestyleBrandSource,
} from "./hearst-plus/story-metadata";
import { LifestyleStoryActions } from "./hearst-plus/story-actions";
import {
  ReaderActionBar,
} from "./hearst-plus/reader-action-bar";
import {
  ReaderArticleBody,
  type ReaderArticleLoadState,
} from "./hearst-plus/reader-article-body";
import {
  FullscreenImageViewer,
  getFullscreenReaderImages,
  type FullscreenGalleryState,
  type FullscreenReaderImage,
} from "./hearst-plus/fullscreen-image-viewer";
import { buildReaderQueue } from "./hearst-plus/reader-queue";
import { getStoryIdentity, mergeUniqueStories } from "./hearst-plus/story-utils";
import { formatVideoDuration } from "./hearst-plus/video-format";
import {
  areHearstAutoStoriesAboutSameVehicle,
  getHearstAutoStoryVehicleKey,
} from "@/lib/hearst-auto-related-stories";
import {
  VideoFeedLeadCard,
  VideoIndexCard,
} from "./hearst-plus/video-cards";
import {
  DelishVerticalVideoCarousel,
  VerticalVideoCarousel,
} from "./hearst-plus/vertical-video-carousel";
import { DelishShortsImmersiveViewer } from "./hearst-plus/delish-shorts-viewer";
import {
  LifestylePersonalizationRulesGuide,
  LifestyleTechnologyGuide,
} from "./hearst-plus/lifestyle-technology-guide";
import { getSelectedBrandTheme } from "./hearst-plus/brand-theme-resolution";
import {
  AmbientArticleReader,
  getAmbientBrandForeground,
  getAmbientInterstitialAdvertiser,
  getAmbientReaderState,
  getAmbientRelatedScore,
  isCompleteAmbientArticle,
  type AmbientInterstitialAdvertiser,
} from "./hearst-plus/ambient-reader";
import {
  LifestyleDiscoverySidebar,
  DiscoverySidebarCard,
  type AutosOemFilterOption,
  type ResearchCarFilters,
} from "./hearst-plus/discovery-sidebar";
import {
  TrendingVideoRail,
  TrendingStoryRail,
} from "./hearst-plus/trending-rail";
import { SavedItemsModule } from "./hearst-plus/saved-items-module";
import { TodayEditStrip } from "./hearst-plus/today-edit-strip";
import { FeaturedStoryCarousel } from "./hearst-plus/featured-story-carousel";
import {
  getLifestyleCardKind,
  getLifestyleImagePosition,
  getLifestyleKindLabel,
  isExplicitGalleryStory,
  isYearMakeModelStory,
  LifestyleCardModule,
  LifestyleRiverImage,
  type LifestyleCardKind,
} from "./hearst-plus/story-presentation";
import { ContentReaderMasthead } from "./hearst-plus/content-reader-masthead";
import {
  ContentReaderDialogShell,
  rememberContentReaderReturnFocus,
} from "./hearst-plus/content-reader-dialog-shell";
import {
  getLifestyleCommentCount,
  getReadyLiveArticle,
  type LifestyleStoryComment,
} from "./hearst-plus/content-reader-model";
import { ContentReaderComments } from "./hearst-plus/content-reader-comments";
import { VehicleDetailsReaderModule } from "./hearst-plus/vehicle-details-reader-module";
import { ContentReaderContextRail } from "./hearst-plus/content-reader-context-rail";
import {
  ContentReaderAdvertisement,
  getContextualAdvertisementImage,
  getAdTopicHref,
  selectContentReaderAdvertisement,
  type ContextualAdUnit,
} from "./hearst-plus/content-reader-advertisement";
import { ContextualRiverAdvertisement } from "./hearst-plus/contextual-river-advertisement";
import { DisplayAdvertisement, toyotaCertifiedUsedHalfPage } from "./hearst-plus/display-advertisement";
import { LocalNewsRail } from "./hearst-plus/local-news-rail";
import { BrandPromotionRiverModule } from "./hearst-plus/brand-promotion-river-module";
import {
  getBrandPromotionForSlot,
  type BrandPromotionMatch,
} from "./hearst-plus/brand-promotion-model";
import {
  HearstOnboardingModal,
  type HearstOnboardingResult,
} from "./hearst-plus/onboarding-modal";
import {
  DelishOnboardingModal,
} from "./hearst-plus/delish-onboarding-modal";
import {
  MotorTrendOnboardingModal,
} from "./hearst-plus/motortrend-onboarding-modal";
import {
  isPublicationOnboardingBrandSlug,
  PublicationOnboardingModal,
  publicationOnboardingConfigs,
} from "./hearst-plus/publication-onboarding-modal";
import { StakeholderPersonalizationConsole } from "./hearst-plus/stakeholder-personalization-console";
import { HearstTVLocalNewsRiver } from "./hearst-plus/hearst-tv-feed-experience";
import { hearstDestinationSections, UtilityBar } from "./hearst-plus/utility-bar";
import { useModalIsolation } from "./ui/use-modal-isolation";
import {
  normalizeStorySearchText,
  searchLifestyleStories,
} from "@/lib/story-search";
import { storyMatchesLifestyleFilter } from "@/lib/story-feed-filter";
import { mergeStableStoryOrder } from "@/lib/stable-story-order";
import {
  getContinueReadingStoryIds,
  recordStoryOpened,
  recordStoryProgress,
} from "@/lib/reading-history";
import {
  getLocalEditionDate,
} from "@/lib/daily-edition";
import {
  readVisitRecords,
  resolveVisitContext,
  upsertVisitRecord,
  writeVisitRecords,
} from "@/lib/visit-context";
import {
  getReturnWindow,
  markUsefulSession,
  trackProductEvent,
  trackProductEventOnce,
} from "@/lib/product-analytics";
import {
  applyOnboardingPreferences,
  baseDestinationConfigs,
  createDestinationConfigs,
  demoDaypartReturnHours,
  destinationPageNames,
  getBrandContextualFilters,
  getBrandRouteInfo,
  getDestinationCategoryDocumentTitle,
  getDestinationMode,
  getLifestyleDemoStoryPool,
  getLifestyleScore,
  getLifestyleScoreBreakdown,
  getLifestyleStrategyReason,
  getReaderDestinationLabel,
  getStoryDestinationMode,
  insertVideosFilter,
  mergeUnique,
  rankLifestyleRiver,
  type DestinationConfig,
  type DestinationMode,
  type LifestyleDemoDaypart,
  type LifestyleDemoState,
} from "@/lib/hearst-personalization-model";
import {
  shouldInsertAmbientInterstitial,
} from "@/lib/ambient-reader-snap";
import {
  ambientReaderDiscoveryBatchSize,
  ambientReaderDiscoveryBuffer,
  appendAmbientReaderDiscoveryStoryIds,
  getAmbientReaderDiscoveryScopes,
  getAmbientReaderDiscoveryTier,
  rankAmbientReaderDiscoveryStories,
} from "@/lib/ambient-reader-discovery";
import {
  buildVideoDestinationQueue,
  getDelishShortsRiverInsertIndex,
  getPlayableVideoStories,
  hasPlayableVideoStories,
  mergeDelishPortraitStories,
  reconcileVideoBrandFilters,
  resolveProgressiveVideoFeed,
} from "@/lib/hearst-video-destination-model";
import {
  allocateStoryModules,
} from "@/lib/story-module-allocation";
import {
  getSessionContinueReadingStoryIds,
  useContinueReadingStoryIds,
  useDailyEditionStories,
  useReadingHistoryState,
  writeSessionContinueReadingStoryIds,
} from "./hearst-plus/home-page-reader-state";
import { HearstGamesIndex } from "./hearst-plus/hearst-games-index";
import {
  applyContextualFeedCadence,
  autosOemLogoFilters,
  getAutosOemMatchesForStory,
  isCurrentFeedStory,
  usesNativePublicationLogoColor,
} from "@/lib/home-page-feed-model";

const elleDailyHoroscopes = [
  { sign: "Aries", dates: "Mar 21–Apr 19", articleId: "a60", image: "aries-final-65c53a391c6ed.jpg" },
  { sign: "Taurus", dates: "Apr 20–May 20", articleId: "a98", image: "taurus-final-65c53d0a5ea92.jpg" },
  { sign: "Gemini", dates: "May 21–Jun 20", articleId: "a99", image: "gemini-final-65c53f0a53394.jpg" },
  { sign: "Cancer", dates: "Jun 21–Jul 22", articleId: "a100", image: "cancer-final-65c540a4f3330.jpg" },
  { sign: "Leo", dates: "Jul 23–Aug 22", articleId: "a101", image: "leo-final-65c53b0ab6f6f.jpg" },
  { sign: "Virgo", dates: "Aug 23–Sep 22", articleId: "a102", image: "virgo-final-65c53dd8e700a.jpg" },
  { sign: "Libra", dates: "Sep 23–Oct 22", articleId: "a103", image: "libra-final-65c53f91cdeb0.jpg" },
  { sign: "Scorpio", dates: "Oct 23–Nov 21", articleId: "a104", image: "scoprio-final-65c54127a8712.jpg" },
  { sign: "Sagittarius", dates: "Nov 22–Dec 21", articleId: "a105", image: "sagittarius-final-65c53c344e35b.jpg" },
  { sign: "Capricorn", dates: "Dec 22–Jan 19", articleId: "a106", image: "capricorn-final-65c53e7b70fb7.jpg" },
  { sign: "Aquarius", dates: "Jan 20–Feb 18", articleId: "a107", image: "aquarius-final-65c5401965263.jpg" },
  { sign: "Pisces", dates: "Feb 19–Mar 20", articleId: "a108", image: "pisces-final-65c5440b949f5.jpg" },
].map((horoscope) => ({
  ...horoscope,
  href: `https://www.elle.com/horoscopes/daily/${horoscope.articleId}/${horoscope.sign.toLowerCase()}-daily-horoscope/`,
  imageUrl: `https://hips.hearstapps.com/hmg-prod/images/${horoscope.image}`,
}));

type ReaderRiverReturnContext = {
  storyId: string;
  storyIds: string[];
  scopeKey: string;
  viewportTop: number;
  scrollX: number;
  scrollY: number;
};

interface ContentType extends BaseContentType {
  footerCols: string[][];
}

export interface HomePageTemplateProps {
  /** Highlights a utility-bar destination the route itself cannot infer (e.g. "International"). */
  activeDestinationOverride?: string;
  /** Links for navLinksOverride labels that are not destination categories (e.g. International countries). */
  navLinkHrefOverrides?: Partial<Record<string, string>>;
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
  initialLiveArticle?: LiveArticleData;
  initialOpenAmbientReader?: boolean;
  readerReturnHref?: string;
  navLinksOverride?: string[];
  mastheadLogoOverride?: { src: string; label: string; surface?: "default" | "station"; tone?: "normal" | "white"; className?: string } | null;
  staticDestinationData?: HearstDestinationStaticData;
  globalBrandInventory?: Record<string, number>;
  onboardingBrandInventory?: Record<string, number>;
  /**
   * Force the destination-river layout (with the modal story reader + infinite
   * scroll) even when the active brand is a single publication rather than a
   * destination. Used by the single-brand destinations so an individual brand
   * gets the Hearst+ river experience instead of the classic magazine grid.
   */
  forceDestinationRiver?: boolean;
  /** Render the featured carousel across all three desktop feed columns. */
  fullWidthFeaturedHero?: boolean;
  /** Render the Hearst+ home as editorial sections instead of one continuous story river. */
  sectionsHomepage?: boolean;
  /** Render editorial sections grouped with related discovery modules in blocks. */
  blocksHomepage?: boolean;
  /**
   * When set, the river renders in single-brand mode: the discovery sidebar's
   * trending rail is titled "Trending" and filters to the current publication;
   * cross-brand modules
   * (brand promotions, local-news rail, cross-brand studio ad) are suppressed.
   */
  singleBrandName?: string;
  /**
   * The page is still fetching its live stories: keep the masthead and navigation, and show the shared
   * river skeleton in place of the river (used by International while its edition feeds load).
   */
  riverLoading?: boolean;
}

interface ProgressiveFeedPage {
  stories: LifestyleRiverStory[];
  nextOffset: number;
  total: number;
  hasMore: boolean;
}

const aandeBrandPromotion: BrandPromotionMatch = {
  brand: "A&E",
  brandSlug: "a-e",
  href: "/hearst-plus/entertainment/",
  topics: ["Crime", "Reality", "Documentary"],
  stories: [
    {
      id: "aande-promotion-first-48",
      brand: "A&E",
      brandSlug: "a-e",
      topic: "Crime",
      title: "The First 48",
      summary: "Homicide detectives race against the clock in A&E's long-running crime series.",
      image: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/the-first-48-s29-3000x3000-primary-1x1-1.jpg?w=1180",
      readTime: "Watch",
      popularity: 100,
      signal: "Editor Pick",
      tags: ["crime", "television"],
      age: 1,
      sourceUrl: "/hearst-plus/entertainment/a-e/",
    },
    {
      id: "aande-promotion-storage-wars",
      brand: "A&E",
      brandSlug: "a-e",
      topic: "Reality",
      title: "Storage Wars",
      summary: "Bidders compete for abandoned storage units and whatever surprises they hold.",
      image: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/storage-wars-s16-3000x3000-primary-1x1-1.jpg?w=1180",
      readTime: "Watch",
      popularity: 96,
      signal: "Trending",
      tags: ["reality", "television"],
      age: 2,
      sourceUrl: "/hearst-plus/entertainment/a-e/",
    },
    {
      id: "aande-promotion-intervention",
      brand: "A&E",
      brandSlug: "a-e",
      topic: "Documentary",
      title: "Intervention",
      summary: "Families and experts work together through stories of addiction and recovery.",
      image: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/intervention-s25-primary-2x3-1-scaled.jpg",
      readTime: "Watch",
      popularity: 93,
      signal: "Editor Pick",
      tags: ["documentary", "television"],
      age: 3,
      sourceUrl: "/hearst-plus/entertainment/a-e/",
    },
    {
      id: "aande-promotion-60-days-in",
      brand: "A&E",
      brandSlug: "a-e",
      topic: "Reality",
      title: "60 Days In",
      summary: "Volunteers go undercover in jail to expose problems from the inside.",
      image: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2024/05/60-days-in-s9-primary-2x3-1-scaled.jpg",
      readTime: "Watch",
      popularity: 91,
      signal: "Trending",
      tags: ["reality", "television"],
      age: 4,
      sourceUrl: "/hearst-plus/entertainment/a-e/",
    },
  ],
};

const defaultFooterCols: string[][] = [
  ["News", "Features", "Culture", "Lifestyle", "Opinion", "Wellness", "Travel"],
  ["Style", "Beauty", "Food", "Home", "Entertainment", "Shopping", "Tech"],
  ["Videos", "Podcasts", "Newsletters", "Events", "Awards", "Archive", "About"],
  ["Contact", "Careers", "Advertise", "Subscribe", "Press", "Privacy", "Terms"],
];

function appendStakeholderDemoMode(path: string, enabled: boolean) {
  if (!enabled) return path;
  const url = new URL(path, "https://hearst.local");
  url.searchParams.set("demo", "1");
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Reader URL for a story. In single-brand mode the reader opens contextually at
 * the single-brand article route (`/single-brand/{slug}/article/{id}`) so the
 * URL and chrome stay within the brand; otherwise it uses the shared /read route.
 */
function buildReaderStoryHref(
  storyId: string,
  returnHref: string | null,
  singleBrandSlug?: string,
) {
  if (singleBrandSlug) return `/single-brand/${singleBrandSlug}/article/${storyId}`;
  return appendReaderReturnHref(storyId, returnHref);
}

const DestinationConfigsContext = React.createContext(baseDestinationConfigs);
const emptyJoinedBrandGroups: string[] = [];
let joinedBrandGroupsSnapshotRaw: string | null = null;
let joinedBrandGroupsSnapshot: string[] = emptyJoinedBrandGroups;

function useDestinationConfigs() {
  return React.useContext(DestinationConfigsContext);
}

function normalizeJoinedBrandGroups(value: unknown) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)),
  );
}

function readJoinedBrandGroups() {
  if (typeof window === "undefined") return emptyJoinedBrandGroups;

  try {
    const rawValue = window.localStorage.getItem(joinedBrandGroupsStorageKey) ?? "[]";
    if (rawValue === joinedBrandGroupsSnapshotRaw) return joinedBrandGroupsSnapshot;

    joinedBrandGroupsSnapshotRaw = rawValue;
    joinedBrandGroupsSnapshot = normalizeJoinedBrandGroups(JSON.parse(rawValue));
    return joinedBrandGroupsSnapshot;
  } catch {
    joinedBrandGroupsSnapshotRaw = null;
    joinedBrandGroupsSnapshot = emptyJoinedBrandGroups;
    return joinedBrandGroupsSnapshot;
  }
}

function writeJoinedBrandGroups(groups: string[]) {
  if (typeof window === "undefined") return;
  const nextGroups = normalizeJoinedBrandGroups(groups);
  const rawValue = JSON.stringify(nextGroups);
  joinedBrandGroupsSnapshotRaw = rawValue;
  joinedBrandGroupsSnapshot = nextGroups;
  window.localStorage.setItem(joinedBrandGroupsStorageKey, rawValue);
  window.dispatchEvent(new Event(joinedBrandGroupsChangeEvent));
}

function subscribeJoinedBrandGroups(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === joinedBrandGroupsStorageKey) onStoreChange();
  };
  const handleSameWindowChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(joinedBrandGroupsChangeEvent, handleSameWindowChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(joinedBrandGroupsChangeEvent, handleSameWindowChange);
  };
}

function getJoinedBrandGroupsServerSnapshot() {
  return emptyJoinedBrandGroups;
}

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  return { ...base, footerCols: defaultFooterCols };
}

const hearstDestinationNavHrefs = new Map(
  [
    ...hearstDestinationSections
      .filter((section) => section.label !== "All")
      .map((section) => [section.label, section.href] as const),
    ["Community", "/communities/"] as const,
    ["Communities", "/communities/"] as const,
  ]
);
// Shared story presentation controls. Phones keep the chosen layout; the toggle shows from sm up.
function RiverLayoutToggle({
  buttonClassName,
}: {
  buttonClassName?: string;
}) {
  const layout = useRiverLayout();
  const pathname = usePathname()?.replace(/\/+$/, "") || "/";
  const searchParams = useSearchParams();
  const router = useRouter();
  const isBlocksRoute = pathname === "/hearst-plus/blocks" || searchParams?.get("layout") === "blocks" || (layout === "blocks" && searchParams?.get("layout") !== "sections" && pathname !== "/hearst-plus/sections");
  const isSectionsRoute = pathname === "/hearst-plus/sections" || searchParams?.get("layout") === "sections";
  const isFullWidthHero = pathname === "/hearst-plus/full-width-hero" || (!isSectionsRoute && layout === "full-width-hero");
  const options = [
    { value: "cards", label: "Show stories as cards", Icon: LayoutCards },
    { value: "list", label: "Show stories as a list", Icon: LayoutList },
    { value: "full-width-hero", label: "Show stories with a full-width hero", Icon: LayoutFullWidth },
    { value: "blocks", label: "Show stories in editorial blocks", Icon: LayoutSections },
  ] as const;
  return (
    <div role="group" aria-label="Story layout" className="hidden items-center gap-1 sm:flex">
      {options.map(({ value, label, Icon }) => (
        <Button
          key={value}
          type="button"
          variant="outline"
          size="icon-sm"
          aria-pressed={value === "blocks"
            ? isBlocksRoute
            : !isBlocksRoute && !isSectionsRoute && (value === "full-width-hero" ? isFullWidthHero : !isFullWidthHero && layout === value)}
          aria-label={label}
          title={label}
          className={cn("hearst-plus-layout-toggle h-7 w-7 rounded-[4px]", buttonClassName)}
          onClick={() => {
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (value === "blocks") {
              setRiverLayout("blocks");
              params.set("layout", "blocks");
              const query = params.toString();
              router.push(pathname === "/hearst-plus" || pathname === "/" || pathname === "/hearst-plus/sections" || pathname === "/hearst-plus/blocks"
                ? "/hearst-plus/blocks/"
                : `${pathname}/?${query}`);
              return;
            }
            setRiverLayout(value);
            params.delete("layout");
            const isDedicatedLayoutRoute = pathname === "/hearst-plus/blocks" || pathname === "/hearst-plus/sections" || pathname === "/hearst-plus/full-width-hero";
            const nextPathname = isDedicatedLayoutRoute
              ? value === "full-width-hero" ? "/hearst-plus/full-width-hero/" : "/hearst-plus/"
              : pathname;
            const query = params.toString();
            const nextHref = `${nextPathname}${query ? `?${query}` : ""}`;
            const currentHref = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
            if (nextHref !== currentHref) router.push(nextHref);
          }}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </Button>
      ))}
    </div>
  );
}

export function MainNav({
  brandSlug,
  activeFilter,
  onFilterChange,
  selectedBrand,
  navLinksOverride,
  navLinkLabelOverrides,
  navLinkHrefOverrides,
  navCarouselMode = "default",
  mastheadLogoOverride,
  mastheadSlugOverride,
  mastheadDescriptorOverride,
  navTrailingContent,
  extendBannerUnderUtilityBar = false,
  showRiverLayoutToggle = false,
  controlsOnly = false,
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
  navLinkLabelOverrides?: Partial<Record<string, string>>;
  navLinkHrefOverrides?: Partial<Record<string, string>>;
  navCarouselMode?: "default" | "compact";
  mastheadLogoOverride?: { src: string; label: string; surface?: "default" | "station"; tone?: "normal" | "white"; className?: string } | null;
  /** A registered logo key (src/lib/logos.ts) shown in the masthead instead of the theme's, sized by the shared geometry. */
  mastheadSlugOverride?: string;
  /** Use the destination HEARST wordmark with a custom italic section descriptor in the shared brand-wall banner. */
  mastheadDescriptorOverride?: string;
  /** Page-specific controls aligned beside a custom section navigation. */
  navTrailingContent?: React.ReactNode;
  /** The Hearst+ home banner runs up behind its transparent utility bar. */
  extendBannerUnderUtilityBar?: boolean;
  /** Show the card/list toggle for the story river beside search. */
  showRiverLayoutToggle?: boolean;
  /** Render only the weather and search controls (and search overlay), for a page that draws its own banner. */
  controlsOnly?: boolean;
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
  const [navOverflow, setNavOverflow] = React.useState({ left: false, right: false });
  const [overlayPortalTarget, setOverlayPortalTarget] = React.useState<HTMLElement | null>(null);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const mobileMenuTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const mobileMenuPanelRef = React.useRef<HTMLDivElement | null>(null);
  const mobileMenuDialogRef = React.useRef<HTMLDivElement | null>(null);
  const navScrollRef = React.useRef<HTMLDivElement | null>(null);
  const sectionNavigationRef = React.useRef<HTMLDivElement | null>(null);
  const compactNavScrollRef = React.useRef<HTMLElement | null>(null);
  const searchTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const searchPanelRef = React.useRef<HTMLDivElement | null>(null);
  const searchDialogRef = React.useRef<HTMLDivElement | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const frozenNavScrollLeftRef = React.useRef<number | null>(null);
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
  const mastheadSlug = mastheadSlugOverride ?? selectedBrand?.slug ?? brand.slug;
  const logo = brandLogos[mastheadSlug];
  const content = getContent(brandSlug);
  const isDestinationRiver = brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew" || brand.slug === "hearst-local-news";
  const destinationConfig = destinationConfigs[getDestinationMode(brand.slug)];
  const baseNavLinks = navLinksOverride ?? (selectedBrand
    ? getBrandContextualFilters(selectedBrand.slug, destinationConfigs.all.stories, includeVideos)
    : isDestinationRiver
      ? destinationConfig.filters
      : content.navLinks);
  const uncappedNavLinks = (includeVideos ? insertVideosFilter(baseNavLinks) : baseNavLinks)
    // The cross-brand "For You" tab is not surfaced anywhere in the nav — destination
    // pages, brand pages, and article pages alike. The full mix still loads as the
    // default landing view; it simply has no dedicated tab. This covers destination
    // configs, getBrandContextualFilters, and any navLinksOverride.
    .filter((link) => link !== "For You")
    .filter((link) => !(brand.slug === "hearst-all" && link === "Streaming"));
  const showsEventsLink = !navLinksOverride && (
    Boolean(selectedBrand) || brand.slug === "hearst-all" || brand.slug === "hearst-plus"
  );
  const destinationNavLinks = showsEventsLink
    ? (() => {
        const linksWithoutEvents = uncappedNavLinks.filter((link) => link !== "Events");
        const videosIndex = linksWithoutEvents.indexOf("Videos");
        return videosIndex === -1
          ? [...linksWithoutEvents, "Events"]
          : [...linksWithoutEvents.slice(0, videosIndex + 1), "Events", ...linksWithoutEvents.slice(videosIndex + 1)];
      })()
    : uncappedNavLinks;
  const navLinks = selectedBrand?.slug === "good-housekeeping" && destinationNavLinks.length > 7
    ? (() => {
        const visibleLinks = destinationNavLinks.filter((link) => link !== "Events").slice(0, 6);
        if (activeFilter && !visibleLinks.includes(activeFilter) && activeFilter !== "Events") {
          if (visibleLinks.length) visibleLinks[visibleLinks.length - 1] = activeFilter;
          else visibleLinks.push(activeFilter);
        }
        return [...visibleLinks, ...(destinationNavLinks.includes("Events") ? ["Events"] : [])];
      })()
    : destinationNavLinks;
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
    const scroller = navScrollRef.current;
    const updateOverflow = () => {
      if (!scroller) return;
      const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      setNavOverflow({
        left: scroller.scrollLeft > 1,
        right: scroller.scrollLeft < maxScrollLeft - 1,
      });
    };
    const alignActiveItem = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const activeItem = scroller?.querySelector<HTMLElement>(
          '[aria-current="page"], [aria-pressed="true"]'
        );
        if (!scroller || !activeItem || scroller.scrollWidth <= scroller.clientWidth) {
          updateOverflow();
          return;
        }

        const safeInset = 16;
        const itemStart = activeItem.offsetLeft;
        const itemEnd = itemStart + activeItem.offsetWidth;
        const previousItem = activeItem.previousElementSibling as HTMLElement | null;
        const preferredStart = previousItem?.offsetLeft ?? itemStart;
        let nextScrollLeft = Math.max(0, preferredStart - safeInset);
        if (frozenNavScrollLeftRef.current !== null) {
          nextScrollLeft = frozenNavScrollLeftRef.current;
          frozenNavScrollLeftRef.current = null;
        } else if (itemEnd > nextScrollLeft + scroller.clientWidth - safeInset) {
          nextScrollLeft = Math.max(0, itemEnd - scroller.clientWidth + safeInset);
        }
        scroller.scrollTo({ left: nextScrollLeft, behavior: "auto" });
        updateOverflow();
      });
    };

    alignActiveItem();
    scroller?.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", alignActiveItem);
    return () => {
      scroller?.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", alignActiveItem);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activeFilter, selectedBrand?.slug]);
  const handleNavigationWheel = (event: React.WheelEvent<HTMLElement>) => {
    const isHorizontalIntent =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.15 && Math.abs(event.deltaX) > 1;

    if (!isHorizontalIntent) return;

    event.preventDefault();
    event.stopPropagation();

    const scroller = navScrollRef.current;
    if (scroller) {
      frozenNavScrollLeftRef.current = scroller.scrollLeft;
      window.requestAnimationFrame(() => {
        if (frozenNavScrollLeftRef.current === null) return;
        scroller.scrollLeft = frozenNavScrollLeftRef.current;
      });
    }

    const compactScroller = compactNavScrollRef.current;
    if (compactScroller) {
      const compactScrollLeft = compactScroller.scrollLeft;
      window.requestAnimationFrame(() => {
        compactScroller.scrollLeft = compactScrollLeft;
      });
    }
  };

  React.useEffect(() => {
    let frame = 0;
    const updateMasthead = () => {
      frame = 0;
      setMastheadCompact((current) => {
        if (darkMode && sectionNavigationRef.current) {
          // The video masthead has a tall brand wall. Wait until its original
          // section nav has scrolled to the compact nav's lower edge before
          // swapping, so the banner tail stays covered and content meets the header.
          const navBottom = sectionNavigationRef.current.getBoundingClientRect().bottom;
          const compactNavBottom = compactNavScrollRef.current?.getBoundingClientRect().bottom ?? 68;
          if (navBottom <= compactNavBottom) return true;
          if (navBottom >= compactNavBottom + 8) return false;
          return current;
        }
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
  }, [darkMode]);

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
  const selectedMastheadTheme = selectedBrand
    ? getSelectedBrandTheme(selectedBrand, brand)
    : null;
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
      : mastheadSlug === "hearst-lifestyle" || mastheadSlug === "hearst-flux" || mastheadSlug === "hearst-ew" || mastheadSlug === "hearst-autos" || mastheadSlug === "hearst-plus" || mastheadSlug === "hearst-local-news" || mastheadSlug === "hearst-entertainment" || mastheadSlug === "hearst-communities"
        ? {
            // Destination lockups share the HEARST wordmark and a 140.66-unit viewBox (divider included);
            // these heights put the HEARST letters at the same size as the Hearst+ masthead.
            compact: "h-[23.53px] max-w-[min(260px,calc(100vw-140px))] sm:h-[33.82px] sm:max-w-[460px]",
            regular: "h-[32.35px] max-w-[min(300px,calc(100vw-140px))] sm:h-[50px] sm:max-w-[640px]",
          }
            : {
                compact: "h-[16px] max-w-[220px] sm:h-[23px] sm:max-w-[400px]",
                regular: "h-[22px] max-w-[280px] sm:h-[34px] sm:max-w-[580px]",
              };
  const shouldUsePrimaryEntertainmentMasthead = mastheadSlug === "hearst-entertainment" && !mastheadLogoOverride;
  const logoColor = shouldUsePrimaryEntertainmentMasthead
    ? "var(--hp-primary, var(--primary, #B9913F))"
    : darkMode || (selectedBrand && colorMode === "dark")
    ? "var(--palette-content-knockout, white)"
    : selectedBrand
    ? mastheadSlug === "motortrend" || mastheadSlug === "hot-rod" || mastheadSlug === "cosmopolitan"
      ? selectedMastheadTheme?.colors["1"]
      : shouldUseNativeLogoColor
      ? undefined
      : "var(--foreground)"
    : brand.slug === "hearst-flux" && colorMode === "dark"
      ? "var(--palette-content-knockout, white)"
      : "var(--palette-content-brand, var(--primary))";

  const mastheadLogoBaseClasses = "mx-auto w-auto items-center justify-center leading-none [&_svg]:block [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full motion-reduce:[&_svg]:transition-none";
  const goodHousekeepingMastheadScaleClasses = mastheadSlug === "good-housekeeping"
    ? "[&_svg]:scale-[1.2] [&_svg]:origin-center"
    : "";
  const renderMastheadLogo = (compact: boolean) => mastheadLogoOverride ? (
    mastheadLogoOverride.surface === "station" ? (
      <span
        className={cn(
          "mx-auto inline-flex items-center justify-center",
          compact ? "h-[46px]" : "h-[72px]"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mastheadLogoOverride.src}
          alt={mastheadLogoOverride.label}
          className={cn(
            "w-auto object-contain",
            compact ? "h-[38px] max-w-[280px]" : "h-[64px] max-w-[520px]"
          )}
          style={{
            filter: "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 0 1px rgba(0,0,0,0.9)) drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
          }}
        />
      </span>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mastheadLogoOverride.src}
        alt={mastheadLogoOverride.label}
        className={cn(
          "mx-auto w-auto object-contain",
          compact ? "h-[28px] max-w-[220px]" : "h-[44px] max-w-[360px]",
          mastheadLogoOverride.className,
        )}
        style={mastheadLogoOverride.tone === "white" ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    )
  ) : logo ? usesCompactMobileDestinationMark ? (
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
          goodHousekeepingMastheadScaleClasses,
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
        goodHousekeepingMastheadScaleClasses,
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
    const destinationMode = getDestinationMode(brand.slug);
    const showHearstPlusTopicSeparator = brand.slug === "hearst-all" && !selectedBrand && link === "Videos";
    // Overridden links (for example Communities' Home) are page-specific, not destination categories.
    const displayLabel = navLinkLabelOverrides?.[link]
      ?? (isDestinationRiver && !selectedBrand && !navLinkHrefOverrides?.[link]
        ? getHearstDestinationCategoryDisplayLabel(destinationMode, link)
        : link);
    const destinationHref = brand.slug === "hearst-all" ? hearstDestinationNavHrefs.get(link) : undefined;
    const publicationHref = selectedBrand && link === "Events"
      ? `/hearst-plus/events/?brand=${encodeURIComponent(selectedBrand.slug)}`
      : undefined;
    const communityHref = selectedBrand && link === "Community"
      ? `/communities/${selectedBrand.slug}/`
      : undefined;
    const overrideHref = navLinkHrefOverrides?.[link]
      ?? ((brand.slug === "hearst-all" || brand.slug === "hearst-plus") && link === "Events" ? "/hearst-plus/events/" : undefined);
    const categoryHref = isDestinationRiver && !selectedBrand
      ? getHearstDestinationCategoryRoute(destinationMode, link)
      : undefined;
    const useDarkActiveState = darkMode || (brand.slug === "hearst-flux" && colorMode === "dark");
    const navLinkClasses = darkMode
      ? "text-[var(--component-navigation-utility-content-knockout)] hover:border-[var(--component-navigation-utility-content-accent)]/60 hover:text-[var(--component-navigation-utility-content-accent)]"
      : "text-foreground hover:border-primary/40 hover:text-primary";

    const navItem = destinationHref || publicationHref || communityHref || overrideHref ? (
      <LinkComponent
        href={destinationHref ?? publicationHref ?? communityHref ?? overrideHref}
        variant="neutral"
        underline={false}
        size="sm"
        aria-current={(publicationHref || overrideHref) && active ? "page" : undefined}
        className={cn(
          "min-h-8 min-w-max whitespace-nowrap border-b-2 border-transparent font-semibold hover:no-underline md:min-h-0",
          navCarouselMode === "compact" ? "px-2 text-xs md:min-w-max md:text-sm" : "px-0.5 md:min-w-0",
          navLinkClasses,
          (publicationHref || overrideHref) && active && (
            useDarkActiveState
              ? "border-[var(--component-navigation-utility-content-accent)] font-semibold text-[var(--component-navigation-utility-content-accent)]"
              : "border-primary font-semibold text-[var(--hp-section-title)]"
          )
        )}
      >
        {displayLabel}
      </LinkComponent>
    ) : categoryHref ? (
      <LinkComponent
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
          "min-h-8 min-w-max whitespace-nowrap border-b-2 border-transparent font-semibold hover:no-underline md:min-h-0",
          navCarouselMode === "compact" ? "px-2 text-xs md:min-w-max md:text-sm" : "px-0.5 md:min-w-0",
          navLinkClasses,
          active
            ? useDarkActiveState
              ? "border-[var(--component-navigation-utility-content-accent)] font-semibold text-[var(--component-navigation-utility-content-accent)]"
              : "border-primary font-semibold text-[var(--hp-section-title)]"
            : ""
        )}
      >
        {displayLabel}
      </LinkComponent>
    ) : isDestinationRiver ? (
      <button
        type="button"
        onClick={() => onFilterChange?.(link)}
        className={cn(
          "min-h-8 min-w-max whitespace-nowrap border-b-2 border-transparent text-sm font-semibold transition-colors md:min-h-0",
          navCarouselMode === "compact" ? "px-2 text-xs md:min-w-max md:text-sm" : "px-0.5 md:min-w-0",
          active
            ? useDarkActiveState
              ? "border-[var(--component-navigation-utility-content-accent)] font-semibold text-[var(--component-navigation-utility-content-accent)]"
              : "border-primary font-semibold text-[var(--hp-section-title)]"
            : navLinkClasses
        )}
        aria-pressed={active}
      >
        {displayLabel}
      </button>
    ) : (
      <LinkComponent
        variant="neutral"
        underline={false}
        size="sm"
	        className={cn(
            "min-h-8 min-w-max whitespace-nowrap font-normal md:min-h-0",
            navCarouselMode === "compact" ? "px-2 text-xs md:min-w-max md:text-sm" : "md:min-w-0"
          )}
      >
        {displayLabel}
      </LinkComponent>
    );

    return (
      <React.Fragment key={link}>
        {navItem}
        {showHearstPlusTopicSeparator ? (
          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-border" />
        ) : null}
      </React.Fragment>
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
        darkMode ? "border-white/10 bg-[var(--component-video-feed-background-default)] text-[var(--component-video-feed-content-primary)]" : "border-border bg-background text-foreground"
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
          <section aria-labelledby="mobile-browse-hearst-title">
            <h2 id="mobile-browse-hearst-title" className="type-k1 text-[var(--hp-section-title)]">
              Browse Hearst+
            </h2>
            <nav aria-label="Main navigation" className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: "All", href: "/hearst-plus/sections/", mode: "all" },
                ...hearstReaderSections.map((section) => ({
                  label: section.label,
                  href: getHearstDestinationRoute(section.mode),
                  mode: section.mode,
                })),
                { label: "Local News", href: "/hearst-plus/local-news/", mode: "local-news" },
                { label: "A&E Family", href: "/hearst-plus/entertainment/", mode: "entertainment-culture" },
              ].map((section) => (
                <Link
                  key={section.mode}
                  href={section.href}
                  onClick={closeMobileMenu}
                  aria-current={
                    section.mode === (selectedBrand ? getHearstBrandSection(selectedBrand.slug) : getDestinationMode(brandSlug))
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "flex min-h-11 items-center rounded-[8px] border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    darkMode
                      ? "border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                      : "border-border bg-background hover:border-primary/45 hover:bg-muted/40",
                    section.mode === (selectedBrand ? getHearstBrandSection(selectedBrand.slug) : getDestinationMode(brandSlug)) && "border-primary/50 bg-primary/5"
                  )}
                >
                  {section.label}
                </Link>
              ))}
            </nav>
          </section>

          <section className={cn("mt-7 border-t pt-6", darkMode ? "border-white/10" : "border-border")} aria-labelledby="mobile-browse-brands-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="mobile-browse-brands-title" className="type-k1 text-[var(--hp-section-title)]">
                Browse brands
              </h2>
              <span className={cn("text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>{getHearstAllBrands().length} publications</span>
            </div>
            <div className="mt-4 space-y-5">
              {hearstReaderSections.map((section) => (
                <div key={section.mode}>
                  <h3 className={cn("mb-2 text-xs font-semibold", darkMode ? "text-white/65" : "text-muted-foreground")}>
                    {section.label}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getHearstSectionBrands(section.mode).map((sectionBrand) => {
                      const active = selectedBrand?.slug === sectionBrand.brandSlug;
                      return (
                        <Link
                          key={sectionBrand.brandSlug}
                          href={getHearstBrandRoute(sectionBrand.brandSlug)}
                          onClick={closeMobileMenu}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-11 min-w-0 items-center gap-2 rounded-[8px] border px-2.5 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            active
                              ? "border-primary/50 bg-primary/5"
                              : darkMode
                                ? "border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                                : "border-border bg-background hover:border-primary/45 hover:bg-muted/40"
                          )}
                        >
                          <BrandSourceIcon brand={sectionBrand.brand} brandSlug={sectionBrand.brandSlug} className="h-6 w-6 shrink-0 rounded-[4px]" />
                          <span className="min-w-0 truncate">{sectionBrand.brand}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="mobile-continue-reading-title">
            <div className="flex items-center justify-between gap-4">
              <h2 id="mobile-continue-reading-title" className="type-k1 text-[var(--hp-section-title)]">
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
                    <span className="type-b2 line-clamp-2 block font-bold group-hover:text-primary">{story.title}</span>
                    <span className={cn("mt-1 block text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>{story.brand}</span>
                  </span>
                </button>
              )) : (
                <p className={cn(
                  "type-b2 rounded-[8px] border px-3 py-4",
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
                <h2 id="mobile-filter-brands-title" className="type-k1 text-[var(--hp-section-title)]">
                  Join Groups
                </h2>
                <p className={cn("mt-1 text-xs", darkMode ? "text-white/60" : "text-muted-foreground")}>
                  {activeBrandFilters.length > 0 ? `${activeBrandFilters.length} joined` : `${mobileBrands.length} brand groups`}
                </p>
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
                  Leave all
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
                    <span className="shrink-0 text-[0.7rem] font-bold">{active ? "Joined" : "Join"}</span>
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
          darkMode ? "border-white/15 border-t-[var(--component-navigation-utility-content-accent)] bg-[var(--component-video-feed-background-default)] text-[var(--component-video-feed-content-primary)]" : "border-border border-t-primary bg-background text-foreground"
        )}
      >
        <div className={cn("flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6", darkMode ? "border-white/10" : "border-border")}>
          <div>
            <h2
              id="hearst-search-title"
              className={cn(
                "type-k1",
                darkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-primary"
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
              "type-k1",
              darkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-primary"
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
                      ? darkMode ? "border-l-[var(--component-navigation-utility-content-accent)] bg-white/[0.07]" : "border-l-primary bg-muted/40"
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
  const useDarkHeaderIconButtons = darkMode || colorMode === "dark";
  // Publication pages keep the original compact logo row. Banners are reserved for Hearst+ and destinations.
  // Pages with their own logo override (channel and station pages, Communities) keep their masthead.
  const mastheadBanner = mastheadLogoOverride || mastheadSlugOverride || selectedBrand
    ? undefined
    : brand.slug === "hearst-entertainment"
      ? entertainmentBrandWallBanner
      : brand.slug === "hearst-all"
          ? hearstPlusBrandWallBanner
          : destinationBanners[brand.slug];
  // The Hearst+ home banner starts under the transparent utility bar (32px), so the bar floats on the brand wall.
  const underUtilityBar = extendBannerUnderUtilityBar && mastheadBanner === hearstPlusBrandWallBanner;
  const brandWallLogos = mastheadBanner?.wallLogos ?? (mastheadBanner?.wallSection
    ? getHearstSectionBrands(mastheadBanner.wallSection)
        .map((sectionBrand) => brandLogos[sectionBrand.brandSlug])
        .filter((src): src is string => Boolean(src?.startsWith("/")))
    : undefined);
  const darkHeaderIconButtonClass =
    "hearst-plus-dark-header-icon-button";

  if (controlsOnly) {
    // The host page positions this layer over its own banner, matching the masthead banner's control placement.
    return (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 [&>*]:pointer-events-auto">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className={cn("h-11 w-11 rounded-[4px] backdrop-blur sm:h-7 sm:w-7", darkHeaderIconButtonClass)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
              aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={colorMode === "dark" ? "Light mode" : "Dark mode"}
              onClick={toggleColorMode}
            >
              {colorMode === "dark" ? <Sun className="h-3.5 w-3.5" aria-hidden /> : <Moon className="h-3.5 w-3.5" aria-hidden />}
            </Button>
            <Button
              ref={searchTriggerRef}
              data-search-trigger
              variant="outline"
              size="icon-sm"
              className={cn("h-11 w-11 rounded-[4px] backdrop-blur sm:h-7 sm:w-7", darkHeaderIconButtonClass)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
              aria-label="Search"
              title="Search"
              aria-expanded={searchOpen}
              onClick={() => {
                setOverlayPortalTarget(document.body);
                setSearchOpen(true);
              }}
            >
              <Search className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>
        </div>
        {searchDialog}
      </>
    );
  }

  return (
    <>
    {mastheadBanner ? (
    // A brand banner replaces the logo row; the controls sit over its left and right ends.
    <div
      className={cn(
        "relative bg-black",
        darkMode ? "border-b-0" : "border-b border-border",
        underUtilityBar && "-mt-8 pt-8"
      )}
      style={underUtilityBar ? { background: mastheadBanner.background } : undefined}
    >
        {/* Full-bleed art, trimmed of any baked-in side bars so it always reaches both edges. */}
        <div
          className={cn(
            "relative w-full overflow-hidden",
            mastheadBanner.pattern === "brand-wall" || mastheadBanner.logoSize === "section"
              ? "h-[117px] max-lg:h-[95px] max-sm:h-[78px]"
              : "aspect-[var(--banner-aspect)] max-sm:aspect-[3/1]",
          )}
          style={{ "--banner-aspect": `${mastheadBanner.width - (mastheadBanner.cropX?.left ?? 0) - (mastheadBanner.cropX?.right ?? 0)} / ${mastheadBanner.height}` } as React.CSSProperties}
        >
          {mastheadBanner.src ? (
            <Image
              src={mastheadBanner.src}
              alt={mastheadBanner.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: `${(() => {
                  const left = mastheadBanner.cropX?.left ?? 0;
                  const right = mastheadBanner.cropX?.right ?? 0;
                  return left + right === 0 ? 50 : (left / (left + right)) * 100;
                })()}% 50%`,
              }}
            />
          ) : (
            // A solid banner: the brand color block with the overlaid logo carrying the brand name.
            <div role="img" aria-label={mastheadBanner.alt} className="absolute inset-0" style={{ background: mastheadBanner.background ?? "#000" }} />
          )}
        </div>
        {mastheadBanner.scrim ? <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" /> : null}
        {mastheadBanner.pattern === "brand-wall" ? <HearstPlusBrandWall logos={brandWallLogos} /> : null}
        {/* Depth: a darker shade of the banner's own color fades to clear. Under the transparent utility bar (Hearst+
            home, Communities) it starts at the top so the bar reads cleanly; section banners sit below a solid bar,
            so they darken from the bottom instead and never form a seam with it. Shorter on phones (5:1 crop). */}
        <div
          aria-hidden
          data-banner-depth={underUtilityBar ? "top" : "bottom"}
          className="pointer-events-none absolute inset-0 [--banner-depth-stop:45%] sm:[--banner-depth-stop:60%]"
          style={{
            background: `linear-gradient(${underUtilityBar ? "to bottom" : "to top"}, color-mix(in oklab, ${mastheadBanner.background ?? "#000"} ${underUtilityBar ? 60 : 70}%, black) 0%, transparent var(--banner-depth-stop))`,
          }}
        />
        {mastheadBanner.overlayLogo ? (
          <div className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center",
            "items-center",
            mastheadBanner.logoDescriptor || mastheadDescriptorOverride ? "px-4 sm:px-24" : "px-24",
            underUtilityBar ? "top-8" : "top-0",
          )}>
            {mastheadBanner.logoDescriptor || mastheadDescriptorOverride ? (
              <div role="img" aria-label={mastheadDescriptorOverride ? `Hearst ${mastheadDescriptorOverride}` : mastheadBanner.alt} className="flex max-w-full flex-col items-center justify-center gap-0 whitespace-nowrap text-white">
                <BrandLogo
                  slug={mastheadBanner.logoSlug ?? mastheadSlug}
                  color={mastheadBanner.logoColor === "native" ? undefined : "#fff"}
                  decorative
                  className="flex h-[11.05px] w-auto shrink-0 items-center [&_svg]:block [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full sm:h-[12.89px] lg:h-[16.57px]"
                />
                <span className="mt-2 shrink-0 font-serif text-[22.1px] font-normal italic leading-none tracking-normal sm:text-[34.99px] lg:text-[44.19px]">
                  {mastheadDescriptorOverride ?? mastheadBanner.logoDescriptor}
                </span>
              </div>
            ) : (
              <BrandLogo
                slug={mastheadBanner.logoSlug ?? mastheadSlug}
                color={mastheadBanner.logoColor === "native" ? undefined : "#fff"}
                className={cn(
                  "flex max-w-full items-center justify-center [&_svg]:block [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-h-full [&_svg]:max-w-full",
                  "w-[min(500px,calc(100vw-3rem))]",
                  // Solid banners have nothing but the logo, so it fills most of the banner height.
                  mastheadBanner.src
                    ? "h-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:h-16 lg:h-24"
                    : mastheadBanner.logoSize === "section"
                      ? "h-6 sm:h-9 lg:h-12"
                      : mastheadBanner.pattern === "brand-wall"
                      ? mastheadBanner.wallSection || mastheadBanner.wallLogos
                        ? "h-6 sm:h-9 lg:h-12"
                        : "h-5 sm:h-7 lg:h-9"
                      : mastheadBanner.logoSize === "xl"
                        ? "h-20 sm:h-36 lg:h-52"
                        : "h-16 sm:h-28 lg:h-40",
                )}
              />
            )}
          </div>
        ) : null}
        {/* Full-bleed art; the controls stay on the page container's edges. */}
        <PageContainer className={cn("pointer-events-none absolute inset-x-0 flex items-start justify-between py-3 [&>*]:pointer-events-auto", underUtilityBar ? "top-8" : "top-0")}>
          <div className="flex w-10 shrink-0 justify-start sm:w-[var(--width-sidebar-narrow)]">
            {showRiverLayoutToggle ? (
              <RiverLayoutToggle
                buttonClassName={useDarkHeaderIconButtons || mastheadBanner ? darkHeaderIconButtonClass : undefined}
              />
            ) : null}
            {showMobileDiscoveryMenu ? (
              <Button
                ref={mobileMenuTriggerRef}
                variant="outline"
                size="icon-sm"
                className={cn(
                  "h-11 w-11 rounded-[4px] sm:hidden",
                  useDarkHeaderIconButtons || mastheadBanner ? darkHeaderIconButtonClass : undefined
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
          </div>
          <div className="flex shrink-0 items-start justify-end gap-2 sm:w-[var(--width-sidebar-narrow)]">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className={cn(
                "h-11 w-11 rounded-[4px] sm:h-7 sm:w-7",
                useDarkHeaderIconButtons || mastheadBanner ? darkHeaderIconButtonClass : undefined
              )}
              aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={colorMode === "dark" ? "Light mode" : "Dark mode"}
              onClick={toggleColorMode}
            >
              {colorMode === "dark" ? <Sun className="h-3.5 w-3.5" aria-hidden /> : <Moon className="h-3.5 w-3.5" aria-hidden />}
            </Button>
            <Button
              ref={searchTriggerRef}
              data-search-trigger
              variant="outline"
              size="icon-sm"
              className={cn(
                "h-11 w-11 rounded-[4px] sm:h-7 sm:w-7",
                useDarkHeaderIconButtons || mastheadBanner ? darkHeaderIconButtonClass : undefined
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
    ) : (
    <div className={cn("flex h-20 border-b sm:h-24", darkMode ? "border-white/10 bg-[var(--component-video-feed-background-default)] text-[var(--component-video-feed-content-primary)]" : "border-border bg-[var(--hp-surface)]")}>
      <PageContainer className="flex items-center justify-between">
        <div className="flex w-10 shrink-0 justify-start sm:w-[var(--width-sidebar-narrow)]">
          {showRiverLayoutToggle ? (
            <RiverLayoutToggle
              buttonClassName={useDarkHeaderIconButtons ? darkHeaderIconButtonClass : undefined}
            />
          ) : null}
          {showMobileDiscoveryMenu ? (
            <Button
              ref={mobileMenuTriggerRef}
              variant="outline"
              size="icon-sm"
              className={cn(
                "h-11 w-11 rounded-[4px] sm:hidden",
                useDarkHeaderIconButtons ? darkHeaderIconButtonClass : undefined
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
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {renderMastheadLogo(false)}
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 sm:w-[var(--width-sidebar-narrow)]">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 rounded-[4px] sm:h-7 sm:w-7",
              useDarkHeaderIconButtons ? darkHeaderIconButtonClass : undefined
            )}
            aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={colorMode === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleColorMode}
          >
            {colorMode === "dark" ? <Sun className="h-3.5 w-3.5" aria-hidden /> : <Moon className="h-3.5 w-3.5" aria-hidden />}
          </Button>
          <Button
            ref={searchTriggerRef}
            data-search-trigger
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 rounded-[4px] sm:h-7 sm:w-7",
              useDarkHeaderIconButtons ? darkHeaderIconButtonClass : undefined
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
    )}
    <div ref={sectionNavigationRef} className={cn(
      "border-b",
      darkMode ? "border-white/10 bg-[var(--component-video-feed-background-default)]" : "border-border",
      isDestinationRiver && (darkMode ? "sticky top-8 z-30 md:static" : "sticky top-8 z-30 bg-[var(--hp-surface)] md:static"),
      mastheadCompact && "md:invisible"
    )}>
      <PageContainer
        as="nav"
        aria-label={selectedBrand ? `${selectedBrand.name} sections` : `${brand.name} sections`}
	        className={cn(
            "relative flex items-center gap-3 py-[9px] md:py-[13px]",
            navTrailingContent ? "justify-between" : "md:justify-center",
            navCarouselMode === "compact" && !navTrailingContent ? "md:justify-start" : ""
          )}
      >
        <div
          ref={navScrollRef}
          data-topic-navigation-scroll
	          className={cn(
            "flex min-w-0 flex-1 scroll-px-4 items-center overflow-x-auto text-sm scrollbar-hide",
            navTrailingContent || navCarouselMode === "compact" ? "gap-3 md:justify-start" : "gap-6 md:flex-none md:justify-center"
          )}
          onWheelCapture={handleNavigationWheel}
        >
          {renderNavLinks()}
        </div>
        {!navTrailingContent ? <span
          aria-hidden="true"
          data-navigation-overflow="left"
          data-visible={navOverflow.left}
          className={cn(
            "pointer-events-none absolute bottom-2 left-4 top-2 z-10 w-6 bg-gradient-to-r to-transparent transition-opacity md:hidden motion-reduce:transition-none",
            darkMode ? "from-[var(--component-video-feed-background-default)]" : "from-[var(--hp-surface)]",
            navOverflow.left ? "opacity-100" : "opacity-0"
          )}
        /> : null}
        {navTrailingContent ? <div className="relative z-20 shrink-0">{navTrailingContent}</div> : null}
        {!navTrailingContent ? <span
          aria-hidden="true"
          data-navigation-overflow="right"
          data-visible={navOverflow.right}
          className={cn(
            "pointer-events-none absolute bottom-2 right-4 top-2 z-10 w-6 bg-gradient-to-l to-transparent transition-opacity md:hidden motion-reduce:transition-none",
            darkMode ? "from-[var(--component-video-feed-background-default)]" : "from-[var(--hp-surface)]",
            navOverflow.right ? "opacity-100" : "opacity-0"
          )}
        /> : null}
      </PageContainer>
    </div>
    <div
      aria-hidden={!mastheadCompact}
      inert={!mastheadCompact}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-8 z-40 hidden -translate-y-2 transform-gpu border-b opacity-0 transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:block",
        darkMode ? "border-white/10 bg-[var(--component-video-feed-background-default)]" : "border-border bg-[var(--hp-surface)]",
        mastheadCompact && "pointer-events-auto translate-y-0 opacity-100"
      )}
    >
      <PageContainer
        as="nav"
        ref={compactNavScrollRef}
        aria-label={selectedBrand ? `${selectedBrand.name} compact sections` : `${brand.name} compact sections`}
        className={cn("flex items-center gap-3 py-2", navTrailingContent ? "justify-between" : "justify-center")}
        onWheelCapture={handleNavigationWheel}
      >
        <div className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto scrollbar-hide md:flex-none md:justify-center">
          {renderNavLinks()}
        </div>
        {navTrailingContent ? <div className="relative z-20 shrink-0">{navTrailingContent}</div> : null}
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
      <p className="type-c1 text-muted-foreground">
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
      color="var(--palette-content-knockout, white)"
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

function blocksSectionHeadingClass(brandSlug?: string) {
  return brandSlug === "elle"
    ? "headline text-4xl leading-tight italic lg:text-7xl"
    : "type-t2 headline font-bold";
}

/**
 * Production Hearst+ editorial block. Each mode is one Building Blocks pattern;
 * the Blocks Library renders this component directly so its previews match
 * what ships. Column counts follow the block's own width (container
 * `hp-block`, see `.hp-block-row` / `.hp-block-grid` in globals.css).
 */
export function EditorialHomepageSection({
  section,
  selectionLabel,
  onOpen,
  savedIds,
  onSave,
  cardGrid = false,
  featureSidebar = false,
  featureFirstGrid = false,
  riverWithHero = false,
  river = false,
  grid = false,
  largeHeading = false,
}: {
  section: { title: string; stories: LifestyleRiverStory[] };
  selectionLabel: string;
  onOpen: (story: LifestyleRiverStory) => void;
  savedIds: string[];
  onSave: (story: LifestyleRiverStory) => void;
  cardGrid?: boolean;
  featureSidebar?: boolean;
  featureFirstGrid?: boolean;
  riverWithHero?: boolean;
  /** River: every story as a horizontal list card. */
  river?: boolean;
  /** Grid: standard cards that wrap at 1 / 2 / 4 columns. */
  grid?: boolean;
  largeHeading?: boolean | "elle";
}) {
  return (
    <section className="@container/hp-block min-w-0 space-y-4" aria-label={section.title}>
      <div className="flex items-end justify-between gap-4">
        <h2 className={largeHeading === "elle" ? blocksSectionHeadingClass("elle") : blocksSectionHeadingClass()}>{section.title}</h2>
        <span className="shrink-0 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {selectionLabel}
        </span>
      </div>
      {section.stories.length && featureFirstGrid ? (
        <div className="space-y-4">
          <LifestyleRiverCard
            story={section.stories[0]}
            onOpen={() => onOpen(section.stories[0])}
            saved={savedIds.includes(section.stories[0].id)}
            onSave={() => onSave(section.stories[0])}
            layoutOverride="cards"
            hideGalleryCount
            compactGallery
          />
          {section.stories.length > 1 ? <div className="hp-block-row min-w-0">
            {section.stories.slice(1, 5).map((story) => <LifestyleRiverCard key={`${section.title}-${story.id}`} story={story} onOpen={() => onOpen(story)} saved={savedIds.includes(story.id)} onSave={() => onSave(story)} layoutOverride="cards" hideGalleryCount compactGallery />)}
          </div> : null}
        </div>
      ) : section.stories.length && riverWithHero ? (
        <div className="space-y-3">
          <LifestyleRiverCard
            story={section.stories[0]}
            onOpen={() => onOpen(section.stories[0])}
            saved={savedIds.includes(section.stories[0].id)}
            onSave={() => onSave(section.stories[0])}
            layoutOverride="cards"
          />
          {section.stories.length > 1 ? (
            <div className="space-y-3">
              {section.stories.slice(1).map((story) => (
                <LifestyleRiverCard
                  key={`${section.title}-${story.id}`}
                  story={story}
                  onOpen={() => onOpen(story)}
                  saved={savedIds.includes(story.id)}
                  onSave={() => onSave(story)}
                  layoutOverride="list"
                  editorialRow
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : section.stories.length && featureSidebar ? (
        <div className="grid min-w-0 items-stretch gap-5 @min-[820px]/hp-block:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] @min-[820px]/hp-block:grid-rows-[minmax(0,1fr)]">
          <LifestyleRiverCard
            story={section.stories[0]}
            onOpen={() => onOpen(section.stories[0])}
            saved={savedIds.includes(section.stories[0].id)}
            onSave={() => onSave(section.stories[0])}
            layoutOverride="cards"
          />
          {section.stories.length > 1 ? (
            <div className="space-y-3 @min-[820px]/hp-block:grid @min-[820px]/hp-block:h-full @min-[820px]/hp-block:min-h-0 @min-[820px]/hp-block:grid-rows-4 @min-[820px]/hp-block:gap-3 @min-[820px]/hp-block:space-y-0">
              {section.stories.slice(1, 5).map((story) => (
                <LifestyleRiverCard
                  key={`${section.title}-${story.id}`}
                  story={story}
                  onOpen={() => onOpen(story)}
                  saved={savedIds.includes(story.id)}
                  onSave={() => onSave(story)}
                  layoutOverride="list"
                  editorialRow
                  hideSummary
                  hideByline
                  stretchToFeature
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : section.stories.length && cardGrid ? (
        <div className="hp-block-row min-w-0">
          {section.stories.slice(0, 4).map((story) => (
            <LifestyleRiverCard
              key={`${section.title}-${story.id}`}
              story={story}
              onOpen={() => onOpen(story)}
              saved={savedIds.includes(story.id)}
              onSave={() => onSave(story)}
              layoutOverride="cards"
              compact
              hideGalleryCount
              compactGallery
            />
          ))}
        </div>
      ) : section.stories.length && grid ? (
        <div className="hp-block-grid min-w-0">
          {section.stories.map((story) => (
            <LifestyleRiverCard
              key={`${section.title}-${story.id}`}
              story={story}
              onOpen={() => onOpen(story)}
              saved={savedIds.includes(story.id)}
              onSave={() => onSave(story)}
              layoutOverride="cards"
              hideGalleryCount
              compactGallery
            />
          ))}
        </div>
      ) : section.stories.length && river ? (
        <div className="space-y-3">
          {section.stories.map((story) => (
            <LifestyleRiverCard
              key={`${section.title}-${story.id}`}
              story={story}
              onOpen={() => onOpen(story)}
              saved={savedIds.includes(story.id)}
              onSave={() => onSave(story)}
              layoutOverride="list"
              editorialRow
            />
          ))}
        </div>
      ) : section.stories.length ? (
        <div className="space-y-3">
          <LifestyleRiverCard
            story={section.stories[0]}
            onOpen={() => onOpen(section.stories[0])}
            saved={savedIds.includes(section.stories[0].id)}
            onSave={() => onSave(section.stories[0])}
            layoutOverride="cards"
          />
          {section.stories.length > 1 ? (
            <div className="space-y-3">
              {section.stories.slice(1).map((story) => (
                <LifestyleRiverCard
                  key={`${section.title}-${story.id}`}
                  story={story}
                  onOpen={() => onOpen(story)}
                  saved={savedIds.includes(story.id)}
                  onSave={() => onSave(story)}
                  layoutOverride="list"
                  editorialRow
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

type ContextualAdTuple = readonly [
  string,
  string,
  string,
  string,
  string,
  string[],
  string[],
  string
];

const contextualAdCatalog = {
  lifestyle: [
    ["lifestyle-home-refresh", "Hearst Market", "Summer Home Refresh", "Editor-picked bedding, cookware, storage, and patio upgrades for the rooms readers are saving now.", "Shop the edit", ["Home", "Shopping"], ["decorating", "products", "summer", "home"], "Home"],
    ["lifestyle-dinner-planner", "Delish Selects", "Tonight's Dinner Plan", "Fast mains, flexible sides, and kitchen tools matched to food and weeknight-cooking intent.", "Build dinner", ["Food", "Food Drinks", "Food News"], ["dinner ideas", "recipe", "cookout", "food"], "Food"],
    ["lifestyle-sleep-reset", "Prevention Wellness", "Sleep Better Tonight", "Pillows, routines, and calm-down tools for readers returning to wellness content late in the day.", "See sleep picks", ["Wellness"], ["sleep", "health", "wellness"], "Wellness"],
    ["lifestyle-beauty-counter", "Cosmo Beauty Lab", "The 10-Minute Beauty Counter", "High-signal beauty products and routines for style, shopping, and celebrity browsing sessions.", "Open the counter", ["Style", "Shopping", "Entertainment"], ["beauty", "style", "products", "celebrity"], "Beauty"],
    ["lifestyle-garden-weekend", "Country Living Finds", "Weekend Garden List", "Planters, tools, and porch pieces tuned to gardening, outdoor, and weekend-project signals.", "Plan the weekend", ["Home", "Shopping"], ["garden", "outdoor", "decorating", "weekend"], "Garden"],
    ["lifestyle-hosting-kit", "Good Housekeeping Tested", "Hosting Without the Guesswork", "Lab-informed serveware, cleaning helpers, and party tools for readers saving home-service content.", "See tested picks", ["Home", "Food", "Shopping"], ["cleaning", "products", "party", "home"], "Tested"],
    ["lifestyle-small-space", "House Beautiful Studio", "Small-Space Fixes", "Storage, lighting, and furniture picks for apartment, room refresh, and design-intent sessions.", "Refresh a room", ["Home", "Shopping"], ["decorating", "rooms", "products", "design"], "Rooms"],
    ["lifestyle-teen-style", "Seventeen Style", "Back-to-School Style Drop", "Trend-led fashion, beauty, and dorm finds for younger style and shopping journeys.", "Shop trends", ["Style", "Shopping"], ["style", "beauty", "products", "school"], "Style"],
    ["lifestyle-family-meal-kit", "Woman's Day Kitchen", "Family Meal Shortcut", "A practical sponsor module for meal planning, leftovers, and family dinner intent.", "Get the shortcut", ["Food", "Family"], ["dinner ideas", "family", "food", "recipe"], "Family"],
    ["lifestyle-cozy-collection", "Pioneer Woman Picks", "Cozy Kitchen Collection", "Cookware, table linens, and colorful prep tools aligned with recipe and home-commerce behavior.", "Explore picks", ["Food", "Home", "Shopping"], ["cookware", "recipe", "products", "home"], "Kitchen"],
  ],
  autos: [
    ["autos-cd-deal-score", "Car and Driver Marketplace", "Know the Best Price to Buy", "An AI-powered Deal Score evaluates the full vehicle offer against incentives, inventory, price trends, demand, and local market signals.", "Check my deal", ["Buying Guides", "Reviews"], ["buying", "reviews", "used", "shopping", "marketplace", "deal"], "Deal Score"],
    ["autos-ev-home-charge", "ChargePoint", "EV Charging, Matched to Your Garage", "A contextual offer for readers comparing EVs, range, charging speed, and home setup decisions.", "Estimate charging", ["EVs", "Buying Guides"], ["evs", "electric", "buying", "reviews"], "EV"],
    ["autos-tire-finder", "Michelin Garage", "Find the Right Performance Tire", "Tire and handling recommendations for readers deep in reviews, performance, and track-day content.", "Match tires", ["Reviews", "Performance", "Racing"], ["performance", "drive", "racing", "reviews"], "Grip"],
    ["autos-auction-alert", "Collector Watch", "Auction Watchlist", "Collector-car alerts aligned to classics, Bring a Trailer behavior, and save-for-later browsing.", "Track listings", ["Classics", "Auctions"], ["auction", "classic", "collector", "used"], "Bid"],
    ["autos-tool-chest", "Craftsman Pro", "Build the Home Garage", "Tools, lifts, storage, and detailing gear for readers acting on trucks, classics, and project-car intent.", "Open garage", ["Trucks", "Classics", "Performance"], ["truck", "classic", "gear", "engine"], "Garage"],
    ["autos-insurance", "Hagerty", "Collector Coverage Check", "Insurance guidance for readers browsing classics, auctions, and collectible performance cars.", "Check coverage", ["Classics", "Auctions", "Buying Guides"], ["classic", "collector", "auction", "buying"], "Cover"],
    ["autos-racing-weekend", "TrackPass", "Your Racing Weekend", "Tickets, streams, and schedules for readers consuming racing news and late-night performance content.", "Plan race day", ["Racing", "Performance"], ["racing", "speed", "performance", "track"], "Race"],
    ["autos-detail-kit", "Meguiar's", "Weekend Detail Kit", "Wash, wax, ceramic, and interior care surfaced when the reader leans toward ownership utility.", "Build the kit", ["Buying Guides", "Classics", "Trucks"], ["used", "classic", "truck", "products"], "Detail"],
    ["autos-finance", "Auto Finance Desk", "Know Your Monthly Number", "Financing and value tools for readers comparing models, reviews, and buying-guide content.", "Estimate payment", ["Buying Guides", "Reviews"], ["buying", "reviews", "used", "evs"], "Value"],
    ["autos-truck-cargo", "Truck Gear Desk", "Truck Bed and Cabin Protection", "Cargo liners, mats, and storage systems for readers signaling truck and adventure utility.", "Fit my truck", ["Trucks", "Buying Guides"], ["truck", "gear", "products", "buying"], "Truck"],
    ["autos-performance-parts", "Summit Racing", "Performance Parts Finder", "Engine, exhaust, and suspension modules for readers following horsepower and racing signals.", "Find parts", ["Performance", "Racing", "Classics"], ["performance", "engine", "horsepower", "racing"], "Parts"],
  ],
  flux: [
    ["flux-designer-sale", "Luxury Edit", "The Designer Sale Watch", "A shopping module for readers browsing style, celebrity looks, and high-intent product stories.", "Watch the edit", ["Style", "Shopping"], ["style", "shopping", "fashion", "products"], "Style"],
    ["flux-beauty-wardrobe", "Beauty Counter", "Build a Summer Beauty Wardrobe", "Fragrance, skin, and makeup picks aligned to beauty and style behavior.", "Open beauty", ["Beauty", "Style"], ["beauty", "style", "shopping", "fashion"], "Beauty"],
    ["flux-art-weekend", "Culture Pass", "Your Culture Weekend", "Gallery openings, restaurants, performances, and bookable moments for culture-led sessions.", "Plan the weekend", ["Culture", "Events", "Travel"], ["culture", "events", "travel", "feature"], "Culture"],
    ["flux-interior-materials", "Design Materials", "A Better Room Starts With Texture", "Furniture, lighting, and fabric recommendations for interiors and design-intent readers.", "Source the room", ["Design", "Shopping"], ["design", "home", "products", "interiors"], "Design"],
    ["flux-travel-club", "Town & Country Travel", "The Long Weekend List", "Hotels, luggage, and reservations tied to travel, culture, and luxury browsing behavior.", "See the list", ["Travel", "Culture", "Shopping"], ["travel", "culture", "shopping", "leisure"], "Travel"],
    ["flux-watch-jewelry", "Fine Objects", "Jewelry and Watch Radar", "Luxury objects matched to celebrity, event, and shopping signals.", "View radar", ["Shopping", "Style", "Events"], ["jewelry", "shopping", "celebrity", "events"], "Objects"],
    ["flux-mens-style", "Esquire Shop", "Sharper Summer Dressing", "Menswear, grooming, and accessories for culture and style readers.", "Get dressed", ["Style", "Shopping"], ["style", "fashion", "shopping", "grooming"], "Menswear"],
    ["flux-garden-party", "Veranda Entertains", "Garden Party Checklist", "Outdoor furniture, tabletop, flowers, and entertaining ideas for design and events sessions.", "Host outside", ["Design", "Events"], ["design", "home", "events", "garden"], "Host"],
    ["flux-red-carpet", "Red Carpet Desk", "The Event Lookbook", "Dresses, beauty, accessories, and editor context for celebrity and event-led browsing.", "Open lookbook", ["Events", "Style", "Beauty"], ["celebrity", "events", "style", "beauty"], "Event"],
    ["flux-design-consult", "Elle Decor Studio", "Find Your Design Direction", "A high-touch design consult module for readers saving interiors and home inspiration.", "Start consult", ["Design"], ["design", "home", "interiors", "products"], "Studio"],
  ],
  ew: [
    ["ew-running-shoe", "Runner's Lab", "Find Your Next Running Shoe", "Shoe, training, and recovery recommendations for fitness and running behavior.", "Match my run", ["Fitness", "Gear"], ["fitness", "running", "gear", "training"], "Run"],
    ["ew-home-gym", "Garage Gym Builder", "Build a Smarter Home Gym", "Weights, mats, benches, and programming for readers engaging with strength and gear stories.", "Plan gym", ["Fitness", "Gear"], ["fitness", "gear", "training", "products"], "Gym"],
    ["ew-bike-fit", "Bicycling Fit Studio", "Dial In Your Bike Fit", "Fit tools, shoes, saddles, and gear surfaced for cycling and adventure intent.", "Tune fit", ["Gear", "Adventure", "Fitness"], ["bike", "cycling", "gear", "adventure"], "Bike"],
    ["ew-recovery-kit", "Recovery Desk", "Recovery That Fits Your Routine", "Sleep, mobility, massage, and recovery tools matched to wellness and fitness signals.", "Recover better", ["Wellness", "Fitness"], ["wellness", "recovery", "sleep", "health"], "Recover"],
    ["ew-tech-kit", "Popular Mechanics Tested", "Gear That Solves the Problem", "Tech, tools, and tested equipment for science, mechanics, and gear browsing.", "See tested gear", ["Tech", "Gear"], ["tech", "gear", "science", "products"], "Tested"],
    ["ew-nutrition-plan", "Fuel Plan", "Nutrition for the Next Goal", "Meal, protein, hydration, and supplement signals for wellness and training readers.", "Build fuel plan", ["Nutrition", "Wellness", "Fitness"], ["nutrition", "food", "health", "training"], "Fuel"],
    ["ew-adventure-pack", "Trail Kit", "Weekend Adventure Pack", "Bags, shoes, layers, and safety gear for readers signaling adventure and outdoor interest.", "Pack better", ["Adventure", "Gear"], ["adventure", "gear", "outdoor", "products"], "Trail"],
    ["ew-health-check", "Health Navigator", "Your Next Health Check", "Screenings, routines, and practical next steps aligned with health and life content.", "Make a plan", ["Wellness", "Life"], ["health", "wellness", "life", "sleep"], "Health"],
    ["ew-smartwatch", "Wearable Lab", "Track What Actually Matters", "Watch, heart-rate, and recovery tools matched to tech, fitness, and training sessions.", "Compare watches", ["Tech", "Fitness", "Gear"], ["tech", "fitness", "gear", "training"], "Track"],
    ["ew-book-club", "Oprah Daily Life", "A Better Night Routine", "Books, journaling, sleep, and reflection picks for late-night life and wellness browsing.", "Start tonight", ["Life", "Wellness"], ["life", "sleep", "wellness", "books"], "Life"],
  ],
} satisfies Record<Exclude<DestinationMode, "all">, ContextualAdTuple[]>;

function normalizeContextualAds(units: ContextualAdTuple[]): ContextualAdUnit[] {
  return units.map(([id, sponsor, title, summary, cta, topics, tags, creativeLabel]) => ({
    id,
    sponsor,
    title,
    summary,
    cta,
    ctaHref: topics.map(getAdTopicHref).find(Boolean),
    topics,
    tags,
    creativeLabel,
    imageUrl: getContextualAdvertisementImage({ id }),
    palette: {
      background: "var(--card)",
      foreground: "var(--foreground)",
      accent: "var(--primary)",
      soft: "var(--secondary)",
    },
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
  excludeAdIds = [],
}: {
  destination: DestinationMode;
  slotIndex: number;
  profile: LifestyleRiverProfile;
  demoState: LifestyleDemoState;
  config: DestinationConfig;
  activeFilter: string;
  stories: LifestyleRiverStory[];
  excludeAdIds?: string[];
}) {
  const surroundingStories = stories.slice(Math.max(0, slotIndex - 2), Math.min(stories.length, slotIndex + 3));
  const categoryAdDestination: Partial<Record<string, Exclude<DestinationMode, "all">>> = {
    Cars: "autos",
    Reviews: "autos",
    "Research Cars": "autos",
    EVs: "autos",
    Racing: "autos",
    Trucks: "autos",
    Classics: "autos",
    Style: "flux",
    Beauty: "flux",
    "Style & Beauty": "flux",
    Food: "lifestyle",
    "Food & Recipes": "lifestyle",
    Home: "lifestyle",
    "House & Garden": "lifestyle",
    Fitness: "ew",
    Wellness: "ew",
    Gear: "ew",
    Adventure: "ew",
  };
  const adDestination = destination === "all" ? categoryAdDestination[activeFilter] ?? destination : destination;
  const rankedAds = contextualAdsByDestination[adDestination]
    .filter((ad) => !excludeAdIds.includes(ad.id))
    .map((ad) => ({
      ad,
      score: scoreContextualAd(ad, profile, demoState, config, activeFilter, surroundingStories),
    }))
    .sort((a, b) => b.score - a.score || a.ad.id.localeCompare(b.ad.id));

  const match = rankedAds[slotIndex % rankedAds.length] ?? rankedAds[0];
  return match
    ? {
        ...match,
        ad: {
          ...match.ad,
          imageUrl: getContextualAdvertisementImage(match.ad),
        },
      }
    : undefined;
}

function ensureGallerySampleInRiver(
  riverStories: LifestyleRiverStory[],
  displayStories: LifestyleRiverStory[],
  excludedStoryIds: Set<string>,
  enabled: boolean,
  preferredStoryId?: string | null
) {
  if (!enabled) return riverStories;

  const canUseGallerySample = (story: LifestyleRiverStory) =>
    isExplicitGalleryStory(story)
    && !excludedStoryIds.has(story.id)
    && !riverStories.some((riverStory) => riverStory.id === story.id);
  const canUsePreferredGallerySample = (story: LifestyleRiverStory) =>
    isExplicitGalleryStory(story)
    && !riverStories.some((riverStory) => riverStory.id === story.id);
  const preferredGallerySample = preferredStoryId
    ? displayStories.find((story) => story.id === preferredStoryId && canUsePreferredGallerySample(story))
    : undefined;

  if (preferredGallerySample) {
    const nextStories = [...riverStories];
    const replaceIndex = nextStories.findIndex(isExplicitGalleryStory);
    if (replaceIndex >= 0) {
      nextStories.splice(replaceIndex, 1, preferredGallerySample);
    } else {
      nextStories.splice(Math.min(2, nextStories.length), 0, preferredGallerySample);
    }
    return nextStories;
  }

  if (riverStories.some(isExplicitGalleryStory)) return riverStories;

  const gallerySample = displayStories.find(canUseGallerySample);

  if (!gallerySample) return riverStories;

  const nextStories = [...riverStories];
  nextStories.splice(Math.min(2, nextStories.length), 0, gallerySample);
  return nextStories;
}

function formatLiveFeedUpdatedAt(fetchedAt: string) {
  if (!fetchedAt || !Number.isFinite(Date.parse(fetchedAt))) return "not available";
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
    <section className="mt-4 rounded-card border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" aria-label="Lifestyle river card models">
      <div className="border-b border-border p-4 sm:p-5">
        <p className="type-k1 text-primary">
          River Content Models
        </p>
        <h2 className="type-t3 headline mt-1">
          Five card styles share one atomic structure.
        </h2>
        <p className="type-b2 mt-2 max-w-3xl text-muted-foreground">
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
                  <p className="type-k1 text-primary">
                    {getLifestyleKindLabel(model.kind)}
                  </p>
                </div>
              </div>

              <dl className="type-c1 mt-4 space-y-3">
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
    <section className="mt-4 rounded-card border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" aria-label="Contextual ad logic">
      <div className="border-b border-border p-4 sm:p-5">
        <p className="type-k1 text-primary">
          Contextual Ad Logic
        </p>
        <h2 className="type-t3 headline mt-1">
          Sponsored units enter the river every five cards.
        </h2>
        <p className="type-b2 mt-2 max-w-3xl text-muted-foreground">
          Ads use the same intent context as the editorial ranking layer: active section, followed topics, saved tags,
          more-like-this behavior, time of day, and the surrounding story cluster. Creative imagery uses purpose-made local artwork selected for each campaign context, separate from editorial photography.
        </p>
      </div>

      <div className="grid divide-y divide-border lg:grid-cols-[minmax(0,1fr)_320px] lg:divide-x lg:divide-y-0">
        <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Placement</p>
            <p className="mt-2 text-sm font-bold">After cards 5, 10, 15...</p>
            <p className="type-c1 mt-1 text-muted-foreground">
              The first unit appears after the fifth editorial card. Infinite scroll adds more as more story cards load.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Matching inputs</p>
            <p className="mt-2 text-sm font-bold">{activeFilter} · {config.dayparts[demoState.daypart].label}</p>
            <p className="type-c1 mt-1 text-muted-foreground">
              Followed topics, saved tags, boosted tags, daypart preferences, and nearby story tags all add to the ad score.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Creative source</p>
            <p className="mt-2 text-sm font-bold">Dedicated ad image set</p>
            <p className="type-c1 mt-1 text-muted-foreground">
              Each campaign uses original, locally stored ad artwork selected for its subject. Editorial story images are not used in ad placements.
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
                  <p className="type-b2 font-bold">{firstAdMatch.ad.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {firstAdMatch.ad.sponsor} · score {firstAdMatch.score}
                  </p>
                  <p className="type-c1 mt-2 text-muted-foreground">
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
              <p className="type-b2 font-bold">{ad.title}</p>
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
  compact = false,
  playing,
  onTogglePlaying,
}: {
  story: LifestyleRiverStory;
  kind: LifestyleCardKind;
  featured: boolean;
  compact?: boolean;
  playing: boolean;
  onTogglePlaying: () => void;
}) {
  const imageClassName = compact ? "aspect-[4/3] w-full" : "aspect-video w-full";
  const videoClassName = featured
    ? "aspect-video w-full"
    : compact
      ? "aspect-[4/3] w-full self-start"
      : "aspect-video w-full self-start rounded-[4px]";

  if (kind !== "video") {
    return (
      <LifestyleRiverImage
        story={story}
        className={cn(
          imageClassName,
          "transition-transform duration-250 ease-out group-hover/card:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100",
        )}
        priority={featured}
      />
    );
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
            className="h-full w-full object-cover transition-transform duration-250 ease-out group-hover/card:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
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

export function RichPhotoGalleryCard({
  story,
  images,
  onOpen,
  saved,
  onSave,
  hidePhotoCount = false,
}: {
  story: LifestyleRiverStory;
  images: FullscreenReaderImage[];
  onOpen: () => void;
  saved?: boolean;
  onSave?: () => void;
  hidePhotoCount?: boolean;
}) {
  const visibleImages = images.slice(0, richGalleryImageMinimum);
  const remainingImageCount = Math.max(0, images.length - visibleImages.length);

  return (
    <article
      className="group/card relative min-w-0 cursor-pointer overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      data-story-module="river"
      data-story-id={story.id}
      data-story-brand={story.brandSlug}
    >
      <button
        type="button"
        onClick={onOpen}
        className="peer absolute inset-0 z-10 rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
        aria-label={`Open photo gallery: ${story.title}`}
      />

      <div className="relative min-w-0 p-4 sm:p-5">
        <div className="story-meta-row relative z-20 mb-2">
          <LifestyleBrandSource story={story} />
          {!hidePhotoCount ? <span className="inline-flex items-center gap-1 text-[length:var(--text-token-4xs)] font-semibold text-muted-foreground">
            <Camera className="h-3.5 w-3.5" aria-hidden />
            {images.length} photos
          </span> : null}
          {onSave && saved !== undefined ? (
            <StorySaveIconButton saved={saved} onSave={onSave} className="ml-auto" />
          ) : null}
        </div>
        <h2 className="type-t4 headline line-clamp-3 break-words transition-colors group-hover/card:text-[var(--hp-sidebar-heading,var(--primary))] group-focus-within/card:text-[var(--hp-sidebar-heading,var(--primary))]">
          {story.title}
        </h2>
        <p className="type-b2 mt-1 line-clamp-3 text-muted-foreground">
          {story.summary}
        </p>
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
    </article>
  );
}

function CompactPhotoGalleryCard({
  story,
  images,
  onOpen,
  saved,
  onSave,
}: {
  story: LifestyleRiverStory;
  images: FullscreenReaderImage[];
  onOpen: () => void;
  saved?: boolean;
  onSave?: () => void;
}) {
  return (
    <article className="group/card compact-photo-gallery relative min-w-0 cursor-pointer overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" data-story-brand={story.brandSlug}>
      <button type="button" onClick={onOpen} className="peer absolute inset-0 z-10 rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60" aria-label={`Open photo gallery: ${story.title}`} />
      <div className="compact-photo-gallery__images grid aspect-video grid-cols-2 gap-0.5 overflow-hidden bg-border">
        {images.slice(0, 4).map((image, index) => <div key={image.src} className={cn("compact-photo-gallery__image relative min-w-0 overflow-hidden bg-muted", index === 2 && "compact-photo-gallery__image--small", index === 3 && "compact-photo-gallery__image--large")}><Image src={image.src} alt={image.alt} fill sizes={index === 0 ? "(max-width: 640px) 50vw, 40vw" : "(max-width: 640px) 50vw, 20vw"} className="object-cover transition-transform duration-200 group-hover/card:scale-[1.02]" /></div>)}
      </div>
      <div className="story-card-content relative z-20 min-w-0 p-4">
        <div className="story-meta-row mb-1"><LifestyleBrandSource story={story} />{onSave && saved !== undefined ? <StorySaveIconButton saved={saved} onSave={onSave} className="ml-auto" /> : null}</div>
        <h3 className="headline type-t3 line-clamp-3 font-bold underline-offset-4 group-hover/card:underline group-focus-within/card:underline">{story.title}</h3>
        <p className="type-d2 mt-1 line-clamp-3 text-muted-foreground">{story.summary}</p>
      </div>
    </article>
  );
}

// Keep secondary story actions in the reader, with Save available in each
// card's metadata row so readers can save without opening the story.
function CarAndDriverResearchRating({ rating }: { rating: string }) {
  const [score, denominator = "10"] = rating.split("/");

  return (
    <span
      className="flex shrink-0 flex-col items-center pt-0.5 text-center"
      aria-label={`Car and Driver rating ${rating}`}
    >
      <span className="flex items-baseline font-extrabold tabular-nums leading-none text-foreground" style={{ fontFamily: '"Inter", Arial, sans-serif' }}>
        <span className="text-[28px]">{score}</span>
        <span className="text-sm">/{denominator}</span>
      </span>
      <span className="mt-1 inline-flex items-center gap-1 font-sans text-[10px] font-semibold leading-none text-muted-foreground">
        <Image src="/cd.svg" alt="" width={12} height={12} aria-hidden="true" />
        Rating
      </span>
    </span>
  );
}

export function LifestyleRiverCard({
  story,
  onOpen,
  saved,
  onSave,
  featured = false,
  layoutOverride,
  editorialRow = false,
  hideSummary = false,
  hideByline = false,
  stretchToFeature = false,
  hideGalleryCount = false,
  compactGallery = false,
  compact = false,
}: {
  story: LifestyleRiverStory;
  onOpen: () => void;
  saved?: boolean;
  onSave?: () => void;
  featured?: boolean;
  layoutOverride?: RiverLayout;
  editorialRow?: boolean;
  hideSummary?: boolean;
  hideByline?: boolean;
  stretchToFeature?: boolean;
  hideGalleryCount?: boolean;
  compactGallery?: boolean;
  /** Row card: 4:3 media, 12px padding, text-lg headline, no summary. Used by Card Row blocks. */
  compact?: boolean;
}) {
  const kind = getLifestyleCardKind(story);
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const isVideo = kind === "video";
  const galleryPreview = useGalleryPreview(story, kind === "gallery" && isExplicitGalleryStory(story));
  const currentLayout = useRiverLayout();
  const layout = layoutOverride ?? currentLayout;

  // List layout: a compact row (thumbnail left, text right) for scanning many stories quickly.
  if (layout === "list" && !featured) {
    return (
      <article
        className={cn(
          "group/card relative grid min-w-0 cursor-pointer items-center gap-4 overflow-hidden rounded-card bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] sm:p-5",
          editorialRow
            ? "grid-cols-[clamp(88px,24%,128px)_minmax(0,1fr)] gap-3 p-3 sm:gap-3 sm:p-3"
            : "grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[168px_minmax(0,1fr)]",
          stretchToFeature && "@min-[820px]/hp-block:h-full @min-[820px]/hp-block:min-h-0",
        )}
        data-story-module="river"
        data-story-layout="list"
        data-story-id={story.id}
        data-story-brand={story.brandSlug}
      >
        <button
          type="button"
          onClick={onOpen}
          className="peer absolute inset-0 z-10 rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
          aria-label={`Open story: ${story.title}`}
        />
        <div className="min-w-0">
          <div className="story-meta-row relative z-20 mb-1">
            <LifestyleBrandSource story={story} hideByline={hideByline} />
            {onSave && saved !== undefined ? (
              <StorySaveIconButton saved={saved} onSave={onSave} className="ml-auto" />
            ) : null}
          </div>
          <div className="flex min-w-0 items-end gap-3">
            <h2 className={cn(
              "type-t3 headline min-w-0 flex-1 line-clamp-3 break-words underline-offset-4 group-hover/card:underline group-focus-within/card:underline",
              editorialRow && "text-[var(--hp-sidebar-heading,var(--primary))]",
            )}>
              {story.title}
            </h2>
            {getHearstAutoResearchCarRating(story.id) ? (
              <CarAndDriverResearchRating rating={getHearstAutoResearchCarRating(story.id)!} />
            ) : null}
          </div>
          {!hideSummary ? <p className={cn("type-b2 mt-0.5 text-muted-foreground", editorialRow ? "line-clamp-3" : "hidden sm:line-clamp-3")}>{story.summary}</p> : null}
        </div>
        <div className="relative order-first aspect-[4/3] overflow-hidden rounded-card-inner bg-muted">
          <LifestyleRiverImage
            story={story}
            alt=""
            className="h-full w-full transition-transform duration-250 ease-out group-hover/card:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
          {kind === "video" ? (
            <span aria-hidden className="absolute inset-0 grid place-items-center">
              <span className="grid size-9 place-items-center rounded-full bg-black/60 text-white">
                <Play className="size-4" />
              </span>
            </span>
          ) : null}
        </div>
      </article>
    );
  }

  if (galleryPreview.status === "ready") {
    if (compactGallery || layout === "cards" || layout === "blocks") return <CompactPhotoGalleryCard story={story} images={galleryPreview.images} onOpen={onOpen} saved={saved} onSave={onSave} />;
    return (
      <RichPhotoGalleryCard
        story={story}
        images={galleryPreview.images}
        onOpen={onOpen}
        saved={saved}
        onSave={onSave}
        hidePhotoCount={hideGalleryCount}
      />
    );
  }

  return (
    <article
      className={cn(
        "group/card relative min-w-0 cursor-pointer content-start overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]",
        isVideo
          ? "grid"
        : featured
          ? "grid items-stretch"
          : "grid"
      )}
      data-story-module="river"
      data-story-id={story.id}
      data-story-brand={story.brandSlug}
    >
      <button
        type="button"
        onClick={onOpen}
        className="peer absolute inset-0 z-10 rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
        aria-label={`Open story: ${story.title}`}
      />
      <div className={cn("relative min-w-0", isVideo && "z-20")}>
        <LifestyleRiverMedia
          story={story}
          kind={kind}
          featured={featured}
          compact={compact && !featured}
          playing={videoPlaying}
          onTogglePlaying={() => setVideoPlaying((playing) => !playing)}
        />
      </div>
      <div className={cn(
        "story-card-content relative min-w-0",
        compact && !featured ? "p-3" : isVideo ? "p-4 sm:p-5" : featured ? "flex flex-col justify-center p-5 sm:p-6 lg:p-8" : "px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3"
      )}>
        <div className="story-meta-row relative z-20 mb-1">
          <LifestyleBrandSource story={story} />
          {onSave && saved !== undefined ? (
            <StorySaveIconButton saved={saved} onSave={onSave} className="ml-auto" />
          ) : null}
        </div>
        <div className="flex min-w-0 items-end gap-3">
          <h2 className={cn(
            "headline min-w-0 flex-1 line-clamp-3 break-words underline-offset-4 group-hover/card:underline group-focus-within/card:underline",
            compact && !featured ? "type-t5" : featured ? "type-t2" : "type-t3",
          )}>
            {story.title}
          </h2>
          {getHearstAutoResearchCarRating(story.id) ? (
            <CarAndDriverResearchRating rating={getHearstAutoResearchCarRating(story.id)!} />
          ) : null}
        </div>
        {compact && !featured ? null : (
          <p className={cn(
            "type-d2 mt-1 line-clamp-3 text-muted-foreground",
            featured && "max-w-prose"
          )}>
            {story.summary}
          </p>
        )}
      </div>
    </article>
  );
}

export {
  DelishVerticalVideoCarousel,
  LifestyleStoryActions,
  VerticalVideoCarousel,
};

const TODAYS_PICKS_FRESHNESS_WINDOW_HOURS = 72;

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
  const followBadgeBackground = publicationTheme?.colors["1"] ?? "var(--foreground)";
  const followBadgeForeground = getAmbientBrandForeground(followBadgeBackground);

  return (
    <button
      type="button"
      onClick={onToggleFollowBrand}
      aria-pressed={followed}
      aria-label={followed ? `Unfollow ${story.brand} brand` : `Follow ${story.brand} brand`}
      title={followed ? `Unfollow ${story.brand} brand` : `Follow ${story.brand} brand`}
      className="-my-3.5 -ml-2 -mr-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:-my-1.5 sm:h-7 sm:w-7"
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

function getLifestyleReaderAd(
  currentStory: LifestyleRiverStory,
  slotIndex = 0,
  verifiedVehicle?: { title: string; sourceUrl: string },
) {
  if (verifiedVehicle && currentStory.brandSlug === "car-and-driver") {
    return {
      id: `autos-shop-${currentStory.id}`,
      sponsor: "Car and Driver Marketplace",
      title: `Shop the ${verifiedVehicle.title}`,
      summary: `Explore trims, pricing, and buying options for the ${verifiedVehicle.title} on Car and Driver.`,
      cta: `Shop the ${verifiedVehicle.title}`,
      ctaHref: verifiedVehicle.sourceUrl,
      topics: ["Research Cars"],
      tags: ["buying", "shopping", "new cars"],
      creativeLabel: "SHOP",
      imageUrl: "/images/ads/contextual/automotive.jpg",
      palette: {
        background: "#ffffff",
        foreground: "#121212",
        accent: "#1B5F8A",
        soft: "#F1F7F7",
      },
    } satisfies ContextualAdUnit;
  }

  return selectContentReaderAdvertisement(
    currentStory,
    contextualAdsByDestination,
    slotIndex,
  );
}

function getVehicleStoryFormat(story: LifestyleRiverStory) {
  if (isExplicitGalleryStory(story)) {
    const title = story.title.toLowerCase();
    if (title.includes("interior")) return "Interior photos";
    if (title.includes("exterior")) return "Exterior photos";
    return "Photo gallery";
  }
  if (story.videoUrl || story.mediaKind === "video") return "Video";
  if (getStoryDestinationMode(story.brandSlug) === "autos" && isYearMakeModelStory(story)) return "Vehicle details";
  return "Article";
}

function getVehicleStoryLinkLabel(story: LifestyleRiverStory) {
  const format = getVehicleStoryFormat(story);
  if (format === "Vehicle details") return "Vehicle overview";
  return format;
}

function LifestyleStoryReaderModal({
  stories,
  availableStories,
  savedStoryInventory,
  openStoryId,
  initialCommentStoryId,
  savedIds,
  followedBrands,
  commentsByStoryId,
  readerReturnHref,
  singleBrandSlug,
  initialLiveArticle,
  returnFocusElementRef,
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
  savedStoryInventory: LifestyleRiverStory[];
  openStoryId: string | null;
  initialCommentStoryId?: string | null;
  savedIds: string[];
  followedBrands: string[];
  commentsByStoryId: Record<string, LifestyleStoryComment[]>;
  readerReturnHref?: string;
  /** When set, the reader's brand-switcher row is scoped to just this brand. */
  singleBrandSlug?: string;
  initialLiveArticle?: LiveArticleData;
  returnFocusElementRef: React.RefObject<HTMLElement | null>;
  initialOpenAmbientReader?: boolean;
  onClose: () => void;
  onOpenStory: (storyId: string) => void;
  onSwitchReaderStory: (storyId: string) => void;
  onSave: (story: LifestyleRiverStory) => void;
  onMoreLikeThis: (story: LifestyleRiverStory) => void;
  onToggleFollowBrand: (brandName: string) => void;
  onAddComment: (storyId: string, body: string) => void;
}) {
  const { colorMode, toggleColorMode } = useTheme();
  const destinationConfigs = useDestinationConfigs();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const commentsJumpedStoryIdRef = React.useRef<string | null>(null);
  const [readerDestinationOverride, setReaderDestinationOverride] = React.useState<Exclude<DestinationMode, "all"> | null>(null);
  const readerOriginBrandSlug = getReaderOriginBrandSlug(readerReturnHref);
  const [readerBrandOverrideSlug, setReaderBrandOverrideSlug] = React.useState<string | null>(null);
  const [readerFilterOverride, setReaderFilterOverride] = React.useState<string | null>(null);
  const [readerFetchedStories, setReaderFetchedStories] = React.useState<LifestyleRiverStory[]>([]);
  const relatedVehicleLookupKeysRef = React.useRef(new Set<string>());
  const [loadingReaderBrandSlug, setLoadingReaderBrandSlug] = React.useState<string | null>(null);
  const activeReaderBrandSlug = readerBrandOverrideSlug ?? readerOriginBrandSlug;
  const readerQueueModel = React.useMemo(
    () =>
      buildReaderQueue({
        stories,
        availableStories,
        fetchedStories: readerFetchedStories,
        activeBrandSlug: activeReaderBrandSlug,
        destinationOverride: readerDestinationOverride,
        openStoryId,
      }),
    [
      activeReaderBrandSlug,
      availableStories,
      openStoryId,
      readerDestinationOverride,
      readerFetchedStories,
      stories,
    ],
  );
  const readerAvailableStoryPool = readerQueueModel.availableStories;

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const updateBackToTopVisibility = () => setShowBackToTop(scroller.scrollTop > 320);
    updateBackToTopVisibility();
    scroller.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    return () => scroller.removeEventListener("scroll", updateBackToTopVisibility);
  }, []);
  const readerAvailableStoryPoolRef = React.useRef(readerAvailableStoryPool);
  React.useEffect(() => {
    readerAvailableStoryPoolRef.current = readerAvailableStoryPool;
  }, [readerAvailableStoryPool]);
  const readerStories = readerQueueModel.stories;
  const [visibleReaderCount, setVisibleReaderCount] = React.useState(1);
  const [liveArticles, setLiveArticles] = React.useState<Record<string, ReaderArticleLoadState>>(() => (
    openStoryId && initialLiveArticle
      ? { [openStoryId]: { status: "ready", data: initialLiveArticle } }
      : {}
  ));
  const [vehicleImagesByStoryId, setVehicleImagesByStoryId] = React.useState<Record<string, FullscreenReaderImage[]>>({});
  const [verifiedVehiclesByStoryId, setVerifiedVehiclesByStoryId] = React.useState<Record<string, { title: string; sourceUrl: string }>>({});
  const handleVehicleImages = React.useCallback((storyId: string, images: FullscreenReaderImage[]) => {
    setVehicleImagesByStoryId((current) => {
      const previous = current[storyId] ?? [];
      if (previous.length === images.length && previous.every((image, index) => image.src === images[index]?.src)) {
        return current;
      }
      return { ...current, [storyId]: images };
    });
  }, []);
  const handleVerifiedVehicle = React.useCallback((storyId: string, vehicle: { title: string; sourceUrl: string }) => {
    setVerifiedVehiclesByStoryId((current) => {
      const previous = current[storyId];
      if (previous?.title === vehicle.title && previous.sourceUrl === vehicle.sourceUrl) return current;
      return { ...current, [storyId]: vehicle };
    });
  }, []);
  const liveArticlesRef = React.useRef(liveArticles);
  const liveArticleMountedRef = React.useRef(true);
  const liveArticleRequestIdsRef = React.useRef<Record<string, number>>({});
  const [fullscreenGallery, setFullscreenGallery] = React.useState<FullscreenGalleryState | null>(null);
  const [ambientReaderStoryId, setAmbientReaderStoryId] = React.useState<string | null>(null);
  const initialAmbientReaderRequestRef = React.useRef<string | null>(
    initialOpenAmbientReader && openStoryId ? openStoryId : null
  );
  const [interstitialAdvertiser, setInterstitialAdvertiser] = React.useState<AmbientInterstitialAdvertiser>("van-cleef");
  const [showAmbientInterstitialAd, setShowAmbientInterstitialAd] = React.useState(false);
  const [ambientNavigationState, setAmbientNavigationState] = React.useState({
    openedStoryIds: new Set<string>(),
    articleVisitCount: 0,
  });
  const [ambientDiscoveryAnchorId, setAmbientDiscoveryAnchorId] = React.useState<string | null>(null);
  const [ambientDiscoveryStoryIds, setAmbientDiscoveryStoryIds] = React.useState<string[]>([]);
  const ambientDiscoveryStoryIdsRef = React.useRef<string[]>([]);
  const [ambientDiscoveryStatus, setAmbientDiscoveryStatus] = React.useState<"idle" | "loading" | "error" | "complete">("idle");
  const [ambientDiscoveryScopeKey, setAmbientDiscoveryScopeKey] = React.useState("brand-category");
  const ambientDiscoveryCursorRef = React.useRef<{
    anchorId: string | null;
    ringIndex: number;
    offsets: Record<string, number>;
  }>({
    anchorId: null,
    ringIndex: 0,
    offsets: {},
  });

  React.useEffect(() => {
    liveArticlesRef.current = liveArticles;
  }, [liveArticles]);

  React.useEffect(() => {
    // React Strict Mode replays effects in development. Restore the mounted
    // flag during setup so the replayed cleanup cannot permanently suppress
    // completed article requests.
    liveArticleMountedRef.current = true;
    return () => {
      liveArticleMountedRef.current = false;
    };
  }, []);

  const requestLiveArticle = React.useCallback((story: LifestyleRiverStory, options?: { force?: boolean }) => {
    if (!story.sourceUrl) return;

    const currentState = liveArticlesRef.current[story.id];
    if (!options?.force && (currentState?.status === "ready" || currentState?.status === "loading")) return;

    const requestId = (liveArticleRequestIdsRef.current[story.id] ?? 0) + 1;
    const requestedAt = Date.now();
    liveArticleRequestIdsRef.current[story.id] = requestId;
    setLiveArticles((current) => {
      const nextState = current[story.id];
      if (!options?.force && (nextState?.status === "ready" || nextState?.status === "loading")) return current;
      return { ...current, [story.id]: { status: "loading", requestedAt } };
    });

    void loadLiveArticle(story.sourceUrl)
      .then((data) => {
        if (
          !liveArticleMountedRef.current
          || liveArticleRequestIdsRef.current[story.id] !== requestId
        ) return;
        setLiveArticles((current) => ({ ...current, [story.id]: { status: "ready", data } }));
      })
      .catch(() => {
        if (
          !liveArticleMountedRef.current
          || liveArticleRequestIdsRef.current[story.id] !== requestId
        ) return;
        setLiveArticles((current) => ({ ...current, [story.id]: { status: "error" } }));
      });
  }, []);
  const ambientDiscoveryLoadingRef = React.useRef(false);
  const ambientDiscoveryControllerRef = React.useRef<AbortController | null>(null);
  const activeReaderRouteStoryIdRef = React.useRef<string | null>(openStoryId);
  const [activeReaderContext, setActiveReaderContext] = React.useState({
    openStoryId,
    activeStoryId: openStoryId,
  });
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
  const storyQueue = readerQueueModel.queue;
  const activeReaderContextStoryId =
    activeReaderContext.openStoryId === openStoryId
      ? activeReaderContext.activeStoryId
      : openStoryId;
  const activeReaderContextStory =
    storyQueue.find((story) => story.id === activeReaderContextStoryId)
    ?? storyQueue[0];
  const nextReaderImagePreloadKey = storyQueue
    .slice(1, 3)
    .map((story) => story.image)
    .join("|");
  const visibleReaderStories = storyQueue.slice(0, visibleReaderCount);
  const visibleReaderStoryIds = visibleReaderStories.map((story) => story.id).join("|");
  React.useEffect(() => {
    if (
      !initialCommentStoryId
      || initialCommentStoryId !== openStoryId
      || commentsJumpedStoryIdRef.current === initialCommentStoryId
    ) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    let frame = 0;
    let attempts = 0;
    const scrollToComments = () => {
      const target = document.getElementById(`reader-comments-${initialCommentStoryId}`);
      if (target && scroller.contains(target)) {
        const scrollerTop = scroller.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        scroller.scrollTo({
          top: scroller.scrollTop + targetTop - scrollerTop - 24,
        });
        target.focus({ preventScroll: true });
        commentsJumpedStoryIdRef.current = initialCommentStoryId;
        return;
      }
      attempts += 1;
      if (attempts < 12) frame = window.requestAnimationFrame(scrollToComments);
    };

    frame = window.requestAnimationFrame(scrollToComments);
    return () => window.cancelAnimationFrame(frame);
  }, [initialCommentStoryId, openStoryId, visibleReaderStoryIds]);
  React.useEffect(() => {
    visibleReaderStories.forEach((story) => {
      if (getStoryDestinationMode(story.brandSlug) !== "autos") return;
      const vehicleKey = getHearstAutoStoryVehicleKey(story);
      if (!vehicleKey || relatedVehicleLookupKeysRef.current.has(vehicleKey)) return;
      relatedVehicleLookupKeysRef.current.add(vehicleKey);

      const params = new URLSearchParams({ title: story.title });
      if (story.sourceUrl) params.set("url", story.sourceUrl);
      void fetch(`/api/hearst-auto-related-stories/?${params.toString()}`)
        .then(async (response) => {
          if (!response.ok) throw new Error("Related vehicle stories are unavailable");
          return response.json() as Promise<{ stories?: LifestyleRiverStory[] }>;
        })
        .then((result) => {
          if (!Array.isArray(result.stories) || result.stories.length === 0) return;
          setReaderFetchedStories((currentStories) => mergeUniqueStories(currentStories, result.stories ?? []));
        })
        .catch(() => relatedVehicleLookupKeysRef.current.delete(vehicleKey));
    });
  // visibleReaderStoryIds represents the reader's current lazy-loaded story set.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleReaderStoryIds]);
  const ambientCurrentStory = ambientReaderStoryId
    ? readerAvailableStoryPool.find((story) => story.id === ambientReaderStoryId)
    : undefined;
  const ambientOrderedStories = ambientDiscoveryStoryIds
    .map((storyId) => readerAvailableStoryPool.find((story) => story.id === storyId))
    .filter((story): story is LifestyleRiverStory => Boolean(story?.sourceUrl) && !story?.videoUrl);
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
  const ambientPreviousArticleState = ambientPreviousStory
    ? liveArticles[ambientPreviousStory.id]
    : undefined;
  const ambientNextArticleState = ambientNextStory
    ? liveArticles[ambientNextStory.id]
    : undefined;
  const ambientPreviousArticle = ambientPreviousArticleState?.status === "ready"
    ? ambientPreviousArticleState.data
    : undefined;
  const ambientNextArticle = ambientNextArticleState?.status === "ready"
    ? ambientNextArticleState.data
    : undefined;
  const getPredictedAmbientInterstitial = (candidate: LifestyleRiverStory | undefined) => {
    if (!candidate) return null;
    const { articleVisitCount, openedStoryIds } = ambientNavigationState;
    const alreadyOpened = openedStoryIds.has(candidate.id);
    return shouldInsertAmbientInterstitial({ alreadyOpened, articleVisitCount })
      ? getAmbientInterstitialAdvertiser(candidate, articleVisitCount + 1)
      : null;
  };
  const ambientPreviousInterstitialAdvertiser = getPredictedAmbientInterstitial(ambientPreviousStory);
  const ambientNextInterstitialAdvertiser = getPredictedAmbientInterstitial(ambientNextStory);
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
  const readerColorMode = colorMode;
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
  const readerLogoHref = usePublicationTheme && readerContextStory
    ? getHearstBrandRoute(readerContextStory.brandSlug)
    : getHearstDestinationRoute(readerDestination);
  const readerLogoColor = usePublicationTheme
    ? readerLogoSlug === "motortrend"
      ? readerTheme?.colors["1"]
      : undefined
    : readerTheme?.colors["1"]
      ? readerColorMode === "dark"
        ? `color-mix(in srgb, ${readerTheme.colors["1"]} 65%, white)`
        : readerTheme.colors["1"]
      : undefined;
  const autoWeekReaderTheme = readerContextStory?.brandSlug === "autoweek" && readerDestinationTheme
    ? getSelectedBrandTheme({ name: "Autoweek", slug: "autoweek" }, readerDestinationTheme)
    : null;
  const readerThemeCssVars = readerTheme
    ? {
        ...brandToCssVars(readerTheme, readerColorMode),
        "--content-reader-article-surface": readerColorMode === "dark"
          ? contentReaderTheme.fluxArticleSurface
          : "var(--hp-surface)",
        ...(autoWeekReaderTheme
          ? { "--content-reader-active-label": autoWeekReaderTheme.colors["11"] }
          : {}),
        ...(readerDestination === "autos" && !singleBrandSlug && readerColorMode === "light"
          ? { "--brand-3": "var(--component-card-background-default, var(--palette-background-default, #ffffff))" }
          : {}),
      } as React.CSSProperties
    : undefined;
  const isReaderOpen = Boolean(openStoryId);
  const readerSectionBrands = singleBrandSlug
    ? readerDestinationConfig.sourceNotes.filter((note) => note.brandSlug === singleBrandSlug)
    : readerDestinationConfig.sourceNotes;
  const readerMastheadNavItems = usePublicationTheme
    ? readerSectionBrands.map((brand) => ({
        type: "brand" as const,
        key: brand.brandSlug,
        label: brand.brand,
        brandSlug: brand.brandSlug,
      }))
    : hearstReaderSections.map((section) => ({
        type: "section" as const,
        key: section.mode,
        label: section.label,
        mode: section.mode,
      }));
  const derivedReaderActiveFilter = readerContextStory
    ? readerDestinationConfig.filters.find((filter) =>
        filter !== "For You"
        && filter !== "Saved"
        && storyMatchesLifestyleFilter(readerContextStory, filter)
      ) ?? "For You"
    : "For You";
  const readerActiveFilter = readerFilterOverride ?? derivedReaderActiveFilter;

  const getReaderFilterStory = (filter: string) => {
    if (!readerContextStory) return undefined;
    if (filter === "For You") {
      return readerStories.find((story) =>
        story.id !== readerContextStory.id
        && getStoryDestinationMode(story.brandSlug) === readerDestination
      ) ?? readerContextStory;
    }

    return readerStories.find((story) =>
      getStoryDestinationMode(story.brandSlug) === readerDestination
      && (filter === "Saved"
        ? savedIds.includes(story.id)
        : storyMatchesLifestyleFilter(story, filter))
    );
  };
  const contentReaderFilterItems = readerDestinationConfig.filters.map((filter) => ({
    label: filter,
    active: filter === readerActiveFilter,
    disabled: !getReaderFilterStory(filter),
  }));
  React.useEffect(() => {
    if (openStoryId) recordStoryOpened(openStoryId);
  }, [openStoryId]);

  const resetAmbientDiscovery = React.useCallback(() => {
    ambientDiscoveryControllerRef.current?.abort();
    ambientDiscoveryControllerRef.current = null;
    ambientDiscoveryLoadingRef.current = false;
    ambientDiscoveryCursorRef.current = {
      anchorId: null,
      ringIndex: 0,
      offsets: {},
    };
    setAmbientDiscoveryAnchorId(null);
    setAmbientDiscoveryStoryIds([]);
    ambientDiscoveryStoryIdsRef.current = [];
    setAmbientDiscoveryScopeKey("brand-category");
    setAmbientDiscoveryStatus("idle");
  }, []);

  React.useEffect(() => () => {
    ambientDiscoveryControllerRef.current?.abort();
  }, []);

  const selectReaderStory = React.useCallback((storyId: string, options?: { activeFilter?: string }) => {
    setVisibleReaderCount(1);
    setFullscreenGallery(null);
    setAmbientReaderStoryId(null);
    setReaderFilterOverride(options?.activeFilter ?? null);
    resetAmbientDiscovery();
    activeReaderRouteStoryIdRef.current = storyId;
    setActiveReaderContext({
      openStoryId: storyId,
      activeStoryId: storyId,
    });
    scrollRef.current?.scrollTo({ top: 0 });
    onSwitchReaderStory(storyId);
  }, [
    onSwitchReaderStory,
    resetAmbientDiscovery,
    setFullscreenGallery,
    setVisibleReaderCount,
  ]);

  const loadAmbientDiscoveryBatch = React.useCallback(async () => {
    if (
      !ambientDiscoveryAnchorId
      || ambientDiscoveryLoadingRef.current
      || ambientDiscoveryStatus === "complete"
    ) return;

    const anchor = readerAvailableStoryPoolRef.current.find(
      (story) => story.id === ambientDiscoveryAnchorId
    );
    if (!anchor) return;

    const scopes = getAmbientReaderDiscoveryScopes(anchor);
    const cursor = ambientDiscoveryCursorRef.current;
    if (cursor.anchorId !== anchor.id) return;

    const currentIds = ambientDiscoveryStoryIdsRef.current;
    const controller = new AbortController();
    ambientDiscoveryControllerRef.current?.abort();
    ambientDiscoveryControllerRef.current = controller;
    ambientDiscoveryLoadingRef.current = true;
    setAmbientDiscoveryStatus("loading");

    const queuedStories = currentIds
      .map((storyId) =>
        readerAvailableStoryPoolRef.current.find((story) => story.id === storyId)
      )
      .filter((story): story is LifestyleRiverStory => Boolean(story));
    const seenIdentities = new Set(queuedStories.map(getStoryIdentity));
    const discoveredStories: LifestyleRiverStory[] = [];
    let requestCount = 0;

    try {
      while (
        discoveredStories.length < ambientReaderDiscoveryBatchSize
        && cursor.ringIndex < scopes.length
        && requestCount < 10
      ) {
        const scope = scopes[cursor.ringIndex];
        setAmbientDiscoveryScopeKey(scope.key);

        rankAmbientReaderDiscoveryStories(
          anchor,
          readerAvailableStoryPoolRef.current,
        )
          .filter((story) =>
            getAmbientReaderDiscoveryTier(anchor, story) === cursor.ringIndex
          )
          .forEach((story) => {
            if (discoveredStories.length >= ambientReaderDiscoveryBatchSize) return;
            const identity = getStoryIdentity(story);
            if (seenIdentities.has(identity)) return;
            seenIdentities.add(identity);
            discoveredStories.push(story);
          });
        if (discoveredStories.length >= ambientReaderDiscoveryBatchSize) break;

        const requestedOffset = cursor.offsets[scope.key] ?? 0;
        const searchParams = new URLSearchParams({
          destination: scope.destination,
          offset: String(requestedOffset),
          limit: String(ambientReaderDiscoveryBatchSize),
        });
        if (scope.brandSlug) searchParams.set("brandSlug", scope.brandSlug);
        if (scope.category) searchParams.set("category", scope.category);

        requestCount += 1;
        const response = await fetch(`/api/story-feed/?${searchParams.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Ambient discovery returned ${response.status}`);

        const page = await response.json() as ProgressiveFeedPage;
        if (page.hasMore && page.nextOffset <= requestedOffset) {
          throw new Error("Ambient discovery pagination did not advance");
        }

        cursor.offsets[scope.key] = page.nextOffset;
        rankAmbientReaderDiscoveryStories(anchor, page.stories).forEach((story) => {
          if (discoveredStories.length >= ambientReaderDiscoveryBatchSize) return;
          const identity = getStoryIdentity(story);
          if (seenIdentities.has(identity)) return;
          seenIdentities.add(identity);
          discoveredStories.push(story);
        });

        if (!page.hasMore) {
          cursor.ringIndex += 1;
        }
      }

      if (ambientDiscoveryCursorRef.current.anchorId !== anchor.id) return;
      if (discoveredStories.length > 0) {
        setReaderFetchedStories((currentStories) =>
          mergeUniqueStories(currentStories, discoveredStories)
        );
        const nextIds = appendAmbientReaderDiscoveryStoryIds(
          ambientDiscoveryStoryIdsRef.current,
          anchor,
          discoveredStories,
        );
        ambientDiscoveryStoryIdsRef.current = nextIds;
        setAmbientDiscoveryStoryIds(nextIds);
      }

      const isComplete = cursor.ringIndex >= scopes.length;
      setAmbientDiscoveryScopeKey(
        scopes[Math.min(cursor.ringIndex, scopes.length - 1)]?.key ?? "all-sections"
      );
      setAmbientDiscoveryStatus(isComplete ? "complete" : "idle");
    } catch {
      if (!controller.signal.aborted) setAmbientDiscoveryStatus("error");
    } finally {
      if (ambientDiscoveryControllerRef.current === controller) {
        ambientDiscoveryControllerRef.current = null;
      }
      ambientDiscoveryLoadingRef.current = false;
    }
  }, [ambientDiscoveryAnchorId, ambientDiscoveryStatus]);

  React.useEffect(() => {
    if (
      !ambientReaderStoryId
      || ambientDiscoveryStatus !== "idle"
      || ambientNextCandidateStories.length > ambientReaderDiscoveryBuffer
    ) return;

    void loadAmbientDiscoveryBatch();
  }, [
    ambientDiscoveryStatus,
    ambientNextCandidateStories.length,
    ambientReaderStoryId,
    loadAmbientDiscoveryBatch,
  ]);

  const openAmbientReader = React.useCallback((storyId: string) => {
    if (!ambientDiscoveryAnchorId) {
      const anchor = readerAvailableStoryPoolRef.current.find((story) => story.id === storyId);
      ambientDiscoveryControllerRef.current?.abort();
      ambientDiscoveryCursorRef.current = {
        anchorId: storyId,
        ringIndex: 0,
        offsets: {},
      };
      setAmbientDiscoveryAnchorId(storyId);
      const initialIds = anchor
        ? [
            storyId,
            ...rankAmbientReaderDiscoveryStories(
              anchor,
              readerAvailableStoryPoolRef.current,
            )
              .filter((story) =>
                story.id !== storyId
                && getAmbientReaderDiscoveryTier(anchor, story) === 0
              )
              .slice(0, ambientReaderDiscoveryBatchSize - 1)
              .map((story) => story.id),
          ]
        : [storyId];
      ambientDiscoveryStoryIdsRef.current = initialIds;
      setAmbientDiscoveryStoryIds(initialIds);
      setAmbientDiscoveryScopeKey("brand-category");
      setAmbientDiscoveryStatus("idle");
    }
    setAmbientReaderStoryId(storyId);
    if (!ambientNavigationState.openedStoryIds.has(storyId)) {
      const openedStory = readerAvailableStoryPoolRef.current.find((story) => story.id === storyId);
      const { articleVisitCount } = ambientNavigationState;
      const shouldShowAd = shouldInsertAmbientInterstitial({
        alreadyOpened: false,
        articleVisitCount,
      });
      setAmbientNavigationState((current) => ({
        openedStoryIds: new Set(current.openedStoryIds).add(storyId),
        articleVisitCount: current.articleVisitCount + 1,
      }));
      if (shouldShowAd) {
        setInterstitialAdvertiser(getAmbientInterstitialAdvertiser(openedStory, articleVisitCount + 1));
      }
      setShowAmbientInterstitialAd(shouldShowAd);
    }
  }, [
    ambientDiscoveryAnchorId,
    ambientNavigationState,
    setAmbientReaderStoryId,
    setShowAmbientInterstitialAd,
  ]);

  const openAmbientReaderWithRoute = React.useCallback((storyId: string) => {
    openAmbientReader(storyId);
    window.history.replaceState(
      {
        ...window.history.state,
        hearstReaderStory: storyId,
        hearstReaderMode: "ambient",
      },
      "",
      appendAmbientReaderHref(storyId, readerReturnHref ?? null)
    );
  }, [openAmbientReader, readerReturnHref]);

  React.useEffect(() => {
    if (!openStoryId || typeof window === "undefined") return;

    [
      ...storyQueue.slice(1, 3),
    ].forEach((story) => {
      if (!story.image) return;
      const image = new window.Image();
      image.decoding = "async";
      image.src = `/_next/image/?${new URLSearchParams({
        url: story.image,
        w: "640",
        q: "75",
      }).toString()}`;
    });
  // The key intentionally represents the next reader stories.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStoryId, nextReaderImagePreloadKey]);

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
      setActiveReaderContext({
        openStoryId,
        activeStoryId: nextStoryId,
      });
      window.history.replaceState(
        {
          ...window.history.state,
          hearstReaderStory: nextStoryId,
        },
        "",
        buildReaderStoryHref(nextStoryId, readerReturnHref ?? null, singleBrandSlug)
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
  }, [openStoryId, readerReturnHref, singleBrandSlug, visibleReaderStoryIds, visibleReaderStories.length]);

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
    const storiesToLoad = [
      ...visibleReaderStories,
      ...ambientReaderPreloadStories,
    ];
    const seenStoryIds = new Set<string>();
    storiesToLoad.forEach((story) => {
      if (seenStoryIds.has(story.id)) return;
      seenStoryIds.add(story.id);
      requestLiveArticle(story);
    });
  // The ID key intentionally represents the current lazy-loaded reader queue.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientReaderPreloadStoryIds, requestLiveArticle, visibleReaderStoryIds]);

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
      openAmbientReaderWithRoute(activeStoryId);
    };

    window.addEventListener("keydown", openPremiumReaderFromKeyboard);
    return () => window.removeEventListener("keydown", openPremiumReaderFromKeyboard);
  }, [ambientReaderStoryId, fullscreenGallery, isReaderOpen, liveArticles, openAmbientReaderWithRoute, visibleReaderStoryIds]);

  if (!openStoryId || readerQueueModel.openIndex < 0) return null;

  const activeReaderMastheadNavKey = readerMastheadNavItems.find((item) =>
    item.type === "section"
      ? item.mode === readerDestination
      : item.brandSlug === readerContextStory?.brandSlug
  )?.key;
  const contentReaderMastheadItems = readerMastheadNavItems.map((item) => {
    const active = item.type === "section"
      ? item.mode === readerDestination
      : item.brandSlug === readerContextStory?.brandSlug;
    const nextStory = item.type === "brand"
      ? readerAvailableStoryPool.find((story) => story.brandSlug === item.brandSlug)
      : readerAvailableStoryPool.find(
          (story) => getStoryDestinationMode(story.brandSlug) === item.mode,
        );

    return {
      key: item.key,
      label: item.label,
      active,
      disabled: item.type === "section"
        ? !nextStory
        : loadingReaderBrandSlug === item.brandSlug,
      loading:
        item.type === "brand"
        && loadingReaderBrandSlug === item.brandSlug,
    };
  });
  const selectReaderMastheadItem = async (key: string) => {
    const item = readerMastheadNavItems.find((candidate) => candidate.key === key);
    if (!item) return;

    const active = item.type === "section"
      ? item.mode === readerDestination
      : item.brandSlug === readerContextStory?.brandSlug;
    let targetStory = item.type === "brand"
      ? readerAvailableStoryPool.find((story) => story.brandSlug === item.brandSlug)
      : readerAvailableStoryPool.find(
          (story) => getStoryDestinationMode(story.brandSlug) === item.mode,
        );

    if (active || (item.type === "section" && !targetStory)) return;
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
          setReaderFetchedStories((currentStories) =>
            mergeUniqueStories(currentStories, page.stories)
          );
          targetStory = page.stories.find(
            (story) => story.brandSlug === item.brandSlug,
          );
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
  };
  const selectReaderFilter = (filter: string) => {
    const filterStory = getReaderFilterStory(filter);
    if (filterStory) selectReaderStory(filterStory.id, { activeFilter: filter });
  };
  return (
    <>
      <ContentReaderDialogShell
        contentRef={scrollRef}
        floatingAction={showBackToTop ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Back to top"
            title="Back to top"
            className="absolute bottom-8 z-[120] h-11 w-11 rounded-full bg-background sm:h-7 sm:w-7"
            style={{ right: "max(2rem, calc((100vw - 1360px) / 2 + 2rem))" }}
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
        destination={readerDestination}
        mode={readerColorMode}
        nestedDialogOpen={Boolean(resolvedFullscreenGallery || ambientReaderStoryId)}
        onClose={onClose}
        returnFocusElementRef={returnFocusElementRef}
        style={readerThemeCssVars}
      >
        <ContentReaderMasthead
          logoHref={readerLogoHref}
          contextLabel={readerContextLabel}
          logoSlug={readerLogoSlug}
          logoColor={readerLogoColor}
          forceLogoColor={!usePublicationTheme && Boolean(readerLogoColor)}
          visibleStoryCount={visibleReaderStories.length}
          storyCount={storyQueue.length}
          activeMastheadKey={activeReaderMastheadNavKey}
          mastheadItems={contentReaderMastheadItems}
          mastheadNavigationLabel={
            usePublicationTheme
              ? `${readerDestinationLabel} publications`
              : "Hearst destinations"
          }
          filterItems={contentReaderFilterItems}
          sectionLabel={readerDestinationLabel}
          onSelectMastheadItem={selectReaderMastheadItem}
          onSelectFilter={selectReaderFilter}
          onClose={onClose}
        />

        <div
          className="grid touch-pan-y gap-y-8 gap-x-[var(--layout-gap)] px-4 py-6 md:px-6 xl:px-12 xl:grid-cols-[var(--layout-rail)_minmax(0,1fr)]"
        >
          <ContentReaderContextRail
            currentStory={activeReaderContextStory}
            stories={readerStories}
            savedStories={savedStoryInventory}
            savedIds={savedIds}
            onOpenStory={onOpenStory}
            onSaveStory={onSave}
          />
          <div className="min-w-0">
            {visibleReaderStories.map((story, index) => {
              const kind = getLifestyleCardKind(story);
              const useRoadAndTrackHeadline = story.brandSlug === "road-and-track";
              const usePhotoGallery = story.brandSlug === "car-and-driver" && isExplicitGalleryStory(story);
              const useInterReaderTypography = story.brandSlug === "car-and-driver" && isYearMakeModelStory(story);
              const verifiedVehicle = useInterReaderTypography ? verifiedVehiclesByStoryId[story.id] : undefined;
              const isAutosStory = getStoryDestinationMode(story.brandSlug) === "autos";
              const relatedVehicleStories = isAutosStory && getHearstAutoStoryVehicleKey(story)
                ? [...new Map(
                    [...readerAvailableStoryPool, ...visibleReaderStories]
                      .filter((candidate) => getStoryDestinationMode(candidate.brandSlug) === "autos"
                        && candidate.id !== story.id
                        && areHearstAutoStoriesAboutSameVehicle(story, candidate))
                      .map((candidate) => [candidate.id, candidate] as const),
                  ).values()]
                    .sort((first, second) => {
                      const priority: Record<string, number> = {
                        "Vehicle details": 0,
                        Video: 1,
                        "Interior photos": 2,
                        "Exterior photos": 3,
                        "Photo gallery": 4,
                        Article: 5,
                      };
                      return (priority[getVehicleStoryFormat(first)] ?? 6) - (priority[getVehicleStoryFormat(second)] ?? 6);
                    })
                    .slice(0, 8)
                : [];
              const readerAd = getLifestyleReaderAd(story, index, verifiedVehicle);
              const photoGalleryImages = usePhotoGallery
                ? getFullscreenReaderImages(story, liveArticles[story.id]).filter((image, imageIndex, images) => {
                    const imagePath = (value: string) => {
                      try {
                        return new URL(value).pathname;
                      } catch {
                        return value;
                      }
                    };
                    return images.findIndex((candidate) => imagePath(candidate.src) === imagePath(image.src)) === imageIndex;
                  })
                : [];
              const vehicleGalleryImages = useInterReaderTypography
                ? [
                    ...getFullscreenReaderImages(story, liveArticles[story.id]),
                    ...(vehicleImagesByStoryId[story.id] ?? []),
                  ].filter((image, imageIndex, images) => {
                    const imagePath = (value: string) => {
                      try {
                        return new URL(value).pathname;
                      } catch {
                        return value;
                      }
                    };
                    return images.findIndex((candidate) => imagePath(candidate.src) === imagePath(image.src)) === imageIndex;
                  }).slice(0, 4)
                : [];
              const vehicleThumbnailImages = vehicleGalleryImages.slice(1, 4);
              const readerActionBar = (
                <ReaderActionBar
                  story={story}
                  article={getReadyLiveArticle(liveArticles[story.id])}
                  saved={savedIds.includes(story.id)}
                  commentCount={getLifestyleCommentCount(story, commentsByStoryId[story.id]?.length ?? 0)}
                  onSave={() => onSave(story)}
                  premiumReaderState={getAmbientReaderState(story, liveArticles[story.id])}
                  onOpenPremiumReader={isCompleteAmbientArticle(liveArticles[story.id])
                    ? () => openAmbientReaderWithRoute(story.id)
                    : undefined}
                />
              );

              return (
                <React.Fragment key={story.id}>
                  {index > 0 ? (
                    <div className="flex items-center gap-4 py-10" aria-label="Up next">
                      <span className="h-px flex-1 bg-border" aria-hidden="true" />
                      <span className="type-k1 text-primary">
                        Up next
                      </span>
                      <span className="h-px flex-1 bg-border" aria-hidden="true" />
                    </div>
                  ) : null}
                  <div className="grid gap-y-8 gap-x-[var(--layout-gap)] lg:grid-cols-[minmax(0,1fr)_var(--layout-rail)]">
                    <article
                      data-reader-story-id={story.id}
                      className={cn(
                        "relative min-w-0 rounded-[8px] border px-5 py-5 sm:px-7 sm:py-7",
                        useInterReaderTypography ? "font-sans" : "",
                        readerDestination === "flux" && readerColorMode === "dark"
                          ? "border-white/15 bg-[var(--content-reader-article-surface)] text-[var(--component-video-feed-content-primary)] [--border:var(--component-video-feed-border-default)] [--foreground:var(--component-video-feed-content-headline)] [--muted-foreground:var(--component-video-feed-content-secondary)]"
                          : "border-border bg-card text-foreground"
                      )}
                      style={{
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
                      ) : usePhotoGallery ? null : (
                        useInterReaderTypography ? (
                          <div className="grid aspect-video w-full grid-cols-[minmax(0,2fr)_minmax(4.5rem,.8fr)] gap-2 overflow-hidden rounded-[4px] sm:gap-3">
                            <button
                              type="button"
                              className="group relative h-full min-h-0 w-full cursor-zoom-in overflow-hidden rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                              onClick={() => setFullscreenGallery({ story, images: vehicleGalleryImages, initialIndex: 0 })}
                              aria-label={`View image fullscreen: ${story.title}`}
                            >
                              <LifestyleRiverImage story={story} className="absolute inset-0 h-full w-full rounded-[4px] object-cover" />
                            </button>
                            {vehicleThumbnailImages.length > 0 ? (
                              <div className={cn(
                                "grid min-h-0 gap-2 sm:gap-3",
                                vehicleThumbnailImages.length === 1 ? "grid-rows-1" : vehicleThumbnailImages.length === 2 ? "grid-rows-2" : "grid-rows-3",
                              )}>
                                {vehicleThumbnailImages.map((image, imageIndex) => (
                                  <button
                                    key={image.src}
                                    type="button"
                                    className="group relative min-h-0 w-full cursor-zoom-in overflow-hidden rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    onClick={() => setFullscreenGallery({ story, images: vehicleGalleryImages, initialIndex: imageIndex + 1 })}
                                    aria-label={`View image fullscreen: ${image.alt}`}
                                  >
                                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 20vw, 160px" className="object-cover transition-opacity group-hover:opacity-90" />
                                  </button>
                                ))}
                              </div>
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
                            <LifestyleRiverImage story={story} className="aspect-video w-full rounded-[4px]" />
                          </button>
                        )
                      )}
                      <div className={cn("mx-auto max-w-3xl", usePhotoGallery ? "" : "mt-6")}>
                        {useInterReaderTypography ? (
                          <VehicleDetailsReaderModule
                            story={story}
                            afterHeading={readerActionBar}
                            onImages={handleVehicleImages}
                            onVehicleDetails={handleVerifiedVehicle}
                          />
                        ) : null}
                        <div className="mb-3 flex flex-wrap items-center gap-2 type-k1 text-primary">
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
                        {!useInterReaderTypography ? (
                          <>
                            <div data-story-brand={story.brandSlug}>
                              <h2 className="headline type-t1">
                                {story.title}
                              </h2>
                            </div>
                            {readerActionBar}
                          </>
                        ) : null}
                        {usePhotoGallery && liveArticles[story.id]?.status === "ready" ? (
                          <div className="mt-6 space-y-8" aria-label="Photo gallery">
                            {photoGalleryImages.map((image, imageIndex) => (
                              <figure key={image.src} className="space-y-2">
                                <button
                                  type="button"
                                  className="group block w-full cursor-zoom-in rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                                  onClick={() => setFullscreenGallery({ story, images: photoGalleryImages, initialIndex: imageIndex })}
                                  aria-label={`View image fullscreen: ${image.alt}`}
                                >
                                  <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={1600}
                                    height={1100}
                                    sizes="(max-width: 768px) 100vw, 768px"
                                    className="h-auto max-h-[720px] w-full rounded-[4px] object-contain transition-opacity group-hover:opacity-95"
                                  />
                                </button>
                                {image.caption || image.credit ? (
                                  <figcaption className="type-c1 text-muted-foreground">
                                    {[image.caption, image.credit].filter(Boolean).join(" · ")}
                                  </figcaption>
                                ) : null}
                              </figure>
                            ))}
                          </div>
                        ) : (
                          <ReaderArticleBody
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
                            onRetry={() => requestLiveArticle(story, { force: true })}
                            hideImages={useInterReaderTypography || usePhotoGallery}
                          />
                        )}
                        <LifestyleCardModule story={story} kind={kind} />
                        {relatedVehicleStories.length ? (
                          <nav className="mt-8 border-t border-border pt-6" aria-label={`More on ${story.title}`}>
                            <h3 className="mb-4 text-base font-semibold text-foreground">More on this vehicle</h3>
                            <ul className="grid gap-3">
                              {relatedVehicleStories.map((relatedStory) => (
                                <li key={relatedStory.id} className="relative min-w-0">
                                  <button
                                    type="button"
                                    className="group grid w-full grid-cols-[minmax(112px,30%)_minmax(0,1fr)] items-center gap-4 rounded-[var(--border-radius-md)] border border-border bg-[var(--component-card-background-default)] p-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:grid-cols-[minmax(180px,30%)_minmax(0,1fr)] sm:gap-6 sm:p-4"
                                    onClick={() => selectReaderStory(relatedStory.id)}
                                    aria-label={`Open ${getVehicleStoryLinkLabel(relatedStory)}: ${relatedStory.title}`}
                                  >
                                    <span className="relative block aspect-[4/3] min-w-0 overflow-hidden rounded-[8px] bg-muted">
                                      <LifestyleRiverImage
                                        story={relatedStory}
                                        alt=""
                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transition-none"
                                      />
                                    </span>
                                    <span className="min-w-0 py-1 pr-9 sm:py-2 sm:pr-12">
                                      <span className="mb-3 flex min-w-0 items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                                        <BrandSourceIcon brand={relatedStory.brand} brandSlug={relatedStory.brandSlug} />
                                        <span className="truncate">{[relatedStory.brand, relatedStory.topic, relatedStory.byline].filter(Boolean).join(" · ")}</span>
                                      </span>
                                      <span className="block line-clamp-3 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                                        {relatedStory.title}
                                      </span>
                                      <span className="type-b2 mt-2 hidden line-clamp-2 text-muted-foreground sm:block">
                                        {relatedStory.summary || "Explore more reporting, photos, and vehicle details."}
                                      </span>
                                    </span>
                                  </button>
                                  <StorySaveIconButton
                                    saved={savedIds.includes(relatedStory.id)}
                                    onSave={() => onSave(relatedStory)}
                                    className="absolute right-4 top-4"
                                  />
                                </li>
                              ))}
                            </ul>
                          </nav>
                        ) : null}
                        <ContentReaderComments
                          key={story.id}
                          story={story}
                          comments={commentsByStoryId[story.id] ?? []}
                          onAddComment={(body) => onAddComment(story.id, body)}
                        />
                      </div>
                    </article>
                    <ContentReaderAdvertisement
                      ad={readerAd}
                      currentTopic={story.topic}
                    />
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
      </ContentReaderDialogShell>
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
          story={readerAvailableStoryPool.find((story) => story.id === ambientReaderStoryId) ?? storyQueue[0]}
          article={liveArticles[ambientReaderStoryId].data}
          colorMode={colorMode}
          onToggleColorMode={toggleColorMode}
          destinationThemeSlugs={{
            lifestyle: destinationConfigs.lifestyle.brandSlug,
            autos: destinationConfigs.autos.brandSlug,
            flux: destinationConfigs.flux.brandSlug,
            ew: destinationConfigs.ew.brandSlug,
          }}
          previousStory={ambientPreviousStory}
          nextStory={ambientNextStory}
          previousArticle={ambientPreviousArticle}
          nextArticle={ambientNextArticle}
          previousInterstitialAdvertiser={ambientPreviousInterstitialAdvertiser}
          nextInterstitialAdvertiser={ambientNextInterstitialAdvertiser}
          discoveryStatus={ambientDiscoveryStatus}
          discoveryScope={ambientDiscoveryScopeKey}
          discoveryCount={ambientOrderedStories.length}
          relatedStories={ambientRelatedReadyStories}
          onClose={() => {
            setAmbientReaderStoryId(null);
            resetAmbientDiscovery();
            window.history.replaceState(
              {
                ...window.history.state,
                hearstReaderMode: undefined,
              },
              "",
              removeAmbientReaderHref(window.location.href)
            );
          }}
          onNavigateStory={(storyId) => {
            openAmbientReader(storyId);
            window.history.replaceState(
              {
                ...window.history.state,
                hearstReaderStory: storyId,
                hearstReaderMode: "ambient",
              },
              "",
              appendAmbientReaderHref(storyId, readerReturnHref ?? null)
            );
            scrollRef.current?.scrollTo({ top: 0 });
          }}
          showInterstitialAd={showAmbientInterstitialAd}
          interstitialAdvertiser={interstitialAdvertiser}
          onDismissInterstitialAd={() => setShowAmbientInterstitialAd(false)}
          onOpenImage={(image) => {
            const ambientStory = readerAvailableStoryPool.find((story) => story.id === ambientReaderStoryId) ?? storyQueue[0];
            const images = getFullscreenReaderImages(ambientStory, liveArticles[ambientReaderStoryId]);
            setFullscreenGallery({
              story: ambientStory,
              images,
              initialIndex: Math.max(0, images.findIndex((candidate) => candidate.src === image.src)),
            });
          }}
        />
      ) : null}
    </>
  );
}

type LifestyleRiverHomePageProps = {
  activeFilter: string;
  riverLoading?: boolean;
  destination: DestinationMode;
  fullWidthFeaturedHero?: boolean;
  sectionsHomepage?: boolean;
  blocksHomepage?: boolean;
  destinationConfig?: DestinationConfig;
  videoFeedData?: LiveFeedData;
  singleBrandName?: string;
  initialBrandSlug?: string;
  initialOpenStoryId?: string;
  initialCommentStoryId?: string;
  initialLiveArticle?: LiveArticleData;
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
  joinedBrandGroups?: string[];
  onJoinedBrandGroupsChange?: React.Dispatch<React.SetStateAction<string[]>>;
  onGuestSavePrompt?: () => void;
  feedTotal?: number | null;
  feedLoadedCount?: number;
  feedHasMore?: boolean;
  feedLoading?: boolean;
  feedError?: string | null;
  onRequestNextFeedPage?: () => void;
};

function getLifestyleRiverPageHeading(config: DestinationConfig, initialBrandSlug?: string) {
  const initialBrandName = config.sourceNotes.find((note) => note.brandSlug === initialBrandSlug)?.brand;
  return `${initialBrandName ?? config.productName} personalized story feed`;
}

const lifestyleHeroStoryCount = 5;
const initialLifestyleRiverCardCount = 16;
const progressiveRiverRevealCount = 4;
const progressiveRiverLoadedBuffer = 12;
const localNewsFilter = "Local News";

function isHoroscopeStory(story: LifestyleRiverStory) {
  const searchableText = [story.title, ...story.tags].filter(Boolean).join(" ").toLowerCase();
  return searchableText.includes("horoscope") || searchableText.includes("zodiac");
}

export {
  LifestyleRiverLoadingState,
  ProgressiveFeedSentinelStatus,
};

function LifestyleRiverHydrationGate(props: LifestyleRiverHomePageProps) {
  const destinationConfigs = useDestinationConfigs();
  const { isHydrated } = useReaderAccount();
  const riverLayout = useRiverLayout();
  const config = props.destinationConfig ?? destinationConfigs[props.destination];
  const pageHeading = props.blocksHomepage
    ? "Hearst+ editorial blocks"
    : props.sectionsHomepage
      ? "Hearst+ editorial sections"
    : getLifestyleRiverPageHeading(config, props.initialBrandSlug);
  const useFlushVideoTop = props.activeFilter === "Videos" && Boolean(props.videoFeedData);
  const fullWidthHeroActive = props.fullWidthFeaturedHero || riverLayout === "full-width-hero";

  return (
    <div className={cn(
      "flow-root min-h-[calc(100dvh-173px)] md:min-h-[calc(100dvh-171px)]",
      !useFlushVideoTop && (fullWidthHeroActive ? "pt-4" : "md:pt-4"),
    )}>
      {isHydrated && !props.riverLoading
        ? <LifestyleRiverHomePage {...props} />
        : <LifestyleRiverLoadingState pageHeading={pageHeading} />}
    </div>
  );
}

function LifestyleRiverHomePage({
  activeFilter,
  destination,
  fullWidthFeaturedHero: forceFullWidthFeaturedHero = false,
  sectionsHomepage = false,
  blocksHomepage = false,
  destinationConfig,
  videoFeedData,
  singleBrandName,
  initialBrandSlug,
  initialOpenStoryId,
  initialCommentStoryId: initialCommentStoryIdProp,
  initialLiveArticle,
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
  joinedBrandGroups: controlledJoinedBrandGroups,
  onJoinedBrandGroupsChange,
  onGuestSavePrompt,
  feedTotal = null,
  feedLoadedCount = 0,
  feedHasMore = false,
  feedLoading = false,
  feedError = null,
  onRequestNextFeedPage,
}: LifestyleRiverHomePageProps) {
  const { colorMode } = useTheme();
  const destinationConfigs = useDestinationConfigs();
  const searchParams = useSearchParams();
  const isSectionsHomepage = sectionsHomepage || searchParams?.get("layout") === "sections";
  const savedRiverLayout = useRiverLayout();
  const isBlocksHomepage = blocksHomepage || searchParams?.get("layout") === "blocks" || (savedRiverLayout === "blocks" && !sectionsHomepage && searchParams?.get("layout") !== "sections");
  const enlargeBlocksSectionHeadings = destination === "all" && !initialBrandSlug;
  const riverLayout = savedRiverLayout === "list" ? "list" : "cards";
  const featuredCardColors = getFeaturedCardColors(destination, initialBrandSlug);
  // Dark mode swaps the panel to the card surface, so the text must follow it:
  // banner foregrounds (e.g. #121212 on light brands) would vanish on a dark card.
  const carouselCardColors = colorMode === "dark"
    ? { ...featuredCardColors, background: "var(--card)", foreground: "var(--card-foreground)" }
    : featuredCardColors;
  const fullWidthFeaturedHero = forceFullWidthFeaturedHero || (!isSectionsHomepage && !isBlocksHomepage && savedRiverLayout === "full-width-hero");
  const config = destinationConfig ?? destinationConfigs[destination];
  const { account, updatePreferences, addComment } = useReaderAccount();
  const router = useRouter();
  const pathname = usePathname();
  const useResponsiveDestinationRails =
    ["all", "lifestyle", "autos", "flux", "ew"].includes(destination) &&
    activeFilter === "For You" &&
    !singleBrandName &&
    !fullWidthFeaturedHero;
  const { entries: readingHistory } = useReadingHistoryState();
  const continueReadingStoryIds = React.useMemo(
    () => getContinueReadingStoryIds(readingHistory),
    [readingHistory]
  );
  const [visitStartedAt] = React.useState(() => Date.now());
  const [editionDate, setEditionDate] = React.useState(() => getLocalEditionDate(new Date(visitStartedAt)));
  React.useEffect(() => {
    const refreshEditionDate = () => {
      const nextEditionDate = getLocalEditionDate(new Date());
      setEditionDate((currentEditionDate) => currentEditionDate === nextEditionDate
        ? currentEditionDate
        : nextEditionDate);
    };

    const intervalId = window.setInterval(refreshEditionDate, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);
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
  const joinedBrandGroups = controlledJoinedBrandGroups ?? activeBrandFilters;
  const setJoinedBrandGroups = onJoinedBrandGroupsChange ?? setActiveBrandFilters;
  const [activeAutosOemFilters, setActiveAutosOemFilters] = React.useState<string[]>([]);
  const [researchCarFilterSelection, setResearchCarFilterSelection] = React.useState({
    bodyStyle: "",
    make: "",
    price: "",
    powertrain: "",
    rating: "",
  });
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
  const readerReturnFocusElementRef = React.useRef<HTMLElement | null>(null);
  const readerRiverReturnContextRef = React.useRef<ReaderRiverReturnContext | null>(null);
  const [readerReturnAnchorStoryId, setReaderReturnAnchorStoryId] = React.useState<string | null>(null);
  const visibleStoryScopeKeyRef = React.useRef("");
  const delishShortOpenerRef = React.useRef<HTMLElement | null>(null);
  const displayStoryIdsRef = React.useRef<string[]>([]);
  const [commentsByStoryId, setCommentsByStoryId] = React.useState<Record<string, LifestyleStoryComment[]>>({});
  const [initialCommentStoryId, setInitialCommentStoryId] = React.useState<string | null>(
    initialCommentStoryIdProp ?? null,
  );
  const [localNewsReaderStories, setLocalNewsReaderStories] = React.useState<LifestyleRiverStory[]>([]);
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [delishShortsRiverPlacement, setDelishShortsRiverPlacement] = React.useState<{
    scopeKey: string;
    index: number;
  } | null>(null);
  const [sentinelNode, setSentinelNode] = React.useState<HTMLDivElement | null>(null);
  const feedDemandRef = React.useRef({
    feedReady: feedTotal !== null,
    feedHasMore,
    feedLoading,
    filteredStoryCount: 0,
    onRequestNextFeedPage,
    visibleCount: initialLifestyleRiverCardCount,
  });
  const previousActiveFilterRef = React.useRef<string | null>(null);
  const appliedOnboardingResultRef = React.useRef<HearstOnboardingResult | null>(null);
  const resolvedCommentsByStoryId = account?.commentsByStoryId ?? commentsByStoryId;
  const safeReaderReturnHref = React.useMemo(() => normalizeReaderReturnHref(readerReturnHref), [readerReturnHref]);
  const pageHeading = isSectionsHomepage
    ? `${initialBrandName ?? "Hearst+"} editorial sections`
    : getLifestyleRiverPageHeading(config, initialBrandSlug);
  const currentPageReturnHref = React.useMemo(() => {
    if (!pathname || pathname.startsWith("/read/")) return null;

    const query = searchParams?.toString();
    return normalizeReaderReturnHref(`${pathname}${query ? `?${query}` : ""}`);
  }, [pathname, searchParams]);
  const currentReaderReturnHref = safeReaderReturnHref ?? (initialBrandSlug ? getHearstBrandRoute(initialBrandSlug) : getHearstDestinationRoute(destination));
  // Prefer the page the reader is on now (it tracks tab changes such as
  // For You → Style); fall back to the original return href inside /read/.
  const storyOpenReturnHref = currentPageReturnHref ?? safeReaderReturnHref ?? currentReaderReturnHref;
  const snapshotReaderReturnStoryId = readReaderReturnScrollSnapshot(currentReaderReturnHref)?.storyId ?? null;
  const preferredReaderRiverStoryId = readerReturnAnchorStoryId ?? snapshotReaderReturnStoryId;
  const rememberSessionContinueReadingStory = React.useCallback((storyId: string) => {
    setSessionContinueReadingState((current) => {
      if (current.scopeKey !== visitScopeKey || current.storyIds.includes(storyId)) return current;

      const storyIds = [storyId, ...current.storyIds];
      writeSessionContinueReadingStoryIds(visitScopeKey, editionDate, storyIds);
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

  const rememberReaderRiverReturnContext = React.useCallback((storyId: string) => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const riverCards = Array.from(
      document.querySelectorAll<HTMLElement>("#hearst-story-river [data-story-id]")
    );
    const storyElement = riverCards.find((element) => element.dataset.storyId === storyId);
    if (!storyElement) return;

    readerRiverReturnContextRef.current = {
      storyId,
      storyIds: riverCards
        .map((element) => element.dataset.storyId)
        .filter((candidateId): candidateId is string => Boolean(candidateId)),
      scopeKey: visibleStoryScopeKeyRef.current,
      viewportTop: storyElement.getBoundingClientRect().top,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    };
    setReaderReturnAnchorStoryId(storyId);
  }, []);

  const restoreReaderRiverReturnContext = React.useCallback((storyId: string | null) => {
    if (typeof document === "undefined" || typeof window === "undefined") return false;

    const context = readerRiverReturnContextRef.current;
    if (!context || (storyId && context.storyId !== storyId)) return false;
    // The river can reorder and images can settle after the reader closes, so
    // re-anchor on every pass instead of stopping at the first match. Each
    // pass puts the closed story back where it sat in the viewport.
    const attemptDelays = [0, 80, 200, 420, 800, 1400];

    const restore = (attemptIndex = 0) => {
      const storyElement = Array.from(
        document.querySelectorAll<HTMLElement>("#hearst-story-river [data-story-id]")
      ).find((element) => element.dataset.storyId === context.storyId);
      const isFinalAttempt = attemptIndex >= attemptDelays.length - 1;

      if (storyElement) {
        const nextScrollY = Math.max(
          0,
          window.scrollY + storyElement.getBoundingClientRect().top - context.viewportTop
        );
        if (Math.abs(nextScrollY - window.scrollY) > 1) window.scrollTo(context.scrollX, nextScrollY);
      } else if (isFinalAttempt) {
        window.scrollTo(context.scrollX, context.scrollY);
      }

      if (!isFinalAttempt) {
        window.setTimeout(() => restore(attemptIndex + 1), attemptDelays[attemptIndex + 1] - attemptDelays[attemptIndex]);
      }
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => restore());
    });
    return true;
  }, []);

  // True while the open reader owns a shallow /read/ history entry pushed by openStory.
  const readerOverlayHistoryRef = React.useRef(false);
  // Set while closeStory steps back, so the entry it lands on can never reopen a reader.
  const readerClosingViaBackRef = React.useRef(false);
  const openStoryIdRef = React.useRef(openStoryId);
  React.useEffect(() => {
    openStoryIdRef.current = openStoryId;
  }, [openStoryId]);
  React.useEffect(() => {
    // Back and Forward move between the page and its reader layer without a page load.
    const syncReaderFromHistory = (event: PopStateEvent) => {
      if (readerClosingViaBackRef.current) {
        readerClosingViaBackRef.current = false;
        return;
      }
      const match = window.location.pathname.match(/^\/read\/([^/]+)\/?$/);
      if (match && event.state?.hearstReaderOverlay) {
        readerOverlayHistoryRef.current = true;
        const storyId = event.state.hearstReaderStory ?? decodeURIComponent(match[1]);
        if (openStoryIdRef.current !== storyId) setOpenStoryId(storyId);
        return;
      }
      if (!match && openStoryIdRef.current && !initialOpenStoryId) {
        readerOverlayHistoryRef.current = false;
        setInitialCommentStoryId(null);
        setOpenStoryId(null);
      }
    };
    window.addEventListener("popstate", syncReaderFromHistory);
    return () => window.removeEventListener("popstate", syncReaderFromHistory);
  }, [initialOpenStoryId, setOpenStoryId]);

  const openStory = React.useCallback((storyId: string, options?: { openComments?: boolean }) => {
    setInitialCommentStoryId(options?.openComments ? storyId : null);
    readerReturnFocusElementRef.current = rememberContentReaderReturnFocus(
      document.activeElement,
    );
    rememberReaderRiverReturnContext(storyId);
    recordStoryOpened(storyId);
    rememberSessionContinueReadingStory(storyId);
    setOpenStoryId(storyId);

    if (storyId.startsWith("international-")) {
      return;
    }
    // Tabs change the URL with history.pushState, which usePathname does not
    // always see, so read the live location: closing must return to the tab
    // (e.g. Style) the reader opened the story from.
    const liveReturnHref = window.location.pathname.startsWith("/read/")
      ? null
      : normalizeReaderReturnHref(`${window.location.pathname}${window.location.search}`);
    const returnHref = liveReturnHref ?? storyOpenReturnHref;
    saveReaderReturnScrollSnapshot(
      storyId,
      returnHref,
      readerRiverReturnContextRef.current?.storyIds ?? displayStoryIdsRef.current
    );
    const readerHref = buildReaderStoryHref(
      storyId,
      returnHref,
      singleBrandName ? initialBrandSlug : undefined,
    );
    const readerUrl = new URL(readerHref, window.location.origin);
    if (options?.openComments) readerUrl.searchParams.set("comments", "1");
    // APP_RULES › Story routes: the reader opens as a layer over the page that is
    // already on screen. Only the address changes (a shallow history entry Next
    // syncs into usePathname), so the river is never unmounted, refetched or
    // re-sorted, and Back or Close returns to exactly where the reader left it.
    window.history.pushState(
      { ...window.history.state, hearstReaderOverlay: true, hearstReaderStory: storyId },
      "",
      `${readerUrl.pathname}${readerUrl.search}${readerUrl.hash}`,
    );
    readerOverlayHistoryRef.current = true;
  }, [initialBrandSlug, rememberReaderRiverReturnContext, rememberSessionContinueReadingStory, setOpenStoryId, singleBrandName, storyOpenReturnHref]);

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
        buildReaderStoryHref(storyId, storyOpenReturnHref, singleBrandName ? initialBrandSlug : undefined)
      );
    }
  }, [initialBrandSlug, rememberSessionContinueReadingStory, setOpenStoryId, singleBrandName, storyOpenReturnHref]);

  const closeStory = React.useCallback(() => {
    const closingStoryId = openStoryId;
    setInitialCommentStoryId(null);
    setOpenStoryId(null);
    if (readerOverlayHistoryRef.current && window.history.state?.hearstReaderOverlay) {
      // Opened as a layer: step back to the page's own entry. The page under the
      // reader never moved, so there is no scroll to restore.
      readerOverlayHistoryRef.current = false;
      readerClosingViaBackRef.current = true;
      window.history.back();
      return;
    }
    if (pathname?.startsWith("/read/")) {
      router.push(currentReaderReturnHref, { scroll: false });
      // Anchor to the story card when we know it; the saved raw scroll offset
      // is only a fallback (for example after a reload), because the river can
      // reorder on return and a raw offset would then land on other stories.
      if (!restoreReaderRiverReturnContext(closingStoryId)) {
        restoreReaderReturnScrollSnapshot(currentReaderReturnHref);
      }
    } else {
      restoreReaderRiverReturnContext(closingStoryId);
    }
  }, [currentReaderReturnHref, openStoryId, pathname, restoreReaderRiverReturnContext, router, setOpenStoryId]);

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
    return getPlayableVideoStories(videoFeedData?.stories ?? []);
  }, [videoFeedData?.stories]);
  const usingVideoTabFeed = activeFilter === "Videos" && Boolean(videoFeedData);
  const activeVideoBrandFilters = React.useMemo(() => {
    if (!usingVideoTabFeed || activeBrandFilters.length === 0) return activeBrandFilters;
    return reconcileVideoBrandFilters(activeBrandFilters, videoTabStories);
  }, [activeBrandFilters, usingVideoTabFeed, videoTabStories]);
  const effectiveBrandFilters = usingVideoTabFeed ? activeVideoBrandFilters : activeBrandFilters;
  const showAutosOemFilter = destination === "autos" && !initialBrandSlug && !usingVideoTabFeed;
  const isResearchCarsPage = destination === "autos" && activeFilter === "Research Cars" && !initialBrandSlug;
  const showAutosDealScoreCard = false;
  const autosDealScoreAd = showAutosDealScoreCard && destination === "autos" && !initialBrandSlug
    ? contextualAdsByDestination.autos.find((ad) => ad.id === "autos-cd-deal-score")
    : null;
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
    showAutosOemFilter ? activeAutosOemFilters.join(",") : "",
    isResearchCarsPage ? Object.values(researchCarFilterSelection).join(",") : "",
  ].join(":");
  React.useEffect(() => {
    visibleStoryScopeKeyRef.current = visibleStoryScopeKey;
    if (readerRiverReturnContextRef.current?.scopeKey !== visibleStoryScopeKey) {
      readerRiverReturnContextRef.current = null;
      setReaderReturnAnchorStoryId(null);
    }
  }, [visibleStoryScopeKey]);
  const [visibleStoryState, setVisibleStoryState] = React.useState({
    scopeKey: visibleStoryScopeKey,
    count: initialLifestyleRiverCardCount,
  });
  const visibleRiverCount = visibleStoryState.scopeKey === visibleStoryScopeKey
    ? visibleStoryState.count
    : initialLifestyleRiverCardCount;
  const setVisibleRiverCount = React.useCallback<React.Dispatch<React.SetStateAction<number>>>((updater) => {
    setVisibleStoryState((current) => {
      const currentCount = current.scopeKey === visibleStoryScopeKey
        ? current.count
        : initialLifestyleRiverCardCount;
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
    () => ({
      ...profile,
      // Saving is a library action, not an instruction to reorder the active river.
      savedIds: [],
      ...(usingVideoTabFeed ? { hiddenIds: [] } : {}),
    }),
    [profile, usingVideoTabFeed]
  );
  const rankedStories = React.useMemo(
    () => rankLifestyleRiver(activeStoryPool, rankingProfile, demoState, config),
    [activeStoryPool, config, demoState, rankingProfile]
  );
  const useLocalNewsMode = activeFilter === localNewsFilter && destination === "all" && !initialBrandSlug;
  const filteredStories = React.useMemo(() => {
    if (useLocalNewsMode) {
      return localNewsReaderStories;
    }

    const brandFilteredStories = effectiveBrandFilters.length > 0
      ? rankedStories.filter((story) => effectiveBrandFilters.includes(story.brand))
      : rankedStories;
    const oemFilteredStories = showAutosOemFilter && activeAutosOemFilters.length > 0
      ? brandFilteredStories.filter((story) =>
          getAutosOemMatchesForStory(story).some((make) => activeAutosOemFilters.includes(make))
        )
      : brandFilteredStories;

    if (activeFilter === "Saved") {
      return oemFilteredStories.filter((story) => profile.savedIds.includes(story.id));
    }

    if (usingVideoTabFeed) {
      return oemFilteredStories;
    }

    const contextStories = oemFilteredStories.filter((story) => {
      if (!storyMatchesLifestyleFilter(story, activeFilter)) return false;
      if (!isResearchCarsPage) return true;
      const facet = getResearchCarFacet(story);
      if (researchCarFilterSelection.bodyStyle && facet.bodyStyle !== researchCarFilterSelection.bodyStyle) return false;
      if (researchCarFilterSelection.make && facet.make !== researchCarFilterSelection.make) return false;
      if (researchCarFilterSelection.powertrain && !facet.powertrains.includes(researchCarFilterSelection.powertrain as "Gas" | "Hybrid" | "Electric")) return false;
      if (researchCarFilterSelection.rating && (facet.rating ?? 0) < Number.parseFloat(researchCarFilterSelection.rating)) return false;
      if (researchCarFilterSelection.price) {
        if (facet.startingMsrp === undefined) return false;
        if (researchCarFilterSelection.price === "Under $35,000" && facet.startingMsrp >= 35000) return false;
        if (researchCarFilterSelection.price === "$35,000–$50,000" && (facet.startingMsrp < 35000 || facet.startingMsrp >= 50000)) return false;
        if (researchCarFilterSelection.price === "$50,000 and up" && facet.startingMsrp < 50000) return false;
      }
      return true;
    });
    return config.liveFeedMode === "blend"
      ? applyContextualFeedCadence(contextStories)
      : contextStories;
  }, [
    activeAutosOemFilters,
    activeFilter,
    config.liveFeedMode,
    effectiveBrandFilters,
    isResearchCarsPage,
    localNewsReaderStories,
    profile.savedIds,
    rankedStories,
    researchCarFilterSelection,
    showAutosOemFilter,
    useLocalNewsMode,
    usingVideoTabFeed,
  ]);
  const savedStoryInventory = React.useMemo(() => {
    const storiesById = new Map(
      baseDestinationConfigs.all.stories.map((story) => [story.id, story]),
    );
    filteredStories.forEach((story) => storiesById.set(story.id, story));
    return Array.from(storiesById.values());
  }, [filteredStories]);
  const savedSuggestionCandidates = React.useMemo(
    () => rankedStories.filter((story) =>
      !profile.savedIds.includes(story.id)
      && !profile.hiddenIds.includes(story.id)
      && (effectiveBrandFilters.length === 0 || effectiveBrandFilters.includes(story.brand))
      && (
        !showAutosOemFilter
        || activeAutosOemFilters.length === 0
        || getAutosOemMatchesForStory(story).some((make) => activeAutosOemFilters.includes(make))
      )
    ),
    [activeAutosOemFilters, effectiveBrandFilters, profile.hiddenIds, profile.savedIds, rankedStories, showAutosOemFilter]
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
  // Saved Items sidebar module: the same ranked, unsaved, non-hidden suggestions
  // as the Saved feed empty state, shown only while no saved story resolves.
  const hasResolvableSavedStories = profile.savedIds.some((id) => savedStoryInventory.some((story) => story.id === id));
  const sidebarSavedSuggestions = activeFilter === "Saved"
    ? savedSuggestionStories
    : hasResolvableSavedStories
      ? []
      : getPersonalizedLeadSliderStories(
          savedSuggestionCandidates,
          rankingProfile,
          demoState,
          config,
          3,
          config.liveFeedMode === "blend"
        );
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
      ...localNewsReaderStories,
      todayEditLocalNewsStory,
    ].filter((story) => {
      if (seenStoryIds.has(story.id)) return false;
      seenStoryIds.add(story.id);
      return true;
    });
  }, [config.stories, destination, destinationConfigs, localNewsReaderStories, videoTabStories]);
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
  const visibleStories = displayStories.slice(
    0,
    visibleRiverCount + lifestyleHeroStoryCount
  );
  const [rightRailAdRotation, setRightRailAdRotation] = React.useState(0);
  React.useEffect(() => {
    const updateAdRotation = () => {
      setRightRailAdRotation(Math.floor(window.scrollY / 2000));
    };
    updateAdRotation();
    window.addEventListener("scroll", updateAdRotation, { passive: true });
    return () => window.removeEventListener("scroll", updateAdRotation);
  }, []);
  const rightRailAd = getContextualAdForSlot({
    destination,
    slotIndex: rightRailAdRotation,
    profile,
    demoState,
    config,
    activeFilter,
    stories: visibleStories,
    excludeAdIds: ["autos-cd-deal-score"],
  })?.ad ?? null;
  const rightRailAdTopic =
    rightRailAd?.topics.find((topic) => topic.toLowerCase() === String(activeFilter).toLowerCase()) ??
    rightRailAd?.topics[0] ??
    "";
  const delishVerticalVideoStories = React.useMemo(() => {
    // Keep one portrait-only inventory for both the carousel and immersive
    // viewer. Feed refreshes may replace either source, so merge all sources
    // here and never let the two surfaces count different subsets.
    return mergeDelishPortraitStories(
      videoTabStories,
      config.stories,
      delishSupplementalStories,
    );
  }, [config.stories, delishSupplementalStories, videoTabStories]);
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
  const delishVerticalVideoIds = React.useMemo(
    () => new Set(delishVerticalVideoStories.map((story) => story.id)),
    [delishVerticalVideoStories],
  );
  const isDelishPublicationRiver = initialBrandSlug === "delish" && !usingVideoTabFeed;
  const showDelishVerticalVideoCarousel = usingVideoTabFeed
    && (effectiveBrandFilters.length === 0 || effectiveBrandFilters.includes("Delish"));
  const showDelishPublicationShorts = isDelishPublicationRiver && delishVerticalVideoStories.length > 0;
  const showDelishCommunityCard = isDelishPublicationRiver && activeFilter === "For You";
  const showDelishShortsInHearstPlusRiver = destination === "all"
    && !initialBrandSlug
    && !usingVideoTabFeed
    && activeFilter === "For You"
    && delishVerticalVideoStories.length > 0
    && (effectiveBrandFilters.length === 0 || effectiveBrandFilters.includes("Delish"));
  const todaysPickCandidates = shouldUseTodaysPicks
    ? displayStories.flatMap((story) => {
        if (!story.publishedAt) return [];
        const publishedTime = Date.parse(story.publishedAt);
        const ageInHours = (Date.now() - publishedTime) / 3_600_000;
        if (!Number.isFinite(publishedTime) || ageInHours < 0 || ageInHours > TODAYS_PICKS_FRESHNESS_WINDOW_HOURS) return [];
        return [{ ...story, age: Math.floor(ageInHours) }];
      })
    : visibleStories;
  const latestAvailablePickCandidates = shouldUseTodaysPicks && todaysPickCandidates.length === 0
    ? displayStories
      .filter((story) => Boolean(story.publishedAt) && Number.isFinite(Date.parse(story.publishedAt!)) && Date.parse(story.publishedAt!) <= Date.now())
      .sort((first, second) => Date.parse(second.publishedAt!) - Date.parse(first.publishedAt!))
    : todaysPickCandidates;
  const isShowingLatestAvailableStories = shouldUseTodaysPicks && todaysPickCandidates.length === 0 && latestAvailablePickCandidates.length > 0;
  // Keep the status available for later data-driven use, but suppress it in this prototype view.
  const showLatestAvailableStatus = false;
  const personalizedHeroStories = getPersonalizedLeadSliderStories(
    latestAvailablePickCandidates,
    rankingProfile,
    demoState,
    config,
    shouldUseTodaysPicks ? Math.max(5, latestAvailablePickCandidates.length) : 5,
    config.liveFeedMode === "blend"
  );
  const dailyEditionKey = shouldUseTodaysPicks
    ? `${editionDate}:${destination}:${isShowingLatestAvailableStories ? "latest-available" : "todays-picks"}`
    : "";
  const dailyEditionStories = useDailyEditionStories(
    dailyEditionKey,
    personalizedHeroStories,
    5
  );
  const heroStories = shouldUseTodaysPicks
    ? dailyEditionStories
    : personalizedHeroStories.slice(0, 5);
  const leadStory = (
    demoState.returnHours > 0 && demoState.previousLeadId
      ? heroStories.find((story) => story.id !== demoState.previousLeadId)
      : heroStories[0]
  ) ?? heroStories[0] ?? (shouldUseTodaysPicks ? undefined : visibleStories[0]);
  const sectionsHomepageLatest = React.useMemo(() => {
    return [...displayStories]
      .sort((first, second) => {
        const firstTime = Date.parse(first.publishedAt ?? "");
        const secondTime = Date.parse(second.publishedAt ?? "");
        return (Number.isFinite(secondTime) ? secondTime : 0) - (Number.isFinite(firstTime) ? firstTime : 0);
      })
      .slice(0, 5);
  }, [displayStories]);
  const sectionsHomepageMostPopular = React.useMemo(() => {
    const latestIds = new Set(sectionsHomepageLatest.map((story) => story.id));
    return [...filteredStories]
      .filter((story) => !latestIds.has(story.id))
      .sort((first, second) => second.popularity - first.popularity)
      .slice(0, 3);
  }, [filteredStories, sectionsHomepageLatest]);
  const editorialHomepageSections = React.useMemo(() => {
    const definitionsByDestination = {
      all: [
        { title: "Style & Beauty", terms: ["style", "beauty", "fashion", "shopping", "jewelry"] },
        { title: "Food & Home", terms: ["food", "home", "garden", "recipe", "cooking", "kitchen", "design"] },
        { title: "Cars & Reviews", terms: ["car", "auto", "vehicle", "review", "motor", "driving"] },
        { title: "Fitness & Wellness", terms: ["fitness", "wellness", "health", "training", "outdoor", "exercise"] },
        { title: "Culture & Entertainment", terms: ["culture", "celebrity", "television", "movie", "movies", "show", "series", "entertainment", "music"] },
      ],
      lifestyle: [
        { title: "Food & Recipes", terms: ["food", "recipe", "cooking", "kitchen", "meal"] },
        { title: "Home & Garden", terms: ["home", "garden", "design", "decor", "interior"] },
        { title: "Style & Beauty", terms: ["style", "beauty", "fashion", "shopping", "jewelry"] },
        { title: "Family & Relationships", terms: ["family", "parent", "relationship", "wedding", "kids"] },
        { title: "Entertainment", terms: ["entertainment", "celebrity", "television", "movie", "movies", "show", "series", "music", "actor", "actress"] },
        { title: "Wellness", terms: ["wellness", "health", "fitness", "sleep", "self-care"] },
      ],
      autos: [
        { title: "News & First Looks", terms: ["news", "first look", "reveal", "debut", "launch"] },
        { title: "Reviews & Comparisons", terms: ["review", "test", "drive", "comparison", "vs.", "tested"] },
        { title: "Research Cars", terms: ["car", "vehicle", "rating", "specs", "model", "review"] },
        { title: "EVs & Technology", terms: ["ev", "electric", "hybrid", "technology", "battery", "charging"] },
        { title: "Racing & Classics", terms: ["race", "racing", "motorsport", "classic", "hot rod", "truck"] },
      ],
      flux: [
        { title: "Style & Beauty", terms: ["style", "beauty", "fashion", "designer", "couture"] },
        { title: "Design & Interiors", terms: ["design", "interior", "home", "decor", "architecture"] },
        { title: "Culture & Society", terms: ["culture", "celebrity", "film", "television", "music", "society"] },
        { title: "Shopping", terms: ["shopping", "shop", "product", "best", "buy"] },
        { title: "Travel & Experiences", terms: ["travel", "hotel", "destination", "event", "experience"] },
      ],
      ew: [
        { title: "Fitness & Training", terms: ["fitness", "training", "workout", "exercise", "running", "cycling"] },
        { title: "Health & Wellness", terms: ["health", "wellness", "medical", "sleep", "nutrition", "mental"] },
        { title: "Gear & Technology", terms: ["gear", "tech", "technology", "product", "equipment", "device"] },
        { title: "Adventure & Outdoors", terms: ["outdoor", "adventure", "hiking", "camping", "travel", "trail"] },
        { title: "Life & Culture", terms: ["culture", "life", "celebrity", "entertainment", "family"] },
      ],
    } satisfies Record<typeof destination, { title: string; terms: string[] }[]>;
    const definitions = definitionsByDestination[destination];
    const allowedStoryDestinations: Record<string, readonly typeof destination[]> = {
      "Style & Beauty": ["lifestyle", "flux"],
      "Food & Home": ["lifestyle"],
      "Cars & Reviews": ["autos"],
      "Fitness & Wellness": ["lifestyle", "ew"],
      "Culture & Entertainment": ["lifestyle", "flux", "ew"],
    };
    const categoryForStory = (story: LifestyleRiverStory) => {
      if (destination === "all") {
        const allowed = allowedStoryDestinations;
        const storyDestination = getStoryDestinationMode(story.brandSlug);
        // Broad words such as "style", "design", and "home" occur in
        // automotive headlines. Keep those stories inside their own vertical.
        for (const definition of definitions) {
          if (!allowed[definition.title]?.includes(storyDestination)) continue;
          const text = [story.topic, story.title, story.summary, ...story.tags].join(" ").toLowerCase();
          if (definition.terms.some((term) => text.includes(term))) return definition.title;
        }
        return "More from Hearst";
      }
      const text = [story.topic, story.title, story.summary, ...story.tags].join(" ").toLowerCase();
      return definitions.find(({ terms }) => terms.some((term) => text.includes(term)))?.title
        ?? "More from Hearst";
    };
    const used = new Set([
      ...heroStories.map((story) => story.id),
      ...sectionsHomepageLatest.map((story) => story.id),
      ...sectionsHomepageMostPopular.map((story) => story.id),
    ]);
    const sections = definitions.map(({ title }) => {
      const sectionLimit = 5;
      const categorizedMatches = displayStories.filter((story) => !used.has(story.id) && categoryForStory(story) === title);
      const matches = categorizedMatches.slice(0, sectionLimit);
      matches.forEach((story) => used.add(story.id));
      return { title, stories: matches };
    }).filter((section) => section.stories.length > 0);
    const remaining = displayStories.filter((story) => !used.has(story.id));
    const remainingContext = initialBrandName
      ?? (destination === "autos" || activeFilter === "Cars" ? "Automotive"
        : activeFilter === "Style" || activeFilter === "Beauty" ? "Style & Beauty"
          : activeFilter === "Food" || activeFilter === "Home" ? "Food & Home"
            : destination === "all" ? "Hearst" : destinationPageNames[destination]);
    if (remaining.length) sections.push({ title: `More from ${remainingContext}`, stories: remaining.slice(0, 3) });
    return sections;
  }, [activeFilter, destination, destinationConfigs, displayStories, heroStories, initialBrandName, initialBrandSlug, sectionsHomepageLatest, sectionsHomepageMostPopular]);
  const sectionsHomepageVideos = videoTabStories
    .filter((story) => !initialBrandSlug || story.brandSlug === initialBrandSlug)
    .slice(0, 3);
  const blocksVideoStories = initialBrandSlug
    ? videoTabStories.filter((story) => story.brandSlug === initialBrandSlug)
    : videoTabStories;
  const contextualModuleBrandSlugs = React.useMemo(() => {
    if (initialBrandSlug) return new Set([initialBrandSlug]);

    // The combined Hearst+ destination uses the active category as editorial
    // context for modules below the river, just as section and brand routes do.
    const categorySection: Partial<Record<string, typeof destination>> = {
      Cars: "autos",
      Reviews: "autos",
      "Research Cars": "autos",
      EVs: "autos",
      Racing: "autos",
      Trucks: "autos",
      Classics: "autos",
      Style: "flux",
      Beauty: "flux",
      "Style & Beauty": "flux",
      Food: "lifestyle",
      "Food & Recipes": "lifestyle",
      Home: "lifestyle",
      "House & Garden": "lifestyle",
      Fitness: "ew",
      Wellness: "ew",
      Gear: "ew",
      Adventure: "ew",
    };
    const scopedDestination = destination === "all" ? categorySection[activeFilter] : destination;
    if (!scopedDestination) return undefined;
    return new Set(getHearstAllBrands()
      .filter((brand) => getStoryDestinationMode(brand.brandSlug) === scopedDestination)
      .map((brand) => brand.brandSlug));
  }, [activeFilter, destination, initialBrandSlug]);
  const contextualModuleHeading = initialBrandName
    ?? (destination === "autos" || ["Cars", "Reviews", "Research Cars", "EVs", "Racing", "Trucks", "Classics"].includes(activeFilter)
      ? "Automotive"
      : destination === "flux" || ["Style", "Beauty", "Style & Beauty"].includes(activeFilter)
        ? "Style & Beauty"
        : destination === "lifestyle" || ["Food", "Food & Recipes", "Home", "House & Garden"].includes(activeFilter)
          ? "Food & Home"
          : destination === "ew" || ["Fitness", "Wellness", "Gear", "Adventure"].includes(activeFilter)
            ? "Fitness & Wellness"
            : undefined);
  const sectionsHomepageEvents = React.useMemo(() => {
    const contextualEvents = hearstEvents.filter((event) =>
      !contextualModuleBrandSlugs || event.brandSlugs.some((brandSlug) => contextualModuleBrandSlugs.has(brandSlug)),
    );
    const upcoming = contextualEvents.filter((event) => event.status === "upcoming" || event.status === "live");
    return (upcoming.length ? upcoming : contextualEvents).slice(0, isBlocksHomepage ? 4 : 3);
  }, [isBlocksHomepage, contextualModuleBrandSlugs]);
  const renderEditorialBlock = (
    section: (typeof editorialHomepageSections)[number],
    key: string,
    layout: "cardRow" | "featureSidebar" | "featuredRow" = "featureSidebar",
  ) => (
    <section key={key} className="border-t border-primary pt-5" aria-label={`${section.title} stories`}>
      <div className="mx-auto min-w-0 max-w-7xl">
        <EditorialHomepageSection
          section={section}
          selectionLabel={initialBrandName ? `${initialBrandName} Selection` : "Hearst+ Selection"}
          onOpen={(story) => openStory(story.id)}
          savedIds={profile.savedIds}
          onSave={toggleSaved}
          cardGrid={layout === "cardRow"}
          featureSidebar={layout === "featureSidebar"}
          featureFirstGrid={layout === "featuredRow"}
          largeHeading={initialBrandSlug === "elle" ? "elle" : initialBrandSlug === "cosmopolitan" || enlargeBlocksSectionHeadings}
        />
      </div>
    </section>
  );
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
  const heroStoryIds = React.useMemo(
    () => new Set(heroStories.map((story) => story.id)),
    [heroStories]
  );
  const showTodayEdit = false;
  const moduleAllocation = allocateStoryModules({
    stories: displayStories,
    heroStoryIds,
    continueStoryIds: sessionContinueReadingStoryIds,
    followedBrands: profile.followedBrands,
    includeTodayEdit: showTodayEdit,
  });
  const todayEditSelection = React.useMemo(() => {
    if (!showTodayEdit || moduleAllocation.todayEdit.horoscopeStory) {
      return moduleAllocation.todayEdit;
    }

    const usedStoryIds = new Set([
      ...heroStoryIds,
      moduleAllocation.todayEdit.continueStory?.id,
      moduleAllocation.todayEdit.followedBrandStory?.id,
      moduleAllocation.todayEdit.trendingStory?.id,
    ].filter((storyId): storyId is string => Boolean(storyId)));
    const fallbackHoroscopeStory = destinationConfigs.all.stories.find((story) =>
      isHoroscopeStory(story) && !usedStoryIds.has(story.id)
    );

    return fallbackHoroscopeStory
      ? { ...moduleAllocation.todayEdit, horoscopeStory: fallbackHoroscopeStory }
      : moduleAllocation.todayEdit;
  }, [destinationConfigs.all.stories, heroStoryIds, moduleAllocation.todayEdit, showTodayEdit]);
  const todayEditLocalNewsModule = React.useMemo(() => ({
    id: "today-edit-local-news",
    label: "Local News",
    title: todayEditLocalNewsStory.title,
    href: "/hearst-plus/local-news/",
    image: todayEditLocalNewsStory.image,
  }), []);
  const todayEditEntertainmentModule = React.useMemo(() => ({
    id: "today-edit-ae-family",
    label: "A&E Family",
    title: "Storage Wars and more shows from the A&E family",
    href: "/hearst-plus/entertainment/",
    image: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/storage-wars-s16-3000x3000-primary-1x1-1.jpg?w=1180",
  }), []);
  const moduleReservedStoryIds = new Set([
    ...heroStoryIds,
    ...Object.values(todayEditSelection)
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
    !usingVideoTabFeed && activeFilter !== "Saved",
    preferredReaderRiverStoryId
  );
  const baseRiverStories = completeBaseRiverStories.slice(0, visibleRiverCount);
  const riverStories = ensureGallerySampleInRiver(
    baseRiverStories,
    displayStories,
    moduleReservedStoryIds,
    !usingVideoTabFeed && activeFilter !== "Saved",
    preferredReaderRiverStoryId
  );
  const communityRiverSeed = communityParticipationThreads[0];
  const communityRiverGroup = communityGroups.find(
    (group) => group.brandSlug === communityRiverSeed.brandSlug,
  );
  const communityRiverThread: CommunityFeedThread = {
    id: communityRiverSeed.id,
    brand: "Delish",
    brandSlug: communityRiverSeed.brandSlug,
    title: communityRiverSeed.title,
    body: communityRiverSeed.body,
    meta: `${communityRiverGroup?.name ?? "Delish"}${communityRiverGroup?.members ? ` · ${communityRiverGroup.members}` : ""}`,
    kindLabel: "Host thread",
    replies: communityRiverSeed.replies,
    helpfulBase: communityRiverSeed.replies + 14,
    author: "Delish editors",
    isHost: true,
    href: `/communities/${communityRiverSeed.brandSlug}/threads/${communityRiverSeed.id}/`,
    posterImage: "/images/delish-community-feature.png",
    posterAlt: communityRiverSeed.title,
    mediaType: communityRiverSeed.mediaType,
    videoUrl: communityRiverSeed.videoUrl,
  };
  const loadMoreVisibleStories = React.useCallback(() => {
    const demand = feedDemandRef.current;
    if (!demand.feedReady) return;

    const nextVisibleCount = Math.min(
      demand.visibleCount + progressiveRiverRevealCount,
      demand.filteredStoryCount
    );

    if (demand.visibleCount < demand.filteredStoryCount) {
      setVisibleRiverCount(nextVisibleCount);
    }

    const remainingLoadedStories = demand.filteredStoryCount - nextVisibleCount;
    if (
      (remainingLoadedStories <= progressiveRiverLoadedBuffer
        || demand.visibleCount >= demand.filteredStoryCount)
      && demand.feedHasMore
      && !demand.feedLoading
    ) {
      demand.onRequestNextFeedPage?.();
    }
  }, [setVisibleRiverCount]);

  React.useEffect(() => {
    feedDemandRef.current = {
      feedReady: feedTotal !== null,
      feedHasMore,
      feedLoading,
      filteredStoryCount: completeRiverStories.length,
      onRequestNextFeedPage,
      visibleCount: visibleRiverCount,
    };
  }, [
    completeRiverStories.length,
    feedTotal,
    feedHasMore,
    feedLoading,
    onRequestNextFeedPage,
    visibleRiverCount,
  ]);
  const candidateDelishShortsRiverInsertIndex = showDelishShortsInHearstPlusRiver
    ? getDelishShortsRiverInsertIndex(completeRiverStories)
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
  const autosOemOptions = React.useMemo<AutosOemFilterOption[]>(() => {
    if (!showAutosOemFilter) return [];

    const sourceStories = effectiveBrandFilters.length > 0
      ? rankedStories.filter((story) => effectiveBrandFilters.includes(story.brand))
      : rankedStories;
    const counts = new Map<string, number>();

    sourceStories.forEach((story) => {
      getAutosOemMatchesForStory(story).forEach((makeName) => {
        counts.set(makeName, (counts.get(makeName) ?? 0) + 1);
      });
    });

    return autosOemLogoFilters
      .map(({ name, logo }) => ({
        name,
        logo,
        count: counts.get(name) ?? 0,
      }))
      .filter((make) => make.count > 0 || activeAutosOemFilters.includes(make.name))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
      .slice(0, 12);
  }, [activeAutosOemFilters, effectiveBrandFilters, rankedStories, showAutosOemFilter]);
  const researchCarMakes = React.useMemo(() => Array.from(new Set(
    rankedStories
      .filter((story) => storyMatchesLifestyleFilter(story, "Research Cars"))
      .map((story) => getResearchCarFacet(story).make)
      .filter(Boolean),
  )).sort((left, right) => left.localeCompare(right)), [rankedStories]);

  React.useEffect(() => {
    if (usingVideoTabFeed) return;
    const selectedBrand = effectiveBrandFilters.length === 1
      ? sidebarBrands.find((brand) => brand.name === effectiveBrandFilters[0]) ?? null
      : null;
    if (initialBrandSlug && !selectedBrand) return;
    onSelectedBrandChange?.(selectedBrand ? { name: selectedBrand.name, slug: selectedBrand.slug } : null);
  }, [effectiveBrandFilters, initialBrandSlug, onSelectedBrandChange, sidebarBrands, usingVideoTabFeed]);

  React.useEffect(() => {
    if (!onboardingResult || appliedOnboardingResultRef.current === onboardingResult) return;
    appliedOnboardingResultRef.current = onboardingResult;

    updateReaderProfile((current) => applyOnboardingPreferences(current, config.stories, onboardingResult));
    restoreCurrentVisitContext();
    setActiveBrandFilters([]);
    setActiveAutosOemFilters([]);
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
    // Blocks are finite editorial index pages; their trailing sentinel must not
    // demand another story batch when it enters the viewport.
    if (isBlocksHomepage) return;
    const node = sentinelNode;
    if (!node) return;

    const preloadMargin = Math.max(1200, Math.ceil(window.innerHeight * 1.75));
    let requestedForCurrentRender = false;
    const isWithinPreloadZone = () => {
      const bounds = node.getBoundingClientRect();
      return bounds.top <= window.innerHeight + preloadMargin
        && bounds.bottom >= -preloadMargin;
    };
    const requestMoreStories = () => {
      if (requestedForCurrentRender || !isWithinPreloadZone()) return;
      requestedForCurrentRender = true;
      loadMoreVisibleStories();
    };
    const checkPreloadZone = () => {
      requestMoreStories();
    };
    const preloadCheckFrame = window.requestAnimationFrame(checkPreloadZone);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) requestMoreStories();
      },
      { rootMargin: `${preloadMargin}px 0px` }
    );

    observer.observe(node);
    window.addEventListener("scroll", requestMoreStories, { passive: true });
    window.addEventListener("resize", requestMoreStories);
    return () => {
      window.cancelAnimationFrame(preloadCheckFrame);
      observer.disconnect();
      window.removeEventListener("scroll", requestMoreStories);
      window.removeEventListener("resize", requestMoreStories);
    };
  }, [
    displayOrderScopeKey,
    displayStories.length,
    isBlocksHomepage,
    feedTotal,
    feedHasMore,
    feedLoading,
    loadMoreVisibleStories,
    sentinelNode,
    visibleRiverCount,
  ]);

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
      };
    }, story);
    if (!saved && !account) onGuestSavePrompt?.();
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
        ? current.filter((item) => item !== brandName)
        : [...current, brandName]
    );
    anchorBrandToTop();
  };

  const toggleJoinedBrandGroup = (brandName: string) => {
    setJoinedBrandGroups((current) =>
      current.includes(brandName)
        ? current.filter((item) => item !== brandName)
        : [...current, brandName]
    );
  };

  const clearBrandFilters = () => {
    setActiveBrandFilters([]);
    anchorBrandToTop();
  };
  const toggleAutosOemFilter = (makeName: string) => {
    setActiveAutosOemFilters((current) =>
      current.includes(makeName)
        ? current.filter((item) => item !== makeName)
        : [...current, makeName]
    );
    anchorBrandToTop();
  };

  const clearAutosOemFilters = () => {
    setActiveAutosOemFilters([]);
    anchorBrandToTop();
  };

  const researchCarsSidebarFilters: ResearchCarFilters | undefined = isResearchCarsPage ? {
    ...researchCarFilterSelection,
    makes: researchCarMakes,
    resultCount: filteredStories.length,
    pricedVehicleCount: rankedStories.filter((story) =>
      storyMatchesLifestyleFilter(story, "Research Cars")
      && getResearchCarFacet(story).startingMsrp !== undefined
    ).length,
    onChange: (key, value) => setResearchCarFilterSelection((current) => ({ ...current, [key]: value })),
    onClear: () => setResearchCarFilterSelection({ bodyStyle: "", make: "", price: "", powertrain: "", rating: "" }),
  } : undefined;

  const browseForYou = () => {
    trackProductEvent("saved_browse_for_you", { destination });
    setActiveBrandFilters([]);
    setActiveAutosOemFilters([]);
    onFilterChange?.("For You");
  };
  const openSavedSuggestion = (story: LifestyleRiverStory, context?: { suggestionPosition?: number }) => {
    if (context?.suggestionPosition) {
      trackProductEvent("saved_suggestion_open", { destination, story_id: story.id, position: context.suggestionPosition });
    }
    openStory(story.id);
  };
  const saveSavedSuggestion = (story: LifestyleRiverStory, position: number) => {
    trackProductEvent("saved_suggestion_save", { destination, story_id: story.id, position });
    toggleSaved(story);
  };
  const savedItemsBrowseForYou = activeFilter === "For You" && effectiveBrandFilters.length === 0 ? undefined : browseForYou;

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
  const videoQueue = React.useMemo(
    () => isVideoQueueView
      ? buildVideoDestinationQueue(visibleStories, delishVerticalVideoIds)
      : buildVideoDestinationQueue([], delishVerticalVideoIds),
    [delishVerticalVideoIds, isVideoQueueView, visibleStories],
  );
  const featuredVideo = videoQueue.featuredVideo ?? leadStory;
  const remainingVideoStories = videoQueue.remainingVideoStories;
  const trendingVideoStories = videoQueue.trendingVideoStories;
  // Scoped exception: the Videos tab uses the dark video-index treatment inside otherwise light destinations.
  // The exact production palette lives in component tokens and is applied only to this wrapper.
  const videoDarkModeThemeClasses =
    "hearst-plus-theme hearst-plus-video-theme bg-[var(--hp-background)] text-[var(--hp-text-primary)]";

  if (useLocalNewsMode) {
    return (
      <div className="space-y-8">
        <HearstTVLocalNewsRiver
          onOpenStory={openStory}
          onStoriesChange={setLocalNewsReaderStories}
        />

        {openStoryId ? (
          <LifestyleStoryReaderModal
            key={storyOpenReturnHref}
            stories={filteredStories}
            availableStories={availableReaderStories}
            savedStoryInventory={savedStoryInventory}
            openStoryId={openStoryId}
            initialCommentStoryId={initialCommentStoryId}
            savedIds={profile.savedIds}
            followedBrands={profile.followedBrands}
            commentsByStoryId={resolvedCommentsByStoryId}
            readerReturnHref={storyOpenReturnHref}
            singleBrandSlug={singleBrandName ? initialBrandSlug : undefined}
            initialLiveArticle={openStoryId === initialOpenStoryId ? initialLiveArticle : undefined}
            returnFocusElementRef={readerReturnFocusElementRef}
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
      </div>
    );
  }

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
            "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-[var(--layout-gap)] gap-y-6 lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]",
            !usingVideoTabFeed && "mt-6 sm:mt-8"
          )}
        >
          <LifestyleDiscoverySidebar
            profile={profile}
            topStories={filteredStories}
            savedStories={savedStoryInventory}
            savedSuggestions={sidebarSavedSuggestions}
            onSaveSuggestion={saveSavedSuggestion}
            onBrowseForYou={savedItemsBrowseForYou}
            topics={sidebarTopics}
            brands={sidebarBrands}
            communityBrandSlug={initialBrandSlug === "elle" ? "elle" : undefined}
            brandFilterTitle={usingVideoTabFeed ? "Videos by brand" : undefined}
            brandFilterFirst={usingVideoTabFeed}
            showBrandCounts={!usingVideoTabFeed}
            activeBrandFilters={usingVideoTabFeed ? effectiveBrandFilters : joinedBrandGroups}
            autosOemOptions={autosOemOptions}
            activeAutosOemFilters={activeAutosOemFilters}
            collectionLabels={config.collectionLabels}
            onToggleBrandFilter={usingVideoTabFeed ? toggleBrandFilter : toggleJoinedBrandGroup}
            onToggleAutosOemFilter={showAutosOemFilter ? toggleAutosOemFilter : undefined}
            onClearAutosOemFilters={showAutosOemFilter ? clearAutosOemFilters : undefined}
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
                  onOpen={() => openStory(featuredVideo.id)}
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
                      onOpen={() => openStory(story.id)}
                      variant="videoIndex"
                    />
                  ))}
                </div>

                <div
                  ref={setSentinelNode}
                  className="flex justify-center py-6"
                  data-story-river-sentinel
                  aria-live="polite"
                >
                  <ProgressiveFeedSentinelStatus
                    error={feedError}
                    hasLoadedStories={visibleRiverCount < completeRiverStories.length}
                    hasMore={feedHasMore}
                    isLoading={feedLoading}
                    noun="videos"
                    onRetry={onRequestNextFeedPage}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-card border border-border bg-[var(--hp-surface-low)] p-8 text-center shadow-[var(--hp-shadow-card)]">
                <p className="text-2xl font-black">No videos in {activeFilter} yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clear a brand filter or switch back to For You to keep watching.
                </p>
              </div>
            )}
          </main>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <TrendingVideoRail
              stories={trendingVideoStories}
              onOpenStory={(story) => openStory(story.id)}
            />

            {showStakeholderTools ? (
              <>
                <div className="rounded-card border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
                  <p className="type-k1 text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                    Video source
                  </p>
                  <p className="mt-3 text-sm font-bold">
                    {activeStoryPool.length} playable videos
                  </p>
                  <p className="type-c1 mt-2 text-muted-foreground">
                    Pulled from {activeDataSourceCopy}
                  </p>
                </div>

                <div className="rounded-card border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
                  <p className="type-k1 text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
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
                          {activeLiveFeedStatus.isFallback ? "Cached videos" : "Catalog videos"}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          Latest story {formatLiveFeedUpdatedAt(activeLiveFeedStatus.fetchedAt)}
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
            savedStoryInventory={savedStoryInventory}
            openStoryId={openStoryId}
            initialCommentStoryId={initialCommentStoryId}
            savedIds={profile.savedIds}
            followedBrands={profile.followedBrands}
            commentsByStoryId={resolvedCommentsByStoryId}
            readerReturnHref={storyOpenReturnHref}
            singleBrandSlug={singleBrandName ? initialBrandSlug : undefined}
            initialLiveArticle={openStoryId === initialOpenStoryId ? initialLiveArticle : undefined}
            returnFocusElementRef={readerReturnFocusElementRef}
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

        <DelishShortsImmersiveViewer
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

            <StakeholderPersonalizationConsole
              open={demoModalOpen}
              onClose={() => setDemoModalOpen(false)}
              demoState={demoState}
              profile={profile}
              topStory={featuredVideo}
              topBreakdown={
                featuredVideo
                  ? getLifestyleScoreBreakdown(
                      featuredVideo,
                      profile,
                      demoState,
                      config,
                    )
                  : null
              }
              topStrategyReason={
                featuredVideo
                  ? getLifestyleStrategyReason(
                      featuredVideo,
                      getLifestyleScoreBreakdown(
                        featuredVideo,
                        profile,
                        demoState,
                        config,
                      ),
                      demoState,
                      config,
                    )
                  : null
              }
              config={config}
              activeFilter={activeFilter}
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
            >
              <LifestylePersonalizationRulesGuide />
              <LifestyleTechnologyGuide />
              <LifestyleCardModelGuide />
              <ContextualAdLogicGuide
                profile={profile}
                demoState={demoState}
                config={config}
                activeFilter={activeFilter}
                stories={visibleStories}
              />
            </StakeholderPersonalizationConsole>
          </>
        ) : null}
      </div>
    );
  }

  const FeedLayout = fullWidthFeaturedHero ? "main" : "div";
  const StoryRiver = fullWidthFeaturedHero ? "div" : "main";

  return (
    <div className="space-y-8">
      {showTodayEdit ? (
        <TodayEditStrip
          selection={todayEditSelection}
          localNewsModule={todayEditLocalNewsModule}
          entertainmentModule={todayEditEntertainmentModule}
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
      ) : null}

      <FeedLayout
        id={fullWidthFeaturedHero ? "hearst-story-river" : undefined}
        className={fullWidthFeaturedHero ? "min-w-0 scroll-mt-28" : undefined}
        aria-label={fullWidthFeaturedHero ? (isBlocksHomepage ? "Hearst+ editorial blocks" : isSectionsHomepage ? "Hearst+ editorial sections" : config.riverLabel) : undefined}
      >
      <div className={cn(
        "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-[var(--layout-gap)] gap-y-6",
        isBlocksHomepage
          ? "lg:grid-cols-1"
          : useResponsiveDestinationRails
            // Left rail joins at the rail breakpoint (240px at 1140, 300px at 1200) so the river never narrows below its two-column width.
            ? "md:grid-cols-[minmax(0,1fr)_var(--layout-rail)] rail:grid-cols-[var(--layout-rail-compact)_minmax(0,1fr)_var(--layout-rail)] rail-full:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]"
            : "lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]",
      )}>
        {fullWidthFeaturedHero && leadStory ? (
          <div className="min-w-0 lg:col-span-3">
            {showLatestAvailableStatus && isShowingLatestAvailableStories ? (
              <p className="type-b2 mb-3 border-b border-border pb-3 text-muted-foreground" role="status">
                Today’s Picks are updating. Showing the latest stories currently available.
              </p>
            ) : null}
            <FeaturedStoryCarousel
              cardColors={carouselCardColors}
              key={`full-width:${leadStory.id}:${heroStories.map((story) => story.id).join("|")}`}
              stories={heroStories}
              layoutMode={riverLayout}
              reducePhotoHeight
              scrimDirection="left-to-right"
              editionLabel={shouldUseTodaysPicks ? (isShowingLatestAvailableStories ? "Latest available" : "Today’s Picks") : undefined}
              initialStoryId={leadStory.id}
              renderImage={(story, _index, active) => (
                <LifestyleRiverImage
                  story={story}
                  className="h-full w-full transition-transform duration-250 ease-out group-hover/featured-slide:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/featured-slide:scale-100"
                  objectPosition="center top"
                  priority={active}
                />
              )}
              getCommentCount={(story) =>
                getLifestyleCommentCount(
                  story,
                  resolvedCommentsByStoryId[story.id]?.length ?? 0,
                )
              }
              isCurrentStory={isCurrentFeedStory}
              onOpenStory={(story) => openStory(story.id)}
              onOpenStoryComments={(story) => openStory(story.id, { openComments: true })}
              onFollowBrand={followBrand}
              onEditionImpression={isShowingLatestAvailableStories ? undefined : trackTodaysPicksImpression}
              onEditionStoryOpen={isShowingLatestAvailableStories ? undefined : trackTodaysPickOpen}
              indicatorPalette={indicatorPalette}
            />
          </div>
        ) : null}

        {!isBlocksHomepage ? <div className={useResponsiveDestinationRails ? "hidden rail:block" : undefined}>
        <LifestyleDiscoverySidebar
          profile={profile}
          topStories={moduleAllocation.dailyHabitStories}
          savedStories={savedStoryInventory}
          savedSuggestions={sidebarSavedSuggestions}
          onSaveSuggestion={saveSavedSuggestion}
          onBrowseForYou={savedItemsBrowseForYou}
          researchCarFilters={researchCarsSidebarFilters}
          trendingStories={initialBrandSlug
            ? moduleAllocation.trendingStories.filter((story) => story.brandSlug === initialBrandSlug)
            : moduleAllocation.trendingStories}
          trendingTitle={initialBrandSlug ? "Trending" : undefined}
          topics={sidebarTopics}
          brands={sidebarBrands}
          communityBrandSlug={initialBrandSlug === "elle" ? "elle" : undefined}
          brandFilterTitle={usingVideoTabFeed ? "Videos by brand" : undefined}
          globalInventory={Boolean(initialBrandSlug && !usingVideoTabFeed)}
          showBrandCounts={usingVideoTabFeed ? false : Boolean(initialBrandSlug && !usingVideoTabFeed)}
          activeBrandFilters={usingVideoTabFeed ? effectiveBrandFilters : joinedBrandGroups}
          autosOemOptions={autosOemOptions}
          activeAutosOemFilters={activeAutosOemFilters}
          collectionLabels={config.collectionLabels}
          onToggleBrandFilter={usingVideoTabFeed ? toggleBrandFilter : toggleJoinedBrandGroup}
          onToggleAutosOemFilter={showAutosOemFilter ? toggleAutosOemFilter : undefined}
          onClearAutosOemFilters={showAutosOemFilter ? clearAutosOemFilters : undefined}
          onFollowTopic={followTopic}
          onOpenStory={(story) => openStory(story.id)}
        />
        </div> : null}

        <StoryRiver
          id={!fullWidthFeaturedHero ? "hearst-story-river" : undefined}
          className="min-w-0 scroll-mt-28 space-y-[26px]"
          aria-label={!fullWidthFeaturedHero ? (isBlocksHomepage ? "Hearst+ editorial blocks" : isSectionsHomepage ? "Hearst+ editorial sections" : config.riverLabel) : undefined}
        >
          <h1 className="sr-only">{pageHeading}</h1>
          {showLatestAvailableStatus && isShowingLatestAvailableStories && !fullWidthFeaturedHero && !isSectionsHomepage && !isBlocksHomepage ? (
            <p className="type-b2 border-b border-border pb-3 text-muted-foreground" role="status">
              Today’s Picks are updating. Showing the latest stories currently available.
            </p>
          ) : null}
          {leadStory ? (
            <>
              {!fullWidthFeaturedHero && !isBlocksHomepage ? (
                <FeaturedStoryCarousel
                  cardColors={carouselCardColors}
                  key={`${leadStory.id}:${heroStories.map((story) => story.id).join("|")}`}
                  // The slide layout's track already reserves 24 px below the card for its shadow, so it tucks in;
                  // the list layout has no such padding and keeps the river's full 26 px gap.
                  className={riverLayout === "list" ? undefined : "mb-[-10px]"}
                  stories={heroStories}
                  layoutMode={riverLayout}
                  editionLabel={shouldUseTodaysPicks ? (isShowingLatestAvailableStories ? "Latest available" : "Today’s Picks") : undefined}
                  initialStoryId={leadStory.id}
                  renderImage={(story, _index, active) => (
                    <LifestyleRiverImage
                      story={story}
                      className="h-full w-full transition-transform duration-250 ease-out group-hover/featured-slide:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/featured-slide:scale-100"
                      priority={active}
                    />
                  )}
                  getCommentCount={(story) =>
                    getLifestyleCommentCount(
                      story,
                      resolvedCommentsByStoryId[story.id]?.length ?? 0,
                    )
                  }
                  isCurrentStory={isCurrentFeedStory}
                  onOpenStory={(story) => openStory(story.id)}
                  onOpenStoryComments={(story) => openStory(story.id, { openComments: true })}
                  onFollowBrand={followBrand}
                  onEditionImpression={isShowingLatestAvailableStories ? undefined : trackTodaysPicksImpression}
                  onEditionStoryOpen={isShowingLatestAvailableStories ? undefined : trackTodaysPickOpen}
                  indicatorPalette={indicatorPalette}
                />
              ) : null}

              {showDelishPublicationShorts ? (
                <DelishVerticalVideoCarousel
                  stories={delishVerticalVideoStories}
                  onOpen={openDelishShort}
                  onSupplementalStories={handleDelishSupplementalStories}
                  theme="light"
                />
              ) : null}

              {autosDealScoreAd ? (
                <ContextualRiverAdvertisement ad={autosDealScoreAd} />
              ) : null}

              {showDelishCommunityCard ? (
                <CommunityHomeRiverCard thread={communityRiverThread} />
              ) : null}

              {isBlocksHomepage ? (
                <div className={cn("space-y-10", initialBrandSlug === "elle" && "[&>section:not(:first-child)]:!pt-[4.5rem]")} aria-label="Hearst+ blocks layout">
                  <section aria-label={`Trending, Today’s Picks, ${contextualModuleHeading ?? "editorial selections"}, and advertising`}>
                    <div className="grid min-w-0 items-start gap-[var(--layout-gap)] lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]">
                      <div className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
                        <TrendingStoryRail
                          stories={moduleAllocation.trendingStories.filter((story) => !initialBrandSlug || story.brandSlug === initialBrandSlug).slice(0, 5)}
                          onOpenStory={(story) => openStory(story.id)}
                          title={initialBrandName ? `Trending ${initialBrandName}` : contextualModuleHeading ? `Trending in ${contextualModuleHeading}` : "Trending Across Brands"}
                        />
                        <SavedItemsModule
                          savedStories={savedStoryInventory.filter((story) => profile.savedIds.includes(story.id)).slice(0, 3)}
                          suggestions={sidebarSavedSuggestions}
                          onOpenStory={openSavedSuggestion}
                          onSaveSuggestion={saveSavedSuggestion}
                          onBrowseForYou={savedItemsBrowseForYou}
                        />
                      </div>
                      <div className="min-w-0 space-y-6">
                        <FeaturedStoryCarousel
                          cardColors={carouselCardColors}
                          key={`blocks:${leadStory.id}:${heroStories.map((story) => story.id).join("|")}`}
                          stories={heroStories}
                          layoutMode={riverLayout}
                          editionLabel={shouldUseTodaysPicks ? (isShowingLatestAvailableStories ? "Latest available" : "Today’s Picks") : undefined}
                          initialStoryId={leadStory.id}
                          renderImage={(story, _index, active) => (
                            <LifestyleRiverImage
                              story={story}
                              className="h-full w-full transition-transform duration-250 ease-out group-hover/featured-slide:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/featured-slide:scale-100"
                              priority={active}
                            />
                          )}
                          getCommentCount={(story) => getLifestyleCommentCount(story, resolvedCommentsByStoryId[story.id]?.length ?? 0)}
                          isCurrentStory={isCurrentFeedStory}
                          onOpenStory={(story) => openStory(story.id)}
                          onOpenStoryComments={(story) => openStory(story.id, { openComments: true })}
                          onFollowBrand={followBrand}
                          onEditionImpression={isShowingLatestAvailableStories ? undefined : trackTodaysPicksImpression}
                          onEditionStoryOpen={isShowingLatestAvailableStories ? undefined : trackTodaysPickOpen}
                          indicatorPalette={indicatorPalette}
                        />
                        {destination === "autos" && editorialHomepageSections.find((section) => section.title === "News & First Looks" && section.stories.length > 1) ? (
                          <EditorialHomepageSection
                            section={editorialHomepageSections.find((section) => section.title === "News & First Looks")!}
                            selectionLabel={initialBrandName ? `${initialBrandName} Selection` : "Hearst+ Selection"}
                            onOpen={(story) => openStory(story.id)}
                            savedIds={profile.savedIds}
                            onSave={toggleSaved}
                            riverWithHero
                            largeHeading={enlargeBlocksSectionHeadings}
                          />
                        ) : null}
                        {destination === "ew" && editorialHomepageSections.find((section) => section.title === "Fitness & Training" && section.stories.length > 1) ? (
                          <EditorialHomepageSection
                            section={editorialHomepageSections.find((section) => section.title === "Fitness & Training")!}
                            selectionLabel={initialBrandName ? `${initialBrandName} Selection` : "Hearst+ Selection"}
                            onOpen={(story) => openStory(story.id)}
                            savedIds={profile.savedIds}
                            onSave={toggleSaved}
                            riverWithHero
                            largeHeading={enlargeBlocksSectionHeadings}
                          />
                        ) : null}
                        {editorialHomepageSections.find((section) => section.title === "Style & Beauty") ? (
                          <EditorialHomepageSection
                            section={editorialHomepageSections.find((section) => section.title === "Style & Beauty")!}
                            selectionLabel={initialBrandName ? `${initialBrandName} Selection` : "Hearst+ Selection"}
                            onOpen={(story) => openStory(story.id)}
                            savedIds={profile.savedIds}
                            onSave={toggleSaved}
                            riverWithHero
                            largeHeading={initialBrandSlug === "elle" ? "elle" : initialBrandSlug === "cosmopolitan" || enlargeBlocksSectionHeadings}
                          />
                        ) : null}
                      </div>
                      <div className="h-fit space-y-5 lg:sticky lg:top-24 lg:self-start">
                        <DisplayAdvertisement creative={toyotaCertifiedUsedHalfPage} />
                        <LocalNewsRail />
                      </div>
                    </div>
                  </section>

                  {initialBrandSlug === "elle" && (() => {
                    const horoscopeUrl = "https://www.elle.com/horoscopes/daily/";
                    return (
                      <section className="space-y-4 border-t border-primary pt-5" aria-labelledby="blocks-horoscopes-heading">
                        <div className="flex items-end justify-between gap-4">
                          <h2 id="blocks-horoscopes-heading" className={blocksSectionHeadingClass(initialBrandSlug)}>Horoscopes</h2>
                          <Link href={horoscopeUrl} className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Read your horoscope</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {elleDailyHoroscopes.map(({ sign, dates, href, imageUrl }) => (
                            <Link key={sign} href={href} className="group min-w-0 overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md">
                              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <Image src={imageUrl} alt={`${sign} zodiac illustration`} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
                              </div>
                              <div className="p-3 sm:p-4">
                                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{dates}</p>
                                <h3 className="type-t5 headline mt-1 font-bold group-hover:text-primary">{sign} Daily Horoscope</h3>
                                <p className="mt-2 text-sm font-semibold text-primary">Read today’s horoscope <span aria-hidden="true">→</span></p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(editorialHomepageSections.find((section) => section.title === "Food & Home")?.stories.length ?? 0) > 0 ? <section className="border-t border-primary pt-5" aria-label="Food & Home and Local News">
                    <div className="grid min-w-0 items-start gap-[var(--layout-gap)] lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]">
                      <div className="h-fit lg:sticky lg:top-24 lg:self-start">
                        <DiscoverySidebarCard title="Explore Events" summary={contextualModuleHeading ? `Upcoming ${contextualModuleHeading.toLowerCase()} experiences` : "Upcoming experiences across Hearst brands"}>
                          <div className="-mb-3 divide-y divide-border/70">
                            {sectionsHomepageEvents.slice(0, 3).map((event, index) => (
                              <Link key={event.slug} href={`/hearst-plus/events/${event.slug}/`} className="group grid min-h-16 grid-cols-[48px_minmax(0,1fr)] items-start gap-3 py-3">
                                <span className="relative block h-12 w-12 overflow-hidden rounded-[6px] border border-border bg-muted"><Image src={event.image.src} alt="" fill sizes="48px" className="object-cover" /><span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background text-[11px] font-bold text-foreground ring-1 ring-border">{index + 1}</span></span>
                                <span className="min-w-0"><span className="type-c1 line-clamp-3 block font-bold group-hover:text-primary">{event.title}</span><span className="mt-1 block text-xs text-muted-foreground">{event.dateLabel}</span></span>
                              </Link>
                            ))}
                          </div>
                          <Link href="/hearst-plus/events/" className="mt-3 inline-flex min-h-9 items-center text-sm font-bold text-primary hover:underline">Explore all events</Link>
                        </DiscoverySidebarCard>
                      </div>
                      {editorialHomepageSections.find((section) => section.title === "Food & Home") ? (
                        <EditorialHomepageSection
                          section={editorialHomepageSections.find((section) => section.title === "Food & Home")!}
                          selectionLabel={initialBrandName ? `${initialBrandName} Selection` : "Hearst+ Selection"}
                          onOpen={(story) => openStory(story.id)}
                          savedIds={profile.savedIds}
                          onSave={toggleSaved}
                          riverWithHero
                          largeHeading={enlargeBlocksSectionHeadings}
                        />
                      ) : <div />}
                      <div className="h-fit lg:sticky lg:top-24 lg:self-start">
                        <ContentReaderAdvertisement ad={rightRailAd} currentTopic={rightRailAdTopic} layout="rail" accent={featuredCardColors} />
                      </div>
                    </div>
                  </section> : null}

                  {editorialHomepageSections.find((section) => section.title === "Cars & Reviews")?.stories.length ? (
                    renderEditorialBlock(editorialHomepageSections.find((section) => section.title === "Cars & Reviews")!, "blocks-cars-reviews", "cardRow")
                  ) : null}

                  {blocksVideoStories.length ? <section className="space-y-4 border-t border-primary pt-5" aria-labelledby="blocks-videos-heading">
                    <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                      <div>
                        <h2 id="blocks-videos-heading" className={blocksSectionHeadingClass(initialBrandSlug)}>Videos</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Watch the latest videos from {initialBrandName ?? "Hearst brands"}.</p>
                      </div>
                      <Link href="/hearst-plus/videos/" className="shrink-0 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Watch all videos</Link>
                    </div>
                    {blocksVideoStories[0] ? (
                      <div className="space-y-4">
                        <VideoFeedLeadCard story={blocksVideoStories[0]} onOpen={() => openStory(blocksVideoStories[0].id)} variant="hearstPlus" eyebrowLabel="Featured video" headingLevel="h2" />
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          {blocksVideoStories.slice(1, 5).map((story) => <VideoIndexCard key={`blocks-video-${story.id}`} story={story} onOpen={() => openStory(story.id)} variant="hearstPlus" compact />)}
                        </div>
                      </div>
                    ) : null}
                  </section> : null}

                  {editorialHomepageSections.find((section) => section.title === "Fitness & Wellness") ? (
                    renderEditorialBlock(editorialHomepageSections.find((section) => section.title === "Fitness & Wellness")!, "blocks-fitness-wellness", "featureSidebar")
                  ) : null}
                  {destination === "lifestyle" && !initialBrandSlug ? editorialHomepageSections
                    .filter((section) => section.title === "Food & Recipes" || section.title === "Home & Garden" || section.title === "Family & Relationships" || section.title === "Wellness")
                    .filter((section) => section.stories.length > 0)
                    .map((section) => (
                      renderEditorialBlock(section, `blocks-${section.title}`)
                    )) : null}
                  {destination !== "all" ? editorialHomepageSections
                    .filter((section) => section.stories.length > 0)
                    .filter((section) => {
                      if (destination === "autos" && section.title === "News & First Looks") return false;
                      if (destination === "ew" && section.title === "Fitness & Training") return false;
                      if (!initialBrandSlug) return true;
                      if (section.title === "Style & Beauty") return false;
                      const sectionName = section.title.toLowerCase().replace(/[^a-z0-9]/g, "");
                      const brandFilters = getBrandContextualFilters(initialBrandSlug, destinationConfigs.all.stories, false);
                      return brandFilters.some((filter) => {
                        const filterName = filter.toLowerCase().replace(/[^a-z0-9]/g, "");
                        return sectionName.includes(filterName) || filterName.includes(sectionName);
                      });
                    })
                    .slice(0, 3)
                    .map((section) => (
                      renderEditorialBlock(
                        section,
                        `front-nav-block-${section.title}`,
                        destination === "autos" && section.title === "Reviews & Comparisons"
                          ? "cardRow"
                          : destination === "autos" && section.title === "EVs & Technology"
                            ? "featuredRow"
                            : "featureSidebar",
                      )
                    )) : null}
                  {(sectionsHomepageEvents.length > 0 || !initialBrandSlug) ? <section className="border-t border-primary pt-5" aria-label="Events, community, and advertising">
                    <div className="grid min-w-0 items-start gap-[var(--layout-gap)] lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]">
                      <div className="h-fit lg:sticky lg:top-24 lg:self-start">
                        <DiscoverySidebarCard title="Explore Events" summary={contextualModuleHeading ? `Upcoming ${contextualModuleHeading.toLowerCase()} experiences` : "Upcoming experiences across Hearst brands"}>
                          <div className="-mb-3 divide-y divide-border/70">
                            {sectionsHomepageEvents.slice(0, 3).map((event, index) => (
                              <Link key={event.slug} href={`/hearst-plus/events/${event.slug}/`} className="group grid min-h-16 grid-cols-[48px_minmax(0,1fr)] items-start gap-3 py-3">
                                <span className="relative block h-12 w-12 overflow-hidden rounded-[6px] border border-border bg-muted"><Image src={event.image.src} alt="" fill sizes="48px" className="object-cover" /><span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background text-[11px] font-bold text-foreground ring-1 ring-border">{index + 1}</span></span>
                                <span className="min-w-0"><span className="type-c1 line-clamp-3 block font-bold group-hover:text-primary">{event.title}</span><span className="mt-1 block text-xs text-muted-foreground">{event.dateLabel}</span></span>
                              </Link>
                            ))}
                          </div>
                          <Link href="/hearst-plus/events/" className="mt-3 inline-flex min-h-9 items-center text-sm font-bold text-primary hover:underline">Explore all events</Link>
                        </DiscoverySidebarCard>
                      </div>
                      <section className="min-w-0 space-y-4" aria-label={contextualModuleHeading ? `${contextualModuleHeading} Events` : "Events"}>
                        <div className="flex items-end justify-between gap-4">
                          <h2 className={blocksSectionHeadingClass(initialBrandSlug)}>{contextualModuleHeading ? `${contextualModuleHeading} Events` : "Events"}</h2>
                          <Link href={initialBrandSlug ? `/hearst-plus/events/?brand=${encodeURIComponent(initialBrandSlug)}` : "/hearst-plus/events/"} className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Explore all events</Link>
                        </div>
                        {sectionsHomepageEvents[0] ? (
                          <Link href={`/hearst-plus/events/${sectionsHomepageEvents[0].slug}/`} className="group block overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md">
                            <div className="relative aspect-[16/8] overflow-hidden bg-muted"><Image src={sectionsHomepageEvents[0].image.src} alt={sectionsHomepageEvents[0].image.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" /></div>
                            <div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{sectionsHomepageEvents[0].dateLabel}</p><h3 className="type-t3 headline mt-2 font-bold group-hover:text-primary">{sectionsHomepageEvents[0].title}</h3><p className="type-b2 mt-2 line-clamp-2 text-muted-foreground">{sectionsHomepageEvents[0].summary}</p></div>
                          </Link>
                        ) : null}
                        <div className="space-y-3">
                          {sectionsHomepageEvents.slice(1, 4).map((event) => (
                            <Link key={event.slug} href={`/hearst-plus/events/${event.slug}/`} className="group flex min-w-0 gap-4 overflow-hidden rounded-card bg-[var(--hp-surface)] p-3 shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md">
                              <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-[6px] bg-muted sm:w-36"><Image src={event.image.src} alt={event.image.alt} fill sizes="144px" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" /></div>
                              <div className="min-w-0 self-center"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{event.dateLabel}</p><h3 className="type-t3 headline mt-1 line-clamp-2 font-bold group-hover:text-primary">{event.title}</h3><p className="type-b2 mt-1 line-clamp-2 text-muted-foreground">{event.summary}</p></div>
                            </Link>
                          ))}
                        </div>
                      </section>
                      <div className="h-fit lg:sticky lg:top-24 lg:self-start"><ContentReaderAdvertisement ad={rightRailAd} currentTopic={rightRailAdTopic} layout="rail" accent={featuredCardColors} /></div>
                    </div>
                  </section> : null}
                  {communityParticipationThreads.some((post) => !contextualModuleBrandSlugs || contextualModuleBrandSlugs.has(post.brandSlug)) ? <section className="border-t border-primary pt-5" aria-label={contextualModuleHeading ? `${contextualModuleHeading} Communities` : "Communities"}>
                    <div className="grid min-w-0 items-start gap-[var(--layout-gap)] lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]">
                      <div className="h-fit lg:sticky lg:top-24 lg:self-start">
                        <CommunityJoinedGroupsCard groups={communityGroups.filter((group) => !contextualModuleBrandSlugs || contextualModuleBrandSlugs.has(group.brandSlug)).slice(0, 3).map((group) => ({
                          brand: getHearstAllBrands().find((brand) => brand.brandSlug === group.brandSlug)?.brand ?? group.brandSlug,
                          brandSlug: group.brandSlug,
                          groupSlug: group.groupSlug,
                          name: group.name,
                          members: group.members,
                        }))} />
                      </div>
                      <div className="min-w-0 space-y-4">
                        <div className="flex items-end justify-between gap-4">
                          <h2 className={blocksSectionHeadingClass(initialBrandSlug)}>{contextualModuleHeading ? `${contextualModuleHeading} Communities` : "Communities"}</h2>
                          <Link href="/communities/" className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Explore all</Link>
                        </div>
                        {(() => {
                          const communityPosts = communityParticipationThreads.filter((post) => !contextualModuleBrandSlugs || contextualModuleBrandSlugs.has(post.brandSlug)).slice(0, 4).map((post, index) => {
                            const group = communityGroups.find((item) => item.brandSlug === post.brandSlug);
                            const brand = getHearstAllBrands().find((item) => item.brandSlug === post.brandSlug)?.brand ?? post.brandSlug;
                            const brandImages = displayStories.filter((story) => story.brandSlug === post.brandSlug && story.image);
                            const postImage = brandImages[index % Math.max(brandImages.length, 1)]?.image;
                            return {
                              id: post.id,
                              brand,
                              brandSlug: post.brandSlug,
                              title: post.title,
                              body: post.body,
                              meta: `${group?.name ?? brand}${group?.members ? ` · ${group.members}` : ""}`,
                              kindLabel: post.kind === "writer" ? "Host thread" : "Reader post",
                              replies: post.replies,
                              helpfulBase: post.replies + 14,
                              author: post.author,
                              isHost: post.kind === "writer",
                              href: `/communities/${post.brandSlug}/threads/${post.id}/`,
                              posterImage: postImage,
                              mediaType: post.mediaType,
                              videoUrl: post.videoUrl,
                            } satisfies CommunityFeedThread;
                          });
                          return communityPosts.length ? (
                            <div className="space-y-3">
                              <CommunityRiverCard thread={communityPosts[0]} />
                              {communityPosts.slice(1, 4).map((post) => <CommunityRiverCard key={post.id} thread={post} />)}
                            </div>
                          ) : <p className="rounded-[8px] bg-[var(--hp-surface-low)] p-5 text-sm text-muted-foreground">Community posts will appear here.</p>;
                        })()}
                      </div>
                      <div className="h-fit lg:sticky lg:top-24 lg:self-start"><ContentReaderAdvertisement ad={rightRailAd} currentTopic={rightRailAdTopic} layout="rail" accent={featuredCardColors} /></div>
                    </div>
                  </section> : null}
                  {destination === "all" && activeFilter === "For You" && !initialBrandSlug ? <section className="border-t border-primary pt-5" aria-label="Local News">
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <h2 className={blocksSectionHeadingClass(initialBrandSlug)}>Local News</h2>
                      <Link href="/hearst-plus/local-news/" className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Explore local news</Link>
                    </div>
                    <LocalNewsRail layout="grid" />
                  </section> : null}
                  {destination === "all" && activeFilter === "For You" && !initialBrandSlug ? <section className="space-y-4 border-t border-primary pt-5" aria-labelledby="blocks-ae-videos-heading">
                    <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                      <div><h2 id="blocks-ae-videos-heading" className={blocksSectionHeadingClass(initialBrandSlug)}>A&amp;E Channel Videos</h2><p className="mt-1 text-sm text-muted-foreground">Series and stories from across the A&amp;E family.</p></div>
                      <Link href="/hearst-plus/entertainment/" className="shrink-0 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Explore A&amp;E</Link>
                    </div>
                    {aandeBrandPromotion.stories[0] ? <Link href={aandeBrandPromotion.stories[0].sourceUrl ?? "/hearst-plus/entertainment/"} className="group block overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md"><div className="relative aspect-[21/8] overflow-hidden bg-muted"><Image src={aandeBrandPromotion.stories[0].image} alt="" fill sizes="100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" /></div><div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">A&amp;E · {aandeBrandPromotion.stories[0].topic}</p><h3 className="headline mt-2 text-2xl font-bold group-hover:text-primary">{aandeBrandPromotion.stories[0].title}</h3><p className="type-b2 mt-2 text-muted-foreground">{aandeBrandPromotion.stories[0].summary}</p></div></Link> : null}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {aandeBrandPromotion.stories.map((story) => <Link key={story.id} href={story.sourceUrl ?? "/hearst-plus/entertainment/"} className="group overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md"><div className="relative aspect-video overflow-hidden bg-muted"><Image src={story.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" /></div><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">A&amp;E · {story.topic}</p><h3 className="type-t3 headline mt-2 font-bold group-hover:text-primary">{story.title}</h3><p className="type-b2 mt-2 line-clamp-2 text-muted-foreground">{story.summary}</p></div></Link>)}
                    </div>
                  </section> : null}
                </div>
              ) : isSectionsHomepage ? (
                <div className="space-y-8" aria-label={`${initialBrandName ?? "Hearst+"} editorial sections`}>
                  {editorialHomepageSections.map((section) => (
                    <section key={section.title} className="space-y-4 border-t border-primary pt-5" aria-label={section.title}>
                      <EditorialHomepageSection
                        section={section}
                        selectionLabel={initialBrandName ? `${initialBrandName} Selection` : "Hearst+ Selection"}
                        onOpen={(story) => openStory(story.id)}
                        savedIds={profile.savedIds}
                        onSave={toggleSaved}
                        featureSidebar
                      />
                    </section>
                  ))}
                  {sectionsHomepageMostPopular.length ? (
                    <section className="space-y-4 border-t border-primary pt-5" aria-label="Most Popular">
                      <h2 className="type-t4 headline font-bold">Most Popular</h2>
                      {sectionsHomepageMostPopular.length ? (
                        <div className="space-y-3">
                          <LifestyleRiverCard
                            story={sectionsHomepageMostPopular[0]}
                            onOpen={() => openStory(sectionsHomepageMostPopular[0].id)}
                            saved={profile.savedIds.includes(sectionsHomepageMostPopular[0].id)}
                            onSave={() => toggleSaved(sectionsHomepageMostPopular[0])}
                            layoutOverride="cards"
                          />
                          {sectionsHomepageMostPopular.length > 1 ? (
                            <div className="space-y-3">
                              {sectionsHomepageMostPopular.slice(1, 3).map((story) => (
                                <LifestyleRiverCard
                                  key={`popular-${story.id}`}
                                  story={story}
                                  onOpen={() => openStory(story.id)}
                                  saved={profile.savedIds.includes(story.id)}
                                  onSave={() => toggleSaved(story)}
                                  layoutOverride="list"
                                  editorialRow
                                />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                  {!isBlocksHomepage && sectionsHomepageVideos.length ? (
                    <section className="space-y-4 border-t border-primary pt-5" aria-label="Video">
                      <div className="flex items-end justify-between gap-4">
                        <h2 className="type-t4 headline font-bold">Video</h2>
                        <Link href="/hearst-plus/videos/" className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Watch all videos</Link>
                      </div>
                      <div className="grid gap-3">
                        {sectionsHomepageVideos.map((story, index) => (
                          <LifestyleRiverCard
                            key={`sections-video-${story.id}`}
                            story={story}
                            onOpen={() => openStory(story.id)}
                            saved={profile.savedIds.includes(story.id)}
                            onSave={() => toggleSaved(story)}
                            layoutOverride={index === 0 ? "cards" : "list"}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}
                  {sectionsHomepageEvents.length ? <section className="space-y-4 border-t border-primary pt-5" aria-label="Events">
                    <div className="flex items-end justify-between gap-4">
                      <h2 className="type-t4 headline font-bold">Events</h2>
                      <Link href={initialBrandSlug ? `/hearst-plus/events/?brand=${encodeURIComponent(initialBrandSlug)}` : "/hearst-plus/events/"} className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline">Explore all events</Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {sectionsHomepageEvents.map((event) => (
                        <Link
                          key={event.slug}
                          href={`/hearst-plus/events/${event.slug}/`}
                          className="group overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md"
                        >
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <Image src={event.image.src} alt={event.image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
                          </div>
                          <div className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{event.dateLabel}</p>
                            <h3 className="type-t3 headline mt-2 font-bold group-hover:text-primary">{event.title}</h3>
                            <p className="type-b2 mt-2 line-clamp-2 text-muted-foreground">{event.summary}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section> : null}
                  {feedHasMore ? (
                    <div className="flex justify-center border-t border-border pt-5">
                      <Button type="button" variant="outline" disabled={feedLoading} onClick={onRequestNextFeedPage}>
                        {feedLoading ? "Loading more stories…" : "Load more stories"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (() => {
                const usedPromotionBrandSlugs = new Set<string>();

                return riverStories.map((story, index) => {
                const storyPosition = index + heroStories.length + 1;
                // Single-brand mode shows a clean brand river — no cross-brand
                // sponsor/promo/ad modules interleaved.
                const shouldShowFeedModule = !singleBrandName && storyPosition % 5 === 0;
                const moduleSlotNumber = storyPosition / 5;
                const shouldShowBrandPromotion = shouldShowFeedModule && moduleSlotNumber % 2 === 0;
                const shouldUseAEFamilyPromotion = shouldShowBrandPromotion
                  && destination === "all"
                  && !initialBrandSlug
                  && usedPromotionBrandSlugs.size === 0;
                const brandPromotion = shouldShowBrandPromotion
                  ? shouldUseAEFamilyPromotion
                    ? aandeBrandPromotion
                    : getBrandPromotionForSlot({
                        stories: filteredStories,
                        fallbackStories: rankedStories,
                        activeFilter,
                        slotNumber: moduleSlotNumber,
                        excludedBrandSlug: initialBrandSlug,
                        excludedBrandSlugs: [...usedPromotionBrandSlugs],
                      })
                  : null;
                if (brandPromotion) usedPromotionBrandSlugs.add(brandPromotion.brandSlug);
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
                    {index === delishShortsRiverInsertIndex ? (
                      <DelishVerticalVideoCarousel
                        stories={delishVerticalVideoStories}
                        onOpen={openDelishShort}
                        onSupplementalStories={handleDelishSupplementalStories}
                        theme="light"
                      />
                    ) : null}
                    {getLifestyleCardKind(story) === "video" && riverLayout === "cards" ? (
                      <VideoIndexCard
                        story={story}
                        onOpen={() => openStory(story.id)}
                        saved={profile.savedIds.includes(story.id)}
                        onSave={() => toggleSaved(story)}
                        variant="hearstPlus"
                      />
                    ) : (
                      <LifestyleRiverCard
                        story={story}
                        onOpen={() => openStory(story.id)}
                        saved={profile.savedIds.includes(story.id)}
                        onSave={() => toggleSaved(story)}
                      />
                    )}
                    {adMatch && adMatch.ad.id !== "autos-cd-deal-score" ? (
                      <ContextualRiverAdvertisement
                        ad={adMatch.ad}
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
                });
              })()}

              {delishShortsRiverInsertIndex === riverStories.length ? (
                <DelishVerticalVideoCarousel
                  stories={delishVerticalVideoStories}
                  onOpen={openDelishShort}
                  onSupplementalStories={handleDelishSupplementalStories}
                  theme="light"
                />
              ) : null}

              <div
                ref={setSentinelNode}
                className="flex justify-center py-6"
                data-story-river-sentinel
                aria-live="polite"
              >
                <ProgressiveFeedSentinelStatus
                  error={feedError}
                  hasLoadedStories={visibleRiverCount < completeRiverStories.length}
                  hasMore={feedHasMore}
                  hideCaughtUp={isBlocksHomepage}
                  isLoading={feedLoading}
                  noun="stories"
                  onRetry={onRequestNextFeedPage}
                />
              </div>
            </>
          ) : shouldUseTodaysPicks ? (
            <section
              className="rounded-card border border-border bg-[var(--hp-surface)] p-6 shadow-[var(--hp-shadow-card)]"
              aria-live="polite"
            >
              <h2 className="text-lg font-bold">
                {personalizedHeroStories.length > 0
                  ? isShowingLatestAvailableStories ? "Preparing the latest available stories" : "Preparing today’s picks"
                  : "Stories are temporarily unavailable"}
              </h2>
              {!(personalizedHeroStories.length > 0 && isShowingLatestAvailableStories && !showLatestAvailableStatus) ? (
              <p className="type-b2 mt-2 max-w-prose text-muted-foreground">
                {personalizedHeroStories.length > 0
                  ? isShowingLatestAvailableStories
                    ? "Today’s Picks are updating. Showing the latest stories currently available."
                    : "Selecting today’s edition from stories published in the last 72 hours."
                  : "We couldn’t find a recent story with a verified publish date. Please check back shortly."}
              </p>
              ) : null}
            </section>
          ) : activeFilter === "Saved" ? (
              <section
                className="rounded-card border border-border bg-[var(--hp-surface)] p-5 shadow-[var(--hp-shadow-card)] sm:p-6"
                aria-labelledby="saved-empty-title"
              >
                <div className="max-w-xl">
                  <h2 id="saved-empty-title" className="type-t4 headline">
                    {profile.savedIds.length === 0
                      ? "Save stories to build your reading list."
                      : "No saved stories match this view."}
                  </h2>
                  <p className="type-b2 mt-2 text-muted-foreground">
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
                              <Image
                                src={story.image}
                                alt=""
                                fill
                                sizes="(min-width: 1024px) 180px, 33vw"
                                loading="lazy"
                                className="h-full w-full object-cover object-top"
                                style={{ objectPosition: "center top" }}
                                unoptimized
                              />
                            </span>
                            <span className="block p-3">
                              <span className="block text-xs font-bold text-[var(--hp-section-title)]">
                                {story.brand} · {story.topic}
                              </span>
                              <span className="type-b2 mt-1 line-clamp-3 block font-bold underline-offset-2 group-hover:underline group-focus-visible:underline">
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
            ) :
              <div className="rounded-card border border-border bg-[var(--hp-surface-low)] p-8 text-center shadow-[var(--hp-shadow-card)]">
                <p className="headline text-2xl">No stories in {activeFilter} yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clear a brand filter or switch back to For You to keep exploring.
                </p>
              </div>
          }
        </StoryRiver>

        <aside
          className={isBlocksHomepage
            ? "min-w-0"
            : cn(
                "min-w-0 space-y-5",
                useResponsiveDestinationRails
                  ? "hidden md:sticky md:top-[86px] md:block md:max-h-[calc(100dvh-110px)] md:self-start md:overflow-y-auto"
                  : "lg:sticky lg:top-[86px] lg:max-h-[calc(100dvh-110px)] lg:self-start lg:overflow-y-auto",
              )}
          aria-label={isBlocksHomepage ? "Hearst+ videos" : useResponsiveDestinationRails ? "Hearst+ discovery sidebar" : undefined}
        >
          {!isBlocksHomepage ? (
            <>
              {useResponsiveDestinationRails ? (
                <TrendingStoryRail
                  stories={initialBrandSlug
                    ? moduleAllocation.trendingStories.filter((story) => story.brandSlug === initialBrandSlug).slice(0, 3)
                    : moduleAllocation.trendingStories.slice(0, 3)}
                  onOpenStory={(story) => openStory(story.id)}
                  title={initialBrandName ? `Trending ${initialBrandName}` : contextualModuleHeading ? `Trending in ${contextualModuleHeading}` : destination === "all" ? "Trending Across Hearst" : "Trending Across Brands"}
                  className="rail:hidden"
                />
              ) : null}
              <ContentReaderAdvertisement ad={rightRailAd} currentTopic={rightRailAdTopic} layout="rail" accent={featuredCardColors} />
              {destination === "all" && !initialBrandSlug && (activeFilter === "For You" || activeFilter === localNewsFilter) ? <LocalNewsRail /> : null}
              {initialBrandSlug && initialBrandName ? (
                <BrandInstagramModule brandSlug={initialBrandSlug} brandName={initialBrandName} />
              ) : null}
              {showStakeholderTools ? (
                <>
              <div className="rounded-card border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
                <p className="type-k1 text-[var(--hp-section-title)]">
                  Story Source
                </p>
                <p className="mt-3 text-sm font-bold">
                  {feedTotal === null
                    ? "Total available pending the first catalog page"
                    : `${feedTotal.toLocaleString()} total available stories`}
                </p>
                <p className="mt-1 text-sm font-bold">
                  {filteredStories.length.toLocaleString()} currently loaded, image-ready stories
                </p>
                <p className="type-c1 mt-2 text-muted-foreground">
                  {feedLoadedCount.toLocaleString()} stories have arrived through progressive catalog pages.{" "}
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
              <div className="rounded-card border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
                <p className="type-k1 text-[var(--hp-section-title)]">
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
                        {config.liveFeedStatus.isFallback ? "Cached stories" : "RSS stories"}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Latest story {formatLiveFeedUpdatedAt(config.liveFeedStatus.fetchedAt)}
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
            </>
          ) : null}
        </aside>
      </div>
      </FeedLayout>

      {openStoryId ? (
        <LifestyleStoryReaderModal
          key={storyOpenReturnHref}
          stories={filteredStories}
          availableStories={availableReaderStories}
          savedStoryInventory={savedStoryInventory}
          openStoryId={openStoryId}
          initialCommentStoryId={initialCommentStoryId}
          savedIds={profile.savedIds}
          followedBrands={profile.followedBrands}
          commentsByStoryId={resolvedCommentsByStoryId}
          readerReturnHref={storyOpenReturnHref}
            singleBrandSlug={singleBrandName ? initialBrandSlug : undefined}
          initialLiveArticle={openStoryId === initialOpenStoryId ? initialLiveArticle : undefined}
          returnFocusElementRef={readerReturnFocusElementRef}
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

      <DelishShortsImmersiveViewer
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

          <StakeholderPersonalizationConsole
            open={demoModalOpen}
            onClose={() => setDemoModalOpen(false)}
            demoState={demoState}
            profile={profile}
            topStory={leadStory}
            topBreakdown={
              leadStory
                ? getLifestyleScoreBreakdown(
                    leadStory,
                    profile,
                    demoState,
                    config,
                  )
                : null
            }
            topStrategyReason={
              leadStory
                ? getLifestyleStrategyReason(
                    leadStory,
                    getLifestyleScoreBreakdown(
                      leadStory,
                      profile,
                      demoState,
                      config,
                    ),
                    demoState,
                    config,
                  )
                : null
            }
            config={config}
            activeFilter={activeFilter}
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
          >
            <LifestylePersonalizationRulesGuide />
            <LifestyleTechnologyGuide />
            <LifestyleCardModelGuide />
            <ContextualAdLogicGuide
              profile={profile}
              demoState={demoState}
              config={config}
              activeFilter={activeFilter}
              stories={visibleStories}
            />
          </StakeholderPersonalizationConsole>

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
              <p className="type-d2 max-w-3xl text-[var(--hp-text-ui)]">
                A continuously ranked {config.productName} feed across {config.brandSummary}
              </p>
            </div>
            <div className="rounded-card border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
              <p className="type-k1 text-primary">
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
              <p className="type-c1 mt-4 text-muted-foreground">
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
  initialLiveArticle,
  initialOpenAmbientReader,
  readerReturnHref,
  navLinksOverride,
  navLinkHrefOverrides,
  mastheadLogoOverride,
  activeDestinationOverride,
  staticDestinationData,
  globalBrandInventory,
  onboardingBrandInventory,
  forceDestinationRiver = false,
  fullWidthFeaturedHero = false,
  sectionsHomepage = false,
  blocksHomepage = false,
  singleBrandName,
  riverLoading = false,
}: HomePageTemplateProps = {}) {
  const { brand, colorMode } = useTheme();
  const { account } = useReaderAccount();
  const router = useRouter();
  const pathname = usePathname();
  const pageSearchParams = useSearchParams();
  const pageSearchQuery = pageSearchParams?.toString();
  const showStakeholderTools = pageSearchParams?.get("demo") === "1"
    || (
      typeof process !== "undefined"
      && process.env.NEXT_PUBLIC_HEARST_STAKEHOLDER_TOOLS === "true"
    );
  const continueReadingStoryIds = useContinueReadingStoryIds();
  const destinationConfigs = React.useMemo(
    () => createDestinationConfigs(staticDestinationData),
    [staticDestinationData]
  );
  const [activeLifestyleFilter, setActiveLifestyleFilter] = React.useState(initialFilter ?? "For You");
  const [showHomeBackToTop, setShowHomeBackToTop] = React.useState(false);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [delishOnboardingOpen, setDelishOnboardingOpen] = React.useState(false);
  const [motorTrendOnboardingOpen, setMotorTrendOnboardingOpen] = React.useState(false);
  const [publicationOnboardingOpen, setPublicationOnboardingOpen] = React.useState(false);
  const [onboardingResult, setOnboardingResult] = React.useState<HearstOnboardingResult | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
  const [authDialogMode, setAuthDialogMode] = React.useState<"create" | "signIn">("create");
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [saveAcrossDevicesOpen, setSaveAcrossDevicesOpen] = React.useState(false);
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
        ? colorMode === "light" ? "var(--brand-11)" : "var(--foreground)"
        : colorMode === "dark"
          ? "var(--primary)"
          : "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      "--hp-sidebar-heading": selectedBrand?.slug === "autoweek"
        ? colorMode === "light" ? "var(--brand-11)" : "var(--foreground)"
        : colorMode === "dark"
          ? "var(--primary)"
          : "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      ...(colorMode === "dark"
        ? {
            "--primary": "var(--brand-primary, var(--component-navigation-utility-content-accent))",
            "--primary-foreground": "var(--component-video-feed-action-content)",
          }
        : {}),
    }),
    [colorMode, selectedBrand?.slug, selectedBrandCssVars]
  );
  const destinationContentRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const updateVisibility = () => setShowHomeBackToTop(window.scrollY > 320);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);
  const isDestinationRiver = forceDestinationRiver || brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew";
  const isDelishOnboardingRoute = selectedBrand?.slug === "delish";
  const isMotorTrendOnboardingRoute = selectedBrand?.slug === "motortrend";
  const publicationOnboardingBrandSlug = isPublicationOnboardingBrandSlug(selectedBrand?.slug)
    ? selectedBrand.slug
    : null;
  const publicationOnboardingConfig = publicationOnboardingBrandSlug
    ? publicationOnboardingConfigs[publicationOnboardingBrandSlug]
    : null;
  const isPublicationOnboardingRoute = Boolean(publicationOnboardingBrandSlug);
  const canUseReaderAccountDialogs = isDestinationRiver
    || isDelishOnboardingRoute
    || isMotorTrendOnboardingRoute
    || isPublicationOnboardingRoute;
  const destinationMode = getDestinationMode(selectedBrand?.slug ?? initialBrandSlug ?? brand.slug);
  const delishBrandRoute = getHearstBrandRoute("delish");
  const keepDelishRoute = React.useCallback(() => {
    const targetRoute = appendStakeholderDemoMode(delishBrandRoute, showStakeholderTools);
    const currentRoute = `${window.location.pathname}${window.location.search}`;
    if (currentRoute !== targetRoute) {
      router.replace(targetRoute, { scroll: false });
    }
  }, [delishBrandRoute, router, showStakeholderTools]);
  const keepPublicationRoute = React.useCallback((brandSlug: string) => {
    const targetRoute = appendStakeholderDemoMode(getHearstBrandRoute(brandSlug), showStakeholderTools);
    const currentRoute = `${window.location.pathname}${window.location.search}`;
    if (currentRoute !== targetRoute) {
      router.replace(targetRoute, { scroll: false });
    }
  }, [router, showStakeholderTools]);
  const openPersonalization = React.useCallback(() => {
    if (account) {
      setProfileOpen(true);
      return;
    }
    if (isDelishOnboardingRoute) {
      setAuthDialogOpen(false);
      setDelishOnboardingOpen(true);
      return;
    }
    if (isMotorTrendOnboardingRoute) {
      setAuthDialogOpen(false);
      setMotorTrendOnboardingOpen(true);
      return;
    }
    if (isPublicationOnboardingRoute) {
      setAuthDialogOpen(false);
      setPublicationOnboardingOpen(true);
      return;
    }
    setOnboardingOpen(true);
  }, [
    account,
    isDelishOnboardingRoute,
    isMotorTrendOnboardingRoute,
    isPublicationOnboardingRoute,
  ]);
  const openSaveAcrossDevicesPrompt = React.useCallback(() => {
    if (!account) setSaveAcrossDevicesOpen(true);
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
        document.title = getDestinationCategoryDocumentTitle(
          destinationMode,
          getHearstDestinationCategoryDisplayLabel(destinationMode, categoryLabel),
        );
      }
    };

    window.addEventListener("popstate", syncFilterFromHistory);
    return () => window.removeEventListener("popstate", syncFilterFromHistory);
  }, [destinationMode, selectedBrand]);
  const progressiveFeedBrandSlug = selectedBrand?.slug ?? getReaderOriginBrandSlug(readerReturnHref);
  const progressiveFeedCategory = activeLifestyleFilter !== "For You"
    && activeLifestyleFilter !== "Videos"
    && activeLifestyleFilter !== "Saved"
    && activeLifestyleFilter !== localNewsFilter
    ? activeLifestyleFilter
    : undefined;
  const shouldProgressivelyLoadEditorial = activeLifestyleFilter !== "Videos"
    && activeLifestyleFilter !== "Saved"
    && activeLifestyleFilter !== localNewsFilter
    && liveFeedMode === "blend";
  const shouldProgressivelyLoadVideo = activeLifestyleFilter === "Videos"
    && Boolean(videoFeedData)
    && liveFeedMode === "blend";
  const progressiveEditorialFeed = useProgressiveFeed<LifestyleRiverStory>({
    enabled: shouldProgressivelyLoadEditorial,
    endpoint: "/api/story-feed/",
    destination: destinationMode,
    brandSlug: progressiveFeedBrandSlug,
    category: progressiveFeedCategory,
    pageSize: 32,
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
  const resolvedVideoFeedData = React.useMemo(
    () => resolveProgressiveVideoFeed(videoFeedData, progressiveVideoFeed.stories),
    [progressiveVideoFeed.stories, videoFeedData],
  );
  const rawBaseDestinationConfig = destinationConfigs[destinationMode];
  const baseDestinationConfig = React.useMemo<DestinationConfig>(() => ({
    ...rawBaseDestinationConfig,
    stories: mergeUniqueStories(rawBaseDestinationConfig.stories, progressiveEditorialStories),
  }), [progressiveEditorialStories, rawBaseDestinationConfig]);
  const hasScopedVideoFeed = React.useMemo(
    () => hasPlayableVideoStories(resolvedVideoFeedData),
    [resolvedVideoFeedData],
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
        dataSourceCopy: `${baseDestinationConfig.dataSourceCopy.replace(/\.$/, "")}, blended contextually with locally ranked stories from the validated RSS snapshot.`,
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
  const joinedBrandGroups = React.useSyncExternalStore(
    subscribeJoinedBrandGroups,
    readJoinedBrandGroups,
    getJoinedBrandGroupsServerSnapshot,
  );
  const setJoinedBrandGroups = React.useCallback<React.Dispatch<React.SetStateAction<string[]>>>((updater) => {
    const current = readJoinedBrandGroups();
    const nextGroups = normalizeJoinedBrandGroups(
      typeof updater === "function" ? updater(current) : updater,
    );
    writeJoinedBrandGroups(nextGroups);
  }, []);
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
    setJoinedBrandGroups((current) =>
      current.includes(brandName)
        ? current.filter((item) => item !== brandName)
        : [...current, brandName]
    );
    anchorPageToTop();
  }, [anchorPageToTop, setJoinedBrandGroups]);
  const handleMobileBrandClear = React.useCallback(() => {
    setJoinedBrandGroups([]);
    anchorPageToTop();
  }, [anchorPageToTop, setJoinedBrandGroups]);
  const handleMobileStoryOpen = React.useCallback((storyId: string) => {
    const currentPageHref = window.location.pathname.startsWith("/read/")
      ? null
      : `${window.location.pathname}${window.location.search}`;
    const returnHref = currentPageHref ?? readerReturnHref ?? getHearstDestinationRoute(destinationMode);
    recordStoryOpened(storyId);
    saveReaderReturnScrollSnapshot(storyId, returnHref);
    router.push(appendReaderReturnHref(storyId, returnHref), { scroll: false });
  }, [destinationMode, readerReturnHref, router]);
  const handleLifestyleFilterChange = React.useCallback((filter: string) => {
    setActiveLifestyleFilter(filter);

    if (!selectedBrand) {
      const nextPath = getHearstDestinationCategoryRoute(destinationMode, filter);
      const nextRoute = nextPath
        ? appendStakeholderDemoMode(nextPath, showStakeholderTools)
        : undefined;
      if (nextRoute && `${window.location.pathname}${window.location.search}` !== nextRoute) {
        window.history.pushState(window.history.state, "", nextRoute);
        document.title = getDestinationCategoryDocumentTitle(
          destinationMode,
          getHearstDestinationCategoryDisplayLabel(destinationMode, filter),
        );
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
  const handleLocalNewsSelect = React.useCallback(() => {
    setSelectedBrand(null);
    setActiveLifestyleFilter(localNewsFilter);
    window.requestAnimationFrame(() => {
      destinationContentRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, []);
  const useVideosDarkHeader = destinationMode === "all"
    && !selectedBrand
    && activeLifestyleFilter === "Videos";
  const useLocalNewsRiver = isDestinationRiver
    && !selectedBrand
    && activeLifestyleFilter === localNewsFilter;

  // Mirrors MainNav's banner choice: the Hearst+ home (no brand, no logo override) shows the Hearst+ banner.
  const hearstPlusHomeBanner = brand.slug === "hearst-all" && !selectedBrand && !mastheadLogoOverride;

  return (
    <DestinationConfigsContext.Provider value={destinationConfigs}>
    <div
      className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] font-brand"
      data-filter-brand={selectedBrand?.slug}
      data-destination-mode={destinationMode}
      data-mode={colorMode}
      style={homePageThemeCssVars as React.CSSProperties}
    >
      {/* Utility Bar — full width */}
      <UtilityBar
        selectedBrand={selectedBrand}
        onCreateAccount={openPersonalization}
        onOpenProfile={() => setProfileOpen(true)}
        onLocalNewsSelect={handleLocalNewsSelect}
        activeDestinationOverride={useLocalNewsRiver ? localNewsFilter : activeDestinationOverride}
        darkMode={useVideosDarkHeader}
        hideDestinationNav={Boolean(singleBrandName)}
        overBanner={hearstPlusHomeBanner}
      />

      {/* Main Nav — full width background, content constrained */}
      <MainNav
        brandSlug={brand.slug}
        activeFilter={activeLifestyleFilter}
        onFilterChange={handleLifestyleFilterChange}
        selectedBrand={selectedBrand}
        navLinksOverride={navLinksOverride}
        navLinkHrefOverrides={navLinkHrefOverrides}
        mastheadLogoOverride={mastheadLogoOverride}
        extendBannerUnderUtilityBar={hearstPlusHomeBanner}
        showRiverLayoutToggle
        includeVideos={hasScopedVideoFeed}
        darkMode={useVideosDarkHeader}
        mobileContinueStories={mobileContinueStories}
        mobileBrands={mobileBrands}
        searchStories={searchStories}
        activeBrandFilters={joinedBrandGroups}
        onMobileStoryOpen={handleMobileStoryOpen}
        onMobileBrandToggle={handleMobileBrandToggle}
        onMobileBrandClear={handleMobileBrandClear}
      />

      {isDestinationRiver && !useLocalNewsRiver && mobileContinueStories[0] ? (
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
                ? "border-white/15 bg-[var(--component-video-feed-background-default)] text-white"
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
              <span className="block type-k1 text-[var(--hp-section-title)]">
                Continue Reading
              </span>
              <span className="type-b2 mt-1 line-clamp-1 font-bold underline-offset-2 group-hover:underline group-focus-visible:underline">
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
            <div
              className="relative"
            >
              <LifestyleRiverHydrationGate
                riverLoading={riverLoading}
                activeFilter={activeLifestyleFilter}
                destination={destinationMode}
                fullWidthFeaturedHero={fullWidthFeaturedHero}
                sectionsHomepage={sectionsHomepage}
                blocksHomepage={blocksHomepage}
                destinationConfig={inventoryAwareDestinationConfig}
                videoFeedData={resolvedVideoFeedData}
                singleBrandName={singleBrandName}
                initialBrandSlug={initialBrandSlug}
                initialOpenStoryId={initialOpenStoryId}
                initialCommentStoryId={
                  initialOpenStoryId && pageSearchParams?.get("comments") === "1"
                    ? initialOpenStoryId
                    : undefined
                }
                initialLiveArticle={initialLiveArticle}
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
                joinedBrandGroups={joinedBrandGroups}
                onJoinedBrandGroupsChange={setJoinedBrandGroups}
                onGuestSavePrompt={openSaveAcrossDevicesPrompt}
                feedTotal={activeLifestyleFilter === "Videos"
                  ? progressiveVideoFeed.total
                  : progressiveEditorialFeed.total}
                feedLoadedCount={activeLifestyleFilter === "Videos"
                  ? progressiveVideoFeed.loadedCount
                  : progressiveEditorialFeed.loadedCount}
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
            </div>
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
          config={destinationConfigs[destinationMode]}
          allBrandConfig={destinationConfigs.all}
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

      {isDelishOnboardingRoute && delishOnboardingOpen ? (
        <DelishOnboardingModal
          open={delishOnboardingOpen}
          onClose={() => setDelishOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setActiveBrandFilters(["Delish"]);
            setSelectedBrand({ name: "Delish", slug: "delish" });
            setOnboardingResult(result);
            setDelishOnboardingOpen(false);
            keepDelishRoute();
          }}
          onCreateProfile={(result) => {
            setOnboardingResult(result);
            setDelishOnboardingOpen(false);
            keepDelishRoute();
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
          onSignIn={() => {
            setDelishOnboardingOpen(false);
            keepDelishRoute();
            setAuthDialogMode("signIn");
            setAuthDialogOpen(true);
          }}
        />
      ) : null}

      {isMotorTrendOnboardingRoute && motorTrendOnboardingOpen ? (
        <MotorTrendOnboardingModal
          open={motorTrendOnboardingOpen}
          onClose={() => setMotorTrendOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setOnboardingResult(result);
            setMotorTrendOnboardingOpen(false);
            anchorDestinationContent();
          }}
          onCreateProfile={(result) => {
            setOnboardingResult(result);
            setMotorTrendOnboardingOpen(false);
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
          onSignIn={() => {
            setMotorTrendOnboardingOpen(false);
            setAuthDialogMode("signIn");
            setAuthDialogOpen(true);
          }}
        />
      ) : null}

      {publicationOnboardingBrandSlug && publicationOnboardingConfig && publicationOnboardingOpen ? (
        <PublicationOnboardingModal
          key={publicationOnboardingBrandSlug}
          open={publicationOnboardingOpen}
          brandSlug={publicationOnboardingBrandSlug}
          onClose={() => setPublicationOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setActiveBrandFilters([publicationOnboardingConfig.brandName]);
            setSelectedBrand({
              name: publicationOnboardingConfig.brandName,
              slug: publicationOnboardingBrandSlug,
            });
            setOnboardingResult(result);
            setPublicationOnboardingOpen(false);
            keepPublicationRoute(publicationOnboardingBrandSlug);
          }}
          onCreateProfile={(result) => {
            setOnboardingResult(result);
            setPublicationOnboardingOpen(false);
            keepPublicationRoute(publicationOnboardingBrandSlug);
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
          onSignIn={() => {
            setPublicationOnboardingOpen(false);
            keepPublicationRoute(publicationOnboardingBrandSlug);
            setAuthDialogMode("signIn");
            setAuthDialogOpen(true);
          }}
        />
      ) : null}

      {canUseReaderAccountDialogs ? (
        <SaveAcrossDevicesDialog
          open={saveAcrossDevicesOpen}
          onClose={() => setSaveAcrossDevicesOpen(false)}
          onSignIn={() => {
            setSaveAcrossDevicesOpen(false);
            setAuthDialogMode("signIn");
            setAuthDialogOpen(true);
          }}
          onCreateProfile={() => {
            setSaveAcrossDevicesOpen(false);
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
        />
      ) : null}

      {canUseReaderAccountDialogs ? (
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

      {canUseReaderAccountDialogs ? (
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
      {showHomeBackToTop && !initialOpenStoryId ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-5 right-5 z-40 h-10 w-10 rounded-full border-border bg-background shadow-sm sm:bottom-8 sm:right-8"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : null}
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
