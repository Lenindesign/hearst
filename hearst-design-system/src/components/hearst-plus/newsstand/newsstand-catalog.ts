import { getHearstAllBrands, getHearstBrandRoute } from "@/lib/hearst-routes";

// Every title on the Newsstand rack, keyed by the slug the 3D scene reports for each cover.
// Value-prop copy is draft and needs editorial approval. Hearst+ is a daily destination: sell what is new
// in the app every day, never a print cadence ("every month", "weekly", "every issue").

export type NewsstandTitle = {
  name: string;
  logo: string;
  headline: string;
  body: string;
};

export const TITLES: Record<string, NewsstandTitle> = {
  esquire: { name: "Esquire", logo: "logo.20861e6.svg", headline: "Man at his best, every day.",
    body: "Long-form profiles, sharp cultural criticism and style advice that actually holds up, new in your Hearst+ feed all day long." },
  cosmopolitan: { name: "Cosmopolitan", logo: "cosmo.svg", headline: "Bold advice on love, life and everything in between.",
    body: "The beauty finds, career moves and honest relationship talk your group chat is already quoting, fresh in Hearst+ every day." },
  harpers_bazaar: { name: "Harper's Bazaar", logo: "harpers.svg", headline: "Fashion, art and the people shaping both.",
    body: "America's first fashion magazine, still setting the agenda. Runway reports, landmark photography and conversations with the designers and artists defining what comes next." },
  good_housekeeping: { name: "Good Housekeeping", logo: "good-housekeeping.svg", headline: "Tested at the Institute, trusted at home.",
    body: "Lab-tested product picks, recipes that work the first time and smart fixes for every room, backed by the Good Housekeeping Institute's experts." },
  car_and_driver: { name: "Car and Driver", logo: "caranddriver.svg", headline: "Straight-talking reviews from people who live to drive.",
    body: "Instrumented road tests, honest buyer's guides and first drives of the cars everyone's talking about. Know what to buy, and what to skip." },
  elle: { name: "ELLE", logo: "logo.2856426.svg", headline: "Fashion with a point of view.",
    body: "Runway coverage, beauty you'll actually use and the cultural conversations shaping how women dress and live." },
  town_and_country: { name: "Town & Country", logo: "town.svg", headline: "The best of everything, chosen with taste.",
    body: "Travel, style, philanthropy and the stories behind America's most storied families and places." },
  mens_health: { name: "Men's Health", logo: "mens.svg", headline: "Get stronger, eat smarter, live longer.",
    body: "Workouts that fit real schedules, nutrition without the fads and expert-backed health advice for men." },
  womens_health: { name: "Women's Health", logo: "womenshealth.svg", headline: "Strength, health and confidence on your terms.",
    body: "Trainer-built workouts, evidence-based wellness and nutrition advice that works with your life." },
  popular_mechanics: { name: "Popular Mechanics", logo: "popular.svg", headline: "How everything works, and how to fix it.",
    body: "Science, technology and hands-on projects, from space missions to the home workshop." },
  runners_world: { name: "Runner's World", logo: "runners.svg", headline: "For every runner, every mile.",
    body: "Training plans from a first 5K to the marathon, gear tested on real roads and stories that keep you moving." },
  house_beautiful: { name: "House Beautiful", logo: "house.svg", headline: "Rooms you'll want to live in.",
    body: "Designer-led house tours, color ideas and decorating advice for making a home feel like yours." },
  elle_decor: { name: "ELLE Decor", logo: "elle-decor.svg", headline: "Design that inspires.",
    body: "Extraordinary homes, the designers behind them and the furniture and objects worth knowing about." },
  veranda: { name: "Veranda", logo: "veranda.svg", headline: "Gracious living, beautifully done.",
    body: "Elegant homes and gardens, timeless interiors and the art of entertaining well." },
  country_living: { name: "Country Living", logo: "country.svg", headline: "The simple pleasures of country life.",
    body: "Farmhouse style, seasonal recipes, gardening and antiques for anyone who loves a slower pace." },
  delish: { name: "Delish", logo: "delish.svg", headline: "Food that's fun to cook and better to eat.",
    body: "Easy weeknight recipes, food trends tested in our kitchen and plenty of dessert." },
  oprah_daily: { name: "Oprah Daily", logo: "oprah.svg", headline: "Live your best life.",
    body: "Books, wellness, style and soulful conversations, curated with Oprah's point of view." },
  prevention: { name: "Prevention", logo: "prevention.svg", headline: "Smart health for every age.",
    body: "Doctor-reviewed health news, healthy recipes and practical advice for feeling your best." },
  redbook: { name: "Redbook", logo: "redbook.svg", headline: "Real life, real advice.",
    body: "Relationships, family, beauty and the everyday wins that make life better." },
  road_and_track: { name: "Road & Track", logo: "roadandtrack.svg", headline: "The thrill of the drive.",
    body: "Driving impressions, motorsport and car culture from enthusiasts who love the machines." },
  seventeen: { name: "Seventeen", logo: "seventeen.svg", headline: "Life, style and everything you're figuring out.",
    body: "Fashion, beauty, celebrity and real talk for Gen Z readers." },
  womans_day: { name: "Woman's Day", logo: "womans.svg", headline: "Make every day a little easier.",
    body: "Budget-friendly recipes, home ideas, crafts and money-saving advice for busy families." },
  pioneer_woman: { name: "The Pioneer Woman", logo: "pioneer.svg", headline: "Comfort food and country charm.",
    body: "Ree Drummond's family-favorite recipes, home ideas and life on the ranch." },
  bicycling: { name: "Bicycling", logo: "logo.063cc2c.svg", headline: "Ride more, ride better.",
    body: "Training tips, bike and gear reviews and the best routes, for every kind of cyclist." },
  autoweek: { name: "Autoweek", logo: "autoweek.svg", headline: "The car enthusiast's daily fix.",
    body: "Racing coverage, new-car news and the culture of people who love cars." },
  best_products: { name: "Best Products", logo: "bestproducts.svg", headline: "Buy better, without the guesswork.",
    body: "Researched product picks, gift guides and deals across home, tech, beauty and more." },
  biography: { name: "Biography", logo: "biography.svg", headline: "The stories behind the names.",
    body: "Profiles of the people who shaped history, culture and the world we live in." },
};

export const TITLE_SLUGS = Object.keys(TITLES);

// The five titles the scroll story features, in order. Their covers ship at 2x for the close-up camera.
export const FEATURED_SLUGS = ["esquire", "cosmopolitan", "harpers_bazaar", "good_housekeeping", "car_and_driver"];

// Titles with real cover photography in /images/newsstand/covers/<slug>.webp. Others get a logo cover.
// Prevention, Road & Track, Bicycling, Delish and Oprah Daily use 2026 issues. Redbook (2018) and Seventeen (2019)
// use their last regular print issues. Autoweek, Best Products and Biography have no print edition.
export const COVER_SLUGS = new Set([
  "bicycling", "car_and_driver", "cosmopolitan", "country_living", "delish", "elle", "elle_decor", "esquire",
  "good_housekeeping", "harpers_bazaar", "house_beautiful", "mens_health", "oprah_daily", "pioneer_woman",
  "popular_mechanics", "prevention", "redbook", "road_and_track", "runners_world", "seventeen", "town_and_country",
  "veranda", "womans_day", "womens_health",
]);

export const logoSrc = (slug: string) => `/images/newsstand/logos/${TITLES[slug].logo}`;

// Full-resolution cover for the title modal. The rack uses the smaller <slug>.webp textures.
export function coverSrc(slug: string) {
  return COVER_SLUGS.has(slug) ? `/images/newsstand/covers/${slug}@2x.webp` : null;
}

// The title's publication page in the Hearst+ app, when one exists (Biography has none yet).
export function appRoute(slug: string) {
  const brandSlug = slug.replace(/_/g, "-");
  return getHearstAllBrands().some((b) => b.brandSlug === brandSlug) ? getHearstBrandRoute(brandSlug) : null;
}

// Hearst+ is the product; print stays available as a secondary path for titles that still publish regularly.
export const PRINT_SUBSCRIBE_URL = "https://subscribe.hearstmags.com/";
export const PRINT_SLUGS = new Set([...COVER_SLUGS].filter((slug) => slug !== "redbook" && slug !== "seventeen"));
