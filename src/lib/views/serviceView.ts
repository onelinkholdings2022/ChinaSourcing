import { getMediaUrl } from "../api/media-url";
import { stripHtml } from "./textUtils";
import type {
  ServicesPageData,
  ServiceData,
  ServiceSettingData,
  CategoryShowcase,
} from "../types/services-page";
import type { Testimonial as TestimonialModel } from "../types/testimonial";
import type { Resource } from "../types/resource";
import type { CaseStudy } from "../types/case-study";
import type { UspListItem } from "@/components/sections/UspList";
import type { VerticalTabItem } from "@/components/sections/VerticalTab";
import type { FlowTrackSlide } from "@/components/sections/FlowTrackTabs";
import type { ServiceCardData } from "@/components/sections/ServiceCards";
import type { ResourceCard } from "@/components/sections/ResourceCards";
import type { CaseCard } from "@/components/sections/CaseStudySlider";
import type { TestimonialTab } from "@/components/sections/TabbedTestimonial";
import type { SimpleCard } from "@/components/sections/SimpleCardGrid";

const FALLBACK_IMAGE = "/images/blog-fallback.png";

export interface ProductHeroViewData {
  typedPrefix: string;
  typedWords: string[];
  heading: string;
  intro: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: string | null;
  imageAlt: string;
}

export function buildServicesHeroView(page: ServicesPageData): ProductHeroViewData {
  return {
    typedPrefix: "",
    typedWords: page.hero.rotatingWords.map((w) => w.text),
    heading: page.hero.title ?? "",
    intro: page.hero.description ?? "",
    ctaLabel: null,
    ctaHref: null,
    image: getMediaUrl(page.hero.image),
    imageAlt: page.hero.image?.alternativeText || "China Sourcing Co services",
  };
}

export function buildServiceHeroView(service: ServiceData): ProductHeroViewData {
  return {
    typedPrefix: "",
    typedWords: [],
    heading: service.heroHeading ?? service.title,
    intro: service.heroDescription ?? "",
    ctaLabel: service.heroButton?.label ?? null,
    ctaHref: service.heroButton?.url ?? null,
    image: getMediaUrl(service.heroImage),
    imageAlt: service.heroImage?.alternativeText || service.title,
  };
}

function buildFlowTrackFromSteps(
  tag: string,
  heading: string,
  steps: { label: string | null; title: string | null; description: string | null; image: import("../types/strapi").StrapiMedia | null }[]
): { tag: string; heading: string; slides: FlowTrackSlide[] } {
  return {
    tag,
    heading,
    slides: steps.map((step, i) => ({
      label: step.label ?? "",
      subheading: step.label ?? "",
      title: step.title ?? "",
      paragraphs: (step.description ?? "").split(/\n{2,}/).filter(Boolean),
      image: getMediaUrl(step.image) ?? FALLBACK_IMAGE,
      alt: step.title ?? "",
      nextLabel: steps[i + 1]?.title ?? undefined,
    })),
  };
}

export function buildServicesProcessView(page: ServicesPageData) {
  return buildFlowTrackFromSteps(page.process.tag?.label ?? "", page.process.heading ?? "", page.process.steps);
}

export function buildServiceProcessView(service: ServiceData) {
  return buildFlowTrackFromSteps(
    service.process.tag?.label ?? "",
    service.process.heading ?? "",
    service.process.steps
  );
}

export interface CategoryShowcaseViewData {
  tag: string;
  heading: string;
  intro: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  tabs: VerticalTabItem[];
}

export function buildCategoryShowcaseView(showcase: CategoryShowcase): CategoryShowcaseViewData {
  return {
    tag: showcase.tag?.label ?? "",
    heading: showcase.heading ?? "",
    intro: showcase.description ?? null,
    ctaLabel: showcase.button?.label ?? null,
    ctaHref: showcase.button?.url ?? null,
    tabs: showcase.tabs.map((tab) => ({
      label: tab.product?.title ?? "",
      image: getMediaUrl(tab.image) ?? getMediaUrl(tab.product?.cardImage) ?? FALLBACK_IMAGE,
      alt: tab.product?.title ?? "",
      body: tab.description ?? tab.product?.cardDescription ?? "",
      linkLabel: tab.product ? "Explore more" : null,
      linkHref: tab.product ? `/products/${tab.product.slug}` : null,
    })),
  };
}

export interface UspViewData {
  tag: string;
  heading: string;
  intro: string | null;
  icon: string | null;
  image: string | null;
  items: UspListItem[];
}

function buildUsp(usp: {
  tag: import("../types/strapi").StrapiTag | null;
  heading: string | null;
  description: string | null;
  image: import("../types/strapi").StrapiMedia | null;
  items: { icon: import("../types/strapi").StrapiMedia | null; title: string | null; description: string | null }[];
}): UspViewData {
  return {
    tag: usp.tag?.label ?? "",
    heading: usp.heading ?? "",
    intro: usp.description ?? null,
    icon: getMediaUrl(usp.items[0]?.icon) ?? FALLBACK_IMAGE,
    image: getMediaUrl(usp.image) ?? FALLBACK_IMAGE,
    items: usp.items.map((item) => ({ title: item.title ?? "", body: item.description ?? "" })),
  };
}

export const buildServicesUspView = (page: ServicesPageData) => buildUsp(page.usp);
export const buildServiceUspView = (service: ServiceData) => buildUsp(service.usp);

export function buildServiceListView(
  services: ServiceData[],
  settings: ServiceSettingData | null
): ServiceCardData[] {
  return services.map((s) => ({
    href: `/services/${s.slug}`,
    tag: settings?.cardTag?.label ?? "",
    title: s.title,
    body: s.cardDescription ?? "",
    ctaLabel: settings?.cardButtonLabel ?? "Get A Free Quote",
    image: getMediaUrl(s.cardImage) ?? FALLBACK_IMAGE,
    alt: s.title,
  }));
}

export function buildOtherServicesView(
  current: ServiceData,
  all: ServiceData[],
  settings: ServiceSettingData | null
): { tag: string; heading: string; intro: string | null; ctaLabel: string | null; ctaHref: string | null; cards: ServiceCardData[] } {
  const others = all.filter((s) => s.slug !== current.slug);
  return {
    tag: settings?.otherServicesTag?.label ?? "",
    heading: settings?.otherServicesHeading ?? "",
    intro: current.otherServicesSubtitle,
    ctaLabel: settings?.otherServicesButton?.label ?? null,
    ctaHref: settings?.otherServicesButton?.url ?? "/services",
    cards: others.map((s) => ({
      href: `/services/${s.slug}`,
      tag: settings?.cardTag?.label ?? "",
      title: s.title,
      body: s.cardDescription ?? "",
      ctaLabel: settings?.cardButtonLabel ?? "Get A Free Quote",
      image: getMediaUrl(s.cardImage) ?? FALLBACK_IMAGE,
      alt: s.title,
    })),
  };
}

function buildCaseCards(list: CaseStudy[]): CaseCard[] {
  return list.map((c) => ({
    title: c.title,
    body: c.description ?? "",
    href: `/case-studies/${c.slug}`,
    image: getMediaUrl(c.featureImage) ?? FALLBACK_IMAGE,
    alt: `${c.title} case study`,
  }));
}

export interface CaseStudiesSliderViewData {
  tag: string;
  headingLines: string[];
  ctaLabel: string;
  ctaHref: string;
  cards: CaseCard[];
}

export function buildServicesCaseStudiesView(page: ServicesPageData): CaseStudiesSliderViewData {
  const { caseStudies } = page;
  return {
    tag: caseStudies.tag?.label ?? "",
    headingLines: (caseStudies.title ?? "").split("\n").filter(Boolean),
    ctaLabel: caseStudies.ctaButton?.label ?? "See All Case Studies",
    ctaHref: caseStudies.ctaButton?.url ?? "/case-studies",
    cards: buildCaseCards(caseStudies.featuredCaseStudies),
  };
}

function buildResourceCards(list: Resource[]): ResourceCard[] {
  return list.map((r) => ({
    href: `/resources/${r.slug}`,
    image: getMediaUrl(r.featureImage) ?? FALLBACK_IMAGE,
    alt: r.title,
    category: null,
    title: r.title,
    excerpt: stripHtml(r.content),
    date: "",
    readTime: r.readingTime ?? "",
  }));
}

export interface ResourcesSectionViewData {
  tag: string;
  headingLines: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  cards: ResourceCard[];
}

export function buildServicesResourcesView(page: ServicesPageData): ResourcesSectionViewData {
  const { resources } = page;
  return {
    tag: resources.tag?.label ?? "",
    headingLines: [resources.title, resources.titleHighlight].filter((s): s is string => Boolean(s)),
    ctaLabel: resources.viewAllButton?.label ?? null,
    ctaHref: resources.viewAllButton?.url ?? "/resources",
    cards: buildResourceCards(resources.featuredResources),
  };
}

export function buildServiceSettingResourcesView(settings: ServiceSettingData | null): ResourcesSectionViewData {
  const resources = settings?.relatedResources;
  return {
    tag: resources?.tag?.label ?? "",
    headingLines: [resources?.title, resources?.titleHighlight].filter((s): s is string => Boolean(s)),
    ctaLabel: resources?.viewAllButton?.label ?? null,
    ctaHref: resources?.viewAllButton?.url ?? "/resources",
    cards: buildResourceCards(resources?.featuredResources ?? []),
  };
}

export interface CtaViewData {
  sectionClass: string;
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export function buildServicesCtaView(page: ServicesPageData): CtaViewData {
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

export function buildServiceSettingCtaView(settings: ServiceSettingData | null): CtaViewData {
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

export function buildServiceSimpleCardView(service: ServiceData): {
  tag: string;
  heading: string;
  intro: string;
  cards: SimpleCard[];
} {
  const { offerings } = service;
  return {
    tag: offerings.tag?.label ?? "",
    heading: offerings.heading ?? "",
    intro: offerings.description ?? "",
    cards: offerings.items.map((item) => ({
      icon: getMediaUrl(item.icon),
      title: item.title ?? "",
      body: item.description ?? "",
    })),
  };
}

export interface ServiceFaqViewData {
  tag: string;
  headingLines: string[];
  email: string | null;
  items: { question: string; answer: string }[];
}

export function buildServiceFaqView(service: ServiceData, settings: ServiceSettingData | null): ServiceFaqViewData {
  return {
    tag: settings?.faqTag?.label ?? "",
    headingLines: [settings?.faqHeading, settings?.faqHeadingHighlight].filter((s): s is string => Boolean(s)),
    email: settings?.faqContactEmail ?? null,
    items: service.faqItems.map((item) => ({
      question: item.question ?? "",
      answer: stripHtml(item.answer),
    })),
  };
}

export interface ServiceTestimonialsViewData {
  tag: string;
  heading: string;
  tabs: TestimonialTab[];
}

export function buildServiceTestimonialsView(
  settings: ServiceSettingData | null,
  allTestimonials: TestimonialModel[]
): ServiceTestimonialsViewData {
  const byProduct = new Map<number, TestimonialModel[]>();
  for (const t of allTestimonials) {
    if (!t.product) continue;
    if (!byProduct.has(t.product.id)) byProduct.set(t.product.id, []);
    byProduct.get(t.product.id)!.push(t);
  }
  return {
    tag: settings?.testimonialsTag?.label ?? "",
    heading: settings?.testimonialsHeading ?? "",
    tabs: (settings?.testimonialTabs ?? []).map((tab) => ({
      label: tab.label ?? "",
      items: (tab.product ? byProduct.get(tab.product.id) ?? [] : []).map((t) => ({
        image: null,
        alt: t.authorName,
        quote: t.quote ?? "",
        avatar: getMediaUrl(t.authorAvatar ?? t.image),
        name: t.authorName,
        role: t.authorRole ?? "",
      })),
    })),
  };
}
