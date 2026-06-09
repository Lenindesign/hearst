"use client";

import React from "react";
import { BarbellIcon } from "@phosphor-icons/react/dist/csr/Barbell";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { BookmarkSimpleIcon } from "@phosphor-icons/react/dist/csr/BookmarkSimple";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { CarIcon } from "@phosphor-icons/react/dist/csr/Car";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CompassIcon } from "@phosphor-icons/react/dist/csr/Compass";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/csr/DotsThree";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/csr/EyeSlash";
import { FolderPlusIcon } from "@phosphor-icons/react/dist/csr/FolderPlus";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/csr/ForkKnife";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { NewspaperIcon } from "@phosphor-icons/react/dist/csr/Newspaper";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { ShareNetworkIcon } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { SparkleIcon } from "@phosphor-icons/react/dist/csr/Sparkle";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import { WrenchIcon } from "@phosphor-icons/react/dist/csr/Wrench";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brands } from "@/lib/brands";
import { brandLogos } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

type FeedItem = {
  id: string;
  brandSlug: string;
  topic: string;
  title: string;
  summary: string;
  body: string[];
  image: string;
  readTime: string;
  signal: string;
  tags: string[];
  variant?: "lead" | "compact";
};

type Collection = {
  title: string;
  count: string;
  brandSlugs: string[];
  accent: string;
};

type ReaderProfile = {
  followedTopics: string[];
  followedBrands: string[];
  savedTags: string[];
  savedCollections: string[];
  recentlyReadIds: string[];
  mutedTopics: string[];
  timeOfDay: "morning" | "afternoon" | "evening";
};

type PersonalizedFeedItem = FeedItem & {
  personalizationScore: number;
  scoreBreakdown: string[];
};

type FeedFeedbackAction = "save" | "collect" | "hide";

const H = "https://hips.hearstapps.com/hmg-prod/images/";

function img(id: string, query = "resize=900:*") {
  return `${H}${id}?${query}`;
}

const feedItems: FeedItem[] = [
  {
    id: "dinner-reset",
    brandSlug: "delish",
    topic: "Dinner Ideas",
    title: "A warm-weather dinner plan that does not feel like meal prep",
    summary: "Fast recipes, one-pan shortcuts, and a smart grocery path for the first patio-weather week.",
    body: [
      "Start with the main dish, then let the rest of the week work around it. A glossy batch of grilled chicken gives you dinner on the first night, lunch over greens the next day, and enough flavor to anchor rice bowls without tasting repeated.",
      "The supporting pieces stay simple: lime wedges, crisp cucumbers, a fast corn salad, and one sauce that can move from plate to sandwich to midnight snack. The plan works because each part is useful on its own.",
      "By the end of the shop, the list is short and the meals still feel loose. That is the trick for summer cooking: prepare enough to make dinner easy, but not so much that the week starts to feel scheduled.",
      "Cook the chicken once, while the grill is already hot, and save the smaller pieces for chopped salads or tacos. If the weather turns, the same marinade works under a broiler or in a cast-iron pan.",
      "For sides, choose ingredients that can survive a few days without getting tired. Corn, cabbage, cucumbers, herbs, and sturdy greens hold up better than delicate lettuce, and they give every plate a different texture.",
      "The grocery list stays deliberately narrow: protein, one crunchy vegetable, one grain or tortilla, fresh citrus, herbs, and one creamy element. That gives you enough range for dinner without sending you back to the store midweek.",
      "The last night is the easiest one. Pull the remaining chicken, warm it with a spoonful of sauce, and serve it over rice with whatever crisp vegetables are left. It feels like a new dinner because the assembly changes, not because the prep starts over.",
    ],
    image: img("grilled-coca-cola-chicken-index-web-622-jg-del069925-687fdcd9ae465.jpg", "crop=1xw:0.78xh;center,top&resize=1200:*"),
    readTime: "5 min",
    signal: "Because you saved summer recipes",
    tags: ["Recipes", "Weeknight", "Summer"],
    variant: "lead",
  },
  {
    id: "wellness-strength",
    brandSlug: "mens-health",
    topic: "Fitness",
    title: "The strength plan that fits around a full calendar",
    summary: "Three short sessions, two recovery cues, and enough progression to keep the habit alive.",
    body: [
      "The plan starts with the constraint most people actually have: time. Three focused lifts a week, each built around one main movement, can still move strength forward when the sets are honest and the recovery is planned.",
      "The work alternates pressure and relief. Push hard on the days with sleep behind you, cut volume when the week is crowded, and keep the habit intact instead of trying to rescue missed workouts with one punishing session.",
      "Progress shows up in smaller signals before it shows up in the mirror: cleaner reps, steadier breathing, and the moment a weight that used to feel heavy becomes routine.",
    ],
    image: img("cthfwkzv-6909141a38163.jpg", "crop=1xw:0.56xh;0,0.34xh&resize=1000:*"),
    readTime: "7 min",
    signal: "New in your wellness graph",
    tags: ["Strength", "Training"],
  },
  {
    id: "car-brief",
    brandSlug: "car-and-driver",
    topic: "Cars",
    title: "The small-car comparison worth reading before shopping",
    summary: "A route-tested look at price, comfort, fuel economy, and the cars that still feel sharp.",
    body: [
      "Small cars still make the clearest argument on a normal road. They ask less of the driver in traffic, cost less to run, and reveal quickly which cabin details matter after the showroom lights are gone.",
      "The comparison starts with the basics: sightlines, seat comfort, highway noise, real fuel economy, and whether the infotainment gets easier or more annoying on the third day.",
      "The winner is not only the cheapest or the quickest. It is the car that keeps the everyday compromises low while still giving the driver a reason to take the long way home.",
    ],
    image: img("76471936-3e6b-463e-9551-cb792858ec07.jpg", "crop=1xw:0.63xh;center,top&resize=1000:*"),
    readTime: "9 min",
    signal: "You follow hybrid and compact cars",
    tags: ["Shopping", "Hybrids"],
  },
  {
    id: "home-tour",
    brandSlug: "house-beautiful",
    topic: "Home",
    title: "A hosting-ready entry that makes antiques feel personal",
    summary: "A room-by-room read with ideas for warmth, seating, and visual rhythm.",
    body: [
      "The entry works because it does not treat antiques as display pieces. The table has a job, the seating invites a pause, and the objects feel collected through use rather than arranged for a photograph.",
      "Texture carries most of the warmth: old wood against crisp walls, brass near soft upholstery, and enough negative space to keep the room from turning into a showroom.",
      "The lesson is practical. Start with one substantial piece, give it breathing room, then add smaller objects only when they change how the room is used.",
    ],
    image: img("hbx030124jeremiahbrent-002-65f1e164f2a25.jpg", "crop=1xw:0.72xh;0,0.20xh&resize=1000:*"),
    readTime: "6 min",
    signal: "Related to your Kitchen Remodel collection",
    tags: ["House Tours", "Decor"],
  },
  {
    id: "culture-rocky",
    brandSlug: "esquire",
    topic: "Culture",
    title: "A profile that treats style as a point of view",
    summary: "Not a celebrity recap. A read on image, persona, and the choices behind the frame.",
    body: [
      "The profile is strongest when it treats style as evidence. A jacket, a haircut, a photograph, and a pause in an interview can all point to the same question: what does a public figure choose to reveal?",
      "Rather than ranking looks, the piece follows the decisions around them. The clothes become a way to read confidence, performance, privacy, and the pressure of being watched.",
      "That approach keeps the story from becoming a recap. It gives the reader a reason to stay with the person, not just the image.",
    ],
    image: img("index-69753a4e634e9.jpg", "crop=0.996xw:1xh;center,top&resize=1000:*"),
    readTime: "11 min",
    signal: "Your weekend long-read pick",
    tags: ["Profiles", "Style"],
  },
  {
    id: "lab-tested",
    brandSlug: "good-housekeeping",
    topic: "Home Lab",
    title: "The beauty tool worth buying once, not twice",
    summary: "A scan-friendly lab note with what worked, what overheated, and what lasted.",
    body: [
      "A useful test starts after the first impression. The tool has to feel good in the hand, hold heat evenly, and survive the kind of rushed morning that makes bad controls obvious.",
      "The lab notes favor repeatable details: cord length, surface temperature, shutoff timing, attachment fit, and whether the result holds after a few hours outside the bathroom mirror.",
      "The best pick is not the flashiest. It is the one that performs consistently enough that buying it once feels like the point.",
    ],
    image: img("be51be81-ae88-4eec-913f-37028692ca0a.png", "crop=1.00xw:0.835xh;0,0.0759xh&resize=1000:*"),
    readTime: "4 min",
    signal: "Matched to your shopping saves",
    tags: ["Tested", "Shopping"],
  },
  {
    id: "mechanics-fusion",
    brandSlug: "popular-mechanics",
    topic: "Technology",
    title: "The fusion story to understand before it becomes a headline",
    summary: "A plain-language explainer on the science, the funding, and what still has to work.",
    body: [
      "The promise of fusion is easy to overstate and too important to ignore. The useful question is not whether it sounds futuristic, but which parts of the engineering are moving from theory into repeatable tests.",
      "The explainer follows the chain from plasma control to materials, then to the money behind the newest facilities. Each step has a different risk, and each one changes the timeline readers usually hear.",
      "Understanding those gaps makes the next breakthrough easier to judge. It also keeps the story grounded when the headlines get louder.",
    ],
    image: img("3d-rendering-of-core-of-a-fusion-reactor-royalty-free-image-1771366366.pjpeg", "crop=1xw:0.75xh;center,top&resize=1000:*"),
    readTime: "8 min",
    signal: "Because you follow future tech",
    tags: ["Science", "Energy"],
  },
  {
    id: "fashion-front-row",
    brandSlug: "harpers-bazaar",
    topic: "Fashion",
    title: "A runway review that reads like a letter of intent",
    summary: "The collection, the city, the references, and why the first look mattered.",
    body: [
      "The first look sets the terms. Before the notes and the after-party photos, it tells the room what kind of season the designer wants to make: severe, romantic, practical, or slightly unresolved.",
      "This review follows the collection through fabric, proportion, and casting rather than treating the runway as a mood board. The city matters too, because the clothes borrow energy from where they are shown.",
      "By the final exit, the question is less about which pieces will sell and more about which ideas will travel.",
    ],
    image: img("cc352106-e4fc-4833-b3d2-f7a549da0522.gif", "crop=1xw:0.888888888889xh;center,top&resize=1000:*"),
    readTime: "6 min",
    signal: "Trending with fashion readers",
    tags: ["Runway", "Los Angeles"],
  },
];

const dailyBrief = [
  { icon: CalendarBlankIcon, label: "Morning Brief", value: "8 stories in 5 minutes" },
  { icon: SparkleIcon, label: "Best Stories You Missed", value: "3 new since last night" },
  { icon: BookmarkSimpleIcon, label: "Continue Reading", value: "2 saved stories waiting" },
];

const trendItems = [
  { brandSlug: "popular-mechanics", title: "What to know about home battery backup", lift: "+41%" },
  { brandSlug: "delish", title: "Fast dinners for the first heat wave", lift: "+33%" },
  { brandSlug: "car-and-driver", title: "Hybrid SUVs people are comparing now", lift: "+28%" },
  { brandSlug: "cosmopolitan", title: "The pop culture interview readers keep sharing", lift: "+21%" },
  { brandSlug: "good-housekeeping", title: "Small laundry room fixes that work", lift: "+18%" },
];

const collections: Collection[] = [
  { title: "Healthy Meals", count: "18 saves", brandSlugs: ["delish", "good-housekeeping", "womans-day"], accent: "#df4b2f" },
  { title: "Kitchen Remodel", count: "12 saves", brandSlugs: ["house-beautiful", "veranda", "elle-decor"], accent: "#6f6d98" },
  { title: "Weekend Drive", count: "9 saves", brandSlugs: ["car-and-driver", "road-and-track", "autoweek"], accent: "#1f6386" },
];

const readerProfile: ReaderProfile = {
  followedTopics: ["Dinner Ideas", "Cars", "Home", "Fitness", "Technology"],
  followedBrands: ["delish", "mens-health", "car-and-driver", "house-beautiful", "popular-mechanics"],
  savedTags: ["Recipes", "Weeknight", "Summer", "Hybrids", "Shopping", "House Tours"],
  savedCollections: ["Healthy Meals", "Kitchen Remodel", "Weekend Drive"],
  recentlyReadIds: ["fashion-front-row"],
  mutedTopics: [],
  timeOfDay: "morning",
};

const topicInterestMap: Record<string, string[]> = {
  Cars: ["Cars", "Hybrids", "Shopping", "Weekend Drive"],
  "Dinner Ideas": ["Dinner Ideas", "Recipes", "Weeknight", "Summer", "Healthy Meals"],
  Fitness: ["Fitness", "Strength", "Training", "Wellness"],
  Home: ["Home", "Home Lab", "House Tours", "Decor", "Kitchen Remodel"],
  Technology: ["Technology", "Science", "Energy", "Popular Mechanics"],
  Style: ["Fashion", "Style", "Runway"],
};

const collectionInterestMap: Record<string, string[]> = {
  "Healthy Meals": ["Dinner Ideas", "Recipes", "Weeknight", "Summer", "Food"],
  "Kitchen Remodel": ["Home", "House Tours", "Decor", "Home Lab"],
  "Weekend Drive": ["Cars", "Hybrids", "Shopping"],
};

const trendLiftByFeedId: Record<string, number> = {
  "dinner-reset": 33,
  "wellness-strength": 16,
  "car-brief": 28,
  "home-tour": 22,
  "culture-rocky": 21,
  "lab-tested": 18,
  "mechanics-fusion": 41,
  "fashion-front-row": 14,
};

const interestChips = [
  "For You",
  "Dinner Ideas",
  "Cars",
  "Home Projects",
  "Fitness",
  "Style",
  "Technology",
  "Family",
  "Celebrity",
];

const briefTopics = ["Food", "Home", "Wellness", "Cars"];

const quickActions = [
  { icon: CompassIcon, label: "Tune Feed" },
  { icon: PlusIcon, label: "Create Collection" },
  { icon: XIcon, label: "Skip Topic" },
];

const categoryIcons: Record<string, React.ElementType> = {
  Cars: CarIcon,
  Fitness: BarbellIcon,
  "Dinner Ideas": ForkKnifeIcon,
  Home: HouseIcon,
  Technology: WrenchIcon,
  Culture: NewspaperIcon,
};

const communityAvatarLogos: Record<string, string> = {
  "bicycling": "/logos/community-avatars/bicycling.svg",
  "delish": "/logos/community-avatars/delish.jpg",
  "esquire": "/logos/community-avatars/esquire.svg",
  "mens-health": "/logos/community-avatars/mens-health.svg",
  "popular-mechanics": "/logos/community-avatars/popular-mechanics.svg",
  "road-and-track": "/logos/community-avatars/road-and-track.svg",
};

const brandUniverse = Object.keys(brandLogos).map((slug) => {
  const brand = brands.find((item) => item.slug === slug);
  return {
    slug,
    name: brand?.name ?? titleize(slug),
    accent: brand?.colors["1"] ?? "#222222",
  };
});

function titleize(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getBrand(slug: string) {
  const brand = brands.find((item) => item.slug === slug);
  return {
    name: brand?.name ?? titleize(slug),
    accent: brand?.colors["1"] ?? "#222222",
    secondary: brand?.colors["2"] ?? "#f2f2f2",
  };
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function getItemTokens(item: FeedItem) {
  const brand = getBrand(item.brandSlug);
  return new Set([item.id, item.brandSlug, brand.name, item.topic, ...item.tags].map(normalizeValue));
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function removeValues(values: string[], removedValues: string[]) {
  const removed = new Set(removedValues.map(normalizeValue));
  return values.filter((value) => !removed.has(normalizeValue(value)));
}

function itemMatchesInterest(item: FeedItem, interest: string) {
  const tokens = getItemTokens(item);
  const aliases = topicInterestMap[interest] ?? [interest];
  return aliases.some((alias) => tokens.has(normalizeValue(alias)));
}

function getSavedTagMatch(item: FeedItem, profile: ReaderProfile) {
  const tokens = getItemTokens(item);
  return profile.savedTags.find((tag) => tokens.has(normalizeValue(tag)));
}

function collectionMatchesItem(item: FeedItem, collectionTitle: string) {
  const tokens = getItemTokens(item);
  const collection = collections.find((entry) => entry.title === collectionTitle);
  const collectionTokens = [
    collectionTitle,
    ...(collection?.brandSlugs ?? []),
    ...(collectionInterestMap[collectionTitle] ?? []),
  ].map(normalizeValue);

  return collectionTokens.some((token) => tokens.has(token));
}

function getBestCollectionForItem(item: FeedItem) {
  return collections.find((collection) => collectionMatchesItem(item, collection.title))?.title;
}

function getCollectionMatch(item: FeedItem, profile: ReaderProfile) {
  return profile.savedCollections.find((collectionTitle) => collectionMatchesItem(item, collectionTitle));
}

function getFollowedTopicMatch(item: FeedItem, profile: ReaderProfile) {
  return profile.followedTopics.find((topic) => itemMatchesInterest(item, topic));
}

function getRecommendationReason(item: FeedItem, profile: ReaderProfile) {
  const savedTag = getSavedTagMatch(item, profile);
  if (savedTag) return `Because you saved ${savedTag.toLowerCase()}`;

  const collectionTitle = getCollectionMatch(item, profile);
  if (collectionTitle) return `Related to your ${collectionTitle} collection`;

  const followedTopic = getFollowedTopicMatch(item, profile);
  if (followedTopic) return `Because you follow ${followedTopic.toLowerCase()}`;

  if (profile.followedBrands.includes(item.brandSlug)) return `Because you follow ${getBrand(item.brandSlug).name}`;

  if ((trendLiftByFeedId[item.id] ?? 0) > 0) return `Trending among ${getBrand(item.brandSlug).name} readers`;

  return item.signal || "Recommended from your Hearst+ graph";
}

function scoreFeedItem(item: FeedItem, profile: ReaderProfile) {
  const breakdown: string[] = [];
  let score = 10;

  const followedTopic = getFollowedTopicMatch(item, profile);
  if (followedTopic) {
    score += 42;
    breakdown.push(`topic:${followedTopic}`);
  }

  const savedTag = getSavedTagMatch(item, profile);
  if (savedTag) {
    score += 34;
    breakdown.push(`saved:${savedTag}`);
  }

  if (profile.followedBrands.includes(item.brandSlug)) {
    score += 24;
    breakdown.push(`brand:${item.brandSlug}`);
  }

  const collectionTitle = getCollectionMatch(item, profile);
  if (collectionTitle) {
    score += 30;
    breakdown.push(`collection:${collectionTitle}`);
  }

  const trendLift = trendLiftByFeedId[item.id] ?? 0;
  if (trendLift > 0) {
    score += Math.round(trendLift * 0.42);
    breakdown.push(`trending:${trendLift}`);
  }

  if (profile.timeOfDay === "morning" && ["Dinner Ideas", "Fitness", "Cars", "Home", "Home Lab", "Technology"].includes(item.topic)) {
    score += 10;
    breakdown.push("morning");
  }

  if (profile.recentlyReadIds.includes(item.id)) {
    score -= 28;
    breakdown.push("recently-read");
  }

  if (profile.mutedTopics.some((topic) => itemMatchesInterest(item, topic))) {
    score -= 100;
    breakdown.push("muted");
  }

  return { score, breakdown };
}

function getPersonalizedFeed(items: FeedItem[], profile: ReaderProfile): PersonalizedFeedItem[] {
  // Deterministic client-side ranking for the prototype; server event weights can replace these inputs later.
  const ranked = items
    .map((item) => {
      const { score, breakdown } = scoreFeedItem(item, profile);
      return {
        ...item,
        signal: getRecommendationReason(item, profile),
        personalizationScore: score,
        scoreBreakdown: breakdown,
      };
    })
    .sort((a, b) => {
      if (b.personalizationScore !== a.personalizationScore) {
        return b.personalizationScore - a.personalizationScore;
      }

      return a.title.localeCompare(b.title);
    });

  return ranked.map((item, index) => ({
    ...item,
    variant: index === 0 ? "lead" : undefined,
  }));
}

function applyFeedFeedback(profile: ReaderProfile, item: FeedItem, action: FeedFeedbackAction, isActive: boolean): ReaderProfile {
  if (action === "save") {
    return {
      ...profile,
      savedTags: isActive ? uniqueValues([...profile.savedTags, ...item.tags]) : removeValues(profile.savedTags, item.tags),
    };
  }

  if (action === "collect") {
    const collectionTitle = getBestCollectionForItem(item);
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
    mutedTopics: isActive ? uniqueValues([...profile.mutedTopics, item.topic]) : removeValues(profile.mutedTopics, [item.topic]),
  };
}

function ImageFrame({
  src,
  alt,
  className,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative overflow-hidden bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${src})` }}
    >
      {children}
    </div>
  );
}

function BrandAvatar({ slug, size = "md" }: { slug: string; size?: "sm" | "md" | "lg" }) {
  const image = communityAvatarLogos[slug];
  const brand = getBrand(slug);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-white/12 bg-white text-[#222222]",
        size === "sm" && "size-7",
        size === "md" && "size-9",
        size === "lg" && "size-11",
      )}
    >
      {image ? (
        <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      ) : (
        <BrandLogo
          slug={slug}
          className={cn(
            "block [&_svg]:w-auto [&_svg]:text-current",
            size === "sm" && "[&_svg]:h-3 [&_svg]:max-w-5",
            size === "md" && "[&_svg]:h-3.5 [&_svg]:max-w-7",
            size === "lg" && "[&_svg]:h-4 [&_svg]:max-w-8",
          )}
          color={brand.accent}
        />
      )}
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
        "flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-white/12 bg-[#20242b] text-white transition hover:bg-[#2a3038] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ca8ff] md:size-9",
        className,
      )}
    >
      {children}
    </button>
  );
}

function FeedAction({
  icon: Icon,
  label,
  activeLabel,
  title,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  activeLabel?: string;
  title: string;
  onChange?: (isActive: boolean) => void;
}) {
  const [active, setActive] = React.useState(false);
  const displayedLabel = active ? activeLabel ?? label : label;

  return (
    <button
      type="button"
      aria-label={`${displayedLabel} ${title}`}
      aria-pressed={activeLabel ? active : undefined}
      onClick={() => {
        if (!activeLabel) return;

        setActive((current) => {
          const nextActive = !current;
          onChange?.(nextActive);
          return nextActive;
        });
      }}
      className={cn(
        "flex h-12 items-center justify-center gap-2 border-white/10 px-3 text-xs font-extrabold text-[#dbe3ed] transition hover:bg-[#20242b] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#5ca8ff]",
        active && "bg-[#12395f] text-[#d8ecff] hover:bg-[#174a7b]",
      )}
    >
      <Icon className={cn("size-4 text-[#8b96a6]", active && "text-[#5ca8ff]")} weight={active ? "fill" : "bold"} />
      <span>{displayedLabel}</span>
    </button>
  );
}

function BrandPill({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const brand = getBrand(slug);

  return (
    <button
      type="button"
      aria-label={brand.name}
      title={brand.name}
      className={cn(
        "flex h-11 shrink-0 items-center gap-2 rounded-[8px] border border-white/12 bg-[#171a1f] text-[#f4f7fb] transition hover:border-white/24 hover:bg-[#20242b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ca8ff]",
        compact ? "h-10 min-w-0 justify-start pl-[3px] pr-2" : "min-w-[154px] justify-start pl-[3px] pr-3",
      )}
    >
      <BrandAvatar slug={slug} size={compact ? "sm" : "md"} />
      <span className={cn("min-w-0 truncate text-xs font-extrabold", compact ? "max-w-[74px]" : "max-w-[104px]")}>
        {brand.name}
      </span>
    </button>
  );
}

function FeedCard({
  item,
  onOpen,
  onFeedback,
}: {
  item: PersonalizedFeedItem;
  onOpen: () => void;
  onFeedback: (item: PersonalizedFeedItem, action: FeedFeedbackAction, isActive: boolean) => void;
}) {
  const brand = getBrand(item.brandSlug);
  const Icon = categoryIcons[item.topic] ?? NewspaperIcon;
  const isLead = item.variant === "lead";

  return (
    <article className="overflow-hidden rounded-[8px] border border-white/10 bg-[#181b20] shadow-[0_4px_14px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 md:p-5">
        <div className="flex min-w-0 gap-3">
          <BrandAvatar slug={item.brandSlug} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-extrabold text-[#f4f7fb]">{brand.name}</span>
              <span className="size-1 rounded-full bg-[#647181]" />
              <span className="text-xs font-bold text-[#b8c3d1]">{item.topic}</span>
              <span className="text-xs text-[#95a0ad]">{item.readTime} read</span>
            </div>
            <p className="mt-1 max-w-prose text-xs font-bold leading-5 text-[#aab5c3]">{item.signal}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" className="hidden h-10 rounded-[8px] border-white/12 bg-[#20242b] px-3 text-xs font-extrabold text-[#f4f7fb] hover:bg-[#2a3038] hover:text-white sm:inline-flex">
            Follow
          </Button>
          <IconButton label={`More options for ${item.title}`} className="size-10">
            <DotsThreeIcon className="size-4" weight="bold" />
          </IconButton>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <button
          type="button"
          aria-label={`Open ${item.title}`}
          data-testid={`open-story-${item.id}`}
          onClick={onOpen}
          className="group block w-full rounded-[8px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D75B9]"
        >
          <ImageFrame
            src={item.image}
            alt={item.title}
            className={cn(
              "min-h-64 rounded-[8px] transition duration-300 ease-out group-hover:scale-[1.006]",
              isLead ? "md:min-h-[410px]" : "md:min-h-[300px]",
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/34 via-black/0 to-black/0" />
            <Badge
              variant="secondary"
              className="absolute left-3 top-3 h-7 rounded-[8px] bg-white/94 px-2 text-[0.72rem] font-extrabold text-[#222222]"
            >
              <Icon className="size-3" weight="bold" />
              {item.topic}
            </Badge>
          </ImageFrame>
          <div className="mt-4 space-y-3">
            <h2
              className={cn(
                "max-w-3xl text-pretty font-headline leading-[1.03] text-[#f8fbff] [font-weight:700]",
                isLead ? "text-4xl md:text-5xl" : "text-3xl",
              )}
            >
              {item.title}
            </h2>
            <p className={cn("max-w-2xl leading-7 text-[#b3bfcc]", isLead ? "text-base" : "text-sm")}>{item.summary}</p>
          </div>
        </button>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-[8px] bg-[#232a33] px-2 py-1 text-xs font-semibold text-[#cad5e2]">
              {tag}
            </span>
          ))}
          <Button variant="ghost" size="sm" className="ml-auto h-10 rounded-[8px] text-[#dbe8f7] hover:bg-[#20242b] hover:text-white" onClick={onOpen}>
            Read Story <CaretRightIcon className="size-4" weight="bold" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
        <FeedAction icon={BookmarkSimpleIcon} label="Save" activeLabel="Saved" title={item.title} onChange={(isActive) => onFeedback(item, "save", isActive)} />
        <FeedAction icon={FolderPlusIcon} label="Collect" activeLabel="Collected" title={item.title} onChange={(isActive) => onFeedback(item, "collect", isActive)} />
        <FeedAction icon={ShareNetworkIcon} label="Share" title={item.title} />
        <FeedAction icon={EyeSlashIcon} label="Hide" activeLabel="Hidden" title={item.title} onChange={(isActive) => onFeedback(item, "hide", isActive)} />
      </div>
    </article>
  );
}

function RailPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[8px] border border-white/10 bg-[#181b20] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.22)]", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-[#f4f7fb]">{title}</h2>
        <CaretRightIcon className="size-4 text-[#8b96a6]" weight="bold" />
      </div>
      {children}
    </section>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111418] text-white">
      <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <IconButton label="Open navigation" className="border-white/10 bg-white/8 text-white hover:bg-white/14 lg:hidden">
            <ListIcon className="size-4" weight="bold" />
          </IconButton>
          <span aria-label="Hearst+" className="flex h-6 min-w-0 items-center" role="img">
            <span
              aria-hidden="true"
              data-testid="hearst-plus-logo"
              className="block h-[15px] w-[134px] bg-[#2D75B9] sm:h-[21px] sm:w-[188px]"
              style={{
                WebkitMask: "url('/logos/hearst-plus.svg') left center / contain no-repeat",
                mask: "url('/logos/hearst-plus.svg') left center / contain no-repeat",
              }}
            />
          </span>
        </div>
        <nav className="hidden justify-center gap-1 md:flex">
          {["For You", "Morning Brief", "Trending", "Saved", "Following"].map((item, index) => (
            <button
              key={item}
              type="button"
              className={cn(
                "h-9 whitespace-nowrap rounded-[8px] px-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white",
                index === 0 && "bg-[#2D75B9] text-white hover:bg-[#2D75B9]",
              )}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="hidden h-10 min-w-80 items-center gap-2 rounded-[8px] border border-white/12 bg-[#20242b] px-3 text-left text-sm text-[#b8c3d1] md:flex"
          >
            <MagnifyingGlassIcon className="size-4 text-[#95a0ad]" weight="bold" />
            Search every Hearst brand
          </button>
          <IconButton label="Notifications" className="border-white/10 bg-white/8 text-white hover:bg-white/14">
            <BellIcon className="size-4" weight="bold" />
          </IconButton>
          <IconButton label="Account" className="border-white/10 bg-white/8 text-white hover:bg-white/14">
            <UserIcon className="size-4" weight="bold" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function BrandUniverseStrip() {
  return (
    <section className="border-b border-white/10 bg-[#14171c] px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#8f9baa]">Brand universe</p>
          <h2 className="text-lg font-extrabold text-[#f4f7fb]">All Hearst brands in one interest graph</h2>
        </div>
        <Button variant="outline" size="sm" className="h-10 rounded-[8px] border-white/12 bg-[#20242b] text-[#f4f7fb] hover:bg-[#2a3038] hover:text-white">
          <CompassIcon className="size-4" weight="bold" />
          Explore
        </Button>
      </div>
      <div className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [contain:paint]">
        {brandUniverse.map((brand) => (
          <BrandPill key={brand.slug} slug={brand.slug} />
        ))}
      </div>
    </section>
  );
}

function LeftRail() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <RailPanel title="Your Morning">
        <div className="space-y-3">
          {dailyBrief.map(({ icon: Icon, label, value }) => (
            <button key={label} type="button" className="flex w-full items-center gap-3 rounded-[8px] bg-[#20242b] p-3 text-left transition hover:bg-[#272d36]">
              <span className="flex size-9 items-center justify-center rounded-[8px] bg-[#111418] text-[#dbe8f7]">
                <Icon className="size-4" weight="bold" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#f4f7fb]">{label}</span>
                <span className="block text-xs text-[#a3afbd]">{value}</span>
              </span>
            </button>
          ))}
        </div>
      </RailPanel>
      <RailPanel title="Quick Actions">
        <div className="space-y-2">
          {quickActions.map(({ icon: Icon, label }) => (
            <button key={label} type="button" className="flex h-11 w-full items-center gap-3 rounded-[8px] px-2 text-sm font-semibold text-[#dbe3ed] hover:bg-[#20242b]">
              <Icon className="size-4 text-[#8b96a6]" weight="bold" />
              {label}
            </button>
          ))}
        </div>
      </RailPanel>
      <RailPanel title="Following">
        <div className="grid grid-cols-2 gap-2">
          {["delish", "mens-health", "car-and-driver", "house-beautiful", "cosmopolitan", "popular-mechanics"].map((slug) => (
            <BrandPill key={slug} slug={slug} compact />
          ))}
        </div>
      </RailPanel>
    </aside>
  );
}

function RightRail() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <RailPanel title="Trending Across Hearst">
        <ol className="space-y-3">
          {trendItems.map((item, index) => {
            const brand = getBrand(item.brandSlug);
            return (
              <li key={item.title} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3">
                <span className="flex size-7 items-center justify-center rounded-[8px] bg-[#2D75B9] text-xs font-black text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-[#f4f7fb]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#9da8b6]">{brand.name}</p>
                </div>
                <span className="rounded-[8px] bg-[#123b29] px-2 py-1 text-xs font-bold text-[#8ee0aa]">{item.lift}</span>
              </li>
            );
          })}
        </ol>
      </RailPanel>
      <RailPanel title="Collections">
        <div className="space-y-3">
          {collections.map((collection) => (
            <button key={collection.title} type="button" className="w-full rounded-[8px] border border-white/10 bg-[#20242b] p-3 text-left hover:bg-[#272d36]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#f4f7fb]">{collection.title}</p>
                  <p className="text-xs text-[#9da8b6]">{collection.count}</p>
                </div>
                <span className="size-3 rounded-full" style={{ backgroundColor: collection.accent }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {collection.brandSlugs.map((slug) => (
                  <span key={slug} className="rounded-[8px] bg-[#14171c] px-2 py-1 text-xs font-semibold text-[#dbe3ed]">
                    {getBrand(slug).name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </RailPanel>
      <section className="rounded-[8px] border border-white/10 bg-[#0f1115] p-4 text-white">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="size-5 text-[#8bd28f]" weight="bold" />
          <h2 className="text-sm font-extrabold">7 day reading streak</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/72">
          Your strongest topics this week are cars, dinner ideas, home projects, and strength training.
        </p>
      </section>
    </aside>
  );
}

function PersonalizationBand() {
  return (
    <section className="rounded-[8px] border border-white/10 bg-[#181b20] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.22)]">
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
        <div>
          <div className="mb-2 flex items-center">
            <p className="text-sm font-bold text-[#aab5c3]">Daily Read</p>
          </div>
          <h1 className="max-w-2xl font-headline text-2xl leading-[1.08] text-[#f8fbff] [font-weight:700] md:text-3xl">
            Your morning feed across every Hearst brand.
          </h1>
        </div>
        <div className="border-t border-white/10 pt-4 2xl:w-72 2xl:border-l 2xl:border-t-0 2xl:pl-4 2xl:pt-0">
          <p className="text-sm font-extrabold text-[#7bbcff]">Today&apos;s Brief</p>
          <p className="mt-1 text-sm font-bold leading-5 text-[#e7eef7]">8 stories in about 5 minutes.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {briefTopics.map((topic) => (
              <span key={topic} className="rounded-[8px] bg-[#232a33] px-2 py-1 text-xs font-bold text-[#cad5e2]">
                {topic}
              </span>
            ))}
          </div>
          <Button size="sm" className="mt-3 h-10 rounded-[8px] bg-[#2D75B9] text-white hover:bg-[#2465a4]">
            Start Reading
          </Button>
        </div>
      </div>
      <div className="mt-5 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [contain:paint]">
        {interestChips.map((chip, index) => (
          <button
            key={chip}
            type="button"
            className={cn(
              "h-9 shrink-0 rounded-[8px] border border-white/10 bg-[#20242b] px-3 text-sm font-bold text-[#dbe3ed]",
              index === 0 && "border-[#2D75B9] bg-[#2D75B9] text-white",
            )}
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
}

function ArticleModal({
  item,
  relatedItems,
  isClosing,
  closeButtonRef,
  onClose,
}: {
  item: PersonalizedFeedItem;
  relatedItems: PersonalizedFeedItem[];
  isClosing: boolean;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const brand = getBrand(item.brandSlug);
  const Icon = categoryIcons[item.topic] ?? NewspaperIcon;
  const headingId = `article-modal-heading-${item.id}`;
  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

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

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[#0d1014] hearst-plus-article-backdrop",
        isClosing && "hearst-plus-article-backdrop-out",
      )}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onKeyDown={handleDialogKeyDown}
        className={cn(
          "fixed inset-0 overflow-y-auto bg-[#0d1014] text-white hearst-plus-article-dialog",
          isClosing && "hearst-plus-article-dialog-out",
        )}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close article and return to Hearst+ home"
          className="fixed right-4 top-4 z-30 flex size-14 items-center justify-center rounded-full border border-white/10 bg-[#20242b] text-white shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition hover:bg-[#2a3038] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ca8ff] md:right-6 md:size-16"
          onClick={onClose}
        >
          <XIcon className="size-8" weight="bold" />
        </button>

        <div className="sticky top-0 z-20 border-b border-white/10 bg-[#111418]/96 pr-20 backdrop-blur">
          <div className="mx-auto flex min-h-16 max-w-[1180px] items-center gap-3 overflow-hidden px-5 text-sm text-white/64 md:px-8 md:text-base">
            <span className="shrink-0 font-extrabold text-white">Top Stories:</span>
            <div className="flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap">
              {trendItems.slice(0, 5).map((story) => (
                <React.Fragment key={story.title}>
                  <span className="truncate">{story.title}</span>
                  <span className="text-white/24">|</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <article className="mx-auto min-h-screen max-w-[1180px] px-5 pb-16 pt-10 md:px-8 md:pb-20 md:pt-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_300px] lg:items-start">
            <div className="min-w-0">
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <BrandAvatar slug={item.brandSlug} size="lg" />
                <span className="text-lg font-extrabold text-white">{brand.name}</span>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-[#2D75B9] bg-transparent px-5 text-sm font-extrabold text-[#7bbcff] hover:bg-[#12395f] hover:text-white"
                >
                  Follow
                </Button>
              </div>

              <h1 id={headingId} className="max-w-3xl text-pretty font-headline text-4xl leading-[1.03] text-[#f8fbff] [font-weight:700] md:text-5xl">
                {item.title}
              </h1>

              <div className="mt-6 space-y-1 text-base leading-7 text-white/62">
                <p className="font-extrabold text-white/88">{brand.name} Editors</p>
                <p>
                  {item.topic} · {item.readTime} read
                </p>
                <p>{item.signal}</p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button className="h-12 rounded-full bg-[#2D75B9] px-5 font-extrabold text-white hover:bg-[#2465a4]">
                  <BookmarkSimpleIcon className="size-5" weight="bold" />
                  Save Story
                </Button>
                <button
                  type="button"
                  aria-label={`Share ${item.title}`}
                  className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ShareNetworkIcon className="size-5" weight="bold" />
                </button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/18 bg-transparent px-5 font-extrabold text-white hover:bg-white/8 hover:text-white"
                >
                  Add to Collection
                </Button>
              </div>

              <ImageFrame
                src={item.image}
                alt={item.title}
                className="mt-9 min-h-[280px] rounded-[8px] bg-center hearst-plus-article-image md:min-h-[520px]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/0 to-black/0" />
                <Badge
                  variant="secondary"
                  className="absolute left-3 top-3 h-8 rounded-[8px] bg-white/94 px-3 text-xs font-extrabold text-[#222222]"
                >
                  <Icon className="size-3.5" weight="bold" />
                  {item.topic}
                </Badge>
              </ImageFrame>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/82">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-8 max-w-2xl text-xl leading-8 text-white/82">{item.summary}</p>

              <div className="mt-8 max-w-2xl space-y-7 text-lg leading-9 text-white/84">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block">
              <section className="rounded-[8px] border border-white/10 bg-[#181b20] p-5">
                <h2 className="text-sm font-extrabold text-white">In Your Brief</h2>
                <p className="mt-3 text-sm leading-6 text-white/66">
                  This story sits with food, wellness, home, and cars in today&apos;s 5-minute read.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {briefTopics.map((topic) => (
                    <span key={topic} className="rounded-full bg-[#232a33] px-3 py-1.5 text-xs font-bold text-[#cad5e2]">
                      {topic}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[8px] border border-white/10 bg-[#181b20] p-5">
                <h2 className="text-sm font-extrabold text-white">Related Reads</h2>
                <div className="mt-4 space-y-4">
                  {relatedItems
                    .filter((feedItem) => feedItem.id !== item.id)
                    .slice(0, 3)
                    .map((feedItem) => (
                      <button key={feedItem.id} type="button" className="block w-full text-left">
                        <p className="text-sm font-bold leading-5 text-white">{feedItem.title}</p>
                        <p className="mt-1 text-xs text-white/52">{getBrand(feedItem.brandSlug).name}</p>
                      </button>
                    ))}
                </div>
              </section>
            </aside>
          </div>
        </article>
      </section>
    </div>
  );
}

export function HearstPlusApp() {
  const [profile, setProfile] = React.useState<ReaderProfile>(readerProfile);
  const personalizedFeed = React.useMemo(() => getPersonalizedFeed(feedItems, profile), [profile]);
  const [selectedStory, setSelectedStory] = React.useState<PersonalizedFeedItem | null>(null);
  const [isArticleClosing, setIsArticleClosing] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = React.useRef<number | null>(null);

  const handleFeedFeedback = React.useCallback((item: PersonalizedFeedItem, action: FeedFeedbackAction, isActive: boolean) => {
    setProfile((currentProfile) => applyFeedFeedback(currentProfile, item, action, isActive));
  }, []);

  const openStory = React.useCallback((item: PersonalizedFeedItem) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedStory(item);
    setIsArticleClosing(false);
    setProfile((currentProfile) => ({
      ...currentProfile,
      recentlyReadIds: [item.id, ...currentProfile.recentlyReadIds.filter((storyId) => storyId !== item.id)].slice(0, 12),
    }));

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("story", item.id);
      window.history.pushState({ hearstPlusStory: item.id }, "", `/hearst-plus/?${params.toString()}`);
    }
  }, []);

  const closeStory = React.useCallback(() => {
    if (!selectedStory || isArticleClosing) return;

    setIsArticleClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setSelectedStory(null);
      setIsArticleClosing(false);

      if (typeof window !== "undefined") {
        window.history.pushState({ hearstPlusStory: null }, "", "/hearst-plus/");
      }
    }, 190);
  }, [isArticleClosing, selectedStory]);

  React.useEffect(() => {
    const syncStoryFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const storyId = params.get("story");
      const item = personalizedFeed.find((feedItem) => feedItem.id === storyId) ?? null;
      setSelectedStory(item);
      setIsArticleClosing(false);
    };

    syncStoryFromUrl();
    window.addEventListener("popstate", syncStoryFromUrl);

    return () => {
      window.removeEventListener("popstate", syncStoryFromUrl);
    };
  }, [personalizedFeed]);

  React.useEffect(() => {
    if (!selectedStory) return undefined;

    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 80);
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedStory]);

  React.useEffect(() => {
    if (!selectedStory) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeStory();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeStory, selectedStory]);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#0d1014] font-brand text-[#f4f7fb]"
      style={
        {
          "--font-headline": "var(--font-hearst-plus-headline)",
          "--font-headline-weight": "700",
        } as React.CSSProperties
      }
    >
      <div
        className="mx-auto min-h-screen w-full max-w-[1280px]"
        aria-hidden={selectedStory ? true : undefined}
        inert={selectedStory ? true : undefined}
      >
        <div className="min-h-screen max-w-full overflow-hidden bg-[#0d1014]">
          <AppHeader />
          <BrandUniverseStrip />
          <div className="grid gap-4 px-4 py-4 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)_330px] lg:py-6">
            <LeftRail />
            <section className="min-w-0 space-y-4">
              <PersonalizationBand />
              <div className="grid gap-4">
                {personalizedFeed.map((item) => (
                  <FeedCard key={item.id} item={item} onOpen={() => openStory(item)} onFeedback={handleFeedFeedback} />
                ))}
              </div>
            </section>
            <RightRail />
          </div>
        </div>
      </div>
      {selectedStory && (
        <ArticleModal
          item={selectedStory}
          relatedItems={personalizedFeed}
          isClosing={isArticleClosing}
          closeButtonRef={closeButtonRef}
          onClose={closeStory}
        />
      )}
    </main>
  );
}
