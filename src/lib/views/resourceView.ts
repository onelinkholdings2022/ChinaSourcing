import { getMediaUrl } from "../api/media-url";
import { categoryHref, filterTabHref, type RouteSlugTable } from "../routing/routeSlugs";
import { SOURCING_GUIDE_URL } from "../sourcingGuide";
import { stripHtml, estimateReadTime, formatDate, stripHtmlKeepBreaks, trimExcerpt } from "./textUtils";
import type { ResourcesPageData } from "../types/resources-page";
import type { Resource } from "../types/resource";
import type { ResourceType } from "../types/resource-type";
import type { BlogPost } from "../types/blog-post";
import type { ListingTab } from "@/components/sections/resources/TabRail";
import type { ResourceCard } from "@/components/sections/resources/ResourceListing";
import type { BlogCardData as BlogCard } from "@/components/sections/resources/BlogCard";

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

/**
 * Enum cũ → slug loại. Đây là NHÁNH LÙI, không phải nguồn chính.
 *
 * Nguồn chính là collection `resource-type` (`resource.type.slug`). Bảng này
 * chỉ chạy khi quan hệ đó trống — bản CMS đang chạy production chưa có
 * collection đó, nên hiện tại nó là thứ đang chạy. Slug phải khớp
 * `strapi-cns/scripts/seed-resource-types.js`, nếu không thì sau khi deploy
 * một bài chưa gán `type` sẽ rơi vào tab không tồn tại và biến mất khỏi listing.
 */
const RESOURCE_TYPE_TAB: Record<Resource["resourceType"], string> = {
  Checklist: "checklists",
  eBook: "ebook",
  Template: "templates",
  Other: "others",
};

/** Nhãn của nhánh lùi, theo đúng chữ theme viết trên tab. */
const FALLBACK_TYPE_TABS: { value: string; label: string }[] = [
  { value: "checklists", label: "Checklists" },
  { value: "ebook", label: "eBook" },
  { value: "others", label: "Others" },
  { value: "templates", label: "Templates" },
];

/** Slug loại của một resource: bản ghi thật trước, enum sau. */
function resourceTypeSlug(resource: Resource): string {
  return resource.type?.slug ?? RESOURCE_TYPE_TAB[resource.resourceType];
}

export interface FreeResourcesViewData {
  tag: string;
  heading: string;
  tabs: ListingTab[];
  cards: ResourceCard[];
  perPage: number;
}

/**
 * "Free Resources" chỉ liệt kê resource KHÔNG gate (`gated: false`) — bài nào
 * bật công tắc điền form (`gated: true`) thì không thuộc mục "miễn phí" này.
 *
 * Rail tab giờ là URL, giống rail category của `.blog-listing`: mỗi loại
 * (Checklists / eBook / Others / Templates) là một bản ghi `resource-type` có
 * slug riêng, nên bấm một tab thì thanh địa chỉ hiện `/<slug>`.
 *
 * `types` rỗng thì lùi về enum — bản CMS đang chạy production chưa có
 * collection `resource-type`, và tới lúc deploy xong thì rail vẫn phải đủ 4
 * tab. Khác biệt duy nhất khi lùi: `filterTabHref` trả `undefined` (slug chưa
 * có trong bảng định tuyến) nên tab là `<button>` như trước, không phải link gãy.
 */
export function buildFreeResourcesView(
  page: ResourcesPageData,
  resources: Resource[],
  types: ResourceType[],
  slugTable: RouteSlugTable,
): FreeResourcesViewData {
  const free = resources.filter((r) => !r.gated);
  const rail = types.length
    ? types.map((t) => ({ value: t.slug, label: t.name }))
    : FALLBACK_TYPE_TABS;

  return {
    tag: page.freeResources.tag?.label ?? "",
    heading: page.freeResources.heading ?? "",
    // Theme phân trang client-side với `n = 3` cứng cho `.resource-item`
    // (và `n = 6` cho `.blog-item`) — không phải field CMS.
    perPage: 3,
    tabs: [
      // "All" là chính trang listing, không phải một loại — nên href là
      // `/resources` chứ không phải `/all`.
      { value: "all", label: "All", href: "/resources" },
      ...rail.map((t) => ({ ...t, href: filterTabHref(slugTable, t.value) })),
    ],
    cards: free.map((r) => ({
      types: [resourceTypeSlug(r)],
      category: r.categories[0]?.name ?? null,
      title: r.title,
      excerpt: trimExcerpt(stripHtml(r.content)),
      date: formatDate(r.publishedDate ?? r.publishedAt),
      href: `/${r.slug}`,
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
 * Rail category của `.blog-listing`.
 *
 * Tab KHÔNG còn là nút lọc client-side: mỗi category có URL riêng, nên tab là
 * một `<Link>` và trang được chọn hiện đúng `domain/<category-slug>`. `value`
 * vì thế là **slug** chứ không phải tên viết thường như trước — slug là thứ đi
 * vào URL, và tên category có dấu cách/ký tự & thì không dùng làm path được.
 *
 * `slugTable` để tính href: một category mà slug đã bị loại nội dung ưu tiên
 * cao hơn chiếm (`freight-logistics` trùng với một service) không có URL phẳng
 * và lùi về `/resources?category=<slug>` — xem `categoryHref`.
 */
export function buildInsightsView(
  page: ResourcesPageData,
  posts: BlogPost[],
  slugTable: RouteSlugTable,
): InsightsViewData {
  const categories = new Map<string, string>();
  for (const p of posts) for (const c of p.categories) categories.set(c.slug, c.name);
  const sorted = [...categories.entries()].sort((a, b) => a[1].localeCompare(b[1]));

  return {
    tag: page.insights.tag?.label ?? "",
    heading: page.insights.heading ?? "",
    intro: page.insights.description ?? "",
    perPage: page.insights.pageSize || 12,
    tabs: [
      { value: "all", label: "All", href: "/resources" },
      ...sorted.map(([slug, name]) => ({
        value: slug,
        label: name,
        href: categoryHref(slugTable, slug),
      })),
    ],
    cards: posts.map((p) => ({
      types: p.categories.map((c) => c.slug),
      category: p.categories[0]?.name ?? "Blog",
      title: p.title,
      excerpt: trimExcerpt(stripHtml(p.excerpt ?? p.content)),
      date: formatDate(p.publishedDate),
      readingTime: p.readingTime ?? estimateReadTime(p.content),
      // Không fallback: 9/131 bài không có featured image, và thẻ `.blog-card`
      // của theme bỏ hẳn thẻ <img> trong trường hợp đó thay vì hiện ảnh thay
      // thế (khối `.resource-card` thì ngược lại — chỗ đó vẫn fallback).
      image: getMediaUrl(p.featureImage),
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
  fileUrl: string | null;
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
    fileUrl: SOURCING_GUIDE_URL,
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
    items: faq.items.map((item) => ({ question: item.question ?? "", answer: stripHtmlKeepBreaks(item.answer) })),
  };
}
