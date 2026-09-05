import indexJson from "@/data/content/services-index.json";
import pagesJson from "@/data/content/service-pages.json";
import type { FlowTrackSlide } from "@/components/sections/FlowTrackTabs";
import type { VerticalTabItem } from "@/components/sections/VerticalTab";
import type { SimpleCard } from "@/components/sections/SimpleCardGrid";
import type { ResourceCard } from "@/components/sections/ResourceCards";
import type { ServiceCardData } from "@/components/sections/ServiceCards";
import type { TestimonialTab } from "@/components/sections/TabbedTestimonial";
import type { UspListItem } from "@/components/sections/UspList";

/**
 * `/services` and the four `/service/<slug>` pages.
 *
 * All four sub-pages render the same ten sections in the same order — checked
 * by comparing the class signature of each page's top-level `<section>` list,
 * which came back as one group of four:
 *
 *   relative | simple-card | vertical-tab | flow-track | usp-list |
 *   tabbed-testimonial | faq | resource-card | service-carousel | dark-cta
 *
 * As with the product pages the layout lives in ACF, which the WordPress REST
 * API does not expose, so the content was read out of the rendered HTML.
 *
 * Note the `flow-track` here is the Swiper variant, not the GSAP-pinned one —
 * every services page reports zero `.pin-spacer` elements at runtime.
 */

type Hero = {
  /** Empty on the sub-pages, which have no typewriter. */
  typedPrefix: string;
  typedWords: string[];
  heading: string;
  intro: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: string | null;
  imageAlt: string;
};

type Usp = {
  tag: string;
  heading: string;
  intro: string | null;
  icon: string | null;
  image: string | null;
  items: UspListItem[];
};

type Cta = {
  sectionClass: string;
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

type VerticalTabSection = {
  tag: string;
  heading: string;
  intro: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  tabs: VerticalTabItem[];
};

type FlowTrackSection = { tag: string; heading: string; slides: FlowTrackSlide[] };
type ResourceSection = {
  tag: string;
  headingLines: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  cards: ResourceCard[];
};

export type ServicesIndex = {
  hero: Hero;
  flowTrack: FlowTrackSection;
  serviceList: { cards: ServiceCardData[] };
  verticalTab: VerticalTabSection;
  usp: Usp;
  resources: ResourceSection;
  cta: Cta;
};

export type ServicePage = {
  hero: Hero;
  simpleCard: {
    tag: string;
    heading: string;
    intro: string;
    cards: SimpleCard[];
  };
  verticalTab: VerticalTabSection;
  flowTrack: FlowTrackSection;
  usp: Usp;
  testimonials: { tag: string; heading: string; tabs: TestimonialTab[] };
  faq: {
    tag: string;
    headingLines: string[];
    email: string | null;
    items: { question: string; answer: string }[];
  };
  resources: ResourceSection;
  carousel: {
    tag: string;
    heading: string;
    intro: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
    cards: ServiceCardData[];
  };
  cta: Cta;
};

export const servicesIndex = indexJson as ServicesIndex;
export const servicePages = pagesJson as Record<string, ServicePage>;
export const serviceSlugs = Object.keys(servicePages);

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages[slug];
}
