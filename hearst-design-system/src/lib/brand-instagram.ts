// Official Instagram accounts for Hearst+ publications, shown by BrandInstagramModule on brand pages.
// Handles come from each brand's Yahoo profile (profiles.yahoo.com/brands/<brand>/), which embeds the official
// account, or were confirmed by the Hearst+ team (2026-10-11).
const brandInstagramHandles: Partial<Record<string, string>> = {
  autoweek: "AutoweekUSA",
  "best-products": "bestproducts",
  bicycling: "bicyclingmag",
  "bring-a-trailer": "bringatrailer",
  "car-and-driver": "caranddriver",
  cosmopolitan: "cosmopolitan",
  "country-living": "countrylivingmag",
  delish: "delish",
  elle: "elleusa",
  "elle-decor": "elledecor",
  esquire: "esquire",
  "good-housekeeping": "goodhousekeeping",
  "harpers-bazaar": "harpersbazaarus",
  "hot-rod": "hotrodmagazine",
  "house-beautiful": "housebeautiful",
  "mens-health": "menshealthmag",
  motortrend: "motortrend",
  "oprah-daily": "oprahdaily",
  "pioneer-woman": "thepioneerwomanmag",
  "popular-mechanics": "popularmechanics",
  prevention: "preventionmag",
  redbook: "redbookmag",
  "road-and-track": "roadandtrack",
  "runners-world": "runnersworldmag",
  seventeen: "seventeen",
  "town-and-country": "townandcountrymag",
  veranda: "verandamag",
  "womans-day": "womansdaymag",
  "womens-health": "womenshealthmag",
};

export function getBrandInstagramHandle(brandSlug: string) {
  return brandInstagramHandles[brandSlug];
}
