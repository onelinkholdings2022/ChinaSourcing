import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface StrapiSlideButton {
  id: number;
  defaultLabel: string | null;
  hoverLabel: string | null;
  url: string | null;
  variant?: string | null;
}

export interface HomepageHero {
  title: string | null;
  subtitle: string | null;
  videoUrl: string | null;
  rotatingWords: { id: number; text: string }[];
  ctaButton: StrapiSlideButton | null;
  posterImage: StrapiMedia | null;
}

export interface HomepageServiceCard {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
  linkLabel: string | null;
  linkUrl: string | null;
}

export interface HomepageServiceTab {
  id: number;
  label: string | null;
  cards: HomepageServiceCard[];
}

export interface HomepageSourcingServices {
  tag: StrapiTag | null;
  title: string | null;
  tabs: HomepageServiceTab[];
}

export interface HomepageFeature {
  id: number;
  icon: StrapiMedia | null;
  image: StrapiMedia | null;
  title: string | null;
  description: string | null;
  size: "large" | "small";
}

export interface HomepageWhyChooseUs {
  tag: StrapiTag | null;
  title: string | null;
  ctaButton: StrapiButton | null;
  features: HomepageFeature[];
}

export interface HomepageCaseStudies {
  tag: StrapiTag | null;
  title: string | null;
  ctaButton: StrapiButton | null;
}

export interface HomepagePartners {
  tag: StrapiTag | null;
  title: string | null;
  titleHighlight: string | null;
  ctaButton: StrapiButton | null;
}

export interface HomepageFeaturedResources {
  tag: StrapiTag | null;
  title: string | null;
  titleHighlight: string | null;
  viewAllButton: StrapiButton | null;
}

export interface HomepageMissionVideo {
  subtitle: string | null;
  titleSegments: { id: number; text: string; highlight: boolean }[];
  buttons: StrapiButton[];
}

export interface HomepageFaq {
  tag: StrapiTag | null;
  title: string | null;
  titleHighlight: string | null;
  contactText: string | null;
  contactEmail: string | null;
  items: { id: number; question: string; answer: string }[];
}

export interface HomepageData {
  seo: StrapiSeo | null;
  hero: HomepageHero;
  sourcingServices: HomepageSourcingServices;
  whyChooseUs: HomepageWhyChooseUs;
  caseStudies: HomepageCaseStudies;
  partners: HomepagePartners;
  featuredResources: HomepageFeaturedResources;
  missionVideo: HomepageMissionVideo;
  faq: HomepageFaq;
}
