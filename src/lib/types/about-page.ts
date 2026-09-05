import type { StrapiButton, StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface AboutPageLogoItem {
  id: number;
  name: string | null;
  logo: StrapiMedia | null;
}

export interface AboutPageHero {
  heading: string | null;
  description: string | null;
  image: StrapiMedia | null;
}

export interface AboutPageTimelineItem {
  id: number;
  year: string | null;
  title: string | null;
  description: string | null;
}

export interface AboutPageTimeline {
  heading: string | null;
  tag: StrapiTag | null;
  shipImage: StrapiMedia | null;
  items: AboutPageTimelineItem[];
}

export interface AboutPageFounderQuote {
  quote: string | null;
  name: string | null;
  title: string | null;
  tag: StrapiTag | null;
  photo: StrapiMedia | null;
}

export interface AboutPageVisionMissionValues {
  heading: string | null;
  tag: StrapiTag | null;
  visionTitle: string | null;
  visionText: string | null;
  visionIcon: StrapiMedia | null;
  missionTitle: string | null;
  missionText: string | null;
  missionIcon: StrapiMedia | null;
  valuesTitle: string | null;
  valuesText: string | null;
  valuesIcon: StrapiMedia | null;
}

export interface AboutPageBenefitItem {
  id: number;
  title: string | null;
  description: string | null;
  icon: StrapiMedia | null;
}

export interface AboutPageBenefits {
  heading: string | null;
  intro: string | null;
  tag: StrapiTag | null;
  sideImage: StrapiMedia | null;
  items: AboutPageBenefitItem[];
}

export interface AboutPageTeam {
  heading: string | null;
  intro: string | null;
  tag: StrapiTag | null;
}

export interface AboutPageLocationItem {
  id: number;
  countryName: string | null;
  description: string | null;
  icon: StrapiMedia | null;
}

export interface AboutPageLocations {
  heading: string | null;
  items: AboutPageLocationItem[];
}

export interface AboutPageCaseStudies {
  title: string | null;
  tag: StrapiTag | null;
  ctaButton: StrapiButton | null;
}

export interface AboutPageBrandCultureTab {
  id: number;
  label: string | null;
  heading: string | null;
  description: string | null;
  tagline: string | null;
  image: StrapiMedia | null;
}

export interface AboutPageBrandCulture {
  heading: string | null;
  tag: StrapiTag | null;
  tabs: AboutPageBrandCultureTab[];
}

export interface AboutPageCtaBanner {
  heading: string | null;
  subheading: string | null;
  description: string | null;
  tag: StrapiTag | null;
  button: StrapiButton | null;
}

export interface AboutPageData {
  seo: StrapiSeo | null;
  hero: AboutPageHero;
  timeline: AboutPageTimeline;
  founderQuote: AboutPageFounderQuote;
  logoMarquee: { logos: AboutPageLogoItem[] };
  visionMissionValues: AboutPageVisionMissionValues;
  benefits: AboutPageBenefits;
  team: AboutPageTeam;
  locations: AboutPageLocations;
  caseStudies: AboutPageCaseStudies;
  brandCulture: AboutPageBrandCulture;
  ctaBanner: AboutPageCtaBanner;
}
