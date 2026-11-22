import type { NextConfig } from "next";
import { remoteImagePatterns } from "./src/lib/remote-image-patterns";

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
      // The specs System chapter reads vault files and counts repo files from process.cwd() at build time, which makes
      // tracing pull in the whole app folder. /specs is static, so none of these are needed at runtime.
      "./output/**/*",
      "./tests/**/*",
      "./.agents/**/*",
      "./tsconfig.tsbuildinfo",
    ],
    // The same build-time reads also reach src/, tokens/ and the vault files at the app root. /specs is prerendered and
    // only needs public/logos (tokens chapter) at runtime, so keep the rest of the app folder out of its trace.
    "/specs": [
      "./src/**/*",
      "./tokens/**/*",
      "./scripts/**/*",
      "./reports/**/*",
      "./notes/**/*",
      "./docs/**/*",
      "./AIDLC-docs/**/*",
      "./vault-assets/**/*",
      "./*.md",
      "./*.pen",
      "./*.json",
      "./*.ts",
      "./*.mjs",
    ],
  },
  images: {
    remotePatterns: remoteImagePatterns,
  },
};

export default nextConfig;
