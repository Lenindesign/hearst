/**
 * Club activity model for the Men's Health Training Club feed.
 *
 * The shape mirrors what a fitness-tracker import or a Hearst+ activity service would return, so the
 * sample data below can later be swapped for a real source without changing the card. Everything in
 * `sampleClubActivities` is illustrative: the members are fictional and the routes are hand-traced
 * approximations of public paths, not anyone's recorded GPS.
 */

export type ActivityType = "walk" | "run" | "ride" | "hike" | "strength" | "mobility" | "other";

export type ActivityAthlete = {
  id: string;
  name: string;
  /** Optional profile photo. Cards fall back to initials. */
  avatarUrl?: string;
};

export type ActivityCoordinate = {
  lat: number;
  lng: number;
};

export type ActivityComment = {
  id: string;
  author: ActivityAthlete;
  body: string;
  postedAt: string;
};

export type Activity = {
  id: string;
  athlete: ActivityAthlete;
  type: ActivityType;
  title: string;
  /** ISO 8601 start time. */
  startedAt: string;
  /** IANA time zone the activity happened in; dates render in this zone so server and client agree. */
  timeZone?: string;
  /** When true only the day is known (a manual check-in), so no clock time is shown. */
  dateOnly?: boolean;
  /** Device or app the activity came from, for example "Apple Watch Ultra 2". */
  source?: string;
  /** Coarse, member-chosen place label, for example "Brooklyn, New York". Never a street address. */
  location?: string;
  distanceMi?: number;
  steps?: number;
  durationSec: number;
  /** Ordered GPS samples. Omit for indoor or manual activities; the card then shows no map. */
  route?: ActivityCoordinate[];
  kudos: ActivityAthlete[];
  comments: ActivityComment[];
  /** Marks illustrative prototype data so the UI can label it. */
  isSample?: boolean;
};

export const activityTypeLabels: Record<ActivityType, string> = {
  walk: "Walk",
  run: "Run",
  ride: "Ride",
  hike: "Hike",
  strength: "Strength workout",
  mobility: "Mobility",
  other: "Activity",
};

/* ---------- formatting ---------- */

export function formatActivityDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours) return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  if (minutes) return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
  return `${rest}s`;
}

/** Spoken form for screen readers, for example "48 minutes 51 seconds". */
export function describeActivityDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const parts: string[] = [];
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (rest && !hours) parts.push(`${rest} ${rest === 1 ? "second" : "seconds"}`);
  return parts.join(" ") || "0 seconds";
}

export function formatActivityPace(activity: Pick<Activity, "distanceMi" | "durationSec">) {
  if (!activity.distanceMi) return undefined;
  const secondsPerMile = activity.durationSec / activity.distanceMi;
  const minutes = Math.floor(secondsPerMile / 60);
  const seconds = Math.round(secondsPerMile % 60);
  return seconds === 60 ? `${minutes + 1}:00 /mi` : `${minutes}:${String(seconds).padStart(2, "0")} /mi`;
}

export function formatActivitySpeed(activity: Pick<Activity, "distanceMi" | "durationSec">) {
  if (!activity.distanceMi || !activity.durationSec) return undefined;
  return `${(activity.distanceMi / (activity.durationSec / 3600)).toFixed(1)} mph`;
}

export function formatActivityStart(activity: Pick<Activity, "startedAt" | "timeZone" | "dateOnly">) {
  const date = new Date(activity.startedAt);
  if (Number.isNaN(date.getTime())) return "";
  const timeZone = activity.timeZone ?? "UTC";
  const day = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone }).format(date);
  if (activity.dateOnly) return day;
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(date);
  return `${day} at ${time}`;
}

export function athleteInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts.length === 1 ? parts[0].slice(0, 2) : `${parts[0][0]}${parts[parts.length - 1][0]}`).toUpperCase();
}

export type ActivityStat = { id: string; label: string; value: string; spoken?: string };

/** The three headline stats: distance, then steps / pace / speed, then time. */
export function getActivityStats(activity: Activity): ActivityStat[] {
  const stats: ActivityStat[] = [];
  if (activity.distanceMi) {
    stats.push({ id: "distance", label: "Distance", value: `${activity.distanceMi.toFixed(2)} mi`, spoken: `${activity.distanceMi.toFixed(2)} miles` });
  }
  if (activity.type === "walk" || activity.type === "hike") {
    if (activity.steps) stats.push({ id: "steps", label: "Steps", value: activity.steps.toLocaleString("en-US") });
  } else if (activity.type === "ride") {
    const speed = formatActivitySpeed(activity);
    if (speed) stats.push({ id: "speed", label: "Avg speed", value: speed, spoken: speed.replace("mph", "miles per hour") });
  } else {
    const pace = formatActivityPace(activity);
    if (pace) stats.push({ id: "pace", label: "Pace", value: pace, spoken: pace.replace(" /mi", " per mile") });
    else if (activity.steps) stats.push({ id: "steps", label: "Steps", value: activity.steps.toLocaleString("en-US") });
  }
  stats.push({ id: "time", label: "Time", value: formatActivityDuration(activity.durationSec), spoken: describeActivityDuration(activity.durationSec) });
  return stats;
}

/* ---------- route geometry ---------- */

const EARTH_RADIUS_MI = 3958.8;

function haversineMi(a: ActivityCoordinate, b: ActivityCoordinate) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(h));
}

export function routeDistanceMi(route: ActivityCoordinate[]) {
  let total = 0;
  for (let index = 1; index < route.length; index += 1) total += haversineMi(route[index - 1], route[index]);
  return total;
}

export function isLoopRoute(route: ActivityCoordinate[]) {
  if (route.length < 3) return false;
  const total = routeDistanceMi(route);
  return haversineMi(route[0], route[route.length - 1]) < Math.max(0.08, total * 0.05);
}

const compassPoints = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];

function compassBearing(from: ActivityCoordinate, to: ActivityCoordinate) {
  const dy = to.lat - from.lat;
  const dx = (to.lng - from.lng) * Math.cos((from.lat * Math.PI) / 180);
  const degrees = (Math.atan2(dx, dy) * 180) / Math.PI;
  return compassPoints[Math.round(((degrees + 360) % 360) / 45) % 8];
}

/** A short text equivalent of the route map for assistive technology. */
export function describeActivityRoute(activity: Activity) {
  const route = activity.route;
  if (!route || route.length < 2) return "No route recorded for this activity.";
  const distance = activity.distanceMi ?? routeDistanceMi(route);
  const place = activity.location ? ` in ${activity.location}` : "";
  if (isLoopRoute(route)) {
    const furthest = route.reduce((best, point) => (haversineMi(route[0], point) > haversineMi(route[0], best) ? point : best), route[0]);
    return `Route map: a ${distance.toFixed(1)}-mile loop${place}, heading ${compassBearing(route[0], furthest)} first and finishing back at the start.`;
  }
  return `Route map: a ${distance.toFixed(1)}-mile point-to-point route${place}, heading ${compassBearing(route[0], route[route.length - 1])} from start to finish.`;
}

/** Google encoded-polyline format, used by the Static Maps path parameter. */
export function encodePolyline(route: ActivityCoordinate[]) {
  let lastLat = 0;
  let lastLng = 0;
  let output = "";
  const encodeValue = (value: number) => {
    let current = value < 0 ? ~(value << 1) : value << 1;
    let chunk = "";
    while (current >= 0x20) {
      chunk += String.fromCharCode((0x20 | (current & 0x1f)) + 63);
      current >>= 5;
    }
    return chunk + String.fromCharCode(current + 63);
  };
  route.forEach(({ lat, lng }) => {
    const latE5 = Math.round(lat * 1e5);
    const lngE5 = Math.round(lng * 1e5);
    output += encodeValue(latE5 - lastLat) + encodeValue(lngE5 - lastLng);
    lastLat = latE5;
    lastLng = lngE5;
  });
  return output;
}

/* ---------- sample data ---------- */

/** Deterministic pseudo-random sequence so sample routes and fallback maps render the same everywhere. */
export function seededRandom(seed: string) {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) state = Math.imul(state ^ seed.charCodeAt(index), 16777619);
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822507);
    state = Math.imul(state ^ (state >>> 13), 3266489909);
    state ^= state >>> 16;
    return (state >>> 0) / 4294967296;
  };
}

/** Densifies hand-traced waypoints into smooth, GPS-like samples with a few metres of jitter. */
function traceRoute(seed: string, waypoints: Array<[number, number]>, stepsPerLeg = 8): ActivityCoordinate[] {
  const random = seededRandom(seed);
  const count = waypoints.length;
  const [firstLat, firstLng] = waypoints[0];
  const [lastLat, lastLng] = waypoints[count - 1];
  const closed = firstLat === lastLat && firstLng === lastLng;
  const at = (index: number) => {
    if (closed) return waypoints[((index % (count - 1)) + (count - 1)) % (count - 1)];
    return waypoints[Math.min(count - 1, Math.max(0, index))];
  };
  // Uniform Catmull-Rom spline through the waypoints.
  const spline = (a: number, b: number, c: number, d: number, t: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  const points: ActivityCoordinate[] = [];
  for (let leg = 0; leg < count - 1; leg += 1) {
    const p0 = at(leg - 1);
    const p1 = at(leg);
    const p2 = at(leg + 1);
    const p3 = at(leg + 2);
    for (let step = 0; step < stepsPerLeg; step += 1) {
      const t = step / stepsPerLeg;
      const jitter = leg === 0 && step === 0 ? 0 : 0.00004;
      points.push({
        lat: spline(p0[0], p1[0], p2[0], p3[0], t) + (random() - 0.5) * jitter,
        lng: spline(p0[1], p1[1], p2[1], p3[1], t) + (random() - 0.5) * jitter,
      });
    }
  }
  points.push({ lat: lastLat, lng: lastLng });
  return points;
}

const sampleAthletes = {
  marcus: { id: "sample-athlete-marcus", name: "Marcus Bell" },
  dev: { id: "sample-athlete-dev", name: "Dev Raman" },
  jordan: { id: "sample-athlete-jordan", name: "Jordan Okafor" },
  luis: { id: "sample-athlete-luis", name: "Luis Navarro" },
  sam: { id: "sample-athlete-sam", name: "Sam Whitaker" },
  theo: { id: "sample-athlete-theo", name: "Theo Park" },
} satisfies Record<string, ActivityAthlete>;

const hudsonGreenway = traceRoute("hudson-greenway", [
  [40.7713, -73.9938], [40.7748, -73.9912], [40.7786, -73.9886], [40.7826, -73.9858],
  [40.7867, -73.9831], [40.7905, -73.9806], [40.7944, -73.9787], [40.7983, -73.9765],
  [40.8021, -73.9742], [40.8054, -73.9718],
]);

const prospectParkLoop = traceRoute("prospect-park-loop", [
  [40.6726, -73.9699], [40.6699, -73.9737], [40.6664, -73.9762], [40.6621, -73.9773],
  [40.6580, -73.9752], [40.6552, -73.9711], [40.6556, -73.9663], [40.6584, -73.9632],
  [40.6628, -73.9622], [40.6671, -73.9637], [40.6706, -73.9664], [40.6726, -73.9699],
]);

const lakefrontRide = traceRoute("lakefront-ride", [
  [41.8662, -87.6127], [41.8759, -87.6149], [41.8864, -87.6135], [41.8957, -87.6141],
  [41.9054, -87.6248], [41.9152, -87.6314], [41.9251, -87.6327], [41.9349, -87.6355],
  [41.9452, -87.6378], [41.9551, -87.6402], [41.9650, -87.6452],
], 10);

const ladyBirdLake = traceRoute("lady-bird-lake", [
  [30.2636, -97.7520], [30.2652, -97.7470], [30.2645, -97.7410], [30.2621, -97.7355],
  [30.2597, -97.7301], [30.2581, -97.7340], [30.2598, -97.7405], [30.2614, -97.7462],
  [30.2622, -97.7512], [30.2636, -97.7520],
]);

const round2 = (value: number) => Math.round(value * 100) / 100;

export const sampleClubActivities: Activity[] = [
  {
    id: "sample-activity-tempo-hudson",
    athlete: sampleAthletes.marcus,
    type: "run",
    title: "Tempo Run",
    startedAt: "2026-11-09T06:42:00-05:00",
    timeZone: "America/New_York",
    source: "Garmin Forerunner 265",
    location: "Manhattan, New York",
    route: hudsonGreenway,
    distanceMi: round2(routeDistanceMi(hudsonGreenway)),
    durationSec: 1212,
    steps: 3980,
    kudos: [sampleAthletes.dev, sampleAthletes.jordan, sampleAthletes.sam],
    comments: [
      { id: "sample-comment-1", author: sampleAthletes.dev, body: "Strong negative split. Same route Thursday?", postedAt: "2026-11-09T08:05:00-05:00" },
    ],
    isSample: true,
  },
  {
    id: "sample-activity-walk-prospect",
    athlete: sampleAthletes.jordan,
    type: "walk",
    title: "Morning Walk",
    startedAt: "2026-11-08T07:15:00-05:00",
    timeZone: "America/New_York",
    source: "Apple Watch Series 10",
    location: "Brooklyn, New York",
    route: prospectParkLoop,
    distanceMi: round2(routeDistanceMi(prospectParkLoop)),
    durationSec: 3171,
    steps: 7140,
    kudos: [sampleAthletes.marcus, sampleAthletes.luis],
    comments: [],
    isSample: true,
  },
  {
    id: "sample-activity-ride-lakefront",
    athlete: sampleAthletes.luis,
    type: "ride",
    title: "Lakefront Ride Before Work",
    startedAt: "2026-11-07T06:05:00-06:00",
    timeZone: "America/Chicago",
    source: "Wahoo ELEMNT Bolt",
    location: "Chicago, Illinois",
    route: lakefrontRide,
    distanceMi: round2(routeDistanceMi(lakefrontRide)),
    durationSec: 1964,
    kudos: [sampleAthletes.theo],
    comments: [
      { id: "sample-comment-2", author: sampleAthletes.theo, body: "That headwind on the way north is no joke.", postedAt: "2026-11-07T09:30:00-06:00" },
      { id: "sample-comment-3", author: sampleAthletes.luis, body: "Worth it for the sunrise.", postedAt: "2026-11-07T09:41:00-06:00" },
    ],
    isSample: true,
  },
  {
    id: "sample-activity-strength",
    athlete: sampleAthletes.sam,
    type: "strength",
    title: "Upper-Body Strength",
    startedAt: "2026-11-06T18:30:00-05:00",
    timeZone: "America/New_York",
    source: "Logged in Hearst+",
    location: "Hoboken, New Jersey",
    durationSec: 2700,
    kudos: [],
    comments: [],
    isSample: true,
  },
];

/** Extra samples used by Storybook states. */
export const sampleLongTitleActivity: Activity = {
  id: "sample-activity-long-title",
  athlete: sampleAthletes.theo,
  type: "run",
  title: "Easy Recovery Run Around Lady Bird Lake After the Half-Marathon Weekend, Legs Still Complaining",
  startedAt: "2026-11-05T17:48:00-06:00",
  timeZone: "America/Chicago",
  source: "COROS PACE 3",
  location: "Austin, Texas",
  route: ladyBirdLake,
  distanceMi: round2(routeDistanceMi(ladyBirdLake)),
  durationSec: 1662,
  kudos: [sampleAthletes.marcus, sampleAthletes.dev, sampleAthletes.jordan, sampleAthletes.luis, sampleAthletes.sam],
  comments: [],
  isSample: true,
};
