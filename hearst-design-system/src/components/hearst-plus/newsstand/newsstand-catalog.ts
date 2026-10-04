// Every title on the Newsstand rack, keyed by the slug the 3D scene reports for each cover.
// Value-prop copy is draft and needs editorial approval. Bracketed "included" lines are placeholders.

export type NewsstandTitle = {
  name: string;
  logo: string;
  headline: string;
  body: string;
  included: string;
  tags: string[];
};

export const TITLES: Record<string, NewsstandTitle> = {
  esquire: { name: "Esquire", logo: "logo.20861e6.svg", headline: "Man at his best, every month since 1933.",
    body: "Long-form profiles, sharp cultural criticism and the style advice that actually holds up. Hearst+ unlocks every new issue plus decades of the archive.",
    included: "[12 issues a year] + [archive back to 1933]", tags: ["Style", "Interviews", "Culture"] },
  cosmopolitan: { name: "Cosmopolitan", logo: "cosmo.svg", headline: "Bold advice on love, life and everything in between.",
    body: "The beauty finds, career moves and honest relationship talk your group chat is already quoting. Read every issue the day it drops, plus exclusive digital-only features.",
    included: "[12 issues a year] + [archive back to 1886]", tags: ["Beauty", "Relationships", "Careers"] },
  harpers_bazaar: { name: "Harper's Bazaar", logo: "harpers.svg", headline: "Fashion, art and the people shaping both.",
    body: "America's first fashion magazine, still setting the agenda. Runway reports, landmark photography and conversations with the designers and artists defining what comes next.",
    included: "[10 issues a year] + [archive back to 1867]", tags: ["Fashion", "Art", "Beauty"] },
  good_housekeeping: { name: "Good Housekeeping", logo: "good-housekeeping.svg", headline: "Tested at the Institute, trusted at home.",
    body: "Lab-tested product picks, recipes that work the first time and smart fixes for every room, backed by the Good Housekeeping Institute's experts.",
    included: "[12 issues a year] + [archive back to 1885]", tags: ["Home", "Food", "Product tests"] },
  car_and_driver: { name: "Car and Driver", logo: "caranddriver.svg", headline: "Straight-talking reviews from people who live to drive.",
    body: "Instrumented road tests, honest buyer's guides and first drives of the cars everyone's talking about. Know what to buy, and what to skip.",
    included: "[12 issues a year] + [archive back to 1955]", tags: ["Reviews", "Buyer's guides", "Motorsport"] },
  elle: { name: "ELLE", logo: "logo.2856426.svg", headline: "Fashion with a point of view.",
    body: "Runway coverage, beauty you'll actually use and the cultural conversations shaping how women dress and live.",
    included: "[Every new issue] + [archive]", tags: ["Fashion", "Beauty", "Culture"] },
  town_and_country: { name: "Town & Country", logo: "town.svg", headline: "The best of everything, chosen with taste.",
    body: "Travel, style, philanthropy and the stories behind America's most storied families and places.",
    included: "[Every new issue] + [archive]", tags: ["Society", "Travel", "Style"] },
  mens_health: { name: "Men's Health", logo: "mens.svg", headline: "Get stronger, eat smarter, live longer.",
    body: "Workouts that fit real schedules, nutrition without the fads and expert-backed health advice for men.",
    included: "[Every new issue] + [archive]", tags: ["Fitness", "Nutrition", "Health"] },
  womens_health: { name: "Women's Health", logo: "womenshealth.svg", headline: "Strength, health and confidence on your terms.",
    body: "Trainer-built workouts, evidence-based wellness and nutrition advice that works with your life.",
    included: "[Every new issue] + [archive]", tags: ["Fitness", "Wellness", "Nutrition"] },
  popular_mechanics: { name: "Popular Mechanics", logo: "popular.svg", headline: "How everything works, and how to fix it.",
    body: "Science, technology and hands-on projects, from space missions to the home workshop.",
    included: "[Every new issue] + [archive]", tags: ["Science", "Tech", "DIY"] },
  runners_world: { name: "Runner's World", logo: "runners.svg", headline: "For every runner, every mile.",
    body: "Training plans from a first 5K to the marathon, gear tested on real roads and stories that keep you moving.",
    included: "[Every new issue] + [archive]", tags: ["Training", "Gear", "Races"] },
  house_beautiful: { name: "House Beautiful", logo: "house.svg", headline: "Rooms you'll want to live in.",
    body: "Designer-led house tours, color ideas and decorating advice for making a home feel like yours.",
    included: "[Every new issue] + [archive]", tags: ["Design", "Decorating", "Color"] },
  elle_decor: { name: "ELLE Decor", logo: "elle-decor.svg", headline: "Design that inspires.",
    body: "Extraordinary homes, the designers behind them and the furniture and objects worth knowing about.",
    included: "[Every new issue] + [archive]", tags: ["Interiors", "Architecture", "Designers"] },
  veranda: { name: "Veranda", logo: "veranda.svg", headline: "Gracious living, beautifully done.",
    body: "Elegant homes and gardens, timeless interiors and the art of entertaining well.",
    included: "[Every new issue] + [archive]", tags: ["Interiors", "Gardens", "Entertaining"] },
  country_living: { name: "Country Living", logo: "country.svg", headline: "The simple pleasures of country life.",
    body: "Farmhouse style, seasonal recipes, gardening and antiques for anyone who loves a slower pace.",
    included: "[Every new issue] + [archive]", tags: ["Home", "Gardening", "Antiques"] },
  delish: { name: "Delish", logo: "delish.svg", headline: "Food that's fun to cook and better to eat.",
    body: "Easy weeknight recipes, food trends tested in our kitchen and plenty of dessert.",
    included: "[Every recipe and video] + [members-only features]", tags: ["Recipes", "Food news", "Video"] },
  oprah_daily: { name: "Oprah Daily", logo: "oprah.svg", headline: "Live your best life.",
    body: "Books, wellness, style and soulful conversations, curated with Oprah's point of view.",
    included: "[Every story] + [members-only features]", tags: ["Books", "Wellness", "Inspiration"] },
  prevention: { name: "Prevention", logo: "prevention.svg", headline: "Smart health for every age.",
    body: "Doctor-reviewed health news, healthy recipes and practical advice for feeling your best.",
    included: "[Every new issue] + [archive]", tags: ["Health", "Nutrition", "Fitness"] },
  redbook: { name: "Redbook", logo: "redbook.svg", headline: "Real life, real advice.",
    body: "Relationships, family, beauty and the everyday wins that make life better.",
    included: "[Every story] + [archive]", tags: ["Relationships", "Beauty", "Life"] },
  road_and_track: { name: "Road & Track", logo: "roadandtrack.svg", headline: "The thrill of the drive.",
    body: "Driving impressions, motorsport and car culture from enthusiasts who love the machines.",
    included: "[Every new issue] + [archive]", tags: ["Driving", "Motorsport", "Culture"] },
  seventeen: { name: "Seventeen", logo: "seventeen.svg", headline: "Life, style and everything you're figuring out.",
    body: "Fashion, beauty, celebrity and real talk for Gen Z readers.",
    included: "[Every story] + [archive]", tags: ["Style", "Beauty", "Celebrity"] },
  womans_day: { name: "Woman's Day", logo: "womans.svg", headline: "Make every day a little easier.",
    body: "Budget-friendly recipes, home ideas, crafts and money-saving advice for busy families.",
    included: "[Every new issue] + [archive]", tags: ["Recipes", "Home", "Budget"] },
  pioneer_woman: { name: "The Pioneer Woman", logo: "pioneer.svg", headline: "Comfort food and country charm.",
    body: "Ree Drummond's family-favorite recipes, home ideas and life on the ranch.",
    included: "[Every new issue] + [archive]", tags: ["Recipes", "Home", "Ranch life"] },
  bicycling: { name: "Bicycling", logo: "logo.063cc2c.svg", headline: "Ride more, ride better.",
    body: "Training tips, bike and gear reviews and the best routes, for every kind of cyclist.",
    included: "[Every story] + [archive]", tags: ["Training", "Gear", "Routes"] },
  autoweek: { name: "Autoweek", logo: "autoweek.svg", headline: "The car enthusiast's weekly fix.",
    body: "Racing coverage, new-car news and the culture of people who love cars.",
    included: "[Every story] + [archive]", tags: ["Racing", "News", "Culture"] },
  best_products: { name: "Best Products", logo: "bestproducts.svg", headline: "Buy better, without the guesswork.",
    body: "Researched product picks, gift guides and deals across home, tech, beauty and more.",
    included: "[Every guide] + [members-only deals]", tags: ["Reviews", "Gift guides", "Deals"] },
  biography: { name: "Biography", logo: "biography.svg", headline: "The stories behind the names.",
    body: "Profiles of the people who shaped history, culture and the world we live in.",
    included: "[Every story] + [archive]", tags: ["History", "People", "Culture"] },
};

export const TITLE_SLUGS = Object.keys(TITLES);

// The five titles the scroll story features, in order. Their covers ship at 2x for the close-up camera.
export const FEATURED_SLUGS = ["esquire", "cosmopolitan", "harpers_bazaar", "good_housekeeping", "car_and_driver"];

// Titles with real cover photography in /images/newsstand/covers/<slug>.webp. Others get a logo cover.
export const COVER_SLUGS = new Set([
  "car_and_driver", "cosmopolitan", "country_living", "elle", "elle_decor", "esquire", "good_housekeeping", "harpers_bazaar",
  "house_beautiful", "mens_health", "pioneer_woman", "popular_mechanics", "runners_world", "town_and_country", "veranda",
  "womans_day", "womens_health",
]);

export const logoSrc = (slug: string) => `/images/newsstand/logos/${TITLES[slug].logo}`;

// Full-resolution cover for the title modal. The rack uses the smaller <slug>.webp textures.
export function coverSrc(slug: string) {
  return COVER_SLUGS.has(slug) ? `/images/newsstand/covers/${slug}@2x.webp` : null;
}
