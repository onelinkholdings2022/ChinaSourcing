import type { StrapiMedia, StrapiSeo, StrapiTag } from "./strapi";

export interface CaseStudyHighlight {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface CaseStudy {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string | null;
  region: string | null;
  industry: string | null;
  service: string | null;
  featured: boolean;
  featureImage: StrapiMedia | null;
  whatWeDoTag: StrapiTag | null;
  whatWeDoDescription: string | null;
  highlights: CaseStudyHighlight[];
  challengeTag: StrapiTag | null;
  challengeContent: string | null;
  solutionTag: StrapiTag | null;
  solutionContent: string | null;
  seo: StrapiSeo | null;
}
