import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import { LEGACY_PREFIXES } from "@/lib/routing/routeSlugs";

/**
 * robots.txt.
 *
 * Chặn các tiền tố CŨ: `/products/<slug>`, `/case-study/<slug>`… giờ chỉ là
 * đích rewrite nội bộ hoặc URL cũ được 301, không phải địa chỉ để lập chỉ mục.
 * Không chặn thì bot vẫn bò vào và tự đi qua chuỗi chuyển hướng, tốn ngân sách
 * thu thập cho đúng những trang đã có mặt ở URL phẳng trong sitemap.
 *
 * Chặn ở mức `/<prefix>/` chứ không phải `/<prefix>`: bản thân `/products`,
 * `/services`, `/resources`, `/case-studies` là trang danh sách CÓ THẬT và phải
 * được lập chỉ mục.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...LEGACY_PREFIXES.map((p) => `/${p}/`), "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
