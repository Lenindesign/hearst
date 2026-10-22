// Rebuilt logos carry a version so cached copies (BrandLogo keeps markup per src) refresh.
export const brandLogos: Record<string, string> = {
  "autoweek": "/logos/autoweek.svg",
  "a-e": "/logos/aande.svg",
  "hearst-entertainment": "/logos/aande-family.svg?v=2026-10-11b",
  "best-products": "/logos/bestproducts.svg",
  "bicycling": "/logos/bicycling.svg",
  "biography": "/logos/biography.svg",
  "bring-a-trailer": "/logos/bring-a-trailer.svg",
  "car-and-driver": "/logos/caranddriver.svg",
  "cosmopolitan": "/logos/cosmo.svg",
  "country-living": "/logos/country.svg",
  "delish": "/logos/delish.svg",
  "elle": "/logos/elle.svg",
  "elle-decor": "/logos/elle-decor.svg",
  "esquire": "/logos/esquire.svg",
  "good-housekeeping": "/logos/good-housekeeping.svg",
  "harpers-bazaar": "/logos/harpers.svg",
  "hearst-eandw": "/logos/hearst-eandw.svg?v=2026-10-11",
  "hearst-ew": "/logos/hearst-ew-official.svg?v=2026-10-11",
  "hearst-ew-knockout": "/logos/hearst-ew-knockout.svg?v=2026-10-21a",
  "hearst-flux": "/logos/hearst-fashion-luxury.svg?v=2026-10-11",
  "hearst-flux-knockout": "/logos/hearst-flux-knockout.svg?v=2026-10-21a",
  "hearst-flux-compact": "/logos/hearst-flux.svg?v=2026-10-11",
  "hearst-all": "/logos/hearst-plus.svg?v=2026-10-11",
  // White HEARST with the blue plus, for the navy Hearst+ banner.
  "hearst-all-knockout": "/logos/hearst-plus-knockout.svg?v=2026-10-11c",
  // Hearst+ feature lockup: HEARST+ wordmark plus a Schibsted Grotesk descriptor (BRAND_STYLES.md).
  "hearst-communities": "/logos/hearst-plus-communities.svg?v=2026-10-11",
  "hearst-autos": "/logos/hearst-autos.svg?v=2026-10-11",
  "hearst-autos-knockout": "/logos/hearst-autos-knockout.svg?v=2026-10-21a",
  "hearst-local-news": "/logos/hearst-local-news.svg?v=2026-10-11",
  "hearst-plus": "/logos/hearst-autos.svg?v=2026-10-11",
  "hearst-wordmark": "/logos/hearst-wordmark.svg",
  "hearst-lifestyle": "/logos/hearst-lifestyle.svg?v=2026-10-11",
  "hearst-lifestyle-knockout": "/logos/hearst-lifestyle-knockout.svg?v=2026-10-21a",
  "house-beautiful": "/logos/house.svg",
  "hot-rod": "/logos/hot-rod.svg",
  "mens-health": "/logos/mens.svg",
  "motortrend": "/logos/motortrend.svg",
  "oprah-daily": "/logos/oprah.svg",
  "popular-mechanics": "/logos/popular.svg",
  "prevention": "/logos/prevention.svg",
  "redbook": "/logos/redbook.svg",
  "road-and-track": "/logos/roadandtrack.svg",
  "runners-world": "/logos/runners.svg",
  "seventeen": "/logos/seventeen.svg",
  "the-pioneer-woman": "/logos/pioneer.svg",
  "pioneer-woman": "/logos/pioneer.svg",
  "town-and-country": "/logos/town.svg",
  "veranda": "/logos/veranda.svg",
  "womans-day": "/logos/womans.svg",
  "womens-health": "/logos/womenshealth.svg",
};

/**
 * Reader-facing names for every registered wordmark.
 *
 * Keep this beside the asset registry so a logo has one canonical source and
 * one canonical accessible name across the application and Storybook.
 */
export const brandLogoLabels: Record<keyof typeof brandLogos, string> = {
  "autoweek": "Autoweek",
  "a-e": "A&E",
  "hearst-entertainment": "A&E",
  "best-products": "Best Products",
  "bicycling": "Bicycling",
  "biography": "Biography",
  "bring-a-trailer": "Bring a Trailer",
  "car-and-driver": "Car and Driver",
  "cosmopolitan": "Cosmopolitan",
  "country-living": "Country Living",
  "delish": "Delish",
  "elle": "ELLE",
  "elle-decor": "ELLE Decor",
  "esquire": "Esquire",
  "good-housekeeping": "Good Housekeeping",
  "harpers-bazaar": "Harper's BAZAAR",
  "hearst-eandw": "Hearst Enthusiast & Wellness",
  "hearst-ew": "Hearst Enthusiast & Wellness",
  "hearst-ew-knockout": "Hearst Enthusiast & Wellness",
  "hearst-flux": "Hearst Fashion & Luxury",
  "hearst-flux-knockout": "Hearst Fashion & Luxury",
  "hearst-flux-compact": "Hearst Fashion & Luxury",
  "hearst-all": "Hearst+",
  "hearst-all-knockout": "Hearst+",
  "hearst-communities": "Hearst+ Communities",
  "hearst-autos": "Hearst Autos",
  "hearst-autos-knockout": "Hearst Autos",
  "hearst-local-news": "Hearst Local News",
  "hearst-plus": "Hearst Autos",
  "hearst-wordmark": "HEARST",
  "hearst-lifestyle": "Hearst Lifestyle",
  "hearst-lifestyle-knockout": "Hearst Lifestyle",
  "house-beautiful": "House Beautiful",
  "hot-rod": "HOT ROD",
  "mens-health": "Men's Health",
  "motortrend": "MotorTrend",
  "oprah-daily": "Oprah Daily",
  "popular-mechanics": "Popular Mechanics",
  "prevention": "Prevention",
  "redbook": "Redbook",
  "road-and-track": "Road & Track",
  "runners-world": "Runner's World",
  "seventeen": "Seventeen",
  "the-pioneer-woman": "The Pioneer Woman",
  "pioneer-woman": "The Pioneer Woman",
  "town-and-country": "Town & Country",
  "veranda": "Veranda",
  "womans-day": "Woman's Day",
  "womens-health": "Women's Health",
};

export const brandIconLogos: Partial<Record<string, string>> = {
  "cosmopolitan": "https://www.cosmopolitan.com/_assets/design-tokens/cosmopolitan/static/images/apple-touch-icon.b887080.png",
  "country-living": "https://www.countryliving.com/_assets/design-tokens/countryliving/static/images/apple-touch-icon.d0a32c5.png",
  "delish": "https://www.delish.com/_assets/design-tokens/delish/static/images/apple-touch-icon.8adc1b7.png",
  "good-housekeeping": "https://www.goodhousekeeping.com/_assets/design-tokens/goodhousekeeping/static/images/apple-touch-icon.da59c7c.png",
  "house-beautiful": "https://www.housebeautiful.com/_assets/design-tokens/housebeautiful/static/images/apple-touch-icon.72cedc1.png",
  "pioneer-woman": "https://www.thepioneerwoman.com/_assets/design-tokens/thepioneerwoman/static/images/apple-touch-icon.8133a54.png",
  "prevention": "https://www.prevention.com/_assets/design-tokens/prevention/static/images/apple-touch-icon.ac12bc0.png",
  "redbook": "https://www.redbookmag.com/_assets/design-tokens/redbookmag/static/images/apple-touch-icon.659f723.png",
  "seventeen": "https://www.seventeen.com/_assets/design-tokens/seventeen/static/images/apple-touch-icon.11a9327.png",
  "womans-day": "https://www.womansday.com/_assets/design-tokens/womansday/static/images/apple-touch-icon.bc2afd6.png",
  "autoweek": "https://www.autoweek.com/_assets/design-tokens/autoweek/static/images/apple-touch-icon.b919ce0.png",
  "bring-a-trailer": "https://bringatrailer.com/wp-content/themes/bringatrailer/assets/img/google-chrome-icon-192x192.png?v=4be5ad7eef",
  "car-and-driver": "https://www.caranddriver.com/_assets/design-tokens/caranddriver/static/images/apple-touch-icon.57b92b6.png",
  "hot-rod": "https://www.hotrod.com/logo/hotrod/icon.ico",
  "motortrend": "https://www.motortrend.com/logo/motortrend/icon.ico",
  "road-and-track": "/logos/roadandtrack-lettermark.svg",
  "elle": "https://www.elle.com/_assets/design-tokens/elle/static/images/apple-touch-icon.0dd915e.png",
  "elle-decor": "https://www.elledecor.com/_assets/design-tokens/elledecor/static/images/apple-touch-icon.c51311f.png",
  "esquire": "https://www.esquire.com/_assets/design-tokens/esquire/static/images/apple-touch-icon.1801cd0.png",
  "harpers-bazaar": "https://www.harpersbazaar.com/_assets/design-tokens/harpersbazaar/static/images/apple-touch-icon.b5179c9.png",
  "town-and-country": "https://www.townandcountrymag.com/_assets/design-tokens/townandcountrymag/static/images/apple-touch-icon.3ab52cc.png",
  "veranda": "https://www.veranda.com/_assets/design-tokens/veranda/static/images/apple-touch-icon.bed0f30.png",
  "best-products": "https://www.bestproducts.com/_assets/design-tokens/bestproducts/static/images/apple-touch-icon.721cffe.png",
  "bicycling": "https://www.bicycling.com/_assets/design-tokens/bicycling/static/images/apple-touch-icon.5c91a4c.png",
  "mens-health": "https://www.menshealth.com/_assets/design-tokens/menshealth/static/images/apple-touch-icon.35eef3d.png",
  "oprah-daily": "https://www.oprahdaily.com/_assets/design-tokens/oprahdaily/static/images/apple-touch-icon.e245e23.png",
  "popular-mechanics": "https://www.popularmechanics.com/_assets/design-tokens/popularmechanics/static/images/apple-touch-icon.5d5fa0d.png",
  "runners-world": "https://www.runnersworld.com/_assets/design-tokens/runnersworld/static/images/favicon.7c41e8e.ico",
  "womens-health": "https://www.womenshealthmag.com/_assets/design-tokens/womenshealthmag/static/images/apple-touch-icon.6b2985f.png",
};

export function getBrandLogoSrc(slug: string, variant: "logo" | "icon" = "logo") {
  return variant === "icon" ? brandIconLogos[slug] ?? brandLogos[slug] : brandLogos[slug];
}

export function getBrandLogoLabel(slug: string) {
  return brandLogoLabels[slug];
}

// Hearst+ and destination logos are two-tone (navy HEARST, blue plus or section name). They keep their own colors unless a surface asks
// for a knockout (white) version; brand-color tints would flatten them into one color.
const twoToneLogoSlugs = new Set([
  "hearst-all",
  "hearst-all-knockout",
  "hearst-communities",
  // Destination lockups: navy HEARST, divider, Hearst+ blue section name.
  "hearst-lifestyle",
  "hearst-autos",
  "hearst-plus",
  "hearst-flux",
  "hearst-flux-compact",
  "hearst-ew",
  "hearst-eandw",
  "hearst-local-news",
  // A&E Family sits on a dark masthead: white HEARST, gold divider and name.
  "hearst-entertainment",
]);

export function isKnockoutLogoColor(color: string) {
  return /knockout|white|#fff(?:fff)?\b/i.test(color);
}

export function resolveBrandLogoColor(slug: string, color?: string) {
  if (!color) return undefined;
  return twoToneLogoSlugs.has(slug) && !isKnockoutLogoColor(color) ? undefined : color;
}
