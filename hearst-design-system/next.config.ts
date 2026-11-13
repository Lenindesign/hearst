import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify serves Storybook at `/storybook/` (trailing slash). Without this,
  // Next strips the slash (301 to `/storybook`) while Netlify adds it back → redirect loop.
  trailingSlash: true,
  // Old spec URLs open the single specifications page at their chapter (netlify.toml has the same list).
  async redirects() {
    return [
      { source: "/cta-specs", destination: "/specs/#cta", permanent: true },
      { source: "/layout-specs", destination: "/specs/#layout", permanent: true },
      { source: "/type-specs", destination: "/specs/#type", permanent: true },
      { source: "/token-specs", destination: "/specs/#tokens", permanent: true },
      { source: "/specs/blocks-spec.html", destination: "/specs/#blocks", permanent: true },
      { source: "/specs/nav-spec.html", destination: "/specs/#nav", permanent: true },
      { source: "/specs/reader-spec.html", destination: "/specs/#reader", permanent: true },
      { source: "/specs/carousel-spec.html", destination: "/specs/#carousel", permanent: true },
      { source: "/specs/system-spec.html", destination: "/specs/#system", permanent: true },
    ];
  },
  // The tokens chapter of /specs reads logo SVGs with a dynamic public/ path, so file tracing pulls the whole public folder
  // (spec films, images, video fixtures) into the Netlify server function and pushes it past the AWS Lambda
  // size limit. The server only needs public/logos at runtime; everything else is served from the CDN.
  outputFileTracingExcludes: {
    "*": [
      "./public/specs/**/*",
      "./public/images/**/*",
      "./public/figma-exports/**/*",
      "./public/**/*.mp4",
      "./public/**/*.webm",
    ],
  },
  images: {
    remotePatterns: [
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
    ],
  },
};

export default nextConfig;
