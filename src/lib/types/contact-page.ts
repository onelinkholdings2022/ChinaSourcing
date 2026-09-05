import type { StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface ContactPageHero {
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface ContactPageInfoItem {
  id: number;
  icon: StrapiMedia | null;
  label: string | null;
  value: string | null;
  href: string | null;
}

export interface ContactPageSocialLink {
  id: number;
  name: string | null;
  url: string | null;
  icon: StrapiMedia | null;
}

export interface ContactPageHubspotForm {
  portalId: string | null;
  formId: string | null;
  region: string | null;
}

export interface ContactPageGetInTouch {
  tag: StrapiTag | null;
  heading: string | null;
  description: string | null;
  infoItems: ContactPageInfoItem[];
  socialLabel: string | null;
  socialLinks: ContactPageSocialLink[];
  form: ContactPageHubspotForm | null;
}

export interface ContactPageProcessStep {
  id: number;
  label: string | null;
  title: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface ContactPageWhatHappensNext {
  tag: StrapiTag | null;
  heading: string | null;
  steps: ContactPageProcessStep[];
}

export interface ContactPageData {
  seo: StrapiSeo | null;
  hero: ContactPageHero;
  getInTouch: ContactPageGetInTouch;
  whatHappensNext: ContactPageWhatHappensNext;
}
