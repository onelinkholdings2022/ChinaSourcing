import type { NextConfig } from "next";

/**
 * The original's detail URLs are singular (`/case-study/<slug>`) while its
 * listing URLs are plural (`/case-studies`). Keeping both as route folders
 * meant two directories per content type for what is one section of the site,
 * so each detail route now lives inside its listing folder
 * (`app/case-studies/[slug]`) and these rewrites map the original URL onto it.
 *
 * Rewrites, not redirects: the address bar keeps showing the URL the original
 * publishes, so inbound links, the sitemap and anything already indexed all
 * still resolve to exactly the same address.
 */
const SECTIONS = [
  ["case-study", "case-studies"],
  ["product", "products"],
  ["service", "services"],
  ["resource", "resources"],
] as const;

const nextConfig: NextConfig = {
  async rewrites() {
    return SECTIONS.map(([singular, plural]) => ({
      source: `/${singular}/:slug`,
      destination: `/${plural}/:slug`,
    }));
  },
  images: {
    // Ảnh động đến từ strapi-cns (Media Library, local upload provider).
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "1337" },
    ],
    // Strapi local chạy trên loopback — Next chặn mặc định vì lo SSRF. An toàn
    // ở dev vì host bị chặn cũng chỉ có thể là localhost:1337 (đã whitelist ở
    // trên); khi deploy thật, NEXT_PUBLIC_STRAPI_URL trỏ sang domain thật nên
    // cờ này không còn tác dụng.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
