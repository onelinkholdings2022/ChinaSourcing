import type { Metadata } from "next";
import { getMediaUrl } from "../api/media-url";
import type { StrapiSeo } from "../types/strapi";

// ─── SEO — đọc HẾT component `shared.seo` của CMS ────────────────────────────
//
// `shared.seo` có sáu field và trước đây code chỉ dùng hai (`metaTitle`,
// `metaDescription`); bốn field còn lại nhập vào CMS xong là rơi vào hư không.
// Ở đây dùng đủ cả sáu:
//
//   metaTitle       -> <title>, og:title, twitter:title
//   metaDescription -> <meta description>, og:description, twitter:description
//   keywords        -> <meta keywords>  (chuỗi phân tách bằng dấu phẩy/xuống dòng)
//   shareImage      -> og:image, twitter:image
//   canonicalURL    -> <link rel=canonical>  (mặc định là URL phẳng của trang)
//   structuredData  -> <script type="application/ld+json">
//
// Ba tầng, tầng dưới chỉ đỡ khi tầng trên rỗng:
//   1. `seo` của chính bản ghi / trang đó
//   2. `global.defaultSeo`
//   3. `fallback` dựng TỪ NỘI DUNG CMS (tiêu đề bài, heading của trang) —
//      không phải chuỗi ghi cứng trong code.
//
// Tầng 3 tồn tại vì một trang không có <title> thì còn tệ hơn một <title> suy ra
// từ nội dung. Điền `seo` bên CMS là nó tự nhường chỗ.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://chinasourcing.co").replace(
  /\/$/,
  "",
);

/**
 * Strapi trả component single là object, nhưng vài bản dữ liệu cũ trả MẢNG.
 * Mọi nơi đọc `seo` phải đi qua đây.
 */
function first(seo?: StrapiSeo | StrapiSeo[] | null): StrapiSeo | null {
  if (!seo) return null;
  return Array.isArray(seo) ? seo[0] ?? null : seo;
}

function text(v?: string | null): string | undefined {
  const t = (v ?? "").trim();
  return t || undefined;
}

/** `"a, b\nc"` → `["a","b","c"]`. `<meta keywords>` của Next nhận mảng. */
function splitKeywords(raw?: string | null): string[] | undefined {
  const list = (raw ?? "")
    .split(/[,\n]/)
    .map((k) => k.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

/** URL tuyệt đối cho một path nội bộ. `canonicalURL` của CMS thắng nếu có. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`.replace(/\/$/, "") || SITE_URL;
}

export interface SeoFallback {
  /** Dựng từ nội dung CMS — tiêu đề bài, heading của trang. */
  title: string;
  description?: string | null;
  /** Ảnh đại diện của chính bản ghi (featureImage, heroImage…). */
  image?: string | null;
  /** Path phẳng của trang, vd `/incoterms-explained`. */
  path?: string;
  /** `article` cho trang bài viết, `website` cho phần còn lại. */
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
}

/**
 * Metadata cho một trang bất kỳ.
 *
 * `pageSeo` là `seo` của chính trang/bản ghi; `siteSeo` là `global.defaultSeo`.
 * Truyền cả hai ở mọi trang — tầng site chỉ đỡ đúng những field trang bỏ trống.
 */
export function buildMetadata(
  pageSeo: StrapiSeo | StrapiSeo[] | null | undefined,
  siteSeo: StrapiSeo | StrapiSeo[] | null | undefined,
  fallback: SeoFallback,
): Metadata {
  const page = first(pageSeo);
  const site = first(siteSeo);

  const title = text(page?.metaTitle) ?? text(site?.metaTitle) ?? fallback.title;
  const description =
    text(page?.metaDescription) ?? text(fallback.description) ?? text(site?.metaDescription);
  const keywords = splitKeywords(page?.keywords) ?? splitKeywords(site?.keywords);

  const image =
    getMediaUrl(page?.shareImage) ?? text(fallback.image) ?? getMediaUrl(site?.shareImage);

  // Canonical: `canonicalURL` của CMS thắng, nếu không thì URL phẳng của trang.
  // KHÔNG lấy `canonicalURL` của global làm dự phòng — đó sẽ là cùng một địa chỉ
  // cho mọi trang, tức tự tay gộp cả site về một URL trong mắt Google.
  const canonical = text(page?.canonicalURL) ?? (fallback.path ? absoluteUrl(fallback.path) : undefined);

  const meta: Metadata = {
    // `absolute` để `title.template` của layout gốc không nối thêm hậu tố vào
    // chuỗi CMS đã viết sẵn đủ.
    title: { absolute: title },
    description,
    keywords,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      siteName: "China Sourcing Co",
      type: fallback.type ?? "website",
      ...(canonical ? { url: canonical } : {}),
      title,
      description,
      ...(fallback.publishedTime ? { publishedTime: fallback.publishedTime } : {}),
      ...(fallback.modifiedTime ? { modifiedTime: fallback.modifiedTime } : {}),
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };

  return meta;
}

/**
 * `structuredData` (field `json` của `shared.seo`) → chuỗi cho
 * `<script type="application/ld+json">`.
 *
 * Trả `null` khi CMS bỏ trống, nên trang chỉ render thẻ script khi thật sự có
 * dữ liệu. Escape `<` để một chuỗi chứa `</script>` không thoát ra khỏi thẻ.
 */
export function jsonLd(
  pageSeo: StrapiSeo | StrapiSeo[] | null | undefined,
  siteSeo?: StrapiSeo | StrapiSeo[] | null | undefined,
): string | null {
  const data = first(pageSeo)?.structuredData ?? first(siteSeo)?.structuredData;
  if (!data || (typeof data === "object" && Object.keys(data as object).length === 0)) return null;
  try {
    return JSON.stringify(data).replace(/</g, "\\u003c");
  } catch {
    return null;
  }
}
