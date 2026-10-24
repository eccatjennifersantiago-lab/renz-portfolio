import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain HTML/CSS/JS site to `out/`,
  // ready for free static hosting (Cloudflare Pages, Netlify, GitHub Pages).
  output: "export",
  // No image server on static hosting; images in public/ are pre-sized instead.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
