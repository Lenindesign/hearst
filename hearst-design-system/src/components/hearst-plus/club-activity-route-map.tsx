"use client";

/**
 * Non-interactive route map for club activity cards.
 *
 * With `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` configured it renders a Google Static Maps image with the
 * route drawn as an encoded polyline. Without a key (the prototype default), or if the image fails,
 * it draws a keyless, illustrative SVG basemap around the route so cards still read as maps without
 * loading third-party tiles. This module is loaded lazily by `ClubActivityCard`, whose figure caption
 * carries the text summary (`describeActivityRoute`), so the drawing itself is decorative.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  encodePolyline,
  isLoopRoute,
  seededRandom,
  type Activity,
  type ActivityCoordinate,
} from "@/components/hearst-plus/club-activity-model";

const MAP_WIDTH = 640;
const MAP_HEIGHT = 320;
const PADDING = 40;

/* Map palette: neutral cartography colors, kept separate from brand tokens like real basemaps. */
const mapColors = {
  land: "#EEEDE7",
  park: "#CFE5C2",
  parkEdge: "#BBD9AB",
  water: "#AAD3DF",
  road: "#FFFFFF",
  roadCasing: "#DCDAD1",
};

type Point = { x: number; y: number };

function projectRoute(route: ActivityCoordinate[]): Point[] {
  const midLat = route.reduce((sum, point) => sum + point.lat, 0) / route.length;
  const scaleX = Math.cos((midLat * Math.PI) / 180);
  const raw = route.map((point) => ({ x: point.lng * scaleX, y: -point.lat }));
  const xs = raw.map((point) => point.x);
  const ys = raw.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(Math.max(...xs) - minX, 1e-9);
  const spanY = Math.max(Math.max(...ys) - minY, 1e-9);
  const scale = Math.min((MAP_WIDTH - PADDING * 2) / spanX, (MAP_HEIGHT - PADDING * 2) / spanY);
  const offsetX = (MAP_WIDTH - spanX * scale) / 2;
  const offsetY = (MAP_HEIGHT - spanY * scale) / 2;
  return raw.map((point) => ({ x: offsetX + (point.x - minX) * scale, y: offsetY + (point.y - minY) * scale }));
}

const toPoints = (points: Point[]) => points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");

/** Smooth path through points using midpoint quadratic curves. */
function smoothPath(points: Point[]) {
  if (points.length < 3) return `M${toPoints(points).replace(/ /g, " L")}`;
  let path = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const mid = { x: (points[index].x + points[index + 1].x) / 2, y: (points[index].y + points[index + 1].y) / 2 };
    path += ` Q${points[index].x.toFixed(1)},${points[index].y.toFixed(1)} ${mid.x.toFixed(1)},${mid.y.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  return `${path} L${last.x.toFixed(1)},${last.y.toFixed(1)}`;
}

function downsample(points: Point[], count: number) {
  if (points.length <= count) return points;
  return Array.from({ length: count }, (_, index) => points[Math.round((index * (points.length - 1)) / (count - 1))]);
}

function RoadGrid({ angle, seed }: { angle: number; seed: string }) {
  const random = seededRandom(`${seed}-roads`);
  const diagonal = Math.hypot(MAP_WIDTH, MAP_HEIGHT);
  const families = [
    { rotate: angle, spacing: 52 + random() * 22, offset: random() * 40 },
    { rotate: angle + 90, spacing: 78 + random() * 30, offset: random() * 50 },
  ];
  return (
    <g>
      {families.map((family, familyIndex) => {
        const lines: number[] = [];
        for (let position = -diagonal / 2 + family.offset; position < diagonal / 2; position += family.spacing) lines.push(position);
        return (
          <g key={familyIndex} transform={`rotate(${family.rotate.toFixed(1)} ${MAP_WIDTH / 2} ${MAP_HEIGHT / 2})`}>
            {lines.map((position, index) => {
              const major = index % 3 === 1;
              const y = MAP_HEIGHT / 2 + position;
              return (
                <g key={index}>
                  <line x1={MAP_WIDTH / 2 - diagonal} x2={MAP_WIDTH / 2 + diagonal} y1={y} y2={y} stroke={mapColors.roadCasing} strokeWidth={major ? 8 : 4.5} />
                  <line x1={MAP_WIDTH / 2 - diagonal} x2={MAP_WIDTH / 2 + diagonal} y1={y} y2={y} stroke={mapColors.road} strokeWidth={major ? 6 : 3} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function IllustrativeRouteMap({ activity, route, className }: { activity: Activity; route: ActivityCoordinate[]; className?: string }) {
  const points = React.useMemo(() => projectRoute(route), [route]);
  // A fresh generator per render keeps the generated basemap identical on server and client.
  const random = seededRandom(activity.id);
  const loop = isLoopRoute(route);
  const first = points[0];
  const last = points[points.length - 1];
  const clipId = `activity-map-clip-${activity.id}`;

  // Basemap features are generated around the route, so they always agree with it.
  const axis = loop
    ? { x: 1, y: 0 }
    : (() => {
        const length = Math.hypot(last.x - first.x, last.y - first.y) || 1;
        return { x: (last.x - first.x) / length, y: (last.y - first.y) / length };
      })();
  const axisAngle = (Math.atan2(axis.y, axis.x) * 180) / Math.PI;
  const roadAngle = axisAngle + 90 + (random() - 0.5) * 24;
  const side = random() > 0.5 ? 1 : -1;
  const normal = { x: -axis.y * side, y: axis.x * side };

  let water: React.ReactNode;
  let park: React.ReactNode;
  if (loop) {
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const rx = (Math.max(...xs) - Math.min(...xs)) * (0.14 + random() * 0.08);
    const ry = (Math.max(...ys) - Math.min(...ys)) * (0.12 + random() * 0.08);
    park = (
      <polygon points={toPoints(points)} fill={mapColors.park} stroke={mapColors.park} strokeWidth={44} strokeLinejoin="round" />
    );
    water = (
      <ellipse
        cx={cx + (random() - 0.5) * rx}
        cy={cy + ry * (0.4 + random() * 0.4)}
        rx={rx}
        ry={ry}
        fill={mapColors.water}
        transform={`rotate(${((random() - 0.5) * 50).toFixed(1)} ${cx} ${cy})`}
      />
    );
  } else {
    const spine = downsample(points, 9);
    const extend = (point: Point, direction: number) => ({ x: point.x + axis.x * 700 * direction, y: point.y + axis.y * 700 * direction });
    const offset = (distance: number) => [extend(spine[0], -1), ...spine, extend(spine[spine.length - 1], 1)]
      .map((point) => ({ x: point.x + normal.x * distance, y: point.y + normal.y * distance }));
    park = <path d={smoothPath(offset(14))} fill="none" stroke={mapColors.park} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />;
    water = <path d={smoothPath(offset(70))} fill="none" stroke={mapColors.water} strokeWidth={84} strokeLinecap="round" strokeLinejoin="round" />;
  }

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className={cn("block size-full", className)}
      focusable="false"
    >
      <clipPath id={clipId}>
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={mapColors.land} />
        <RoadGrid angle={roadAngle} seed={activity.id} />
        {park}
        {water}
        <polyline points={toPoints(points)} fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={toPoints(points)} fill="none" stroke="var(--map-route)" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={first.x} cy={first.y} r={6} fill="#FFFFFF" stroke="var(--map-route)" strokeWidth={3} />
        {loop ? null : <circle cx={last.x} cy={last.y} r={6} fill="var(--map-route)" stroke="#FFFFFF" strokeWidth={2.5} />}
      </g>
    </svg>
  );
}

const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function googleStaticMapUrl(route: ActivityCoordinate[], key: string, routeColor: string) {
  // Keep URLs well under the 8,192-character Static Maps limit.
  const step = Math.max(1, Math.ceil(route.length / 120));
  const sampled = route.filter((_, index) => index % step === 0 || index === route.length - 1);
  const params = new URLSearchParams({
    size: `${MAP_WIDTH}x${MAP_HEIGHT}`,
    scale: "2",
    maptype: "roadmap",
    key,
  });
  params.append("style", "feature:poi|element:labels|visibility:off");
  params.append("style", "feature:transit|visibility:off");
  params.append("path", `color:0x${routeColor}ff|weight:4|enc:${encodePolyline(sampled)}`);
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

export type ClubActivityRouteMapProps = {
  activity: Activity;
  className?: string;
  /** Route color for the Google image, as six hex digits. The SVG fallback uses the brand primary. */
  googleRouteColor?: string;
  /** Force the keyless map, for Storybook and tests. */
  forceIllustrative?: boolean;
};

export default function ClubActivityRouteMap({ activity, className, googleRouteColor = "D2232E", forceIllustrative = false }: ClubActivityRouteMapProps) {
  const [googleFailed, setGoogleFailed] = React.useState(false);
  const route = activity.route;
  if (!route || route.length < 2) return null;

  if (googleMapsKey && !forceIllustrative && !googleFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a signed third-party static image, not a Next image asset.
      <img
        src={googleStaticMapUrl(route, googleMapsKey, googleRouteColor)}
        alt=""
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setGoogleFailed(true)}
        className={cn("block size-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn("relative size-full", className)}
      data-map-kind="illustrative"
      // The route uses the publication's identity color (Men's Health red), not the darker UI primary.
      style={{ "--map-route": "var(--brand-primary, var(--primary))" } as React.CSSProperties}
    >
      <IllustrativeRouteMap activity={activity} route={route} />
      <span className="absolute right-1.5 bottom-1.5 rounded-[3px] bg-white/80 px-1.5 py-0.5 text-[10px] leading-3 text-[#4a4a44]" aria-hidden>
        Illustrative map
      </span>
    </div>
  );
}
