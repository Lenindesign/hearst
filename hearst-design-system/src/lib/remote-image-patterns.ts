/**
 * Image hosts the Next.js image optimizer may resize. `next.config.ts` reads this list, so a host added here
 * is both allowed by next/image and reported as optimizable by `canOptimizeImageSrc`.
 */
export type RemoteImagePattern = {
  protocol: "http" | "https";
  hostname: string;
  pathname?: string;
};

export const remoteImagePatterns: RemoteImagePattern[] = [
  { protocol: "https", hostname: "hips.hearstapps.com" },
  { protocol: "https", hostname: "hips.hearstapps.net" },
  { protocol: "https", hostname: "www.goodhousekeepinglive.co.uk" },
  { protocol: "https", hostname: "images.squarespace-cdn.com" },
  { protocol: "https", hostname: "hips.hearstchina.com" },
  { protocol: "http", hostname: "*.h-cdn.co" },
  { protocol: "https", hostname: "*.h-cdn.co" },
  { protocol: "https", hostname: "kubrick.htvapps.com", pathname: "/htv-prod-media.s3.amazonaws.com/**" },
  { protocol: "https", hostname: "bringatrailer.com", pathname: "/wp-content/**" },
  { protocol: "https", hostname: "cropper.watch.aetnd.com", pathname: "/cdn.watch.aetnd.com/**" },
  { protocol: "https", hostname: "*.hdnux.com" },
  { protocol: "https", hostname: "s.hdnux.com" },
  { protocol: "https", hostname: "*.sfgate.com" },
  { protocol: "https", hostname: "www.sfgate.com" },
  { protocol: "https", hostname: "*.chron.com" },
  { protocol: "https", hostname: "www.chron.com" },
  { protocol: "https", hostname: "*.mysanantonio.com" },
  { protocol: "https", hostname: "www.mysanantonio.com" },
  { protocol: "https", hostname: "*.timesunion.com" },
  { protocol: "https", hostname: "www.timesunion.com" },
  { protocol: "https", hostname: "*.expressnews.com" },
  { protocol: "https", hostname: "www.expressnews.com" },
  { protocol: "https", hostname: "*.sfchronicle.com" },
  { protocol: "https", hostname: "www.sfchronicle.com" },
  { protocol: "https", hostname: "*.ctinsider.com" },
  { protocol: "https", hostname: "www.ctinsider.com" },
];

function hostnameMatches(pattern: string, hostname: string) {
  // next/image: "*." matches one subdomain level, "**." any number.
  if (pattern.startsWith("**.")) return hostname.endsWith(pattern.slice(2));
  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(1);
    return hostname.endsWith(suffix) && !hostname.slice(0, -suffix.length).includes(".");
  }
  return hostname === pattern;
}

function pathnameMatches(pattern: string | undefined, pathname: string) {
  if (!pattern) return true;
  if (pattern.endsWith("/**")) return pathname.startsWith(pattern.slice(0, -2));
  return pathname === pattern;
}

/**
 * True when next/image can resize `src`: a local path, or a remote URL on an allowed host.
 * Use it to keep `unoptimized` only for images the optimizer would refuse, so small thumbnails
 * stop downloading full-size originals.
 */
export function canOptimizeImageSrc(src: string | undefined | null) {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    const protocol = url.protocol.replace(":", "");
    return remoteImagePatterns.some(
      (pattern) =>
        pattern.protocol === protocol &&
        hostnameMatches(pattern.hostname, url.hostname) &&
        pathnameMatches(pattern.pathname, url.pathname),
    );
  } catch {
    return false;
  }
}
