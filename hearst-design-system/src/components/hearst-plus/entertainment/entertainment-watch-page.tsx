"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { MainNav } from "@/components/home-page";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight, Play } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type EntertainmentShow = {
  title: string;
  brand: "A&E" | "HISTORY" | "Lifetime" | "LMN" | "FYI" | "VICE TV" | "BIOGRAPHY";
  eyebrow: string;
  description: string;
  href: string;
  imageUrl?: string;
  meta: string;
};

const entertainmentNavLinks = [
  "Featured",
  "A&E",
  "HISTORY",
  "Lifetime",
  "LMN",
  "FYI",
  "VICE TV",
  "BIOGRAPHY",
];

const heroShows: EntertainmentShow[] = [
  {
    title: "Alone",
    brand: "HISTORY",
    eyebrow: "New episodes",
    description: "A survival competition built for a premium, cinematic lead slot with big photography and a direct path to the show.",
    href: "https://www.history.com/shows/alone",
    imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2026/04/alone-s13-3000x3000-primary-1x1-1.jpg?w=1180",
    meta: "13 seasons",
  },
  {
    title: "The First 48",
    brand: "A&E",
    eyebrow: "Featured crime",
    description: "A&E's long-running homicide series anchors the Entertainment surface with urgency, recognizability, and strong key art.",
    href: "https://www.aetv.com/shows/the-first-48",
    imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/the-first-48-s29-3000x3000-primary-1x1-1.jpg?w=1180",
    meta: "30 seasons",
  },
  {
    title: "Married at First Sight",
    brand: "Lifetime",
    eyebrow: "Relationship reality",
    description: "Lifetime programming gives the hero a social, character-driven counterpoint to HISTORY and A&E franchises.",
    href: "https://www.mylifetime.com/shows/married-at-first-sight",
    imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2017/03/mafs-s18-3000x3000-primary-1x1-1.jpg?w=1180",
    meta: "18 seasons",
  },
];

const channelRows: Array<{ brand: EntertainmentShow["brand"]; description: string; shows: EntertainmentShow[] }> = [
  {
    brand: "A&E",
    description: "Crime, documentary, and unscripted franchises from A&E.",
    shows: [
      heroShows[1],
      {
        title: "Storage Wars",
        brand: "A&E",
        eyebrow: "Reality",
        description: "Buyers compete for abandoned storage lockers, chasing the next unlikely treasure.",
        href: "https://www.aetv.com/shows/storage-wars",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/storage-wars-s16-3000x3000-primary-1x1-1.jpg?w=1180",
        meta: "18 seasons",
      },
      {
        title: "Court Cam",
        brand: "A&E",
        eyebrow: "Crime",
        description: "Raw courtroom moments and legal drama built for quick discovery.",
        href: "https://www.aetv.com/shows",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2019/01/court-cam-s9-2048x1152-promo-16x9-1.jpg",
        meta: "A&E shows",
      },
      {
        title: "Intervention",
        brand: "A&E",
        eyebrow: "Docuseries",
        description: "A long-running documentary series centered on recovery and family intervention.",
        href: "https://www.aetv.com/shows/intervention",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/intervention-s25-primary-2x3-1-scaled.jpg",
        meta: "25 seasons",
      },
      {
        title: "60 Days In",
        brand: "A&E",
        eyebrow: "Crime",
        description: "Volunteer participants go inside county jails for an undercover look at the system.",
        href: "https://www.aetv.com/shows/60-days-in",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2024/05/60-days-in-s9-primary-2x3-1-scaled.jpg",
        meta: "9 seasons",
      },
      {
        title: "Hoarders",
        brand: "A&E",
        eyebrow: "Reality",
        description: "A&E's home and human-behavior franchise about extreme clutter and recovery.",
        href: "https://www.aetv.com/shows/hoarders",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/hoarders-s15-primary-2x3-1-scaled.jpg",
        meta: "15 seasons",
      },
    ],
  },
  {
    brand: "HISTORY",
    description: "Survival, mystery, and documentary series from HISTORY.",
    shows: [
      heroShows[0],
      {
        title: "Ancient Aliens",
        brand: "HISTORY",
        eyebrow: "Documentary",
        description: "A long-running paranormal history franchise with deep episode inventory.",
        href: "https://www.history.com/shows/ancient-aliens",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2025/07/ancient-aliens-s21-3000x3000-primary-1x1-1.jpg?w=1180",
        meta: "22 seasons",
      },
      {
        title: "The UnXplained",
        brand: "HISTORY",
        eyebrow: "Mystery",
        description: "A HISTORY discovery lane for unexplained events, oddities, and speculative stories.",
        href: "https://www.history.com/shows",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2025/08/the-unxplained-s8-2048x1152-promo-16x9-1.jpg",
        meta: "HISTORY shows",
      },
      {
        title: "The Secret of Skinwalker Ranch",
        brand: "HISTORY",
        eyebrow: "Mystery",
        description: "An investigation into unexplained activity on one of America's most studied ranches.",
        href: "https://www.history.com/shows/the-secret-of-skinwalker-ranch",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2019/02/the-secret-of-skinwalker-ranch-s7-primary-2x3-1.jpg",
        meta: "7 seasons",
      },
      {
        title: "Mountain Men",
        brand: "HISTORY",
        eyebrow: "Adventure",
        description: "Remote-living stories with a survival and self-reliance spine.",
        href: "https://www.history.com/shows/mountain-men",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2025/09/mountain-men-primary-2x3-fix.jpg",
        meta: "HISTORY shows",
      },
      {
        title: "Forged in Fire",
        brand: "HISTORY",
        eyebrow: "Competition",
        description: "Bladesmiths compete through craft, pressure, and historical weapon challenges.",
        href: "https://www.history.com/shows/forged-in-fire",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2026/02/forged-in-fire-s11-primary-2x3-1.jpg",
        meta: "11 seasons",
      },
    ],
  },
  {
    brand: "Lifetime",
    description: "Relationship, family, and movie-led programming from Lifetime.",
    shows: [
      heroShows[2],
      {
        title: "Dance Moms",
        brand: "Lifetime",
        eyebrow: "Reality",
        description: "Competitive dance and family pressure in a compact binge row.",
        href: "https://www.mylifetime.com/shows/dance-moms",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2015/05/dance-moms-s3-3000x3000-primary-1x1-1.jpg?w=1180",
        meta: "9 seasons",
      },
      {
        title: "Lifetime Movies",
        brand: "Lifetime",
        eyebrow: "Movies",
        description: "A direct lane into Lifetime's movie-first programming.",
        href: "https://www.mylifetime.com/movies",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2026/06/the-daughter-she-left-behind-2048x1152-priority-feature-16x9-1.jpg",
        meta: "Movies",
      },
      {
        title: "The Chrisleys: Back to Reality",
        brand: "Lifetime",
        eyebrow: "Reality",
        description: "A family-led reality series from Lifetime's unscripted slate.",
        href: "https://www.mylifetime.com/shows/the-chrisleys-back-to-reality",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2025/08/the-chrisleys-back-to-reality-primary-2x3-1.jpg",
        meta: "Lifetime",
      },
      {
        title: "Dr. Pimple Popper: Breaking Out",
        brand: "Lifetime",
        eyebrow: "Reality",
        description: "Medical transformation stories with Lifetime's character-driven unscripted lens.",
        href: "https://www.mylifetime.com/shows/dr-pimple-popper-breaking-out",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2025/03/dr-pimple-popper-breaking-out-s2-primary-2x3-1.jpg",
        meta: "2 seasons",
      },
      {
        title: "Bring It!",
        brand: "Lifetime",
        eyebrow: "Reality",
        description: "Competitive dance-team stories from the Lifetime archive.",
        href: "https://www.mylifetime.com/shows/bring-it",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2015/05/bring-it-s3-primary-2x3-1.jpg",
        meta: "5 seasons",
      },
    ],
  },
  {
    brand: "LMN",
    description: "Suspense and movie-night programming for the Lifetime Movie Network lane.",
    shows: [
      {
        title: "LMN Movies",
        brand: "LMN",
        eyebrow: "Movie network",
        description: "A dedicated movie shelf for suspense, thrillers, and weekend programming.",
        href: "https://www.mylifetime.com/lmn",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/11/2025/08/my-amish-double-life-2048x1152-promo-16x9-1.jpg",
        meta: "LMN",
      },
      {
        title: "Lifetime Movie Club",
        brand: "LMN",
        eyebrow: "Streaming",
        description: "Subscription movie discovery from the Lifetime ecosystem.",
        href: "https://www.lifetimemovieclub.com/",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/11/2026/02/the-chrisleys-back-to-reality-2048x1152-promo-16x9-1.jpg",
        meta: "Movie club",
      },
      {
        title: "Lifetime Movies",
        brand: "LMN",
        eyebrow: "Movies",
        description: "A broader movie collection for the shared Lifetime and LMN audience.",
        href: "https://www.mylifetime.com/movies",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/11/2026/03/toni-braxton-he-wasnt-man-enough-2048x1152-promo-16x9-1.jpg",
        meta: "Movies",
      },
      {
        title: "TextMeWhenYouGetHome",
        brand: "LMN",
        eyebrow: "True crime",
        description: "A suspense and true-crime lane from the Lifetime Movie Club catalog.",
        href: "https://www.lifetimemovieclub.com/",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/11/2025/03/TextMeWhenYouGetHome-2048x1152-promo-16x9-1.jpg",
        meta: "Movie club",
      },
      {
        title: "Phrogging: Hider in My House",
        brand: "LMN",
        eyebrow: "Suspense",
        description: "Stranger-than-fiction home-intruder stories built for the LMN lane.",
        href: "https://www.lifetimemovieclub.com/",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/11/2025/01/phrogging-hider-in-my-house-2048x1152-promo-16x9-1.jpg",
        meta: "Movie club",
      },
      {
        title: "Girl in the Basement",
        brand: "LMN",
        eyebrow: "Movie",
        description: "A Lifetime movie title presented as part of the suspense-focused carousel.",
        href: "https://www.lifetimemovieclub.com/",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/11/2021/08/Girl-in-the-Basement-2048x1152-promo-16x9-1.jpg",
        meta: "Movie",
      },
    ],
  },
  {
    brand: "FYI",
    description: "Home, real estate, and lifestyle series from FYI.",
    shows: [
      {
        title: "Tiny House Nation",
        brand: "FYI",
        eyebrow: "Home",
        description: "Small-space renovation stories and ingenious homes from FYI.",
        href: "https://www.fyi.tv/shows/tiny-house-nation",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2017/01/watch-desktop-hero-tiny-house-nation-s4.jpg?w=1024",
        meta: "5 seasons",
      },
      {
        title: "Find My Country House: Australia",
        brand: "FYI",
        eyebrow: "Real estate",
        description: "Property hunting with a regional travel lens.",
        href: "https://www.fyi.tv/shows/tiny-house-nation",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2024/05/Find_My_Country_House_AUSTRALIA_HORZ_3840x2160_FIN-scaled.jpg",
        meta: "FYI",
      },
      {
        title: "Waterfront House Hunting",
        brand: "FYI",
        eyebrow: "Real estate",
        description: "Destination real-estate browsing for lean-back discovery.",
        href: "https://www.fyi.tv/shows/tiny-house-nation",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2024/11/Find-My-Country-House-primary-2x3-1.jpg",
        meta: "FYI",
      },
      {
        title: "Sell This House",
        brand: "FYI",
        eyebrow: "Home",
        description: "Home staging and sales stories from FYI's real-estate library.",
        href: "https://www.fyi.tv/shows/sell-this-house",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2015/04/Sell_This_House_S11_1920x2880-scaled.jpg",
        meta: "11 seasons",
      },
      {
        title: "Rachael Ray in Tuscany",
        brand: "FYI",
        eyebrow: "Food",
        description: "Food, travel, and home cooking with a bright FYI lifestyle angle.",
        href: "https://www.fyi.tv/shows/rachael-ray-in-tuscany",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2024/06/Rachael-Ray-in-Tuscany-primary-2x3-1-scaled.jpg",
        meta: "FYI",
      },
      {
        title: "Living Smaller",
        brand: "FYI",
        eyebrow: "Home",
        description: "Compact-home inspiration and efficient living stories.",
        href: "https://www.fyi.tv/shows/living-smaller",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2024/08/living-smaller-primary-2x3-1.jpg",
        meta: "FYI",
      },
    ],
  },
  {
    brand: "VICE TV",
    description: "Documentary and culture programming from VICE TV.",
    shows: [
      {
        title: "Dark Side of the Ring",
        brand: "VICE TV",
        eyebrow: "Documentary",
        description: "Investigative wrestling stories from VICE TV.",
        href: "https://www.vicetv.com/en_us/show/dark-side-of-the-ring",
        imageUrl: "https://video-images.vice.com/shows/5a8df22cf1cdb37df5514be1/card/1783437037854-darksideoftherings72000x3000.jpeg",
        meta: "Season 6",
      },
      {
        title: "Dark Side of the Ring: After Dark",
        brand: "VICE TV",
        eyebrow: "Aftershow",
        description: "A panel-format companion for the Dark Side franchise.",
        href: "https://www.vicetv.com/en_us/show/dark-side-of-the-ring-after-dark",
        imageUrl: "https://video-images.vice.com/test-uploads/shows/5e73aeddae634b2a6e7087fa/card/1585093344023-SHOW_POSTER_2000X3000.jpeg",
        meta: "VICE TV",
      },
      {
        title: "Tales From The Territories",
        brand: "VICE TV",
        eyebrow: "Documentary",
        description: "Wrestling territory history and culture reporting.",
        href: "https://www.vicetv.com/en_us/topic/dark-side-of-the-ring",
        imageUrl: "https://video-images.vice.com/shows/620d4f03e415fb23d861a573/card/1670523406512-verticalshowposter2000x3000.jpeg",
        meta: "VICE TV",
      },
      {
        title: "Hamilton's Pharmacopeia",
        brand: "VICE TV",
        eyebrow: "Documentary",
        description: "Science, culture, and reporting around psychoactive substances.",
        href: "https://www.vicetv.com/en_us/show/hamiltons-pharmacopeia",
        imageUrl: "https://video-images.vice.com/shows/57a204098cb727dec794c709/card/1607109629494-hamiltons3showposter2000x3000line.jpeg",
        meta: "VICE TV",
      },
      {
        title: "Hate Thy Neighbor",
        brand: "VICE TV",
        eyebrow: "Documentary",
        description: "A VICE TV docuseries examining extremism and fringe movements.",
        href: "https://www.vicetv.com/en_us/show/hate-thy-neighbor",
        imageUrl: "https://video-images.vice.com/shows/58332b2d9bcbe27abce22a4d/card/1575585297110-HTN_S2_KEY_ART.jpeg",
        meta: "VICE TV",
      },
      {
        title: "Most Expensivest",
        brand: "VICE TV",
        eyebrow: "Culture",
        description: "A culture and luxury curiosity series from VICE TV.",
        href: "https://www.vicetv.com/en_us/show/most-expensivest",
        imageUrl: "https://video-images.vice.com/shows/59de61601b07f8307db8c829/card/1676387681676-mostexpensivests42000x3000.jpeg",
        meta: "VICE TV",
      },
    ],
  },
  {
    brand: "BIOGRAPHY",
    description: "People-led storytelling and evergreen profile discovery.",
    shows: [
      {
        title: "Biography",
        brand: "BIOGRAPHY",
        eyebrow: "Profiles",
        description: "A people-first channel row for evergreen life stories and notable figures.",
        href: "https://www.biography.com/",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/dc53a38c-3156-4379-93ab-574303a58eb1.jpeg?crop=0.708xw:1xh;center,top",
        meta: "Profiles",
      },
      {
        title: "History Makers",
        brand: "BIOGRAPHY",
        eyebrow: "Culture",
        description: "A profile slot for figures with cultural impact and long-tail interest.",
        href: "https://www.biography.com/",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/cc90dc8d-0f12-4072-b779-31d7ae364514.jpeg?crop=1xw:0.764xh;0xw,0.04xh&resize=1120:*",
        meta: "Biography",
      },
      {
        title: "Icons",
        brand: "BIOGRAPHY",
        eyebrow: "Archive",
        description: "A compact row item for biography-led archive discovery.",
        href: "https://www.biography.com/",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/e3a10926-6f85-49f1-98ba-191e7de95ad6.jpeg?crop=0.666333333333xw:1xh;center,top&resize=360:*",
        meta: "Biography",
      },
      {
        title: "Inventors",
        brand: "BIOGRAPHY",
        eyebrow: "Profiles",
        description: "Evergreen profile discovery for notable builders, makers, and inventors.",
        href: "https://www.biography.com/",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/bio-famous-inventors-65e20470ce112.jpg?crop=0.579xw:1.00xh;0.212xw,0&resize=360:*",
        meta: "Biography",
      },
      {
        title: "Elvis Presley",
        brand: "BIOGRAPHY",
        eyebrow: "Music",
        description: "A high-recognition musician profile from the Biography archive.",
        href: "https://www.biography.com/musicians/elvis-presley",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/elvis-presley-poses-for-the-camera-during-his-military-service-at-a-us-base-in-germany-photo-by-vittoriano-rastellicorbis-via-getty-images1.jpg?crop=0.739xw:0.942xh;0.0342xw,0.0581xh&resize=360:*",
        meta: "Biography",
      },
      {
        title: "Christopher Nolan",
        brand: "BIOGRAPHY",
        eyebrow: "Film",
        description: "A contemporary film profile for Biography's entertainment lane.",
        href: "https://www.biography.com/",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/christopher-nolan-attends-the-oppenheimer-premiere-at-news-photo-1704643272.jpg?crop=0.667xw:1.00xh;0.188xw,0&resize=360:*",
        meta: "Biography",
      },
    ],
  },
];

const brandAccent: Record<EntertainmentShow["brand"], string> = {
  "A&E": "#2B78D0",
  HISTORY: "#E4AA33",
  Lifetime: "#F52A68",
  LMN: "#E51D50",
  FYI: "#00A982",
  "VICE TV": "#F5F5F5",
  BIOGRAPHY: "#9DD0FF",
};

const channelLogoAssets: Record<
  EntertainmentShow["brand"],
  {
    src: string;
    className: string;
    invert?: boolean;
  }
> = {
  "A&E": {
    src: "https://www.mylifetime.com/assets/images/aetv/logo.svg",
    className: "h-7 w-auto md:h-8",
  },
  HISTORY: {
    src: "https://www.mylifetime.com/assets/images/history/logo-black-rtm.svg",
    className: "h-9 w-auto md:h-11",
    invert: true,
  },
  Lifetime: {
    src: "https://www.mylifetime.com/assets/images/lifetime/logo-black-rtm.svg",
    className: "h-8 w-auto md:h-10",
    invert: true,
  },
  LMN: {
    src: "https://www.mylifetime.com/assets/images/lmn/logo-black-rtm.svg",
    className: "h-7 w-auto md:h-8",
    invert: true,
  },
  FYI: {
    src: "https://www.mylifetime.com/assets/images/fyi/logo-black-rtm.svg",
    className: "h-7 w-auto md:h-8",
    invert: true,
  },
  "VICE TV": {
    src: "https://www.mylifetime.com/assets/images/vicetv/logo-black.svg",
    className: "h-7 w-auto md:h-8",
    invert: true,
  },
  BIOGRAPHY: {
    src: "https://www.mylifetime.com/assets/images/biography/logo-black-rtm.svg",
    className: "h-7 w-auto md:h-8",
    invert: true,
  },
};

function formatBrandInitials(brand: EntertainmentShow["brand"]) {
  if (brand === "HISTORY") return "H";
  if (brand === "Lifetime") return "L";
  if (brand === "VICE TV") return "VICE";
  if (brand === "BIOGRAPHY") return "BIO";
  return brand;
}

export function EntertainmentWatchPage() {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHero = heroShows[activeHeroIndex] ?? heroShows[0];

  return (
    <div
      className="min-h-screen bg-[#050608] text-white"
      style={{
        "--primary": "#E4AA33",
        "--hp-primary": "#E4AA33",
        "--hp-nav": "#E4AA33",
        "--hp-section-title": "#F6D48A",
        "--hp-sidebar-heading": "#F6D48A",
        "--component-navigation-utility-background-knockout": "#050608",
        "--component-navigation-utility-megamenu-background-knockout": "#101216",
        "--component-navigation-utility-content-knockout": "#FFFFFF",
        "--component-navigation-utility-content-accent": "#F6D48A",
        "--component-navigation-utility-content-accent-hover": "#FFE0A0",
      } as React.CSSProperties}
    >
      <UtilityBar activeDestinationOverride="Entertainment" darkMode />
      <MainNav
        brandSlug="hearst-all"
        selectedBrand={{ name: "A&E", slug: "hearst-entertainment" }}
        activeFilter="Featured"
        navLinksOverride={entertainmentNavLinks}
        darkMode
      />
      <main className="overflow-hidden bg-[#050608]">
        <section className="relative min-h-[calc(100svh-112px)] overflow-hidden md:min-h-[min(82vh,820px)]">
          {activeHero.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeHero.imageUrl} alt="" className="absolute inset-0 h-full w-full scale-[1.01] object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050608_0%,rgba(5,6,8,0.96)_24%,rgba(5,6,8,0.55)_58%,rgba(5,6,8,0.2)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.08)_0%,rgba(5,6,8,0.18)_48%,#050608_100%)]" />
          <div className="relative mx-auto flex min-h-[calc(100svh-112px)] max-w-[1440px] items-end px-5 pb-28 pt-24 md:min-h-[min(82vh,820px)] md:px-8 md:pb-36 lg:px-10">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <BrandPill brand={activeHero.brand} />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{activeHero.eyebrow}</span>
              </div>
              <h1 className="headline max-w-3xl text-balance text-5xl leading-none md:text-7xl lg:text-8xl">
                {activeHero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/78 md:text-lg md:leading-8">
                {activeHero.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={activeHero.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-white px-5 text-sm font-bold text-black no-underline transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <Play className="size-4" aria-hidden="true" />
                  View show
                </a>
                <span className="text-sm font-semibold text-white/70">{activeHero.meta}</span>
              </div>
              <div className="mt-8 flex items-center gap-2">
                {heroShows.map((show, index) => (
                  <button
                    key={show.title}
                    type="button"
                    onClick={() => setActiveHeroIndex(index)}
                    aria-label={`Show ${show.title} in the hero`}
                    aria-current={index === activeHeroIndex ? "true" : undefined}
                    className={cn(
                      "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                      index === activeHeroIndex ? "w-9 bg-white" : "w-2.5 bg-white/35 hover:bg-white/60",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-24 px-5 pb-16 md:-mt-32 md:px-8 lg:px-10">
          <div className="mx-auto max-w-[1440px] space-y-9">
            <HeroShelf activeHeroIndex={activeHeroIndex} onSelectHero={setActiveHeroIndex} />
            {channelRows.map((row) => (
              <ChannelRow key={row.brand} row={row} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter
        siteName={<BrandLogo slug="hearst-all" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
        copyrightYear={2026}
        finePrintNote="Prototype only. Entertainment artwork and show links are sourced from the public A&E family websites where available."
      />
    </div>
  );
}

function HeroShelf({
  activeHeroIndex,
  onSelectHero,
}: {
  activeHeroIndex: number;
  onSelectHero: (index: number) => void;
}) {
  return (
    <section aria-labelledby="featured-entertainment-row">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 id="featured-entertainment-row" className="text-xl font-bold text-white md:text-2xl">Featured</h2>
      </div>
      <div className="grid auto-cols-[minmax(16rem,24rem)] grid-flow-col gap-3 overflow-x-auto pb-4 [scrollbar-color:rgba(255,255,255,0.28)_transparent] md:auto-cols-[minmax(22rem,32rem)] md:gap-4">
        {heroShows.map((show, index) => (
          <button
            key={show.title}
            type="button"
            onClick={() => onSelectHero(index)}
            aria-label={`Feature ${show.title}`}
            aria-current={index === activeHeroIndex ? "true" : undefined}
            className="group min-w-0 rounded-[8px] text-left text-white transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <ShowPoster show={show} active={index === activeHeroIndex} />
          </button>
        ))}
      </div>
    </section>
  );
}

function ChannelRow({ row }: { row: (typeof channelRows)[number] }) {
  return (
    <section aria-labelledby={`entertainment-${row.brand.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ChannelLogoHeading brand={row.brand} />
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/58">{row.description}</p>
        </div>
        <a href={row.shows[0]?.href ?? "#"} target="_blank" rel="noreferrer" className="hidden min-h-11 items-center gap-1 text-sm font-bold text-white/72 no-underline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:inline-flex">
          View channel
          <ChevronRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <Carousel opts={{ align: "start", dragFree: true }} className="group/channel">
        <CarouselContent className="-ml-3 pb-4 pt-1 md:-ml-4">
          {row.shows.map((show) => (
            <CarouselItem
              key={show.title}
              className="basis-[58%] pl-3 sm:basis-[42%] md:basis-1/3 md:pl-4 lg:basis-1/4"
            >
              <ShowCard show={show} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <span className="pointer-events-none absolute inset-y-1 right-0 z-10 hidden w-20 bg-gradient-to-l from-[#050608] to-transparent md:block" aria-hidden="true" />
        <CarouselPrevious
          size="icon-touch"
          className="left-3 z-20 hidden border-white bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-[#F6D48A] disabled:opacity-0 md:inline-flex"
        />
        <CarouselNext
          size="icon-touch"
          className="right-3 z-20 hidden border-white bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-[#F6D48A] disabled:opacity-0 md:inline-flex"
        />
      </Carousel>
    </section>
  );
}

function ChannelLogoHeading({ brand }: { brand: EntertainmentShow["brand"] }) {
  const logo = channelLogoAssets[brand];
  const headingId = `entertainment-${brand.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <h2 id={headingId} className="flex min-h-11 items-center text-2xl font-bold text-white">
      {logo ? (
        <>
          <span className="sr-only">{brand}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt=""
            className={cn("block max-w-[11rem] object-contain", logo.className, logo.invert && "brightness-0 invert")}
            loading="lazy"
          />
        </>
      ) : (
        brand
      )}
    </h2>
  );
}

function ShowCard({ show }: { show: EntertainmentShow }) {
  return (
    <article className="group min-w-0 transition-transform hover:-translate-y-1">
      <a href={show.href} target="_blank" rel="noreferrer" className="block h-full min-w-0 text-white no-underline">
        <ShowPoster show={show} />
        <span className="block pt-3">
          <span className="line-clamp-1 block text-base font-bold leading-tight transition-colors group-hover:text-[#F6D48A] md:text-lg">{show.title}</span>
          <span className="mt-1 block text-xs font-semibold text-white/48">{show.meta}</span>
        </span>
      </a>
    </article>
  );
}

function ShowPoster({ show, active = false }: { show: EntertainmentShow; active?: boolean }) {
  return (
    <span
      className={cn(
        "relative grid aspect-video min-w-0 place-items-center overflow-hidden rounded-[6px] bg-white/[0.07] ring-1 ring-inset ring-white/10 transition-shadow group-hover:ring-white/28",
        active && "ring-2 ring-[#F6D48A]",
      )}
    >
      {show.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={show.imageUrl} alt={`Show artwork for ${show.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
      ) : (
        <span className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] p-6 text-center">
          <span className="text-3xl font-black tracking-tight" style={{ color: brandAccent[show.brand] }}>{formatBrandInitials(show.brand)}</span>
        </span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
      <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/58">{show.eyebrow}</span>
          <span className="mt-1 line-clamp-1 block text-lg font-bold leading-tight text-white">{show.title}</span>
        </span>
        <BrandPill brand={show.brand} compact />
      </span>
    </span>
  );
}

function BrandPill({ brand, compact = false }: { brand: EntertainmentShow["brand"]; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full bg-black/55 ring-1 ring-white/14", compact ? "px-2 py-1" : "px-3 py-1.5")}>
      <span
        aria-hidden="true"
        className={cn("grid shrink-0 place-items-center rounded-[4px] bg-white text-[9px] font-black leading-none text-black", compact ? "size-5" : "size-6")}
        style={{ color: brand === "VICE TV" ? "#050608" : brandAccent[brand] }}
      >
        {formatBrandInitials(brand)}
      </span>
      <span className={cn("font-bold leading-none text-white", compact ? "text-[11px]" : "text-xs")}>{brand}</span>
    </span>
  );
}
