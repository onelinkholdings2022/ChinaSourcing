import type { StrapiMedia, StrapiSeo } from "./strapi";

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  publishedDate: string | null;
  featureImage: StrapiMedia | null;
  seo: StrapiSeo | null;
}
