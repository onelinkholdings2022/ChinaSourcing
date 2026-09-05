import { getMediaUrl } from "../api/media-url";
import type { HomepageData } from "../types/homepage";
import type { CaseStudy } from "../types/case-study";
import type { BlogPost } from "../types/blog-post";
import type { Partner } from "../types/partner";
import type { AboutPageData } from "../types/about-page";

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
  label: string;
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
  secondaryButton: { label: string; href: string };
}

const FALLBACK_IMAGE = "/images/blog-fallback.png";

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(html: string | null | undefined): string {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
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
    href: `/case-studies/${c.slug}`,
  }));
}

const PARTNER_CATEGORY_ORDER = [
  "Furniture & Interior",
  "Promotional Products",
  "Gym & Fitness",
  "Point of Sale",
  "Machinery",
  "Hospitality Items",
  "Household Appliances",
];

export function buildPartnerTabsView(partners: Partner[]): PartnerTabViewData[] {
  const byCategory = new Map<string, Partner[]>();
  for (const p of partners) {
    const name = p.category?.name ?? "Other";
    if (!byCategory.has(name)) byCategory.set(name, []);
    byCategory.get(name)!.push(p);
  }
  return PARTNER_CATEGORY_ORDER.filter((name) => byCategory.has(name)).map((name) => ({
    label: name,
    logos: byCategory
      .get(name)!
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((p) => getMediaUrl(p.logo) ?? FALLBACK_IMAGE),
  }));
}

export function buildInsightsView(posts: BlogPost[]): InsightViewData[] {
  return posts.map((post) => ({
    category: "Blog",
    title: post.title,
    excerpt: stripHtml(post.excerpt),
    date: formatDate(post.publishedDate),
    readTime: estimateReadTime(post.content),
    image: getMediaUrl(post.featureImage) ?? FALLBACK_IMAGE,
    href: `/resources/${post.slug}`,
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
    // Strapi chưa gắn URL cho nút này (guide file trống) — giữ href tĩnh gốc.
    secondaryButton: { label: btn2?.label ?? "", href: btn2?.url ?? "/sourcing-guide" },
  };
}

export function buildClientLogosView(about: AboutPageData | null): string[] {
  if (!about) return [];
  return about.logoMarquee.logos.map((l) => getMediaUrl(l.logo) ?? FALLBACK_IMAGE);
}

export function buildFaqsView(data: HomepageData): FaqViewData[] {
  return data.faq.items.map((item) => ({
    question: item.question,
    answer: stripHtml(item.answer),
  }));
}
