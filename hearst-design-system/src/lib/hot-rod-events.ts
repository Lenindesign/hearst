export type HotRodEventStatus =
  | "coming-soon"
  | "registration-open"
  | "registration-closed"
  | "sold-out"
  | "underway"
  | "concluded";

export type HotRodEventStop = {
  day: string;
  date: string;
  venue: string;
  location: string;
  note?: string;
};

export type HotRodEventResource = {
  label: string;
  description: string;
  href: string;
};

export type HotRodEventCoverage = {
  label: "Gallery" | "Story" | "Guide";
  title: string;
  image: string;
  href: string;
};

export type HotRodEvent = {
  slug: string;
  series: string;
  edition: string;
  title: string;
  eyebrow: string;
  summary: string;
  dateLabel: string;
  locationLabel: string;
  status: HotRodEventStatus;
  image: string;
  href: string;
  sourceUrl: string;
  statusLabel?: string;
  ticketUrl?: string;
  ticketProvider?: "TicketSpice";
  waitlistUrl?: string;
  schedule?: HotRodEventStop[];
  resources?: HotRodEventResource[];
  coverage?: HotRodEventCoverage[];
};

export const powerTour2026: HotRodEvent = {
  slug: "power-tour-2026",
  series: "HOT ROD Power Tour",
  edition: "2026",
  title: "2026 HOT ROD Power Tour",
  eyebrow: "America’s ultimate road trip",
  summary:
    "The world’s largest traveling car show celebrated 100 years of Route 66 with five days of hot rods, drag racing, and small-town stops from Illinois to Oklahoma.",
  dateLabel: "June 8–12, 2026",
  locationLabel: "Route 66 · Illinois to Oklahoma",
  status: "concluded",
  image: "https://hips.hearstapps.com/hmg-prod/images/ed9d971b-c4b8-4654-ac89-f531650a76cc.jpg",
  href: "/autos/hot-rod/events/power-tour/",
  sourceUrl: "https://www.hotrod.com/events/2026-hot-rod-power-tour-route-66-dates-locations",
  ticketUrl: "https://mtg.ticketspice.com/hot-rod-power-tour-2026",
  ticketProvider: "TicketSpice",
  schedule: [
    {
      day: "Day 1",
      date: "Mon, June 8",
      venue: "Route 66 Raceway",
      location: "Joliet, IL",
      note: "Kickoff and registration",
    },
    {
      day: "Day 2",
      date: "Tue, June 9",
      venue: "Village of Rantoul",
      location: "Rantoul, IL",
    },
    {
      day: "Day 3",
      date: "Wed, June 10",
      venue: "World Wide Technology Raceway",
      location: "St. Louis, MO",
      note: "Drag racing and autocross",
    },
    {
      day: "Day 4",
      date: "Thu, June 11",
      venue: "Missouri State University",
      location: "Springfield, MO",
    },
    {
      day: "Day 5",
      date: "Fri, June 12",
      venue: "Tulsa Raceway Park",
      location: "Tulsa, OK",
      note: "Finale",
    },
  ],
  resources: [
    {
      label: "Routes",
      description: "Daily drives and Route 66 points of interest",
      href: "https://s3.amazonaws.com/uploads.webconnex.com/10977%2Fcomm_center%2F8815mycwjvs%2F1778680680899-HRPT2026%E2%80%94Maps+FINAL+1+(1).pdf",
    },
    {
      label: "Daily schedules",
      description: "Day-by-day activities and event times",
      href: "https://s3.amazonaws.com/uploads.webconnex.com/10977%2Fcomm_center%2F8815mycwjvs%2F1778680690768-HRPT2026%E2%80%94Itinerary+4.pdf",
    },
    {
      label: "Venue maps",
      description: "Entry, exit, parking, and activity areas",
      href: "https://api.webconnex.com/v1/postmaster/track/click/65e575c08b10466abc9e0a77bfe8f74d/201be9a3aa4f49fca04017132cf3d2dd?url=https%3A%2F%2Fs3.amazonaws.com%2Fuploads.webconnex.com%2F10977%252Fcomm_center%252F8815mycwjvs%252F1778800761110-hrpt_2026_day_1_r66_v2.pdf",
    },
    {
      label: "FAQs",
      description: "Answers for participants and spectators",
      href: "https://s3.amazonaws.com/uploads.webconnex.com/10977%2Fcomm_center%2F9jx80egm8p7%2F1767982280122-HOT+ROD+Power+Tour+FAQs.pdf",
    },
  ],
  coverage: [
    {
      label: "Gallery",
      title: "One Last Look at the Long Haulers Who Made Power Tour History",
      image: "https://hips.hearstapps.com/hmg-prod/images/ed9d971b-c4b8-4654-ac89-f531650a76cc.jpg",
      href: "/read/hot-rod-events-hot-rod-power-tour-2026-long-hauler-photo-gallery-3/?from=%2Fautos%2Fhot-rod%2Fevents%2Fpower-tour%2F",
    },
    {
      label: "Gallery",
      title: "Did We Catch Your Ride? Long Hauler Gallery Part 2",
      image: "https://hips.hearstapps.com/hmg-prod/images/c4dfe8a8-5dbc-4891-bb5a-f2fe8cfbe486.jpg",
      href: "/read/hot-rod-events-hot-rod-power-tour-2026-long-hauler-photo-gallery-2/?from=%2Fautos%2Fhot-rod%2Fevents%2Fpower-tour%2F",
    },
    {
      label: "Guide",
      title: "Route 66 Daily Drives, Attractions, and Must-See Stops",
      image: "https://hips.hearstapps.com/hmg-prod/images/8e2d7ccd-806a-43de-b1ca-13cb892cb253.jpg",
      href: "https://www.hotrod.com/events/hot-rod-power-tour-2026-route-guide-roadside-attractions-stops",
    },
  ],
};

export const dragWeek2026: HotRodEvent = {
  slug: "drag-week-2026",
  series: "HOT ROD Drag Week",
  edition: "2026",
  title: "HOT ROD Drag Week 2026",
  eyebrow: "The toughest street-car event on earth",
  summary:
    "Six days of dragstrip competition and street driving begin and end at Route 66 Raceway, with stops at three additional Midwest tracks.",
  dateLabel: "September 13–18, 2026",
  locationLabel: "Illinois and Missouri",
  status: "sold-out",
  statusLabel: "Racer tickets sold out",
  image:
    "https://hips.hearstapps.com/mtg-prod/68c8a70f9326e8000272d01a/007-2025-hot-rod-drag-week-hrdw-september-15-monday-results.jpg",
  href: "/autos/hot-rod/events/drag-week/",
  sourceUrl: "https://www.hotrod.com/events/2026-hot-rod-drag-week-schedule-route-66-raceway/",
  ticketUrl: "https://mtg.ticketspice.com/hot-rod-drag-week-2026",
  ticketProvider: "TicketSpice",
  waitlistUrl:
    "https://forms.office.com/Pages/ResponsePage.aspx?id=55RIqMWH40CXgzINAzSzzP7PF8YOCl1OlWg7cbQM9j1UNDRQWTFBVlk3MjNKVlo0N09CQ0tWSlJUWS4u",
  schedule: [
    {
      day: "Day 0",
      date: "Sun, September 13",
      venue: "Route 66 Raceway",
      location: "Joliet, IL",
      note: "Tech inspection, registration, and Test 'N' Tune",
    },
    {
      day: "Day 1",
      date: "Mon, September 14",
      venue: "Route 66 Raceway",
      location: "Joliet, IL",
      note: "Opening race day",
    },
    {
      day: "Day 2",
      date: "Tue, September 15",
      venue: "Byron Dragway",
      location: "Byron, IL",
    },
    {
      day: "Day 3",
      date: "Wed, September 16",
      venue: "Cordova Dragway",
      location: "Cordova, IL",
    },
    {
      day: "Day 4",
      date: "Thu, September 17",
      venue: "World Wide Technology Raceway",
      location: "Madison, IL",
    },
    {
      day: "Day 5",
      date: "Fri, September 18",
      venue: "Route 66 Raceway",
      location: "Joliet, IL",
      note: "Finals",
    },
  ],
  resources: [
    {
      label: "Drag Week rules",
      description: "Official racer requirements and competition rules",
      href: "https://s3.amazonaws.com/uploads.webconnex.com/10977%2Fcomm_center%2Fyqsmvgm4z88%2F1770308897261-2025%2B-%2B2027%2BHRDW%2B%281%29.pdf",
    },
    {
      label: "Official hotels",
      description: "Discounted event accommodations from the official travel partner",
      href: "https://www.anthonytravel.com/hot-rod-drag-week/",
    },
    {
      label: "Vendor form",
      description: "Official 2026 Drag Week vendor information",
      href: "https://s3.amazonaws.com/uploads.webconnex.com/10977%2Fcomm_center%2F612pqonlx4g%2F1770251290976-2026%2BHRDW%2BVendor%2BForm%2B1.pdf",
    },
    {
      label: "Racer waitlist",
      description: "Join the waitlist after racer tickets sold out",
      href: "https://forms.office.com/Pages/ResponsePage.aspx?id=55RIqMWH40CXgzINAzSzzP7PF8YOCl1OlWg7cbQM9j1UNDRQWTFBVlk3MjNKVlo0N09CQ0tWSlJUWS4u",
    },
  ],
};

export const hotRodEvents: HotRodEvent[] = [
  dragWeek2026,
  {
    slug: "true-street-2026",
    series: "HOT ROD True Street",
    edition: "2026",
    title: "HOT ROD True Street",
    eyebrow: "Summer Nats USA",
    summary:
      "The street-legal challenge returns with a road cruise, three consecutive passes, and a King of the Street finale.",
    dateLabel: "September 18–19, 2026",
    locationLabel: "Lucas Oil Indianapolis Raceway Park",
    status: "registration-open",
    image: "https://hips.hearstapps.com/hmg-prod/images/8e2d7ccd-806a-43de-b1ca-13cb892cb253.jpg",
    href: "https://www.hotrod.com/features/hot-rod-true-street-returns-summer-nats-usa-2026",
    sourceUrl: "https://www.hotrod.com/features/hot-rod-true-street-returns-summer-nats-usa-2026",
  },
  powerTour2026,
  {
    slug: "power-tour-2027",
    series: "HOT ROD Power Tour",
    edition: "2027",
    title: "HOT ROD Power Tour 2027",
    eyebrow: "Next year’s tour",
    summary:
      "Power Tour returns every year. Dates, route, registration, and ticket information will appear here when announced.",
    dateLabel: "Dates to be announced",
    locationLabel: "Route to be announced",
    status: "coming-soon",
    image: "https://hips.hearstapps.com/hmg-prod/images/c4dfe8a8-5dbc-4891-bb5a-f2fe8cfbe486.jpg",
    href: "/autos/hot-rod/events/power-tour/",
    sourceUrl: "https://www.hotrod.com/events/",
  },
];

export const hotRodEventYears = ["2027", "2026", "2025", "2024"] as const;

export const hotRodEventTheme = {
  primary: "#c11b17",
  primaryForeground: "#ffffff",
  red: "#c8101e",
  redDark: "#991019",
  redLight: "#ff6a73",
  black: "#111111",
  asphalt: "#242424",
  cream: "#f3ebdd",
  heroOverlay:
    "linear-gradient(90deg,rgba(0,0,0,0.93) 0%,rgba(0,0,0,0.7) 42%,rgba(0,0,0,0.13) 76%),linear-gradient(0deg,rgba(0,0,0,0.68) 0%,transparent 50%)",
  dragWeekOverlay:
    "linear-gradient(90deg,rgba(0,0,0,0.94) 0%,rgba(0,0,0,0.72) 44%,rgba(0,0,0,0.12) 78%),linear-gradient(0deg,rgba(0,0,0,0.72) 0%,transparent 52%)",
} as const;

export function getHotRodEventStatusLabel(status: HotRodEventStatus) {
  return {
    "coming-soon": "Coming soon",
    "registration-open": "Registration open",
    "registration-closed": "Registration closed",
    "sold-out": "Sold out",
    underway: "Underway",
    concluded: "Event concluded",
  }[status];
}
