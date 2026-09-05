import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface CaseStudiesPageHero {
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface CaseStudiesPageList {
  tag: StrapiTag | null;
  heading: string | null;
  pageSize: number;
}

export interface CaseStudiesPageUspItem {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface CaseStudiesPageUsp {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
  items: CaseStudiesPageUspItem[];
}

export interface CaseStudiesPageTestimonial {
  id: number;
  quote: string | null;
  authorName: string;
  authorRole: string | null;
  image: StrapiMedia | null;
  authorAvatar: StrapiMedia | null;
}

export interface CaseStudiesPageTestimonials {
  tag: StrapiTag | null;
  heading: string | null;
  testimonials: CaseStudiesPageTestimonial[];
}

export interface CaseStudiesPageCtaBanner {
  tag: StrapiTag | null;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  button: StrapiButton | null;
}

export interface CaseStudiesPageData {
  seo: StrapiSeo | null;
  hero: CaseStudiesPageHero;
  list: CaseStudiesPageList;
  usp: CaseStudiesPageUsp;
  testimonials: CaseStudiesPageTestimonials;
  ctaBanner: CaseStudiesPageCtaBanner;
}

export interface CaseStudySettingData {
  relatedCaseStudiesTag: StrapiTag | null;
  relatedCaseStudiesHeading: string | null;
  relatedCaseStudiesButton: StrapiButton | null;
  ctaBanner: CaseStudiesPageCtaBanner;
}
