import { strapiClient } from "../api/strapi-client";
import { getMediaUrl } from "../api/media-url";
import { getRouteSlugs, resolveSlugOwner, type SlugKind } from "../routing/routeSlugs";
import { flattenInternalHref } from "../routing/routeSlugs";
import { decodeEntities } from "./articleSummary";
import { stripHtml, trimExcerpt } from "./textUtils";
import type { StrapiMedia } from "../types/strapi";

// ─── Khung CTA trong thân bài ───────────────────────────────────────────────

/** Một bản ghi `article-cta` bên strapi-cns. */
export interface ArticleCtaData {
  slug: string;
  variant: "light" | "heavy";
  heading: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

interface ArticleCtaRow {
  slug?: string | null;
  variant?: string | null;
  heading?: string | null;
  description?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

/**
 * Khung CTA mà bài đang chèn, theo slug. Slug không còn bản ghi (khung đã bị
 * xoá) thì đơn giản là không có trong map — `ArticleBody` bỏ qua, không vỡ bài.
 *
 * Bản CMS chưa deploy collection này thì endpoint trả 404 → map rỗng, y hệt.
 */
export async function fetchArticleCtas(slugs: string[]): Promise<Record<string, ArticleCtaData>> {
  if (slugs.length === 0) return {};
  const filters = slugs
    .map((s, i) => `filters[slug][$in][${i}]=${encodeURIComponent(s)}`)
    .join("&");
  const json = await strapiClient.get<{ data?: ArticleCtaRow[] }>(
    `/article-ctas?${filters}&pagination[pageSize]=100`,
    { revalidate: 3600, tags: ["strapi", "article-cta"] },
  );
  const out: Record<string, ArticleCtaData> = {};
  for (const row of json?.data ?? []) {
    if (!row.slug || !row.heading) continue;
    out[row.slug] = {
      slug: row.slug,
      variant: row.variant === "heavy" ? "heavy" : "light",
      heading: row.heading,
      description: row.description ?? "",
      buttonLabel: row.buttonLabel ?? "",
      buttonHref: flattenInternalHref(row.buttonUrl ?? ""),
    };
  }
  return out;
}

// ─── Popup xem trước link nội bộ ────────────────────────────────────────────

/** Nội dung popup của một link nội bộ. */
export interface LinkPreviewData {
  label: string;
  title: string;
  description: string;
  image: string | null;
}

interface SeoLite {
  metaTitle?: string | null;
  metaDescription?: string | null;
  shareImage?: StrapiMedia | null;
}

interface PreviewRow {
  title?: string | null;
  name?: string | null;
  excerpt?: string | null;
  description?: string | null;
  cardDescription?: string | null;
  featureImage?: StrapiMedia | null;
  cardImage?: StrapiMedia | null;
  categories?: { name?: string | null }[] | null;
  seo?: SeoLite | null;
}

const SEO_POPULATE =
  "populate[seo][fields][0]=metaTitle&populate[seo][fields][1]=metaDescription" +
  "&populate[seo][populate][shareImage][fields][0]=url";
const IMG = (field: string) => `populate[${field}][fields][0]=url&populate[${field}][fields][1]=formats`;

/** Truy vấn + nhãn cho từng loại trang ở gốc site. */
const KIND_QUERY: Partial<Record<SlugKind, { path: string; label: string; query: string }>> = {
  "blog-post": {
    path: "/blog-posts",
    label: "Blog",
    query: `fields[0]=title&fields[1]=excerpt&${IMG("featureImage")}&populate[categories][fields][0]=name&${SEO_POPULATE}`,
  },
  resource: {
    path: "/resources",
    label: "Resources",
    query: `fields[0]=title&${IMG("featureImage")}&${SEO_POPULATE}`,
  },
  product: {
    path: "/products",
    label: "Products",
    query: `fields[0]=title&fields[1]=cardDescription&${IMG("cardImage")}&${SEO_POPULATE}`,
  },
  service: {
    path: "/services",
    label: "Services",
    query: `fields[0]=title&fields[1]=cardDescription&${IMG("cardImage")}&${SEO_POPULATE}`,
  },
  "case-study": {
    path: "/case-studies",
    label: "Case Studies",
    query: `fields[0]=title&fields[1]=description&${IMG("featureImage")}&${SEO_POPULATE}`,
  },
  category: { path: "/categories", label: "Blog Category", query: `fields[0]=name&${SEO_POPULATE}` },
  "partner-category": {
    path: "/partner-categories",
    label: "Manufacturing Network",
    query: `fields[0]=name&${SEO_POPULATE}`,
  },
  "resource-type": { path: "/resource-types", label: "Free Resources", query: `fields[0]=name&${SEO_POPULATE}` },
};

/** Trang tĩnh → single type mang SEO của nó. */
const STATIC_PAGES: Record<string, { endpoint: string; label: string; tag: string }> = {
  "/": { endpoint: "/homepage", label: "Home", tag: "homepage" },
  "/about-us": { endpoint: "/about-us-page", label: "About Us", tag: "about-page" },
  "/products": { endpoint: "/products-page", label: "Products", tag: "products-page" },
  "/services": { endpoint: "/services-page", label: "Services", tag: "services-page" },
  "/process": { endpoint: "/process-page", label: "Process", tag: "process-page" },
  "/case-studies": { endpoint: "/case-studies-page", label: "Case Studies", tag: "case-studies-page" },
  "/resources": { endpoint: "/resources-page", label: "Resources", tag: "resources-page" },
  "/contact-us": { endpoint: "/contact-page", label: "Contact Us", tag: "contact-page" },
};

/** "Furniture Sourcing | China Sourcing Co" → "Furniture Sourcing". */
function cleanTitle(title: string): string {
  return decodeEntities(title)
    .replace(/\s+[|–—-]\s+(?:China\s*Sourcing|CNS)\b.*$/i, "")
    .trim();
}

function describe(text: string | null | undefined): string {
  return trimExcerpt(stripHtml(decodeEntities(text ?? "")), 140);
}

async function previewForStatic(page: { endpoint: string; label: string; tag: string }) {
  const json = await strapiClient.get<{ data?: { seo?: SeoLite | null } | null }>(
    `${page.endpoint}?fields[0]=id&${SEO_POPULATE}`,
    { revalidate: 3600, tags: ["strapi", page.tag] },
  );
  const seo = json?.data?.seo;
  if (!seo?.metaTitle && !seo?.metaDescription) return null;
  return {
    label: page.label,
    title: cleanTitle(seo?.metaTitle ?? page.label) || page.label,
    description: describe(seo?.metaDescription),
    image: getMediaUrl(seo?.shareImage),
  } satisfies LinkPreviewData;
}

async function previewForSlug(kind: SlugKind, slug: string): Promise<LinkPreviewData | null> {
  const spec = KIND_QUERY[kind];
  if (!spec) return null;
  const json = await strapiClient.get<{ data?: PreviewRow[] }>(
    `${spec.path}?filters[slug][$eq]=${encodeURIComponent(slug)}&${spec.query}&pagination[pageSize]=1`,
    { revalidate: 3600, tags: ["strapi", kind, `${kind}:${slug}`] },
  );
  const row = json?.data?.[0];
  if (!row) return null;
  const title = row.title ?? row.name ?? row.seo?.metaTitle ?? "";
  if (!title) return null;
  const image = row.featureImage ?? row.cardImage ?? row.seo?.shareImage ?? null;
  return {
    label: (kind === "blog-post" && row.categories?.[0]?.name) || spec.label,
    title: cleanTitle(title),
    description: describe(row.excerpt || row.cardDescription || row.description || row.seo?.metaDescription),
    image: getMediaUrl(image, "small") ?? getMediaUrl(image),
  };
}

/**
 * Dữ liệu popup cho mọi link nội bộ trong bài, theo key đường dẫn
 * (`/quality-control`). Tự lấy từ chính trang đích — không có field CMS nào phải
 * điền tay. Link không phân giải được (trang không tồn tại, đường dẫn nhiều cấp)
 * thì không có popup, link vẫn là link.
 */
export async function buildLinkPreviews(keys: string[]): Promise<Record<string, LinkPreviewData>> {
  if (keys.length === 0) return {};
  const table = await getRouteSlugs();
  const entries = await Promise.all(
    keys.map(async (key) => {
      try {
        const page = STATIC_PAGES[key];
        if (page) return [key, await previewForStatic(page)] as const;
        const segments = key.split("/").filter(Boolean);
        if (segments.length !== 1) return [key, null] as const;
        const kind = resolveSlugOwner(table, segments[0]);
        return [key, kind ? await previewForSlug(kind, segments[0]) : null] as const;
      } catch {
        return [key, null] as const;
      }
    }),
  );
  const out: Record<string, LinkPreviewData> = {};
  for (const [key, data] of entries) if (data) out[key] = data;
  return out;
}
