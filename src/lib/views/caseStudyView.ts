import { getMediaUrl } from "../api/media-url";
import type { CaseStudiesPageData, CaseStudySettingData } from "../types/case-studies-page";
import type { CaseStudy } from "../types/case-study";
import type { CaseStudyCard, FilterOption } from "@/data/case-studies";
import type { UspListItem } from "@/components/sections/UspList";
import type { QuoteTestimonial } from "@/components/sections/CarouselTestimonial";
import type { CaseCard } from "@/components/sections/CaseStudySlider";
import type { SimpleCard } from "@/components/sections/SimpleCardGrid";
import type { CaseStudyFact, CaseStudyBlock } from "@/data/case-studies";

const FALLBACK_IMAGE = "/images/blog-fallback.png";

// Region không có media trong Strapi (chỉ là enum text) — cờ quốc gia là asset
// tĩnh sẵn có trong public/images/, ánh xạ tay theo đúng asset site gốc đã dùng
// cho từng region (xem case-study-pages.json cũ: chỉ Vietnam/Australia/America
// từng xuất hiện; China/Hong Kong bổ sung cho khớp đủ enum).
const REGION_FLAG: Record<string, string> = {
  Vietnam: "/images/image-82.png",
  Australia: "/images/Untitled-design.png",
  America: "/images/Untitled-design-1.png",
  China: "/images/CN.png",
  "Hong Kong": "/images/Hong-Kong-flag-1.png",
};

// ─── Index page (`/case-studies`) ────────────────────────────────────────────

export interface CaseStudiesHeroViewData {
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
}

export function buildCaseStudiesHeroView(page: CaseStudiesPageData): CaseStudiesHeroViewData {
  return {
    heading: page.hero.heading ?? "",
    intro: page.hero.description ?? "",
    image: getMediaUrl(page.hero.image) ?? FALLBACK_IMAGE,
    imageAlt: page.hero.image?.alternativeText || "China Sourcing Co case studies",
  };
}

export interface CaseStudiesListViewData {
  tag: string;
  heading: string;
  perPage: number;
  filters: { industry: FilterOption[]; region: FilterOption[]; service: FilterOption[] };
}

function distinctOptions(values: (string | null)[]): FilterOption[] {
  const unique = Array.from(new Set(values.filter((v): v is string => Boolean(v))));
  return unique.sort().map((v) => ({ value: v, label: v }));
}

export function buildCaseStudiesListView(
  page: CaseStudiesPageData,
  all: CaseStudy[]
): CaseStudiesListViewData {
  return {
    tag: page.list.tag?.label ?? "",
    heading: page.list.heading ?? "",
    perPage: page.list.pageSize,
    filters: {
      industry: distinctOptions(all.map((c) => c.industry)),
      region: distinctOptions(all.map((c) => c.region)),
      service: distinctOptions(all.map((c) => c.service)),
    },
  };
}

export function buildCaseStudyCardsView(all: CaseStudy[]): CaseStudyCard[] {
  return all.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    category: c.service ?? "",
    industry: c.industry ?? "",
    region: c.region ?? "",
    description: c.description ?? "",
    image: getMediaUrl(c.featureImage) ?? FALLBACK_IMAGE,
    alt: `${c.title} case study`,
  }));
}

export interface CaseStudiesUspViewData {
  tag: string;
  heading: string;
  intro: string;
  icon: string | null;
  image: string | null;
  items: UspListItem[];
}

export function buildCaseStudiesUspView(page: CaseStudiesPageData): CaseStudiesUspViewData {
  const { usp } = page;
  return {
    tag: usp.tag?.label ?? "",
    heading: usp.heading ?? "",
    intro: usp.description ?? "",
    icon: getMediaUrl(usp.items[0]?.icon) ?? FALLBACK_IMAGE,
    image: getMediaUrl(usp.image) ?? FALLBACK_IMAGE,
    items: usp.items.map((item) => ({ title: item.title ?? "", body: item.description ?? "" })),
  };
}

export interface CaseStudiesTestimonialsViewData {
  tag: string;
  heading: string;
  items: QuoteTestimonial[];
}

export function buildCaseStudiesTestimonialsView(
  page: CaseStudiesPageData
): CaseStudiesTestimonialsViewData {
  const { testimonials } = page;
  return {
    tag: testimonials.tag?.label ?? "",
    heading: testimonials.heading ?? "",
    items: testimonials.testimonials.map((t) => ({
      quote: t.quote ?? "",
      avatar: getMediaUrl(t.authorAvatar ?? t.image),
      name: t.authorName,
      role: t.authorRole ?? "",
    })),
  };
}

export interface DarkCtaViewData {
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
  sectionClass: string;
}

export function buildCaseStudiesCtaView(page: CaseStudiesPageData): DarkCtaViewData {
  const { ctaBanner } = page;
  return {
    sectionClass: "dark-cta px-5",
    tag: ctaBanner.tag?.label ?? "",
    heading: ctaBanner.heading ?? "",
    body: ctaBanner.subheading ?? "",
    ctaLabel: ctaBanner.button?.label ?? "",
    ctaHref: ctaBanner.button?.url ?? "/contact-us",
  };
}

// ─── Detail page (`/case-studies/<slug>`) ────────────────────────────────────

export interface CaseStudyHeroViewData {
  heading: string;
  intro: string;
  facts: CaseStudyFact[];
}

export function buildCaseStudyHeroView(cs: CaseStudy): CaseStudyHeroViewData {
  return {
    heading: cs.title,
    intro: cs.description ?? "",
    facts: [
      { label: "Region", value: cs.region ?? "", flag: REGION_FLAG[cs.region ?? ""] ?? null, flagAlt: cs.region },
      { label: "Industry", value: cs.industry ?? "", flag: null, flagAlt: null },
      { label: "Service", value: cs.service ?? "", flag: null, flagAlt: null },
    ],
  };
}

export interface CaseStudySimpleViewData {
  tag: string;
  heading: string;
  intro: string;
  cards: SimpleCard[];
}

export function buildCaseStudySimpleView(cs: CaseStudy): CaseStudySimpleViewData {
  return {
    tag: cs.whatWeDoTag?.label ?? "",
    heading: "What We Do",
    intro: cs.whatWeDoDescription ?? "",
    cards: cs.highlights.map((h) => ({
      icon: getMediaUrl(h.icon),
      title: h.title ?? "",
      body: h.description ?? "",
    })),
  };
}

export function buildCaseStudyBlocksView(cs: CaseStudy): CaseStudyBlock[] {
  return [
    { tag: cs.challengeTag?.label ?? "", heading: "The Challenge", html: cs.challengeContent ?? "" },
    { tag: cs.solutionTag?.label ?? "", heading: "The Solution", html: cs.solutionContent ?? "" },
  ];
}

export interface CaseStudySliderViewData {
  tag: string;
  headingLines: string[];
  ctaLabel: string;
  ctaHref: string;
  cards: CaseCard[];
}

/** 5 case study khác (không tính chính nó) — không có field "related" riêng trong CMS. */
const RELATED_COUNT = 5;

export function buildCaseStudyRelatedView(
  current: CaseStudy,
  all: CaseStudy[],
  settings: CaseStudySettingData | null
): CaseStudySliderViewData {
  const others = all.filter((c) => c.slug !== current.slug).slice(0, RELATED_COUNT);
  return {
    tag: settings?.relatedCaseStudiesTag?.label ?? "Our Case Studies",
    headingLines: [settings?.relatedCaseStudiesHeading ?? "Explore more Case Studies"],
    ctaLabel: settings?.relatedCaseStudiesButton?.label ?? "See All Case Studies",
    ctaHref: settings?.relatedCaseStudiesButton?.url ?? "/case-studies",
    cards: others.map((c) => ({
      title: c.title,
      body: c.description ?? "",
      href: `/case-studies/${c.slug}`,
      image: getMediaUrl(c.featureImage) ?? FALLBACK_IMAGE,
      alt: `${c.title} case study`,
    })),
  };
}

export function buildCaseStudyCtaView(settings: CaseStudySettingData | null): DarkCtaViewData {
  const cta = settings?.ctaBanner;
  return {
    sectionClass: "dark-cta px-5",
    tag: cta?.tag?.label ?? "",
    heading: cta?.heading ?? "",
    body: cta?.subheading ?? "",
    ctaLabel: cta?.button?.label ?? "",
    ctaHref: cta?.button?.url ?? "/contact-us",
  };
}
