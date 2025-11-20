import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    domains: [
      "localhost",
      "127.0.0.1",
      // Add your production domains here
      // "example.com",
      // "cdn.example.com",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      // Add your production patterns here
      // {
      //   protocol: "https",
      //   hostname: "cdn.example.com",
      //   pathname: "/storage/**",
      // },
    ],
  },
};

export default nextConfig;
