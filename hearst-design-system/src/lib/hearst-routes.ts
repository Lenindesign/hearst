export type HearstDestinationMode = "all" | "lifestyle" | "autos" | "flux" | "ew";
export type HearstBrandSection = Exclude<HearstDestinationMode, "all">;

export const hearstDestinationRoutes: Record<HearstDestinationMode, string> = {
  all: "/hearst-plus/",
  lifestyle: "/hearst-lifestyle/",
  autos: "/hearst-autos/",
  flux: "/hearst-flux/",
  ew: "/hearst-ew/",
};

export const hearstDestinationCategoryLabels: Record<HearstDestinationMode, readonly string[]> = {
  all: ["For You", "Home", "Style", "Reviews", "Fitness", "Cars", "Videos", "Shopping", "Games", "Saved"],
  lifestyle: ["For You", "Food", "Home", "Wellness", "Style", "Videos", "Shopping", "Family", "Entertainment", "Saved"],
  autos: ["For You", "News", "Reviews", "Buying Guides", "EVs", "Racing", "Trucks", "Classics", "Videos", "Saved"],
  flux: ["For You", "Style", "Beauty", "Design", "Culture", "Videos", "Shopping", "Events", "Travel", "Saved"],
  ew: ["For You", "Fitness", "Wellness", "Gear", "Tech", "Adventure", "Nutrition", "Life", "Videos", "Saved"],
};

function getCategorySlug(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getHearstDestinationCategoryRoute(mode: HearstDestinationMode, label: string) {
  const categoryLabel = hearstDestinationCategoryLabels[mode].find((candidate) => candidate === label);
  if (!categoryLabel) return undefined;
  return `${hearstDestinationRoutes[mode]}${getCategorySlug(categoryLabel)}/`;
}

export function getHearstDestinationCategoryLabel(mode: HearstDestinationMode, categorySlug: string) {
  return hearstDestinationCategoryLabels[mode].find((label) => getCategorySlug(label) === categorySlug);
}

export const hearstLegacyDestinationRedirects: Record<string, string> = {
  "/hearst-all/": hearstDestinationRoutes.all,
  "/hearst-edit/": hearstDestinationRoutes.lifestyle,
};

export const hearstSectionPrefixes: Record<HearstBrandSection, string> = {
  lifestyle: "lifestyle",
  autos: "autos",
  flux: "flux",
  ew: "ew",
};

const sectionBrands: Record<HearstBrandSection, readonly { brand: string; brandSlug: string }[]> = {
  lifestyle: [
    { brand: "Cosmopolitan", brandSlug: "cosmopolitan" },
    { brand: "Country Living", brandSlug: "country-living" },
    { brand: "Delish", brandSlug: "delish" },
    { brand: "Good Housekeeping", brandSlug: "good-housekeeping" },
    { brand: "House Beautiful", brandSlug: "house-beautiful" },
    { brand: "The Pioneer Woman", brandSlug: "pioneer-woman" },
    { brand: "Prevention", brandSlug: "prevention" },
    { brand: "Redbook", brandSlug: "redbook" },
    { brand: "Seventeen", brandSlug: "seventeen" },
    { brand: "Woman's Day", brandSlug: "womans-day" },
  ],
  autos: [
    { brand: "Autoweek", brandSlug: "autoweek" },
    { brand: "Bring a Trailer", brandSlug: "bring-a-trailer" },
    { brand: "Car and Driver", brandSlug: "car-and-driver" },
    { brand: "HOT ROD", brandSlug: "hot-rod" },
    { brand: "MotorTrend", brandSlug: "motortrend" },
    { brand: "Road & Track", brandSlug: "road-and-track" },
  ],
  flux: [
    { brand: "Elle", brandSlug: "elle" },
    { brand: "Elle Décor", brandSlug: "elle-decor" },
    { brand: "Esquire", brandSlug: "esquire" },
    { brand: "Harper's Bazaar", brandSlug: "harpers-bazaar" },
    { brand: "Town & Country", brandSlug: "town-and-country" },
    { brand: "Veranda", brandSlug: "veranda" },
  ],
  ew: [
    { brand: "Best Products", brandSlug: "best-products" },
    { brand: "Bicycling", brandSlug: "bicycling" },
    { brand: "Men's Health", brandSlug: "mens-health" },
    { brand: "Oprah Daily", brandSlug: "oprah-daily" },
    { brand: "Popular Mechanics", brandSlug: "popular-mechanics" },
    { brand: "Runner's World", brandSlug: "runners-world" },
    { brand: "Women's Health", brandSlug: "womens-health" },
  ],
} as const;

export const hearstSectionThemeSlugs: Record<HearstBrandSection, string> = {
  lifestyle: "hearst-lifestyle",
  autos: "hearst-plus",
  flux: "hearst-flux",
  ew: "hearst-ew",
};

export const hearstReaderSectionLabels: Record<HearstBrandSection, string> = {
  lifestyle: "Lifestyle",
  autos: "Autos",
  flux: "Fashion & Luxury",
  ew: "Enthusiast & Wellness",
};

export const hearstReaderSections = (
  ["lifestyle", "autos", "flux", "ew"] as const
).map((mode) => ({
  mode,
  label: hearstReaderSectionLabels[mode],
}));

export function getHearstBrandSection(brandSlug: string): HearstBrandSection {
  if (sectionBrands.autos.some((brand) => brand.brandSlug === brandSlug)) return "autos";
  if (sectionBrands.flux.some((brand) => brand.brandSlug === brandSlug)) return "flux";
  if (sectionBrands.ew.some((brand) => brand.brandSlug === brandSlug)) return "ew";
  return "lifestyle";
}

export function getHearstBrandRoute(brandSlug: string) {
  const section = getHearstBrandSection(brandSlug);
  return `/${hearstSectionPrefixes[section]}/${brandSlug}/`;
}

export function getHearstDestinationRoute(mode: HearstDestinationMode) {
  return hearstDestinationRoutes[mode];
}

export function getHearstSectionBrandSlugs(section: HearstBrandSection) {
  return sectionBrands[section].map((brand) => brand.brandSlug);
}

export function getHearstSectionBrand(section: HearstBrandSection, brandSlug: string) {
  return sectionBrands[section].find((brand) => brand.brandSlug === brandSlug);
}

export function getHearstSectionBrands(section: HearstBrandSection) {
  return sectionBrands[section];
}

export function getHearstAllBrands() {
  return Object.values(sectionBrands).flat();
}
