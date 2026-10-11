import { NextResponse } from "next/server";

// Approximate reader location for the masthead weather line, from the connection rather than a browser prompt.
// Order: the host's edge geo headers (Netlify, Vercel), then an IP lookup, then the prototype default.
export const dynamic = "force-dynamic";

type ApproximateLocation = {
  city: string;
  latitude: number;
  longitude: number;
  source: "edge" | "ip" | "default";
};

const defaultLocation: ApproximateLocation = {
  city: "Mission Viejo",
  latitude: 33.6,
  longitude: -117.672,
  source: "default",
};
const lookupTimeoutMs = 2000;
const noStore = { "Cache-Control": "private, no-store" };

function fromNetlify(header: string | null): ApproximateLocation | null {
  if (!header) return null;
  try {
    const geo = JSON.parse(Buffer.from(header, "base64").toString("utf8"));
    const latitude = Number(geo?.latitude);
    const longitude = Number(geo?.longitude);
    if (!geo?.city || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { city: String(geo.city), latitude, longitude, source: "edge" };
  } catch {
    return null;
  }
}

function fromVercel(headers: Headers): ApproximateLocation | null {
  const city = headers.get("x-vercel-ip-city");
  const latitude = Number(headers.get("x-vercel-ip-latitude"));
  const longitude = Number(headers.get("x-vercel-ip-longitude"));
  if (!city || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { city: decodeURIComponent(city), latitude, longitude, source: "edge" };
}

function clientIp(headers: Headers) {
  const ip = headers.get("x-nf-client-connection-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip");
  // Local and private addresses carry no location; let the lookup use the server's own public address instead.
  if (!ip || /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fc|fd|fe80)/i.test(ip)) return "";
  return ip;
}

async function fromIpLookup(ip: string): Promise<ApproximateLocation | null> {
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,latitude,longitude`, {
      signal: AbortSignal.timeout(lookupTimeoutMs),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data?.success || !data.city || !Number.isFinite(data.latitude) || !Number.isFinite(data.longitude)) return null;
    return { city: String(data.city), latitude: Number(data.latitude), longitude: Number(data.longitude), source: "ip" };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const location =
    fromNetlify(request.headers.get("x-nf-geo")) ??
    fromVercel(request.headers) ??
    (await fromIpLookup(clientIp(request.headers))) ??
    defaultLocation;
  return NextResponse.json(location, { headers: noStore });
}
