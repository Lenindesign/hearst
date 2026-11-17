/**
 * Reader taxonomy proposal (HP-TAX-PROP · Draft · 2026-11-17).
 *
 * Proposal data only: nothing in the app reads this file. The current
 * taxonomy (sales cohorts) stays in src/lib/hearst-routes.ts. Story counts are
 * computed from the validated feed snapshots when the page is built, so they
 * follow each daily feed refresh.
 */
import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandSection, type HearstBrandSection } from "@/lib/hearst-routes";

export const taxonomyStories: LifestyleRiverStory[] = [
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...fluxRiverStories,
  ...ewRiverStories,
];

/** Option A: five reader-facing brand families. Each brand sits in exactly one. */
export type BrandFamily = "home-food" | "style-culture" | "health-fitness" | "cars" | "tech-gear";

export const brandFamilies: readonly {
  id: BrandFamily;
  label: string;
  theme: string;
  categories: string;
  brands: readonly string[];
}[] = [
  {
    id: "home-food",
    label: "Home & Food",
    theme: "Lifestyle (hearst-lifestyle)",
    categories: "Recipes, Home, Design, Shopping, Holidays, Family",
    brands: ["country-living", "delish", "good-housekeeping", "house-beautiful", "pioneer-woman", "redbook", "womans-day", "elle-decor", "veranda"],
  },
  {
    id: "style-culture",
    label: "Style & Culture",
    theme: "Fashion & Luxury (hearst-flux)",
    categories: "Fashion, Beauty, Culture, Celebrity, Events, Travel",
    brands: ["cosmopolitan", "seventeen", "elle", "harpers-bazaar", "esquire", "town-and-country"],
  },
  {
    id: "health-fitness",
    label: "Health & Fitness",
    theme: "Enthusiast & Wellness (hearst-ew)",
    categories: "Fitness, Running, Cycling, Nutrition, Wellness, Life",
    brands: ["prevention", "mens-health", "womens-health", "runners-world", "bicycling", "oprah-daily"],
  },
  {
    id: "cars",
    label: "Cars",
    theme: "Autos (hearst-plus slug)",
    categories: "News, Reviews, Research Cars, EVs, Racing, Trucks, Classics",
    brands: ["autoweek", "bring-a-trailer", "car-and-driver", "hot-rod", "motortrend", "road-and-track"],
  },
  {
    id: "tech-gear",
    label: "Tech & Gear",
    theme: "Hearst+ (hearst-all), pending a decision",
    categories: "Gear, Tech, Science, Deals",
    brands: ["popular-mechanics", "best-products"],
  },
];

export function getProposedBrandFamily(brandSlug: string) {
  return brandFamilies.find((family) => family.brands.includes(brandSlug));
}

/** The cohort each family mostly comes from, to show which brands move. */
export const familyHomeCohort: Record<BrandFamily, HearstBrandSection> = {
  "home-food": "lifestyle",
  "style-culture": "flux",
  "health-fitness": "ew",
  cars: "autos",
  "tech-gear": "ew",
};

/** Option B/C: cross-brand interests, built from normalized story topics. */
export type ReaderInterest =
  | "Food"
  | "Home & Design"
  | "Style & Beauty"
  | "Health & Fitness"
  | "Cars"
  | "Culture"
  | "Shopping"
  | "Tech & Gear";

export const readerInterests: readonly { label: ReaderInterest; route: string; theme: string }[] = [
  { label: "Food", route: "/hearst-plus/food/", theme: "Lifestyle" },
  { label: "Home & Design", route: "/hearst-plus/home-and-design/", theme: "Lifestyle" },
  { label: "Style & Beauty", route: "/hearst-plus/style-and-beauty/", theme: "Fashion & Luxury" },
  { label: "Health & Fitness", route: "/hearst-plus/health-and-fitness/", theme: "Enthusiast & Wellness" },
  { label: "Cars", route: "/hearst-plus/cars/", theme: "Autos" },
  { label: "Culture", route: "/hearst-plus/culture/", theme: "Fashion & Luxury" },
  { label: "Shopping", route: "/hearst-plus/shopping/", theme: "Hearst+" },
  { label: "Tech & Gear", route: "/hearst-plus/tech-and-gear/", theme: "Hearst+" },
];

/** Feed topic strings (as each brand's RSS names them) → proposed interest. */
export const topicToInterest: Record<string, ReaderInterest> = {
  Food: "Food",
  "Food Cooking": "Food",
  "Food News": "Food",
  "Food Nutrition": "Food",
  "Food Drinks": "Food",
  "Food Cocktails": "Food",
  "Kitchen Tools": "Food",
  Entertaining: "Food",
  "Holidays Celebrations": "Food",
  Home: "Home & Design",
  "Home Maintenance": "Home & Design",
  "Home Remodeling": "Home & Design",
  "Home Lifestyle": "Home & Design",
  "Real Estate": "Home & Design",
  "Diy Crafts": "Home & Design",
  Design: "Home & Design",
  Style: "Style & Beauty",
  "Style Beauty": "Style & Beauty",
  Beauty: "Style & Beauty",
  Wellness: "Health & Fitness",
  Body: "Health & Fitness",
  Fitness: "Health & Fitness",
  Entertainment: "Culture",
  "News Entertainment": "Culture",
  Culture: "Culture",
  Events: "Culture",
  Features: "Culture",
  Horoscopes: "Culture",
  Relationships: "Culture",
  Pleasure: "Culture",
  Travel: "Culture",
  Life: "Culture",
  "Ree Drummond Life": "Culture",
  Family: "Culture",
  Lifestyle: "Culture",
  Shopping: "Shopping",
  "What To Buy": "Shopping",
  Gear: "Tech & Gear",
  Tech: "Tech & Gear",
};

/** Every auto-cohort story is Cars, whatever its feed topic ("News", "Features", "EVs"). */
export function getProposedInterest(story: LifestyleRiverStory): ReaderInterest | undefined {
  if (getHearstBrandSection(story.brandSlug) === "autos") return "Cars";
  return topicToInterest[story.topic];
}
