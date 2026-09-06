import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface ResourcesPageHero {
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface ResourcesPageFreeResources {
  tag: StrapiTag | null;
  heading: string | null;
}

export interface ResourcesPageInsights {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  pageSize: number;
}

export interface ResourcesPageDownloadCta {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  buttonLabel: string | null;
  file: StrapiMedia | null;
  image: StrapiMedia | null;
}

export interface ResourcesPageFaqItem {
  id: number;
  question: string | null;
  answer: string | null;
}

export interface ResourcesPageFaq {
  title: string | null;
  titleHighlight: string | null;
  contactText: string | null;
  contactEmail: string | null;
  tag: StrapiTag | null;
  items: ResourcesPageFaqItem[];
}

export interface ResourcesPageData {
  seo: StrapiSeo | null;
  hero: ResourcesPageHero;
  freeResources: ResourcesPageFreeResources;
  insights: ResourcesPageInsights;
  downloadCta: ResourcesPageDownloadCta;
  faq: ResourcesPageFaq;
}

export interface ResourceSettingLeadCapture {
  tag: StrapiTag | null;
  heading: string | null;
  subheading: string | null;
  placeholder: string | null;
  buttonLabel: string | null;
}

export interface ResourceSettingCtaBanner {
  tag: StrapiTag | null;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  button: StrapiButton | null;
}

export interface ResourceSettingData {
  relatedResourcesTag: StrapiTag | null;
  relatedResourcesHeading: string | null;
  relatedResourcesButton: StrapiButton | null;
  leadCapture: ResourceSettingLeadCapture;
  ctaBanner: ResourceSettingCtaBanner;
}
