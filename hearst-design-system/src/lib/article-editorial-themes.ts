export type EditorialMood =
  | "architecture"
  | "road"
  | "ranch"
  | "ride"
  | "food"
  | "profile"
  | "default";

export type EditorialThemePalette = {
  shell: string;
  paper: string;
  wash: string;
  dark: string;
  accent: string;
  invertedAccent: string;
};

/**
 * Scoped art-direction palettes for cinematic editorial templates.
 *
 * These values are configuration rather than reusable design-system tokens:
 * they express story mood while the component consumes them through a stable
 * semantic CSS-variable contract.
 */
export const editorialThemePalettes: Record<EditorialMood, EditorialThemePalette> = {
  architecture: {
    shell: "#f1eee8",
    paper: "#f8f6f1",
    wash: "#e6e0d7",
    dark: "#232334",
    accent: "#6f6d98",
    invertedAccent: "#d9d5ff",
  },
  road: {
    shell: "#eef3f4",
    paper: "#f5f8f8",
    wash: "#dceaf0",
    dark: "#081314",
    accent: "#1f6386",
    invertedAccent: "#8ed0ed",
  },
  ranch: {
    shell: "#f6efe6",
    paper: "#fbf7ef",
    wash: "#eadbc8",
    dark: "#211711",
    accent: "#8b5a2f",
    invertedAccent: "#f4d29a",
  },
  ride: {
    shell: "#eef8fb",
    paper: "#f8fcfd",
    wash: "#d8f0f6",
    dark: "#062634",
    accent: "#0f88ac",
    invertedAccent: "#8bd9ee",
  },
  food: {
    shell: "#fff4cf",
    paper: "#fffaf0",
    wash: "#ffe8a8",
    dark: "#35150f",
    accent: "#d44f1e",
    invertedAccent: "#ffe167",
  },
  profile: {
    shell: "#f2efec",
    paper: "#f8f5f2",
    wash: "#201a19",
    dark: "#050505",
    accent: "#c93326",
    invertedAccent: "#f04a3a",
  },
  default: {
    shell: "#fff2f4",
    paper: "#fff8f9",
    wash: "#f5e7e9",
    dark: "#13080a",
    accent: "var(--primary)",
    invertedAccent: "var(--primary)",
  },
};

export function getEditorialMood(brandSlug: string): EditorialMood {
  if (["autoweek", "car-and-driver", "popular-mechanics", "road-and-track"].includes(brandSlug)) return "road";
  if (brandSlug === "country-living") return "ranch";
  if (["bicycling", "mens-health", "runners-world", "womens-health"].includes(brandSlug)) return "ride";
  if (["delish", "the-pioneer-woman", "womans-day"].includes(brandSlug)) return "food";
  if (["biography", "esquire", "harpers-bazaar", "redbook", "seventeen", "town-and-country"].includes(brandSlug)) return "profile";
  if (["elle", "elle-decor", "house-beautiful", "veranda"].includes(brandSlug)) return "architecture";
  return "default";
}

export function getEditorialThemePalette(brandSlug: string) {
  return editorialThemePalettes[getEditorialMood(brandSlug)];
}
