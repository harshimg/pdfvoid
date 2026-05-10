import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  serverExternalPackages: ["sharp", "@napi-rs/canvas"],
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
