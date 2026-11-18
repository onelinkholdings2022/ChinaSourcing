import { getMediaUrl } from "../api/media-url";
import { stripHtml, estimateReadTime, formatDate, withTocAnchors, fixContentImageAlts, resolveContentMedia } from "./textUtils";
import { summarizeArticle } from "./articleSummary";
import { addFaqDividers, stripInlineTypography, decorateLinks, splitArticleBlocks, type ArticleBlock } from "./articleContent";
import { fetchArticleCtas, buildLinkPreviews, type ArticleCtaData, type LinkPreviewData } from "./articleExtras";
import type { Resource } from "../types/resource";
import type { BlogPost } from "../types/blog-post";
import type { ResourceSettingData } from "../types/resources-page";
import type { BlogCardData } from "@/components/sections/resources/BlogCard";

const FALLBACK_IMAGE = "/images/blog-fallback.png";
const RELATED_COUNT = 3;
const SITE = "https://chinasourcing.co";

/**
 * Dữ liệu trang bài viết — 12 resource + mọi blog post dùng chung một khuôn.
 *
 * Bố cục theo thiết kế "CNS Blog Layout Redesign" (v2): hero canh giữa (tag
 * category → H1 → ô Category/Published/Reading Time → ô Summary → ảnh), thân bài
 * ba cột (mục lục dính bên trái, bài 720px, cột phải trống), cuối trang là dải
 * bài liên quan.
 */
export interface ArticleViewData {
  title: string;
  /** Category đầu tiên của bài — pill trên H1 và ô "Category". */
  category: string;
  /** `26/10/2026` — ô "Published" ở desktop. */
  publishedShort: string;
  /** `26 Oct 2026` — dòng meta ở mobile. */
  publishedLong: string;
  readingTime: string;
  featuredImage: string | null;
  featuredAlt: string;
  /** Rỗng khi thân bài chưa có đoạn nào đáng kể — lúc đó không dựng ô Summary. */
  summary: string;
  toc: { href: string; label: string }[];
  /** Thân bài đã tách: khúc HTML xen kẽ khung CTA, đúng thứ tự trong CKEditor. */
  blocks: ArticleBlock[];
  ctas: Record<string, ArticleCtaData>;
  /** Popup xem trước của link nội bộ, theo key đường dẫn (`/quality-control`). */
  previews: Record<string, LinkPreviewData>;
  shareUrl: string;
  /** Công tắc khoá bài — `resource.gated` / `blog-post.gated` bên CMS, logic cũ giữ nguyên. */
  gated: boolean;
  subscribe: { tag: string; heading: string; body: string };
  related: { tag: string; heading: string; cards: BlogCardData[] };
}

function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function buildSubscribe(settings: ResourceSettingData | null) {
  const lc = settings?.leadCapture;
  return {
    tag: lc?.tag?.label ?? "",
    heading: lc?.heading ?? "",
    body: lc?.subheading ?? "",
  };
}

function buildRelatedMeta(settings: ResourceSettingData | null) {
  return {
    tag: settings?.relatedResourcesTag?.label || "Free Resources",
    heading: settings?.relatedResourcesHeading || "Explore More Related Resources",
  };
}

/** Phần bất đồng bộ dùng chung: khung CTA + popup link. */
async function buildBody(content: string | null | undefined, title: string) {
  const anchored = withTocAnchors(content);
  const html = fixContentImageAlts(resolveContentMedia(anchored.html), title);
  const linked = decorateLinks(addFaqDividers(stripInlineTypography(html)));
  const { blocks, ctaSlugs } = splitArticleBlocks(linked.html);
  const [ctas, previews] = await Promise.all([
    fetchArticleCtas(ctaSlugs),
    buildLinkPreviews(linked.internal),
  ]);
  return { toc: anchored.toc, blocks, ctas, previews };
}

export async function buildResourceArticleView(
  resource: Resource,
  settings: ResourceSettingData | null,
  related: Resource[]
): Promise<ArticleViewData> {
  const date = resource.publishedDate ?? resource.publishedAt;
  return {
    title: resource.title,
    category: resource.categories[0]?.name ?? resource.type?.name ?? resource.resourceType,
    publishedShort: formatDate(date),
    publishedLong: formatLongDate(date),
    readingTime: resource.readingTime ?? estimateReadTime(resource.content),
    featuredImage: getMediaUrl(resource.featureImage) ?? FALLBACK_IMAGE,
    featuredAlt: resource.featureImage?.alternativeText || resource.title,
    summary: summarizeArticle(resource.content),
    ...(await buildBody(resource.content, resource.title)),
    shareUrl: `${SITE}/${resource.slug}`,
    gated: resource.gated,
    subscribe: buildSubscribe(settings),
    related: {
      ...buildRelatedMeta(settings),
      cards: related
        .filter((r) => r.slug !== resource.slug)
        .slice(0, RELATED_COUNT)
        .map((r) => ({
          category: r.categories[0]?.name ?? null,
          title: r.title,
          excerpt: stripHtml(r.content),
          date: formatDate(r.publishedDate ?? r.publishedAt),
          readingTime: r.readingTime ?? estimateReadTime(r.content),
          image: getMediaUrl(r.featureImage) ?? FALLBACK_IMAGE,
          alt: r.title,
          href: `/${r.slug}`,
        })),
    },
  };
}

export async function buildBlogPostArticleView(
  post: BlogPost,
  settings: ResourceSettingData | null,
  related: BlogPost[]
): Promise<ArticleViewData> {
  return {
    title: post.title,
    category: post.categories?.[0]?.name ?? "Blog",
    publishedShort: formatDate(post.publishedDate),
    publishedLong: formatLongDate(post.publishedDate),
    readingTime: post.readingTime ?? estimateReadTime(post.content),
    featuredImage: getMediaUrl(post.featureImage) ?? FALLBACK_IMAGE,
    featuredAlt: post.featureImage?.alternativeText || post.title,
    summary: summarizeArticle(post.content),
    ...(await buildBody(post.content, post.title)),
    shareUrl: `${SITE}/${post.slug}`,
    gated: post.gated,
    subscribe: buildSubscribe(settings),
    related: {
      ...buildRelatedMeta(settings),
      cards: related
        .filter((p) => p.slug !== post.slug)
        .slice(0, RELATED_COUNT)
        .map((p) => ({
          category: p.categories?.[0]?.name ?? "Blog",
          title: p.title,
          excerpt: stripHtml(p.excerpt ?? p.content),
          date: formatDate(p.publishedDate),
          readingTime: p.readingTime ?? estimateReadTime(p.content),
          image: getMediaUrl(p.featureImage) ?? FALLBACK_IMAGE,
          alt: p.title,
          href: `/${p.slug}`,
        })),
    },
  };
}
