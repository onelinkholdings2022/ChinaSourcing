import { getMediaUrl } from "../api/media-url";
import { stripHtml, estimateReadTime, formatDate, extractToc } from "./textUtils";
import type { Resource } from "../types/resource";
import type { BlogPost } from "../types/blog-post";
import type { ResourceSettingData } from "../types/resources-page";
import type { ArticleFact } from "@/components/sections/article/ArticleHero";
import type { BlogCardData } from "@/components/sections/resources/BlogCard";

const FALLBACK_IMAGE = "/images/blog-fallback.png";
const RELATED_COUNT = 3;

// Icon cố định theo loại fact — không có field CMS tương ứng, y hệt bản gốc.
const TAG_ICON = "/images/tag-01.svg";
const CALENDAR_ICON = "/images/calendar-dl.svg";
const CLOCK_ICON = "/images/clock-dl.svg";

export interface ArticleViewData {
  title: string;
  subtitle: string;
  facts: ArticleFact[];
  featuredImage: string | null;
  featuredAlt: string;
  toc: { href: string; label: string }[];
  html: string;
  shareUrl: string;
  /** Chỉ resource mới có công tắc này (`resource.gated`) — blog post luôn đọc full, không gate. */
  gated: boolean;
  subscribe: { tag: string; heading: string; body: string };
  related: { tag: string; heading: string; cards: BlogCardData[]; ctaLabel: string; ctaHref: string };
  cta: { tag: string; heading: string; body: string; ctaLabel: string; sectionClass: string };
}

const SITE = "https://chinasourcing.co";

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
    tag: settings?.relatedResourcesTag?.label ?? "",
    heading: settings?.relatedResourcesHeading ?? "",
    ctaLabel: settings?.relatedResourcesButton?.label ?? "See All Resources",
    ctaHref: settings?.relatedResourcesButton?.url ?? "/resources",
  };
}

function buildCta(settings: ResourceSettingData | null) {
  const cta = settings?.ctaBanner;
  return {
    sectionClass: "dark-cta px-5",
    tag: cta?.tag?.label ?? "",
    heading: cta?.heading ?? "",
    body: cta?.subheading ?? "",
    ctaLabel: cta?.button?.label ?? "",
  };
}

export function buildResourceArticleView(
  resource: Resource,
  settings: ResourceSettingData | null,
  related: Resource[]
): ArticleViewData {
  return {
    title: resource.title,
    subtitle: "",
    facts: [
      { label: "Tag", icon: TAG_ICON, value: resource.categories[0]?.name ?? resource.resourceType },
      // resource không có field ngày đăng riêng — dùng thời điểm publish trên CMS.
      { label: "Date", icon: CALENDAR_ICON, value: formatDate(resource.publishedAt) },
      { label: "Reading Time", icon: CLOCK_ICON, value: resource.readingTime ?? estimateReadTime(resource.content) },
    ],
    featuredImage: getMediaUrl(resource.featureImage) ?? FALLBACK_IMAGE,
    featuredAlt: resource.featureImage?.alternativeText || resource.title,
    toc: extractToc(resource.content),
    html: resource.content ?? "",
    shareUrl: `${SITE}/resources/${resource.slug}/`,
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
          date: formatDate(r.publishedAt),
          readingTime: r.readingTime ?? estimateReadTime(r.content),
          image: getMediaUrl(r.featureImage) ?? FALLBACK_IMAGE,
          alt: r.title,
          href: `/resources/${r.slug}`,
        })),
    },
    cta: buildCta(settings),
  };
}

export function buildBlogPostArticleView(
  post: BlogPost,
  settings: ResourceSettingData | null,
  related: BlogPost[]
): ArticleViewData {
  return {
    title: post.title,
    subtitle: "",
    facts: [
      { label: "Tag", icon: TAG_ICON, value: "Blog" },
      { label: "Date", icon: CALENDAR_ICON, value: formatDate(post.publishedDate) },
      { label: "Reading Time", icon: CLOCK_ICON, value: estimateReadTime(post.content) },
    ],
    featuredImage: getMediaUrl(post.featureImage) ?? FALLBACK_IMAGE,
    featuredAlt: post.featureImage?.alternativeText || post.title,
    toc: extractToc(post.content),
    html: post.content ?? "",
    shareUrl: `${SITE}/${post.slug}/`,
    // blog-post không có field `gated` trong Strapi — bài blog luôn đọc full.
    gated: false,
    subscribe: buildSubscribe(settings),
    related: {
      ...buildRelatedMeta(settings),
      cards: related
        .filter((p) => p.slug !== post.slug)
        .slice(0, RELATED_COUNT)
        .map((p) => ({
          category: "Blog",
          title: p.title,
          excerpt: stripHtml(p.excerpt ?? p.content),
          date: formatDate(p.publishedDate),
          readingTime: estimateReadTime(p.content),
          image: getMediaUrl(p.featureImage) ?? FALLBACK_IMAGE,
          alt: p.title,
          href: `/${p.slug}`,
        })),
    },
    cta: buildCta(settings),
  };
}
