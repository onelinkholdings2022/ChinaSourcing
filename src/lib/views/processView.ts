import { getMediaUrl } from "../api/media-url";
import { stripHtmlKeepBreaks } from "./textUtils";
import type { ProcessPageData } from "../types/process-page";
import type { Milestone } from "@/components/sections/JourneyTimeline";
import type { UspListItem } from "@/components/sections/UspList";

const FALLBACK_IMAGE = "/images/blog-fallback.png";

export interface ProcessHeroViewData {
  typedPrefix: string;
  typedWords: string[];
  heading: string;
  intro: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: string | null;
  imageAlt: string;
}

export function buildProcessHeroView(data: ProcessPageData): ProcessHeroViewData {
  return {
    typedPrefix: "",
    typedWords: [],
    heading: data.hero.heading ?? "",
    intro: data.hero.description ?? "",
    ctaLabel: null,
    ctaHref: null,
    image: getMediaUrl(data.hero.image),
    imageAlt: data.hero.image?.alternativeText || "China Sourcing Co warehouse",
  };
}

export interface ProcessTimelineViewData {
  tag: string;
  heading: string;
  intro: string;
  ship: string | null;
  milestones: Milestone[];
}

export function buildProcessTimelineView(data: ProcessPageData): ProcessTimelineViewData {
  const { timeline } = data;
  return {
    tag: timeline.tag?.label ?? "",
    heading: timeline.heading ?? "",
    intro: timeline.description ?? "",
    ship: getMediaUrl(timeline.shipImage),
    milestones: timeline.steps.map((step) => ({
      rail: step.title ?? "",
      step: step.label ?? "",
      title: step.title ?? "",
      body: step.description ?? "",
    })),
  };
}

export interface ProcessUspViewData {
  tag: string;
  heading: string;
  intro: string | null;
  icon: string | null;
  image: string | null;
  items: UspListItem[];
}

export function buildProcessUspView(data: ProcessPageData): ProcessUspViewData {
  const { usp } = data;
  return {
    tag: usp.tag?.label ?? "",
    heading: usp.heading ?? "",
    intro: usp.description ?? null,
    icon: getMediaUrl(usp.items[0]?.icon) ?? FALLBACK_IMAGE,
    image: getMediaUrl(usp.image) ?? FALLBACK_IMAGE,
    items: usp.items.map((item) => ({ title: item.title ?? "", body: item.description ?? "" })),
  };
}

export interface ProcessFaqViewData {
  tag: string;
  headingLines: string[];
  email: string | null;
  items: { question: string; answer: string }[];
}

export function buildProcessFaqView(data: ProcessPageData): ProcessFaqViewData {
  const { faq } = data;
  return {
    tag: faq.tag?.label ?? "",
    headingLines: [faq.title, faq.titleHighlight].filter((s): s is string => Boolean(s)),
    email: faq.contactEmail,
    items: faq.items.map((item) => ({ question: item.question ?? "", answer: stripHtmlKeepBreaks(item.answer) })),
  };
}

export interface ProcessCtaViewData {
  sectionClass: string;
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export function buildProcessCtaView(data: ProcessPageData): ProcessCtaViewData {
  const { ctaBanner } = data;
  return {
    sectionClass: "dark-cta px-5 pb-[120px]",
    tag: ctaBanner.tag?.label ?? "",
    heading: ctaBanner.heading ?? "",
    body: ctaBanner.subheading ?? "",
    ctaLabel: ctaBanner.button?.label ?? "",
    ctaHref: ctaBanner.button?.url ?? "/contact-us",
  };
}
