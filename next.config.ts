import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: process.env.SLLP_VISUAL_TEST === "1" ? false : undefined,
  // Allow images from external sources (e.g., user avatars from the backend)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
