import { getMediaUrl } from "../api/media-url";
import type { AboutPageData } from "../types/about-page";
import type { TeamMember } from "../types/team-member";
import type { CaseStudy } from "../types/case-study";
import type { Milestone } from "@/components/sections/JourneyTimeline";
import type { UspListItem } from "@/components/sections/UspList";
import type { FlowTrackSlide } from "@/components/sections/FlowTrackTabs";
import type { CaseCard } from "@/components/sections/CaseStudySlider";

// ─── View model cho /about-us ────────────────────────────────────────────────
// Cùng khuôn với homeView.ts: map raw Strapi -> đúng hình dữ liệu component
// page-specific (AboutHero, FounderQuote, CoreValues, TeamSlider) đang nhận,
// để không đổi JSX/CSS đã pixel-perfect.

const FALLBACK_IMAGE = "/images/blog-fallback.png";

export interface AboutHeroViewData {
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
}

export function buildAboutHeroView(data: AboutPageData): AboutHeroViewData {
  return {
    heading: data.hero.heading ?? "",
    intro: data.hero.description ?? "",
    image: getMediaUrl(data.hero.image) ?? FALLBACK_IMAGE,
    imageAlt: data.hero.image?.alternativeText || "About China Sourcing Co",
  };
}

export interface JourneyViewData {
  tag: string;
  heading: string;
  ship: string;
  milestones: Milestone[];
}

export function buildJourneyView(data: AboutPageData): JourneyViewData {
  const { timeline } = data;
  return {
    tag: timeline.tag?.label ?? "",
    heading: timeline.heading ?? "",
    ship: getMediaUrl(timeline.shipImage) ?? FALLBACK_IMAGE,
    milestones: timeline.items.map((item) => {
      const label = `${item.year}: ${item.title}`;
      return { rail: label, title: label, body: item.description ?? "" };
    }),
  };
}

export interface FounderQuoteViewData {
  tag: string;
  avatar: string;
  name: string;
  role: string;
  paragraphs: string[];
}

export function buildFounderQuoteView(data: AboutPageData): FounderQuoteViewData {
  const { founderQuote } = data;
  return {
    tag: founderQuote.tag?.label ?? "",
    avatar: getMediaUrl(founderQuote.photo) ?? FALLBACK_IMAGE,
    name: founderQuote.name ?? "",
    role: founderQuote.title ?? "",
    paragraphs: (founderQuote.quote ?? "").split(/\n{2,}/).filter(Boolean),
  };
}

export interface CoreValuesCardViewData {
  icon: string;
  title: string;
  body: string;
}

export interface CoreValuesViewData {
  tag: string;
  heading: string;
  cards: CoreValuesCardViewData[];
}

export function buildCoreValuesView(data: AboutPageData): CoreValuesViewData {
  const v = data.visionMissionValues;
  return {
    tag: v.tag?.label ?? "",
    heading: v.heading ?? "",
    cards: [
      { icon: getMediaUrl(v.visionIcon) ?? FALLBACK_IMAGE, title: v.visionTitle ?? "", body: v.visionText ?? "" },
      { icon: getMediaUrl(v.missionIcon) ?? FALLBACK_IMAGE, title: v.missionTitle ?? "", body: v.missionText ?? "" },
      { icon: getMediaUrl(v.valuesIcon) ?? FALLBACK_IMAGE, title: v.valuesTitle ?? "", body: v.valuesText ?? "" },
    ],
  };
}

export interface BenefitsViewData {
  tag: string;
  heading: string;
  intro: string;
  icon: string | null;
  image: string | null;
  items: UspListItem[];
}

export function buildBenefitsView(data: AboutPageData): BenefitsViewData {
  const { benefits } = data;
  return {
    tag: benefits.tag?.label ?? "",
    heading: benefits.heading ?? "",
    intro: benefits.intro ?? "",
    icon: getMediaUrl(benefits.items[0]?.icon) ?? FALLBACK_IMAGE,
    image: getMediaUrl(benefits.sideImage) ?? FALLBACK_IMAGE,
    items: benefits.items.map((item) => ({ title: item.title ?? "", body: item.description ?? "" })),
  };
}

export interface TeamMemberViewData {
  name: string;
  position: string;
  description: string;
  image: string;
}

export interface OfficeViewData {
  flag: string;
  alt: string;
  country: string;
  body: string;
}

export interface TeamViewData {
  tag: string;
  heading: string;
  intro: string;
  members: TeamMemberViewData[];
  localHeading: string;
  offices: OfficeViewData[];
}

export function buildTeamView(data: AboutPageData, members: TeamMember[]): TeamViewData {
  return {
    tag: data.team.tag?.label ?? "",
    heading: data.team.heading ?? "",
    intro: data.team.intro ?? "",
    members: members.map((m) => ({
      name: m.name,
      position: m.jobTitle ?? "",
      description: m.bio ?? "",
      image: getMediaUrl(m.photo) ?? FALLBACK_IMAGE,
    })),
    localHeading: data.locations.heading ?? "",
    offices: data.locations.items.map((loc) => ({
      flag: getMediaUrl(loc.icon) ?? FALLBACK_IMAGE,
      alt: loc.countryName ?? "",
      country: loc.countryName ?? "",
      body: loc.description ?? "",
    })),
  };
}

// Case-study không có field order trong schema — About dùng đúng 3 case study
// nổi bật, cùng thứ tự curator với homepage (xem homeView.ts).
const FEATURED_CASE_STUDY_ORDER = ["tag-apparel", "prestige-residential", "muscle-mat"];

export interface AboutCaseStudiesViewData {
  tag: string;
  headingLines: string[];
  cards: CaseCard[];
  ctaLabel: string;
  ctaHref: string;
}

export function buildAboutCaseStudiesView(
  data: AboutPageData,
  caseStudies: CaseStudy[]
): AboutCaseStudiesViewData {
  const { caseStudies: section } = data;
  const bySlug = new Map(caseStudies.map((c) => [c.slug, c]));
  const ordered = FEATURED_CASE_STUDY_ORDER.map((slug) => bySlug.get(slug)).filter(
    (c): c is CaseStudy => Boolean(c)
  );
  const rest = caseStudies.filter((c) => !FEATURED_CASE_STUDY_ORDER.includes(c.slug));
  return {
    tag: section.tag?.label ?? "",
    headingLines: (section.title ?? "").split("\n").filter(Boolean),
    cards: [...ordered, ...rest].map((c) => ({
      title: c.title,
      body: c.description ?? "",
      href: `/${c.slug}`,
      image: getMediaUrl(c.featureImage) ?? FALLBACK_IMAGE,
      alt: `${c.title} case study`,
    })),
    ctaLabel: section.ctaButton?.label ?? "See All Case Studies",
    ctaHref: section.ctaButton?.url ?? "/case-studies",
  };
}

export interface BrandCultureViewData {
  tag: string;
  heading: string;
  slides: FlowTrackSlide[];
}

export function buildBrandCultureView(data: AboutPageData): BrandCultureViewData {
  const { brandCulture } = data;
  return {
    tag: brandCulture.tag?.label ?? "",
    heading: brandCulture.heading ?? "",
    slides: brandCulture.tabs.map((tab, i) => ({
      label: tab.label ?? "",
      subheading: tab.tagline ?? "",
      title: tab.heading ?? "",
      paragraphs: (tab.description ?? "").split(/\n{2,}/).filter(Boolean),
      image: getMediaUrl(tab.image) ?? FALLBACK_IMAGE,
      alt: tab.label ?? "",
      nextLabel: brandCulture.tabs[i + 1]?.label ?? undefined,
    })),
  };
}

export interface CtaBannerViewData {
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
}

export function buildCtaBannerView(data: AboutPageData): CtaBannerViewData {
  const { ctaBanner } = data;
  return {
    tag: ctaBanner.tag?.label ?? "",
    heading: ctaBanner.heading ?? "",
    body: ctaBanner.subheading ?? "",
    ctaLabel: ctaBanner.button?.label ?? "",
  };
}

export function buildAboutLogosView(data: AboutPageData): string[] {
  return data.logoMarquee.logos.map((l) => getMediaUrl(l.logo) ?? FALLBACK_IMAGE);
}
