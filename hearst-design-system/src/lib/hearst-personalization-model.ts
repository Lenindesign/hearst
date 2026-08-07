import type {
  LifestyleRiverProfile,
  LifestyleRiverStory,
} from "@/components/lifestyle-river-types";
import {
  getLifestyleCardKind,
  lifestyleDefaultLeadStoryId,
  type LifestyleCardKind,
} from "@/components/hearst-plus/story-presentation-model";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
import {
  getHearstBrandSection,
  hearstReaderSectionLabels,
  type HearstDestinationMode,
} from "@/lib/hearst-routes";
import { getRecommendationReason } from "@/lib/recommendation-reason";
import type { VisitDaypart } from "@/lib/visit-context";

export type DestinationMode = HearstDestinationMode;

export type LifestyleDemoDaypart = VisitDaypart;

export type LifestyleDemoState = {
  daypart: LifestyleDemoDaypart;
  returnHours: number;
  contentDay: "today" | "nextDay";
  previousLeadId?: string;
  isSimulated: boolean;
};

export type DestinationSourceNote = {
  brand: string;
  brandSlug: string;
  feedCount: number;
  importedCount: number;
  selectedCount: number;
};

export type DestinationDaypart = {
  label: string;
  time: string;
  description: string;
  preferredTopics: string[];
  preferredKinds: LifestyleCardKind[];
  preferredTags: string[];
};

export type DestinationConfig = {
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
  dayparts: Record<LifestyleDemoDaypart, DestinationDaypart>;
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

export type OnboardingPreferenceResult = {
  interests: string[];
  brands: string[];
  tags: string[];
};

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

const allDefaultLeadStoryId =
  "country-living-home-design-decorating-ideas-a71717114-joydrenching-kitchen-trend-2026";

export const demoDaypartReturnHours: Record<LifestyleDemoDaypart, number> = {
  morning: 0,
  afternoon: 5,
  evening: 10,
  lateNight: 14,
};

const lifestyleDemoDayparts: Record<LifestyleDemoDaypart, DestinationDaypart> = {
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

export const destinationPageNames: Record<DestinationMode, string> = {
  all: "Hearst+",
  lifestyle: "Hearst Lifestyle",
  autos: "Hearst Autos",
  flux: "Hearst Fashion & Luxury",
  ew: "Hearst Enthusiast & Wellness",
};

export function getDestinationCategoryDocumentTitle(
  destination: DestinationMode,
  filter: string,
) {
  return `${filter} | ${destinationPageNames[destination]}`;
}

export function mergeUnique(items: string[], nextItems: string[]) {
  return Array.from(new Set([...items, ...nextItems]));
}

function getOnboardingSignalTags(
  stories: LifestyleRiverStory[],
  result: OnboardingPreferenceResult,
) {
  const normalizedInterests = new Set(
    result.interests.map((interest) => interest.toLowerCase()),
  );
  const selectedBrands = new Set(result.brands);
  const signalTags = stories
    .filter((story) => {
      const topicMatch =
        normalizedInterests.has(story.topic.toLowerCase())
        || result.interests.some((interest) =>
          story.topic.startsWith(`${interest} `),
        );
      return topicMatch || selectedBrands.has(story.brand);
    })
    .flatMap((story) => story.tags);

  return mergeUnique(result.tags, signalTags).slice(0, 16);
}

export function applyOnboardingPreferences(
  profile: LifestyleRiverProfile,
  stories: LifestyleRiverStory[],
  result: OnboardingPreferenceResult,
): LifestyleRiverProfile {
  const signalTags = getOnboardingSignalTags(stories, result);

  return {
    ...profile,
    followedTopics:
      result.interests.length > 0 ? result.interests : profile.followedTopics,
    followedBrands:
      result.brands.length > 0 ? result.brands : profile.followedBrands,
    savedTags: signalTags,
    boostedTags: signalTags,
    personalizationMode: "onboarding",
  };
}

export const baseDestinationConfigs: Record<DestinationMode, DestinationConfig> = {
  all: {
    mode: "all",
    brandSlug: "hearst-all",
    productName: "Hearst Magazines",
    riverLabel: "Personalized Hearst story river",
    storyRiverLabel: "Hearst stories",
    filters: ["For You", "Style", "Reviews", "Fitness", "Cars", "Home", "Videos", "Communities", "Shopping", "Games"],
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
    filters: ["For You", "Food", "Home", "Wellness", "Style", "Shopping", "Family", "Entertainment"],
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
    filters: ["For You", "News", "Reviews", "Buying Guides", "EVs", "Racing", "Trucks", "Classics"],
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
    filters: ["For You", "Style", "Beauty", "Design", "Culture", "Shopping", "Events", "Travel"],
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
    filters: ["For You", "Fitness", "Wellness", "Gear", "Tech", "Adventure", "Nutrition", "Life"],
    stories: [],
    sourceNotes: [],
    initialProfile: initialEWProfile,
    dayparts: ewDemoDayparts,
    nextDayTopics: ["Fitness", "Wellness", "Gear", "Tech"],
    brandSummary:
      "Best Products, Bicycling, Men's Health, Oprah Daily, Popular Mechanics, Runner's World, and Women's Health.",
    dataSourceCopy:
      "public E&W brand RSS metadata from the requested health, gear, fitness, wellness, and science brands, filtered to stories with real images.",
    collectionLabels: ["Training plan", "Gear shortlist", "Wellness queue"],
  },
};

export function createDestinationConfigs(
  staticData?: HearstDestinationStaticData,
) {
  if (!staticData) return baseDestinationConfigs;

  return Object.fromEntries(
    Object.entries(baseDestinationConfigs).map(([mode, config]) => [
      mode,
      { ...config, ...staticData[mode as DestinationMode] },
    ]),
  ) as Record<DestinationMode, DestinationConfig>;
}

export function getDestinationMode(brandSlug: string): DestinationMode {
  if (brandSlug === "hearst-all") return "all";
  if (brandSlug === "hearst-ew") return "ew";
  if (brandSlug === "hearst-flux") return "flux";
  if (brandSlug === "hearst-plus") return "autos";
  return getHearstBrandSection(brandSlug);
}

export function getStoryDestinationMode(
  brandSlug: string,
): Exclude<DestinationMode, "all"> {
  return getHearstBrandSection(brandSlug);
}

export function getReaderDestinationLabel(
  mode: Exclude<DestinationMode, "all">,
) {
  return hearstReaderSectionLabels[mode];
}

export function insertVideosFilter(filters: string[]) {
  if (filters.includes("Videos")) return filters;

  const carsIndex = filters.indexOf("Cars");
  if (carsIndex >= 0) {
    return [
      ...filters.slice(0, carsIndex + 1),
      "Videos",
      ...filters.slice(carsIndex + 1),
    ];
  }

  const shoppingIndex = filters.indexOf("Shopping");
  if (shoppingIndex >= 0) {
    return [
      ...filters.slice(0, shoppingIndex),
      "Videos",
      ...filters.slice(shoppingIndex),
    ];
  }

  const savedIndex = filters.indexOf("Saved");
  if (savedIndex >= 0) {
    return [
      ...filters.slice(0, savedIndex),
      "Videos",
      ...filters.slice(savedIndex),
    ];
  }

  return [...filters, "Videos"];
}

const hotRodGlobalNavLinks = [
  "For You",
  "EVs",
  "Performance",
  "Reviews",
  "Trucks",
  "Racing",
  "Buying Guides",
  "Events",
  "Videos",
];

export function getBrandContextualFilters(
  brandSlug: string,
  stories: LifestyleRiverStory[],
  includeVideos = false,
) {
  if (brandSlug === "hot-rod") return hotRodGlobalNavLinks;

  const topicCounts = stories
    .filter((story) => story.brandSlug === brandSlug)
    .reduce<Record<string, number>>((counts, story) => {
      counts[story.topic] = (counts[story.topic] ?? 0) + 1;
      return counts;
    }, {});

  const topics = Object.entries(topicCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([topic]) => topic);

  const brandSections =
    brandSlug === "car-and-driver"
      ? ["Shop New Cars", "Shop Used Cars", "Research Cars"]
      : [];
  const filters = ["For You", ...topics, ...brandSections];
  return includeVideos ? insertVideosFilter(filters) : filters;
}

export function getBrandRouteInfo(
  sourceNotes: readonly DestinationSourceNote[],
  brandSlug?: string,
) {
  if (!brandSlug) return null;
  const note = sourceNotes.find((brand) => brand.brandSlug === brandSlug);
  return note ? { name: note.brand, slug: note.brandSlug } : null;
}

function getLifestyleTimeOfDayScore(
  story: LifestyleRiverStory,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
) {
  const daypart = config.dayparts[demoState.daypart];
  const kind = getLifestyleCardKind(story);
  let score = 0;

  if (
    daypart.preferredTopics.some(
      (topic) =>
        story.topic === topic || story.topic.startsWith(`${topic} `),
    )
  ) {
    score += 16;
  }
  if (daypart.preferredKinds.includes(kind)) score += 10;
  if (story.tags.some((tag) => daypart.preferredTags.includes(tag))) score += 8;

  return score;
}

function getLifestyleRecencyScore(
  story: LifestyleRiverStory,
  demoState: LifestyleDemoState,
) {
  const freshSinceLastVisit =
    demoState.returnHours > 0 && story.age <= demoState.returnHours + 2;
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

export function getLifestyleScoreBreakdown(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
) {
  const popularity = story.popularity;
  const isOnboardingPersonalized =
    profile.personalizationMode === "onboarding";
  const followedTopicMatch = profile.followedTopics.some(
    (topic) =>
      story.topic === topic || story.topic.startsWith(`${topic} `),
  );
  const followedTopic = followedTopicMatch
    ? isOnboardingPersonalized
      ? 34
      : 18
    : 0;
  const followedBrand = profile.followedBrands.includes(story.brand) ? 16 : 0;
  const savedTagMatches = story.tags.filter((tag) =>
    profile.savedTags.includes(tag),
  ).length;
  const boostedTagMatches = story.tags.filter((tag) =>
    profile.boostedTags.includes(tag),
  ).length;
  const savedTag =
    savedTagMatches > 0
      ? (isOnboardingPersonalized ? 24 : 14)
        + Math.min(24, (savedTagMatches - 1) * 6)
      : 0;
  const moreLikeThis =
    boostedTagMatches > 0
      ? (isOnboardingPersonalized ? 34 : 22)
        + Math.min(32, (boostedTagMatches - 1) * 8)
      : 0;
  const savedStory = profile.savedIds.includes(story.id) ? 6 : 0;
  const recency = getLifestyleRecencyScore(story, demoState);
  const timeOfDay = getLifestyleTimeOfDayScore(story, demoState, config);
  const isFirstMorningVisit =
    demoState.contentDay === "today"
    && demoState.returnHours === 0
    && demoState.daypart === "morning";
  const defaultLead =
    !isOnboardingPersonalized
    && config.defaultLeadStoryId === story.id
    && isFirstMorningVisit
      ? 24
      : 0;
  const returnFreshness =
    demoState.returnHours > 0
    && story.id !== demoState.previousLeadId
    && story.age <= demoState.returnHours + 4
      ? 24
      : 0;
  const nextDayNovelty =
    demoState.contentDay === "nextDay"
    && story.id !== demoState.previousLeadId
      ? config.nextDayTopics.includes(story.topic)
        ? 28
        : 10
      : 0;
  const repeatLeadPenalty =
    demoState.returnHours > 0 && story.id === demoState.previousLeadId
      ? -140
      : 0;
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
      popularity
      + followedTopic
      + followedBrand
      + savedTag
      + moreLikeThis
      + savedStory
      + recency
      + timeOfDay
      + defaultLead
      + returnFreshness
      + nextDayNovelty
      + repeatLeadPenalty
      + hidden,
  };
}

export function getLifestyleScore(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
) {
  return getLifestyleScoreBreakdown(story, profile, demoState, config).total;
}

export function getLifestyleStrategyReason(
  story: LifestyleRiverStory,
  breakdown: ReturnType<typeof getLifestyleScoreBreakdown>,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
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

export function getLifestyleRecommendationReason(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
) {
  const breakdown = getLifestyleScoreBreakdown(
    story,
    profile,
    demoState,
    config,
  );
  const followedTopic = profile.followedTopics.find(
    (topic) =>
      story.topic === topic || story.topic.startsWith(`${topic} `),
  );
  const followedBrand = profile.followedBrands.includes(story.brand)
    ? story.brand
    : undefined;

  return getRecommendationReason({
    freshSinceLastVisit: breakdown.returnFreshness > 0,
    newEdition: breakdown.nextDayNovelty > 0,
    followedTopic,
    followedBrand,
    daypart: breakdown.timeOfDay > 0 ? demoState.daypart : undefined,
    editorSelected: breakdown.defaultLead > 0,
  });
}

export function rankLifestyleRiver(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
) {
  const scored = stories
    .filter((story) => !profile.hiddenIds.includes(story.id))
    .map((story) => ({
      ...story,
      score: getLifestyleScore(story, profile, demoState, config),
    }))
    .sort((a, b) => b.score - a.score);

  const ranked: typeof scored = [];
  const pool = [...scored];

  while (pool.length) {
    const recent = ranked.slice(-2);
    const nextIndex = pool.findIndex((story) => {
      const sameBrand =
        recent.length === 2
        && recent.every((item) => item.brand === story.brand);
      const sameTopic =
        recent.length === 2
        && recent.every((item) => item.topic === story.topic);
      return !sameBrand && !sameTopic;
    });
    ranked.push(pool.splice(nextIndex === -1 ? 0 : nextIndex, 1)[0]);
  }

  return ranked;
}

export function getLifestyleDemoStoryPool(
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
) {
  if (demoState.contentDay === "today" || !demoState.isSimulated) {
    return config.stories;
  }

  const nextDayStories = config.stories
    .filter(
      (story, index) =>
        index % 2 === 1 || config.nextDayTopics.includes(story.topic),
    )
    .map(
      (story) =>
        ({
          ...story,
          age: Math.max(0, story.age - 24),
          popularity: config.nextDayTopics.includes(story.topic)
            ? Math.min(100, story.popularity + 8)
            : story.topic.startsWith("Food") || story.topic === "Reviews"
              ? Math.max(1, story.popularity - 8)
              : Math.max(1, story.popularity - 2),
          signal: story.age <= 24 ? "Trending" : story.signal,
        }) satisfies LifestyleRiverStory,
    );

  return nextDayStories.length >= 80 ? nextDayStories : config.stories;
}
