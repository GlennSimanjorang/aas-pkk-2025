import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
  allowedDevOrigins: [
    "http://localhost:3001",
    "http://192.168.1.8:3001", 
  ],

};

export default nextConfig;
