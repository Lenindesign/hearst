import {
  autosRiverSourceNotes,
} from "@/components/autos-river-data";
import {
  ewRiverSourceNotes,
} from "@/components/ew-river-data";
import {
  fluxRiverSourceNotes,
} from "@/components/flux-river-data";
import {
  lifestyleRiverSourceNotes,
} from "@/components/lifestyle-river-data";

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
  all: ["For You", "Home", "Style", "Reviews", "Fitness", "Cars", "Videos", "Shopping", "Saved"],
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

const sectionSourceNotes = {
  lifestyle: lifestyleRiverSourceNotes,
  autos: autosRiverSourceNotes,
  flux: fluxRiverSourceNotes,
  ew: ewRiverSourceNotes,
} as const;

export const hearstSectionThemeSlugs: Record<HearstBrandSection, string> = {
  lifestyle: "hearst-lifestyle",
  autos: "hearst-plus",
  flux: "hearst-flux",
  ew: "hearst-ew",
};

export function getHearstBrandSection(brandSlug: string): HearstBrandSection {
  if (sectionSourceNotes.autos.some((note) => note.brandSlug === brandSlug)) return "autos";
  if (sectionSourceNotes.flux.some((note) => note.brandSlug === brandSlug)) return "flux";
  if (sectionSourceNotes.ew.some((note) => note.brandSlug === brandSlug)) return "ew";
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
  return sectionSourceNotes[section].map((note) => note.brandSlug);
}

export function getHearstSectionBrand(section: HearstBrandSection, brandSlug: string) {
  return sectionSourceNotes[section].find((note) => note.brandSlug === brandSlug);
}

export function getHearstAllBrands() {
  return Object.values(sectionSourceNotes).flat();
}
