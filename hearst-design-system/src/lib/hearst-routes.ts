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
