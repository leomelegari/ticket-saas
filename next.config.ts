import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "fortunate-ibis-629.convex.cloud", protocol: "https" },
      { hostname: "zealous-dotterel-237.convex.cloud", protocol: "https" },
    ],
  },
};

export default nextConfig;
