export type AmbientInterstitialAdvertiser =
  | "van-cleef"
  | "blancpain"
  | "lexus"
  | "marriott"
  | "porsche"
  | "princess";

export type AmbientInterstitialTheme = {
  shell: string;
  surface: string;
  ink: string;
  muted: string;
  body: string;
  cta: string;
  ctaContent: string;
  ctaHover: string;
  media: string;
  overlay: string;
};

/**
 * Campaign art direction is intentionally scoped to the interstitial.
 * The rendering component consumes this configuration through semantic
 * `--ambient-ad-*` variables so campaign colors cannot leak into HDS themes.
 */
export const ambientInterstitialThemes: Record<
  AmbientInterstitialAdvertiser,
  AmbientInterstitialTheme
> = {
  "van-cleef": {
    shell: "#101b2e",
    surface: "#101b2e",
    ink: "#f4f5f7",
    muted: "#b8c7df",
    body: "#d8e0ee",
    cta: "#f4f5f7",
    ctaContent: "#101b2e",
    ctaHover: "#cbd8ed",
    media: "#203b62",
    overlay: "linear-gradient(to top, rgb(16 27 46 / 55%), transparent, rgb(16 27 46 / 10%))",
  },
  blancpain: {
    shell: "#111111",
    surface: "#f4f2ed",
    ink: "#171717",
    muted: "#5f665f",
    body: "#4f514e",
    cta: "#171717",
    ctaContent: "#ffffff",
    ctaHover: "#38443e",
    media: "#26342f",
    overlay: "linear-gradient(to top, rgb(17 17 17 / 45%), transparent)",
  },
  lexus: {
    shell: "#111111",
    surface: "#e9e9e7",
    ink: "#161616",
    muted: "#5b5e5e",
    body: "#444847",
    cta: "#161616",
    ctaContent: "#ffffff",
    ctaHover: "#3b3f3e",
    media: "#28302f",
    overlay: "linear-gradient(to top, rgb(17 17 17 / 55%), transparent)",
  },
  marriott: {
    shell: "#111111",
    surface: "#f1eee8",
    ink: "#20252a",
    muted: "#667078",
    body: "#4a5157",
    cta: "#20252a",
    ctaContent: "#ffffff",
    ctaHover: "#46515a",
    media: "#30424b",
    overlay: "linear-gradient(to top, rgb(17 17 17 / 55%), transparent)",
  },
  porsche: {
    shell: "#0b0b0b",
    surface: "#f4f3f0",
    ink: "#171717",
    muted: "#6c6c68",
    body: "#4d4d49",
    cta: "#171717",
    ctaContent: "#ffffff",
    ctaHover: "#444444",
    media: "#303332",
    overlay: "linear-gradient(to top, rgb(11 11 11 / 55%), transparent)",
  },
  princess: {
    shell: "#101a2a",
    surface: "#eaf1f3",
    ink: "#102338",
    muted: "#5e7487",
    body: "#41566b",
    cta: "#102338",
    ctaContent: "#ffffff",
    ctaHover: "#39546b",
    media: "#31546d",
    overlay: "linear-gradient(to top, rgb(16 26 42 / 55%), transparent)",
  },
};
