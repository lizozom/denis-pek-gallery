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
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.ggpht.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: '**.googleusercontent.com',
      },
      // Vercel Blob storage (for future image uploads)
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      // Allow any HTTPS image for maximum flexibility
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    qualities: [75, 85, 90],
    // Increase timeout for slower image sources
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
