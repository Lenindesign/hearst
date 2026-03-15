import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
      },
      {
        source: "/storybook/:path*",
        destination: "/storybook/:path*",
      },
    ];
  },
};

export default nextConfig;
