import { getMediaUrl, toLogoItems, type LogoItem } from "../api/media-url";
import type { HomepageData } from "../types/homepage";
import type { CaseStudy } from "../types/case-study";
import type { BlogPost } from "../types/blog-post";
import type { Partner } from "../types/partner";
import type { AboutPageData } from "../types/about-page";
import { filterTabHref, type RouteSlugTable } from "../routing/routeSlugs";
import { estimateReadTime, formatDate, stripHtmlKeepBreaks } from "./textUtils";
import { SOURCING_GUIDE_DOWNLOAD, SOURCING_GUIDE_HREF, isSourcingGuideHref } from "../sourcingGuide";

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
  posterAlt: string;
  /** Video nền — null thì chỉ hiện poster. Xem `resolveHeroVideo`. */
  video: HeroVideo | null;
}

/**
 * Hai cách dựng video nền:
 * • `file`  — file video thật (`<video>`): upload vào field `backgroundVideo`
 *   bên CMS, hoặc dán link trực tiếp tới .mp4/.webm vào `videoUrl`.
 * • `embed` — iframe player của Vimeo / YouTube, ép về chế độ nền.
 */
export type HeroVideo = { kind: "file"; src: string; type: string | null } | { kind: "embed"; src: string };

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
function toBackgroundVimeoUrl(u: URL): string {
  u.searchParams.set("background", "1");
  u.searchParams.set("controls", "0");
  return u.toString();
}

/** YouTube: `loop` chỉ chạy khi `playlist` trỏ về chính video đó. */
function toBackgroundYoutubeUrl(id: string): string {
  const q = new URLSearchParams({
    autoplay: "1", mute: "1", loop: "1", playlist: id, controls: "0",
    playsinline: "1", modestbranding: "1", rel: "0", disablekb: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
}

const VIDEO_EXT = /\.(mp4|webm|ogv|mov|m4v)$/i;

/**
 * Chọn nguồn video nền, theo thứ tự: file upload `backgroundVideo` → `videoUrl`.
 *
 * Link Google Drive (`drive.google.com/file/d/…/view`) bị BỎ QUA có chủ đích:
 * đó là trang xem file chứ không phải luồng video, nhúng vào iframe thì ra
 * khung player của Drive (hoặc trang lỗi "không có quyền truy cập"), không tự
 * chạy, không lặp, không tắt tiếng được — tức đúng cái hero "bị lỗi". Link tải
 * thẳng của Drive cũng không dùng được làm nguồn `<video>`: file lớn bị chặn
 * bởi trang cảnh báo quét virus và bị giới hạn lượt tải. Gặp link đó thì hero
 * chỉ hiện poster.
 */
function resolveHeroVideo(hero: HomepageData["hero"]): HeroVideo | null {
  const media = hero.backgroundVideo;
  if (media?.url && (media.mime ?? "").startsWith("video/")) {
    const src = getMediaUrl(media);
    // `.mov` (video/quicktime) KHÔNG được khai type: Chrome trả
    // `canPlayType("video/quicktime") === ""` nên bỏ qua `<source>` và video
    // đứng ở NO_SOURCE — dù bên trong thường là H.264 mà Chrome phát tốt.
    // Không khai type thì trình duyệt tự dò định dạng từ chính file.
    if (src) return { kind: "file", src, type: media.mime === "video/quicktime" ? null : media.mime ?? null };
  }

  const raw = hero.videoUrl?.trim();
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "player.vimeo.com") return { kind: "embed", src: toBackgroundVimeoUrl(u) };
  if (host === "vimeo.com") {
    const id = u.pathname.split("/").find((seg) => /^\d+$/.test(seg));
    if (id) return { kind: "embed", src: toBackgroundVimeoUrl(new URL(`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1`)) };
  }

  const ytId =
    host === "youtu.be" ? u.pathname.slice(1)
    : /(^|\.)youtube(-nocookie)?\.com$/.test(host)
      ? u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] ?? null
      : null;
  if (ytId) return { kind: "embed", src: toBackgroundYoutubeUrl(ytId) };

  if (VIDEO_EXT.test(u.pathname)) return { kind: "file", src: u.toString(), type: null };

  return null;
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
    // Không đọc `alternativeText` của poster: bên CMS nó đang là "logo cns",
    // trong khi ảnh là khung hình đầu của video hero chứ không phải logo.
    posterAlt: `China Sourcing Co – ${(hero.subtitle || hero.title || "sourcing partner in Asia").replace(/\.$/, "")}`,
    video: resolveHeroVideo(hero),
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
    // Thẻ chỉ hiện category + tiêu đề (cùng nội dung thẻ "Explore More Related
    // Resources" ở trang bài viết) — category thật của bài, "Blog" khi trống.
    category: post.categories?.[0]?.name ?? "Blog",
    title: post.title,
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
    // tải thẳng PDF, không phải link. Nút trên CMS lưu href giữ chỗ
    // `/sourcing-guide`; gặp href đó thì render nút tải qua `/api/sourcing-guide`
    // — CÙNG file với Resources Page (`downloadCta.file`).
    secondaryButton: {
      label: btn2?.label ?? "",
      href: btn2?.url ?? SOURCING_GUIDE_HREF,
      fileUrl: isSourcingGuideHref(btn2?.url ?? SOURCING_GUIDE_HREF)
        ? SOURCING_GUIDE_DOWNLOAD
        : null,
    },
  };
}

export function buildClientLogosView(about: AboutPageData | null): LogoItem[] {
  if (!about) return [];
  return toLogoItems(about.logoMarquee.logos, FALLBACK_IMAGE);
}

export function buildFaqsView(data: HomepageData): FaqViewData[] {
  return data.faq.items.map((item) => ({
    question: item.question,
    answer: stripHtmlKeepBreaks(item.answer),
  }));
}
