import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Subdomain dev (e.g. admin.localhost) loading /_next/* from main origin
  allowedDevOrigins: [
    "http://admin.localhost",
    "http://admin.localhost:3000",
    "http://admin.localhost:3001",
    "http://localhost",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
