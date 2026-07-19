import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify serves Storybook at `/storybook/` (trailing slash). Without this,
  // Next strips the slash (301 to `/storybook`) while Netlify adds it back → redirect loop.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hips.hearstapps.com" },
      { protocol: "https", hostname: "hips.hearstapps.net" },
      { protocol: "http", hostname: "*.h-cdn.co" },
      { protocol: "https", hostname: "*.h-cdn.co" },
      { protocol: "https", hostname: "bringatrailer.com", pathname: "/wp-content/**" },
    ],
  },
};

export default nextConfig;
