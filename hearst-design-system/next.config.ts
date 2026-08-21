import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify serves Storybook at `/storybook/` (trailing slash). Without this,
  // Next strips the slash (301 to `/storybook`) while Netlify adds it back → redirect loop.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hips.hearstapps.com" },
      { protocol: "https", hostname: "hips.hearstapps.net" },
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
    ],
  },
};

export default nextConfig;
