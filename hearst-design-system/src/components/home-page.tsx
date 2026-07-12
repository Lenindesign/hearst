"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
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
  Camera,
  ChevronDown,
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
import { autosRiverSourceNotes, autosRiverStories } from "./autos-river-data";
import { ewRiverSourceNotes, ewRiverStories } from "./ew-river-data";
import { fluxRiverSourceNotes, fluxRiverStories } from "./flux-river-data";
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

const selectedBrandThemeAliases: Record<string, string> = {
  "pioneer-woman": "the-pioneer-woman",
};

const supplementalBrandProfiles: Record<string, { primary: string; secondary: string; fontDefault: string; fontHeadline: string; fontHeadlineWeight: number }> = {
  "bring-a-trailer": {
    primary: "#f40217",
    secondary: "#f5f5f5",
    fontDefault: "Open Sans",
    fontHeadline: "Open Sans",
    fontHeadlineWeight: 700,
  },
  "hot-rod": {
    primary: "#ea232a",
    secondary: "#141416",
    fontDefault: "Geist",
    fontHeadline: "Barlow Condensed",
    fontHeadlineWeight: 700,
  },
  motortrend: {
    primary: "#e90c17",
    secondary: "#141416",
    fontDefault: "Geist",
    fontHeadline: "Barlow Condensed",
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
  return lifestyleBrandFavicons[brandSlug] ?? autosBrandFavicons[brandSlug] ?? fluxBrandFavicons[brandSlug] ?? ewBrandFavicons[brandSlug] ?? brandLogos[brandSlug];
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
type DestinationSourceNote =
  | (typeof lifestyleRiverSourceNotes)[number]
  | (typeof autosRiverSourceNotes)[number]
  | (typeof fluxRiverSourceNotes)[number]
  | (typeof ewRiverSourceNotes)[number];

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
};

const destinationConfigs: Record<DestinationMode, DestinationConfig> = {
  all: {
    mode: "all",
    brandSlug: "hearst-all",
    productName: "Hearst Magazines",
    riverLabel: "Personalized Hearst story river",
    storyRiverLabel: "Hearst stories",
    filters: ["For You", "Lifestyle", "Autos", "Flux", "E&W", "Home", "Style", "Reviews", "Fitness", "Shopping", "Saved"],
    stories: [...lifestyleRiverStories, ...autosRiverStories, ...fluxRiverStories, ...ewRiverStories],
    sourceNotes: [...lifestyleRiverSourceNotes, ...autosRiverSourceNotes, ...fluxRiverSourceNotes, ...ewRiverSourceNotes],
    initialProfile: initialAllProfile,
    defaultLeadStoryId: allDefaultLeadStoryId,
    dayparts: lifestyleDemoDayparts,
    nextDayTopics: ["Home", "Style", "Reviews", "Fitness", "Shopping"],
    brandSummary:
      "Lifestyle, Autos, Flux, and E&W brands combined into one cross-Hearst personalized destination.",
    dataSourceCopy:
      "public RSS metadata from all four prototype sections, filtered to stories with real Hearst CDN images.",
    collectionLabels: ["Daily edit", "Shopping ideas", "Weekend plans"],
  },
  lifestyle: {
    mode: "lifestyle",
    brandSlug: "hearst-lifestyle",
    productName: "Hearst Lifestyle",
    riverLabel: "Personalized lifestyle story river",
    storyRiverLabel: "lifestyle stories",
    filters: ["For You", "Food", "Home", "Wellness", "Style", "Shopping", "Family", "Entertainment", "Saved"],
    stories: lifestyleRiverStories,
    sourceNotes: lifestyleRiverSourceNotes,
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
    stories: autosRiverStories,
    sourceNotes: autosRiverSourceNotes,
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
    stories: fluxRiverStories,
    sourceNotes: fluxRiverSourceNotes,
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
    stories: ewRiverStories,
    sourceNotes: ewRiverSourceNotes,
    initialProfile: initialEWProfile,
    dayparts: ewDemoDayparts,
    nextDayTopics: ["Fitness", "Wellness", "Gear", "Tech"],
    brandSummary: "Best Products, Bicycling, Men's Health, Oprah Daily, Popular Mechanics, Runner's World, and Women's Health.",
    dataSourceCopy:
      "public E&W brand RSS metadata from the requested health, gear, fitness, wellness, and science brands, filtered to stories with real images.",
    collectionLabels: ["Training plan", "Gear shortlist", "Wellness queue"],
  },
};

function getDestinationMode(brandSlug: string): DestinationMode {
  if (brandSlug === "hearst-all") return "all";
  if (brandSlug === "hearst-ew") return "ew";
  if (brandSlug === "hearst-flux") return "flux";
  return brandSlug === "hearst-plus" ? "autos" : "lifestyle";
}

function getStoryDestinationMode(brandSlug: string): Exclude<DestinationMode, "all"> {
  if (destinationConfigs.autos.sourceNotes.some((note) => note.brandSlug === brandSlug)) return "autos";
  if (destinationConfigs.flux.sourceNotes.some((note) => note.brandSlug === brandSlug)) return "flux";
  if (destinationConfigs.ew.sourceNotes.some((note) => note.brandSlug === brandSlug)) return "ew";
  return "lifestyle";
}

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  return { ...base, footerCols: defaultFooterCols };
}

function getLifestyleTimeOfDayScore(
  story: LifestyleRiverStory,
  demoState: LifestyleDemoState,
  config = destinationConfigs.lifestyle
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
  config = destinationConfigs.lifestyle
) {
  const popularity = story.popularity;
  const followedTopic = profile.followedTopics.includes(story.topic) ? 18 : 0;
  const followedBrand = profile.followedBrands.includes(story.brand) ? 16 : 0;
  const savedTagMatches = story.tags.filter((tag) => profile.savedTags.includes(tag)).length;
  const boostedTagMatches = story.tags.filter((tag) => profile.boostedTags.includes(tag)).length;
  const savedTag = savedTagMatches > 0 ? 14 + Math.min(18, (savedTagMatches - 1) * 6) : 0;
  const moreLikeThis = boostedTagMatches > 0 ? 22 + Math.min(24, (boostedTagMatches - 1) * 8) : 0;
  const savedStory = profile.savedIds.includes(story.id) ? 6 : 0;
  const recency = getLifestyleRecencyScore(story, demoState);
  const timeOfDay = getLifestyleTimeOfDayScore(story, demoState, config);
  const defaultLead = config.defaultLeadStoryId === story.id && demoState.contentDay === "today" ? 80 : 0;
  const nextDayNovelty =
    demoState.contentDay === "nextDay" && story.id !== demoState.previousLeadId
      ? config.nextDayTopics.includes(story.topic)
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
    defaultLead,
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
      nextDayNovelty +
      repeatLeadPenalty +
      hidden,
  };
}

function getLifestyleScore(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = destinationConfigs.lifestyle
) {
  return getLifestyleScoreBreakdown(story, profile, demoState, config).total;
}

function rankLifestyleRiver(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = destinationConfigs.lifestyle
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

function getLifestyleDemoStoryPool(
  demoState: LifestyleDemoState,
  config = destinationConfigs.lifestyle
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
  if (filter === "Lifestyle") return getStoryDestinationMode(story.brandSlug) === "lifestyle";
  if (filter === "Autos") return getStoryDestinationMode(story.brandSlug) === "autos";
  if (filter === "Flux") return getStoryDestinationMode(story.brandSlug) === "flux";
  if (filter === "E&W") return getStoryDestinationMode(story.brandSlug) === "ew";
  return story.topic === filter || story.topic.startsWith(`${filter} `);
}

const hearstDestinationSections = [
  { label: "All", href: "/hearst-all/" },
  { label: "Lifestyle", href: "/hearst-edit/" },
  { label: "Autos", href: "/hearst-plus/" },
  { label: "Flux", href: "/hearst-flux/" },
  { label: "E&W", href: "/hearst-ew/" },
];

function UtilityBar() {
  const { brand } = useTheme();
  const activeDestination =
    brand.slug === "hearst-all"
      ? "All"
      : brand.slug === "hearst-plus"
      ? "Autos"
      : brand.slug === "hearst-flux"
      ? "Flux"
      : brand.slug === "hearst-ew"
      ? "E&W"
      : "Lifestyle";

  return (
    <div className="h-8 bg-primary text-primary-foreground text-[length:var(--text-token-4xs)] font-semibold">
      <PageContainer className="grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <nav className="flex items-center gap-3" aria-label="Utility navigation">
          {["Shop", "Newsletter", "Sign In"].map((label) => (
            <LinkComponent
              key={label}
              href="#"
                variant="neutral"
                underline={false}
                size="xs"
                className={cn(
                  "opacity-90 text-primary-foreground hover:text-primary-foreground/80 font-semibold",
                  label !== "Sign In" && "max-[520px]:hidden"
                )}
              >
                {label}
              </LinkComponent>
          ))}
        </nav>
        <nav
          className="flex min-w-0 items-center justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Hearst destination sections"
        >
          <div className="flex min-w-max items-center gap-1 rounded-full bg-black/10 p-0.5">
            {hearstDestinationSections.map((section) => (
              <LinkComponent
                key={section.label}
                href={section.href}
                variant="neutral"
                underline={false}
                size="xs"
                aria-current={section.label === activeDestination ? "page" : undefined}
                className={cn(
                  "rounded-full px-2 py-0.5 font-bold text-primary-foreground hover:text-primary-foreground",
                  section.label === activeDestination
                    ? "bg-white text-primary hover:text-primary"
                    : "opacity-85 hover:bg-white/10 hover:opacity-100"
                )}
              >
                {section.label}
              </LinkComponent>
            ))}
          </div>
        </nav>
        <Button
          variant="secondary"
          size="xs"
          className="bg-white text-[length:var(--text-token-4xs)] font-semibold text-primary hover:bg-white/90 hover:text-primary"
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
  selectedBrand,
}: {
  brandSlug: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  selectedBrand?: { name: string; slug: string } | null;
}) {
  const { brand } = useTheme();
  const mastheadSlug = selectedBrand?.slug ?? brand.slug;
  const logo = brandLogos[mastheadSlug];
  const content = getContent(brandSlug);
  const isDestinationRiver = brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew";
  const destinationConfig = destinationConfigs[getDestinationMode(brand.slug)];
  const navLinks = isDestinationRiver ? destinationConfig.filters : content.navLinks;

  return (
    <>
    <div className="border-b border-border py-2">
      <PageContainer className="flex items-center justify-between py-2">
        <div className="w-[var(--width-sidebar-narrow)]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo
              slug={mastheadSlug}
              color={selectedBrand ? "#121212" : isDestinationRiver ? brand.colors["1"] : undefined}
              className={cn(
                "[&_svg]:w-auto mx-auto",
                isDestinationRiver
                  ? selectedBrand
                    ? "[&_svg]:h-7 sm:[&_svg]:h-9 [&_svg]:max-w-[220px] sm:[&_svg]:max-w-[300px]"
                    : "[&_svg]:h-5 sm:[&_svg]:h-6 [&_svg]:max-w-[260px] sm:[&_svg]:max-w-[340px]"
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
    </div>
    <div className={cn("border-b border-border", isDestinationRiver && "sticky top-0 z-30 bg-background/95 backdrop-blur md:static md:bg-background md:backdrop-blur-none")}>
      <PageContainer as="nav" className="flex items-center justify-start gap-6 overflow-x-auto py-2 scrollbar-hide md:justify-center">
        {navLinks.map((link) => {
          const active = activeFilter === link;

          return isDestinationRiver ? (
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
  if (story.title === "All About Zoey Deutch’s Fiancé, Jimmy Tatro") return "center 10%";
  if (story.title === "Inside Adéla’s Night Out in Paris With Wardrobe.NYC and H&M") return "center 8%";
  if (story.title === "Kate Middleton’s Style at Wimbledon Throughout the Years") return "center 5%";
  if (story.title === "Minka Kelly and Dan Reynolds’s Complete Relationship Timeline") return "center 18%";
  return "center";
}

function LifestyleBrandSource({ story }: { story: LifestyleRiverStory }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[length:var(--text-token-4xs)] text-muted-foreground">
      <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
      <span className="min-w-0 truncate">
        {story.brand} · {story.topic} · {story.readTime}
      </span>
    </span>
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
    ["ew-nutrition-plan", "Fuel Plan", "Nutrition for the Next Goal", "Meal, protein, hydration, and supplement signals for wellness and training readers.", "Build fuel plan", ["Nutrition", "Wellness", "Fitness"], ["nutrition", "food", "health", "training"], "Fuel", "#fff8ed", "#34220e", "#E50022", "#f2dfbd", "https://hips.hearstapps.com/hmg-prod/images/4446e948-4ffa-4a76-a3f2-06373961eb3f.jpg"],
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
      className="grid min-w-0 overflow-hidden rounded-[8px] border border-border bg-background p-4 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4"
      aria-label={`Sponsored: ${ad.title}`}
    >
      <div
        className="relative flex min-h-44 flex-col justify-between overflow-hidden rounded-[4px] p-4 text-sm sm:min-h-full"
        style={{ backgroundColor: ad.palette.background, color: ad.palette.foreground }}
      >
        <div
          role="img"
          aria-label={`${ad.sponsor}: ${ad.title}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${ad.imageUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70" />
        <div className="relative flex items-center justify-between gap-3 text-white">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest">
            Sponsored
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black"
            style={{ backgroundColor: ad.palette.accent, color: "#fff" }}
          >
            AD
          </span>
        </div>
        <div className="relative text-white">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest opacity-90">
            {ad.creativeLabel}
          </p>
          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-4 text-white/85">
            Live-feed creative
          </p>
        </div>
      </div>
      <div className="min-w-0 py-4 sm:py-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Contextual Ad
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold text-muted-foreground">
            Slot {slotNumber}
          </span>
          <span className="text-xs text-muted-foreground">{ad.sponsor}</span>
        </div>
        <h2 className="headline mt-3 text-2xl leading-tight sm:text-3xl">
          {ad.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {ad.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {ad.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-border bg-muted/40 px-2 py-1 text-[length:var(--text-token-4xs)] font-semibold"
            >
              {topic}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button variant="outline" size="xs">
            {ad.cta}
          </Button>
          <span className="text-xs text-muted-foreground">
            Matched to intent score {score}
          </span>
        </div>
      </div>
    </article>
  );
}

function getLifestyleCardKind(story: LifestyleRiverStory): LifestyleCardKind {
  const searchable = `${story.topic} ${story.title}`.toLowerCase();

  if (story.topic.startsWith("Food")) return "recipe";
  if (story.topic === "Reviews" || story.topic === "EVs" || story.topic === "Performance") return "recipe";
  if (/shopping|products|tested|best|buy|sale|deals|favorite|picks/.test(searchable)) return "shopping";
  if (story.topic === "Buying Guides" || story.topic === "Auctions") return "shopping";
  if (story.topic === "Entertainment" || /watch|video|tv|show|movie|internet/.test(searchable) || story.age % 7 === 0) return "video";
  if (/photos|gallery|style|jeans|rooms|decorating|porch|garden|designers|living room|classic|collector|auction/.test(searchable) || story.age % 5 === 0) return "gallery";

  return "article";
}

function getLifestyleKindLabel(kind: LifestyleCardKind, story?: LifestyleRiverStory) {
  if (story && kind === "recipe" && !story.topic.startsWith("Food")) return "Specs";
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
    <section className="mt-4 rounded-[8px] border border-border bg-background" aria-label="Contextual ad logic">
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
    if (!story.topic.startsWith("Food")) {
      return (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
          <div className="rounded-[8px] bg-muted px-2 py-2">
            <p className="font-bold">{3 + (story.age % 5)} sec</p>
            <p className="text-muted-foreground">0-60</p>
          </div>
          <div className="rounded-[8px] bg-muted px-2 py-2">
            <p className="font-bold">{240 + ((story.age * 17) % 360)} hp</p>
            <p className="text-muted-foreground">Estimate</p>
          </div>
          <div className="rounded-[8px] bg-muted px-2 py-2">
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
  onOpen,
  onSave,
  onMoreLikeThis,
  onFollowBrand,
  onHide,
  featured = false,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
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
        : "grid gap-0 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4 sm:p-4"
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
        isVideo ? "p-4 sm:p-5" : featured ? "flex flex-col justify-center p-5 sm:p-6 lg:p-8" : "p-4 sm:p-0"
      )}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            {story.signal}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-muted-foreground">
            {getLifestyleKindLabel(kind, story)}
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
          featured ? "max-w-prose text-base leading-7" : "hidden text-sm leading-6 sm:block"
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
          <Button variant="ghost" size="xs" onClick={onFollowBrand}>
            Follow {story.brand}
          </Button>
          <Button variant="ghost" size="xs" onClick={onHide} className="max-[640px]:hidden">
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
      <div className="sticky top-20 max-h-[calc(100vh-7rem)] space-y-4 overflow-y-auto pr-1">
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
      </div>
    </aside>
  );
}

function LifestyleReaderSidebarAd() {
  const readerAdImageUrl = "https://hips.hearstapps.com/hmg-prod/images/bd62be17-e3bc-47ce-998b-df0fb3603b5b.jpeg";

  return (
    <aside className="hidden lg:block" aria-label="Advertisement">
      <div
        className="sticky top-20 flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[8px] border border-[#d7c7b8] bg-[#fffaf4] bg-cover bg-center shadow-sm"
        style={{ backgroundImage: `url("${readerAdImageUrl}")` }}
      >
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-[#fffaf4]/95 via-[#fffaf4]/70 to-[#3b1e2f]/80 p-6">
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
          <div className="space-y-4 text-white">
            <div className="rounded-full bg-primary px-4 py-3 text-center text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
              Explore the Edit
            </div>
            <p className="text-center text-[length:var(--text-token-4xs)] uppercase tracking-widest text-white/85">
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
  productName,
  onClose,
  onOpenStory,
}: {
  stories: LifestyleRiverStory[];
  openStoryId: string | null;
  productName: string;
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
      className="fixed inset-0 z-[100] bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Story reader"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={scrollRef}
        className="absolute inset-0 mx-auto flex h-[100dvh] w-full max-w-[1360px] flex-col overflow-y-auto bg-background shadow-2xl sm:inset-y-6 sm:h-auto sm:rounded-[8px]"
      >
        <div className="sticky top-0 z-[110] flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              {productName} Reader
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
                        {getLifestyleKindLabel(kind, story)}
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
  onOpenStory,
  onShowFollowedBrands,
}: {
  stories: LifestyleRiverStory[];
  profile: LifestyleRiverProfile;
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
      <div className="flex snap-x gap-3 overflow-x-auto p-4 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-0 md:divide-x md:divide-border md:overflow-visible md:p-0 md:[scrollbar-width:auto] xl:grid-cols-4 [&::-webkit-scrollbar]:hidden md:[&::-webkit-scrollbar]:block">
        {modules.map((module) => (
          <button
            key={module.label}
            type="button"
            onClick={module.onClick}
            className="group flex min-h-[150px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-[8px] border border-border p-4 text-left transition-colors hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-[48vw] md:min-h-[144px] md:w-auto md:rounded-none md:border-0 xl:min-w-0"
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
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section className={cn("min-w-0 overflow-hidden rounded-[8px] border border-border p-4", className)}>
      <div className="hidden lg:block">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          {title}
        </p>
      </div>
      <button
        type="button"
        className="flex w-full min-w-0 items-start justify-between gap-3 overflow-hidden text-left lg:hidden"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1 overflow-hidden">
          <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            {title}
          </span>
          <span className="mt-1 line-clamp-2 block max-w-full break-words text-xs font-normal normal-case tracking-normal text-muted-foreground lg:hidden">
            {summary}
          </span>
        </span>
        <ChevronDown
          className={cn("mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform lg:hidden", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <div className={cn("mt-4 lg:block", open ? "block" : "hidden")}>{children}</div>
    </section>
  );
}

function LifestyleLeftSidebar({
  profile,
  topStories,
  topics,
  brands,
  activeBrandFilters,
  collectionLabels,
  onToggleBrandFilter,
  onClearBrandFilters,
  onFollowTopic,
}: {
  profile: LifestyleRiverProfile;
  topStories: LifestyleRiverStory[];
  topics: { name: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  activeBrandFilters: string[];
  collectionLabels: string[];
  onToggleBrandFilter: (brandName: string) => void;
  onClearBrandFilters: () => void;
  onFollowTopic: (topic: string) => void;
}) {
  const activeTopicSummary = profile.followedTopics.slice(0, 3).join(", ");
  const brandStoryCount = brands.reduce((total, brand) => total + brand.count, 0);
  const brandSummary =
    activeBrandFilters.length > 0
      ? `${activeBrandFilters.length} selected`
      : `All brands · ${brandStoryCount} stories`;
  const topicSummary = activeTopicSummary || `${topics.length} topics`;
  const collectionSummary = `${collectionLabels.length} collections`;

  return (
    <aside
      className="space-y-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
      aria-label="Lifestyle discovery sidebar"
    >
      <MobileCollapsibleSidebarCard
        title="Your Daily Edit"
        summary={topStories[0]?.title || "Top stories ready"}
        className="hidden lg:block"
      >
        <div className="space-y-3">
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
      </MobileCollapsibleSidebarCard>

      <MobileCollapsibleSidebarCard title="Filter Brands" summary={brandSummary}>
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
            ? `Showing ${activeBrandFilters.length} selected brand${activeBrandFilters.length === 1 ? "" : "s"}.`
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
          <p className="text-xs text-muted-foreground">
            Saved stories and more-like-this actions tune these collections in the prototype.
          </p>
        </div>
      </MobileCollapsibleSidebarCard>
    </aside>
  );
}

function LifestyleRiverHomePage({
  activeFilter,
  destination,
  onRiverReset,
  onBrandFilterChange,
  onSelectedBrandChange,
}: {
  activeFilter: string;
  destination: DestinationMode;
  onRiverReset?: () => void;
  onBrandFilterChange?: () => void;
  onSelectedBrandChange?: (brand: { name: string; slug: string } | null) => void;
}) {
  const config = destinationConfigs[destination];
  const [profile, setProfile] = React.useState<LifestyleRiverProfile>(config.initialProfile);
  const [demoState, setDemoState] = React.useState<LifestyleDemoState>(initialLifestyleDemoState);
  const [activeBrandFilters, setActiveBrandFilters] = React.useState<string[]>([]);
  const [openStoryId, setOpenStoryId] = React.useState<string | null>(null);
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(8);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const activeStoryPool = React.useMemo(() => getLifestyleDemoStoryPool(demoState, config), [config, demoState]);
  const rankedStories = React.useMemo(
    () => rankLifestyleRiver(activeStoryPool, profile, demoState, config),
    [activeStoryPool, config, demoState, profile]
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

    return config.sourceNotes.map((note) => ({
      name: note.brand,
      slug: note.brandSlug,
      count: counts[note.brand] ?? 0,
    }));
  }, [activeStoryPool, config.sourceNotes]);

  React.useEffect(() => {
    const selectedBrand = activeBrandFilters.length === 1
      ? sidebarBrands.find((brand) => brand.name === activeBrandFilters[0]) ?? null
      : null;
    onSelectedBrandChange?.(selectedBrand ? { name: selectedBrand.name, slug: selectedBrand.slug } : null);
  }, [activeBrandFilters, onSelectedBrandChange, sidebarBrands]);

  React.useEffect(() => {
    setVisibleCount(8);
  }, [activeBrandFilters, activeFilter, demoState.contentDay, demoState.daypart]);

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

  const mergeUnique = (items: string[], nextItems: string[]) =>
    Array.from(new Set([...items, ...nextItems]));

  const resetDemo = () => {
    setProfile(config.initialProfile);
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
    setProfile((current) => ({
      ...current,
      followedBrands: mergeUnique(current.followedBrands, [brandName]),
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
          collectionLabels={config.collectionLabels}
          onToggleBrandFilter={toggleBrandFilter}
          onClearBrandFilters={clearBrandFilters}
          onFollowTopic={followTopic}
        />

        <main className="space-y-4" aria-label={config.riverLabel}>
          {leadStory ? (
            <>
              <LifestyleRiverCard
                story={leadStory}
                saved={profile.savedIds.includes(leadStory.id)}
                onOpen={() => setOpenStoryId(leadStory.id)}
                onSave={() => toggleSaved(leadStory)}
                onMoreLikeThis={() => boostStory(leadStory)}
                onFollowBrand={() => followBrand(leadStory.brand)}
                onHide={() => hideStory(leadStory.id)}
                featured
              />

              {riverStories.map((story, index) => {
                const storyPosition = index + 2;
                const shouldShowAdAfterStory = storyPosition % 5 === 0;
                const adMatch = shouldShowAdAfterStory
                  ? getContextualAdForSlot({
                      destination,
                      slotIndex: storyPosition / 5 - 1,
                      profile,
                      demoState,
                      config,
                      activeFilter,
                      stories: visibleStories,
                    })
                  : null;

                return (
                  <React.Fragment key={story.id}>
                    <LifestyleRiverCard
                      story={story}
                      saved={profile.savedIds.includes(story.id)}
                      onOpen={() => setOpenStoryId(story.id)}
                      onSave={() => toggleSaved(story)}
                      onMoreLikeThis={() => boostStory(story)}
                      onFollowBrand={() => followBrand(story.brand)}
                      onHide={() => hideStory(story.id)}
                    />
                    {adMatch ? (
                      <ContextualRiverAdCard
                        ad={adMatch.ad}
                        score={adMatch.score}
                        slotNumber={storyPosition / 5}
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
              {config.dataSourceCopy}
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
        productName={config.productName}
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
        config={config}
        activeFilter={activeFilter}
        stories={visibleStories}
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
            Most popular {config.storyRiverLabel}, tuned by what you do next.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            A continuously ranked {config.productName} feed across {config.brandSummary}
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
  const [selectedBrand, setSelectedBrand] = React.useState<{ name: string; slug: string } | null>(null);
  const selectedBrandTheme = React.useMemo(
    () => getSelectedBrandTheme(selectedBrand, brand),
    [brand, selectedBrand]
  );
  const selectedBrandCssVars = React.useMemo(
    () => selectedBrandTheme ? brandToCssVars(selectedBrandTheme) : undefined,
    [selectedBrandTheme]
  );
  const destinationContentRef = React.useRef<HTMLDivElement | null>(null);
  const isDestinationRiver = brand.slug === "hearst-all" || brand.slug === "hearst-lifestyle" || brand.slug === "hearst-plus" || brand.slug === "hearst-flux" || brand.slug === "hearst-ew";
  const destinationMode = getDestinationMode(brand.slug);
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

  return (
    <div
      className="min-h-screen font-brand bg-background"
      data-filter-brand={selectedBrand?.slug}
      style={selectedBrandCssVars as React.CSSProperties | undefined}
    >
      {/* Utility Bar — full width */}
      <UtilityBar />

      {/* Main Nav — full width background, content constrained */}
      <MainNav
        brandSlug={brand.slug}
        activeFilter={activeLifestyleFilter}
        onFilterChange={handleLifestyleFilterChange}
        selectedBrand={selectedBrand}
      />

      {/* Page Body — constrained by the shared PageContainer */}
      <PageContainer className={cn("relative", isDestinationRiver ? "pt-0" : "pt-8 lg:pt-12")}>
        {showGridOverlay && <GridOverlay />}
        <div
          ref={isDestinationRiver ? destinationContentRef : undefined}
          className={cn("relative scroll-mt-12", isDestinationRiver ? "space-y-8" : "space-y-12 lg:space-y-16")}
        >
          {isDestinationRiver ? (
            <LifestyleRiverHomePage
              activeFilter={activeLifestyleFilter}
              destination={destinationMode}
              onRiverReset={anchorDestinationContent}
              onBrandFilterChange={anchorPageToTop}
              onSelectedBrandChange={setSelectedBrand}
            />
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
