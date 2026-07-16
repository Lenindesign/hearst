"use client";

import React from "react";
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
import { hearstPlusLightVars } from "@/lib/hearst-plus-theme";
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

type AppBrand = {
  slug: string;
  name: string;
  accent: string;
  secondary: string;
  logo?: string;
  mark: string;
};

const autosBrands: AppBrand[] = [
  { slug: "autoweek", name: "Autoweek", accent: "#ffc84e", secondary: "#03112b", logo: brandLogos["autoweek"], mark: "AW" },
  { slug: "motortrend", name: "MotorTrend", accent: "#BDDDFC", secondary: "#384959", mark: "MT" },
  { slug: "car-and-driver", name: "Car and Driver", accent: "#0061af", secondary: "#d2232a", logo: brandLogos["car-and-driver"], mark: "C/D" },
  { slug: "road-and-track", name: "Road & Track", accent: "#BDDDFC", secondary: "#384959", logo: brandLogos["road-and-track"], mark: "R&T" },
  { slug: "hot-rod", name: "Hot Rod", accent: "#BDDDFC", secondary: "#384959", mark: "HR" },
];

const autosBrandBySlug = new Map(autosBrands.map((brand) => [brand.slug, brand]));

const feedItems: FeedItem[] = [
  {
    id: "f1-aero",
    brandSlug: "autoweek",
    topic: "Racing",
    title: "Why McLaren's 2026 car could rewrite the rules of F1 aero",
    summary: "New aero rules, a cleaner sidepod idea, and the early testing signals that matter.",
    body: [
      "The 2026 Formula 1 regulations are less about one clever wing and more about how each surface works with the floor. That is why McLaren's early concept is getting attention: the car looks simple from the outside, but its sidepod geometry is doing more work than it first appears.",
      "Testing pace can mislead, so the useful clues are steadier. Long-run tire wear, sector balance, and how quickly the car responds to setup changes tell a better story than one headline lap.",
      "The driver lineup matters here, too. A car that is predictable over a race stint gives engineers cleaner feedback, and McLaren has two drivers who can describe the same problem from different angles.",
      "The real question is whether the concept has development room. If the team can add downforce without reviving old drag penalties, the car could become more than a strong launch spec.",
    ],
    image: img("251217-01-00-z-27my-01-696149a83bf60.jpg", "crop=1xw:0.68xh;center,top&resize=1200:*"),
    readTime: "6 min",
    signal: "Because you follow F1 and racing development",
    tags: ["F1", "Aero", "Racing"],
    variant: "lead",
  },
  {
    id: "hybrid-suvs",
    brandSlug: "motortrend",
    topic: "SUVs",
    title: "Hybrid SUVs people are comparing before summer trips",
    summary: "The short list for shoppers balancing range, room, fuel economy, and real highway comfort.",
    body: [
      "The strongest hybrid SUV argument is not only fuel economy. It is the way the powertrain changes a normal week: fewer stops, quieter school runs, and enough torque that a loaded cabin does not feel like a penalty.",
      "The comparison starts with the daily details that matter after the test drive. Cargo height, second-row access, phone pairing, highway noise, and real-world mpg separate the useful options from the spec-sheet winners.",
      "For longer trips, the best models make their efficiency feel invisible. They settle down at speed, keep driver assists from getting fussy, and leave enough range in reserve that the route does not revolve around the next stop.",
      "The value pick is the one that keeps those advantages after incentives, insurance, and fuel are added to the monthly picture.",
    ],
    image: img("76471936-3e6b-463e-9551-cb792858ec07.jpg", "crop=1xw:0.63xh;center,top&resize=1000:*"),
    readTime: "7 min",
    signal: "Because you saved hybrid buying guides",
    tags: ["Hybrids", "Shopping", "SUVs"],
  },
  {
    id: "small-car-comparison",
    brandSlug: "car-and-driver",
    topic: "Buying Guides",
    title: "The small-car comparison worth reading before shopping",
    summary: "A route-tested look at price, comfort, fuel economy, and the cars that still feel sharp.",
    body: [
      "Small cars still make the clearest argument on a normal road. They ask less of the driver in traffic, cost less to run, and reveal quickly which cabin details matter after the showroom lights are gone.",
      "The comparison starts with the basics: sightlines, seat comfort, highway noise, real fuel economy, and whether the infotainment gets easier or more annoying on the third day.",
      "The winner is not only the cheapest or the quickest. It is the car that keeps the everyday compromises low while still giving the driver a reason to take the long way home.",
      "That balance matters as prices keep stretching upward. A good compact still has to feel honest: no hidden packaging penalty, no bargain-bin controls, and no drivetrain that sounds tired before the first oil change.",
    ],
    image: img("2025-gmc-yukon-denali-102-6852cef15027e.jpg", "crop=1xw:0.62xh;center,top&resize=1000:*"),
    readTime: "9 min",
    signal: "Because you follow compact and hybrid cars",
    tags: ["Shopping", "Hybrids", "Compacts"],
  },
  {
    id: "gt3-rs-ring",
    brandSlug: "road-and-track",
    topic: "Performance",
    title: "I drove the new Porsche 911 GT3 RS on the Nurburgring. It changed me.",
    summary: "Why the newest GT3 RS feels less like a road car and more like a track tool with plates.",
    body: [
      "A fast lap usually rewards aggression. The GT3 RS rewards trust. The front end loads cleanly, the rear wing changes the braking zone, and the car keeps asking for a little more speed than your hands initially believe is possible.",
      "The numbers explain part of it: more power, more aero, sharper damping. But the real difference is how all of that arrives at once, with fewer of the little delays that make a road car feel like a compromise on a circuit.",
      "On the Nurburgring, that confidence compounds. Every kerb, compression, and blind entry becomes less about survival and more about precision.",
      "The car is still street legal, technically. But its center of gravity is emotional as much as mechanical. It belongs where the stakes are visible.",
    ],
    image: img("2024-nissan-z-nismo-149-668d5ce36ae38.jpg", "crop=1xw:0.62xh;center,top&resize=1000:*"),
    readTime: "10 min",
    signal: "Because you read performance reviews",
    tags: ["Performance", "Track", "Porsche"],
  },
  {
    id: "budget-v8-build",
    brandSlug: "hot-rod",
    topic: "Project Cars",
    title: "The budget V8 build that still makes sense",
    summary: "Where to spend, where to save, and how to avoid turning a weekend build into a money pit.",
    body: [
      "A smart V8 build starts with the boring parts. Cooling, wiring, brakes, mounts, and fuel delivery decide whether the car becomes something you drive or something you keep explaining in the driveway.",
      "The best money goes toward reliability first. A clean harness, a known-good transmission, and a cooling package with headroom will make more difference than chasing a dyno number that only appears once.",
      "There is still room for personality. Exhaust, wheels, stance, and interior details give the car its voice, but those choices work better when the foundation is not fighting back.",
      "The build that makes sense is the one with a finished first season. Drive it, fix what shows up, then decide how much more power the car actually wants.",
    ],
    image: img("311612c5-94a7-4874-b788-f60d39a244c0.jpg", "crop=1xw:0.64xh;center,top&resize=1000:*"),
    readTime: "8 min",
    signal: "Related to your Project Builds collection",
    tags: ["V8", "Project Cars", "Classics"],
  },
  {
    id: "indycar-season",
    brandSlug: "autoweek",
    topic: "Motorsport",
    title: "The races that will define this IndyCar season",
    summary: "The calendar pressure points, oval questions, and driver pairings worth watching first.",
    body: [
      "Every IndyCar season has a rhythm, and the first clue is where teams have to compromise. The early road courses reward qualifying precision, while the first oval resets the field around confidence, traffic, and pit timing.",
      "The contenders are familiar, but the pressure is different. A stronger rookie class, tighter engineering margins, and more aggressive strategy calls are making the middle of the grid harder to escape.",
      "The races that matter most are the ones that expose balance. If a team can carry pace across street circuits, road courses, and ovals, it has something more durable than a fast weekend.",
    ],
    image: img("88841361-054e-412e-a300-a43fec380de0.jpg", "crop=1xw:0.62xh;center,top&resize=1000:*"),
    readTime: "5 min",
    signal: "Trending among Autoweek readers",
    tags: ["IndyCar", "Racing", "Motorsport"],
  },
  {
    id: "tow-test",
    brandSlug: "motortrend",
    topic: "Trucks",
    title: "The truck tow test that separates spec sheets from reality",
    summary: "Payload, braking, cooling, and the cabin details that matter after the grade gets steep.",
    body: [
      "Tow ratings are a starting point, not a verdict. The real test begins when the route adds heat, grade, crosswinds, and enough time behind the wheel for small cabin decisions to become obvious.",
      "Cooling stability matters as much as power. A truck that pulls hard for ten minutes and then starts managing itself down is telling you something the brochure will not.",
      "The best performers keep the driver out of the math. They brake predictably, hold mirrors steady, and make the trailer feel like a known quantity instead of a constant negotiation.",
    ],
    image: img("2025-gmc-yukon-denali-102-6852cef15027e.jpg", "crop=1xw:0.62xh;center,top&resize=1000:*"),
    readTime: "9 min",
    signal: "Because you follow trucks and utility testing",
    tags: ["Trucks", "Testing", "Towing"],
  },
  {
    id: "manual-revival",
    brandSlug: "road-and-track",
    topic: "Enthusiast Cars",
    title: "Why the manual transmission keeps finding new believers",
    summary: "Not nostalgia alone. A look at control, value, and the cars making three pedals feel current.",
    body: [
      "The manual transmission survives because it changes the job of driving. It slows the decision loop just enough to make every on-ramp, back road, and downshift feel chosen.",
      "That does not make every manual car good. The best ones have clear gates, sensible gearing, and engines that reward timing instead of punishing anything less than perfection.",
      "The revival is strongest where the transmission changes the car's identity. A manual compact, coupe, or weekend car can feel more expensive than it is because the driver has more to do.",
    ],
    image: img("311612c5-94a7-4874-b788-f60d39a244c0.jpg", "crop=1xw:0.64xh;center,top&resize=1000:*"),
    readTime: "6 min",
    signal: "Readers of Road & Track also read",
    tags: ["Manuals", "Driving", "Enthusiast Cars"],
  },
];

const dailyBrief = [
  { icon: CalendarBlankIcon, label: "Morning Brief", value: "8 auto stories in 5 minutes" },
  { icon: SparkleIcon, label: "Best Drives You Missed", value: "3 new since last night" },
  { icon: BookmarkSimpleIcon, label: "Continue Reading", value: "2 saved reviews waiting" },
];

const trendItems = [
  { brandSlug: "autoweek", title: "McLaren's new F1 aero idea is getting paddock attention", lift: "+41%" },
  { brandSlug: "motortrend", title: "Hybrid SUVs people are comparing before summer trips", lift: "+33%" },
  { brandSlug: "car-and-driver", title: "The compact-car comparison shoppers keep saving", lift: "+28%" },
  { brandSlug: "road-and-track", title: "The GT3 RS drive performance readers are sharing", lift: "+21%" },
  { brandSlug: "hot-rod", title: "A budget V8 build list that avoids the money pit", lift: "+18%" },
];

const collections: Collection[] = [
  { title: "EV Shortlist", count: "18 saves", brandSlugs: ["motortrend", "car-and-driver", "autoweek"], accent: "var(--hp-primary)" },
  { title: "Track Days", count: "12 saves", brandSlugs: ["road-and-track", "autoweek", "car-and-driver"], accent: "var(--hp-primary)" },
  { title: "Project Builds", count: "9 saves", brandSlugs: ["hot-rod", "road-and-track", "motortrend"], accent: "var(--hp-primary)" },
];

const readerProfile: ReaderProfile = {
  followedTopics: ["EVs", "Buying Guides", "Performance", "Racing", "Project Cars"],
  followedBrands: ["autoweek", "motortrend", "car-and-driver", "road-and-track", "hot-rod"],
  savedTags: ["Hybrids", "Shopping", "F1", "Performance", "Trucks", "Classics"],
  savedCollections: ["EV Shortlist", "Track Days", "Project Builds"],
  recentlyReadIds: [],
  mutedTopics: [],
  timeOfDay: "morning",
};

const topicInterestMap: Record<string, string[]> = {
  "For You": ["F1", "Hybrids", "Performance", "Shopping", "Project Cars", "Trucks"],
  EVs: ["EVs", "Hybrids", "Shopping", "EV Shortlist", "SUVs"],
  SUVs: ["SUVs", "Hybrids", "Shopping"],
  "Buying Guides": ["Buying Guides", "Shopping", "Compacts", "SUVs", "Trucks"],
  Performance: ["Performance", "Track", "Porsche", "Driving", "Enthusiast Cars"],
  Racing: ["Racing", "F1", "IndyCar", "Motorsport", "Aero"],
  "Project Cars": ["Project Cars", "V8", "Classics", "Project Builds"],
  Trucks: ["Trucks", "Testing", "Towing"],
};

const collectionInterestMap: Record<string, string[]> = {
  "EV Shortlist": ["EVs", "Hybrids", "Shopping", "SUVs"],
  "Track Days": ["Performance", "Track", "Racing", "Porsche"],
  "Project Builds": ["Project Cars", "V8", "Classics", "Trucks"],
};

const trendLiftByFeedId: Record<string, number> = {
  "f1-aero": 41,
  "hybrid-suvs": 33,
  "small-car-comparison": 28,
  "gt3-rs-ring": 21,
  "budget-v8-build": 18,
  "indycar-season": 24,
  "tow-test": 17,
  "manual-revival": 16,
};

const interestChips = [
  "For You",
  "EVs",
  "SUVs",
  "Buying Guides",
  "Performance",
  "Racing",
  "Project Cars",
  "Trucks",
];

const briefTopics = ["EVs", "Buying", "Racing", "Performance"];

const quickActions = [
  { icon: CompassIcon, label: "Tune Feed" },
  { icon: PlusIcon, label: "Create Collection" },
  { icon: XIcon, label: "Skip Topic" },
];

const categoryIcons: Record<string, React.ElementType> = {
  "Buying Guides": CarIcon,
  "Enthusiast Cars": CarIcon,
  Motorsport: CarIcon,
  "Project Cars": WrenchIcon,
  Performance: CarIcon,
  Racing: CarIcon,
  SUVs: CarIcon,
  Trucks: CarIcon,
};

const communityAvatarLogos: Record<string, string> = {
  "road-and-track": "/logos/community-avatars/road-and-track.svg",
};

const brandUniverse = autosBrands;

function titleize(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getBrand(slug: string) {
  const autosBrand = autosBrandBySlug.get(slug);
  if (autosBrand) return autosBrand;

  const brand = brands.find((item) => item.slug === slug);
  return {
    slug,
    name: brand?.name ?? titleize(slug),
    accent: brand?.colors["1"] ?? "#222222",
    secondary: brand?.colors["2"] ?? "#f2f2f2",
    logo: brandLogos[slug],
    mark: titleize(slug)
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 3),
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

function formatRecommendationValue(value: string) {
  return /^[A-Z0-9&]+$/.test(value) || value === "EVs" ? value : value.toLowerCase();
}

function getRecommendationReason(item: FeedItem, profile: ReaderProfile) {
  const savedTag = getSavedTagMatch(item, profile);
  if (savedTag) return `Because you saved ${formatRecommendationValue(savedTag)}`;

  const collectionTitle = getCollectionMatch(item, profile);
  if (collectionTitle) return `Related to your ${collectionTitle} collection`;

  const followedTopic = getFollowedTopicMatch(item, profile);
  if (followedTopic) return `Because you follow ${formatRecommendationValue(followedTopic)}`;

  if (profile.followedBrands.includes(item.brandSlug)) return `Because you follow ${getBrand(item.brandSlug).name}`;

  if ((trendLiftByFeedId[item.id] ?? 0) > 0) return `Trending among ${getBrand(item.brandSlug).name} readers`;

  return item.signal || "Recommended from your AUTOS graph";
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

  if (profile.timeOfDay === "morning" && ["EVs", "SUVs", "Buying Guides", "Performance", "Racing", "Project Cars", "Trucks"].includes(item.topic)) {
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
  const hasSvgLogo = Boolean(brandLogos[slug]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white text-[var(--hp-ink-on-light)]",
        size === "sm" && "size-7",
        size === "md" && "size-9",
        size === "lg" && "size-11",
      )}
    >
      {image ? (
        <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      ) : hasSvgLogo ? (
        <BrandLogo
          slug={slug}
          variant="icon"
          className={cn(
            "block [&_svg]:w-auto [&_svg]:text-current",
            size === "sm" && "[&_svg]:h-3 [&_svg]:max-w-5",
            size === "md" && "[&_svg]:h-3.5 [&_svg]:max-w-7",
            size === "lg" && "[&_svg]:h-4 [&_svg]:max-w-8",
          )}
          color={brand.accent}
        />
      ) : (
        <span
          className={cn(
            "font-black tracking-[0.02em] text-[var(--hp-ink-on-light)]",
            size === "sm" && "text-[0.62rem]",
            size === "md" && "text-[0.7rem]",
            size === "lg" && "text-xs",
          )}
        >
          {brand.mark}
        </span>
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
        "flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-control)] text-[var(--hp-text-ui)] transition hover:bg-[var(--hp-control-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)] md:size-9",
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
        "flex h-12 items-center justify-center gap-2 border-[var(--hp-border)] px-3 text-xs font-semibold text-[var(--hp-text-secondary)] transition hover:bg-[var(--hp-control)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--hp-focus)]",
        active && "bg-[var(--hp-friendly-accent)] text-[var(--hp-friendly-accent-text)] hover:bg-[var(--hp-friendly-accent-hover)]",
      )}
    >
      <Icon className={cn("size-4 text-[var(--hp-text-muted)]", active && "text-[var(--hp-friendly-accent-text)]")} weight={active ? "fill" : "bold"} />
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
        "flex h-11 shrink-0 items-center gap-2 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] text-[var(--hp-text-ui)] transition hover:border-[var(--hp-border-strong)] hover:bg-[var(--hp-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]",
        compact ? "h-10 min-w-0 justify-start pl-[3px] pr-2" : "min-w-[154px] justify-start pl-[3px] pr-3",
      )}
    >
      <BrandAvatar slug={slug} size={compact ? "sm" : "md"} />
      <span className={cn("min-w-0 truncate text-xs font-semibold", compact ? "max-w-[74px]" : "max-w-[104px]")}>
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
    <article className="overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--hp-border)] p-4 md:p-5">
        <div className="flex min-w-0 gap-3">
          <BrandAvatar slug={item.brandSlug} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-extrabold text-[var(--hp-text-primary)]">{brand.name}</span>
              <span className="size-1 rounded-full bg-[var(--hp-text-muted)]" />
              <span className="text-xs font-bold text-[var(--hp-text-secondary)]">{item.topic}</span>
              <span className="text-xs text-[var(--hp-text-muted)]">{item.readTime} read</span>
            </div>
            <p className="mt-1 max-w-prose text-xs font-bold leading-5 text-[var(--hp-text-secondary)]">{item.signal}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" className="hidden h-9 rounded-[8px] border-[var(--hp-border)] bg-transparent px-3 text-xs font-semibold text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control)] hover:text-[var(--hp-text-primary)] sm:inline-flex">
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
          className="group block w-full rounded-[8px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hp-primary)]"
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
              className="absolute left-3 top-3 h-7 rounded-[8px] border border-black/10 bg-white/75 px-2 text-[0.72rem] font-semibold text-[var(--hp-ink-on-light)] shadow-none backdrop-blur-[2px]"
            >
              <Icon className="size-3" weight="bold" />
              {item.topic}
            </Badge>
          </ImageFrame>
          <div className="mt-4 space-y-3">
            <h2
              className={cn(
                "max-w-3xl text-pretty font-headline leading-[1.03] text-[var(--hp-text-headline)] [font-weight:700]",
                isLead ? "text-3xl md:text-[2rem]" : "text-3xl",
              )}
            >
              {item.title}
            </h2>
            <p className={cn("max-w-2xl leading-7 text-[var(--hp-text-secondary)]", isLead ? "text-base" : "text-sm")}>{item.summary}</p>
          </div>
        </button>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-[8px] border border-[var(--hp-border)] bg-transparent px-2 py-1 text-xs font-medium text-[var(--hp-text-muted)]">
              {tag}
            </span>
          ))}
          <Button variant="ghost" size="sm" className="ml-auto h-10 rounded-[8px] font-semibold text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control)] hover:text-[var(--hp-text-primary)]" onClick={onOpen}>
            Read Story <CaretRightIcon className="size-4" weight="bold" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-[var(--hp-border)] sm:grid-cols-4 sm:divide-x sm:divide-[var(--hp-border)]">
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
    <section className={cn("rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-[var(--hp-text-primary)]">{title}</h2>
        <CaretRightIcon className="size-4 text-[var(--hp-text-muted)]" weight="bold" />
      </div>
      {children}
    </section>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--hp-border)] bg-[var(--hp-nav)] text-[var(--hp-nav-text)]">
      <div className="mx-auto grid min-h-16 w-full max-w-[1280px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <IconButton label="Open navigation" className="border-[var(--hp-border)] bg-white/8 text-white hover:bg-white/14 lg:hidden">
            <ListIcon className="size-4" weight="bold" />
          </IconButton>
          <span aria-label="AUTOS" className="flex h-6 min-w-0 items-center" role="img">
            <span
              aria-hidden="true"
              data-testid="autos-logo"
              className="text-lg font-black tracking-[0.26em] text-[var(--hp-logo)] sm:text-xl"
            >
              AUTOS
            </span>
          </span>
        </div>
        <nav className="hidden justify-center gap-1 md:flex">
          {["For You", "Morning Brief", "Trending", "Saved", "Following"].map((item, index) => (
            <button
              key={item}
              type="button"
              className={cn(
                "h-9 whitespace-nowrap rounded-[8px] px-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white",
                index === 0 && "bg-[var(--hp-friendly-accent)] text-[var(--hp-friendly-accent-text)] ring-1 ring-inset ring-[var(--hp-friendly-accent-border)] hover:bg-[var(--hp-friendly-accent-hover)]",
              )}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="hidden h-10 min-w-80 items-center gap-2 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-control)] px-3 text-left text-sm text-[var(--hp-text-secondary)] md:flex"
          >
            <MagnifyingGlassIcon className="size-4 text-[var(--hp-text-muted)]" weight="bold" />
            Search autos stories
          </button>
          <IconButton label="Notifications" className="border-[var(--hp-border)] bg-white/8 text-white hover:bg-white/14">
            <BellIcon className="size-4" weight="bold" />
          </IconButton>
          <IconButton label="Account" className="border-[var(--hp-border)] bg-white/8 text-white hover:bg-white/14">
            <UserIcon className="size-4" weight="bold" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function BrandUniverseStrip() {
  return (
    <section className="border-b border-[var(--hp-border)] bg-[var(--hp-strip)]">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--hp-text-muted)]">Auto universe</p>
            <h2 className="text-lg font-extrabold text-[var(--hp-text-primary)]">Five auto brands in one driver graph</h2>
          </div>
          <Button variant="outline" size="sm" className="h-10 rounded-[8px] border-[var(--hp-border)] bg-[var(--hp-control)] text-[var(--hp-text-primary)] hover:bg-[var(--hp-control-hover)] hover:text-[var(--hp-text-primary)]">
            <CompassIcon className="size-4" weight="bold" />
            Explore
          </Button>
        </div>
        <div className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [contain:paint]">
          {brandUniverse.map((brand) => (
            <BrandPill key={brand.slug} slug={brand.slug} />
          ))}
        </div>
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
            <button key={label} type="button" className="flex w-full items-center gap-3 rounded-[8px] bg-[var(--hp-control)] p-3 text-left transition hover:bg-[var(--hp-control-hover)]">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-rank-bg)] text-[var(--hp-rank-text)]">
                <Icon className="size-4" weight="bold" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[var(--hp-text-primary)]">{label}</span>
                <span className="block text-xs text-[var(--hp-text-secondary)]">{value}</span>
              </span>
            </button>
          ))}
        </div>
      </RailPanel>
      <RailPanel title="Quick Actions">
        <div className="space-y-2">
          {quickActions.map(({ icon: Icon, label }) => (
            <button key={label} type="button" className="flex h-11 w-full items-center gap-3 rounded-[8px] px-2 text-sm font-semibold text-[var(--hp-text-ui)] hover:bg-[var(--hp-control)]">
              <Icon className="size-4 text-[var(--hp-text-muted)]" weight="bold" />
              {label}
            </button>
          ))}
        </div>
      </RailPanel>
      <RailPanel title="Following">
        <div className="grid grid-cols-2 gap-2">
          {brandUniverse.map(({ slug }) => (
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
      <RailPanel title="Trending Across Autos">
        <ol className="space-y-3">
          {trendItems.map((item, index) => {
            const brand = getBrand(item.brandSlug);
            return (
              <li key={item.title} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3">
                <span className="flex size-7 items-center justify-center rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-primary-soft)] text-xs font-bold text-[var(--hp-primary)]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-[var(--hp-text-primary)]">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--hp-text-muted)]">{brand.name}</p>
                </div>
                <span className="rounded-[8px] border border-[var(--hp-border)] bg-transparent px-2 py-1 text-xs font-semibold text-[var(--hp-positive)]">{item.lift}</span>
              </li>
            );
          })}
        </ol>
      </RailPanel>
      <RailPanel title="Collections">
        <div className="space-y-3">
          {collections.map((collection) => (
            <button key={collection.title} type="button" className="w-full rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-control)] p-3 text-left hover:bg-[var(--hp-control-hover)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--hp-text-primary)]">{collection.title}</p>
                  <p className="text-xs text-[var(--hp-text-muted)]">{collection.count}</p>
                </div>
                <span className="size-3 rounded-full" style={{ backgroundColor: collection.accent }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {collection.brandSlugs.map((slug) => (
                  <span key={slug} className="rounded-[8px] border border-[var(--hp-border)] bg-transparent px-2 py-1 text-xs font-medium text-[var(--hp-text-muted)]">
                    {getBrand(slug).name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </RailPanel>
      <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 text-[var(--hp-text-primary)]">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="size-5 text-[var(--hp-positive)]" weight="bold" />
          <h2 className="text-sm font-extrabold">7 day reading streak</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
          Your strongest topics this week are EVs, performance, racing, and project cars.
        </p>
      </section>
    </aside>
  );
}

function PersonalizationBand() {
  return (
    <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
        <div>
          <div className="mb-2 flex items-center">
            <p className="text-sm font-bold text-[var(--hp-text-secondary)]">Daily Read</p>
          </div>
          <h1 className="max-w-2xl font-headline text-2xl leading-[1.08] text-[var(--hp-text-headline)] [font-weight:700] md:text-3xl">
            Your morning autos feed.
          </h1>
        </div>
        <div className="border-t border-[var(--hp-border)] pt-4 2xl:w-72 2xl:border-l 2xl:border-t-0 2xl:pl-4 2xl:pt-0">
          <p className="text-sm font-bold text-[var(--hp-signal)]">Today&apos;s Brief</p>
          <p className="mt-1 text-sm font-bold leading-5 text-[var(--hp-text-ui)]">8 stories in about 5 minutes.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {briefTopics.map((topic) => (
              <span key={topic} className="rounded-[8px] border border-[var(--hp-border)] bg-transparent px-2 py-1 text-xs font-medium text-[var(--hp-text-chip)]">
                {topic}
              </span>
            ))}
          </div>
          <Button size="sm" className="mt-3 h-10 rounded-[8px] border border-[var(--hp-action)] bg-[var(--hp-action-soft)] font-semibold text-[var(--hp-action-soft-text)] hover:bg-[var(--hp-action-soft-hover)]">
            Start Reading
          </Button>
        </div>
      </div>
      <div className="mt-5 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [contain:paint]">
        {interestChips.map((chip, index) => {
          const isActive = index === 0;

          return (
            <button
              key={chip}
              type="button"
              aria-pressed={isActive}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-sm transition focus-visible:bg-[var(--hp-friendly-accent)] focus-visible:text-[var(--hp-friendly-accent-text)] focus-visible:outline-none",
                isActive
                  ? "bg-[var(--hp-friendly-accent)] font-bold text-[var(--hp-friendly-accent-text)] hover:bg-[var(--hp-friendly-accent-hover)]"
                  : "bg-transparent font-medium text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control)] hover:text-[var(--hp-text-primary)]",
              )}
            >
              {isActive && <CheckCircleIcon className="size-3.5" weight="fill" />}
              {chip}
            </button>
          );
        })}
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
      data-mode="light"
      style={hearstPlusLightVars}
      className={cn(
        "hearst-plus-theme fixed inset-0 z-50 bg-[var(--hp-background)] hearst-plus-article-backdrop",
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
          "fixed inset-0 overflow-y-auto bg-[var(--hp-background)] text-[var(--hp-text-primary)] hearst-plus-article-dialog",
          isClosing && "hearst-plus-article-dialog-out",
        )}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close article and return to AUTOS home"
          className="fixed right-4 top-4 z-30 flex size-14 items-center justify-center rounded-full border border-[var(--hp-border)] bg-[var(--hp-control)] text-[var(--hp-text-primary)] shadow-[var(--hp-shadow-modal)] transition hover:bg-[var(--hp-control-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)] md:right-6 md:size-16"
          onClick={onClose}
        >
          <XIcon className="size-8" weight="bold" />
        </button>

        <div className="sticky top-0 z-20 border-b border-[var(--hp-border)] bg-[var(--hp-nav-translucent)] pr-20 backdrop-blur">
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
                <span className="text-lg font-extrabold text-[var(--hp-text-primary)]">{brand.name}</span>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-[var(--hp-friendly-accent-border)] bg-transparent px-5 text-sm font-extrabold text-[var(--hp-friendly-accent-text)] hover:bg-[var(--hp-friendly-accent)] hover:text-[var(--hp-friendly-accent-text)]"
                >
                  Follow
                </Button>
              </div>

              <h1 id={headingId} className="max-w-3xl text-pretty font-headline text-4xl leading-[1.03] text-[var(--hp-text-headline)] [font-weight:700] md:text-5xl">
                {item.title}
              </h1>

              <div className="mt-6 space-y-1 text-base leading-7 text-[var(--hp-text-secondary)]">
                <p className="font-extrabold text-[var(--hp-text-primary)]">{brand.name} Editors</p>
                <p>
                  {item.topic} · {item.readTime} read
                </p>
                <p>{item.signal}</p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button className="h-12 rounded-full bg-[var(--hp-action)] px-5 font-extrabold text-[var(--hp-action-text)] hover:bg-[var(--hp-action-hover)]">
                  <BookmarkSimpleIcon className="size-5" weight="bold" />
                  Save Story
                </Button>
                <button
                  type="button"
                  aria-label={`Share ${item.title}`}
                  className="flex size-12 items-center justify-center rounded-full border border-[var(--hp-border-strong)] text-[var(--hp-text-primary)] transition hover:bg-[var(--hp-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                >
                  <ShareNetworkIcon className="size-5" weight="bold" />
                </button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-[var(--hp-border)] bg-transparent px-5 font-extrabold text-[var(--hp-text-primary)] hover:bg-[var(--hp-control)] hover:text-[var(--hp-text-primary)]"
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
                  className="absolute left-3 top-3 h-8 rounded-[8px] bg-white/94 px-3 text-xs font-extrabold text-[var(--hp-ink-on-light)]"
                >
                  <Icon className="size-3.5" weight="bold" />
                  {item.topic}
                </Badge>
              </ImageFrame>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--hp-border)] bg-[var(--hp-chip)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-chip)]">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-8 max-w-2xl text-xl leading-8 text-[var(--hp-text-secondary)]">{item.summary}</p>

              <div className="mt-8 max-w-2xl space-y-7 text-lg leading-9 text-[var(--hp-text-ui)]">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block">
              <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-5">
                <h2 className="text-sm font-extrabold text-[var(--hp-text-primary)]">In Your Brief</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
                  This story sits with buying, racing, performance, and EVs in today&apos;s 5-minute read.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {briefTopics.map((topic) => (
                    <span key={topic} className="rounded-full bg-[var(--hp-chip)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-chip)]">
                      {topic}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-5">
                <h2 className="text-sm font-extrabold text-[var(--hp-text-primary)]">Related Reads</h2>
                <div className="mt-4 space-y-4">
                  {relatedItems
                    .filter((feedItem) => feedItem.id !== item.id)
                    .slice(0, 3)
                    .map((feedItem) => (
                      <button key={feedItem.id} type="button" className="block w-full text-left">
                        <p className="text-sm font-bold leading-5 text-[var(--hp-text-primary)]">{feedItem.title}</p>
                        <p className="mt-1 text-xs text-[var(--hp-text-muted)]">{getBrand(feedItem.brandSlug).name}</p>
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
      window.history.pushState({ hearstPlusStory: item.id }, "", `/hearst-autos/?${params.toString()}`);
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
        window.history.pushState({ hearstPlusStory: null }, "", "/hearst-autos/");
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
      data-mode="light"
      className="hearst-plus-theme min-h-screen overflow-x-clip bg-[var(--hp-background)] text-[var(--hp-text-primary)] [font-family:var(--hp-font-ui)]"
      style={
        {
          ...hearstPlusLightVars,
          "--font-headline": "var(--hp-font-headline)",
          "--font-headline-weight": "var(--hp-font-headline-weight)",
        } as React.CSSProperties
      }
    >
      <div
        className="min-h-screen w-full"
        aria-hidden={selectedStory ? true : undefined}
        inert={selectedStory ? true : undefined}
      >
        <AppHeader />
        <BrandUniverseStrip />
        <div className="mx-auto min-h-screen w-full max-w-[1280px] bg-[var(--hp-background)]">
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
