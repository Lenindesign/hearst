"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import {
  getHearstBrandRoute,
  getHearstDestinationCategoryDisplayLabel,
  getHearstDestinationCategoryLabel,
  getHearstDestinationCategoryRoute,
  getHearstDestinationRoute,
  hearstReaderSections,
} from "@/lib/hearst-routes";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
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
import {
  Bookmark,
  Camera,
  Check,
  ChevronRight,
  ChefHat,
  ImageIcon,
  Mail,
  Menu,
  Moon,
  Pause,
  Play,
  Plus,
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
import { useReaderAccount } from "./reader-account";
import { ReaderAuthDialog, ReaderProfileDialog } from "./reader-account-ui";
import { AdaptiveVideo } from "./adaptive-video";
import { useProgressiveFeed } from "./hearst-plus/use-progressive-feed";
import {
  LifestyleRiverLoadingState,
  ProgressiveFeedSentinelStatus,
} from "./hearst-plus/feed-states";
import { BrandSourceIcon } from "./hearst-plus/brand-source-icon";
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
  type AutosOemFilterOption,
} from "./hearst-plus/discovery-sidebar";
import {
  TrendingStoryRail,
  TrendingVideoRail,
} from "./hearst-plus/trending-rail";
import { TodayEditStrip } from "./hearst-plus/today-edit-strip";
import { FeaturedStoryCarousel } from "./hearst-plus/featured-story-carousel";
import {
  getLifestyleCardKind,
  getLifestyleImagePosition,
  getLifestyleKindLabel,
  isExplicitGalleryStory,
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
import { ContentReaderRecommendations } from "./hearst-plus/content-reader-recommendations";
import { ContentReaderContextRail } from "./hearst-plus/content-reader-context-rail";
import {
  ContentReaderAdvertisement,
  selectContentReaderAdvertisement,
  type ContextualAdUnit,
} from "./hearst-plus/content-reader-advertisement";
import { ContextualRiverAdvertisement } from "./hearst-plus/contextual-river-advertisement";
import { BrandPromotionRiverModule } from "./hearst-plus/brand-promotion-river-module";
import {
  getBrandPromotionForSlot,
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
  GoodHousekeepingOnboardingModal,
} from "./hearst-plus/good-housekeeping-onboarding-modal";
import {
  ElleOnboardingModal,
} from "./hearst-plus/elle-onboarding-modal";
import {
  isPublicationOnboardingBrandSlug,
  PublicationOnboardingModal,
  publicationOnboardingConfigs,
} from "./hearst-plus/publication-onboarding-modal";
import { StakeholderPersonalizationConsole } from "./hearst-plus/stakeholder-personalization-console";
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

function appendStakeholderDemoMode(path: string, enabled: boolean) {
  if (!enabled) return path;
  const url = new URL(path, "https://hearst.local");
  url.searchParams.set("demo", "1");
  return `${url.pathname}${url.search}${url.hash}`;
}

const DestinationConfigsContext = React.createContext(baseDestinationConfigs);

function useDestinationConfigs() {
  return React.useContext(DestinationConfigsContext);
}

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  return { ...base, footerCols: defaultFooterCols };
}

const hearstDestinationNavHrefs = new Map(
  hearstDestinationSections
    .filter((section) => section.label !== "All")
    .map((section) => [section.label, section.href])
);
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
  const [navOverflow, setNavOverflow] = React.useState({ left: false, right: false });
  const [overlayPortalTarget, setOverlayPortalTarget] = React.useState<HTMLElement | null>(null);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const mobileMenuTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const mobileMenuPanelRef = React.useRef<HTMLDivElement | null>(null);
  const mobileMenuDialogRef = React.useRef<HTMLDivElement | null>(null);
  const navScrollRef = React.useRef<HTMLDivElement | null>(null);
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
  const uncappedNavLinks = includeVideos ? insertVideosFilter(baseNavLinks) : baseNavLinks;
  const navLinks = selectedBrand?.slug === "good-housekeeping" && uncappedNavLinks.length > 7
    ? (() => {
        const visibleLinks = uncappedNavLinks.slice(0, 7);
        if (!activeFilter || visibleLinks.includes(activeFilter)) return visibleLinks;
        return [...visibleLinks.slice(0, 6), activeFilter];
      })()
    : uncappedNavLinks;
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
    ? "var(--palette-content-knockout, white)"
    : selectedBrand
    ? mastheadSlug === "motortrend" || mastheadSlug === "hot-rod" || mastheadSlug === "cosmopolitan"
      ? selectedMastheadTheme?.colors["1"]
      : shouldUseNativeLogoColor
      ? undefined
      : "var(--foreground)"
    : brand.slug === "hearst-flux" && colorMode === "dark"
      ? "var(--palette-content-knockout, white)"
      : undefined;

  const mastheadLogoBaseClasses = "mx-auto w-auto items-center justify-center leading-none [&_svg]:block [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full motion-reduce:[&_svg]:transition-none";
  const goodHousekeepingMastheadScaleClasses = mastheadSlug === "good-housekeeping"
    ? "[&_svg]:scale-[1.2] [&_svg]:origin-center"
    : "";
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
    const displayLabel = isDestinationRiver && !selectedBrand
      ? getHearstDestinationCategoryDisplayLabel(destinationMode, link)
      : link;
    const destinationHref = brand.slug === "hearst-all" ? hearstDestinationNavHrefs.get(link) : undefined;
    const publicationHref = selectedBrand?.slug === "hot-rod" && link === "Events"
      ? "/autos/hot-rod/events/"
      : undefined;
    const categoryHref = isDestinationRiver && !selectedBrand
      ? getHearstDestinationCategoryRoute(destinationMode, link)
      : undefined;
    const useDarkActiveState = darkMode || (brand.slug === "hearst-flux" && colorMode === "dark");
    const navLinkClasses = darkMode
      ? "text-[var(--component-navigation-utility-content-knockout)] hover:border-[var(--component-navigation-utility-content-accent)]/60 hover:text-[var(--component-navigation-utility-content-accent)]"
      : "text-foreground hover:border-primary/40 hover:text-primary";

    return destinationHref || publicationHref ? (
      <LinkComponent
        key={link}
        href={destinationHref ?? publicationHref}
        variant="neutral"
        underline={false}
        size="sm"
        aria-current={publicationHref && active ? "page" : undefined}
        className={cn(
          "min-h-8 min-w-max whitespace-nowrap border-b-2 border-transparent px-0.5 font-normal hover:no-underline md:min-h-0 md:min-w-0 md:pb-1",
          navLinkClasses,
          publicationHref && active && (
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
          "min-h-8 min-w-max whitespace-nowrap border-b-2 border-transparent px-0.5 font-normal hover:no-underline md:min-h-0 md:min-w-0 md:pb-1",
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
        key={link}
        type="button"
        onClick={() => onFilterChange?.(link)}
        className={cn(
          "min-h-8 min-w-max whitespace-nowrap border-b-2 border-transparent px-0.5 text-sm font-normal transition-colors md:min-h-0 md:min-w-0 md:pb-1",
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
        key={link}
        variant="neutral"
        underline={false}
        size="sm"
	        className="min-h-8 min-w-max whitespace-nowrap font-normal md:min-h-0 md:min-w-0"
      >
        {displayLabel}
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
          darkMode ? "border-white/15 border-t-[var(--component-navigation-utility-content-accent)] bg-[var(--component-video-feed-background-default)] text-[var(--component-video-feed-content-primary)]" : "border-border border-t-primary bg-background text-foreground"
        )}
      >
        <div className={cn("flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6", darkMode ? "border-white/10" : "border-border")}>
          <div>
            <h2
              id="hearst-search-title"
              className={cn(
                "text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest",
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
              "text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest",
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
  const darkHeaderIconButtonClass =
    "hearst-plus-dark-header-icon-button";

  return (
    <>
    <div className={cn("flex h-20 border-b sm:h-24", darkMode ? "border-white/10 bg-[var(--component-video-feed-background-default)] text-[var(--component-video-feed-content-primary)]" : "border-border bg-[var(--hp-surface)]")}>
      <PageContainer className="flex items-center justify-between">
        <div className="flex w-10 shrink-0 justify-start sm:w-[var(--width-sidebar-narrow)]">
          {showMobileDiscoveryMenu ? (
            <Button
              ref={mobileMenuTriggerRef}
              variant="outline"
              size="icon-sm"
              className={cn(
                "h-11 w-11 sm:hidden",
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
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-11 w-11 sm:h-7 sm:w-7",
              showMobileDiscoveryMenu && "hidden sm:inline-flex",
              useDarkHeaderIconButtons ? darkHeaderIconButtonClass : undefined
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
    <div className={cn(
      "border-b",
      darkMode ? "border-white/10 bg-[var(--component-video-feed-background-default)]" : "border-border",
      isDestinationRiver && (darkMode ? "sticky top-8 z-30 md:static" : "sticky top-8 z-30 bg-[var(--hp-surface)] md:static"),
      mastheadCompact && "md:invisible"
    )}>
      <PageContainer
        as="nav"
        aria-label={selectedBrand ? `${selectedBrand.name} sections` : `${brand.name} sections`}
	        className="relative flex items-center gap-3 py-1 md:justify-center md:py-2"
      >
        <div
          ref={navScrollRef}
          data-topic-navigation-scroll
	          className="flex min-w-0 flex-1 scroll-px-4 items-center gap-6 overflow-x-auto scrollbar-hide md:flex-none md:justify-center"
          onWheelCapture={handleNavigationWheel}
        >
          {renderNavLinks()}
        </div>
        <span
          aria-hidden="true"
          data-navigation-overflow="left"
          data-visible={navOverflow.left}
          className={cn(
            "pointer-events-none absolute bottom-2 left-4 top-2 z-10 w-6 bg-gradient-to-r to-transparent transition-opacity md:hidden motion-reduce:transition-none",
            darkMode ? "from-[var(--component-video-feed-background-default)]" : "from-[var(--hp-surface)]",
            navOverflow.left ? "opacity-100" : "opacity-0"
          )}
        />
        <span
          aria-hidden="true"
          data-navigation-overflow="right"
          data-visible={navOverflow.right}
          className={cn(
            "pointer-events-none absolute bottom-2 right-4 top-2 z-10 w-6 bg-gradient-to-l to-transparent transition-opacity md:hidden motion-reduce:transition-none",
            darkMode ? "from-[var(--component-video-feed-background-default)]" : "from-[var(--hp-surface)]",
            navOverflow.right ? "opacity-100" : "opacity-0"
          )}
        />
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
        className="flex items-center justify-center gap-6 overflow-x-auto py-2 scrollbar-hide"
        onWheelCapture={handleNavigationWheel}
      >
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

type ContextualAdTuple = readonly [
  string,
  string,
  string,
  string,
  string,
  string[],
  string[],
  string,
  string
];

const contextualAdCatalog = {
  lifestyle: [
    ["lifestyle-home-refresh", "Hearst Market", "Summer Home Refresh", "Editor-picked bedding, cookware, storage, and patio upgrades for the rooms readers are saving now.", "Shop the edit", ["Home", "Shopping"], ["decorating", "products", "summer", "home"], "Home", "https://hips.hearstapps.com/hmg-prod/images/824e435b-c480-4cba-92e3-cb4f5f72286e.jpg"],
    ["lifestyle-dinner-planner", "Delish Selects", "Tonight's Dinner Plan", "Fast mains, flexible sides, and kitchen tools matched to food and weeknight-cooking intent.", "Build dinner", ["Food", "Food Drinks", "Food News"], ["dinner ideas", "recipe", "cookout", "food"], "Food", "https://hips.hearstapps.com/hmg-prod/images/f6b3c525-576e-4b56-a6d3-350a327a4531.jpg"],
    ["lifestyle-sleep-reset", "Prevention Wellness", "Sleep Better Tonight", "Pillows, routines, and calm-down tools for readers returning to wellness content late in the day.", "See sleep picks", ["Wellness"], ["sleep", "health", "wellness"], "Wellness", "https://hips.hearstapps.com/hmg-prod/images/13cee80d-3684-44b4-b7d4-56465a4730b2.jpeg"],
    ["lifestyle-beauty-counter", "Cosmo Beauty Lab", "The 10-Minute Beauty Counter", "High-signal beauty products and routines for style, shopping, and celebrity browsing sessions.", "Open the counter", ["Style", "Shopping", "Entertainment"], ["beauty", "style", "products", "celebrity"], "Beauty", "https://hips.hearstapps.com/hmg-prod/images/body-lotion-opener-691e31beacd6b.png"],
    ["lifestyle-garden-weekend", "Country Living Finds", "Weekend Garden List", "Planters, tools, and porch pieces tuned to gardening, outdoor, and weekend-project signals.", "Plan the weekend", ["Home", "Shopping"], ["garden", "outdoor", "decorating", "weekend"], "Garden", "https://hips.hearstapps.com/hmg-prod/images/ad14fef8-09c7-421e-af6b-71e2dc6f4894.jpeg"],
    ["lifestyle-hosting-kit", "Good Housekeeping Tested", "Hosting Without the Guesswork", "Lab-informed serveware, cleaning helpers, and party tools for readers saving home-service content.", "See tested picks", ["Home", "Food", "Shopping"], ["cleaning", "products", "party", "home"], "Tested", "https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg"],
    ["lifestyle-small-space", "House Beautiful Studio", "Small-Space Fixes", "Storage, lighting, and furniture picks for apartment, room refresh, and design-intent sessions.", "Refresh a room", ["Home", "Shopping"], ["decorating", "rooms", "products", "design"], "Rooms", "https://hips.hearstapps.com/hmg-prod/images/bd62be17-e3bc-47ce-998b-df0fb3603b5b.jpeg"],
    ["lifestyle-teen-style", "Seventeen Style", "Back-to-School Style Drop", "Trend-led fashion, beauty, and dorm finds for younger style and shopping journeys.", "Shop trends", ["Style", "Shopping"], ["style", "beauty", "products", "school"], "Style", "https://hips.hearstapps.com/hmg-prod/images/03aba195-11cd-441a-914b-e56bf5cdc562.jpeg"],
    ["lifestyle-family-meal-kit", "Woman's Day Kitchen", "Family Meal Shortcut", "A practical sponsor module for meal planning, leftovers, and family dinner intent.", "Get the shortcut", ["Food", "Family"], ["dinner ideas", "family", "food", "recipe"], "Family", "https://hips.hearstapps.com/hmg-prod/images/8c75311c-1d90-4191-b4dd-cfb0577ad148.jpeg"],
    ["lifestyle-cozy-collection", "Pioneer Woman Picks", "Cozy Kitchen Collection", "Cookware, table linens, and colorful prep tools aligned with recipe and home-commerce behavior.", "Explore picks", ["Food", "Home", "Shopping"], ["cookware", "recipe", "products", "home"], "Kitchen", "https://hips.hearstapps.com/hmg-prod/images/72849786-d2ce-4cfe-8e54-2aea79b0db5c.jpeg"],
  ],
  autos: [
    ["autos-ev-home-charge", "ChargePoint", "EV Charging, Matched to Your Garage", "A contextual offer for readers comparing EVs, range, charging speed, and home setup decisions.", "Estimate charging", ["EVs", "Buying Guides"], ["evs", "electric", "buying", "reviews"], "EV", "https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-equinox-rs-awd-132-67110e2133505.jpg"],
    ["autos-tire-finder", "Michelin Garage", "Find the Right Performance Tire", "Tire and handling recommendations for readers deep in reviews, performance, and track-day content.", "Match tires", ["Reviews", "Performance", "Racing"], ["performance", "drive", "racing", "reviews"], "Grip", "https://hips.hearstapps.com/hmg-prod/images/d91a8038-0b16-435e-9cc3-e5629f2c0d81.jpeg"],
    ["autos-auction-alert", "Collector Watch", "Auction Watchlist", "Collector-car alerts aligned to classics, Bring a Trailer behavior, and save-for-later browsing.", "Track listings", ["Classics", "Auctions"], ["auction", "classic", "collector", "used"], "Bid", "https://hips.hearstapps.com/hmg-prod/images/92a52d3f-3d3c-4e38-b3bd-7f82dc8b7146.jpg"],
    ["autos-tool-chest", "Craftsman Pro", "Build the Home Garage", "Tools, lifts, storage, and detailing gear for readers acting on trucks, classics, and project-car intent.", "Open garage", ["Trucks", "Classics", "Performance"], ["truck", "classic", "gear", "engine"], "Garage", "https://hips.hearstapps.com/hmg-prod/images/f04e60d2-9db2-4c60-91ba-a037f75a8fce.jpeg"],
    ["autos-insurance", "Hagerty", "Collector Coverage Check", "Insurance guidance for readers browsing classics, auctions, and collectible performance cars.", "Check coverage", ["Classics", "Auctions", "Buying Guides"], ["classic", "collector", "auction", "buying"], "Cover", "https://hips.hearstapps.com/hmg-prod/images/4d6fd00c-2cd1-4bf1-bbba-fca826f647e6.jpg"],
    ["autos-racing-weekend", "TrackPass", "Your Racing Weekend", "Tickets, streams, and schedules for readers consuming racing news and late-night performance content.", "Plan race day", ["Racing", "Performance"], ["racing", "speed", "performance", "track"], "Race", "https://hips.hearstapps.com/hmg-prod/images/b3eae25c-4d64-4443-aa85-d92038993110.jpeg"],
    ["autos-detail-kit", "Meguiar's", "Weekend Detail Kit", "Wash, wax, ceramic, and interior care surfaced when the reader leans toward ownership utility.", "Build the kit", ["Buying Guides", "Classics", "Trucks"], ["used", "classic", "truck", "products"], "Detail", "https://hips.hearstapps.com/hmg-prod/images/35a0cc29-04f8-4da2-8884-4db6a81a1814.jpg"],
    ["autos-finance", "Auto Finance Desk", "Know Your Monthly Number", "Financing and value tools for readers comparing models, reviews, and buying-guide content.", "Estimate payment", ["Buying Guides", "Reviews"], ["buying", "reviews", "used", "evs"], "Value", "https://hips.hearstapps.com/hmg-prod/images/b259176b-4ee0-448c-9af3-d0a8c63a86af.jpg"],
    ["autos-truck-cargo", "WeatherTech", "Truck Bed and Cabin Protection", "Cargo liners, mats, and storage systems for readers signaling truck and adventure utility.", "Fit my truck", ["Trucks", "Buying Guides"], ["truck", "gear", "products", "buying"], "Truck", "https://hips.hearstapps.com/hmg-prod/images/52484e15-9a72-4b16-baf8-8470bd98f328.jpg"],
    ["autos-performance-parts", "Summit Racing", "Performance Parts Finder", "Engine, exhaust, and suspension modules for readers following horsepower and racing signals.", "Find parts", ["Performance", "Racing", "Classics"], ["performance", "engine", "horsepower", "racing"], "Parts", "https://hips.hearstapps.com/hmg-prod/images/500cbd60-b7a3-4bad-9abe-367c1ff574f8.jpg"],
  ],
  flux: [
    ["flux-designer-sale", "Luxury Edit", "The Designer Sale Watch", "A shopping module for readers browsing style, celebrity looks, and high-intent product stories.", "Watch the edit", ["Style", "Shopping"], ["style", "shopping", "fashion", "products"], "Style", "https://hips.hearstapps.com/hmg-prod/images/b2d33641-54c4-4049-bf45-dd15e0316852.jpg"],
    ["flux-beauty-wardrobe", "Beauty Counter", "Build a Summer Beauty Wardrobe", "Fragrance, skin, and makeup picks aligned to beauty and style behavior.", "Open beauty", ["Beauty", "Style"], ["beauty", "style", "shopping", "fashion"], "Beauty", "https://hips.hearstapps.com/hmg-prod/images/a52e5ed3-b530-41c3-a9e1-457d122763f8.jpg"],
    ["flux-art-weekend", "Culture Pass", "Your Culture Weekend", "Gallery openings, restaurants, performances, and bookable moments for culture-led sessions.", "Plan the weekend", ["Culture", "Events", "Travel"], ["culture", "events", "travel", "feature"], "Culture", "https://hips.hearstapps.com/hmg-prod/images/bfa63434-07db-4da1-ad7c-9ea52c6e56ee.jpeg"],
    ["flux-interior-materials", "Design Materials", "A Better Room Starts With Texture", "Furniture, lighting, and fabric recommendations for interiors and design-intent readers.", "Source the room", ["Design", "Shopping"], ["design", "home", "products", "interiors"], "Design", "https://hips.hearstapps.com/hmg-prod/images/30454208-2b0a-4ed8-91a1-537490290eaf.jpg"],
    ["flux-travel-club", "Town & Country Travel", "The Long Weekend List", "Hotels, luggage, and reservations tied to travel, culture, and luxury browsing behavior.", "See the list", ["Travel", "Culture", "Shopping"], ["travel", "culture", "shopping", "leisure"], "Travel", "https://hips.hearstapps.com/hmg-prod/images/cccaef24-76e6-4809-9500-8bb1d70824ab.jpg"],
    ["flux-watch-jewelry", "Fine Objects", "Jewelry and Watch Radar", "Luxury objects matched to celebrity, event, and shopping signals.", "View radar", ["Shopping", "Style", "Events"], ["jewelry", "shopping", "celebrity", "events"], "Objects", "https://hips.hearstapps.com/hmg-prod/images/a5eadcc3-e1d6-48d4-ad47-d42dc01a22b4.jpg"],
    ["flux-mens-style", "Esquire Shop", "Sharper Summer Dressing", "Menswear, grooming, and accessories for culture and style readers.", "Get dressed", ["Style", "Shopping"], ["style", "fashion", "shopping", "grooming"], "Menswear", "https://hips.hearstapps.com/hmg-prod/images/20eda3cc-1ce6-4365-ad78-44219f1391eb.png"],
    ["flux-garden-party", "Veranda Entertains", "Garden Party Checklist", "Outdoor furniture, tabletop, flowers, and entertaining ideas for design and events sessions.", "Host outside", ["Design", "Events"], ["design", "home", "events", "garden"], "Host", "https://hips.hearstapps.com/hmg-prod/images/9357bef4-cbb5-4634-b167-58897274f85c.jpeg"],
    ["flux-red-carpet", "Red Carpet Desk", "The Event Lookbook", "Dresses, beauty, accessories, and editor context for celebrity and event-led browsing.", "Open lookbook", ["Events", "Style", "Beauty"], ["celebrity", "events", "style", "beauty"], "Event", "https://hips.hearstapps.com/hmg-prod/images/7984ffdf-0689-4cd5-a2fc-966eb9187dba.jpeg"],
    ["flux-design-consult", "Elle Decor Studio", "Find Your Design Direction", "A high-touch design consult module for readers saving interiors and home inspiration.", "Start consult", ["Design"], ["design", "home", "interiors", "products"], "Studio", "https://hips.hearstapps.com/hmg-prod/images/d4338644-77dd-4f18-980f-e99a3f966d50.jpg"],
  ],
  ew: [
    ["ew-running-shoe", "Runner's Lab", "Find Your Next Running Shoe", "Shoe, training, and recovery recommendations for fitness and running behavior.", "Match my run", ["Fitness", "Gear"], ["fitness", "running", "gear", "training"], "Run", "https://hips.hearstapps.com/hmg-prod/images/d75dce99-2d12-45cc-ad48-8e5fabb43be2.jpg"],
    ["ew-home-gym", "Garage Gym Builder", "Build a Smarter Home Gym", "Weights, mats, benches, and programming for readers engaging with strength and gear stories.", "Plan gym", ["Fitness", "Gear"], ["fitness", "gear", "training", "products"], "Gym", "https://hips.hearstapps.com/hmg-prod/images/bass-headphones-earbuds-001-669a8ef2be058.jpg"],
    ["ew-bike-fit", "Bicycling Fit Studio", "Dial In Your Bike Fit", "Fit tools, shoes, saddles, and gear surfaced for cycling and adventure intent.", "Tune fit", ["Gear", "Adventure", "Fitness"], ["bike", "cycling", "gear", "adventure"], "Bike", "https://hips.hearstapps.com/hmg-prod/images/01074154-c6c1-4856-bca5-7ab2ea491991.jpeg"],
    ["ew-recovery-kit", "Recovery Desk", "Recovery That Fits Your Routine", "Sleep, mobility, massage, and recovery tools matched to wellness and fitness signals.", "Recover better", ["Wellness", "Fitness"], ["wellness", "recovery", "sleep", "health"], "Recover", "https://hips.hearstapps.com/hmg-prod/images/adventure-toys-for-kids-69a8a11950639.png"],
    ["ew-tech-kit", "Popular Mechanics Tested", "Gear That Solves the Problem", "Tech, tools, and tested equipment for science, mechanics, and gear browsing.", "See tested gear", ["Tech", "Gear"], ["tech", "gear", "science", "products"], "Tested", "https://hips.hearstapps.com/hmg-prod/images/amazon-tech-products-2021-1635430982.jpg"],
    ["ew-nutrition-plan", "Fuel Plan", "Nutrition for the Next Goal", "Meal, protein, hydration, and supplement signals for wellness and training readers.", "Build fuel plan", ["Nutrition", "Wellness", "Fitness"], ["nutrition", "food", "health", "training"], "Fuel", "https://hips.hearstapps.com/hmg-prod/images/f0fa3667-bbf0-40c8-b8e9-e7bd5d82876d.jpg"],
    ["ew-adventure-pack", "Trail Kit", "Weekend Adventure Pack", "Bags, shoes, layers, and safety gear for readers signaling adventure and outdoor interest.", "Pack better", ["Adventure", "Gear"], ["adventure", "gear", "outdoor", "products"], "Trail", "https://hips.hearstapps.com/hmg-prod/images/dorm-room-ideas-681a6f88db8db.jpg"],
    ["ew-health-check", "Health Navigator", "Your Next Health Check", "Screenings, routines, and practical next steps aligned with health and life content.", "Make a plan", ["Wellness", "Life"], ["health", "wellness", "life", "sleep"], "Health", "https://hips.hearstapps.com/hmg-prod/images/pedaling-daniel-wakefield-pasley-1658942201.jpg"],
    ["ew-smartwatch", "Wearable Lab", "Track What Actually Matters", "Watch, heart-rate, and recovery tools matched to tech, fitness, and training sessions.", "Compare watches", ["Tech", "Fitness", "Gear"], ["tech", "fitness", "gear", "training"], "Track", "https://hips.hearstapps.com/hmg-prod/images/b32ab90f-fef4-4582-a72f-d1a8621e1148.jpg"],
    ["ew-book-club", "Oprah Daily Life", "A Better Night Routine", "Books, journaling, sleep, and reflection picks for late-night life and wellness browsing.", "Start tonight", ["Life", "Wellness"], ["life", "sleep", "wellness", "books"], "Life", "https://hips.hearstapps.com/hmg-prod/images/ba0b950d-7abb-4544-b6df-13f3ce1d21bf.jpg"],
  ],
} satisfies Record<Exclude<DestinationMode, "all">, ContextualAdTuple[]>;

function normalizeContextualAds(units: ContextualAdTuple[]): ContextualAdUnit[] {
  return units.map(([id, sponsor, title, summary, cta, topics, tags, creativeLabel, imageUrl]) => ({
    id,
    sponsor,
    title,
    summary,
    cta,
    topics,
    tags,
    creativeLabel,
    imageUrl,
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
  saved,
  commentCount,
  onOpen,
  onSave,
  onMoreLikeThis,
  onHide,
}: {
  story: LifestyleRiverStory;
  images: FullscreenReaderImage[];
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
  const galleryPreview = useGalleryPreview(story, kind === "gallery" && isExplicitGalleryStory(story));

  if (galleryPreview.status === "ready") {
    return (
      <RichPhotoGalleryCard
        story={story}
        images={galleryPreview.images}
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

export {
  DelishVerticalVideoCarousel,
  LifestyleStoryActions,
  VerticalVideoCarousel,
};

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

function getLifestyleReaderAd(currentStory: LifestyleRiverStory, slotIndex = 0) {
  return selectContentReaderAdvertisement(
    currentStory,
    contextualAdsByDestination,
    slotIndex,
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
  openStoryId: string | null;
  savedIds: string[];
  followedBrands: string[];
  commentsByStoryId: Record<string, LifestyleStoryComment[]>;
  readerReturnHref?: string;
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
  const destinationConfigs = useDestinationConfigs();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const readerSwipeStageRef = React.useRef<HTMLDivElement | null>(null);
  const readerSwipeStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const readerSwipeLastRef = React.useRef<{ x: number; y: number } | null>(null);
  const readerSwipeLockedRef = React.useRef(false);
  const readerSwipeIntentRef = React.useRef(false);
  const readerSuppressClickRef = React.useRef(false);
  const readerSwipeWheelRef = React.useRef<{ offsetX: number; lastTime: number } | null>(
    null,
  );
  const readerSwipeWheelResetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const readerSwipeUnlockTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [readerSwipeOffset, setReaderSwipeOffset] = React.useState(0);
  const [readerSwipeDragging, setReaderSwipeDragging] = React.useState(false);
  const [readerSwipeTransitionEnabled, setReaderSwipeTransitionEnabled] =
    React.useState(true);
  const [readerDestinationOverride, setReaderDestinationOverride] = React.useState<Exclude<DestinationMode, "all"> | null>(null);
  const readerOriginBrandSlug = getReaderOriginBrandSlug(readerReturnHref);
  const [readerBrandOverrideSlug, setReaderBrandOverrideSlug] = React.useState<string | null>(null);
  const [readerFilterOverride, setReaderFilterOverride] = React.useState<string | null>(null);
  const [readerFetchedStories, setReaderFetchedStories] = React.useState<LifestyleRiverStory[]>([]);
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
  const readerLogoHref = usePublicationTheme && readerContextStory
    ? getHearstBrandRoute(readerContextStory.brandSlug)
    : getHearstDestinationRoute(readerDestination);
  const autoWeekReaderTheme = readerContextStory?.brandSlug === "autoweek" && readerDestinationTheme
    ? getSelectedBrandTheme({ name: "Autoweek", slug: "autoweek" }, readerDestinationTheme)
    : null;
  const readerThemeCssVars = readerTheme
    ? {
        ...brandToCssVars(readerTheme, readerColorMode),
        "--content-reader-article-surface": contentReaderTheme.fluxArticleSurface,
        ...(autoWeekReaderTheme
          ? { "--content-reader-active-label": autoWeekReaderTheme.colors["11"] }
          : {}),
      } as React.CSSProperties
    : undefined;
  const isReaderOpen = Boolean(openStoryId);
  const readerSectionBrands = readerDestinationConfig.sourceNotes;
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
  const readerSwipeFilterLabels = contentReaderFilterItems
    .filter((filter) => !filter.disabled)
    .map((filter) => filter.label);
  const readerSwipeFilterIndex = Math.max(
    0,
    readerSwipeFilterLabels.indexOf(readerActiveFilter),
  );
  const hasMultipleReaderSwipeFilters = readerSwipeFilterLabels.length > 1;
  const previousReaderSwipeFilter = hasMultipleReaderSwipeFilters
    ? readerSwipeFilterLabels[
        (readerSwipeFilterIndex - 1 + readerSwipeFilterLabels.length)
        % readerSwipeFilterLabels.length
      ]
    : undefined;
  const nextReaderSwipeFilter = hasMultipleReaderSwipeFilters
    ? readerSwipeFilterLabels[
        (readerSwipeFilterIndex + 1) % readerSwipeFilterLabels.length
      ]
    : undefined;
  const readerCategoryPreloadStories = [
    previousReaderSwipeFilter ? getReaderFilterStory(previousReaderSwipeFilter) : undefined,
    nextReaderSwipeFilter ? getReaderFilterStory(nextReaderSwipeFilter) : undefined,
  ].filter((story): story is LifestyleRiverStory => Boolean(story));
  const readerCategoryPreloadStoryIds = readerCategoryPreloadStories
    .map((story) => story.id)
    .join("|");
  const readerCategoryImagePreloadKey = readerCategoryPreloadStories
    .map((story) => story.image)
    .join("|");

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
    if (readerSwipeUnlockTimerRef.current) {
      clearTimeout(readerSwipeUnlockTimerRef.current);
    }
    if (readerSwipeWheelResetTimerRef.current) {
      clearTimeout(readerSwipeWheelResetTimerRef.current);
    }
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
      ...readerCategoryPreloadStories,
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
  // The keys intentionally represent the next reader stories and adjacent category heroes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStoryId, nextReaderImagePreloadKey, readerCategoryImagePreloadKey]);

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
    const storiesToLoad = [
      ...visibleReaderStories,
      ...readerCategoryPreloadStories,
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
  }, [ambientReaderPreloadStoryIds, readerCategoryPreloadStoryIds, requestLiveArticle, visibleReaderStoryIds]);

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
  const resetReaderCategorySwipe = () => {
    readerSwipeStartRef.current = null;
    readerSwipeLastRef.current = null;
    readerSwipeIntentRef.current = false;
    readerSwipeWheelRef.current = null;
    if (readerSwipeWheelResetTimerRef.current) {
      clearTimeout(readerSwipeWheelResetTimerRef.current);
      readerSwipeWheelResetTimerRef.current = null;
    }
    setReaderSwipeDragging(false);
    setReaderSwipeTransitionEnabled(true);
    setReaderSwipeOffset(0);
  };
  const unlockReaderCategorySwipe = () => {
    readerSwipeLockedRef.current = false;
    if (readerSwipeUnlockTimerRef.current) {
      clearTimeout(readerSwipeUnlockTimerRef.current);
      readerSwipeUnlockTimerRef.current = null;
    }
  };
  const commitReaderCategorySwipe = (direction: "previous" | "next") => {
    const targetFilter = direction === "next"
      ? nextReaderSwipeFilter
      : previousReaderSwipeFilter;
    const stageWidth = readerSwipeStageRef.current?.clientWidth ?? 0;

    if (!targetFilter || !stageWidth || readerSwipeLockedRef.current) {
      resetReaderCategorySwipe();
      return;
    }

    readerSwipeLockedRef.current = true;
    if (readerSwipeUnlockTimerRef.current) {
      clearTimeout(readerSwipeUnlockTimerRef.current);
    }
    readerSwipeWheelRef.current = null;
    if (readerSwipeWheelResetTimerRef.current) {
      clearTimeout(readerSwipeWheelResetTimerRef.current);
      readerSwipeWheelResetTimerRef.current = null;
    }

    const exitOffset = direction === "next" ? -stageWidth : stageWidth;
    const enterOffset = direction === "next" ? stageWidth : -stageWidth;
    setReaderSwipeDragging(false);
    setReaderSwipeTransitionEnabled(true);
    setReaderSwipeOffset(exitOffset);

    window.setTimeout(() => {
      setReaderSwipeTransitionEnabled(false);
      selectReaderFilter(targetFilter);
      setReaderSwipeOffset(enterOffset);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setReaderSwipeTransitionEnabled(true);
          setReaderSwipeOffset(0);
        });
      });
    }, 220);

    readerSwipeUnlockTimerRef.current = setTimeout(() => {
      unlockReaderCategorySwipe();
    }, 620);
  };
  const handleReaderCategoryPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || readerSwipeLockedRef.current) return;
    event.stopPropagation();
    readerSwipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
    readerSwipeLastRef.current = { x: event.clientX, y: event.clientY };
  };
  const handleReaderCategoryPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = readerSwipeStartRef.current;
    if (!start || readerSwipeLockedRef.current) return;
    event.stopPropagation();

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    readerSwipeLastRef.current = { x: event.clientX, y: event.clientY };

    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) return;
    if (Math.abs(deltaX) < 8 && !readerSwipeIntentRef.current) return;
    if (deltaX < 0 && !nextReaderSwipeFilter) return;
    if (deltaX > 0 && !previousReaderSwipeFilter) return;

    readerSwipeIntentRef.current = true;
    readerSuppressClickRef.current = true;
    setReaderSwipeDragging(true);
    setReaderSwipeTransitionEnabled(false);

    if (
      event.currentTarget.setPointerCapture &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Test environments may not support pointer capture for synthetic events.
      }
    }

    event.preventDefault();
    const maxOffset = event.currentTarget.clientWidth * 0.28;
    setReaderSwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  };
  const handleReaderCategoryPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = readerSwipeStartRef.current;
    if (!start) return;
    event.stopPropagation();

    const end = readerSwipeLastRef.current ?? {
      x: event.clientX,
      y: event.clientY,
    };
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const elapsed = Math.max(performance.now() - start.time, 1);
    const velocity = Math.abs(deltaX) / elapsed;
    const threshold = Math.min(96, event.currentTarget.clientWidth * 0.16);
    const isHorizontalSwipe =
      Math.abs(deltaX) > Math.abs(deltaY) * 1.25 &&
      (Math.abs(deltaX) >= threshold ||
        (Math.abs(deltaX) >= 32 && velocity >= 0.55));

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors from unsupported test environments.
      }
    }

    if (isHorizontalSwipe) {
      commitReaderCategorySwipe(deltaX < 0 ? "next" : "previous");
    } else {
      resetReaderCategorySwipe();
    }

    window.setTimeout(() => {
      readerSuppressClickRef.current = false;
    }, 0);
  };
  const handleReaderCategoryWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!hasMultipleReaderSwipeFilters || readerSwipeLockedRef.current) return;
    event.stopPropagation();

    const stageWidth = readerSwipeStageRef.current?.clientWidth ?? event.currentTarget.clientWidth;
    if (!stageWidth) return;

    const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stageWidth : 1;
    const deltaX = event.deltaX * deltaScale;
    const deltaY = event.deltaY * deltaScale;
    const isHorizontalIntent =
      Math.abs(deltaX) > Math.abs(deltaY) * 1.15 && Math.abs(deltaX) > 1;

    if (!isHorizontalIntent) return;

    event.preventDefault();
    event.stopPropagation();

    const now = performance.now();
    const previousWheel = readerSwipeWheelRef.current;
    const nextOffsetX =
      previousWheel && now - previousWheel.lastTime < 220
        ? previousWheel.offsetX + deltaX
        : deltaX;
    readerSwipeWheelRef.current = { offsetX: nextOffsetX, lastTime: now };

    if (readerSwipeWheelResetTimerRef.current) {
      clearTimeout(readerSwipeWheelResetTimerRef.current);
    }

    const maxOffset = stageWidth * 0.28;
    const visualOffset = Math.max(-maxOffset, Math.min(maxOffset, -nextOffsetX));
    setReaderSwipeDragging(true);
    setReaderSwipeTransitionEnabled(false);
    setReaderSwipeOffset(visualOffset);

    const threshold = Math.min(96, stageWidth * 0.16);
    if (Math.abs(nextOffsetX) >= threshold) {
      commitReaderCategorySwipe(nextOffsetX > 0 ? "next" : "previous");
      return;
    }

    readerSwipeWheelResetTimerRef.current = setTimeout(() => {
      resetReaderCategorySwipe();
    }, 160);
  };

  return (
    <>
      <ContentReaderDialogShell
        contentRef={scrollRef}
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
          logoColor={
            readerDestination === "flux"
              ? "var(--palette-content-knockout, white)"
              : readerLogoSlug === "motortrend"
                ? readerTheme?.colors["1"]
                : undefined
          }
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
          ref={readerSwipeStageRef}
          className={cn(
            "grid touch-pan-y gap-8 overscroll-x-contain px-4 py-6 sm:px-8 lg:px-10 xl:grid-cols-[220px_minmax(0,1fr)]",
            readerSwipeTransitionEnabled && "transition-transform duration-[250ms] ease-out",
            readerSwipeDragging && "cursor-grabbing select-none transition-none",
          )}
          data-reader-category-swipe-container
          data-reader-category-swipe-stage
          data-reader-category-filter={readerActiveFilter}
          onPointerDown={handleReaderCategoryPointerDown}
          onPointerMove={handleReaderCategoryPointerMove}
          onPointerUp={handleReaderCategoryPointerUp}
          onPointerCancel={resetReaderCategorySwipe}
          onClickCapture={(event) => {
            if (!readerSuppressClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
          }}
          onWheelCapture={handleReaderCategoryWheel}
          style={{
            transform: `translate3d(${readerSwipeOffset}px, 0, 0)`,
          }}
        >
          <ContentReaderContextRail
            currentStory={activeReaderContextStory}
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
                        />
                        <LifestyleCardModule story={story} kind={kind} />
                        <ContentReaderComments
                          key={story.id}
                          story={story}
                          comments={commentsByStoryId[story.id] ?? []}
                          onAddComment={(body) => onAddComment(story.id, body)}
                        />
                        <ContentReaderRecommendations
                          currentStory={story}
                          stories={readerStories}
                          productName={destinationConfigs[getStoryDestinationMode(story.brandSlug)].productName}
                          onOpenStory={onOpenStory}
                        />
                      </div>
                    </article>
                    <ContentReaderAdvertisement
                      ad={getLifestyleReaderAd(story, index)}
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
  destination: DestinationMode;
  destinationConfig?: DestinationConfig;
  videoFeedData?: LiveFeedData;
  initialBrandSlug?: string;
  initialOpenStoryId?: string;
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
  feedTotal = null,
  feedLoadedCount = 0,
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
  const [activeAutosOemFilters, setActiveAutosOemFilters] = React.useState<string[]>([]);
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
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [delishShortsRiverPlacement, setDelishShortsRiverPlacement] = React.useState<{
    scopeKey: string;
    index: number;
  } | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
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
  const pageHeading = getLifestyleRiverPageHeading(config, initialBrandSlug);
  const currentPageReturnHref = React.useMemo(() => {
    if (!pathname || pathname.startsWith("/read/")) return null;

    const query = searchParams?.toString();
    return normalizeReaderReturnHref(`${pathname}${query ? `?${query}` : ""}`);
  }, [pathname, searchParams]);
  const currentReaderReturnHref = safeReaderReturnHref ?? (initialBrandSlug ? getHearstBrandRoute(initialBrandSlug) : getHearstDestinationRoute(destination));
  const storyOpenReturnHref = safeReaderReturnHref ?? currentPageReturnHref ?? currentReaderReturnHref;
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
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const context = readerRiverReturnContextRef.current;
    if (!context || (storyId && context.storyId !== storyId)) return;
    const attemptDelays = [0, 80, 200, 420, 800];

    const restore = (attemptIndex = 0) => {
      const storyElement = Array.from(
        document.querySelectorAll<HTMLElement>("#hearst-story-river [data-story-id]")
      ).find((element) => element.dataset.storyId === context.storyId);

      if (!storyElement) {
        if (attemptIndex >= attemptDelays.length - 1) {
          window.scrollTo(context.scrollX, context.scrollY);
          return;
        }
        window.setTimeout(() => restore(attemptIndex + 1), attemptDelays[attemptIndex + 1]);
        return;
      }

      const nextScrollY = Math.max(
        0,
        window.scrollY + storyElement.getBoundingClientRect().top - context.viewportTop
      );
      window.scrollTo(context.scrollX, nextScrollY);
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => restore());
    });
  }, []);

  const openStory = React.useCallback((storyId: string) => {
    readerReturnFocusElementRef.current = rememberContentReaderReturnFocus(
      document.activeElement,
    );
    rememberReaderRiverReturnContext(storyId);
    recordStoryOpened(storyId);
    rememberSessionContinueReadingStory(storyId);
    setOpenStoryId(storyId);
    saveReaderReturnScrollSnapshot(
      storyId,
      storyOpenReturnHref,
      readerRiverReturnContextRef.current?.storyIds ?? displayStoryIdsRef.current
    );
    router.push(appendReaderReturnHref(storyId, storyOpenReturnHref), { scroll: false });
  }, [rememberReaderRiverReturnContext, rememberSessionContinueReadingStory, router, setOpenStoryId, storyOpenReturnHref]);

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
    const closingStoryId = openStoryId;
    setOpenStoryId(null);
    if (pathname?.startsWith("/read/")) {
      router.push(currentReaderReturnHref, { scroll: false });
      restoreReaderReturnScrollSnapshot(currentReaderReturnHref);
      restoreReaderRiverReturnContext(closingStoryId);
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

    const contextStories = oemFilteredStories.filter((story) => storyMatchesLifestyleFilter(story, activeFilter));
    return config.liveFeedMode === "blend"
      ? applyContextualFeedCadence(contextStories)
      : contextStories;
  }, [
    activeAutosOemFilters,
    activeFilter,
    config.liveFeedMode,
    effectiveBrandFilters,
    profile.savedIds,
    rankedStories,
    showAutosOemFilter,
    usingVideoTabFeed,
  ]);
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
  const visibleStories = displayStories.slice(
    0,
    visibleRiverCount + lifestyleHeroStoryCount
  );
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
  const heroStoryIds = React.useMemo(
    () => new Set(heroStories.map((story) => story.id)),
    [heroStories]
  );
  const showTodayEdit = destination === "all"
    && !initialBrandSlug
    && activeFilter === "For You";
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
    const node = sentinelRef.current;
    if (!node) return;

    const preloadMargin = Math.max(1200, Math.ceil(window.innerHeight * 1.75));
    let requestedForCurrentRender = false;
    const isWithinPreloadZone = () => {
      const bounds = node.getBoundingClientRect();
      return bounds.top <= window.innerHeight + preloadMargin
        && bounds.bottom >= -preloadMargin;
    };
    const requestMoreStories = () => {
      const pageCanScroll = document.documentElement.scrollHeight > window.innerHeight;
      if (
        requestedForCurrentRender
        || !isWithinPreloadZone()
        || (pageCanScroll && window.scrollY <= 0)
      ) return;
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
    return () => {
      window.cancelAnimationFrame(preloadCheckFrame);
      observer.disconnect();
    };
  }, [
    displayOrderScopeKey,
    displayStories.length,
    feedHasMore,
    feedLoading,
    loadMoreVisibleStories,
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

  const browseForYou = () => {
    trackProductEvent("saved_browse_for_you", { destination });
    setActiveBrandFilters([]);
    setActiveAutosOemFilters([]);
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
          <LifestyleDiscoverySidebar
            profile={profile}
            topStories={filteredStories}
            topics={sidebarTopics}
            brands={sidebarBrands}
            brandFilterTitle={usingVideoTabFeed ? "Videos by brand" : undefined}
            brandFilterFirst={usingVideoTabFeed}
            showBrandCounts={!usingVideoTabFeed}
            activeBrandFilters={effectiveBrandFilters}
            autosOemOptions={autosOemOptions}
            activeAutosOemFilters={activeAutosOemFilters}
            collectionLabels={config.collectionLabels}
            onToggleBrandFilter={toggleBrandFilter}
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
                    hasLoadedStories={visibleRiverCount < completeRiverStories.length}
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

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <TrendingVideoRail
              stories={trendingVideoStories}
              onOpenStory={(story) => openStory(story.id)}
            />

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

  return (
    <div className="space-y-8">
      {showTodayEdit ? (
        <TodayEditStrip
          selection={todayEditSelection}
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

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <LifestyleDiscoverySidebar
          profile={profile}
          topStories={moduleAllocation.dailyHabitStories}
          topics={sidebarTopics}
          brands={sidebarBrands}
          brandFilterTitle={initialBrandSlug && !usingVideoTabFeed ? "Global Story Inventory" : undefined}
          globalInventory={Boolean(initialBrandSlug && !usingVideoTabFeed)}
          showBrandCounts={Boolean(initialBrandSlug && !usingVideoTabFeed)}
          activeBrandFilters={effectiveBrandFilters}
          autosOemOptions={autosOemOptions}
          activeAutosOemFilters={activeAutosOemFilters}
          collectionLabels={config.collectionLabels}
          onToggleBrandFilter={toggleBrandFilter}
          onToggleAutosOemFilter={showAutosOemFilter ? toggleAutosOemFilter : undefined}
          onClearAutosOemFilters={showAutosOemFilter ? clearAutosOemFilters : undefined}
          onFollowTopic={followTopic}
          onOpenStory={(story) => openStory(story.id)}
        />

        <main id="hearst-story-river" className="min-w-0 scroll-mt-28 space-y-4" aria-label={config.riverLabel}>
          <h1 className="sr-only">{pageHeading}</h1>
          {leadStory ? (
            <>
              <FeaturedStoryCarousel
                key={`${leadStory.id}:${heroStories.map((story) => story.id).join("|")}`}
                stories={heroStories}
                editionLabel={shouldUseTodaysPicks ? "Today’s Picks" : undefined}
                initialStoryId={leadStory.id}
                savedIds={profile.savedIds}
                renderImage={(story, _index, active) => (
                  <LifestyleRiverImage
                    story={story}
                    className="h-full w-full"
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
                  hasLoadedStories={visibleRiverCount < completeRiverStories.length}
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

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <TrendingStoryRail
            stories={moduleAllocation.trendingStories}
            onOpenStory={(story) => openStory(story.id)}
            title={initialBrandName ? `Trending in ${initialBrandName}` : undefined}
          />
          {showStakeholderTools ? (
            <>
              <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
                <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
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
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
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
  initialLiveArticle,
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
  const pageCategorySwipeStageRef = React.useRef<HTMLDivElement | null>(null);
  const pageCategorySwipeStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const pageCategorySwipeLastRef = React.useRef<{ x: number; y: number } | null>(null);
  const pageCategorySwipeIntentRef = React.useRef(false);
  const pageCategorySwipeLockedRef = React.useRef(false);
  const pageCategorySwipeSuppressClickRef = React.useRef(false);
  const pageCategorySwipeWheelRef = React.useRef<{ offsetX: number; lastTime: number } | null>(null);
  const pageCategorySwipeWheelResetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageCategorySwipeUnlockTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pageCategorySwipeOffset, setPageCategorySwipeOffset] = React.useState(0);
  const [pageCategorySwipeDragging, setPageCategorySwipeDragging] = React.useState(false);
  const [pageCategorySwipeTransitionEnabled, setPageCategorySwipeTransitionEnabled] = React.useState(true);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [delishOnboardingOpen, setDelishOnboardingOpen] = React.useState(false);
  const [motorTrendOnboardingOpen, setMotorTrendOnboardingOpen] = React.useState(false);
  const [goodHousekeepingOnboardingOpen, setGoodHousekeepingOnboardingOpen] = React.useState(false);
  const [elleOnboardingOpen, setElleOnboardingOpen] = React.useState(false);
  const [publicationOnboardingOpen, setPublicationOnboardingOpen] = React.useState(false);
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
        ? selectedBrandTheme?.colors["11"] ?? "var(--foreground)"
        : colorMode === "dark"
          ? "var(--primary)"
          : "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      "--hp-sidebar-heading": selectedBrand?.slug === "autoweek"
        ? selectedBrandTheme?.colors["11"] ?? "var(--foreground)"
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
  const isDestinationRiver = brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew";
  const isDelishOnboardingRoute = selectedBrand?.slug === "delish";
  const isMotorTrendOnboardingRoute = selectedBrand?.slug === "motortrend";
  const isGoodHousekeepingOnboardingRoute = selectedBrand?.slug === "good-housekeeping";
  const isElleOnboardingRoute = selectedBrand?.slug === "elle";
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
    || isGoodHousekeepingOnboardingRoute
    || isElleOnboardingRoute
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
    if (isGoodHousekeepingOnboardingRoute) {
      setAuthDialogOpen(false);
      setGoodHousekeepingOnboardingOpen(true);
      return;
    }
    if (isElleOnboardingRoute) {
      setAuthDialogOpen(false);
      setElleOnboardingOpen(true);
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
    isElleOnboardingRoute,
    isGoodHousekeepingOnboardingRoute,
    isMotorTrendOnboardingRoute,
    isPublicationOnboardingRoute,
  ]);
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
    ? activeLifestyleFilter
    : undefined;
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
        document.title = getDestinationCategoryDocumentTitle(
          destinationMode,
          getHearstDestinationCategoryDisplayLabel(destinationMode, filter),
        );
      }
    }

    anchorDestinationContent();
  }, [anchorDestinationContent, destinationMode, selectedBrand, showStakeholderTools]);
  const pageCategorySwipeFilters = React.useMemo(() => {
    const baseFilters = selectedBrand
      ? getBrandContextualFilters(
          selectedBrand.slug,
          destinationConfigs.all.stories,
          hasScopedVideoFeed,
        )
      : inventoryAwareDestinationConfig.filters;
    return !selectedBrand && hasScopedVideoFeed
      ? insertVideosFilter(baseFilters)
      : baseFilters;
  }, [
    destinationConfigs.all.stories,
    hasScopedVideoFeed,
    inventoryAwareDestinationConfig.filters,
    selectedBrand,
  ]);
  const pageCategorySwipeIndex = Math.max(
    0,
    pageCategorySwipeFilters.indexOf(activeLifestyleFilter),
  );
  const hasMultiplePageCategorySwipeFilters = pageCategorySwipeFilters.length > 1;
  React.useEffect(() => {
    if (!isDestinationRiver || !hasMultiplePageCategorySwipeFilters) return;

    const previousHtmlOverscrollBehaviorX =
      document.documentElement.style.overscrollBehaviorX;
    const previousBodyOverscrollBehaviorX =
      document.body.style.overscrollBehaviorX;

    document.documentElement.style.overscrollBehaviorX = "none";
    document.body.style.overscrollBehaviorX = "none";

    return () => {
      document.documentElement.style.overscrollBehaviorX =
        previousHtmlOverscrollBehaviorX;
      document.body.style.overscrollBehaviorX =
        previousBodyOverscrollBehaviorX;
    };
  }, [hasMultiplePageCategorySwipeFilters, isDestinationRiver]);
  const previousPageCategorySwipeFilter = hasMultiplePageCategorySwipeFilters
    ? pageCategorySwipeFilters[
        (pageCategorySwipeIndex - 1 + pageCategorySwipeFilters.length)
        % pageCategorySwipeFilters.length
      ]
    : undefined;
  const nextPageCategorySwipeFilter = hasMultiplePageCategorySwipeFilters
    ? pageCategorySwipeFilters[
        (pageCategorySwipeIndex + 1) % pageCategorySwipeFilters.length
      ]
    : undefined;
  const resetPageCategorySwipe = React.useCallback(() => {
    pageCategorySwipeStartRef.current = null;
    pageCategorySwipeLastRef.current = null;
    pageCategorySwipeIntentRef.current = false;
    pageCategorySwipeWheelRef.current = null;
    if (pageCategorySwipeWheelResetTimerRef.current) {
      clearTimeout(pageCategorySwipeWheelResetTimerRef.current);
      pageCategorySwipeWheelResetTimerRef.current = null;
    }
    setPageCategorySwipeDragging(false);
    setPageCategorySwipeTransitionEnabled(true);
    setPageCategorySwipeOffset(0);
  }, []);
  const unlockPageCategorySwipe = React.useCallback(() => {
    pageCategorySwipeLockedRef.current = false;
    if (pageCategorySwipeUnlockTimerRef.current) {
      clearTimeout(pageCategorySwipeUnlockTimerRef.current);
      pageCategorySwipeUnlockTimerRef.current = null;
    }
  }, []);
  const commitPageCategorySwipe = React.useCallback((direction: "previous" | "next") => {
    const targetFilter = direction === "next"
      ? nextPageCategorySwipeFilter
      : previousPageCategorySwipeFilter;
    const stageWidth = pageCategorySwipeStageRef.current?.clientWidth ?? 0;

    if (!targetFilter || !stageWidth || pageCategorySwipeLockedRef.current) {
      resetPageCategorySwipe();
      return;
    }

    pageCategorySwipeLockedRef.current = true;
    if (pageCategorySwipeUnlockTimerRef.current) {
      clearTimeout(pageCategorySwipeUnlockTimerRef.current);
    }
    pageCategorySwipeWheelRef.current = null;
    if (pageCategorySwipeWheelResetTimerRef.current) {
      clearTimeout(pageCategorySwipeWheelResetTimerRef.current);
      pageCategorySwipeWheelResetTimerRef.current = null;
    }

    const exitOffset = direction === "next" ? -stageWidth : stageWidth;
    const enterOffset = direction === "next" ? stageWidth : -stageWidth;
    setPageCategorySwipeDragging(false);
    setPageCategorySwipeTransitionEnabled(true);
    setPageCategorySwipeOffset(exitOffset);

    window.setTimeout(() => {
      setPageCategorySwipeTransitionEnabled(false);
      handleLifestyleFilterChange(targetFilter);
      setPageCategorySwipeOffset(enterOffset);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setPageCategorySwipeTransitionEnabled(true);
          setPageCategorySwipeOffset(0);
        });
      });
    }, 220);

    pageCategorySwipeUnlockTimerRef.current = setTimeout(() => {
      unlockPageCategorySwipe();
    }, 620);
  }, [
    handleLifestyleFilterChange,
    nextPageCategorySwipeFilter,
    previousPageCategorySwipeFilter,
    resetPageCategorySwipe,
    unlockPageCategorySwipe,
  ]);
  const shouldIgnorePageCategorySwipeTarget = React.useCallback((target: EventTarget | null) => (
    target instanceof HTMLElement
      && Boolean(target.closest("input, textarea, select, option, [contenteditable='true'], video, audio, [role='dialog'], [data-reader-category-swipe-container], [data-page-category-swipe-exempt]"))
  ), []);
  const handlePageCategoryPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.button !== 0
      || pageCategorySwipeLockedRef.current
      || shouldIgnorePageCategorySwipeTarget(event.target)
    ) return;
    pageCategorySwipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
    pageCategorySwipeLastRef.current = { x: event.clientX, y: event.clientY };
  }, [shouldIgnorePageCategorySwipeTarget]);
  const handlePageCategoryPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const start = pageCategorySwipeStartRef.current;
    if (!start || pageCategorySwipeLockedRef.current) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    pageCategorySwipeLastRef.current = { x: event.clientX, y: event.clientY };

    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) return;
    if (Math.abs(deltaX) < 8 && !pageCategorySwipeIntentRef.current) return;

    pageCategorySwipeIntentRef.current = true;
    pageCategorySwipeSuppressClickRef.current = true;
    setPageCategorySwipeDragging(true);
    setPageCategorySwipeTransitionEnabled(false);

    if (
      event.currentTarget.setPointerCapture &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Test environments may not support pointer capture for synthetic events.
      }
    }

    event.preventDefault();
    const maxOffset = event.currentTarget.clientWidth * 0.28;
    setPageCategorySwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  }, []);
  const handlePageCategoryPointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const start = pageCategorySwipeStartRef.current;
    if (!start) return;

    const end = pageCategorySwipeLastRef.current ?? {
      x: event.clientX,
      y: event.clientY,
    };
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const elapsed = Math.max(performance.now() - start.time, 1);
    const velocity = Math.abs(deltaX) / elapsed;
    const threshold = Math.min(96, event.currentTarget.clientWidth * 0.16);
    const isHorizontalSwipe =
      Math.abs(deltaX) > Math.abs(deltaY) * 1.25 &&
      (Math.abs(deltaX) >= threshold ||
        (Math.abs(deltaX) >= 32 && velocity >= 0.55));

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors from unsupported test environments.
      }
    }

    if (isHorizontalSwipe) {
      commitPageCategorySwipe(deltaX < 0 ? "next" : "previous");
    } else {
      resetPageCategorySwipe();
    }

    window.setTimeout(() => {
      pageCategorySwipeSuppressClickRef.current = false;
    }, 0);
  }, [commitPageCategorySwipe, resetPageCategorySwipe]);
  const handlePageCategoryWheel = React.useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (
      !hasMultiplePageCategorySwipeFilters
      || pageCategorySwipeLockedRef.current
      || shouldIgnorePageCategorySwipeTarget(event.target)
    ) return;

    const stageWidth = pageCategorySwipeStageRef.current?.clientWidth ?? event.currentTarget.clientWidth;
    if (!stageWidth) return;

    const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stageWidth : 1;
    const deltaX = event.deltaX * deltaScale;
    const deltaY = event.deltaY * deltaScale;
    const isHorizontalIntent =
      Math.abs(deltaX) > Math.abs(deltaY) * 1.15 && Math.abs(deltaX) > 1;

    if (!isHorizontalIntent) return;

    event.preventDefault();
    event.stopPropagation();

    const now = performance.now();
    const previousWheel = pageCategorySwipeWheelRef.current;
    const nextOffsetX =
      previousWheel && now - previousWheel.lastTime < 220
        ? previousWheel.offsetX + deltaX
        : deltaX;
    pageCategorySwipeWheelRef.current = { offsetX: nextOffsetX, lastTime: now };

    if (pageCategorySwipeWheelResetTimerRef.current) {
      clearTimeout(pageCategorySwipeWheelResetTimerRef.current);
    }

    const maxOffset = stageWidth * 0.28;
    const visualOffset = Math.max(-maxOffset, Math.min(maxOffset, -nextOffsetX));
    setPageCategorySwipeDragging(true);
    setPageCategorySwipeTransitionEnabled(false);
    setPageCategorySwipeOffset(visualOffset);

    const threshold = Math.min(96, stageWidth * 0.16);
    if (Math.abs(nextOffsetX) >= threshold) {
      commitPageCategorySwipe(nextOffsetX > 0 ? "next" : "previous");
      return;
    }

    pageCategorySwipeWheelResetTimerRef.current = setTimeout(() => {
      resetPageCategorySwipe();
    }, 160);
  }, [
    commitPageCategorySwipe,
    hasMultiplePageCategorySwipeFilters,
    resetPageCategorySwipe,
    shouldIgnorePageCategorySwipeTarget,
  ]);
  React.useEffect(() => () => {
    if (pageCategorySwipeWheelResetTimerRef.current) {
      clearTimeout(pageCategorySwipeWheelResetTimerRef.current);
    }
    if (pageCategorySwipeUnlockTimerRef.current) {
      clearTimeout(pageCategorySwipeUnlockTimerRef.current);
    }
  }, []);
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
  const useVideosDarkHeader = destinationMode === "all"
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
            <div
              ref={pageCategorySwipeStageRef}
              className={cn(
                "touch-pan-y overscroll-x-contain",
                pageCategorySwipeTransitionEnabled && "transition-transform duration-[250ms] ease-out",
                pageCategorySwipeDragging && "cursor-grabbing select-none transition-none",
              )}
              data-page-category-swipe-stage
              data-page-category-filter={activeLifestyleFilter}
              onPointerDown={handlePageCategoryPointerDown}
              onPointerMove={handlePageCategoryPointerMove}
              onPointerUp={handlePageCategoryPointerUp}
              onPointerCancel={resetPageCategorySwipe}
              onClickCapture={(event) => {
                if (!pageCategorySwipeSuppressClickRef.current) return;
                event.preventDefault();
                event.stopPropagation();
              }}
              onWheelCapture={handlePageCategoryWheel}
              style={pageCategorySwipeOffset !== 0 ? {
                transform: `translate3d(${pageCategorySwipeOffset}px, 0, 0)`,
              } : undefined}
            >
              <LifestyleRiverHydrationGate
                activeFilter={activeLifestyleFilter}
                destination={destinationMode}
                destinationConfig={inventoryAwareDestinationConfig}
                videoFeedData={resolvedVideoFeedData}
                initialBrandSlug={initialBrandSlug}
                initialOpenStoryId={initialOpenStoryId}
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

      {isGoodHousekeepingOnboardingRoute && goodHousekeepingOnboardingOpen ? (
        <GoodHousekeepingOnboardingModal
          open={goodHousekeepingOnboardingOpen}
          onClose={() => setGoodHousekeepingOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setOnboardingResult(result);
            setGoodHousekeepingOnboardingOpen(false);
            anchorDestinationContent();
          }}
          onCreateProfile={(result) => {
            setOnboardingResult(result);
            setGoodHousekeepingOnboardingOpen(false);
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
          onSignIn={() => {
            setGoodHousekeepingOnboardingOpen(false);
            setAuthDialogMode("signIn");
            setAuthDialogOpen(true);
          }}
        />
      ) : null}

      {isElleOnboardingRoute && elleOnboardingOpen ? (
        <ElleOnboardingModal
          open={elleOnboardingOpen}
          onClose={() => setElleOnboardingOpen(false)}
          onComplete={(result) => {
            setActiveLifestyleFilter("For You");
            setOnboardingResult(result);
            setElleOnboardingOpen(false);
            anchorDestinationContent();
          }}
          onCreateProfile={(result) => {
            setOnboardingResult(result);
            setElleOnboardingOpen(false);
            setAuthDialogMode("create");
            setAuthDialogOpen(true);
          }}
          onSignIn={() => {
            setElleOnboardingOpen(false);
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
