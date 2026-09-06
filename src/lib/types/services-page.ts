import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";
import type { CaseStudy } from "./case-study";
import type { Resource } from "./resource";

export interface ServicesPageHero {
  title: string | null;
  description: string | null;
  rotatingWords: { id: number; text: string }[];
  image: StrapiMedia | null;
}

export interface ServicesPageProcessStep {
  id: number;
  label: string | null;
  title: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface ServicesPageProcess {
  tag: StrapiTag | null;
  heading: string | null;
  steps: ServicesPageProcessStep[];
}

// Chỉ khai phần "product" thật sự cần cho tab danh mục — không kéo theo toàn
// bộ Product (hero, usp, faqItems...), tránh phụ thuộc ngược sang Phase Products.
export interface CategoryShowcaseProduct {
  title: string;
  slug: string;
  cardDescription: string | null;
  cardImage: StrapiMedia | null;
}

export interface CategoryShowcaseTab {
  id: number;
  description: string | null;
  image: StrapiMedia | null;
  product: CategoryShowcaseProduct | null;
}

export interface CategoryShowcase {
  heading: string | null;
  description: string | null;
  tag: StrapiTag | null;
  button: StrapiButton | null;
  tabs: CategoryShowcaseTab[];
}

export interface ServicesPageUspItem {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface ServicesPageUsp {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
  items: ServicesPageUspItem[];
}

export interface ServicesPageCaseStudies {
  title: string | null;
  tag: StrapiTag | null;
  ctaButton: StrapiButton | null;
  featuredCaseStudies: CaseStudy[];
}

export interface FeaturedResourcesSection {
  title: string | null;
  titleHighlight: string | null;
  tag: StrapiTag | null;
  viewAllButton: StrapiButton | null;
  featuredResources: Resource[];
}

export interface CtaBanner {
  tag: StrapiTag | null;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  button: StrapiButton | null;
}

export interface ServicesPageData {
  seo: StrapiSeo | null;
  hero: ServicesPageHero;
  process: ServicesPageProcess;
  categoryShowcase: CategoryShowcase;
  usp: ServicesPageUsp;
  caseStudies: ServicesPageCaseStudies;
  resources: FeaturedResourcesSection;
  ctaBanner: CtaBanner;
}

export interface ServiceOfferingItem {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface ServiceOfferings {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  items: ServiceOfferingItem[];
}

export interface ServiceFaqItem {
  id: number;
  question: string | null;
  answer: string | null;
}

export interface ServiceData {
  id: number;
  title: string;
  slug: string;
  order: number | null;
  cardDescription: string | null;
  cardImage: StrapiMedia | null;
  heroHeading: string | null;
  heroDescription: string | null;
  heroButton: StrapiButton | null;
  heroImage: StrapiMedia | null;
  offerings: ServiceOfferings;
  process: ServicesPageProcess;
  usp: ServicesPageUsp;
  faqItems: ServiceFaqItem[];
  otherServicesSubtitle: string | null;
  seo: StrapiSeo | null;
}

export interface ServiceTestimonialTab {
  id: number;
  label: string | null;
  product: { id: number } | null;
}

export interface ServiceSettingData {
  cardTag: StrapiTag | null;
  cardButtonLabel: string | null;
  categoryShowcase: CategoryShowcase;
  testimonialsTag: StrapiTag | null;
  testimonialsHeading: string | null;
  testimonialTabs: ServiceTestimonialTab[];
  faqTag: StrapiTag | null;
  faqHeading: string | null;
  faqHeadingHighlight: string | null;
  faqContactText: string | null;
  faqContactEmail: string | null;
  relatedResources: FeaturedResourcesSection;
  otherServicesTag: StrapiTag | null;
  otherServicesHeading: string | null;
  otherServicesButton: StrapiButton | null;
  ctaBanner: CtaBanner;
}
