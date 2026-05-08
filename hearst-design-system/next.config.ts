import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify serves Storybook at `/storybook/` (trailing slash). Without this,
  // Next strips the slash (301 to `/storybook`) while Netlify adds it back → redirect loop.
  trailingSlash: true,
};

export default nextConfig;
