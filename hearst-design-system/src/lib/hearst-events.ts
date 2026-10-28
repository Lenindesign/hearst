export type HearstEventRelationship = "organized" | "covered";

export type HearstEventStory = {
  title: string;
  summary: string;
  href: string;
  publishedLabel: string;
};

export type HearstEventProgramItem = {
  title: string;
  description: string;
  stage?: string;
};

export type HearstEventRecord = {
  slug: string;
  relationship: HearstEventRelationship;
  status: "upcoming" | "live" | "past";
  title: string;
  heroHeadline?: string;
  eyebrow: string;
  summary: string;
  primaryBrandSlug: string;
  brandSlugs: string[];
  brandNames: string[];
  image: { src: string; alt: string; credit?: string };
  startDate: string;
  endDate?: string;
  dateLabel: string;
  location: string;
  venue: string;
  eventUrl: string;
  primaryAction: { label: string; href: string };
  program?: HearstEventProgramItem[];
  coverage?: HearstEventStory[];
  practicalLinks?: { label: string; href: string }[];
  featuredGuests?: string[];
  makerSpotlights?: string[];
  makerDirectoryUrl?: string;
};

/**
 * Shared event records for the universal Hearst+ events index and detail template.
 * Content can represent a Hearst-organized event or an event covered by an editorial brand.
 */
export const hearstEvents: HearstEventRecord[] = [
  {
    slug: "good-housekeeping-live-country-living-christmas-market-2026",
    relationship: "organized",
    status: "upcoming",
    title: "Good Housekeeping Live with the Country Living Christmas Market",
    heroHeadline: "Let’s Go, Christmas!",
    eyebrow: "A four-day London experience",
    summary:
      "Four days of live conversations, cooking demonstrations, festive shopping, and the Country Living Christmas Market at London’s Business Design Centre.",
    primaryBrandSlug: "good-housekeeping",
    brandSlugs: ["good-housekeeping", "country-living"],
    brandNames: ["Good Housekeeping", "Country Living"],
    image: {
      src: "/images/clfair-vibe-01.jpg",
      alt: "Colorful dresses and cowboy boots at the Country Living Fair",
    },
    startDate: "2026-11-11",
    endDate: "2026-11-14",
    dateLabel: "November 11–14, 2026",
    location: "Islington, London",
    venue: "Business Design Centre",
    eventUrl: "https://www.goodhousekeepinglive.co.uk/",
    primaryAction: {
      label: "Buy tickets",
      href: "https://www.universe.com/events/good-housekeeping-live-with-country-living-christmas-market-tickets-NCJYPK",
    },
    featuredGuests: [
      "Trinny Woodall",
      "Elizabeth Day",
      "Denise Lewis",
      "Hugh Bonneville",
      "Philippa Perry",
      "Monica Galetti",
      "Xand van Tulleken",
      "Liz Earle",
      "Marcus Wareing",
      "Greg Wise",
      "Sophie Raworth",
      "Saska Graville",
      "Jane Bruton",
      "Stephen and Anita Mangan",
      "Anton Du Beke",
    ],
    makerSpotlights: ["VSTYLE Jewellery", "Fairytale Flowertreats", "Woolymere", "Ellen McIntosh Designs"],
    makerDirectoryUrl: "https://www.goodhousekeepinglive.co.uk/meet-the-makers/",
    program: [
      {
        stage: "The Good Conversation Main Stage",
        title: "Meet the guests and hear their stories",
        description: "Talks and interviews with celebrity guests, authors, and lifestyle experts, hosted by the Good Housekeeping team.",
      },
      {
        stage: "The Good Housekeeping Kitchen Stage",
        title: "Cooking demonstrations and taste tests",
        description: "Pick up ideas for festive cooking and sample the Good Housekeeping Institute’s seasonal finds.",
      },
      {
        stage: "The Home & Lifestyle Stage, presented by DFS",
        title: "Ideas for home and the season",
        description: "Explore talks, interviews, and interactive sessions across home and lifestyle.",
      },
      {
        stage: "Country Living Christmas Market",
        title: "Find gifts from independent makers",
        description: "Browse handcrafted gifts, home finds, and festive treats from British artisan sellers.",
      },
    ],
    practicalLinks: [
      { label: "Plan your day", href: "https://www.goodhousekeepinglive.co.uk/plan-your-day/" },
      { label: "Visitor information", href: "https://www.goodhousekeepinglive.co.uk/visitor-information/" },
      { label: "Frequently asked questions", href: "https://www.goodhousekeepinglive.co.uk/faqs/" },
    ],
  },
  {
    slug: "female-force-summit-2026",
    relationship: "organized",
    status: "past",
    title: "The 2026 Female Force Summit",
    eyebrow: "A cross-brand gathering for Women’s History Month",
    summary:
      "ELLE, Good Housekeeping, Cosmopolitan, Women’s Health, and Oprah Daily brought founders, investors, editors, and advocates together for conversations on growth, innovation, and leadership.",
    primaryBrandSlug: "good-housekeeping",
    brandSlugs: ["elle", "good-housekeeping", "cosmopolitan", "womens-health", "oprah-daily"],
    brandNames: ["ELLE", "Good Housekeeping", "Cosmopolitan", "Women’s Health", "Oprah Daily"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/e27ec4d2-f5a6-4ed2-b560-0373270ad226.jpg?crop=0.5625xw%3A1xh%3Bcenter%2Ctop&resize=640%3A%2A",
      alt: "Female Force Summit session image from Good Housekeeping",
    },
    startDate: "2026-03-03",
    dateLabel: "March 3, 2026",
    location: "New York, New York",
    venue: "Hearst Tower",
    eventUrl: "https://www.goodhousekeeping.com/videos/a70714330/watch-the-2026-female-force-summit/",
    primaryAction: { label: "Watch the summit", href: "https://www.goodhousekeeping.com/videos/a70714330/watch-the-2026-female-force-summit/" },
  },
  {
    slug: "eco-conscious-living-summit-2026",
    relationship: "organized",
    status: "past",
    title: "Hearst Magazines Eco-Conscious Living Summit",
    eyebrow: "Design, food, wellness, and climate",
    summary:
      "The fifth annual summit brought Hearst editors, designers, chefs, activists, and industry leaders together to discuss practical paths to more sustainable living.",
    primaryBrandSlug: "womens-health",
    brandSlugs: ["womens-health", "veranda", "delish", "house-beautiful", "esquire"],
    brandNames: ["Women’s Health", "VERANDA", "Delish", "House Beautiful", "Esquire"],
    image: {
      src: "https://hips.hearstapps.com/vidthumb/7bef02bc-2caf-4244-8d3d-c39c0d72d14f/69d6fe27-6e00-4110-a24b-63c347c784a4.jpg?crop=1.00xw%3A1.00xh%3B0%2C0&resize=980%3A%2A",
      alt: "Promotional image for the 2026 Eco-Conscious Living Summit",
    },
    startDate: "2026-04-07",
    dateLabel: "April 7, 2026",
    location: "New York, New York",
    venue: "Hearst Tower",
    eventUrl: "https://www.womenshealthmag.com/videos/a71031507/2026hearsteco-consciouslivingsummit/",
    primaryAction: { label: "Watch the summit", href: "https://www.womenshealthmag.com/videos/a71031507/2026hearsteco-consciouslivingsummit/" },
  },
  {
    slug: "mens-health-lab-2026",
    relationship: "organized",
    status: "past",
    title: "Men’s Health Lab 2026",
    eyebrow: "A day of practical health conversations",
    summary:
      "Medical experts, advocates, and public figures joined Men’s Health editors for conversations about prevention, longevity, mental health, and taking action.",
    primaryBrandSlug: "mens-health",
    brandSlugs: ["mens-health", "womens-health"],
    brandNames: ["Men’s Health", "Women’s Health"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/238cc7e3-b716-4922-9ce2-9b010cf94d96.jpeg?crop=1xw%3A1.0xh%3Bcenter%2Ctop&resize=768%3A%2A",
      alt: "Men’s Health Lab by Hearst Magazines event mark",
    },
    startDate: "2026-06-16",
    dateLabel: "June 16, 2026",
    location: "New York, New York",
    venue: "Hearst Tower",
    eventUrl: "https://www.menshealth.com/health/a71763359/heres-what-happened-at-the-mens-health-lab-2026/",
    primaryAction: { label: "Explore the event coverage", href: "https://www.menshealth.com/health/a71763359/heres-what-happened-at-the-mens-health-lab-2026/" },
  },
  {
    slug: "whole-home-charleston-2026",
    relationship: "organized",
    status: "past",
    title: "House Beautiful Whole Home 2026",
    eyebrow: "A ticketed design home and open house",
    summary:
      "House Beautiful brought two designer-created Charleston residences to life, with public tours supporting the Lowcountry Food Bank.",
    primaryBrandSlug: "house-beautiful",
    brandSlugs: ["house-beautiful"],
    brandNames: ["House Beautiful"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/bd5d6760-d89d-4265-a65a-67518efe0d20.jpg?crop=0.533xw%3A1xh%3B0.232xw%2C0xh",
      alt: "A designer kitchen inside House Beautiful’s 2026 Whole Home in Charleston",
    },
    startDate: "2026-10-10",
    endDate: "2026-10-25",
    dateLabel: "October 10–25, 2026",
    location: "Charleston, South Carolina",
    venue: "Ansonborough neighborhood",
    eventUrl: "https://www.housebeautiful.com/design-inspiration/house-tours/a74056459/whole-home-2026/",
    primaryAction: { label: "Explore the Whole Home", href: "https://www.housebeautiful.com/design-inspiration/house-tours/a74056459/whole-home-2026/" },
  },
  {
    slug: "elle-actor-awards-gala-2026",
    relationship: "organized",
    status: "past",
    title: "ELLE and the Actor Awards Post-Show Gala",
    eyebrow: "A red-carpet celebration in Los Angeles",
    summary:
      "ELLE hosted winners, nominees, and presenters for the 32nd annual Actor Awards Post-Show Gala following the awards telecast.",
    primaryBrandSlug: "elle",
    brandSlugs: ["elle"],
    brandNames: ["ELLE"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/62dedd66-3a10-4615-a07a-f7590eceff56.jpg?crop=1xw%3A1xh%3Bcenter%2Ctop&resize=980%3A%2A",
      alt: "Guests at the ELLE and Actor Awards post-show gala",
    },
    startDate: "2026-03-01",
    dateLabel: "March 1, 2026",
    location: "Los Angeles, California",
    venue: "Shrine Auditorium",
    eventUrl: "https://www.elle.com/elleextra/events/a70571681/inside-elle-actor-awards-2026-post-show-gala-recap/",
    primaryAction: { label: "See the gala coverage", href: "https://www.elle.com/elleextra/events/a70571681/inside-elle-actor-awards-2026-post-show-gala-recap/" },
  },
  {
    slug: "elle-nyfw-ss27-parties-2026",
    relationship: "covered",
    status: "past",
    title: "New York Fashion Week Spring/Summer 2027 Parties",
    eyebrow: "ELLE’s view of the fashion-week social calendar",
    summary:
      "ELLE covers the dinners, launches, and after-parties surrounding the Spring/Summer 2027 New York Fashion Week season.",
    primaryBrandSlug: "elle",
    brandSlugs: ["elle"],
    brandNames: ["ELLE"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/f824fd98-217e-4078-97d1-eb1b8afc7b78.jpeg?crop=1xw%3A0.75xh%3Bcenter%2Ctop&resize=1200%3A%2A",
      alt: "Guests at a New York Fashion Week Spring/Summer 2027 event",
      credit: "Angela Pham/BFA.com",
    },
    startDate: "2026-09-08",
    endDate: "2026-09-16",
    dateLabel: "September 8–16, 2026",
    location: "New York, New York",
    venue: "Multiple venues",
    eventUrl: "https://www.elle.com/elleextra/events/a73653169/nyfw-spring-summer-2027-after-parties-celebs-photos/",
    primaryAction: {
      label: "Read ELLE’s coverage",
      href: "https://www.elle.com/elleextra/events/a73653169/nyfw-spring-summer-2027-after-parties-celebs-photos/",
    },
  },
  {
    slug: "elle-kering-caring-for-women-dinner-2026",
    relationship: "covered",
    status: "past",
    title: "Kering Foundation Caring for Women Dinner",
    eyebrow: "A New York fundraiser covered by ELLE",
    summary:
      "The fifth annual dinner brought guests together in New York to raise funds for organizations working to end violence against women and children.",
    primaryBrandSlug: "elle",
    brandSlugs: ["elle"],
    brandNames: ["ELLE"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/b235f8fb-105a-46b2-b331-6c3b461e7151.jpg?crop=0.666666666667xw%3A1xh%3Bcenter%2Ctop&resize=1200%3A%2A",
      alt: "Guests at the Kering Foundation Caring for Women Dinner in New York",
      credit: "Jared Siskin",
    },
    startDate: "2026-09-10",
    dateLabel: "September 10, 2026",
    location: "New York, New York",
    venue: "The Pool",
    eventUrl: "https://www.elle.com/elleextra/events/a73685063/kering-caring-for-women-dinner-2026-details-photos/",
    primaryAction: {
      label: "Read ELLE’s coverage",
      href: "https://www.elle.com/elleextra/events/a73685063/kering-caring-for-women-dinner-2026-details-photos/",
    },
  },
  {
    slug: "elle-michael-kors-east-hampton-dinner-2026",
    relationship: "covered",
    status: "past",
    title: "Michael Kors 45th Anniversary Dinner",
    eyebrow: "An East Hampton anniversary celebration",
    summary:
      "Michael Kors marked 45 years of the collection with a dinner at The Hedges Inn, attended by fashion and entertainment guests.",
    primaryBrandSlug: "elle",
    brandSlugs: ["elle"],
    brandNames: ["ELLE"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/c61a6cba-8ac2-4ba6-8799-b39b6d897710.jpeg?crop=1xw%3A0.7140625xh%3Bcenter%2Ctop&resize=1200%3A%2A",
      alt: "Michael Kors anniversary dinner guests at The Hedges in East Hampton",
      credit: "Neil Rasmus/BFA",
    },
    startDate: "2026-08-20",
    dateLabel: "August 20, 2026",
    location: "East Hampton, New York",
    venue: "The Hedges Inn",
    eventUrl: "https://www.elle.com/elleextra/events/a73495538/michael-kors-45th-anniversary-east-hampton-dinner-details-photos/",
    primaryAction: {
      label: "Read ELLE’s coverage",
      href: "https://www.elle.com/elleextra/events/a73495538/michael-kors-45th-anniversary-east-hampton-dinner-details-photos/",
    },
  },
  {
    slug: "elle-american-ballet-theatre-spring-gala-2026",
    relationship: "covered",
    status: "past",
    title: "American Ballet Theatre Spring Gala",
    eyebrow: "A New York gala honoring Katie Holmes",
    summary:
      "The annual gala paired a black-tie dinner with an exclusive preview of American Ballet Theatre’s Don Quixote.",
    primaryBrandSlug: "elle",
    brandSlugs: ["elle"],
    brandNames: ["ELLE"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/b0d5eea1-ee9b-4039-9ba6-2edfb6d2116d.jpeg?crop=1xw%3A0.7144xh%3Bcenter%2Ctop&resize=1200%3A%2A",
      alt: "Guests at American Ballet Theatre’s 2026 Spring Gala",
      credit: "Bryan Bedder/Getty Images",
    },
    startDate: "2026-05-20",
    dateLabel: "May 20, 2026",
    location: "New York, New York",
    venue: "Cipriani 42nd Street",
    eventUrl: "https://www.elle.com/elleextra/events/a71374344/american-ballet-theatre-2026-spring-gala-katie-holmes-recap-details/",
    primaryAction: {
      label: "Read ELLE’s coverage",
      href: "https://www.elle.com/elleextra/events/a71374344/american-ballet-theatre-2026-spring-gala-katie-holmes-recap-details/",
    },
  },
  {
    slug: "cosmopolitan-nyfw-party-2026",
    relationship: "covered",
    status: "past",
    title: "Cosmopolitan’s New York Fashion Week Party",
    eyebrow: "An after-dark celebration of beauty and style",
    summary:
      "Willa Bennett and Del Water Gap hosted a New York Fashion Week gathering at Sloane’s, with DJ sets, cocktails, and a live performance.",
    primaryBrandSlug: "cosmopolitan",
    brandSlugs: ["cosmopolitan"],
    brandNames: ["Cosmopolitan"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/d08079f9-0635-462d-9418-1449a6897197.jpeg?crop=1xw%3A0.75xh%3B0xw%2C0.151xh&resize=1200%3A%2A",
      alt: "Cosmopolitan guests at the New York Fashion Week party",
      credit: "Nesrin Danan",
    },
    startDate: "2026-09-12",
    dateLabel: "September 12, 2026",
    location: "New York, New York",
    venue: "Sloane’s at The Manner",
    eventUrl: "https://www.cosmopolitan.com/style-beauty/fashion/a73690723/cosmopolitan-new-york-fashion-week-party/",
    primaryAction: {
      label: "Read Cosmopolitan’s coverage",
      href: "https://www.cosmopolitan.com/style-beauty/fashion/a73690723/cosmopolitan-new-york-fashion-week-party/",
    },
  },
  {
    slug: "cosmopolitan-elle-premiere-dinner-2026",
    relationship: "covered",
    status: "past",
    title: "Cosmopolitan and Prime Video Celebrate Elle",
    eyebrow: "A premiere dinner in Lower Manhattan",
    summary:
      "Cosmopolitan and Prime Video welcomed the cast of Elle for an intimate dinner, with Legally Blonde trivia, Cosmo quizzes, and tarot readings.",
    primaryBrandSlug: "cosmopolitan",
    brandSlugs: ["cosmopolitan"],
    brandNames: ["Cosmopolitan"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/ae78f519-f272-4e9d-b763-0c20bffa935b.jpeg?crop=0.666533386645xw%3A1xh%3Bcenter%2Ctop&resize=1200%3A%2A",
      alt: "Guests at the Prime Video and Cosmopolitan dinner celebrating Elle",
      credit: "Kevin Mazur/Getty Images for Prime Video",
    },
    startDate: "2026-06-22",
    dateLabel: "June 22, 2026",
    location: "New York, New York",
    venue: "La Mercerie",
    eventUrl: "https://www.cosmopolitan.com/entertainment/a71712590/cosmopolitan-and-prime-video-elle-dinner/",
    primaryAction: {
      label: "Read Cosmopolitan’s coverage",
      href: "https://www.cosmopolitan.com/entertainment/a71712590/cosmopolitan-and-prime-video-elle-dinner/",
    },
  },
  {
    slug: "cosmopolitan-live-blind-date-king-princess-2026",
    relationship: "covered",
    status: "past",
    title: "Cosmopolitan’s Live Blind Date with King Princess",
    eyebrow: "A live taping at The Public Theater",
    summary:
      "Cosmopolitan brought its Blind Date series to the stage for a night of magic, pop-culture trivia, and a special appearance by King Princess.",
    primaryBrandSlug: "cosmopolitan",
    brandSlugs: ["cosmopolitan"],
    brandNames: ["Cosmopolitan"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/a4235c8b-ba2f-4089-83a5-08289203e0b9.jpg?crop=1xw%3A0.667xh%3B0xw%2C0.139xh&resize=1200%3A%2A",
      alt: "Audience at Cosmopolitan’s live Blind Date taping",
    },
    startDate: "2026-06-30",
    dateLabel: "June 30, 2026",
    location: "New York, New York",
    venue: "LuEsther Hall at The Public Theater",
    eventUrl: "https://www.cosmopolitan.com/entertainment/a71806370/inside-cosmopolitans-first-ever-live-blind-date-with-king-princess/",
    primaryAction: {
      label: "Read Cosmopolitan’s coverage",
      href: "https://www.cosmopolitan.com/entertainment/a71806370/inside-cosmopolitans-first-ever-live-blind-date-with-king-princess/",
    },
  },
  {
    slug: "cosmopolitan-love-ball-2025",
    relationship: "covered",
    status: "past",
    title: "Cosmopolitan’s Love Ball with Bumble",
    eyebrow: "A Valentine’s Eve celebration of love",
    summary:
      "Cosmopolitan and Bumble took over BOOM at The Standard, High Line for a Love Issue celebration with DJs, a live performance, and interactive details designed to spark connection.",
    primaryBrandSlug: "cosmopolitan",
    brandSlugs: ["cosmopolitan"],
    brandNames: ["Cosmopolitan"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/screenshot-2025-02-14-at-10-35-11-am-67af62cfe118c.png?crop=0.811xw%3A1.00xh%3B0.0867xw%2C0&resize=1200%3A%2A",
      alt: "JT performing at Cosmopolitan’s Love Ball with Bumble",
      credit: "Yvonne Tnt & Deonté Lee/BFA.com",
    },
    startDate: "2025-02-13",
    dateLabel: "February 13, 2025",
    location: "New York, New York",
    venue: "BOOM at The Standard, High Line",
    eventUrl: "https://www.cosmopolitan.com/entertainment/celebs/a63740923/love-ball-valentines-day-2025/",
    primaryAction: {
      label: "Read Cosmopolitan’s coverage",
      href: "https://www.cosmopolitan.com/entertainment/celebs/a63740923/love-ball-valentines-day-2025/",
    },
  },
  {
    slug: "veranda-trade-secrets-summit-2026",
    relationship: "organized",
    status: "past",
    title: "VERANDA TRADE SECRETS Summit",
    eyebrow: "Three days for design professionals",
    summary:
      "VERANDA editors hosted designers for an intimate summit of talks, workshops, a welcome dinner, and early access to Antiques at the Gardens.",
    primaryBrandSlug: "veranda",
    brandSlugs: ["veranda"],
    brandNames: ["VERANDA"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/01b49391-7474-4ea9-9fb8-b67ce619c20d.jpeg?crop=1xw%3A1xh%3Bcenter%2Ctop&resize=980%3A%2A",
      alt: "Interior view of a vintage furnishings booth featured in VERANDA’s event guide",
      credit: "Graham Yelton",
    },
    startDate: "2026-09-30",
    endDate: "2026-10-02",
    dateLabel: "September 30–October 2, 2026",
    location: "Birmingham, Alabama",
    venue: "Clemontín and Antiques at the Gardens",
    eventUrl: "https://www.veranda.com/home-decorators/design-trends/a71085706/trade-secrets-summit-2026-birmingham/",
    primaryAction: { label: "Explore the summit", href: "https://www.veranda.com/home-decorators/design-trends/a71085706/trade-secrets-summit-2026-birmingham/" },
  },
  {
    slug: "womens-health-conversations-summit-2026",
    relationship: "covered",
    status: "upcoming",
    title: "Women’s Health Conversations Summit",
    eyebrow: "A reader event covered by Oprah Daily",
    summary:
      "The three-day Orlando summit brings together clinicians, researchers, health advocates, and women seeking practical information about midlife health.",
    primaryBrandSlug: "oprah-daily",
    brandSlugs: ["oprah-daily"],
    brandNames: ["Oprah Daily"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/6b118f39-1b87-4480-a18c-82ed177bdd53.jpeg?crop=0.6669921875xw%3A1xh%3Bcenter%2Ctop&resize=640%3A%2A",
      alt: "Panel conversation at the 2025 Women’s Health Conversations Summit",
      credit: "Courtesy of Women’s Health Conversations Summit",
    },
    startDate: "2026-11-13",
    endDate: "2026-11-15",
    dateLabel: "November 13–15, 2026",
    location: "Orlando, Florida",
    venue: "JW Marriott Orlando Bonnet Creek Resort & Spa",
    eventUrl: "https://www.oprahdaily.com/life/health/a73871622/womens-health-conversations-summit-2026/",
    primaryAction: { label: "View event information", href: "https://www.oprahdaily.com/life/health/a73871622/womens-health-conversations-summit-2026/" },
  },
  {
    slug: "town-and-country-philanthropy-summit-2026",
    relationship: "organized",
    status: "live",
    title: "Town & Country Philanthropy Summit",
    eyebrow: "The 13th annual gathering on transformational giving",
    summary:
      "Town & Country convenes philanthropy leaders, cultural figures, and changemakers for an afternoon of conversation and the first Philanthropist of the Year Awards.",
    primaryBrandSlug: "town-and-country",
    brandSlugs: ["town-and-country"],
    brandNames: ["Town & Country"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/6b32f761-a4ee-4728-9fdb-1cfdcdb5e958.jpeg?crop=0.667xw%3A1xh%3B0.15xw%2C0xh&resize=640%3A%2A",
      alt: "New York City architecture pictured in Town & Country’s summit announcement",
      credit: "Roy Rochlin//Getty Images",
    },
    startDate: "2026-10-27",
    dateLabel: "October 27, 2026",
    location: "New York, New York",
    venue: "Hearst Tower",
    eventUrl: "https://www.townandcountrymag.com/society/money-and-power/a74218686/town-and-country-2026-philanthropy-summit-details/",
    primaryAction: { label: "Read the summit preview", href: "https://www.townandcountrymag.com/society/money-and-power/a74218686/town-and-country-2026-philanthropy-summit-details/" },
  },
  {
    slug: "town-and-country-college-summit-2026",
    relationship: "organized",
    status: "past",
    title: "Town & Country College Admissions Summit",
    eyebrow: "An expert-led event for premium members",
    summary:
      "Town & Country brought admissions experts together to help families navigate applications, admissions trends, and the college search.",
    primaryBrandSlug: "town-and-country",
    brandSlugs: ["town-and-country"],
    brandNames: ["Town & Country"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/2318e3ac-6541-4e53-9184-4232d7803e88.jpeg?crop=0.667xw%3A1xh%3B0.129xw%2C0xh&resize=640%3A%2A",
      alt: "Graduation caps pictured in Town & Country’s college summit announcement",
      credit: "Rattankun Thongbun//Getty Images",
    },
    startDate: "2026-09-18",
    dateLabel: "September 18, 2026",
    location: "New York, New York",
    venue: "Hearst Tower",
    eventUrl: "https://www.townandcountrymag.com/education-college/a73413600/town-and-country-college-admissions-summit-2026-details/",
    primaryAction: { label: "Read the event guide", href: "https://www.townandcountrymag.com/education-college/a73413600/town-and-country-college-admissions-summit-2026-details/" },
  },
  {
    slug: "boston-marathon-2026",
    relationship: "covered",
    status: "past",
    title: "The 2026 Boston Marathon",
    eyebrow: "The race, the people, the stories",
    summary:
      "Runner’s World brings readers the results, race-day reporting, and the human stories that make the Boston Marathon matter beyond the finish line.",
    primaryBrandSlug: "runners-world",
    brandSlugs: ["runners-world"],
    brandNames: ["Runner’s World"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/efcd3df6-1492-435e-a9cc-e995b664eb03.jpeg?crop=1xw%3A0.84375xh%3Bcenter%2Ctop&resize=1600%3A%2A",
      alt: "Runners racing along the Boston Marathon course",
    },
    startDate: "2026-04-20",
    dateLabel: "April 20, 2026",
    location: "Hopkinton to Boston, Massachusetts",
    venue: "Boston Marathon course",
    eventUrl: "https://www.runnersworld.com/news/a71071000/2026-boston-marathon-results/",
    primaryAction: {
      label: "Explore Runner’s World coverage",
      href: "https://www.runnersworld.com/news/a71071000/2026-boston-marathon-results/",
    },
    coverage: [
      {
        title: "Results from the 2026 Boston Marathon",
        summary: "The 130th Boston Marathon, from the leaders to the thousands who reached the finish.",
        href: "https://www.runnersworld.com/news/a71071000/2026-boston-marathon-results/",
        publishedLabel: "Race-day results",
      },
      {
        title: "Sharon Lokedi wins her second straight Boston Marathon",
        summary: "How the women’s race unfolded over the final miles into Boston.",
        href: "https://www.runnersworld.com/news/a71052849/2026-boston-marathon-womens-recap/",
        publishedLabel: "Race-day report",
      },
      {
        title: "The final official finisher found a way to keep going",
        summary: "A runner’s account of grit, setbacks, and reaching Boylston Street.",
        href: "https://www.runnersworld.com/news/a71088131/final-finisher-boston-marathon-2026/",
        publishedLabel: "Runner’s story",
      },
    ],
  },
  {
    slug: "country-living-fair-2026",
    relationship: "organized",
    status: "past",
    title: "The Country Living Fair",
    eyebrow: "Three days in New York’s Hudson Valley",
    summary:
      "Country Living brought together more than 200 antiques dealers and artisans for shopping, workshops, guest speakers, and live music in Rhinebeck.",
    primaryBrandSlug: "country-living",
    brandSlugs: ["country-living"],
    brandNames: ["Country Living"],
    image: {
      src: "/images/clfair-vibe-01.jpg",
      alt: "Colorful dresses and cowboy boots at the Country Living Fair",
    },
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    dateLabel: "October 2–4, 2026",
    location: "Rhinebeck, New York",
    venue: "Dutchess County Fairgrounds",
    eventUrl: "https://countrylivingfairs.com/the-fair",
    primaryAction: {
      label: "Explore the Country Living Fair",
      href: "https://countrylivingfairs.com/the-fair",
    },
    coverage: [
      {
        title: "The Country Living Fair Is Back",
        summary: "Country Living’s announcement and guide to the 2026 Rhinebeck fair.",
        href: "https://www.countryliving.com/shopping/antiques/a69776986/country-living-fair-2026/",
        publishedLabel: "Event announcement",
      },
    ],
  },
  {
    slug: "hot-rod-power-tour-2026",
    relationship: "organized",
    status: "past",
    title: "2026 HOT ROD Power Tour",
    eyebrow: "A Route 66 centennial road trip",
    summary:
      "Five days of hot rods, drag racing, and small-town stops carried the tour from Illinois to Oklahoma to celebrate 100 years of Route 66.",
    primaryBrandSlug: "hot-rod",
    brandSlugs: ["hot-rod"],
    brandNames: ["HOT ROD"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/ed9d971b-c4b8-4654-ac89-f531650a76cc.jpg",
      alt: "Hot rods gathered during the 2026 HOT ROD Power Tour",
    },
    startDate: "2026-06-08",
    endDate: "2026-06-12",
    dateLabel: "June 8–12, 2026",
    location: "Illinois to Oklahoma",
    venue: "Route 66 stops",
    eventUrl: "https://www.hotrod.com/events/2026-hot-rod-power-tour-route-66-dates-locations",
    primaryAction: {
      label: "Explore Power Tour",
      href: "/autos/hot-rod/events/power-tour/",
    },
    coverage: [
      {
        title: "One Last Look at the Long Haulers Who Made Power Tour History",
        summary: "A photo gallery from the 2026 tour.",
        href: "/read/hot-rod-events-hot-rod-power-tour-2026-long-hauler-photo-gallery-3/?from=%2Fautos%2Fhot-rod%2Fevents%2Fpower-tour%2F",
        publishedLabel: "Photo gallery",
      },
    ],
  },
  {
    slug: "hot-rod-drag-week-2026",
    relationship: "organized",
    status: "past",
    title: "HOT ROD Drag Week 2026",
    eyebrow: "The toughest street-car event on earth",
    summary:
      "Six days of dragstrip competition and street driving started and finished at Route 66 Raceway, with stops at three additional Midwest tracks.",
    primaryBrandSlug: "hot-rod",
    brandSlugs: ["hot-rod"],
    brandNames: ["HOT ROD"],
    image: {
      src: "https://hips.hearstapps.com/mtg-prod/68c8a70f9326e8000272d01a/007-2025-hot-rod-drag-week-hrdw-september-15-monday-results.jpg",
      alt: "A racer competes during HOT ROD Drag Week",
    },
    startDate: "2026-09-13",
    endDate: "2026-09-18",
    dateLabel: "September 13–18, 2026",
    location: "Illinois and Missouri",
    venue: "Route 66 Raceway and Midwest dragstrips",
    eventUrl: "https://www.hotrod.com/events/2026-hot-rod-drag-week-schedule-route-66-raceway/",
    primaryAction: {
      label: "Explore Drag Week",
      href: "/autos/hot-rod/events/drag-week/",
    },
  },
  {
    slug: "womens-health-lab-2026",
    relationship: "organized",
    status: "past",
    title: "Women’s Health Lab 2026",
    eyebrow: "A day of women’s health research and conversation",
    summary:
      "Women’s Health brought clinicians, researchers, advocates, and public figures together to discuss cardiovascular, brain, mental, menopause, and respiratory health.",
    primaryBrandSlug: "womens-health",
    brandSlugs: ["womens-health", "cosmopolitan", "delish", "elle", "oprah-daily", "prevention"],
    brandNames: ["Women’s Health", "Cosmopolitan", "Delish", "ELLE", "Oprah Daily", "Prevention"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/4ade1454-4c0d-497b-a956-d025dbfe22aa.jpeg?crop=1xw%3A0.7xh%3B0xw%2C0.091xh&resize=640%3A%2A",
      alt: "Speakers and attendees at the 2026 Women’s Health Lab",
      credit: "Getty Images for Hearst Magazines",
    },
    startDate: "2026-05-18",
    dateLabel: "May 18, 2026",
    location: "New York, New York",
    venue: "The New York Historical",
    eventUrl: "https://www.womenshealthmag.com/health/a71425323/inside-look-womens-health-lab-2026/",
    primaryAction: {
      label: "Explore the event coverage",
      href: "https://www.womenshealthmag.com/health/a71425323/inside-look-womens-health-lab-2026/",
    },
    coverage: [
      {
        title: "Inside Look: Women’s Health Lab 2026",
        summary: "A recap of the third annual Women’s Health Lab and its sessions.",
        href: "https://www.womenshealthmag.com/health/a71425323/inside-look-womens-health-lab-2026/",
        publishedLabel: "Event recap",
      },
      {
        title: "What happened at the Women’s Health Lab",
        summary: "Coverage from the event on menopause, brain health, and other topics.",
        href: "https://www.womenshealthmag.com/health/a71180204/a-conversation-about-moderate-to-severe-hot-flashes-due-to-menopause/",
        publishedLabel: "Session coverage",
      },
    ],
  },
  {
    slug: "road-and-track-desert-run-600-2026",
    relationship: "organized",
    status: "past",
    title: "Road & Track Desert Run 600",
    eyebrow: "A four-day, 675-mile reader rally",
    summary:
      "Road & Track Experiences led readers from Las Vegas to Scottsdale, combining scenic drives, track time, car collections, and editor-led gatherings.",
    primaryBrandSlug: "road-and-track",
    brandSlugs: ["road-and-track"],
    brandNames: ["Road & Track"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/96dacdbb-2d43-42c3-b8e3-0719f95d2e41.jpg?crop=0.8896xw%3A1xh%3Bcenter%2Ctop&resize=1200%3A%2A",
      alt: "Road & Track Desert Run rally cars driving through red rock country",
      credit: "Greg Pajo",
    },
    startDate: "2026-04-14",
    endDate: "2026-04-17",
    dateLabel: "April 14–17, 2026",
    location: "Las Vegas to Scottsdale, Arizona",
    venue: "Las Vegas Motor Speedway and rally route",
    eventUrl: "https://www.roadandtrack.com/car-culture/a71168241/desert-run-our-road-trip-from-vegas-to-sedona-was-a-total-blast/",
    primaryAction: {
      label: "Read the rally recap",
      href: "https://www.roadandtrack.com/car-culture/a71168241/desert-run-our-road-trip-from-vegas-to-sedona-was-a-total-blast/",
    },
  },
  {
    slug: "road-and-track-northwest-shift-2026",
    relationship: "organized",
    status: "past",
    title: "Road & Track Northwest Shift",
    eyebrow: "Four days across Oregon and Washington",
    summary:
      "Road & Track Experiences brought readers through the Cascades for scenic drives, track sessions at Portland International Raceway, and rally instruction at DirtFish.",
    primaryBrandSlug: "road-and-track",
    brandSlugs: ["road-and-track"],
    brandNames: ["Road & Track"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/nws-x-fb-nosale-2-6973eb0a0a522.jpg?crop=1.00xw%3A0.777xh%3B0%2C0.114xh&resize=1200%3A%2A",
      alt: "Road & Track Northwest Shift rally convoy on a forest road",
    },
    startDate: "2026-06-10",
    endDate: "2026-06-13",
    dateLabel: "June 10–13, 2026",
    location: "Oregon and Washington",
    venue: "Portland International Raceway and DirtFish Rally School",
    eventUrl: "https://www.roadandtrack.com/car-culture/a71795688/northwest-shift-rally-was-four-days-of-blissful-mountain-drives/",
    primaryAction: {
      label: "Read the rally recap",
      href: "https://www.roadandtrack.com/car-culture/a71795688/northwest-shift-rally-was-four-days-of-blissful-mountain-drives/",
    },
  },
  {
    slug: "road-and-track-hudson-quattrocento-2026",
    relationship: "organized",
    status: "live",
    title: "Road & Track Hudson Quattrocento",
    eyebrow: "A four-day rally through New York and Connecticut",
    summary:
      "Road & Track editors lead readers on curated Hudson Valley and Catskills drives, with track days at Wilzig Racing Manor and Lime Rock Park, plus access to private collections.",
    primaryBrandSlug: "road-and-track",
    brandSlugs: ["road-and-track"],
    brandNames: ["Road & Track"],
    image: {
      src: "https://hips.hearstapps.com/hmg-prod/images/dw-burnett-hq23-2-653b2360e76a1.jpg?crop=1.00xw%3A0.344xh%3B0%2C0.534xh&resize=1200%3A%2A",
      alt: "Cars on an earlier edition of the Hudson Quattrocento rally in the Hudson Valley",
      credit: "DW Burnett",
    },
    startDate: "2026-10-27",
    endDate: "2026-10-30",
    dateLabel: "October 27–30, 2026",
    location: "New York and Connecticut",
    venue: "Hudson Valley, Wilzig Racing Manor, Lime Rock Park, and Catskills",
    eventUrl: "https://experiences.roadandtrack.com/hudson-quattrocento-2026",
    primaryAction: {
      label: "Explore the event itinerary",
      href: "https://experiences.roadandtrack.com/hudson-quattrocento-itinerary",
    },
  },
  {
    slug: "road-and-track-palm-canyon-run-2027",
    relationship: "organized",
    status: "upcoming",
    title: "Road & Track Palm Canyon Run",
    eyebrow: "A four-day rally through Southern California",
    summary:
      "Road & Track editors lead a four-day rally through the Coachella Valley, High Desert, and Inland Empire, with a track day at Chuckwalla Valley Raceway.",
    primaryBrandSlug: "road-and-track",
    brandSlugs: ["road-and-track"],
    brandNames: ["Road & Track"],
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/5d0b98438825300001f7e010/a790dae4-9ff4-41f3-a50f-f57615541292/PALM_CANYON_RUN.png",
      alt: "Promotional artwork for Road & Track Palm Canyon Run",
    },
    startDate: "2027-02-23",
    endDate: "2027-02-26",
    dateLabel: "February 23–26, 2027",
    location: "Southern California",
    venue: "Chuckwalla Valley Raceway and rally route",
    eventUrl: "https://experiences.roadandtrack.com/palm-canyon-run-2027",
    primaryAction: {
      label: "Explore the rally",
      href: "https://experiences.roadandtrack.com/palm-canyon-run-2027",
    },
  },
  {
    slug: "road-and-track-new-england-run-2027",
    relationship: "organized",
    status: "upcoming",
    title: "Road & Track New England Run",
    eyebrow: "A spring rally through New England",
    summary:
      "Road & Track editors lead a four-day route through New Hampshire, Maine, and Vermont, including track time at New Hampshire Motor Speedway.",
    primaryBrandSlug: "road-and-track",
    brandSlugs: ["road-and-track"],
    brandNames: ["Road & Track"],
    image: {
      src: "https://images.squarespace-cdn.com/content/v1/5d0b98438825300001f7e010/d39b21e3-d8b8-4aa7-a152-b07815c1d927/FinalNewEnglandRun.png",
      alt: "Promotional artwork for Road & Track New England Run",
    },
    startDate: "2027-05-17",
    endDate: "2027-05-20",
    dateLabel: "May 17–20, 2027",
    location: "New Hampshire, Maine, and Vermont",
    venue: "New Hampshire Motor Speedway and rally route",
    eventUrl: "https://experiences.roadandtrack.com/new-england-run-2027",
    primaryAction: {
      label: "Explore the rally",
      href: "https://experiences.roadandtrack.com/new-england-run-2027",
    },
  },
];

export function getHearstEvent(slug: string) {
  return hearstEvents.find((event) => event.slug === slug);
}

export function getHearstEventRelationshipLabel(relationship: HearstEventRelationship) {
  return relationship === "organized" ? "Organized by Hearst brands" : "Covered by our editors";
}
