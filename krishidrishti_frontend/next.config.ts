import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["jspdf", "jspdf-autotable"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
