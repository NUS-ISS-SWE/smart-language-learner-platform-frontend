import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
