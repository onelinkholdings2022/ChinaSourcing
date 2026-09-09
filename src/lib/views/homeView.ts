import { getMediaUrl } from "../api/media-url";
import type { HomepageData } from "../types/homepage";
import type { CaseStudy } from "../types/case-study";
import type { BlogPost } from "../types/blog-post";
import type { Partner } from "../types/partner";
import type { AboutPageData } from "../types/about-page";
import { filterTabHref, type RouteSlugTable } from "../routing/routeSlugs";
import { stripHtml, estimateReadTime, formatDate, stripHtmlKeepBreaks, trimExcerpt } from "./textUtils";
import { SOURCING_GUIDE_HREF, SOURCING_GUIDE_URL, isSourcingGuideHref } from "../sourcingGuide";

// ─── View model cho trang chủ ────────────────────────────────────────────────
// Map raw Strapi -> đúng hình dữ liệu mà các component section đang đọc (trước
// đây từ `@/data/site.ts`), để không phải đổi JSX/CSS của component nào — chỉ
// đổi chỗ lấy dữ liệu (prop thay vì import tĩnh).

export interface HeroViewData {
  heading: string;
  words: string[];
  subheading: string;
  cta: { idle: string; hover: string };
  poster: string;
  /** Vimeo embed (đã kèm sẵn `autoplay=1&muted=1&loop=1` từ CMS) — null thì chỉ hiện poster. */
  videoUrl: string | null;
}

export interface ServiceCardViewData {
  title: string;
  description: string;
  image: string;
}

export interface ServiceTabViewData {
  label: string;
  cards: ServiceCardViewData[];
}

export interface UspViewData {
  title: string;
  description: string;
  image: string;
}

export interface CaseStudyCardViewData {
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface PartnerTabViewData {
  /** Slug category — thứ đi vào URL và thứ `Partners` so để biết tab nào đang mở. */
  value: string;
  label: string;
  /** URL phẳng `/<slug>`; `undefined` nếu slug chưa phân giải được. */
  href?: string;
  logos: string[];
}

export interface InsightViewData {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  href: string;
}

export interface FaqViewData {
  question: string;
  answer: string;
}

export interface MissionVideoViewData {
  headingBefore: string;
  headingHighlight: string;
  headingAfter: string;
  subtitle: string;
  primaryButton: { label: string; href: string };
  /** `fileUrl` khác `null` nghĩa là nút TẢI FILE, không phải link — xem dưới. */
  secondaryButton: { label: string; href: string; fileUrl: string | null };
}

const FALLBACK_IMAGE = "/images/blog-fallback.png";

/**
 * Vimeo hiện thanh control (play/pause, volume, cài đặt...) theo mặc định —
 * với video nền chỉ để trang trí thì phải ép `background=1&controls=0` (Vimeo
 * background-mode) mới ẩn hẳn thanh đó, dù CMS đã tự set autoplay/muted/loop.
 */
function toBackgroundVimeoUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("background", "1");
    u.searchParams.set("controls", "0");
    return u.toString();
  } catch {
    return url;
  }
}

export function buildHeroView(data: HomepageData): HeroViewData {
  const { hero } = data;
  return {
    heading: hero.title ?? "",
    words: hero.rotatingWords.map((w) => w.text),
    subheading: hero.subtitle ?? "",
    cta: {
      idle: hero.ctaButton?.defaultLabel ?? "",
      hover: hero.ctaButton?.hoverLabel ?? "",
    },
    poster: getMediaUrl(hero.posterImage) ?? FALLBACK_IMAGE,
    videoUrl: hero.videoUrl ? toBackgroundVimeoUrl(hero.videoUrl) : null,
  };
}

export function buildServiceTabsView(data: HomepageData): ServiceTabViewData[] {
  return data.sourcingServices.tabs.map((tab) => ({
    label: tab.label ?? "",
    cards: tab.cards.map((card) => ({
      title: card.title ?? "",
      description: card.description ?? "",
      image: getMediaUrl(card.icon) ?? FALLBACK_IMAGE,
    })),
  }));
}

export function buildUspsView(data: HomepageData): UspViewData[] {
  return data.whyChooseUs.features.map((f) => ({
    title: f.title ?? "",
    description: f.description ?? "",
    image: getMediaUrl(f.icon) ?? FALLBACK_IMAGE,
  }));
}

// Case-study không có field order trong schema — giữ đúng thứ tự hiển thị gốc
// (TAG Apparel, Prestige Residential, Muscle Mat) bằng danh sách slug cố định.
const FEATURED_CASE_STUDY_ORDER = ["tag-apparel", "prestige-residential", "muscle-mat"];

export function buildCaseStudiesView(caseStudies: CaseStudy[]): CaseStudyCardViewData[] {
  const bySlug = new Map(caseStudies.map((c) => [c.slug, c]));
  const ordered = FEATURED_CASE_STUDY_ORDER.map((slug) => bySlug.get(slug)).filter(
    (c): c is CaseStudy => Boolean(c)
  );
  // Case study nổi bật mới thêm sau này (không nằm trong danh sách cố định) vẫn
  // được nối thêm vào cuối, không bị rớt mất.
  const rest = caseStudies.filter((c) => !FEATURED_CASE_STUDY_ORDER.includes(c.slug));
  return [...ordered, ...rest].map((c) => ({
    title: c.title,
    description: c.description ?? "",
    image: getMediaUrl(c.featureImage) ?? FALLBACK_IMAGE,
    href: `/${c.slug}`,
  }));
}

/**
 * Tab của dải logo nhà máy, nhóm theo `partner.category`.
 *
 * Thứ tự lấy từ field `order` bên CMS chứ không phải một mảng tên ghi cứng
 * trong code: bảy category đều có `order` 1–7, và thêm/đổi tên một category
 * bên CMS mà code không biết thì tab đó biến mất khỏi trang — đúng cái bẫy của
 * bản cũ. Partner không gán category rơi vào nhóm "Other", xếp cuối.
 *
 * `slugTable` để dựng href. Mỗi tab trỏ tới `/<category-slug>`; xem
 * `filterTabHref` và chú thích `SLUG_KINDS` cho chuyện 4 slug dùng chung với
 * trang product.
 */
export function buildPartnerTabsView(
  partners: Partner[],
  slugTable: RouteSlugTable,
): PartnerTabViewData[] {
  const groups = new Map<string, { label: string; order: number; logos: Partner[] }>();
  for (const p of partners) {
    const slug = p.category?.slug ?? "other";
    let group = groups.get(slug);
    if (!group) {
      group = {
        label: p.category?.name ?? "Other",
        // Không có `order` thì xếp cuối, chứ không phải đầu (0).
        order: p.category?.order ?? Number.MAX_SAFE_INTEGER,
        logos: [],
      };
      groups.set(slug, group);
    }
    group.logos.push(p);
  }

  return [...groups.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([slug, group]) => ({
      value: slug,
      label: group.label,
      href: filterTabHref(slugTable, slug),
      logos: group.logos
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((p) => getMediaUrl(p.logo) ?? FALLBACK_IMAGE),
    }));
}

export function buildInsightsView(posts: BlogPost[]): InsightViewData[] {
  return posts.map((post) => ({
    category: "Blog",
    title: post.title,
    // Theme cắt mọi excerpt thẻ bài về 150 ký tự (`wp_html_excerpt`) — xem
    // deviation 27. Thẻ này không có `line-clamp` nào, nên bỏ cắt là thẻ cao
    // dư: ở 390px cả khối "Latest Sourcing Insights" phình thêm ~500px.
    excerpt: trimExcerpt(stripHtml(post.excerpt)),
    date: formatDate(post.publishedDate),
    readTime: post.readingTime ?? estimateReadTime(post.content),
    image: getMediaUrl(post.featureImage) ?? FALLBACK_IMAGE,
    // Blog post nằm ở gốc site (`/<slug>`, route `app/[slug]`), không phải
    // dưới `/resources` — chỗ đó chỉ dành cho collection `resource`.
    href: `/${post.slug}`,
  }));
}

export function buildMissionVideoView(data: HomepageData): MissionVideoViewData {
  const [seg0, seg1, seg2] = data.missionVideo.titleSegments;
  const [btn1, btn2] = data.missionVideo.buttons;
  return {
    headingBefore: seg0?.text ?? "",
    headingHighlight: seg1?.text ?? "",
    headingAfter: seg2?.text ?? "",
    subtitle: data.missionVideo.subtitle ?? "",
    primaryButton: { label: btn1?.label ?? "", href: btn1?.url ?? "/contact-us" },
    // "Download A Sourcing Guide" — bên site gốc là `<button id="downloadBtn">`
    // tải thẳng PDF, không phải link. CMS không có field file nên nó lưu href
    // giữ chỗ `/sourcing-guide`; gặp href đó thì trả file thật, và trang render
    // nút tải xuống thay vì `<a>` (địa chỉ kia không có trang, proxy sẽ đá về
    // trang chủ).
    secondaryButton: {
      label: btn2?.label ?? "",
      href: btn2?.url ?? SOURCING_GUIDE_HREF,
      fileUrl: isSourcingGuideHref(btn2?.url ?? SOURCING_GUIDE_HREF)
        ? SOURCING_GUIDE_URL
        : null,
    },
  };
}

export function buildClientLogosView(about: AboutPageData | null): string[] {
  if (!about) return [];
  return about.logoMarquee.logos.map((l) => getMediaUrl(l.logo) ?? FALLBACK_IMAGE);
}

export function buildFaqsView(data: HomepageData): FaqViewData[] {
  return data.faq.items.map((item) => ({
    question: item.question,
    answer: stripHtmlKeepBreaks(item.answer),
  }));
}
