import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface ProcessPageHero {
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface ProcessPageTimelineStep {
  id: number;
  label: string | null;
  title: string | null;
  description: string | null;
}

export interface ProcessPageTimeline {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  steps: ProcessPageTimelineStep[];
}

export interface ProcessPageUspItem {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface ProcessPageUsp {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
  items: ProcessPageUspItem[];
}

export interface ProcessPageFaqItem {
  id: number;
  question: string | null;
  answer: string | null;
}

export interface ProcessPageFaq {
  tag: StrapiTag | null;
  title: string | null;
  titleHighlight: string | null;
  contactText: string | null;
  contactEmail: string | null;
  items: ProcessPageFaqItem[];
}

export interface ProcessPageCtaBanner {
  tag: StrapiTag | null;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  button: StrapiButton | null;
}

export interface ProcessPageData {
  seo: StrapiSeo | null;
  hero: ProcessPageHero;
  timeline: ProcessPageTimeline;
  usp: ProcessPageUsp;
  faq: ProcessPageFaq;
  ctaBanner: ProcessPageCtaBanner;
}
