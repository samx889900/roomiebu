import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses with gzip
  compress: true,

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
  },

  // Add caching headers for static assets
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Strict powered-by header removal
  poweredByHeader: false,
};

export default nextConfig;
