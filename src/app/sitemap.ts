import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import { getRouteSlugs, SLUG_KINDS } from "@/lib/routing/routeSlugs";

export const revalidate = 3600;

/** Trang danh sách — path cố định, là những thứ trong `KNOWN_EXACT` của proxy. */
const LISTING_PATHS = [
  "/",
  "/about-us",
  "/products",
  "/services",
  "/process",
  "/case-studies",
  "/resources",
  "/contact-us",
  "/privacy-policy",
];

/**
 * Sitemap, toàn bộ ở URL PHẲNG.
 *
 * Đây là điểm dễ sai nhất sau khi chuyển sang URL phẳng: khai `/products/<slug>`
 * ở đây là tự tay đưa Google vào một địa chỉ mà chính proxy sẽ 301 đi chỗ khác —
 * mỗi lần thu thập là một cú nhảy thừa, và canonical thì lại trỏ về bản phẳng.
 * Nên sitemap dựng từ đúng cái bảng mà proxy dùng để phân giải.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const table = await getRouteSlugs();

  const listings = LISTING_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "weekly" as const,
    // Trang pháp lý là chân trang, không phải một mục của site — không đặt
    // ngang hàng 0.8 với các trang danh sách.
    priority: path === "/" ? 1 : path === "/privacy-policy" ? 0.3 : 0.8,
  }));

  // Một slug chỉ được xuất hiện MỘT lần, kể cả khi hai loại cùng mang nó
  // (`freight-logistics` là service lẫn category; `point-of-sale` là product
  // lẫn partner category, và ba slug nữa như thế). Chủ sở hữu do thứ tự trong
  // `SLUG_KINDS` quyết định — cùng thứ tự proxy dùng, nên URL trong sitemap
  // luôn là trang thật sự được phục vụ.
  const seen = new Set<string>();
  const details: MetadataRoute.Sitemap = [];
  for (const kind of SLUG_KINDS) {
    for (const slug of table[kind]) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      details.push({
        url: `${SITE_URL}/${slug}`,
        changeFrequency: kind === "blog-post" ? "monthly" : "weekly",
        // Trang lọc (category blog, partner category, loại download) là bản
        // cắt lát của một trang listing, không phải nội dung riêng — cùng mức
        // với bài blog, dưới các trang chi tiết thật.
        priority:
          kind === "blog-post" || kind === "category" || kind === "partner-category" || kind === "resource-type"
            ? 0.5
            : 0.7,
      });
    }
  }

  return [...listings, ...details];
}
