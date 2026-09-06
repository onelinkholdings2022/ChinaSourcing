import { getMediaUrl } from "../api/media-url";
import { stripHtml, estimateReadTime, formatDate } from "./textUtils";
import type { ResourcesPageData } from "../types/resources-page";
import type { Resource } from "../types/resource";
import type { BlogPost } from "../types/blog-post";
import type { ListingTab, ResourceCard, BlogCard } from "@/data/resources";

const FALLBACK_IMAGE = "/images/blog-fallback.png";

export interface ResourcesHeroViewData {
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
}

export function buildResourcesHeroView(page: ResourcesPageData): ResourcesHeroViewData {
  return {
    heading: page.hero.heading ?? "",
    intro: page.hero.description ?? "",
    image: getMediaUrl(page.hero.image) ?? FALLBACK_IMAGE,
    imageAlt: page.hero.image?.alternativeText || "China Sourcing Co resources",
  };
}

// `resourceType` (enum) là nguồn duy nhất để lọc download — không có field
// "filter tab" riêng trong CMS.
const RESOURCE_TYPE_TAB: Record<Resource["resourceType"], string> = {
  Checklist: "checklists",
  eBook: "ebook",
  Template: "templates",
  Other: "others",
};

export interface FreeResourcesViewData {
  tag: string;
  heading: string;
  tabs: ListingTab[];
  cards: ResourceCard[];
  perPage: number;
}

export function buildFreeResourcesView(page: ResourcesPageData, resources: Resource[]): FreeResourcesViewData {
  return {
    tag: page.freeResources.tag?.label ?? "",
    heading: page.freeResources.heading ?? "",
    perPage: 6,
    tabs: [
      { value: "all", label: "All" },
      { value: "checklists", label: "Checklists" },
      { value: "ebook", label: "eBook" },
      { value: "others", label: "Others" },
      { value: "templates", label: "Templates" },
    ],
    cards: resources.map((r) => ({
      types: [RESOURCE_TYPE_TAB[r.resourceType]],
      category: r.categories[0]?.name ?? null,
      title: r.title,
      excerpt: stripHtml(r.content),
      date: formatDate(r.publishedAt),
      href: `/resources/${r.slug}`,
    })),
  };
}

export interface InsightsViewData {
  tag: string;
  heading: string;
  intro: string;
  tabs: ListingTab[];
  cards: BlogCard[];
  perPage: number;
}

/**
 * `blog-post` không có field phân loại trong Strapi (chỉ `resource` mới có
 * `categories`) — nội dung gốc từng lọc theo category WordPress, nhưng CMS
 * hiện tại không mô hình hoá quan hệ đó cho blog post. Chỉ còn tab "All".
 */
export function buildInsightsView(page: ResourcesPageData, posts: BlogPost[]): InsightsViewData {
  return {
    tag: page.insights.tag?.label ?? "",
    heading: page.insights.heading ?? "",
    intro: page.insights.description ?? "",
    perPage: page.insights.pageSize || 12,
    tabs: [{ value: "all", label: "All" }],
    cards: posts.map((p) => ({
      types: ["all"],
      category: "Blog",
      title: p.title,
      excerpt: stripHtml(p.excerpt ?? p.content),
      date: formatDate(p.publishedDate),
      readingTime: estimateReadTime(p.content),
      image: getMediaUrl(p.featureImage) ?? FALLBACK_IMAGE,
      alt: p.title,
      href: `/${p.slug}`,
    })),
  };
}

export interface SplitScreenViewData {
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  image: string;
  alt: string;
}

export function buildDownloadCtaView(page: ResourcesPageData): SplitScreenViewData {
  const { downloadCta } = page;
  return {
    tag: downloadCta.tag?.label ?? "",
    heading: downloadCta.heading ?? "",
    body: downloadCta.description ?? "",
    ctaLabel: downloadCta.buttonLabel ?? "Download",
    image: getMediaUrl(downloadCta.image) ?? FALLBACK_IMAGE,
    alt: downloadCta.heading ?? "",
  };
}

export interface ResourcesFaqViewData {
  tag: string;
  headingLines: string[];
  email: string | null;
  items: { question: string; answer: string }[];
}

export function buildResourcesFaqView(page: ResourcesPageData): ResourcesFaqViewData {
  const { faq } = page;
  return {
    tag: faq.tag?.label ?? "",
    headingLines: [faq.title, faq.titleHighlight].filter((s): s is string => Boolean(s)),
    email: faq.contactEmail,
    items: faq.items.map((item) => ({ question: item.question ?? "", answer: stripHtml(item.answer) })),
  };
}
