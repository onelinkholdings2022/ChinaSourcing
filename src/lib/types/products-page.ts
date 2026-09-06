import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";
import type { CaseStudy } from "./case-study";

export interface ProductsPageHero {
  titlePrefix: string | null;
  title: string | null;
  subtitle: string | null;
  rotatingWords: { id: number; text: string }[];
  ctaButton: StrapiButton | null;
  image: StrapiMedia | null;
}

export interface ProductsPageList {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  cardButtonLabel: string | null;
}

export interface ProductsPagePartners {
  title: string | null;
  titleHighlight: string | null;
  tag: StrapiTag | null;
  ctaButton: StrapiButton | null;
}

export interface ProductsPageFaqItem {
  id: number;
  question: string | null;
  answer: string | null;
}

export interface ProductsPageFaq {
  title: string | null;
  titleHighlight: string | null;
  contactText: string | null;
  contactEmail: string | null;
  tag: StrapiTag | null;
  items: ProductsPageFaqItem[];
}

export interface ProductsPageCtaBanner {
  tag: StrapiTag | null;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  button: StrapiButton | null;
}

export interface CertificationLogo {
  id: number;
  name: string | null;
  logo: StrapiMedia | null;
}

export interface ProductsPageCertifications {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  logos: CertificationLogo[];
}

export interface ProductsPageCaseStudies {
  title: string | null;
  tag: StrapiTag | null;
  ctaButton: StrapiButton | null;
  featuredCaseStudies: CaseStudy[];
}

export interface ProductsPageData {
  seo: StrapiSeo | null;
  hero: ProductsPageHero;
  productList: ProductsPageList;
  partners: ProductsPagePartners;
  faq: ProductsPageFaq;
  ctaBanner: ProductsPageCtaBanner;
  certifications: ProductsPageCertifications;
  caseStudies: ProductsPageCaseStudies;
}

export interface ProductSourceItem {
  id: number;
  title: string | null;
  image: StrapiMedia | null;
}

export interface ProductUspItem {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface ProductFaqItem {
  id: number;
  question: string | null;
  answer: string | null;
}

export interface ProductData {
  id: number;
  title: string;
  slug: string;
  order: number | null;
  cardDescription: string | null;
  cardImage: StrapiMedia | null;
  heroDescription: string | null;
  heroButton: StrapiButton | null;
  heroImage: StrapiMedia | null;
  sourceTag: StrapiTag | null;
  sourceHeading: string | null;
  sourceDescription: string | null;
  sourceItems: ProductSourceItem[];
  testimonialsHeading: string | null;
  uspHeading: string | null;
  uspImage: StrapiMedia | null;
  usps: ProductUspItem[];
  faqItems: ProductFaqItem[];
  ctaBanner: ProductsPageCtaBanner | null;
  seo: StrapiSeo | null;
}

export interface ProductSettingData {
  faqHeading: string | null;
  faqHeadingHighlight: string | null;
  faqContactText: string | null;
  faqContactEmail: string | null;
  testimonialsTag: StrapiTag | null;
  testimonialsButton: StrapiButton | null;
  uspTag: StrapiTag | null;
  faqTag: StrapiTag | null;
  defaultUsps: ProductUspItem[];
}
