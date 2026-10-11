// Full-width brand banners used as the masthead on publication pages (MainNav swaps them in for the logo row).
// Art is each brand's profile banner from Yahoo (profiles.yahoo.com/brands/<brand>/), 2560x440, downloaded
// 2026-10-11. Brands without a usable Yahoo banner (none on Yahoo: Autoweek, Best Products, Bicycling, Bring a Trailer,
// HOT ROD, Oprah Daily, Runner's World; unsuitable: Delish's app ad, Woman's Day's edge-to-edge wordmark) use a
// contextual photo from one of their own stories instead, with the white logo and a scrim on top.
export type BrandBanner = {
  /** Banner art; leave out for a solid block in `background` with the overlaid logo. */
  src?: string;
  background?: string;
  alt: string;
  width: number;
  height: number;
  /** Pixels of baked-in letterboxing to trim from the art's left and right edges. */
  cropX?: { left: number; right: number };
  /** The art has no wordmark: draw the brand's logo in white, large and centered, on top. */
  overlayLogo?: boolean;
  /** Darken busy photography so the overlaid logo stays legible. */
  scrim?: boolean;
  /** A drawn pattern behind a solid banner (the Hearst+ home's wall of brand wordmarks). */
  pattern?: "brand-wall";
  /** For a destination brand wall: the section whose brands fill the wall. */
  wallSection?: "lifestyle" | "autos" | "flux" | "ew";
  /** Explicit logos for the wall (Local News stations, A&E channels) instead of a section's brands. */
  wallLogos?: string[];
  /** "native" keeps the overlaid logo's own colors (A&E Family's white and gold); default is all white. */
  logoColor?: "white" | "native";
  /** Overlay this logo instead of the page's own (the Hearst+ banner lockup, which keeps its two colors). */
  logoSlug?: string;
  /** "xl" lets a solid banner's logo fill nearly the whole banner height (ELLE). */
  logoSize?: "xl";
};

// The Hearst+ home masthead: navy with a faint wall of every brand's wordmark behind the white HEARST+ logo.
// Brand-wall banners (Hearst+, sections, Local News, A&E) are half the height of brand banners: they introduce a
// section, not a publication.
export const hearstPlusBrandWallBanner: BrandBanner = {
  // A deeper navy than the logo's #012247, so the blue plus stands out.
  background: "#00142B",
  alt: "Hearst+: every Hearst brand",
  width: 2560,
  height: 220,
  overlayLogo: true,
  pattern: "brand-wall",
  // White HEARST with the plus in Hearst+ blue.
  logoSlug: "hearst-all-knockout",
  logoColor: "native",
};

// Destination pages: the section color with a wall of that section's brands behind the white section lockup.
// Fashion & Luxury is a dark section, so its banner uses the dark page surface (#0D1014) instead of its navy.
export const destinationBrandWallBanners: Partial<Record<string, BrandBanner>> = {
  "hearst-lifestyle": { background: "#A62C37", alt: "Hearst Lifestyle", width: 2560, height: 220, overlayLogo: true, pattern: "brand-wall", wallSection: "lifestyle" },
  "hearst-plus": { background: "#819238", alt: "Hearst Autos", width: 2560, height: 220, overlayLogo: true, pattern: "brand-wall", wallSection: "autos" },
  "hearst-flux": { background: "#0D1014", alt: "Hearst Fashion & Luxury", width: 2560, height: 220, overlayLogo: true, pattern: "brand-wall", wallSection: "flux" },
  "hearst-ew": { background: "#34454C", alt: "Hearst Enthusiast & Wellness", width: 2560, height: 220, overlayLogo: true, pattern: "brand-wall", wallSection: "ew" },
  // Local News: a wall of the Hearst Television station logos.
  "hearst-local-news": {
    background: "#087A68",
    alt: "Hearst Local News",
    width: 2560,
    height: 220,
    overlayLogo: true,
    pattern: "brand-wall",
    wallLogos: [
      "/logos/tv-stations/kcci.png",
      "/logos/tv-stations/kcra.png",
      "/logos/tv-stations/ketv.png",
      "/logos/tv-stations/khbs-khog.png",
      "/logos/tv-stations/kmbc.png",
      "/logos/tv-stations/koat.png",
      "/logos/tv-stations/koco.png",
      "/logos/tv-stations/ksbw.png",
      "/logos/tv-stations/wapt.png",
      "/logos/tv-stations/wbal.png",
      "/logos/tv-stations/wcvb.png",
      "/logos/tv-stations/wdsu.png",
      "/logos/tv-stations/wesh.png",
      "/logos/tv-stations/wgal.png",
      "/logos/tv-stations/wisn.png",
      "/logos/tv-stations/wjcl.png",
      "/logos/tv-stations/wlky.png",
      "/logos/tv-stations/wlwt.png",
      "/logos/tv-stations/wmtw.png",
      "/logos/tv-stations/wmur.png",
      "/logos/tv-stations/wpbf.png",
      "/logos/tv-stations/wptz.png",
      "/logos/tv-stations/wtae.png",
      "/logos/tv-stations/wvtm.png",
      "/logos/tv-stations/wxii.png",
      "/logos/tv-stations/wyff.png",
    ],
  },
};

// A&E Family: near-black like its landing page, a wall of its channel logos, and the lockup in its own white and gold.
export const entertainmentBrandWallBanner: BrandBanner = {
  background: "#050608",
  alt: "Hearst A&E Family",
  width: 2560,
  height: 220,
  overlayLogo: true,
  pattern: "brand-wall",
  logoColor: "native",
  wallLogos: [
    "/logos/aande.svg",
    "/logos/history.svg",
    "/logos/lifetime.svg",
    "/logos/lmn.svg",
    "/logos/fyi.svg",
    "/logos/vice-tv.svg",
    "/logos/biography.svg",
  ],
};

export const brandBanners: Partial<Record<string, BrandBanner>> = {
  "car-and-driver": {
    src: "/images/brand-banners/car-and-driver.jpg",
    alt: "Car and Driver",
    width: 2560,
    height: 440,
    overlayLogo: true,
  },
  cosmopolitan: {
    src: "/images/brand-banners/cosmopolitan.jpg",
    alt: "Cosmopolitan",
    width: 2560,
    height: 440,
    // Yahoo's art has black letterbox bars at 0-104px and 2454-2560px.
    cropX: { left: 106, right: 108 },
  },
  "country-living": {
    src: "/images/brand-banners/country-living.jpg",
    alt: "Country Living",
    width: 2560,
    height: 440,
  },
  elle: {
    // Solid black with the white ELLE SVG logo, drawn larger than the wordmark in Yahoo's art.
    background: "#000",
    alt: "ELLE",
    width: 2560,
    height: 440,
    overlayLogo: true,
    logoSize: "xl",
  },
  "elle-decor": {
    src: "/images/brand-banners/elle-decor.jpg",
    alt: "ELLE Decor",
    width: 2560,
    height: 440,
  },
  esquire: {
    src: "/images/brand-banners/esquire.jpg",
    alt: "Esquire",
    width: 2560,
    height: 440,
  },
  "good-housekeeping": {
    src: "/images/brand-banners/good-housekeeping.jpg",
    alt: "Good Housekeeping",
    width: 2560,
    height: 440,
  },
  "harpers-bazaar": {
    // Solid black with the white Harper's Bazaar SVG logo (Yahoo's art was the wordmark on white).
    background: "#000",
    alt: "Harper's Bazaar",
    width: 2560,
    height: 440,
    overlayLogo: true,
  },
  "house-beautiful": {
    src: "/images/brand-banners/house-beautiful.jpg",
    alt: "House Beautiful",
    width: 2560,
    height: 440,
  },
  "mens-health": {
    src: "/images/brand-banners/mens-health.jpg",
    alt: "Men's Health",
    width: 2560,
    height: 440,
  },
  motortrend: {
    src: "/images/brand-banners/motortrend.jpg",
    alt: "MotorTrend",
    width: 2560,
    height: 440,
    overlayLogo: true,
  },
  "pioneer-woman": {
    src: "/images/brand-banners/pioneer-woman.jpg",
    alt: "The Pioneer Woman",
    width: 2560,
    height: 440,
  },
  "popular-mechanics": {
    src: "/images/brand-banners/popular-mechanics.jpg",
    alt: "Popular Mechanics",
    width: 2560,
    height: 440,
  },
  prevention: {
    src: "/images/brand-banners/prevention.jpg",
    alt: "Prevention",
    width: 2560,
    height: 440,
  },
  redbook: {
    src: "/images/brand-banners/redbook.jpg",
    alt: "Redbook",
    width: 2560,
    height: 440,
  },
  "road-and-track": {
    src: "/images/brand-banners/road-and-track.jpg",
    alt: "Road & Track",
    width: 2560,
    height: 440,
    overlayLogo: true,
  },
  seventeen: {
    src: "/images/brand-banners/seventeen.jpg",
    alt: "Seventeen",
    width: 2560,
    height: 440,
  },
  "town-and-country": {
    src: "/images/brand-banners/town-and-country.jpg",
    alt: "Town & Country",
    width: 2560,
    height: 440,
  },
  veranda: {
    src: "/images/brand-banners/veranda.jpg",
    alt: "Veranda",
    width: 2560,
    height: 440,
  },
  "womens-health": {
    src: "/images/brand-banners/womens-health.jpg",
    alt: "Women's Health",
    width: 2560,
    height: 440,
  },
  // Brands without a usable Yahoo banner use a contextual photo from their own stories, with the logo on top.
  autoweek: {
    // Contextual photo from a Autoweek story: "Porsche Wins Petit Le Mans in a IMSA Season Finale Gone Wild"
    src: "https://hips.hearstapps.com/hmg-prod/images/26454889-3e84-41f2-8d8a-46b89288d728.jpg",
    alt: "Autoweek",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  "best-products": {
    // Contextual photo from a Best Products story: "I Spent Months Testing Google Pixel Phones. These Three Are the Only Models Wort"
    src: "https://hips.hearstapps.com/hmg-prod/images/google-pixel-10-group-007-68f93cdb85d08.jpg",
    alt: "Best Products",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  bicycling: {
    // Contextual photo from a Bicycling story: "Brandon McNulty’s New Rainbow Colnago Is Here—and It’s Surprisingly Close to the"
    src: "https://hips.hearstapps.com/hmg-prod/images/7b86a1db-eb24-435d-90ac-3b16f22c4b57.jpeg",
    alt: "Bicycling",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  "bring-a-trailer": {
    // Contextual photo from a Bring a Trailer story: "1991 GMC Sierra K3500 SLE 4×4 Dually"
    src: "https://bringatrailer.com/wp-content/uploads/2026/09/IMG_E2005-scaled-copy-2026-09-29-z1i-18591.jpg?w=2560",
    alt: "Bring a Trailer",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  "hot-rod": {
    // Contextual photo from a HOT ROD story: "A Late Night Facebook Marketplace Ad Leads to a Lost 1969 Z/28 Camaro Barn Find"
    src: "https://hips.hearstapps.com/hmg-prod/images/dc0ce1f1-58f9-4c34-9d6f-2684725a8691.jpg",
    alt: "HOT ROD",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  "oprah-daily": {
    // Contextual photo from a Oprah Daily story: "Saatva’s Prime Day Competitor Sale Is Here—Oprah Daily Readers Get an Exclusive "
    src: "https://hips.hearstapps.com/hmg-prod/images/freshly-woken-up-young-woman-enjoying-the-morning-royalty-free-image-1762807610.pjpeg",
    alt: "Oprah Daily",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  "runners-world": {
    // Contextual photo from a Runner's World story: "They Hated Running—Then Secretly Trained to Surprise Their Partners on Race Day"
    src: "https://hips.hearstapps.com/hmg-prod/images/london-credit-london-landmarks-half-marathon-1561739252.jpg",
    alt: "Runner's World",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  delish: {
    // Contextual photo from a Delish story: "32 Halloween Cocktails For When The Candy Just Isn’t Enough"
    src: "https://hips.hearstapps.com/hmg-prod/images/del089923-halloween-sangria-web-002-ab-index-64e785b0bffbf.jpg",
    alt: "Delish",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
  "womans-day": {
    // Contextual photo from a Woman's Day story: "I Didn’t Have Tommy Bahama x Stetson on My Fall Bingo Card, But I’m Obsessed"
    src: "https://hips.hearstapps.com/hmg-prod/images/8bf87063-3db4-494a-a405-cb26ac0e52e0.png",
    alt: "Woman's Day",
    width: 2560,
    height: 440,
    overlayLogo: true,
    scrim: true,
  },
};
