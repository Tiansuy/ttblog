import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'qsgrrctlxrcflzuzalpi.supabase.co',
      },
    ],
  },
};

export default nextConfig;
