export type HearstInternationalFeed = {
  name: string;
  country: string;
  url: string;
};

export const hearstInternationalFeeds: HearstInternationalFeed[] = [
  { name: "Car and Driver ES", country: "ES", url: "https://www.caranddriver.com/es/" },
  { name: "Cosmopolitan ES", country: "ES", url: "https://www.cosmopolitan.com/es/" },
  { name: "DiezMinutos", country: "ES", url: "https://www.diezminutos.es/" },
  { name: "Elle ES", country: "ES", url: "https://www.elle.com/es/" },
  { name: "Elle Decor ES", country: "ES", url: "https://www.elledecor.com/es/" },
  { name: "Esquire ES", country: "ES", url: "https://www.esquire.com/es/" },
  { name: "Fotogramas", country: "ES", url: "https://www.fotogramas.es/" },
  { name: "Harper's Bazaar ES", country: "ES", url: "https://www.harpersbazaar.com/es/" },
  { name: "Men's Health ES", country: "ES", url: "https://www.menshealth.com/es/" },
  { name: "Nuevo Estilo", country: "ES", url: "http://nuevo-estilo.es/" },
  { name: "Runner's World ES", country: "ES", url: "https://www.runnersworld.com/es/" },
  { name: "Women's Health ES", country: "ES", url: "https://www.womenshealthmag.com/es/" },
  { name: "Quest NL", country: "NL", url: "https://www.quest.nl" },
  { name: "NatGeo NL", country: "NL", url: "https://www.nationalgeographic.nl" },
  { name: "Elle NL", country: "NL", url: "https://www.elle.com/nl/" },
  { name: "Harper's Bazaar NL", country: "NL", url: "https://www.harpersbazaar.com/nl/" },
  { name: "JAN Magazine", country: "NL", url: "https://www.jan-magazine.nl" },
  { name: "Quote NL", country: "NL", url: "https://www.quotenet.nl" },
  { name: "Elle IT", country: "IT", url: "https://www.elle.com/it/" },
  { name: "Runner's World IT", country: "IT", url: "https://www.runnersworld.com/it/" },
  { name: "Cosmopolitan IT", country: "IT", url: "https://www.cosmopolitan.com/it/" },
  { name: "Elle Decor IT", country: "IT", url: "https://www.elledecor.com/it/" },
  { name: "Esquire IT", country: "IT", url: "https://www.esquire.com/it/" },
  { name: "Harper's Bazaar IT", country: "IT", url: "https://www.harpersbazaar.com/it/" },
  { name: "Marie Claire IT", country: "IT", url: "https://www.marieclaire.com/it/" },
  { name: "Men's Health IT", country: "IT", url: "https://www.menshealth.com/it/" },
  { name: "Gente IT", country: "IT", url: "https://www.gente.it/" },
  { name: "25ans JP", country: "JP", url: "https://www.25ans.jp/" },
  { name: "Elle JP", country: "JP", url: "https://www.elle.com/jp/" },
  { name: "ElleGirl JP", country: "JP", url: "https://www.ellegirl.jp/" },
  { name: "Esquire JP", country: "JP", url: "https://www.esquire.com/jp/" },
  { name: "Fujingaho & Kimono premium", country: "JP", url: "https://www.fujingaho.jp/" },
  { name: "Harper's Bazaar JP", country: "JP", url: "https://www.harpersbazaar.com/jp/" },
  { name: "Modern Living Club membership", country: "JP", url: "https://www.modernliving.jp/" },
  { name: "Women's Health +", country: "JP", url: "https://shop.womenshealth-jp.com/" },
  { name: "Richesse JP", country: "JP", url: "https://www.richessemag.jp/" },
  { name: "Cosmopolitan UK", country: "UK", url: "https://www.cosmopolitan.com/uk/" },
  { name: "Country Living UK", country: "UK", url: "https://www.countryliving.com/uk/" },
  { name: "Digital Spy", country: "UK", url: "https://www.digitalspy.com/" },
  { name: "Elle UK", country: "UK", url: "https://www.elle.com/uk/" },
  { name: "Elle Decoration UK", country: "UK", url: "https://www.elledecoration.co.uk/" },
  { name: "Esquire UK", country: "UK", url: "https://www.esquire.com/uk/" },
  { name: "Good Housekeeping UK", country: "UK", url: "https://www.goodhousekeeping.com/uk/" },
  { name: "Harper's Bazaar UK", country: "UK", url: "https://www.harpersbazaar.com/uk/" },
  { name: "House Beautiful UK", country: "UK", url: "https://www.housebeautiful.com/uk/" },
  { name: "Men's Health UK", country: "UK", url: "https://www.menshealth.com/uk/" },
  { name: "Prima", country: "UK", url: "https://www.prima.co.uk/" },
  { name: "Red Online", country: "UK", url: "https://www.redonline.co.uk/" },
  { name: "Runner's World UK", country: "UK", url: "https://www.runnersworld.com/uk/" },
  { name: "Women's Health UK", country: "UK", url: "https://www.womenshealthmag.com/uk/" },
  { name: "Cosmopolitan TW", country: "TW", url: "https://www.cosmopolitan.com/tw/" },
  { name: "Elle TW", country: "TW", url: "https://www.elle.com/tw/" },
  { name: "Harper's Bazaar TW", country: "TW", url: "https://www.harpersbazaar.com/tw/" },
  { name: "Women's Health TW", country: "TW", url: "http://womenshealthmag.com/tw" },
  { name: "ELLE CN", country: "CN", url: "https://www.ellechina.com/" },
  { name: "ELLEMen CN", country: "CN", url: "https://www.ellemen.com/" },
];

export const hearstInternationalFeedCountries = Array.from(
  new Set(hearstInternationalFeeds.map((feed) => feed.country)),
);

export const hearstInternationalCountryNames: Record<string, string> = {
  ES: "Spain",
  NL: "Netherlands",
  IT: "Italy",
  JP: "Japan",
  UK: "United Kingdom",
  TW: "Taiwan",
  CN: "China",
};

export function getHearstInternationalFeed(url: string | null | undefined) {
  return hearstInternationalFeeds.find((feed) => feed.url === url);
}

export function getHearstInternationalFeedRssUrl(feed: HearstInternationalFeed) {
  const source = new URL(feed.url);
  const editionPath = source.pathname.endsWith("/") ? source.pathname : `${source.pathname}/`;
  return `${source.origin}${editionPath}rss/all.xml`;
}

export function getHearstInternationalFeedRssUrls(feed: HearstInternationalFeed) {
  const primaryUrl = getHearstInternationalFeedRssUrl(feed);
  if (feed.url === "https://www.ellechina.com/") {
    return [primaryUrl, "https://www.ellechina.com/rss/default.xml"];
  }
  return [primaryUrl];
}

const internationalBrandSlugsByHost: Record<string, string> = {
  "www.caranddriver.com": "car-and-driver",
  "www.cosmopolitan.com": "cosmopolitan",
  "www.countryliving.com": "country-living",
  "www.elle.com": "elle",
  "www.elledecor.com": "elle-decor",
  "www.esquire.com": "esquire",
  "www.harpersbazaar.com": "harpers-bazaar",
  "www.menshealth.com": "mens-health",
  "www.runnersworld.com": "runners-world",
  "www.womenshealthmag.com": "womens-health",
};

const internationalBrandLogoUrlsByHost: Record<string, string> = {
  "www.fotogramas.es": "https://www.fotogramas.es/_assets/design-tokens/fotogramas/static/images/logos/logo.11267eb.svg?primary=%2523ffffff",
  "www.ellechina.com": "https://www.ellechina.com/_assets/design-tokens/ellechina/static/images/logos/logo.2856426.svg?primary=%2523f3a7c3",
  "www.ellemen.com": "https://www.ellemen.com/_assets/design-tokens/ellemen/static/images/logos/logo.3436a52.svg?primary=%2523ffffff",
};

const internationalBrandFaviconUrlsByHost: Record<string, string> = {
  "www.fotogramas.es": "https://www.fotogramas.es/_assets/design-tokens/fotogramas/static/images/favicon.5adf214.ico",
  "www.ellechina.com": "https://www.ellechina.com/_assets/design-tokens/ellechina/static/images/favicon.bf092aa.ico",
  "www.ellemen.com": "https://www.ellemen.com/_assets/design-tokens/ellemen/static/images/favicon.1aff694.ico",
};

export function getHearstInternationalFeedLogoUrl(feed: HearstInternationalFeed) {
  const source = new URL(feed.url);
  const officialLogoUrl = internationalBrandLogoUrlsByHost[source.hostname];
  if (officialLogoUrl) return officialLogoUrl;
  const brandSlug = internationalBrandSlugsByHost[source.hostname];
  return brandSlug ? getBrandLogoSrc(brandSlug) : `${source.origin}/favicon.ico`;
}

export function getHearstInternationalFeedFaviconUrl(feed: HearstInternationalFeed) {
  const source = new URL(feed.url);
  const officialFaviconUrl = internationalBrandFaviconUrlsByHost[source.hostname];
  if (officialFaviconUrl) return officialFaviconUrl;
  const brandSlug = internationalBrandSlugsByHost[source.hostname];
  return brandSlug ? getBrandLogoSrc(brandSlug, "icon") : `${source.origin}/favicon.ico`;
}

export function getHearstInternationalFeedBrandSlug(feed: HearstInternationalFeed) {
  const source = new URL(feed.url);
  return internationalBrandSlugsByHost[source.hostname] ?? "hearst-all";
}
import { getBrandLogoSrc } from "@/lib/logos";
